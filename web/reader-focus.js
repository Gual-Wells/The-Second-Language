import {headingWord} from './audio-plan.js?v=30';

export function sentenceElement(target){
 const article=target.closest('#article');if(!article)return null;
 return article.dataset.audioPart==='two'?target.closest('.example-pair p'):article.dataset.audioPart==='three'?target.closest('.story-sentence'):null;
}
export function readerFocus(target){
 if(target.closest('button,a,.mono,.story-translation'))return null;
 const sentence=sentenceElement(target);
 if(sentence)return{kind:'sentence',part:target.closest('#article').dataset.audioPart,text:sentence.textContent,sentenceNumber:[...target.closest('#article').querySelectorAll('.example-pair p,.story-sentence')].indexOf(sentence)+1,heading:sentence.closest('.word-entry')?.querySelector('.word-heading h1')?.textContent||''};
 const article=target.closest('#article'),heading=target.closest('h1,h2,h3');
 if(article?.dataset.audioPart!=='one'||!heading||!heading.closest('.word-entry'))return null;
 const original=heading.dataset.heading||heading.textContent;
 if(heading.tagName!=='H1'&&!/\/[^/]+\/\s*$/.test(original))return null;
 return{kind:'vocabulary',part:'one',word:headingWord(original),heading:original};
}
// Resolve the actual glyph under the finger, including text split by inline markup.
export function wordAtPoint(sentence,x,y){
 const pos=document.caretPositionFromPoint?.(x,y),caret=pos?{node:pos.offsetNode,offset:pos.offset}:null;
 const valid=caret?.node.nodeType===3&&sentence.contains(caret.node),fallback=!valid&&document.caretRangeFromPoint?.(x,y),hit=valid?caret:fallback&&{node:fallback.startContainer,offset:fallback.startOffset};
 if(!hit||hit.node.nodeType!==3||!sentence.contains(hit.node))return null;
 const walker=document.createTreeWalker(sentence,NodeFilter.SHOW_TEXT),nodes=[];let node,offset=0,index=-1;
 while((node=walker.nextNode())){nodes.push({node,start:offset,end:offset+node.length});if(node===hit.node)index=offset+hit.offset;offset+=node.length;}
 const text=sentence.textContent,tokens=[...text.matchAll(/[A-Za-z]+(?:['’\-][A-Za-z]+)*/g)];
 for(const token of tokens){const start=token.index,end=start+token[0].length;if(index<start||index>end)continue;
  const a=nodes.find(n=>n.start<=start&&n.end>start),b=nodes.find(n=>n.start<end&&n.end>=end);if(!a||!b)continue;
  const range=document.createRange();range.setStart(a.node,start-a.start);range.setEnd(b.node,end-b.start);
  if(![...range.getClientRects()].some(r=>x>=r.left-2&&x<=r.right+2&&y>=r.top-2&&y<=r.bottom+2))continue;
  return{word:token[0],occurrence:tokens.filter(t=>t.index<=start&&t[0].toLowerCase()===token[0].toLowerCase()).length};
 }
 return null;
}
export function focusQuestion(focus){
 if(focus.kind==='vocabulary')return`请详细解析本章第一部分的词汇「${focus.word}」（标题：${focus.heading}）。结合本章全文，说明各义项、使用场景与标签、词性词形、词族、搭配和易混淆点，并联系第二部分例句与第三部分实际用法讲解。`;
 const position=`本章第${focus.part==='two'?'二':'三'}部分第 ${focus.sentenceNumber} 句${focus.heading?`，词条「${focus.heading}」下`:''}`;
 if(focus.word)return`请详细解析${position}这句中第 ${focus.occurrence} 处「${focus.word}」的全部实际用法：\n${focus.text}\n结合本章全文和上下文，解释该处词义、词形与语法作用、参与的搭配或短语、句法关系、语气及易混淆处。覆盖句中实际使用的相关用法，不把未使用的义项冒充本句用法。`;
 return`请详细解析${position}的这句：\n${focus.text}\n结合本章全文和上下文，先说明整体意思，再解释句子结构、语法、重要词汇和搭配、指代、语气及译文中的难点。`;
}

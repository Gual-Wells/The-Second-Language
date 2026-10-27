import {validateAnnotatedContent} from '../../web/annotations.js';

// Copy selected, already-published learning objects. This is deterministic
// extraction, not a model rewriting or a second content-production authority.
export function buildContextReview(selections){
 const records=selections.map(({chapter,word},i)=>{
  const parsed=validateAnnotatedContent(chapter.markdown);
  if(parsed.format!=='usage-context-v1')throw Error('单正文复习不能混入旧三部分；请按格式分开建立复习页');
  const heads=[...chapter.markdown.matchAll(/^<!-- WORD:([^ ]+) -->\s*\n# ([^\n]+)$/gm)],at=heads.findIndex(h=>h[2].trim()===word);
  if(at<0)throw Error('来源缺少复习词条：'+word);
  return{chapter,parsed,oldWordId:heads[at][1],newWordId:'W'+String(i+1).padStart(3,'0'),block:chapter.markdown.slice(heads[at].index,heads[at+1]?.index??chapter.markdown.length).trim()};
 });
 const useMap=new Map(),contextMap=new Map(),seen=new Set();let sentence=0;
 const key=(r,id)=>JSON.stringify([r.chapter.digest,id]);
 for(const r of records){let n=0;for(const [id,u] of r.parsed.uses)if(u.wordId===r.oldWordId)useMap.set(key(r,id),'U'+r.newWordId.slice(1)+'_'+String(++n).padStart(3,'0'));}
 function context(r,id,localRefs){
  const c=r.parsed.contexts.find(c=>c.id===id);if(!c)throw Error('复习语境引用缺失');
  const k=key(r,id);if(!contextMap.has(k))contextMap.set(k,'C'+String(contextMap.size+1).padStart(3,'0'));
  const newId=contextMap.get(k),refs=c.refs.filter(u=>useMap.has(key(r,u))).map(u=>useMap.get(key(r,u))),local=localRefs.filter(u=>useMap.has(key(r,u))).map(u=>useMap.get(key(r,u)));
  if(seen.has(k))return `<!-- CONTEXT_REF:${newId} USE:${local.join(',')} -->`;
  seen.add(k);const speakers={},paragraphs=c.paragraphs.map(p=>p.map(s=>{
   const id='S'+String(++sentence).padStart(4,'0'),refs=s.refs.filter(u=>useMap.has(key(r,u))).map(u=>useMap.get(key(r,u)));
   if(s.speaker)speakers[id]=s.speaker;
   return `<!-- SENTENCE:${id}${refs.length?' USE:'+refs.join(','):''} -->\n${s.text}`;
  }).join('\n')).join('\n\n');
  const meta={title:c.title,sourceUrls:c.sourceUrls,displayContext:c.displayContext,...(Object.keys(speakers).length?{speakers}:{})};
  return `<!-- CONTEXT:${newId} USE:${refs.join(',')} KIND:${c.kind} -->\n<!-- CONTEXT_META:${JSON.stringify(meta)} -->\n${paragraphs}\n<!-- TRANSLATION:${newId} -->\n${c.translation}\n<!-- END_CONTEXT:${newId} -->`;
 }
 const blocks=records.map(r=>r.block
  .replace(/<!-- CONTEXT:([A-Za-z][A-Za-z0-9_-]{0,31}) USE:([^ ]+) KIND:(?:abridgment|excerpt|example) -->[^]*?<!-- END_CONTEXT:\1 -->|<!-- CONTEXT_REF:([A-Za-z][A-Za-z0-9_-]{0,31}) USE:([^ ]+) -->/g,(_,id,refs,refId,refUses)=>context(r,id||refId,(refs||refUses).split(',')))
  .replace(`<!-- WORD:${r.oldWordId} -->`,`<!-- WORD:${r.newWordId} -->`)
  .replace(/<!-- USE:([^ ]+) -->/g,(_,id)=>`<!-- USE:${useMap.get(key(r,id))} -->`));
 const markdown='<!-- FORMAT:usage-context-v1 -->\n\n'+blocks.join('\n\n')+'\n';
 validateAnnotatedContent(markdown,{maxWordCount:40});return markdown;
}

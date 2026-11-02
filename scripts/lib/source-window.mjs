// Exact character windows into an existing validated original. Retrieval bounds
// are transport only: they never declare sufficient reading or semantic fit.
export function sourceWindows(text,{literal,from=0,limit=40,start,end}={}){
 if(typeof text!=='string')throw Error('原文须为完整字符串');
 const integer=n=>Number.isSafeInteger(n)&&n>=0;
 if(literal!==undefined){
  if(typeof literal!=='string'||!literal.length||literal.length>300||!integer(from)||from>text.length||!Number.isSafeInteger(limit)||limit<1||limit>200)throw Error('查询文字或检索分页无效');
  const escaped=literal.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),pattern=new RegExp(escaped,'giu'),matches=[];pattern.lastIndex=from;let match,nextFrom=null;
  while((match=pattern.exec(text))){if(matches.length===limit){nextFrom=match.index;break;}matches.push({start:match.index,end:match.index+match[0].length,surface:match[0]});}
  return {kind:'literal-locations',literal,totalChars:text.length,searchRange:{start:from,end:text.length},offsetUnit:'UTF-16 code units',matches,nextFrom,notice:'Only positions in the declared search range, not surrounding context or sense judgements. Read the relevant window and expand when needed.'};
 }
 if(!integer(start)||!integer(end)||end<=start||end>text.length)throw Error('原文范围须为有效start/end，不静默截断');
 if(end-start>16000)throw Error('单次原文窗口超过16000字符；分段读取，不以输出来代替整篇已读声明');
 return {kind:'original-window',totalChars:text.length,offsetUnit:'UTF-16 code units',start,end,text:text.slice(start,end),wholeDocumentProvided:start===0&&end===text.length,notice:'Only this exact original window was supplied. Expand or read other sections when required; the full original remains unchanged.'};
}

// Render model prose without accepting HTML, scripts or remote resources.
export function prose(target, text) {
  target.replaceChildren();
  const inline=(element,value)=>{
    for(const part of String(value).split(/(\*\*[^*]+\*\*|`[^`]+`)/g)){
      const tag=part.startsWith('**')?'strong':part.startsWith('`')?'code':null;
      if(tag){const child=document.createElement(tag);child.textContent=part.slice(tag==='strong'?2:1,tag==='strong'?-2:-1);element.append(child);}
      else element.append(document.createTextNode(part));
    }
  };
  let paragraph=[],list=null;
  const flush=()=>{if(paragraph.length){const p=document.createElement('p');inline(p,paragraph.join('\n'));target.append(p);paragraph=[];}list=null;};
  for(const line of String(text||'').split('\n')){
    if(!line.trim()){flush();continue;}
    const heading=line.match(/^#{1,6}\s+(.+)$/),item=line.match(/^(?:[-*]|\d+\.)\s+(.+)$/);
    if(heading){flush();const h=document.createElement('h3');inline(h,heading[1]);target.append(h);}
    else if(item){if(paragraph.length)flush();if(!list){list=document.createElement(/^\d/.test(line)?'ol':'ul');target.append(list);}const li=document.createElement('li');inline(li,item[1]);list.append(li);}
    else if(line.startsWith('> ')){flush();const q=document.createElement('blockquote');inline(q,line.slice(2));target.append(q);}
    else {if(list)flush();paragraph.push(line);}
  }
  flush();
}
export function describe(value) {
  if(value==null)return '';
  if(typeof value!=='object')return String(value);
  if(Array.isArray(value))return value.map(describe).filter(Boolean).join('\n');
  const labels={fluency:'流利与连贯',fluencyAndCoherence:'流利与连贯',lexicalResource:'词汇',grammar:'语法',grammaticalRangeAndAccuracy:'语法',pronunciation:'发音',observation:'观察',evidence:'依据',guidance:'建议',recommendation:'建议',available:'可评估',score:'参考分',confidence:'可信度',limitations:'局限',nextStep:'下一步'};
  return Object.entries(value).map(([key,item])=>`${labels[key]||key}：${item===false?'材料不足':describe(item)}`).join('\n');
}

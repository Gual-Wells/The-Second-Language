export const chapterTestPolicy='chapter-understanding-v1';
export const chapterTestSize=20;
const object=(properties,required=Object.keys(properties))=>({type:'object',properties,required,additionalProperties:false});
const text={type:'string'};
export const chapterTestSchema=object({items:{type:'array',items:object({wordId:text,type:{type:'string',enum:['single','multi']},prompt:text,options:{type:'array',items:object({id:text,text,reason:text})},correct:{type:'array',items:text},quote:text,explanation:text})}});
export function sourceWords(markdown){
 const words=new Map();let part='',id='';for(const line of markdown.split('\n')){const p=line.match(/^<!-- PART:(one|two|three) -->/);if(p){part=p[1];continue;}if(part!=='one')continue;const w=line.match(/^<!-- WORD:([^ ]+) -->/);if(w){id=w[1];if(!words.has(id))words.set(id,'');continue;}if(id)words.set(id,words.get(id)+line+'\n');}return words;
}
export async function chapterTestTargets(markdown,seed){
 const words=[...sourceWords(markdown).keys()];if(words.length<chapterTestSize)throw Error('本章可核对的主词不足二十个');
 let round=0,bytes=[],cursor=0;async function number(limit){const boundary=Math.floor(256/limit)*limit;for(;;){if(cursor>=bytes.length){bytes=[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(seed+':'+round++)))];cursor=0;}const n=bytes[cursor++];if(n<boundary)return n%limit;}}
 // Formal chapters have forty words. Guard the one-byte rejection sampler.
 if(words.length>256)throw Error('章节主词索引异常');
 for(let i=words.length-1;i>0;i--){const j=await number(i+1);[words[i],words[j]]=[words[j],words[i]];}
 const targets=[];for(const wordId of words.slice(0,chapterTestSize))targets.push({wordId,type:(await number(2))?'multi':'single'});
 if(targets.every(t=>t.type===targets[0].type))targets.at(-1).type=targets[0].type==='single'?'multi':'single';return targets;
}
export function validateChapterPaper(paper,markdown,targets){
 if(!paper||!Array.isArray(paper.items)||paper.items.length!==chapterTestSize)throw Error('试卷必须有二十道理解题');
 const words=sourceWords(markdown),nonempty=(s,n)=>typeof s==='string'&&s.trim().length>=n&&s.length<=4000;
 const items=paper.items.map((q,i)=>{
  if(!q||q.wordId!==targets[i].wordId||q.type!==targets[i].type||!nonempty(q.prompt,12)||!nonempty(q.explanation,20)||!nonempty(q.quote,2)||!words.get(q.wordId)?.includes(q.quote))throw Error('题目目标或原文依据无效');
  if(!Array.isArray(q.options)||q.options.length!==4||q.options.some((o,j)=>!o||o.id!=='ABCD'[j]||!nonempty(o.text,1)||!nonempty(o.reason,6))||new Set(q.options.map(o=>o.text.trim().toLowerCase())).size!==4)throw Error('选项与干扰项依据无效');
  if(!Array.isArray(q.correct)||new Set(q.correct).size!==q.correct.length||q.correct.some(k=>!['A','B','C','D'].includes(k))||q.type==='single'&&q.correct.length!==1||q.type==='multi'&&![2,3].includes(q.correct.length))throw Error('答案键无效');
  return{...q,id:'q'+(i+1)};
 });if(JSON.stringify(items).length>80000)throw Error('试卷过大');return{policy:chapterTestPolicy,items};
}
export function gradeChapterPaper(paper,answers){
 if(!answers||typeof answers!=='object'||Array.isArray(answers)||Object.keys(answers).length!==paper.items.length)throw Error('请完成全部题目');
 const details=paper.items.map(q=>{const value=answers[q.id];if(q.type==='single'?typeof value!=='string'||!q.options.some(o=>o.id===value):!Array.isArray(value)||!value.length||new Set(value).size!==value.length||value.some(v=>!q.options.some(o=>o.id===v)))throw Error('请完成全部题目');const correct=q.type==='single'?value===q.correct[0]:JSON.stringify([...value].sort())===JSON.stringify([...q.correct].sort());return{id:q.id,ok:correct,answer:value,correct:q.correct,explanation:q.explanation,quote:q.quote,wordId:q.wordId,options:q.options};});
 const right=details.filter(d=>d.ok).length;return{score:right/paper.items.length*100,right,total:paper.items.length,passed:right===paper.items.length,details,certification:null,coin:null};
}

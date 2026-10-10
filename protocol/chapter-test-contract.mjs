export const legacyChapterTestPolicy='chapter-understanding-v1';
export const chapterTestPolicy='chapter-understanding-v2-oral7';
export const chapterTestSize=20;
export const chapterOralSize=7;
const object=(properties,required=Object.keys(properties))=>({type:'object',properties,required,additionalProperties:false});
const text={type:'string'};
export const chapterTestSchema=object({items:{type:'array',items:object({wordId:text,type:{type:'string',enum:['single','multi','oral']},prompt:text,options:{type:'array',items:object({id:text,text,reason:text})},correct:{type:'array',items:text},quote:text,explanation:text})}});
export const chapterAnswerSchema=object({items:{type:'array',items:object({id:text,state:{type:'string',enum:['resolved','uncertain']},choice:{type:'string',enum:['A','B','C','D','none','']},transcript:text,evidence:text,reason:text})}});
export function sourceWords(markdown){
 const words=new Map();let part='',id='';for(const line of markdown.split('\n')){const p=line.match(/^<!-- PART:(one|two|three) -->/);if(p){part=p[1];continue;}if(part!=='one')continue;const w=line.match(/^<!-- WORD:([^ ]+) -->/);if(w){id=w[1];if(!words.has(id))words.set(id,'');continue;}if(id)words.set(id,words.get(id)+line+'\n');}return words;
}
export async function chapterTestTargets(markdown,seed,policy=chapterTestPolicy){
 const words=[...sourceWords(markdown).keys()];if(words.length<chapterTestSize)throw Error('本章可核对的主词不足二十个');
 let round=0,bytes=[],cursor=0;async function number(limit){const boundary=Math.floor(256/limit)*limit;for(;;){if(cursor>=bytes.length){bytes=[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(seed+':'+round++)))];cursor=0;}const n=bytes[cursor++];if(n<boundary)return n%limit;}}
 // Formal chapters have forty words. Guard the one-byte rejection sampler.
 if(words.length>256)throw Error('章节主词索引异常');
 for(let i=words.length-1;i>0;i--){const j=await number(i+1);[words[i],words[j]]=[words[j],words[i]];}
 const targets=[];for(const wordId of words.slice(0,chapterTestSize))targets.push({wordId,type:(await number(2))?'multi':'single'});
 if(targets.every(t=>t.type===targets[0].type))targets.at(-1).type=targets[0].type==='single'?'multi':'single';
 if(policy===chapterTestPolicy){const positions=Array.from({length:20},(_,i)=>i);for(let i=19;i>0;i--){const j=await number(i+1);[positions[i],positions[j]]=[positions[j],positions[i]];}for(const i of positions.slice(0,chapterOralSize))targets[i].type='oral';}
 return targets;
}
export function validateChapterPaper(paper,markdown,targets,policy=chapterTestPolicy){
 if(!paper||!Array.isArray(paper.items)||paper.items.length!==chapterTestSize)throw Error('试卷必须有二十道理解题');
 const words=sourceWords(markdown),nonempty=(s,n)=>typeof s==='string'&&s.trim().length>=n&&s.length<=4000;
 const items=paper.items.map((q,i)=>{
  if(!q||q.wordId!==targets[i].wordId||q.type!==targets[i].type||!nonempty(q.prompt,12)||!nonempty(q.explanation,20)||!nonempty(q.quote,2)||!words.get(q.wordId)?.includes(q.quote))throw Error('题目目标或原文依据无效');
  if(q.type==='oral'&&(q.prompt.length>650||/[\u3400-\u9fff]/.test(q.prompt)))throw Error('听说题须使用简短英文题干');
  if(!Array.isArray(q.options)||q.options.length!==4||q.options.some((o,j)=>!o||o.id!=='ABCD'[j]||!nonempty(o.text,1)||!nonempty(o.reason,6))||new Set(q.options.map(o=>o.text.trim().toLowerCase())).size!==4)throw Error('选项与干扰项依据无效');
  if(!Array.isArray(q.correct)||new Set(q.correct).size!==q.correct.length||q.correct.some(k=>!['A','B','C','D'].includes(k))||['single','oral'].includes(q.type)&&q.correct.length!==1||q.type==='multi'&&![2,3].includes(q.correct.length))throw Error('答案键无效');
  return{...q,id:'q'+(i+1)};
 });if(JSON.stringify(items).length>80000)throw Error('试卷过大');if(policy===chapterTestPolicy&&items.filter(q=>q.type==='oral').length!==chapterOralSize)throw Error('试卷必须有七道听说题');return{policy,items};
}
export function validateChapterAnswers(paper,answers){
 if(!answers||typeof answers!=='object'||Array.isArray(answers)||Object.keys(answers).length!==paper.items.length)throw Error('请完成全部题目');
 return Object.fromEntries(paper.items.map(q=>{const v=answers[q.id];if(q.type==='oral'?!/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/.test(v||''):q.type==='single'?typeof v!=='string'||!q.options.some(o=>o.id===v):!Array.isArray(v)||!v.length||new Set(v).size!==v.length||v.some(x=>!q.options.some(o=>o.id===x)))throw Error('请完成全部题目');return[q.id,Array.isArray(v)?[...v].sort():v];}));
}
export function validateChapterInterpretations(paper,review){
 const oral=paper.items.filter(q=>q.type==='oral');if(!review||!Array.isArray(review.items)||review.items.length!==oral.length)throw Error('口头答案核对不完整');
 return oral.map(q=>{const matches=review.items.filter(x=>x?.id===q.id);if(matches.length!==1)throw Error('口头答案编号不一致');const x=matches[0];if(!['resolved','uncertain'].includes(x.state)||typeof x.transcript!=='string'||x.transcript.length>5000||typeof x.reason!=='string'||!x.reason.trim()||x.reason.length>1500||typeof x.evidence!=='string'||x.evidence.length>5000)throw Error('口头答案证据无效');if(x.state==='uncertain'?x.choice!=='':!['A','B','C','D','none'].includes(x.choice)||!x.transcript.trim()||!x.evidence.trim()||!x.transcript.includes(x.evidence))throw Error('口头答案证据无效');return{id:q.id,state:x.state,choice:x.choice,transcript:x.transcript,evidence:x.evidence,reason:x.reason};});
}
export function gradeChapterPaper(paper,answers,interpretations=[]){
 validateChapterAnswers(paper,answers);
 const details=paper.items.map(q=>{const value=answers[q.id],oral=interpretations.find(x=>x.id===q.id);if(q.type==='oral'&&oral?.state!=='resolved')throw Error('口头答案尚需核对');const choice=q.type==='oral'?oral.choice:value,correct=q.type==='multi'?JSON.stringify([...value].sort())===JSON.stringify([...q.correct].sort()):choice===q.correct[0];return{id:q.id,ok:correct,answer:value,correct:q.correct,explanation:q.explanation,quote:q.quote,wordId:q.wordId,options:q.options,...(q.type==='oral'?{prompt:q.prompt,oral}: {})};});
 const right=details.filter(d=>d.ok).length;return{score:right/paper.items.length*100,right,total:paper.items.length,passed:right===paper.items.length,details,certification:null,coin:null};
}

import {listeningFamilies,readingFamilies} from '../../web/exam-spec.js';
export const safe=x=>typeof x==='string'&&/^[A-Za-z0-9._:-]{1,110}$/.test(x);
export const text=(x,max)=>typeof x==='string'&&x.trim().length>0&&x.length<=max;
export function visibleVisual(v){
 if(v==null)return null;
 if(!text(v.title,300)||![v.width,v.height].every(Number.isFinite)||v.width<200||v.width>1200||v.height<150||v.height>1200||!Array.isArray(v.areas)||!v.areas.length||v.areas.length>40||v.areas.some(a=>!safe(a.id)||!text(a.label,100)||![a.x,a.y,a.width,a.height].every(Number.isFinite)||a.x<0||a.y<0||a.width<1||a.height<1||a.x+a.width>v.width||a.y+a.height>v.height)||new Set(v.areas.map(a=>a.id)).size!==v.areas.length||!Array.isArray(v.routes)||v.routes.some(r=>!Array.isArray(r.points)||r.points.length<2||r.points.length>100||r.points.some(pt=>!Array.isArray(pt)||pt.length!==2||!pt.every(Number.isFinite)||pt[0]<0||pt[0]>v.width||pt[1]<0||pt[1]>v.height)))throw Error('图示须有可核对的位置及明确标签');
 return{title:v.title,width:v.width,height:v.height,areas:v.areas.map(({id,label,x,y,width,height})=>({id,label,x,y,width,height})),routes:v.routes.map(r=>({points:r.points}))};
}
export function publicObjective(q){
 const stimulus=q.stimulus;if(stimulus&&(typeof stimulus!=='object'||!text(stimulus.text,6000)))throw Error('题组须有可见的完整题面材料');
 if(stimulus?.headers&&(!Array.isArray(stimulus.headers)||stimulus.headers.length<2||stimulus.headers.some(x=>!text(x,300))||!Array.isArray(stimulus.rows)||!stimulus.rows.length||stimulus.rows.length>30||stimulus.rows.some(r=>!Array.isArray(r)||r.length!==stimulus.headers.length||r.some(x=>typeof x!=='string'||x.length>500))))throw Error('表格题面结构无效');
 if(stimulus?.steps&&(!Array.isArray(stimulus.steps)||!stimulus.steps.length||stimulus.steps.length>30||stimulus.steps.some(x=>!text(x,1000))))throw Error('流程图步骤无效');
 return{id:q.id,number:q.number,type:q.type,prompt:q.prompt,...(q.family?{family:q.family}:{}),...(q.groupId?{groupId:q.groupId}:{}),...(q.instructions?{instructions:q.instructions}:{}),...(stimulus?{stimulus:{text:stimulus.text,...(stimulus.headers?{headers:stimulus.headers,rows:stimulus.rows}:{}),...(stimulus.steps?{steps:stimulus.steps}:{})}}:{}),...(q.type==='gap'?{maxWords:q.maxWords,allowNumber:q.allowNumber===true,numberOnly:q.numberOnly===true}:{options:q.options.map(o=>({id:o.id,text:o.text}))}),...(q.type==='multi'?{answerCount:q.answerCount}:{})};
}
export function validateCoverage(passages,kind,profile){
 const catalog=kind==='listening'?listeningFamilies:readingFamilies,questions=passages.flatMap(p=>p.questions),seen=new Set();
 for(const q of questions){
  if(!catalog.includes(q.family))throw Error(`${kind} 题型须使用完整题型目录`);seen.add(q.family);
  const types=q.family==='multiple-choice'?['single','multi']:q.family.startsWith('matching')?['matching']:q.family.startsWith('identifying')?['single']:q.family.endsWith('labelling')?['diagram','gap']:['gap','single'];
  if(!types.includes(q.type))throw Error('题型名称与实际作答形态不对应');
  if(!safe(q.groupId)||!text(q.instructions,2000)||!['lower','standard','above'].includes(q.difficulty)||!text(q.difficultyReason,2000))throw Error('每题须有题组、作答说明及内部难度依据');
  if(profile==='mini'&&!['standard','above'].includes(q.difficulty))throw Error('微缩版不收录平均以下难度题');
  if(q.family.startsWith('identifying')){const expected=q.family==='identifying-information'?['TRUE','FALSE','NOT_GIVEN']:['YES','NO','NOT_GIVEN'];if(q.options.length!==3||!expected.every(x=>q.options.some(o=>o.id===x)))throw Error('判断题需正确区分事实与作者观点及 Not Given');}
  if(/^(form|note|table|flowchart|summary)-completion$/.test(q.family)&&!q.stimulus)throw Error('填空题型须给出完整表单、笔记、表格、流程或摘要材料');
  if(q.family==='table-completion'&&!q.stimulus.headers)throw Error('表格填空须使用真实可见表格');
  if(q.family==='flowchart-completion'&&!q.stimulus.steps)throw Error('流程图填空须使用可见流程步骤');
 }
 if(profile==='mini'&&catalog.some(f=>!seen.has(f)))throw Error('微缩版必须覆盖完整题型目录，不能只减少题型');
 for(const p of passages)if(p.questions.some(q=>q.family?.endsWith('labelling'))&&!p.visual)throw Error('标注题须附可见图示');
}

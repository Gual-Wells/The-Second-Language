import {bank,chapter} from './certification-bank.js';
const json=(data,status=200)=>Response.json(data,{status,headers:{'cache-control':'no-store'}});
const uuid=v=>typeof v==='string'&&/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/.test(v);
const normalize=v=>String(v).normalize('NFKC').trim().toLowerCase().replace(/[.!。！]$/,'');
const canonical=answers=>JSON.stringify(Object.fromEntries(Object.entries(answers).sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>[k,Array.isArray(v)?[...v].sort():v.trim()])));
function shuffle(list){const a=[...list];for(let i=a.length-1;i>0;i--){let n;const limit=Math.floor(0x100000000/(i+1))*(i+1);do{n=crypto.getRandomValues(new Uint32Array(1))[0];}while(n>=limit);const j=n%(i+1);[a[i],a[j]]=[a[j],a[i]];}return a;}
export function createPaper(){
 const seed=[...crypto.getRandomValues(new Uint8Array(24))].map(x=>x.toString(16).padStart(2,'0')).join('');
 const groups=[...new Set(bank.map(q=>q.target))];let selected;
 // Every independent draw has 8 distinct targets and all three testable formats.
 for(let i=0;i<100;i++){selected=shuffle(groups).slice(0,8).map(target=>shuffle(bank.filter(q=>q.target===target))[0]);if(new Set(selected.map(q=>q.type)).size===3)break;}
 if(new Set(selected.map(q=>q.type)).size!==3)throw Error('题型抽样未完成');
 const items=shuffle(selected).map(q=>{const options=q.options?shuffle(q.options):null;return {...q,id:crypto.randomUUID(),sourceId:q.id,...(options?{options:options.map((o,i)=>({id:String.fromCharCode(65+i),text:o.text})),correct:options.map((o,i)=>q.correct.includes(o.id)?String.fromCharCode(65+i):null).filter(Boolean)}:{})};});
 return {seed,items};
}
const publicPaper=row=>{const stored=JSON.parse(row.paper_json);return {id:row.id,chapter:stored.chapter,createdAt:row.created_at,submittedAt:row.submitted_at,items:stored.items.map(({id,type,prompt,options,correct})=>({id,type,prompt,...(options?{options}:{}),...(type==='multi'?{choose:correct.length}:{})})),...(row.result_json?{result:JSON.parse(row.result_json)}:{})};};
async function body(request){const raw=await request.text();if(raw.length>16000)throw new TypeError('提交过大');try{const value=JSON.parse(raw);if(!value||typeof value!=='object'||Array.isArray(value))throw Error();return value;}catch{throw new TypeError('提交格式无效');}}
export async function certificationLabRoute(request,env,{isPublisher,session,sameOrigin}){
 try{return await route(request,env,{isPublisher,session,sameOrigin});}catch(error){if(error instanceof TypeError)return json({error:error.message},400);throw error;}
}
async function route(request,env,{isPublisher,session,sameOrigin}){
 const db=env.CERTIFICATION_LAB_DB,url=new URL(request.url),path=url.pathname.replace('/api/certification-lab','');
 if(!isPublisher&&!session)return json({error:'请先在第二语言登录'},401);
 if(request.method!=='GET'&&!isPublisher&&!sameOrigin)return json({error:'请从测试页提交'},403);
 if(!db)return json({error:'实验尚未开放'},503);
 if(path===''&&request.method==='GET'){
  const {results}=await db.prepare('SELECT id,created_at,submitted_at,result_json FROM lab_attempts ORDER BY created_at DESC LIMIT 30').all();
  const certificate=await db.prepare('SELECT * FROM lab_certificates WHERE chapter_id=?').bind(chapter.id).first();
  return json({chapter,attempts:results.map(r=>({id:r.id,createdAt:r.created_at,submittedAt:r.submitted_at,score:r.result_json?JSON.parse(r.result_json).score:null})),certificate:certificate?{...certificate,preview:true}:null});
 }
 if(path==='/attempts'&&request.method==='POST'){
  const b=await body(request);if(!uuid(b.id))return json({error:'申请编号无效'},400);
  let row=await db.prepare('SELECT * FROM lab_attempts WHERE id=?').bind(b.id).first();
  if(!row){const paper=createPaper();await db.prepare('INSERT OR IGNORE INTO lab_attempts(id,chapter_id,seed,paper_json,created_at) VALUES(?,?,?,?,?)').bind(b.id,chapter.id,paper.seed,JSON.stringify({chapter,items:paper.items}),Date.now()).run();row=await db.prepare('SELECT * FROM lab_attempts WHERE id=?').bind(b.id).first();}
  return json(publicPaper(row));
 }
 const match=path.match(/^\/attempts\/([a-f0-9-]+)(\/submit)?$/);
 if(match){
  const row=await db.prepare('SELECT * FROM lab_attempts WHERE id=?').bind(match[1]).first();if(!row)return json({error:'测试不存在'},404);
  if(request.method==='GET'&&!match[2])return json(publicPaper(row));
  if(request.method==='POST'&&match[2]){
   const b=await body(request),items=JSON.parse(row.paper_json).items,answers=b.answers;
   if(!answers||typeof answers!=='object'||Array.isArray(answers)||Object.keys(answers).length!==items.length||items.some(q=>q.type==='multi'?!Array.isArray(answers[q.id])||answers[q.id].length!==new Set(answers[q.id]).size||answers[q.id].some(x=>typeof x!=='string'||!q.options.some(o=>o.id===x)):typeof answers[q.id]!=='string'||!answers[q.id].trim()||answers[q.id].length>120||q.type==='single'&&!q.options.some(o=>o.id===answers[q.id])))return json({error:'请完成全部题目后提交'},400);
   const serialized=canonical(answers);if(row.result_json){if(row.answers_json!==serialized)return json({error:'已提交答卷不能改写'},409);return json(publicPaper(row));}
   const details=items.map(q=>{const value=answers[q.id],ok=q.type==='multi'?JSON.stringify([...value].sort())===JSON.stringify([...q.correct].sort()):q.type==='gap'?q.correct.some(v=>normalize(v)===normalize(value)):q.correct.includes(value);return{id:q.id,ok,answer:value,correct:q.correct,explanation:q.explanation};});
   const score=details.filter(r=>r.ok).length/items.length*100,now=Date.now(),result={score,passed:score===100,details,preview:true};
   const operations=[db.prepare('UPDATE lab_attempts SET answers_json=?,result_json=?,submitted_at=? WHERE id=? AND result_json IS NULL').bind(serialized,JSON.stringify(result),now,row.id)];
   if(result.passed)operations.push(db.prepare('INSERT OR IGNORE INTO lab_certificates(chapter_id,attempt_id,created_at,coin_seed) SELECT chapter_id,id,?,seed FROM lab_attempts WHERE id=? AND answers_json=? AND result_json=?').bind(now,row.id,serialized,JSON.stringify(result)));
   await db.batch(operations);const current=await db.prepare('SELECT * FROM lab_attempts WHERE id=?').bind(row.id).first();if(current.answers_json!==serialized)return json({error:'另一份答卷已先提交'},409);
   return json(publicPaper(current));
  }
 }
 if(path==='/feedback'&&request.method==='POST'){
  const b=await body(request);if(!uuid(b.id)||!b.feedback||typeof b.feedback!=='object'||JSON.stringify(b.feedback).length>10000)return json({error:'反馈格式无效'},400);
  const content=JSON.stringify(b.feedback),prior=await db.prepare('SELECT content_json FROM lab_feedback WHERE id=?').bind(b.id).first();if(prior&&prior.content_json!==content)return json({error:'反馈编号已使用'},409);
  await db.prepare('INSERT OR IGNORE INTO lab_feedback VALUES(?,?,?)').bind(b.id,content,Date.now()).run();const saved=await db.prepare('SELECT content_json FROM lab_feedback WHERE id=?').bind(b.id).first();if(saved.content_json!==content)return json({error:'另一份反馈已先提交'},409);return json({ok:true});
 }
 if(path==='/feedback'&&request.method==='GET'&&isPublisher){const {results}=await db.prepare('SELECT * FROM lab_feedback ORDER BY created_at DESC LIMIT 50').all();return json({feedback:results});}
 return json({error:'没有此测试操作'},404);
}

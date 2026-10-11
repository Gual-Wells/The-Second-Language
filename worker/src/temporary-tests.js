import {chapterTestsRoute,chapterTestQueueTime,claimChapterTest} from './chapter-tests.js';
import {temporaryTestEnvironment,temporaryTestBucket,expireTemporaryTests} from './temporary-test-store.js';
import {chapterTestPolicy} from '../../protocol/chapter-test-contract.mjs';
const json=(v,status=200)=>Response.json(v,{status,headers:{'cache-control':'no-store'}}),lifetime=48*60*60*1000;
export async function temporaryTestQueueTime(env){await expireTemporaryTests(env);return chapterTestQueueTime(temporaryTestEnvironment(env));}
export async function claimTemporaryTest(env,claim){
 const scope=temporaryTestEnvironment(env),candidate=await env.DB.prepare("SELECT p.* FROM temporary_test_pages p JOIN temporary_chapter_tests t ON t.id=p.id LEFT JOIN temporary_chapter_test_reviews r ON r.test_id=p.id WHERE p.expires_at>? AND (t.status='pending' OR r.state='pending') ORDER BY CASE WHEN r.state='pending' THEN r.created_at ELSE t.created_at END LIMIT 1").bind(Date.now()).first();if(!candidate)return null;
 const job=await claimChapterTest(scope,claim,async id=>{const page=await env.DB.prepare('SELECT expires_at FROM temporary_test_pages WHERE id=?').bind(id).first();if(!page||page.expires_at<=Date.now())throw Error('临时测试已过期');return temporaryTestBucket(env,id,page.expires_at);});if(!job)return null;const page=await env.DB.prepare('SELECT expires_at FROM temporary_test_pages WHERE id=?').bind(job.id).first();return {...job,temporary:true,expiresAt:page.expires_at};
}
export async function temporaryTestsRoute(request,env,context){
 if(!context.isPublisher&&!context.session)return json({error:'请先登录'},401);
 if(request.method!=='GET'&&!context.isPublisher&&!context.sameOrigin)return json({error:'请从阅读器提交'},403);
 const path=new URL(request.url).pathname.slice('/api/temporary-tests'.length),scope=temporaryTestEnvironment(env);
 if(path===''&&request.method==='POST'){
  if(!context.isPublisher)return json({error:'临时测试由教师发布'},403);let b;try{const raw=await request.text();if(raw.length>5000)throw Error();b=JSON.parse(raw);}catch{return json({error:'临时测试申请无效'},400);}
  if(!b||typeof b!=='object'||typeof b.chapterId!=='string'||!b.chapterId||!/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/.test(b.id||'')||!/^[a-f0-9]{64}$/.test(b.digest||'')||typeof b.title!=='string'||!b.title.trim()||b.title.length>160)return json({error:'临时测试申请无效'},400);
  const source=await env.DB.prepare('SELECT r.digest FROM chapter_revisions r JOIN published_chapters p ON p.chapter_id=r.chapter_id WHERE r.chapter_id=? AND r.digest=?').bind(b.chapterId,b.digest).first();if(!source)return json({error:'正式章节版本不存在'},404);
  const now=Date.now(),expires=now+lifetime;
  await env.DB.batch([env.DB.prepare('INSERT OR IGNORE INTO temporary_chapter_tests(id,chapter_id,chapter_digest,seed,created_at,updated_at,policy) VALUES(?,?,?,?,?,?,?)').bind(b.id,b.chapterId,b.digest,crypto.randomUUID(),now,now,chapterTestPolicy),env.DB.prepare('INSERT OR IGNORE INTO temporary_test_pages(id,title,subtitle,created_at,expires_at) VALUES(?,?,?,?,?)').bind(b.id,b.title.trim(),'20 道理解题 · 7 道听说',now,expires)]);
  const old=await env.DB.prepare('SELECT t.chapter_id,t.chapter_digest,p.expires_at FROM temporary_chapter_tests t JOIN temporary_test_pages p ON p.id=t.id WHERE t.id=?').bind(b.id).first();if(old.chapter_id!==b.chapterId||old.chapter_digest!==b.digest)return json({error:'申请编号已被使用'},409);if(old.expires_at<=now)return json({error:'临时测试已过期'},410);return json({ok:true,id:b.id,expiresAt:old.expires_at},201);
 }
 const id=path.match(/^\/(?:jobs\/)?([a-f0-9-]{36})(?:\/|$)/)?.[1];if(!id)return json({error:'临时测试操作无效'},404);
 const page=await env.DB.prepare('SELECT * FROM temporary_test_pages WHERE id=?').bind(id).first();if(!page||page.expires_at<=Date.now())return json({error:'临时测试已过期'},410);
 const response=await chapterTestsRoute(request,scope,{...context,apiBase:'/api/temporary-tests'},temporaryTestBucket(env,id,page.expires_at));
 if(request.method==='GET'&&path==='/'+id&&response.ok){const data=await response.json();return json({...data,temporary:true,title:page.title,expiresAt:page.expires_at});}return response;
}

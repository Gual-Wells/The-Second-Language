// Full isolated Worker path: SQLite, encrypted permanent-store transport and
// immutable chapter/source identities. No real account, model, TTS or VIX calls.
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFile,readdir,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import worker from '../worker/src/index.js';
import {readerIdentity} from '../worker/src/auth.js';
import {canonicalSourcePackage} from '../protocol/current-affairs.mjs';
import {validateAnnotatedContent} from '../web/annotations.js';
import {audioUnits,isChapterAudioRequest,pointAudioKeys,isPointAudioClip} from '../web/audio-plan.js';
import {buildAudioPlan} from '../worker/src/audio-config.js';
import {sourceWords,chapterTestTargets,validateChapterPaper,chapterTestPolicy} from '../protocol/chapter-test-contract.mjs';
import {qualityTargets,qualityPolicy,qualityPolicyDigest,finalizeQuality,factTargets} from '../protocol/chapter-quality-contract.mjs';
import {buildContextReview} from './lib/context-review.mjs';
import {processQualityJob} from './lib/chapter-quality-runner.mjs';
import {indexTextbook} from './lib/textbook-sources.mjs';

const hash=s=>createHash('sha256').update(s).digest('hex'),db=new DatabaseSync(':memory:'),practice=new DatabaseSync(':memory:');
for(const [sql,dir] of [[db,'worker/migrations'],[practice,'worker/practice_migrations']])for(const name of (await readdir(dir)).filter(n=>n.endsWith('.sql')).sort())sql.exec(await readFile(dir+'/'+name,'utf8'));
function d1(sql){return{prepare(query){const wrap=(args=[])=>({bind(...values){return wrap(values);},async first(){return sql.prepare(query).get(...args)||null;},async all(){return{results:sql.prepare(query).all(...args)};},async run(){return{meta:{changes:Number(sql.prepare(query).run(...args).changes)}};}});return wrap();},async batch(items){sql.exec('BEGIN');try{const r=[];for(const item of items)r.push(await item.run());sql.exec('COMMIT');return r;}catch(e){sql.exec('ROLLBACK');throw e;}}};}
const kv=new Map(),objects=new Map(),folders=new Map(),env={DB:d1(db),PRACTICE_DB:d1(practice),APP_ORIGIN:'https://isolated-reader.test',PUBLISH_TOKEN:'fixture-publisher',ONEDRIVE_ENABLED:'true',ONEDRIVE_KEY:Buffer.alloc(32,9).toString('base64'),CHAPTERS:{get:async key=>kv.get(key)??null,put:async(key,value)=>kv.set(key,value)}};
const key=await crypto.subtle.importKey('raw',Buffer.from(env.ONEDRIVE_KEY,'base64'),'AES-GCM',false,['encrypt']),iv=crypto.getRandomValues(new Uint8Array(12)),encrypted=await crypto.subtle.encrypt({name:'AES-GCM',iv},key,new TextEncoder().encode(JSON.stringify({accessToken:'fixture-drive',expiresAt:Date.now()+3600000})));
db.prepare('INSERT INTO storage_connection VALUES(1,?,0,?)').run(JSON.stringify({iv:Buffer.from(iv).toString('base64'),data:Buffer.from(encrypted).toString('base64')}),Date.now());db.prepare('INSERT INTO storage_folders VALUES(?,?)').run('@approot','fixture-root');
db.prepare('INSERT INTO auth_credential VALUES(1,?,?,0,?,0)').run('fixture-passkey','fixture-public-key','[]');
for(const token of ['a'.repeat(43),'b'.repeat(43)])db.prepare('INSERT INTO auth_sessions VALUES(?,1,?,?)').run(Buffer.from(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(token))).toString('base64url'),Date.now(),Date.now()+3600000);
const originalFetch=globalThis.fetch;let graphRequests=0;
globalThis.fetch=async(target,options={})=>{
 const url=new URL(target);assert.equal(url.origin,'https://graph.microsoft.com','No external paid/provider calls');graphRequests++;
 const route=decodeURIComponent(url.pathname.replace('/v1.0','')),method=options.method||'GET';let m=route.match(/^\/me\/drive\/items\/fixture-root:\/(objects-[a-f0-9]{2})$/);
 if(m)return folders.has(m[1])?Response.json({id:folders.get(m[1])}):Response.json({error:{code:'itemNotFound'}},{status:404});
 if(route==='/me/drive/items/fixture-root/children'&&method==='POST'){const name=JSON.parse(options.body).name,id='folder-'+name;folders.set(name,id);return Response.json({id});}
 m=route.match(/^\/me\/drive\/items\/([^/:]+):\/([a-f0-9]{64}\.bin)(:\/content)?$/);
 if(m){const location=m[1]+'/'+m[2],old=[...objects.values()].find(o=>o.location===location);if(method==='PUT'){const id=old?.id||'object-'+objects.size,bytes=Buffer.from(options.body);objects.set(id,{id,bytes,location});return Response.json({id,size:bytes.length});}return old?Response.json({id:old.id,size:old.bytes.length}):Response.json({error:{code:'itemNotFound'}},{status:404});}
 m=route.match(/^\/me\/drive\/items\/([^/]+)\/content$/);if(m){assert.ok(objects.has(m[1]));return new Response(objects.get(m[1]).bytes);}throw Error('Unexpected fixture request '+route);
};
async function call(route,{body,method=body===undefined?'GET':'POST',reader=false,anonymous=false,token='a'.repeat(43)}={}){const headers={'content-type':'application/json',origin:env.APP_ORIGIN};if(reader)headers.cookie='__Host-second_language='+token;else if(!anonymous)headers.authorization='Bearer '+env.PUBLISH_TOKEN;const response=await worker.fetch(new Request(env.APP_ORIGIN+route,{method,headers,...(body===undefined?{}:{body:JSON.stringify(body)})}),env);return{status:response.status,data:await response.json()};}
const words=Array.from({length:50},(_,i)=>({id:'W'+String(i).padStart(3,'0'),use:'U'+String(i).padStart(3,'0'),text:'word'+String(i).padStart(3,'0')}));
function fixture(version='one'){
 return '<!-- FORMAT:usage-context-v1 -->\n\n'+words.map((w,i)=>{
  const intro=`<!-- WORD:${w.id} -->\n# ${w.text}\n\n**词源**：只供隔离接口验证，不是正式教学内容。\n\n<!-- USE:${w.use} -->\n## ${w.text} · 验证义 /wɝd/\n\`隔离验证用法\`\n\n`;
  if(i===49)return intro+'<!-- CONTEXT_REF:C048 USE:U049 -->\n';
  const id='C'+String(i).padStart(3,'0'),refs=i===48?'U048,U049':w.use,text=i===48?`We compare word048 with word049 in fixture ${version}.`:`We use ${w.text} in fixture ${version}.`;
  return intro+`<!-- CONTEXT:${id} USE:${refs} KIND:${i===0?'abridgment':'example'} -->\n<!-- CONTEXT_META:${JSON.stringify({title:'Isolated context',sourceUrls:i===0?['https://example.test/reference']:[],displayContext:'Not real teaching material.'})} -->\n<!-- SENTENCE:S${String(i).padStart(3,'0')} USE:${refs} -->\n${text}\n<!-- TRANSLATION:${id} -->\n本段仅用于独立工程验证，并非正式学习内容。\n\n整块译文不进入英文发音白名单。\n<!-- END_CONTEXT:${id} -->\n`;
 }).join('\n');
}
const evidenceFixtures=new Map();
function payload(date,version){const markdown=fixture(version),digest=hash(markdown),parsed=validateAnnotatedContent(markdown),sourcePackage={schemaVersion:1,format:'usage-context-v1',studyDate:date,chapterDigest:digest,selectionDigest:hash('selection-'+date),vixInputCommit:'a'.repeat(40),context:'Isolated transport fixture, not a real teaching chapter.',contexts:parsed.contexts.map(c=>({id:c.id,kind:c.kind,sourceUrls:c.sourceUrls})),sources:[{sourceId:'fixture-source',url:'https://example.test/reference',title:'Isolated self-written source',publisher:'Fixture',readAt:'2026-10-27T00:00:00.000Z',readDigest:hash('Isolated source original.'),facts:['This is an isolated test source.']}]};
// Only exercises permanent transport/admission here. Full authoring evidence is
// validated by check-chapter-evidence and check-context-quality-evidence.
const group={schemaVersion:1,kind:'chapter-evidence-group-v1',records:[{kind:'control',note:'Self-written transport fixture; not teaching or semantic evidence.'}]},groupText=JSON.stringify(group),manifest={schemaVersion:1,kind:'chapter-evidence-v1',studyDate:date,runId:date,chapterDigest:digest,selectionDigest:sourcePackage.selectionDigest,vixInputCommit:sourcePackage.vixInputCommit,authoringPolicy:'authentic-context-v1',wordCount:50,sourceCount:sourcePackage.sources.length,groups:[{digest:hash(groupText),bytes:Buffer.byteLength(groupText)}]};
sourcePackage.evidenceDigest=hash(JSON.stringify(manifest));evidenceFixtures.set(sourcePackage.evidenceDigest,[group,manifest]);
return{id:date,date,runId:date,title:'Isolated context fixture',subtitle:'Not a course',number:'第 99 章',wordCount:50,contentPolicy:'etymology-fused-v1',authoringPolicy:'authentic-context-v1',sourcePolicy:'current-affairs-v1',markdown,digest,vixInputCommit:'a'.repeat(40),vixCommit:'b'.repeat(40),protocolCommit:'c'.repeat(40),sourcePackage,sourceDigest:hash(canonicalSourcePackage(sourcePackage))};}
const stage=async value=>{for(const asset of evidenceFixtures.get(value.sourcePackage?.evidenceDigest)||[])assert.equal((await call('/api/storage/content',{method:'PUT',body:asset})).status,200);return call('/api/publish/stage',{body:value});},commit=value=>call('/api/publish/commit',{body:{runId:value.runId,digest:value.digest}});
async function claim(date){await call('/api/settings',{method:'PUT',body:{restRequested:false},reader:true});assert.equal((await call('/api/runs/claim',{body:{runId:date,date}})).data.rest,false);}
try{
 const oldCapability=(await call('/api/chapter-quality/capabilities',{reader:true})).data;assert.equal(oldCapability.policy,'chapter-quality-v2-contexts');assert.equal(oldCapability.executionPolicy,qualityPolicy.id,'Old installed reader negotiates a wire alias while execution stays at the real current policy');
 const newCapability=(await call('/api/chapter-quality/capabilities?client='+qualityPolicy.id,{reader:true})).data;assert.equal(newCapability.policy,qualityPolicy.id);
 const anonymous=await call('/api/session',{anonymous:true});assert.equal(anonymous.data.readerUserId,null);assert.equal(anonymous.data.authenticated,false);
 const a=(await call('/api/session',{reader:true})).data,b=(await call('/api/session',{reader:true,token:'b'.repeat(43)})).data;assert.equal(a.readerUserId,b.readerUserId);assert.equal(a.readerUserId,await readerIdentity(env));assert.notEqual(a.readerUserId,await readerIdentity({...env,APP_ORIGIN:'https://other-install.test'}));assert.ok(!JSON.stringify(a).includes('fixture-passkey'));
 const first=payload('2026-10-27','first');await claim(first.date);
 const noEvidence=structuredClone(first);delete noEvidence.sourcePackage.evidenceDigest;noEvidence.sourceDigest=hash(canonicalSourcePackage(noEvidence.sourcePackage));assert.equal((await call('/api/publish/stage',{body:noEvidence})).status,400,'New integrated publication requires adopted evidence');
 assert.equal((await call('/api/publish/stage',{body:first})).status,503,'Evidence must be saved before stage');
 assert.equal(db.prepare('SELECT count(*) n FROM chapter_revisions').get().n,0,'Missing evidence cannot leave a staged revision');

 assert.equal((await stage({...first,authoringPolicy:undefined})).status,400);
 const missing=structuredClone(first);missing.sourcePackage.contexts.pop();missing.sourceDigest=hash(canonicalSourcePackage(missing.sourcePackage));assert.equal((await stage(missing)).status,400,'Every selected context has immutable source mapping');
 const staged=await stage(first);assert.equal(staged.status,200,JSON.stringify(staged.data));
 // A same-length mutation after stage must not be accepted as permanently saved
 // evidence merely because the content address and metadata still exist.
 const evidenceGroup=evidenceFixtures.get(first.sourcePackage.evidenceDigest)[0],groupDigest=hash(JSON.stringify(evidenceGroup));
 const savedGroup=[...objects.values()].find(value=>value.location.endsWith('/'+groupDigest+'.bin'));
 assert.ok(savedGroup,'The staged private evidence group exists');
 const savedBytes=Buffer.from(savedGroup.bytes);savedGroup.bytes=Buffer.from(savedBytes);savedGroup.bytes[0]^=1;
 assert.equal((await commit(first)).status,503,'Same-length corrupted private evidence blocks commit');
 assert.equal(db.prepare('SELECT count(*) n FROM published_chapters').get().n,0,'Corrupted evidence cannot publish a chapter');
 savedGroup.bytes=savedBytes;assert.equal((await commit(first)).status,200,'Restoring the original immutable bytes resumes the same staged publication');
 assert.equal(db.prepare('SELECT count(*) n FROM audio_requests').get().n,0,'Default no audio stays empty');
 const saved=(await call('/api/chapters/'+first.id,{reader:true})).data;assert.equal(saved.markdown,first.markdown);assert.equal(saved.digest,first.digest);
 assert.equal((await call('/api/chapters/'+first.id+'/sources',{reader:true})).data.sourcePackage.contexts.length,49);
 const publicSources=(await call('/api/chapters/'+first.id+'/sources',{reader:true})).data.sourcePackage;assert.equal(publicSources.evidenceDigest,first.sourcePackage.evidenceDigest);assert.ok(!JSON.stringify(publicSources).includes('Self-written transport fixture'),'Source UI never receives private originals or authors');
 assert.notEqual((await call('/api/storage/content?digest='+publicSources.evidenceDigest,{reader:true})).status,200,'Private evidence is publisher-only');

 const units=audioUnits(first.markdown);assert.equal(units.length,49);assert.ok(units.every(u=>u.part==='contexts'));
 assert.equal(isChapterAudioRequest(first.markdown,'隔离验证用法','sentence'),false);assert.equal(isChapterAudioRequest(first.markdown,'Not real teaching material.','sentence'),false);assert.equal(isChapterAudioRequest(first.markdown,units[0].text,'sentence'),true);assert.equal(isChapterAudioRequest(first.markdown,units[0].text,'word'),false);
 assert.ok(isPointAudioClip({text:units[0].text,voice:'af_bella'},pointAudioKeys(first.markdown)));
 const denied=await call('/api/practice/pronunciation',{reader:true,body:{chapterId:first.id,digest:first.digest,kind:'sentence',text:'Not real teaching material.'}});assert.equal(denied.status,422,'Disallowed prose cannot reach provider/funding');
 const plan=await buildAudioPlan(env,first.id,first.digest,['contexts']);assert.equal(plan.units.length,49);assert.deepEqual(plan.availableParts,['contexts']);
 assert.equal((await call('/api/audio-config/quote',{reader:true,body:{chapterId:first.id,digest:first.digest,parts:['two']}})).status,422);assert.equal(db.prepare('SELECT count(*) n FROM audio_requests').get().n,0);
 const next=(await call('/api/audio-config',{reader:true})).data;assert.deepEqual(next.supportedParts,['contexts']);assert.equal((await call('/api/audio-config/next',{reader:true,method:'PUT',body:{parts:['three'],revision:next.revision}})).status,400);assert.equal((await call('/api/audio-config/next',{reader:true,method:'PUT',body:{parts:['contexts'],revision:next.revision}})).status,200);
 const selected=db.prepare('SELECT * FROM audio_next_config').get();await commit(first);assert.deepEqual(db.prepare('SELECT * FROM audio_next_config').get(),selected,'Old publication retry does not consume next selection');
 const second=payload('2026-10-28','second');await claim(second.date);assert.equal((await stage(second)).status,200);assert.equal((await commit(second)).status,200);assert.equal(db.prepare('SELECT parts FROM audio_requests WHERE chapter_digest=?').get(second.digest).parts,'["contexts"]');assert.deepEqual((await call('/api/audio-config')).data.next,[]);
 const third=payload('2026-10-29','third');await claim(third.date);assert.equal((await stage(third)).status,200);db.prepare('UPDATE audio_next_config SET parts=? WHERE id=1').run('["two","three"]');assert.equal((await commit(third)).status,200);assert.equal(db.prepare('SELECT count(*) n FROM audio_requests WHERE chapter_digest=?').get(third.digest).n,0,'Legacy selection never authorizes new context generation');
 const question=crypto.randomUUID();assert.equal((await call('/api/questions',{reader:true,body:{id:question,chapterId:first.id,digest:first.digest,question:'Please explain the context in the first use.'}})).status,201);const job=(await call('/api/questions/jobs/claim',{body:{claim:'d'.repeat(64)}})).data.job;assert.equal(job.id,question);assert.equal(job.chapter.markdown,first.markdown);assert.equal(job.chapter.digest,first.digest);
 const wordSources=sourceWords(first.markdown);assert.equal(wordSources.size,50);assert.ok(wordSources.get('W049').includes('We compare word048 with word049'),'Shared actual context is available to selected word');assert.ok(!wordSources.get('W049').includes('# word048'),'Neighbour definitions are not imported');
 const targets=await chapterTestTargets(first.markdown,'fixed-seed');assert.equal(targets.length,20);assert.equal(targets.filter(t=>t.type==='oral').length,7);assert.equal(new Set(targets.map(t=>t.wordId)).size,20);
 const paper={items:targets.map(t=>({...t,prompt:'Which statement fits the isolated meaning in a new situation?',options:[...'ABCD'].map(id=>({id,text:'Fixture option '+id,reason:'这是独立接口验证中的选项说明。'})),correct:t.type==='multi'?['A','B']:['A'],quote:'隔离验证用法',explanation:'这是独立工程验证中的解释，不是对真实教学质量的判断。'}))};assert.equal(validateChapterPaper(paper,first.markdown,targets).items.length,20);
 const testId=crypto.randomUUID();assert.equal((await call('/api/chapter-tests',{reader:true,body:{id:testId,chapterId:first.id,digest:first.digest,policy:chapterTestPolicy}})).status,201);const test=(await call('/api/chapter-tests/jobs/claim',{body:{claim:'e'.repeat(64)}})).data.job;assert.equal(test.id,testId);assert.equal(test.chapter.markdown,first.markdown);
 const qualityId=crypto.randomUUID();assert.equal((await call('/api/chapter-quality',{reader:true,body:{id:qualityId,chapterId:first.id,digest:first.digest,policy:qualityPolicy.id}})).status,201);const compatible=await call('/api/chapter-quality',{reader:true,body:{id:qualityId,chapterId:first.id,digest:first.digest,policy:'chapter-quality-v2-contexts'}});assert.equal(compatible.status,200);assert.equal(db.prepare('SELECT policy_id FROM chapter_quality_requests WHERE id=?').get(qualityId).policy_id,qualityPolicy.id,'Compatibility never reinterprets an old checkpoint');const quality=(await call('/api/chapter-quality/jobs/claim',{body:{claim:'f'.repeat(64)}})).data.job;assert.equal(quality.chapter.sourcePackage.chapterDigest,first.digest);assert.equal(quality.chapter.markdown,first.markdown);
 const qualityIndex=qualityTargets(first.markdown);assert.equal(qualityIndex.targets.filter(t=>t.kind==='context-use').length,50);assert.equal(qualityIndex.targets.filter(t=>t.kind==='context-source').length,49);assert.equal(qualityIndex.targets.filter(t=>t.kind==='translation').length,49,'Translation reviewed once per whole context');
 const oneWord=buildContextReview([{chapter:saved,word:'word049'}]),review=validateAnnotatedContent(oneWord);assert.equal(review.words.length,1);assert.equal(review.contexts.length,1);assert.equal(review.contexts[0].refs.length,1);assert.ok(review.sentences[0].text.includes('word048'));
 const sharedReview=validateAnnotatedContent(buildContextReview([{chapter:saved,word:'word048'},{chapter:saved,word:'word049'}]));assert.equal(sharedReview.contexts.length,1);assert.equal(sharedReview.occurrences.length,2);assert.equal(sharedReview.uses.size,2);
 // Drive the real quality runner using deterministic outputs. The missing
 // private source original must force needs_evidence even if a model says yes.
 const books=['collins','oxford'].map(book=>indexTextbook(Buffer.from(words.map(w=>'## '+w.text+'\n'+w.text+' fixture meaning.\n').join('\n')),book)),files=new Map(),directory='.cache/usage-context-backend/'+crypto.randomUUID();await mkdir(directory,{recursive:true});
 const request=async(route,payload,method)=>{if(route==='/api/storage/content'&&method==='PUT'){const digest=hash(payload);files.set(digest,payload);return{digest};}if(route.endsWith('/checkpoint'))return{yield:false};if(route.endsWith('/complete'))return{ok:true};throw Error('Unexpected isolated quality route');};
 const runModel=async(schema,prompt)=>{const input=JSON.parse(prompt.slice(prompt.lastIndexOf('\n')+1));if(schema.properties.words)return{words:input.map(w=>({wordId:w.wordId,facts:[{id:'F001',description:w.word+' fixture meaning',refs:[{sourceId:w.entries[0].id,quote:w.word+' fixture meaning.'}]}],extraTerms:[],closure:'complete',reason:'Isolated source inventory'}))};return{checks:input.targets.map(t=>({targetId:t.id,state:'supported',reason:'Deterministic interface response, not semantic proof',refs:[]})),findings:[]};};
 const outcome=await processQualityJob({job:{...quality,claim:'f'.repeat(64)},root:process.cwd(),directory,request,runModel,loadBooks:async()=>books});assert.equal(outcome.decision,'needs_evidence');
 assert.equal(db.prepare('PRAGMA integrity_check').get().integrity_check,'ok');assert.equal(practice.prepare('PRAGMA integrity_check').get().integrity_check,'ok');
 console.log(JSON.stringify({ok:true,format:'usage-context-v1',wordCount:50,contexts:49,sharedContext:true,publicationAndSourceReadback:true,audioDefaultEmpty:true,oldAudioSelectionNotReinterpreted:true,pointAudioWhitelist:true,fixedVersionQuestionAndTest:true,twentyTargetsSevenOral:true,qualityWholeTranslationAndMissingOriginal:true,reviewContextExtraction:true,singleTenantStableReaderIdentity:true,graphFixtureRequests:graphRequests,noProductionWrites:true,noPaidCalls:true}));
}finally{globalThis.fetch=originalFetch;db.close();practice.close();}

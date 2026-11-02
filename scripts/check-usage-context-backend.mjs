// Full isolated Worker path: SQLite, encrypted permanent-store transport and
// immutable chapter/source identities. No real account, model, TTS or VIX calls.
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFile,readdir,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import worker from '../worker/src/index.js';
import {readerIdentity} from '../worker/src/auth.js';
import {permanentBucket} from '../worker/src/storage.js';
import {verifyChapterEvidence} from '../worker/src/current-affairs.js';
import {canonicalSourcePackage} from '../protocol/current-affairs.mjs';
import {validateAnnotatedContent} from '../web/annotations.js';
import {audioUnits,isChapterAudioRequest,pointAudioKeys,isPointAudioClip} from '../web/audio-plan.js';
import {buildAudioPlan} from '../worker/src/audio-config.js';
import {sourceWords,chapterTestTargets,validateChapterPaper,chapterTestPolicy} from '../protocol/chapter-test-contract.mjs';
import {qualityTargets,qualityPolicy,qualityPolicyDigest,finalizeQuality,factTargets} from '../protocol/chapter-quality-contract.mjs';
import {buildContextReview} from './lib/context-review.mjs';
import {processQualityJob} from './lib/chapter-quality-runner.mjs';
import {indexTextbook} from './lib/textbook-sources.mjs';
import {uploadEvidenceObjects} from './lib/publish-chapter-evidence.mjs';
import {backendFixtureWords as words,backendFixtureValidatorKeys,usageContextBackendFixture,fixtureFallbackAdmission} from './lib/usage-context-backend-fixture.mjs';

const hash=s=>createHash('sha256').update(s).digest('hex'),db=new DatabaseSync(':memory:'),practice=new DatabaseSync(':memory:');
for(const [sql,dir] of [[db,'worker/migrations'],[practice,'worker/practice_migrations']])for(const name of (await readdir(dir)).filter(n=>n.endsWith('.sql')).sort())sql.exec(await readFile(dir+'/'+name,'utf8'));
function d1(sql){return{prepare(query){const wrap=(args=[])=>({bind(...values){return wrap(values);},async first(){return sql.prepare(query).get(...args)||null;},async all(){return{results:sql.prepare(query).all(...args)};},async run(){return{meta:{changes:Number(sql.prepare(query).run(...args).changes)}};}});return wrap();},async batch(items){sql.exec('BEGIN');try{const r=[];for(const item of items)r.push(await item.run());sql.exec('COMMIT');return r;}catch(e){sql.exec('ROLLBACK');throw e;}}};}
const kv=new Map(),objects=new Map(),folders=new Map(),env={DB:d1(db),PRACTICE_DB:d1(practice),APP_ORIGIN:'https://isolated-reader.test',PUBLISH_TOKEN:'fixture-publisher',ONEDRIVE_ENABLED:'true',ONEDRIVE_KEY:Buffer.alloc(32,9).toString('base64'),CHAPTERS:{get:async key=>kv.get(key)??null,put:async(key,value)=>kv.set(key,value)}};
env.PUBLICATION_VALIDATOR_KEYS=backendFixtureValidatorKeys;
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
async function call(route,{body,method=body===undefined?'GET':'POST',reader=false,anonymous=false,layout=null,token='a'.repeat(43)}={}){const headers={'content-type':'application/json',origin:env.APP_ORIGIN};if(layout)headers['x-reader-layout']=layout;if(reader)headers.cookie='__Host-second_language='+token;else if(!anonymous)headers.authorization='Bearer '+env.PUBLISH_TOKEN;const response=await worker.fetch(new Request(env.APP_ORIGIN+route,{method,headers,...(body===undefined?{}:{body:JSON.stringify(body)})}),env);return{status:response.status,headers:response.headers,data:await response.json()};}
const evidenceFixtures=new Map();
function payload(date,version,wordCount=50){const fixture=usageContextBackendFixture(date,version,{wordCount});evidenceFixtures.set(fixture.value.sourcePackage.evidenceDigest,fixture.assets);return fixture.value;}
const stage=async value=>{for(const asset of evidenceFixtures.get(value.sourcePackage?.evidenceDigest)||[])assert.equal((await call('/api/storage/content',{method:'PUT',body:asset})).status,200);return call('/api/publish/stage',{body:value});},commit=value=>call('/api/publish/commit',{body:{runId:value.runId,digest:value.digest}});
async function claim(date){await call('/api/settings',{method:'PUT',body:{restRequested:false},reader:true});assert.equal((await call('/api/runs/claim',{body:{runId:date,date}})).data.rest,false);}
try{
 const oldCapability=(await call('/api/chapter-quality/capabilities',{reader:true})).data;assert.equal(oldCapability.policy,'chapter-quality-v2-contexts');assert.equal(oldCapability.executionPolicy,qualityPolicy.id,'Old installed reader negotiates a wire alias while execution stays at the real current policy');
 const newCapability=(await call('/api/chapter-quality/capabilities?client='+qualityPolicy.id,{reader:true})).data;assert.equal(newCapability.policy,qualityPolicy.id);
 const anonymous=await call('/api/session',{anonymous:true});assert.equal(anonymous.data.readerUserId,null);assert.equal(anonymous.data.authenticated,false);
 const a=(await call('/api/session',{reader:true})).data,b=(await call('/api/session',{reader:true,token:'b'.repeat(43)})).data;assert.equal(a.readerUserId,b.readerUserId);assert.equal(a.readerUserId,await readerIdentity(env));assert.notEqual(a.readerUserId,await readerIdentity({...env,APP_ORIGIN:'https://other-install.test'}));assert.ok(!JSON.stringify(a).includes('fixture-passkey'));
 const first=payload('2026-10-27','first');await claim(first.date);
 const noEvidence=structuredClone(first);delete noEvidence.sourcePackage.evidenceDigest;noEvidence.sourceDigest=hash(canonicalSourcePackage(noEvidence.sourcePackage));assert.equal((await call('/api/publish/stage',{body:noEvidence})).status,400,'New integrated publication requires adopted evidence');
 const noSavedReview=await call('/api/publish/stage',{body:first});assert.equal(noSavedReview.status,503,'A new integrated version requires the review receipt to be saved first');
 const firstAssets=evidenceFixtures.get(first.sourcePackage.evidenceDigest);for(const asset of firstAssets.filter(a=>['publication-review-v1','publication-attestation-v1'].includes(a.policy)))assert.equal((await call('/api/storage/content',{method:'PUT',body:asset})).status,200);
 const unsaved=await call('/api/publish/stage',{body:first});assert.equal(unsaved.status,503,'Evidence must be saved before stage: '+JSON.stringify(unsaved.data));
 assert.equal(db.prepare('SELECT count(*) n FROM chapter_revisions').get().n,0,'Missing evidence cannot leave a staged revision');

 assert.equal((await stage({...first,authoringPolicy:undefined})).status,400);
 const missing=structuredClone(first);missing.sourcePackage.contexts.pop();missing.sourceDigest=hash(canonicalSourcePackage(missing.sourcePackage));assert.equal((await stage(missing)).status,400,'Every selected context has immutable source mapping');
 const staged=await stage(first);assert.equal(staged.status,200,JSON.stringify(staged.data));
 // The resource-bounded commit checks immutable group existence/size, plus the
 // independent validation signature. Byte-level corruption is checked on full
 // signer validation and storage GET, not by claiming HEAD reads every group.
 const evidenceGroup=evidenceFixtures.get(first.sourcePackage.evidenceDigest)[0],groupDigest=hash(JSON.stringify(evidenceGroup));
 const savedGroup=[...objects.values()].find(value=>value.location.endsWith('/'+groupDigest+'.bin'));
 assert.ok(savedGroup,'The staged private evidence group exists');
 const intactGroupBytes=Buffer.from(savedGroup.bytes);savedGroup.bytes=Buffer.from(intactGroupBytes);savedGroup.bytes[0]^=1;
 await verifyChapterEvidence(env,first.sourcePackage,first.runId);
 await assert.rejects(uploadEvidenceObjects([{digest:groupDigest,text:JSON.stringify(evidenceGroup),bytes:intactGroupBytes.length}],{base:env.APP_ORIGIN,token:env.PUBLISH_TOKEN,fetchImpl:async(url,options)=>worker.fetch(new Request(url,options),env)}),/回读摘要不符/,'The production permanent GET/readback helper rejects the same-length bit flip that group HEAD cannot detect');
 savedGroup.bytes=intactGroupBytes;
 objects.delete(savedGroup.id);
 assert.equal((await commit(first)).status,503,'An unavailable immutable evidence group blocks commit');
 assert.equal(db.prepare('SELECT count(*) n FROM published_chapters').get().n,0,'Unavailable evidence cannot publish a chapter');
 objects.set(savedGroup.id,savedGroup);assert.equal((await commit(first)).status,200,'Restoring the original immutable object resumes the same staged publication and signature');
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
 const modern=payload('2026-10-30','layout2');await claim(modern.date);assert.equal((await stage(modern)).status,200);assert.equal((await commit(modern)).status,200);
 assert.equal((await call('/api/chapters/'+modern.id,{reader:true})).status,426,'Old open JS gets a useful upgrade message, never unsupported chapter text');
 const capable=await call('/api/chapters/'+modern.id,{reader:true,layout:'2'});assert.equal(capable.status,200);assert.equal(capable.data.digest,modern.digest);assert.equal(capable.headers.get('vary'),'x-reader-layout','Cache API matches the explicit reader capability');
 assert.equal((await call('/api/chapters/'+modern.id)).data.markdown,modern.markdown,'Publisher readback keeps exact bytes');
 assert.equal((await call('/api/chapters/'+first.id+'?digest='+first.digest,{reader:true})).data.markdown,first.markdown,'Legacy fixed-version reader path stays available');
 const quick=payload('2026-10-31','layout3');await claim(quick.date);assert.equal((await stage(quick)).status,200);assert.equal((await commit(quick)).status,200);
 assert.equal((await call('/api/chapters/'+quick.id,{reader:true,layout:'2'})).status,426,'Old no-gloss parser cannot receive the new tail');
 assert.equal((await call('/api/chapters/'+quick.id,{reader:true,layout:'3'})).data.digest,quick.digest);
 assert.equal((await call('/api/chapters/'+modern.id,{reader:true,layout:'3'})).status,200,'Capability3 continues reading capability2 content');
 // Simulate migration 0029 on an already-current integrated chapter: absence
 // of a historical receipt permits only the identical current bytes to retry.
 const historicalRetry=payload('2026-10-26','pre-review-migration');delete historicalRetry.publicationReviewDigest;delete historicalRetry.publicationAttestationDigest;
 // Seed a pre-migration row directly in this empty-account fixture; do not
 // delete or bypass the new immutable review-binding trigger.
 const legacyAssets=evidenceFixtures.get(historicalRetry.sourcePackage.evidenceDigest);for(const asset of legacyAssets.slice(0,2))assert.equal((await call('/api/storage/content',{method:'PUT',body:asset})).status,200);
 const historicalContentKey=`chapters/${historicalRetry.date}/${historicalRetry.digest}.md`,historicalSourceKey=`chapter-sources/${historicalRetry.digest}/${historicalRetry.sourceDigest}.json`,store=permanentBucket(env);
 await store.put(historicalContentKey,historicalRetry.markdown);await store.put(historicalSourceKey,canonicalSourcePackage(historicalRetry.sourcePackage));
 db.prepare('INSERT INTO chapter_revisions(digest,chapter_id,study_date,number,title,subtitle,word_count,content_key,run_id,vix_commit,protocol_commit,created_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)').run(historicalRetry.digest,historicalRetry.id,historicalRetry.date,'第 0 章',historicalRetry.title,historicalRetry.subtitle,50,historicalContentKey,historicalRetry.runId,historicalRetry.vixCommit,historicalRetry.protocolCommit,0);
 db.prepare('INSERT INTO chapter_sources(digest,source_digest,source_key,policy,created_at) VALUES(?,?,?,?,?)').run(historicalRetry.digest,historicalRetry.sourceDigest,historicalSourceKey,historicalRetry.sourcePolicy,0);
 db.prepare('INSERT INTO published_chapters(chapter_id,study_date,digest,published_at) VALUES(?,?,?,?)').run(historicalRetry.id,historicalRetry.date,historicalRetry.digest,0);await claim(historicalRetry.date);
 assert.equal((await stage(historicalRetry)).status,200,'An already-current chapter need not invent a historical review receipt');
 assert.equal((await commit(historicalRetry)).status,200);assert.equal(db.prepare('SELECT * FROM chapter_publication_reviews WHERE chapter_digest=?').get(historicalRetry.digest),undefined);
 // The verifier's private key is an independent trust boundary. An ordinary
 // publisher cannot authorize an incomplete replacement using a previous
 // signature. A trusted key deliberately signing bad data is not detectable
 // from the signature alone; production signer rejection is tested separately.
 const incomplete=payload('2026-11-01','incomplete-evidence'),completeAssets=evidenceFixtures.get(incomplete.sourcePackage.evidenceDigest),emptyGroup={schemaVersion:1,kind:'chapter-evidence-group-v1',records:[completeAssets[0].records[0]]};
 await claim(incomplete.date);const unsigned={...incomplete};delete unsigned.publicationAttestationDigest;
 assert.equal((await stage(unsigned)).status,400,'A publisher token and complete review receipt do not replace the independent validation signature');
 const wrongSignature={...completeAssets[3],signature:Buffer.alloc(64,3).toString('base64')},wrongSignatureText=JSON.stringify(wrongSignature),wrongSignatureValue={...incomplete,publicationAttestationDigest:hash(wrongSignatureText)};
 assert.equal((await call('/api/storage/content',{method:'PUT',body:wrongSignature})).status,200);assert.equal((await stage(wrongSignatureValue)).status,400,'A stored but incorrectly signed validation record cannot admit a new version');
 const emptyText=JSON.stringify(emptyGroup),emptyManifest={...completeAssets[1],groups:[{digest:hash(emptyText),bytes:Buffer.byteLength(emptyText)}]};
 incomplete.sourcePackage.evidenceDigest=hash(JSON.stringify(emptyManifest));incomplete.sourceDigest=hash(canonicalSourcePackage(incomplete.sourcePackage));
 const incompleteReview={...completeAssets[2],sourceDigest:incomplete.sourceDigest,evidenceDigest:incomplete.sourcePackage.evidenceDigest};
 incomplete.publicationReviewDigest=hash(JSON.stringify(incompleteReview));evidenceFixtures.set(incomplete.sourcePackage.evidenceDigest,[emptyGroup,emptyManifest,incompleteReview,completeAssets[3]]);
 const noNewReceipt={...incomplete};delete noNewReceipt.publicationReviewDigest;
 assert.equal((await stage(noNewReceipt)).status,400,'A new integrated version cannot use the historical receipt exception');
 assert.equal((await stage(incomplete)).status,400,'A previous valid proof cannot be replayed for a control-only manifest or a changed review/source binding');
 assert.equal(db.prepare('SELECT digest FROM published_chapters WHERE chapter_id=?').get(incomplete.id),undefined);
 assert.equal(db.prepare('PRAGMA integrity_check').get().integrity_check,'ok');assert.equal(practice.prepare('PRAGMA integrity_check').get().integrity_check,'ok');
 const thirty=payload('2026-11-03','layout3',30);await claim(thirty.date);
  const missingSize=structuredClone(thirty);delete missingSize.chapterSizePolicy;assert.equal((await call('/api/publish/stage',{body:missingSize})).status,400,'Unlabelled 30-word publication cannot borrow the legacy 50-word contract');
  const wrongSize={...thirty,wordCount:50};assert.equal((await call('/api/publish/stage',{body:wrongSize})).status,400,'Declared size cannot override the pinned 30-word contract');
  assert.equal((await stage(thirty)).status,200);assert.equal((await commit(thirty)).status,200);const thirtyRead=await call('/api/chapters/'+thirty.date,{reader:true,layout:'3'});assert.equal(thirtyRead.status,200);assert.equal(thirtyRead.data.wordCount,30);assert.equal(thirtyRead.data.chapterSizePolicy,'thirty-main-words-v1');assert.equal(validateAnnotatedContent(thirtyRead.data.markdown).words.length,30);assert.equal(qualityTargets(thirtyRead.data.markdown).words.length,30);assert.equal(sourceWords(thirtyRead.data.markdown).size,30);
  const thirtyList=(await call('/api/chapters',{reader:true})).data.chapters.find(c=>c.id===thirty.id);assert.equal(thirtyList.wordCount,30);assert.equal(thirtyList.chapterSizePolicy,'thirty-main-words-v1');assert.equal(db.prepare('SELECT word_count FROM chapter_revisions WHERE digest=?').get(thirty.digest).word_count,30);
  // The alarm and the hard admission rule are deliberately independent.
  env.FALLBACK_APPEALS_REQUIRED='true';
  const makeAppealFixture=async(date,authenticWords,approved)=>{let f=usageContextBackendFixture(date,'layout3',{wordCount:30,authenticWords,contextTag:date});if(approved)f=await fixtureFallbackAdmission(f);evidenceFixtures.set(f.value.sourcePackage.evidenceDigest,f.assets);await claim(date);return f;};
  const highMissing=await makeAppealFixture('2026-11-04',27,false);
  const highDenied=await stage(highMissing.value);assert.equal(highDenied.status,409,JSON.stringify(highDenied.data));assert.equal(highDenied.data.code,'FALLBACK_APPEALS_PENDING','Above80 never authorizes unreviewed examples');
  assert.equal(db.prepare('SELECT digest FROM chapter_revisions WHERE digest=?').get(highMissing.value.digest),undefined,'Missing per-example decisions cannot leave a staged row');
  const lowApproved=await makeAppealFixture('2026-11-05',23,true);
  const lowStage=await stage(lowApproved.value);assert.equal(lowStage.status,200,JSON.stringify(lowStage.data));assert.equal(lowStage.data.authenticityAlarm.warning,true);
  const lowCommit=await commit(lowApproved.value);assert.equal(lowCommit.status,200,JSON.stringify(lowCommit.data));assert.equal(lowCommit.data.authenticityAlarm.warning,true,'Low ratio alarms but complete individually approved exceptions can publish');
  assert.ok(db.prepare('SELECT * FROM chapter_fallback_appeals WHERE chapter_digest=?').get(lowApproved.value.digest));
  assert.throws(()=>db.prepare('UPDATE chapter_fallback_appeals SET appeals_digest=? WHERE chapter_digest=?').run('0'.repeat(64),lowApproved.value.digest),/immutable/);
  const entirelyReal=await makeAppealFixture('2026-11-06',30,true);assert.equal((await stage(entirelyReal.value)).status,200);assert.equal((await commit(entirelyReal.value)).status,200,'Entirely real material needs no fictional appeal or review call');
  const mismatched=await makeAppealFixture('2026-11-07',26,true);mismatched.value.fallbackAttestationDigest=lowApproved.value.fallbackAttestationDigest;assert.equal((await stage(mismatched.value)).status,409,'Another body/source/case set cannot reuse an approval signature');
  // A candidate staged before this deployment is not grandfathered at commit.
  env.FALLBACK_APPEALS_REQUIRED='false';const preGate=await makeAppealFixture('2026-11-08',27,false);assert.equal((await stage(preGate.value)).status,200);
  env.FALLBACK_APPEALS_REQUIRED='true';const preCommit=await commit(preGate.value);assert.equal(preCommit.status,409);assert.equal(preCommit.data.code,'FALLBACK_APPEALS_PENDING');
  assert.equal(db.prepare('SELECT digest FROM published_chapters WHERE chapter_id=?').get(preGate.value.id),undefined);
  assert.equal((await stage(first)).status,200,'An exact already-current historical version retains idempotent recovery');assert.equal((await commit(first)).status,200);
  console.log(JSON.stringify({realOrIndividuallyApproved:true,above80UnapprovedRejected:true,below80ApprovedPublishedWithAlarm:true,fullyRealNoFictionalAppeals:true,wrongVersionProofRejected:true,preDeploymentStageCannotBypassCommit:true,immutableApprovalBindings:true,legacyCurrentRetryPreserved:true,noRealModelOrProductionCalls:true}));
  console.log(JSON.stringify({ok:true,format:'usage-context-v1',wordCount:50,contexts:49,sharedContext:true,thirtyWordFullPublicationAndReadback:true,unlabelledThirtyRejected:true,legacyFiftyPreserved:true,canonicalFullEvidenceFixture:true,publicationReviewReceiptRequired:true,independentSignatureRequired:true,wrongSignatureRejected:true,currentReceiptlessRetryPreserved:true,oldProofCannotAuthorizeControlOnlyEvidence:true,headCannotDetectSameLengthCorruption:true,permanentGetShaReadbackRejectsCorruption:true,publicationAndSourceReadback:true,audioDefaultEmpty:true,oldAudioSelectionNotReinterpreted:true,pointAudioWhitelist:true,fixedVersionQuestionAndTest:true,twentyTargetsSevenOral:true,qualityWholeTranslationAndMissingOriginal:true,reviewContextExtraction:true,singleTenantStableReaderIdentity:true,graphFixtureRequests:graphRequests,noProductionWrites:true,noPaidCalls:true}));
}finally{globalThis.fetch=originalFetch;db.close();practice.close();}

import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';

const sourceURL=new URL('../worker/files/entry.js',import.meta.url),sourceText=await readFile(sourceURL,'utf8');
const registry=JSON.parse(await readFile(new URL('../protocol/series-storage.json',import.meta.url),'utf8'));
async function loadModule(policy=registry){
 const source=sourceText.replace("import {DurableObject,WorkerEntrypoint} from 'cloudflare:workers';","class WorkerEntrypoint {constructor(_ctx,env){this.env=env;}} class DurableObject {constructor(ctx,env){this.ctx=ctx;this.env=env;}}")
  .replace("'../src/shared/hf-object-store.mjs'",JSON.stringify(new URL('../worker/src/shared/hf-object-store.mjs',import.meta.url).href))
  .replace("'../src/shared/cloud-evidence.mjs'",JSON.stringify(new URL('../worker/src/shared/cloud-evidence.mjs',import.meta.url).href))
  .replace("import storagePolicy from '../../protocol/series-storage.json' with {type:'json'};",'const storagePolicy='+JSON.stringify(policy)+';');
 return import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
}
const module=await loadModule();
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const text=new TextEncoder(),samples=new Map(),calls=[],cases=[];
const projects=[['language','LanguageFiles','second-language-assets'],['algorithm','AlgorithmFiles','second-algorithm-assets'],['schedule','ScheduleFiles','second-schedule-archives'],['ledger','LedgerFiles','second-ledger-archives']];
const fixtureSecret='fixture_HF_secret_never_returned',kaggleToken='fixture_kaggle_token_never_returned';
const env=(implementation=module)=>{const value={HF_S3_ACCESS_KEY_ID:'HFAK_fixture',HF_S3_SECRET_ACCESS_KEY:{get:async()=>fixtureSecret},KAGGLE_API_TOKEN:{get:async()=>kaggleToken}},objects=new Map();value.FILE_PROCESSOR={getByName(project){if(!objects.has(project))objects.set(project,new implementation.ProjectFileProcessor({id:{name:project}},value));return objects.get(project);}};return value;};
const clients=new Map(projects.map(([project,name])=>[project,new module[name]({},env())]));
let originStatus=null,brokenContent=false,hugeHead=false,hugeBody=false,archiveStatus=null,archiveRedirect='https://storage.googleapis.com/private-fixture?capability=not-for-output';
let archiveProject='language',badManifest=false,badArchive=false,hugeManifest=false;
const packageBytes=Buffer.concat([Buffer.from('SECOND-SERIES-PRIVATE-ARCHIVE-V1\n'),Buffer.from('opaque archive synthetic fixture')]);
const stable=value=>JSON.stringify(Array.isArray(value)?value.map(item=>JSON.parse(stable(item))):value&&typeof value==='object'?Object.fromEntries(Object.keys(value).sort().map(key=>[key,JSON.parse(stable(value[key]))])):value);
let archiveContent,archiveDigest,archiveManifest;
function archiveFor(project){archiveContent={format:'second-series-kaggle-archive-v1',project,files:[{path:'fixture.txt',bytes:7,sha256:sha(Buffer.from('fixture'))}],totalBytes:7,fileCount:1};archiveDigest=sha(Buffer.from(stable(archiveContent)));archiveManifest={format:archiveContent.format,project,recordId:archiveDigest,content:archiveContent,package:{name:`record-${archiveDigest}.bin`,bytes:packageBytes.length,sha256:sha(packageBytes)}};return archiveDigest;}
archiveFor('language');
const priorFetch=globalThis.fetch;
globalThis.fetch=async(input,options={})=>{
 const request=input instanceof Request?input:new Request(input,options),url=new URL(request.url);
 calls.push({host:url.hostname,path:url.pathname,method:request.method,authorization:request.headers.get('authorization'),range:request.headers.get('range')});
 assert.equal(request.redirect,'manual');
 if(url.hostname==='s3.hf.co'){
  assert.match(request.headers.get('authorization')||'',/^AWS4-HMAC-SHA256 Credential=HFAK_fixture\//);
  assert(!request.headers.get('authorization').includes(fixtureSecret));
  const match=url.pathname.match(/^\/Gual-Wells\/(second-(?:language|algorithm)-assets|second-(?:schedule|ledger)-archives)\/objects\/([a-f0-9]{2})\/([a-f0-9]{64})\.bin$/);assert(match);
  const [bucket,digest]=[match[1],match[3]],key=bucket+'/'+digest;assert.equal(match[2],digest.slice(0,2));
  if(originStatus)return new Response(null,{status:originStatus});
  if(request.method==='PUT'){
   assert.equal(request.headers.get('if-none-match'),'*');const bytes=new Uint8Array(await request.arrayBuffer());assert.equal(sha(bytes),digest);
   if(samples.has(key))return new Response(null,{status:412});samples.set(key,bytes);return new Response(null,{status:200});
  }
  if(!samples.has(key))return new Response(null,{status:404});const bytes=samples.get(key);
  if(request.method==='HEAD')return new Response(null,{headers:{'content-length':String(hugeHead?24*1024*1024+1:bytes.length)}});
  if(hugeBody)return new Response(new Uint8Array(),{headers:{'content-length':String(24*1024*1024+1)}});
  return new Response(brokenContent?text.encode('corrupt'):bytes,{headers:{'content-length':String(brokenContent?7:bytes.length)}});
 }
 if(url.hostname==='www.kaggle.com'){
  assert.equal(request.headers.get('authorization'),'Bearer '+kaggleToken);assert.equal(request.method,'GET');assert.equal(url.searchParams.get('datasetVersionNumber'),'7');assert.equal(url.searchParams.get('raw'),'true');
  assert.match(url.pathname,new RegExp('^/api/v1/datasets/download/gualwells/second-series-'+archiveProject+'-archives/record-[a-f0-9]{64}\\.(?:manifest\\.json|bin)$'));
  if(archiveStatus)return new Response(null,{status:archiveStatus});
  const target=new URL(archiveRedirect);target.searchParams.set('file',url.pathname.endsWith('.manifest.json')?'manifest':'package');
  return new Response(null,{status:302,headers:{location:target.toString()}});
 }
 assert.equal(url.hostname,'storage.googleapis.com');assert.equal(request.headers.get('authorization'),null);assert.equal(request.headers.get('cookie'),null);
 if(url.searchParams.get('file')==='manifest'){
  if(hugeManifest)return new Response(null,{headers:{'content-length':String(1024*1024+1)}});
  const manifest=badManifest?{...archiveManifest,project:'another-project'}:archiveManifest,data=Buffer.from(JSON.stringify(manifest));
  return new Response(data,{headers:{'content-length':String(data.length)}});
 }
 const data=badArchive?Buffer.from('corrupt'):packageBytes;
 return new Response(data,{headers:{'content-length':String(data.length)}});
};
async function check(name,run){await run();cases.push(name);}
try{
 await check('no public HTTP, database binding, default route or cross-project gateway binding',async()=>{
  const config=JSON.parse(await readFile(new URL('../worker/files/wrangler.jsonc',import.meta.url),'utf8'));
  assert.equal(config.workers_dev,false);assert.equal(config.preview_urls,false);assert.equal(config.d1_databases,undefined);assert.equal(config.services,undefined);assert.equal(config.kv_namespaces,undefined);
  for(const method of ['GET','POST','PUT','DELETE']){assert.equal((await module.default.fetch(new Request('https://private.invalid/?project=ledger',{method}))).status,404);for(const client of clients.values())assert.equal((await client.fetch(new Request('https://private.invalid/'+method,{method}))).status,404);}
 });
 await check('wrappers only forward fixed-project RPC and DO identity cannot be supplied or changed by callers',async()=>{
  const config=JSON.parse(await readFile(new URL('../worker/files/wrangler.jsonc',import.meta.url),'utf8'));
  assert.deepEqual(config.durable_objects.bindings,[{name:'FILE_PROCESSOR',class_name:'ProjectFileProcessor'}]);assert.deepEqual(config.migrations,[{tag:'v1-project-file-processor',new_sqlite_classes:['ProjectFileProcessor']}]);
  assert(!/ctx\.storage|this\.ctx\.storage|setAlarm|setInterval|setTimeout/.test(sourceText));
  for(const name of [undefined,'paper','../../language'])assert.throws(()=>new module.ProjectFileProcessor({id:{name}},{}),/请求无效/);
  for(const [project,name] of projects){const seen=[];const binding={FILE_PROCESSOR:{getByName(value){seen.push(value);return {put:async(...args)=>({forwarded:true,args}),archiveEvidence:async(...args)=>({forwarded:true,args})};}}};const client=new module[name]({},binding),value={opaque:'no parsing or hashing in wrapper'};assert.equal((await client.put(value)).forwarded,true);assert.equal((await client.archiveEvidence(value)).forwarded,true);assert.deepEqual(seen,[project,project]);}
 });
 await check('four named capabilities write only their fixed private buckets and return verified receipts',async()=>{
  for(const [project,,bucket] of projects){const bytes=text.encode(project+' dedicated fixture'),digest=sha(bytes),client=clients.get(project);const receipt=await client.put(bytes,'application/octet-stream');assert.equal(receipt.digest,digest);assert.equal(receipt.location.bucket,bucket);assert.equal(receipt.location.namespace,'Gual-Wells');assert.equal((await client.head(digest)).bytes,bytes.length);assert.deepEqual((await client.get(digest)).bytes,bytes);assert(samples.has(bucket+'/'+digest));const reused=await client.put(bytes);assert.equal(reused.reused,true);}
  assert(!calls.some(call=>['DELETE','LIST'].includes(call.method)));
 });
 await check('registry is the fixed bucket authority; planned/off or another project allocation blocks writes without blocking historical reads',async()=>{
  assert.equal(registry.filePools.huggingface.resourceId,'hf-private-account');assert.equal(registry.filePools.huggingface.namespace,'Gual-Wells');assert.deepEqual(Object.keys(registry.filePools.huggingface.buckets).sort(),projects.map(row=>row[0]).sort());assert(!sourceText.includes("const BUCKETS="));
  const digest=sha(text.encode('language dedicated fixture'));
  for(const mutation of [policy=>{policy.resources.find(value=>value.id==='hf-private-account').state='planned';},policy=>{policy.resources.find(value=>value.id==='hf-private-account').state='off';},policy=>{policy.allocations.language.find(value=>value.resourceId==='hf-private-account').mode='planned';},policy=>{policy.allocations.language=policy.allocations.language.filter(value=>value.resourceId!=='hf-private-account');}]){
   const policy=structuredClone(registry);mutation(policy);const scoped=await loadModule(policy),client=new scoped.LanguageFiles({},env(scoped)),before=calls.length;
   await assert.rejects(()=>client.put(text.encode('policy must block new writes')),error=>error.code==='FILES_UNAVAILABLE');assert.equal(calls.length,before);assert.equal((await client.head(digest)).bytes,text.encode('language dedicated fixture').length);assert.deepEqual((await client.get(digest)).bytes,text.encode('language dedicated fixture'));
  }
  const {seriesStoragePolicy}=await import('../worker/src/series-storage.js');const publicPolicy=JSON.stringify(seriesStoragePolicy('language'));assert(!publicPolicy.includes('second-language-assets'));assert(!publicPolicy.includes('filePools'));
 });
 await check('a valid digest from another project is absent, never read from another bucket',async()=>{
  const digest=sha(text.encode('ledger dedicated fixture'));assert.equal(await clients.get('language').get(digest),null);assert.equal(await clients.get('algorithm').head(digest),null);
  assert(!calls.slice(-2).some(call=>call.path.includes('/second-ledger-archives/')));
 });
 await check('caller-selected project, path, URL, prototype and extra arguments fail before I/O',async()=>{
  const client=clients.get('language'),before=calls.length,digest='a'.repeat(64);
  for(const value of [{digest,project:'ledger'},'../ledger','https://s3.hf.co/other','A'.repeat(64),{toString:()=>digest}]){await assert.rejects(()=>client.get(value),/请求无效/);await assert.rejects(()=>client.head(value),/请求无效/);}
  await assert.rejects(()=>client.get(digest,{bucket:'other'}),/请求无效/);await assert.rejects(()=>client.put({project:'ledger',bytes:new Uint8Array(2)}),/请求无效/);
  await assert.rejects(()=>client.put(new Uint8Array(1),'audio/mpeg\r\nAuthorization: injected'),/请求无效/);
  for(const value of [{version:7,digest,project:'ledger'},{version:'7',digest},{version:7,digest,url:'https://evil.invalid/'},Object.assign(Object.create({project:'ledger'}),{version:7,digest})])await assert.rejects(()=>client.getArchive(value),/请求无效/);
  assert.equal(calls.length,before);
 });
 await check('24MiB bound and failed authentication cannot return a false missing/receipt or secret-bearing exception',async()=>{
  const client=clients.get('language'),digest=sha(text.encode('language dedicated fixture')),before=calls.length;
  await assert.rejects(()=>client.put(new Uint8Array(24*1024*1024+1)),/请求无效/);assert.equal(calls.length,before);
  for(const status of [401,403,429,500]){originStatus=status;await assert.rejects(()=>client.get(digest),error=>error.code==='FILES_UNAVAILABLE'&&!error.message.includes(fixtureSecret));await assert.rejects(()=>client.put(new Uint8Array(1)),error=>error.code==='FILES_UNAVAILABLE');}originStatus=null;
  const inaccessibleEnv=env();inaccessibleEnv.HF_S3_ACCESS_KEY_ID={get:async()=>{throw Error(fixtureSecret+' https://secret.invalid/');}};const inaccessible=new module.LanguageFiles({},inaccessibleEnv);
  await assert.rejects(()=>inaccessible.get(digest),error=>error.code==='FILES_UNAVAILABLE'&&!JSON.stringify(error).includes(fixtureSecret)&&!error.message.includes('secret.invalid'));
  hugeHead=true;await assert.rejects(()=>client.head(digest),/暂不可用/);hugeHead=false;hugeBody=true;await assert.rejects(()=>client.get(digest),/暂不可用/);hugeBody=false;
  brokenContent=true;await assert.rejects(()=>client.get(digest),/暂不可用/);brokenContent=false;
 });
 await check('readRange is explicitly buffered SHA-verified then RPC byte-streamed, with exact full/open/suffix ranges',async()=>{
  const client=clients.get('language'),bytes=text.encode('language dedicated fixture'),digest=sha(bytes);
  for(const [range,expected,status] of [[null,bytes,200],['bytes=1-4',bytes.slice(1,5),206],['bytes=8-',bytes.slice(8),206],['bytes=-5',bytes.slice(-5),206]]){
   const value=await client.readRange(digest,range,'audio/mpeg');assert.equal(value.readMode,'buffered-verified');assert.equal(value.status,status);assert.equal(value.headers['cache-control'],'private, no-store');
   const reader=value.body.getReader({mode:'byob'}),parts=[];for(;;){const result=await reader.read(new Uint8Array(64));if(result.value)parts.push(...result.value);if(result.done)break;}assert.deepEqual(new Uint8Array(parts),expected);
  }
  for(const range of ['bytes=999-','bytes=-0','bytes=1-2,4-5','bogus']){const value=await client.readRange(digest,range);assert.equal(value.status,416);assert.equal(value.headers['content-range'],`bytes */${bytes.length}`);assert.equal((await new Response(value.body).arrayBuffer()).byteLength,0);}
  assert.equal(await client.readRange('0'.repeat(64),'bytes=1-2'),null);
 });
 await check('evidence gzip/hash verification executes in project DO and policy stops new archives while preserving old evidence reads',async()=>{
  const response={id:'resp_fixture',status:'completed',output:[{type:'message',role:'assistant',content:[{type:'output_text',text:'Synthetic completed answer'}]}]},responseJSON=JSON.stringify(response),rawStream='event: completed\ndata: synthetic original\n',streamDigest=sha(text.encode(rawStream)),request={responseJSON,rawStream,streamDigest,responseId:response.id};
  const client=clients.get('language'),receipt=await client.archiveEvidence(request);assert.equal(receipt.verified,true);assert.equal(receipt.streamDigest,streamDigest);assert.equal(receipt.responseDigest,sha(text.encode(responseJSON)));assert(receipt.bytes>0);
  const query={digest:receipt.digest,streamDigest,responseId:response.id},read=await client.readEvidence(query);assert.equal(read.verified,true);assert.deepEqual(read.response,response);
  for(const bad of [{...request,project:'ledger'},{...request,streamDigest:'0'.repeat(64)}])await assert.rejects(()=>client.archiveEvidence(bad),error=>error.code==='FILES_UNAVAILABLE');
  await assert.rejects(()=>client.readEvidence({...query,responseId:'wrong'}),error=>error.code==='FILES_UNAVAILABLE');await assert.rejects(()=>client.archiveEvidence(request,{project:'ledger'}),/请求无效/);
  const policy=structuredClone(registry);policy.allocations.language.find(value=>value.resourceId==='hf-private-account').mode='planned';const scoped=await loadModule(policy),readonly=new scoped.LanguageFiles({},env(scoped)),before=calls.length;await assert.rejects(()=>readonly.archiveEvidence(request),error=>error.code==='FILES_UNAVAILABLE');assert.equal(calls.length,before);assert.deepEqual((await readonly.readEvidence(query)).response,response);
 });
 await check('Kaggle downloads are fixed project/version/record, strip bearer at Google and verify both manifest identity and container SHA',async()=>{
  for(const [project] of projects){archiveProject=project;const digest=archiveFor(project),value=await clients.get(project).getArchive({version:7,digest});assert.equal(value.digest,digest);assert.equal(value.packageDigest,sha(packageBytes));assert.deepEqual(Buffer.from(value.bytes),packageBytes);assert.equal(value.manifest.project,project);}
  assert(!JSON.stringify(cases).includes(kaggleToken));
 });
 await check('Kaggle authentication, redirects, oversized manifests and corrupted/mismatched archives fail generically',async()=>{
  archiveProject='language';const client=clients.get('language'),digest=archiveFor('language');
  for(const status of [401,403,404,429,500]){archiveStatus=status;await assert.rejects(()=>client.getArchive({version:7,digest}),/暂不可用/);}archiveStatus=null;
  for(const url of ['http://storage.googleapis.com/x','https://storage.googleapis.com.evil.invalid/x','https://user:pass@storage.googleapis.com/x','https://storage.googleapis.com:444/x']){archiveRedirect=url;await assert.rejects(()=>client.getArchive({version:7,digest}),/暂不可用/);}archiveRedirect='https://storage.googleapis.com/private-fixture?capability=not-for-output';
  badManifest=true;await assert.rejects(()=>client.getArchive({version:7,digest}),/暂不可用/);badManifest=false;
  badArchive=true;await assert.rejects(()=>client.getArchive({version:7,digest}),/暂不可用/);badArchive=false;
  hugeManifest=true;await assert.rejects(()=>client.getArchive({version:7,digest}),/暂不可用/);hugeManifest=false;
 });
 console.log(JSON.stringify({passed:cases.length,cases,network:'fixture only',externalRequests:0,paidCalls:0,rpcBoundary:'Official RPC byte streams supported; fixture tests exercise byte-oriented serialization shape, not deployed RPC'},null,2));
}finally{globalThis.fetch=priorFetch;}

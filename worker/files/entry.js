import {DurableObject,WorkerEntrypoint} from 'cloudflare:workers';
import {hfObjectStore} from '../src/shared/hf-object-store.mjs';
import {archiveCloudEvidenceFile,readCloudEvidenceFile} from '../src/shared/cloud-evidence.mjs';
import storagePolicy from '../../protocol/series-storage.json' with {type:'json'};

// Content capabilities are held by project Workers, never by the allocation administrator.
// This Worker holds no business database, public endpoint, arbitrary file path or deletion capability.
// Its SQLite-backed Durable Objects provide CPU for hashing and compression, not business storage.
const MAX_BYTES=24*1024*1024,MAX_MANIFEST=1024*1024;
const KAGGLE_OWNER='gualwells',ARCHIVE_FORMAT='second-series-kaggle-archive-v1';
const ARCHIVE_MAGIC=new TextEncoder().encode('SECOND-SERIES-PRIVATE-ARCHIVE-V1\n');
const filePool=storagePolicy.filePools?.huggingface;
const poolName=value=>typeof value==='string'&&/^[A-Za-z0-9][A-Za-z0-9._-]{0,95}$/.test(value)&&!value.includes('..');
function projectPool(project){if(!['language','algorithm','schedule','ledger'].includes(project)||filePool?.resourceId!=='hf-private-account'||!poolName(filePool.namespace)||!poolName(filePool.buckets?.[project]))throw unavailable();return {namespace:filePool.namespace,bucket:filePool.buckets[project]};}
function permitNewWrite(project){const resource=storagePolicy.resources?.filter(value=>value.id==='hf-private-account');const allocations=storagePolicy.allocations?.[project];if(resource?.length!==1||resource[0].state!=='active'||resource[0].provider!=='huggingface'||!Array.isArray(allocations)||!allocations.some(value=>value.resourceId==='hf-private-account'&&value.mode==='current'))throw unavailable();}
const stores=new WeakMap(),encoder=new TextEncoder();
const plain=value=>value!==null&&typeof value==='object'&&!Array.isArray(value)&&Object.getPrototypeOf(value)===Object.prototype;
const validDigest=value=>typeof value==='string'&&/^[a-f0-9]{64}$/.test(value);
const digestOf=async value=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',value))).map(byte=>byte.toString(16).padStart(2,'0')).join('');
const canonical=value=>JSON.stringify(Array.isArray(value)?value.map(item=>JSON.parse(canonical(item))):value&&typeof value==='object'?Object.fromEntries(Object.keys(value).sort().map(key=>[key,JSON.parse(canonical(value[key]))])):value);
const invalid=()=>{throw Error('文件请求无效');};
const unavailable=()=>{const error=Error('文件服务暂不可用，原件状态未改变');error.code='FILES_UNAVAILABLE';return error;};
const notFound=()=>new Response('Not found',{status:404,headers:{'cache-control':'no-store'}});
function mime(value){if(typeof value!=='string'||value.length>160||! /^[A-Za-z0-9!#$&^_.+-]+\/[A-Za-z0-9!#$&^_.+-]+(?:; ?charset=[A-Za-z0-9-]+)?$/.test(value))invalid();return value;}
function contentBytes(value){const bytes=value instanceof Uint8Array?value:value instanceof ArrayBuffer?new Uint8Array(value):null;if(!bytes||bytes.byteLength>MAX_BYTES)invalid();return bytes;}
function scopedStore(env,project){
 let projects=stores.get(env);if(!projects){projects=new Map();stores.set(env,projects);}
 if(!projects.has(project))projects.set(project,hfObjectStore({...projectPool(project),accessKeyId:env.HF_S3_ACCESS_KEY_ID,secretAccessKey:env.HF_S3_SECRET_ACCESS_KEY}));
 return projects.get(project);
}
async function protectedOperation(operation){try{return await operation();}catch{throw unavailable();}}
async function head(env,project,digest,extra){
 if(!validDigest(digest)||extra.length)invalid();
 return protectedOperation(async()=>{const value=await scopedStore(env,project).contentHead(digest);return value?{digest,bytes:value.bytes}:null;});
}
async function get(env,project,digest,extra){
 if(!validDigest(digest)||extra.length)invalid();
 return protectedOperation(async()=>{const value=await scopedStore(env,project).getContent(digest);if(!value)return null;return {digest,bytes:new Uint8Array(await value.arrayBuffer())};});
}
async function put(env,project,value,type,extra){
 if(extra.length)invalid();const bytes=contentBytes(value);mime(type);
 return protectedOperation(()=>{permitNewWrite(project);return scopedStore(env,project).putContent(bytes,type);});
}
function rangeOf(value,length){
 if(value===null)return null;
 const match=value.match(/^bytes=(\d*)-(\d*)$/);if(!match||!match[1]&&!match[2]||length===0)return false;
 const first=match[1]?Number(match[1]):Math.max(0,length-Number(match[2]));
 const last=match[1]?(match[2]?Math.min(length-1,Number(match[2])):length-1):length-1;
 return !Number.isSafeInteger(first)||!Number.isSafeInteger(last)||first<0||first>last||first>=length?false:{first,last};
}
function byteStream(bytes){return new ReadableStream({type:'bytes',start(controller){if(bytes.byteLength)controller.enqueue(bytes);controller.close();}});}
async function readRange(env,project,digest,range,type,extra){
 if(!validDigest(digest)||range!==null&&(typeof range!=='string'||range.length>160)||extra.length)invalid();mime(type);
 const value=await get(env,project,digest,[]);if(!value)return null;
 const length=value.bytes.byteLength,requested=rangeOf(range,length);
 const headers={'content-type':type,'cache-control':'private, no-store','accept-ranges':'bytes','x-content-type-options':'nosniff'};
 // Existing CAS adapter buffers and verifies the complete SHA first. RPC then transports
 // a byte stream; this is explicitly not a stream directly from the storage origin.
 if(requested===false)return {status:416,headers:{...headers,'content-range':`bytes */${length}`,'content-length':'0'},body:byteStream(new Uint8Array()),readMode:'buffered-verified'};
 const bytes=requested?value.bytes.slice(requested.first,requested.last+1):value.bytes;
 return {status:requested?206:200,headers:{...headers,'content-length':String(bytes.byteLength),...(requested?{'content-range':`bytes ${requested.first}-${requested.last}/${length}`}:{})},body:byteStream(bytes),readMode:'buffered-verified'};
}
async function secret(binding){const value=typeof binding==='string'?binding:typeof binding?.get==='function'?await binding.get():null;if(typeof value!=='string'||! /^[A-Za-z0-9._-]{16,4096}$/.test(value.trim()))throw unavailable();return value.trim();}
function signedGoogleURL(value){let url;try{url=new URL(value);}catch{throw unavailable();}if(url.protocol!=='https:'||url.hostname!=='storage.googleapis.com'||url.username||url.password||url.port&&url.port!=='443')throw unavailable();return url.toString();}
async function boundedBytes(response,max){
 if(response.status!==200)throw unavailable();
 const stated=response.headers.get('content-length');if(stated!==null&&(!/^\d+$/.test(stated)||Number(stated)>max))throw unavailable();
 if(!response.body)return new Uint8Array();const reader=response.body.getReader(),parts=[];let total=0;
 for(;;){const {done,value}=await reader.read();if(done)break;total+=value.byteLength;if(total>max){await reader.cancel();throw unavailable();}parts.push(value);}
 if(stated!==null&&total!==Number(stated))throw unavailable();
 const bytes=new Uint8Array(total);let offset=0;for(const part of parts){bytes.set(part,offset);offset+=part.byteLength;}return bytes;
}
async function archiveFile(project,version,file,token,max){
 const dataset=`second-series-${project}-archives`;
 const url=`https://www.kaggle.com/api/v1/datasets/download/${KAGGLE_OWNER}/${dataset}/${file}?datasetVersionNumber=${version}&raw=true`;
 let response=await fetch(url,{headers:{authorization:`Bearer ${token}`,'accept-encoding':'identity'},redirect:'manual',signal:AbortSignal.timeout(60000)});
 if([302,303,307,308].includes(response.status)){
  const target=signedGoogleURL(response.headers.get('location'));
  // Signed download capability only. Account bearer and cookies never cross origins.
  response=await fetch(target,{headers:{'accept-encoding':'identity'},redirect:'manual',signal:AbortSignal.timeout(60000)});
 }
 return boundedBytes(response,max);
}
async function getArchive(env,project,value,extra){
 if(!plain(value)||extra.length||Object.keys(value).sort().join(',')!=='digest,version'||!validDigest(value.digest)||!Number.isSafeInteger(value.version)||value.version<1)invalid();
 return protectedOperation(async()=>{
  const token=await secret(env.KAGGLE_API_TOKEN),record=value.digest;
  const raw=await archiveFile(project,value.version,`record-${record}.manifest.json`,token,MAX_MANIFEST);
  const manifest=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(raw));
  if(!plain(manifest)||manifest.format!==ARCHIVE_FORMAT||manifest.project!==project||manifest.recordId!==record||!plain(manifest.content)||manifest.content.format!==ARCHIVE_FORMAT||manifest.content.project!==project||await digestOf(encoder.encode(canonical(manifest.content)))!==record)throw unavailable();
  const pkg=manifest.package;
  if(!plain(pkg)||pkg.name!==`record-${record}.bin`||!validDigest(pkg.sha256)||!Number.isSafeInteger(pkg.bytes)||pkg.bytes<ARCHIVE_MAGIC.length||pkg.bytes>MAX_BYTES)throw unavailable();
  const bytes=await archiveFile(project,value.version,pkg.name,token,MAX_BYTES);
  if(bytes.byteLength!==pkg.bytes||!ARCHIVE_MAGIC.every((byte,index)=>bytes[index]===byte)||await digestOf(bytes)!==pkg.sha256)throw unavailable();
  return {digest:record,packageDigest:pkg.sha256,version:value.version,bytes,manifest};
 });
}

// One named object per project receives heavy hashing, compression and byte verification.
// It deliberately never writes Durable Object SQL/KV storage or schedules alarms.
export class ProjectFileProcessor extends DurableObject {
 #project;
 constructor(ctx,env){super(ctx,env);const project=ctx.id.name;if(!['language','algorithm','schedule','ledger'].includes(project))invalid();this.#project=project;}
 fetch(){return notFound();}
 async head(digest,...extra){return await head(this.env,this.#project,digest,extra);}
 async get(digest,...extra){return await get(this.env,this.#project,digest,extra);}
 async put(bytes,type='application/octet-stream',...extra){return await put(this.env,this.#project,bytes,type,extra);}
 async readRange(digest,range=null,type='application/octet-stream',...extra){return await readRange(this.env,this.#project,digest,range,type,extra);}
 async getArchive(value,...extra){return await getArchive(this.env,this.#project,value,extra);}
 async archiveEvidence(request,...extra){
  if(extra.length)invalid();
  return protectedOperation(async()=>{permitNewWrite(this.#project);return archiveCloudEvidenceFile({filesBinding:evidenceStore(this.env,this.#project),request});});
 }
 async readEvidence(request,...extra){
  if(extra.length)invalid();return protectedOperation(()=>readCloudEvidenceFile({filesBinding:evidenceStore(this.env,this.#project),request}));
 }
}
function evidenceStore(env,project){return {put:(bytes,type)=>put(env,project,bytes,type,[]),get:digest=>get(env,project,digest,[])};}
function processor(env,project){if(typeof env.FILE_PROCESSOR?.getByName!=='function')throw unavailable();return env.FILE_PROCESSOR.getByName(project);}
class PrivateFiles extends WorkerEntrypoint {fetch(){return notFound();}}
export class LanguageFiles extends PrivateFiles {
 async head(digest,...extra){return await processor(this.env,'language').head(digest,...extra);}
 async get(digest,...extra){return await processor(this.env,'language').get(digest,...extra);}
 async put(bytes,type='application/octet-stream',...extra){return await processor(this.env,'language').put(bytes,type,...extra);}
 async readRange(digest,range=null,type='application/octet-stream',...extra){return await processor(this.env,'language').readRange(digest,range,type,...extra);}
 async getArchive(value,...extra){return await processor(this.env,'language').getArchive(value,...extra);}
 async archiveEvidence(request,...extra){return await processor(this.env,'language').archiveEvidence(request,...extra);}
 async readEvidence(request,...extra){return await processor(this.env,'language').readEvidence(request,...extra);}
}
export class AlgorithmFiles extends PrivateFiles {
 async head(digest,...extra){return await processor(this.env,'algorithm').head(digest,...extra);}
 async get(digest,...extra){return await processor(this.env,'algorithm').get(digest,...extra);}
 async put(bytes,type='application/octet-stream',...extra){return await processor(this.env,'algorithm').put(bytes,type,...extra);}
 async readRange(digest,range=null,type='application/octet-stream',...extra){return await processor(this.env,'algorithm').readRange(digest,range,type,...extra);}
 async getArchive(value,...extra){return await processor(this.env,'algorithm').getArchive(value,...extra);}
 async archiveEvidence(request,...extra){return await processor(this.env,'algorithm').archiveEvidence(request,...extra);}
 async readEvidence(request,...extra){return await processor(this.env,'algorithm').readEvidence(request,...extra);}
}
export class ScheduleFiles extends PrivateFiles {
 async head(digest,...extra){return await processor(this.env,'schedule').head(digest,...extra);}
 async get(digest,...extra){return await processor(this.env,'schedule').get(digest,...extra);}
 async put(bytes,type='application/octet-stream',...extra){return await processor(this.env,'schedule').put(bytes,type,...extra);}
 async readRange(digest,range=null,type='application/octet-stream',...extra){return await processor(this.env,'schedule').readRange(digest,range,type,...extra);}
 async getArchive(value,...extra){return await processor(this.env,'schedule').getArchive(value,...extra);}
 async archiveEvidence(request,...extra){return await processor(this.env,'schedule').archiveEvidence(request,...extra);}
 async readEvidence(request,...extra){return await processor(this.env,'schedule').readEvidence(request,...extra);}
}
export class LedgerFiles extends PrivateFiles {
 async head(digest,...extra){return await processor(this.env,'ledger').head(digest,...extra);}
 async get(digest,...extra){return await processor(this.env,'ledger').get(digest,...extra);}
 async put(bytes,type='application/octet-stream',...extra){return await processor(this.env,'ledger').put(bytes,type,...extra);}
 async readRange(digest,range=null,type='application/octet-stream',...extra){return await processor(this.env,'ledger').readRange(digest,range,type,...extra);}
 async getArchive(value,...extra){return await processor(this.env,'ledger').getArchive(value,...extra);}
 async archiveEvidence(request,...extra){return await processor(this.env,'ledger').archiveEvidence(request,...extra);}
 async readEvidence(request,...extra){return await processor(this.env,'ledger').readEvidence(request,...extra);}
}
export default {fetch(){return notFound();}};

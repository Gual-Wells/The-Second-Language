import {permanentBucket,chapterText} from './storage.js';
import {recipient,certificationFor,certificationView} from './chapter-certifications.js';
import {canonical,contentIdentityContent,scrollContentSHA} from '../../protocol/scroll-production-contract.mjs';
import {isCurrentAffairsRevision} from './current-affairs.js';
const projectScroll="EXISTS(SELECT 1 FROM chapter_certifications scope_cert JOIN formal_chapter_sources scope_source ON scope_source.digest=scope_cert.chapter_digest AND scope_source.policy='current-affairs-v1' WHERE scope_cert.id=scroll_jobs.certification_id)";

const json=(v,status=200)=>Response.json(v,{status,headers:{'cache-control':'private, no-store','x-content-type-options':'nosniff'}});
const uuid=v=>typeof v==='string'&&/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/.test(v);
const digest=v=>typeof v==='string'&&/^[a-f0-9]{64}$/.test(v);
const hash=async v=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',typeof v==='string'?new TextEncoder().encode(v):v))].map(x=>x.toString(16).padStart(2,'0')).join('');
const stages=['source','art','materials','layout','review','archive','complete'];
const inertMimes=new Set(['application/json','application/zip','application/gzip','application/octet-stream','application/pdf','text/plain','text/markdown','image/png','image/webp','image/jpeg','font/otf','font/ttf','font/woff','font/woff2','model/gltf-binary']);
const shortText=(v,n=2400)=>typeof v==='string'&&v.length>0&&v.length<=n;
const lineArray=v=>Array.isArray(v)&&v.length>0&&v.length<=60&&v.every(x=>shortText(x));
const validCopy=c=>c&&['rubric','institution','artTitle','status'].every(k=>shortText(c[k]))&&['verse','colophon','sealLegends'].every(k=>lineArray(c[k]));
const dimension=v=>Number.isSafeInteger(v)&&v>=64&&v<=4096;
const date=v=>v==null?null:new Date(v).toISOString();
export const scrollJobView=r=>r?{id:r.id,certificationId:r.certification_id,status:r.status==='complete'?'ready':r.status,stage:r.stage,createdAt:date(r.created_at),updatedAt:date(r.updated_at),readyAt:date(r.ready_at),claimedAt:date(r.claimed_at),contentSHA:r.content_sha||null,error:r.error||null}:null;
async function stored(bucket,id){if(!digest(id))throw Error('资产摘要无效');const r=await bucket.getContent(id);if(!r)throw Error('永久原件暂不可用');return r;}
async function read(bucket,id){return(await stored(bucket,id)).json();}
function baseFiles(base){
 if(base?.schema!=='second-language.scroll-base-recovery.v1'||!Array.isArray(base.files)||!base.files.length||base.files.length>4096)throw Error('恢复基座清单无效');
 const paths=new Set();for(const f of base.files){if(!f||typeof f.path!=='string'||!f.path||f.path.length>500||f.path.split(/[\\/]/).some(p=>!p||p==='.'||p==='..')||paths.has(f.path)||!digest(f.digest)||!Number.isSafeInteger(f.bytes)||f.bytes<1||f.bytes>24*1024*1024)throw Error('恢复基座文件无效');paths.add(f.path);}return base.files;
}
function pngDimensions(bytes){const view=new DataView(bytes),png=new Uint8Array(bytes);if(bytes.byteLength<33||png.slice(0,8).join(',')!=='137,80,78,71,13,10,26,10'||String.fromCharCode(...png.slice(12,16))!=='IHDR')throw Error('展示PNG文件格式无效');return[view.getUint32(16),view.getUint32(20)];}
function verifyWorkZip(bytes,files,{partial=false}={}){
 const v=new DataView(bytes);let end=-1;
 for(let i=bytes.byteLength-22;i>=Math.max(0,bytes.byteLength-65557);i--)if(v.getUint32(i,true)===0x06054b50&&i+22+v.getUint16(i+20,true)===bytes.byteLength){end=i;break;}
 if(end<0||v.getUint16(end+4,true)!==0||v.getUint16(end+6,true)!==0)throw Error('原生ZIP归档格式无效');
 const count=v.getUint16(end+10,true),size=v.getUint32(end+12,true),start=v.getUint32(end+16,true),entries=new Map();let cursor=start,total=0;
 if(!count||count>4096||start+size!==end)throw Error('原生ZIP目录无效');
 for(let i=0;i<count;i++){
  if(cursor+46>end||v.getUint32(cursor,true)!==0x02014b50)throw Error('原生ZIP目录无效');
  const flags=v.getUint16(cursor+8,true),method=v.getUint16(cursor+10,true),compressed=v.getUint32(cursor+20,true),length=v.getUint32(cursor+24,true),nameSize=v.getUint16(cursor+28,true),extra=v.getUint16(cursor+30,true),comment=v.getUint16(cursor+32,true),local=v.getUint32(cursor+42,true);
  if((flags&1)||![0,8].includes(method)||cursor+46+nameSize+extra+comment>end||local+30>start||v.getUint32(local,true)!==0x04034b50||local+30+v.getUint16(local+26,true)+v.getUint16(local+28,true)+compressed>start)throw Error('原生ZIP目录无效');
  const name=new TextDecoder('utf-8',{fatal:true}).decode(new Uint8Array(bytes,cursor+46,nameSize));if(!name||name.startsWith('/')||name.includes('\\')||name.split('/').some(x=>!x||x==='.'||x==='..')||entries.has(name))throw Error('原生ZIP路径无效');entries.set(name,length);total+=length;cursor+=46+nameSize+extra+comment;
 }
 if(cursor!==end||total>256*1024*1024||(!partial&&(!entries.has('recoverable/RESTORE.md')||!entries.has('recoverable/protocol/scroll-production-contract.mjs')))||(partial&&entries.size!==files.length))throw Error('原生制作恢复目录无效');
 for(const f of files.filter(f=>f.role!=='archive'))if(entries.get(f.path)!==f.bytes)throw Error('原生制作原件与清单不一致');
}
async function workRecovery(bucket,manifest){
 const archive=manifest.files?.find(f=>f.digest===manifest.recovery?.workArchiveDigest);if(archive?.role==='archive'){if(manifest.files.filter(f=>f.role==='archive').length!==1)throw Error('原生恢复分卷清单无效');return null;}
 if(archive?.role!=='work-recovery'||archive.mime!=='application/json')throw Error('原生恢复索引无效');
 const index=await read(bucket,archive.digest);if(index?.schema!=='second-language.scroll-work-recovery.v1'||!Array.isArray(index.volumes)||!index.volumes.length||index.volumes.length>128)throw Error('原生恢复分卷清单无效');
 const union=new Map(),volumes=new Set();for(const volume of index.volumes){
  if(!volume||!digest(volume.digest)||volumes.has(volume.digest)||!Number.isSafeInteger(volume.bytes)||volume.bytes<1||volume.bytes>20*1024*1024||!manifest.files.some(f=>f.role==='archive'&&f.path===volume.path&&f.digest===volume.digest&&f.bytes===volume.bytes&&f.mime==='application/zip')||!Array.isArray(volume.entries)||!volume.entries.length||volume.entries.length>4096)throw Error('原生恢复分卷清单无效');
  volumes.add(volume.digest);for(const entry of volume.entries){if(!entry||typeof entry.path!=='string'||!entry.path||entry.path.startsWith('/')||entry.path.includes('\\')||entry.path.split('/').some(x=>!x||x==='.'||x==='..')||union.has(entry.path)||!digest(entry.digest)||!Number.isSafeInteger(entry.bytes)||entry.bytes<0)throw Error('原生恢复分卷原件无效');union.set(entry.path,entry);}
 }
 if(manifest.files.filter(f=>f.role==='archive').length!==volumes.size||!union.has('recoverable/RESTORE.md')||!union.has('recoverable/protocol/scroll-production-contract.mjs'))throw Error('原生恢复分卷不完整');
 for(const file of manifest.files.filter(f=>!['archive','work-recovery'].includes(f.role))){const entry=union.get(file.path);if(entry?.digest!==file.digest||entry.bytes!==file.bytes)throw Error('原生恢复分卷与成品原件不一致');}
 return index;
}
async function expired(db,now){
 await db.batch([
  db.prepare("UPDATE scroll_external_calls SET state='outcome_unknown',updated_at=? WHERE state='calling' AND job_id IN (SELECT id FROM scroll_jobs WHERE status='running' AND lease_until<? AND "+projectScroll+")").bind(now,now),
  db.prepare("UPDATE scroll_jobs SET status=CASE WHEN EXISTS(SELECT 1 FROM scroll_external_calls x WHERE x.job_id=scroll_jobs.id AND x.state IN ('calling','outcome_unknown')) THEN 'attention' ELSE 'pending' END,claim=NULL,lease_until=NULL,error='制作中断，保留最近检查点',updated_at=? WHERE status='running' AND lease_until<? AND "+projectScroll).bind(now,now)
 ]);
}
async function rowFor(db,id){return db.prepare('SELECT * FROM scroll_jobs WHERE id=? AND recipient_id=?').bind(id,recipient.id).first();}
async function validLease(row,claim){return row?.status==='running'&&row.claim===await hash(String(claim||''))&&row.lease_until>=Date.now();}

// A package is data. All executable behaviour comes from the versioned reader.
// Every dependency is stored by full content digest; no arbitrary script/URL is
// accepted from an art plan or package producer.
export async function validateScrollPackage(bucket,manifest,cert,verified=null,{specimen=false}={}){
 // Only isolated producer crosschecks opt into specimen data. No HTTP route
 // accepts this flag, and the production path always requires a real UUID.
 if(specimen?(cert.id!==null||cert.passedAt!==null):!uuid(cert.id))throw Error('封存包认证作用域无效');
 if(manifest?.schema!=='second-language.scroll-package.v1'||manifest.certificationId!==cert.id||manifest.chapterId!==cert.chapterId||manifest.chapterDigest!==cert.chapterDigest||manifest.recipientId!==cert.recipientId||manifest.passedAt!==cert.passedAt||!digest(manifest.contentSHA)||!digest(manifest.candidateDigest)||!digest(manifest.reviewDigest))throw Error('封存包身份不一致');
 if(!Array.isArray(manifest.files)||manifest.files.length<8||manifest.files.length>3000)throw Error('封存文件清单无效');
 const recoveryIndex=await workRecovery(bucket,manifest),paths=new Set(),digests=new Set(),imageDimensions=new Map();let total=0;
 for(const f of manifest.files){
  if(!f||typeof f.path!=='string'||f.path.length>300||!/^[A-Za-z0-9._/-]+$/.test(f.path)||f.path.split('/').some(p=>!p||p==='.'||p==='..')||/\.(?:js|mjs|cjs|html|svg|exe|ps1|bat|sh)$/i.test(f.path)||paths.has(f.path)||!digest(f.digest)||!Number.isSafeInteger(f.bytes)||f.bytes<1||f.bytes>24*1024*1024||!inertMimes.has(f.mime)||typeof f.role!=='string')throw Error('封存文件清单无效');
  if(verified){const proof=verified.get(f.digest);if(!proof||proof.bytes!==f.bytes)throw Error('封存文件尚未全部回读核验');if(f.mime==='image/png'){if(!proof.width||!proof.height)throw Error('展示PNG文件格式无效');imageDimensions.set(f.digest,[proof.width,proof.height]);}}
  else{const bytes=await(await stored(bucket,f.digest)).arrayBuffer();if(bytes.byteLength!==f.bytes||await hash(bytes)!==f.digest)throw Error('封存原件校验失败');if(f.mime==='image/png')imageDimensions.set(f.digest,pngDimensions(bytes));if(f.role==='archive'){if(f.mime!=='application/zip')throw Error('原生ZIP归档格式无效');verifyWorkZip(bytes,recoveryIndex?recoveryIndex.volumes.find(v=>v.digest===f.digest).entries:manifest.files,{partial:!!recoveryIndex});}}
  paths.add(f.path);digests.add(f.digest);total+=f.bytes;
 }
 if(total>1024*1024*1024)throw Error('封存包过大');
 const candidate=await read(bucket,manifest.candidateDigest),review=await read(bucket,manifest.reviewDigest);
 if(candidate.schema!=='second-language.scroll-candidate.v1'||candidate.contentSHA!==manifest.contentSHA||candidate.certificationId!==cert.id||JSON.stringify(candidate.files)!==JSON.stringify(manifest.files))throw Error('候选清单与封存包不一致');
 if(canonical(candidate.creator)!==canonical(review.creator)||candidate.creator?.state!=='complete'||review.reviewer?.state!=='complete')throw Error('创作及独立审阅执行记录不一致');
 if(review.schema!=='second-language.scroll-review.v1'||review.candidateDigest!==manifest.candidateDigest||review.contentSHA!==manifest.contentSHA||review.approved!==true||review.reviewer?.model!=='gpt-6.1-sol'||review.reviewer?.reasoningEffort!=='xhigh'||review.creator?.model!=='gpt-6.1-sol'||review.creator?.reasoningEffort!=='xhigh'||typeof review.creator?.runId!=='string'||!review.creator.runId||typeof review.reviewer?.runId!=='string'||!review.reviewer.runId||review.creator.runId===review.reviewer.runId||typeof review.notes!=='string'||!review.notes.trim()||!Array.isArray(review.evidence)||!review.evidence.length||review.evidence.some(x=>!digests.has(x))||['source','translation','theme','material','layout','dynamic','engineering'].some(k=>review.checks?.[k]!==true))throw Error('独立审阅未覆盖当前成品');
 const v=manifest.viewer,r=v?.record;
 if(v?.schema!=='second-language.chapter-scroll-viewer.v1'||v.profile?.base!=='scroll-v42'||!Array.isArray(v.profile.nominalSizeMM)||v.profile.nominalSizeMM.length!==2||v.profile.nominalSizeMM.some(x=>!Number.isFinite(x)||x<100||x>1000)||!r||r.category!==(specimen?'chapter-specimen':'chapter-certified')||!(specimen?r.status==='specimen':['prepared','ready'].includes(r.status))||r.certificationId!==cert.id||r.chapterId!==cert.chapterId||r.chapterDigest!==cert.chapterDigest||String(r.chapterNumber)!==String(cert.chapterNumber)||r.ownerId!==cert.recipientId||r.recipient!==cert.recipientName||r.passedAt!==cert.passedAt||r.sha256!==manifest.contentSHA||typeof r.workId!=='string'||!r.workId||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(r.madeAt||'')||!Number.isFinite(Date.parse(r.madeAt))||Date.parse(r.madeAt)<Date.parse(cert.passedAt)||!digest(r.artPlanDigest)||!digests.has(r.artPlanDigest)||!r.copy||!r.copy.translation||(specimen&&(r.issued!==false||!r.sampleTime)))throw Error('阅览数据与真实认证不一致');
 const identityFile=manifest.files.find(f=>f.role==='content-identity');if(!identityFile||canonical(await read(bucket,identityFile.digest))!==canonical(contentIdentityContent(r))||await scrollContentSHA(r)!==manifest.contentSHA)throw Error('内容摘要与实际文书不一致');
 const plan=await read(bucket,r.artPlanDigest);if(canonical(plan.copy)!==canonical(r.copy))throw Error('文书与艺术方案不一致');
 if(!validCopy(r.copy)||!validCopy(r.copy.translation)||r.copy.institution!=='The Second Language'||['verse','colophon','sealLegends'].some(k=>r.copy[k].length!==r.copy.translation[k].length)||canonical(r.copy.sealLegends)!==canonical(['The Second Language','In remembrance']))throw Error('文书与项目身份不一致');
 const s=v.surface,p=v.profile;
 if(s?.schema!=='second-language.chapter-scroll-surfaces.v1'||!dimension(s.width)||!dimension(s.height)||s.seal?.variant!=='oblong'||!shortText(s.seal.version,100)||s.layout?.contentDigest!==manifest.contentSHA||s.layout?.artPlanDigest!==r.artPlanDigest||p.nominalSizeMM.some(x=>x<180||x>600)||Math.abs(p.nominalSizeMM[0]/p.nominalSizeMM[1]-s.width/s.height)>.003)throw Error('展示图层格式无效');
 if(p.paperFolds)for(const [group,keys]of Object.entries({diagonal:['offset','slope','width','depth'],lower:['offset','sine','slope','width','depth']})){const source=p.paperFolds[group];if(!source)throw Error('纸膜折痕参数无效');for(const key of keys){const value=source[key];if(!Number.isFinite(value)||(key==='width'?value<.002||value>.1:key==='depth'?value<0||value>.04:Math.abs(value)>1))throw Error('纸膜折痕参数无效');}}
 for(const key of ['front','back','ink','relief','sealInk','sealMask']){const layer=s.layers?.[key],dimensions=layer&&imageDimensions.get(layer.sha256);if(!layer||!digest(layer.sha256)||!digests.has(layer.sha256)||!dimension(layer.width)||!dimension(layer.height)||(['front','back','ink','relief'].includes(key)&&(layer.width!==s.width||layer.height!==s.height))||!manifest.files.some(f=>f.digest===layer.sha256&&f.bytes===layer.bytes&&f.mime==='image/png')||!dimensions||dimensions[0]!==layer.width||dimensions[1]!==layer.height)throw Error('展示图层未完整封存');}
 // URL-bearing fields are forbidden recursively; file paths are metadata only.
 function dataOnly(x){if(typeof x==='string'&&(/(?:https?:|javascript:|data:|blob:|file:|<script)/i.test(x)))throw Error('成品数据不得包含执行地址');if(Array.isArray(x))x.forEach(dataOnly);else if(x&&typeof x==='object')for(const [k,value] of Object.entries(x)){if(/(?:url|shader|script|code)$/i.test(k))throw Error('成品数据不得包含执行地址');dataOnly(value);}}
 dataOnly(v);return manifest;
}

export async function certificationsRoute(request,env,context){
 if(!context.isPublisher&&!context.session)return json({error:'请先登录'},401);
 if(request.method!=='GET')return json({error:'认证记录只读'},405);
 const chapter=new URL(request.url).searchParams.get('chapter');if(!chapter||chapter.length>200)return json({error:'章节无效'},400);
 const certification=await certificationFor(env.DB,chapter),job=certification?await env.DB.prepare('SELECT * FROM scroll_jobs WHERE certification_id=?').bind(certification.id).first():null;
 return json({certification,scroll:scrollJobView(job)});
}

export async function scrollsRoute(request,env,context,bucket=permanentBucket(env)){
 const {isPublisher,session,sameOrigin}=context,db=env.DB,path=new URL(request.url).pathname.replace('/api/scrolls',''),now=Date.now();
 if(!isPublisher&&!session)return json({error:'请先登录'},401);
 if(request.method!=='GET'&&request.method!=='HEAD'&&!isPublisher&&!sameOrigin)return json({error:'请从阅读器提交'},403);
 let b={};if(!['GET','HEAD'].includes(request.method)){try{const raw=await request.text();if(raw.length>2000000)throw Error();b=JSON.parse(raw);if(!b||typeof b!=='object'||Array.isArray(b))throw Error();}catch{return json({error:'请求格式无效'},400);}}
 try{
 const baseAction=path.match(/^\/bases\/(verify|register)$/);
 if(baseAction&&request.method==='POST'){
  if(!isPublisher)return json({error:'发布身份无效'},403);if(!digest(b.manifestDigest))return json({error:'恢复基座摘要无效'},422);
  const parts=baseFiles(await read(bucket,b.manifestDigest));
  if(baseAction[1]==='verify'){
   const offset=b.offset??0,limit=b.limit??2;if(!Number.isInteger(offset)||offset<0||offset>=parts.length||!Number.isInteger(limit)||limit<1||limit>4)return json({error:'核验批次无效'},422);
   for(const part of parts.slice(offset,offset+limit)){const bytes=await(await stored(bucket,part.digest)).arrayBuffer();if(bytes.byteLength!==part.bytes||await hash(bytes)!==part.digest)throw Error('恢复基座原件校验失败');await db.prepare('INSERT OR IGNORE INTO scroll_base_verified VALUES(?,?,?)').bind(b.manifestDigest,part.digest,Date.now()).run();}
   const {results}=await db.prepare('SELECT asset_digest FROM scroll_base_verified WHERE base_digest=?').bind(b.manifestDigest).all(),set=new Set(results.map(x=>x.asset_digest));return json({ok:true,verified:parts.filter(x=>set.has(x.digest)).length,total:parts.length,nextOffset:Math.min(parts.length,offset+limit)});
  }
  const {results}=await db.prepare('SELECT asset_digest FROM scroll_base_verified WHERE base_digest=?').bind(b.manifestDigest).all(),set=new Set(results.map(x=>x.asset_digest));if(parts.some(x=>!set.has(x.digest)))return json({error:'恢复基座尚未全部回读核验'},409);
  const added=await db.prepare('INSERT OR IGNORE INTO scroll_recovery_bases VALUES(?,?)').bind(b.manifestDigest,now).run();return json({ok:true,reused:!added.meta.changes,manifestDigest:b.manifestDigest});
 }
 if(path===''&&request.method==='GET'){
  const {results}=await db.prepare("SELECT j.*,c.chapter_number,c.chapter_title,c.chapter_id,c.passed_at FROM scroll_jobs j JOIN chapter_certifications c ON c.id=j.certification_id WHERE j.recipient_id=? AND j.status='complete' AND j.claimed_at IS NOT NULL ORDER BY CAST(c.chapter_number AS INTEGER),c.chapter_id").bind(recipient.id).all();
  return json({items:results.map(r=>({...scrollJobView(r),category:'chapter-certified',chapterId:r.chapter_id,chapterNumber:r.chapter_number,passedAt:date(r.passed_at),manifestURL:`/api/scrolls/${r.id}`}))});
 }
 if(path==='/request'&&request.method==='POST'){
  if(isPublisher&&!session)return json({error:'请由本人申请制作'},403);
  if(!uuid(b.id)||!uuid(b.certificationId))return json({error:'制作申请无效'},400);
  const cert=await db.prepare('SELECT * FROM chapter_certifications WHERE id=? AND recipient_id=?').bind(b.certificationId,recipient.id).first();if(!cert)return json({error:'本章尚未获得认证'},403);
  const existing=await db.prepare('SELECT * FROM scroll_requests WHERE request_id=?').bind(b.id).first();if(existing)return existing.certification_id===cert.id?json({ok:true,reused:true,scroll:scrollJobView(await rowFor(db,existing.job_id))}):json({error:'申请编号已使用'},409);
  if(!await isCurrentAffairsRevision(db,cert.chapter_id,cert.chapter_digest))return json({error:'旧章认证已封存，不再申请新的章节卷轴'},409);
  const id=crypto.randomUUID();await db.batch([
   db.prepare("INSERT OR IGNORE INTO scroll_jobs(id,certification_id,recipient_id,status,created_at,updated_at) VALUES(?,?,?,'pending',?,?)").bind(id,cert.id,recipient.id,now,now),
   db.prepare('INSERT OR IGNORE INTO scroll_requests(request_id,certification_id,job_id,created_at) SELECT ?,?,id,? FROM scroll_jobs WHERE certification_id=?').bind(b.id,cert.id,now,cert.id)
  ]);
  const winningRequest=await db.prepare('SELECT * FROM scroll_requests WHERE request_id=?').bind(b.id).first();if(winningRequest.certification_id!==cert.id)return json({error:'申请编号已使用'},409);
  const job=await rowFor(db,winningRequest.job_id);return json({ok:true,reused:job.id!==id,scroll:scrollJobView(job)},job.id===id?201:200);
 }
 if(path==='/jobs/claim'&&request.method==='POST'){
  if(!isPublisher)return json({error:'处理身份无效'},403);if(!digest(b.claim))return json({error:'领取凭据无效'},400);await expired(db,now);
  const row=await db.prepare("UPDATE scroll_jobs SET status='running',claim=?,lease_until=?,attempts=attempts+1,updated_at=? WHERE id=(SELECT id FROM scroll_jobs WHERE status='pending' AND "+projectScroll+" ORDER BY created_at LIMIT 1) AND status='pending' RETURNING *").bind(await hash(b.claim),now+300000,now).first();if(!row)return json({job:null});
  const cert=certificationView(await db.prepare('SELECT * FROM chapter_certifications WHERE id=?').bind(row.certification_id).first()),revision=await db.prepare('SELECT * FROM chapter_revisions WHERE chapter_id=? AND digest=?').bind(cert.chapterId,cert.chapterDigest).first();
  const markdown=revision&&(env.ONEDRIVE_ENABLED==='true'?await chapterText(env,revision.content_key):await env.CHAPTERS.get(revision.content_key));
  if(!markdown||await hash(markdown)!==cert.chapterDigest){await db.prepare("UPDATE scroll_jobs SET status='attention',claim=NULL,error='章节原件暂不可核对',updated_at=? WHERE id=? AND claim=?").bind(now,row.id,row.claim).run();return json({error:'章节原件暂不可核对'},503);}
  return json({job:{...scrollJobView(row),kind:'chapter-scroll',certification:cert,chapter:{id:cert.chapterId,digest:cert.chapterDigest,number:cert.chapterNumber,title:cert.chapterTitle,markdown},checkpoint:row.checkpoint_digest?await read(bucket,row.checkpoint_digest):null,model:{model:'gpt-6.1-sol',reasoningEffort:'xhigh'},trigger:'user-request'}});
 }
 const action=path.match(/^\/jobs\/([a-f0-9-]{36})\/(heartbeat|checkpoint|revise|verify|external|recover|complete|fail|resume)$/);
 if(action&&request.method==='POST'){
  if(!isPublisher)return json({error:'处理身份无效'},403);const row=await rowFor(db,action[1]);if(!row)return json({error:'制作任务不存在'},404);
  const scopeCert=await db.prepare('SELECT chapter_id,chapter_digest FROM chapter_certifications WHERE id=?').bind(row.certification_id).first();
  const inProject=scopeCert&&await isCurrentAffairsRevision(db,scopeCert.chapter_id,scopeCert.chapter_digest);
  if(!inProject&&!(action[2]==='recover'&&b.action==='found')&&!(action[2]==='complete'&&row.status==='complete'))return json({error:'旧章卷轴任务已封存，停止新制作；仍可找回未知结果原件'},409);
  if(action[2]==='recover'){
   if(row.status!=='attention'||b.stage!==row.stage||!digest(b.inputDigest)||!['found','authorize-retry','failed'].includes(b.action))return json({error:'恢复操作无效'},409);
   const call=await db.prepare("SELECT * FROM scroll_external_calls WHERE job_id=? AND stage=? AND input_digest=? AND state='outcome_unknown'").bind(row.id,row.stage,b.inputDigest).first();if(!call)return json({error:'没有待核对的外部调用'},409);
   let output=null,authorization=null;
   if(b.action==='found'){if(!digest(b.outputDigest))return json({error:'找回原件摘要无效'},422);await stored(bucket,b.outputDigest);output=b.outputDigest;}
   else{
    if(!digest(b.evidenceDigest))return json({error:'恢复依据无效'},422);const evidence=await read(bucket,b.evidenceDigest);
    if(evidence.jobId!==row.id||evidence.stage!==row.stage||evidence.inputDigest!==b.inputDigest||typeof evidence.reason!=='string'||!evidence.reason.trim()||evidence.type!==(b.action==='authorize-retry'?'explicit-user-retry':'definitive-provider-failure'))return json({error:'恢复依据与原调用不一致'},422);authorization=b.evidenceDigest;
   }
   const change=await db.prepare("UPDATE scroll_external_calls SET state=?,output_digest=?,authorization_digest=?,provider_id=COALESCE(?,provider_id),updated_at=? WHERE job_id=? AND stage=? AND input_digest=? AND state='outcome_unknown'").bind(b.action==='found'?'complete':b.action==='authorize-retry'?'retry_authorized':'failed',output,authorization,typeof b.providerId==='string'?b.providerId.slice(0,200):null,now,row.id,row.stage,b.inputDigest).run();return change.meta.changes?json({ok:true}):json({error:'恢复状态已改变'},409);
  }
  if(action[2]==='resume'){
   if(!['failed','attention'].includes(row.status))return json({error:'任务无需恢复'},409);
   const unknown=await db.prepare("SELECT 1 FROM scroll_external_calls WHERE job_id=? AND state IN ('calling','outcome_unknown')").bind(row.id).first();if(unknown)return json({error:'外部调用结果未知，请先找回原件或记录单次重试授权'},409);
   const changed=await db.prepare("UPDATE scroll_jobs SET status='pending',claim=NULL,lease_until=NULL,error=NULL,updated_at=? WHERE id=? AND status IN ('failed','attention')").bind(now,row.id).run();return json({ok:!!changed.meta.changes});
  }
  if(action[2]==='complete'&&row.status==='complete')return b.manifestDigest===row.manifest_digest?json({ok:true,reused:true,scroll:scrollJobView(row)}):json({error:'已冻结作品不能替换'},409);
  if(!await validLease(row,b.claim))return json({error:'处理权已失效'},409);
  const claimGuard="id=? AND status='running' AND claim=? AND lease_until>=?",guard=()=>[row.id,row.claim,Date.now()];
  if(action[2]==='heartbeat'){const result=await db.prepare(`UPDATE scroll_jobs SET lease_until=?,updated_at=? WHERE ${claimGuard}`).bind(now+300000,now,...guard()).run();return result.meta.changes?json({ok:true}):json({error:'处理权已失效'},409);}
  if(action[2]==='verify'){
   if(row.stage!=='archive'||!digest(b.manifestDigest))return json({error:'封存核验阶段无效'},422);
   const manifest=await read(bucket,b.manifestDigest),parts=manifest?.files,offset=b.offset??0,limit=b.limit??2;
   if(manifest?.certificationId!==row.certification_id||!Array.isArray(parts)||!parts.length||parts.length>3000||!Number.isInteger(offset)||offset<0||offset>=parts.length||!Number.isInteger(limit)||limit<1||limit>2)return json({error:'封存核验批次无效'},422);
   const recoveryIndex=await workRecovery(bucket,manifest);for(const part of parts.slice(offset,offset+limit)){
    if(!digest(part?.digest)||!Number.isSafeInteger(part.bytes)||part.bytes<1||part.bytes>24*1024*1024)return json({error:'封存文件清单无效'},422);
    const bytes=await(await stored(bucket,part.digest)).arrayBuffer();if(bytes.byteLength!==part.bytes||await hash(bytes)!==part.digest)throw Error('封存原件校验失败');const dimensions=part.mime==='image/png'?pngDimensions(bytes):[null,null];if(part.role==='archive'){if(part.mime!=='application/zip')throw Error('原生ZIP归档格式无效');verifyWorkZip(bytes,recoveryIndex?recoveryIndex.volumes.find(v=>v.digest===part.digest).entries:parts,{partial:!!recoveryIndex});}
    const changed=await db.prepare(`INSERT OR IGNORE INTO scroll_package_verified SELECT ?,?,?,?,?,?,? WHERE EXISTS(SELECT 1 FROM scroll_jobs WHERE ${claimGuard})`).bind(row.id,b.manifestDigest,part.digest,part.bytes,...dimensions,Date.now(),...guard()).run();if(!changed.meta.changes&&!await validLease(await rowFor(db,row.id),b.claim))return json({error:'处理权已失效'},409);
   }
   const {results}=await db.prepare('SELECT asset_digest FROM scroll_package_verified WHERE job_id=? AND manifest_digest=?').bind(row.id,b.manifestDigest).all(),set=new Set(results.map(x=>x.asset_digest));return json({ok:true,verified:parts.filter(x=>set.has(x.digest)).length,total:parts.length,nextOffset:Math.min(parts.length,offset+limit)});
  }
  if(action[2]==='fail'){
   const active=await db.prepare("SELECT 1 FROM scroll_external_calls WHERE job_id=? AND state IN ('calling','outcome_unknown')").bind(row.id).first(),status=active||b.attention===true?'attention':'failed',error=typeof b.error==='string'?b.error.slice(0,500):'制作尚未完成';
   const result=await db.batch([
    db.prepare(`UPDATE scroll_external_calls SET state='outcome_unknown',updated_at=? WHERE job_id=? AND state='calling' AND EXISTS(SELECT 1 FROM scroll_jobs WHERE ${claimGuard})`).bind(now,row.id,...guard()),
    db.prepare(`UPDATE scroll_jobs SET status=?,claim=NULL,lease_until=NULL,error=?,updated_at=? WHERE ${claimGuard}`).bind(status,error,now,...guard())
   ]);return result[1].meta.changes?json({ok:true,state:status}):json({error:'处理权已失效'},409);
  }
  if(action[2]==='checkpoint'){
   const current=stages.indexOf(row.stage),next=stages.indexOf(b.stage);if(next<current||next>current+1||next===stages.length-1||!digest(b.digest))return json({error:'制作阶段或检查点无效'},422);
   if(await db.prepare("SELECT 1 FROM scroll_external_calls WHERE job_id=? AND state IN ('calling','outcome_unknown')").bind(row.id).first())return json({error:'外部调用结果尚未明确'},409);
   const check=await read(bucket,b.digest);if(check.jobId!==row.id||check.certificationId!==row.certification_id||check.stage!==b.stage)return json({error:'检查点身份不一致'},422);
   const result=await db.prepare(`UPDATE scroll_jobs SET stage=?,checkpoint_digest=?,updated_at=? WHERE ${claimGuard} AND stage=?`).bind(b.stage,b.digest,now,...guard(),row.stage).run();return result.meta.changes?json({ok:true}):json({error:'检查点已改变或处理权已失效'},409);
  }
  if(action[2]==='revise'){
   if(!['review','archive'].includes(row.stage)||!['art','materials','layout'].includes(b.stage)||!digest(b.digest))return json({error:'返修阶段无效'},422);
   if(await db.prepare("SELECT 1 FROM scroll_external_calls WHERE job_id=? AND state IN ('calling','outcome_unknown')").bind(row.id).first())return json({error:'外部调用结果尚未明确'},409);
   const check=await read(bucket,b.digest);if(check.jobId!==row.id||check.certificationId!==row.certification_id||check.stage!==b.stage||typeof check.reason!=='string'||!check.reason.trim()||!digest(check.failedReviewDigest))return json({error:'返修依据无效'},422);
   const review=await read(bucket,check.failedReviewDigest);if(review.approved!==false)return json({error:'返修依据无效'},422);
   const changed=await db.prepare(`UPDATE scroll_jobs SET stage=?,checkpoint_digest=?,updated_at=? WHERE ${claimGuard} AND stage=?`).bind(b.stage,b.digest,now,...guard(),row.stage).run();return changed.meta.changes?json({ok:true}):json({error:'处理权已失效'},409);
  }
  if(action[2]==='external'){
   if(b.stage!==row.stage||!digest(b.inputDigest)||!['begin','resolve','unknown','retry-authorized'].includes(b.action))return json({error:'外部阶段请求无效'},422);
   const input=await stored(bucket,b.inputDigest);await input.arrayBuffer();
   if(b.action==='begin'){
    const unresolved=await db.prepare("SELECT 1 FROM scroll_external_calls WHERE job_id=? AND stage=? AND state IN ('calling','outcome_unknown')").bind(row.id,row.stage).first();if(unresolved)return json({error:'本阶段已有未明确的外部调用'},409);
    const change=await db.prepare(`INSERT INTO scroll_external_calls(job_id,stage,input_digest,state,created_at,updated_at) SELECT ?,?,?,'calling',?,? WHERE EXISTS(SELECT 1 FROM scroll_jobs WHERE ${claimGuard}) AND NOT EXISTS(SELECT 1 FROM scroll_external_calls WHERE job_id=? AND stage=? AND state IN ('calling','outcome_unknown')) ON CONFLICT(job_id,stage,input_digest) DO UPDATE SET state='calling',updated_at=excluded.updated_at WHERE scroll_external_calls.state='retry_authorized'`).bind(row.id,row.stage,b.inputDigest,now,now,...guard(),row.id,row.stage).run();
    const saved=await db.prepare('SELECT * FROM scroll_external_calls WHERE job_id=? AND stage=? AND input_digest=?').bind(row.id,row.stage,b.inputDigest).first();return change.meta.changes?json({ok:true,state:'calling'}):saved?.state==='complete'?json({ok:true,reused:true,state:'complete',outputDigest:saved.output_digest}):json({error:'外部调用不能重复发送'},409);
   }
   if(b.action==='retry-authorized')return json({error:'未知结果须在任务attention期间通过专用恢复操作处理'},409);
   if(b.action==='resolve'&&!digest(b.outputDigest))return json({error:'外部原件摘要无效'},422);if(b.action==='resolve')await stored(bucket,b.outputDigest);
   const change=await db.prepare(`UPDATE scroll_external_calls SET state=?,output_digest=?,provider_id=?,updated_at=? WHERE job_id=? AND stage=? AND input_digest=? AND state='calling' AND EXISTS(SELECT 1 FROM scroll_jobs WHERE ${claimGuard})`).bind(b.action==='unknown'?'outcome_unknown':'complete',b.outputDigest||null,typeof b.providerId==='string'?b.providerId.slice(0,200):null,now,row.id,row.stage,b.inputDigest,row.id,row.claim,Date.now()).run();
   if(b.action==='unknown'&&change.meta.changes)await db.prepare(`UPDATE scroll_jobs SET status='attention',claim=NULL,lease_until=NULL,error='外部生成结果未知，已停止自动重试',updated_at=? WHERE ${claimGuard}`).bind(now,...guard()).run();return change.meta.changes?json({ok:true,state:b.action==='unknown'?'attention':'complete'}):json({error:'外部调用状态已改变'},409);
  }
  if(row.stage!=='archive'||!digest(b.manifestDigest))return json({error:'请先完成封存阶段'},422);
  const unresolved=await db.prepare("SELECT 1 FROM scroll_external_calls WHERE job_id=? AND state IN ('calling','outcome_unknown')").bind(row.id).first();if(unresolved)return json({error:'外部调用结果尚未明确'},409);
  const cert=certificationView(await db.prepare('SELECT * FROM chapter_certifications WHERE id=?').bind(row.certification_id).first()),{results:proofs}=await db.prepare('SELECT * FROM scroll_package_verified WHERE job_id=? AND manifest_digest=?').bind(row.id,b.manifestDigest).all(),manifest=await validateScrollPackage(bucket,await read(bucket,b.manifestDigest),cert,new Map(proofs.map(x=>[x.asset_digest,x])));
  const recovery=manifest.recovery;if(!digest(recovery?.baseManifestDigest)||!digest(recovery?.workArchiveDigest)||!manifest.files.some(f=>f.digest===recovery.workArchiveDigest&&['archive','work-recovery'].includes(f.role)))return json({error:'原生制作恢复包未完整封存'},422);
  if(!await db.prepare('SELECT 1 FROM scroll_recovery_bases WHERE manifest_digest=?').bind(recovery.baseManifestDigest).first())return json({error:'共享工艺基座尚未回读核验'},409);baseFiles(await read(bucket,recovery.baseManifestDigest));
  const readyAt=Date.now(),result=await db.prepare(`UPDATE scroll_jobs SET status='complete',stage='complete',manifest_digest=?,content_sha=?,ready_at=?,claim=NULL,lease_until=NULL,error=NULL,updated_at=? WHERE ${claimGuard}`).bind(b.manifestDigest,manifest.contentSHA,readyAt,readyAt,row.id,row.claim,readyAt).run();return result.meta.changes?json({ok:true,scroll:scrollJobView(await rowFor(db,row.id))}):json({error:'处理权已失效'},409);
 }
 const match=path.match(/^\/([a-f0-9-]{36})(?:\/(claim|assets\/([a-f0-9]{64})))?$/);
 if(match){const row=await rowFor(db,match[1]);if(!row)return json({error:'藏卷不存在'},404);
  if(match[2]==='claim'&&request.method==='POST'){
   if(row.status!=='complete')return json({error:'藏卷尚未完成'},409);
   if(row.claimed_at==null){const cert=await db.prepare('SELECT chapter_id,chapter_digest FROM chapter_certifications WHERE id=?').bind(row.certification_id).first();if(!cert||!await isCurrentAffairsRevision(db,cert.chapter_id,cert.chapter_digest))return json({error:'旧章节卷轴已封存，不再新领取'},409);}
   await db.prepare("UPDATE scroll_jobs SET claimed_at=?,updated_at=? WHERE id=? AND status='complete' AND claimed_at IS NULL").bind(now,now,row.id).run();return json({ok:true,reused:row.claimed_at!=null,scroll:scrollJobView(await rowFor(db,row.id))});
  }
  if(request.method==='GET'||request.method==='HEAD'){
   const cert=certificationView(await db.prepare('SELECT * FROM chapter_certifications WHERE id=?').bind(row.certification_id).first());
   const manifest=row.status==='complete'?await read(bucket,row.manifest_digest):null;
   if(match[3]){if(!manifest||(!isPublisher&&row.claimed_at==null))return json({error:'请先领取藏卷'},403);const file=manifest.files.find(f=>f.digest===match[3]);if(!file||!inertMimes.has(file.mime))return json({error:'文件不属于本件藏卷'},404);const response=await bucket.responseContent(file.digest,request,file.mime);if(!response)return json({error:'原件暂不可用'},503);const headers=new Headers(response.headers);headers.set('x-content-type-options','nosniff');headers.set('cache-control','private, no-store');if(!file.mime.startsWith('image/'))headers.set('content-disposition','attachment');return new Response(response.body,{status:response.status,headers});}
   return json({...scrollJobView(row),certification:cert,manifest:manifest?{...manifest,viewer:{...manifest.viewer,record:{...manifest.viewer.record,status:row.claimed_at==null?'ready':'issued',publishedAt:date(row.ready_at),claimedAt:date(row.claimed_at)}}}:null});
  }
 }
 return json({error:'没有此藏卷操作'},404);
 }catch(e){if(/暂不可用|校验失败/.test(e.message))return json({error:e.message},503);if(/尚未全部回读/.test(e.message))return json({error:e.message},409);if(/无效|不一致|不得|未完整|未覆盖|过大/.test(e.message))return json({error:e.message},422);throw e;}
}

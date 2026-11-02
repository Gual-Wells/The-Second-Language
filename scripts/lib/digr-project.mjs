// Project-domain inputs/artifacts, not a replacement DIGR lifecycle or planner.
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash,randomUUID} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {loadAuthoringContract} from './chapter-authoring-revision.mjs';
import {verifyChapterPublication} from './chapter-publication-preflight.mjs';
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const requiredProtocols=['AGENTS.md','protocol/DIGR_ADAPTER.md','protocol/AUTHENTIC_CONTEXT_APPEALS.md','protocol/DAILY_RUN.md','protocol/AUTHENTIC_CONTEXT.md','protocol/CONTENT.md','protocol/RECOMMENDATION.md','protocol/TEACHING_AUTHORING.md','protocol/QUALITY_WORKFLOW.md','protocol/PUBLICATION_REVIEW.md','protocol/CURRENT_AFFAIRS.md','protocol/BACKGROUND_AUTOMATION.md'];
export function studyDate(value){if(typeof value!=='string'||!/^20\d{2}-\d{2}-\d{2}$/.test(value)||!Number.isFinite(Date.parse(value))||new Date(value).toISOString().slice(0,10)!==value)throw Error('日期无效');return value;}
async function read(root,relative){try{const bytes=await fs.readFile(path.join(root,relative));return {path:relative,bytes:bytes.length,sha256:hash(bytes),data:JSON.parse(bytes.toString('utf8'))};}catch(e){if(e.code==='ENOENT')return null;throw e;}}
async function realRoot(root){const real=await fs.realpath(root);if(process.platform==='win32'&&!/^D:[\\/]/i.test(real))throw Error('项目与DIGR材料须实存D盘');return real;}
export async function currentDigrInputs({root,date}){
 root=await realRoot(root);if(!date)return {refs:[],contentAuthority:null};studyDate(date);
 const run='work/runs/'+date,refs=[];let selection,inputLock;
 for(const name of ['control.json','selection.json','vix-source.json','vix-publication.json']){const item=await read(root,run+'/'+name);if(item){refs.push({path:item.path,bytes:item.bytes,sha256:item.sha256});if(name==='selection.json')selection=item.data;if(name==='vix-source.json')inputLock=item.data;if(name==='control.json'&&item.data.date!==date)throw Error('control日期不符');}}
 const meta=(await read(root,'chapters/'+date+'/meta.json'))?.data;let contentAuthority=null;
 if(selection){if(selection.studyDate!==date||inputLock&&selection.vixInputCommit!==inputLock.commit)throw Error('原冻结输入身份不符');const actual=await loadAuthoringContract(root,date,selection,{meta});contentAuthority={policy:actual.policy,protocolCommit:meta?.protocolCommit||null,vixInputCommit:selection.vixInputCommit,revisionBaseline:actual.revision?.baselineFile||null};if(actual.revision){const item=await read(root,actual.revision.baselineFile);refs.push({path:item.path,bytes:item.bytes,sha256:item.sha256});}}
 return {refs,contentAuthority};
}
export async function prepareDigrProject({root,kind='research',date,task,id='digr-'+randomUUID(),inputFiles=[]}={}){
 root=await realRoot(root);if(!['daily','research','revision'].includes(kind)||!/^[A-Za-z0-9_-]{1,100}$/.test(id)||typeof task!=='string'||!task.trim())throw Error('项目任务参数无效');
 if(date!=null)studyDate(date);if(kind!=='research'&&!date)throw Error('日课和修订任务需要日期');
 const run=date?'work/runs/'+date:null,control=run?await read(root,run+'/control.json'):null;
 if(kind==='daily'){
  if(!control||control.data.date!==date||typeof control.data.rest!=='boolean'||typeof control.data.runId!=='string')throw Error('需恢复真实已领取control，适配器不代领');
  if(control.data.rest)return {skipped:true,reason:'rest',date};
 }
 const observed=await currentDigrInputs({root,date}),frozen=observed.refs;let meta,chapter;
 // Additional domain artifacts (e.g. a five-task plan or completed handoffs)
 // are immutable inputs, never an extra execution protocol or local DIGR state.
 if(!Array.isArray(inputFiles))throw Error('项目原件须为路径数组');
 for(const relative of inputFiles){if(typeof relative!=='string'||path.isAbsolute(relative))throw Error('项目原件须在仓库内');const file=await fs.realpath(path.join(root,relative)),rel=path.relative(root,file);if(rel.startsWith('..')||path.isAbsolute(rel))throw Error('项目原件越出仓库');const bytes=await fs.readFile(file);if(!frozen.some(r=>r.path===relative))frozen.push({path:relative,bytes:bytes.length,sha256:hash(bytes)});}
 if(run){
  meta=(await read(root,'chapters/'+date+'/meta.json'))?.data;chapter=(await read(root,'chapters/'+date+'/chapter.json'))?.data;
  if(kind==='revision'&&(!observed.contentAuthority||!meta))throw Error('修订需现有冻结选择及元数据；不自动重建');
 }
 const directory=path.join(root,'work/digr',id);await fs.mkdir(path.dirname(directory),{recursive:true});await realRoot(path.dirname(directory));await fs.mkdir(directory);
 const protocols=[];
 for(const relative of requiredProtocols){const bytes=await fs.readFile(path.join(root,relative)),target=path.join(directory,'project-contracts',relative);await fs.mkdir(path.dirname(target),{recursive:true});await fs.writeFile(target,bytes,{flag:'wx'});protocols.push({path:relative,snapshot:'project-contracts/'+relative,sha256:hash(bytes)});}
 const git=spawnSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8',windowsHide:true});
 const packet={schemaVersion:1,project:'second-language',id,kind,studyDate:date||null,projectRoot:root,task,createdAt:new Date().toISOString(),projectCommit:git.status===0?git.stdout.trim():null,immutableInputs:frozen,contentAuthority:observed.contentAuthority,observedChapter:chapter?{chapterDigest:chapter.digest,sourceDigest:chapter.sourceDigest,evidenceDigest:chapter.sourcePackage?.evidenceDigest}:null,protocols,locators:date?{run,authored:run+'/teaching/authored',materials:run+'/teaching/materials',sourceEvidence:run+'/sources/evidence',publicationReview:run+'/teaching/publication-review.json',chapter:'chapters/'+date}:null};
 const message='DIGR：'+task+'\n\n宿主工具桥（只取得与启动原生运行，不定义执行语义）：先运行 node scripts/digr-project.mjs acquire "'+path.join(directory,'packet.json')+'"；再用 python -X utf8 -u -i scripts/digr-native-session.py --packet "'+path.join(directory,'packet.json')+'" --acquisition "返回的acquisition路径" 建立持久工具会话。完整读取宿主返回的protocol_text_path，按该同SHA原生协议完成参数/U0/合同及任务；保持该会话并使用run原生API，不在本地另造执行规则。项目DIGR_ADAPTER和project-contracts是领域材料，按原生启动边界读取。项目冻结内容合同与DIGR运行协议分别保持身份；由原生模型校准参数、决定研究与返工。适配器不会代替语义审阅、授权发布或自动生成收费资源。';
 await fs.writeFile(path.join(directory,'packet.json'),JSON.stringify(packet,null,2)+'\n',{flag:'wx'});await fs.writeFile(path.join(directory,'prompt.txt'),message,{flag:'wx'});
 return {skipped:false,id,packet:path.join(directory,'packet.json'),prompt:path.join(directory,'prompt.txt'),directory};
}
export async function inspectDigrProject(packetFile){const bytes=await fs.readFile(packetFile),packet=JSON.parse(bytes);if(packet.schemaVersion!==1||packet.project!=='second-language'||!Array.isArray(packet.immutableInputs))throw Error('未知项目材料');const root=await realRoot(packet.projectRoot);for(const item of packet.immutableInputs){if(typeof item.path!=='string'||path.isAbsolute(item.path))throw Error('冻结输入路径无效');const file=await fs.realpath(path.join(root,item.path)),relative=path.relative(root,file);if(relative.startsWith('..')||path.isAbsolute(relative))throw Error('冻结输入越出项目');const value=await fs.readFile(file);if(hash(value)!==item.sha256||value.length!==item.bytes)throw Error('冻结输入已改变：'+item.path);}return packet;}
export async function preflightDigrPublication({root,date}){root=await realRoot(root);studyDate(date);const chapter=JSON.parse(await fs.readFile(path.join(root,'chapters',date,'chapter.json'),'utf8')),meta=JSON.parse(await fs.readFile(path.join(root,'chapters',date,'meta.json'),'utf8'));const result=await verifyChapterPublication({root,date,chapter,meta,requireReview:true,requireAppeals:true});return {scope:'local-publication-preflight',chapterDigest:chapter.digest,sourceDigest:chapter.sourceDigest,evidenceDigest:chapter.sourcePackage?.evidenceDigest,reviewDigest:result.review?.digest||null,wordCount:result.parsed.words.length,passed:true,published:false,semanticTruthCertified:false};}

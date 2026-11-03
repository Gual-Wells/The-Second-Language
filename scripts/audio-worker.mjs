import {randomBytes} from 'node:crypto';
import {mkdir,readFile,writeFile,rename} from 'node:fs/promises';
import {publisherConfig} from './lib/publisher-config.mjs';
import {finishTaskBalances} from './check-balances.mjs';
import {readAudioResponse,retryAudioRead,prepareAudioUnit,recoverAudioBlocked,reconcileAudioBlocked} from './lib/audio-request-runner.mjs';
const {base,token}=await publisherConfig();
async function api(path,body,{method='POST',timeoutMs=270000}={}){let r;try{r=await fetch(new URL(path,base),{method,headers:{authorization:`Bearer ${token}`,'content-type':'application/json'},...(method==='GET'?{}:{body:JSON.stringify(body)}),signal:AbortSignal.timeout(timeoutMs)});}catch{throw Object.assign(Error('声音服务连接中断，请求结果需按原身份查询'),{transportUnknown:true});}return readAudioResponse(r);}
const claim=randomBytes(32).toString('hex'),{job}=await api('/api/audio-config/jobs/claim',{claim});if(!job)process.exit(0);
const directory=`work/audio-requests/${job.id}`;await mkdir(directory,{recursive:true});await writeFile(directory+'/plan.json',JSON.stringify(job,null,2));
let cursor=job.cursor,blocked=[],state='running',failure='',consecutiveBlocked=0,progressChain=Promise.resolve();
const progress=()=>progressChain=progressChain.catch(()=>{}).then(async()=>{
 const checkpoint={jobId:job.id,digest:job.digest,total:job.units.length,cursor,state,blocked};
 await writeFile(directory+'/checkpoint.tmp',JSON.stringify(checkpoint));await rename(directory+'/checkpoint.tmp',directory+'/checkpoint.json');
 return retryAudioRead(()=>api('/api/audio-config/jobs/progress',{id:job.id,claim,cursor,state,error:failure},{timeoutMs:30000}));
});
const heartbeat=setInterval(()=>progress().catch(()=>{}),60000);
try{
 let checkpoint=null;try{checkpoint=JSON.parse(await readFile(directory+'/checkpoint.json','utf8'));}catch(error){if(error.code!=='ENOENT')throw error;}blocked=recoverAudioBlocked(checkpoint,job);
 for(;cursor<job.units.length;){
  const u=job.units[cursor];if(u.kind==='word'){cursor++;await progress();continue;}if(u.unsupported){blocked.push({index:cursor,id:u.id,state:'unsupported'});cursor++;await progress();continue;}
  const body={text:u.text,kind:u.kind,...(u.ipa?{ipa:u.ipa}:{}),chapterId:job.chapterId,digest:job.digest};
  const r=await prepareAudioUnit({unit:u,body,request:api});
  if(r.state==='waiting_credit'){state='waiting_credit';failure='余额不足，已有音频保留';break;}
  if(r.state!=='ready'){
   blocked.push({index:cursor,id:u.id,state:r.state});consecutiveBlocked++;
   cursor++;await progress();
   if(consecutiveBlocked>=3){state='needs_review';failure='连续三项声音未就绪，已停止新增请求；原结果保留';break;}
   continue;
  }
  consecutiveBlocked=0;
  cursor++;await progress();
 }
 if(state==='running'){blocked=await reconcileAudioBlocked(blocked,api);state=blocked.length?'needs_review':'completed';failure=blocked.length?`${blocked.length} 项声音结果待核对，未重复生成；其余独立例句已处理`:'';}
 await progress();await writeFile(directory+'/result.json',JSON.stringify({state,cursor,blocked},null,2));
 console.log(`音频申请 ${job.id}：${cursor}/${job.units.length}，${state}`);
}catch(error){
 // This exact rejection precedes ledger insertion/provider submission. Retain
 // the original orchestration lease as a bounded wait for archival capacity.
 // The minute scheduler reclaims it after five minutes, never by clearing TTS.
 state=error.storageBackpressure?'running':'needs_review';failure=error.storageBackpressure?'等待已购声音转存腾出临时空间；未发起本块合成':String(error.message);
 await progress().catch(()=>{});await writeFile(directory+'/result.json',JSON.stringify({state,cursor,blocked,error:failure},null,2));console.error(failure);process.exitCode=error.storageBackpressure?0:1;
}
finally{clearInterval(heartbeat);await finishTaskBalances();}

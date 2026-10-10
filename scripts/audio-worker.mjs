import {randomBytes} from 'node:crypto';
import {mkdir,writeFile} from 'node:fs/promises';
import {publisherConfig} from './lib/publisher-config.mjs';
import {finishTaskBalances} from './check-balances.mjs';
const {base,token}=await publisherConfig();
async function api(path,body){const r=await fetch(new URL(path,base),{method:'POST',headers:{authorization:`Bearer ${token}`,'content-type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(270000)});const b=await r.json();if(!r.ok)throw Error(b.error||`HTTP ${r.status}`);return b;}
const claim=randomBytes(32).toString('hex'),{job}=await api('/api/audio-config/jobs/claim',{claim});if(!job)process.exit(0);
const directory=`work/audio-requests/${job.id}`;await mkdir(directory,{recursive:true});await writeFile(directory+'/plan.json',JSON.stringify(job,null,2));
let cursor=job.cursor,blocked=job.units.filter(u=>u.unsupported).map(({text,ipa})=>({text,ipa})),state='running',failure='';
const progress=()=>api('/api/audio-config/jobs/progress',{id:job.id,claim,cursor,state,error:failure});
const heartbeat=setInterval(()=>progress().catch(()=>{}),60000);
try{
 for(;cursor<job.units.length;){
  const u=job.units[cursor];if(u.kind==='word'){cursor++;await progress();continue;}if(u.unsupported){cursor++;await progress();continue;}
  const body={text:u.text,kind:u.kind,...(u.ipa?{ipa:u.ipa}:{}),chapterId:job.chapterId,digest:job.digest};
  let r=await api('/api/practice/pronunciation',body);
  for(let wait=0;r.state==='calling'&&wait<240;wait++){
   await new Promise(resolve=>setTimeout(resolve,1000));const response=await fetch(new URL('/api/practice/pronunciation/'+r.id,base),{headers:{authorization:`Bearer ${token}`},signal:AbortSignal.timeout(30000)});if(!response.ok)throw Error('声音状态暂不可用');r=await response.json();
  }
  if(r.id!==u.id)throw Error('声音身份不一致，停止新增生成');
  if(r.state!=='ready'){state=r.state==='waiting_credit'?'waiting_credit':'needs_review';failure=r.state==='waiting_credit'?'余额不足，已有音频保留':'声音结果需要核对，未重复生成';break;}
  cursor++;await progress();
 }
 if(state==='running'){state=blocked.length?'needs_review':'completed';failure=blocked.length?`${blocked.length} 项读音需要核对`:'';}
 await progress();await writeFile(directory+'/result.json',JSON.stringify({state,cursor,blocked},null,2));
 console.log(`音频申请 ${job.id}：${cursor}/${job.units.length}，${state}`);
}catch(error){state='needs_review';failure=String(error.message);await progress().catch(()=>{});console.error(failure);process.exitCode=1;}
finally{clearInterval(heartbeat);await finishTaskBalances();}

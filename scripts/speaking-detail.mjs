// Control requests only. Audio inference and funding checks execute in Cloudflare.
import { readFile,writeFile,mkdir } from 'node:fs/promises';
import path from 'node:path';
const planFile=process.argv[2];
if(!planFile)throw Error('用法：node scripts/speaking-detail.mjs 私有云端专项计划.json');
const plan=JSON.parse(await readFile(planFile,'utf8'));
for(const key of ['id','attemptId','parentJobId'])if(!/^[a-zA-Z0-9._-]{1,110}$/.test(plan[key]??''))throw Error('专项需要唯一 id、attemptId、parentJobId。');
if(!Array.isArray(plan.tasks)||!plan.tasks.length)throw Error('专项需要具体采集目标。');
const taskIds=new Set();
for(const t of plan.tasks){
 if(!/^[a-zA-Z0-9._-]{1,110}$/.test(t.id??'')||t.id==='baseline'||taskIds.has(t.id)||!['qwen','gpt-audio'].includes(t.provider??'qwen')||typeof t.focusPrompt!=='string'||!t.focusPrompt.trim())throw Error('专项需要独立编号、可用模型与 focusPrompt。');
 taskIds.add(t.id);
}
const dir=path.resolve('.cache/speaking/details',plan.id);await mkdir(dir,{recursive:true});
const encoded=JSON.stringify(plan);
try{await writeFile(path.join(dir,'request.json'),encoded,{flag:'wx'});}
catch(error){if(error.code!=='EEXIST')throw error;if(await readFile(path.join(dir,'request.json'),'utf8')!==encoded)throw Error('同一专项 id 的计划不同；新要求使用新 id。');}
if(process.argv.includes('--dry-run'))console.log(JSON.stringify({prepared:true,directory:dir,providerCalled:false}));
else{
 const config=JSON.parse(await readFile(process.env.SECOND_LANGUAGE_SPEAKING_BACKEND_CONFIG||'.cache/speaking-backend.json','utf8'));
 const url=new URL('/speaking/details',config.baseUrl);
 if(url.protocol!=='https:'||!config.controlToken)throw Error('需要已接通的 Cloudflare HTTPS 私有控制接口；不回退本机 OpenRouter。');
 const r=await fetch(url,{method:'POST',redirect:'error',headers:{authorization:`Bearer ${config.controlToken}`,'content-type':'application/json'},body:JSON.stringify({jobId:plan.id,parentJobId:plan.parentJobId,attemptId:plan.attemptId,tasks:plan.tasks}),signal:AbortSignal.timeout(25000)});
 const raw=await r.text();await writeFile(path.join(dir,`receipt-${Date.now()}.json`),raw,{flag:'wx'});
 if(!r.ok)throw Error(`专项后端返回 ${r.status}；完整返回已保存，没有本机推理。`);
 console.log(JSON.stringify({submitted:true,directory:dir,cloudflareOnly:true,jobId:plan.id}));
}

// One fixed local fallback task. The series pump owns polling and concurrency;
// this process never reads a ChatGPT API key or sends a Responses API request.
import {mkdir} from 'node:fs/promises';
import {setGlobalProxyFromEnv} from 'node:http';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash,randomBytes} from 'node:crypto';
import {publisherConfig} from './lib/publisher-config.mjs';
import {localServices} from './lib/local-services.mjs';
import {runCodexData} from './lib/codex-data-runner.mjs';
import {QUESTION_CLOUD_INSTRUCTIONS,QUESTION_CLOUD_SCHEMA} from '../worker/src/cloud-questions.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const services=await localServices();if(services.networkProxy){const proxy=new URL(services.networkProxy);if(proxy.protocol!=='http:'||!['127.0.0.1','localhost'].includes(proxy.hostname)||proxy.username||proxy.password)throw Error('本机代理配置无效');process.env.HTTPS_PROXY=proxy.href;process.env.HTTP_PROXY=proxy.href;process.env.NO_PROXY='127.0.0.1,localhost';setGlobalProxyFromEnv({http_proxy:proxy.href,https_proxy:proxy.href,no_proxy:process.env.NO_PROXY});}
const {base,token}=await publisherConfig();
async function call(route,body){const response=await fetch(new URL('/api/questions/jobs'+route,base),{method:'POST',headers:{authorization:'Bearer '+token,'content-type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(120000)});const value=await response.json();if(!response.ok)throw Object.assign(Error(value.error||'任务服务暂不可用'),{status:response.status});return value;}
const claim=randomBytes(32).toString('hex'),{job}=await call('/claim',{claim,codexFallbackOnly:true});
if(job){
 const directory=path.join(root,'work/questions-codex-fallback',job.id);await mkdir(directory,{recursive:true});
 const controller=new AbortController(),timer=setInterval(()=>call('/'+job.id+'/heartbeat',{claim}).catch(error=>{if([401,403,409].includes(error.status))controller.abort();}),60000);
 try{
  const sha=value=>createHash('sha256').update(value).digest('hex');
  if(!job.codexFallback||job.executionRoute!=='legacy'||sha(job.chapter.markdown)!==job.chapter.digest)throw Error('本机接手的固定资料无法核对');
  const result=await runCodexData({directory,identity:{project:'second-language',task:job.id,generation:String(job.codexFallback.apiAttempt),chapterDigest:job.chapter.digest,conversationDigest:sha(JSON.stringify(job.messages))},schema:QUESTION_CLOUD_SCHEMA,instructions:QUESTION_CLOUD_INSTRUCTIONS,input:{chapter:job.chapter,messages:job.messages},model:'gpt-6.1-sol',signal:controller.signal,validate:value=>{if(!value||Object.keys(value).join(',')!=='answer'||typeof value.answer!=='string'||!value.answer.trim()||value.answer.length>100000)throw Error('答复格式无效');return value;}});
  await call('/'+job.id+'/complete',{claim,answer:result.value.answer});console.log(JSON.stringify({completed:true,project:'second-language',reused:result.reused}));
 }catch(error){await call('/'+job.id+'/fail',{claim,outcomeUnknown:error.outcomeUnknown===true}).catch(()=>{});console.error(error.outcomeUnknown?'本机执行结果待核对，未重复发送。':'本机处理未完成，已保存原任务。');process.exitCode=1;}
 finally{clearInterval(timer);}
}

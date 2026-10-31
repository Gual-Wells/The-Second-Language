import {readFile,readdir} from 'node:fs/promises';
import path from 'node:path';
export async function openAIQuota(config,{readFileImpl=readFile,readdirImpl=readdir}={}){
 const checkedAt=new Date().toISOString();let evidence={};
 try{evidence=JSON.parse(await readFileImpl(config.creditFile,'utf8'));}catch{}
 const issued=Number.isFinite(evidence.issuedAmount)&&evidence.issuedAmount>=0?evidence.issuedAmount:null;
 const verified=evidence.remainingVerified===true&&Number.isFinite(evidence.remainingAmount)&&evidence.remainingAmount>=0;
 const usage={inputTokens:0,outputTokens:0,cachedInputTokens:0,responses:0};let usageComplete=false;
 try{for(const name of await readdirImpl(config.usageDirectory)){
  if(!/^[a-f0-9]{64}\.json$/.test(name))continue;
  const record=JSON.parse(await readFileImpl(path.join(config.usageDirectory,name),'utf8'));if(!record.usage)continue;
  const part={inputTokens:record.usage.input_tokens,outputTokens:record.usage.output_tokens,cachedInputTokens:record.usage.input_tokens_details?.cached_tokens??0,responses:1};
  if(Object.values(part).some(value=>!Number.isSafeInteger(value)||value<0)||part.cachedInputTokens>part.inputTokens)throw Error('用量原件无效');
  for(const key of Object.keys(usage)){usage[key]+=part[key];if(!Number.isSafeInteger(usage[key]))throw Error('用量超出范围');}
 }usageComplete=true;}catch{}
 return {pool:'openai',verified,remaining:verified?evidence.remainingAmount:null,issuedAmount:issued,claim:['claimed','unclaimed','unknown'].includes(evidence.claim)?evidence.claim:'unknown',expiresOn:/^\d{4}-\d{2}-\d{2}$/.test(evidence.expiresAt||'')?evidence.expiresAt:null,creditCheckedAt:typeof evidence.updatedAt==='number'?new Date(evidence.updatedAt).toISOString():evidence.updatedAt||null,checkedAt,usage:usageComplete?usage:null,usageComplete};
}

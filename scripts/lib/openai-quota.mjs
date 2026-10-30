import {readFile,readdir} from 'node:fs/promises';
import path from 'node:path';
export async function openAIQuota(config){
 const checkedAt=new Date().toISOString();let evidence={};
 try{evidence=JSON.parse(await readFile(config.creditFile,'utf8'));}catch{}
 const issued=Number.isFinite(evidence.issuedAmount)&&evidence.issuedAmount>=0?evidence.issuedAmount:null;
 const verified=evidence.remainingVerified===true&&Number.isFinite(evidence.remainingAmount)&&evidence.remainingAmount>=0;
 const usage={inputTokens:0,outputTokens:0,cachedInputTokens:0,responses:0};
 try{for(const name of await readdir(config.usageDirectory)){if(!/^[a-f0-9]{64}\.json$/.test(name))continue;const record=JSON.parse(await readFile(path.join(config.usageDirectory,name),'utf8'));if(!record.usage)continue;usage.inputTokens+=record.usage.input_tokens||0;usage.outputTokens+=record.usage.output_tokens||0;usage.cachedInputTokens+=record.usage.input_tokens_details?.cached_tokens||0;usage.responses++;}}catch{}
 return {pool:'openai',verified,remaining:verified?evidence.remainingAmount:null,issuedAmount:issued,claim:['claimed','unclaimed','unknown'].includes(evidence.claim)?evidence.claim:'unknown',expiresOn:/^\d{4}-\d{2}-\d{2}$/.test(evidence.expiresAt||'')?evidence.expiresAt:null,creditCheckedAt:typeof evidence.updatedAt==='number'?new Date(evidence.updatedAt).toISOString():evidence.updatedAt||null,checkedAt,usage};
}

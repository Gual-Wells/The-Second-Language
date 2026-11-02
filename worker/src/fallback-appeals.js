import {permanentBucket} from './storage.js';
import {FALLBACK_VALIDATOR_POLICY,validateFallbackAppeals,fallbackContexts,fallbackCaseSetText,authenticityAlarm,sha256} from '../../protocol/fallback-appeals.mjs';
import {verifyFallbackAttestation} from '../../protocol/fallback-attestation.mjs';
export {FALLBACK_VALIDATOR_POLICY};
async function storedJson(env,digest){
 if(!/^[a-f0-9]{64}$/.test(digest||'')){const e=Error('每份非真实例句须逐例申诉获准并保存独立准入签名；80%仅为警报');e.code='FALLBACK_APPEALS_PENDING';throw e;}
 const object=await permanentBucket(env).getContent(digest);if(!object)throw Error('逐例申诉原件或签名尚未永久保存');
 const text=await object.text();if(await sha256(text)!==digest)throw Error('逐例申诉原件摘要不符');
 const value=JSON.parse(text);if(JSON.stringify(value)!==text)throw Error('逐例申诉原件序列化不一致');return value;
}
export async function readFallbackAdmission(env,{chapter,parsed,publicationReviewDigest,appealsDigest,validationDigest}){
 const [value,attestation]=await Promise.all([storedJson(env,appealsDigest),storedJson(env,validationDigest)]);
 const cases=value.requests?.map(r=>({contextId:r.contextId,useIds:[...r.useIds].sort(),basisDigest:r.basisDigest}));
 const examples=fallbackContexts(parsed),real=parsed.contexts.filter(c=>c.kind!=='example'),realUses=new Set(real.flatMap(c=>c.refs||c.uses));
 await verifyFallbackAttestation(attestation,{chapterDigest:chapter.digest,sourceDigest:chapter.sourceDigest,evidenceDigest:chapter.sourcePackage.evidenceDigest,publicationReviewDigest,appealsDigest,caseSetDigest:await sha256(fallbackCaseSetText(cases)),runId:chapter.runId||chapter.date,date:chapter.date,useCount:parsed.uses.size,contextCount:parsed.contexts.length,authenticUseCount:realUses.size,authenticContextCount:real.length,approvedExampleCount:examples.length},env);
 await validateFallbackAppeals(value,{chapter,parsed,checkEvidence:false});
 return {appealsDigest,validationDigest,policy:FALLBACK_VALIDATOR_POLICY,alarm:authenticityAlarm({useCount:parsed.uses.size,authenticUseCount:realUses.size,contextCount:parsed.contexts.length,authenticContextCount:real.length})};
}

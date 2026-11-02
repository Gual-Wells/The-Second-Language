// Small additive proof. Existing body/source/review bindings remain immutable.
import {FALLBACK_VALIDATOR_POLICY} from './fallback-appeals.mjs';
export const FALLBACK_ATTESTATION_POLICY='fallback-admission-attestation-v1';
const fields=['schemaVersion','policy','keyId','validatorPolicy','chapterDigest','sourceDigest','evidenceDigest','publicationReviewDigest','appealsDigest','caseSetDigest','runId','date','useCount','contextCount','authenticUseCount','authenticContextCount','approvedExampleCount','validatedAt'];
export function canonicalFallbackAttestation(value){
 if(!value||Object.keys(value).some(k=>![...fields,'signature'].includes(k))||fields.some(k=>!Object.hasOwn(value,k)))throw Error('逐例准入签名字段无效');
 if(value.schemaVersion!==1||value.policy!==FALLBACK_ATTESTATION_POLICY||value.validatorPolicy!==FALLBACK_VALIDATOR_POLICY||!/^[A-Za-z0-9._-]{1,100}$/.test(value.keyId||'')||!/^[A-Za-z0-9._:-]{1,100}$/.test(value.runId||'')||!/^20\d{2}-\d{2}-\d{2}$/.test(value.date||''))throw Error('逐例准入签名身份无效');
 for(const key of ['chapterDigest','sourceDigest','evidenceDigest','publicationReviewDigest','appealsDigest','caseSetDigest'])if(!/^[a-f0-9]{64}$/.test(value[key]||''))throw Error('逐例准入签名摘要无效');
 for(const key of ['useCount','contextCount','authenticUseCount','authenticContextCount','approvedExampleCount'])if(!Number.isSafeInteger(value[key])||value[key]<0)throw Error('逐例准入签名范围无效');
 if(!value.useCount||!value.contextCount||value.authenticUseCount>value.useCount||value.authenticContextCount+value.approvedExampleCount!==value.contextCount)throw Error('仍有未准入语境');
 if(typeof value.validatedAt!=='string'||!Number.isFinite(Date.parse(value.validatedAt))||new Date(value.validatedAt).toISOString()!==value.validatedAt||Date.parse(value.validatedAt)>Date.now()+300000)throw Error('逐例准入时间无效');
 return JSON.stringify(Object.fromEntries([...fields].sort().map(k=>[k,value[k]])));
}
const bytes=(text,max)=>{if(typeof text!=='string'||!text.length||text.length>max||text.length%4||!/^[A-Za-z0-9+/]*={0,2}$/.test(text))throw Error('逐例准入签名编码无效');const raw=atob(text);if(btoa(raw)!==text)throw Error('逐例准入签名编码无效');return Uint8Array.from(raw,c=>c.charCodeAt(0));};
export async function verifyFallbackAttestation(value,expected,env){
 const payload=canonicalFallbackAttestation(value);
 for(const [key,want]of Object.entries(expected))if(!fields.includes(key)||want===undefined||value[key]!==want)throw Error('逐例准入签名与当前'+key+'不符');
 let ring;try{ring=JSON.parse(env.PUBLICATION_VALIDATOR_KEYS);}catch{throw Error('逐例准入公钥未配置');}
 if(!ring||!Object.hasOwn(ring,value.keyId))throw Error('逐例准入公钥不受信任');
 const signature=bytes(value.signature,128);if(signature.length!==64)throw Error('逐例准入签名长度无效');
 const key=await crypto.subtle.importKey('spki',bytes(ring[value.keyId],2048),{name:'Ed25519'},false,['verify']);
 if(!await crypto.subtle.verify({name:'Ed25519'},key,signature,new TextEncoder().encode(payload)))throw Error('逐例准入签名不匹配');
 return value;
}

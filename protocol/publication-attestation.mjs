// Small, versioned Ed25519 admission record. Verification uses Web Crypto only;
// it never downloads or reconstructs the full private publication bundle.
// The validator private key is an independent trust boundary. A valid signature
// does not prove semantic correctness or detect later same-size storage damage.
export const PUBLICATION_ATTESTATION_POLICY='publication-attestation-v1';
export const PUBLICATION_VALIDATOR_POLICY='chapter-evidence-review-validator-v1';
const fields=['schemaVersion','policy','keyId','validatorPolicy','chapterDigest','sourceDigest','evidenceDigest','publicationReviewDigest','runId','date','wordCount','sourceCount','validatedAt'];
const sha=value=>typeof value==='string'&&/^[a-f0-9]{64}$/.test(value);
function payload(value){
 if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).some(key=>![...fields,'signature'].includes(key))||fields.some(key=>!Object.hasOwn(value,key)))throw Error('出版验证签名对象字段无效');
 if(value.schemaVersion!==1||value.policy!==PUBLICATION_ATTESTATION_POLICY||value.validatorPolicy!==PUBLICATION_VALIDATOR_POLICY||typeof value.keyId!=='string'||!/^[A-Za-z0-9._-]{1,100}$/.test(value.keyId)||typeof value.runId!=='string'||!/^[A-Za-z0-9._:-]{1,100}$/.test(value.runId)||typeof value.date!=='string'||!/^20\d{2}-\d{2}-\d{2}$/.test(value.date||'')||!Number.isFinite(Date.parse(value.date))||new Date(value.date).toISOString().slice(0,10)!==value.date)throw Error('出版验证策略或运行身份无效');
 for(const field of ['chapterDigest','sourceDigest','evidenceDigest','publicationReviewDigest'])if(!sha(value[field]))throw Error('出版验证摘要无效');
 if(!Number.isSafeInteger(value.wordCount)||value.wordCount<1||value.wordCount>200||!Number.isSafeInteger(value.sourceCount)||value.sourceCount<1)throw Error('出版验证范围无效');
 if(typeof value.validatedAt!=='string'||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value.validatedAt)||!Number.isFinite(Date.parse(value.validatedAt))||new Date(value.validatedAt).toISOString()!==value.validatedAt)throw Error('出版验证时间无效');
 return Object.fromEntries(fields.map(field=>[field,value[field]]));
}
// The signed payload has only scalar fields; sorting its fixed keys gives a
// stable wire representation independent of input property insertion order.
export function canonicalPublicationAttestationPayload(value){const data=payload(value);return JSON.stringify(Object.fromEntries(Object.keys(data).sort().map(key=>[key,data[key]])));}
function base64(value,label,max){
 if(typeof value!=='string'||!value.length||value.length>max||value.length%4||!/^[A-Za-z0-9+/]*={0,2}$/.test(value))throw Error(label+'编码无效');
 let decoded;try{decoded=atob(value);}catch{throw Error(label+'编码无效');}
 if(btoa(decoded)!==value)throw Error(label+'编码无效');return Uint8Array.from(decoded,c=>c.charCodeAt(0));
}
export async function verifyPublicationAttestation(value,expected,env){
 const canonical=canonicalPublicationAttestationPayload(value);
 for(const field of ['chapterDigest','sourceDigest','evidenceDigest','publicationReviewDigest','runId','date','wordCount','sourceCount'])if(expected?.[field]===undefined||value[field]!==expected[field])throw Error('出版验证签名与固定'+field+'不一致');
 if(Date.parse(value.validatedAt)>Date.now()+300000)throw Error('出版验证时间在未来');
 let keyring;try{keyring=JSON.parse(env?.PUBLICATION_VALIDATOR_KEYS);}catch{throw Error('出版验证公钥尚未配置');}
 if(!keyring||typeof keyring!=='object'||Array.isArray(keyring)||!Object.hasOwn(keyring,value.keyId))throw Error('出版验证签名公钥不受信任');
 const spki=base64(keyring[value.keyId],'出版验证公钥',2048),signature=base64(value.signature,'出版验证签名',128);if(signature.length!==64)throw Error('出版验证签名长度无效');
 let key;try{key=await crypto.subtle.importKey('spki',spki,{name:'Ed25519'},false,['verify']);}catch{throw Error('出版验证公钥格式无效');}
 if(!await crypto.subtle.verify({name:'Ed25519'},key,signature,new TextEncoder().encode(canonical)))throw Error('出版验证签名不匹配');
 return value;
}

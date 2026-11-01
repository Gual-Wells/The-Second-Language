import {validatePublicationReview,PUBLICATION_REVIEW_POLICY} from '../../protocol/publication-review.mjs';
import {permanentBucket} from './storage.js';
import {verifyPublicationAttestation} from '../../protocol/publication-attestation.mjs';
export {PUBLICATION_REVIEW_POLICY};
const sha=async text=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text)))].map(v=>v.toString(16).padStart(2,'0')).join('');
export async function readPublicationReview(env,digest,options){
 if(!/^[a-f0-9]{64}$/.test(digest||''))throw Error('新正文须先保存实际出版审阅记录');
 const stored=await permanentBucket(env).getContent(digest);if(!stored)throw Error('出版审阅原件尚未永久保存');
 const text=await stored.text();if(await sha(text)!==digest)throw Error('出版审阅原件摘要不符');
 const value=JSON.parse(text);if(JSON.stringify(value)!==text)throw Error('出版审阅原件序列化不一致');
 return validatePublicationReview(value,options);
}
export async function readPublicationAttestation(env,digest,expected){
 if(!/^[a-f0-9]{64}$/.test(digest||''))throw Error('新正文缺少完整证据验证器签名');
 const stored=await permanentBucket(env).getContent(digest);if(!stored)throw Error('证据验证签名原件尚未永久保存');
 const text=await stored.text();if(await sha(text)!==digest)throw Error('证据验证签名原件摘要不符');
 const value=JSON.parse(text);if(JSON.stringify(value)!==text)throw Error('证据验证签名序列化不一致');
 return verifyPublicationAttestation(value,expected,env);
}
// Delta review inherits only the exact current baseline; an intervening release
// must not be silently overwritten by a repair reviewed against an older text.
export async function assertPublicationReviewBase(env,review,chapterId,newDigest){
 if(review.basis?.mode!=='teaching-delta-v1')return null;
 const current=await env.DB.prepare(`SELECT p.digest,s.source_digest FROM published_chapters p LEFT JOIN chapter_sources s ON s.digest=p.digest WHERE p.chapter_id=?`).bind(chapterId).first();
 if(current?.digest!==newDigest&&(current?.digest!==review.basis.chapterDigest||current?.source_digest!==review.basis.sourceDigest)){
  const error=Error('定点修订的已审基线已不再当前；保留候选并核对新版本');error.code='PUBLICATION_BASE_CHANGED';throw error;
 }
 return review.basis.chapterDigest;
}

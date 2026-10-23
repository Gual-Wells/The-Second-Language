import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {canonical,scrollContentSHA} from '../../protocol/scroll-production-contract.mjs';
import {sha} from './scroll-model.mjs';
const hex=v=>typeof v==='string'&&/^[a-f0-9]{64}$/.test(v);
const attention=message=>Object.assign(Error(message),{attention:true});
const stages=['source','art','materials','layout','review','archive'];
export function assertFrozenScrollIdentity(manifest,job){
 if(manifest?.schema!=='second-language.scroll-package.v1'||manifest.certificationId!==(job.certification?.id||null)||manifest.chapterId!==job.chapter.id||manifest.chapterDigest!==job.chapter.digest||manifest.viewer?.record?.chapterDigest!==job.chapter.digest||!hex(manifest.contentSHA)||manifest.viewer.record.sha256!==manifest.contentSHA)throw attention('Frozen scroll package does not match the claimed source/event');
 if(job.certification&&(manifest.passedAt!==job.certification.passedAt||manifest.recipientId!==job.certification.recipientId))throw attention('Frozen certification event changed');
}
export async function loadLocalFrozenScroll({directory,job}){
 let manifestBytes;try{manifestBytes=await readFile(path.join(directory,'package.json'));}catch(e){if(e.code==='ENOENT')return null;throw e;}
 try{
  const manifest=JSON.parse(manifestBytes);assertFrozenScrollIdentity(manifest,job);
  const candidateBytes=await readFile(path.join(directory,'candidate.json')),reviewBytes=await readFile(path.join(directory,'review.json')),candidate=JSON.parse(candidateBytes),review=JSON.parse(reviewBytes);
  if(sha(candidateBytes)!==manifest.candidateDigest||sha(reviewBytes)!==manifest.reviewDigest||candidate.contentSHA!==manifest.contentSHA||review.contentSHA!==manifest.contentSHA||review.candidateDigest!==manifest.candidateDigest||review.approved!==true||Object.values(review.checks||{}).length!==7||Object.values(review.checks).some(v=>v!==true)||canonical(candidate.files)!==canonical(manifest.files)||await scrollContentSHA(manifest.viewer.record)!==manifest.contentSHA)throw Error('Candidate, independent review or content identity digest differs');
  for(const file of manifest.files){const target=path.resolve(directory,file.path);if(!target.startsWith(path.resolve(directory)+path.sep))throw Error('Unsafe frozen asset path');const bytes=await readFile(target);if(bytes.length!==file.bytes||sha(bytes)!==file.digest)throw Error('Frozen original changed: '+file.path);}
  return {manifest,manifestBytes,manifestDigest:sha(manifestBytes),candidateBytes,reviewBytes,review};
 }catch(e){throw attention('Complete local frozen package needs recovery; no model will rerun: '+e.message);}
}
export async function finishRemoteFrozenScroll({job,manifestDigest,request}){
 if(!hex(manifestDigest))throw attention('Archive checkpoint has no immutable manifest digest');
 const raw=await request('ASSET:'+manifestDigest),bytes=Buffer.from(raw);if(sha(bytes)!==manifestDigest)throw attention('Remote frozen manifest digest mismatch');
 const manifest=JSON.parse(bytes);assertFrozenScrollIdentity(manifest,job);
 for(let offset=0;offset<manifest.files.length;offset+=2)await request('/verify',{manifestDigest,offset,limit:2});
 await request('/complete',{manifestDigest});return {status:'ready',manifestDigest,contentSHA:manifest.contentSHA,resumedFrozen:true};
}
export async function publishLocalFrozenScroll({job,directory,frozen,request,upload,state={outputs:{}}}){
 const {manifest,manifestBytes,manifestDigest}=frozen;
 if(!hex(manifest.recovery?.baseManifestDigest))throw attention('Frozen package has no registered shared craft base');
 for(const file of manifest.files){const bytes=await readFile(path.join(directory,file.path));if(bytes.length!==file.bytes||sha(bytes)!==file.digest)throw attention('Original changed before upload: '+file.path);if(await upload(bytes,file.mime)!==file.digest)throw attention('Stored original digest mismatch');}
 if(await upload(frozen.candidateBytes,'application/json')!==manifest.candidateDigest||await upload(frozen.reviewBytes,'application/json')!==manifest.reviewDigest||await upload(manifestBytes,'application/json')!==manifestDigest)throw attention('Frozen package metadata upload mismatch');
 // Persist the complete remote package pointer BEFORE entering archive. A
 // verify interruption can now resume without local images or any model call.
 const current=stages.indexOf(job.stage||'source');for(let index=Math.max(0,current);index<stages.length;index++){
  const stage=stages[index],check={schema:'second-language.scroll-checkpoint.v1',jobId:job.id,certificationId:job.certification?.id||null,stage,state,contentSHA:manifest.contentSHA,candidateDigest:manifest.candidateDigest,...(stage==='archive'?{manifestDigest,reviewDigest:manifest.reviewDigest,recovery:manifest.recovery}:{})},bytes=Buffer.from(canonical(check)),digest=await upload(bytes,'application/json');await request('/checkpoint',{stage,digest});
 }
 return finishRemoteFrozenScroll({job,manifestDigest,request});
}

import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash,createPrivateKey,createPublicKey,sign,randomUUID} from 'node:crypto';
import {canonicalSourcePackage} from '../../protocol/current-affairs.mjs';
import {PUBLICATION_ATTESTATION_POLICY,PUBLICATION_VALIDATOR_POLICY,canonicalPublicationAttestationPayload,verifyPublicationAttestation} from '../../protocol/publication-attestation.mjs';
import {loadChapterEvidence} from './chapter-evidence.mjs';
import {loadPublicationReview} from './publication-review.mjs';

export const DEFAULT_PUBLICATION_VALIDATOR_DIRECTORY='D:/CodexStorage/private/second-language-publication-validator';
const hash=value=>createHash('sha256').update(value).digest('hex');
async function dDirectory(directory){const real=await fs.realpath(directory);if(process.platform==='win32'&&!/^D:[\\/]/i.test(real))throw Error('出版验证器私钥须实际存D盘');return real;}
function result(value,text,reused){return {value,text,digest:hash(text),bytes:Buffer.byteLength(text),reviewDigest:value.publicationReviewDigest,reused};}
export async function saveImmutable(file,text){
 await fs.mkdir(path.dirname(file),{recursive:true});await dDirectory(path.dirname(file));const temporary=file+'.'+randomUUID()+'.tmp';let handle;
 try{handle=await fs.open(temporary,'wx');await handle.writeFile(text);await handle.sync();await handle.close();handle=null;try{await fs.link(temporary,file);}catch(error){if(error.code!=='EEXIST')throw error;if(await fs.readFile(file,'utf8')!==text)throw Error('本版出版验证原件冲突');}}
 finally{if(handle)await handle.close();await fs.unlink(temporary).catch(error=>{if(error.code!=='ENOENT')throw error;});}
}
// This is intentionally NOT a sign(payload) API. Every invocation reconstructs
// the full evidence and checks every review issue citation before any private
// key bytes are read. A caller-supplied "passed" flag has no input channel.
export async function createPublicationAttestation(root,date,chapter,{validatorDirectory=DEFAULT_PUBLICATION_VALIDATOR_DIRECTORY}={}){
 root=await dDirectory(root);
 if(chapter?.id!==date||chapter.date!==date||chapter.sourcePackage?.studyDate!==date||typeof chapter.markdown!=='string'||hash(chapter.markdown)!==chapter.digest||hash(canonicalSourcePackage(chapter.sourcePackage))!==chapter.sourceDigest)throw Error('出版签发输入的日期或正文/来源摘要不符');
 const evidence=await loadChapterEvidence(root,date,chapter.sourcePackage,{markdown:chapter.markdown});
 const runId=chapter.runId||date;
 if(evidence.manifest.runId!==runId||evidence.manifest.wordCount!==chapter.wordCount||evidence.manifest.sourceCount!==chapter.sourcePackage.sources.length)throw Error('出版签发运行或完整证据范围不一致');
 const review=await loadPublicationReview(root,date,{...chapter,runId},{evidence,required:true});
 if(chapter.publicationReviewDigest!=null&&chapter.publicationReviewDigest!==review.digest)throw Error('出版签发与实际本版审阅摘要不符');
 const binding={chapterDigest:chapter.digest,sourceDigest:chapter.sourceDigest,evidenceDigest:chapter.sourcePackage.evidenceDigest,publicationReviewDigest:review.digest,runId,date,wordCount:evidence.manifest.wordCount,sourceCount:evidence.manifest.sourceCount};
 // Only after both real loaders succeed may the validator configuration be
 // consulted. The keyring is public; the private file is read further below.
 const directory=await dDirectory(validatorDirectory),config=JSON.parse(await fs.readFile(path.join(directory,'validator.json'),'utf8')),keyringText=await fs.readFile(path.join(directory,'public-keyring.json'),'utf8'),keyring=JSON.parse(keyringText);
 if(config.schemaVersion!==1||!/^[A-Za-z0-9._-]{1,100}$/.test(config.keyId||'')||!Object.hasOwn(keyring,config.keyId))throw Error('本机出版验证器公钥配置无效');
 const file=path.join(root,'work/runs',date,'teaching/publication-attestations',hash(JSON.stringify({...binding,keyId:config.keyId}))+'.json');
 try{const physical=await fs.realpath(file);await dDirectory(path.dirname(physical));const text=await fs.readFile(physical,'utf8'),value=JSON.parse(text);if(JSON.stringify(value)!==text)throw Error('出版验证原件序列化不一致');await verifyPublicationAttestation(value,binding,{PUBLICATION_VALIDATOR_KEYS:keyringText});return result(value,text,true);}catch(error){if(error.code!=='ENOENT')throw error;}
 const privateFile=await fs.realpath(path.join(directory,'ed25519-private.pk8'));
 if(path.dirname(privateFile)!==directory)throw Error('出版验证私钥不能指向验证器目录之外');
 const privateBytes=await fs.readFile(privateFile);let key;
 try{key=createPrivateKey({key:privateBytes,format:'der',type:'pkcs8'});}finally{privateBytes.fill(0);}
 if(key.asymmetricKeyType!=='ed25519')throw Error('出版验证器须使用Ed25519私钥');
 const spki=createPublicKey(key).export({format:'der',type:'spki'});
 if(spki.toString('base64')!==keyring[config.keyId])throw Error('出版验证器私钥与配置公钥不匹配');
 const value={schemaVersion:1,policy:PUBLICATION_ATTESTATION_POLICY,keyId:config.keyId,validatorPolicy:PUBLICATION_VALIDATOR_POLICY,...binding,validatedAt:new Date().toISOString()};
 value.signature=sign(null,Buffer.from(canonicalPublicationAttestationPayload(value)),key).toString('base64');
 await verifyPublicationAttestation(value,binding,{PUBLICATION_VALIDATOR_KEYS:keyringText});
 const text=JSON.stringify(value);await saveImmutable(file,text);return result(value,text,false);
}

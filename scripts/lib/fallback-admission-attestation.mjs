import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash,createPrivateKey,createPublicKey,sign} from 'node:crypto';
import {canonicalSourcePackage as canonical} from '../../protocol/current-affairs.mjs';
import {FALLBACK_VALIDATOR_POLICY} from '../../protocol/fallback-appeals.mjs';
import {FALLBACK_ATTESTATION_POLICY,canonicalFallbackAttestation,verifyFallbackAttestation} from '../../protocol/fallback-attestation.mjs';
import {loadChapterEvidence} from './chapter-evidence.mjs';
import {loadPublicationReview} from './publication-review.mjs';
import {loadFallbackAppeals,appealFolder} from './fallback-appeals.mjs';
import {DEFAULT_PUBLICATION_VALIDATOR_DIRECTORY,saveImmutable} from './publication-attestation.mjs';
const hash=s=>createHash('sha256').update(s).digest('hex');
const item=(value,text)=>({value,text,digest:hash(text),bytes:Buffer.byteLength(text)});
async function dPath(file){const p=await fs.realpath(file);if(process.platform==='win32'&&!/^D:[\\/]/i.test(p))throw Error('逐例审核原件与私钥须实际存D盘');return p;}
// No caller-supplied report/passed/sign API. Reconstruct all private evidence,
// source witnesses, each case basis and actual reviewer output before key access.
export async function createFallbackAdmission(root,date,chapter,{validatorDirectory=DEFAULT_PUBLICATION_VALIDATOR_DIRECTORY}={}){
 root=await dPath(root);
 if(chapter.id!==date||chapter.date!==date||hash(chapter.markdown)!==chapter.digest||hash(canonical(chapter.sourcePackage))!==chapter.sourceDigest)throw Error('逐例准入正文或来源身份不符');
 const evidence=await loadChapterEvidence(root,date,chapter.sourcePackage,{markdown:chapter.markdown});
 const publicationReview=await loadPublicationReview(root,date,chapter,{evidence,required:true});
 const appeals=await loadFallbackAppeals(root,date,chapter,{evidence});
 const c=appeals.coverage,binding={chapterDigest:chapter.digest,sourceDigest:chapter.sourceDigest,evidenceDigest:chapter.sourcePackage.evidenceDigest,publicationReviewDigest:publicationReview.digest,appealsDigest:appeals.digest,caseSetDigest:appeals.caseSetDigest,runId:chapter.runId||date,date,useCount:c.useCount,contextCount:c.contextCount,authenticUseCount:c.authenticUseCount,authenticContextCount:c.authenticContextCount,approvedExampleCount:appeals.cases.length};
 const directory=await dPath(validatorDirectory),config=JSON.parse(await fs.readFile(path.join(directory,'validator.json'),'utf8')),keyringText=await fs.readFile(path.join(directory,'public-keyring.json'),'utf8'),keyring=JSON.parse(keyringText);
 if(config.schemaVersion!==1||!Object.hasOwn(keyring,config.keyId))throw Error('逐例准入验证器公钥配置无效');
 const output=path.join(appealFolder(root,date,chapter.digest),'attestations',hash(canonical({...binding,keyId:config.keyId}))+'.json');
 try{const text=await fs.readFile(await dPath(output),'utf8'),value=JSON.parse(text);if(JSON.stringify(value)!==text)throw Error('逐例准入签名序列化不一致');await verifyFallbackAttestation(value,binding,{PUBLICATION_VALIDATOR_KEYS:keyringText});return {appeals,attestation:item(value,text),reused:true};}catch(e){if(e.code!=='ENOENT')throw e;}
 const privateFile=await dPath(path.join(directory,'ed25519-private.pk8'));if(path.dirname(privateFile)!==directory)throw Error('逐例准入私钥指向验证器之外');
 const secret=await fs.readFile(privateFile);let key;try{key=createPrivateKey({key:secret,format:'der',type:'pkcs8'});}finally{secret.fill(0);}
 if(key.asymmetricKeyType!=='ed25519'||createPublicKey(key).export({format:'der',type:'spki'}).toString('base64')!==keyring[config.keyId])throw Error('逐例准入私钥与公钥不符');
 const value={schemaVersion:1,policy:FALLBACK_ATTESTATION_POLICY,keyId:config.keyId,validatorPolicy:FALLBACK_VALIDATOR_POLICY,...binding,validatedAt:new Date().toISOString()};
 value.signature=sign(null,Buffer.from(canonicalFallbackAttestation(value)),key).toString('base64');await verifyFallbackAttestation(value,binding,{PUBLICATION_VALIDATOR_KEYS:keyringText});
 const text=JSON.stringify(value);await saveImmutable(output,text);
 return {appeals,attestation:item(value,text),reused:false};
}

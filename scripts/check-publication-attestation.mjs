// Offline signer/verifier regression. All chapters, review claims and keys are
// isolated fixtures; the real local validator private key is never read here.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {generateKeyPairSync,createHash,sign,randomUUID} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {usageContextBackendFixture} from './lib/usage-context-backend-fixture.mjs';
import {createPublicationAttestation} from './lib/publication-attestation.mjs';
import {canonicalSourcePackage} from '../protocol/current-affairs.mjs';
import {canonicalPublicationAttestationPayload,verifyPublicationAttestation} from '../protocol/publication-attestation.mjs';
const hash=value=>createHash('sha256').update(value).digest('hex');
globalThis.fetch=async()=>{throw Error('No network in publication attestation QA');};
const root=path.resolve('.cache/publication-attestation-fixture',randomUUID());await fs.mkdir(root,{recursive:true});
const fixture=usageContextBackendFixture('2099-01-29','attestation'),chapter={...fixture.value};delete chapter.publicationAttestationDigest;
fixture.review.issues=[{id:'resolved-fixture-issue',state:'resolved',severity:'minor',targetIds:['U000'],disposition:'Synthetic resolved issue with an exact self-written source citation.',refs:[{sourceId:'read:'+chapter.sourcePackage.sources[0].readDigest,quote:fixture.authors[0].contexts[0].paragraphs[0][0].text}]}];
chapter.publicationReviewDigest=hash(JSON.stringify(fixture.review));
async function seed(directory,value,assets){const run=path.join(directory,'work/runs',value.date);await fs.mkdir(path.join(run,'sources/evidence'),{recursive:true});await fs.mkdir(path.join(run,'teaching'),{recursive:true});for(const asset of assets.filter(a=>a.kind==='chapter-evidence-v1'||a.kind==='chapter-evidence-group-v1')){const text=JSON.stringify(asset);await fs.writeFile(path.join(run,'sources/evidence',hash(text)+'.json'),text);}return path.join(run,'teaching/publication-review.json');}
const reviewFile=await seed(root,chapter,fixture.assets),absentKeys=path.join(root,'no-private-key-directory');
await assert.rejects(createPublicationAttestation(root,chapter.date,chapter,{validatorDirectory:absentKeys}),/缺少本版实际出版审阅记录/,'No review cannot be replaced by caller passed flags or missing key configuration');
await fs.writeFile(reviewFile,JSON.stringify({...fixture.review,state:'draft'}));
await assert.rejects(createPublicationAttestation(root,chapter.date,{...chapter,passed:true},{validatorDirectory:absentKeys}),/尚未完成/);
await fs.writeFile(reviewFile,JSON.stringify({...fixture.review,issues:[{id:'false-quote',state:'resolved',severity:'minor',targetIds:['U000'],disposition:'Synthetic false-source citation',refs:[{sourceId:'read:'+chapter.sourcePackage.sources[0].readDigest,quote:'This quote is absent from the fixed original.'}]}]}));
await assert.rejects(createPublicationAttestation(root,chapter.date,chapter,{validatorDirectory:absentKeys}),/引文不在固定资料/,'Real fixed-source issue citations are validated before accessing any signing key');
await fs.writeFile(reviewFile,JSON.stringify(fixture.review));
const bad=structuredClone(chapter),badRoot=path.join(root,'bad-evidence'),oldGroup=fixture.assets.find(a=>a.kind==='chapter-evidence-group-v1'),badGroup={...oldGroup,records:[oldGroup.records[0]]},badText=JSON.stringify(badGroup),oldManifest=fixture.assets.find(a=>a.kind==='chapter-evidence-v1'),badManifest={...oldManifest,groups:[{digest:hash(badText),bytes:Buffer.byteLength(badText)}]};
bad.sourcePackage.evidenceDigest=hash(JSON.stringify(badManifest));bad.sourceDigest=hash(canonicalSourcePackage(bad.sourcePackage));
const badReview={...fixture.review,evidenceDigest:bad.sourcePackage.evidenceDigest,sourceDigest:bad.sourceDigest};bad.publicationReviewDigest=hash(JSON.stringify(badReview));
await fs.writeFile(await seed(badRoot,bad,[badGroup,badManifest]),JSON.stringify(badReview));
await assert.rejects(createPublicationAttestation(badRoot,bad.date,bad,{validatorDirectory:absentKeys}),/漏词|缺少|无效/,'A self-consistent empty bundle cannot obtain a real validation signature');

const keys=generateKeyPairSync('ed25519'),spki=keys.publicKey.export({format:'der',type:'spki'}),keyId='fixture-'+hash(spki).slice(0,24),keyring={[keyId]:spki.toString('base64')},validatorDirectory=path.join(root,'private-test-validator');await fs.mkdir(validatorDirectory,{mode:0o700});
if(process.platform==='win32'){
 const literal=validatorDirectory.replaceAll("'","''");
 execFileSync('powershell.exe',['-NoProfile','-NonInteractive','-Command',`$ErrorActionPreference='Stop';$acl=New-Object System.Security.AccessControl.DirectorySecurity;$acl.SetAccessRuleProtection($true,$false);foreach($sid in @([System.Security.Principal.WindowsIdentity]::GetCurrent().User,(New-Object System.Security.Principal.SecurityIdentifier('S-1-5-18')))){$acl.AddAccessRule((New-Object System.Security.AccessControl.FileSystemAccessRule($sid,'FullControl','ContainerInherit,ObjectInherit','None','Allow')))};[System.IO.Directory]::SetAccessControl('${literal}',$acl)`],{windowsHide:true,stdio:'pipe'});
}
const privateFile=path.join(validatorDirectory,'ed25519-private.pk8'),privateBytes=keys.privateKey.export({format:'der',type:'pkcs8'});await fs.writeFile(privateFile,privateBytes,{flag:'wx',mode:0o600});privateBytes.fill(0);
await fs.writeFile(path.join(validatorDirectory,'validator.json'),JSON.stringify({schemaVersion:1,keyId}));await fs.writeFile(path.join(validatorDirectory,'public-keyring.json'),JSON.stringify(keyring));
try{
 const signed=await createPublicationAttestation(root,chapter.date,chapter,{validatorDirectory}),env={PUBLICATION_VALIDATOR_KEYS:JSON.stringify(keyring)},binding={chapterDigest:chapter.digest,sourceDigest:chapter.sourceDigest,evidenceDigest:chapter.sourcePackage.evidenceDigest,publicationReviewDigest:chapter.publicationReviewDigest,runId:chapter.runId,date:chapter.date,wordCount:50,sourceCount:1};
 assert.equal(hash(signed.text),signed.digest);assert.equal(Buffer.byteLength(signed.text),signed.bytes);
 await verifyPublicationAttestation(signed.value,binding,env);
 await verifyPublicationAttestation(Object.fromEntries(Object.entries(signed.value).reverse()),binding,env);
 await assert.rejects(verifyPublicationAttestation({...signed.value,signature:undefined},binding,env),/签名/);
 await assert.rejects(verifyPublicationAttestation({...signed.value,signature:Buffer.alloc(64,7).toString('base64')},binding,env),/不匹配/);
 await assert.rejects(verifyPublicationAttestation(signed.value,{...binding,chapterDigest:'d'.repeat(64)},env),/chapterDigest/);
 await assert.rejects(verifyPublicationAttestation(signed.value,{...binding,sourceDigest:'d'.repeat(64)},env),/sourceDigest/);
 await assert.rejects(verifyPublicationAttestation(signed.value,{...binding,evidenceDigest:bad.sourcePackage.evidenceDigest},env),/evidenceDigest/);
 await assert.rejects(verifyPublicationAttestation(signed.value,{...binding,publicationReviewDigest:'d'.repeat(64)},env),/publicationReviewDigest/);
 await assert.rejects(verifyPublicationAttestation(signed.value,{...binding,date:'2099-01-30'},env),/date/);
 await assert.rejects(verifyPublicationAttestation(signed.value,{...binding,sourceCount:2},env),/sourceCount/);
 await assert.rejects(verifyPublicationAttestation({...signed.value,sourceDigest:'d'.repeat(64)},{...binding,sourceDigest:'d'.repeat(64)},env),/签名不匹配/);
 await assert.rejects(verifyPublicationAttestation(signed.value,binding,{PUBLICATION_VALIDATOR_KEYS:'{}'}),/公钥不受信任/);
 await assert.rejects(verifyPublicationAttestation({...signed.value,unexpected:true},binding,env),/字段/);
 const future={...signed.value,validatedAt:new Date(Date.now()+3600000).toISOString()};future.signature=sign(null,Buffer.from(canonicalPublicationAttestationPayload(future)),keys.privateKey).toString('base64');
 await assert.rejects(verifyPublicationAttestation(future,binding,env),/时间在未来/);
 const past={...signed.value,validatedAt:'2020-01-01T00:00:00.000Z'};past.signature=sign(null,Buffer.from(canonicalPublicationAttestationPayload(past)),keys.privateKey).toString('base64');await verifyPublicationAttestation(past,binding,env);
 const originalGroup=fixture.assets.find(asset=>asset.kind==='chapter-evidence-group-v1'),originalGroupFile=path.join(root,'work/runs',chapter.date,'sources/evidence',hash(JSON.stringify(originalGroup))+'.json'),intactBytes=await fs.readFile(originalGroupFile),flipped=Buffer.from(intactBytes);flipped[0]^=1;
 await fs.writeFile(originalGroupFile,flipped);
 await assert.rejects(createPublicationAttestation(root,chapter.date,chapter,{validatorDirectory}),/摘要不符/,'Even an existing signed cache cannot bypass a later same-length corruption on full signer revalidation');
 await fs.writeFile(originalGroupFile,intactBytes);
 // The original signature remains reusable, but stale review state cannot use
 // the cache to skip full current evidence/review verification.
 await fs.writeFile(reviewFile,JSON.stringify({...fixture.review,state:'draft'}));
 await assert.rejects(createPublicationAttestation(root,chapter.date,chapter,{validatorDirectory}),/尚未完成/);
 await fs.writeFile(reviewFile,JSON.stringify(fixture.review));await fs.unlink(privateFile);
 const reused=await createPublicationAttestation(root,chapter.date,chapter,{validatorDirectory});assert.equal(reused.reused,true);assert.equal(reused.digest,signed.digest);assert.equal(reused.value.validatedAt,signed.value.validatedAt);
 console.log(JSON.stringify({ok:true,fullEvidenceAndReviewBeforeKey:true,badEvidenceCannotSign:true,sameLengthCorruptionRejectsSignerReuse:true,issueCitationsActuallyChecked:true,missingAndWrongSignaturesRejected:true,allVersionBindings:true,canonicalOrderStable:true,futureRejected:true,oldValidRecordReusable:true,privateKeyNotNeededForValidatedCacheReuse:true,reviewDriftInvalidatesReuse:true,productionPrivateKeyRead:false,networkCalls:0,modelCalls:0}));
}finally{await fs.unlink(privateFile).catch(error=>{if(error.code!=='ENOENT')throw error;});}

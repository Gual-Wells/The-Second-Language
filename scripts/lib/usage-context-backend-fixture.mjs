// Complete self-written transport fixture. No external text is acquired and no
// model or human review is claimed: the review receipt explicitly simulates
// completed metadata for isolated route regression only.
import {createHash,generateKeyPairSync,sign} from 'node:crypto';
import {canonicalSourcePackage as canonical} from '../../protocol/current-affairs.mjs';
import {publicationReviewDraft,validatePublicationReview} from '../../protocol/publication-review.mjs';
import {PUBLICATION_ATTESTATION_POLICY,PUBLICATION_VALIDATOR_POLICY,canonicalPublicationAttestationPayload} from '../../protocol/publication-attestation.mjs';
import {verifyEvidenceRecords} from '../../protocol/chapter-evidence-records.mjs';
import {assembleUsageContextCollection} from './usage-context-authoring.mjs';
import {teachingScope} from '../../protocol/teaching-disposition.mjs';
import {indexTextbook} from './textbook-sources.mjs';

const hash=value=>createHash('sha256').update(value).digest('hex');
// Ephemeral fixture key only. The production validator is an independent trust
// boundary: a publisher token does not possess its signing capability. Do not
// export a fixture sign(payload) helper or use this key outside isolated envs.
const fixtureKeys=generateKeyPairSync('ed25519'),fixtureSpki=fixtureKeys.publicKey.export({format:'der',type:'spki'}),fixtureKeyId='fixture-'+hash(fixtureSpki).slice(0,24);
export const backendFixtureValidatorKeys=JSON.stringify({[fixtureKeyId]:fixtureSpki.toString('base64')});
export const backendFixtureWords=Array.from({length:50},(_,i)=>({id:'W'+String(i).padStart(3,'0'),use:'U'+String(i).padStart(3,'0'),text:'word'+String(i).padStart(3,'0')}));
export function usageContextBackendFixture(date,version){
 const commit='a'.repeat(40),url='https://example.test/reference',readRecord='fixture-only/self-written-read-record.json',readAt='2026-10-27T00:00:00.000Z';
 const selection={studyDate:date,vixInputCommit:commit,authoringPolicy:'authentic-context-v1',mainWords:backendFixtureWords.map((w,i)=>({text:w.text,entryId:'fixture-entry-'+i,globalRank:i+1,family:[]}))};
 const books=['collins','oxford'].map(book=>indexTextbook(Buffer.from(backendFixtureWords.map(w=>`## ${w.text}\n${w.text} is a self-written ${book} transport definition, not actual dictionary material.\n`).join('\n')),book));
 const packets=backendFixtureWords.map(w=>{const entries=books.flatMap(b=>b.lookup(w.text)),packet={schemaVersion:1,commit,word:w.text,terms:[w.text],queries:[{term:w.text,books:books.map(b=>({book:b.book,entryIds:b.lookup(w.text).map(e=>e.id)}))}],entries,exampleCandidates:[]};const materialText=canonical(packet);return{...packet,materialText,materialDigest:hash(materialText)};});
 const authors=backendFixtureWords.map((w,i)=>{
  const title=version==='layout3'?`${w.text} /wɝd/ n. · 测试用途`:version==='layout2'?`${w.text} /wɝd/ n.`:`${w.text} · 验证义 /wɝd/`;
  const contextId='C'+String(i===49?48:i).padStart(3,'0'),uses=i===48?['U048','U049']:[w.use];
  const text=i===48?`We compare word048 with word049 in fixture ${version}.`:`We use ${w.text} in fixture ${version}.`;
  const packet=packets[i];
  return {wordId:w.id,text:w.text,materialDigest:packet.materialDigest,...(['layout2','layout3'].includes(version)?{layoutVersion:2}:{}),...(version==='layout3'?{quickGlossVersion:1}:{}),partOne:`<!-- WORD:${w.id} -->\n# ${w.text}\n\n**词源**：只供隔离接口验证，不是正式教学内容。\n\n<!-- USE:${w.use} -->\n## ${title}\n\`隔离验证用法\`\n\n<!-- CONTEXT_SLOT:${w.use} -->`,
   contexts:i===49?[]:[{id:contextId,kind:i===0?'abridgment':'example',uses,title:'Isolated context',sourceUrls:i===0?[url]:[],displayContext:'Not real teaching material.',paragraphs:[[{id:'S'+String(i).padStart(3,'0'),text,uses}]],translation:'本段仅用于独立工程验证，并非正式学习内容。\n\n整块译文不进入英文发音白名单。',sourceEvidence:i===0?[{url,readRecord,locator:'Self-written fixture paragraph 1',senseEvidence:'Self-written token placement only; no lexical correctness claim.',changes:'First self-written original sentence retained.',publicationBasis:'Author-owned isolated testing material.'}]:[],...(i===0?{}:{fallbackReason:'Self-written isolated interface example; not an adopted external source.'})}],
   contextChoices:[{useId:w.use,contextIds:[contextId],reason:'Single isolated transport candidate; shared C048 maps both real fixture USE identities.'}],sourceCoverage:packet.entries.map(e=>({sourceId:e.id,disposition:'Self-written fixture definition is retained in the full fixed material packet.'})),exampleCoverage:[]};
 });
 const {markdown,parsed}=assembleUsageContextCollection(authors,{expectedWordCount:50}),digest=hash(markdown);
 const original=authors[0].contexts[0].paragraphs[0][0].text+'\nThis source was written only for isolated interface testing; it is not an external document or a teaching claim.';
 const source={sourceId:'fixture-source',url,title:'Isolated self-written source',publisher:'Fixture',readAt,readDigest:hash(original),facts:['This is an isolated self-written test source; the first retained sentence occurs verbatim.']};
 const scope=teachingScope(selection),materials={schemaVersion:1,policy:'sourced-collection-v1',commit,scope,scopeDigest:hash(canonical(scope)),additionalTerms:{},books:books.map(b=>({book:b.book,digest:b.digest})),packets:packets.map(p=>({word:p.word,materialDigest:p.materialDigest,file:`teaching/materials/${p.materialDigest}.json`}))};
 const materialsManifestText=JSON.stringify(materials),receipt={schemaVersion:1,kind:'read-original-text',acquisitionMethod:'native-get',sourceId:source.sourceId,canonicalUrl:url,requestedUrl:url,finalUrl:url,readAt,textDigest:source.readDigest,textChars:original.length,readScope:'Self-written in-memory fixture text only; no external acquisition occurred.',fixtureOnly:true},recordText=JSON.stringify(receipt),recordDigest=hash(recordText);
 const group={schemaVersion:1,kind:'chapter-evidence-group-v1',records:[{kind:'control',selection,materialsManifestText,materialsManifestDigest:hash(materialsManifestText)},...authors.map((authored,i)=>{const authorText=JSON.stringify(authored);return{kind:'word',wordId:authored.wordId,text:authored.text,authorText,authorDigest:hash(authorText),materialText:packets[i].materialText,materialDigest:packets[i].materialDigest};}),{kind:'text',readDigest:source.readDigest,text:original},{kind:'source',sourceId:source.sourceId,url,canonicalUrl:url,readDigest:source.readDigest,recordText,recordDigest,authorReadRecords:[{references:[readRecord],recordText,recordDigest}]}]};
 const groupText=JSON.stringify(group),manifest={schemaVersion:1,kind:'chapter-evidence-v1',studyDate:date,runId:date,chapterDigest:digest,selectionDigest:hash(canonical(selection)),vixInputCommit:commit,authoringPolicy:'authentic-context-v1',wordCount:50,sourceCount:1,groups:[{digest:hash(groupText),bytes:Buffer.byteLength(groupText)}]};
 const sourcePackage={schemaVersion:1,format:'usage-context-v1',studyDate:date,chapterDigest:digest,selectionDigest:manifest.selectionDigest,vixInputCommit:commit,context:'Isolated transport fixture, not a real teaching chapter.',contexts:parsed.contexts.map(c=>({id:c.id,kind:c.kind,sourceUrls:c.sourceUrls})),sources:[source],evidenceDigest:hash(JSON.stringify(manifest))};
 const value={id:date,date,runId:date,title:'Isolated context fixture',subtitle:'Not a course',number:'第 99 章',wordCount:50,contentPolicy:'etymology-fused-v1',authoringPolicy:'authentic-context-v1',sourcePolicy:'current-affairs-v1',markdown,digest,vixInputCommit:commit,vixCommit:'b'.repeat(40),protocolCommit:'c'.repeat(40),sourcePackage,sourceDigest:hash(canonical(sourcePackage))};
 // Fail early in the fixture builder, under the exact same full verification
 // as the Worker. A valid test must not weaken production admission.
 const evidence=verifyEvidenceRecords(manifest,[group],value);
 const review=publicationReviewDraft({chapter:value,parsed,runId:date});review.state='complete';review.reviewedAt=new Date().toISOString();review.reviewer={kind:'codex',model:'fixture-no-model-executed',effort:'high',runReference:'isolated-backend-fixture/simulated-review-metadata-only'};review.checks=Object.fromEntries(Object.keys(review.checks).map(key=>[key,'complete']));review.summary='Simulated completed review metadata for isolated deterministic route testing only. No actual model or human semantic review is claimed.';
 value.publicationReviewDigest=hash(JSON.stringify(review));
 validatePublicationReview(review,{chapter:value,parsed,runId:date,evidence});
 // A test may simulate the independently validated signer only after the
 // complete self-written fixture really passes that same local validator.
 const attestation={schemaVersion:1,policy:PUBLICATION_ATTESTATION_POLICY,keyId:fixtureKeyId,validatorPolicy:PUBLICATION_VALIDATOR_POLICY,chapterDigest:value.digest,sourceDigest:value.sourceDigest,evidenceDigest:sourcePackage.evidenceDigest,publicationReviewDigest:value.publicationReviewDigest,runId:date,date,wordCount:50,sourceCount:1,validatedAt:new Date().toISOString()};
 attestation.signature=sign(null,Buffer.from(canonicalPublicationAttestationPayload(attestation)),fixtureKeys.privateKey).toString('base64');
 value.publicationAttestationDigest=hash(JSON.stringify(attestation));
 return{value,assets:[group,manifest,review,attestation],authors,manifest,original,review,attestation};
}

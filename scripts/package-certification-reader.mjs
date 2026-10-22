import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync,spawnSync} from 'node:child_process';
if(process.argv.length>2)throw Error('Production packaging accepts no historical mode. Use the fixed historical checkout or independent labs for first/fifth chapter specimens.');
const reportPath='research/scroll-sound-adoption-2026-10-23/verification.json';
const project=JSON.parse(await readFile(reportPath,'utf8'));
if(!project.checks||!Object.keys(project.checks).length||Object.values(project.checks).some(value=>value!==true)||!['errors','missing','writes'].every(key=>Array.isArray(project[key])&&project[key].length===0)||!Array.isArray(project.resources)||!project.resources.length)throw Error('No passing current project reader interaction report');
assert.deepEqual(project.chapterLabels,['项目纪念']);assert.equal(project.mode,'project-beginning-only-document-default-sound');
assert.equal(project.projectCatalogue,'project-beginning');assert.equal(project.profile,'beginning');assert.equal(project.catalogueWork,'project-beginning');
for(const check of ['researchProfilesRejected','trustedEntryUnlocksDefaultSound','oldMuteIgnored','noSoundSettingsUI','documentFullEnglishChineseFromRecord','documentMetadataFromRecord','actualClipboardCopies','documentControlsDoNotToggle','documentFocusAndEscape','hiddenPausesWithoutReplay','exitStopsSound','lateDecodeCannotRevive'])assert.equal(project.checks[check],true,'Required reader correction not verified: '+check);
assert.equal(project.checks.decodedOriginalPixelsMatch,true);assert.equal(project.checks.actualMaterialProfileRestored,true);
assert.equal(project.record.category,'project-commemorative');assert.equal(project.record.status,'commemorative');assert.equal(project.record.attestation,null);assert.equal(project.record.sha256,'4a83d1952e133bcecd6c1aa2e14a788159b410e9a6ea2a7f5bcf42610943e37b');
const paths=new Set(project.resources.map(r=>new URL(r).pathname).filter(p=>!p.startsWith('/api/')&&!p.startsWith('/auth/')).map(p=>p==='/'?'/index.html':p));
for(const p of ['/labs/certification-reader/CREDITS.md','/labs/certification-reader/AUDIO_CREDITS.md'])paths.add(p);
// All packaged hashes come from staged bytes. A passing browser observation
// cannot silently substitute newer working-tree paper or metadata for them.
const indexed=new Map(),hash=bytes=>createHash('sha256').update(bytes).digest('hex');
function fromIndex(url){
 if(!url.startsWith('/')||url.includes('..')||url.includes('\\'))throw Error('Bad asset path');
 if(!indexed.has(url))indexed.set(url,execFileSync('git',['show',':web'+url],{windowsHide:true,maxBuffer:32*1024*1024}));
 return indexed.get(url);
}
assert.ok(project.observedSHA256&&Object.keys(project.observedSHA256).length,'Browser response byte evidence is required');
for(const [url,expected]of Object.entries(project.observedSHA256))assert.equal(hash(fromIndex(url)),expected,'Staged release differs from the browser-verified bytes: '+url);
// Runtime recordings and their BY/CC0 attribution travel with the recovery
// package. Source membership does not cause the viewer to preload originals.
const audioBase='/labs/certification-reader/',audioManifestURL=audioBase+'assets/audio-sources/manifest.json';
const audio=JSON.parse(fromIndex(audioManifestURL));assert.equal(audio.schema,'second-language.reader-material-audio.v3');paths.add(audioManifestURL);
assert.ok(audio.licenses.includes('CC0-1.0'));assert.ok(audio.licenses.includes('Adobe Content Files terms'));assert.equal(audio.revision,'v42-approved-recorded-foley');
assert.equal(audio.runtime.length,13);
for(const asset of audio.runtime){const url=new URL(asset.path,'https://pack.invalid'+audioBase).pathname,bytes=fromIndex(url);paths.add(url);assert.equal(bytes.length,asset.bytes);assert.equal(hash(bytes),asset.sha256,'Current audio recording changed: '+url);}
const audioSourcesBase=new URL(audioManifestURL,'https://pack.invalid');
for(const reference of audio.provenance){
 const url=new URL(reference,audioSourcesBase).pathname;paths.add(url);const provenance=JSON.parse(fromIndex(url));
 for(const take of provenance.recordings||provenance.materials||[]){
  const asset=new URL(take.file,'https://pack.invalid'+url).pathname,bytes=fromIndex(asset);paths.add(asset);
  assert.equal(bytes.length,take.bytes);assert.equal(hash(bytes),take.sha256,'Adopted recording changed: '+asset);
 }
}
for(const name of ['sound.js','sound-base.js','keeper-sound.js'])paths.add(audioBase+name);
const projectBase='/labs/project-beginning/',surfaceURL=projectBase+'assets/surfaces.json';
for(const url of [projectBase+'record.json',projectBase+'art-plan.json',projectBase+'charter.js',projectBase+'document.js',projectBase+'templates.js',projectBase+'scroll-object.js',surfaceURL])paths.add(url);
const record=JSON.parse(fromIndex(projectBase+'record.json')),plan=JSON.parse(fromIndex(projectBase+'art-plan.json')),surfaces=JSON.parse(fromIndex(surfaceURL));
assert.equal(record.workId,'SL-PROJECT-BEGINNING-20261021');assert.equal(record.workId,project.record.workId);assert.equal(record.category,'project-commemorative');assert.equal(record.status,'commemorative');assert.equal(record.attestation,null);assert.equal(record.projectFoundedAt,null);assert.equal(record.madeAt,'2026-10-21T12:10:23.227Z');
for(const key of ['chapterId','chapterNumber','chapterTitle','chapterDigest','foundedAt','certifiedAt','passedAt'])assert.ok(!Object.hasOwn(record,key));
assert.equal(surfaces.schema,'second-language.frozen-surfaces.v1');assert.equal(surfaces.workId,record.workId);assert.equal(surfaces.category,record.category);assert.equal(surfaces.contentSHA256,project.record.sha256);assert.equal(surfaces.artPlanSHA256,project.record.artPlanDigest);
assert.equal(surfaces.width,2048);assert.equal(surfaces.height,2868);
for(const [file,expected]of Object.entries(surfaces.producer.sourceSHA256)){const bytes=execFileSync('git',['show',':'+file],{windowsHide:true,maxBuffer:32*1024*1024});assert.equal(hash(bytes),expected,'Staged manufacturing source changed: '+file);}

const canonical=value=>Array.isArray(value)?'['+value.map(canonical).join(',')+']':value&&typeof value==='object'?'{'+Object.keys(value).sort().map(key=>JSON.stringify(key)+':'+canonical(value[key])).join(',')+'}':JSON.stringify(value);
assert.equal(hash(Buffer.from(canonical(plan))),surfaces.artPlanSHA256,'Staged art plan differs from the accepted frozen paper');
// Reconstruct the actual content identity from staged record/plan bytes too.
// Comparing a report to surfaces alone would permit both to describe an older
// work while silently packaging changed staged metadata or a newer copy.
const edition=fromIndex(projectBase+'charter.js').toString('utf8').match(/export const EDITION='([^']+)'/);assert.ok(edition,'The staged charter edition is missing');
const canonicalPayload=canonical({schema:'second-language.project-content.v1',edition:edition[1],category:record.category,workId:record.workId,status:record.status,
 ownerId:record.ownerId,recipient:record.recipient,madeAt:record.madeAt,projectFoundedAt:null,attestation:record.attestation,source:record.source,template:record.template,sealVariant:record.sealVariant,artPlan:plan});
assert.equal(hash(Buffer.from(canonicalPayload)),surfaces.contentSHA256,'Staged record/plan do not reproduce the frozen content identity');
assert.equal(canonicalPayload,project.record.canonicalPayload,'Browser verified a different canonical payload');
const sizes={front:[2048,2868],back:[2048,2868],ink:[2048,2868],relief:[2048,2868],sealInk:[784,360],sealMask:[784,360]};
for(const [key,[width,height]]of Object.entries(sizes)){
 const layer=surfaces.layers[key],name='final-'+key.replace(/[A-Z]/g,letter=>'-'+letter.toLowerCase())+'.png';assert.equal(layer.src,name);
 const url=new URL(layer.src,'https://pack.invalid'+surfaceURL).pathname,bytes=fromIndex(url);paths.add(url);
 assert.equal(bytes.length,layer.bytes);assert.equal(hash(bytes),layer.sha256);assert.ok(bytes.length>=33&&bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),'Frozen layer is not a PNG');
 assert.equal(bytes.readUInt32BE(8),13);assert.equal(bytes.subarray(12,16).toString('ascii'),'IHDR');assert.equal(bytes.readUInt32BE(16),width);assert.equal(bytes.readUInt32BE(20),height);assert.equal(layer.width,width);assert.equal(layer.height,height);
}
// Include the small authoring inputs as traceable assets. Inclusion in this
// manifest is not an instruction to preload them or redraw the frozen page.
for(const resource of Object.values(plan.resources)){
 const url=new URL(resource.src,'https://pack.invalid'+projectBase).pathname;paths.add(url);assert.equal(hash(fromIndex(url)),resource.sha256,'Staged authoring resource changed');
}
const credits=projectBase+'CREDITS.md';
if(spawnSync('git',['cat-file','-e',':web'+credits],{windowsHide:true,stdio:'ignore'}).status===0)paths.add(credits);
assert.ok(![...paths].some(url=>url.startsWith('/labs/project-commemorative/')),'Rejected project work leaked into the release closure');
assert.ok(![...paths].some(url=>/^\/labs\/chapter-scroll-v(?:12|14)\/chapter-sample\.json$/.test(url)),'Research chapter records leaked into the production work closure');
const files=[];
for(const url of [...paths].sort()){const bytes=fromIndex(url);files.push({url,bytes:bytes.length,sha256:hash(bytes)});}
const manifest={schema:'second-language.certification-reader-display.v1',issued:false,works:[{workId:project.record.workId,category:'project-commemorative',sha256:project.record.sha256}],scope:'The sole production work is the commissioned project-beginning commemoration, with readable bilingual document metadata and default sound. First/fifth chapter research specimens remain outside the production catalogue; shared technical dependencies are not listed as works. No assessment or award state is created.',verificationReports:[reportPath],files,bytes:files.reduce((n,f)=>n+f.bytes,0)};
await writeFile('web/labs/certification-reader/display-manifest.json',JSON.stringify(manifest,null,2)+'\n');console.log(JSON.stringify({files:files.length,bytes:manifest.bytes}));

import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync,spawnSync} from 'node:child_process';
if(process.argv.includes('--chapter-specimens-only')){
 const report=JSON.parse(await readFile('research/certification-reader-2026-10-21/verification.json','utf8'));
 assert.deepEqual(report.chapterLabels,['第一章','第五章']);
 assert.ok(Object.keys(report.checks).length&&Object.values(report.checks).every(v=>v===true));
 for(const key of ['errors','missing','writes'])assert.deepEqual(report[key],[]);
 const urls=new Set(report.resources.map(r=>new URL(r).pathname).filter(p=>!p.startsWith('/api/')&&!p.startsWith('/auth/')).map(p=>p==='/'?'/index.html':p));
 for(const p of ['/labs/certification-reader/CREDITS.md','/labs/certification-reader/AUDIO_CREDITS.md'])urls.add(p);
 const files=[...urls].sort().map(url=>{assert.ok(url.startsWith('/')&&!url.includes('..'));const bytes=execFileSync('git',['show',':web'+url],{windowsHide:true,maxBuffer:32*1024*1024});return{url,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')};});
 const manifest={schema:'second-language.certification-reader-display.v1',issued:false,works:[{chapter:1,sha256:report.first.sha256},{chapter:5,sha256:report.fifth.sha256}],scope:'Existing unissued chapter specimens only; rejected project keepsake withdrawn from the catalogue.',files,bytes:files.reduce((n,f)=>n+f.bytes,0)};
 await writeFile('web/labs/certification-reader/display-manifest.json',JSON.stringify(manifest,null,2)+'\n');console.log(JSON.stringify({files:files.length,bytes:manifest.bytes,projectWithdrawn:true}));process.exit(0);
}
const reportPath='research/certification-reader-2026-10-21/verification.json',projectPath='research/project-commemorative-2026-10-21/verification.json';
const [report,project]=await Promise.all([reportPath,projectPath].map(async file=>JSON.parse(await readFile(file,'utf8'))));
for(const [name,result]of [['reader',report],['project commemorative',project]]){
 if(!result.checks||!Object.keys(result.checks).length||Object.values(result.checks).some(v=>v!==true)||!['errors','missing','writes'].every(key=>Array.isArray(result[key])&&result[key].length===0)||!Array.isArray(result.resources)||!result.resources.length)throw Error(`No passing ${name} interaction report`);
}
assert.deepEqual(report.chapterLabels,['项目纪念','第一章','第五章']);
assert.equal(report.first.sha256,'590cc91ffca8634b7864f24825afbfc3f5fb286de5321087edd2c336f74732ea');
assert.equal(report.fifth.sha256,'a2a75215f25dc0fc40f047fd6f6648a4625ae13be7b3fa2ffca5fe72e37f43a0');
assert.equal(project.record.category,'project-commemorative');assert.equal(project.record.status,'commemorative');assert.equal(project.record.attestation,null);assert.match(project.record.sha256,/^[0-9a-f]{64}$/);
const paths=new Set([...report.resources,...project.resources].map(r=>new URL(r).pathname).filter(p=>!p.startsWith('/api/')&&!p.startsWith('/auth/')).map(p=>p==='/'?'/index.html':p));
for(const p of ['/labs/certification-reader/CREDITS.md','/labs/certification-reader/AUDIO_CREDITS.md'])paths.add(p);
// All packaged hashes come from staged bytes. A passing browser observation
// cannot silently substitute newer working-tree paper or metadata for them.
const indexed=new Map(),hash=bytes=>createHash('sha256').update(bytes).digest('hex');
function fromIndex(url){
 if(!url.startsWith('/')||url.includes('..')||url.includes('\\'))throw Error('Bad asset path');
 if(!indexed.has(url))indexed.set(url,execFileSync('git',['show',':web'+url],{windowsHide:true,maxBuffer:32*1024*1024}));
 return indexed.get(url);
}
const projectBase='/labs/project-commemorative/',surfaceURL=projectBase+'assets/surfaces.json';
for(const url of [projectBase+'record.json',projectBase+'art-plan.json',surfaceURL])paths.add(url);
const record=JSON.parse(fromIndex(projectBase+'record.json')),plan=JSON.parse(fromIndex(projectBase+'art-plan.json')),surfaces=JSON.parse(fromIndex(surfaceURL));
assert.equal(record.workId,project.record.workId);assert.equal(record.category,'project-commemorative');assert.equal(record.status,'commemorative');assert.equal(record.attestation,null);
assert.equal(surfaces.schema,'second-language.frozen-surfaces.v1');assert.equal(surfaces.workId,record.workId);assert.equal(surfaces.category,record.category);assert.equal(surfaces.contentSHA256,project.record.sha256);assert.equal(surfaces.artPlanSHA256,project.record.artPlanDigest);
assert.equal(surfaces.width,2048);assert.equal(surfaces.height,2868);
const canonical=value=>Array.isArray(value)?'['+value.map(canonical).join(',')+']':value&&typeof value==='object'?'{'+Object.keys(value).sort().map(key=>JSON.stringify(key)+':'+canonical(value[key])).join(',')+'}':JSON.stringify(value);
assert.equal(hash(Buffer.from(canonical(plan))),surfaces.artPlanSHA256,'Staged art plan differs from the accepted frozen paper');
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
const files=[];
for(const url of [...paths].sort()){const bytes=fromIndex(url);files.push({url,bytes:bytes.length,sha256:hash(bytes)});}
const manifest={schema:'second-language.certification-reader-display.v1',issued:false,works:[{workId:project.record.workId,category:'project-commemorative',sha256:project.record.sha256},{chapter:1,sha256:report.first.sha256},{chapter:5,sha256:report.fifth.sha256}],scope:'Main settings entry with a public commissioned project commemoration (not an assessment) and the existing unissued first/fifth chapter specimens. No certification database, native authoring archive or private awarded artifact.',verificationReports:[reportPath,projectPath],files,bytes:files.reduce((n,f)=>n+f.bytes,0)};
await writeFile('web/labs/certification-reader/display-manifest.json',JSON.stringify(manifest,null,2)+'\n');console.log(JSON.stringify({files:files.length,bytes:manifest.bytes}));

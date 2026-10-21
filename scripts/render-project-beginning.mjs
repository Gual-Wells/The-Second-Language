import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdir,readFile,writeFile,access} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';

// Canvas2D manufacturing trial only. Saved draft layers are NOT accepted
// originals. A later, explicit review/promotion preserves their exact bytes.
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const args=process.argv.slice(2),checkOnly=args.includes('--check'),base=new URL(args.find(arg=>!arg.startsWith('--'))||'http://127.0.0.1:8153');
if(args.some(arg=>arg.startsWith('--')&&arg!=='--check'))throw Error('Usage: node scripts/render-project-beginning.mjs [http://127.0.0.1:8153] [--check]');
if(!['http:','https:'].includes(base.protocol)||!['127.0.0.1','localhost','[::1]'].includes(base.hostname))throw Error('Typesetting requires a local HTTP origin');
const local='web/labs/project-beginning',directory=path.join(root,local),assetDirectory=path.join(directory,'assets'),manifestFile=path.join(assetDirectory,'draft-surfaces.json');
const tmp=path.join(root,'.cache/project-beginning-typesetting/tmp');await mkdir(tmp,{recursive:true});process.env.TEMP=process.env.TMP=tmp;
const sha=data=>createHash('sha256').update(data).digest('hex');
const exists=async file=>access(file).then(()=>true,()=>false);
const json=async file=>JSON.parse(await readFile(file,'utf8'));
const recordBytes=await readFile(path.join(directory,'record.json')),planBytes=await readFile(path.join(directory,'art-plan.json'));
const record=JSON.parse(recordBytes),plan=JSON.parse(planBytes);
const {prepareCharter}=await import(pathToFileURL(path.join(directory,'charter.js')));
const prepared=await prepareCharter(record,planBytes.toString('utf8'));
const expected={front:[2048,2868],back:[2048,2868],ink:[2048,2868],relief:[2048,2868],sealInk:[784,360],sealMask:[784,360]};
const filename=key=>'draft-'+key.replace(/[A-Z]/g,letter=>'-'+letter.toLowerCase())+'.png';
function pngSize(bytes){
 assert.ok(bytes.length>=33&&bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),'A draft layer must be a real PNG');
 assert.equal(bytes.readUInt32BE(8),13);assert.equal(bytes.subarray(12,16).toString('ascii'),'IHDR');return [bytes.readUInt32BE(16),bytes.readUInt32BE(20)];
}
const sourceFiles=['charter.js','document.js','templates.js','scroll-object.js'].map(file=>`${local}/${file}`).concat(['web/labs/chapter-scroll-v12/seal.js','web/labs/chapter-scroll-v10/ink-transfer.js']);
const sourceHashes={};for(const file of sourceFiles)sourceHashes[file]=sha(await readFile(path.join(root,file)));
async function validateManifest(manifest){
 assert.equal(manifest.schema,'second-language.draft-surfaces.v1');assert.equal(manifest.stage,'draft');assert.equal(manifest.artisticApproval,false);
 assert.equal(manifest.workId,prepared.workId);assert.equal(manifest.category,prepared.category);
 assert.equal(manifest.contentSHA256,prepared.contentDigest,'Different content: preserve/archive the previous trial; do not overwrite it');
 assert.equal(manifest.artPlanSHA256,prepared.artPlanDigest);assert.equal(manifest.width,2048);assert.equal(manifest.height,2868);
 assert.equal(manifest.layout.contentDigest,prepared.contentDigest);assert.equal(manifest.layout.artPlanDigest,prepared.artPlanDigest);
 assert.equal(manifest.layout.width,2048);assert.equal(manifest.layout.height,2868);
 assert.equal(manifest.seal.version,'SL-KEEPSAKE-1');assert.equal(manifest.seal.variant,'oblong');
 assert.deepEqual(manifest.producer.sourceSHA256,sourceHashes,'Source implementation changed: preserve/archive the previous trial before a new render');
 for(const [key,size]of Object.entries(expected)){
  const layer=manifest.layers[key];assert.equal(layer.src,filename(key));const bytes=await readFile(path.join(assetDirectory,layer.src));
  assert.equal(bytes.length,layer.bytes);assert.equal(sha(bytes),layer.sha256);assert.deepEqual(pngSize(bytes),size);assert.deepEqual([layer.width,layer.height],size);
 }
 return manifest;
}
// Freeze actual resource hashes first. Nulls are intentional while assets are
// prepared by the primary task, and are never silently accepted for rendering.
for(const [name,resource]of Object.entries(plan.resources)){
 assert.match(resource.sha256||'',/^[0-9a-f]{64}$/,`Set the actual ${name} resource hash before typesetting`);
 const source=path.resolve(directory,resource.src),relative=path.relative(path.join(root,'web'),source);
 assert.ok(relative&&!relative.startsWith('..'+path.sep)&&!path.isAbsolute(relative),'Resource escaped the web workspace');
 assert.equal(sha(await readFile(source)),resource.sha256,`${name} source bytes changed`);
}
const directionFile=path.resolve(root,record.source.artDirection),direction=await readFile(directionFile,'utf8');
assert.equal(sha(direction.replace(/\r\n?/g,'\n')),record.source.artDirectionSHA256,'The LF art-direction source changed');
if(await exists(manifestFile)){
 const manifest=await validateManifest(await json(manifestFile));
 console.log(JSON.stringify({status:'verified-existing-draft',contentSHA256:manifest.contentSHA256,layers:6,totalBytes:Object.values(manifest.layers).reduce((n,v)=>n+v.bytes,0),manifest:path.relative(root,manifestFile),artisticApproval:false},null,2));process.exit(0);
}
if(checkOnly)throw Error('The six draft layers have not been typeset yet');

const {chromium}=await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE||'D:/CodexStorage/workspaces/second-language-maintenance/.cache/browser-tools/package/index.mjs'));
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',env:{...process.env,TEMP:tmp,TMP:tmp},args:['--no-first-run','--disable-gpu','--disable-webgl',`--disk-cache-dir=${path.join(tmp,'chrome-cache')}`]});
const errors=[],missing=[];let rendered,browserVersion;
try{
 browserVersion=browser.version();
 const context=await browser.newContext({viewport:{width:1100,height:1500},deviceScaleFactor:1,serviceWorkers:'block'}),page=await context.newPage();
 page.setDefaultTimeout(60000);page.on('pageerror',error=>errors.push(error.message));page.on('response',response=>{if(response.status()>=400)missing.push({url:response.url(),status:response.status()});});
 const blank=new URL('/__project-beginning-typesetting__',base).href;
 await page.route(blank,route=>route.fulfill({status:200,contentType:'text/html',body:'<!doctype html><meta charset="utf-8"><title>Project beginning paper trial</title>'}));
 await page.goto(blank,{waitUntil:'domcontentloaded'});
 rendered=await page.evaluate(async({expectedContent,expectedPlan})=>{
  const contexts=[],original=HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext=function(type,...args){contexts.push(type);if(type!=='2d')throw Error('Only two-dimensional typesetting is allowed');return original.call(this,type,...args);};
  const source=new URL('/labs/project-beginning/',location.href),[{prepareCharter,exportRecord},{getTemplate},doc]=await Promise.all([import(new URL('charter.js',source)),import(new URL('templates.js',source)),import(new URL('document.js',source))]);
  const read=async url=>{const response=await fetch(url,{cache:'no-store'});if(!response.ok)throw Error(`Typesetting resource unavailable: ${url}`);return response;};
  const record=await(await read(new URL('record.json',source))).json(),plan=await(await read(new URL('art-plan.json',source))).text(),r=await prepareCharter(record,plan);
  if(r.contentDigest!==expectedContent||r.artPlanDigest!==expectedPlan)throw Error('The server and disk do not contain the same fixed trial');
  const template=getTemplate(r.template),font=new FontFace(template.fontFamily,await(await read(template.fontUrl)).arrayBuffer());await font.load();document.fonts.add(font);await document.fonts.ready;
  if(font.status!=='loaded'||!document.fonts.check(`94px ${template.fontFamily}`))throw Error('Aboensis did not load');
  const image=async url=>{const im=new Image();im.src=url;await im.decode();return im;};
  const [paper,reverse,ornament]=await Promise.all([template.skin,template.reverse,template.ornament].map(image));
  await doc.prepareSeal();const result=doc.createDocument(r,paper,reverse,template,ornament);
  const surfaces={front:result.front,back:result.back,ink:result.ink,relief:result.relief,sealInk:result.seal.ink,sealMask:result.seal.mask},layers={};
  for(const [key,canvas]of Object.entries(surfaces))layers[key]={base64:canvas.toDataURL('image/png').split(',')[1],width:canvas.width,height:canvas.height};
  return {contentSHA256:r.contentDigest,artPlanSHA256:r.artPlanDigest,workId:r.workId,category:r.category,layout:result.layout,
   seal:{version:result.seal.version,variant:result.seal.variant,seed:result.seal.seed,stats:result.seal.stats},layers,
   inspection:{font:{family:template.fontFamily,status:font.status,sourceSHA256:r.artPlan.resources.font.sha256},canvasContexts:[...new Set(contexts)],textBounds:result.layout.textBounds,
    english:doc.documentLines(r),chinese:doc.translationLines(r),record:exportRecord(r),userAgent:navigator.userAgent}};
 },{expectedContent:prepared.contentDigest,expectedPlan:prepared.artPlanDigest});
 assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);assert.deepEqual(rendered.inspection.canvasContexts,['2d']);
}finally{await browser.close();}

assert.equal(sha(await readFile(path.join(directory,'record.json'))),sha(recordBytes),'The making record changed during typesetting');
assert.equal(sha(await readFile(path.join(directory,'art-plan.json'))),sha(planBytes),'The art plan changed during typesetting');
for(const [file,hash]of Object.entries(sourceHashes))assert.equal(sha(await readFile(path.join(root,file))),hash,`${file} changed during typesetting`);
const layers={},buffers={};
for(const [key,size]of Object.entries(expected)){
 const entry=rendered.layers[key],bytes=Buffer.from(entry.base64,'base64');assert.deepEqual(pngSize(bytes),size);assert.deepEqual([entry.width,entry.height],size);
 const src=filename(key);layers[key]={src,sha256:sha(bytes),bytes:bytes.length,width:size[0],height:size[1]};buffers[key]=bytes;
 const target=path.join(assetDirectory,src);if(await exists(target))assert.equal(sha(await readFile(target)),layers[key].sha256,`Refusing to overwrite a different existing ${src}`);
}
const generatedAt=new Date().toISOString(),manifest={schema:'second-language.draft-surfaces.v1',stage:'draft',artisticApproval:false,
 category:rendered.category,workId:rendered.workId,contentSHA256:rendered.contentSHA256,artPlanSHA256:rendered.artPlanSHA256,width:2048,height:2868,generatedAt,
 producer:{script:'scripts/render-project-beginning.mjs',method:'original Aboensis FontFace; browser Canvas2D; no WebGL viewer; review still required',browser:browserVersion,sourceSHA256:sourceHashes},layout:rendered.layout,seal:rendered.seal,layers};
const research=path.join(root,'research/project-scroll-redesign-2026-10-21');await mkdir(research,{recursive:true});
const inspectionFile=path.join(research,`typesetting-inspection-${prepared.contentDigest.slice(0,16)}.json`),inspection={schema:'second-language.typesetting-inspection.v1',stage:'draft',artisticApproval:false,generatedAt,
 contentSHA256:prepared.contentDigest,artPlanSHA256:prepared.artPlanDigest,browser:browserVersion,errors,missing,...rendered.inspection,
 validation:{textBounds:'createDocument rejected overflow and text/text, text/miniature, text/impression collisions',font:'original file hash and loaded FontFace',surfaces:'PNG signature, IHDR, expected sizes and byte digests',
  artisticApproval:'not asserted; inspect the saved paper and actual lit/moving object before any promotion'}};
if(await exists(inspectionFile))assert.equal((await json(inspectionFile)).contentSHA256,prepared.contentDigest);else await writeFile(inspectionFile,JSON.stringify(inspection,null,2)+'\n',{flag:'wx'});
await mkdir(assetDirectory,{recursive:true});
for(const key of Object.keys(expected)){const target=path.join(assetDirectory,layers[key].src);if(!await exists(target))await writeFile(target,buffers[key],{flag:'wx'});}
await writeFile(manifestFile,JSON.stringify(manifest,null,2)+'\n',{flag:'wx'});await validateManifest(manifest);
console.log(JSON.stringify({status:'rendered-six-layer-draft',contentSHA256:manifest.contentSHA256,layers:6,totalBytes:Object.values(layers).reduce((n,v)=>n+v.bytes,0),manifest:path.relative(root,manifestFile),inspection:path.relative(root,inspectionFile),artisticApproval:false},null,2));

import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL('D:/CodexStorage/workspaces/second-language-maintenance/.cache/browser-tools/package/index.mjs'));
const out='research/project-scroll-redesign-2026-10-21',tmp=process.cwd()+'/.cache/project-beginning-browser/tmp';
await mkdir(out,{recursive:true});await mkdir(tmp,{recursive:true});process.env.TEMP=process.env.TMP=tmp;
const base=process.argv[2]||'http://127.0.0.1:8153',remote=base.startsWith('https:');
const manifest=JSON.parse(await readFile('web/labs/project-beginning/assets/surfaces.json','utf8'));
assert.equal(manifest.schema,'second-language.frozen-surfaces.v1');assert.equal(manifest.workId,'SL-PROJECT-BEGINNING-20261021');
assert.match(manifest.contentSHA256,/^[0-9a-f]{64}$/);assert.match(manifest.artPlanSHA256,/^[0-9a-f]{64}$/);
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',env:{...process.env,TEMP:tmp,TMP:tmp},...(remote?{proxy:{server:'http://127.0.0.1:6987'}}:{}),args:['--no-first-run']});
const errors=[],missing=[],writes=[],resources=[];
try{
 const context=await browser.newContext({viewport:{width:402,height:874},deviceScaleFactor:2,isMobile:true,hasTouch:true,serviceWorkers:'block'}),page=await context.newPage();
 page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{resources.push(r.url());if(!['GET','HEAD'].includes(r.method()))writes.push(r.url());});
 page.on('response',r=>{if(r.status()>=400&&!new URL(r.url()).pathname.startsWith('/api/'))missing.push({url:r.url(),status:r.status()});});
 await page.route('**/api/**',route=>{const p=new URL(route.request().url()).pathname;return route.fulfill({json:p==='/api/session'?{authenticated:true,demo:true}:p==='/api/chapters'?{chapters:[]}:{}});});
 await page.goto(base+'/');await page.locator('#settingsButton').tap();await page.locator('#certificationReaderButton').tap();
 assert.deepEqual(await page.locator('#certificationChapters button').allTextContents(),['项目纪念','第一章','第五章']);
 assert.equal(await page.locator('[data-work="project-beginning"]').count(),1);assert.equal(await page.locator('[data-work="project-returning-thread"]').count(),0);
 assert.equal(await page.locator('dialog[open]').count(),1);
 assert.ok(!resources.some(p=>/reader\.bundle|\.glb|final-front/.test(p)),'The catalogue must remain lazy');
 await page.locator('[data-work="project-beginning"]').tap();
 await page.waitForFunction(()=>certificationReader.snapshot().ready||!document.getElementById('certificationRetry').hidden,null,{timeout:120000});
 let state=await page.evaluate(()=>certificationReader.snapshot());assert.equal(state.ready,true,await page.locator('#certificationStatus').textContent());
 const record=await page.evaluate(()=>certificationReader.exportRecord());
 assert.equal(record.sha256,manifest.contentSHA256);assert.equal(record.artPlanDigest,manifest.artPlanSHA256);
 assert.equal(createHash('sha256').update(record.canonicalPayload).digest('hex'),record.sha256);
 assert.equal(record.workId,'SL-PROJECT-BEGINNING-20261021');assert.equal(record.status,'commemorative');assert.equal(record.category,'project-commemorative');
 assert.equal(record.attestation,null);assert.equal(record.projectFoundedAt,null);assert.equal(record.recipient,'Gual Wells');assert.equal(record.madeAt,'2026-10-21T12:10:23.227Z');assert.equal(record.issued,false);
 for(const key of ['chapterId','chapterNumber','chapterTitle','chapterDigest','foundedAt','certifiedAt','passedAt'])assert.ok(!Object.hasOwn(record,key));
 assert.equal(record.copy.rubric,'A project remembrance');assert.equal(record.copy.institution,'The Second Language');assert.equal(record.copy.artTitle,'A Day in Another Tongue');
 assert.deepEqual(record.copy.verse,['With a first word, the work begins:','rain at the shutter, bread upon the board,','a greeting answered at an open door.','Page will follow page.','Another tongue enters the day.']);
 assert.equal(state.chapter,null);assert.equal(state.viewer.chapterId,null);assert.equal(state.viewer.category,'project-commemorative');assert.equal(state.viewer.workId,record.workId);
 assert.equal(state.viewer.layout.frozen,true);assert.equal(state.viewer.layout.contentDigest,record.sha256);assert.equal(state.viewer.layout.artPlanDigest,record.artPlanDigest);
 assert.equal(state.viewer.paperProfilePrepared,true);assert.deepEqual(state.viewer.paperProfile.normalScale,[.035,.035]);assert.equal(state.viewer.paperProfile.bumpScale,.0045);
 for(const name of ['normal','roughness']){assert.deepEqual(state.viewer.paperProfile[name].repeat,[1.4,2.1]);assert.equal(state.viewer.paperProfile[name].wrapS,1000);assert.equal(state.viewer.paperProfile[name].wrapT,1000);}
 assert.equal(state.viewer.paperProfile.sheen,0);assert.equal(state.viewer.paperProfile.specularIntensity,0);
 assert.ok(resources.some(p=>new URL(p).pathname==='/labs/project-beginning/assets/final-front.png'));
 assert.ok(!resources.some(p=>/Aboensis[^/]*\.(?:otf|ttf|woff2?)(?:\?|$)|daily-miniature\.png|parchment\.webp|ink-shoulder\.png|draft-surfaces\.json|draft-front\.png/.test(p)),'Viewing must decode saved final layers, without runtime typesetting or draft substitution');
 assert.ok(!resources.some(p=>p.includes('/labs/project-commemorative/')),'The rejected work must not be loaded as a substitute');
 await page.screenshot({path:out+(remote?'/live-closed.png':'/closed.png'),scale:'css'});
 await page.locator('#certificationCanvas').tap({position:{x:201,y:430}});
 await page.waitForFunction(()=>{const v=certificationReader.snapshot().viewer;return v.progress>.999&&!v.animating;},null,{timeout:60000});
 state=await page.evaluate(()=>certificationReader.snapshot());assert.equal(state.viewer.layout.contentDigest,record.sha256);
 await page.waitForFunction(()=>!document.querySelector('#certificationStage').classList.contains('controls-visible'));await page.waitForTimeout(350);
 await page.screenshot({path:out+(remote?'/live-open.png':'/open.png'),scale:'css'});
 // exportDocument is a two-dimensional decoded front surface. Comparing it
 // with the PNG verifies original delivery, NOT Three lighting/GPU fidelity.
 const decodedOriginal=await page.evaluate(async()=>{
  const image=src=>new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=reject;im.src=src;});
  const [exported,original]=await Promise.all([image(certificationReader.exportDocument()),image('/labs/project-beginning/assets/final-front.png')]);
  const pixels=i=>{const c=Object.assign(document.createElement('canvas'),{width:i.width,height:i.height}),x=c.getContext('2d');x.drawImage(i,0,0);return x.getImageData(0,0,c.width,c.height).data;};
  const a=pixels(exported),b=pixels(original);return {equal:exported.width===original.width&&exported.height===original.height&&a.length===b.length&&a.every((v,i)=>v===b[i]),width:original.width,height:original.height};
 });assert.equal(decodedOriginal.equal,true);assert.equal(decodedOriginal.width,2048);assert.equal(decodedOriginal.height,2868);
 await page.locator('#certificationCanvas').tap({position:{x:201,y:430}});
 await page.waitForFunction(()=>{const v=certificationReader.snapshot().viewer;return v.progress<.001&&!v.animating;},null,{timeout:60000});
 const final=await page.evaluate(()=>certificationReader.snapshot());assert.equal(final.viewer.layout.contentDigest,record.sha256);
 await page.keyboard.press('Escape');await page.locator('#certificationCatalogue').waitFor({state:'visible'});
 assert.equal(await page.locator('dialog[open]').count(),1);assert.equal((await page.evaluate(()=>certificationReader.snapshot())).sound.active,false);
 assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);assert.deepEqual(writes,[]);
 const result={base,checkedAt:new Date().toISOString(),profile:'beginning',catalogueWork:'project-beginning',record,
  checks:{minimalProjectEntry:true,rejectedWorkAbsent:true,noFakeChapterOrCertification:true,fixedMadeAtAndDynamicHash:true,frozenOriginals:true,noRuntimeTypesetting:true,
   decodedOriginalPixelsMatch:true,actualMaterialProfileRestored:true,realOpenAndClose:true,exitStopsSound:true,noAccountWrites:true},
  errors,missing,writes,resources,decodedOriginal,opened:state,closed:final,
  evidenceLimits:{decodedOriginalPixelsMatch:'Canvas2D decoded front export equals the frozen PNG; this is original delivery, not post-lighting or GPU fidelity.',artisticApproval:'Not asserted by this interaction test.'},
  environment:'Chrome mobile simulation 402x874/DPR2; no physical iPhone or Safari claim. Browser-only empty demo API; real published display resources.'};
 await writeFile(out+(remote?'/live-verification.json':'/verification.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({sha256:record.sha256,checks:result.checks,errors,missing,writes}));await context.close();
}catch(error){await writeFile(out+'/browser-failure.json',JSON.stringify({error:error.stack,errors,missing,writes},null,2)+'\n');throw error;}finally{await browser.close();}

import {writeFile,readFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const {chromium}=await import(pathToFileURL('D:/CodexStorage/workspaces/second-language-maintenance/.cache/browser-tools/package/index.mjs'));
const base=process.argv[2];if(!/^https:\/\/[a-f0-9]+\.the-second-language\.pages\.dev$/.test(base??''))throw Error('Supply immutable Pages URL');
const out='research/scroll-lab-v12-sample';process.env.TEMP=process.env.TMP=process.cwd()+'/.cache/scroll-v12-sample/temp';
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',proxy:{server:'http://127.0.0.1:6987'},args:['--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader','--no-first-run']});
const sha=b=>createHash('sha256').update(b).digest('hex');
try{
 const context=await browser.newContext({viewport:{width:402,height:874},deviceScaleFactor:2,isMobile:true,hasTouch:true}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'/labs/chapter-scroll-v12/');await page.waitForFunction(()=>window.scrollSpecimen?.snapshot().ready,null,{timeout:45000});const initial=await page.evaluate(()=>scrollSpecimen.snapshot());await page.evaluate(()=>scrollSpecimen.atmosphere(false));
 await page.locator('#toggle').tap();await page.waitForFunction(()=>scrollSpecimen.snapshot().progress===1&&!scrollSpecimen.snapshot().animating,null,{timeout:45000});
 const versions=[];for(const variant of ['oblong','round']){
  if(variant==='round'){await page.locator('#sealRound').tap();await page.waitForFunction(()=>scrollSpecimen.snapshot().layout.sealVariant==='round');}
  const state=await page.evaluate(()=>scrollSpecimen.snapshot()),record=await page.evaluate(()=>scrollSpecimen.exportRecord());assert.equal(state.issued,false);assert.equal(state.progress,1);assert.equal(sha(record.canonicalPayload),record.sha256);versions.push({state,record});await page.screenshot({path:`${out}/live-${variant}-iphone.png`,scale:'css'});
 }
 await page.locator('#detail').tap();await page.locator('details').filter({has:page.locator('#proofIdentity')}).locator('summary').tap();assert.match(await page.locator('#proofIdentity').textContent(),/Gual Wells[\s\S]*4affdb99f8262318/);assert.match(await page.locator('#transcriptContent').textContent(),/Upon the map, a river lies in ink/);await page.locator('button[aria-label="关闭"]').tap();
 await page.locator('#toggle').tap();await page.waitForFunction(()=>scrollSpecimen.snapshot().progress===0&&!scrollSpecimen.snapshot().animating,null,{timeout:45000});await page.screenshot({path:out+'/live-closed-iphone.png',scale:'css'});
 const assets=[];for(const path of ['/labs/chapter-scroll-v12/app.js','/labs/chapter-scroll-v12/document.js','/labs/chapter-scroll-v12/charter.js','/labs/chapter-scroll-v12/seal.js','/labs/chapter-scroll-v12/assets/river-margin.png','/labs/chapter-scroll-v11/','/labs/chapter-scroll-v6/','/api/session','/api/practice']){
  const r=await context.request.get(base+path);assert.equal(r.status(),path==='/api/practice'?401:200);let matchesLocal;
  if(/\.(js|png)$/.test(path)){matchesLocal=sha(await r.body())===sha(await readFile('web'+path));assert.ok(matchesLocal,path);}
  assets.push({path,status:r.status(),matchesLocal});
 }
 assert.deepEqual(errors,[]);await writeFile(out+'/deployment.json',JSON.stringify({immutable:base+'/labs/chapter-scroll-v12/',alias:'https://scroll-lab.the-second-language.pages.dev/labs/chapter-scroll-v12/',verifiedAt:new Date().toISOString(),versions,initialMist:initial.mist,assets,errors,touchOpenClose:true,inPlaceSealComparison:true,environment:'402x874 DPR2 Chromium software WebGL; not physical iPhone/Safari performance',builtInImageGenerations:1,newExternalPaidCalls:0},null,2));
 const files=['web/owner-identity.js','web/labs/chapter-scroll-v12/charter.js','web/labs/chapter-scroll-v12/document.js','web/labs/chapter-scroll-v12/seal.js','web/labs/chapter-scroll-v12/templates.js','web/labs/chapter-scroll-v12/app.js','web/labs/chapter-scroll-v12/chapter-sample.json','web/labs/chapter-scroll-v12/assets/river-margin.png','web/labs/chapter-scroll/assets/Aboensis-Regular.otf','web/labs/chapter-scroll-v6/assets/charter.webp','research/scroll-lab-v12-sample/document-oblong.png','research/scroll-lab-v12-sample/document-round.png'];
 const hashes=[];for(const path of files){const bytes=await readFile(path);hashes.push({path,bytes:bytes.length,sha256:sha(bytes)});}await writeFile(out+'/asset-manifest.json',JSON.stringify({edition:'SL-MEMENTO-12',hashes},null,2));console.log(JSON.stringify({ready:true,touchOpenClose:true,inPlaceSealComparison:true,errors,assets}));
}finally{await browser.close();}

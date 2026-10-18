import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {createServer} from './serve-scroll-lab.mjs';
import {Motion} from '../web/labs/chapter-scroll-runtime/motion.js';
import {keeperPose} from '../web/labs/chapter-scroll-v8/keeper-path.js';
import {execFileSync} from 'node:child_process';
const out='research/scroll-motion-2026-10-18',remote=process.argv[2];
if(remote&&!/^https:\/\/[a-f0-9]+\.the-second-language\.pages\.dev$/.test(remote))throw Error('Use immutable deployment origin');
await mkdir(out,{recursive:true});await mkdir('.cache/scroll-motion/temp',{recursive:true});process.env.TEMP=process.env.TMP=process.cwd()+'/.cache/scroll-motion/temp';
const sha=x=>createHash('sha256').update(x).digest('hex');
// A main-thread pause must not consume the entire loosen/unthread/depart path.
const path={width:4.5,height:6.3,coreRadius:.145,layerThickness:.035},clock=new Motion(0,1,0),firstAfterPause=clock.sample(1200);
assert.equal(keeperPose(firstAfterPause.progress,path).phase,'loosen');
const phases=new Set();let done=false;for(let i=1;i<500;i++){const s=clock.sample(1200+i*32);phases.add(keeperPose(s.progress,path).phase);if(s.done){done=true;assert.equal(s.progress,1);break;}}
assert.ok(done);assert.deepEqual([...phases],['loosen','unthread','depart','off']);const p=new Motion(0,1,0);p.sample(32);p.resume(30000);assert.ok(p.sample(30016).progress<.001);
const {chromium}=await import(pathToFileURL('D:/CodexStorage/workspaces/second-language-maintenance/.cache/browser-tools/package/index.mjs'));
const server=remote?null:createServer();if(server)await new Promise(r=>server.listen(0,'127.0.0.1',r));const base=remote??`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',...(remote?{proxy:{server:'http://127.0.0.1:6987'}}:{}),args:['--no-first-run']});
try{
 const versions=[];
 for(const version of ['v13','v12']){
  const context=await browser.newContext({viewport:{width:402,height:874},deviceScaleFactor:3,isMobile:true,hasTouch:true,serviceWorkers:'block'}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/skin-normal.jpg',async r=>{await new Promise(resolve=>setTimeout(resolve,500));await r.continue();});
  await page.goto(`${base}/labs/chapter-scroll-${version}/?open=1`);await page.waitForFunction(()=>window.scrollSpecimen?.snapshot().ready,null,{timeout:60000});
  const initial=await page.evaluate(()=>scrollSpecimen.snapshot());assert.ok(initial.runtime.motionPrepared);assert.equal(initial.progress,1);
  const artifact=await page.evaluate(()=>scrollSpecimen.exportRecord()),data=await page.evaluate(()=>scrollSpecimen.exportDocument()),old=JSON.parse(await readFile(`research/scroll-lab-${version}-sample/inspection.json`));
  assert.equal(artifact.sha256,version==='v13'?old.record.sha256:old.versions[0].record.sha256);
  // Original saved PNGs used SwiftShader. Compare old/new on the SAME GPU,
  // since Canvas2D text rasterization/encoding can vary between backends.
  const baseline=await context.newPage();await baseline.route(`**/chapter-scroll-${version}/app.js`,r=>r.fulfill({contentType:'text/javascript',body:execFileSync('git',['show',`72650010114ac45f63b8b486ad455de67784474d:web/labs/chapter-scroll-${version}/app.js`])}));
  await baseline.goto(`${base}/labs/chapter-scroll-${version}/?open=1`);await baseline.waitForFunction(()=>window.scrollSpecimen?.snapshot().ready,null,{timeout:60000});
  const oldDocument=await baseline.evaluate(()=>{scrollSpecimen.atmosphere(false);return scrollSpecimen.exportDocument();});assert.equal(sha(Buffer.from(data.split(',')[1],'base64')),sha(Buffer.from(oldDocument.split(',')[1],'base64')));await baseline.close();await page.bringToFront();
  const idle=await page.evaluate(()=>scrollSpecimen.snapshot());await page.waitForTimeout(1000);const ambient=await page.evaluate(()=>scrollSpecimen.snapshot());assert.equal(ambient.renderCount,idle.renderCount);assert.ok(ambient.mist.frames>idle.mist.frames);assert.ok(ambient.mist.ambientDose>idle.mist.ambientDose);assert.ok(ambient.mist.motionPeakMps<=.015);
  await page.screenshot({path:`${out}/${remote?'live':'local'}-${version}-mist.png`,scale:'css'});
  await page.evaluate(()=>scrollSpecimen.atmosphere(false));
  await page.locator('#toggle').tap();await page.waitForFunction(()=>scrollSpecimen.snapshot().progress===0&&!scrollSpecimen.snapshot().animating,null,{timeout:25000});
  await page.locator('#toggle').tap();await page.waitForFunction(()=>scrollSpecimen.snapshot().progress>.01&&scrollSpecimen.snapshot().progress<.3);await page.locator('#scrollCanvas').tap({position:{x:180,y:290}});await page.waitForFunction(()=>scrollSpecimen.snapshot().progress===0&&!scrollSpecimen.snapshot().animating,null,{timeout:25000});
  await page.locator('#toggle').tap();await page.waitForFunction(()=>scrollSpecimen.snapshot().progress===1&&!scrollSpecimen.snapshot().animating,null,{timeout:25000});
  assert.equal((await page.evaluate(()=>scrollSpecimen.snapshot())).runtime.programs,initial.runtime.preparedPrograms);
  if(version==='v13'){
   const contact=await page.evaluate(async()=>{
    const c=Object.assign(document.createElement('canvas'),{width:1500,height:760}),q=c.getContext('2d');q.fillStyle='#30332f';q.fillRect(0,0,c.width,c.height);
    for(const [i,p]of [0,.06,.13,.195,.225,.24].entries()){
     scrollSpecimen.setProgress(p);const im=new Image();im.src=scrollSpecimen.exportObject();await im.decode();const h=document.querySelector('#stage').clientHeight,scale=im.width/402,x=i%3*500,y=Math.floor(i/3)*380;
     q.drawImage(im,0,(h/2-105)*scale,im.width,210*scale,x,y+40,500,310);q.fillStyle='#eee';q.font='18px sans-serif';q.fillText(`p=${p.toFixed(3)}`,x+15,y+28);
    }return c.toDataURL('image/png');
   });await writeFile(`${out}/${remote?'live':'local'}-keeper-frames.png`,Buffer.from(contact.split(',')[1],'base64'));
   await page.evaluate(()=>scrollSpecimen.setProgress(1));
   await page.evaluate(()=>{const gl=document.querySelector('#scrollCanvas').getContext('webgl2');window.restoreProbe=gl.getExtension('WEBGL_lose_context');restoreProbe.loseContext();});await page.waitForFunction(()=>!document.querySelector('#fallback').hidden);
   await page.evaluate(()=>setTimeout(()=>restoreProbe.restoreContext(),1100));await page.waitForFunction(()=>document.querySelector('#fallback').hidden&&document.querySelector('#loading').hidden&&scrollSpecimen.snapshot().ready,null,{timeout:30000});
   assert.ok((await page.evaluate(()=>scrollSpecimen.snapshot())).runtime.motionPrepared);
   await page.locator('#detail').tap();await page.locator('#detailZoom').tap();assert.ok(await page.locator('.scroll-document-detail').evaluate(e=>e.scrollWidth>e.clientWidth));await page.locator('button[aria-label="关闭"]').tap();
  }else{
   await page.locator('#sealRound').tap();await page.waitForFunction(()=>scrollSpecimen.snapshot().layout.sealVariant==='round');assert.equal((await page.evaluate(()=>scrollSpecimen.exportRecord())).sha256,old.versions[1].record.sha256);
  }
  assert.deepEqual(errors,[]);versions.push({version,initialRuntime:initial.runtime,record:artifact.sha256,documentBytesUnchanged:true,errors,checks:{ambientActive:true,idlePaperNotRedrawn:true,rapidCanvasTapReverses:true,firstCloseHasNoNewPrograms:true,contextRestoreRewarms:version==='v13',impressionSwitch:version==='v12'}});console.log(JSON.stringify({version,verified:true,runtime:initial.runtime}));await context.close();
 }
 const reduced=await browser.newContext({viewport:{width:402,height:874},reducedMotion:'reduce'}),reducedPage=await reduced.newPage();await reducedPage.goto(base+'/labs/chapter-scroll-v13/');await reducedPage.waitForFunction(()=>window.scrollSpecimen?.snapshot().ready,null,{timeout:60000});const reducedState=await reducedPage.evaluate(()=>scrollSpecimen.snapshot());assert.equal(reducedState.progress,1);assert.equal(reducedState.mist.available,false);await reduced.close();
 const assets=[];
 if(remote)for(const path of ['/labs/chapter-scroll-runtime/motion.js','/labs/chapter-scroll-runtime/scroll-object.js','/labs/chapter-scroll-runtime/mist.js','/labs/chapter-scroll-v12/app.js','/labs/chapter-scroll-v13/app.js','/labs/chapter-scroll-v5/vendor/fluid.js']){const r=await browser.newContext();try{const response=await r.request.get(remote+path);assert.equal(response.status(),200);assert.equal(sha(await response.body()),sha(await readFile('web'+path)));assets.push(path);}finally{await r.close();}}
 await writeFile(`${out}/${remote?'live':'local'}-verification.json`,JSON.stringify({origin:base,verifiedAt:new Date().toISOString(),versions,assets,checks:{stallKeepsLooseningPhase:true,allKeeperPhasesRetained:true,resumeExcludesHiddenTime:true,reducedMotion:true},environment:'402x874 DPR3 Chromium Intel UHD/D3D11 hardware rendering; iPhone/Safari still needs user visual verification'},null,2));
}finally{await browser.close();if(server)await new Promise(r=>server.close(r));}

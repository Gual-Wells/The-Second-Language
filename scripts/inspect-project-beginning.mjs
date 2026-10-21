import assert from 'node:assert/strict';
import path from 'node:path';
import {mkdir,writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL('D:/CodexStorage/workspaces/second-language-maintenance/.cache/browser-tools/package/index.mjs'));
const root=process.cwd(),out='research/project-scroll-redesign-2026-10-21',tmp=path.join(root,'.cache/project-beginning/browser-tmp');await mkdir(tmp,{recursive:true});
process.env.TEMP=process.env.TMP=tmp;
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',env:{...process.env,TEMP:tmp,TMP:tmp},args:['--no-first-run']});
const errors=[],missing=[],resources=[];
try{
 const context=await browser.newContext({viewport:{width:402,height:874},deviceScaleFactor:2,isMobile:true,hasTouch:true,serviceWorkers:'block'}),page=await context.newPage();
 page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>resources.push(r.url()));page.on('response',r=>{if(r.status()>=400)missing.push({url:r.url(),status:r.status()});});
 await page.route('**/labs/certification-reader/reader.draft.bundle.js',r=>r.fulfill({path:path.join(root,'.cache/project-beginning/reader.draft.bundle.js'),contentType:'application/javascript'}));
 await page.route('**/__project-draft__',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/styles.css"><style>html,body{margin:0;width:100%;height:100%;overflow:hidden}.certification-stage{position:fixed;inset:0}</style><div id="stage" class="certification-stage"><canvas id="mist" class="certification-mist"></canvas><canvas id="paper" class="certification-canvas" tabindex="0"></canvas></div>'}));
 await page.goto('http://127.0.0.1:8153/__project-draft__');
 await page.evaluate(async()=>{const {ScrollViewer}=await import('/labs/certification-reader/reader.draft.bundle.js'),v=globalThis.trial=new ScrollViewer(document.getElementById('paper'),document.getElementById('mist'));v.resize(innerWidth,innerHeight);await v.prepare({chapter:'beginning',surfaceSet:'draft',initialProgress:1});v.bindPointerInput();});
 const state=await page.evaluate(()=>trial.snapshot());assert.equal(state.ready,true);assert.equal(state.layout.stage,'draft');assert.equal(state.paperProfilePrepared,true);assert.deepEqual(state.paperProfile.normalScale,[.035,.035]);assert.deepEqual(state.paperProfile.normal.repeat,[1.4,2.1]);assert.equal(state.paperProfile.bumpScale,.0045);
 await page.waitForTimeout(400);await page.screenshot({path:out+'/trial-open.png',scale:'css'});
 async function saveObject(name){const url=await page.evaluate(()=>trial.object.exportObject());await writeFile(out+'/'+name,Buffer.from(url.split(',')[1],'base64'));}
 await saveObject('trial-open-object.png');
 const fidelity=await page.evaluate(async()=>{
  const o=trial.object;
  const pixels=async url=>{const i=new Image();i.src=url;await i.decode();const c=Object.assign(document.createElement('canvas'),{width:i.width,height:i.height}),x=c.getContext('2d');x.drawImage(i,0,0);return {w:i.width,h:i.height,p:x.getImageData(0,0,i.width,i.height).data};};
  const source=await pixels(trial.exportDocument()),render=await pixels(o.exportObject()),samples=[];
  const patch=(img,x,y,r)=>{let sum=0,n=0,min=255,max=0;for(let dy=-3;dy<=3;dy++)for(let dx=-3;dx<=3;dx++){const px=Math.round(x+dx*r/3),py=Math.round(y+dy*r/3);if(px<0||py<0||px>=img.w||py>=img.h)continue;const j=(py*img.w+px)*4,v=img.p[j]*.2126+img.p[j+1]*.7152+img.p[j+2]*.0722;sum+=v;n++;min=Math.min(min,v);max=Math.max(max,v);}return {mean:sum/n,min,max,n};};
  o.sheet.updateMatrixWorld(true);o.camera.updateMatrixWorld(true);const world=(u,v)=>o.camera.position.clone().set((u-.5)*o.width,(.5-v)*o.height,0).applyMatrix4(o.sheet.matrixWorld).project(o.camera);
  const a=world(.2,.5),b=world(.8,.5),sourcePerRaster=.6*source.w/(Math.abs(b.x-a.x)*render.w/2);
  for(let v=.16;v<.84;v+=.03)for(let u=.16;u<.84;u+=.03){const s=patch(source,u*source.w-.5,v*source.h-.5,3*sourcePerRaster);if(s.min<75||s.max-s.min>35)continue;const q=world(u,v),r=patch(render,(q.x*.5+.5)*render.w-.5,(.5-q.y*.5)*render.h-.5,3);if(r.n)samples.push({source:s.mean,render:r.mean});}
  const mean=a=>a.reduce((s,v)=>s+v,0)/a.length,sm=mean(samples.map(v=>v.source)),rm=mean(samples.map(v=>v.render)),ss=Math.sqrt(mean(samples.map(v=>(v.source-sm)**2))),rs=Math.sqrt(mean(samples.map(v=>(v.render-rm)**2)));
  return {sampleCount:samples.length,sourceMean:sm,renderMean:rm,brightnessShift:rm-sm,contrastRatio:rs/ss,correlation:mean(samples.map(v=>(v.source-sm)*(v.render-rm)))/(ss*rs),method:'Actual GPU object export versus typeset source; interior patches projected through the real perspective camera using a plane approximation, excluding high contrast ink. Broad age/color observation, not exact deformed UV matching, a microtexture measurement or artistic approval.'};
 });
 await page.evaluate(()=>{trial.object.camera.zoom=1.7;trial.object.camera.updateProjectionMatrix();trial.object.render();});await saveObject('trial-detail-object.png');await page.screenshot({path:out+'/trial-detail.png',scale:'css'});
 await page.evaluate(()=>{trial.object.camera.zoom=1;trial.object.camera.updateProjectionMatrix();trial.setProgress(.98);});await page.screenshot({path:out+'/trial-last-turn.png',scale:'css'});
 await page.evaluate(()=>trial.setProgress(0));await page.screenshot({path:out+'/trial-closed.png',scale:'css'});
 const record=await page.evaluate(()=>trial.exportRecord());await page.evaluate(()=>trial.dispose());assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);
 await writeFile(out+'/trial-runtime.json',JSON.stringify({checkedAt:new Date().toISOString(),stage:'manufacturing-trial; not adopted or published',record,state,fidelity,errors,missing,resources,environment:'Chrome 402x874/DPR2 mobile simulation; actual shared renderer and accepted display keeper derivative. No API/account/score writes. Not a physical iPhone or Safari test.'},null,2));console.log(JSON.stringify({sha256:record.sha256,paperProfile:state.paperProfile,fidelity,errors,missing}));await context.close();
}finally{await browser.close();}

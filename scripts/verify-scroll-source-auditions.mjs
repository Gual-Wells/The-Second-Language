import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';

// Narrow raw-source UI gate: no sound edits, processing or listening approval.
const root=process.cwd(),out=root+'/research/scroll-source-selection-2026-10-22';
const tmp=root+'/.cache/source-auditions-browser';
const base=(process.env.STUDY_URL||'http://127.0.0.1:8153').replace(/\/$/,'');
await mkdir(out,{recursive:true});await mkdir(tmp,{recursive:true});
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const manifest=JSON.parse(await readFile(root+'/web/labs/scroll-foley-study/source-auditions.json','utf8'));
const report={checkedAt:new Date().toISOString(),base,
 scope:'Real Chromium native media controls and WebAudio/WebGL at 393x852. Visibility/pagehide handlers are explicitly exercised with synthetic lifecycle events; not physical Safari or a listening verdict.',
 sources:[],httpErrors:[],pageErrors:[],requestFailures:[],checks:{qualityApproved:false,artApproved:false}};
let browser;
try{
 assert.equal(manifest.recordings.length,4);
 for(const item of manifest.recordings){
  const file='web/labs/scroll-foley-study/'+item.file.replace(/^\.\//,'');
  const bytes=await readFile(root+'/'+file);
  assert.equal(bytes.length,item.bytes);assert.equal(sha(bytes),item.sha256);
  assert.equal(item.approved,false);assert.equal(item.integratedIntoAnimation,false);
  report.sources.push({title:item.title,file:item.file,bytes:bytes.length,sha256:sha(bytes),declaredDuration:item.duration});
 }
 report.checks.localBytesMatchManifest=true;
 const {chromium}=await import(pathToFileURL('D:/CodexStorage/workspaces/second-language-maintenance/.cache/browser-tools/package/index.mjs'));
 browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',
  env:{...process.env,TEMP:tmp,TMP:tmp},args:['--no-first-run']});
 const page=await browser.newPage({viewport:{width:393,height:852},deviceScaleFactor:1});
 const sourceRequests=[];
 page.on('response',response=>{if(response.status()>=400)report.httpErrors.push({url:response.url(),status:response.status()});});
 page.on('pageerror',error=>report.pageErrors.push(error.message));
 page.on('requestfailed',request=>report.requestFailures.push({url:request.url(),error:request.failure()?.errorText}));
 page.on('request',request=>{if(/\/sources\/audioelk\/[^/]+\.wav(?:\?|$)/.test(request.url()))sourceRequests.push(request.url());});
 await page.addInitScript(()=>{
  const original=AudioContext.prototype.createMediaElementSource;
  window.__sourceDSPConnections=0;
  AudioContext.prototype.createMediaElementSource=function(...args){window.__sourceDSPConnections++;return original.apply(this,args);};
 });
 await page.goto(base+'/labs/scroll-foley-study/');
 await page.waitForFunction(()=>window.scrollFoleyStudy?.snapshot().viewerReady&&document.querySelectorAll('#sourceList audio').length===4,null,{timeout:90000});
 await page.waitForTimeout(300);
 const initial=await page.evaluate(()=>({state:scrollFoleyStudy.snapshot(),players:[...document.querySelectorAll('#sourceList audio')].map(a=>({preload:a.preload,networkState:a.networkState,readyState:a.readyState,paused:a.paused,controls:a.controls,volume:a.volume,rate:a.playbackRate}))}));
 assert.deepEqual(sourceRequests,[],'preload=none must not download the new sources initially');
 assert.ok(initial.players.every(a=>a.preload==='none'&&a.controls&&a.paused&&a.volume===1&&a.rate===1));
 report.initial=initial.players;report.checks.initialPreloadNoneNoSourceRequests=true;
 // Decode exact served originals only after the preload assertion. This does
 // not attach them to the production mix or alter the native media controls.
 const decoded=await page.evaluate(async items=>{
  const context=new OfflineAudioContext(1,1,48000),result=[];
  for(const item of items){
   const url=new URL(item.file,location.href).href,response=await fetch(url);if(!response.ok)throw Error('Decode fetch '+response.status);
   const bytes=await response.arrayBuffer(),digest=await crypto.subtle.digest('SHA-256',bytes),buffer=await context.decodeAudioData(bytes.slice(0));
   result.push({url,bytes:bytes.byteLength,sha256:[...new Uint8Array(digest)].map(x=>x.toString(16).padStart(2,'0')).join(''),duration:buffer.duration,rate:buffer.sampleRate,channels:buffer.numberOfChannels});
  }return result;
 },manifest.recordings);
 for(let i=0;i<decoded.length;i++){
  assert.equal(decoded[i].bytes,manifest.recordings[i].bytes);assert.equal(decoded[i].sha256,manifest.recordings[i].sha256);
  assert.ok(Math.abs(decoded[i].duration-manifest.recordings[i].duration)<=1/48000+1e-8,'Decoded duration differs: '+manifest.recordings[i].title);
  report.sources[i].browserDecode=decoded[i];
 }
 report.checks.browserBytesAndDecodedDurations=true;
 const state=()=>page.evaluate(()=>({snapshot:scrollFoleyStudy.snapshot(),players:[...document.querySelectorAll('#sourceList audio')].map(a=>({paused:a.paused,currentTime:a.currentTime,duration:Number.isFinite(a.duration)?a.duration:null,readyState:a.readyState,volume:a.volume,rate:a.playbackRate,src:a.getAttribute('src')}))}));
 const playNative=async index=>{
  const audio=page.locator('#sourceList audio').nth(index);
  await audio.scrollIntoViewIfNeeded();
  await audio.click({position:{x:20,y:20}});
  await page.waitForFunction(index=>{const a=document.querySelectorAll('#sourceList audio')[index];return !a.paused&&a.currentTime>.02;},index,{timeout:10000});
 };
 await page.locator('#unlockSound').click();await page.waitForFunction(()=>scrollFoleyStudy.snapshot().soundReady,null,{timeout:20000});
 await page.locator('#openScroll').click();
 await page.waitForFunction(()=>{const s=scrollFoleyStudy.snapshot();return s.pose.progress>.015&&s.sound.foleyVoices>0;},null,{timeout:5000});
 await playNative(2);await page.waitForTimeout(120);
 const alone=await state(),frozenAt=alone.snapshot.pose.progress;
 assert.equal(alone.snapshot.viewer.paused,true);assert.equal(alone.snapshot.sound.paused,true);assert.equal(alone.snapshot.soundReady,false);
 assert.equal(alone.snapshot.sound.foleyVoices,0);assert.equal(alone.snapshot.sound.musicVoices,0);assert.equal(alone.snapshot.audition.playing,1);
 await page.waitForTimeout(180);const frozen=await state();assert.equal(frozen.snapshot.pose.progress,frozenAt,'Native source playback must hold the rendered pose');
 report.rawPlayback={progress:frozenAt,viewerPaused:alone.snapshot.viewer.paused,webAudioPaused:alone.snapshot.sound.paused,foleyVoices:alone.snapshot.sound.foleyVoices,nativePlayers:alone.players};
 report.checks.rawPlaybackPausesViewerAndWebAudio=true;
 await playNative(1);const exclusive=await state();
 assert.equal(exclusive.players[2].paused,true);assert.equal(exclusive.players[1].paused,false);assert.equal(exclusive.snapshot.audition.playing,1);
 report.exclusive=exclusive.players;report.checks.nativeAuditionsMutuallyExclusive=true;
 await page.locator('#unlockSound').click();await page.waitForFunction(()=>scrollFoleyStudy.snapshot().soundReady,null,{timeout:10000});
 const reset=await state();assert.ok(reset.players.every(a=>a.paused&&a.currentTime===0));
 assert.equal(reset.snapshot.viewer.paused,false);assert.equal(reset.snapshot.sound.paused,false);
 report.reset={players:reset.players,viewerPaused:reset.snapshot.viewer.paused,webAudioPaused:reset.snapshot.sound.paused};report.checks.enableStopsAndResetsOriginals=true;
 await page.waitForFunction(()=>scrollFoleyStudy.snapshot().pose.progress>.99999,null,{timeout:30000});
 await page.locator('#closeScroll').click();await page.waitForFunction(()=>scrollFoleyStudy.snapshot().pose.progress<.00001,null,{timeout:30000});
 const baseline=await state();assert.equal(baseline.snapshot.soundReady,true);
 assert.ok(baseline.snapshot.sound.cueTrace.some(c=>c.key==='bendClose'));assert.ok(baseline.snapshot.sound.cueTrace.some(c=>c.key==='seat'));
 report.checks.baselineOpeningAndClosingResumes=true;
 // Synthetic lifecycle event, actual native audio: makes the scope explicit
 // rather than pretending headless Chrome is a physical backgrounded iPhone.
 await playNative(2);
 await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));});
 const hidden=await state();assert.ok(hidden.players.every(a=>a.paused));assert.equal(hidden.snapshot.sound.paused,true);assert.equal(hidden.snapshot.viewer.paused,true);
 await page.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'));});
 const visible=await state();assert.ok(visible.players.every(a=>a.paused),'Returning must not automatically restart native originals');
 report.checks.visibilityStopsNativeAudio=true;
 await playNative(2);
 await page.evaluate(()=>window.dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true})));
 const pagehide=await state();assert.ok(pagehide.players.every(a=>a.paused));assert.equal(pagehide.snapshot.sound.active,false);
 await page.evaluate(()=>window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true})));
 assert.ok((await state()).players.every(a=>a.paused));report.checks.pagehideStopsNativeAudio=true;
 await playNative(2);await page.evaluate(()=>scrollFoleyStudy.dispose());await page.waitForTimeout(120);
 const disposed=await state();assert.ok(disposed.players.every(a=>a.paused&&a.src===null));assert.equal(disposed.snapshot.sound.foleyVoices,0);assert.equal(disposed.snapshot.sound.musicVoices,0);assert.equal(disposed.snapshot.sound.disposed,true);
 report.checks.disposeReleasesNativeAndWebAudio=true;
 const layout=await page.evaluate(()=>({width:innerWidth,documentWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth,cards:document.querySelectorAll('#sourceList .source-card').length,dspConnections:window.__sourceDSPConnections}));
 assert.equal(layout.cards,4);assert.ok(layout.documentWidth<=layout.width+1&&layout.bodyWidth<=layout.width+1,'393px page must not overflow horizontally');assert.equal(layout.dspConnections,0,'Original playback must not route through application DSP');
 report.layout=layout;report.checks.noHorizontalOverflow393=true;report.checks.noMediaElementDSP=true;
 // Reload for an intact object and complete source-card screenshot after the
 // destructive exit check. Existing assertions already cover preload=none.
 await page.reload();await page.waitForFunction(()=>window.scrollFoleyStudy?.snapshot().viewerReady&&document.querySelectorAll('#sourceList audio').length===4,null,{timeout:90000});
 await page.screenshot({path:out+'/source-auditions-iphone.png',fullPage:true});
 assert.deepEqual(report.httpErrors,[]);assert.deepEqual(report.pageErrors,[]);assert.deepEqual(report.requestFailures,[]);
 report.sourceRequests=sourceRequests;report.lifecycle={method:'Synthetic visibilitychange and PageTransitionEvent with actually playing native HTMLAudioElements',hiddenPaused:hidden.players.map(a=>a.paused),returnedPaused:visible.players.map(a=>a.paused),pagehidePaused:pagehide.players.map(a=>a.paused),disposeClearedSources:disposed.players.every(a=>a.src===null)};
 report.status='source-audition-ui-technically-verified';
 await writeFile(out+'/source-auditions-verification.json',JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify({status:report.status,sources:report.sources.length,checks:report.checks}));
}catch(error){report.status='failed';report.failure={name:error.name,message:error.message,stack:error.stack};await writeFile(out+'/source-auditions-verification.json',JSON.stringify(report,null,2)+'\n');throw error;}
finally{await browser?.close();}

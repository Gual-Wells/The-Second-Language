import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {execFileSync} from 'node:child_process';
const root=process.cwd(),out=root+'/research/scroll-foley-study-2026-10-22',tmp=root+'/.cache/foley-study-browser';
await mkdir(tmp,{recursive:true});await mkdir(out,{recursive:true});
const base=process.env.STUDY_URL||'http://127.0.0.1:8153';
const {chromium}=await import(pathToFileURL('D:/CodexStorage/workspaces/second-language-maintenance/.cache/browser-tools/package/index.mjs'));
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',env:{...process.env,TEMP:tmp,TMP:tmp},args:['--no-first-run']});
try{
 const page=await browser.newPage({viewport:{width:393,height:852},deviceScaleFactor:1});
 const errors=[],failed=[];page.on('pageerror',e=>errors.push(e.message));page.on('requestfailed',r=>failed.push({url:r.url(),error:r.failure()?.errorText}));
 await page.addInitScript(()=>{
  const original=AudioNode.prototype.connect;
  AudioNode.prototype.connect=function(destination,...args){
   const result=original.call(this,destination,...args);
   if(destination===this.context.destination){
    let stream=window.__captureStreams?.get(this.context);
    if(!stream){stream=this.context.createMediaStreamDestination();window.__captureStreams??=new Map();window.__captureStreams.set(this.context,stream);}
    original.call(this,stream);
   }
   return result;
  };
 });
 await page.goto(base+'/labs/scroll-foley-study/');
 await page.waitForFunction(()=>window.scrollFoleyStudy?.snapshot().viewerReady,{timeout:90000});
 await page.locator('#unlockSound').click();
 await page.waitForFunction(()=>window.scrollFoleyStudy.snapshot().soundReady,{timeout:20000});
 const initial=await page.evaluate(()=>scrollFoleyStudy.snapshot());
 assert.equal(initial.withMusic,false);assert.equal(initial.variant,'A');assert.equal(initial.sound.foleyEnabled,true);
 const capture=async(name,button,to)=>{
  await page.evaluate(()=>{
   const streams=[...window.__captureStreams].filter(([ctx])=>ctx.state==='running');
   const stream=streams.at(-1)[1].stream,canvas=document.querySelector('#scroll');
   window.__chunks=[];window.__recorder=new MediaRecorder(stream,{mimeType:'audio/webm;codecs=opus'});
   __recorder.ondataavailable=e=>{if(e.data.size)__chunks.push(e.data);};__recorder.start();
   window.__videoChunks=[];window.__canvasStream=canvas.captureStream(30);
   window.__videoRecorder=new MediaRecorder(new MediaStream([...__canvasStream.getVideoTracks(),...stream.getAudioTracks()]),{mimeType:'video/webm;codecs=vp8,opus'});
   __videoRecorder.ondataavailable=e=>{if(e.data.size)__videoChunks.push(e.data);};__videoRecorder.start();
  });
  await page.locator(button).click();
  await page.waitForFunction(to=>Math.abs(scrollFoleyStudy.snapshot().pose.progress-to)<.00001,to,{timeout:30000});
  await page.waitForTimeout(280);
  const snapshot=await page.evaluate(()=>scrollFoleyStudy.snapshot());
  const recorded=await page.evaluate(async()=>{
   const stop=r=>new Promise(resolve=>{r.onstop=resolve;r.stop();});
   await Promise.all([stop(__recorder),stop(__videoRecorder)]);__canvasStream.getTracks().forEach(t=>t.stop());
   const b64=async b=>{const bytes=new Uint8Array(await b.arrayBuffer());let s='';for(let i=0;i<bytes.length;i+=16384)s+=String.fromCharCode(...bytes.subarray(i,i+16384));return btoa(s);};
   const audio=new Blob(__chunks,{type:'audio/webm'}),video=new Blob(__videoChunks,{type:'video/webm'});
   const context=new OfflineAudioContext(2,1,48000),buffer=await context.decodeAudioData(await audio.arrayBuffer());
   const channels=buffer.numberOfChannels,n=buffer.length,bytes=new ArrayBuffer(44+n*channels*2),d=new DataView(bytes),str=(p,v)=>[...v].forEach((c,i)=>d.setUint8(p+i,c.charCodeAt(0)));
   str(0,'RIFF');d.setUint32(4,36+n*channels*2,true);str(8,'WAVE');str(12,'fmt ');d.setUint32(16,16,true);d.setUint16(20,1,true);d.setUint16(22,channels,true);d.setUint32(24,48000,true);d.setUint32(28,48000*channels*2,true);d.setUint16(32,channels*2,true);d.setUint16(34,16,true);str(36,'data');d.setUint32(40,n*channels*2,true);
   for(let i=0;i<n;i++)for(let ch=0;ch<channels;ch++)d.setInt16(44+(i*channels+ch)*2,Math.round(Math.max(-1,Math.min(1,buffer.getChannelData(ch)[i]))*32767),true);
   return{audio:await b64(audio),video:await b64(video),wav:await b64(new Blob([bytes])),duration:buffer.duration};
  });
  await writeFile(out+'/'+name+'.webm',Buffer.from(recorded.video,'base64'));
  await writeFile(out+'/'+name+'.wav',Buffer.from(recorded.wav,'base64'));
  return{snapshot,duration:recorded.duration};
 };
 const openA=await capture('A-opening','#openScroll',1);
 const closeA=await capture('A-closing','#closeScroll',0);
 await page.locator('[data-variant="B"]').click();await page.waitForFunction(()=>scrollFoleyStudy.snapshot().soundReady);
 const openB=await capture('B-opening','#openScroll',1);
 await page.locator('#closeScroll').click();await page.waitForFunction(()=>scrollFoleyStudy.snapshot().pose.progress<.00001,{timeout:30000});
 // Exercise an actual pointer drag, holding the pointer motionless, then reversing.
 const box=await page.locator('#scroll').boundingBox(),x=box.x+box.width/2,y=box.y+box.height*.3;
 await page.mouse.move(x,y);await page.mouse.down();
 for(let i=1;i<=12;i++){await page.mouse.move(x,y+i*7);await page.waitForTimeout(25);}
 const dragging=await page.evaluate(()=>scrollFoleyStudy.snapshot());
 await page.waitForTimeout(350);const held=await page.evaluate(()=>scrollFoleyStudy.snapshot());
 assert.equal(held.sound.foleyVoices,0,'Held finger must have no residual Foley voices');
 for(let i=11;i>=0;i--){await page.mouse.move(x,y+i*7);await page.waitForTimeout(25);}
 const reverse=await page.evaluate(()=>scrollFoleyStudy.snapshot());await page.mouse.up();await page.waitForTimeout(600);
 assert.ok(dragging.sound.cueTrace.some(c=>c.mode==='drag'),'Must exercise the real drag path');
 assert.ok(reverse.sound.cueTrace.some(c=>c.mode==='drag'&&c.direction<0),'Must exercise reverse material strokes');
 for(const [name,state]of [['A',openA],['B',openB]]){
  const trace=state.snapshot.sound.cueTrace.filter(c=>c.mode==='automatic');
  for(const prefix of ['bendOpen','holeOpen','tailOpen','slideOpen','paperOpen'+name,'park'])assert.equal(trace.filter(c=>c.key===prefix).length,1,`${name}:${prefix} must play exactly once, never seek/restart`);
  assert.ok(trace.find(c=>c.key==='park').r>.72&&trace.find(c=>c.key==='park').r<.79);
  assert.ok(trace.find(c=>c.key==='paperOpen'+name).progress>=.4);
 }
 const closedTrace=closeA.snapshot.sound.cueTrace;
 assert.equal(closedTrace.filter(c=>c.key==='seat').length,1);
 for(const v of [...dragging.sound.performances,...reverse.sound.performances]){assert.equal(v.loop,false);assert.equal(v.rate,1);}
 await page.locator('[data-variant="v41"]').click();await page.waitForFunction(()=>scrollFoleyStudy.snapshot().soundReady);
 const reference=await page.evaluate(()=>scrollFoleyStudy.snapshot());assert.equal(reference.variant,'v41');assert.equal(reference.sound.foleyEnabled,true);
 await page.locator('[data-variant="B"]').click();await page.waitForFunction(()=>scrollFoleyStudy.snapshot().soundReady);
 await page.screenshot({path:out+'/study-iphone.png',fullPage:true});
 await page.evaluate(()=>scrollFoleyStudy.dispose());await page.waitForTimeout(180);
 const disposed=await page.evaluate(()=>scrollFoleyStudy.snapshot());assert.equal(disposed.sound.foleyVoices,0);assert.equal(disposed.sound.musicVoices,0);
 assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
 const productionChanges=execFileSync('git',['diff','--name-only','a8ae916ad0f64a69f266638ef24ad8feda7c423e','--','web/labs/certification-reader','web/labs/project-beginning'],{encoding:'utf8',windowsHide:true}).trim();assert.equal(productionChanges,'');
 const compact=state=>({variant:state.variant,soundReady:state.soundReady,viewerReady:state.viewerReady,withMusic:state.withMusic,pose:state.pose,
  sound:Object.fromEntries(['active','paused','disposed','unlocked','foleyEnabled','contextState','musicVoices','foleyVoices','decoded','failures','performances','cueTrace'].map(k=>[k,state.sound[k]]))});
 const captured=result=>({duration:result.duration,snapshot:compact(result.snapshot)});
 const report={checkedAt:new Date().toISOString(),base,scope:'Actual Chromium WebGL viewer and WebAudio output. Video is the object canvas with audio, WAV is decoded Opus capture, not a lossless master or iPhone/Safari listening review.',openA:captured(openA),closeA:captured(closeA),openB:captured(openB),dragging:compact(dragging),held:compact(held),reverse:compact(reverse),reference:compact(reference),disposed:compact(disposed),errors,failed,
  checks:{actualFinitePhaseCues:true,noAutomaticReseeking:true,contactPhaseAligned:true,dragAndReverse:true,heldFingerQuiet:true,disposeStopsAudio:true,unchangedViewerAndPaper:true,qualityApproved:false}};
 await writeFile(out+'/verification.json',JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify({checks:report.checks,durations:[openA.duration,closeA.duration,openB.duration]}));
}finally{await browser.close();}

import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';

// Recovery gate only. No UI/audio edits, learning writes or listening verdict.
const root=process.cwd(),reference='466132c';
const out=root+'/research/scroll-source-selection-2026-10-22';
const tmp=root+'/.cache/keeper-reference-browser';
const base=(process.env.STUDY_URL||'http://127.0.0.1:8153').replace(/\/$/,'');
await mkdir(out,{recursive:true});await mkdir(tmp,{recursive:true});
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const git=(...args)=>execFileSync('git',args,{cwd:root,windowsHide:true,maxBuffer:8*1024*1024});
const keys=['bendOpen','bendClose','holeOpen','holeClose','tailOpen','tailClose','slideOpen','slideClose','park','seat'];
const referenceCues=JSON.parse(git('show',reference+':web/labs/scroll-foley-study/cues.json').toString()).materials;
const report={checkedAt:new Date().toISOString(),base,reference,
 scope:'Actual Chromium at 393x852, unchanged WebGL viewer and real WebAudio output. Captures are Opus recording decoded to mono PCM WAV; neither lossless masters nor physical iPhone/Safari listening acceptance.',
 keeperAssets:[],checks:{qualityApproved:false,artApproved:false},errors:[],failedRequests:[]};
let browser;
try{
 for(const key of keys){
  const path=`web/labs/scroll-foley-study/audio/${key}.wav`;
  const [current,pinned]=await Promise.all([readFile(root+'/'+path),Promise.resolve(git('show',reference+':'+path))]);
  const item={key,path,bytes:current.length,sha256:hash(current),referenceSHA256:hash(pinned)};
  assert.equal(item.sha256,item.referenceSHA256,'Recovered keeper bytes changed: '+key);
  report.keeperAssets.push(item);
 }
 report.checks.exactTenKeeperWAVs=true;
 const protectedPaths=['web/labs/certification-reader','web/labs/project-beginning',
  'web/labs/chapter-scroll-v6','web/labs/chapter-scroll-v17','web/labs/chapter-scroll-v19','web/labs/chapter-scroll-v20'];
 const changes=git('diff','--name-only',reference,'--',...protectedPaths).toString().trim();
 assert.equal(changes,'','Production viewer, paper or keeper geometry changed');
 report.checks.productionViewerPaperGeometryUnchanged=true;
 for(let attempt=0;;attempt++){
  try{const response=await fetch(base+'/labs/scroll-foley-study/',{signal:AbortSignal.timeout(1200)});if(response.ok)break;throw Error('HTTP '+response.status);}
  catch(error){if(attempt>=15)throw error;await new Promise(resolve=>setTimeout(resolve,1000));}
 }
 const {chromium}=await import(pathToFileURL('D:/CodexStorage/workspaces/second-language-maintenance/.cache/browser-tools/package/index.mjs'));
 browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',
  env:{...process.env,TEMP:tmp,TMP:tmp},args:['--no-first-run']});
 const page=await browser.newPage({viewport:{width:393,height:852},deviceScaleFactor:1});
 const audioRequests=[],responses=[],responseTasks=[];
 page.on('pageerror',e=>report.errors.push(e.message));
 page.on('requestfailed',r=>report.failedRequests.push({url:r.url(),error:r.failure()?.errorText}));
 page.on('request',r=>{if(/\.(wav|ogg|mp3)(?:\?|$)/i.test(r.url()))audioRequests.push(r.url());});
 page.on('response',response=>{
  if(!/\/labs\/scroll-foley-study\/audio\/[^/]+\.wav(?:\?|$)/.test(response.url()))return;
  responseTasks.push(response.body().then(bytes=>responses.push({url:response.url(),status:response.status(),bytes:bytes.length,sha256:hash(bytes)})));
 });
 await page.addInitScript(()=>{
  const connect=AudioNode.prototype.connect;
  AudioNode.prototype.connect=function(destination,...args){
   const result=connect.call(this,destination,...args);
   if(destination===this.context.destination){
    window.__keeperCaptures??=new Map();
    let capture=__keeperCaptures.get(this.context);
    if(!capture){capture={stream:this.context.createMediaStreamDestination(),analyser:this.context.createAnalyser()};capture.analyser.fftSize=2048;__keeperCaptures.set(this.context,capture);}
    connect.call(this,capture.stream);connect.call(this,capture.analyser);
   }
   return result;
  };
 });
 await page.goto(base+'/labs/scroll-foley-study/');
 await page.waitForFunction(()=>window.scrollFoleyStudy?.snapshot().viewerReady,{timeout:90000});
 await page.locator('#unlockSound').click();
 await page.waitForFunction(()=>scrollFoleyStudy.snapshot().soundReady,{timeout:20000});
 const initial=await page.evaluate(()=>scrollFoleyStudy.snapshot());
 assert.equal(initial.withMusic,false);assert.equal(initial.sound.foleyEnabled,true);
 assert.equal(initial.sound.keeperReference,'466132c A/B');
 assert.deepEqual([...initial.sound.decoded].sort(),[...keys].sort());
 report.initial={candidate:initial.candidate,withMusic:initial.withMusic,decoded:initial.sound.decoded,keeperReference:initial.sound.keeperReference};
 await page.evaluate(()=>{
  window.__keeperCapture=[...__keeperCaptures].find(([ctx])=>ctx.state==='running')[1];
  window.__keeperRMS=()=>{const values=new Float32Array(__keeperCapture.analyser.fftSize);__keeperCapture.analyser.getFloatTimeDomainData(values);return Math.sqrt(values.reduce((sum,x)=>sum+x*x,0)/values.length);};
 });
 const capture=async(name,button,to)=>{
  const startIndex=await page.evaluate(()=>scrollFoleyStudy.snapshot().sound.cueTrace.length);
  await page.evaluate(()=>{
   window.__keeperChunks=[];window.__keeperRecorder=new MediaRecorder(__keeperCapture.stream.stream,{mimeType:'audio/webm;codecs=opus'});
   __keeperRecorder.ondataavailable=e=>{if(e.data.size)__keeperChunks.push(e.data);};__keeperRecorder.start();
   window.__keeperSamples=[];window.__keeperMonitor=setInterval(()=>{const s=scrollFoleyStudy.snapshot();__keeperSamples.push({p:s.pose.progress,q:s.pose.paperProgress,rms:__keeperRMS(),voices:s.sound.foleyVoices,performances:s.sound.performances});},60);
  });
  await page.locator(button).click();
  await page.waitForFunction(to=>Math.abs(scrollFoleyStudy.snapshot().pose.progress-to)<.00001,to,{timeout:30000});
  await page.waitForTimeout(300);
  const result=await page.evaluate(async startIndex=>{
   clearInterval(__keeperMonitor);
   await new Promise(resolve=>{__keeperRecorder.onstop=resolve;__keeperRecorder.stop();});
   const bytes=await new Blob(__keeperChunks,{type:'audio/webm'}).arrayBuffer();
   const context=new OfflineAudioContext(1,1,48000),buffer=await context.decodeAudioData(bytes);
   const n=buffer.length,channels=buffer.numberOfChannels,wav=new ArrayBuffer(44+n*2),view=new DataView(wav);
   const str=(at,text)=>[...text].forEach((c,i)=>view.setUint8(at+i,c.charCodeAt(0)));
   str(0,'RIFF');view.setUint32(4,36+n*2,true);str(8,'WAVE');str(12,'fmt ');view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,1,true);view.setUint32(24,buffer.sampleRate,true);view.setUint32(28,buffer.sampleRate*2,true);view.setUint16(32,2,true);view.setUint16(34,16,true);str(36,'data');view.setUint32(40,n*2,true);
   let peak=0,sum=0;
   for(let i=0;i<n;i++){let value=0;for(let c=0;c<channels;c++)value+=buffer.getChannelData(c)[i]/channels;peak=Math.max(peak,Math.abs(value));sum+=value*value;view.setInt16(44+i*2,Math.round(Math.max(-1,Math.min(1,value))*32767),true);}
   const u=new Uint8Array(wav);let encoded='';for(let i=0;i<u.length;i+=16384)encoded+=String.fromCharCode(...u.subarray(i,i+16384));
   const sound=scrollFoleyStudy.snapshot().sound;
   return{wav:btoa(encoded),duration:buffer.duration,peak,rms:Math.sqrt(sum/n),cues:sound.cueTrace.slice(startIndex),samples:__keeperSamples,foleyVoices:sound.foleyVoices,contacts:sound.contacts};
  },startIndex);
  const wav=Buffer.from(result.wav,'base64');await writeFile(out+'/'+name+'.wav',wav);delete result.wav;
  result.capture={file:name+'.wav',bytes:wav.length,sha256:hash(wav)};
  assert.ok(result.peak>1e-5,'Captured material output must exist');assert.ok(result.peak<1,'Captured output must not clip');
  return result;
 };
 report.opening=await capture('keeper-opening','#openScroll',1);
 report.closing=await capture('keeper-closing','#closeScroll',0);
 const phaseFor={bend:'unload-hole',hole:'release-hole',tail:'withdraw-tail',slide:'slide-clear'};
 for(const [direction,result]of [['Open',report.opening],['Close',report.closing]]){
  const contact=direction==='Open'?'park':'seat';
  const expected=[...Object.keys(phaseFor).map(k=>k+direction),contact];
  assert.deepEqual(result.cues.map(c=>c.key).sort(),expected.sort(),direction+': exactly one cue per keeper action');
  for(const c of result.cues){
   assert.equal(c.mode,'automatic');assert.equal(c.offset,0);
   const original=referenceCues.find(item=>item.key===c.key);assert.ok(original);
   assert.ok(Math.abs(c.duration-original.duration)<1e-6,'Same complete source cut: '+c.key);
   if(c.key===contact){assert.equal(c.gain,.4);assert.equal(c.contact,true);}
   else{const part=c.key.replace(/Open$|Close$/,'');assert.equal(c.phase,phaseFor[part]);assert.equal(c.gain,{bend:.9,hole:.7,tail:.95,slide:.65}[part]);}
  }
 }
 const park=report.opening.cues.find(c=>c.key==='park'),seat=report.closing.cues.find(c=>c.key==='seat');
 assert.ok(park.r>.72&&park.r<.79);assert.equal(park.phase,'park-pin');
 assert.ok(seat.r>=0&&seat.r<=.012);assert.equal(seat.phase,'unload-hole');
 const performances=[...report.opening.samples,...report.closing.samples].flatMap(s=>s.performances);
 assert.ok(performances.length>0);for(const p of performances){assert.equal(p.loop,false);assert.equal(p.rate,1);}
 const paperSamples=[...report.opening.samples,...report.closing.samples].filter(s=>s.q>.01&&s.q<.99);
 assert.ok(paperSamples.length>10);assert.ok(paperSamples.every(s=>s.voices===0&&s.rms<1e-7),'Paper phase must stay actually silent');
 Object.assign(report.checks,{exactAutomaticCuesAndLevels:true,existingContactThresholdPhases:true,nativeSpeedNoLoop:true,paperPhaseSilent:true});
 // Actual pointer input through the accepted viewer; no internal motion calls.
 const box=await page.locator('#scroll').boundingBox(),x=box.x+box.width*.5,y=box.y+box.height*.2;
 await page.mouse.move(x,y);await page.mouse.down();
 for(let i=1;i<=14;i++){await page.mouse.move(x,y+box.height*.64*.22*i/14);await page.waitForTimeout(28);}
 const dragging=await page.evaluate(()=>scrollFoleyStudy.snapshot().sound);
 assert.ok(dragging.cueTrace.some(c=>c.mode==='drag'),'Actual drag must generate keeper cues');
 await page.waitForTimeout(350);
 const held=await page.evaluate(()=>({sound:scrollFoleyStudy.snapshot().sound,rms:__keeperRMS()}));
 assert.equal(held.sound.foleyVoices,0);assert.ok(held.rms<1e-7,'Held pointer must become silent');
 for(let i=1;i<=10;i++){await page.mouse.move(x,y+box.height*.64*(.22-.12*i/10));await page.waitForTimeout(28);}
 const reverse=await page.evaluate(()=>scrollFoleyStudy.snapshot().sound);
 assert.ok(reverse.cueTrace.some(c=>c.mode==='drag'&&c.direction<0),'Reverse drag must be exercised');
 await page.mouse.up();await page.waitForFunction(()=>scrollFoleyStudy.snapshot().pose.progress<.00001,{timeout:10000});await page.waitForTimeout(250);
 report.drag={cues:dragging.cueTrace.filter(c=>c.mode==='drag'),held:{foleyVoices:held.sound.foleyVoices,rms:held.rms},reverseCues:reverse.cueTrace.filter(c=>c.mode==='drag'&&c.direction<0)};
 report.checks.actualDragHoldReverse=true;
 await page.screenshot({path:out+'/keeper-reference-iphone.png',fullPage:true});
 // Dispose during a fresh, audible keeper action, not merely at rest.
 await page.locator('#openScroll').click();await page.waitForFunction(()=>scrollFoleyStudy.snapshot().sound.foleyVoices>0,{timeout:5000});
 await page.evaluate(()=>scrollFoleyStudy.dispose());await page.waitForTimeout(200);
 const disposed=await page.evaluate(()=>scrollFoleyStudy.snapshot().sound);
 assert.equal(disposed.foleyVoices,0);assert.equal(disposed.musicVoices,0);assert.equal(disposed.disposed,true);
 report.disposed={disposed:disposed.disposed,foleyVoices:disposed.foleyVoices,musicVoices:disposed.musicVoices,contextState:disposed.contextState};report.checks.exitReleasesAudio=true;
 await Promise.all(responseTasks);
 for(const item of report.keeperAssets){const response=responses.find(r=>new URL(r.url).pathname.endsWith('/'+item.key+'.wav'));assert.ok(response,'Browser fetched '+item.key);assert.equal(response.status,200);assert.equal(response.sha256,item.sha256);}
 const requestedKeys=audioRequests.map(url=>new URL(url).pathname.split('/').at(-1).replace(/\.wav$/,''));
 assert.ok(requestedKeys.every(key=>keys.includes(key)),'No paper, music or rejected material may be requested during keeper-only recovery');
 assert.deepEqual(report.errors,[]);assert.deepEqual(report.failedRequests,[]);
 report.audioRequests=audioRequests;report.browserAudioResponses=responses;
 report.checks.browserBytesMatchRecovery=true;report.checks.noPaperAudioRequested=true;
 report.status='technical-recovery-verified';
 await writeFile(out+'/verification.json',JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify({status:report.status,assets:report.keeperAssets.length,checks:report.checks,captures:[report.opening.capture.file,report.closing.capture.file]}));
}catch(error){
 report.status='failed';report.failure={name:error.name,message:error.message,stack:error.stack};
 await writeFile(out+'/verification.json',JSON.stringify(report,null,2)+'\n');
 throw error;
}finally{await browser?.close();}

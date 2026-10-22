import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';

// Narrow technical gate. This records real browser output, not a listening verdict.
const root=process.cwd(),reference='a9470bd';
const out=root+'/research/scroll-paper-sound-2026-10-22';
const tmp=root+'/.cache/paper-candidate-browser';
const base=(process.env.STUDY_URL||'http://127.0.0.1:8153').replace(/\/$/,'');
await mkdir(out,{recursive:true});await mkdir(tmp,{recursive:true});
const sha=b=>createHash('sha256').update(b).digest('hex');
const git=(...args)=>execFileSync('git',args,{cwd:root,windowsHide:true,maxBuffer:8*1024*1024});
const keeperKeys=['bendOpen','bendClose','holeOpen','holeClose','tailOpen','tailClose','slideOpen','slideClose','park','seat'];
const manifest=JSON.parse(await readFile(root+'/web/labs/scroll-foley-study/paper-recordings.json','utf8'));
const report={checkedAt:new Date().toISOString(),base,reference,networkProxy:process.env.STUDY_PROXY||null,
 scope:'Actual headless Chrome WebGL/WebAudio, 393x852. Full opening/closing captures are actual master-bus output recorded through MediaRecorder Opus and decoded to mono PCM WAV. Not lossless masters, human listening approval, or physical iPhone/Safari validation.',
 checks:{qualityApproved:false,artApproved:false},keeperAssets:[],paperAssets:[],httpErrors:[],pageErrors:[],requestFailures:[]};
let browser;
try{
 for(const key of keeperKeys){
  const file='web/labs/scroll-foley-study/audio/'+key+'.wav';
  const bytes=await readFile(root+'/'+file),pinned=git('show',reference+':'+file);
  assert.equal(sha(bytes),sha(pinned),'A/B keeper bytes changed: '+key);
  report.keeperAssets.push({key,file,bytes:bytes.length,sha256:sha(bytes),referenceSHA256:sha(pinned)});
 }
 report.checks.tenKeeperAssetsMatchReference=true;
 const protectedPaths=['web/labs/certification-reader','web/labs/project-beginning','web/labs/chapter-scroll-v6','web/labs/chapter-scroll-v17','web/labs/chapter-scroll-v19','web/labs/chapter-scroll-v20'];
 const changes=git('diff','--name-only',reference,'--',...protectedPaths).toString().trim();
 assert.equal(changes,'','Production rendering, paper or keeper mechanism changed');
 report.checks.productionVisualsAndMechanismUnchanged=true;
 assert.equal(manifest.recordings.length,2);
 for(const item of manifest.recordings){
  const bytes=await readFile(root+'/web/labs/scroll-foley-study/'+item.file);
  assert.equal(bytes.length,item.bytes);assert.equal(sha(bytes),item.sha256);
  assert.equal(item.rate,48000);assert.equal(item.channels,2);assert.equal(item.bitDepth,16);
  report.paperAssets.push({file:item.file,bytes:bytes.length,sha256:sha(bytes),frames:item.frames,duration:item.duration,rate:item.rate,channels:item.channels,bitDepth:item.bitDepth});
 }
 const {chromium}=await import(pathToFileURL('D:/CodexStorage/workspaces/second-language-maintenance/.cache/browser-tools/package/index.mjs'));
 browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',env:{...process.env,TEMP:tmp,TMP:tmp},args:['--no-first-run'],...(process.env.STUDY_PROXY?{proxy:{server:process.env.STUDY_PROXY}}:{})});
 const page=await browser.newPage({viewport:{width:393,height:852},deviceScaleFactor:1});
 const audioResponses=[],responseTasks=[];
 page.on('pageerror',e=>report.pageErrors.push(e.message));
 page.on('requestfailed',r=>report.requestFailures.push({url:r.url(),error:r.failure()?.errorText}));
 page.on('response',r=>{
  if(r.status()>=400)report.httpErrors.push({url:r.url(),status:r.status()});
  if(/\/labs\/scroll-foley-study\/audio\/[^/]+\.wav(?:\?|$)/.test(r.url()))responseTasks.push(r.body().then(b=>audioResponses.push({url:r.url(),status:r.status(),bytes:b.length,sha256:sha(b)})));
 });
 await page.addInitScript(()=>{
  const connect=AudioNode.prototype.connect;
  window.__captures=new Map();window.__sourceStarts=[];
  AudioNode.prototype.connect=function(destination,...args){
   const result=connect.call(this,destination,...args);
   if(destination===this.context.destination){
    let capture=__captures.get(this.context);
    if(!capture){capture={stream:this.context.createMediaStreamDestination(),analyser:this.context.createAnalyser()};capture.analyser.fftSize=2048;__captures.set(this.context,capture);}
    connect.call(this,capture.stream);connect.call(this,capture.analyser);
   }return result;
  };
  const start=AudioBufferSourceNode.prototype.start;
  AudioBufferSourceNode.prototype.start=function(when=0,offset=0,duration){
   __sourceStarts.push({duration:this.buffer?.duration,rate:this.playbackRate.value,loop:this.loop,offset,requestedDuration:duration??null,audioTime:this.context.currentTime});
   return duration===undefined?start.call(this,when,offset):start.call(this,when,offset,duration);
  };
 });
 await page.goto(base+'/labs/scroll-foley-study/');
 await page.waitForFunction(()=>window.scrollFoleyStudy?.snapshot().viewerReady,null,{timeout:120000});
 await page.locator('#unlockSound').click();
 await page.waitForFunction(()=>scrollFoleyStudy.snapshot().soundReady,null,{timeout:20000});
 const initial=await page.evaluate(()=>scrollFoleyStudy.snapshot());
 assert.equal(initial.withMusic,false);assert.equal(initial.sound.variant,'paper-recording-v4');
 assert.deepEqual([...initial.sound.decoded].sort(),[...keeperKeys,'paperUnroll','paperRollup'].sort());
 report.initial={candidate:initial.candidate,decoded:initial.sound.decoded,keeperReference:initial.sound.keeperReference,maximumPaperGain:initial.sound.maximumPaperGain};
 const browserDecoded=await page.evaluate(async items=>{
  const ctx=new OfflineAudioContext(2,1,48000),result=[];
  for(const item of items){const response=await fetch(item.file),bytes=await response.arrayBuffer(),buffer=await ctx.decodeAudioData(bytes);let peak=0,sum=0;
   for(let c=0;c<buffer.numberOfChannels;c++){const d=buffer.getChannelData(c);for(const v of d){peak=Math.max(peak,Math.abs(v));sum+=v*v;}}
   result.push({duration:buffer.duration,frames:buffer.length,rate:buffer.sampleRate,channels:buffer.numberOfChannels,peak,rms:Math.sqrt(sum/buffer.length/buffer.numberOfChannels)});
  }return result;
 },manifest.recordings);
 for(let i=0;i<browserDecoded.length;i++){const d=browserDecoded[i],m=manifest.recordings[i];assert.equal(d.frames,m.frames);assert.equal(d.rate,48000);assert.equal(d.channels,2);assert.ok(d.peak>1e-4);report.paperAssets[i].browserDecode=d;}
 report.checks.paperFilesDecodeAtNativeFormatAndContainSignal=true;
 await page.evaluate(()=>{
  window.__capture=[...__captures].find(([ctx])=>ctx.state==='running')[1];
  window.__rms=()=>{const a=new Float32Array(__capture.analyser.fftSize);__capture.analyser.getFloatTimeDomainData(a);return Math.sqrt(a.reduce((s,v)=>s+v*v,0)/a.length);};
 });
 const capture=async(name,button,to)=>{
  const indexes=await page.evaluate(()=>({cue:scrollFoleyStudy.snapshot().sound.cueTrace.length,start:__sourceStarts.length}));
  await page.evaluate(()=>{
   window.__chunks=[];window.__recorder=new MediaRecorder(__capture.stream.stream,{mimeType:'audio/webm;codecs=opus'});
   __recorder.ondataavailable=e=>{if(e.data.size)__chunks.push(e.data);};__recorder.start();window.__samples=[];
   window.__monitor=setInterval(()=>{const s=scrollFoleyStudy.snapshot();__samples.push({p:s.pose.progress,q:s.pose.paperProgress,rms:__rms(),paperGain:s.sound.paperGain,paperKey:s.sound.paperKey,voices:s.sound.performances});},45);
  });
  await page.locator(button).click();
  await page.waitForFunction(to=>Math.abs(scrollFoleyStudy.snapshot().pose.progress-to)<.00001,to,{timeout:30000});await page.waitForTimeout(220);
  const result=await page.evaluate(async indexes=>{
   clearInterval(__monitor);await new Promise(resolve=>{__recorder.onstop=resolve;__recorder.stop();});
   const encoded=await new Blob(__chunks,{type:'audio/webm'}).arrayBuffer(),ctx=new OfflineAudioContext(1,1,48000),buffer=await ctx.decodeAudioData(encoded);
   const n=buffer.length,wav=new ArrayBuffer(44+n*2),v=new DataView(wav),str=(at,s)=>[...s].forEach((c,i)=>v.setUint8(at+i,c.charCodeAt(0)));
   str(0,'RIFF');v.setUint32(4,36+n*2,true);str(8,'WAVE');str(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,buffer.sampleRate,true);v.setUint32(28,buffer.sampleRate*2,true);v.setUint16(32,2,true);v.setUint16(34,16,true);str(36,'data');v.setUint32(40,n*2,true);
   let peak=0,sum=0;const d=buffer.getChannelData(0);for(let i=0;i<n;i++){peak=Math.max(peak,Math.abs(d[i]));sum+=d[i]*d[i];v.setInt16(44+i*2,Math.round(Math.max(-1,Math.min(1,d[i]))*32767),true);}
   const u=new Uint8Array(wav);let text='';for(let i=0;i<u.length;i+=16384)text+=String.fromCharCode(...u.subarray(i,i+16384));
   return{wav:btoa(text),duration:buffer.duration,peak,rms:Math.sqrt(sum/n),cues:scrollFoleyStudy.snapshot().sound.cueTrace.slice(indexes.cue),starts:__sourceStarts.slice(indexes.start),samples:__samples,ending:scrollFoleyStudy.snapshot().sound};
  },indexes);
  const bytes=Buffer.from(result.wav,'base64');delete result.wav;await writeFile(out+'/'+name+'.wav',bytes);result.capture={file:name+'.wav',bytes:bytes.length,sha256:sha(bytes)};
  assert.ok(result.peak>1e-5&&result.peak<1,'Actual captured master output must exist without clipping');return result;
 };
 report.opening=await capture('paper-candidate-opening','#openScroll',1);
 report.closing=await capture('paper-candidate-closing','#closeScroll',0);
 for(const [direction,key,result]of [['Open','paperUnroll',report.opening],['Close','paperRollup',report.closing]]){
  const paper=result.cues.filter(c=>c.key.startsWith('paper'));assert.equal(paper.length,1,'One paper source per automatic direction');
  assert.equal(paper[0].key,key);assert.ok(paper[0].paperProgress>0&&paper[0].paperProgress<1);assert.equal(paper[0].offset,0);assert.equal(paper[0].rate,1);assert.equal(paper[0].loop,false);
  const expected=[...['bend','hole','tail','slide'].map(k=>k+direction),direction==='Open'?'park':'seat'];
  assert.deepEqual(result.cues.filter(c=>!c.key.startsWith('paper')).map(c=>c.key).sort(),expected.sort());
  const duration=manifest.recordings.find(m=>m.action===(direction==='Open'?'unroll':'rollup')).duration;
  const actualStarts=result.starts.filter(s=>Math.abs(s.duration-duration)<1/48000);assert.equal(actualStarts.length,1);assert.equal(actualStarts[0].rate,1);assert.equal(actualStarts[0].loop,false);assert.equal(actualStarts[0].offset,0);assert.equal(actualStarts[0].requestedDuration,null);
  const paperOnly=result.samples.filter(s=>s.q>.06&&s.q<.9&&s.voices.length>0&&s.voices.every(v=>v.key===key));
  const audible=paperOnly.filter(s=>s.rms>1e-7);assert.ok(audible.length>=3,'Paper-only actual master signal must be present');
  result.paperOnlyMeasurement={samples:paperOnly.length,audibleSamples:audible.length,maxRMS:Math.max(...paperOnly.map(s=>s.rms)),maximumGain:Math.max(...result.samples.map(s=>s.paperGain||0))};
  assert.ok(result.samples.every(s=>(s.paperGain||0)<=.100001));assert.equal(result.ending.foleyVoices,0);
  result.paperOnlyMeasurement.firstAudible=audible[0]??null;result.paperOnlyMeasurement.lastAudible=audible.at(-1)??null;
  result.ending={foleyVoices:result.ending.foleyVoices,musicVoices:result.ending.musicVoices,paperKey:result.ending.paperKey,contextState:result.ending.contextState};
  delete result.samples;
 }
 Object.assign(report.checks,{automaticPaperAudibleInIsolation:true,onePaperSourcePerDirection:true,paperStartsOnlyAtActualPaperMotion:true,nativeRateNoLoopNoRepeatedSeek:true,automaticKeeperCuesRetained:true,paperMaximumGainBounded:true});
 // Real pointer input enters the paper interval, holds, then reverses.
 const box=await page.locator('#scroll').boundingBox(),x=box.x+box.width*.5,y=box.y+box.height*.12;
 await page.mouse.move(x,y);await page.mouse.down();
 for(let i=1;i<=28;i++){await page.mouse.move(x,y+box.height*.64*.79*i/28);await page.waitForTimeout(22);}
 const drag=await page.evaluate(()=>({state:scrollFoleyStudy.snapshot(),rms:__rms()}));
 assert.ok(drag.state.pose.paperProgress>0&&drag.state.pose.paperProgress<1);assert.ok(drag.state.sound.cueTrace.some(c=>c.key==='paperUnroll'&&c.mode==='drag'));
 await page.waitForTimeout(300);const held=await page.evaluate(()=>({state:scrollFoleyStudy.snapshot(),rms:__rms()}));
 assert.equal(held.state.sound.foleyVoices,0);assert.ok(held.rms<1e-7,'Stopped drag must be actually silent');
 for(let i=1;i<=10;i++){await page.mouse.move(x,y+box.height*.64*(.79-.14*i/10));await page.waitForTimeout(24);}
 const reversed=await page.evaluate(()=>scrollFoleyStudy.snapshot());assert.ok(reversed.sound.cueTrace.some(c=>c.key==='paperRollup'&&c.mode==='drag'));
 await page.mouse.up();await page.waitForFunction(()=>scrollFoleyStudy.snapshot().pose.progress>.99999,null,{timeout:12000});await page.waitForTimeout(250);
 report.drag={progress:drag.state.pose.progress,paperProgress:drag.state.pose.paperProgress,held:{foleyVoices:held.state.sound.foleyVoices,rms:held.rms},reversePaperCues:reversed.sound.cueTrace.filter(c=>c.key==='paperRollup'&&c.mode==='drag')};
 report.checks.realDragHoldAndReverse=true;
 await page.screenshot({path:out+'/paper-candidate-iphone.png',fullPage:true});
 report.checks.noMobileHorizontalOverflow=await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth);assert.equal(report.checks.noMobileHorizontalOverflow,true);
 // Dispose during an actually sounding paper voice rather than at rest.
 await page.locator('#closeScroll').click();await page.waitForFunction(()=>{const s=scrollFoleyStudy.snapshot();return s.pose.paperProgress>.1&&s.pose.paperProgress<.95&&s.sound.performances.some(v=>v.key==='paperRollup');},null,{timeout:8000});
 await page.evaluate(()=>scrollFoleyStudy.dispose());await page.waitForTimeout(250);
 const disposed=await page.evaluate(()=>({sound:scrollFoleyStudy.snapshot().sound,rms:__rms()}));
 assert.equal(disposed.sound.disposed,true);assert.equal(disposed.sound.foleyVoices,0);assert.equal(disposed.sound.musicVoices,0);assert.equal(disposed.sound.contextState,'closed');
 report.disposed={disposed:disposed.sound.disposed,foleyVoices:disposed.sound.foleyVoices,musicVoices:disposed.sound.musicVoices,contextState:disposed.sound.contextState,analyserLastFrameRMS:disposed.rms,note:'Closed AudioContext no longer processes audio. Its analyser may retain its last frame; this cached value is not a live post-exit measurement. Actual held-drag silence was measured while the context was running.'};report.checks.exitReleasesPaperAndKeeper=true;
 await Promise.all(responseTasks);
 for(const item of [...report.keeperAssets,...report.paperAssets]){const name=item.file.split('/').at(-1),served=audioResponses.find(r=>new URL(r.url).pathname.endsWith('/'+name));assert.ok(served,'Browser served '+name);assert.equal(served.sha256,item.sha256);assert.equal(served.status,200);}
 report.browserAudioResponses=audioResponses;report.checks.browserBytesMatchLocalAssets=true;
 assert.deepEqual(report.httpErrors,[]);assert.deepEqual(report.pageErrors,[]);assert.deepEqual(report.requestFailures,[]);
 report.status='technical-paper-candidate-verified';
 await writeFile(out+'/verification.json',JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify({status:report.status,checks:report.checks,paper:report.paperAssets.map(x=>({file:x.file,duration:x.duration})),signal:{opening:report.opening.paperOnlyMeasurement,closing:report.closing.paperOnlyMeasurement},captures:[report.opening.capture.file,report.closing.capture.file]}));
}catch(error){report.status='failed';report.failure={name:error.name,message:error.message,stack:error.stack};await writeFile(out+'/verification.json',JSON.stringify(report,null,2)+'\n');throw error;}
finally{await browser?.close();}

import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {execFileSync} from 'node:child_process';
const root=process.cwd(),out=root+'/research/scroll-soft-roll-2026-10-22',tmp=root+'/.cache/soft-roll-browser';
await mkdir(tmp,{recursive:true});await mkdir(out,{recursive:true});
const base=process.env.STUDY_URL||'http://127.0.0.1:8153';
const {chromium}=await import(pathToFileURL('D:/CodexStorage/workspaces/second-language-maintenance/.cache/browser-tools/package/index.mjs'));
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',env:{...process.env,TEMP:tmp,TMP:tmp},args:['--no-first-run']});
try{
 const page=await browser.newPage({viewport:{width:393,height:852},deviceScaleFactor:1});
 const errors=[],failed=[],audioRequests=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('requestfailed',r=>failed.push(r.url()));
 page.on('request',r=>{if(/\.(wav|mp3)(\?|$)/.test(r.url()))audioRequests.push(r.url());});
 await page.addInitScript(()=>{
  const original=AudioNode.prototype.connect;
  AudioNode.prototype.connect=function(destination,...args){
   const result=original.call(this,destination,...args);
   if(destination===this.context.destination){
    let capture=window.__audioCaptures?.get(this.context);
    if(!capture){capture={stream:this.context.createMediaStreamDestination(),analyser:this.context.createAnalyser()};capture.analyser.fftSize=2048;window.__audioCaptures??=new Map();window.__audioCaptures.set(this.context,capture);}
    original.call(this,capture.stream);original.call(this,capture.analyser);
   }return result;
  };
 });
 await page.goto(base+'/labs/scroll-foley-study/');
 await page.waitForFunction(()=>window.scrollFoleyStudy?.snapshot().viewerReady,{timeout:90000});
 await page.locator('#unlockSound').click();await page.waitForFunction(()=>scrollFoleyStudy.snapshot().soundReady,{timeout:20000});
 await page.evaluate(()=>{
  window.__capture=[...__audioCaptures].find(([ctx])=>ctx.state==='running')[1];
  window.__rms=()=>{const a=new Float32Array(__capture.analyser.fftSize);__capture.analyser.getFloatTimeDomainData(a);return Math.sqrt(a.reduce((s,x)=>s+x*x,0)/a.length);};
 });
 const initial=await page.evaluate(()=>scrollFoleyStudy.snapshot());
 assert.equal(initial.candidate,'soft-v2');assert.equal(initial.withMusic,false);assert.deepEqual(initial.sound.decoded,['paper']);
 async function capture(name,button,to){
  await page.evaluate(()=>{
   window.__chunks=[];window.__recorder=new MediaRecorder(__capture.stream.stream,{mimeType:'audio/webm;codecs=opus'});
   __recorder.ondataavailable=e=>{if(e.data.size)__chunks.push(e.data);};__recorder.start();
   window.__motionTrace=[];window.__monitor=setInterval(()=>{const s=scrollFoleyStudy.snapshot();__motionTrace.push({q:s.pose.paperProgress,p:s.pose.progress,gain:s.sound.paperGain,rms:__rms(),voices:s.sound.foleyVoices,sourceExhausted:s.sound.sourceExhausted});},40);
  });
  await page.locator(button).click();await page.waitForFunction(to=>Math.abs(scrollFoleyStudy.snapshot().pose.progress-to)<.00001,to,{timeout:30000});await page.waitForTimeout(300);
  const result=await page.evaluate(async()=>{
   clearInterval(__monitor);await new Promise(resolve=>{__recorder.onstop=resolve;__recorder.stop();});
   const data=await new Blob(__chunks,{type:'audio/webm'}).arrayBuffer();
   const ctx=new OfflineAudioContext(2,1,48000),b=await ctx.decodeAudioData(data.slice(0)),channels=b.numberOfChannels,n=b.length;
   const wav=new ArrayBuffer(44+n*channels*2),d=new DataView(wav),str=(p,v)=>[...v].forEach((c,i)=>d.setUint8(p+i,c.charCodeAt(0)));
   str(0,'RIFF');d.setUint32(4,36+n*channels*2,true);str(8,'WAVE');str(12,'fmt ');d.setUint32(16,16,true);d.setUint16(20,1,true);d.setUint16(22,channels,true);d.setUint32(24,48000,true);d.setUint32(28,48000*channels*2,true);d.setUint16(32,channels*2,true);d.setUint16(34,16,true);str(36,'data');d.setUint32(40,n*channels*2,true);
   let peak=0,sum=0;for(let i=0;i<n;i++)for(let ch=0;ch<channels;ch++){const x=b.getChannelData(ch)[i];peak=Math.max(peak,Math.abs(x));sum+=x*x;d.setInt16(44+(i*channels+ch)*2,Math.round(Math.max(-1,Math.min(1,x))*32767),true);}
   const u=new Uint8Array(wav);let s='';for(let i=0;i<u.length;i+=16384)s+=String.fromCharCode(...u.subarray(i,i+16384));
   return{wav:btoa(s),duration:b.duration,peak,rms:Math.sqrt(sum/(n*channels)),trace:__motionTrace,sound:scrollFoleyStudy.snapshot().sound};
  });
  await writeFile(out+'/'+name+'.wav',Buffer.from(result.wav,'base64'));delete result.wav;
  return result;
 }
 const opening=await capture('quiet-opening','#openScroll',1),closing=await capture('quiet-closing','#closeScroll',0);
 assert.ok(opening.trace.filter(t=>t.p<.4).length>10);
 assert.ok(opening.trace.filter(t=>t.p<.4).every(t=>t.rms<1e-7&&t.voices===0),'Keeper animation must be actually silent');
 assert.ok(opening.peak>1e-5&&opening.peak<.008,'Actual paper output is present but restrained');
 for(const s of [opening,closing]){
  assert.ok(s.sound.cueTrace.every(t=>t.key==='soft-paper'&&t.paperProgress>0));
  assert.equal(s.sound.contacts.length,0);
  assert.ok(s.sound.envelope.every(t=>t.target<=.13));
 }
 // Actual pointer: pass silent keeper phase, move the paper, reverse without
 // lifting, then hold and make extremely slow subpixel paper movements.
 const box=await page.locator('#scroll').boundingBox(),x=box.x+box.width/2,start=box.y+box.height*.06;
 await page.mouse.move(x,start);await page.mouse.down();
 let y=start;
 for(let i=1;i<=23;i++){y=start+i*box.height*.64*.035;await page.mouse.move(x,y);await page.waitForTimeout(22);}
 const forward=await page.evaluate(()=>scrollFoleyStudy.snapshot().sound);
 for(let i=1;i<=5;i++){y-=box.height*.64*.035;await page.mouse.move(x,y);await page.waitForTimeout(22);}
 const reverse=await page.evaluate(()=>scrollFoleyStudy.snapshot().sound);
 assert.equal(reverse.eventsPlayed,forward.eventsPlayed,'Reversing must not re-trigger a new paper source');
 await page.waitForTimeout(350);const held=await page.evaluate(()=>({sound:scrollFoleyStudy.snapshot().sound,rms:__rms()}));
 assert.equal(held.sound.foleyVoices,0);assert.ok(held.rms<1e-7);
 const slow=[];
 for(let i=0;i<7;i++){y+=.2;await page.mouse.move(x,y);await page.waitForTimeout(100);slow.push(await page.evaluate(()=>({gain:scrollFoleyStudy.snapshot().sound.paperGain,rms:__rms()})));}
 assert.ok(slow.every(s=>s.gain<.00001&&s.rms<1e-7),'Very slow paper motion must remain essentially silent');
 await page.mouse.up();await page.waitForTimeout(600);
 await page.screenshot({path:out+'/study-iphone.png',fullPage:true});
 await page.evaluate(()=>scrollFoleyStudy.dispose());await page.waitForTimeout(200);const final=await page.evaluate(()=>scrollFoleyStudy.snapshot().sound);
 assert.equal(final.foleyVoices,0);assert.equal(final.musicVoices,0);
 assert.ok(audioRequests.every(u=>u.endsWith('/soft-roll-v2.wav')),'No archived leather/metal/heavy-paper asset may be requested');
 assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
 assert.equal(execFileSync('git',['diff','--name-only','466132c','--','web/labs/certification-reader','web/labs/project-beginning'],{encoding:'utf8',windowsHide:true}).trim(),'');
 const report={checkedAt:new Date().toISOString(),base,scope:'Real Chromium/WebGL/WebAudio; WAV captures decoded from recorded Opus, not masters or an artistic listening pass.',opening,closing,forward,reverse,held,slow,audioRequests,errors,failed,
  checks:{paperOnly:true,actualKeeperSilence:true,lowSpeedSilence:true,heldSilence:true,noDirectionRetrigger:true,lowOutput:true,noUnwantedAssets:true,exitStopsAudio:true,artAndGeometryUnchanged:true,qualityApproved:false}};
 await writeFile(out+'/verification.json',JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify({checks:report.checks,peaks:[opening.peak,closing.peak],rms:[opening.rms,closing.rms]}));
}finally{await browser.close();}

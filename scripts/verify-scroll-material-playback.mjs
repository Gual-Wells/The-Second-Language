import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const root=process.cwd(),out='research/scroll-reader-correction-2026-10-22',tmp=root+'/.cache/scroll-reader-correction-2026-10-22/playback-tmp';
await mkdir(tmp,{recursive:true});process.env.TEMP=process.env.TMP=tmp;
const {chromium}=await import(pathToFileURL('D:/CodexStorage/workspaces/second-language-maintenance/.cache/browser-tools/package/index.mjs'));
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',env:{...process.env,TEMP:tmp,TMP:tmp},args:['--no-first-run']});
try{
 const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('http://127.0.0.1:8153/__material-playback',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><button id="start">Start actual material decoding</button>'}));
 await page.goto('http://127.0.0.1:8153/__material-playback');
 await page.evaluate(async()=>{
  const {SoundDirector}=await import('/labs/certification-reader/sound.js?v=40');
  const {MaterialPath,RELEASE_END}=await import('/labs/chapter-scroll-v17/keeper-motion.js');
  const path=new MaterialPath(await(await fetch('/labs/chapter-scroll-v17/keeper-path.json')).json());
  window.materialSound=new SoundDirector();window.initialDefaults=materialSound.snapshot();materialSound.setMusicEnabled(false);materialSound.setActive(true);
  window.pose=p=>{const r=Math.min(1,p/RELEASE_END),k=path.sample(r);return{progress:p,paperProgress:Math.max(0,(p-RELEASE_END)/(1-RELEASE_END)),keeper:{r,phase:k.phase,pin:k.pin,angle:k.angle,along:k.along,feed:k.feed,slide:k.slide,depart:k.depart,visible:p<RELEASE_END}};};
  document.querySelector('#start').onclick=()=>{window.unlockResult=materialSound.unlock();};
 });
 await page.locator('#start').click();await page.evaluate(()=>unlockResult);
 const result=await page.evaluate(async()=>{
  const sound=materialSound,ctx=sound.context,analyser=ctx.createAnalyser();analyser.fftSize=2048;sound.foleyBus.connect(analyser);
  const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms)),rms=()=>{const a=new Float32Array(analyser.fftSize);analyser.getFloatTimeDomainData(a);return Math.sqrt(a.reduce((n,v)=>n+v*v,0)/a.length);};
  async function stroke(from,to){
   sound.motion({...pose(from),active:false});let peakRMS=0;
   for(let i=1;i<=30;i++){await delay(18);sound.motion({...pose(from+(to-from)*i/30),active:true});if(i>4)peakRMS=Math.max(peakRMS,rms());}
   const moving=sound.snapshot();await delay(350);return{peakRMS,moving,heldQuietRMS:rms(),held:sound.snapshot()};
  }
  const leather=await stroke(.15,.27),paper=await stroke(.52,.78);
  sound.pause();await delay(150);const paused=sound.snapshot();sound.setActive(false);await delay(150);const exited=sound.snapshot();
  analyser.disconnect();const result={initialDefaults,leather,paper,paused,exited,actualAudioContext:ctx.state};sound.dispose();return result;
 });
 assert.equal(result.initialDefaults.musicEnabled,true);assert.equal(result.initialDefaults.foleyEnabled,true);
 for(const key of ['leather','paper']){assert.ok(result[key].peakRMS>1e-4,`${key}: actual samples must reach the analyser while its mechanism moves`);assert.ok(result[key].heldQuietRMS<1e-6,`${key}: holding a finger motionless must silence the actual output`);assert.equal(result[key].held.materialTargets.paper,0);assert.equal(result[key].held.materialTargets.leather,0);}
 assert.equal(result.leather.moving.materialTargets.paper,0);assert.equal(result.paper.moving.materialTargets.leather,0);
 assert.equal(result.paused.foleyVoices,0);assert.equal(result.exited.foleyVoices,0);assert.equal(result.exited.musicVoices,0);assert.deepEqual(errors,[]);
 const report={checkedAt:new Date().toISOString(),checks:{recordedSourcesDecode:true,actualMaterialPlayback:true,materialPhaseSeparation:true,heldFingerAudioClockSilence:true,pauseClearsVoices:true,exitClearsVoices:true,defaultsEnabled:true},result,errors,scope:'Real WebAudio analyser on material bus with the actual keeper path. Browser automation, not a human timbre assessment or physical iPhone audition.'};
 await mkdir(out,{recursive:true});await writeFile(out+'/material-playback-verification.json',JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify({checks:report.checks,leatherRMS:result.leather.peakRMS,paperRMS:result.paper.peakRMS,held:[result.leather.heldQuietRMS,result.paper.heldQuietRMS]}));
}finally{await browser.close();}

import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';

// A narrow integration check: observe the real product's graph while music stays
// on. A tap on the paper gain output is measured separately, so background music
// cannot conceal a missing paper tail. This is not another listening verdict.
const root=process.cwd(),accepted='9d17b41bca922c0034a615cd9a50a8c2eb3682f4';
const args=process.argv.slice(2);
if(args.length>1||args.some(arg=>arg.startsWith('--')))throw Error('Usage: node scripts/verify-scroll-production-sound.mjs [base URL]');
const base=(args[0]||process.env.STUDY_URL||process.env.BASE_URL||'http://127.0.0.1:8153').replace(/\/$/,'');
const proxy=process.env.STUDY_PROXY||process.env.SCROLL_PROXY||null;
const out=root+'/research/scroll-sound-adoption-2026-10-23',tmp=root+'/.cache/production-sound-browser/tmp';
await mkdir(out,{recursive:true});await mkdir(tmp,{recursive:true});
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const git=(...params)=>execFileSync('git',params,{cwd:root,windowsHide:true,maxBuffer:8*1024*1024});
const keeperKeys=['bendOpen','bendClose','holeOpen','holeClose','tailOpen','tailClose','slideOpen','slideClose','park','seat'];
const referenceManifest=JSON.parse(git('show',accepted+':web/labs/scroll-foley-study/paper-recordings.json'));
const paperKeys={unroll:'paperUnroll',rollup:'paperRollup'};
const papers=referenceManifest.recordings.map(item=>({key:paperKeys[item.action],name:item.file.split('/').at(-1),duration:item.duration}));
const report={checkedAt:new Date().toISOString(),base,networkProxy:proxy,acceptedStudyCommit:accepted,
 scope:'Headless Chrome, real production Settings > certification reader > project commemoration UI, WebGL and WebAudio. Only session/empty chapter API responses are mocked. Music remains enabled and playing; an analyser observes each real paper gain output before the common Foley bus, separately from music. No microphone, human hearing or physical iPhone/Safari test is asserted.',
 userDecision:'User explicitly approved the moving-tail audition for production integration on 2026-10-23; this script does not infer new artistic approval.',
 checks:{},assets:[],httpErrors:[],pageErrors:[],requestFailures:[],writes:[]};
let browser;
try{
 for(const name of [...keeperKeys.map(key=>key+'.wav'),...papers.map(item=>item.name)]){
  const file='/labs/certification-reader/assets/audio-foley/v42/'+name;
  const bytes=await readFile(root+'/web'+file),reference=git('show',accepted+':web/labs/scroll-foley-study/audio/'+name);
  assert.equal(hash(bytes),hash(reference),'Promoted file differs from approved study: '+name);
  report.assets.push({file,bytes:bytes.length,sha256:hash(bytes),approvedSHA256:hash(reference)});
 }
 report.checks.twelveRuntimeFilesMatchApprovedStudy=true;
 const {chromium}=await import(pathToFileURL('D:/CodexStorage/workspaces/second-language-maintenance/.cache/browser-tools/package/index.mjs'));
 browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',env:{...process.env,TEMP:tmp,TMP:tmp},args:['--no-first-run'],...(proxy?{proxy:{server:proxy}}:{})});
 const context=await browser.newContext({viewport:{width:393,height:852},deviceScaleFactor:1,serviceWorkers:'block'});
 await context.addInitScript(({papers})=>{
  window.__paperBranches=[];window.__soundSourceStarts=[];window.__readerTestHidden=false;
  Object.defineProperty(document,'hidden',{configurable:true,get:()=>window.__readerTestHidden});
  const keyOf=source=>papers.find(item=>source.buffer&&Math.abs(source.buffer.duration-item.duration)<.0001)?.key||null;
  const connect=AudioNode.prototype.connect,start=AudioBufferSourceNode.prototype.start,gains=new WeakMap();
  AudioNode.prototype.connect=function(destination,...args){
   const result=connect.call(this,destination,...args);
   if(this instanceof AudioBufferSourceNode){
    const key=keyOf(this);
    if(key&&destination instanceof GainNode)gains.set(destination,{source:this,gain:destination,key});
   }
   const branch=gains.get(this);
   if(branch&&!branch.analyser){
    branch.analyser=this.context.createAnalyser();branch.analyser.fftSize=2048;branch.ended=false;
    connect.call(this,branch.analyser);this.context&&__paperBranches.push(branch);
    branch.source.addEventListener('ended',()=>{branch.ended=true;},{once:true});
   }
   return result;
  };
  AudioBufferSourceNode.prototype.start=function(when=0,offset=0,duration){
   const key=keyOf(this),state=window.certificationReader?.snapshot();
   __soundSourceStarts.push({key,duration:this.buffer?.duration,rate:this.playbackRate.value,loop:this.loop,offset,requestedDuration:duration??null,
    audioTime:this.context.currentTime,paperProgress:state?.viewer?.paperProgress??null,progress:state?.viewer?.progress??null});
   return duration===undefined?start.call(this,when,offset):start.call(this,when,offset,duration);
  };
  window.__paperOutput=()=>{
   const branches=__paperBranches.filter(branch=>!branch.ended&&branch.source.context.state==='running');
   const measured=branches.map(branch=>{const data=new Float32Array(branch.analyser.fftSize);branch.analyser.getFloatTimeDomainData(data);
    return{key:branch.key,rms:Math.sqrt(data.reduce((sum,value)=>sum+value*value,0)/data.length)};});
   return{rms:Math.sqrt(measured.reduce((sum,item)=>sum+item.rms*item.rms,0)),branches:measured};
  };
 },{papers});
 const page=await context.newPage(),responseJobs=[],served=new Map(),resourceURLs=[];
 page.on('pageerror',error=>report.pageErrors.push(error.message));
 page.on('requestfailed',request=>report.requestFailures.push({url:request.url(),error:request.failure()?.errorText}));
 page.on('request',request=>{resourceURLs.push(request.url());if(!['GET','HEAD'].includes(request.method()))report.writes.push({url:request.url(),method:request.method()});});
 page.on('response',response=>{
  if(response.status()>=400)report.httpErrors.push({url:response.url(),status:response.status()});
  if(new URL(response.url()).pathname.startsWith('/labs/certification-reader/assets/audio-foley/v42/'))responseJobs.push(response.body().then(bytes=>served.set(new URL(response.url()).pathname,{bytes:bytes.length,sha256:hash(bytes),status:response.status()})));
 });
 await page.route('**/api/**',route=>{const path=new URL(route.request().url()).pathname;return route.fulfill({json:path==='/api/session'?{authenticated:true,demo:true}:path==='/api/chapters'?{chapters:[]}:{}});});
 async function enter(){
  await page.goto(base+'/');await page.locator('#settingsButton').click();await page.locator('#certificationReaderButton').click();
  assert.deepEqual(await page.locator('#certificationChapters button').allTextContents(),['项目纪念']);
  await page.locator('[data-work="project-beginning"]').click();
  await page.waitForFunction(()=>{const state=certificationReader.snapshot();return state.ready&&state.sound.unlocked&&state.sound.contextState==='running'&&state.sound.musicState==='playing'&&state.sound.decoded.length===13;},null,{timeout:120000});
 }
 await enter();
 const initial=await page.evaluate(()=>certificationReader.snapshot());
 assert.equal(initial.sound.variant,'recorded-foley-v42');assert.equal(initial.sound.userApproved,true);
 assert.equal(initial.sound.musicEnabled,true);assert.equal(initial.sound.foleyEnabled,true);
 assert.equal(initial.sound.musicTrack,'a-new-town');assert.ok(initial.sound.musicVolume>0);assert.ok(initial.sound.foleyVolume>0);
 assert.deepEqual([...initial.sound.decoded].sort(),[...keeperKeys,'paperUnroll','paperRollup','music'].sort());
 report.initial={variant:initial.sound.variant,userApproved:initial.sound.userApproved,musicEnabled:initial.sound.musicEnabled,musicState:initial.sound.musicState,decoded:initial.sound.decoded};
 report.checks.trustedProductEntryUnlocksAdoptedSoundWithMusic=true;
 async function perform(direction,to){
  const indexes=await page.evaluate(()=>({cue:certificationReader.snapshot().sound.cueTrace.length,start:__soundSourceStarts.length}));
  await page.evaluate(()=>{window.__paperSamples=[];window.__paperMonitor=setInterval(()=>{
   const state=certificationReader.snapshot(),output=__paperOutput();
   __paperSamples.push({p:state.viewer.progress,q:state.viewer.paperProgress,rms:output.rms,branches:output.branches,paperGain:state.sound.paperGain,musicState:state.sound.musicState,performances:state.sound.performances});
  },20);});
  await page.locator('#certificationCanvas').click({position:{x:196,y:420}});
  await page.waitForFunction(to=>{const state=certificationReader.snapshot();return Math.abs(state.viewer.progress-to)<.000001&&!state.viewer.animating;},to,{timeout:30000});
  await page.waitForTimeout(250);
  const result=await page.evaluate(indexes=>{clearInterval(__paperMonitor);return{samples:__paperSamples,cues:certificationReader.snapshot().sound.cueTrace.slice(indexes.cue),starts:__soundSourceStarts.slice(indexes.start),ending:certificationReader.snapshot().sound};},indexes);
  const key=direction==='Open'?'paperUnroll':'paperRollup',paperCues=result.cues.filter(cue=>cue.key.startsWith('paper'));
  assert.equal(paperCues.length,1,'Single finite paper source per automatic direction');assert.equal(paperCues[0].key,key);
  assert.ok(paperCues[0].paperProgress>0&&paperCues[0].paperProgress<1);assert.equal(paperCues[0].mode,'automatic');
  const starts=result.starts.filter(start=>start.key===key);assert.equal(starts.length,1);assert.equal(starts[0].offset,0);assert.equal(starts[0].rate,1);assert.equal(starts[0].loop,false);assert.equal(starts[0].requestedDuration,null);
  assert.deepEqual(result.cues.filter(cue=>!cue.key.startsWith('paper')).map(cue=>cue.key).sort(),[...['bend','hole','tail','slide'].map(part=>part+direction),direction==='Open'?'park':'seat'].sort());
  assert.ok(result.samples.every(sample=>sample.musicState==='playing'),'Music remains active throughout, without masking the separate paper measurement');
  const bins=[[.70,.85],[.85,.95],[.95,.985],[.985,1]];
  const tails=bins.map(([lo,hi])=>{
   const samples=result.samples.filter(sample=>{const travel=direction==='Open'?sample.q:1-sample.q;return travel>=lo&&travel<hi;});
   assert.ok(samples.length>0,`${direction} tail ${lo}-${hi} was observed`);
   assert.ok(samples.every(sample=>sample.branches.some(branch=>branch.key===key)),`${direction} tail ${lo}-${hi} retains an actual paper branch`);
   assert.ok(samples.every(sample=>sample.rms>1e-6),`${direction} tail ${lo}-${hi} contains separately measured paper output`);
   return{travel:[lo,hi],samples:samples.length,minPaperBranchRMS:Math.min(...samples.map(sample=>sample.rms)),maxPaperBranchRMS:Math.max(...samples.map(sample=>sample.rms)),meanPaperGain:samples.reduce((sum,sample)=>sum+sample.paperGain,0)/samples.length};
  });
  assert.ok(tails.at(-1).meanPaperGain<tails[0].meanPaperGain*.55,'Moving tail fades instead of staying constant');
  assert.ok(result.samples.every(sample=>(sample.paperGain||0)<=.100001));
  assert.equal(result.ending.foleyVoices,0);assert.equal(result.ending.paperGain,0);
  return{direction,paperStarts:starts,cues:result.cues,tails,samples:result.samples.length,ending:{paperGain:result.ending.paperGain,foleyVoices:result.ending.foleyVoices,musicState:result.ending.musicState}};
 }
 report.opening=await perform('Open',1);report.closing=await perform('Close',0);
 Object.assign(report.checks,{automaticOpenAndCloseUseOneForwardNativeRatePaperSource:true,approvedKeeperPhasesRetained:true,fullMovingTailHasPaperOutputIndependentOfMusic:true,movingTailGraduallyFades:true,restStopsPaper:true});
 // Drive actual pointer events. The product host, rather than a test adapter,
 // must carry drag mode to the canonical sound engine.
 const box=await page.locator('#certificationCanvas').boundingBox(),x=box.x+box.width*.5,y=box.y+box.height*.12;
 await page.mouse.move(x,y);await page.mouse.down();
 for(let i=1;i<=28;i++){await page.mouse.move(x,y+box.height*.64*.79*i/28);await page.waitForTimeout(22);}
 const dragging=await page.evaluate(()=>({state:certificationReader.snapshot(),output:__paperOutput()}));
 assert.ok(dragging.state.viewer.paperProgress>0&&dragging.state.viewer.paperProgress<1);
 assert.ok(dragging.state.sound.cueTrace.some(cue=>cue.key==='paperUnroll'&&cue.mode==='drag'),'Real production drag reaches paper sound in drag mode');
 assert.ok(dragging.state.sound.cueTrace.some(cue=>!cue.key.startsWith('paper')&&cue.mode==='drag'),'Real production keeper drag is identified');
 await page.waitForTimeout(300);const held=await page.evaluate(()=>({state:certificationReader.snapshot(),output:__paperOutput()}));
 assert.equal(held.state.sound.foleyVoices,0);assert.ok(held.output.rms<1e-7,'Actual held paper branch becomes silent');assert.equal(held.state.sound.musicState,'playing');
 for(let i=1;i<=10;i++){await page.mouse.move(x,y+box.height*.64*(.79-.14*i/10));await page.waitForTimeout(24);}
 const reversed=await page.evaluate(()=>certificationReader.snapshot());assert.ok(reversed.sound.cueTrace.some(cue=>cue.key==='paperRollup'&&cue.mode==='drag'));
 await page.mouse.up();await page.waitForFunction(()=>{const state=certificationReader.snapshot();return state.viewer.progress>.999999&&!state.viewer.animating;},null,{timeout:15000});await page.waitForTimeout(250);
 report.drag={paperProgress:dragging.state.viewer.paperProgress,hold:{paperBranchRMS:held.output.rms,foleyVoices:held.state.sound.foleyVoices,musicState:held.state.sound.musicState},reversePaperCues:reversed.sound.cueTrace.filter(cue=>cue.key==='paperRollup'&&cue.mode==='drag')};
 report.checks.realProductDragHoldReverseAndMusicCoexist=true;
 // Exit in the middle of a real paper performance, then fire foreground events
 // that previously could resurrect pending playback.
 await page.locator('#certificationCanvas').click({position:{x:196,y:420}});
 await page.waitForFunction(()=>{const state=certificationReader.snapshot();return state.viewer.paperProgress>.1&&state.viewer.paperProgress<.95&&state.sound.performances.some(voice=>voice.key==='paperRollup');},null,{timeout:10000});
 await page.keyboard.press('Escape');await page.locator('#certificationCatalogue').waitFor({state:'visible'});await page.waitForTimeout(300);
 const exited=await page.evaluate(()=>({state:certificationReader.snapshot(),output:__paperOutput()}));
 assert.equal(exited.state.sound.active,false);assert.equal(exited.state.sound.foleyVoices,0);assert.equal(exited.state.sound.musicVoices,0);assert.ok(exited.output.rms<1e-7);
 await page.evaluate(()=>{window.dispatchEvent(new Event('pageshow'));document.dispatchEvent(new Event('visibilitychange'));});await page.waitForTimeout(250);
 const returned=await page.evaluate(()=>certificationReader.snapshot());assert.equal(returned.open,false);assert.equal(returned.sound.active,false);assert.equal(returned.sound.foleyVoices,0);assert.equal(returned.sound.musicVoices,0);
 report.exit={paperBranchRMS:exited.output.rms,foleyVoices:returned.sound.foleyVoices,musicVoices:returned.sound.musicVoices,active:returned.sound.active};
 report.checks.exitDuringPaperStopsBothTracksWithoutRevival=true;
 await Promise.all(responseJobs);
 for(const item of report.assets){assert.deepEqual(served.get(item.file),{bytes:item.bytes,sha256:item.sha256,status:200},'Browser received promoted bytes: '+item.file);}
 report.checks.browserServesAllTwelveApprovedWAVs=true;
 for(const file of ['/app.js','/certification-reader.js','/labs/certification-reader/sound.js','/labs/certification-reader/keeper-sound.js','/labs/certification-reader/sound-base.js'])assert.ok(resourceURLs.some(value=>{const url=new URL(value);return url.pathname===file&&url.searchParams.get('v')==='42';}),'Product import chain versioned: '+file);
 assert.ok(!resourceURLs.some(value=>/\/labs\/scroll-foley-study\//.test(value)),'Product does not import study modules');
 report.checks.productUsesVersionedCanonicalModulesWithoutStudyImports=true;
 report.browserAudioResponses=[...served].map(([file,value])=>({file,...value}));
 // A fresh real SW context complements, but does not pretend to be, migration
 // from a physical installed iPhone PWA or every historical cache state.
 const swContext=await browser.newContext({viewport:{width:393,height:852},serviceWorkers:'allow'}),swPage=await swContext.newPage();
 await swPage.route('**/api/**',route=>{const path=new URL(route.request().url()).pathname;return route.fulfill({json:path==='/api/session'?{authenticated:true,demo:true}:path==='/api/chapters'?{chapters:[]}:{}});});
 await swPage.goto(base+'/');await swPage.evaluate(()=>navigator.serviceWorker.ready);
 await swPage.waitForFunction(()=>Boolean(navigator.serviceWorker.controller),null,{timeout:20000});
 await swPage.reload();
 const sw=await swPage.evaluate(async()=>({controller:navigator.serviceWorker.controller?.scriptURL,caches:await caches.keys(),requests:await(await caches.open('second-language-shell-v42')).keys().then(keys=>keys.map(key=>key.url))}));
 assert.ok(sw.caches.includes('second-language-shell-v42'));assert.equal(new URL(sw.controller).searchParams.get('v'),'42');
 for(const file of ['/app.js','/certification-reader.js','/labs/certification-reader/sound.js','/labs/certification-reader/keeper-sound.js','/labs/certification-reader/sound-base.js'])assert.ok(sw.requests.some(value=>{const url=new URL(value);return url.pathname===file&&url.searchParams.get('v')==='42';}),'SW contains canonical module: '+file);
 report.serviceWorker=sw;report.checks.freshServiceWorkerCachesCanonicalV42Chain=true;
 await swContext.close();await context.close();
 assert.deepEqual(report.pageErrors,[]);assert.deepEqual(report.httpErrors,[]);assert.deepEqual(report.requestFailures,[]);assert.deepEqual(report.writes,[]);
 report.status='production-sound-integration-verified';
 report.evidenceLimits={audio:'Paper branch gain output is real WebAudio signal before common Foley/master gains; music remains playing but is excluded from this measurement. RMS establishes continued signal, not subjective loudness or sound quality.',device:'Chrome at 393x852. No physical iPhone/Safari, speaker, microphone or lock-screen validation.',manual:'Finite approved takes do not promise endless sound during arbitrarily long continuous dragging.',serviceWorker:'Fresh installation and reload, not every old installed cache migration.'};
 await writeFile(out+'/audio-verification.json',JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify({status:report.status,checks:report.checks,tails:{opening:report.opening.tails,closing:report.closing.tails}}));
}catch(error){report.status='failed';report.failure={message:error.message,stack:error.stack};await writeFile(out+'/audio-verification.json',JSON.stringify(report,null,2)+'\n');throw error;}
finally{await browser?.close();}

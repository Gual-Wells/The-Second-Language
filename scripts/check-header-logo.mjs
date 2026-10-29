import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir,realpath} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import path from 'node:path';

const root=await realpath(process.cwd()),out=path.join(root,'.cache/header-logo');
if(process.platform==='win32'&&!/^D:[\\/]/i.test(root))throw Error('Header verification data must reside on D.');
await mkdir(out+'/tmp',{recursive:true});process.env.TEMP=process.env.TMP=out+'/tmp';
const {chromium,webkit}=createRequire(process.execPath)('playwright');
const html=await readFile('web/index.html','utf8'),header=html.match(/<header class="app-header">[\s\S]*?<\/header>/)?.[0];
assert.ok(header,'Production header exists');
const sourceIcon=await readFile('web/icon.svg','utf8');
assert.deepEqual([...header.matchAll(/<path[^>]*d="([^"]+)"/g)].map(m=>m[1]),[...sourceIcon.matchAll(/<path[^>]*d="([^"]+)"/g)].map(m=>m[1]),'Header preserves the source book geometry');
const meta=JSON.parse(await readFile('chapters/2026-10-24/meta.json','utf8')),markdown=await readFile('chapters/2026-10-24/chapter.md','utf8');
const chapter={...meta,id:meta.date,markdown,digest:createHash('sha256').update(markdown).digest('hex')};
const checks=[],errors=[],observations=[];let requests=0,releaseFirst,signalFirst;const firstRequestSeen=new Promise(resolve=>signalFirst=resolve);
const check=(name,value)=>{assert.ok(value,name);checks.push(name)};
const origin='https://header-logo.test';
const browsers=[];

async function routeContext(context,{harness=false}={}){
 await context.addInitScript(()=>{delete Navigator.prototype.serviceWorker});
 if(harness)await context.addInitScript(()=>{
  const audio={started:0,stopped:0,decoded:0};globalThis.__audioFixture=audio;
  class FakeAudioContext{
   destination={};state='running';async resume(){}async decodeAudioData(){audio.decoded++;return{duration:1}}
   createBufferSource(){const source={connect(){},start(){audio.started++;audio.current=source},stop(){audio.stopped++;source.onended?.()}};return source}
  }
  globalThis.AudioContext=FakeAudioContext;globalThis.webkitAudioContext=FakeAudioContext;
 });
 await context.route('**/*',async route=>{
  const req=route.request(),u=new URL(req.url()),p=u.pathname;
  if(u.origin!==origin)return route.abort();
  if(harness&&p==='/')return route.fulfill({contentType:'text/html',body:`<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/styles.css"><div class="app-shell"><div>${header}</div><article id="article" data-audio-part="contexts"><span class="context-sentence">A clear sentence preserves the reader's purpose.</span></article></div><script type="module">import{installReaderSpeech}from'/reader-speech.js';globalThis.__speech=installReaderSpeech({toast:()=>{}});globalThis.__speechReady=true;</script>`});
  if(harness&&p==='/audio-library.js')return route.fulfill({contentType:'text/javascript',body:'export async function cachedPronunciation(){return null}export async function keepPronunciation(){}export function chapterIdentity(){return{chapterId:"fixture",digest:"isolated"}}'});
  if(harness&&p==='/audio-plan.js')return route.fulfill({contentType:'text/javascript',body:'export const ipaToKokoro=()=>"";export const pronunciationKey=(s,p)=>s+":"+p;'});
  if(harness&&p==='/fixture.wav')return route.fulfill({contentType:'audio/wav',body:Buffer.alloc(32)});
  if(p.startsWith('/api/')||p.startsWith('/auth/')){
   if(harness&&p==='/api/practice/pronunciation'){
    requests++;if(requests===1)await new Promise(resolve=>{releaseFirst=resolve;signalFirst()});
    return route.fulfill({json:{id:'a'.repeat(64),state:'ready',audioUrl:'/fixture.wav'}});
   }
   const body=p==='/api/session'?{authenticated:true,demo:false,readerUserId:'isolated-logo-reader'}:
    p==='/api/chapters'?{chapters:[chapter]}:p.startsWith('/api/chapters/')?chapter:
    p==='/api/settings'?{}:p==='/api/temporary'?{pages:[]}:
    p==='/api/questions/summary'?{threads:[]}:p==='/api/practice'?{sets:[]}:
    p==='/api/chapter-quality/capabilities'?{policy:'chapter-quality-v2-contexts'}:{};
   return route.fulfill({json:body});
  }
  try{const name=p==='/'?'index.html':p.slice(1);const type={html:'text/html',js:'text/javascript',css:'text/css',svg:'image/svg+xml',png:'image/png',webmanifest:'application/manifest+json'}[name.split('.').at(-1)]||'application/octet-stream';return route.fulfill({contentType:type,body:await readFile(path.join(root,'web',name))})}catch{return route.fulfill({status:404,body:''})}
 });
}
try{
 for(const engine of ['Chromium','WebKit']){
  const browser=await (engine==='Chromium'?chromium.launch({headless:true,executablePath:process.env.BROWSER_EXECUTABLE||'C:/Users/huawei/AppData/Local/ms-playwright/chromium-1223/chrome-win64/chrome.exe'}):webkit.launch({headless:true}));browsers.push(browser);
  for(const width of engine==='Chromium'?[402,320]:[402]){
   const context=await browser.newContext({viewport:{width,height:874},isMobile:true,hasTouch:true,serviceWorkers:'block'});await routeContext(context);
   const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));await page.goto(origin+'/');await page.locator('#reader').waitFor({state:'visible'});
   check(engine+' '+width+': logo replaces mode controls',await page.locator('#headerLogo .header-logo').count()===1&&await page.locator('#speechMode,#speechModeLabel').count()===0);
   check(engine+' '+width+': decorative logo has no focus/action',await page.locator('#headerLogo').evaluate(e=>e.getAttribute('aria-hidden')==='true'&&!e.matches('button,a,[tabindex]')&&!e.closest('button,a,[tabindex]')));
   const initial=await page.evaluate(()=>{const n=document.querySelector('.header-logo'),slot=document.querySelector('#headerLogo'),r=n.getBoundingClientRect(),s=slot.getBoundingClientRect();return{width:r.width,height:r.height,slotWidth:s.width,slotHeight:s.height,color:n.querySelector('rect[fill="#cfe8ff"]')?.getAttribute('fill'),duration:getComputedStyle(n).animationDuration,easing:getComputedStyle(n).animationTimingFunction,iterations:getComputedStyle(n).animationIterationCount,headerHeight:document.querySelector('.app-header').getBoundingClientRect().height,overflow:document.documentElement.scrollWidth>innerWidth}});
   check(engine+' '+width+': selected footprint and ice-blue fill',initial.width===52&&initial.height===52&&initial.slotWidth===76&&initial.slotHeight===38&&initial.color==='#cfe8ff');
   check(engine+' '+width+': exact original timing',initial.duration==='1.8s'&&initial.easing==='ease-in-out'&&initial.iterations==='infinite');
   check(engine+' '+width+': original header geometry without overflow',initial.headerHeight===91&&!initial.overflow);
   const before=await page.locator('#headerLogo').boundingBox();await page.locator('#speechStop').evaluate(n=>{n.hidden=false;n.textContent='停止'});
   check(engine+' '+width+': playing keeps logo fixed',JSON.stringify(await page.locator('#headerLogo').boundingBox())===JSON.stringify(before));
   check(engine+' '+width+': playing keeps header height',await page.locator('.app-header').evaluate(n=>n.getBoundingClientRect().height)===initial.headerHeight);
   await page.locator('#speechStop').evaluate(n=>n.hidden=true);
   await page.emulateMedia({reducedMotion:'reduce'});check(engine+' '+width+': reduced motion retains a stable mark',await page.locator('.header-logo').evaluate(n=>getComputedStyle(n).animationName==='none'&&getComputedStyle(n).opacity==='1'));
   await page.emulateMedia({reducedMotion:'no-preference'});
   await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'))});
   check(engine+' '+width+': hidden document pauses motion',await page.locator('.header-logo').evaluate(n=>getComputedStyle(n).animationPlayState==='paused'));
   await page.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'))});
   check(engine+' '+width+': visible document resumes motion',await page.locator('.header-logo').evaluate(n=>getComputedStyle(n).animationPlayState==='running'));
   const phases=await page.locator('.header-logo').evaluate(async n=>{const a=n.getAnimations()[0],v=[];for(const time of [0,450,900,1350,1800]){a.pause();a.currentTime=time;await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));v.push(Number(getComputedStyle(n).opacity))}return v});
   check(engine+' '+width+': actual opacity phases match original',JSON.stringify(phases)===JSON.stringify([1,.775,.55,.775,1]));
   await page.screenshot({path:out+`/${engine.toLowerCase()}-${width}.png`,scale:'css'});observations.push({engine,width,initial,phases});await context.close();
  }
 }
 const browser=browsers[0],context=await browser.newContext({viewport:{width:402,height:874},serviceWorkers:'block'});await routeContext(context,{harness:true});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));await page.goto(origin+'/');await page.waitForFunction(()=>globalThis.__speechReady===true);
 await page.locator('.context-sentence').click();await page.waitForFunction(()=>!document.getElementById('speechStop').hidden);
 check('actual speech module exposes cancel during preparation',await page.locator('#speechStop').textContent()==='取消');
 await firstRequestSeen;await page.locator('#speechStop').click();releaseFirst();await page.waitForTimeout(100);
 check('cancelled in-flight response never begins playback',await page.evaluate(()=>__audioFixture.started===0)&&await page.locator('#speechStop').isHidden());
 await page.locator('.context-sentence').click();await page.waitForFunction(()=>__audioFixture.started===1);
 check('actual sentence reading still starts and offers stop',await page.locator('#speechStop').textContent()==='停止');
 await page.locator('#speechStop').click();check('stop halts the source and hides control',await page.evaluate(()=>__audioFixture.stopped===1)&&await page.locator('#speechStop').isHidden());
 await page.locator('.context-sentence').click();await page.waitForFunction(()=>__audioFixture.started===2);
 check('repeat reading reuses existing decoded audio',requests===2&&await page.evaluate(()=>__audioFixture.decoded===1));
 await page.evaluate(()=>__audioFixture.current.onended());check('natural completion hides stop',await page.locator('#speechStop').isHidden());
 const count=requests,box=await page.locator('#headerLogo').boundingBox();await page.mouse.click(box.x+box.width/2,box.y+box.height/2);check('logo click does not call pronunciation',requests===count);
 await context.close();check('no production frontend exceptions',errors.length===0);
 await writeFile(out+'/results.json',JSON.stringify({passed:true,checks,observations,errors,pronunciationBoundary:'Synthetic cache, API and AudioContext; actual reader-speech lifecycle module. No live or paid calls.',liveRequests:0,paidCalls:0,physicalIPhone:false},null,2));
 console.log(JSON.stringify({passed:true,checks:checks.length,errors,liveRequests:0,paidCalls:0}));
}finally{for(const browser of browsers)await browser.close()}

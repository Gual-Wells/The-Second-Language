import {readFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const {chromium}=await import('../.cache/browser-tools/package/index.mjs');
const folder='chapters/2026-10-09',meta=JSON.parse(await readFile(folder+'/meta.json','utf8')),markdown=await readFile(folder+'/chapter.md','utf8');
const chapter={...meta,id:meta.date,markdown,digest:createHash('sha256').update(markdown).digest('hex')},out='.cache/reader-position';await mkdir(out,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'C:/Users/huawei/AppData/Local/ms-playwright/chromium-1223/chrome-win64/chrome.exe',headless:true});
const page=await browser.newPage({viewport:{width:402,height:874},isMobile:true,hasTouch:true,serviceWorkers:'block'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.route('https://reader-position.test/**',async route=>{
 const p=new URL(route.request().url()).pathname;
 if(p.startsWith('/api/')||p.startsWith('/auth/')){
  const data=p==='/api/session'?{authenticated:true,demo:false}:p==='/api/chapters'?{chapters:[chapter]}:p.startsWith('/api/chapters/')?chapter:p==='/api/questions/summary'?{threads:[]}:p==='/api/temporary'?{pages:[]}:p==='/api/practice'?{sets:[]}:{};
  return route.fulfill({json:data});
 }
 const name=p==='/'?'index.html':p.slice(1),type={html:'text/html',js:'text/javascript',css:'text/css'}[name.split('.').at(-1)]||'application/octet-stream';
 try{return route.fulfill({body:await readFile('web/'+name),contentType:type});}catch{return route.fulfill({status:404,body:''});}
});
const toggle=()=>page.evaluate(async()=>{
 const target=document.getElementById('article');
 for(let i=0;i<2;i++){
  target.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,isPrimary:true,button:0,pointerId:1,clientX:20,clientY:400}));
  target.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,isPrimary:true,button:0,pointerId:1,clientX:20,clientY:400}));
  target.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,detail:1,clientX:20,clientY:400}));
 }
 await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
});
async function geometry(){return page.evaluate(()=>{const scope=document.getElementById('readingScroll'),article=document.getElementById('article');return {scroll:scope.scrollTop,max:scope.scrollHeight-scope.clientHeight,origin:article.getBoundingClientRect().top+scope.scrollTop,pure:document.getElementById('app').classList.contains('pure-reading')};});}
let interior=0,edges=0;
try{
 await page.goto('https://reader-position.test/');await page.locator('#reader').waitFor({state:'visible'});await page.locator('#chapterTestsButton').waitFor({state:'visible'});
 await page.addStyleTag({content:':root {--safe-top:62px;--safe-bottom:34px}'});
 assert.equal(await page.locator('#wordCount,#readState,.chapter-facts').count(),0);
 assert(await page.locator('.chapter-title-row').evaluate(e=>{const t=e.querySelector('h2').getBoundingClientRect(),b=e.querySelector('button').getBoundingClientRect();return Math.abs(t.bottom-b.bottom)<4;}));
 await page.screenshot({path:out+'/title.png',scale:'css'});
 for(const [part,translations] of [['one',false],['two',false],['three',false],['three',true]]){
  await page.locator(`[data-part="${part}"]`).click();await page.waitForTimeout(40);
  if(translations){await page.locator('#translationButton').click();await page.waitForTimeout(40);}
  const max=(await geometry()).max;
  for(const position of [0,80,200,400,1000,max-300,max-80,max]){
   await page.locator('#readingScroll').evaluate((e,y)=>e.scrollTop=y,Math.max(0,position));await page.waitForTimeout(20);
   for(let direction=0;direction<2;direction++){
    const before=await geometry();await toggle();const after=await geometry();assert.notEqual(before.pure,after.pure);
    const requested=before.scroll+after.origin-before.origin,expected=Math.max(0,Math.min(after.max,requested));
    assert(Math.abs(after.scroll-expected)<=1,`${part}/${translations}/${position}/${direction}: native bounded compensation ${after.scroll} != ${expected}`);
    if(requested>=0&&requested<=after.max){assert(Math.abs((after.origin-after.scroll)-(before.origin-before.scroll))<=1);interior++;}else edges++;
   }
  }
 }
 assert(interior>20&&edges>0);await page.screenshot({path:out+'/story.png',scale:'css'});
 // Observe the cover while the actual destination renders behind it. No animated
 // scrollIntoView may occur, and cancellation must retire both cover and notice.
 await page.locator('[data-part="one"]').click();await page.waitForTimeout(40);
 await page.evaluate(()=>{window.scrollCalls=[];const original=Element.prototype.scrollIntoView;Element.prototype.scrollIntoView=function(options){window.scrollCalls.push(options);return original.call(this,options);};window.jumpObservations=[];const watch=new MutationObserver(()=>{const cover=document.querySelector('.reader-jump-cover');if(cover)window.jumpObservations.push({notice:!document.getElementById('readerJumpStatus').hidden,source:cover.querySelector('.part-heading strong').textContent,destination:document.getElementById('partTitle').textContent});});watch.observe(document.getElementById('app'),{subtree:true,childList:true});});
 const use=page.locator('#article .usage-jump').nth(15),code=await use.evaluate(e=>e.parentElement.dataset.useId);
 await use.scrollIntoViewIfNeeded();await page.waitForTimeout(100);await use.click();await page.waitForFunction(()=>window.jumpObservations.some(o=>o.source==='词汇与用法'&&o.destination==='例句与翻译'&&o.notice));await page.locator('.reader-jump-cover').waitFor({state:'hidden'});
 assert(await page.evaluate(code=>{const e=[...document.querySelectorAll('#article [data-use-id]')].find(e=>e.dataset.useId===code);return Math.abs(e.getBoundingClientRect().top-document.getElementById('readingScroll').getBoundingClientRect().top-12)<=1;},code));
 const title=page.locator('#article .word-heading h1').nth(12),word=await title.evaluate(e=>e.closest('.word-entry').dataset.wordId);await title.scrollIntoViewIfNeeded();await page.waitForTimeout(100);await title.click();await page.waitForFunction(()=>document.getElementById('partTitle').textContent==='词汇与用法'&&document.getElementById('readerJumpStatus').hidden);
 assert(await page.evaluate(word=>{const e=[...document.querySelectorAll('#article .word-entry')].find(e=>e.dataset.wordId===word);return Math.abs(e.getBoundingClientRect().top-document.getElementById('readingScroll').getBoundingClientRect().top-12)<=1;},word));
 await page.locator('#wordIndexButton').click();await page.locator('.index-item').nth(20).click();await page.locator('.reader-jump-cover').waitFor({state:'hidden'});await page.waitForTimeout(100);
 assert(await page.locator('#article .word-entry').nth(20).evaluate(e=>Math.abs(e.getBoundingClientRect().top-document.getElementById('readingScroll').getBoundingClientRect().top-12)<=1));
 await page.locator('[data-part="three"]').click();await page.waitForTimeout(40);await page.locator('#readingScroll').evaluate(e=>e.scrollTop=0);await page.screenshot({path:out+'/story-heading.png',scale:'css'});
 assert.equal((await page.evaluate(()=>window.scrollCalls)).filter(o=>o?.behavior==='smooth').length,0);
 assert(await page.locator('#readerJumpStatus').isHidden());assert.deepEqual(errors,[]);
 console.log(JSON.stringify({interiorCoordinateChecks:interior,naturalEdgeChecks:edges,staticJumps:3,errors,paidCalls:0}));
}catch(e){console.log(await page.evaluate(()=>({errors:window.jumpObservations,part:document.getElementById('partTitle').textContent,cover:!!document.querySelector('.reader-jump-cover'),notice:document.getElementById('readerJumpStatus').hidden,toast:document.getElementById('toast').textContent})));await page.screenshot({path:out+'/failure.png',scale:'css'});throw e;}finally{await browser.close();}

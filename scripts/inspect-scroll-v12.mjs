import {mkdir,writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {createServer} from './serve-scroll-lab.mjs';
const {chromium}=await import(pathToFileURL('D:/CodexStorage/workspaces/second-language-maintenance/.cache/browser-tools/package/index.mjs'));
const out='research/scroll-lab-v12-sample';await mkdir(out,{recursive:true});await mkdir('.cache/scroll-v12-sample/temp',{recursive:true});process.env.TEMP=process.env.TMP=process.cwd()+'/.cache/scroll-v12-sample/temp';
const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));const base=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader','--no-first-run']});
try{
 const context=await browser.newContext({viewport:{width:402,height:874},isMobile:true,hasTouch:true,deviceScaleFactor:3,serviceWorkers:'block'}),page=await context.newPage(),errors=[],requests=[];
 page.on('pageerror',e=>{errors.push(e.message);console.log(e.message);});page.on('console',m=>{if(m.type()==='error'){errors.push(m.text());console.log(m.text());}});page.on('request',r=>requests.push({url:r.url(),method:r.method()}));
 await page.goto(base+'/labs/chapter-scroll-v12/?open=1');await page.waitForFunction(()=>window.scrollSpecimen?.snapshot().ready,null,{timeout:45000});await page.evaluate(()=>scrollSpecimen.atmosphere(false));
 const versions=[];
 for(const variant of ['oblong','round']){
  if(variant==='round'){await page.locator('#sealRound').tap();await page.waitForFunction(()=>scrollSpecimen.snapshot().layout.sealVariant==='round');}
  assert.equal(await page.locator(variant==='oblong'?'#sealOblong':'#sealRound').getAttribute('aria-pressed'),'true');
  await page.screenshot({path:`${out}/open-${variant}-iphone.png`,scale:'css'});
  for(const [file,fn]of [['document','exportDocument'],['seal','exportSeal'],['seal-height','exportSealHeight'],['object','exportObject']]){const data=await page.evaluate(fn=>scrollSpecimen[fn](),fn);await writeFile(`${out}/${file}-${variant}.png`,Buffer.from(data.split(',')[1],'base64'));}
  const state=await page.evaluate(()=>scrollSpecimen.snapshot()),record=await page.evaluate(()=>scrollSpecimen.exportRecord());assert.equal(createHash('sha256').update(record.canonicalPayload).digest('hex'),record.sha256);assert.equal(state.progress,1);assert.equal(state.issued,false);assert.equal(state.layout.sealVariant,variant);assert.ok(state.layout.colophonFontSize<state.layout.bodyFontSize);assert.ok(state.layout.lastInkBottom<1920);versions.push({state,record});
 }
 await page.locator('#sealOblong').tap();await page.waitForFunction(()=>scrollSpecimen.snapshot().layout.sealVariant==='oblong');assert.equal((await page.evaluate(()=>scrollSpecimen.exportRecord())).sha256,versions[0].record.sha256);assert.notEqual(versions[0].record.sha256,versions[1].record.sha256);
 await page.locator('#detail').tap();await page.locator('#detailZoom').tap();assert.ok(await page.locator('.scroll-document-detail').evaluate(e=>e.scrollWidth>e.clientWidth));await page.screenshot({path:out+'/detail-iphone.png',scale:'css'});assert.match(await page.locator('#transcriptContent').textContent(),/Upon the map, a river lies in ink/);assert.doesNotMatch(await page.locator('#transcriptContent').textContent(),/Charter of Attainment|Granted unto|In witness whereof/);
 assert.ok(requests.every(r=>r.url.startsWith(base)&&r.method==='GET'));assert.deepEqual(errors,[]);
 const failedContext=await browser.newContext({viewport:{width:402,height:874},serviceWorkers:'block'}),failedPage=await failedContext.newPage();await failedPage.route('**/Aboensis-Regular.otf',r=>r.abort());await failedPage.goto(base+'/labs/chapter-scroll-v12/');await failedPage.waitForFunction(()=>document.querySelector('#fallback').hidden===false);assert.match(await failedPage.locator('#fallbackDocument').textContent(),/Upon the map[\s\S]*Gual Wells[\s\S]*Specimen/);await failedContext.close();
 await writeFile(out+'/inspection.json',JSON.stringify({versions,errors,checks:{inPlaceImpressionSwitch:true,progressPreserved:true,hashesBoundToVariant:true,returnToPreviousIsStable:true,allRequestsLocalGet:true,fontFailurePreservesTranscript:true},environment:'402x874 DPR3 Chromium software WebGL, not physical iPhone/Safari performance'},null,2));console.log(JSON.stringify({versions:versions.map(x=>({variant:x.state.layout.sealVariant,layout:x.state.layout})),errors}));
}finally{await browser.close();await new Promise(r=>server.close(r));}

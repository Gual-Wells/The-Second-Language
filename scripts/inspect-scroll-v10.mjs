import {mkdir,writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {createServer} from './serve-scroll-lab.mjs';
const {chromium}=await import(pathToFileURL('D:/CodexStorage/workspaces/second-language-maintenance/.cache/browser-tools/package/index.mjs'));
const out='research/scroll-lab-v10';await mkdir(out,{recursive:true});await mkdir('.cache/scroll-v10/temp',{recursive:true});process.env.TEMP=process.env.TMP=process.cwd()+'/.cache/scroll-v10/temp';
const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));const base=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader','--no-first-run']});
try{
 const context=await browser.newContext({viewport:{width:402,height:874},isMobile:true,hasTouch:true,deviceScaleFactor:3,serviceWorkers:'block'}),page=await context.newPage(),errors=[],requests=[];
 page.on('pageerror',e=>{errors.push(e.message);console.log(e.message);});page.on('console',m=>{if(m.type()==='error'){errors.push(m.text());console.log(m.text());}});page.on('request',r=>requests.push({url:r.url(),method:r.method()}));
 await page.goto(base+'/labs/chapter-scroll-v10/');await page.waitForFunction(()=>window.scrollSpecimen?.snapshot().ready);
 await page.evaluate(()=>{scrollSpecimen.atmosphere(false);scrollSpecimen.setProgress(1);});
 await page.screenshot({path:out+'/open-iphone.png',scale:'css'});
 for(const [file,fn]of [['document.png','exportDocument'],['seal-master.png','exportSeal'],['seal-height.png','exportSealHeight']]){const data=await page.evaluate(fn=>scrollSpecimen[fn](),fn);await writeFile(out+'/'+file,Buffer.from(data.split(',')[1],'base64'));}
 const crops=await page.evaluate(async()=>{
  const im=new Image();im.src=scrollSpecimen.exportDocument();await im.decode();
  const crop=Object.assign(document.createElement('canvas'),{width:800,height:800}),q=crop.getContext('2d');q.drawImage(im,774,2250,500,500,0,0,800,800);
  const rendered=new Image();rendered.src=scrollSpecimen.exportObject();await rendered.decode();
  return {detail:crop.toDataURL('image/png'),object:rendered.src};
 });await writeFile(out+'/seal-on-parchment.png',Buffer.from(crops.detail.split(',')[1],'base64'));await writeFile(out+'/open-native.png',Buffer.from(crops.object.split(',')[1],'base64'));
 const checks=await page.evaluate(async()=>{
  const {makeSeal}=await import('./seal.js'),seed=parseInt('7da71575',16),a=makeSeal(seed),b=makeSeal(seed);
  const read=c=>c.getContext('2d',{willReadFrequently:true}).getImageData(0,0,c.width,c.height).data;
  const aa=read(a.ink),bb=read(b.ink),mm=read(a.mask);let same=true,pinholes=0,total=0,partial=0,surplusPixels=0,dark=0,marked=0;
  for(let i=3;i<aa.length;i+=4){same&&=aa[i]===bb[i];if(mm[i]>240){total++;if(aa[i]<100)pinholes++;if(aa[i]<190)partial++;if(aa[i]>230){dark+=(aa[i-3]+aa[i-2]+aa[i-1])/3;marked++;}}const n=(i-3)/4,x=n%a.mask.width,y=Math.floor(n/a.mask.width);if(Math.hypot(x-448,y-448)>369&&aa[i]>40)surplusPixels++;}
  const before=a.ink.toDataURL();makeSeal(seed+1);const fixedMaster=before===a.ink.toDataURL();
  const {assertCharter,charterCopy}=await import('./charter.js'),record=await(await fetch('chapter-sample.json')).json();let blocked=false;try{assertCharter({...record,status:'issued'});}catch{blocked=true;}
  return {same,seedIsolated:fixedMaster,pinholes,partial,total,surplusPixels,denseInkMeanRGB:dark/marked,issuedWithoutEventBlocked:blocked,proofHasUnissuedLabel:charterCopy(record).note==='Specimen — Not issued',stats:a.stats};
 });console.log(JSON.stringify(checks));assert.ok(checks.same&&checks.seedIsolated&&checks.partial>0&&checks.pinholes>0&&checks.surplusPixels>200&&checks.denseInkMeanRGB<25&&checks.issuedWithoutEventBlocked&&checks.proofHasUnissuedLabel);
 const state=await page.evaluate(()=>scrollSpecimen.snapshot());assert.equal(state.layout.sealVersion,'SL-CHAPTER-4');assert.deepEqual(state.layout.printedFonts,['Aboensis']);assert.equal(state.progress,1);assert.ok(!state.issued);
 await page.locator('#detail').click();assert.ok(await page.locator('#detailImage').isVisible());await page.locator('#detailZoom').click();assert.ok(await page.locator('.scroll-document-detail').evaluate(e=>e.scrollWidth>e.clientWidth));await page.screenshot({path:out+'/detail-iphone.png',scale:'css'});
 assert.ok(requests.every(r=>r.url.startsWith(base)&&r.method==='GET'));assert.deepEqual(errors,[]);
 await writeFile(out+'/inspection.json',JSON.stringify({checks,state,errors,environment:'402x874 mobile emulation, DPR3 software WebGL, not physical iPhone/Safari performance',limits:'ink/pressure fields are art-directed; no physical chemistry claim; unissued specimen only'},null,2));console.log(JSON.stringify({checks,errors,layout:state.layout}));
}finally{await browser.close();await new Promise(r=>server.close(r));}

import {mkdir,writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {createServer} from './serve-scroll-lab.mjs';
const {chromium}=await import(pathToFileURL('D:/CodexStorage/workspaces/second-language-maintenance/.cache/browser-tools/package/index.mjs'));
const out='research/scroll-lab-v11';await mkdir(out,{recursive:true});await mkdir('.cache/scroll-v11/temp',{recursive:true});process.env.TEMP=process.env.TMP=process.cwd()+'/.cache/scroll-v11/temp';
const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));const base=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader','--no-first-run']});
try{
 const context=await browser.newContext({viewport:{width:402,height:874},isMobile:true,hasTouch:true,deviceScaleFactor:3,serviceWorkers:'block'}),page=await context.newPage(),errors=[],requests=[];
 page.on('pageerror',e=>{errors.push(e.message);console.log(e.message);});page.on('console',m=>{if(m.type()==='error'){errors.push(m.text());console.log(m.text());}});page.on('request',r=>requests.push({url:r.url(),method:r.method()}));
 await page.goto(base+'/labs/chapter-scroll-v11/');await page.waitForFunction(()=>window.scrollSpecimen?.snapshot().ready,null,{timeout:45000});
 await page.evaluate(()=>{scrollSpecimen.atmosphere(false);scrollSpecimen.setProgress(1);});
 await page.screenshot({path:out+'/open-iphone.png',scale:'css'});
 for(const [file,fn]of [['document.png','exportDocument'],['seal-master.png','exportSeal'],['seal-height.png','exportSealHeight'],['open-native.png','exportObject']]){const data=await page.evaluate(fn=>scrollSpecimen[fn](),fn);await writeFile(out+'/'+file,Buffer.from(data.split(',')[1],'base64'));}
 const record=await page.evaluate(()=>scrollSpecimen.exportRecord());assert.equal(createHash('sha256').update(record.canonicalPayload).digest('hex'),record.sha256);await writeFile(out+'/proof-record.json',JSON.stringify(record,null,2));
 const checks=await page.evaluate(async()=>{
  const {prepareCharter,digestPayload,assertCharter,charterCopy,identityLines}=await import('./charter.js'),r=await(await fetch('chapter-sample.json')).json(),a=await prepareCharter(r),b=await prepareCharter(JSON.parse(JSON.stringify(r))),{makeSeal}=await import('./seal.js');
  let blocked=0;for(const bad of [{...r,status:'issued'},{...r,attestation:{}},{...r,proof:{sampleTime:'2026-02-30T00:00:00.000Z'}},{...r,proof:{sampleTime:'2026-10-17T00:00:00.000+25:00'}}]){try{assertCharter(bad);}catch{blocked++;}}
  const changed=await prepareCharter({...r,displayTitle:r.displayTitle+' — revised'}),when=await prepareCharter({...r,proof:{sampleTime:'2026-10-18T00:05:59.136+08:00'}}),equivalent=await prepareCharter({...r,proof:{sampleTime:'2026-10-17T16:05:59.135Z'}});
  const {createDocument,loadImage}=await import('./document.js'),{getTemplate}=await import('./templates.js'),template=getTemplate(r.template),[skin,back]=await Promise.all([template.skin,template.reverse].map(loadImage));
  const long=await prepareCharter({...r,displayTitle:'An Account of Diligent Study and Clear Understanding'}),longLayout=createDocument(long,skin,back,template).layout;
  const seal=makeSeal(1234),again=makeSeal(1234),other=makeSeal(4321),ink=seal.ink.getContext('2d').getImageData(0,0,896,896).data,mask=seal.mask.getContext('2d').getImageData(0,0,896,896).data;
  let surplus=0,dark=0,count=0;for(let i=0;i<ink.length;i+=4){if(ink[i+3]>200){dark+=(ink[i]+ink[i+1]+ink[i+2])/3;count++;}if(!mask[i+3]&&ink[i+3]>90)surplus++;}
  return {blocked,deterministic:a.artifactDigest===b.artifactDigest,contentBound:a.artifactDigest!==changed.artifactDigest,timeBound:a.artifactDigest!==when.artifactDigest,equivalentInstant:a.artifactDigest===equivalent.artifactDigest,sealStable:seal.ink.toDataURL()===again.ink.toDataURL(),differentImpressions:seal.ink.toDataURL()!==other.ink.toDataURL(),longTitleLines:longLayout.titleLines,longTitleBottom:longLayout.lastInkBottom,surplus,denseInkMeanRGB:dark/count,identity:identityLines(a),copy:charterCopy(a),payload:digestPayload(a)};
 });
 assert.equal(checks.blocked,4);for(const key of ['deterministic','contentBound','timeBound','equivalentInstant','sealStable','differentImpressions'])assert.equal(checks[key],true,key);assert.ok(checks.surplus>100&&checks.denseInkMeanRGB<25);assert.equal(checks.longTitleLines,2);assert.ok(checks.longTitleBottom<=2215);
 const state=await page.evaluate(()=>scrollSpecimen.snapshot());assert.equal(state.layout.sealVersion,'SL-TEXT-SQUARE-1');assert.equal(state.layout.recipient,'Gual Wells');assert.deepEqual(state.layout.printedFonts,['Aboensis']);assert.ok(!state.issued);assert.ok(state.layout.lastInkBottom<2230);
 await page.locator('#detail').click();assert.ok(await page.locator('#detailImage').isVisible());await page.locator('#detailZoom').click();assert.ok(await page.locator('.scroll-document-detail').evaluate(e=>e.scrollWidth>e.clientWidth));await page.screenshot({path:out+'/detail-iphone.png',scale:'css'});
 assert.ok(requests.every(r=>r.url.startsWith(base)&&r.method==='GET'));assert.deepEqual(errors,[]);
 await writeFile(out+'/inspection.json',JSON.stringify({checks,state,errors,environment:'402x874 mobile emulation, DPR3 software WebGL; not physical iPhone/Safari performance',limits:'unissued dated proof, no actual passing event or production certification; short digest is an identifier, not an authentication credential'},null,2));console.log(JSON.stringify({checks,layout:state.layout,errors}));
}finally{await browser.close();await new Promise(r=>server.close(r));}

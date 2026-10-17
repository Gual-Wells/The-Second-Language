import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const {chromium}=await import(pathToFileURL('D:/CodexStorage/workspaces/second-language-maintenance/.cache/browser-tools/package/index.mjs'));
const base=process.argv[2];if(!/^https:\/\/[a-f0-9]+\.the-second-language\.pages\.dev$/.test(base??''))throw Error('Supply immutable Pages preview URL');
const out='research/scroll-lab-v11';await mkdir(out,{recursive:true});process.env.TEMP=process.env.TMP=process.cwd()+'/.cache/scroll-v11/temp';
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',proxy:{server:'http://127.0.0.1:6987'},args:['--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader','--no-first-run']});
try{
 const context=await browser.newContext({viewport:{width:402,height:874},deviceScaleFactor:2,isMobile:true,hasTouch:true}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'/labs/chapter-scroll-v11/');await page.waitForFunction(()=>window.scrollSpecimen?.snapshot().ready,null,{timeout:45000});
 const initial=await page.evaluate(()=>scrollSpecimen.snapshot());await page.evaluate(()=>scrollSpecimen.atmosphere(false));
 await page.locator('#toggle').tap();await page.waitForFunction(()=>scrollSpecimen.snapshot().progress===1&&!scrollSpecimen.snapshot().animating,null,{timeout:45000});
 await page.screenshot({path:out+'/live-open-iphone.png',scale:'css'});const state=await page.evaluate(()=>scrollSpecimen.snapshot());assert.equal(state.layout.sealVersion,'SL-TEXT-SQUARE-1');assert.equal(state.layout.recipient,'Gual Wells');assert.equal(state.issued,false);
 await page.locator('#detail').tap();await page.locator('details').filter({has:page.locator('#proofIdentity')}).locator('summary').tap();assert.match(await page.locator('#proofIdentity').textContent(),/Gual Wells[\s\S]*d5ddb985ef45f62a/);assert.ok(await page.locator('.scroll-specimen-note').isVisible());assert.match(await page.locator('.scroll-specimen-note').textContent(),/并非认证通过时间/);await page.locator('button[aria-label="关闭"]').tap();
 await page.locator('#toggle').tap();await page.waitForFunction(()=>scrollSpecimen.snapshot().progress===0&&!scrollSpecimen.snapshot().animating,null,{timeout:45000});
 await page.screenshot({path:out+'/live-closed-iphone.png',scale:'css'});
 const assets=[];for(const path of ['/owner-identity.js','/labs/chapter-scroll-v11/charter.js','/labs/chapter-scroll-v11/seal.js','/labs/chapter-scroll-v8/keeper.js','/labs/chapter-scroll-v10/','/labs/chapter-scroll-v6/','/labs/chapter-scroll/assets/Aboensis-Regular.otf','/api/session','/api/practice']){const r=await context.request.get(base+path);assets.push({path,status:r.status(),type:r.headers()['content-type']});assert.equal(r.status(),path==='/api/practice'?401:200);}
 assert.deepEqual(errors,[]);await writeFile(out+'/deployment.json',JSON.stringify({immutable:base+'/labs/chapter-scroll-v11/',alias:'https://scroll-lab.the-second-language.pages.dev/labs/chapter-scroll-v11/',verifiedAt:new Date().toISOString(),state,initialMist:initial.mist,assets,errors,touchOpenClose:true,environment:'402x874 DPR2 Chromium software WebGL; not physical iPhone/Safari performance',newPaidCalls:0,newImageGenerations:0},null,2));
 const files=['web/owner-identity.js','web/labs/chapter-scroll-v11/charter.js','web/labs/chapter-scroll-v11/document.js','web/labs/chapter-scroll-v11/seal.js','web/labs/chapter-scroll-v11/templates.js','web/labs/chapter-scroll-v11/chapter-sample.json','web/labs/chapter-scroll/assets/Aboensis-Regular.otf','web/labs/chapter-scroll-v6/assets/charter.webp','web/labs/chapter-scroll-v10/assets/ink-shoulder.png','research/scroll-lab-v11/document.png','research/scroll-lab-v11/proof-record.json'];
 const hashes=[];for(const path of files){const bytes=await readFile(path);hashes.push({path,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});}await writeFile(out+'/asset-manifest.json',JSON.stringify({edition:'SL-CHARTER-11',hashes},null,2));console.log(JSON.stringify({ready:state.ready,recipient:state.layout.recipient,hash:state.layout.identity[0],touchOpenClose:true,errors,assets}));
}finally{await browser.close();}

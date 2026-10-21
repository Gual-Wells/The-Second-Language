import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL('D:/CodexStorage/workspaces/second-language-maintenance/.cache/browser-tools/package/index.mjs'));
const out='research/certification-reader-2026-10-21',cache='.cache/certification-reader';await mkdir(out,{recursive:true});await mkdir(cache+'/tmp',{recursive:true});process.env.TEMP=process.env.TMP=process.cwd()+'/'+cache+'/tmp';
const args=process.argv.slice(2),chapterSpecimensOnly=args.includes('--chapter-specimens-only');
if(args.some(arg=>arg.startsWith('--')&&arg!=='--chapter-specimens-only'))throw Error('Usage: node scripts/verify-certification-reader.mjs [base URL] [--chapter-specimens-only]');
const base=args.find(arg=>!arg.startsWith('--'))||'http://127.0.0.1:8153',remote=base.startsWith('https:');
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',...(remote?{proxy:{server:'http://127.0.0.1:6987'}}:{}),args:['--no-first-run']});
const errors=[],missing=[],writes=[],resources=[];
try{
 const context=await browser.newContext({viewport:{width:402,height:874},deviceScaleFactor:2,isMobile:true,hasTouch:true,serviceWorkers:'block'}),page=await context.newPage();
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')console.log(m.text().slice(0,300));});page.on('request',r=>{resources.push(r.url());if(!['GET','HEAD'].includes(r.method()))writes.push(r.url());});page.on('response',r=>{if(r.status()>=400&&!new URL(r.url()).pathname.startsWith('/api/'))missing.push({url:r.url(),status:r.status()});});
 // Empty demo session exercises the actual main app and settings, with no real
 // score, award, new chapter or account mutation created by this test.
 await page.route('**/api/**',route=>{const path=new URL(route.request().url()).pathname;return route.fulfill({json:path==='/api/session'?{authenticated:true,demo:true}:path==='/api/chapters'?{chapters:[]}:{}});});
 await page.goto(base+'/');await page.locator('#certificationReaderButton').waitFor({state:'attached'});
 await page.locator('#settingsButton').tap();await page.locator('#certificationReaderButton').tap();
 const chapterLabels=await page.locator('#certificationChapters button').allTextContents();assert.deepEqual(chapterLabels,chapterSpecimensOnly?['第一章','第五章']:['项目纪念','第一章','第五章']);
 assert.equal(await page.locator('#certificationChapters [data-work]').count(),chapterSpecimensOnly?0:1);
 assert.equal(await page.locator('[data-work="project-beginning"]').count(),chapterSpecimensOnly?0:1);
 assert.equal(await page.locator('[data-work="project-returning-thread"]').count(),0);
 assert.equal(await page.locator('dialog[open]').count(),1);assert.ok(!resources.some(p=>/reader\.bundle|\.glb|\.mp3|\.wav|\.hdr/.test(p)),'List must not prepare heavy display resources');
 await page.screenshot({path:out+'/chapter-list.png',scale:'css'});
 async function waitReady(){await page.waitForFunction(()=>certificationReader.snapshot().ready||!document.getElementById('certificationRetry').hidden,null,{timeout:120000});assert.equal((await page.evaluate(()=>certificationReader.snapshot())).ready,true,await page.locator('#certificationStatus').textContent());}
 await page.locator('[data-chapter="5"]').tap();await waitReady();
 const fifth=await page.evaluate(()=>certificationReader.exportRecord());assert.equal(fifth.sha256,'a2a75215f25dc0fc40f047fd6f6648a4625ae13be7b3fa2ffca5fe72e37f43a0');assert.equal(fifth.status,'specimen');
 assert.equal(await page.locator('dialog[open]').count(),1);assert.equal((await page.evaluate(()=>certificationReader.snapshot())).sound.contextState,'not-created');
 await page.screenshot({path:out+'/fifth-closed.png',scale:'css'});
 await page.locator('#certificationSound').tap();await page.locator('#certificationMusic').check();await page.locator('#certificationFoley').check();
 await page.waitForFunction(()=>certificationReader.snapshot().sound.musicState==='playing',null,{timeout:30000});
 await page.locator('#certificationMusicVolume').evaluate(e=>{e.value=27;e.dispatchEvent(new Event('input',{bubbles:true}));});assert.equal((await page.evaluate(()=>certificationReader.snapshot())).sound.musicVolume,.27);
 await page.locator('#certificationSoundClose').tap();
 const before=await page.evaluate(()=>certificationReader.snapshot().sound.musicPosition);
 await page.locator('#certificationCanvas').tap({position:{x:201,y:430}});await page.waitForFunction(()=>certificationReader.snapshot().viewer.progress>.999&&!certificationReader.snapshot().viewer.animating,null,{timeout:60000});
 const opened=await page.evaluate(()=>certificationReader.snapshot());assert.ok(opened.sound.musicPosition>before,'Opening must not restart music');assert.ok(opened.sound.eventsPlayed>0);assert.deepEqual(opened.sound.failures,{});
 await page.waitForFunction(()=>!document.querySelector('#certificationStage').classList.contains('controls-visible'));assert.equal(await page.locator('#certificationHud').getAttribute('inert'),'');await page.waitForTimeout(400);
 await page.screenshot({path:out+'/fifth-open-pure.png',scale:'css'});
 // Reveal minimal controls without toggling the document via a keyboard move.
 await page.locator('#certificationCanvas').focus();await page.keyboard.press('ArrowRight');await page.locator('#certificationSound').tap();await page.locator('#certificationMusic').uncheck();
 await page.evaluate(()=>document.dispatchEvent(new Event('visibilitychange')));assert.equal((await page.evaluate(()=>certificationReader.snapshot())).sound.musicTrack,null);
 await page.locator('#certificationSoundClose').tap();await page.locator('#certificationBack').tap();await page.locator('#certificationCatalogue').waitFor({state:'visible'});
 assert.equal(await page.locator('dialog[open]').count(),1);assert.equal((await page.evaluate(()=>certificationReader.snapshot())).sound.active,false);
 await page.locator('[data-chapter="1"]').tap();await waitReady();
 const first=await page.evaluate(()=>certificationReader.exportRecord());assert.equal(first.sha256,'590cc91ffca8634b7864f24825afbfc3f5fb286de5321087edd2c336f74732ea');assert.equal(first.chapterNumber,1);assert.notEqual(first.sha256,fifth.sha256);
 await page.evaluate(()=>certificationReader.setProgress(1));await page.screenshot({path:out+'/first-open.png',scale:'css'});
 await page.setViewportSize({width:874,height:402});await page.waitForTimeout(250);const size=await page.locator('#certificationViewer').boundingBox();assert.ok(Math.abs(size.width-874)<2&&Math.abs(size.height-402)<2);await page.screenshot({path:out+'/landscape.png',scale:'css'});
 await page.keyboard.press('Escape');await page.locator('#certificationCatalogue').waitFor({state:'visible'});await page.locator('[data-close=certificationCatalogue]').tap();await page.locator('#settingsDialog').waitFor({state:'visible'});
 assert.equal(await page.locator('dialog[open]').count(),1);assert.equal((await page.evaluate(()=>certificationReader.snapshot())).sound.active,false);
 assert.ok(!resources.some(p=>/scroll-museum|scene-wood|ancient-mysteries|keeper-physical\.glb/.test(p)));assert.ok(resources.some(p=>p.includes('keeper-display.glb')));
 assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);assert.deepEqual(writes,[]);
 const result={base,checkedAt:new Date().toISOString(),mode:chapterSpecimensOnly?'chapter-specimens-only':'project-beginning-and-chapter-specimens',projectCatalogue:chapterSpecimensOnly?null:'project-beginning',session:'Browser-only mocked empty demo; real app and settings, existing first/fifth scroll specimens and recorded audio. The separate project-beginning interaction has its own report. No real account or score writes.',chapterLabels,first,fifth,opened,checks:{settingsEntry:true,actualWorkLabels:true,projectCatalogueMatchesMode:true,rejectedProjectAbsent:true,listLazy:true,pureScreen:true,actualDistinctArtifacts:true,physicalUnfastening:true,musicContinuesAcrossOpening:true,independentVolume:true,muteSurvivesResume:true,exitStopsSound:true,modalBackStack:true,portraitLandscape:true,noRoomAssets:true,noCertificationWrites:true},errors,missing,writes,resources,environment:'Chrome mobile simulation at 402x874/DPR2. Not a physical iPhone/Safari or artistic listening approval.'};
 await writeFile(out+(remote?'/live-verification.json':'/verification.json'),JSON.stringify(result,null,2));console.log(JSON.stringify({checks:result.checks,errors,missing,writes}));await context.close();
}catch(error){await writeFile(cache+'/failure.json',JSON.stringify({error:error.stack,errors,missing,writes},null,2));throw error;}finally{await browser.close();}

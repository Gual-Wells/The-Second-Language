import {mkdir,writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {createServer} from './serve-scroll-lab.mjs';
const out='research/scroll-keeper-integration-2026-10-19';await mkdir(out,{recursive:true});process.env.TEMP=process.env.TMP=process.cwd()+'/.cache/keeper-integration/tmp';
const {chromium}=await import(pathToFileURL('D:/CodexStorage/workspaces/second-language-maintenance/.cache/browser-tools/package/index.mjs'));
const remote=process.argv[2],server=remote?null:createServer();if(server)await new Promise(r=>server.listen(0,'127.0.0.1',r));const base=remote??`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',...(remote?{proxy:{server:'http://127.0.0.1:6987'}}:{}),args:['--no-first-run']});
try{
 const context=await browser.newContext({viewport:{width:402,height:874},deviceScaleFactor:3,isMobile:true,hasTouch:true,serviceWorkers:'block'}),page=await context.newPage(),errors=[],failed=[],states=[],contacts=[];
 page.on('pageerror',e=>{errors.push(e.message);console.log('PAGE ERROR',e.message);});page.on('console',m=>{if(m.type()==='error')console.log('CONSOLE',m.text().slice(0,500));});page.on('response',r=>{if(r.status()>=400)failed.push([r.status(),r.url()]);});
 await page.goto(base+'/labs/chapter-scroll-v16/');
 try{await page.waitForFunction(()=>window.scrollSpecimen?.snapshot().ready,null,{timeout:90000});}catch(e){await writeFile(out+'/load-failure.json',JSON.stringify({errors,failed,body:await page.locator('body').innerText()},null,2));throw e;}
 const save=async(name,data)=>writeFile(out+'/'+name,Buffer.from(data.split(',')[1],'base64'));
 await page.evaluate(()=>scrollSpecimen.atmosphere(false));
 await page.screenshot({path:out+'/closed-iphone.png',scale:'css'});
 await save('keeper-fit-detail.png',await page.evaluate(()=>scrollSpecimen.exportKeeper()));
 for(const p of [0,.03,.065,.105,.15,.20,.25,.30,.34,.5,1]){
  await page.evaluate(p=>scrollSpecimen.setProgress(p),p);states.push(await page.evaluate(()=>scrollSpecimen.snapshot()));
  await save(`pose-${String(p).replace('.','_')}.png`,await page.evaluate(()=>scrollSpecimen.exportObject()));
  if(p<=.25)await save(`keeper-${String(p).replace('.','_')}.png`,await page.evaluate(()=>scrollSpecimen.exportKeeper()));
 }
 await page.screenshot({path:out+'/open-iphone.png',scale:'css'});
 if(process.env.KEEPER_CONTACTS){for(const p of [0,.015,.03,.045,.06,.08,.10,.12,.15,.18,.20,.22,.235,.25,.28,.3]){await page.evaluate(p=>scrollSpecimen.setProgress(p),p);contacts.push({progress:p,...await page.evaluate(()=>scrollSpecimen.inspectKeeper())});}await writeFile('.cache/keeper-integration/contact-poses.json',JSON.stringify(contacts));}
 const report={url:remote||'local',states,record:await page.evaluate(()=>scrollSpecimen.exportRecord()),errors,failed,environment:'402x874 DPR3 Chromium; not physical iPhone Safari'};
 await writeFile(out+(remote?'/live-inspection.json':'/inspection.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({errors,failed,phases:states.map(s=>[s.progress,s.keeperPose.phase]),closed:states[0].keeperPose}));
 if(errors.length||failed.length)throw Error('Viewer errors');await context.close();
}finally{await browser.close();if(server)await new Promise(r=>server.close(r));}

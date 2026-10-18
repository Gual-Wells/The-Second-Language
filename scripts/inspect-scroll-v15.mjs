import {mkdir,writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {createServer} from './serve-scroll-lab.mjs';
const out='research/scroll-lab-v15';await mkdir(out,{recursive:true});await mkdir('.cache/scroll-v15/tmp',{recursive:true});process.env.TEMP=process.env.TMP=process.cwd()+'/.cache/scroll-v15/tmp';
const {chromium}=await import(pathToFileURL('D:/CodexStorage/workspaces/second-language-maintenance/.cache/browser-tools/package/index.mjs'));
const remote=process.argv[2],server=remote?null:createServer();if(server)await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin=remote??`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',...(remote?{proxy:{server:'http://127.0.0.1:6987'}}:{}),args:['--no-first-run']});
try{
 const page=await browser.newPage({viewport:{width:402,height:874},deviceScaleFactor:3,isMobile:true,hasTouch:true,serviceWorkers:'block'}),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')console.log('CONSOLE',m.text().slice(0,500));});
 await page.goto(origin+'/labs/chapter-scroll-v15/?open=1');await page.waitForFunction(()=>window.scrollSpecimen?.snapshot().ready,null,{timeout:90000});
 await page.waitForTimeout(1500);await page.screenshot({path:out+'/open-iphone.png',scale:'css'});
 const save=async(name,data)=>writeFile(out+'/'+name,Buffer.from(data.split(',')[1],'base64'));
 await save('document.png',await page.evaluate(()=>scrollSpecimen.exportDocument()));
 await save('keeper-detail.png',await page.evaluate(()=>scrollSpecimen.exportKeeper()));
 for(const angle of ['front','side'])await save(`keeper-${angle}.png`,await page.evaluate(angle=>scrollSpecimen.exportKeeper({angle}),angle));
 const initial=await page.evaluate(()=>scrollSpecimen.snapshot());
 await page.evaluate(()=>scrollSpecimen.atmosphere(false));
 for(const p of [0,.035,.07,.12,.20,.24,.45,.75,1]){
  await page.evaluate(p=>scrollSpecimen.setProgress(p),p);await save(`object-${String(p).replace('.','_')}.png`,await page.evaluate(()=>scrollSpecimen.exportObject()));
 }
 await page.evaluate(()=>{scrollSpecimen.setProgress(0);scrollSpecimen.atmosphere(true);scrollSpecimen.open();});
 await page.waitForFunction(()=>!scrollSpecimen.snapshot().animating&&scrollSpecimen.snapshot().progress===1,null,{timeout:90000});
 await page.screenshot({path:out+'/fog-after-opening.png',scale:'css'});
 await page.evaluate(()=>scrollSpecimen.close());await page.waitForFunction(()=>!scrollSpecimen.snapshot().animating&&scrollSpecimen.snapshot().progress===0,null,{timeout:90000});
 await page.screenshot({path:out+'/closed-iphone.png',scale:'css'});
 const result={initial,final:await page.evaluate(()=>scrollSpecimen.snapshot()),record:await page.evaluate(()=>scrollSpecimen.exportRecord()),errors,environment:'402x874 DPR3 Chromium / local GPU; not a physical iPhone'};
 await writeFile(out+(remote?'/live-inspection.json':'/inspection.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
}finally{await browser.close();if(server)await new Promise(r=>server.close(r));}

import {mkdir,writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {createServer} from './serve-scroll-lab.mjs';
const out='research/scroll-aging-v19-2026-10-20';await mkdir(out,{recursive:true});
process.env.TEMP=process.env.TMP=process.cwd()+'/.cache/keeper-v19/tmp';await mkdir(process.env.TEMP,{recursive:true});
const {chromium}=await import(pathToFileURL('D:/CodexStorage/workspaces/second-language-maintenance/.cache/browser-tools/package/index.mjs'));
const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--no-first-run']});
try{
 const page=await browser.newPage({viewport:{width:402,height:874},deviceScaleFactor:3,isMobile:true,hasTouch:true,serviceWorkers:'block'}),errors=[],states=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text().slice(0,1500));});
 const save=async(name,uri)=>writeFile(out+'/'+name,Buffer.from(uri.split(',')[1],'base64'));
 for(const version of [18,19]){
  await page.goto(`http://127.0.0.1:${server.address().port}/labs/chapter-scroll-v${version}/`);
  try{await page.waitForFunction(()=>window.scrollSpecimen?.snapshot().ready,null,{timeout:45000});}catch(e){console.log(JSON.stringify({errors,body:await page.locator('body').innerText()}));throw e;}
  await page.evaluate(()=>scrollSpecimen.atmosphere(false));
  await save(`v${version}-keeper.png`,await page.evaluate(()=>scrollSpecimen.exportKeeper()));
  await page.screenshot({path:out+`/v${version}-closed.png`,scale:'css'});
  if(version===19){
   for(const p of [.08,.17,.28]){await page.evaluate(p=>scrollSpecimen.setProgress(p),p);await save(`v19-keeper-${p}.png`,await page.evaluate(()=>scrollSpecimen.exportKeeper()));}
   await page.evaluate(()=>scrollSpecimen.setProgress(1));await page.screenshot({path:out+'/v19-open.png',scale:'css'});
  }
  states.push(await page.evaluate(()=>scrollSpecimen.snapshot()));
 }
 await writeFile(out+'/inspection.json',JSON.stringify({states,errors,environment:'402x874 DPR3 Chromium on PC, not physical Safari'},null,2));
 console.log(JSON.stringify({errors,material:states[1].aging}));if(errors.length)throw Error('Render errors');
}finally{await browser.close();await new Promise(r=>server.close(r));}


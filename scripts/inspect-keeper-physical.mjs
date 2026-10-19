import {createServer} from './serve-scroll-lab.mjs';
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const out=path.resolve('research/scroll-keeper-physical-2026-10-19/browser');await mkdir(out,{recursive:true});
process.env.TEMP=process.env.TMP=path.resolve('.cache/keeper-physical/tmp');await mkdir(process.env.TEMP,{recursive:true});
const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));
const {chromium}=await import(pathToFileURL('D:/CodexStorage/workspaces/second-language-maintenance/.cache/browser-tools/package/index.mjs'));
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--no-first-run']});
try{
 const page=await browser.newPage({viewport:{width:402,height:874},deviceScaleFactor:2}),errors=[],failed=[],states=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failed.push({url:r.url(),status:r.status()});});
 await page.goto(process.env.KEEPER_REVIEW_URL||`http://127.0.0.1:${server.address().port}/labs/keeper-physical-assembly/`);
 await page.waitForFunction(()=>window.keeperPhysical?.snapshot().ready,{},{timeout:60000});
 for(const view of ['front','top','inside','flat','parts','front']){
  await page.locator(`[data-view="${view}"]`).click();await page.waitForTimeout(350);
  const state=await page.evaluate(()=>window.keeperPhysical.snapshot());states.push(state);
  if(state.current!==view||state.morph!==(view==='flat'?1:0))throw Error('Incorrect assembly state');
  await page.screenshot({path:path.join(out,`${view}.png`),scale:'css'});
 }
 await page.locator('#clay').click();await page.waitForTimeout(200);await page.screenshot({path:path.join(out,'clay.png'),scale:'css'});
 await page.locator('#clay').click();await page.setViewportSize({width:1100,height:900});await page.waitForTimeout(200);await page.screenshot({path:path.join(out,'desktop.png'),scale:'css'});
 const report={viewport:'402x874 Chromium + 1100x900; not real iPhone Safari',states,errors,failed};
 await writeFile(path.join(out,'inspection.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
 if(errors.length||failed.length)throw Error('Viewer failures');
}finally{await browser.close();await new Promise(r=>server.close(r));}

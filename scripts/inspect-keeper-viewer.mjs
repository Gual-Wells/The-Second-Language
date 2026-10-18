import {createServer} from './serve-scroll-lab.mjs';
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const out=path.resolve('research/scroll-keeper-kaggle-v2/browser');await mkdir(out,{recursive:true});
process.env.TEMP=process.env.TMP=path.resolve('.cache/scroll-keeper-kaggle/tmp');
const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));
const {chromium}=await import(pathToFileURL('D:/CodexStorage/workspaces/second-language-maintenance/.cache/browser-tools/package/index.mjs'));
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--no-first-run']});
try{
 const page=await browser.newPage({viewport:{width:402,height:874},deviceScaleFactor:2}),errors=[],failed=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failed.push({url:r.url(),status:r.status()});});
 await page.goto(`http://127.0.0.1:${server.address().port}/labs/keeper-asset-study/`);
 await page.waitForFunction(()=>window.keeperAssetStudy?.snapshot().ready,{},{timeout:60000});
 for(const name of ['front','quarter','side','back']){
  await page.locator(`[data-view="${name}"]`).click();await page.waitForTimeout(350);
  await page.screenshot({path:path.join(out,`pbr-${name}.png`),scale:'css'});
 }
 await page.locator('[data-view="front"]').click();await page.locator('#clay').click();await page.waitForTimeout(350);
 await page.screenshot({path:path.join(out,'clay-front.png'),scale:'css'});
 const report={viewport:'402x874 Chromium; not iPhone Safari',state:await page.evaluate(()=>window.keeperAssetStudy.snapshot()),errors,failed};
 await writeFile(path.join(out,'inspection.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
 if(errors.length||failed.length)throw Error('Viewer failures');
}finally{await browser.close();await new Promise(r=>server.close(r));}

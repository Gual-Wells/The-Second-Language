import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/huawei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(import.meta.dirname,'..'),output=path.join(root,'.cache/museum-scene-preview');
await fs.mkdir(path.join(output,'tmp'),{recursive:true});process.env.TEMP=process.env.TMP=path.join(output,'tmp');
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--no-first-run']});
try{
 const page=await browser.newPage({viewport:{width:402,height:740},deviceScaleFactor:2});
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
 await page.goto('http://127.0.0.1:8149/labs/scroll-museum-v1/scene.js');
 await page.evaluate(async()=>{
  document.body.innerHTML='<canvas id="museum"></canvas>';document.body.style.cssText='margin:0;background:#171814';document.querySelector('canvas').style.cssText='width:402px;height:740px;display:block';
  const imports=document.createElement('script');imports.type='importmap';imports.textContent=JSON.stringify({imports:{three:'/labs/certification/vendor/three.module.js'}});document.head.append(imports);
  const {MuseumScene}=await import('/labs/scroll-museum-v1/scene.js');
  window.museum=new MuseumScene(document.querySelector('canvas'));
  window.museum.resize(402,740);await window.museum.prepare([{id:'specimen-chapter-five',chapterNumber:5,title:'河谷里未说完的话',artTitle:'Words Unfinished in the Valley',paperTint:0xb7a078,issued:false}]);window.museum.focus('specimen-chapter-five');window.museum.render();
 });
 await page.screenshot({path:path.join(output,'browse.png')});
 const states=[];
 for(const p of [.15,.4,.7,1]){
  const state=await page.evaluate(p=>{window.museum.setStage('retrieve',p);window.museum.render();return window.museum.snapshot();},p);states.push(state);
  await page.screenshot({path:path.join(output,`retrieve-${Math.round(p*100)}.png`)});
 }
 await fs.writeFile(path.join(output,'check.json'),JSON.stringify({errors,states},null,2));
 console.log(JSON.stringify({output,errors,last:states.at(-1)},null,2));
}finally{await browser.close();}

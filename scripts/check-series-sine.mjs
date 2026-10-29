// Inspect both real headers with their native styles. No network or provider calls.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(process.execPath),{chromium,webkit}=require('playwright'),sharp=require('sharp');
const root=await fs.realpath(process.cwd()),out=path.join(root,'.cache/series-sine');
await fs.mkdir(out+'/tmp',{recursive:true});process.env.TEMP=process.env.TMP=out+'/tmp';
const roots=[['language',root],['algorithm',process.env.SECOND_ALGORITHM_ROOT||path.resolve(root,'../the-second-algorithm')]],reports=[],strips=[];
for(const engine of ['chromium','webkit']){
 const browser=await(engine==='chromium'?chromium.launch({headless:true,executablePath:process.env.BROWSER_EXECUTABLE||'C:/Users/huawei/AppData/Local/ms-playwright/chromium-1223/chrome-win64/chrome.exe'}):webkit.launch({headless:true}));
 try{await Promise.all(roots.map(async([project,source])=>{
  const html=await fs.readFile(source+'/web/index.html','utf8'),css=await fs.readFile(source+'/web/styles.css','utf8'),header=html.match(/<header\b[\s\S]*?<\/header>/)[0];
  const context=await browser.newContext({viewport:{width:402,height:874},reducedMotion:'no-preference',serviceWorkers:'block'});await context.route('**/*',r=>r.abort());const page=await context.newPage();
  await page.setContent(`<!doctype html><meta charset="utf-8"><style>${css}</style><main class="app-shell">${header}</main>`);await page.locator('#headerActions').evaluate(e=>e.hidden=false).catch(()=>{});
  const samples=[];for(let i=0;i<42;i++){await page.waitForTimeout(250);samples.push(await page.locator('.header-logo-ink').evaluate(e=>new Promise(resolve=>requestAnimationFrame(()=>resolve({time:e.getAnimations()[0].currentTime,ink:Number(getComputedStyle(e).opacity),reflection:Number(getComputedStyle(e.querySelector('.header-logo-reflection')).opacity)})))));}
  assert(samples.at(-1).time-samples[0].time>9600);
  for(const s of samples){const wave=Math.sin(s.time/4800*2*Math.PI);assert(Math.abs(s.ink-(1+Math.min(0,wave)))<.003,JSON.stringify({engine,project,s,wave}));assert(Math.abs(s.reflection-Math.max(0,wave))<.003,JSON.stringify({engine,project,s,wave}));}
  assert(Math.min(...samples.map(s=>s.ink))<.025&&Math.max(...samples.map(s=>s.reflection))>.975);
  const extrema=[];
  for(const[time,label]of[[0,'ice'],[1200,'white'],[2400,'ice-return'],[3600,'background'],[4800,'ice-wrap']]){
   await page.locator('.header-logo-ink').evaluate((e,time)=>{const a=e.getAnimations()[0];for(const a of [e.getAnimations()[0],e.querySelector('.header-logo-reflection').getAnimations()[0]]){a.pause();a.currentTime=time;}},time);await page.waitForTimeout(35);
   const state=await page.locator('.header-logo-ink').evaluate(e=>({ink:Number(getComputedStyle(e).opacity),reflection:Number(getComputedStyle(e.querySelector('.header-logo-reflection')).opacity)}));
   const shot=await page.locator('.app-header').screenshot({animations:'allow',scale:'css'});await fs.writeFile(out+`/${engine}-${project}-${label}.png`,shot);extrema.push({time,label,...state});
   if(engine==='chromium'&&[0,1200,3600].includes(time))strips.push({project,time,shot});
  }
  assert.equal(extrema[1].reflection,1);assert.equal(extrema[3].ink,0);
  const seams=await page.locator('.header-logo-ink').evaluate(async e=>{const a=e.getAnimations()[0],samples=[];for(const t of[4798,4799,4800,4801,4802]){a.currentTime=t;e.querySelector('.header-logo-reflection').getAnimations()[0].currentTime=t;await new Promise(r=>requestAnimationFrame(r));samples.push({time:t,ink:Number(getComputedStyle(e).opacity),reflection:Number(getComputedStyle(e.querySelector('.header-logo-reflection')).opacity)})}return samples;});
  assert(seams.every(s=>Math.abs(s.ink-1)<.003&&s.reflection<.003));
  reports.push({project,engine,naturalDurationMs:samples.at(-1).time-samples[0].time,samples,extrema,seams});await context.close();
 }));}finally{await browser.close();}
}
const ordered=strips.sort((a,b)=>a.project.localeCompare(b.project)||a.time-b.time),metadata=await sharp(ordered[0].shot).metadata();
await sharp({create:{width:402,height:metadata.height*ordered.length,channels:3,background:'#e8eef5'}}).composite(ordered.map((s,i)=>({input:s.shot,left:0,top:i*metadata.height}))).png().toFile(out+'/headers.png');
await fs.writeFile(out+'/results.json',JSON.stringify({passed:true,periodMs:4800,positiveHalfMs:2400,negativeHalfMs:2400,mapping:{zero:'#cfe8ff',positivePeak:'#fff',negativePeak:'actual header gradient through transparent ink'},reports,liveRequests:0,paidCalls:0,physicalIPhone:false},null,2));
console.log(JSON.stringify({passed:true,engines:2,headers:2,naturalLoops:2,liveRequests:0,paidCalls:0}));

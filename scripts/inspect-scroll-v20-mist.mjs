import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {createServer} from './serve-scroll-lab.mjs';
const out='research/scroll-mist-v20-2026-10-20';
await mkdir(out,{recursive:true});await mkdir('.cache/scroll-v20/video',{recursive:true});
process.env.TEMP=process.env.TMP=process.cwd()+'/.cache/scroll-v20/tmp';
const {chromium}=await import(pathToFileURL('D:/CodexStorage/workspaces/second-language-maintenance/.cache/browser-tools/package/index.mjs'));
const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));
const origin=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try{
 const context=await browser.newContext({viewport:{width:1080,height:680},deviceScaleFactor:1,recordVideo:{dir:'.cache/scroll-v20/video',size:{width:1080,height:680}}});
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/mist-study',r=>r.fulfill({contentType:'text/html',body:`<!doctype html><meta charset="utf-8"><style>body{margin:0;background:#152026;color:#e4e6dc;font:16px system-ui}main{display:flex;gap:12px;padding:12px}section{width:344px}canvas{display:block;width:344px;height:580px;background:radial-gradient(ellipse at 42% 40%,#3f3a31,#242a2c 48%,#111b21)}h2{font-size:16px;font-weight:500}p{margin:0 12px}</style><main><section><h2>v19 · 当前雾场</h2><canvas id="old"></canvas></section><section><h2>v20 · 新雾场与开合响应</h2><canvas id="new"></canvas></section><section><h2>v20 · 同一雾场，关闭动作耦合</h2><canvas id="control"></canvas></section></main><p id="phase"></p>`}));
 await page.goto(origin+'/mist-study');
 await page.evaluate(async origin=>{
  const[{Atmosphere:Old},{Atmosphere:New}]=await Promise.all([import(origin+'/labs/chapter-scroll-v17/mist.js'),import(origin+'/labs/chapter-scroll-v20/mist.js')]);
  window.fields=[new Old(document.querySelector('#old')),new New(document.querySelector('#new')),new New(document.querySelector('#control'),{interactionGain:0})];
  for(const f of fields)await f.prepare();
  window.records=[];window.differences=[];
  window.capture=()=>fields.map(f=>{const c=document.createElement('canvas');c.width=f.canvas.width;c.height=f.canvas.height;const ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(f.canvas,0,0);return ctx.getImageData(0,0,c.width,c.height).data;});
  window.advance=n=>{
   for(let i=0;i<n;i++){
    const t=window.frame++/30;
    const smooth=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
    const progress=t<6?0:t<12?smooth((t-6)/6):t<18?1:t<24?1-smooth((t-18)/6):0;
    const p=Math.max(0,(progress-.4)/.6);
    const keeper=progress<.4?{x:.5+progress*.9,y:.5-progress*.45}:null;
    const interaction={paperProgress:p,top:[{x:.16,y:.5+p*.33},{x:.84,y:.5+p*.33}],bottom:[{x:.16,y:.5-p*.33},{x:.84,y:.5-p*.33}],keeper};
    for(const f of fields)f.tick(1/30,progress,null,1,1/30,interaction);
    if(i===n-1){
     const pixels=capture(),a=pixels[1],b=pixels[2];let total=0,changed=0;
     for(let j=0;j<a.length;j+=4){const d=Math.abs(a[j]-b[j])+Math.abs(a[j+1]-b[j+1])+Math.abs(a[j+2]-b[j+2]);total+=d;if(d>6)changed++;}
     differences.push({t,meanRGBDifference:total/(a.length/4*3),changedFraction:changed/(a.length/4)});
     records.push({t,snapshots:fields.map(f=>f.snapshot())});
     document.querySelector('#phase').textContent='模拟时间 '+t.toFixed(1)+'s · '+(t<6?'静止':t<12?'开启':t<18?'展开静置':t<24?'收起':'收起静置');
    }
   }
  };window.frame=0;
 },origin);
 // Same 30 Hz inputs and seeded weather on both new fields; only coupling differs.
 for(let i=1;i<=36;i++){
  await page.evaluate(()=>advance(30));
  if([6,10,12,18,22,24,30,36].includes(i))await page.screenshot({path:`${out}/comparison-${String(i).padStart(2,'0')}s.png`});
  await page.waitForTimeout(30);
 }
 const result=await page.evaluate(()=>({records,differences}));
 assert.deepEqual(errors,[]);assert.ok(result.records.every(x=>x.snapshots.every(f=>f.drive.every(Number.isFinite))));
 assert.ok(result.differences.find(x=>x.t>9&&x.t<11).meanRGBDifference>.1,'Opening visibly changes the advected field');
 assert.ok(result.differences.find(x=>x.t>21&&x.t<23).meanRGBDifference>.1,'Closing visibly changes the advected field');
 assert.equal(result.differences[4].meanRGBDifference,0,'Counterfactual fields agree before motion');
 result.errors=errors;result.note='Deterministic synthetic motion diagnostic, not scroll geometry or visual acceptance.';
 await writeFile(out+'/field-comparison.json',JSON.stringify(result,null,2));
 console.log(JSON.stringify({differences:result.differences.filter((_,i)=>i%3===0),errors}));
 await context.close();
 const specimen=await browser.newContext({viewport:{width:402,height:874},deviceScaleFactor:3,isMobile:true,hasTouch:true,recordVideo:{dir:'.cache/scroll-v20/video',size:{width:402,height:874}}});
 const actual=await specimen.newPage();actual.on('pageerror',e=>errors.push(e.message));
 await actual.goto(origin+'/labs/chapter-scroll-v20/');await actual.waitForFunction(()=>window.scrollSpecimen?.snapshot().ready,null,{timeout:120000});
 await actual.screenshot({path:out+'/actual-closed.png',scale:'css'});
 await actual.evaluate(()=>scrollSpecimen.open());
 for(const ms of [800,1100,1200,1400,1600]){await actual.waitForTimeout(ms);await actual.screenshot({path:out+`/actual-opening-${ms}.png`,scale:'css'});}
 await actual.waitForFunction(()=>!scrollSpecimen.snapshot().animating);await actual.waitForTimeout(8000);await actual.screenshot({path:out+'/actual-open.png',scale:'css'});
 await actual.evaluate(()=>scrollSpecimen.close());await actual.waitForTimeout(3600);await actual.screenshot({path:out+'/actual-closing.png',scale:'css'});
 await actual.waitForFunction(()=>!scrollSpecimen.snapshot().animating);await actual.waitForTimeout(6000);await actual.screenshot({path:out+'/actual-closed-after.png',scale:'css'});
 assert.deepEqual(errors,[]);console.log(JSON.stringify(await actual.evaluate(()=>scrollSpecimen.snapshot().mist)));
 await specimen.close();
}finally{await browser.close();await new Promise(r=>server.close(r));}


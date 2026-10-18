import {mkdir,writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {createServer} from './serve-scroll-lab.mjs';
import {execFileSync} from 'node:child_process';
const mode=process.argv[2]??'baseline',dpr=Number(process.argv[3]??3),out='research/scroll-motion-2026-10-18';await mkdir(out,{recursive:true});await mkdir('.cache/scroll-motion/temp',{recursive:true});process.env.TEMP=process.env.TMP=process.cwd()+'/.cache/scroll-motion/temp';
const {chromium}=await import(pathToFileURL('D:/CodexStorage/workspaces/second-language-maintenance/.cache/browser-tools/package/index.mjs'));
const server=createServer();
if(mode==='baseline'){
 const ordinary=server.listeners('request')[0],paths=['/labs/chapter-scroll-v13/app.js','/labs/chapter-scroll-v5/vendor/fluid.js'],old=new Map(paths.map(p=>[p,execFileSync('git',['show','72650010114ac45f63b8b486ad455de67784474d:web'+p])]));
 server.removeAllListeners('request');server.on('request',(req,res)=>{const bytes=old.get(req.url.split('?')[0]);if(!bytes)return ordinary(req,res);res.writeHead(200,{'content-type':'text/javascript','cache-control':'no-store'});res.end(bytes);});
}
await new Promise(r=>server.listen(0,'127.0.0.1',r));const base=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--no-first-run']});
try{
 const runs=[];
 for(const initial of ['closed','open']){
  const context=await browser.newContext({viewport:{width:402,height:874},deviceScaleFactor:dpr,isMobile:true,hasTouch:true,serviceWorkers:'block'}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{
   const p=window.motionProbe={phase:'setup',events:[],frames:[],draws:{scrollCanvas:0,mistCanvas:0}};
   for(const proto of [WebGLRenderingContext.prototype,WebGL2RenderingContext.prototype])for(const method of ['createProgram','texImage2D','drawElements','drawArrays']){
    const original=proto[method];proto[method]=function(...args){const id=this.canvas?.id;if(method.startsWith('draw'))p.draws[id]=(p.draws[id]??0)+1;else if(p.events.length<700)p.events.push({method,canvas:id,phase:p.phase,time:performance.now()});return original.apply(this,args);};
   }
   const raf=window.requestAnimationFrame;window.requestAnimationFrame=fn=>raf.call(window,t=>{const start=performance.now();fn(t);if(p.phase!=='setup'&&p.frames.length<2000){const s=window.scrollSpecimen?.snapshot();p.frames.push({phase:p.phase,time:t,cpu:performance.now()-start,progress:s?.progress,keeper:s?.keeperPose?.phase,programs:s?.runtime?.programs});}});
  });
  await page.goto(base+'/labs/chapter-scroll-v13/'+(initial==='open'?'?open=1':''));await page.waitForFunction(()=>window.scrollSpecimen?.snapshot().ready,null,{timeout:90000});
  const atReady=await page.evaluate(()=>({state:scrollSpecimen.snapshot(),events:motionProbe.events.length}));
  await page.evaluate(initial=>{motionProbe.phase='first-motion';if(initial==='open')scrollSpecimen.close();else scrollSpecimen.open();},initial);
  await page.waitForFunction(initial=>scrollSpecimen.snapshot().progress===(initial==='open'?0:1)&&!scrollSpecimen.snapshot().animating,initial,{timeout:90000});
  const first=await page.evaluate(()=>({state:scrollSpecimen.snapshot(),events:motionProbe.events.filter(e=>e.phase==='first-motion'),frames:motionProbe.frames.filter(f=>f.phase==='first-motion')}));
  await page.evaluate(initial=>{motionProbe.phase='repeat-motion';if(initial==='open')scrollSpecimen.open();else scrollSpecimen.close();},initial);
  await page.waitForFunction(initial=>scrollSpecimen.snapshot().progress===(initial==='open'?1:0)&&!scrollSpecimen.snapshot().animating,initial,{timeout:90000});
  await page.evaluate(()=>{motionProbe.phase='idle';});const idleStart=await page.evaluate(()=>({state:scrollSpecimen.snapshot(),draws:{...motionProbe.draws}}));await page.waitForTimeout(650);const idleEnd=await page.evaluate(()=>({state:scrollSpecimen.snapshot(),draws:{...motionProbe.draws}}));
  await page.evaluate(()=>{scrollSpecimen.atmosphere(false);scrollSpecimen.setProgress(1);});await page.screenshot({path:`${out}/${mode}-dpr${dpr}-${initial}-document.png`,scale:'css'});
  const probe=await page.evaluate(()=>motionProbe),summary=phase=>{const seen=new Set(),f=probe.frames.filter(x=>x.phase===phase&&(!seen.has(x.time)&&seen.add(x.time))),d=f.slice(1).map((x,i)=>x.time-f[i].time).sort((a,b)=>a-b);return{frames:f.length,intervalMedian:d[Math.floor(d.length*.5)],intervalP95:d[Math.floor(d.length*.95)],maxProgressStep:Math.max(0,...f.slice(1).map((x,i)=>Math.abs(x.progress-f[i].progress))),newPrograms:probe.events.filter(x=>x.phase===phase&&x.method==='createProgram').length,textureUploads:probe.events.filter(x=>x.phase===phase&&x.method==='texImage2D').length,keeperPhases:[...new Set(f.map(x=>x.keeper))]};};
  runs.push({initial,atReady,firstMotion:summary('first-motion'),repeatMotion:summary('repeat-motion'),idle:{paperRenders:idleEnd.state.renderCount-idleStart.state.renderCount,mistFrames:idleEnd.state.mist.frames-idleStart.state.mist.frames,mistDraws:idleEnd.draws.mistCanvas-idleStart.draws.mistCanvas},firstMotionEvents:first.events,errors});console.log(JSON.stringify({mode,initial,first:runs.at(-1).firstMotion,repeat:runs.at(-1).repeatMotion,idle:runs.at(-1).idle}));await context.close();
 }
 await writeFile(`${out}/${mode}-dpr${dpr}.json`,JSON.stringify({mode,dpr,environment:'402x874 Chromium Intel UHD Direct3D11 hardware WebGL; not physical iPhone/Safari FPS. Baseline code pinned to 7265001.',runs},null,2));
}finally{await browser.close();await new Promise(r=>server.close(r));}

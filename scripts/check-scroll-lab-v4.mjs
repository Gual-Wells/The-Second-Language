import {mkdir,writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {createServer} from './serve-scroll-lab.mjs';
const {chromium}=await import(pathToFileURL(process.env.BROWSER_TOOLS_MODULE||'D:/CodexStorage/workspaces/second-language-maintenance/.cache/browser-tools/package/index.mjs'));
const out='research/scroll-lab-v4';await mkdir(out,{recursive:true});
const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));const base=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_EXECUTABLE||'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader','--no-first-run']});
const checks=[],requests=[],errors=[];const check=(name,ok)=>{assert.ok(ok,name);checks.push(name);console.log('PASS',name);};
try{
 const context=await browser.newContext({viewport:{width:402,height:874},isMobile:true,hasTouch:true,deviceScaleFactor:2,serviceWorkers:'block'});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 page.on('request',r=>requests.push({url:r.url(),method:r.method()}));
 await page.goto(base+'/labs/chapter-scroll-v4/');await page.waitForFunction(()=>window.scrollSpecimen?.snapshot().ready);
 const initial=await page.evaluate(()=>scrollSpecimen.snapshot());
 check('first chapter is an unissued specimen',initial.chapterId==='2026-10-02'&&!initial.issued);
 check('fits the iPhone-sized viewport',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth&&document.documentElement.scrollHeight<=innerHeight));
 check('real medieval font is loaded',await page.evaluate(()=>document.fonts.check('58px Aboensis')));
 check('independent fluid is available',initial.mist.available);
 // Verify actual colored pixels, not just a tick counter: guards the transparent
 // framebuffer integration bug. Use a temporary offscreen same-origin instance.
 const pixels=await page.evaluate(async()=>{
  const {createFluid}=await import('./vendor/fluid.js');const c=document.createElement('canvas');c.style='position:fixed;left:-200px;width:100px;height:160px';document.body.append(c);
  const f=createFluid(c);f.seed(.3,.3,1);f.tick(.016);const gl=c.getContext('webgl2')||c.getContext('webgl');
  const rgba=new Uint8Array(c.width*c.height*4);gl.readPixels(0,0,c.width,c.height,gl.RGBA,gl.UNSIGNED_BYTE,rgba);let count=0;for(let i=0;i<rgba.length;i+=4)if(rgba[i]>0)count++;
  f.dispose();c.remove();return count;
 });check('fluid produces visible dye after transparent compositing',pixels>20);
 await page.waitForTimeout(1800);await page.screenshot({path:out+'/closed-iphone.png',scale:'css'});
 await page.evaluate(()=>scrollSpecimen.setProgress(.10));const release=await page.evaluate(()=>scrollSpecimen.snapshot());
 check('keeper releases before the page opens',release.keeperVisible&&release.paperProgress===0);
 await page.screenshot({path:out+'/release-iphone.png',scale:'css'});
 await page.evaluate(()=>scrollSpecimen.setProgress(.58));await page.screenshot({path:out+'/half-iphone.png',scale:'css'});
 await page.evaluate(()=>scrollSpecimen.setProgress(1));await page.screenshot({path:out+'/open-iphone.png',scale:'css'});
 const open=await page.evaluate(()=>scrollSpecimen.snapshot());check('full page hides the separate keeper',open.progress===1&&!open.keeperVisible);
 check('camera remains exactly frontal',JSON.stringify(open.camera)===JSON.stringify(initial.camera));
 await page.evaluate(()=>{scrollSpecimen.setProgress(0);scrollSpecimen.open();});await page.waitForFunction(()=>scrollSpecimen.snapshot().progress>.19);
 check('real-time opening changes the mesh',await page.evaluate(()=>scrollSpecimen.snapshot().animating));
 await page.evaluate(()=>scrollSpecimen.close());await page.waitForFunction(()=>scrollSpecimen.snapshot().progress===0&&!scrollSpecimen.snapshot().animating);
 check('opening can reverse back to a closed roll',await page.evaluate(()=>scrollSpecimen.snapshot().keeperVisible));
 await page.evaluate(()=>{scrollSpecimen.setProgress(1);scrollSpecimen.atmosphere(false);});const idle=await page.evaluate(()=>scrollSpecimen.snapshot());await page.waitForTimeout(250);
 const after=await page.evaluate(()=>scrollSpecimen.snapshot());check('disabling mist stops all idle draws',idle.renderCount===after.renderCount&&idle.mist.frames===after.mist.frames);
 const png=await page.evaluate(()=>scrollSpecimen.exportObject());check('isolated artifact exports a transparent PNG',await page.evaluate(async png=>{const i=new Image();i.src=png;await i.decode();const c=Object.assign(document.createElement('canvas'),{width:i.width,height:i.height});const p=c.getContext('2d');p.drawImage(i,0,0);return p.getImageData(0,0,1,1).data[3]===0;},png));
 await writeFile(out+'/open-object.png',Buffer.from(png.split(',')[1],'base64'));
 await page.locator('#detail').click();check('high-resolution document and English transcript remain available',await page.locator('#detailImage').isVisible()&&(await page.locator('#transcriptContent').textContent()).includes('The Line on the Map'));
 await page.screenshot({path:out+'/detail-iphone.png',scale:'css'});await page.locator('#transcriptDialog button').click();
 await page.locator('#objectOnly').click();check('object view removes app chrome',await page.locator('.app-header').isHidden());await page.screenshot({path:out+'/object-only-iphone.png',scale:'css'});await page.locator('#leaveObject').click();
 const reduced=await context.newPage();await reduced.emulateMedia({reducedMotion:'reduce'});await reduced.goto(base+'/labs/chapter-scroll-v4/');await reduced.waitForFunction(()=>window.scrollSpecimen?.snapshot().ready);
 const quiet=await reduced.evaluate(()=>scrollSpecimen.snapshot());check('reduced motion starts open without allocating fluid',quiet.progress===1&&!quiet.mist.available&&!quiet.animating);await reduced.close();
 await page.evaluate(()=>document.getElementById('scrollCanvas').dispatchEvent(new Event('webglcontextlost',{cancelable:true})));
 check('context loss keeps the static text fallback',await page.locator('#fallback').isVisible()&&await page.locator('#toggle').isDisabled());
 check('sample makes no external requests or backend writes',requests.every(r=>r.url.startsWith(base)&&r.method==='GET'));
 check('no script or shader errors',errors.length===0);
 await writeFile(out+'/checks.json',JSON.stringify({checks,errors,initial,open,visibleFluidPixels:pixels,environment:'Chromium 402x874 mobile emulation; software WebGL, not physical iPhone or Safari',paidExternalCalls:0},null,2));
}finally{await browser.close();await new Promise(r=>server.close(r));}

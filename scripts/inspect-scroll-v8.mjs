import {mkdir,writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {createServer} from './serve-scroll-lab.mjs';
const {chromium}=await import(pathToFileURL('D:/CodexStorage/workspaces/second-language-maintenance/.cache/browser-tools/package/index.mjs'));
const out='research/scroll-lab-v8';await mkdir(out,{recursive:true});await mkdir('.cache/scroll-v8/temp',{recursive:true});process.env.TEMP=process.env.TMP=process.cwd()+'/.cache/scroll-v8/temp';
const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader','--no-first-run']});
try{
 const context=await browser.newContext({viewport:{width:402,height:874},isMobile:true,hasTouch:true,deviceScaleFactor:2,serviceWorkers:'block'}),page=await context.newPage();
 const errors=[],requests=[];page.on('request',r=>requests.push({method:r.method(),url:r.url()}));page.on('pageerror',e=>{errors.push(e.message);console.log('PAGE',e.message);});page.on('console',m=>{if(m.type()==='error'){errors.push(m.text());console.log('CONSOLE',m.text());}});
 await page.goto(`http://127.0.0.1:${server.address().port}/labs/chapter-scroll-v8/`);await page.waitForFunction(()=>window.scrollSpecimen?.snapshot().ready,{timeout:30000});
 await page.evaluate(()=>scrollSpecimen.atmosphere(false));
 const snapshots=[];
 for(const [name,p]of [['closed',0],['loose',.06],['middle',.13],['end',.195],['away',.22],['half',.58],['open',1]]){
  await page.evaluate(p=>scrollSpecimen.setProgress(p),p);await page.screenshot({path:`${out}/${name}-iphone.png`,scale:'css'});snapshots.push({name,...await page.evaluate(()=>scrollSpecimen.snapshot())});
 }
 const document=await page.evaluate(()=>scrollSpecimen.exportDocument());await writeFile(out+'/document.png',Buffer.from(document.split(',')[1],'base64'));
 for(const [file,fn]of [['seal-master.png','exportSeal'],['seal-height.png','exportSealHeight']]){const data=await page.evaluate(fn=>scrollSpecimen[fn](),fn);await writeFile(out+'/'+file,Buffer.from(data.split(',')[1],'base64'));}
 // Real rendered frame sequence, deliberately enlarged without changing the
 // geometry or camera depth relationships (not a simulated photo overlay).
 const contact=await page.evaluate(async()=>{
  const c=Object.assign(document.createElement('canvas'),{width:1500,height:1000}),q=c.getContext('2d');q.fillStyle='#30302e';q.fillRect(0,0,1500,1000);
  for(let n=0;n<12;n++){
   const p=n/11*.238;scrollSpecimen.setProgress(p);const i=new Image();i.src=scrollSpecimen.exportObject();await i.decode();
   const cellX=n%3*500,cellY=Math.floor(n/3)*250;const ratio=i.width/402;
   q.drawImage(i,0,225*ratio,i.width,240*ratio,cellX,cellY+25,500,220);q.fillStyle='#eee';q.font='16px sans-serif';q.fillText(p.toFixed(3),cellX+10,cellY+20);
  }return c.toDataURL('image/png');
 });await writeFile(out+'/keeper-frames.png',Buffer.from(contact.split(',')[1],'base64'));
 // Test the actual morph-target geometry, not an unrelated path illustration.
 const geometry=await page.evaluate(async()=>{
  const THREE=await import('../certification/vendor/three.module.js'),{Keeper}=await import('./keeper.js');
  const template={width:4.5,height:6.3,coreRadius:.145,layerThickness:.035},k=new Keeper(new THREE.Scene(),new THREE.Texture(),template);
  let minimum=Infinity,rigidDrift=0,fadeClear=true,tiltClear=true;
  const plate=k.plate.geometry,initialPlateHeight=plate.attributes.position.getY(0)-plate.attributes.position.getY(plate.attributes.position.count-1);
  for(let i=0;i<=240;i++){
   const p=i/1000;k.update(p,0);k.group.updateMatrixWorld(true);const pose=k.pose;
   if(!pose.visible)continue;
   if(pose.phase!=='depart'){
    const a=k.band.geometry.attributes.position,b=k.band.geometry.morphAttributes.position[0];
    for(let j=0;j<a.count;j++){
     const v=new THREE.Vector3().fromBufferAttribute(a,j).lerp(new THREE.Vector3().fromBufferAttribute(b,j),pose.loosen).applyMatrix4(k.group.matrixWorld);
     if(Math.abs(v.x)<=2.25)minimum=Math.min(minimum,Math.hypot(v.y,v.z-pose.radius)-(pose.radius+.034));
    }
   }
   const pa=plate.attributes.position,pb=plate.morphAttributes.position[0],n=pa.count-1;
   const h=(pa.getY(0)+(pb.getY(0)-pa.getY(0))*pose.loosen)-(pa.getY(n)+(pb.getY(n)-pa.getY(n))*pose.loosen);
   rigidDrift=Math.max(rigidDrift,Math.abs(initialPlateHeight-h));
   if(pose.rotationZ!==0||pose.rotationY!==0)tiltClear&&=pose.x+.205< -2.25;
   if(pose.opacity<.999)fadeClear&&=pose.x+.205< -2.25;
  }k.dispose();return {minimumInnerHoopClearance:minimum,rigidPlateHeightDrift:rigidDrift,fadeClear,tiltClear};
 });
 assert.ok(geometry.minimumInnerHoopClearance>.01);assert.equal(geometry.rigidPlateHeightDrift,0);assert.ok(geometry.fadeClear&&geometry.tiltClear);
 assert.deepEqual(snapshots[0].layout.printedFonts,['Aboensis']);assert.equal(snapshots[0].cameraType,'PerspectiveCamera');assert.equal(snapshots[0].layout.sealVersion,'SL-CHAPTER-2');
 await page.evaluate(()=>{scrollSpecimen.setProgress(0);scrollSpecimen.open();});await page.waitForFunction(()=>scrollSpecimen.snapshot().progress>.08);
 await page.evaluate(()=>scrollSpecimen.close());await page.waitForFunction(()=>scrollSpecimen.snapshot().progress===0&&!scrollSpecimen.snapshot().animating);
 assert.ok(await page.evaluate(()=>scrollSpecimen.snapshot().keeperVisible));
 await page.evaluate(()=>scrollSpecimen.setProgress(1));const idle=await page.evaluate(()=>scrollSpecimen.snapshot().renderCount);await page.waitForTimeout(250);assert.equal(await page.evaluate(()=>scrollSpecimen.snapshot().renderCount),idle);
 await page.locator('#detail').click();assert.ok(await page.locator('#detailImage').isVisible());await page.locator('#detailZoom').click();assert.ok(await page.locator('.scroll-document-detail').evaluate(e=>e.scrollWidth>e.clientWidth));await page.locator('#transcriptDialog button[aria-label=关闭]').click();
 await page.evaluate(()=>scrollSpecimen.atmosphere(true));await page.waitForTimeout(350);assert.ok(await page.evaluate(()=>scrollSpecimen.snapshot().mist.frames>1));await page.evaluate(()=>scrollSpecimen.atmosphere(false));
 assert.ok(requests.every(r=>r.method==='GET'&&r.url.startsWith(`http://127.0.0.1:${server.address().port}`)));
 const reduced=await context.newPage();await reduced.emulateMedia({reducedMotion:'reduce'});await reduced.goto(`http://127.0.0.1:${server.address().port}/labs/chapter-scroll-v8/`);await reduced.waitForFunction(()=>window.scrollSpecimen?.snapshot().ready);assert.ok(await reduced.evaluate(()=>scrollSpecimen.snapshot().progress===1&&!scrollSpecimen.snapshot().mist.available));await reduced.close();
 await page.evaluate(()=>document.getElementById('scrollCanvas').dispatchEvent(new Event('webglcontextlost',{cancelable:true})));assert.ok(await page.locator('#fallback').isVisible());
 await writeFile(out+'/inspection.json',JSON.stringify({snapshots,geometry,errors,checks:['real morph geometry clears conservative wound-paper envelope','rigid metal plate does not stretch','departure tilt/fade only after clearing the end','actual perspective projection','Aboensis-only printed document','reverse mid-motion','idle stops without fog','document zoom','mist enabled','reduced-motion fallback','context-loss fallback','no external or write requests'],environment:'Chromium DPR2 software WebGL, not iPhone performance'},null,2));
 if(errors.length)throw Error(errors.join('\n'));console.log(JSON.stringify({geometry,errors,layout:snapshots[0].layout}));
}finally{await browser.close();await new Promise(r=>server.close(r));}


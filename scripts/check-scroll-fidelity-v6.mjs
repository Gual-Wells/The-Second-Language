import {mkdir,writeFile} from 'node:fs/promises';
import {createServer} from './serve-scroll-lab.mjs';
import {chromium} from 'file:///D:/CodexStorage/workspaces/second-language-maintenance/.cache/browser-tools/package/index.mjs';
const scratch='D:/CodexStorage/workspaces/second-language-scroll-lab/.cache/scroll-v6/browser-temp';await mkdir(scratch,{recursive:true});process.env.TEMP=scratch;process.env.TMP=scratch;
const s=createServer();await new Promise(r=>s.listen(0,'127.0.0.1',r));const b=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader']});
try{
 const p=await b.newPage({viewport:{width:402,height:874},deviceScaleFactor:3,isMobile:true,hasTouch:true});await p.goto(`http://127.0.0.1:${s.address().port}/labs/chapter-scroll-v6/`);await p.waitForFunction(()=>window.scrollSpecimen);
 await p.evaluate(()=>{scrollSpecimen.atmosphere(false);scrollSpecimen.setProgress(1);});
 const fidelity=await p.evaluate(async()=>{
  async function pixels(url){const i=new Image();i.src=url;await i.decode();const c=Object.assign(document.createElement('canvas'),{width:i.width,height:i.height}),ctx=c.getContext('2d');ctx.drawImage(i,0,0);return {w:i.width,h:i.height,p:ctx.getImageData(0,0,i.width,i.height).data};}
  const source=await pixels(scrollSpecimen.exportDocument()),render=await pixels(scrollSpecimen.exportObject()),state=scrollSpecimen.snapshot(),rect=document.getElementById('stage').getBoundingClientRect(),aspect=rect.width/rect.height;
  const rgb=(img,x,y)=>[...img.p.slice((Math.round(y)*img.w+Math.round(x))*4,(Math.round(y)*img.w+Math.round(x))*4+3)],lum=rgb=>rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722,samples=[];
  // Compare equal physical areas. The source has ~2x as many texels across the
  // sheet as the raster, so single nearest-pixel samples alias fibres and ink.
  const patch=(img,x,y,r)=>{let total=0,n=0,min=255,max=0;for(let iy=-3;iy<=3;iy++)for(let ix=-3;ix<=3;ix++){const v=lum(rgb(img,x+ix*r/3,y+iy*r/3));total+=v;n++;min=Math.min(min,v);max=Math.max(max,v);}return {mean:total/n,min,max};};
  for(let v=.15;v<.85;v+=.035)for(let u=.15;u<.85;u+=.035){
   const sx=u*source.w-.5,sy=v*source.h-.5,sourcePerRaster=source.w/(4.5/(state.viewHeight*aspect)*render.w),a=patch(source,sx,sy,3*sourcePerRaster);
   if(a.min<75||a.max-a.min>35)continue;
   const worldX=(u-.5)*4.5,worldY=(.5-v)*6.3,rx=(.5+worldX/(state.viewHeight*aspect))*render.w-.5,ry=(.5-worldY/state.viewHeight)*render.h-.5,b=patch(render,rx,ry,3);samples.push({source:a.mean,render:b.mean});
  }
  const mean=a=>a.reduce((s,x)=>s+x,0)/a.length,sm=mean(samples.map(x=>x.source)),rm=mean(samples.map(x=>x.render)),ss=Math.sqrt(mean(samples.map(x=>(x.source-sm)**2))),rs=Math.sqrt(mean(samples.map(x=>(x.render-rm)**2))),corr=mean(samples.map(x=>(x.source-sm)*(x.render-rm)))/(ss*rs);
  return {sampleCount:samples.length,sourceMean:sm,renderMean:rm,brightnessShift:rm-sm,sourceStd:ss,renderStd:rs,contrastRatio:rs/ss,correlation:corr,method:'Same uncurled interior UV positions and matching physical area averages, real source document vs actual GPU render PNG; ink edges excluded. Broad wear/color preservation, not a microtexture-resolution score.'};
 });console.log(JSON.stringify(fidelity));
 await writeFile('research/scroll-lab-v6/fidelity.json',JSON.stringify(fidelity,null,2)+'\n');
 for(const fraction of [.91,.94,.97,.985,.995,1]){await p.evaluate(v=>scrollSpecimen.setProgress(.18+.82*v),fraction);await p.screenshot({path:`research/scroll-lab-v6/last-turn-${fraction}.png`,scale:'css'});}
 if(fidelity.sampleCount<50||fidelity.brightnessShift>18||fidelity.contrastRatio<.8||fidelity.correlation<.94)throw Error('Source detail/color fidelity requires another lighting pass');
}finally{await b.close();await new Promise(r=>s.close(r));}

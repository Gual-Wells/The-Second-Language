import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import {createServer} from './serve-scroll-lab.mjs';
const root=process.cwd(),out=root+'/web/labs/chapter-scroll-cord/assets',research=root+'/research/scroll-cord-frames-2026-10-20';
await mkdir(out,{recursive:true});await mkdir(root+'/.cache/scroll-cord/tmp',{recursive:true});process.env.TEMP=process.env.TMP=root+'/.cache/scroll-cord/tmp';
const {chromium}=await import(pathToFileURL('D:/CodexStorage/workspaces/second-language-maintenance/.cache/browser-tools/package/index.mjs'));
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));
try{
 const source=await readFile(research+'/source-art/silk-cord.png');
 const author=await readFile(research+'/author-frames.js','utf8');
 const page=await browser.newPage();await page.setContent('<!doctype html><title>Cord raster authoring</title>');
 const result=await page.evaluate(async({source,author})=>{
  const module=await import(URL.createObjectURL(new Blob([author],{type:'text/javascript'})));
  const image=new Image();image.src='data:image/png;base64,'+source;await image.decode();
  const probe=document.createElement('canvas');probe.width=image.width;probe.height=image.height;const pc=probe.getContext('2d',{willReadFrequently:true});pc.drawImage(image,0,0);
  const data=pc.getImageData(0,0,image.width,image.height).data;let x0=image.width,y0=image.height,x1=0,y1=0;
  for(let y=0;y<image.height;y++)for(let x=0;x<image.width;x++)if(data[(y*image.width+x)*4+3]>50){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}
  const bounds={x:x0+100,y:y0,w:x1-x0-200,h:y1-y0+1};
  const n=module.FRAME_SIZE,frame=document.createElement('canvas');frame.width=frame.height=n;const fc=frame.getContext('2d');
  const pages=[],sheets=[];
  for(let page=0;page<4;page++){
   const sheet=document.createElement('canvas');sheet.width=sheet.height=n*4;const ctx=sheet.getContext('2d');
   for(let i=0;i<16;i++){const index=page*16+i;module.drawFrame(fc,index/(module.FRAME_COUNT-1),image,bounds);ctx.drawImage(frame,(i%4)*n,Math.floor(i/4)*n);}
   pages.push(sheet.toDataURL('image/webp',.95));
  }
  const review=document.createElement('canvas');review.width=1536;review.height=768;const rc=review.getContext('2d');rc.fillStyle='#202725';rc.fillRect(0,0,1536,768);
  const positions=[0,.12,.25,.4,.55,.68,.8,1];
  positions.forEach((r,i)=>{module.drawFrame(fc,r,image,bounds);rc.drawImage(frame,(i%4)*384,Math.floor(i/4)*384);rc.fillStyle='#d0c7b9';rc.font='17px serif';rc.fillText(module.pose(r).phase,(i%4)*384+18,Math.floor(i/4)*384+355);});
  module.drawRear(fc,image,bounds);const rear=frame.toDataURL('image/webp',.95);
  module.drawFrame(fc,0,image,bounds);return{pages,rear,review:review.toDataURL('image/png'),closed:frame.toDataURL('image/png'),bounds,sourceSize:[image.width,image.height],phases:positions.map(r=>({r,...module.pose(r)}))};
 },{source:source.toString('base64'),author});
 const save=async(file,data)=>writeFile(file,Buffer.from(data.split(',')[1],'base64'));
 for(let i=0;i<result.pages.length;i++)await save(`${out}/cord-${i}.webp`,result.pages[i]);
 await save(out+'/cord-rear.webp',result.rear);await save(out+'/cord-closed.png',result.closed);await save(research+'/frame-review.png',result.review);
 const manifest={version:1,type:'authored-2d-raster-sequence',material:'fine braided silk; contemporary medieval-style interpretation',frames:64,frameSize:384,columns:4,rows:4,pageCount:4,pages:result.pages.map((_,i)=>`assets/cord-${i}.webp`),rear:'assets/cord-rear.webp',worldSize:2.0,releaseEnd:.38,sourceSha256:createHash('sha256').update(source).digest('hex'),sourceSize:result.sourceSize,sourceBounds:result.bounds,decodedRGBABytes:64*384*384*4,phases:result.phases.map(({r,phase})=>({r,phase})),physicalSimulation:false};
 await writeFile(out+'/cord-frames.json',JSON.stringify(manifest,null,2));console.log(JSON.stringify(manifest));
}finally{await browser.close();await new Promise(r=>server.close(r));}

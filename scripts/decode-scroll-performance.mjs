import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const root=process.cwd(),dir=root+'/web/labs/certification-reader/assets/audio-sources/performance-recordings';
const tmp=root+'/.cache/scroll-craft-audio/browser';await mkdir(tmp,{recursive:true});
const {chromium}=await import(pathToFileURL('D:/CodexStorage/workspaces/second-language-maintenance/.cache/browser-tools/package/index.mjs'));
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',env:{...process.env,TEMP:tmp,TMP:tmp},args:['--no-first-run']});
try{
 const page=await browser.newPage();
 const report=[];
 for(const source of JSON.parse(await readFile(dir+'/sources.json','utf8')).sources){
  const result=await page.evaluate(async b64=>{
   const context=new OfflineAudioContext(1,1,48000),decoded=await context.decodeAudioData(Uint8Array.from(atob(b64),x=>x.charCodeAt(0)).buffer);
   const bytes=new ArrayBuffer(44+decoded.length*2),d=new DataView(bytes),s=(p,v)=>[...v].forEach((c,i)=>d.setUint8(p+i,c.charCodeAt(0)));
   s(0,'RIFF');d.setUint32(4,36+decoded.length*2,true);s(8,'WAVE');s(12,'fmt ');d.setUint32(16,16,true);d.setUint16(20,1,true);d.setUint16(22,1,true);d.setUint32(24,48000,true);d.setUint32(28,96000,true);d.setUint16(32,2,true);d.setUint16(34,16,true);s(36,'data');d.setUint32(40,decoded.length*2,true);
   const channels=Array.from({length:decoded.numberOfChannels},(_,i)=>decoded.getChannelData(i));
   for(let i=0;i<decoded.length;i++){const x=channels.reduce((sum,c)=>sum+c[i],0)/channels.length;d.setInt16(44+2*i,Math.round(Math.max(-1,Math.min(1,x))*32767),true);}
   const u=new Uint8Array(bytes);let str='';for(let i=0;i<u.length;i+=16384)str+=String.fromCharCode(...u.subarray(i,i+16384));
   return{wav:btoa(str),rate:48000,channels:decoded.numberOfChannels,duration:decoded.duration};
  },(await readFile(dir+'/'+source.file)).toString('base64'));
  await writeFile(dir+'/'+source.id+'-decoded.wav',Buffer.from(result.wav,'base64'));delete result.wav;report.push({id:source.id,...result});
 }
 await writeFile('research/scroll-craft-and-audio-2026-10-22/decoded.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
}finally{await browser.close();}

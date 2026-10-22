// Decode the exact licensed author previews for offline editing; not a master-quality claim.
import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
const root=process.cwd(),cache=root+'/.cache/foley-community-sources-2026-10-22';
const dest=root+'/web/labs/scroll-foley-study/sources';
let manifest;
try{manifest=JSON.parse(await readFile(root+'/web/labs/scroll-foley-study/sources.json','utf8'));}
catch{manifest=JSON.parse(await readFile(cache+'/source-manifest.json','utf8'));}
await mkdir(dest,{recursive:true});await mkdir(cache+'/browser',{recursive:true});
const {chromium}=await import(pathToFileURL('D:/CodexStorage/workspaces/second-language-maintenance/.cache/browser-tools/package/index.mjs'));
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',env:{...process.env,TEMP:cache+'/browser',TMP:cache+'/browser'},args:['--no-first-run']});
try{
 const page=await browser.newPage();const decoded=[];
 for(const source of manifest.sources){
  let original;
  try{original=await readFile(dest+'/'+source.local);}
  catch{original=await readFile(cache+'/'+source.local);await copyFile(cache+'/'+source.local,dest+'/'+source.local);}
  if(original.length!==source.bytes||createHash('sha256').update(original).digest('hex')!==source.sha256)throw Error('Author source differs: '+source.id);
  const result=await page.evaluate(async b64=>{
   const ctx=new OfflineAudioContext(1,1,48000),b=await ctx.decodeAudioData(Uint8Array.from(atob(b64),x=>x.charCodeAt(0)).buffer);
   const bytes=new ArrayBuffer(44+b.length*2),d=new DataView(bytes),s=(p,v)=>[...v].forEach((c,i)=>d.setUint8(p+i,c.charCodeAt(0)));
   s(0,'RIFF');d.setUint32(4,36+b.length*2,true);s(8,'WAVE');s(12,'fmt ');d.setUint32(16,16,true);d.setUint16(20,1,true);d.setUint16(22,1,true);d.setUint32(24,48000,true);d.setUint32(28,96000,true);d.setUint16(32,2,true);d.setUint16(34,16,true);s(36,'data');d.setUint32(40,b.length*2,true);
   const channels=Array.from({length:b.numberOfChannels},(_,i)=>b.getChannelData(i));
   for(let i=0;i<b.length;i++)d.setInt16(44+2*i,Math.round(Math.max(-1,Math.min(1,channels.reduce((v,c)=>v+c[i],0)/channels.length))*32767),true);
   let str='';const u=new Uint8Array(bytes);for(let i=0;i<u.length;i+=16384)str+=String.fromCharCode(...u.subarray(i,i+16384));
   return{wav:btoa(str),duration:b.duration,originalChannels:b.numberOfChannels};
  },original.toString('base64'));
  await writeFile(cache+'/'+source.id+'-decoded.wav',Buffer.from(result.wav,'base64'));delete result.wav;
  decoded.push({id:source.id,...result});
 }
 await writeFile(cache+'/decoded.json',JSON.stringify(decoded,null,2)+'\n');
 await writeFile(root+'/web/labs/scroll-foley-study/sources.json',JSON.stringify(manifest,null,2)+'\n');
 console.log(JSON.stringify(decoded));
}finally{await browser.close();}

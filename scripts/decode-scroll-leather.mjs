// Decode the author's explicitly identified public HQ MP3 derivative with the
// browser's established decoder. No model, synthesis, or subscription service.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const root=process.cwd(),dir=root+'/.cache/scroll-reader-correction-2026-10-22/audio';
const tmp=dir+'/browser-tmp';await mkdir(tmp,{recursive:true});process.env.TEMP=process.env.TMP=tmp;
const {chromium}=await import(pathToFileURL('D:/CodexStorage/workspaces/second-language-maintenance/.cache/browser-tools/package/index.mjs'));
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',env:{...process.env,TEMP:tmp,TMP:tmp},args:['--no-first-run']});
try{
 const page=await browser.newPage();await page.route('http://127.0.0.1:8153/__decode-leather',route=>route.fulfill({body:'<!doctype html><title>Offline material decoding</title>',contentType:'text/html'}));
 await page.goto('http://127.0.0.1:8153/__decode-leather');
 const decoded=await page.evaluate(async base64=>{
  const bytes=Uint8Array.from(atob(base64),c=>c.charCodeAt(0)),ctx=new OfflineAudioContext(1,1,44100),buffer=await ctx.decodeAudioData(bytes.buffer);
  const rate=buffer.sampleRate,length=buffer.length,bytesOut=new ArrayBuffer(44+length*2),view=new DataView(bytesOut);
  const text=(offset,value)=>[...value].forEach((c,i)=>view.setUint8(offset+i,c.charCodeAt(0)));
  text(0,'RIFF');view.setUint32(4,36+length*2,true);text(8,'WAVE');text(12,'fmt ');view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,1,true);view.setUint32(24,rate,true);view.setUint32(28,rate*2,true);view.setUint16(32,2,true);view.setUint16(34,16,true);text(36,'data');view.setUint32(40,length*2,true);
  const channels=Array.from({length:buffer.numberOfChannels},(_,i)=>buffer.getChannelData(i));
  for(let i=0;i<length;i++){const n=channels.reduce((sum,c)=>sum+c[i],0)/channels.length;view.setInt16(44+i*2,Math.round(Math.max(-1,Math.min(1,n))*32767),true);}
  const raw=new Uint8Array(bytesOut);let binary='';for(let i=0;i<raw.length;i+=16384)binary+=String.fromCharCode(...raw.subarray(i,i+16384));
  return {wav:btoa(binary),rate,duration:buffer.duration,originalChannels:buffer.numberOfChannels};
 },(await readFile(dir+'/altfuture-leather-stretched-hq-preview.mp3')).toString('base64'));
 await writeFile(dir+'/leather-decoded.wav',Buffer.from(decoded.wav,'base64'));delete decoded.wav;
 console.log(JSON.stringify(decoded));
}finally{await browser.close();}

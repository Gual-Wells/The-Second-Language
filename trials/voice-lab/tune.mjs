// Offline processing only. No provider calls, KV writes, or production data access.
import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {tuningAssets,filterFor} from './tuning-plan.mjs';
const root=new URL('../../',import.meta.url),path=p=>fileURLToPath(new URL(p,root)),ffmpeg=path('.cache/tools/ffmpeg.exe');
await mkdir(path('.cache/voice-lab/tuning'),{recursive:true});
function ff(args){const r=spawnSync(ffmpeg,['-hide_banner','-nostdin',...args],{encoding:'utf8',maxBuffer:4e6});if(r.status!==0)throw Error(r.stderr);return r.stderr;}
function stats(file,filter='anull'){const log=ff(['-i',file,'-af',`${filter},loudnorm=I=-20:TP=-2:LRA=11:print_format=json`,'-f','null','-']);return JSON.parse(log.slice(log.lastIndexOf('{')));}
const measurements=[],start=Date.now();
for(const a of tuningAssets){
 const raw=path(`.cache/voice-lab/raw/${a.sourceId}.mp3`),output=path(`.cache/voice-lab/static-web/prepared/${a.id}.mp3`),filter=filterFor(a.voiceId,a.profileId);
 let measured,normalization,matchedGain=0;
 if(a.profileId==='original'){
  await copyFile(path(`.cache/voice-lab/mastered/${a.sourceId}.mp3`),output);normalization='unchanged previous audition';
 }else{
  measured=stats(raw,filter);
  if(['input_i','input_tp','input_lra','input_thresh','target_offset'].every(k=>Number.isFinite(Number(measured[k]))))normalization=`loudnorm=I=-20:TP=-2:LRA=11:measured_I=${measured.input_i}:measured_TP=${measured.input_tp}:measured_LRA=${measured.input_lra}:measured_thresh=${measured.input_thresh}:offset=${measured.target_offset}:linear=true`;
  else normalization=Number.isFinite(Number(measured.input_tp))?`volume=${-8-Number(measured.input_tp)}dB`:'anull';
  ff(['-y','-i',raw,'-af',`${filter},${normalization},apad=pad_dur=0.08`,'-ar','24000','-ac','1','-c:a','libmp3lame','-b:a','128k',output]);
 }
 let final=stats(output);
 const reference=measurements.find(m=>m.sourceId===a.sourceId&&m.profileId==='original');
 if(reference){
  const delta=Number(reference.lufs)-Number(final.input_i),headroom=-1.2-Number(final.input_tp);
  matchedGain=Math.min(delta,headroom);
  if(Number.isFinite(matchedGain)&&Math.abs(matchedGain)>.15){
   // Render again from the untouched source, never from the encoded trial output.
   ff(['-y','-i',raw,'-af',`${filter},${normalization},volume=${matchedGain}dB,apad=pad_dur=0.08`,'-ar','24000','-ac','1','-c:a','libmp3lame','-b:a','128k',output]);final=stats(output);
  }else matchedGain=0;
 }
 const bytes=await readFile(output);
 const decoded=spawnSync(ffmpeg,['-hide_banner','-nostdin','-i',output,'-f','f32le','-ac','1','-ar','24000','pipe:1'],{maxBuffer:4e6});if(decoded.status!==0||decoded.stdout.length<400)throw Error('Empty or undecodable output: '+a.id);
 measurements.push({id:a.id,sourceId:a.sourceId,profileId:a.profileId,filter,normalization,matchedGain,sourceSha256:createHash('sha256').update(await readFile(raw)).digest('hex'),sha256:createHash('sha256').update(bytes).digest('hex'),bytes:bytes.length,duration:decoded.stdout.length/4/24000,lufs:final.input_i,truePeak:final.input_tp});
 if(measurements.length%15===0)console.log(JSON.stringify({processed:measurements.length,total:tuningAssets.length}));
}
await writeFile(path('.cache/voice-lab/tuning/measurements.json'),JSON.stringify({createdAt:new Date().toISOString(),elapsedSeconds:(Date.now()-start)/1000,apiCalls:0,files:measurements},null,2));
console.log(JSON.stringify({complete:measurements.length,seconds:(Date.now()-start)/1000,bytes:measurements.reduce((s,a)=>s+a.bytes,0),apiCalls:0}));

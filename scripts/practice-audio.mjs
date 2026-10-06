import {finishTaskBalances} from './check-balances.mjs';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import path from 'node:path';import {spawnSync} from 'node:child_process';import {createHash} from 'node:crypto';
import {publisherConfig} from './lib/publisher-config.mjs';
import {castAudioPlan} from '../protocol/voices.mjs';
const [command,filename]=process.argv.slice(2),{base,token}=await publisherConfig();
const plan=JSON.parse(await readFile(filename,'utf8'));if(!plan.setId||!Array.isArray(plan.segments))throw Error('音频计划须有 setId、segments');
const safe=s=>/^[A-Za-z0-9._:-]{1,110}$/.test(s||'');if(!safe(plan.setId)||plan.segments.some(s=>!safe(s.id)))throw Error('计划编号无效');
const name=id=>createHash('sha256').update(id).digest('hex').slice(0,24);
const dir=path.resolve('.cache/practice-audio',name(plan.setId));await mkdir(dir,{recursive:true});
let construction={};
if(command==='synthesize'){
 for(let folder=path.dirname(path.resolve(filename)),root=path.resolve('.');!path.relative(root,folder).startsWith('..');folder=path.dirname(folder)){
  try{const claim=JSON.parse(await readFile(path.join(folder,'claim.json'),'utf8'));if(!safe(claim.request?.id)||!safe(claim.claimToken))throw Error('建设领取文件无效');construction={requestId:claim.request.id,claimToken:claim.claimToken};break;}
  catch(e){if(e.code!=='ENOENT')throw e;}
  if(folder===root)break;
 }
 if(!construction.requestId&&path.relative(path.resolve('work/expression'),path.resolve(filename)).split(path.sep)[0]!=='..')throw Error('正式练习合成须先领取申请，音频计划放在对应 claim.json 的目录或子目录');
}
async function control(endpoint,body){const r=await fetch(new URL(endpoint,base),{method:'POST',headers:{authorization:`Bearer ${token}`,'content-type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(300000)});const j=await r.json();if(!r.ok)throw Error(j.error||`API ${r.status}`);return j;}
async function download(id){const dest=path.join(dir,`${name(id)}.mp3`);try{return await readFile(dest);}catch{}const r=await fetch(new URL(`/api/practice/media/${encodeURIComponent(id)}`,base),{headers:{authorization:`Bearer ${token}`}});if(!r.ok)throw Error(`音频 ${id} 未完成：${r.status}`);const bytes=Buffer.from(await r.arrayBuffer());await writeFile(dest,bytes);return bytes;}
try{
if(command==='cast'||command==='synthesize'){
 castAudioPlan(plan);await writeFile(filename,JSON.stringify(plan,null,2)+'\n');
 if(command==='cast')console.log(JSON.stringify(plan.voiceAllocation||{voice:'af_bella'}));
 else for(const segment of plan.segments){const result=await control('/api/practice/publisher/media/synthesize',{...segment,setId:plan.setId,...construction});await writeFile(path.join(dir,`${name(segment.id)}.json`),JSON.stringify(result,null,2));console.log(JSON.stringify({id:segment.id,state:result.state,reused:result.reused||false}));if(result.state!=='ready'){if(construction.requestId)await control('/api/practice/publisher/fail',{id:construction.requestId,claimToken:construction.claimToken}).catch(()=>{});console.log('已有进度保留；停止自动建设，核对失败或充值后由本人明确要求继续。');process.exitCode=1;break;}await download(segment.id);}
}else if(command==='assemble'){
 const ffmpeg=process.env.SECOND_LANGUAGE_FFMPEG||path.resolve('.cache/tools/ffmpeg.exe');
 const run=args=>{const r=spawnSync(ffmpeg,args,{encoding:'utf8',windowsHide:true});if(r.status!==0)throw Error(r.stderr||'ffmpeg 失败');return r.stderr;};
 for(const assembly of plan.assemblies||[]){
  if(!safe(assembly.id)||!Array.isArray(assembly.segments)||!assembly.segments.length)throw Error('整段计划无效');
  const chunks=[],cues=[];let seconds=0;
  const silence=duration=>{if(!Number.isFinite(duration)||duration<0||duration>120)throw Error('停顿时间无效');const pcm=Buffer.alloc(Math.round(duration*24000)*2);chunks.push(pcm);seconds+=pcm.length/48000;};
  silence(assembly.initialSilenceSeconds||0);
  for(const entry of assembly.segments){const segment=plan.segments.find(x=>x.id===entry.id);if(!segment)throw Error('缺少计划片段');await download(entry.id);const pcmFile=path.join(dir,`${name(entry.id)}.pcm`);run(['-y','-v','error','-i',path.join(dir,`${name(entry.id)}.mp3`),'-f','s16le','-ar','24000','-ac','1',pcmFile]);const pcm=await readFile(pcmFile);const start=seconds;chunks.push(pcm);seconds+=pcm.length/48000;cues.push({id:entry.scriptId||entry.id,speaker:entry.speaker||segment.speakerId||segment.voice||'narrator',speakerId:segment.speakerId||null,voice:segment.voice,text:segment.text,translation:entry.translation||'',start,end:seconds});silence(entry.gapAfterSeconds??.3);}
  const pcmFile=path.join(dir,`${name(assembly.id)}.pcm`),mp3=path.join(dir,`${name(assembly.id)}.mp3`);await writeFile(pcmFile,Buffer.concat(chunks));run(['-y','-v','error','-f','s16le','-ar','24000','-ac','1','-i',pcmFile,'-codec:a','libmp3lame','-b:a','128k',mp3]);
  const stderr=run(['-hide_banner','-i',mp3,'-f','null',process.platform==='win32'?'NUL':'/dev/null']),m=stderr.match(/Duration: (\d+):(\d+):(\d+\.\d+)/);if(!m)throw Error('无法测得音频时长');const measured=Number(m[1])*3600+Number(m[2])*60+Number(m[3]),bytes=await readFile(mp3);
  const url=new URL(`/api/practice/publisher/media/${encodeURIComponent(assembly.id)}/upload`,base);url.searchParams.set('set',plan.setId);url.searchParams.set('seconds',String(measured));const r=await fetch(url,{method:'PUT',headers:{authorization:`Bearer ${token}`,'content-type':'audio/mpeg'},body:bytes});const result=await r.json();if(!r.ok)throw Error(result.error||'整段上传失败');
  await writeFile(path.join(dir,`${name(assembly.id)}.cues.json`),JSON.stringify({id:assembly.id,seconds:measured,pcmSeconds:seconds,cues,final:result},null,2));console.log(JSON.stringify({id:assembly.id,state:result.state,seconds:measured,cuesFile:path.join(dir,`${name(assembly.id)}.cues.json`)}));
 }
}else if(command==='verify'){
 for(const {id}of plan.assemblies||plan.segments){const result=await control(`/api/practice/publisher/media/${encodeURIComponent(id)}/verify`,{});await writeFile(path.join(dir,`${name(id)}.verification.json`),JSON.stringify(result,null,2));console.log(JSON.stringify({id,verified:true,reused:result.reused||false}));}
}else throw Error('用法：practice-audio.mjs cast|synthesize|assemble|verify plan.json；只由 Cloudflare 调用模型');
}catch(error){
 if(construction.requestId)await control('/api/practice/publisher/fail',{id:construction.requestId,claimToken:construction.claimToken}).catch(()=>{});
 throw error;
}finally{if(['synthesize','assemble','verify'].includes(command))await finishTaskBalances();}

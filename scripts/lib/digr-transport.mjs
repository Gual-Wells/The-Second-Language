// Host transport only. The pinned repository owns all DIGR execution semantics.
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
export const DIGR_REPOSITORY='Gual-Wells/Deep-Iteration-GPT-Runtime';
export const DIGR_CACHE='D:/CodexStorage/runtimes/digr';
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const relative=value=>typeof value==='string'&&/^[A-Za-z0-9_./-]+$/.test(value)&&!value.split('/').some(x=>!x||x==='.'||x==='..')&&!path.isAbsolute(value);
async function dPath(directory){await fs.mkdir(directory,{recursive:true});const real=await fs.realpath(directory);if(process.platform==='win32'&&!/^D:[\\/]/i.test(real))throw Error('DIGR运行文件须实存D盘');return real;}
async function fixed(file,bytes){await dPath(path.dirname(file));try{await fs.writeFile(file,bytes,{flag:'wx'});}catch(e){if(e.code!=='EEXIST')throw e;if(!bytes.equals(await fs.readFile(file)))throw Error('DIGR固定版本缓存已改变');}}
export async function acquireDigrRuntime({message,cacheRoot=DIGR_CACHE,fetchImpl=fetch}={}){
 if(typeof message!=='string'||!['DIGR','深度迭代'].some(x=>message.trimStart().startsWith(x)))throw Error('需要真实DIGR候选消息');
 const requests=[];
 async function get(url,{mutable=false}={}){const r=await fetchImpl(url,{headers:{'User-Agent':'Second-Language-DIGR-Host','Accept':'application/vnd.github+json',...(mutable?{'Cache-Control':'no-cache','Pragma':'no-cache'}:{})},redirect:'error',signal:AbortSignal.timeout(30000)});if(!r.ok){await r.body?.cancel();throw Error('DIGR仓库获取失败 '+r.status);}const bytes=Buffer.from(await r.arrayBuffer());requests.push({url,sourceKind:'direct_https',freshness:mutable?'live_direct':'immutable_sha',status:r.status,sha256:hash(bytes)});return bytes;}
 const api='https://api.github.com/repos/'+DIGR_REPOSITORY;
 const [refBytes,branchBytes]=await Promise.all([get(api+'/git/ref/heads/stable',{mutable:true}),get(api+'/branches/stable',{mutable:true})]);
 const ref=JSON.parse(refBytes),branch=JSON.parse(branchBytes),sha=ref.object?.sha;
 if(ref.ref!=='refs/heads/stable'||ref.object?.type!=='commit'||branch.name!=='stable'||!/^[a-f0-9]{40}$/.test(sha||'')||branch.commit?.sha!==sha)throw Error('DIGR stable的ref与branch不一致');
 const raw=rel=>`https://raw.githubusercontent.com/${DIGR_REPOSITORY}/${sha}/${rel}`;
 const [manifestBytes,versionBytes]=await Promise.all([get(raw('manifest.json')),get(raw('VERSION'))]);
 const manifest=JSON.parse(manifestBytes),version=versionBytes.toString('utf8').trim();if(manifest.version!==version)throw Error('DIGR manifest与VERSION不一致');
 const tree=JSON.parse(await get(api+'/git/trees/'+sha+'?recursive=1'));if(tree.truncated)throw Error('DIGR仓库树不完整');
 const startup=manifest.startup_slice;if(!Array.isArray(startup)||!startup.length||startup.some(x=>!relative(x)))throw Error('本宿主需有效startup_slice；未解释其他版本执行语义');
 const wanted=new Set(['manifest.json','VERSION',...startup]);
 const entries=tree.tree.filter(e=>wanted.has(e.path)||/^runtime\/[A-Za-z0-9_/-]+\.py$/.test(e.path));
 if(entries.some(e=>e.type!=='blob'||e.mode!=='100644'||!relative(e.path))||[...wanted].some(x=>!entries.some(e=>e.path===x))||!entries.some(e=>e.path==='runtime/run_session.py'))throw Error('DIGR宿主运行文件缺失或不是普通文件');
 const cache=await dPath(cacheRoot),directory=await dPath(path.join(cache,sha)),records=[];let cursor=0;
 await Promise.all(Array.from({length:4},async()=>{while(cursor<entries.length){const e=entries[cursor++];let bytes;if(e.path==='manifest.json')bytes=manifestBytes;else if(e.path==='VERSION')bytes=versionBytes;else{try{bytes=await fs.readFile(path.join(directory,e.path));}catch(err){if(err.code!=='ENOENT')throw err;bytes=await get(raw(e.path));}}const blob=createHash('sha1').update(Buffer.from('blob '+bytes.length+'\0')).update(bytes).digest('hex');if(blob!==e.sha)throw Error('DIGR固定Git对象不一致');await fixed(path.join(directory,e.path),bytes);records.push({path:e.path,bytes:bytes.length,sha256:hash(bytes),gitBlob:e.sha});}}));
 return {schemaVersion:1,repository:DIGR_REPOSITORY,requestedRef:'stable',pinnedCommit:sha,version,protocol:manifest.protocol,runtimeDirectory:directory,messageSha256:hash(Buffer.from(message)),manifestSha256:hash(manifestBytes),versionSha256:hash(versionBytes),refObservation:ref,branchObservation:branch,acquiredAt:new Date().toISOString(),requests,files:records.sort((a,b)=>a.path.localeCompare(b.path))};
}

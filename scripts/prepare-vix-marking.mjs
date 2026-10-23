import {createHash,randomUUID} from 'node:crypto';
import {copyFile,lstat,mkdir,readFile,realpath,rename,rm,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {prepareVix} from './prepare-vix.mjs';
import {familyRecords} from './lib/vix-index.mjs';
import {validateVixDate} from './lib/vix-date.mjs';
import {canonicalSourcePackage} from '../protocol/current-affairs.mjs';

const protocol='second-language-vix-marking/1',markerName='vix-marking-workspace.json';
const hash=value=>createHash('sha256').update(canonicalSourcePackage(value)).digest('hex');

export async function prepareVixMarking(date,{root=process.cwd(),log=console.log}={}){
  root=await realpath(root);
  if(process.platform==='win32'&&!/^D:\\/i.test(root))throw Error('VIX标注工作副本须实际存于D盘');
  const {lock}=await prepareVix(date,{root,log});
  const run=path.join(root,'work/runs',date),directory=path.join(run,'vix-marking');
  const selection=JSON.parse(await readFile(path.join(run,'selection.json'),'utf8'));
  validateVixDate(selection);familyRecords(selection);
  if(selection.studyDate!==date||selection.vixInputCommit!==lock.commit)throw Error('标注工作副本须对应本日已固定选词及原输入commit');
  const identity={protocol,studyDate:date,inputCommit:lock.commit,selectionDigest:hash(selection)};
  async function existing(){
    let stat;try{stat=await lstat(directory);}catch(error){if(error.code==='ENOENT')return null;throw error;}
    if(!stat.isDirectory()||stat.isSymbolicLink()||await realpath(directory)!==directory)throw Error('VIX标注工作副本路径无效；不得覆盖或指向原输入');
    let marker;try{marker=JSON.parse(await readFile(path.join(directory,markerName),'utf8'));}catch{throw Error('已有VIX标注目录缺少合法工作副本标记；不覆盖、不兼容迁移');}
    if(Object.entries(identity).some(([key,value])=>marker[key]!==value))throw Error('VIX标注工作副本与原输入或selection摘要不一致；保留已有标注，不覆盖');
    await readFile(path.join(directory,'data/seed-access/manifest.json'));
    await readFile(path.join(directory,'tools/build-seed-access.mjs'));
    return {directory,...identity,resumed:true};
  }
  const prior=await existing();if(prior){log(`复用原VIX标注工作副本，不覆盖已有标注：${directory}`);return prior;}
  const staging=path.join(run,`.vix-marking-${randomUUID()}.tmp`);
  const relative=path.relative(run,staging);
  if(!relative||relative.startsWith('..')||path.isAbsolute(relative))throw Error('VIX标注暂存路径无效');
  await mkdir(staging);
  try{
    for(const input of lock.inputs.filter(item=>/^(data|tools)\//.test(item.path))){
      const target=path.join(staging,...input.path.split('/'));await mkdir(path.dirname(target),{recursive:true});
      // Independent file bytes: never hardlink the writable marking copy to its input.
      await copyFile(path.join(lock.localDirectory,...input.path.split('/')),target);
    }
    await mkdir(path.join(staging,'data/seed-access/dates'),{recursive:true});
    await writeFile(path.join(staging,markerName),JSON.stringify({...identity,createdAt:new Date().toISOString()},null,2)+'\n',{flag:'wx'});
    try{await rename(staging,directory);}catch(error){const winner=await existing();if(!winner)throw error;return winner;}
  }finally{await rm(staging,{recursive:true,force:true});}
  log(`VIX标注仅使用此工作副本；原输入保持不可变：${directory}`);
  return {directory,...identity,resumed:false};
}

if(process.argv[1]&&pathToFileURL(path.resolve(process.argv[1])).href===import.meta.url){
  if(process.argv.length!==3)throw Error('用法: node scripts/prepare-vix-marking.mjs YYYY-MM-DD');
  const result=await prepareVixMarking(process.argv[2]);console.log(JSON.stringify(result,null,2));
}

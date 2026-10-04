import {readFile,writeFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import { codexHandoffPrompt } from '../protocol/speaking/contract.mjs';
import { compensationPlan } from '../protocol/speaking/routes.mjs';

const manifestFile=process.argv[2];
if(!manifestFile)throw new Error('用法：node scripts/speaking-handoff.mjs 私有本地manifest.json');
const manifest=JSON.parse(await readFile(manifestFile,'utf8'));
if(!/^[A-Za-z0-9._-]{1,110}$/.test(manifest.attemptId??'')||!Array.isArray(manifest.calls))throw new Error('接管清单无效');
const root=path.dirname(path.resolve(manifestFile));
const output=path.resolve('work/expression/reviews',manifest.attemptId,'speaking',manifest.jobId??'collection');
if(!/^[A-Za-z0-9._-]{1,110}$/.test(manifest.jobId??'collection'))throw new Error('采集编号无效');
await mkdir(output,{recursive:true});
async function immutable(file,text){try{await writeFile(file,text,{flag:'wx'});}catch(error){if(error.code!=='EEXIST')throw error;if(await readFile(file,'utf8')!==text)throw new Error('相同采集位置已有不同返回；不能覆盖原件。');}}
const calls=[];
for(const [i,item]of manifest.calls.entries()){
 const source=path.resolve(root,item.file);
 const relative=path.relative(root,source);
 if(relative.startsWith('..'+path.sep)||relative==='..'||path.isAbsolute(relative))throw new Error('返回文件必须在私有接管目录内');
 const collected=JSON.parse(await readFile(source,'utf8'));
 const stem=`${String(i+1).padStart(2,'0')}-${item.routeId.replace(/[^a-z0-9_-]/gi,'_')}`;
 await mkdir(path.join(output,stem),{recursive:true});
 if(collected.raw!=null)await immutable(path.join(output,stem,'raw.json'),collected.raw);
 await immutable(path.join(output,stem,'parsed.json'),JSON.stringify(collected.parsed??null,null,2));
 await immutable(path.join(output,stem,'metadata.json'),JSON.stringify(collected.metadata??null,null,2));
 calls.push({routeId:item.routeId,taskId:item.taskId??'baseline',rawFile:collected.raw!=null?`${stem}/raw.json`:null,parsedFile:`${stem}/parsed.json`,metadataFile:`${stem}/metadata.json`,metadata:collected.metadata,parsed:collected.parsed});
}
const handoff={...manifest,calls,compensation:compensationPlan(calls),originalResponsesPreserved:true};
await writeFile(path.join(output,'handoff.json'),JSON.stringify(handoff,null,2));
await writeFile(path.join(output,'READ-FIRST.md'),`${codexHandoffPrompt}\n\n本地文件：handoff.json 与其列出的全部 raw/parsed/metadata。原声和题目快照见 manifest 的定位。自动整合没有裁决语义冲突。测试状态：${Boolean(manifest.test)}。\n`);
console.log(JSON.stringify({directory:output,calls:calls.length,qualityScope:handoff.compensation.qualityScope,productionWrites:false}));

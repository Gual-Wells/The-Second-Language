import {finishTaskBalances} from './check-balances.mjs';
import { readFile,writeFile,mkdir } from 'node:fs/promises';
import { appendFileSync } from 'node:fs';
import { createHash,randomUUID } from 'node:crypto';
import { pcmFromWav,assess,normalizeSentence } from './lib/speaking/tencent-soe.mjs';
const planFile=process.argv[2];
if(!planFile)throw Error('用法：node scripts/speaking-assess-word.mjs 私有单词计划.json [--dry-run]');
const plan=JSON.parse(await readFile(planFile,'utf8'));
if(!['learner-confirmed-utterance','codex-checked-utterance'].includes(plan.referenceSource)||!/^[a-zA-Z]+(?:[-'][a-zA-Z]+)*$/.test(plan.word??''))throw Error('单词必须来自本人实际原话。');
if(!/^[a-f0-9]{64}$/.test(plan.originalDigest??'')||!Number.isFinite(plan.clipStartSeconds)||plan.clipStartSeconds<0||![0,4].includes(plan.evalMode))throw Error('单词计划需要原声摘要、起点及模式 0/4。');
const config=JSON.parse(await readFile(process.env.SECOND_LANGUAGE_SPEAKING_CONFIG||'.cache/speaking-provider.json','utf8'));
if(config.provider!=='tencent-soe-n')throw Error('需要腾讯 SOE-N 配置。');
const wav=await readFile(plan.audioPath),{pcm,seconds}=pcmFromWav(wav);
if(seconds>60)throw Error('单词音频最多 60 秒。');
const metadata={audio:{digest:createHash('sha256').update(wav).digest('hex'),seconds},originalDigest:plan.originalDigest,clipStartSeconds:plan.clipStartSeconds,referenceText:plan.word,referenceSource:plan.referenceSource,clipBoundarySource:plan.clipBoundarySource??'unverified',scoreCoeff:config.scoreCoeff??4,evalMode:plan.evalMode,phonemeLetters:Boolean(plan.phonemeLetters),ipaOutput:Boolean(plan.ipaOutput),recMode:1};
if(process.argv.includes('--dry-run'))console.log(JSON.stringify({prepared:true,seconds,mode:plan.evalMode,providerCalled:false}));
else{
 await mkdir('.cache/speaking/targeted',{recursive:true});const stem=`.cache/speaking/targeted/${randomUUID()}`;
 await writeFile(`${stem}-request.json`,JSON.stringify(metadata,null,2),{flag:'wx'});await writeFile(`${stem}-messages.jsonl`,'',{flag:'wx'});
 let messages;
 try{messages=await assess(config,pcm,{evalMode:plan.evalMode,referenceText:plan.word,phonemeLetters:metadata.phonemeLetters,ipaOutput:metadata.ipaOutput,recMode:1,onMessage:raw=>appendFileSync(`${stem}-messages.jsonl`,JSON.stringify({receivedAt:new Date().toISOString(),raw})+'\n')});}
 catch(error){await writeFile(`${stem}-error.json`,JSON.stringify({state:'outcome_unknown',error:String(error.message),productionWrites:false}),{flag:'wx'});console.log(JSON.stringify({state:'failed',stem,error:String(error.message),productionWrites:false}));process.exitCode=1;}
 if(messages){
  await writeFile(`${stem}-raw.json`,JSON.stringify({metadata,messages},null,2),{flag:'wx'});
  const result=normalizeSentence(messages,metadata);
  result.mode=plan.evalMode===4?'reference-assisted-word-correction':'reference-assisted-word';result.parameters={...metadata,audio:undefined};
  result.quality.clipBoundarySource=metadata.clipBoundarySource;
  result.limitations.push('单词模式与句子模式的分数口径可能不同；保留原始量纲，不混算。','从连续语音提取的单词受切点和相邻词影响；单词结果不能代替原句听审。');
  await writeFile(`${stem}.json`,JSON.stringify(result,null,2),{flag:'wx'});
  const phones=result.words.flatMap(w=>w.phones);
  console.log(JSON.stringify({result:`${stem}.json`,mode:result.mode,wordCount:result.words.length,phones:phones.length,referencePhones:phones.filter(p=>p.ReferencePhone).length,letterMappings:phones.filter(p=>p.ReferenceLetter).length,expectedStressTrue:phones.filter(p=>p.Stress===true).length,detectedStressTrue:phones.filter(p=>p.DetectedStress===true).length,judgmentsVerified:false,productionWrites:false}));
 }
}

await finishTaskBalances();

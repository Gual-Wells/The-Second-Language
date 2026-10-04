import {finishTaskBalances} from './check-balances.mjs';
import { readFile,writeFile,mkdir } from 'node:fs/promises';
import { appendFileSync } from 'node:fs';
import { createHash,randomUUID } from 'node:crypto';
import { pcmFromWav,assess,normalizeSentence } from './lib/speaking/tencent-soe.mjs';

const planFile = process.argv[2];
if (!planFile) throw new Error('用法：node scripts/speaking-assess-sentence.mjs 私有专项计划.json [--dry-run]');
const plan = JSON.parse(await readFile(planFile,'utf8'));
if (plan.referenceSource !== 'learner-confirmed-utterance' && plan.referenceSource !== 'codex-checked-utterance') throw new Error('专项参考必须是本人实际原话，不能使用范文。');
if (!/^[a-f0-9]{64}$/.test(plan.originalDigest ?? '') || !Number.isFinite(plan.clipStartSeconds) || plan.clipStartSeconds < 0) throw new Error('需要原声摘要及裁剪起点。');
const configFile = process.env.SECOND_LANGUAGE_SPEAKING_CONFIG || '.cache/speaking-provider.json';
const config = JSON.parse(await readFile(configFile,'utf8'));
if(config.provider!=='tencent-soe-n')throw new Error('专项工具需要腾讯 SOE-N 配置。');
const original = await readFile(plan.audioPath), { pcm,seconds }=pcmFromWav(original);
const referenceText = (await readFile(plan.referencePath,'utf8')).trim();
if(seconds>60 || !referenceText || referenceText.split(/\s+/).length>30)throw new Error('句子专项不超过 30 词、60 秒。');
const metadata={audio:{digest:createHash('sha256').update(original).digest('hex'),seconds},originalDigest:plan.originalDigest,clipStartSeconds:plan.clipStartSeconds,referenceText,referenceSource:plan.referenceSource,scoreCoeff:config.scoreCoeff??4};
if(process.argv.includes('--dry-run'))console.log(JSON.stringify({prepared:true,seconds,mode:'sentence',providerCalled:false}));
else{
 await mkdir('.cache/speaking/targeted',{recursive:true});
 const stem=`.cache/speaking/targeted/${randomUUID()}`;
 await writeFile(`${stem}-request.json`,JSON.stringify(metadata,null,2),{flag:'wx'});
 await writeFile(`${stem}-messages.jsonl`,'',{flag:'wx'});
 let messages;
 try { messages=await assess(config,pcm,{evalMode:1,referenceText,sentenceInfoEnabled:1,onMessage:raw=>appendFileSync(`${stem}-messages.jsonl`,JSON.stringify({receivedAt:new Date().toISOString(),raw})+'\n')}); }
 catch(error){await writeFile(`${stem}-error.json`,JSON.stringify({state:'outcome_unknown',error:String(error.message),productionWrites:false},null,2),{flag:'wx'});throw error;}
 await writeFile(`${stem}-raw.json`,JSON.stringify({metadata,messages},null,2),{flag:'wx'});
 const normalized=normalizeSentence(messages,metadata);
 await writeFile(`${stem}.json`,JSON.stringify(normalized,null,2),{flag:'wx'});
 console.log(JSON.stringify({result:`${stem}.json`,seconds,wordCount:normalized.words.length,phoneCount:normalized.words.reduce((n,w)=>n+w.phones.length,0),judgmentsVerified:false,productionWrites:false}));
}

await finishTaskBalances();

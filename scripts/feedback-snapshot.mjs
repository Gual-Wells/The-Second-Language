import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import { publisherConfig } from './lib/publisher-config.mjs';
const date = process.argv[2];
if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) throw new Error('用法: node scripts/feedback-snapshot.mjs YYYY-MM-DD');
const target = path.resolve('work/runs', date, 'feedback.json');
async function reuseSnapshot(){
  try{
    const saved=JSON.parse(await readFile(target,'utf8'));
    if(!saved||!Number.isFinite(Date.parse(saved.capturedAt))||!saved.data||typeof saved.data!=='object')throw Error('已有反馈快照无效；保留原件待核对，不刷新');
    console.log(`复用原学习反馈快照，不覆盖：${target}`);return true;
  }catch(error){if(error.code==='ENOENT')return false;throw error;}
}
if(await reuseSnapshot())process.exit(0);
const { base, token } = await publisherConfig();
const response = await fetch(new URL('/api/feedback-snapshot', base), { headers: { authorization: `Bearer ${token}` } });
if (!response.ok) throw new Error(`学习反馈读取失败: HTTP ${response.status}`);
await mkdir(path.dirname(target), { recursive: true });
const baselineBytes=await readFile(new URL('../protocol/learner-baseline.json',import.meta.url),'utf8');
const learnerBaseline=JSON.parse(baselineBytes);
if(learnerBaseline.schemaVersion!==1||learnerBaseline.status!=='provisional-not-a-proficiency-test'||learnerBaseline.recognizedVocabularySize!==null)throw Error('初始学习先验无效；不补造个人词汇量或等级');
const text=JSON.stringify({ capturedAt: new Date().toISOString(), data: await response.json(), learnerBaseline, learnerBaselineDigest:createHash('sha256').update(baselineBytes).digest('hex') }, null, 2);
try{await writeFile(target,text,{flag:'wx'});console.log(`学习反馈快照已写入 ${target}`);}
catch(error){if(error.code!=='EEXIST')throw error;if(!await reuseSnapshot())throw Error('反馈快照并发写入结果不可核对');}

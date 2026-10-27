import fs from 'node:fs/promises';
import path from 'node:path';
import {assembleRun,AUTHORING_POLICY} from './lib/teaching-authoring.mjs';
import {DAILY_WORD_COUNT} from '../web/annotations.js';
import {chapterFootprint} from './lib/chapter-footprint.mjs';
const date=process.argv[2];
if(!/^20\d{2}-\d{2}-\d{2}$/.test(date||''))throw Error('用法：node scripts/assemble-teaching.mjs DATE');
const result=await assembleRun(process.cwd(),date),run=path.resolve('work/runs',date);
if(result.words.length!==DAILY_WORD_COUNT)throw Error(`正式日课须有${DAILY_WORD_COUNT}主词；未输出正式候选`);
await fs.writeFile(path.join(run,'teaching/chapter.md'),result.markdown);
if(result.parsed.format==='usage-context-v1')await fs.writeFile(path.join(run,'teaching/context-sources.json'),JSON.stringify(result.contextSources,null,2)+'\n');
else await fs.writeFile(path.join(run,'teaching/article-sources.json'),JSON.stringify(result.articles.map(({id,title,sourceUrls})=>({id,title,sourceUrls})),null,2)+'\n');
const footprint=chapterFootprint(result.markdown);
console.log(JSON.stringify({policy:result.authoringPolicy||AUTHORING_POLICY,format:result.parsed.format||'three-parts-v1',output:`work/runs/${date}/teaching/chapter.md`,words:result.words.length,articles:result.articles.length,contexts:result.parsed.contexts?.length,uses:result.parsed.uses.size,sentences:result.parsed.sentences.length,
  footprint,
  notice:'仅完成材料去向、规模观察与结构装配。实际审阅双教材全义、真实语境候选取优、多份增量、原文与整份译文；统计不设发布字数门槛，未写入正式章节或调用音频。'},null,2));

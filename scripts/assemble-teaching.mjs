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
await fs.writeFile(path.join(run,'teaching/article-sources.json'),JSON.stringify(result.articles.map(({id,title,sourceUrls})=>({id,title,sourceUrls})),null,2)+'\n');
const footprint=chapterFootprint(result.markdown);
console.log(JSON.stringify({policy:AUTHORING_POLICY,output:`work/runs/${date}/teaching/chapter.md`,words:result.words.length,articles:result.articles.length,uses:result.parsed.uses.size,sentences:result.parsed.sentences.length,
  footprint:{partOne:footprint.partOne,partTwo:footprint.partTwo,partThree:footprint.partThree,scale:footprint.scale,notice:footprint.notice},
  notice:'仅完成材料去向、规模观察与结构装配。实际通读教材、各篇文章和译文，按QUALITY_SCALE做保质精简后再采用；统计不设发布字数门槛，未写入正式章节或调用音频。'},null,2));

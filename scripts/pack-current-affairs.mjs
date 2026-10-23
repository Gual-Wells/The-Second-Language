import path from 'node:path';
import fs from 'node:fs/promises';
import {buildChapterSources} from './lib/current-affairs-package.mjs';

const [date,file]=process.argv.slice(2);
if(!date||!file)throw Error('用法: node scripts/pack-current-affairs.mjs YYYY-MM-DD work/runs/DATE/source-notes.json');
const result=await buildChapterSources(process.cwd(),date,JSON.parse(await fs.readFile(path.resolve(file),'utf8')));
console.log(JSON.stringify({date,chapterDigest:result.chapterDigest,sourceDigest:result.sourceDigest,sources:result.sourcePackage.sources.length,notice:'来源已绑定成稿；结构与原文摘要核对不能代替实际阅读、事实判断和全义语义审阅。'},null,2));

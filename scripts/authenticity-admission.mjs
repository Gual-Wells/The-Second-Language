// Read-only actual-original progress for the current integrated author files.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {studyDate} from './lib/digr-project.mjs';
import {selectedWordCount} from '../protocol/chapter-size.mjs';
import {auditAuthenticity} from './lib/authenticity-audit.mjs';
import {authenticityAlarm} from '../protocol/fallback-appeals.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),[date,flag,list]=process.argv.slice(2);
studyDate(date);if(flag!==undefined&&(flag!=='--words'||!list||process.argv.length!==5))throw Error('用法：authenticity-admission.mjs DATE [--words W001,W002,...]');
const run=path.join(root,'work/runs',date),read=async f=>JSON.parse(await fs.readFile(path.join(run,f),'utf8'));
const [selection,lock]=await Promise.all([read('selection.json'),read('vix-source.json')]);const expected=selectedWordCount(selection,lock);
const folder=path.join(run,'teaching/authored'),names=(await fs.readdir(folder)).filter(n=>/^word-[A-Za-z0-9_-]+\.json$/.test(n));
const all=await Promise.all(names.map(async n=>JSON.parse(await fs.readFile(path.join(folder,n),'utf8'))));
if(all.length!==expected||new Set(all.map(w=>w.wordId)).size!==expected||all.some(w=>!selection.mainWords.some(s=>s.text===w.text)))throw Error('当前作者稿与完整冻结主词范围不一致');
const ids=list?.split(',');if(ids&&(new Set(ids).size!==ids.length||ids.some(id=>!all.some(w=>w.wordId===id))))throw Error('指定词组无效，不缩小或伪造全章分母');
const words=ids?all.filter(w=>ids.includes(w.wordId)):all;
const measured=await auditAuthenticity(root,words,{strictWitnesses:true});
console.log(JSON.stringify({scope:{wholeChapter:!ids,wordIds:words.map(w=>w.wordId),wordCount:words.length,fullChapterWordCount:expected},coverage:measured,authenticityAlarm:authenticityAlarm(measured),publicationAdmission:{state:"not-reviewed",note:"比例不授予出版权限；每份教学例句均须逐例申诉获准"}},null,2));

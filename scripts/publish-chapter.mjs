import {finishTaskBalances} from './check-balances.mjs';
import { readFile,writeFile } from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import { publisherConfig } from './lib/publisher-config.mjs';
import {validatePublishedVixReceipt} from './lib/vix-publication.mjs';
import {canonicalSourcePackage} from '../protocol/current-affairs.mjs';
import {publishChapterEvidence} from './lib/publish-chapter-evidence.mjs';
import {verifyChapterPublication} from './lib/chapter-publication-preflight.mjs';
import {verifyReaderRelease} from './lib/reader-release.mjs';
import {requiredReaderLayout} from '../protocol/reader-layout.mjs';
const date = process.argv[2];
if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) throw new Error('用法: node scripts/publish-chapter.mjs YYYY-MM-DD');
const { base, token } = await publisherConfig();
const folder = path.resolve('chapters', date);
const chapter = JSON.parse(await readFile(path.join(folder, 'chapter.json'), 'utf8'));
const meta = JSON.parse(await readFile(path.join(folder, 'meta.json'), 'utf8'));
if (!/^[0-9a-f]{40}$/.test(meta.vixCommit || '') || !/^[0-9a-f]{40}$/.test(meta.protocolCommit || '')) throw new Error('缺少已提交的 VIX 或课程协议 commit');
let vixReceipt;
try {vixReceipt=JSON.parse(await readFile(path.resolve('work/runs',date,'vix-publication.json'),'utf8'));}
catch(error){if(error.code==='ENOENT')throw new Error('缺少本次VIX发布回执；先核对原标注提交，不重新选词');throw error;}
validatePublishedVixReceipt(vixReceipt,{studyDate:date,inputCommit:chapter.vixInputCommit,selectionDigest:chapter.sourcePackage?.selectionDigest,vixCommit:meta.vixCommit});
const runId = meta.runId || date;
// Complete local, read-only admission before any permanent upload or stage.
await verifyChapterPublication({root:process.cwd(),date,chapter,meta});
await verifyReaderRelease({base,required:requiredReaderLayout(chapter.markdown),root:process.cwd()});
const hash=text=>createHash('sha256').update(text).digest('hex');
async function post(route, body) {
  const response = await fetch(new URL(route, base), { method: 'POST', headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' }, body: JSON.stringify(body) });
  const payload = await response.json(); if (!response.ok) throw new Error(`${route}: ${payload.error || response.status}`); return payload;
}
await publishChapterEvidence(process.cwd(),date,chapter,{base,token});
const staged = await post('/api/publish/stage', { ...chapter, runId, vixCommit: meta.vixCommit, protocolCommit: meta.protocolCommit });
if (staged.digest !== chapter.digest || staged.sourceDigest !== chapter.sourceDigest) throw new Error('后端暂存正文/来源摘要与本地章节不一致');
if(staged.number && staged.number!==chapter.number){
  chapter.number=meta.number=staged.number;
  await writeFile(path.join(folder,'chapter.json'),JSON.stringify(chapter));
  await writeFile(path.join(folder,'meta.json'),JSON.stringify(meta,null,2));
}
const published = await post('/api/publish/commit', { runId, digest: staged.digest });
if (published.digest !== chapter.digest || published.sourceDigest !== chapter.sourceDigest) throw new Error('后端发布正文/来源摘要不一致');
const chapterResponse=await fetch(new URL(`/api/chapters/${encodeURIComponent(date)}?digest=${chapter.digest}`,base),{headers:{authorization:`Bearer ${token}`}});
if(!chapterResponse.ok)throw Error('已发布正文回读失败；保留当前发布身份，不重新选词');
const chapterRead=await chapterResponse.json();
if(typeof chapterRead.markdown!=='string'||hash(chapterRead.markdown)!==chapter.digest)throw Error('已发布正文原件摘要不符');
const sourceResponse=await fetch(new URL(`/api/chapters/${encodeURIComponent(date)}/sources?digest=${chapter.digest}`,base),{headers:{authorization:`Bearer ${token}`}});
if(!sourceResponse.ok)throw Error('已发布来源包回读失败；保留当前发布身份，不重新选词');
const sourceRead=await sourceResponse.json();
if(sourceRead.sourceDigest!==chapter.sourceDigest || sourceRead.chapterDigest!==chapter.digest || !sourceRead.sourcePackage || hash(canonicalSourcePackage(sourceRead.sourcePackage))!==chapter.sourceDigest)throw Error('已发布来源包身份或原件摘要不符');
console.log(`已发布 ${date}，章节 ${published.id}，摘要 ${published.digest}`);

await finishTaskBalances();

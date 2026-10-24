import {CURRENT_AFFAIRS_POLICY,validateSourcePackage,canonicalSourcePackage} from '../../protocol/current-affairs.mjs';
import {permanentBucket} from './storage.js';

export {CURRENT_AFFAIRS_POLICY};
const sha=async text=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text)))].map(x=>x.toString(16).padStart(2,'0')).join('');

// This predicate only describes the new formal project. Archived revision rows
// remain available to their existing history records and explicit archive reads.
export async function isCurrentAffairsChapter(db,chapterId,digest){
 return Boolean(await db.prepare(`SELECT 1 FROM chapter_revisions r
  JOIN chapter_sources s ON s.digest=r.digest AND s.policy=?
  JOIN published_chapters p ON p.chapter_id=r.chapter_id AND p.digest=r.digest
  WHERE r.chapter_id=? AND r.digest=?`).bind(CURRENT_AFFAIRS_POLICY,chapterId,digest).first());
}

// Existing tasks keep their frozen revision when a newer revision is published.
export async function isCurrentAffairsRevision(db,chapterId,digest){
 return Boolean(await db.prepare(`SELECT 1 FROM chapter_revisions r
  JOIN chapter_sources s ON s.digest=r.digest AND s.policy=?
  WHERE r.chapter_id=? AND r.digest=?`).bind(CURRENT_AFFAIRS_POLICY,chapterId,digest).first());
}

export async function prepareChapterSources(value,chapterDigest,articles){
 if(value.sourcePolicy!==CURRENT_AFFAIRS_POLICY)throw Error('新章必须使用实事来源协议');
 if(!/^[a-f0-9]{40}$/.test(value.vixInputCommit||''))throw Error('缺少选词输入的 VIX commit');
 validateSourcePackage(value.sourcePackage,{chapterDigest,studyDate:value.date,vixInputCommit:value.vixInputCommit,articles,...(articles?{}:{markdown:value.markdown})});
 const text=canonicalSourcePackage(value.sourcePackage),digest=await sha(text);
 if(value.sourceDigest!==digest)throw Error('来源包摘要不匹配');
 return{policy:CURRENT_AFFAIRS_POLICY,text,digest,key:`chapter-sources/${chapterDigest}/${digest}.json`};
}

export async function readChapterSources(env,row){
 const stored=await permanentBucket(env).get(row.source_key);
 if(!stored)throw Error('来源包原件暂不可用');
 const text=await stored.text();
 if(await sha(text)!==row.source_digest)throw Error('来源包原件摘要不一致');
 const sourcePackage=JSON.parse(text);
 validateSourcePackage(sourcePackage,{chapterDigest:row.digest,studyDate:row.study_date});
 if(canonicalSourcePackage(sourcePackage)!==text)throw Error('来源包原件格式不一致');
 return{chapterId:row.chapter_id,chapterDigest:row.digest,sourcePolicy:row.policy,sourceDigest:row.source_digest,sourcePackage};
}

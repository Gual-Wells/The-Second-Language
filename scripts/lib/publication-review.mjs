import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {validateTeachingLayout} from '../../web/annotations.js';
import {validatePublicationReview} from '../../protocol/publication-review.mjs';
import {publicationReviewScope} from '../../protocol/publication-review.mjs';
import {canonicalSourcePackage,validateSourcePackage} from '../../protocol/current-affairs.mjs';
import {loadChapterEvidence,readChapterEvidence} from './chapter-evidence.mjs';
const hash=s=>createHash('sha256').update(s).digest('hex');
const equal=(a,b)=>canonicalSourcePackage(a)===canonicalSourcePackage(b);
const without=(object,keys)=>Object.fromEntries(Object.entries(object).filter(([key])=>!keys.includes(key)));
const fail=message=>{throw Error('teaching-delta-v1：'+message+'；请转full审阅或修复实际证据');};
async function fixedJson(file,digest){const text=await fs.readFile(file,'utf8');if(hash(text)!==digest)fail('固定原件摘要不符 '+path.basename(file));return {text,value:JSON.parse(text)};}
function verifyChapterIdentity(chapter,date){
 if(chapter.date!==date||hash(chapter.markdown)!==chapter.digest||hash(canonicalSourcePackage(chapter.sourcePackage))!==chapter.sourceDigest)fail('基线/候选正文或来源身份不符');
 validateSourcePackage(chapter.sourcePackage,{chapterDigest:chapter.digest,studyDate:date,vixInputCommit:chapter.vixInputCommit||chapter.sourcePackage.vixInputCommit,markdown:chapter.markdown});
 return validateTeachingLayout(chapter.markdown,chapter.contentPolicy,{expectedWordCount:chapter.wordCount});
}
function explanationBlocks(partOne){
 const markers=[...partOne.matchAll(/^<!-- USE:([A-Za-z][A-Za-z0-9_-]{0,31}) -->\r?$/gm)];if(!markers.length)fail('没有可界定的USE讲解');
 return {intro:partOne.slice(0,markers[0].index),blocks:markers.map((m,i)=>{
  const text=partOne.slice(m.index,markers[i+1]?.index??partOne.length),match=/^<!-- USE:[^ ]+ -->\r?\n## [^\r\n]+\r?\n`([^`\r\n]+)`/.exec(text);
  if(!match)fail('讲解不是可独立界定的单行融合段，影响未知');
  const start=match[0].length-match[1].length-1;
  return {useId:m[1],text,explanation:match[1],skeleton:text.slice(0,start)+'<FUSED_EXPLANATION>'+text.slice(start+match[1].length)};
 })};
}
function verifyLegacyFullReview(report,rawRecords,{chapter,parsed,evidence}){
 // This adapter preserves the real pre-policy report and lane files as bytes.
 // It does not backdate a publication-review-v1 or call a lane awaiting root
 // integration a completed publication. The final published root report closes
 // that historical integration and binds the same immutable version.
 const c=report.candidate,scope=publicationReviewScope(parsed);
 if(report.version!==1||report.status!=='published-and-read-back'||c?.chapterDigest!==chapter.digest||c.sourceDigest!==chapter.sourceDigest||c.evidenceDigest!==chapter.sourcePackage.evidenceDigest||c.selectedMainWords!==scope.wordIds.length||c.uses!==scope.useIds.length||c.contexts!==scope.contextIds.length||report.scope?.allUseChoicesRevisited!==scope.useIds.length||report.scope?.usesAndOrderPreserved!==true||report.scope?.selectedWordsAndFamiliesUnchanged!==true||!report.scope?.semanticReview?.trim()||report.checks?.frozenIdentityAndWholeAssembly!==true||report.checks?.actualMaterialDisposition!==true)fail('历史原全量回执不绑定旧已发布版本或范围不完整');
 const seen=new Set(),coveredWords=new Set(),materialByWord=new Map(evidence.authoring.map(x=>[x.wordId,x.authored.materialDigest]));
 for(const {role,value} of rawRecords){
  if(role==='root-corrections'){if(!equal(value,report.scope.rootDefinitionCorrections))fail('历史root修正记录与发布回执不同');continue;}
  if(role==='rights-resolution'){if(!equal(value,report.adoptionConditions?.resolution))fail('历史采用条件处理与发布回执不同');continue;}
  if(value.unresolved?.length||value.status&&!['complete','lane-complete-pending-root-integration'].includes(value.status))fail('历史逐义记录仍有未决状态');
  const uses=Array.isArray(value.uses)?value.uses:Array.isArray(value.words)?value.words.flatMap(w=>(w.decisions||[]).map(d=>({...d,wordId:w.wordId,materialDigest:w.materialDigest}))):null;
  if(!uses?.length)fail('历史逐义原件缺少实际USE记录');
  for(const use of uses){
   if(seen.has(use.useId)||!parsed.uses.has(use.useId)||parsed.uses.get(use.useId).wordId!==use.wordId||use.materialDigest!==materialByWord.get(use.wordId)||use.pending?.length||use.unresolved?.length)fail('历史逐义范围/材料摘要不符或仍有未决');
   seen.add(use.useId);coveredWords.add(use.wordId);
  }
 }
 if(!equal([...seen].sort(),[...scope.useIds].sort())||!equal([...coveredWords].sort(),[...scope.wordIds].sort()))fail('历史原审阅没有覆盖旧全量WORD/USE');
}
async function loadBaselineReview(directory,basis,chapter,parsed,evidence){
 const {value}=await fixedJson(path.join(directory,'review.json'),basis.reviewDigest),records=[];
 for(const ref of basis.reviewRecords){const loaded=await fixedJson(path.join(directory,ref.file),ref.digest);records.push({...ref,...loaded});}
 if(basis.reviewFormat==='publication-review-v1'){
  if(value.basis&&value.basis.mode!=='full-v1')fail('delta不能通过未验证的delta链伪称原全量审阅');
  validatePublicationReview(value,{chapter,parsed,runId:chapter.runId||chapter.date,evidence});
 }else verifyLegacyFullReview(value,records,{chapter,parsed,evidence});
 return {digest:basis.reviewDigest,format:basis.reviewFormat,records:records.map(r=>({file:r.file,digest:r.digest,role:r.role}))};
}
function groupsFrom(evidence){return evidence.objects.filter(o=>o.digest!==evidence.digest).map(o=>JSON.parse(o.text));}
function recordIdentity(r){return r.kind+':'+(r.kind==='word'?r.wordId:r.kind==='source'?JSON.stringify([r.sourceId,r.url]):r.kind==='text'?r.readDigest:r.kind==='html'?r.responseDigest:'control');}
function compareTeachingDelta(oldEvidence,newEvidence,oldChapter,newChapter,basis){
 const oldRecords=oldEvidence.groups.flatMap(g=>g.records),newRecords=groupsFrom(newEvidence).flatMap(g=>g.records);
 const oldById=new Map(oldRecords.map(r=>[recordIdentity(r),r])),newById=new Map(newRecords.map(r=>[recordIdentity(r),r]));
 if(!equal([...oldById.keys()].sort(),[...newById.keys()].sort()))fail('原件集合/selection/material或WORD结构变化');
 if(!equal(without(oldChapter.sourcePackage,['chapterDigest','evidenceDigest']),without(newChapter.sourcePackage,['chapterDigest','evidenceDigest'])))fail('context或source读件/来源记录变化');
 if(!equal(without(oldEvidence.manifest,['chapterDigest','groups']),without(newEvidence.manifest,['chapterDigest','groups'])))fail('selection/材料范围或证据控制身份变化');
 const metadata=c=>({...without(c,['digest','markdown','sourceDigest','sourcePackage','publicationReviewDigest','publicationAttestationDigest']),runId:c.runId||c.date});
 if(!equal(metadata(oldChapter),metadata(newChapter)))fail('非讲解章节元数据变化');
 const changedWords=[],changedUses=[],coverageNotes=[];
 for(const[id,before]of oldById){const after=newById.get(id);
  if(before.kind!=='word'){if(!equal(before,after))fail('selection/control、源原文、HTML或readRecord变化');continue;}
  if(before.materialText!==after.materialText||before.materialDigest!==after.materialDigest||before.text!==after.text||before.wordId!==after.wordId)fail('WORD或封存教材变化');
  const a=JSON.parse(before.authorText),b=JSON.parse(after.authorText);
  if(!equal(without(a,['partOne','sourceCoverage']),without(b,['partOne','sourceCoverage'])))fail('contexts/sentences/translation或其他作者字段变化');
  const left=explanationBlocks(a.partOne),right=explanationBlocks(b.partOne);
  if(left.intro!==right.intro||!equal(left.blocks.map(x=>x.useId),right.blocks.map(x=>x.useId)))fail('WORD/USE结构、词源或未知影响变化');
  const wordUses=[];
  for(let i=0;i<left.blocks.length;i++){const x=left.blocks[i],y=right.blocks[i];if(x.skeleton!==y.skeleton)fail('USE标题、快释、词性、形式、槽位或其他非融合解释变化');if(x.explanation!==y.explanation){wordUses.push(x.useId);changedUses.push(x.useId);}}
  if(!equal(a.sourceCoverage,b.sourceCoverage)){
   if(!wordUses.length||!Array.isArray(a.sourceCoverage)||!Array.isArray(b.sourceCoverage)||a.sourceCoverage.length!==b.sourceCoverage.length)fail('sourceCoverage无实际讲解delta或范围无法界定');
   for(let i=0;i<a.sourceCoverage.length;i++){const x=a.sourceCoverage[i],y=b.sourceCoverage[i];if(!equal(without(x,['disposition']),without(y,['disposition'])))fail('sourceCoverage来源身份或旧记录变化');if(x.disposition===y.disposition)continue;
    // Preserve historical disposition verbatim. Only append an explicitly
    // scoped note for explanations actually changed in this delta.
    if(typeof y.disposition!=='string'||!y.disposition.startsWith(x.disposition+'\n[teaching-delta-v1 USE:'))fail('sourceCoverage只能附加有USE边界的本轮解释记录');
    const note=y.disposition.slice(x.disposition.length),match=/^\n\[teaching-delta-v1 USE:([A-Za-z0-9_,-]+)\] (\S[^]*)$/.exec(note),ids=match?.[1].split(',');
    if(!ids?.length||new Set(ids).size!==ids.length||ids.some(id=>!wordUses.includes(id)))fail('sourceCoverage附注影响未知或跨实际修改USE');coverageNotes.push({wordId:a.wordId,sourceId:x.sourceId,useIds:ids});
   }
  }
  if(wordUses.length){changedWords.push(a.wordId);if(!basis.reviewed.wordIds.includes(a.wordId)||wordUses.some(u=>!basis.reviewed.useIds.includes(u)))fail('本轮审阅遗漏实际受影响WORD/USE');}
  else if(before.authorText!==after.authorText)fail('作者字节改变但没有可界定的讲解delta');
 }
 if(!changedWords.length)fail('没有实际讲解变化，不能签空delta');
 return {changedWordIds:changedWords,changedUseIds:changedUses,sourceCoverageNotes:coverageNotes,allOtherRecordsUnchanged:true};
}
async function validateTeachingDelta(root,date,chapter,value){
 const basis=value.basis,teaching=path.join(root,'work/runs',date,'teaching'),directory=path.join(teaching,'review-baselines',basis.chapterDigest);
 let oldChapter;try{oldChapter=JSON.parse(await fs.readFile(path.join(directory,'chapter.json'),'utf8'));}catch(e){if(e.code==='ENOENT')fail('同运行旧基线chapter.json缺失');throw e;}
 if(oldChapter.digest!==basis.chapterDigest||oldChapter.sourceDigest!==basis.sourceDigest||oldChapter.sourcePackage?.evidenceDigest!==basis.evidenceDigest||oldChapter.sourcePackage?.selectionDigest!==basis.selectionDigest||(oldChapter.runId||date)!==(chapter.runId||date))fail('旧基线错版');
 const oldParsed=verifyChapterIdentity(oldChapter,date),newParsed=verifyChapterIdentity(chapter,date),groups=[];
 const oldEvidence=await readChapterEvidence({chapter:oldChapter,readAsset:async digest=>{const {value}=await fixedJson(path.join(directory,'objects',digest+'.json'),digest);if(value.kind==='chapter-evidence-group-v1')groups.push(value);return value;}});oldEvidence.groups=groups;
 const baselineReview=await loadBaselineReview(directory,basis,oldChapter,oldParsed,oldEvidence);
 const newEvidence=await loadChapterEvidence(root,date,chapter.sourcePackage,{markdown:chapter.markdown});
 const delta=compareTeachingDelta(oldEvidence,newEvidence,oldChapter,chapter,basis);
 for(const useId of basis.reviewed.useIds)if(!basis.reviewed.wordIds.includes(newParsed.uses.get(useId).wordId))fail('本轮USE与WORD审阅范围不对应');
 for(const id of basis.reviewed.contextIds){const c=newParsed.contextMap.get(id);if(!c.refs.some(u=>basis.reviewed.useIds.includes(u)))fail('本轮context与实际USE审阅范围无关');}
 const actualDeltaReview=await fixedJson(path.join(teaching,'review-artifacts',basis.deltaReviewDigest+'.json'),basis.deltaReviewDigest);
 return {...delta,baselineReview,deltaReviewDigest:basis.deltaReviewDigest,deltaReviewBytes:Buffer.byteLength(actualDeltaReview.text),baselineChapterDigest:oldChapter.digest,candidateChapterDigest:chapter.digest,fullOldAndNewEvidenceVerified:true,newEvidence};
}
export async function loadPublicationReview(root,date,chapter,{evidence,required=true}={}){
 const file=path.join(root,'work/runs',date,'teaching/publication-review.json');let text;
 try{text=await fs.readFile(file,'utf8');}catch(e){if(!required&&e.code==='ENOENT')return null;if(e.code==='ENOENT')throw Error('缺少本版实际出版审阅记录；先按QUALITY_WORKFLOW审阅，不能自动签发');throw e;}
 const value=JSON.parse(text),parsed=validateTeachingLayout(chapter.markdown,chapter.contentPolicy,{expectedWordCount:chapter.wordCount});
 // Validate the small public shape first; then perform complete local checks
 // before any independent validator can sign the full candidate identity.
 validatePublicationReview(value,{chapter,parsed,runId:chapter.runId||date,evidence,checkRefs:false});
 const delta=value.basis?.mode==='teaching-delta-v1'?await validateTeachingDelta(root,date,chapter,value):null;
 if(delta)evidence=delta.newEvidence;
 validatePublicationReview(value,{chapter,parsed,runId:chapter.runId||date,evidence});
 const canonical=JSON.stringify(value);return {value,text:canonical,digest:hash(canonical),bytes:Buffer.byteLength(canonical),...(delta?{delta:without(delta,['newEvidence'])}:{})};
}

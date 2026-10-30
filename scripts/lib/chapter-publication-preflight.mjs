// Read-only publication admission. Validate the already sealed package, never
// regenerate prose, re-acquire source pages/textbooks or rewrite frozen inputs.
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {validateTeachingLayout,DAILY_WORD_COUNT} from '../../web/annotations.js';
import {assertTeachingText} from '../../protocol/teaching-text.mjs';
import {canonicalSourcePackage as canonical} from '../../protocol/current-affairs.mjs';
import {CONTEXT_AUTHORING_POLICY} from '../../protocol/usage-context.mjs';
import {loadChapterSources} from './current-affairs-package.mjs';
import {loadChapterEvidence} from './chapter-evidence.mjs';
import {loadAuthoringContract} from './chapter-authoring-revision.mjs';
import {assertTeachingAuthoringVersions,assembleTeachingCollection,AUTHORING_POLICY} from './teaching-authoring.mjs';

const hash=value=>createHash('sha256').update(value).digest('hex');
const json=async file=>JSON.parse(await fs.readFile(file,'utf8'));
export async function verifyChapterPublication({root,date,chapter,meta}){
  if(!/^20\d{2}-\d{2}-\d{2}$/.test(date||''))throw Error('发布预检日期无效');
  root=await fs.realpath(root);
  const folder=path.join(root,'chapters',date),run=path.join(root,'work/runs',date);
  if(!chapter||!meta||chapter.id!==date||chapter.date!==date||meta.date!==date||chapter.wordCount!==DAILY_WORD_COUNT||meta.wordCount!==DAILY_WORD_COUNT||typeof chapter.markdown!=='string'||hash(chapter.markdown)!==chapter.digest)throw Error('发布包日期、词数或正文摘要不符');
  for(const field of ['title','number','contentPolicy','authoringPolicy'])if((chapter[field]??null)!==(meta[field]??null))throw Error(`发布包与当前元数据${field}不一致；先重新核对打包`);
  if(chapter.subtitle!==(meta.subtitle||''))throw Error('发布包与当前副标题不一致；先重新核对打包');
  if(await fs.readFile(path.join(folder,'chapter.md'),'utf8')!==chapter.markdown)throw Error('发布包已过期：当前正文已改变，须重新核对来源并打包');
  const parsed=validateTeachingLayout(chapter.markdown,chapter.contentPolicy);
  if(chapter.contentPolicy==='etymology-fused-v1')assertTeachingText(parsed);
  const [selection,inputLock]=await Promise.all([json(path.join(run,'selection.json')),json(path.join(run,'vix-source.json'))]);
  if(selection.studyDate!==date||selection.vixInputCommit!==inputLock.commit||chapter.vixInputCommit!==inputLock.commit)throw Error('发布包与原冻结选词或VIX输入不一致');
  if(inputLock.authoringPolicy===CONTEXT_AUTHORING_POLICY&&selection.authoringPolicy!==CONTEXT_AUTHORING_POLICY)throw Error('新输入制作策略与冻结selection不一致');
  const source=await loadChapterSources(root,date,chapter.markdown,meta,parsed.words.map(word=>word.text));
  for(const field of ['sourcePolicy','sourceDigest','vixInputCommit','sourcePackage'])if(canonical(chapter[field])!==canonical(source[field]))throw Error('发布包已过期：当前来源绑定已改变，须重新核对打包');
  const contract=await loadAuthoringContract(root,date,selection,{meta}),integrated=parsed.format==='usage-context-v1';
  if(meta.authoringPolicy!=null&&![AUTHORING_POLICY,CONTEXT_AUTHORING_POLICY].includes(meta.authoringPolicy))throw Error('未知课程制作协议');
  if(![AUTHORING_POLICY,CONTEXT_AUTHORING_POLICY].includes(contract.policy))throw Error('未知冻结制作协议');
  if(integrated!== (contract.policy===CONTEXT_AUTHORING_POLICY)||chapter.authoringPolicy!=null&&chapter.authoringPolicy!==contract.policy)throw Error('发布包与原冻结或明确授权的作者合同不一致');
  const versions=assertTeachingAuthoringVersions(inputLock,meta,[]);
  if(!integrated&&Object.keys(versions).length)throw Error('新版正文层级与快释不能静默用于旧冻结合同');
  // Keep the same admission boundary as pack-chapter: an original classic run
  // without an authoring-policy flag never promised structured author objects.
  if(!integrated&&!parsed.articles.length&&meta.authoringPolicy!==AUTHORING_POLICY)return {parsed,versions};
  const authoredFolder=path.join(run,'teaching/authored');
  const names=(await fs.readdir(authoredFolder)).filter(name=>/^word-[A-Za-z0-9_-]+\.json$/.test(name));
  const words=await Promise.all(names.map(name=>json(path.join(authoredFolder,name))));
  if(words.length!==selection.mainWords.length||new Set(words.map(word=>word.wordId)).size!==words.length||new Set(words.map(word=>word.text)).size!==words.length||words.some(word=>!selection.mainWords.some(selected=>selected.text===word.text)))throw Error('当前作者稿与冻结主词不一致');
  assertTeachingAuthoringVersions(inputLock,meta,words);
  let evidence;
  if(integrated){
    evidence=await loadChapterEvidence(root,date,chapter.sourcePackage,{markdown:chapter.markdown});
    if(evidence.manifest.runId!==(meta.runId||date))throw Error('封存证据与发布运行身份不一致');
    assertTeachingAuthoringVersions(inputLock,meta,evidence.authoring.map(item=>item.authored));
    const sealedWords=new Map(evidence.authoring.map(item=>[item.wordId,item.authored]));
    if(words.some(word=>canonical(word)!==canonical(sealedWords.get(word.wordId))))throw Error('发布包已过期：当前作者稿或去向已改变，须重新核对封存证据并打包');
  }else if(contract.policy===AUTHORING_POLICY){
    const articles=await json(path.join(authoredFolder,'articles.json'));
    if(assembleTeachingCollection(words,articles,{expectedWordCount:selection.mainWords.length}).markdown!==chapter.markdown)throw Error('发布包已过期：当前作者稿已改变，须重新核对打包');
  }
  return {parsed,versions,evidence};
}

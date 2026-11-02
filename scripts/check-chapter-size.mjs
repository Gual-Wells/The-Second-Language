// Full local 30-word author -> source -> immutable evidence -> package ->
// publication-preflight path. All material is self-authored; no real generation.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {CHAPTER_SIZE_POLICY,DAILY_WORD_COUNT,selectedWordCount,formalChapterWordCount} from '../protocol/chapter-size.mjs';
import {AUTHENTICITY_POLICY} from '../protocol/authentic-context-coverage.mjs';
import {familyRecords} from '../protocol/vix-family.mjs';
import {createEvidenceFixture} from './check-chapter-evidence.mjs';
import {assembleRun} from './lib/teaching-authoring.mjs';
import {buildChapterSources} from './lib/current-affairs-package.mjs';
import {loadChapterEvidence} from './lib/chapter-evidence.mjs';
import {verifyChapterPublication} from './lib/chapter-publication-preflight.mjs';
import {validateTeachingLayout} from '../web/annotations.js';
const root=await fs.mkdtemp('D:/CodexStorage/tmp/thirty-chapter-check-'),checks=[];
const put=async(file,value)=>{await fs.mkdir(path.dirname(file),{recursive:true});await fs.writeFile(file,JSON.stringify(value,null,2)+'\n');};
const json=file=>fs.readFile(file,'utf8').then(JSON.parse);
globalThis.fetch=async()=>{throw Error('Real network forbidden in chapter-size QA');};
assert.equal(DAILY_WORD_COUNT,30);
const f=await createEvidenceFixture(root,{count:30});
f.selection.authenticityPolicy=AUTHENTICITY_POLICY;await put(path.join(f.run,'selection.json'),f.selection);
const lock=await json(path.join(f.run,'vix-source.json'));Object.assign(lock,{authenticityPolicy:AUTHENTICITY_POLICY,teachingLayoutVersion:2,quickGlossVersion:1});await put(path.join(f.run,'vix-source.json'),lock);
assert.equal(selectedWordCount(f.selection,lock),30);assert.equal(familyRecords(f.selection).length,30);
assert.throws(()=>selectedWordCount({...f.selection,chapterSizePolicy:undefined},lock),/不一致/);
assert.throws(()=>selectedWordCount({...f.selection,chapterSizePolicy:undefined},{}),/50 个主词/);
assert.throws(()=>selectedWordCount({...f.selection,mainWords:f.selection.mainWords.slice(0,29)},lock),/30 个主词/);
assert.throws(()=>selectedWordCount(f.selection,{...lock,chapterSizePolicy:'unknown'}),/未知/);
checks.push('new thirty-word policy cannot be dropped, resized or replaced');
for(let i=1;i<=30;i++){
  const file=path.join(f.run,'teaching/authored/word-W'+String(i).padStart(3,'0')+'.json'),word=await json(file),c=word.contexts[0];
  Object.assign(word,{layoutVersion:2,quickGlossVersion:1});word.partOne=word.partOne.replace(`## ${word.text} · 验证义 /test/`,`## ${word.text} /test/ n. · 结构样例`);
  if(i<=23)c.sourceEvidence[0].authenticUse={discourse:'institutional-record',passage:c.paragraphs[0][0].text,communicativeAct:'Self-authored witness fixture only.',uses:[{useId:c.uses[0],headForm:word.text,surface:word.text,senseMatch:'Fixture token binding, not a lexical correctness claim.'}]};
  else{c.kind='example';c.sourceUrls=[];c.sourceEvidence=[];c.fallbackReason='Self-authored fallback fixture, not a failed external search.';}
  await put(file,word);
}
const result=await assembleRun(root,f.date);assert.equal(validateTeachingLayout(result.markdown,'etymology-fused-v1').words.length,30);
await fs.writeFile(path.join(f.folder,'chapter.md'),result.markdown);
const meta={...await json(path.join(f.folder,'meta.json')),title:'Self-authored thirty-word fixture',number:'第 1 章',subtitle:'Not a course',authoringPolicy:'authentic-context-v1',contentPolicy:'etymology-fused-v1'};
await put(path.join(f.folder,'meta.json'),meta);await put(path.join(f.run,'control.json'),{date:f.date,runId:f.date,rest:false,fixtureOnly:true});
const inputSources=(await json(path.join(f.run,'source-notes.json'))).sources;
const packedSources=await buildChapterSources(root,f.date,{context:'Self-authored offline fixture; no external source adopted.',sources:inputSources,contexts:result.contextSources});
assert.equal(packedSources.sourcePackage.authenticityCoverage.useCount,30);
assert.equal(packedSources.sourcePackage.authenticityCoverage.targetIsPublicationGate,false);
assert(packedSources.sourcePackage.authenticityCoverage.useCoveragePercent<80);
checks.push('actual thirty-use denominators preserve the soft 80-percent research target');
const repo=path.resolve(import.meta.dirname,'..'),packed=spawnSync(process.execPath,[path.join(repo,'scripts/pack-chapter.mjs'),f.date],{cwd:root,encoding:'utf8',windowsHide:true,env:{...process.env,TEMP:root,TMP:root}});
assert.equal(packed.status,0,packed.stdout+'\n'+packed.stderr);
const chapter=await json(path.join(f.folder,'chapter.json')),finalMeta=await json(path.join(f.folder,'meta.json'));
assert.equal(formalChapterWordCount(chapter),30);assert.equal(chapter.chapterSizePolicy,CHAPTER_SIZE_POLICY);
const evidence=await loadChapterEvidence(root,f.date,chapter.sourcePackage,{markdown:chapter.markdown});assert.equal(evidence.manifest.wordCount,30);assert.equal(evidence.manifest.chapterSizePolicy,CHAPTER_SIZE_POLICY);
assert.equal((await verifyChapterPublication({root,date:f.date,chapter,meta:finalMeta})).parsed.words.length,30);
await assert.rejects(()=>verifyChapterPublication({root,date:f.date,chapter:{...chapter,chapterSizePolicy:undefined},meta:finalMeta}),/50 个主词/);
checks.push('real pack CLI and full sealed preflight accept thirty words below 80 percent and reject changed size identity');
console.log(JSON.stringify({passed:checks.length,checks,root,realModelCalls:0,realNetworkCalls:0,realVixWrites:0,realPublications:0,ttsCalls:0},null,2));

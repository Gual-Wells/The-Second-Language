// Isolated regression checks for the failures found on 2026-10-24.
// No publishing, VIX marking, model calls or sound generation.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {indexTextbook} from './lib/textbook-sources.mjs';
import {prepareTeachingMaterials,readTeachingMaterials,assembleTeachingCollection,checkMaterialDisposition,assembleRun} from './lib/teaching-authoring.mjs';
import {validateAnnotatedContent,splitParts,sentenceRecords} from '../web/annotations.js';
import {validateSourcePackage,canonicalSourcePackage} from '../protocol/current-affairs.mjs';
import {hash} from './lib/textbook-sources.mjs';
import {audioUnits} from '../web/audio-plan.js';

const parent=path.resolve('.cache/teaching-authoring-checks');await fs.mkdir(parent,{recursive:true});
const root=await fs.mkdtemp(path.join(parent,'isolated-'));
if(!path.relative(parent,root)||path.relative(parent,root).startsWith('..'))throw Error('Unexpected fixture location');
const date='2099-01-01',run=path.join(root,'work/runs',date),commit='a'.repeat(40);
const put=async(file,value)=>{await fs.mkdir(path.dirname(file),{recursive:true});await fs.writeFile(file,JSON.stringify(value));};
const selection={vixInputCommit:commit,mainWords:[{text:'budget',family:[{text:'budgetary'}]},{text:'verify',family:[{text:'verifiable'}]}]};
const books=[
  indexTextbook(Buffer.from('## budget\nParent entry mentions budgetary.\n□ A budget was agreed.\n## budgetary\nFORMAL; usu ADJ n.\n□ Budgetary measures were announced.\n## verify\n□ We verified the account.\n## verifiable\n□ The claim is verifiable.\n'),'collins'),
  indexTextbook(Buffer.from('## budget\nPhr & Deriv: budgetary adj.\n◊ a balanced budget 收支平衡的预算\n## verify\nPhr & Deriv: verifiable adj.\n◊ verify the result 核实结果\n'),'oxford')
];
const one=(word,id,uses)=>`<!-- WORD:${id} -->\n# ${word}\n\n**词源**：这是独立结构样例，不是正式教学。\n\n`+uses.map(u=>`<!-- USE:${u} -->\n## ${word} · 样例义 /test/\n\`隔离测试释义。\`\n`).join('\n');
const two=(word,id,uses)=>`<!-- WORD:${id} -->\n# ${word}\n\n`+uses.map(u=>`<!-- EXAMPLE:${u} -->\nThis independently authored example checks ${word}.\n\`本句为独立验证例句。\`\n`).join('\n');
const words=[{text:'budget',wordId:'W001',partOne:one('budget','W001',['U001','U002']),partTwo:two('budget','W001',['U001','U002'])},{text:'verify',wordId:'W002',partOne:one('verify','W002',['U003']),partTwo:two('verify','W002',['U003'])}];
const s=(id,uses)=>({id,uses,text:'An isolated fixture sentence has no real-world factual claim.',translation:'隔离样例不主张真实世界事实。'});
const articles=[
  {id:'A02',title:'Later-numbered article first',sourceUrls:['https://example.org/one'],paragraphs:[[s('S009',['U003','U002'])],[s('S010',[])]]},
  {id:'A01',title:'Earlier-numbered article second',sourceUrls:['https://example.org/two'],paragraphs:[[s('S002',['U001'])],[s('S003',['U003'])]]}
];
try{
  await put(path.join(run,'vix-source.json'),{commit});await put(path.join(run,'selection.json'),selection);
  const before=await fs.readFile(path.join(run,'selection.json'),'utf8');
  const first=await prepareTeachingMaterials(root,date,{books});
  const repeated=await prepareTeachingMaterials(root,date,{books});assert.deepEqual(repeated,first,'Same inputs reuse the same immutable packets');
  const material=await readTeachingMaterials(root,date,selection);
  const budget=material.packets.find(p=>p.word==='budget');
  assert(budget.entries.some(e=>e.heading==='budgetary'&&e.book==='collins'&&e.text.includes('Budgetary measures')), 'Independent derivative entry and original example survive despite a parent mention');
  assert(budget.queries.some(q=>q.term==='budgetary'&&q.books.length===2),'Both books queried separately for every declared family term');
  assert.equal(await fs.readFile(path.join(run,'selection.json'),'utf8'),before,'Reading never changes frozen selection');
  await assert.rejects(readTeachingMaterials(root,date,{...selection,mainWords:[...selection.mainWords,{text:'added',family:[]}]}),/冻结范围/);
  const candidateFile=path.join(run,'candidate-scope.json');await put(candidateFile,{mainWords:[{text:'replacement',family:[]}]});
  await assert.rejects(prepareTeachingMaterials(root,date,{scopeFile:candidateFile,books}),/已有冻结选词/,'A later candidate exploration cannot replace frozen material scope');

  const result=assembleTeachingCollection(words,articles,{expectedWordCount:2});
  assert.deepEqual(result.parsed.articles.map(a=>a.id),['A02','A01']);
  assert.deepEqual(result.parsed.sentences.map(v=>v.refs),[['U003','U002'],[],['U001'],['U003']],'No word, sense, sentence-ID or article-ID sorting in Part III');
  assert.equal(result.parsed.sentences[2].articleId,'A01');
  assert.equal(audioUnits(result.markdown).filter(u=>u.part==='three').length,4,'Article titles and metadata never become sound units');
  const missingExample=structuredClone(words);missingExample[0].partTwo=two('budget','W001',['U001']);
  assert.throws(()=>assembleTeachingCollection(missingExample,articles),/缺少对应例句/,'No automatic story-to-example fallback');
  const wrong=structuredClone(articles);wrong[1].paragraphs[0][0].uses=[];
  assert.throws(()=>assembleTeachingCollection(words,wrong),/未使用.*U001/,'Collection-wide coverage is mandatory');
  const duplicate=structuredClone(articles);duplicate[1].paragraphs[0][0].id='S009';
  assert.throws(()=>assembleTeachingCollection(words,duplicate),/编码重复/,'Sentence IDs cannot restart at each article');
  assert.throws(()=>sentenceRecords('<!-- ARTICLE:A01 -->\n# Empty'),/未配对完成/);
  assert.throws(()=>sentenceRecords('<!-- ARTICLE:A01 -->\n# Title\n# Unmarked new article'),/ARTICLE/);
  assert.throws(()=>sentenceRecords(result.parsed.parts.three.replace('# Later-numbered article first','No title')),/一级文章标题/);
  assert.equal(validateAnnotatedContent(result.markdown.replace(/^<!-- ARTICLE:[^\n]+\n/gm,'')).sentences.length,4,'Existing unscoped chapter originals remain readable');

  for(const w of words){
    const p=material.packets.find(p=>p.word===w.text);w.materialDigest=p.materialDigest;
    const u=[...result.parsed.uses].filter(([,v])=>v.wordId===w.wordId).map(([k])=>k);
    w.sourceCoverage=p.entries.filter(e=>['collins','oxford'].includes(e.book)).map(e=>({sourceId:e.id,disposition:'Isolated fixture disposition; no semantic quality claim.'}));
    w.exampleCoverage=p.exampleCandidates.map(e=>({exampleId:e.id,uses:[u[0]],disposition:'Fixture mapping only; actual authored content still needs semantic review.'}));
    checkMaterialDisposition(w,p,result.parsed);
    await put(path.join(run,'teaching/authored',`word-${w.wordId}.json`),w);
  }
  await put(path.join(run,'teaching/authored/articles.json'),articles);
  assert.equal((await assembleRun(root,date)).markdown,result.markdown,'Same persisted material, authoring and article inputs reconstruct the exact draft');
  const omitted=structuredClone(words[0]);omitted.sourceCoverage=omitted.sourceCoverage.filter(e=>e.sourceId!==budget.entries.find(e=>e.heading==='budgetary'&&e.book==='collins').id);
  assert.throws(()=>checkMaterialDisposition(omitted,budget,result.parsed),/尚未交代/);
  omitted.sourceCoverage=words[0].sourceCoverage;omitted.exampleCoverage=[];
  assert.throws(()=>checkMaterialDisposition(omitted,budget,result.parsed),/原例句候选尚未交代/);

  const sourcePackage={schemaVersion:1,studyDate:date,chapterDigest:'b'.repeat(64),selectionDigest:'c'.repeat(64),vixInputCommit:commit,context:'Isolated test; no factual claim.',sources:['one','two'].map(name=>({sourceId:'fixture',url:`https://example.org/${name}`,title:name,publisher:'Fixture',readAt:'2099-01-01T00:00:00Z',facts:['Self-written fixture.']})),articles:articles.map(({id,title,sourceUrls})=>({id,title,sourceUrls}))};
  validateSourcePackage(sourcePackage,{markdown:result.markdown});
  const mismatch=structuredClone(sourcePackage);mismatch.articles.reverse();
  assert.throws(()=>validateSourcePackage(mismatch,{markdown:result.markdown}),/篇目.*不一致/);
  mismatch.articles=structuredClone(sourcePackage.articles);mismatch.articles[0].sourceUrls=['https://example.org/not-read'];
  assert.throws(()=>validateSourcePackage(mismatch,{markdown:result.markdown}),/已实际读取/);
  delete mismatch.articles;assert.throws(()=>validateSourcePackage(mismatch,{markdown:result.markdown}),/逐篇来源/);

  // Exercise the actual packer with fifty independently authored fixture words,
  // all persisted material/author files, article bindings, then reject drift.
  const formalDate='2099-01-02',formalRun=path.join(root,'work/runs',formalDate),folder=path.join(root,'chapters',formalDate);
  const formalWords=Array.from({length:50},(_,i)=>{const n=String(i+1).padStart(3,'0'),w='fixture'+n,u='U'+n;return{text:w,wordId:'W'+n,partOne:one(w,'W'+n,[u]),partTwo:two(w,'W'+n,[u])};});
  const formalSelection={studyDate:formalDate,vixInputCommit:commit,mainWords:formalWords.map((w,i)=>({text:w.text,entryId:'e'+i,globalRank:i+1,family:[]}))};
  await put(path.join(formalRun,'vix-source.json'),{commit});await put(path.join(formalRun,'selection.json'),formalSelection);
  await prepareTeachingMaterials(root,formalDate,{books});const formalMaterial=await readTeachingMaterials(root,formalDate,formalSelection);
  for(const w of formalWords){const p=formalMaterial.packets.find(p=>p.word===w.text);await put(path.join(formalRun,'teaching/authored',`word-${w.wordId}.json`),{...w,materialDigest:p.materialDigest,sourceCoverage:[],exampleCoverage:[]});}
  const formalArticles=[{id:'A01',title:'Isolated collection packer',sourceUrls:['https://example.org/one'],paragraphs:formalWords.map((_,i)=>[s('S'+String(50-i).padStart(3,'0'),['U'+String(50-i).padStart(3,'0')])])}];
  await put(path.join(formalRun,'teaching/authored/articles.json'),formalArticles);
  const assembled=await assembleRun(root,formalDate);await fs.mkdir(folder,{recursive:true});await fs.writeFile(path.join(folder,'chapter.md'),assembled.markdown);
  const pkg={...sourcePackage,studyDate:formalDate,chapterDigest:hash(Buffer.from(assembled.markdown)),selectionDigest:hash(Buffer.from(canonicalSourcePackage(formalSelection))),articles:formalArticles.map(({id,title,sourceUrls})=>({id,title,sourceUrls}))};
  await put(path.join(folder,'sources.json'),pkg);
  await put(path.join(folder,'meta.json'),{date:formalDate,number:'第 1 章',title:'Not a formal course',wordCount:50,contentPolicy:'etymology-fused-v1',sourcePolicy:'current-affairs-v1',authoringPolicy:'sourced-collection-v1',vixInputCommit:commit,sourceDigest:hash(Buffer.from(canonicalSourcePackage(pkg)))});
  const pack=()=>spawnSync(process.execPath,[fileURLToPath(new URL('./pack-chapter.mjs',import.meta.url)),formalDate],{cwd:root,encoding:'utf8',windowsHide:true});
  const packed=pack();assert.equal(packed.status,0,packed.stderr);
  assert.equal(JSON.parse(await fs.readFile(path.join(folder,'chapter.json'),'utf8')).markdown,assembled.markdown);
  await fs.writeFile(path.join(folder,'chapter.md'),assembled.markdown+'\n');
  const changed=pack();assert.notEqual(changed.status,0);assert.match(changed.stderr,/制作稿不同/,'Packer cannot publish a stale independently edited output');
  console.log('Teaching authoring passed: independent family retrieval, immutable recovery, explicit example/source dispositions, no example fallback, unrestricted article/sense order, global coverage and sound/source identity. No production data or paid calls.');
}finally{await fs.rm(root,{recursive:true,force:true});}

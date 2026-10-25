import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir,mkdtemp,readdir,unlink,realpath} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {chapterFootprint,draftChapterFootprint,authoredDraftFootprint,englishWords} from './lib/chapter-footprint.mjs';
const fixture=`<!-- PART:one -->
<!-- WORD:W1 -->
# test
<!-- USE:U1 -->
## test /test/
\`测试\`
<!-- USE:U2 -->
## test /test/
\`试验\`
<!-- PART:two -->
<!-- WORD:W1 -->
# test
<!-- EXAMPLE:U1 -->
The shared text.
\`共用原文NASA。\`
<!-- EXAMPLE:U2 -->
Keep testing.
\`继续测试。\`
<!-- PART:three -->
<!-- ARTICLE:A1 -->
# A deliberately long title must not enter body counts
<!-- SENTENCE:S1 USE:U1 -->
The shared text.
\`共用原文NASA。\`
<!-- ARTICLE:A2 -->
# Another title
<!-- SENTENCE:S2 USE:U2 -->
We re-test NASA's plan.
\`我们重新测试NASA计划。\`
`;
const f=chapterFootprint(fixture);
assert.equal(f.mainWords,1);assert.equal(f.uses,2);
assert.equal(f.partTwo.examples,2);assert.equal(f.partTwo.englishWords,5);
assert.equal(f.partThree.englishWords,7);assert.equal(f.partThree.articles,2);
assert.equal(f.partThree.medianArticleWords,3.5,'Even article counts use the mean of the middle pair');
assert.equal(f.scale.p3EnglishWordsPerUse,3.5);
assert.equal(f.scale.p2p3EnglishWordsPerUse,6);
assert.equal(f.eligibleAudio.uniqueTexts,3,'Same sentence across parts counts once for possible text identities');
assert.equal(englishWords("NASA's re-test 123"),2);
assert.throws(()=>chapterFootprint(fixture.replace('USE:U2 -->\nWe','USE:unknown -->\nWe')),/无效/);
assert.throws(()=>chapterFootprint(fixture.replace('USE:U2 -->\nWe','USE:U1 -->\nWe')),/未使用/,'Final observation still requires every declared USE');

const word=(i)=>{const suffix=String(i).padStart(3,'0');return{wordId:'W'+suffix,text:'word'+suffix,partOne:`<!-- WORD:W${suffix} -->\n# word${suffix}\n<!-- USE:U${suffix} -->\n## word${suffix} /wɜːrd/\n\`验证义\``};};
const pair=[word(1),word(2)],article=(id,sentenceId,use,text='A useful sentence.')=>({id,title:'A title excluded from body counts',sourceUrls:['https://example.test/read-source'],paragraphs:[[{id:sentenceId,text,translation:'独立构造的译文NASA。',uses:use}]]});
const partial=[article('A1','S1',['U001']),article('A2','S2',['U001'])],beforeInputs=JSON.stringify({pair,partial});
const draft=draftChapterFootprint(pair,partial,{expectedWordCount:2});
assert.equal(draft.mode,'draft-observation');assert.equal(draft.uses,2);
assert.equal(draft.referencedUses,1,'Repeated references across articles do not inflate progress');
assert.equal(draft.unreferencedUses,1);assert.deepEqual(draft.unreferencedUseIds,['U002']);
assert.equal(draft.partThree.englishWords,6);assert.equal(draft.scale.p3EnglishWordsPerScopeUse,3);
assert.equal(draft.scale.p3EnglishWordsPerReferencedUse,6);assert.equal(draft.allUsesReferenced,false);
assert.match(draft.scale.notice,/不可与完稿直接比较/);assert.match(draft.notice,/不预测整章规模/);
assert.equal(JSON.stringify({pair,partial}),beforeInputs,'Observation cannot mutate author input');
const empty=draftChapterFootprint(pair,[],{expectedWordCount:2});
assert.equal(empty.partThree.sentences,0);assert.equal(empty.partThree.meanSentenceWords,0);
assert.equal(empty.partThree.maxSentenceWords,0);assert.equal(empty.scale.p3EnglishWordsPerReferencedUse,null);
assert.deepEqual(empty.unreferencedUseIds,['U001','U002']);
const referenced=draftChapterFootprint(pair,[article('A1','S1',['U001','U002'])],{expectedWordCount:2});
assert.equal(referenced.allUsesReferenced,true);assert.equal(referenced.mode,'draft-observation');
assert.match(referenced.notice,/不证明语义覆盖或质量/,'Even all markers referenced is not a semantic approval');
assert.throws(()=>draftChapterFootprint(pair,[article('A1','S1',['unknown'])],{expectedWordCount:2}),/无效/);
assert.throws(()=>draftChapterFootprint(pair,[article('A1','S1',['U001','U001'])],{expectedWordCount:2}),/无效/);
assert.throws(()=>draftChapterFootprint(pair,[article('A1','S1',['U001']),article('A2','S1',['U002'])],{expectedWordCount:2}),/重复/);
assert.throws(()=>draftChapterFootprint(pair,[{...article('A1','S1',['U001']),paragraphs:[]}],{expectedWordCount:2}),/空壳/);
assert.throws(()=>draftChapterFootprint([pair[0]],[],{expectedWordCount:2}),/齐全/);
assert.throws(()=>draftChapterFootprint([],[]),/齐全/);
assert.throws(()=>draftChapterFootprint([pair[0],{...pair[1],partOne:pair[1].partOne.replace('USE:U002','USE:U001')}],[],{expectedWordCount:2}),/重复/);
assert.throws(()=>draftChapterFootprint([pair[0],{...pair[1],partOne:''}],[],{expectedWordCount:2}),/身份不一致/);

// Exercise the real CLI in an isolated D-drive workspace. Snapshot all files to
// prove draft inspection never writes chapter.md, author files or new output.
const project=await realpath(path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'));
if(process.platform==='win32')assert.match(project,/^D:[\\/]/i,'New test data stays physically on D');
const parent=path.join(project,'.cache/chapter-footprint-checks');await mkdir(parent,{recursive:true});
const root=await mkdtemp(path.join(parent,'draft-')),date='2099-01-01',run=path.join(root,'work/runs',date),authored=path.join(run,'teaching/authored');
await mkdir(authored,{recursive:true});await mkdir(path.join(root,'chapters',date),{recursive:true});
const words=Array.from({length:50},(_,i)=>word(i+1)),selection=JSON.stringify({studyDate:date,mainWords:words.map(w=>({text:w.text}))});
await writeFile(path.join(run,'selection.json'),selection);
for(const w of words)await writeFile(path.join(authored,`word-${w.wordId}.json`),JSON.stringify(w));
await writeFile(path.join(run,'teaching/chapter.md'),'PROTECTED WORKING CANDIDATE');
await writeFile(path.join(root,'chapters',date,'chapter.md'),'PROTECTED FORMAL CHAPTER');
await writeFile(path.join(root,'complete-fixture.md'),fixture);
async function snapshot(folder){const rows={};for(const entry of await readdir(folder,{withFileTypes:true})){const file=path.join(folder,entry.name);if(entry.isDirectory())for(const [key,value]of Object.entries(await snapshot(file)))rows[entry.name+'/'+key]=value;else rows[entry.name]=createHash('sha256').update(await readFile(file)).digest('hex');}return rows;}
const cli=path.join(project,'scripts/chapter-footprint.mjs');
const invoke=args=>spawnSync(process.execPath,[cli,...args],{cwd:root,encoding:'utf8',timeout:30000,windowsHide:true});
const originalFetch=globalThis.fetch;let externalRequests=0;globalThis.fetch=async()=>{externalRequests++;throw Error('No network permitted');};
try{
 let before=await snapshot(root),r=await authoredDraftFootprint(root,date);
 assert.equal(r.articlesStatus,'not-created');assert.equal(r.uses,50);assert.equal(r.referencedUses,0);
 const missingArticlesCli=invoke(['--draft',date]);assert.equal(missingArticlesCli.status,0,missingArticlesCli.stderr);
 assert.equal(JSON.parse(missingArticlesCli.stdout).articlesStatus,'not-created');
 assert.deepEqual(await snapshot(root),before,'Not-yet-created articles are observed without creating them');
 await writeFile(path.join(authored,'articles.json'),'[]');
 assert.equal((await authoredDraftFootprint(root,date)).articlesStatus,'empty');
 await writeFile(path.join(authored,'articles.json'),JSON.stringify(partial));before=await snapshot(root);
 const observed=invoke(['--draft',date]);assert.equal(observed.status,0,observed.stderr);
 const value=JSON.parse(observed.stdout);assert.equal(value.mode,'draft-observation');assert.equal(value.uses,50);assert.equal(value.referencedUses,1);assert.equal(value.unreferencedUses,49);
 assert.deepEqual(await snapshot(root),before,'Real draft CLI performs no filesystem writes');
 const legacy=invoke([path.join(root,'complete-fixture.md')]);assert.equal(legacy.status,0,legacy.stderr);
 assert.equal(JSON.parse(legacy.stdout).partThree.englishWords,7,'Existing full-chapter CLI remains compatible');
 assert.deepEqual(await snapshot(root),before,'Full observation remains read-only');
 await unlink(path.join(run,'selection.json'));await assert.rejects(()=>authoredDraftFootprint(root,date),/selection.json/);
 await writeFile(path.join(run,'selection.json'),selection);
 await unlink(path.join(authored,'word-W050.json'));await assert.rejects(()=>authoredDraftFootprint(root,date),/未齐/);
 await writeFile(path.join(authored,'word-W050.json'),JSON.stringify(words[49]));
 await writeFile(path.join(authored,'articles.json'),'{invalid');await assert.rejects(()=>authoredDraftFootprint(root,date),SyntaxError);
 await writeFile(path.join(authored,'articles.json'),JSON.stringify([article('A1','S1',['unknown'])]));
 await assert.rejects(()=>authoredDraftFootprint(root,date),/无效/);
 assert.notEqual(invoke(['--draft','../outside']).status,0,'Draft dates cannot traverse outside the selected run');
 assert.equal(externalRequests,0);
}finally{globalThis.fetch=originalFetch;}
// An immutable real research baseline guards against metadata/translation
// counting mistakes without freezing future chapter contents in this test.
const pin=JSON.parse(await readFile('research/quality-scale-2026-10-25/baseline.json','utf8'));
const chapter=await readFile(pin.files.chapter,'utf8');
if(createHash('sha256').update(chapter).digest('hex')===pin.digest){
 const real=chapterFootprint(chapter);
 assert.equal(real.partThree.englishWords,20288);assert.equal(real.partTwo.englishWords,8016);
 assert.equal(real.partOne.han,23303);assert.equal(real.uses,680);
}
console.log(JSON.stringify({ok:true,metadataExcluded:true,translationExcluded:true,hyphensAndApostrophesDefined:true,textReuseCounted:true,structuralErrorsRejected:true,draftScopeDenominator:true,distinctReferenceProgress:true,missingInputProtected:true,emptyDraftExplicit:true,unknownReferencesRejected:true,finalCoverageGateUnchanged:true,legacyCliCompatible:true,noFilesystemWritesByObservation:true,noQualityScore:true,noExternalRequests:true}));

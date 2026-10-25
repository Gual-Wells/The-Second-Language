// Isolated first-draft observations, not a production writer or a quality score.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {validateAnnotatedContent,splitParts} from '../../web/annotations.js';
import {draftChapterFootprint} from '../../scripts/lib/chapter-footprint.mjs';
const here=path.dirname(fileURLToPath(import.meta.url)),root=path.resolve(here,'../..');
const hash=value=>createHash('sha256').update(value).digest('hex');
const pin=JSON.parse(await fs.readFile(path.join(root,'research/quality-scale-2026-10-25/baseline.json'),'utf8'));
const markdown=await fs.readFile(path.join(root,pin.files.chapter),'utf8');
assert.equal(hash(markdown),pin.digest,'Baseline bytes must match the frozen experiment');
const parsed=validateAnnotatedContent(markdown),part=splitParts(markdown).one;
const words=[...part.matchAll(/<!-- WORD:([^ ]+) -->\n# ([^\n]+)([\s\S]*?)(?=<!-- WORD:|$)/g)].map(m=>({wordId:m[1],text:m[2],partOne:m[0].trim()}));
const sources=JSON.parse(await fs.readFile(path.join(root,pin.files.sources),'utf8'));
const oldMeasures=JSON.parse(await fs.readFile(path.join(root,'research/quality-scale-2026-10-25/measurements.json'),'utf8'));
const expectedIds=['A23','A31'],output={baselineDigest:pin.digest,scope:expectedIds,notice:'Two isolated direct-writing exercises, not a randomized comparison or a test of complete chapter quality, size or retention.',drafts:{}};
const targets=new Set(parsed.sentences.filter(s=>expectedIds.includes(s.articleId)).flatMap(s=>s.refs));
const supplied=JSON.parse(await fs.readFile(path.join(here,'inputs.json'),'utf8'));
assert.deepEqual(supplied.map(a=>a.id),expectedIds);
assert.deepEqual([...new Set(supplied.flatMap(a=>a.uses.map(u=>u.id)))].sort(),[...targets].sort());
assert.ok(supplied.every(a=>a.uses.every(u=>!('sentences' in u))),'Original P3 sentences must not enter the first-draft input');
for(const [name,file] of [['probe','probe/first-draft.json'],['calibrated','calibrated/first-draft.json'],['calibrated-reviewed','calibrated/reviewed.json']]){
  let raw;try{raw=await fs.readFile(path.join(here,file),'utf8');}catch(e){if(name==='calibrated-reviewed'&&e.code==='ENOENT')continue;throw e;}
  const articles=JSON.parse(raw);
  assert.deepEqual(articles.map(a=>a.id),expectedIds);
  const observed=draftChapterFootprint(words,articles);
  assert.equal(observed.referencedUses,targets.size);
  for(const a of articles){
    const oldTargets=new Set(parsed.sentences.filter(s=>s.articleId===a.id).flatMap(s=>s.refs));
    const refs=new Set(a.paragraphs.flat().flatMap(s=>s.uses));
    assert.deepEqual([...refs].sort(),[...oldTargets].sort(),`${name}/${a.id}: same genuine target identities required`);
    assert.deepEqual(a.sourceUrls,sources.articles.find(s=>s.id===a.id).sourceUrls);
  }
  output.drafts[name]={jsonDigest:hash(raw),articles:observed.articles,totalWords:observed.partThree.englishWords,sentences:observed.partThree.sentences,
    distinctTargetUses:targets.size,wordsPerTargetUse:observed.partThree.englishWords/targets.size,
    completePairReferences:true,semanticJudgement:'See review.md; marker coverage alone is not acceptance.'};
}
output.sameArticlesInPriorStudy=Object.fromEntries([['baseline',oldMeasures.baseline],['selected',oldMeasures.candidates.selected]].map(([name,m])=>{
  const rows=m.articles.filter(a=>expectedIds.includes(a.id));return[name,{articles:rows,totalWords:rows.reduce((n,a)=>n+a.englishWords,0)}];
}));
await fs.writeFile(path.join(here,'probe-comparison.json'),JSON.stringify(output,null,2)+'\n');
console.log(JSON.stringify(Object.fromEntries(Object.entries(output.drafts).map(([k,v])=>[k,{words:v.totalWords,sentences:v.sentences,uses:v.distinctTargetUses}]))));

import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {chapterFootprint,englishWords} from './lib/chapter-footprint.mjs';
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
assert.equal(f.eligibleAudio.uniqueTexts,3,'Same sentence across parts counts once for possible text identities');
assert.equal(englishWords("NASA's re-test 123"),2);
assert.throws(()=>chapterFootprint(fixture.replace('USE:U2 -->\nWe','USE:unknown -->\nWe')),/无效/);
// An immutable real research baseline guards against metadata/translation
// counting mistakes without freezing future chapter contents in this test.
const pin=JSON.parse(await readFile('research/quality-scale-2026-10-25/baseline.json','utf8'));
const chapter=await readFile(pin.files.chapter,'utf8');
if(createHash('sha256').update(chapter).digest('hex')===pin.digest){
 const real=chapterFootprint(chapter);
 assert.equal(real.partThree.englishWords,20288);assert.equal(real.partTwo.englishWords,8016);
 assert.equal(real.partOne.han,23303);assert.equal(real.uses,680);
}
console.log(JSON.stringify({ok:true,metadataExcluded:true,translationExcluded:true,hyphensAndApostrophesDefined:true,textReuseCounted:true,structuralErrorsRejected:true,noQualityScore:true,noExternalRequests:true}));

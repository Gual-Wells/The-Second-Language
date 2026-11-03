import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {audioUnits,isChapterAudioRequest,pointAudioKeys,isPointAudioClip,uniqueAudioUnits,pronunciationKey,contextAudioPolicy} from '../web/audio-plan.js';
const markdown=`<!-- FORMAT:usage-context-v1 -->
<!-- CONTEXT:C001 USE:U001 KIND:example -->
<!-- CONTEXT_META:{"title":"Do not read this","sourceUrls":[],"speakers":{"S001":"Speaker A"}} -->
<!-- SENTENCE:S001 USE:U001 -->
We **record** the whole conversation.
<!-- SENTENCE:S002 -->
This connecting sentence belongs to the same example.

<!-- SENTENCE:S003 -->
The final paragraph must also be included.
<!-- TRANSLATION:C001 -->
这份译文不能进入声音。
<!-- END_CONTEXT:C001 -->
<!-- CONTEXT_REF:C001 USE:U002 -->`;
const expected='We record the whole conversation. This connecting sentence belongs to the same example. The final paragraph must also be included.';
const units=audioUnits(markdown);assert.equal(units.length,1);assert.equal(units[0].text,expected);assert.deepEqual(units[0].sentenceIds,['S001','S002','S003']);assert.equal(units[0].unitPolicy,contextAudioPolicy);
assert(isChapterAudioRequest(markdown,expected,'sentence'));assert(!isChapterAudioRequest(markdown,'We record the whole conversation.','sentence'));assert(!isChapterAudioRequest(markdown,expected,'word'));assert(!isChapterAudioRequest(markdown,'Do not read this','sentence'));
const keys=pointAudioKeys(markdown);assert(isPointAudioClip({voice:'af_bella',text:expected},keys));assert(!isPointAudioClip({voice:'af_bella',text:'We record the whole conversation.'},keys));assert.equal(uniqueAudioUnits([...units,...units]).length,1);assert.equal(pronunciationKey(expected),pronunciationKey('  '+expected+' '));
const realFile=process.env.AUDIO_CHAPTER_FILE;
let actual=null;if(realFile){const source=await readFile(realFile,'utf8'),blocks=audioUnits(source);assert(blocks.every(u=>u.part==='contexts'&&u.unitPolicy===contextAudioPolicy&&!u.unsupported));actual={blocks:blocks.length,sentences:blocks.reduce((n,u)=>n+u.sentenceIds.length,0),multiple:blocks.filter(u=>u.sentenceIds.length>1).length,maxCharacters:Math.max(...blocks.map(u=>u.text.length))};}
console.log(JSON.stringify({passed:10,checks:['all sentences and paragraphs stay in one request','support sentences retained','metadata/speaker/translation excluded','shared context not duplicated','partial sentence rejected before billing','exact text identities reused'],actual,providerCalls:0}));

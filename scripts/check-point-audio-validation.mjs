import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {performance} from 'node:perf_hooks';
import {audioUnits,isChapterAudioRequest,pronunciationKey,uniqueAudioUnits} from '../web/audio-plan.js';
let checks=0,oldMs=0,newMs=0;
for(const date of ['2026-10-02','2026-10-06','2026-10-09']){
 const markdown=await readFile(new URL(`../chapters/${date}/chapter.md`,import.meta.url),'utf8');
 const all=audioUnits(markdown),valid=all.filter(u=>!u.unsupported&&(u.kind!=='word'||u.ipa));
 const cases=uniqueAudioUnits(all).flatMap(u=>[[u.text,u.kind,u.phonemes||''],[u.text,u.kind,u.kind==='word'?'': 'wrong'],[u.text.slice(0,-1),u.kind,u.phonemes||'']]);
 cases.push(['noun','word','naʊn'],['这是译文','sentence','']);
 for(const [text,kind,phonemes] of cases){let at=performance.now();const expected=valid.some(u=>u.kind===kind&&pronunciationKey(u.text,u.phonemes||'')===pronunciationKey(text,phonemes));oldMs+=performance.now()-at;
  at=performance.now();assert.equal(isChapterAudioRequest(markdown,text,kind,phonemes),expected,`${date}: ${kind} ${text}`);newMs+=performance.now()-at;checks++;
 }
}
console.log(JSON.stringify({checks,matchingCanonicalScope:true,lookupMilliseconds:{canonicalSet:oldMs,focusedScan:newMs},paidCalls:0}));

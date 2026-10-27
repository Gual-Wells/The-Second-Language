// Self-authored inert package fixtures. This verifies versioned transport and
// evidence compatibility, not art quality or an award for the real reader.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {crc32} from 'node:zlib';
import {validateScrollPackage} from '../worker/src/scrolls.js';
import {canonical,scrollContentSHA,SCROLL_MODEL} from '../protocol/scroll-production-contract.mjs';
const hash=x=>createHash('sha256').update(x).digest('hex');
const files=new Map(),bucket={async getContent(id){return files.has(id)?new Response(files.get(id)):null;}};
function store(value){const bytes=Buffer.isBuffer(value)?value:Buffer.from(canonical(value)),digest=hash(bytes);files.set(digest,bytes);return {digest,bytes:bytes.length};}
function zip(rows){
 const local=[],central=[];let offset=0;
 for(const [path,bytes]of rows){const name=Buffer.from(path),l=Buffer.alloc(30),c=Buffer.alloc(46),crc=crc32(bytes);l.writeUInt32LE(0x04034b50);l.writeUInt16LE(20,4);l.writeUInt16LE(0x800,6);l.writeUInt32LE(crc,14);l.writeUInt32LE(bytes.length,18);l.writeUInt32LE(bytes.length,22);l.writeUInt16LE(name.length,26);c.writeUInt32LE(0x02014b50);c.writeUInt16LE(20,4);c.writeUInt16LE(20,6);c.writeUInt16LE(0x800,8);c.writeUInt32LE(crc,16);c.writeUInt32LE(bytes.length,20);c.writeUInt32LE(bytes.length,24);c.writeUInt16LE(name.length,28);c.writeUInt32LE(offset,42);local.push(l,name,bytes);central.push(c,name);offset+=l.length+name.length+bytes.length;}
 const dir=Buffer.concat(central),end=Buffer.alloc(22);end.writeUInt32LE(0x06054b50);end.writeUInt16LE(rows.length,8);end.writeUInt16LE(rows.length,10);end.writeUInt32LE(dir.length,12);end.writeUInt32LE(offset,16);return Buffer.concat([...local,dir,end]);
}
const cert={id:'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',chapterId:'offline-fixture',chapterDigest:'a'.repeat(64),chapterNumber:'1',recipientId:'offline-fixture-reader',recipientName:'Offline Fixture',passedAt:'2026-10-01T00:00:00.000Z'};
async function fixture(creatorEffort,reviewerEffort,{reviewerModel='gpt-6.1-sol'}={}){
 const copy={rubric:'Fixture',institution:'The Second Language',artTitle:'An inert specimen',verse:['A self-authored structural fixture.'],colophon:['For an offline reader.'],sealLegends:['The Second Language','In remembrance'],status:'Fixture only',translation:{rubric:'夹具',institution:'第二语言',artTitle:'静态夹具',verse:['自写结构夹具。'],colophon:['供隔离检查。'],sealLegends:['第二语言','留作纪念'],status:'仅夹具'}};
 const identity={schema:'second-language.scroll-content.v1',workId:'offline-fixture-work',certificationId:cert.id,chapterId:cert.chapterId,chapterDigest:cert.chapterDigest,ownerId:cert.recipientId,recipient:cert.recipientName,passedAt:cert.passedAt,madeAt:'2026-10-02T00:00:00.000Z',copy};
 const contentSHA=await scrollContentSHA(identity),entries=[],layers={};
 function file(path,role,bytes,mime='application/json'){const asset=store(bytes);entries.push({path,role,digest:asset.digest,bytes:asset.bytes,mime});return asset;}
 for(const [n,key]of ['front','back','ink','relief','sealInk','sealMask'].entries()){const bytes=Buffer.alloc(34);Buffer.from([137,80,78,71,13,10,26,10]).copy(bytes);bytes.write('IHDR',12);bytes.writeUInt32BE(1000,16);bytes.writeUInt32BE(1400,20);bytes[33]=n;const asset=file(key+'.png','display',bytes,'image/png');layers[key]={sha256:asset.digest,bytes:asset.bytes,width:1000,height:1400};}
 file('content-identity.json','content-identity',Buffer.from(canonical(identity)));const plan=file('art-plan.json','art-plan',Buffer.from(canonical({copy})));
 const original=entries.slice();file('native-source.zip','archive',zip([...original.map(f=>[f.path,files.get(f.digest)]),['recoverable/RESTORE.md',Buffer.from('Offline recovery fixture')],['recoverable/protocol/scroll-production-contract.mjs',Buffer.from('Offline immutable fixture')]]),'application/zip');
 const creator={model:'gpt-6.1-sol',reasoningEffort:creatorEffort,runId:'offline-maker',state:'complete'},reviewer={model:reviewerModel,reasoningEffort:reviewerEffort,runId:'offline-reviewer',state:'complete'};
 const candidate=store({schema:'second-language.scroll-candidate.v1',certificationId:cert.id,contentSHA,files:entries,creator});
 const review=store({schema:'second-language.scroll-review.v1',candidateDigest:candidate.digest,contentSHA,approved:true,creator,reviewer,checks:Object.fromEntries(['source','translation','theme','material','layout','dynamic','engineering'].map(k=>[k,true])),evidence:[entries[0].digest],notes:'Offline transport fixture; no model or art review performed.'});
 return {manifest:{schema:'second-language.scroll-package.v1',certificationId:cert.id,chapterId:cert.chapterId,chapterDigest:cert.chapterDigest,recipientId:cert.recipientId,passedAt:cert.passedAt,contentSHA,candidateDigest:candidate.digest,reviewDigest:review.digest,files:entries,recovery:{baseManifestDigest:'b'.repeat(64),workArchiveDigest:entries.at(-1).digest},viewer:{schema:'second-language.chapter-scroll-viewer.v1',profile:{base:'scroll-v42',nominalSizeMM:[300,420]},record:{...identity,chapterNumber:cert.chapterNumber,category:'chapter-certified',status:'ready',sha256:contentSHA,artPlanDigest:plan.digest},surface:{schema:'second-language.chapter-scroll-surfaces.v1',width:1000,height:1400,seal:{variant:'oblong',version:'offline-v1'},layout:{contentDigest:contentSHA,artPlanDigest:plan.digest},layers}}},candidate,review};
}
assert.equal(SCROLL_MODEL.reasoningEffort,'ultra');
let accepted=0,rejected=0;
for(const [creator,reviewer]of [['xhigh','xhigh'],['xhigh','ultra'],['ultra','xhigh'],['ultra','ultra']]){
 const f=await fixture(creator,reviewer),before=[Buffer.from(files.get(f.candidate.digest)),Buffer.from(files.get(f.review.digest))];
 await validateScrollPackage(bucket,JSON.parse(canonical(f.manifest)),cert);assert.deepEqual(files.get(f.candidate.digest),before[0]);assert.deepEqual(files.get(f.review.digest),before[1]);accepted++;
}
for(const [creator,reviewer,options]of [['high','ultra'],['ultra','max'],['ultra','ultra',{reviewerModel:'another-model'}]]){const f=await fixture(creator,reviewer,options);await assert.rejects(validateScrollPackage(bucket,JSON.parse(canonical(f.manifest)),cert),/独立审阅未覆盖/);rejected++;}
console.log(JSON.stringify({ok:true,currentDefault:SCROLL_MODEL,acceptedOriginalCombinations:accepted,rejectedWeakOrWrongModel:rejected,originalEvidenceUnchanged:true,actualAwards:0,networkCalls:0,modelCalls:0}));

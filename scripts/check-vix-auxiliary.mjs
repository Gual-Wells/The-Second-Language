import assert from 'node:assert/strict';
import {mkdir,mkdtemp,readFile,rm,writeFile,cp,symlink,readdir} from 'node:fs/promises';
import path from 'node:path';
import {auxiliaryFixture} from './fixtures/vix-auxiliary.mjs';
import {readAuxiliaryIndex,markAuxiliaryIndex,auxiliaryPath} from './lib/vix-auxiliary.mjs';
import {vixCandidates} from './vix-candidates.mjs';
const root=await mkdtemp('D:/CodexStorage/tmp/vix-auxiliary-check-'),base=path.join(root,'base'),working=path.join(root,'working');
const words=Array.from({length:50},(_,i)=>({entryId:'fixture-'+i,text:'word'+i}));
globalThis.fetch=async()=>{throw Error('No real or fake network permitted in auxiliary-index checks');};
try{
 const bodies=auxiliaryFixture(words);
 for(const [file,body] of bodies){await mkdir(path.dirname(path.join(base,file)),{recursive:true});await writeFile(path.join(base,file),body);}
 await cp(base,working,{recursive:true});
 const original=await readAuxiliaryIndex(base);
 const escaped=path.join(root,'junction-fixture'),outside=path.join(root,'outside-index');await cp(base,escaped,{recursive:true});await mkdir(outside);await symlink(outside,path.join(escaped,'data/seed-access/dates'),process.platform==='win32'?'junction':'dir');await assert.rejects(()=>markAuxiliaryIndex(escaped,{label:'26-11-02',globalRanks:[1],identityDigest:original.identityDigest}),/日期目录越出/);assert.deepEqual(await readdir(outside),[]);
 assert.equal(original.records.length,50);const candidates=await vixCandidates(base);assert.equal(candidates.candidates.length,50);assert.equal(candidates.originalMembershipsAvailable,false);assert(!('sourceCollectionIds' in candidates.candidates[0]));
 assert(!auxiliaryPath('data/seed-access/../seed5-runtime/meta.json'));assert(!auxiliaryPath('tools/build-seed-access.mjs'));
 const mark=()=>markAuxiliaryIndex(working,{label:'26-11-02',globalRanks:[1,2,50],identityDigest:original.identityDigest});
 const marked=await mark();assert.equal(marked.counts.marked,3);assert.equal(marked.identityDigest,original.identityDigest);assert.equal((await vixCandidates(working)).candidates.length,47);
 const manifestFile=path.join(working,'data/seed-access/manifest.json'),manifestBytes=await readFile(manifestFile),recordFile=path.join(working,'data/seed-access/records-000.json'),recordBytes=await readFile(recordFile);
 await mark();assert.deepEqual(await readFile(manifestFile),manifestBytes,'Same mark is byte-stable');assert.deepEqual(await readFile(recordFile),recordBytes);
 // A crash after writing the date authority is recoverable without Seed.
 const dateFile=path.join(working,'data/seed-access/dates/26-11-02.json'),date=JSON.parse(await readFile(dateFile));date.globalRanks=[1,2,3,50];await writeFile(dateFile,JSON.stringify(date)+'\n');
 await assert.rejects(()=>readAuxiliaryIndex(working),/派生标注不一致/);assert.equal((await mark()).counts.marked,4);
 await assert.rejects(()=>markAuxiliaryIndex(working,{label:'26-02-30',globalRanks:[1],identityDigest:original.identityDigest}),/真实日历日期/);
 await assert.rejects(()=>markAuxiliaryIndex(working,{label:'26-11-02',globalRanks:[51],identityDigest:original.identityDigest}),/rank 越界/);
 const rows=JSON.parse(await readFile(recordFile));rows[0][2]='tampered';await writeFile(recordFile,JSON.stringify(rows)+'\n');await assert.rejects(mark,/词身份或导航已偏离/);
 for(const [file,body] of bodies)assert.deepEqual(await readFile(path.join(base,file)),body,'Frozen input unchanged');
 console.log(JSON.stringify({passed:9,networkCalls:0,checks:['index-only candidates without invented memberships','scope traversal refused','directory junction escape refused before writes','marks-only update preserves identities','idempotent bytes','interrupted derived update recovers from dates','invalid dates and ranks refused','identity drift refused','immutable inputs retained']}));
}finally{assert(path.dirname(root)==='D:\\CodexStorage\\tmp'||path.dirname(root)==='D:/CodexStorage/tmp');await rm(root,{recursive:true,force:true});}

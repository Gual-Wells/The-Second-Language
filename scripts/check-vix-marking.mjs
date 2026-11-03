import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdir,mkdtemp,readFile,readdir,rm,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {prepareVixMarking} from './prepare-vix-marking.mjs';
import {familyRecords} from './lib/vix-index.mjs';
import {auxiliaryFixture} from './fixtures/vix-auxiliary.mjs';

const project=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),parent=path.join(project,'.cache/vix-marking-checks');
await mkdir(parent,{recursive:true});const root=await mkdtemp(path.join(parent,'fixture-'));
const relative=path.relative(parent,root);assert(relative&&!relative.startsWith('..')&&!path.isAbsolute(relative));
const date='2099-01-01',commit='a'.repeat(40),run=path.join(root,'work/runs',date),inputDir=path.join(root,'.cache/vix',commit);
const selection={studyDate:date,vixInputCommit:commit,vixMarkLabel:date.slice(2),mainWords:Array.from({length:50},(_,i)=>({entryId:`entry-${i+1}`,globalRank:i+1,text:`fixture${i+1}`,family:[]}))};
assert.throws(()=>familyRecords({...selection,mainWords:selection.mainWords.slice(0,40)}),/50 个主词/);
const duplicate=structuredClone(selection);duplicate.mainWords[1]=duplicate.mainWords[0];
assert.throws(()=>familyRecords(duplicate),/重复VIX身份/);
const bodies=auxiliaryFixture(selection.mainWords);
const blobSha=bytes=>createHash('sha1').update(Buffer.from(`blob ${bytes.length}\0`)).update(bytes).digest('hex');
const inputs=[...bodies].map(([file,bytes])=>({path:file,sha:blobSha(bytes),size:bytes.length}));
await mkdir(run,{recursive:true});
for(const [file,bytes] of bodies){const target=path.join(inputDir,file);await mkdir(path.dirname(target),{recursive:true});await writeFile(target,bytes);}
await writeFile(path.join(run,'selection.json'),JSON.stringify(selection));
await writeFile(path.join(run,'vix-source.json'),JSON.stringify({protocol:'second-language-vix-inputs/1',repository:'Gual-Wells/IELTS-Vocabulary-Index-List',branch:'main',studyDate:date,commit,files:inputs.length,capturedAt:'2099-01-01T00:00:00Z',localDirectory:inputDir,inputs}));
const originalFetch=globalThis.fetch;let requests=0;
globalThis.fetch=async()=>{requests++;throw Error('This isolated fixture must stay offline');};
async function unchanged(){for(const [file,bytes] of bodies)assert.deepEqual(await readFile(path.join(inputDir,file)),bytes,`Immutable input changed: ${file}`);}
async function snapshot(directory){const values=[];for(const entry of await readdir(directory,{withFileTypes:true})){const file=path.join(directory,entry.name);if(entry.isDirectory())values.push(...(await snapshot(file)).map(([name,bytes])=>[entry.name+'/'+name,bytes]));else values.push([entry.name,(await readFile(file)).toString('base64')]);}return values.sort(([a],[b])=>a.localeCompare(b));}
try{
 const first=await prepareVixMarking(date,{root,log:()=>{}});assert.equal(first.resumed,false);assert.equal(first.inputCommit,commit);assert.match(first.selectionDigest,/^[a-f0-9]{64}$/);
 assert.deepEqual((await readdir(first.directory)).sort(),['data','vix-marking-workspace.json']);
 const marker=JSON.parse(await readFile(path.join(first.directory,'vix-marking-workspace.json'),'utf8'));assert.equal(marker.selectionDigest,first.selectionDigest);assert.equal(marker.inputCommit,commit);
 const mark=(directory)=>spawnSync(process.execPath,[path.join(project,'scripts/mark-vix.mjs'),`--vix=${directory}`,`--selection=${path.join(run,'selection.json')}`],{encoding:'utf8'});
 const denied=mark(inputDir);assert.notEqual(denied.status,0);assert.match(denied.stderr,/不可变VIX原输入快照/);assert.match(denied.stderr,/prepare-vix-marking/);await unchanged();
 const marked=mark(first.directory);assert.equal(marked.status,0,marked.stderr);const dateFile=path.join(first.directory,'data/seed-access/dates',date.slice(2)+'.json');assert.equal(JSON.parse(await readFile(dateFile,'utf8')).globalRanks.length,50);await unchanged();
 const markedBytes=await snapshot(first.directory),again=await prepareVixMarking(date,{root,log:()=>{}});assert.equal(again.resumed,true);assert.deepEqual(await snapshot(first.directory),markedBytes,'Repeat preparation must not erase date marks or rebuilt index');await unchanged();
 await writeFile(path.join(run,'selection.json'),JSON.stringify({...selection,mainWords:[...selection.mainWords].reverse()}));
 await assert.rejects(prepareVixMarking(date,{root,log:()=>{}}),/selection摘要不一致/);assert.deepEqual(await snapshot(first.directory),markedBytes);await unchanged();
 const nextRoot=path.join(root,'thirty-word-project'),nextInput=path.join(nextRoot,'.cache/vix',commit),nextDate=date,nextRun=path.join(nextRoot,'work/runs',nextDate),nextSelection={...selection,studyDate:nextDate,vixMarkLabel:nextDate.slice(2),chapterSizePolicy:'thirty-main-words-v1',mainWords:selection.mainWords.slice(0,30)};await mkdir(nextRun,{recursive:true});await writeFile(path.join(nextRun,'selection.json'),JSON.stringify(nextSelection));for(const [name,bytes] of bodies){const target=path.join(nextInput,name);await mkdir(path.dirname(target),{recursive:true});await writeFile(target,bytes);}const priorLock=JSON.parse(await readFile(path.join(run,'vix-source.json'),'utf8'));await writeFile(path.join(nextRun,'vix-source.json'),JSON.stringify({...priorLock,localDirectory:nextInput,studyDate:nextDate,chapterSizePolicy:'thirty-main-words-v1'}));const thirty=await prepareVixMarking(nextDate,{root:nextRoot,log:()=>{}});const markedThirty=spawnSync(process.execPath,[path.join(project,'scripts/mark-vix.mjs'),`--vix=${thirty.directory}`,`--selection=${path.join(nextRun,'selection.json')}`],{encoding:'utf8'});assert.equal(markedThirty.status,0,markedThirty.stderr);assert.equal(JSON.parse(await readFile(path.join(thirty.directory,'data/seed-access/dates',nextDate.slice(2)+'.json'),'utf8')).globalRanks.length,30);await unchanged();
 assert.equal(requests,0);
 console.log('VIX marking checks passed: thirty-word new contract and fifty-word legacy contract; index-only independent copy; input writes refused; original bytes unchanged; resume preserves marks; changed selection rejected. Offline D: fixtures only, no publish or production change.');
}finally{globalThis.fetch=originalFetch;await rm(root,{recursive:true,force:true});}

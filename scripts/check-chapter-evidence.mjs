// Self-authored offline publication fixture; never a real chapter or source.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
import {indexTextbook} from './lib/textbook-sources.mjs';
import {prepareTeachingMaterials, readTeachingMaterials, assembleRun} from './lib/teaching-authoring.mjs';
import {readMaterial} from './lib/current-affairs-reader.mjs';
import {canonicalSourcePackage} from '../protocol/current-affairs.mjs';
import {prepareChapterEvidence, loadChapterEvidence, readChapterEvidence} from './lib/chapter-evidence.mjs';
import {archiveWorking} from './lib/work-archives.mjs';
const hash = value => createHash('sha256').update(value).digest('hex');
const put = async(file,value) => {await fs.mkdir(path.dirname(file),{recursive:true});await fs.writeFile(file,JSON.stringify(value,null,2)+'\n');};

export async function createEvidenceFixture(root,{date='2099-01-29',count=50,adoptedAlias=false}={}) {
  root=await fs.realpath(root);const run=path.join(root,'work/runs',date),folder=path.join(root,'chapters',date),commit='a'.repeat(40),url='https://example.org/evidence-fixture';
  const names=Array.from({length:count},(_,i)=>'fixture'+String(i+1).padStart(3,'0')),adoptedUrl=adoptedAlias?url+'#adopted-fragment':url;
  const selection={studyDate:date,vixInputCommit:commit,authoringPolicy:'authentic-context-v1',mainWords:names.map((text,i)=>({text,entryId:'e'+i,globalRank:i+1,family:[]}))};
  await put(path.join(run,'selection.json'),selection);await put(path.join(run,'vix-source.json'),{commit,authoringPolicy:selection.authoringPolicy});
  await put(path.join(folder,'meta.json'),{date,runId:date,sourcePolicy:'current-affairs-v1'});
  await put(path.join(root,'resources/current-affairs/sources.json'),{schemaVersion:1,sources:[{id:'fixture',name:'Self-authored fixture',home:'https://example.org/',entryUrl:'https://example.org/',role:'primary-announcement',topics:['science'],language:'en'}]});
  await put(path.join(root,'resources/current-affairs/feeds.json'),{schemaVersion:1,feeds:[],limits:{maxFeeds:6,concurrency:2,maxRequests:12,maxFeedBytes:100000,maxArticleBytes:100000,maxItemsPerFeed:80,timeoutMs:1000}});
  const sentence=name=>`The self-authored original places ${name} in a test sentence without making a teaching claim.`;
  let requests=0;
  const original=await readMaterial(date,{root,sourceId:'fixture',url,fetchImpl:async()=>{requests++;return new Response(`<html><head><title>Offline evidence</title></head><body><article>${names.map(name=>'<p>'+sentence(name)+'</p>').join('')}<p>This independently written source only exercises source recovery, with enough context to distinguish it from an empty navigation card.</p></article></body></html>`,{headers:{'content-type':'text/html'}});}});
  assert.equal(requests,1);
  const books=['collins','oxford'].map(book=>indexTextbook(Buffer.from(names.map(name=>`## ${name}\nA self-authored fixture definition.\n${book==='collins'?'□':'◊'} This unshown original example uses ${name}.`).join('\n')),book));
  await prepareTeachingMaterials(root,date,{books});const {packets}=await readTeachingMaterials(root,date,selection);
  for(let i=0;i<names.length;i++){
    const n=String(i+1).padStart(3,'0'),wordId='W'+n,useId='U'+n,contextId='C'+n,packet=packets.find(packet=>packet.word===names[i]);
    await put(path.join(run,'teaching/authored','word-'+wordId+'.json'),{
      wordId,text:names[i],materialDigest:packet.materialDigest,
      partOne:`<!-- WORD:${wordId} -->\n# ${names[i]}\n\n**词源**：自写验证，不主张真实词源。\n\n<!-- USE:${useId} -->\n## ${names[i]} · 验证义 /test/\n\`仅用于结构与恢复验证。\`\n\n<!-- CONTEXT_SLOT:${useId} -->\n`,
      contexts:[{id:contextId,kind:'excerpt',uses:[useId],sourceUrls:[adoptedUrl],title:'Self-authored source',paragraphs:[[{id:'S'+n,text:sentence(names[i]),uses:[useId]}]],translation:'本段只验证固定原文恢复，不认证真实教学。',sourceEvidence:[{url:adoptedUrl,readRecord:path.relative(root,original.recordPath),locator:'Self-authored fixture paragraph '+(i+1),senseEvidence:'Only a fixture token match, not a lexical claim.',changes:'One self-authored source sentence retained.',publicationBasis:'Author-owned isolation material.'}]}],
      contextChoices:[{useId,contextIds:[contextId],reason:'One self-contained isolation example.'}],
      sourceCoverage:packet.entries.filter(entry=>['collins','oxford'].includes(entry.book)).map(entry=>({sourceId:entry.id,disposition:'The self-authored definition and original example remain in the fixed private packet.'})),
      exampleCoverage:packet.exampleCandidates.map(example=>({exampleId:example.id,uses:[useId],disposition:'Retained as an unshown candidate; this is an intentional fixture choice.'}))
    });
  }
  const {markdown}=await assembleRun(root,date),sources=[{sourceId:'fixture',url:adoptedUrl,title:'Self-authored source',publisher:'Fixture',readAt:original.readAt,readDigest:original.textDigest,facts:['An isolated fixture, not real news.']}];
  const inputSources=[{...sources[0],readRecord:path.relative(root,original.recordPath)}];await put(path.join(run,'source-notes.json'),{sources:inputSources});
  const evidence=await prepareChapterEvidence(root,date,{markdown,selection,sources,inputSources});
  const chapter={runId:date,markdown,digest:hash(markdown),sourcePackage:{studyDate:date,chapterDigest:hash(markdown),selectionDigest:hash(canonicalSourcePackage(selection)),vixInputCommit:commit,sources,evidenceDigest:evidence.digest}};
  const objects=new Map(evidence.objects.map(object=>[object.digest,JSON.parse(object.text)]));
  return {root,date,run,folder,selection,sources,markdown,chapter,evidence,objects,original};
}

async function main(){
  const parent=path.resolve('.cache/publication-reliability-20261030/chapter-evidence');await fs.mkdir(parent,{recursive:true});
  const root=await fs.mkdtemp(path.join(parent,'isolated-')),checks=[];
  const check=async(name,fn)=>{await fn();checks.push(name);console.log('PASS '+name);};
  const originalFetch=globalThis.fetch;globalThis.fetch=async()=>{throw Error('No real network in evidence checks');};
  try{
    const fixture=await createEvidenceFixture(root),{chapter,evidence,objects}=fixture;
    const readAsset=async digest=>{assert(objects.has(digest),'asset exists');return structuredClone(objects.get(digest));};
    const changedObjects=change=>{
      const map=new Map(),manifest=structuredClone(evidence.manifest);
      manifest.groups=manifest.groups.map(ref=>{const group=structuredClone(objects.get(ref.digest));change(group.records);const text=JSON.stringify(group),digest=hash(text);map.set(digest,group);return {digest,bytes:Buffer.byteLength(text)};});
      const digest=hash(JSON.stringify(manifest));map.set(digest,manifest);const changed=structuredClone(chapter);changed.sourcePackage.evidenceDigest=digest;
      return {chapter:changed,readAsset:async digest=>structuredClone(map.get(digest))};
    };
    await check('fifty author objects and adopted originals recover from immutable objects',async()=>{const value=await readChapterEvidence({chapter,readAsset});assert.equal(value.authoring.length,50);assert.equal(value.originals.length,1);assert.equal(value.authoring[0].authored.exampleCoverage.length,2);assert(value.originals[0].text.includes('fixture001'));});
    await check('local evidence loading verifies all object bytes and body',async()=>{const loaded=await loadChapterEvidence(root,fixture.date,chapter.sourcePackage,{markdown:chapter.markdown});assert.equal(loaded.digest,evidence.digest);assert.deepEqual(loaded.objects,evidence.objects);});
    await check('repeat preparation preserves the same evidence identity',async()=>assert.equal((await prepareChapterEvidence(root,fixture.date,{markdown:chapter.markdown,selection:fixture.selection,sources:fixture.sources})).digest,evidence.digest));
    const authorFile=path.join(fixture.run,'teaching/authored/word-W001.json');
    const withAuthorRead=async(recordPath,fn)=>{const bytes=await fs.readFile(authorFile);try{const word=JSON.parse(bytes);word.contexts[0].sourceEvidence[0].readRecord=path.relative(root,recordPath);await put(authorFile,word);return await fn();}finally{await fs.writeFile(authorFile,bytes);}};
    await check('first sealing rejects the author selecting a different original of the same URL',async()=>{
      const different=await readMaterial(fixture.date,{root,sourceId:'fixture',url:fixture.sources[0].url,refresh:true,fetchImpl:async()=>new Response('<html><head><title>Different original</title></head><body><article><p>This different self-authored source version deliberately changes the actual original text. It cannot establish that the earlier adopted source was read by the author for this chapter.</p></article></body></html>',{headers:{'content-type':'text/html'}})});
      assert.notEqual(different.textDigest,fixture.original.textDigest);
      await withAuthorRead(different.recordPath,()=>assert.rejects(prepareChapterEvidence(root,fixture.date,{markdown:chapter.markdown,selection:fixture.selection,sources:fixture.sources}),/作者原文与采用来源readDigest不同/));
    });
    await check('another valid receipt of the same original remains valid and recovers without cache',async()=>{
      const originalHTML=await fs.readFile(fixture.original.responseBodyPath),same=await readMaterial(fixture.date,{root,sourceId:'fixture',url:fixture.sources[0].url,refresh:true,fetchImpl:async()=>new Response(originalHTML,{headers:{'content-type':'text/html'}})});
      assert.equal(same.textDigest,fixture.original.textDigest);assert.notEqual(same.recordPath,fixture.original.recordPath);
      await withAuthorRead(same.recordPath,async()=>{const value=await prepareChapterEvidence(root,fixture.date,{markdown:chapter.markdown,selection:fixture.selection,sources:fixture.sources}),map=new Map(value.objects.map(object=>[object.digest,JSON.parse(object.text)])),changed=structuredClone(chapter);changed.sourcePackage.evidenceDigest=value.digest;
        const cache=path.join(root,'.cache/current-affairs-research'),held=path.join(root,'.cache/acquisition-held');assert.equal(path.relative(root,cache),path.join('.cache','current-affairs-research'));assert.equal(path.relative(root,held),path.join('.cache','acquisition-held'));
        await fs.rename(cache,held);try{const loaded=await readChapterEvidence({chapter:changed,readAsset:async digest=>map.get(digest)});assert(loaded.originals[0].authorReadRecords.some(record=>record.record.recordPath===same.recordPath));assert.equal(loaded.authoring[0].authored.contexts[0].sourceEvidence[0].readRecord,path.relative(root,same.recordPath));}finally{await fs.rename(held,cache);}
      });
    });
    await check('a canonical fragment alias remains a valid adopted record',async()=>{const other=await fs.mkdtemp(path.join(root,'alias-'));const alias=await createEvidenceFixture(other,{count:1,adoptedAlias:true});const value=await readChapterEvidence({chapter:alias.chapter,readAsset:async digest=>alias.objects.get(digest)});assert(value.originals[0].url.endsWith('#adopted-fragment'));assert(!value.originals[0].record.requestedUrl.includes('#'));});
    await check('public source package carries no original or absolute path',async()=>{const text=JSON.stringify(chapter.sourcePackage);assert(!text.includes('recordPath'));assert(!text.includes('unshown candidate'));assert(!text.includes('self-authored original places'));});
    await check('a foreign chapter cannot reuse evidence',async()=>{const bad=structuredClone(chapter);bad.markdown+='\n';bad.digest=hash(bad.markdown);bad.sourcePackage.chapterDigest=bad.digest;await assert.rejects(readChapterEvidence({chapter:bad,readAsset}),/不一致/);});
    await check('a foreign run cannot reuse evidence',async()=>{await assert.rejects(readChapterEvidence({chapter:{...chapter,runId:'other-run'},readAsset}),/不一致/);});
    await check('missing or tampered private objects fail closed',async()=>{await assert.rejects(readChapterEvidence({chapter,readAsset:async digest=>digest===evidence.digest?objects.get(digest):{tampered:true}}),/摘要/);});
    await check('changed source read version cannot be substituted',async()=>{const bad=structuredClone(chapter);bad.sourcePackage.sources[0].readDigest='f'.repeat(64);await assert.rejects(readChapterEvidence({chapter:bad,readAsset}),/读取版本/);});
    await check('recomputed containers cannot hide a missing original-example disposition',async()=>{const changed=changedObjects(records=>{const first=records.find(record=>record.kind==='word');if(first){const author=JSON.parse(first.authorText);author.exampleCoverage.pop();first.authorText=JSON.stringify(author);first.authorDigest=hash(first.authorText);}});await assert.rejects(readChapterEvidence(changed),/原例句候选尚未交代去向/);});
    await check('recomputed containers cannot silently replace the author-selected receipt reference',async()=>{const changed=changedObjects(records=>{const first=records.find(record=>record.kind==='word');if(first){const author=JSON.parse(first.authorText);author.contexts[0].sourceEvidence[0].readRecord='unbound-original-record.json';first.authorText=JSON.stringify(author);first.authorDigest=hash(first.authorText);}});await assert.rejects(readChapterEvidence(changed),/作者采用语境没有同版原文证据/);});
    await check('new HTML originals are retained and corrupt HTML is rejected',async()=>{assert(fixture.original.responseBodyPath,'The new native reader retains original HTML.');const changed=changedObjects(records=>{const html=records.find(record=>record.kind==='html');if(html)html.base64=Buffer.from('changed original HTML').toString('base64');});await assert.rejects(readChapterEvidence(changed),/原HTML摘要/);});
    await check('same-read aliases keep one original text and HTML within the private bundle',async()=>{
      const alias={...fixture.sources[0],url:fixture.sources[0].url+'#another-adoption'},sources=[...fixture.sources,alias],inputSources=sources.map(source=>({...source,readRecord:path.relative(root,fixture.original.recordPath)}));
      const value=await prepareChapterEvidence(root,fixture.date,{markdown:chapter.markdown,selection:fixture.selection,sources,inputSources});
      const records=value.objects.filter(object=>object.digest!==value.digest).flatMap(object=>JSON.parse(object.text).records);
      assert.equal(records.filter(record=>record.kind==='source').length,2);assert.equal(records.filter(record=>record.kind==='text').length,1);assert.equal(records.filter(record=>record.kind==='html').length,1);
    });
    await check('ordinary working archive now contains the actual adopted evidence objects',async()=>{const uploaded=new Map();const manifests=await archiveWorking(root,async(key,bytes)=>{uploaded.set(key,Buffer.from(bytes));return {digest:hash(bytes)};});const included=new Set();for(const group of manifests){const manifest=JSON.parse(uploaded.get(group.key));for(const chunk of manifest.chunks){const files=JSON.parse(gunzipSync(uploaded.get(chunk.key))).files;for(const file of files.filter(file=>file.path.startsWith('sources/evidence/')))included.add(path.basename(file.path,'.json'));}}for(const object of evidence.objects)assert(included.has(object.digest));});
    await check('deleting the acquisition cache does not prevent fixed original recovery',async()=>{const cache=path.join(root,'.cache/current-affairs-research'),physical=await fs.realpath(cache);assert(physical.startsWith(await fs.realpath(root)));await fs.rm(physical,{recursive:true,force:true});const value=await readChapterEvidence({chapter,readAsset});assert.equal(value.originals[0].record.textDigest,fixture.original.textDigest);assert(value.originals[0].record.recordPath.includes('current-affairs-research'));});
    await fs.writeFile(path.join(parent,'results.json'),JSON.stringify({checks,paidCalls:0,liveRequests:0},null,2));console.log(JSON.stringify({passed:checks.length,paidCalls:0,liveRequests:0}));
  }finally{globalThis.fetch=originalFetch;const p=await fs.realpath(parent),r=await fs.realpath(root),relative=path.relative(p,r);assert(relative&&!relative.startsWith('..')&&!path.isAbsolute(relative));await fs.rm(r,{recursive:true,force:true});}
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))await main();

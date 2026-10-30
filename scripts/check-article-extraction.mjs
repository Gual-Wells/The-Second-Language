// Offline extraction and dependency boundaries. No retrieval or publication.
import assert from 'node:assert/strict';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {extractHtml} from './lib/current-affairs-reader.mjs';
import {articleExtractionRoute} from './lib/html-extractor.mjs';
const out='.cache/publication-reliability-20261030/extraction';await mkdir(out,{recursive:true});
const checks=[],check=(name,value)=>{assert.ok(value,name);checks.push(name);};
check('verified KFF route uses Readability',articleExtractionRoute('https://kffhealthnews.org/story/a')==='readability');
check('verified CNRS route includes its actual subdomains',articleExtractionRoute('https://news.cnrs.fr/articles/a')==='readability');
check('unrelated hostname cannot impersonate a template route',articleExtractionRoute('https://cnrs.fr.unrelated.invalid/a')==='trafilatura');
const actual='This self-written main story describes how a reader compares original notes before deciding which source supports a conclusion. ';
const card='A separate related article describes a different event and must not replace the current main story. ';
const html=`<html><head><title>Actual story</title><link rel="canonical" href="https://kffhealthnews.org/story/a"><meta property="article:published_time" content="2026-10-01T00:00:00Z"></head><body><nav>UNRELATED NAVIGATION</nav><main><h1>Actual story</h1><div class="entry-content">${Array.from({length:4},()=>'<p>'+actual.repeat(3)+'</p>').join('')}<figure><figcaption>Original figure caption remains in the saved HTML.</figcaption></figure></div></main><aside><article class="related"><p>${card.repeat(2)}</p></article></aside><script>UNTRUSTED SCRIPT CONTENT MUST NOT EXECUTE OR BECOME THE ARTICLE</script></body></html>`;
const selected=extractHtml(Buffer.from(html),'https://kffhealthnews.org/story/a','utf-8');
check('main content wins over the nested related article card',selected.text.includes(actual.trim())&&!selected.text.includes(card.trim()));
check('selected subtree excludes navigation and scripts',!selected.text.includes('UNRELATED NAVIGATION')&&!selected.text.includes('UNTRUSTED SCRIPT'));
check('extractor and DOM versions are explicit',selected.extractionTool.name==='@mozilla/readability'&&selected.extractionTool.version==='0.6.0'&&selected.extractionTool.domVersion==='30.1.3');
check('original metadata date is distinct from extraction success',selected.pageTimestamps.some(x=>x.parsedAt==='2026-10-01T00:00:00.000Z'));
const shortHtml='<html><head><title>Short companion text</title></head><body><main><h1>Short companion text</h1><p>This brief self-written companion text accompanies a longer recording. It supplies only a short written introduction, and must not be described as a transcript of the entire recording. The reader should consult the recording separately when that is the required source.</p></main></body></html>';
const short=extractHtml(shortHtml,'https://kffhealthnews.org/story/short');
check('short readable companion text is not padded with unrelated cards',short.text.includes('brief self-written companion')&&!short.text.includes(card.trim()));
const maintained=extractHtml('<html><head><title>Maintained service log</title><meta property="article:modified_time" content="2026-10-29T00:00:00Z"></head><body><main><h1>Maintained service log</h1><p>'+('This maintained service log contains entries from several years, and its modified date does not establish that every entry is new. '.repeat(7))+'</p></main></body></html>','https://example.org/maintained');
check('maintained pages remain candidates with role and completeness caveats',maintained.warnings.some(w=>w.includes('page role')&&w.includes('captions'))&&maintained.pageTimestamps.some(t=>t.field==='article:modified_time'));
const oldPython=process.env.SECOND_LANGUAGE_EXTRACTION_PYTHON;
try{process.env.SECOND_LANGUAGE_EXTRACTION_PYTHON=path.resolve(out,'missing-python.exe');assert.throws(()=>extractHtml(html,'https://example.org/'),/runtime|original tool text import/i);checks.push('missing mature runtime refuses new extraction without legacy fallback');}finally{if(oldPython===undefined)delete process.env.SECOND_LANGUAGE_EXTRACTION_PYTHON;else process.env.SECOND_LANGUAGE_EXTRACTION_PYTHON=oldPython;}
const cached=[];
try{
 const report=JSON.parse(await readFile('work/research/vix-projection-methods-20261026/extraction/results.json','utf8'));
 for(const id of ['df0cfe8ab0e69017','736310ce0dc0894c']){
  const row=report.rows.find(x=>x.id===id);if(!row)continue;
  const bytes=await readFile(row.htmlPath),prior=await readFile(row.readabilityPath,'utf8'),wrong=await readFile(row.lxmlPath,'utf8');
  const current=extractHtml(bytes,row.url,'utf-8'),normalize=s=>s.replace(/\s+/g,' ').trim();
  check('saved KFF '+id+' preserves the previously selected actual body',normalize(current.text).includes(normalize(prior).slice(0,80))&&!normalize(current.text).includes(normalize(wrong)));
  cached.push({id,originalBytes:bytes.length,oldWrongWords:row.lxmlWords,currentWords:current.text.split(/\s+/).length,method:current.extractionMethod});
 }
}catch(e){if(e.code!=='ENOENT')throw e;}
const result={checks,cached,networkRequests:0,paidCalls:0,productionWrites:0,limitations:'Extraction selects a readable candidate. Captions, attachment completeness, maintained-page dates, factual use and rights still require actual source reading.'};
await writeFile(out+'/results.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));

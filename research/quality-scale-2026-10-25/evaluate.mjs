// Reproduce the offline trials using the existing teaching assembler/parser.
// This script never claims a run, publishes, mutates VIX or generates audio.
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {assembleTeachingCollection} from '../../scripts/lib/teaching-authoring.mjs';
import {chapterFootprint} from '../../scripts/lib/chapter-footprint.mjs';
import {splitParts} from '../../web/annotations.js';
const here=path.dirname(fileURLToPath(import.meta.url)),root=path.resolve(here,'../..');
const read=async p=>JSON.parse(await fs.readFile(path.join(here,p),'utf8'));
const pin=await read('baseline.json'),baseline=await fs.readFile(path.join(root,pin.files.chapter),'utf8');
const hash=s=>createHash('sha256').update(s).digest('hex');
if(hash(baseline)!==pin.digest)throw Error('Baseline bytes changed; restore the pinned source explicitly, never adopt drift.');
const p=splitParts(baseline),prefix=baseline.slice(0,baseline.indexOf('<!-- PART:three -->'));
const sourcePackage=JSON.parse(await fs.readFile(path.join(root,pin.files.sources),'utf8'));
const blocks=part=>[...part.matchAll(/<!-- WORD:([^ ]+) -->\n# ([^\n]+)([\s\S]*?)(?=<!-- WORD:|$)/g)].map(m=>({id:m[1],word:m[2],body:m[0].trim()}));
const one=blocks(p.one),two=blocks(p.two),words=one.map(a=>({wordId:a.id,text:a.word,partOne:a.body,partTwo:two.find(b=>b.id===a.id).body}));
const baseStats=chapterFootprint(baseline),results={baseline:baseStats,candidates:{},notice:'Structural measurements only. Semantic, factual and article-value decisions are documented separately in reviews and README.'};
for(const name of ['light','compact','selected']){
  let articles;
  try{articles=name==='selected'?await read('variants/selected.json'):[...await read(`variants/${name}-first.json`),...await read(`variants/${name}-second.json`)];}
  catch(e){if(e.code==='ENOENT')continue;throw e;}
  const assembled=assembleTeachingCollection(words,articles,{expectedWordCount:50});
  const third=assembled.markdown.slice(assembled.markdown.indexOf('<!-- PART:three -->'));
  const markdown=prefix+third,parts=splitParts(markdown),stats=chapterFootprint(markdown);
  if(parts.one!==p.one||parts.two!==p.two)throw Error('An experiment changed protected teaching/examples');
  const originalIds=new Set(baseStats.articles.map(a=>a.id));
  const unexpected=stats.articles.filter(a=>!originalIds.has(a.id)).map(a=>a.id);
  const missing=baseStats.articles.filter(a=>!stats.articles.some(b=>a.id===b.id)).map(a=>a.id);
  const articleCoverage=stats.articles.map(a=>({id:a.id,baselineUses:baseStats.articles.find(b=>b.id===a.id)?.uniqueUses,candidateUses:a.uniqueUses}));
  if(unexpected.length||missing.length||articleCoverage.some(a=>a.baselineUses!==a.candidateUses))throw Error('Trial article scope changed');
  // All article USE sets must match, rather than merely equal cardinality.
  for(const a of articles){const old=[...p.three.matchAll(new RegExp('<!-- ARTICLE:'+a.id+' -->([\\s\\S]*?)(?=<!-- ARTICLE:|$)','g'))][0]?.[1]||'';
    const source=sourcePackage.articles.find(s=>s.id===a.id);
    if(!source||source.title!==a.title||JSON.stringify(source.sourceUrls)!==JSON.stringify(a.sourceUrls))throw Error('Trial source/title scope changed: '+a.id);
    const oldUses=new Set([...old.matchAll(/<!-- SENTENCE:[^ ]+ USE:([^ ]+) -->/g)].flatMap(m=>m[1].split(',')));
    const newUses=new Set(a.paragraphs.flat().flatMap(s=>s.uses));
    if(oldUses.size!==newUses.size||[...oldUses].some(u=>!newUses.has(u)))throw Error('Article target set differs: '+a.id);
  }
  await fs.writeFile(path.join(here,`variants/${name}-third.md`),third);
  results.candidates[name]={...stats,bodyDigest:hash(markdown),partOneUnchanged:true,partTwoUnchanged:true,
    p3Reduction:1-stats.partThree.englishWords/baseStats.partThree.englishWords,
    p2p3Reduction:1-(stats.partTwo.englishWords+stats.partThree.englishWords)/(baseStats.partTwo.englishWords+baseStats.partThree.englishWords),
    articleCoverage};
}
await fs.writeFile(path.join(here,'measurements.json'),JSON.stringify(results,null,2)+'\n');
console.log(JSON.stringify(Object.fromEntries(Object.entries(results.candidates).map(([n,s])=>[n,{p3Words:s.partThree.englishWords,sentences:s.partThree.sentences,reduction:s.p3Reduction,allUses:s.uses,protectedPartsUnchanged:s.partOneUnchanged&&s.partTwoUnchanged}]))));

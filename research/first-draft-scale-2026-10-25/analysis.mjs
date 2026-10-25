// Read-only inputs; writes only this study's analysis.json. No production calls.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../..');
const old=path.join(root,'research/quality-scale-2026-10-25');
const read=async p=>JSON.parse(await fs.readFile(p,'utf8'));
const previous=await read(path.join(old,'measurements.json'));
const files={baseline:['.cache/quality-scale-study/baseline-articles.json'],light:['research/quality-scale-2026-10-25/variants/light-first.json','research/quality-scale-2026-10-25/variants/light-second.json'],compact:['research/quality-scale-2026-10-25/variants/compact-first.json','research/quality-scale-2026-10-25/variants/compact-second.json'],selected:['research/quality-scale-2026-10-25/variants/selected.json']};
const count=s=>(s.match(/[A-Za-z]+(?:['-][A-Za-z]+)*/g)||[]).length;
const round=x=>Math.round(x*1000)/1000;
const median=xs=>{const a=[...xs].sort((x,y)=>x-y),i=Math.floor(a.length/2);return a.length%2?a[i]:(a[i-1]+a[i])/2;};
const result={method:'ASCII English alphabetic tokens, ASCII apostrophe/hyphen compounds count as one; body only, excluding titles, translations, metadata and numbers. USE counts are references, not semantic validation.',inputs:{},variants:{}};
for(const [name,paths] of Object.entries(files)){
 const arrays=[];
 for(const p of paths){const bytes=await fs.readFile(path.join(root,p));result.inputs[p]=createHash('sha256').update(bytes).digest('hex');arrays.push(JSON.parse(bytes.toString('utf8')));}
 const articles=arrays.flat().map(a=>{const ss=a.paragraphs.flat();return {id:a.id,title:a.title,words:ss.reduce((n,s)=>n+count(s.text),0),uniqueUses:new Set(ss.flatMap(s=>s.uses)).size,useReferences:ss.reduce((n,s)=>n+s.uses.length,0),sentences:ss.length,noUseSentences:ss.filter(s=>!s.uses.length).length,noUseWords:ss.filter(s=>!s.uses.length).reduce((n,s)=>n+count(s.text),0),multiUseSentences:ss.filter(s=>s.uses.length>1).length};});
 const aa=arrays.flat(),ss=aa.flatMap(a=>a.paragraphs.flat()),globalUses=new Set(ss.flatMap(s=>s.uses)).size;
 const words=articles.reduce((n,a)=>n+a.words,0),localUses=articles.reduce((n,a)=>n+a.uniqueUses,0),ratios=articles.map(a=>a.words/a.uniqueUses);
 const expected=name==='baseline'?previous.baseline:previous.candidates[name];
 if(words!==expected.partThree.englishWords||globalUses!==expected.uses)throw Error('Old measurement mismatch: '+name);
 result.variants[name]={words,globalUniqueUses:globalUses,sumArticleUniqueUses:localUses,useReferences:articles.reduce((n,a)=>n+a.useReferences,0),articleCount:articles.length,sentences:ss.length,noUseSentences:articles.reduce((n,a)=>n+a.noUseSentences,0),noUseWords:articles.reduce((n,a)=>n+a.noUseWords,0),multiUseSentences:articles.reduce((n,a)=>n+a.multiUseSentences,0),maxReferencesPerSentence:Math.max(...ss.map(s=>s.uses.length)),wordsPerGlobalUniqueUse:round(words/globalUses),wordsPerArticleIncidence:round(words/localUses),unweightedMeanArticleRatio:round(ratios.reduce((n,x)=>n+x,0)/ratios.length),medianArticleRatio:round(median(ratios)),articleRatioRange:[round(Math.min(...ratios)),round(Math.max(...ratios))],articles};
}
const sel=result.variants.selected;
sel.articleUseBuckets=[[1,3],[4,9],[10,19],[20,null]].map(([min,max])=>{const aa=sel.articles.filter(a=>a.uniqueUses>=min&&(max===null||a.uniqueUses<=max));const words=aa.reduce((n,a)=>n+a.words,0),uses=aa.reduce((n,a)=>n+a.uniqueUses,0);return {minUses:min,maxUses:max,articleCount:aa.length,articleIds:aa.map(a=>a.id),words,sumArticleUniqueUses:uses,wordsPerArticleIncidence:round(words/uses),shareOfSelectedWords:round(words/sel.words)};});
result.protectedParts={partOneHan:previous.baseline.partOne.han,partTwoEnglishWords:previous.baseline.partTwo.englishWords,partTwoExamples:previous.baseline.partTwo.examples,note:'Protected P1/P2 are byte-identical in the old experiment; this analysis does not regenerate them.'};
result.comparison={selectedP3Reduction:round(1-sel.words/result.variants.baseline.words),selectedP2P3Reduction:round(1-(sel.words+result.protectedParts.partTwoEnglishWords)/(result.variants.baseline.words+result.protectedParts.partTwoEnglishWords)),selectedWordsAddedOverCompact:sel.words-result.variants.compact.words,netWordReductionInNoUseSentences:result.variants.baseline.noUseWords-sel.noUseWords,note:'Aggregate difference in sentences carrying no USE annotation is not a proof that every removed background sentence was redundant; rewrites change sentence boundaries.'};
await fs.writeFile(path.join(here,'analysis.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({output:path.relative(root,path.join(here,'analysis.json')),variants:Object.fromEntries(Object.entries(result.variants).map(([k,v])=>[k,{words:v.words,uses:v.globalUniqueUses,wordsPerUse:v.wordsPerGlobalUniqueUse}]))}));
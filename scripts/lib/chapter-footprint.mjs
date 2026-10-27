// Counts expose size; they neither grade teaching nor authorize deletion.
import {readFile,readdir} from 'node:fs/promises';
import path from 'node:path';
import {validateAnnotatedContent,sentenceRecords,DAILY_WORD_COUNT} from '../../web/annotations.js';

export const englishWords = value => (value.match(/[A-Za-z]+(?:['-][A-Za-z]+)*/g) || []).length;
const han = value => (value.match(/[\u3400-\u9fff]/g) || []).length;
const sum = values => values.reduce((a,b)=>a+b,0);
const measurement='ASCII English alphabetic tokens; compounds joined by ASCII apostrophe U+0027 or hyphen U+002D count as one; numbers, titles and translations excluded from English body counts; Han code points exclude punctuation';
const notice='Counts and USE references do not verify meaning, facts, readability, mastery or personal study time.';
const draftNotice='未完成作者稿观察：分母为已齐第一部分的全部USE身份，当前字数仅是已写部分；必须结合实际引用进度阅读，不可与完稿直接比较，不预测整章规模，不证明语义覆盖或质量。';
function thirdFootprint(parsed) {
  const articles=parsed.articles.map(article=>{
    const sentences=parsed.sentences.filter(s=>s.articleId===article.id);
    return {id:article.id,title:article.title,sentences:sentences.length,
      englishWords:sum(sentences.map(s=>englishWords(s.text))),
      translationHan:sum(sentences.map(s=>han(s.translation))),
      uniqueUses:new Set(sentences.flatMap(s=>s.refs)).size};
  });
  const lengths=articles.map(a=>a.englishWords).sort((a,b)=>a-b);
  const middle=Math.floor(lengths.length/2),median=lengths.length?(lengths.length%2?lengths[middle]:(lengths[middle-1]+lengths[middle])/2):0;
  const p3=parsed.sentences.map(s=>s.text).join(' ');
  const referencesPerSentence={};
  for(const sentence of parsed.sentences) referencesPerSentence[sentence.refs.length]=(referencesPerSentence[sentence.refs.length]||0)+1;
  return {articles,partThree:{articles:articles.length,sentences:parsed.sentences.length,englishWords:englishWords(p3),translationHan:sum(parsed.sentences.map(s=>han(s.translation))),minArticleWords:lengths[0]??0,maxArticleWords:lengths.at(-1)??0,medianArticleWords:median,
    meanSentenceWords:parsed.sentences.length?englishWords(p3)/parsed.sentences.length:0,maxSentenceWords:Math.max(0,...parsed.sentences.map(s=>englishWords(s.text))),referencesPerSentence}};
}
export function chapterFootprint(markdown) {
  const parsed=validateAnnotatedContent(markdown);
  if(parsed.format==='usage-context-v1'){
    const units=parsed.sentences.map(s=>s.text),english=sum(units.map(englishWords));
    return {format:parsed.format,measurement,mainWords:parsed.words.length,uses:parsed.uses.size,
      definitions:{han:han(parsed.definitions)},
      contexts:{count:parsed.contexts.length,sentences:parsed.sentences.length,englishWords:english,translationHan:sum(parsed.contexts.map(c=>han(c.translation)))},
      scale:{englishWordsPerUse:english/parsed.uses.size,notice:'Descriptive only. Natural sharing is allowed, never an optimization target; counts do not establish sense coverage or learning quality.'},
      eligibleAudio:{uniqueTexts:new Set(units).size,characters:[...new Set(units)].reduce((n,s)=>n+s.length,0),note:'Final sentence strings only; no paid request or billing promise.'},notice};
  }
  const examples=[...parsed.parts.two.matchAll(/<!-- EXAMPLE:([^ ]+) -->\s*\n([^\n]+)\n`([^`\n]+)`/g)]
    .map(([,use,text,translation])=>({use,text,translation}));
  const {articles,partThree}=thirdFootprint(parsed),p2Words=sum(examples.map(e=>englishWords(e.text)));
  const units=[...examples.map(e=>e.text),...parsed.sentences.map(s=>s.text)];
  return {measurement,mainWords:parsed.words.length,uses:parsed.uses.size,
    partOne:{han:han(parsed.parts.one)},
    partTwo:{examples:examples.length,englishWords:p2Words,translationHan:sum(examples.map(e=>han(e.translation))),uniqueTexts:new Set(examples.map(e=>e.text)).size},
    partThree,scale:{p3EnglishWordsPerUse:partThree.englishWords/parsed.uses.size,p2p3EnglishWordsPerUse:(p2Words+partThree.englishWords)/parsed.uses.size,notice:'Chapter-level observations over distinct Part One USE identities, not per-sense allowances or quality scores.'},
    eligibleAudio:{uniqueTexts:new Set(units).size,characters:[...new Set(units)].reduce((n,s)=>n+s.length,0),note:'Raw text strings only; does not apply audio-plan normalization or voice identity, query paid cache, submit a request, or estimate actual billing.'},
    articles,notice};
}

const validId=value=>typeof value==='string'&&/^[A-Za-z][A-Za-z0-9_-]{0,31}$/.test(value);
const singleLine=(value,label)=>{if(typeof value!=='string'||!value.trim()||/[\r\n]/.test(value))throw Error('缺少有效'+label);return value;};
// A declared inventory from every Part One author file, NOT a dictionary audit.
// Keep this observation separate from the unchanged final teaching validator.
function draftUseInventory(words,expectedWordCount){
  if(!Array.isArray(words)||words.length!==expectedWordCount)throw Error(`第一部分作者稿须齐全：应有${expectedWordCount}个主词，不能用部分词稿推算分母`);
  const uses=new Map(),allIds=new Set(),texts=new Set();
  for(const word of words){
    if(!validId(word?.wordId)||typeof word.text!=='string'||!word.text.trim()||texts.has(word.text)||allIds.has(word.wordId))throw Error('第一部分主词身份缺失或重复');
    texts.add(word.text);allIds.add(word.wordId);
    if(typeof word.partOne!=='string'||/<!-- PART:/.test(word.partOne))throw Error('缺少完整第一部分词稿：'+word.text);
    const body=word.partOne.replace(/\r\n?/g,'\n'),headings=[...body.matchAll(/^<!-- WORD:([^ ]+) -->\n# ([^\n]+)$/gm)];
    if(headings.length!==1||headings[0][1]!==word.wordId||headings[0][2]!==word.text)throw Error('第一部分WORD与词稿身份不一致：'+word.text);
    const markers=[...body.matchAll(/^<!-- USE:([A-Za-z][A-Za-z0-9_-]{0,31}) -->$/gm)];
    if(!markers.length||markers.length!==(body.match(/^<!-- USE:/gm)||[]).length)throw Error('第一部分USE库存缺失或格式无效：'+word.text);
    for(const marker of markers){
      if(allIds.has(marker[1]))throw Error('第一部分USE身份重复：'+marker[1]);
      const target=body.slice(marker.index+marker[0].length).trimStart();
      if(!target||target.startsWith('<!--')||target.startsWith('`'))throw Error('第一部分USE未关联具体讲解：'+marker[1]);
      allIds.add(marker[1]);uses.set(marker[1],{wordId:word.wordId});
    }
  }
  return uses;
}
function draftArticleRecords(articles,uses){
  if(!Array.isArray(articles))throw Error('articles.json须为当前作者稿数组');
  if(!articles.length)return{sentences:[],articles:[],covered:new Set()};
  const rows=[];
  for(const article of articles){
    if(!validId(article?.id))throw Error('草稿ARTICLE身份无效');
    rows.push(`<!-- ARTICLE:${article.id} -->\n# ${singleLine(article.title,'篇目标题')}`);
    if(!Array.isArray(article.paragraphs)||!article.paragraphs.length)throw Error('草稿文章不能是空壳：'+article.id);
    for(const paragraph of article.paragraphs){
      if(!Array.isArray(paragraph)||!paragraph.length)throw Error('草稿文章不能有空段落：'+article.id);
      for(const sentence of paragraph){
        if(!validId(sentence?.id)||!Array.isArray(sentence.uses)||sentence.uses.some(id=>!validId(id)))throw Error('草稿句子/USE身份无效');
        const en=singleLine(sentence.text,'英文原句'),zh=singleLine(sentence.translation,'逐句译文');
        if(/^(?:<!--|#|`)/.test(en)||zh.includes('`'))throw Error('草稿原句或译文格式无效：'+sentence.id);
        rows.push(`<!-- SENTENCE:${sentence.id}${sentence.uses.length?' USE:'+sentence.uses.join(','):''} -->\n${en}\n\`${zh}\``);
      }
    }
  }
  // Reuse the production parser for unique IDs, bilingual pairs and known refs.
  // This deliberately does NOT claim every scope USE has been referenced yet.
  return sentenceRecords(rows.join('\n'),uses);
}
export function draftChapterFootprint(words,articles,{expectedWordCount=DAILY_WORD_COUNT}={}){
  const uses=draftUseInventory(words,expectedWordCount),parsed=draftArticleRecords(articles,uses);
  const {partThree,articles:articleStats}=thirdFootprint(parsed),unreferencedUseIds=[...uses.keys()].filter(id=>!parsed.covered.has(id));
  return{mode:'draft-observation',measurement,mainWords:words.length,uses:uses.size,
    referencedUses:parsed.covered.size,unreferencedUses:unreferencedUseIds.length,unreferencedUseIds,allUsesReferenced:unreferencedUseIds.length===0,
    partOne:{han:sum(words.map(word=>han(word.partOne)))},partThree,
    scale:{p3EnglishWordsPerScopeUse:partThree.englishWords/uses.size,p3EnglishWordsPerReferencedUse:parsed.covered.size?partThree.englishWords/parsed.covered.size:null,notice:draftNotice},
    articles:articleStats,notice:draftNotice};
}
export async function authoredDraftFootprint(root,date){
  if(!/^20\d{2}-\d{2}-\d{2}$/.test(date||'')||new Date(date+'T00:00:00Z').toISOString().slice(0,10)!==date)throw Error('草稿日期无效；用法：chapter-footprint.mjs --draft YYYY-MM-DD');
  const run=path.resolve(root,'work/runs',date),folder=path.join(run,'teaching/authored');
  const selection=JSON.parse(await readFile(path.join(run,'selection.json'),'utf8'));
  if(selection.studyDate!==date||!Array.isArray(selection.mainWords)||selection.mainWords.length!==DAILY_WORD_COUNT)throw Error('缺少本日期完整50主词selection，不能猜测观察分母');
  const names=(await readdir(folder)).filter(name=>/^word-[A-Za-z0-9_-]+\.json$/.test(name));
  const words=await Promise.all(names.map(async name=>{const word=JSON.parse(await readFile(path.join(folder,name),'utf8'));if(name!==`word-${word.wordId}.json`)throw Error('作者文件名与WORD身份不符：'+name);return word;}));
  if(words.length!==selection.mainWords.length||new Set(selection.mainWords.map(word=>word.text)).size!==DAILY_WORD_COUNT||words.some(word=>!selection.mainWords.some(item=>item.text===word.text)))throw Error('第一部分作者稿未齐或与冻结主词不一致，不能观察完整分母');
  if(selection.authoringPolicy==='authentic-context-v1'){
    const uses=draftUseInventory(words,DAILY_WORD_COUNT),contexts=words.flatMap(w=>w.contexts||[]),sentences=contexts.flatMap(c=>(c.paragraphs||[]).flat());
    const referenced=new Set(sentences.flatMap(s=>s.uses||[]));
    if(new Set(contexts.map(c=>c.id)).size!==contexts.length||new Set(sentences.map(s=>s.id)).size!==sentences.length||[...referenced].some(id=>!uses.has(id)))throw Error('草稿语境/句子身份重复或指向未知用法');
    return {mode:'draft-observation',format:'usage-context-v1',date,measurement,mainWords:words.length,uses:uses.size,referencedUses:referenced.size,
      contexts:{written:contexts.length,sentences:sentences.length,englishWords:sum(sentences.map(s=>englishWords(s.text||''))),translationHan:sum(contexts.map(c=>han(c.translation||'')))},notice:draftNotice};
  }
  let articles=[],articlesStatus='not-created';
  try{articles=JSON.parse(await readFile(path.join(folder,'articles.json'),'utf8'));articlesStatus=Array.isArray(articles)&&!articles.length?'empty':'present';}catch(error){if(error.code!=='ENOENT')throw error;}
  return{...draftChapterFootprint(words,articles),date,articlesStatus};
}

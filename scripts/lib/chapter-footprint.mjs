// Counts expose size; they neither grade teaching nor authorize deletion.
import {validateAnnotatedContent} from '../../web/annotations.js';

export const englishWords = value => (value.match(/[A-Za-z]+(?:['-][A-Za-z]+)*/g) || []).length;
const han = value => (value.match(/[\u3400-\u9fff]/g) || []).length;
const sum = values => values.reduce((a,b)=>a+b,0);
export function chapterFootprint(markdown) {
  const parsed=validateAnnotatedContent(markdown);
  const examples=[...parsed.parts.two.matchAll(/<!-- EXAMPLE:([^ ]+) -->\s*\n([^\n]+)\n`([^`\n]+)`/g)]
    .map(([,use,text,translation])=>({use,text,translation}));
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
  const units=[...examples.map(e=>e.text),...parsed.sentences.map(s=>s.text)];
  return {measurement:'ASCII English alphabetic tokens; compounds joined by ASCII apostrophe U+0027 or hyphen U+002D count as one; numbers, titles and translations excluded from English body counts; Han code points exclude punctuation',
    mainWords:parsed.words.length,uses:parsed.uses.size,
    partOne:{han:han(parsed.parts.one)},
    partTwo:{examples:examples.length,englishWords:sum(examples.map(e=>englishWords(e.text))),translationHan:sum(examples.map(e=>han(e.translation))),uniqueTexts:new Set(examples.map(e=>e.text)).size},
    partThree:{articles:articles.length,sentences:parsed.sentences.length,englishWords:englishWords(p3),translationHan:sum(parsed.sentences.map(s=>han(s.translation))),minArticleWords:lengths[0]??0,maxArticleWords:lengths.at(-1)??0,medianArticleWords:median,
      meanSentenceWords:englishWords(p3)/parsed.sentences.length,maxSentenceWords:Math.max(...parsed.sentences.map(s=>englishWords(s.text))),referencesPerSentence},
    eligibleAudio:{uniqueTexts:new Set(units).size,characters:[...new Set(units)].reduce((n,s)=>n+s.length,0),note:'Raw text strings only; does not apply audio-plan normalization or voice identity, query paid cache, submit a request, or estimate actual billing.'},
    articles,notice:'Counts and USE references do not verify meaning, facts, readability, mastery or personal study time.'};
}

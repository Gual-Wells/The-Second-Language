// Shared structural contract. Reading and factual/lexical judgement remain the author's work.
import {splitParts,sentenceRecords} from '../web/annotations.js';
export const CURRENT_AFFAIRS_POLICY = 'current-affairs-v1';
const digest = value => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);
const commit = value => typeof value === 'string' && /^[a-f0-9]{40}$/.test(value);
const text = (value, name) => { if (typeof value !== 'string' || !value.trim()) throw new Error(`实事来源缺少 ${name}`); };
const date = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
const instant = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value) && /(?:Z|[+-]\d{2}:\d{2})$/.test(value) && Number.isFinite(Date.parse(value));
const canonical = value => {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${canonical(value[key])}`).join(',')}}`;
};
export function canonicalSourcePackage(value) { return canonical(value); }
export function validateSourcePackage(value, { chapterDigest, studyDate, vixInputCommit, markdown, articles } = {}) {
  if (!value || value.schemaVersion !== 1 || !date(value.studyDate) || !digest(value.chapterDigest) || !digest(value.selectionDigest) || !commit(value.vixInputCommit)) throw new Error('实事来源包身份无效');
  if ((chapterDigest && value.chapterDigest !== chapterDigest) || (studyDate && value.studyDate !== studyDate) || (vixInputCommit && value.vixInputCommit !== vixInputCommit)) throw new Error('实事来源包与章节/选词输入不一致');
  text(value.context, 'context（事实与创作边界）');
  if (!Array.isArray(value.sources) || !value.sources.length) throw new Error('新章须有实际读取的现实材料');
  const urls = new Set();
  for (const source of value.sources) {
    if (!source || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(source.sourceId || '')) throw new Error('实事来源标识无效');
    for (const key of ['url', 'title', 'publisher', 'readAt']) text(source[key], key);
    const url = new URL(source.url);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || urls.has(url.href)) throw new Error('实事来源URL无效或重复');
    urls.add(url.href);
    if (!instant(source.readAt)) throw new Error('实事来源readAt须为含时区的实际读取时刻');
    if (source.readDigest != null && !digest(source.readDigest)) throw new Error('实事原文读取摘要无效');
    for (const field of ['publishedAt', 'updatedAt']) if (source[field] != null && !date(source[field]) && !instant(source[field])) throw new Error(`${field}须保留实际日期/含时区时间；未知不填`);
    if (!Array.isArray(source.facts) || !source.facts.length) throw new Error('来源须有自写关键事实；索引标题不能冒充事实包');
    for (const fact of source.facts) text(fact, '关键事实');
    if (source.limitations != null) text(source.limitations, 'limitations');
  }
  const actualArticles=articles??(markdown==null?null:sentenceRecords(splitParts(markdown).three).articles);
  if(actualArticles?.length&&!Array.isArray(value.articles))throw Error('文章组须保留逐篇来源定位');
  if(value.articles!=null){
    if(!Array.isArray(value.articles)||!value.articles.length)throw Error('篇目来源不能为空');
    const ids=new Set();
    for(const article of value.articles){
      if(!article||!/^[A-Za-z][A-Za-z0-9_-]{0,31}$/.test(article.id||'')||ids.has(article.id))throw Error('篇目来源身份无效或重复');
      ids.add(article.id);text(article.title,'篇目标题');
      if(!Array.isArray(article.sourceUrls)||!article.sourceUrls.length||new Set(article.sourceUrls).size!==article.sourceUrls.length||article.sourceUrls.some(url=>!value.sources.some(s=>s.url===url)))throw Error('篇目须引用本包内已实际读取的来源');
    }
    if(actualArticles&&JSON.stringify(value.articles.map(a=>[a.id,a.title]))!==JSON.stringify(actualArticles.map(a=>[a.id,a.title])))throw Error('来源篇目与正文身份、标题或顺序不一致');
  }
  if (new TextEncoder().encode(canonical(value)).length > 262144) throw new Error('实事来源包超过256KiB；这里只存必要摘要，不存新闻全文');
  return value;
}

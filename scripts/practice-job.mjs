import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { publisherConfig } from './lib/publisher-config.mjs';

const [command, id, filename] = process.argv.slice(2);
const { base, token } = await publisherConfig();
async function call(endpoint, method = 'GET', value) {
  const response = await fetch(new URL(endpoint, base), { method, headers: { authorization: `Bearer ${token}`, ...(value ? { 'content-type': 'application/json' } : {}) }, body: value ? JSON.stringify(value) : undefined });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || `API ${response.status}`);
  return data;
}
async function save(file, value) { await mkdir(path.dirname(file), { recursive: true }); await writeFile(file, JSON.stringify(value, null, 2)); }
if (command === 'next') {
  const [request, review,listening,reading,speaking] = await Promise.all([call('/api/practice/publisher/next'),call('/api/practice/publisher/review/next'),call('/api/practice/publisher/listening/next'),call('/api/practice/publisher/reading/next'),call('/api/practice/publisher/speaking/next')]);
  console.log(JSON.stringify({ requestId: request.request?.id || null,skills:request.request?.skills||[],profiles:request.request?.profiles||{},attemptId: review.attemptId,listeningAttemptId:listening.attemptId,readingAttemptId:reading.attemptId,speakingPrepareId:speaking.prepareId,speakingAttemptId:speaking.attemptId,speakingAttentionId:speaking.attentionId }));
} else if (command === 'claim' && id) {
  const result = await call('/api/practice/publisher/claim','POST',{ id });
  await save(path.resolve('work/expression', id, 'claim.json'), result);
  console.log(`已领取表达练习 ${id}；固定来源 ${result.request.sources.length} 章`);
} else if (command === 'source' && id && filename) {
  const result = await call(`/api/practice/publisher/sources/${encodeURIComponent(id)}/${encodeURIComponent(filename)}`);
  const target = path.resolve('work/expression/sources', `${id}-${filename}.md`);
  await mkdir(path.dirname(target),{ recursive: true }); await writeFile(target,result.markdown);
  console.log(target);
} else if (command === 'publish' && id && filename) {
  const claim = JSON.parse(await readFile(path.resolve('work/expression',id,'claim.json'),'utf8'));
  const set = JSON.parse(await readFile(path.resolve(filename),'utf8'));
  const result = await call('/api/practice/publisher/sets','POST',{ requestId:id, claimToken:claim.claimToken, set });
  console.log(JSON.stringify(result));
} else if (command === 'review-claim') {
  const result = await call('/api/practice/publisher/review/claim','POST',{});
  if (result.attempt) { await save(path.resolve('work/expression/reviews',result.attempt.id,'claim.json'),result); console.log(`已领取批改 ${result.attempt.id}`); }
  else console.log('没有待批改答案');
} else if (command === 'review-complete' && id && filename) {
  const claim = JSON.parse(await readFile(path.resolve('work/expression/reviews',id,'claim.json'),'utf8'));
  const review = JSON.parse(await readFile(path.resolve(filename),'utf8'));
  console.log(JSON.stringify(await call('/api/practice/publisher/review/complete','POST',{ attemptId:id, claimToken:claim.claimToken, review })));
} else if(command==='listening-claim'){
  const result=await call('/api/practice/publisher/listening/claim','POST',{});if(result.attempt){await save(path.resolve('work/expression/listening-reviews',result.attempt.id,'claim.json'),result);console.log(`已领取听力反馈 ${result.attempt.id}`);}else console.log('没有待分析听力');
} else if(command==='listening-complete'&&id&&filename){
  const claim=JSON.parse(await readFile(path.resolve('work/expression/listening-reviews',id,'claim.json'),'utf8'));const review=JSON.parse(await readFile(path.resolve(filename),'utf8'));console.log(JSON.stringify(await call('/api/practice/publisher/listening/complete','POST',{id,claimToken:claim.claimToken,review})));
} else if(command==='reading-claim'){const result=await call('/api/practice/publisher/reading/claim','POST',{});if(result.attempt){await save(path.resolve('work/expression/reading-reviews',result.attempt.id,'claim.json'),result);console.log(`已领取阅读反馈 ${result.attempt.id}`);}else console.log('没有待分析阅读');
} else if(command==='reading-complete'&&id&&filename){const claim=JSON.parse(await readFile(path.resolve('work/expression/reading-reviews',id,'claim.json'),'utf8')),review=JSON.parse(await readFile(filename,'utf8'));console.log(JSON.stringify(await call('/api/practice/publisher/reading/complete','POST',{id,claimToken:claim.claimToken,review})));
} else {
  throw new Error('用法: practice-job.mjs next|claim ID|source 章节ID digest|publish 请求ID set.json|review-claim|review-complete 答卷ID review.json|listening-claim|listening-complete 答卷ID review.json|reading-claim|reading-complete 答卷ID review.json');
}

import fs from 'node:fs/promises';
import path from 'node:path';
import {validateTeachingLayout} from '../web/annotations.js';
import {publicationReviewDraft} from '../protocol/publication-review.mjs';
import {loadPublicationReview} from './lib/publication-review.mjs';
import {loadChapterEvidence} from './lib/chapter-evidence.mjs';
const [action,date]=process.argv.slice(2);
if(!['draft','verify'].includes(action)||!/^20\d{2}-\d{2}-\d{2}$/.test(date||''))throw Error('用法：node scripts/publication-review.mjs draft|verify YYYY-MM-DD；draft仅建未完成模板');
const root=process.cwd(),chapter=JSON.parse(await fs.readFile(path.join(root,'chapters',date,'chapter.json'),'utf8'));
const parsed=validateTeachingLayout(chapter.markdown,chapter.contentPolicy);
if(parsed.format!=='usage-context-v1')throw Error('此记录仅用于新单正文出版，不回填历史合同');
if(action==='draft'){
 const file=path.join(root,'work/runs',date,'teaching/publication-review.json');await fs.mkdir(path.dirname(file),{recursive:true});
 await fs.writeFile(file,JSON.stringify(publicationReviewDraft({chapter,parsed,runId:chapter.runId||date}),null,2)+'\n',{flag:'wx'});
 console.log('已创建draft；未签发语义通过，实际审阅后填写真实身份、时间、检查与问题处置。');
}else{
 const evidence=await loadChapterEvidence(root,date,chapter.sourcePackage,{markdown:chapter.markdown});
 const result=await loadPublicationReview(root,date,chapter,{evidence});console.log(JSON.stringify({valid:true,digest:result.digest,semanticCorrectnessProven:false}));
}

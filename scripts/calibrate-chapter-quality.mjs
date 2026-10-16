import {qualityModelArgs,qualityModelEnvironment} from './lib/quality-model.mjs';
// Explicit manual semantic probe. Never invoked by the unattended queue or CI.
import {spawn} from 'node:child_process';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {qualityPolicy,inventorySchema,reviewSchema,validateInventory,validateReview} from '../protocol/chapter-quality-contract.mjs';
import {qualityInstruction} from './lib/chapter-quality-runner.mjs';
import {loadTextbooks,lookupBooks,hash} from './lib/textbook-sources.mjs';
if(!process.argv.includes('--execute'))throw Error('仅手动运行：设置 SECOND_LANGUAGE_CODEX_EXECUTABLE 后加 --execute；会使用 Codex 额度。');
const executable=process.env.SECOND_LANGUAGE_CODEX_EXECUTABLE;if(!executable)throw Error('缺少既有 Codex CLI 路径');
const root=process.cwd(),directory=path.join(root,'.cache/chapter-quality-calibration',new Date().toISOString().replace(/[:.]/g,'-'),'model');await mkdir(directory,{recursive:true});
const books=await loadTextbooks({root,commit:'821651446af60912b242ea389bd6891b00381a47',etymology:false});
const entries=lookupBooks(books,['precaution','precautionary']);
async function model(schema,prompt,name){const schemaFile=path.join(directory,name+'.schema.json'),output=path.join(directory,name+'.json');await writeFile(schemaFile,JSON.stringify(schema));await writeFile(path.join(directory,name+'.input.txt'),prompt);const code=await new Promise((resolve,reject)=>{const child=spawn(executable,['-a','never','exec','--ignore-user-config','--skip-git-repo-check','-C',directory,'-m','gpt-6-sol','-c','model_reasoning_effort="high"','-c','model_provider="openai_qa"','-c','model_providers.openai_qa.name="OpenAI chapter questions"','-c','model_providers.openai_qa.base_url="https://chatgpt.com/backend-api/codex"','-c','model_providers.openai_qa.wire_api="responses"','-c','model_providers.openai_qa.requires_openai_auth=true','-c','model_providers.openai_qa.supports_websockets=false','-s','read-only',...qualityModelArgs,'--output-schema',schemaFile,'-o',output,'-'],{windowsHide:true,stdio:['pipe','pipe','pipe'],env:qualityModelEnvironment()});let log='';child.stdout.on('data',b=>log+=b);child.stderr.on('data',b=>log+=b);child.once('error',reject);child.once('close',async c=>{await writeFile(path.join(directory,name+'.log'),log);resolve(c);});child.stdin.on('error',()=>{});child.stdin.end(prompt);});if(code)throw Error('模型执行未完成 '+code);return JSON.parse(await readFile(output,'utf8'));}
const sourcePrompt=qualityInstruction+'\n固定标准：'+JSON.stringify(qualityPolicy)+'\n独立阅读原教材，整理 precaution 及相关派生全部内容和原例句为 facts；不要臆测生产结果。确需补读的词列 extraTerms；仅据给定材料判断闭合。facts 各有真实 refs。\n'+JSON.stringify({wordId:'W001',word:'precaution',entries});
const inventory=validateInventory(await model(inventorySchema,sourcePrompt,'source-inventory'),{id:'W001'},entries);
// Keys and expected states stay outside the model input. The reviewer sees no mutation labels.
const cases=[
 {targetId:'a',state:'issue',target:{id:'a',kind:'source',wordId:'W001',text:'precaution 可数名词：为防止危险、不良后果或确保好结果而事先采取的防范措施。precautionary：预防性的，正式用语，通常放名词前。\n例句：Could he not, just as a precaution, move to a place of safety?\nExtra safety precautions are essential in homes where older people live.\nThe local administration says the curfew is a precautionary measure.'}},
 {targetId:'b',state:'issue',target:{id:'b',kind:'translation',wordId:'W001',text:'No extra precautions are needed.',translation:'必须采取额外的预防措施。'}},
 {targetId:'c',state:'supported',target:{id:'c',kind:'translation',wordId:'W001',text:'Bring an umbrella as a precaution.',translation:'带上一把伞，以防万一。'}},
 {targetId:'d',state:'supported',target:{id:'d',kind:'etymology',wordId:'W001',text:'词源：其中表示“在前”的成分，与表示“提防、防备”的成分结合，可以帮助理解“事先防范”。本区块不为每种用法分别展开词源。'}}
];
const targets=cases.map(c=>c.target),result=validateReview(await model(reviewSchema,qualityInstruction+'\n请对每个 target 恰好给一条结论；source 核查教材内容是否遗漏，translation 核查译义，etymology 仅检查明显教学误导、不强求逐义对应或学术细节。发现需给真实引文与具体理由。\n'+JSON.stringify({targets,entries,inventory}),'review'),targets,entries);
const checks=cases.map(c=>({targetId:c.targetId,expected:c.state,actual:result.checks.find(r=>r.targetId===c.targetId).state}));
const omission=result.findings.filter(f=>f.targetId==='a').some(f=>/避孕|contracept/i.test(f.explanation+' '+f.action));
const record={checkedAt:new Date().toISOString(),model:'gpt-6-sol/high',toolRestrictions:qualityModelArgs,scope:'一个真实词族的独立清单、两处已知缺陷与两处对照；不是整库准确率或正式全章质检。',sourceDigests:books.map(b=>({book:b.book,digest:b.digest})),inventoryFacts:inventory.facts.length,inventoryDigest:hash(Buffer.from(JSON.stringify(inventory))),checks,missingOxfordSenseDetected:omission,passed:omission&&checks.every(c=>c.actual===c.expected),thirdPartyPaidCalls:0};
await writeFile(path.join(root,'research/chapter-quality-semantic-calibration-2026-10-16.json'),JSON.stringify(record,null,2)+'\n');console.log(JSON.stringify(record));assert.ok(record.passed,'Semantic calibration needs investigation');

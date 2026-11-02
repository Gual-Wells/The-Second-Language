// Actual observed regression: numeric chapter label passed local work, then
// failed at stage after 250MB of evidence upload. No real credentials or IO API.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {assertChapterLabels} from '../protocol/chapter-metadata.mjs';
import {verifyChapterPublication} from './lib/chapter-publication-preflight.mjs';
import worker from '../worker/src/index.js';
const project=fileURLToPath(new URL('../',import.meta.url)),date='2099-01-01',root=await fs.mkdtemp(path.join(project,'.cache/chapter-label-check-')),checks=[];
const label={title:'Self-written isolated fixture',subtitle:'Not a course',number:'第 1 章'};
assert.equal(assertChapterLabels(label),label);assertChapterLabels({...label,number:'第 1 课'});checks.push('current and historical text labels retain the server contract');
for(const [field,bad] of [['number',1],['title','x'.repeat(181)],['subtitle','x'.repeat(301)]]){
 const value={...label,[field]:bad};assert.throws(()=>assertChapterLabels(value),new RegExp(field));
 const response=await worker.fetch(new Request('https://fixture.invalid/api/publish/stage',{method:'POST',headers:{authorization:'Bearer fixture-only','content-type':'application/json'},body:JSON.stringify({...value,id:date,date,runId:date,wordCount:30,chapterSizePolicy:'thirty-main-words-v1',markdown:'not reached'})}),{PUBLISH_TOKEN:'fixture-only',DB:{prepare(){throw Error('Must reject before database or storage');}}},{});
 assert.equal(response.status,400);assert((await response.json()).error.includes(field));checks.push(`Worker and local validators reject invalid ${field} before storage`);
}
const folder=path.join(root,'chapters',date);await fs.mkdir(folder,{recursive:true});const bad={...label,number:1};await fs.writeFile(path.join(folder,'meta.json'),JSON.stringify(bad));await fs.writeFile(path.join(folder,'chapter.json'),JSON.stringify(bad));await fs.writeFile(path.join(folder,'chapter.md'),'not reached');
await assert.rejects(verifyChapterPublication({root,date,chapter:bad}),/number/);checks.push('full admission rejects labels before source or evidence acquisition');
for(const entry of ['pack-chapter.mjs','publish-chapter.mjs']){
 const result=spawnSync(process.execPath,[path.join(project,'scripts',entry),date],{cwd:root,encoding:'utf8',windowsHide:true,env:{...process.env,SECOND_LANGUAGE_PUBLISH_TOKEN:'fixture-only',SECOND_LANGUAGE_API_URL:'https://must-not-contact.invalid',SECOND_LANGUAGE_CREDENTIAL_FILE:path.join(root,'nonexistent-private-file')}});
 assert.notEqual(result.status,0);assert(result.stderr.includes('number'),result.stderr);checks.push(`${entry} rejects the observed numeric label before frozen inputs, credentials or networking`);
}
console.log(JSON.stringify({passed:checks.length,checks,networkCalls:0,realModelCalls:0,productionCredentialsRead:false},null,2));

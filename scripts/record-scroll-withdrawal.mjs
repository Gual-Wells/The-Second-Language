import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
const base='https://the-second-language.pages.dev',cache='.cache/project-scroll-withdrawal';await mkdir(cache,{recursive:true});
const checks=[];
for(const [id,url,source]of [['catalogue','/certification-reader.js?v=38','web/certification-reader.js'],['shell','/sw.js?v=38','web/sw.js']]){
 const destination=cache+'/'+id+'.body',status=Number(execFileSync('curl.exe',['--silent','--show-error','--proxy','http://127.0.0.1:6987','--max-time','45','--output',destination,'--write-out','%{http_code}',base+url],{encoding:'utf8',windowsHide:true}));
 assert.equal(status,200);assert.deepEqual(await readFile(destination),await readFile(source));checks.push({id,url,status,sourceBytesMatch:true});
}
const catalogue=await readFile(cache+'/catalogue.body','utf8');assert.ok(!catalogue.includes("id:'project-returning-thread'"));assert.ok(catalogue.includes("number:1,chapter:'one'"));assert.ok(catalogue.includes("number:5,chapter:'five'"));
await writeFile('research/project-scroll-redesign-2026-10-21/withdrawal.json',JSON.stringify({state:'rejected-by-user-and-withdrawn-from-catalogue',checkedAt:new Date().toISOString(),base,sourceCommit:'741d298f0a3eeb77ca597842fd53ad7702c6e010',immutable:'https://815db493.the-second-language.pages.dev',shell:38,originalContentSHA:'af914e503979155ba41bd4dcaa2e1dbbec7577b8ac293627b336b9ccff3e7425',sourceArtifactsRetained:true,checks},null,2)+'\n');console.log(JSON.stringify({withdrawn:true,checks}));

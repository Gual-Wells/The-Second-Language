import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const base='https://the-second-language.pages.dev',directory='.cache/project-scroll-release-check';await mkdir(directory,{recursive:true});
const checks=[];
for(const [id,pathname,status]of [['session','/api/session',200],['practice','/api/practice',401],['shell','/sw.js?v=37',200],['surfaceManifest','/labs/project-commemorative/assets/surfaces.json',200]]){
 const target=directory+'/'+id+'.body',actual=Number(execFileSync('curl.exe',['--silent','--show-error','--proxy','http://127.0.0.1:6987','--max-time','45','--output',target,'--write-out','%{http_code}',base+pathname],{encoding:'utf8',windowsHide:true}));
 assert.equal(actual,status,id);const bytes=await readFile(target),body=bytes.toString('utf8');
 if(id==='session')assert.equal(JSON.parse(body).authenticated,false);
 if(id==='shell'){assert.ok(body.includes('second-language-shell-v37'));assert.ok(body.includes('/certification-reader.js?v=37'));}
 if(id==='surfaceManifest')assert.deepEqual(bytes,await readFile('web/labs/project-commemorative/assets/surfaces.json'));
 checks.push({id,status:actual,sha256:createHash('sha256').update(bytes).digest('hex')});
}
await writeFile('research/project-commemorative-2026-10-21/gateway-verification.json',JSON.stringify({base,checkedAt:new Date().toISOString(),method:'Anonymous requests through the actual production gateway, without browser API mocks or cookies.',checks},null,2));console.log(JSON.stringify(checks));

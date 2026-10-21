import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const report=JSON.parse(await readFile('research/certification-reader-2026-10-21/verification.json','utf8'));
if(report.errors.length||report.missing.length||report.writes.length||Object.values(report.checks).some(v=>v!==true))throw Error('No passing reader interaction report');
const paths=new Set(report.resources.map(r=>new URL(r).pathname).filter(p=>!p.startsWith('/api/')&&!p.startsWith('/auth/')).map(p=>p==='/'?'/index.html':p));
for(const p of ['/labs/certification-reader/CREDITS.md','/labs/certification-reader/AUDIO_CREDITS.md'])paths.add(p);
const files=[];
for(const url of paths){if(url.includes('..'))throw Error('Bad asset path');const bytes=execFileSync('git',['show',':web'+url],{windowsHide:true,maxBuffer:32*1024*1024});files.push({url,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});}
const manifest={schema:'second-language.certification-reader-display.v1',issued:false,works:[{chapter:1,sha256:report.first.sha256},{chapter:5,sha256:report.fifth.sha256}],scope:'Main settings entry with public, unissued first/fifth specimens only. No certification database, native authoring archive or private awarded artifact.',files,bytes:files.reduce((n,f)=>n+f.bytes,0)};
await writeFile('web/labs/certification-reader/display-manifest.json',JSON.stringify(manifest,null,2)+'\n');console.log(JSON.stringify({files:files.length,bytes:manifest.bytes}));

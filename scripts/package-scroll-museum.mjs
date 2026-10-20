import {readFile,writeFile,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
const root=process.cwd(),report=JSON.parse(await readFile('research/scroll-museum-2026-10-21/verification.json','utf8'));
if(report.errors.length||Object.values(report.checks).some(v=>v!==true))throw Error('No passing museum runtime report');
const paths=[...new Set(['/labs/scroll-museum-v1/index.html','/labs/scroll-museum-v1/CREDITS.md','/labs/scroll-museum-v1/AUDIO_CREDITS.md',...report.resources])];
const files=[],fromIndex=process.argv.includes('--index');
for(const url of paths){
 if(!url.startsWith('/labs/')&&!['/styles.css','/owner-identity.js','/icon.svg'].includes(url))throw Error('Unexpected asset in observed closure');
 const filename=path.resolve(root,'web','.'+url);if(!filename.startsWith(path.join(root,'web')+path.sep))throw Error('Asset outside web root');
 const bytes=fromIndex?execFileSync('git',['show',':web'+url],{cwd:root,windowsHide:true,maxBuffer:32*1024*1024}):await readFile(filename);files.push({url,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});
}
const manifest={schema:'second-language.scroll-museum-display.v1',status:'specimen',issued:false,chapterId:'2026-10-12',chapterNumber:5,contentSha256:report.recordSHA256,scope:'/labs/scroll-museum-v1/',runtimeClosure:'Observed successful take/open/detail/return/context-recovery path; not a native authoring archive or a production collection manifest',files,bytes:files.reduce((n,f)=>n+f.bytes,0),notes:['Original v20 paper and physical keeper remain the craft baseline.','This display uses the museum-only keeper derivative, with final v19 finishing required.','No private account, credential, test submission or eligibility is stored here.','A display package does not replace native Blender, paper source and licensed master archives.']};
await writeFile('web/labs/scroll-museum-v1/display-manifest.json',JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify({files:files.length,bytes:manifest.bytes,source:fromIndex?'git index':'working files',contentSha256:manifest.contentSha256}));

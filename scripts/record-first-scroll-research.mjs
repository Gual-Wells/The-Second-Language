import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {mkdir,writeFile} from 'node:fs/promises';
const commit='17acb31e0241180b5f0c19b463492cc6ef756c80';
const paths=[
 'research/scroll-lab/README.md','research/scroll-lab-v2/README.md',
 ...[3,4,5,6].flatMap(v=>[`research/scroll-lab-v${v}/README.md`,`research/scroll-lab-v${v}/PROMPTS.md`]),
 ...[7,8,9,10,11].map(v=>`research/scroll-lab-v${v}/README.md`),
 'research/scroll-lab-v6/fidelity.json','research/scroll-lab-v6/continuity.json',
 'research/scroll-lab-v12/README.md','research/scroll-lab-v12-sample/README.md','research/scroll-lab-v12-sample/PROMPTS.md',
 'web/labs/chapter-scroll/CREDITS.md','web/labs/chapter-scroll/document.js','web/labs/chapter-scroll/scroll-object.js',
 'web/labs/chapter-scroll-v2/document.js','web/labs/chapter-scroll-v3/scroll-object.js',
 'web/labs/chapter-scroll-v4/CREDITS.md','web/labs/chapter-scroll-v4/document.js','web/labs/chapter-scroll-v4/scroll-object.js',
 'web/labs/chapter-scroll-v5/document.js','web/labs/chapter-scroll-v5/scroll-object.js',
 'web/labs/chapter-scroll-v6/scroll-object.js','web/labs/chapter-scroll-v6/templates.js',
 'web/labs/chapter-scroll-v4/assets/skin-normal.jpg','web/labs/chapter-scroll-v4/assets/skin-roughness.jpg',
 'web/labs/chapter-scroll-v8/scroll-object.js','web/labs/chapter-scroll-v8/document.js','web/labs/chapter-scroll-v9/ink-transfer.js',
 'web/labs/chapter-scroll-v10/ink-transfer.js','web/labs/chapter-scroll-v12/document.js','web/labs/chapter-scroll-v12/seal.js','web/labs/chapter-scroll-v12/charter.js',
 'scripts/check-scroll-fidelity-v6.mjs','scripts/check-scroll-continuity-v6.mjs'
];
const sources=[];
for(const file of paths){
 const bytes=execFileSync('git',['show',`${commit}:${file}`],{windowsHide:true,maxBuffer:16*1024*1024});
 sources.push({path:file,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex'),url:`https://github.com/Gual-Wells/The-Second-Language/blob/${commit}/${file}`});
}
const directory='research/project-scroll-redesign-2026-10-21';await mkdir(directory,{recursive:true});
await writeFile(directory+'/first-chapter-source-index.json',JSON.stringify({schema:'second-language.research-evidence.v1',recordedAt:new Date().toISOString(),repository:'Gual-Wells/The-Second-Language',commit,method:'Bytes read from the immutable Git object, not mutable working-tree line endings. Selected technical and process evidence, not a claim that a file hash proves artistic quality.',sources},null,2)+'\n');
console.log(JSON.stringify({commit,sourceFiles:sources.length}));

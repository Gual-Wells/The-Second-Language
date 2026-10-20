// Read-only asset inventory for the craft review. Does not bake, generate,
// publish, upload, or claim that selected files form a complete release package.
import {createReadStream} from 'node:fs';
import {readFile,writeFile,mkdir,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const git=(...args)=>execFileSync('git',args,{cwd:root,encoding:'utf8',windowsHide:true}).trim();
const tracked=new Set(git('ls-files','-z').split('\0'));
const json=async p=>JSON.parse(await readFile(path.join(root,p),'utf8'));
const inputs=[];
const add=(role,p,expected=null)=>inputs.push({role,path:p,expectedSHA256:expected});
add('native builder','scripts/keeper-physical-build.py','d3aaa51365ded2a10727745bc9b9b6f0c7d377a5f944610f45f02de092ccbc3b');
add('runtime fitted keeper','web/labs/chapter-scroll-v17/assets/keeper-physical.glb','a6084299daf55d9ead8e7905ab973fe6be9ec88a6a7f26914230c1f04e959668');
add('native fitted keeper','.cache/keeper-v17-native/keeper-physical.blend','ba95bb3ebc448759b3984a6bd23b97bcd73040d92348dc89085c9f6ffc6d4831');
add('native material workshop','.cache/keeper-v19-native/keeper-finishing-workshop.blend','136c14106da1be148e472f11c724825d72155c40b7e7cd2f1319c8d0f131d1f1');
add('upstream bake dependency','.cache/keeper-physical/bronze-normal-baked.png');
const plan=await json('web/labs/chapter-scroll-v14/art-plan.json');
add('fifth chapter plan','web/labs/chapter-scroll-v14/art-plan.json','3104ec4b67859f64268c11a327f37a65d1bdfc48c6f75adc24ee702d3f6318fb');
add('fifth chapter paper','web/labs/chapter-scroll-v14/assets/parchment.webp',plan.resources.paper.sha256);
add('fifth chapter miniature','web/labs/chapter-scroll-v13/assets/leaf-and-letter.png',plan.resources.ornament.sha256);
add('series font','web/labs/chapter-scroll/assets/Aboensis-Regular.otf',plan.resources.font.sha256);
for(const item of await json('research/scroll-keeper-physical-2026-10-19/material-sources.json'))add('licensed scan input','.cache/keeper-physical/'+item.file,item.sha256);
const materials=await json('research/scroll-aging-v19-2026-10-20/material-manifest.json');
for(const item of materials.outputs)add('PNG master','.cache/keeper-v19-native/png-masters/'+item.file,item.sha256);
for(const item of materials.packedOutputs)add('runtime material','web/labs/chapter-scroll-v19/assets/'+item.file,item.sha256);
for(const p of ['web/labs/chapter-scroll-v20/app.bundle.js','web/labs/chapter-scroll-v20/mist.js','web/labs/chapter-scroll-v20/flow.js','web/labs/chapter-scroll-v17/keeper-path.json'])add('runtime source/data',p);
const files=[];
for(const item of inputs){
 const absolute=path.join(root,item.path);let info;
 try{info=await stat(absolute);}catch(e){if(e.code!=='ENOENT')throw e;files.push({...item,exists:false,tracked:tracked.has(item.path)});continue;}
 const hash=createHash('sha256');for await(const chunk of createReadStream(absolute))hash.update(chunk);
 const sha256=hash.digest('hex');
 files.push({...item,exists:true,bytes:info.size,sha256,expectedMatches:item.expectedSHA256?sha256===item.expectedSHA256:null,tracked:tracked.has(item.path)});
}
const failures=files.filter(x=>!x.exists||x.expectedMatches===false);
const report={schema:'second-language.scroll-baseline-inventory.v1',purpose:'selected craft baseline evidence; not a frozen issued package or full dependency closure',checkedAt:new Date().toISOString(),
 repository:{root,branch:git('branch','--show-current'),baselineHEAD:'72da09fc9d2bedf4c5805f9517dcfa7736cd7d7c',HEADAtInspection:git('rev-parse','HEAD'),dirtyBeforeProtocolWork:false,inspection:'Documentation edits in progress; media inspected read-only'},
 summary:{selectedFiles:files.length,allSelectedPresent:files.every(x=>x.exists),allAvailableExpectedDigestsMatch:failures.length===0,notTrackedFiles:files.filter(x=>!x.tracked).length},
 boundaries:{selectedFilesOnly:true,cleanCloneNativeRebuildVerified:false,permanentNativeArchiveVerified:false,automatedProductionImplemented:false,formalIssuanceEnabled:false,artisticApprovalInferredFromHashes:false},files};
const out=path.join(root,'research/scroll-production-2026-10-20');await mkdir(out,{recursive:true});await writeFile(path.join(out,'baseline-inventory.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({summary:report.summary,failures}));if(failures.length)process.exitCode=1;

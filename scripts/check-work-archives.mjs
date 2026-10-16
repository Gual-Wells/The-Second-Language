import assert from 'node:assert/strict';
import {mkdir,mkdtemp,readFile,writeFile,symlink,rm,realpath} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
import {archiveWorking} from './lib/work-archives.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),parent=path.join(root,'.cache/archive-contract');await mkdir(parent,{recursive:true});
const scratch=await mkdtemp(path.join(parent,'junction-')),project=path.join(scratch,'project'),approved=path.join(scratch,'approved'),outside=path.join(scratch,'outside');
const hash=b=>createHash('sha256').update(b).digest('hex'),objects=new Map(),content=new Map();
async function put(key,value){const bytes=Buffer.from(value);objects.set(key,bytes);content.set(hash(bytes),bytes);return{digest:hash(bytes)};}
async function file(name,value){await mkdir(path.dirname(name),{recursive:true});await writeFile(name,value);}
async function link(target,name){await mkdir(path.dirname(name),{recursive:true});await symlink(target,name,process.platform==='win32'?'junction':'dir');}
function rebuild(groups){const rebuilt=new Map();for(const group of groups){const bytes=content.get(group.digest);assert.equal(hash(bytes),group.digest);const manifest=JSON.parse(bytes);const files=new Map();for(const c of manifest.chunks){const zipped=content.get(c.digest);assert.equal(hash(zipped),c.digest);for(const p of JSON.parse(gunzipSync(zipped)).files){const data=Buffer.from(p.data,'base64');assert.equal(hash(data),p.partDigest);const old=files.get(p.path)||Buffer.alloc(0);assert.equal(p.offset,old.length);files.set(p.path,Buffer.concat([old,data]));}}for(const f of manifest.files){const data=files.get(f.path);assert.equal(data.length,f.bytes);assert.equal(hash(data),f.digest);rebuilt.set(manifest.group+'/'+f.path,data);}}return rebuilt;}
try{
 await file(path.join(project,'work/runs/2026-10-02/words/one.md'),'old chapter');
 let groups=await archiveWorking(project,put);assert.equal(rebuild(groups).get('runs/2026-10-02/words/one.md').toString(),'old chapter');
 await file(path.join(approved,'daily/2026-10-11/words/语义.md'),'immutable evidence — 词义、例句与出处');
 const big=Buffer.alloc(8*1024*1024+31,7);await file(path.join(approved,'daily/2026-10-11/large.bin'),big);
 await file(path.join(approved,'daily/2026-10-11/credentials/private.json'),'NEVER ARCHIVE');
 await file(path.join(approved,'daily/2026-10-11/.env'),'NEVER ARCHIVE');
 await file(path.join(outside,'unrelated.txt'),'NEVER FOLLOW');
 await link(path.join(approved,'daily/2026-10-11'),path.join(project,'work/runs/2026-10-11'));
 await link(outside,path.join(approved,'daily/2026-10-11/nested-external'));
 await link(path.join(approved,'daily/2026-10-11'),path.join(approved,'daily/2026-10-11/loop'));
 await file(path.join(approved,'practice/build/task/context.md'),'practice evidence');
 await link(path.join(approved,'practice'),path.join(project,'work/expression'));
 await file(path.join(approved,'speaking/record.json'),'{}');await file(path.join(approved,'speaking/run.mjs'),'not an evidence format');
 await link(path.join(approved,'speaking'),path.join(project,'.cache/speaking'));
 const config=path.join(project,'.cache/runtime-sources.json');await file(config,'\uFEFF'+JSON.stringify({roots:[],linkedDirectoryRoots:[approved]}));
 await file(path.join(project,'work/quality/report-one/result.json'),'{"decision":"needs_evidence"}');
 groups=await archiveWorking(project,put);let rebuilt=rebuild(groups);
 assert.equal(rebuilt.get('runs/2026-10-11/words/语义.md').toString(),'immutable evidence — 词义、例句与出处');
 assert.deepEqual(rebuilt.get('runs/2026-10-11/large.bin'),big,'multipart original must restore exactly');
 assert.equal(rebuilt.get('expression/build/task/context.md').toString(),'practice evidence');assert.equal(rebuilt.get('evidence/speaking/record.json').toString(),'{}');
 assert(![...rebuilt.keys()].some(k=>/private|\.env|nested-external|loop|run\.mjs/.test(k)),'private directories and nested links stay excluded');
 const before=JSON.stringify(groups);assert.equal(JSON.stringify(await archiveWorking(project,put)),before,'unchanged bytes reuse the same immutable identities');
 await file(path.join(approved,'daily/2026-10-11/words/语义.md'),'new version');
 const newer=await archiveWorking(project,put);assert.notEqual(newer.find(g=>g.key.includes('2026-10-11')).digest,groups.find(g=>g.key.includes('2026-10-11')).digest);
 assert.equal(rebuild(groups).get('runs/2026-10-11/words/语义.md').toString(),'immutable evidence — 词义、例句与出处','older content-addressed snapshot remains restorable');
 assert.equal(rebuild(newer).get('runs/2026-10-11/words/语义.md').toString(),'new version');
 assert.equal(rebuild(newer).get('quality/report-one/result.json').toString(),'{"decision":"needs_evidence"}');
 await link(outside,path.join(project,'work/questions/unapproved'));
 await assert.rejects(archiveWorking(project,put),/未登记/,'unapproved top-level link must fail rather than silently omit evidence');
 console.log('Working archives: ordinary roots, approved Windows junctions, expression/evidence groups, exact multipart recovery, version identities, privacy filters, nested cycles and unapproved targets passed.');
}finally{
 const actual=await realpath(scratch),container=await realpath(parent);assert.equal(path.dirname(actual),container,'cleanup stays within this test directory');
 // Remove our junction entries without recursively walking their targets.
 for(const p of [path.join(project,'work/runs/2026-10-11'),path.join(approved,'daily/2026-10-11/nested-external'),path.join(approved,'daily/2026-10-11/loop'),path.join(project,'work/expression'),path.join(project,'.cache/speaking'),path.join(project,'work/questions/unapproved')])await rm(p,{force:true}).catch(e=>{if(e.code!=='ENOENT')throw e;});
 await rm(actual,{recursive:true,force:true});
}

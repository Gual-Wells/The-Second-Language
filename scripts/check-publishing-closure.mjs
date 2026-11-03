// Compatibility entry point. The former unbound 40-word fixture predated the
// source/evidence admission contract and cannot certify today's publication.
// Run the maintained Worker/SQLite and current-body/control checks instead.
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
for(const file of ['check-default-controls.mjs','check-current-affairs-backend.mjs','check-usage-context-backend.mjs']){
 const result=spawnSync(process.execPath,[path.join(root,'scripts',file)],{cwd:root,encoding:'utf8',windowsHide:true});
 process.stdout.write(result.stdout||'');process.stderr.write(result.stderr||'');
 if(result.status!==0)throw Error('当前出版闭环验证失败：'+file,{cause:result.error});
}
console.log('Publication closure: maintained control, source/evidence and usage-context suites passed; offline fixtures only, no live publication or semantic certification.');

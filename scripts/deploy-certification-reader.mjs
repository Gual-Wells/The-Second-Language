import {spawn,execFileSync} from 'node:child_process';
import {mkdir,mkdtemp,cp,writeFile,readFile,realpath} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
const root=process.cwd(),sha=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8',windowsHide:true}).trim();
const branch=process.argv.includes('--production')?'main':'certification-reader';
const cache=path.join(root,'.cache/certification-release');await mkdir(cache,{recursive:true});if(process.platform==='win32'&&!/^D:[\\/]/i.test(await realpath(cache)))throw Error('Release must physically reside on D');
const run=await mkdtemp(path.join(cache,sha.slice(0,8)+'-')),archive=path.join(run,'source.tar'),source=path.join(run,'pinned'),pages=path.join(run,'pages');
await mkdir(source);await mkdir(path.join(run,'tmp'));await mkdir(path.join(run,'logs'));process.env.TEMP=process.env.TMP=path.join(run,'tmp');process.env.WRANGLER_LOG_PATH=path.join(run,'logs');process.env.HTTPS_PROXY||='http://127.0.0.1:6987';
async function command(binary,args,cwd=root){let output='';const code=await new Promise((resolve,reject)=>{const p=spawn(binary,args,{cwd,windowsHide:true,stdio:['ignore','pipe','pipe']});p.stdout.on('data',b=>{output+=b;process.stdout.write(b);});p.stderr.on('data',b=>{output+=b;process.stderr.write(b);});p.on('error',reject);p.on('close',resolve);});if(code!==0)throw Error(`Release failed (${code})`);return output;}
await command('git',['archive','--format=tar',`--output=${archive}`,sha,'web','worker/gateway/src/_worker.js']);await command('tar',['-xf',archive,'-C',source]);await cp(path.join(source,'web'),pages,{recursive:true});await cp(path.join(source,'worker/gateway/src/_worker.js'),path.join(pages,'_worker.js'));
await writeFile(path.join(pages,'_routes.json'),JSON.stringify({version:1,include:['/api/*','/auth/*','/health'],exclude:[]}));
const manifest=JSON.parse(await readFile(path.join(pages,'labs/certification-reader/display-manifest.json'),'utf8'));
for(const file of manifest.files){const target=path.resolve(pages,'.'+file.url);if(!target.startsWith(pages+path.sep))throw Error('Asset outside Pages');const bytes=await readFile(target);if(bytes.length!==file.bytes||createHash('sha256').update(bytes).digest('hex')!==file.sha256)throw Error(`Pinned asset differs: ${file.url}`);}
const wrangler='D:/CodexStorage/workspaces/second-language-maintenance/worker/node_modules/wrangler/bin/wrangler.js';
const output=await command(process.execPath,[wrangler,'pages','deploy',pages,'--project-name','the-second-language',`--branch=${branch}`,'--cwd',path.join(root,'worker/gateway'),`--commit-hash=${sha}`,'--commit-message=Certification pure reader','--commit-dirty=true']);
const immutable=output.match(/https:\/\/[a-f0-9]{8,}\.the-second-language\.pages\.dev/)?.[0];if(!immutable)throw Error('No immutable deployment URL returned');
const result={sha,branch,immutable,productionMainUpdated:branch==='main',independentAPIWorkerUpdated:false,displayFiles:manifest.files.length,displayBytes:manifest.bytes,run,verified:false};await writeFile(path.join(cache,'latest.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result));

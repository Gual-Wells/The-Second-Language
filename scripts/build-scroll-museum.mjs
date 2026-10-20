import {createRequire} from 'node:module';
import {realpathSync} from 'node:fs';
import {readFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
await mkdir(path.join(root,'.cache/scroll-museum/tmp'),{recursive:true});
process.env.TEMP=process.env.TMP=path.join(root,'.cache/scroll-museum/tmp');
const runtime=process.env.SECOND_LANGUAGE_WRANGLER||'D:/CodexStorage/workspaces/second-language-maintenance/worker/node_modules/wrangler/bin/wrangler.js';
const require=createRequire(realpathSync(runtime)),esbuild=require('esbuild');
const noise=await readFile(path.join(root,'web/labs/chapter-scroll-v14/vendor/webgl-noise-LICENSE.txt'),'utf8');
const derivative=JSON.parse(await readFile(path.join(root,'web/labs/scroll-museum-v1/assets/keeper-display.json'),'utf8'));
const digest=async file=>{const {createHash}=await import('node:crypto');return createHash('sha256').update(await readFile(path.join(root,file))).digest('hex');};
if(await digest(derivative.derived.path)!==derivative.derived.sha256||await digest(derivative.requiredFinishing.path)!==derivative.requiredFinishing.sha256)throw Error('Museum keeper derivative or required finishing changed; verify before building');
// This mapping is scoped to this museum bundle. No URL, source or material in
// v17–v20 is changed. The lighter file retains every non-image buffer byte.
const keeperDerivative={name:'museum-only-keeper-display',setup(build){build.onLoad({filter:/chapter-scroll-v17[\\/]keeper\.js$/},async({path:filename})=>{
 const source=await readFile(filename,'utf8'),from='../chapter-scroll-v17/assets/keeper-physical.glb';
 if(source.split(from).length!==2)throw Error('Keeper asset entry changed; review the museum mapping');
 return{contents:source.replace(from,'../scroll-museum-v1/assets/keeper-display.glb'),loader:'js',resolveDir:path.dirname(filename)};
});}};
await esbuild.build({absWorkingDir:root,plugins:[keeperDerivative],alias:{three:path.join(root,'web/labs/certification/vendor/three.module.js')},entryPoints:['web/labs/scroll-museum-v1/app.js'],outfile:'web/labs/scroll-museum-v1/app.bundle.js',bundle:true,format:'esm',platform:'browser',target:['safari17','chrome120'],minify:true,legalComments:'inline',banner:{js:`/** @license\nThree.js Copyright 2010-2026 Three.js Authors.\nPavel Fluid Copyright (c) 2017 Pavel Dobryakov.\n${noise}\n*/`}});
console.log('Museum bundle ready. Source modules remain authoritative.');

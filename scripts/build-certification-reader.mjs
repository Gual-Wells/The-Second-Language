import {createRequire} from 'node:module';
import {realpathSync} from 'node:fs';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
await mkdir(path.join(root,'.cache/certification-reader/tmp'),{recursive:true});process.env.TEMP=process.env.TMP=path.join(root,'.cache/certification-reader/tmp');
const require=createRequire(realpathSync('D:/CodexStorage/workspaces/second-language-maintenance/worker/node_modules/wrangler/bin/wrangler.js')),esbuild=require('esbuild');
const digest=async file=>createHash('sha256').update(await readFile(path.join(root,file))).digest('hex');
if(await digest('web/labs/certification-reader/assets/keeper-display.glb')!=='118ad3e48f4a37034551aa7330b033a79a9b4e5711972eb92553774ffb37bffa')throw Error('Display keeper changed');
const projectRoot='web/labs/project-commemorative/',projectPlan=JSON.parse(await readFile(path.join(root,projectRoot,'art-plan.json'),'utf8'));
for(const asset of Object.values(projectPlan.resources)){if(!/^[a-f0-9]{64}$/.test(asset.sha256||''))throw Error('Project asset is not frozen');if(await digest(path.posix.normalize(projectRoot+asset.src))!==asset.sha256)throw Error('Project asset changed: '+asset.src);}
const surfaces=JSON.parse(await readFile(path.join(root,projectRoot,'assets/surfaces.json'),'utf8'));
for(const asset of Object.values(surfaces.layers)){if(await digest(projectRoot+'assets/'+asset.src)!==asset.sha256)throw Error('Frozen project layer changed: '+asset.src);}
const derivative={name:'reader-keeper',setup(build){build.onLoad({filter:/chapter-scroll-v17[\\/]keeper\.js$/},async({path:filename})=>{const source=await readFile(filename,'utf8'),from='../chapter-scroll-v17/assets/keeper-physical.glb';if(source.split(from).length!==2)throw Error('Keeper source changed');return{contents:source.replace(from,'../certification-reader/assets/keeper-display.glb'),loader:'js',resolveDir:path.dirname(filename)};});}};
const noise=await readFile(path.join(root,'web/labs/chapter-scroll-v14/vendor/webgl-noise-LICENSE.txt'),'utf8');
const result=await esbuild.build({absWorkingDir:root,plugins:[derivative],alias:{three:path.join(root,'web/labs/certification/vendor/three.module.js')},entryPoints:['web/labs/certification-reader/viewer.js'],outfile:'web/labs/certification-reader/reader.bundle.js',bundle:true,format:'esm',platform:'browser',target:['safari17','chrome120'],metafile:true,minify:true,legalComments:'inline',banner:{js:`/** @license\nThree.js Copyright 2010-2026 Three.js Authors.\nPavel Fluid Copyright (c) 2017 Pavel Dobryakov.\n${noise}\n*/`}});
await writeFile(path.join(root,'.cache/certification-reader/build-inputs.json'),JSON.stringify(result.metafile,null,2));console.log('Certification reader built; gallery scene excluded.');

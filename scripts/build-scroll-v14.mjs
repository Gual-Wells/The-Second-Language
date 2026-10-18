import {createRequire} from 'node:module';
import {realpathSync} from 'node:fs';
import {readFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
await mkdir(path.join(root,'.cache/scroll-v14/tmp'),{recursive:true});process.env.TEMP=process.env.TMP=path.join(root,'.cache/scroll-v14/tmp');
// Reuse the project's installed Wrangler dependency. No npm installation or C cache.
const wrangler=process.env.SECOND_LANGUAGE_WRANGLER||'D:/CodexStorage/workspaces/second-language-maintenance/worker/node_modules/wrangler/bin/wrangler.js';
const require=createRequire(realpathSync(wrangler)),esbuild=require('esbuild');
const notices=await readFile(path.join(root,'web/labs/chapter-scroll-v14/vendor/webgl-noise-LICENSE.txt'),'utf8');
await esbuild.build({absWorkingDir:root,entryPoints:['web/labs/chapter-scroll-v14/app.js'],outfile:'web/labs/chapter-scroll-v14/app.bundle.js',bundle:true,format:'esm',platform:'browser',target:['safari17','chrome120'],minify:true,legalComments:'inline',banner:{js:`/** @license\nThree.js Copyright 2010-2026 Three.js Authors.\nPavel Fluid Copyright (c) 2017 Pavel Dobryakov.\n${notices}\n*/`}});
console.log('v14 browser bundle ready; source app.js remains authoritative.');

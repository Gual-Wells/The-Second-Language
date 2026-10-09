import { mkdir, cp, rm, realpath, lstat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {pagesBuildDirectory} from './build-path.mjs';
const base = path.dirname(fileURLToPath(import.meta.url));
const dest = pagesBuildDirectory();
if (process.platform === 'win32') {
  const root=path.dirname(dest);await mkdir(root,{recursive:true});
  if (!/^D:\\/i.test(await realpath(root)) || path.basename(dest)!=='pages') throw Error('Build root does not physically reside on D');
} else if (path.dirname(dest) !== path.resolve(base) || path.basename(dest) !== 'dist') throw new Error('Unexpected build output path');
try {if ((await lstat(dest)).isSymbolicLink()) throw Error('Refusing to replace a linked build directory');} catch(e){if(e.code!=='ENOENT')throw e;}
await rm(dest, { recursive: true, force: true });
await mkdir(dest, { recursive: true });
await cp(path.resolve(base, '../../web'), dest, { recursive: true });
await cp(path.join(base, 'src/_worker.js'), path.join(dest, '_worker.js'));
console.log(`Pages assets ready: ${dest}`);

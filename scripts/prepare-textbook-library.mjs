import path from 'node:path';
import {importTextbookLibrary,assertTextbookLibraryReady} from './lib/textbook-library.mjs';
const args=process.argv.slice(2),root=process.cwd();
if(args[0]==='--from'&&args.length===2){console.log(JSON.stringify(await importTextbookLibrary(root,path.resolve(args[1])),null,2));}
else if(args.length===0){console.log(JSON.stringify(await assertTextbookLibraryReady(root)));}
else throw Error('用法：node scripts/prepare-textbook-library.mjs [--from 已获授权的完整原件目录]');

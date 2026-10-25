import {readFile} from 'node:fs/promises';
import {chapterFootprint,authoredDraftFootprint} from './lib/chapter-footprint.mjs';
const [file,date,...extra]=process.argv.slice(2);
if(!file||extra.length||file!=='--draft'&&date)throw Error('Usage: node scripts/chapter-footprint.mjs PATH_TO_CHAPTER.md | --draft YYYY-MM-DD');
const result=file==='--draft'?await authoredDraftFootprint(process.cwd(),date):chapterFootprint(await readFile(file,'utf8'));
console.log(JSON.stringify(result,null,2));

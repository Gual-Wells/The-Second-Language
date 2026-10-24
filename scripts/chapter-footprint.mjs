import {readFile} from 'node:fs/promises';
import {chapterFootprint} from './lib/chapter-footprint.mjs';
const file=process.argv[2];
if(!file)throw Error('Usage: node scripts/chapter-footprint.mjs PATH_TO_CHAPTER.md');
console.log(JSON.stringify(chapterFootprint(await readFile(file,'utf8')),null,2));

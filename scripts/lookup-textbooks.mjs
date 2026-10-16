import {readFile,writeFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {loadTextbooks,lookupBooks} from './lib/textbook-sources.mjs';
const [date,...terms]=process.argv.slice(2);if(!/^\d{4}-\d{2}-\d{2}$/.test(date||'')||!terms.length)throw Error('用法：node scripts/lookup-textbooks.mjs YYYY-MM-DD word [related-word]');
const root=process.cwd(),lock=JSON.parse(await readFile(path.join(root,'work/runs',date,'vix-source.json'),'utf8')),books=await loadTextbooks({root,commit:lock.commit,etymology:true}),entries=lookupBooks(books,terms);
const directory=path.join(root,'work/runs',date,'source-lookups');await mkdir(directory,{recursive:true});const name=terms[0].replace(/[^A-Za-z0-9_-]/g,'_');await writeFile(path.join(directory,name+'.json'),JSON.stringify({commit:lock.commit,terms,entries},null,2));console.log(`已取得 ${entries.length} 个候选，完整定位及原文：${path.join(directory,name+'.json')}`);

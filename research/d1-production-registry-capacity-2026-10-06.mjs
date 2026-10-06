// Actual deployed schema, including full response-record reference and chapter links.
// Local capacity fixture only; no production mutations or model requests.
import {DatabaseSync} from 'node:sqlite';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const schema=await readFile(new URL('../worker/practice_migrations/0007_compact_pronunciation.sql',import.meta.url),'utf8')+await readFile(new URL('../worker/practice_migrations/0008_compact_chapter_links.sql',import.meta.url),'utf8'),results=[];
for(const count of [500000,700000,1000000]){
 const db=new DatabaseSync(':memory:');db.exec(schema);db.exec('BEGIN');
 const insert=db.prepare('INSERT INTO pronunciation_results VALUES(?,?,?,?,?,?)'),link=db.prepare('INSERT INTO chapter_audio_clips VALUES(?,?)'),scope=db.prepare('INSERT OR IGNORE INTO chapter_audio_scopes VALUES(?,?,?)');
 const chapterHash='a'.repeat(64);for(let i=1;i<=count;i++){const a=createHash('sha256').update('generation:'+i).digest(),b=createHash('sha256').update('content:'+i).digest(),c=createHash('sha256').update('record:'+i).digest();insert.run(i,a,b,c,32000,1791230000000);const chapter=Math.floor((i-1)/1200)+1;scope.run(chapter,'chapter-'+chapter,chapterHash);link.run(chapter,i);}
 db.exec('COMMIT');const bytes=db.prepare('PRAGMA page_count').get().page_count*db.prepare('PRAGMA page_size').get().page_size;
 results.push({clips:count,chapterLinks:count,bytes,decimalMB:bytes/1000000,MiB:bytes/1048576,integrity:db.prepare('PRAGMA integrity_check').get().integrity_check,foreignKeys:db.prepare('PRAGMA foreign_key_check').all().length});db.close();
}
const report={date:'2026-10-06',schema:['worker/practice_migrations/0007_compact_pronunciation.sql','worker/practice_migrations/0008_compact_chapter_links.sql'],scope:'Local SQLite allocation including all three full 32-byte digests and one chapter relation per clip; not total production D1 size',results};await writeFile(new URL('./d1-production-registry-capacity-2026-10-06.json',import.meta.url),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(results));

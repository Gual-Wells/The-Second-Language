// Independent comparison of keeping compact permanent SQL identities.
// Research only: no production calls, schema changes or paid generation.
import {DatabaseSync} from 'node:sqlite';
import {createHash} from 'node:crypto';
import {writeFile} from 'node:fs/promises';
const results=[];
for(const count of [500000,700000,1000000]){
 const db=new DatabaseSync(':memory:');db.exec('PRAGMA page_size=4096');
 // Retain rowid compatibility with the existing archive cursor implementation.
 db.exec('CREATE TABLE audio_results (id INTEGER PRIMARY KEY, generation_digest BLOB NOT NULL UNIQUE CHECK(length(generation_digest)=32), content_digest BLOB NOT NULL CHECK(length(content_digest)=32), bytes INTEGER NOT NULL, mime INTEGER NOT NULL CHECK(mime=1)); CREATE TABLE active_calls (generation_digest BLOB PRIMARY KEY, state TEXT NOT NULL, claim BLOB, updated_at INTEGER NOT NULL)');
 const insert=db.prepare('INSERT INTO audio_results VALUES(?,?,?,?,?)');
 db.exec('BEGIN');
 for(let i=1;i<=count;i++){
  const key=createHash('sha256').update('generation:'+i).digest(),content=createHash('sha256').update('content:'+i).digest();
  insert.run(i,key,content,32000,1);
 }
 db.exec('COMMIT');
 const lookupKey=createHash('sha256').update('generation:'+Math.floor(count/2)).digest();
 const plan=db.prepare('EXPLAIN QUERY PLAN SELECT content_digest,bytes,mime FROM audio_results WHERE generation_digest=?').all(lookupKey).map(x=>x.detail);
 const rows=db.prepare('SELECT count(*) AS n FROM audio_results').get().n;
 const pages=db.prepare('PRAGMA page_count').get().page_count,pageBytes=db.prepare('PRAGMA page_size').get().page_size;
 const lookup=db.prepare('SELECT content_digest,bytes,mime FROM audio_results WHERE generation_digest=?').get(lookupKey);
 const integrity=db.prepare('PRAGMA integrity_check').get().integrity_check;
 results.push({rows,pages,pageBytes,allocatedBytes:pages*pageBytes,decimalMB:pages*pageBytes/1000000,allocatedBytesPerAudio:pages*pageBytes/count,lookupPlan:plan,lookupDigestBytes:lookup.content_digest.length,integrity});db.close();
}
const report={status:'research-fixture-not-production',date:'2026-10-06',results,excluded:['D1 actual file_size and Worker performance','Business metadata, question search, sessions and chapter links','Historical content versions and full generation descriptors, kept as files','Catalog migration and independent recovery integration','Large active calls or abnormal backlog'],conclusion:'Compact SQL identities are substantially smaller than repeated full descriptors and path/version records. They still grow with assets; byte budgets and an archive fallback remain necessary.'};
await writeFile(new URL('./d1-compact-registry-model-2026-10-06.json',import.meta.url),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(results.map(({rows,decimalMB,lookupPlan,integrity})=>({rows,decimalMB,lookupPlan,integrity}))));

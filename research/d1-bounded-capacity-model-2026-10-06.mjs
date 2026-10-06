// Research fixture only. No D1, Graph, credentials, paid models, or production writes.
import {DatabaseSync} from 'node:sqlite';
import {createHash,randomBytes} from 'node:crypto';
import {writeFile} from 'node:fs/promises';

const classes=[
 {name:'entries',slots:8192,payloadBytes:1024},
 {name:'locations',slots:16384,payloadBytes:384},
 {name:'jobs',slots:2048,payloadBytes:4096},
 {name:'spool',slots:512,payloadBytes:8192},
 {name:'usage',slots:4096,payloadBytes:256},
 {name:'settings',slots:256,payloadBytes:1024}
];
const db=new DatabaseSync(':memory:');db.exec('PRAGMA page_size=4096');
const digest=n=>createHash('sha256').update(String(n)).digest();
for(const c of classes){
 db.exec(`CREATE TABLE ${c.name} (slot INTEGER PRIMARY KEY CHECK(slot BETWEEN 1 AND ${c.slots}), identity BLOB NOT NULL UNIQUE CHECK(length(identity)=32), kind INTEGER NOT NULL, stamp INTEGER NOT NULL, payload BLOB NOT NULL CHECK(length(payload)<=${c.payloadBytes})); CREATE INDEX ${c.name}_status ON ${c.name}(kind,stamp)`);
 const insert=db.prepare(`INSERT INTO ${c.name} VALUES(?,?,?,?,?)`),payload=randomBytes(c.payloadBytes);
 db.exec('BEGIN');
 for(let slot=1;slot<=c.slots;slot++)insert.run(slot,digest(`${c.name}:${slot}`),slot%5,1760000000000+slot,payload);
 db.exec('COMMIT');
}
const size=()=>({pages:db.prepare('PRAGMA page_count').get().page_count,freePages:db.prepare('PRAGMA freelist_count').get().freelist_count,pageBytes:db.prepare('PRAGMA page_size').get().page_size});
const full=size(),rounds=[];
// Replace all rows three times, mixing small and maximal payloads. Do not VACUUM.
for(let round=1;round<=3;round++){
 for(const c of classes){
  const remove=db.prepare(`DELETE FROM ${c.name} WHERE slot=?`),insert=db.prepare(`INSERT INTO ${c.name} VALUES(?,?,?,?,?)`);
  const payload=randomBytes(round===2?Math.ceil(c.payloadBytes/4):c.payloadBytes);
  db.exec('BEGIN');
  for(let slot=1;slot<=c.slots;slot++){remove.run(slot);insert.run(slot,digest(`${c.name}:${round}:${slot}`),slot%5,1760000000000+round*100000+slot,payload);}
  db.exec('COMMIT');
 }
 rounds.push({round,...size()});
}
const guards={};
for(const c of classes){
 const insert=db.prepare(`INSERT INTO ${c.name} VALUES(?,?,?,?,?)`);
 try{insert.run(c.slots+1,digest('overflow:'+c.name),0,0,Buffer.alloc(0));guards[c.name]=false;}
 catch{guards[c.name]=true;}
}
let payloadRejected=false;
try{db.prepare('UPDATE jobs SET payload=? WHERE slot=1').run(Buffer.alloc(4097));}catch{payloadRejected=true;}
const maxPages=Math.max(full.pages,...rounds.map(x=>x.pages));
const fixtureRows=classes.reduce((n,c)=>n+c.slots,0),payloadBytes=classes.reduce((n,c)=>n+c.slots*c.payloadBytes,0);
const result={status:'research-fixture-not-production',date:'2026-10-06',sqliteVersion:db.prepare('SELECT sqlite_version() AS version').get().version,classes,fixtureRows,payloadBytes,full,rounds,peakAllocatedBytes:maxPages*full.pageBytes,peakDecimalMB:maxPages*full.pageBytes/1000000,slotGuards:guards,payloadRejected,integrity:db.prepare('PRAGMA integrity_check').get().integrity_check,limits:['Synthetic proposed bounded schema, not existing production schema.','SQLite allocated-page measurement, not Cloudflare D1 file_size.','No text compression savings assumed.','Does not measure OneDrive latency, Worker CPU, migrations or online request quotas.','Caps require bounded input and admission control; unresolved jobs are never evicted to make room.']};
db.close();await writeFile(new URL('./d1-bounded-capacity-model-2026-10-06.json',import.meta.url),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({fixtureRows,peakDecimalMB:result.peakDecimalMB,slotGuards:guards,payloadRejected,integrity:result.integrity}));

import assert from 'node:assert/strict';
import test from 'node:test';
import {DatabaseSync} from 'node:sqlite';
import {mkdtemp,readFile,rm} from 'node:fs/promises';
import {readFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {rowidPages,permanentRows,storageTableOrder} from './lib/storage-scan.mjs';
import {archiveQuery,ArchiveReadBudgetError} from './lib/archive-read-budget.mjs';

test('50,000 rows use indexed continuation, preserve gaps and bytes, and exclude later appends',async()=>{
 const db=new DatabaseSync(':memory:');
 try{
  db.exec('CREATE TABLE samples(id INTEGER PRIMARY KEY,payload BLOB,note TEXT);BEGIN');
  const insert=db.prepare('INSERT INTO samples VALUES(?,?,?)'),expected=[];
  for(let i=0;i<50000;i++){
   const id=i*3-17,payload=Buffer.from([i%256,0,255]);insert.run(id,payload,'资料 '+i);expected.push(id);
  }
  db.exec('COMMIT');let pages=0,readRows=0;
  const query=async(database,sql,params=[])=>{
   if(sql.includes('ORDER BY')){
    const plan=db.prepare('EXPLAIN QUERY PLAN '+sql).all(...params);
    assert.ok(plan.some(x=>/SEARCH t USING INTEGER PRIMARY KEY/.test(x.detail)),JSON.stringify(plan));
    if(++pages===2)insert.run(9999999,Buffer.from([9]),'later append');
   }
   const rows=db.prepare(sql).all(...params);if(sql.includes('ORDER BY'))readRows+=rows.length;
   return rows.map(row=>Object.fromEntries(Object.entries(row).map(([key,value])=>[key,value instanceof Uint8Array?Array.from(value):value])));
  };
  const actual=[];
  for await(const rows of rowidPages(query,'test','samples'))for(const row of rows){
   assert.deepEqual(Object.keys(row),['id','payload','note']);
   assert.deepEqual(row.payload,[(row.id+17)/3%256,0,255]);actual.push(row.id);
  }
  assert.deepEqual(actual,expected);assert.equal(readRows,50000);assert.equal(pages,250);
  db.exec('CREATE TABLE empty(id TEXT PRIMARY KEY)');const empty=[];
  for await(const rows of rowidPages(query,'test','empty'))empty.push(rows);
  assert.deepEqual(empty,[]);
 }finally{db.close();}
});

test('storage filtering removes backup recursion, keeps historical blobs and restores valid relationships',async()=>{
 const db=new DatabaseSync(':memory:'),restored=new DatabaseSync(':memory:');
 try{
  const schema=readFileSync(new URL('../worker/migrations/0006_permanent_storage.sql',import.meta.url),'utf8');
  db.exec(schema);restored.exec(schema);restored.exec('PRAGMA foreign_keys=OFF');
  const blob=db.prepare('INSERT INTO storage_blobs VALUES(?,?,?,?)'),object=db.prepare('INSERT INTO storage_objects VALUES(?,?,?,?)'),version=db.prepare('INSERT INTO storage_versions VALUES(?,?,?,?)');
  for(let i=0;i<1000;i++){
   const backup=i%3===0,key=(backup?'backups/':'pronunciation/')+i;
   blob.run('d'+i,'item'+i,100,i);object.run(key,'d'+i,'audio/mpeg',i);version.run(key,'d'+i,'audio/mpeg',i);
  }
  blob.run('historical','old-item',99,1);version.run('pronunciation/1','historical','audio/mpeg',1);
  const needed=new Set(),tables=['storage_blobs','storage_objects','storage_versions'].map(name=>({name})).sort(storageTableOrder);
  for(const {name} of tables){
   for await(const page of rowidPages(async(_database,sql,params=[])=>db.prepare(sql).all(...params),'test',name)){
    for(const row of permanentRows(name,page,needed)){
     const keys=Object.keys(row);restored.prepare(`INSERT INTO "${name}" (${keys.join(',')}) VALUES (${keys.map(()=>'?').join(',')})`).run(...Object.values(row));
    }
   }
  }
  assert.equal(restored.prepare('SELECT count(*) AS n FROM storage_objects').get().n,666);
  assert.equal(restored.prepare('SELECT count(*) AS n FROM storage_versions').get().n,667);
  assert.equal(restored.prepare('SELECT count(*) AS n FROM storage_blobs').get().n,667);
  assert.deepEqual(restored.prepare('PRAGMA foreign_key_check').all(),[]);
  assert.equal(restored.prepare('PRAGMA integrity_check').get().integrity_check,'ok');
  const ledger=[];
  for await(const page of rowidPages(async(_db,sql,params=[])=>db.prepare(sql).all(...params),'test','storage_objects',{pageSize:1000,projection:'t.object_key AS key,t.digest,b.bytes',join:'JOIN storage_blobs b ON b.digest=t.digest'}))ledger.push(...page);
  assert.equal(ledger.length,1000);assert.equal(ledger[10].bytes,100);
 }finally{db.close();restored.close();}
});

test('archive budget survives restart, stops before another read and resets by UTC date',async()=>{
 const dir=await mkdtemp(path.join(tmpdir(),'second-language-budget-')),file=path.join(dir,'reads.json');
 let calls=0,date=new Date('2026-10-06T23:59:00Z');
 const detailed=async()=>{calls++;return{rows:[{ok:true}],meta:{rows_read:7000}};};
 try{
  const first=await archiveQuery(detailed,file,{limit:15000,now:()=>date});
  await first('db','query');assert.equal(JSON.parse(await readFile(file,'utf8')).reads,7000);
  const resumed=await archiveQuery(detailed,file,{limit:15000,now:()=>date});
  await resumed('db','query');assert.equal(calls,2);
  await assert.rejects(resumed('db','query'),ArchiveReadBudgetError);assert.equal(calls,2);
  await assert.rejects(archiveQuery(detailed,file,{limit:15000,now:()=>date}),ArchiveReadBudgetError);
  date=new Date('2026-10-07T00:00:00Z');await resumed('db','query');
  const state=JSON.parse(await readFile(file,'utf8'));assert.equal(state.day,'2026-10-07');assert.equal(state.reads,7000);
  const invalid=await archiveQuery(async()=>({rows:[],meta:{}}),path.join(dir,'invalid.json'));
  await assert.rejects(invalid('db','query'),/可核对/);
 }finally{assert.ok(path.resolve(dir).startsWith(path.resolve(tmpdir())+path.sep));await rm(dir,{recursive:true,force:true});}
});

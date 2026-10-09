import {DatabaseSync} from 'node:sqlite';
import {readFile} from 'node:fs/promises';
import {certificationLabRoute} from '../../worker/src/certification-lab.js';
export async function fixture(){
 const sqlite=new DatabaseSync(':memory:');sqlite.exec(await readFile(new URL('./schema.sql',import.meta.url),'utf8'));
 const db={prepare(sql){let values=[];return {bind(...v){values=v;return this;},async first(){return sqlite.prepare(sql).get(...values)||null;},async all(){return {results:sqlite.prepare(sql).all(...values)};},async run(){const r=sqlite.prepare(sql).run(...values);return {meta:{changes:Number(r.changes)}};}};},async batch(items){sqlite.exec('BEGIN');try{const results=[];for(const item of items)results.push(await item.run());sqlite.exec('COMMIT');return results;}catch(e){sqlite.exec('ROLLBACK');throw e;}}};
 return {sqlite,db,async request(path='',body,context={session:true,sameOrigin:true,isPublisher:false}){const response=await certificationLabRoute(new Request('https://the-second-language.pages.dev/api/certification-lab'+path,{method:body?'POST':'GET',...(body?{body:JSON.stringify(body)}:{})}),{CERTIFICATION_LAB_DB:db},context);return {status:response.status,data:await response.json()};},privatePaper(id){return JSON.parse(sqlite.prepare('SELECT paper_json FROM lab_attempts WHERE id=?').get(id).paper_json);},close(){sqlite.close();}};
}
export const correctAnswers=paper=>Object.fromEntries(paper.items.map(q=>[q.id,q.type==='multi'?q.correct:q.correct[0]]));

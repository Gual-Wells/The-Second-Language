import {permanentBucket} from './storage.js';
import {sha256} from './practice-media.js';
// Reuse the chapter-test engine; only its three tables belong to this disposable scope.
export function temporaryTestEnvironment(env){return{...env,DB:{prepare(sql){return env.DB.prepare(sql.replace(/\bchapter_tests\b/g,'temporary_chapter_tests').replace(/\bchapter_test_recordings\b/g,'temporary_chapter_test_recordings').replace(/\bchapter_test_reviews\b/g,'temporary_chapter_test_reviews'));},batch(statements){return env.DB.batch(statements);}}};}
export function temporaryTestBucket(env,id,expiresAt,fallback=permanentBucket(env)){
 const prefix=`temporary/test/${id}/`,pending=new Map();
 async function bytes(digest){return pending.get(digest)||await env.CHAPTERS.get(prefix+digest,{type:'arrayBuffer'});}
 return{
  async putContent(value,mime='application/octet-stream'){if(expiresAt<=Date.now()+60000)throw Error('临时测试即将到期');const data=typeof value==='string'?new TextEncoder().encode(value):value instanceof Blob?await value.arrayBuffer():value;const digest=await sha256(data);if(!pending.has(digest)){const stored=data instanceof ArrayBuffer?data:data.buffer.slice(data.byteOffset,data.byteOffset+data.byteLength);if(!await env.CHAPTERS.get(prefix+digest,{type:'arrayBuffer'}))await env.CHAPTERS.put(prefix+digest,stored,{expiration:Math.floor(expiresAt/1000),metadata:{mime}});pending.set(digest,stored);}return{digest,bytes:data.byteLength};},
  async getContent(digest){const data=await bytes(digest);return data?new Response(data):fallback.getContent(digest);},
  async responseContent(digest,request,mime){const data=await bytes(digest);if(!data)return fallback.responseContent(digest,request,mime);const n=data.byteLength,headers={'content-type':mime,'cache-control':'private, no-store','accept-ranges':'bytes','x-content-type-options':'nosniff'},range=request.headers.get('range');if(range){const m=range.match(/^bytes=(\d*)-(\d*)$/);if(!m||!m[1]&&!m[2])return new Response(null,{status:416,headers:{'content-range':`bytes */${n}`}});const start=m[1]?Number(m[1]):Math.max(0,n-Number(m[2])),end=m[1]?(m[2]?Math.min(n-1,Number(m[2])):n-1):n-1;if(start>=n||start>end)return new Response(null,{status:416,headers:{'content-range':`bytes */${n}`}});return new Response(data.slice(start,end+1),{status:206,headers:{...headers,'content-range':`bytes ${start}-${end}/${n}`,'content-length':String(end-start+1)}});}return new Response(data,{headers:{...headers,'content-length':String(n)}});}
 };
}
export async function deleteTemporaryTest(env,id){
 // Removing a preview never removes globally cached, paid Bella originals.
 let cursor;do{const page=await env.CHAPTERS.list({prefix:`temporary/test/${id}/`,...(cursor?{cursor}:{})});for(const k of page.keys)await env.CHAPTERS.delete(k.name);cursor=page.list_complete?null:page.cursor;}while(cursor);
 await env.DB.batch(['DELETE FROM temporary_chapter_test_reviews WHERE test_id=?','DELETE FROM temporary_chapter_test_recordings WHERE test_id=?','DELETE FROM temporary_test_pages WHERE id=?','DELETE FROM temporary_chapter_tests WHERE id=?'].map(sql=>env.DB.prepare(sql).bind(id)));
}
export async function expireTemporaryTests(env){const {results}=await env.DB.prepare('SELECT id FROM temporary_test_pages WHERE expires_at<=? LIMIT 100').bind(Date.now()).all();for(const row of results)await deleteTemporaryTest(env,row.id);}

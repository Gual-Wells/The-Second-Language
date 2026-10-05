export const quoteIdentifier=value=>'"'+value.replaceAll('"','""')+'"';

// Bound each scan at its starting high-water mark; payloads never include the cursor.
// No OFFSET, and no repeatedly materialized whole-table filtering subquery.
export async function* rowidPages(query,database,table,{pageSize=200,projection='t.*',join=''}={}){
 if(!Number.isInteger(pageSize)||pageSize<1||pageSize>1000)throw Error('归档分页大小无效');
 const name=quoteIdentifier(table),alias='__archive_cursor_rowid';
 const [{end_rowid:end}]=await query(database,`SELECT MAX(t.rowid) AS end_rowid FROM ${name} t`);
 if(end===null)return;
 if(!Number.isSafeInteger(end))throw Error('归档 rowid 超出安全范围');
 let cursor=null;
 while(true){
  const rows=await query(database,`SELECT t.rowid AS ${alias},${projection} FROM ${name} t ${join} WHERE ${cursor===null?'':'t.rowid>? AND '}t.rowid<=? ORDER BY t.rowid LIMIT ?`,cursor===null?[end,pageSize]:[cursor,end,pageSize]);
  if(!rows.length)return;
  const next=rows.at(-1)[alias];
  if(!Number.isSafeInteger(next)||next>end||(cursor!==null&&next<=cursor))throw Error('归档游标未前进');
  cursor=next;
  yield rows.map(({[alias]:ignored,...row})=>row);
  if(rows.length<pageSize||cursor===end)return;
 }
}

export function permanentRows(table,rows,neededDigests){
 if(table==='storage_objects'||table==='storage_versions'){
  const kept=rows.filter(row=>!row.object_key.startsWith('backups/'));
  for(const row of kept)neededDigests.add(row.digest);
  return kept;
 }
 if(table==='storage_blobs')return rows.filter(row=>neededDigests.has(row.digest));
 return rows;
}

export function storageTableOrder(a,b){
 const priority={storage_objects:0,storage_versions:1,storage_blobs:2};
 return(priority[a.name]??3)-(priority[b.name]??3);
}

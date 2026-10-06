import {readFile,mkdir,writeFile,rename} from 'node:fs/promises';
import path from 'node:path';

export class ArchiveReadBudgetError extends Error{
 constructor(){super('归档读取预算已到保护线；已有文件与快照保留，本次未发布新快照。请查看本机归档状态。');this.code='D1_ARCHIVE_READ_BUDGET';}
}

// This is the archive's own measured SQL use, not the account-wide remaining quota.
// A single scheduled archive owns the journal through its existing Windows mutex.
export async function archiveQuery(detailedQuery,file,{limit=2500000,now=()=>new Date()}={}){
 let state;
 const day=()=>now().toISOString().slice(0,10);
 try{state=JSON.parse(await readFile(file,'utf8'));}catch(error){if(error.code!=='ENOENT')throw error;}
 if(state?.day!==day())state={day:day(),reads:0,queries:0};
 if(!Number.isSafeInteger(state.reads)||state.reads<0)throw Error('归档读取记录无效');
 if(state.reads+5000>limit)throw new ArchiveReadBudgetError();
 await mkdir(path.dirname(file),{recursive:true});
 return async(database,sql,params=[])=>{
  if(state.day!==day())state={day:day(),reads:0,queries:0};
  // Allow margin for one bounded page plus indexed lookups, then stop before another call.
  if(state.reads+5000>limit)throw new ArchiveReadBudgetError();
  const {rows,meta}=await detailedQuery(database,sql,params),reads=meta?.rows_read;
  if(!Number.isSafeInteger(reads)||reads<0)throw Error('D1 未返回可核对的读取用量');
  state.reads+=reads;state.queries++;state.limit=limit;
  if(Number.isSafeInteger(meta.size_after)&&meta.size_after>=0){state.sizes||={};state.sizes[database]=meta.size_after;}
  const pending=file+'.pending';await writeFile(pending,JSON.stringify(state));await rename(pending,file);
  if(state.reads>limit)throw new ArchiveReadBudgetError();
  return rows;
 };
}

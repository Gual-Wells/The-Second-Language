const json=(data,status=200)=>Response.json(data,{status,headers:{'cache-control':'no-store'}});
export const storagePools={onedrive:{name:'OneDrive',note:'永久正文、音频与备份'},main:{name:'章节数据库',note:'章节、答疑与测试索引',limitBytes:500000000},practice:{name:'雅思数据库',note:'练习、答卷与声音索引',limitBytes:500000000},lab:{name:'实验数据库',note:'独立功能试验',limitBytes:500000000},kv:{name:'近期缓存',note:'Cloudflare KV · 账户共享',limitBytes:1000000000}};
const bytes=n=>Number.isSafeInteger(n)&&n>=0;
export async function storageUsageView(env){
 const {results}=await env.DB.prepare('SELECT * FROM storage_usage').all(),rows=new Map(results.map(r=>[r.pool,r]));
 return{pools:Object.entries(storagePools).map(([pool,definition])=>{const row=rows.get(pool),data=row?.report_json?JSON.parse(row.report_json):{};
  const limitBytes=data.limitBytes??definition.limitBytes??null,usedBytes=data.usedBytes??null,checkedAt=row?.checked_at??null;
  return{...data,...definition,pool,limitBytes,usedBytes,checkedAt,updateFailed:!!row?.failed,attemptedAt:row?.attempted_at??null,stale:!checkedAt||Date.now()-checkedAt>86400000,
   near:bytes(usedBytes)&&bytes(limitBytes)&&(usedBytes>=limitBytes*.9||['main','practice','lab'].includes(pool)&&usedBytes>=120*1024*1024),
   ...(pool==='onedrive'?{freeLimitBytes:5*1024**3,freeFits:bytes(usedBytes)&&bytes(data.projectBytes)?Math.max(usedBytes,data.projectBytes)<=5*1024**3:null,statisticsDiffer:bytes(usedBytes)&&bytes(data.projectBytes)&&data.projectBytes>usedBytes}:{})};})};
}
export async function storageUsageRoute(request,env,{isPublisher,session}){
 if(!isPublisher&&!session)return json({error:'请先登录'},401);
 const path=new URL(request.url).pathname;
 if(path==='/api/storage/usage'&&request.method==='GET')return json(await storageUsageView(env));
 if(path!=='/api/storage/usage/report'||request.method!=='POST')return json({error:'操作无效'},405);
 if(!isPublisher)return json({error:'发布身份无效'},403);
 let reports;try{const raw=await request.text();if(raw.length>12000)throw Error();reports=JSON.parse(raw).reports;if(!Array.isArray(reports)||reports.length>5||new Set(reports.map(r=>r?.pool)).size!==reports.length)throw Error();
  for(const r of reports){if(!r||!storagePools[r.pool]||!bytes(r.checkedAt)||r.checkedAt>Date.now()+300000||typeof r.verified!=='boolean')throw Error();if(r.verified){if(!bytes(r.usedBytes)||!bytes(r.limitBytes)||!r.limitBytes)throw Error();for(const key of ['projectBytes','remainingBytes','deletedBytes','chapterCacheBytes','practiceCacheBytes'])if(r[key]!=null&&!bytes(r[key]))throw Error();if(r.measurementDate!=null&&!/^\d{4}-\d{2}-\d{2}$/.test(r.measurementDate))throw Error();}}
 }catch{return json({error:'存储记录无效'},400);}
 const statements=reports.map(r=>{const data=r.verified?Object.fromEntries(['usedBytes','limitBytes','projectBytes','remainingBytes','deletedBytes','chapterCacheBytes','practiceCacheBytes','measurementDate'].filter(k=>r[k]!=null).map(k=>[k,r[k]])):null;
  return env.DB.prepare(`INSERT INTO storage_usage(pool,report_json,checked_at,attempted_at,failed) VALUES(?,?,?,?,?) ON CONFLICT(pool) DO UPDATE SET report_json=CASE WHEN excluded.failed=0 THEN excluded.report_json ELSE storage_usage.report_json END,checked_at=CASE WHEN excluded.failed=0 THEN excluded.checked_at ELSE storage_usage.checked_at END,attempted_at=excluded.attempted_at,failed=excluded.failed WHERE excluded.attempted_at>=storage_usage.attempted_at`).bind(r.pool,data?JSON.stringify(data):null,r.verified?r.checkedAt:null,r.checkedAt,r.verified?0:1);});
 if(statements.length)await env.DB.batch(statements);return json(await storageUsageView(env));
}

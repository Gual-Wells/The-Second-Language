import {reportSeriesStorage,seriesStorageView} from './series-storage.js';

const json=(value,status=200)=>Response.json(value,{status,headers:{'cache-control':'no-store'}});
// The owner sees resource policy and numeric capacity only. No object or SQL proxy.
export async function seriesStorageRoute(request,env,{isPublisher,session}){
 if(!isPublisher&&!session)return json({error:'请先登录'},401);
 const path=new URL(request.url).pathname;
 if(path==='/api/series/storage'&&request.method==='GET')return json(await seriesStorageView(env));
 if(path!=='/api/series/storage/report'||request.method!=='POST')return json({error:'操作无效'},405);
 if(!isPublisher)return json({error:'发布身份无效'},403);
 try{
  const text=await request.text();if(text.length>32000)return json({error:'容量记录过大'},413);
  await reportSeriesStorage(env,'admin',JSON.parse(text));
  return json(await seriesStorageView(env));
 }catch{return json({error:'存储记录无效'},400);}
}

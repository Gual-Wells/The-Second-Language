export default{async fetch(request,env){
 const url=new URL(request.url),path=url.pathname,match=path.match(/^\/api\/audio\/([a-z0-9-]+)$/);
 if(match&&['GET','HEAD'].includes(request.method)){
  const check=new URL('/api/access-check',url);check.searchParams.set('id',match[1]);const auth=await env.TRIAL_API.fetch(new Request(check,{headers:request.headers}));if(!auth.ok)return auth;
  const asset=new URL(`/prepared/${match[1]}.mp3`,url),range=request.headers.get('range'),assetHeaders=new Headers(request.headers);assetHeaders.delete('range');
  const response=await env.ASSETS.fetch(new Request(asset,{method:range?'GET':request.method,headers:assetHeaders})),headers=new Headers(response.headers);headers.set('cache-control','private, no-store');headers.set('x-content-type-options','nosniff');headers.set('accept-ranges','bytes');
  if(range&&response.ok){
   const bytes=await response.arrayBuffer(),total=bytes.byteLength,m=range.match(/^bytes=(\d*)-(\d*)$/);
   if(!m||(!m[1]&&!m[2]))return new Response(null,{status:416,headers:{'content-range':`bytes */${total}`}});
   const start=m[1]?Number(m[1]):Math.max(0,total-Number(m[2])),end=m[1]?(m[2]?Math.min(total-1,Number(m[2])):total-1):total-1;
   if(start>=total||start>end)return new Response(null,{status:416,headers:{'content-range':`bytes */${total}`}});
   headers.delete('content-encoding');headers.set('content-range',`bytes ${start}-${end}/${total}`);headers.set('content-length',String(end-start+1));return new Response(request.method==='HEAD'?null:bytes.slice(start,end+1),{status:206,headers});
  }
  return new Response(response.body,{status:response.status,headers});
 }
 if(path.startsWith('/api/'))return env.TRIAL_API.fetch(request);
 if(!['/','/index.html','/app.js','/styles.css','/icon.svg','/tuning','/tuning/','/tuning.html','/tuning.js'].includes(path))return new Response('Not found',{status:404});
 return env.ASSETS.fetch(request);
}};

import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
export const account='5410a3d3a18318f1da25db1dc5629e86';
export const mainDatabase='e9d0f4ee-a720-4fa9-8c45-3f1974243092',practiceDatabase='bf3d8fed-55cf-49fc-8c12-4fa62462c034';
let refreshing=null;
export async function cloudflareRequest(route,options={}){
 async function request(){const config=await readFile(process.env.SECOND_LANGUAGE_WRANGLER_CONFIG||path.join(process.env.APPDATA,'xdg.config/.wrangler/config/default.toml'),'utf8'),token=config.match(/^oauth_token\s*=\s*"([^"]+)"/m)?.[1];if(!token)throw Error('Cloudflare 需要登录');return fetch(`https://api.cloudflare.com/client/v4${route}`,{...options,headers:{authorization:`Bearer ${token}`,...options.headers},signal:AbortSignal.timeout(60000)});}
 let r=await request();if(r.status===401){await r.body?.cancel();refreshing ||= new Promise((resolve,reject)=>{const cli=fileURLToPath(new URL('../../worker/node_modules/wrangler/bin/wrangler.js',import.meta.url)),p=spawn(process.execPath,[cli,'whoami'],{windowsHide:true,stdio:'ignore'});p.on('error',reject);p.on('close',code=>code===0?resolve():reject(Error('Cloudflare 需要重新登录')));}).finally(()=>{refreshing=null;});await refreshing;r=await request();}
 if(!r.ok)throw Error(`Cloudflare 请求失败 (${r.status})`);return r;
}
export const cloudflare=(route,options={})=>cloudflareRequest(`/accounts/${account}${route}`,options);
export async function queryDetailed(database,sql,params=[]){const r=await(await cloudflare(`/d1/database/${database}/query`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({sql,params})})).json();if(!r.success||!r.result?.[0]?.success)throw Error('数据库查询未完成');return{rows:r.result[0].results,meta:r.result[0].meta};}
export async function query(database,sql,params=[]){return(await queryDetailed(database,sql,params)).rows;}
export async function kvKeys(namespace){const all=[];let cursor='';do{const r=await(await cloudflare(`/storage/kv/namespaces/${namespace}/keys?limit=1000${cursor?`&cursor=${encodeURIComponent(cursor)}`:''}`)).json();if(!r.success)throw Error('资产目录未完成');all.push(...r.result);cursor=r.result_info?.cursor||'';}while(cursor);return all;}

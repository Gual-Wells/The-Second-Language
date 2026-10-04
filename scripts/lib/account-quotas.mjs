import {createHash,createHmac} from 'node:crypto';
import {readFile} from 'node:fs/promises';
const hash=s=>createHash('sha256').update(s).digest('hex'),hmac=(key,s)=>createHmac('sha256',key).update(s).digest();
export async function tencentBalance(config,{fetchImpl=fetch}={}){
 const timestamp=Math.floor(Date.now()/1000),date=new Date(timestamp*1000).toISOString().slice(0,10),payload='{}',host='billing.tencentcloudapi.com';
 const canonical=`POST\n/\n\ncontent-type:application/json\nhost:${host}\n\ncontent-type;host\n${hash(payload)}`;
 const scope=`${date}/billing/tc3_request`,stringToSign=`TC3-HMAC-SHA256\n${timestamp}\n${scope}\n${hash(canonical)}`;
 const signature=createHmac('sha256',hmac(hmac(hmac('TC3'+config.secretKey,date),'billing'),'tc3_request')).update(stringToSign).digest('hex');
 const response=await fetchImpl(`https://${host}`,{method:'POST',headers:{'content-type':'application/json','X-TC-Action':'DescribeAccountBalance','X-TC-Version':'2018-07-09','X-TC-Timestamp':String(timestamp),authorization:`TC3-HMAC-SHA256 Credential=${config.secretId}/${scope}, SignedHeaders=content-type;host, Signature=${signature}`},body:payload,signal:AbortSignal.timeout(25000)});
 const data=(await response.json()).Response;
 if(!response.ok||data?.Error||!Number.isFinite(data?.RealBalance))throw Error(data?.Error?.Code||'腾讯余额无法核对');
 // Cash is supplementary. It cannot prove whether the purchased SOE package has calls left.
 return {pool:'tencent',verified:false,remaining:null,cashBalanceCny:Math.max(0,data.RealBalance/100),checkedAt:new Date().toISOString()};
}
export async function cloudflareQuota({fetchImpl=fetch}={}){
 const configPath=process.env.SECOND_LANGUAGE_WRANGLER_CONFIG||`${process.env.APPDATA}/xdg.config/.wrangler/config/default.toml`;
 const token=(await readFile(configPath,'utf8')).match(/^oauth_token\s*=\s*"([^"\r\n]+)"/m)?.[1];if(!token)throw Error('Cloudflare 登录凭证不可用');
 const now=new Date(),period=now.toISOString().slice(0,10),start=period+'T00:00:00Z';
 const query=`{viewer{accounts(filter:{accountTag:"5410a3d3a18318f1da25db1dc5629e86"}){aiInferenceAdaptiveGroups(limit:1,filter:{datetime_geq:"${start}",datetime_lt:"${now.toISOString()}"}){sum{totalNeurons}}}}}`;
 const response=await fetchImpl('https://api.cloudflare.com/client/v4/graphql',{method:'POST',headers:{authorization:`Bearer ${token}`,'content-type':'application/json'},body:JSON.stringify({query}),signal:AbortSignal.timeout(25000)}),data=await response.json();
 if(!response.ok||data.errors?.length||!data.data?.viewer?.accounts?.length)throw Error('Cloudflare 账户用量无法核对');
 const groups=data.data.viewer.accounts[0].aiInferenceAdaptiveGroups,used=groups.reduce((sum,g)=>sum+g.sum.totalNeurons,0);
 if(!Number.isFinite(used))throw Error('Cloudflare 用量数据无效');
 return {pool:'cloudflare',verified:true,remaining:Math.max(0,10000-used),period,checkedAt:new Date().toISOString()};
}

import assert from 'node:assert/strict';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
const {chromium}=createRequire(process.execPath)('playwright'),out='.cache/series-usage-ui';await mkdir(out,{recursive:true});
const index=await readFile('web/index.html','utf8'),dialog=index.match(/<dialog[^>]*id="balancesDialog"[\s\S]*?<\/dialog>/)?.[0];assert(dialog);
const origin='https://usage-fixture.test',old='2026-10-20T10:00:00.000Z',recent='2026-10-31T10:00:00.000Z';
const usage={inputTokens:12340,outputTokens:4321,cachedInputTokens:2000,responses:12,unknownCalls:1,inProgressCalls:1};
const fixture={pools:[{pool:'openai',unit:'USD',verified:true,remaining:12,issuedAmount:20,creditCheckedAt:old,checkedAt:recent,usageCheckedAt:recent,stale:true,note:'第二系列共用 API · 研究夹具，非账户查询',usage,uncertainCalls:1,usageSources:[
 {source:'local-shared',name:'本机已保存回执',checkedAt:old,stale:true,updateFailed:true,usage},
 {source:'cloud-language',name:'第二语言云端',checkedAt:recent,usage},
 {source:'cloud-algorithm',name:'第二算法云端',checkedAt:recent,usage},
 {source:'cloud-schedule',name:'课表云端',checkedAt:recent,usage},
 {source:'cloud-ledger',name:'账单云端',checkedAt:null,usage:null}
 ]}],estimates:[],reserves:{}};
const html=`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/styles.css"></head><body><button id="balanceButton">服务额度</button>${dialog}<script type="module">import {createBalanceUI} from '/balances.js';createBalanceUI({api:async()=>(${JSON.stringify(fixture)}),showDialog:id=>document.getElementById(id).showModal()});window.ready=true;</script></body></html>`;
const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_EXECUTABLE||'C:/Users/huawei/AppData/Local/ms-playwright/chromium-1223/chrome-win64/chrome.exe'}),errors=[];
try{for(const viewport of [{width:402,height:874},{width:320,height:620}]){
 const context=await browser.newContext({viewport,isMobile:true,hasTouch:true,serviceWorkers:'block'}),page=await context.newPage();page.on('pageerror',error=>errors.push(error.message));
 await page.route('**/*',async route=>{const url=new URL(route.request().url());if(url.origin!==origin)return route.abort();if(url.pathname==='/')return route.fulfill({contentType:'text/html',body:html});if(!['/styles.css','/balances.js'].includes(url.pathname))return route.abort();return route.fulfill({contentType:url.pathname.endsWith('.css')?'text/css':'text/javascript',body:await readFile('web'+url.pathname)});});
 await page.goto(origin);await page.waitForFunction(()=>window.ready===true);await page.locator('#balanceButton').click();await page.waitForFunction(()=>document.getElementById('balanceStatus').textContent==='上次更新的额度记录');
 const text=await page.locator('#balancePools').innerText();for(const expected of ['余额证据','2026/10/20','旧记录','本机已保存回执','本次更新未完成，保留旧值','第二语言云端','第二算法云端','课表云端','账单云端：尚无完整用量记录','1 次调用处理中','1 次调用待核对'])assert(text.includes(expected),expected);
 assert(!text.includes('cloud-language'));assert.equal(await page.locator('dialog[open]').count(),1);
 const geometry=await page.locator('#balancesDialog').evaluate(node=>({left:node.getBoundingClientRect().left,right:node.getBoundingClientRect().right,overflow:[...node.querySelectorAll('.balance-card')].some(card=>card.scrollWidth>card.clientWidth+1)}));assert(geometry.left>=-1&&geometry.right<=viewport.width+1&&!geometry.overflow);
 await page.screenshot({path:out+'/'+viewport.width+'.png'});await context.close();
 }assert.deepEqual(errors,[]);await writeFile(out+'/result.json',JSON.stringify({ok:true,viewports:[402,320],errors,paidCalls:0,liveRequests:0},null,2));console.log(JSON.stringify({ok:true,viewports:2,errors,paidCalls:0,liveRequests:0}));
}finally{await browser.close();}

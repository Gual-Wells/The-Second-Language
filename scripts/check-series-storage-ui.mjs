import assert from 'node:assert/strict';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {DatabaseSync} from 'node:sqlite';
import path from 'node:path';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import {seriesStorageRoute} from '../worker/src/series-storage-route.js';
import {reportSeriesStorage,seriesStorageView,seriesStoragePolicy} from '../worker/src/series-storage.js';

const output=path.resolve('.cache/series-storage-20261031/ui');await mkdir(path.join(output,'browser-temp'),{recursive:true});
process.env.TEMP=process.env.TMP=process.env.TMPDIR=path.join(output,'browser-temp');
const checks=[],check=(name,condition=true)=>{assert(condition,name);checks.push(name);};
const sql=new DatabaseSync(':memory:');sql.exec(await readFile('worker/migrations/0026_series_storage.sql','utf8'));
const env={DB:{prepare(text){let args=[];return{bind(...values){args=values;return this;},async first(){return sql.prepare(text).get(...args)||null;},async all(){return{results:sql.prepare(text).all(...args)};},async run(){return{meta:{changes:Number(sql.prepare(text).run(...args).changes)}};}};}}};
const now=Date.now(),stamp=now-1000;
const snapshot=(resourceId,extra={})=>({resourceId,revision:1,observedAt:stamp,verified:true,measurement:'provider-quota',complete:true,usedBytes:200,limitBytes:1000,remainingBytes:750,...extra});
async function call(method='GET',body=null,context={},suffix=''){
 return seriesStorageRoute(new Request('https://fixture.invalid/api/series/storage'+suffix,{method,...(body===null?{}:{body:typeof body==='string'?body:JSON.stringify(body)})}),env,context);
}
try{
 check('anonymous series GET is 401',(await call()).status===401);
 check('anonymous series POST is 401',(await call('POST',{reports:[snapshot('onedrive-account')]},{},'/report')).status===401);
 check('logged-in owner can read registry without writes',(await call('GET',null,{session:true})).status===200&&sql.prepare('SELECT COUNT(*) n FROM service_series_storage').get().n===0);
 check('logged-in owner cannot publish storage metadata',(await call('POST',{reports:[snapshot('onedrive-account')]},{session:true},'/report')).status===403);
 check('publisher cannot submit private content',(await call('POST',{reports:[snapshot('onedrive-account',{question:'private'})]},{isPublisher:true},'/report')).status===400);
 check('publisher cannot pass arbitrary resource identity',(await call('POST',{reports:[snapshot('foreign-file')]},{isPublisher:true},'/report')).status===400);
 check('publisher cannot submit excessive payload',(await call('POST',' '.repeat(32001),{isPublisher:true},'/report')).status===413);
 const source=(await readFile('worker/src/series-usage-rpc.js','utf8')).replace(/^import .*$/gm,'').replace(/export class /g,'class ')+'\nObject.assign(exports,{AlgorithmStorage,ScheduleStorage,LedgerStorage});';
 const exports={};vm.runInNewContext(source,{exports,WorkerEntrypoint:class{constructor(env){this.env=env;}},reportSeriesStorage,seriesStoragePolicy});
 for(const [name,project]of[['AlgorithmStorage','algorithm'],['ScheduleStorage','schedule'],['LedgerStorage','ledger']]){
  const instance=new exports[name](env);assert.deepEqual(Object.getOwnPropertyNames(exports[name].prototype),['constructor','policy','report']);
  check(name+' policy source is pinned and cannot be caller-selected',instance.policy('language').projectId===project);
  await instance.report({reports:[snapshot('d1-'+project)]});
  await assert.rejects(instance.report({reports:[snapshot('d1-language')]}));check(name+' rejects reporting another project');
  await assert.rejects(instance.report({reports:[snapshot('d1-'+project,{url:'https://private.invalid/'})]}));check(name+' rejects content/proxy fields');
 }
 check('capability reports cannot open a foreign database binding',Object.keys(env).join(',')==='DB');
 const publisher=await call('POST',{reports:[snapshot('onedrive-account')]},{isPublisher:true},'/report');check('publisher valid metadata report is accepted',publisher.status===200);
 await reportSeriesStorage(env,'admin',{reports:[
  snapshot('cloudflare-d1-account',{measurement:'database-size',usedBytes:5_263_360,limitBytes:null,remainingBytes:null,projectAttributedBytes:{language:3_682_304,algorithm:229376,schedule:917504,ledger:151552},otherUsedBytes:282624}),
  ...[['d1-language',1740800],['d1-language-practice',1855488],['d1-language-lab',86016],['d1-algorithm',229376],['d1-schedule',917504],['d1-ledger',151552]].map(([id,usedBytes])=>snapshot(id,{revision:2,observedAt:stamp+1,measurement:'database-size',usedBytes,limitBytes:null,remainingBytes:null})),
  snapshot('cloudflare-kv-account',{measurement:'daily-high-water',complete:false,usedBytes:24_713_337,limitBytes:null,remainingBytes:null}),
  snapshot('onedrive-account',{revision:2,observedAt:stamp+1,usedBytes:1_932_735_284,limitBytes:1_104_880_336_896,remainingBytes:1_102_947_601_612}),
  snapshot('kaggle-private-account',{measurement:'inventory',complete:false,usedBytes:11_915_747,limitBytes:null,remainingBytes:null})
 ]});
 const series=await seriesStorageView(env),language={pools:[
  {pool:'onedrive',name:'OneDrive',note:'永久正文、音频与备份',usedBytes:1_932_735_284,projectBytes:1_611_207_092,limitBytes:1_104_880_336_896,freeFits:true,statisticsDiffer:false},
  ...['main','practice','lab'].map((pool,index)=>({pool,name:['章节数据库','雅思数据库','实验数据库'][index],note:'状态与索引',usedBytes:[1740800,1855488,86016][index],limitBytes:500000000})),
  {pool:'kv',name:'近期缓存',note:'Cloudflare KV · 账户共享',usedBytes:24_713_337,limitBytes:1000000000,chapterCacheBytes:406995,practiceCacheBytes:0,measurementDate:'2026-10-31'}
 ].map(pool=>({...pool,checkedAt:stamp,updateFailed:false,stale:false}))};
 const {chromium}=createRequire(process.execPath)('playwright');
 const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_EXECUTABLE||'C:/Users/huawei/AppData/Local/ms-playwright/chromium-1223/chrome-win64/chrome.exe'});
 const summaries=[],screenshots=[];
 try{
  for(const width of[402,320]){
   const context=await browser.newContext({viewport:{width,height:874},deviceScaleFactor:3,isMobile:true,hasTouch:true,serviceWorkers:'block'}),page=await context.newPage(),errors=[],externalRequests=[];
   page.on('pageerror',error=>errors.push(error.message));page.on('request',request=>{if(new URL(request.url()).origin!=='https://series-storage.test')externalRequests.push(request.url());});
   const bootstrap=`import {installSettingsNavigation} from '/settings.js';import {createStorageUsageUI} from '/storage-usage.js';
window.fixtures=${JSON.stringify({language,series})};window.requests=[];window.pending=[];window.manual=false;
const showDialog=id=>{const dialog=document.getElementById(id),parent=document.querySelector('dialog[open]');if(parent&&parent!==dialog){dialog.returnDialog=parent.id;parent.close();}if(!dialog.open)dialog.showModal();};
document.getElementById('app').classList.remove('login-mode');const nav=installSettingsNavigation();document.getElementById('settingsButton').onclick=()=>{nav.reset();showDialog('settingsDialog');};
for(const dialog of document.querySelectorAll('dialog'))dialog.addEventListener('close',()=>{if(dialog.returnDialog){const parent=dialog.returnDialog;dialog.returnDialog=null;requestAnimationFrame(()=>showDialog(parent));}});
for(const button of document.querySelectorAll('[data-close]'))button.onclick=()=>document.getElementById(button.dataset.close).close();
window.ui=createStorageUsageUI({showDialog,api:async resource=>{window.requests.push(resource);if(!['/api/storage/usage','/api/series/storage'].includes(resource))throw Error('Unexpected API route');if(window.manual)return new Promise((resolve,reject)=>window.pending.push({resource,resolve,reject}));return structuredClone(window.fixtures[resource.includes('/series/')?'series':'language']);}});window.ready=true;`;
   await page.route('**/*',async route=>{
    const url=new URL(route.request().url());if(url.origin!=='https://series-storage.test')return route.abort();
    const file=url.pathname==='/'?'index.html':url.pathname.slice(1);if(file==='bootstrap.js')return route.fulfill({body:bootstrap,contentType:'text/javascript'});
    try{let body=await readFile(path.join('web',file));if(file==='index.html')body=Buffer.from(body.toString().replace(/\/app\.js\?v=\d+/,'/bootstrap.js'));
     return route.fulfill({body,contentType:file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.html')?'text/html':file.endsWith('.svg')?'image/svg+xml':'application/octet-stream'});
    }catch{return route.fulfill({status:404,body:''});}
   });
   const screenshot=async name=>{const filename=path.join(output,width+'-'+name+'.png');await page.screenshot({path:filename,scale:'css'});screenshots.push(filename);};
   const noOverflow=async()=>page.evaluate(()=>{const sheet=document.querySelector('#storageUsageDialog .sheet');return document.documentElement.scrollWidth<=innerWidth&&sheet.scrollWidth<=sheet.clientWidth&&[...sheet.querySelectorAll('.balance-card')].every(card=>card.scrollWidth<=card.clientWidth);});
   try{
    await page.goto('https://series-storage.test/');await page.waitForFunction(()=>window.ready);
    await page.locator('#settingsButton').click();await page.locator('.settings-home > .settings-row').filter({hasText:'存储空间'}).click();await page.locator('#storageUsageButton').click();
    await page.locator('#storageUsagePools .balance-card').nth(4).waitFor();
    check(width+' native project view has five cards',await page.locator('#storageUsagePools .balance-card').count()===5);
    check(width+' project view preserves original capacity labels',(await page.locator('#storageUsagePools').innerText()).includes('500 MB（单库）'));
    check(width+' project view has no horizontal overflow',await noOverflow());await screenshot('project');
    await page.locator('[data-scope="series"]').click();await page.waitForFunction(()=>document.getElementById('storageUsageStatus').textContent.includes('分别计算'));
    check(width+' series view has five account pools',await page.locator('#storageUsagePools .balance-card').count()===5);
    const seriesText=await page.locator('#storageUsagePools').innerText();
    for(const name of['第二语言章节数据库','第二语言雅思数据库','第二语言实验数据库','第二算法数据库','课表数据库','账单数据库'])check(width+' series shows '+name,seriesText.includes(name+'：'));
    check(width+' directory inventory does not claim a known remaining quota',seriesText.includes('按文件目录盘点；剩余容量尚未核实。'));
    check(width+' shared pool labels do not introduce a cross-provider total',!seriesText.includes('总计')&&!seriesText.includes('合计'));
    check(width+' active scope exposes current selection',await page.locator('[data-scope="series"]').getAttribute('aria-pressed')==='true');
    check(width+' series view has no horizontal overflow',await noOverflow());await screenshot('series-top');
    await page.locator('#storageUsageDialog .sheet').evaluate(element=>element.scrollTop=element.scrollHeight);await screenshot('series-bottom');
    const beforeIdle=await page.evaluate(()=>window.requests.length);await page.waitForTimeout(80);check(width+' view does not poll providers or local APIs',await page.evaluate(()=>window.requests.length)===beforeIdle);
    await page.evaluate(()=>{for(const pool of window.fixtures.series.capacityGroups){pool.usedBytes=null;pool.limitBytes=null;pool.observedAt=null;pool.updateFailed=true;pool.verified=false;}for(const child of window.fixtures.series.resources){child.usedBytes=null;child.limitBytes=null;}});
    await page.locator('[data-scope="series"]').click();await page.waitForFunction(()=>document.getElementById('storageUsageStatus').textContent.includes('分别计算'));
    check(width+' unknown measurements render as unknown',(await page.locator('#storageUsagePools .balance-amount').allTextContents()).every(text=>text==='未核实'));
    check(width+' unknown measurements show no meters',await page.locator('#storageUsagePools progress').count()===0);
    check(width+' failed refresh remains visible',(await page.locator('#storageUsagePools').innerText()).includes('最近一次更新未成功'));
    await page.locator('#storageUsageDialog .sheet').evaluate(element=>element.scrollTop=0);check(width+' unknown view has no horizontal overflow',await noOverflow());await screenshot('unknown');
    const geometry=await page.evaluate(()=>{const dialog=document.getElementById('storageUsageDialog'),sheet=dialog.querySelector('.sheet'),head=sheet.querySelector('.sheet-head'),rect=element=>{const value=element.getBoundingClientRect();return{top:value.top,bottom:value.bottom,height:value.height};};return{dialog:rect(dialog),sheet:rect(sheet),head:rect(head),dialogScrollTop:dialog.scrollTop,sheetScrollTop:sheet.scrollTop};});
    await writeFile(path.join(output,width+'-unknown-geometry.json'),JSON.stringify(geometry,null,2));
    check(width+' scope switch leaves the close/title bar visible',geometry.head.top>=0&&geometry.head.bottom<=874);
    await page.evaluate(data=>{window.fixtures.series=data;const pool=window.fixtures.series.capacityGroups.find(pool=>pool.id==='onedrive-account');pool.stale=true;pool.updateFailed=true;pool.observedAt=Date.now()-3*86400000;},series);
    await page.locator('[data-scope="series"]').click();await page.waitForFunction(()=>document.getElementById('storageUsageStatus').textContent.includes('分别计算'));
    const staleText=await page.locator('#storageUsagePools').innerText();check(width+' stale failed record preserves its measured amount',staleText.includes('1.93 GB')&&staleText.includes('旧记录')&&staleText.includes('保留原记录'));
    await page.evaluate(()=>{window.manual=true;window.pending=[];document.querySelector('[data-scope="language"]').click();document.querySelector('[data-scope="series"]').click();});
    await page.waitForFunction(()=>window.pending.length===2);
    await page.evaluate(()=>{window.pending[1].resolve(structuredClone(window.fixtures.series));});await page.waitForFunction(()=>document.getElementById('storageUsageStatus').textContent.includes('分别计算'));
    await page.evaluate(()=>window.pending[0].reject(Error('obsolete-language-failure')));await page.waitForTimeout(30);
    check(width+' stale language failure cannot overwrite newer series result',!(await page.locator('#storageUsageDialog').innerText()).includes('obsolete-language-failure'));
    await page.evaluate(()=>{window.pending=[];document.querySelector('[data-scope="language"]').click();document.querySelector('[data-scope="series"]').click();});await page.waitForFunction(()=>window.pending.length===2);
    await page.evaluate(()=>window.pending[0].resolve(structuredClone(window.fixtures.language)));await page.waitForTimeout(30);
    check(width+' stale language success cannot fill the new series view',await page.locator('#storageUsagePools .balance-card').count()===0);
    await page.evaluate(()=>window.pending[1].resolve(structuredClone(window.fixtures.series)));await page.waitForFunction(()=>document.getElementById('storageUsageStatus').textContent.includes('分别计算'));
    check(width+' rapid scope switch keeps a single dialog',await page.locator('dialog[open]').count()===1);
    await page.evaluate(()=>{window.pending=[];document.querySelector('[data-scope="language"]').click();});await page.waitForFunction(()=>window.pending.length===1);
    await page.locator('[data-close="storageUsageDialog"]').click();await page.locator('#settingsDialog').waitFor({state:'visible'});
    const hiddenBefore=await page.locator('#storageUsageStatus').textContent();await page.evaluate(()=>window.pending[0].resolve(structuredClone(window.fixtures.language)));await page.waitForTimeout(30);
    check(width+' closing invalidates pending rendering',await page.locator('#storageUsagePools .balance-card').count()===0&&await page.locator('#storageUsageStatus').textContent()===hiddenBefore);
    check(width+' closing returns to settings home',await page.locator('#settingsDialog .settings-home').isVisible()&&await page.locator('dialog[open]').count()===1);
    await page.evaluate(()=>window.manual=false);await page.locator('.settings-home > .settings-row').filter({hasText:'存储空间'}).click();await page.locator('#storageUsageButton').click();await page.locator('#storageUsagePools .balance-card').nth(4).waitFor();
    check(width+' immediate ordinary reopen reads a fresh snapshot',await page.locator('[data-scope="language"]').getAttribute('aria-pressed')==='true');
    await page.evaluate(()=>{const extra=structuredClone(window.fixtures.series.capacityGroups.at(-1));extra.id='future-archive';extra.name='后续独立档案池';window.fixtures.series.capacityGroups.push(extra);});
    await page.locator('[data-scope="series"]').click();await page.waitForFunction(()=>document.getElementById('storageUsagePools').children.length===6);
    check(width+' UI accommodates additional registered pools without adding capacities',await page.locator('#storageUsagePools .balance-card').count()===6&&!((await page.locator('#storageUsagePools').innerText()).includes('合计')));
    check(width+' extra pool view has no horizontal overflow',await noOverflow());
    check(width+' no browser runtime errors',errors.length===0);check(width+' no provider HTTP requests',externalRequests.length===0);
    summaries.push({width,height:874,deviceScaleFactor:3,isMobile:true,hasTouch:true,runtimeErrors:errors,providerRequests:externalRequests,apiReads:await page.evaluate(()=>window.requests.length)});
   }finally{await context.close();}
  }
  await writeFile(path.join(output,'verification.json'),JSON.stringify({passed:true,platform:'Chromium touch/mobile emulation; not physical iPhone or iOS Safari',browser:browser.version(),checks,summaries,screenshots},null,2)+'\n');
  console.log(`通过：${checks.length}项系列存储权限与手机界面检查；402×874及320×874；无真实厂商请求、费用或部署。`);
 }finally{await browser.close();}
}finally{sql.close();}

import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
const {chromium}=createRequire(process.execPath)('playwright'),out='.cache/question-notification-client';await mkdir(out,{recursive:true});
const origin='https://the-second-language.pages.dev',meta=JSON.parse(await readFile('chapters/demo/index.json','utf8')).chapters[0],markdown=await readFile('chapters/demo/chapter.md','utf8');
const chapter={...meta,id:meta.date,markdown,digest:createHash('sha256').update(markdown).digest('hex')},historicalDigest='b'.repeat(64),questionId='00000000-0000-4000-8000-000000000010';
const endpoint='https://fixture.push.apple.com/device-current',deviceId=createHash('sha256').update(endpoint).digest('hex'),publicKey=Buffer.concat([Buffer.from([4]),Buffer.alloc(64,1)]).toString('base64url');
let registered=false;const calls=[],errors=[],checks=[];const check=(name,value)=>{assert.ok(value,name);checks.push(name);};
const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_EXECUTABLE||'C:/Users/huawei/AppData/Local/ms-playwright/chromium-1223/chrome-win64/chrome.exe'});
const context=await browser.newContext({viewport:{width:402,height:874},deviceScaleFactor:1,isMobile:true,hasTouch:true,serviceWorkers:'block',userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Mobile Safari/604.1'});
await context.addInitScript(({endpoint})=>{
 window.pushEvents=[];let subscription={endpoint,toJSON(){return {endpoint,keys:{p256dh:'A'.repeat(87),auth:'B'.repeat(22)}};},async unsubscribe(){subscription=null;return true;}};
 const registration={pushManager:{async getSubscription(){return subscription;},async subscribe(){pushEvents.push('subscribe');return subscription;}}};
 Object.defineProperty(navigator,'standalone',{value:true,configurable:true});
 Object.defineProperty(navigator,'serviceWorker',{value:{ready:Promise.resolve(registration),async register(){return registration;},controller:null,addEventListener(){}},configurable:true});
 Object.defineProperty(window,'PushManager',{value:function(){},configurable:true});
 Object.defineProperty(window,'Notification',{value:class{static permission='default';static requestPermission(){pushEvents.push('permission');if(!navigator.userActivation.isActive)throw Error('permission outside real click');this.permission='granted';return Promise.resolve('granted');}},configurable:true});
 const original=window.fetch;window.fetch=(url,...args)=>{if(String(url).startsWith('/api/push/'))pushEvents.push('fetch:'+url);return original(url,...args);};
},{endpoint});
const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
await page.route('**/*',async route=>{
 const req=route.request(),url=new URL(req.url()),p=url.pathname;if(url.origin!==origin)return route.abort();
 if(p.startsWith('/api/')||p.startsWith('/auth/')){
  const bodyValue=req.method()==='GET'?null:req.postDataJSON();calls.push({path:p,method:req.method(),body:bodyValue,query:url.search});let body={};
  if(p==='/api/session')body={authenticated:true,demo:false,readerUserId:'notification-client-reader'};
  else if(p==='/api/chapters')body={chapters:[chapter]};
  else if(p.startsWith('/api/chapters/'))body=chapter;
  else if(p==='/api/settings')body={goal:'',restRequested:true,temporaryRequested:false};
  else if(p==='/api/temporary')body={pages:[]};
  else if(p==='/api/questions/summary')body={threads:[{chapterId:'historical-chapter',digest:historicalDigest,title:'固定历史会话',unread:0}]};
  else if(p==='/api/questions/open')body={chapterId:bodyValue.chapterId,digest:bodyValue.digest,threadId:'history',readOnly:true,focusQuestionId:bodyValue.questionId,threads:[{chapterId:bodyValue.chapterId,digest:bodyValue.digest,title:'固定历史会话',unread:1}],messages:[{id:questionId,seq:1,role:'user',content:'已封存版本的问题',status:'answered'},{id:'history-answer',seq:2,role:'assistant',replyTo:questionId,content:'完整保留的历史回答。'}]};
  else if(p==='/api/push/status')body={configured:true,deviceCount:registered?1:0,deviceIds:registered?[deviceId]:[]};
  else if(p==='/api/push/public-key')body={publicKey};
  else if(p==='/api/push/register'){registered=true;body={ok:true};}
  else if(p==='/api/push/unregister'){registered=false;body={ok:true};}
  else if(p==='/api/chapter-tests')body={tests:[]};
  else if(p==='/api/chapter-quality')body={requests:[]};
  return route.fulfill({json:body});
 }
 const name=p==='/'?'index.html':p.slice(1),types={html:'text/html',js:'text/javascript',css:'text/css',svg:'image/svg+xml',png:'image/png',webmanifest:'application/manifest+json'};
 try{return route.fulfill({body:await readFile('web/'+name),contentType:types[name.split('.').at(-1)]||'text/plain'});}catch{return route.fulfill({status:404,body:''});}
});
try{
 await page.goto(origin);await page.locator('#reader').waitFor({state:'visible'});await page.waitForFunction(()=>!document.getElementById('pushButton').disabled);
 check('browser-only subscription is not falsely confirmed',await page.locator('#pushStatus').textContent()==='本机提醒尚未连接，点按开启可重新连接。');
 await page.locator('#settingsButton').click();await page.locator('.settings-row').getByText('提醒',{exact:true}).click();await page.evaluate(()=>window.pushEvents=[]);await page.locator('#pushButton').click();
 await page.waitForFunction(()=>document.getElementById('pushButton').hidden);
 check('permission is requested synchronously from actual user click',await page.evaluate(()=>pushEvents[0]==='permission'));
 check('server receipt restores existing device subscription',registered&&calls.some(c=>c.path==='/api/push/register'&&c.body.endpoint===endpoint));
 check('no duplicate browser subscription is created',await page.evaluate(()=>!pushEvents.includes('subscribe')));
 check('confirmed status includes new chapter and replies',await page.locator('#pushStatus').textContent()==='这台设备已开启新章与答疑提醒。');
 await page.screenshot({path:out+'/reminders-confirmed-402x874.png'});
 await page.locator('#disablePushButton').click();await page.waitForFunction(()=>!document.getElementById('pushButton').hidden);check('disable removes both browser and server subscription',!registered&&await page.locator('#disablePushButton').isHidden());
 calls.length=0;
 await page.goto(`${origin}/?questions=${questionId}&chapter=historical-chapter&digest=${historicalDigest}`);await page.locator('#questionsDialog[open]').waitFor();await page.waitForFunction(()=>!document.getElementById('questionChapter').disabled);
 check('startup notification opens the exact historical conversation',(await page.locator('#questionChapter').inputValue())===`historical-chapter@${historicalDigest}`);
 check('notification keeps historical conversation read-only',await page.locator('#questionSend').isDisabled());
 check('notification never restores an archived chapter body',!calls.some(c=>c.path.startsWith('/api/chapters/')&&c.query.includes(historicalDigest)));
 check('complete historical answer is visible',await page.locator('#questionMessages').innerText().then(text=>text.includes('完整保留的历史回答。')));
 check('no page overflow',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));check('no browser errors',errors.length===0);
 await page.screenshot({path:out+'/notification-open-402x874.png'});await writeFile(out+'/results.json',JSON.stringify({checks,errors,paidCalls:0,liveRequests:0},null,2));console.log(JSON.stringify({checks:checks.length,errors,paidCalls:0,liveRequests:0}));
}catch(error){await page.screenshot({path:out+'/failure.png'}).catch(()=>{});console.error(JSON.stringify({errors,recent:calls.slice(-6),pushStatus:await page.locator('#pushStatus').textContent()}));throw error;}finally{await browser.close();}

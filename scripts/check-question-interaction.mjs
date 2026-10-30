import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createRequire} from 'node:module';
const {chromium}=createRequire(process.execPath)('playwright');
const out='.cache/question-interaction';await mkdir(out,{recursive:true});
const origin='https://reader.test',a='a'.repeat(64),b='b'.repeat(64),uid=n=>`00000000-0000-4000-8000-${String(n).padStart(12,'0')}`;
const turns=new Map([['chapter-a',[]],['chapter-b',Array.from({length:30},(_,i)=>[
 {id:uid(100+i),seq:i*2+1,role:'user',status:'answered',content:`历史问题 ${i+1}`},
 {id:uid(200+i),seq:i*2+2,role:'assistant',replyTo:uid(100+i),content:('历史解释。'.repeat(35))}]).flat()]]);
const threads=[{chapterId:'chapter-a',digest:a,title:'当前章',unread:0},{chapterId:'chapter-b',digest:b,title:'历史章',unread:0}];
let lost=false,hold=false,release,holdRead=false,releaseRead,readStarted;
const requests=[],errors=[],checks=[];const check=(name,value)=>{assert.ok(value,name);checks.push(name);};
const index=await readFile('web/index.html','utf8'),dialog=index.match(/<dialog[^>]*id="questionsDialog"[\s\S]*?<\/dialog>/)?.[0];assert(dialog);
const html=`<!doctype html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/styles.css"></head><body><button id="questionsButton">章节答疑<span id="questionDot" hidden></span></button>${dialog}<script type="module">
import {createQuestionsUI} from '/questions.js';
window.toasts=[];window.contextState={authenticated:true,demo:false,readerUserId:'question-test-reader',current:{id:'chapter-a',digest:'${a}',title:'当前章'}};
window.ui=createQuestionsUI({getContext:()=>contextState,toast:value=>toasts.push(value),showDialog:id=>{const dialog=document.getElementById(id);if(!dialog.open)dialog.showModal();},api:async(path,options)=>{const r=await fetch(path,options);const value=await r.json();if(!r.ok)throw Error(value.error||'请求失败');return value;}});
document.querySelector('[data-close="questionsDialog"]').onclick=()=>document.getElementById('questionsDialog').close();window.ready=true;
</script></body></html>`;
const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_EXECUTABLE||'C:/Users/huawei/AppData/Local/ms-playwright/chromium-1223/chrome-win64/chrome.exe'});
const context=await browser.newContext({viewport:{width:402,height:874},deviceScaleFactor:1,isMobile:true,hasTouch:true,serviceWorkers:'block'}),page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
await page.route('**/*',async route=>{
 const req=route.request(),url=new URL(req.url()),p=url.pathname;if(url.origin!==origin)return route.abort();
 if(p==='/')return route.fulfill({contentType:'text/html',body:html});
 if(p.startsWith('/api/')){
  const value=req.method()==='POST'?req.postDataJSON():null;requests.push({path:p,method:req.method(),value});let body={};
  if(p==='/api/questions/summary')body={threads};
  else if(p==='/api/questions/open'){
   const chapter=value.chapterId,questionId=value.questionId;
   if(questionId&&!turns.get(chapter)?.some(m=>m.role==='user'&&m.id===questionId))return route.fulfill({status:404,json:{error:'提醒对应的问题不存在'}});
   body={threads,chapterId:chapter,digest:chapter==='chapter-a'?a:b,threadId:chapter,readOnly:chapter==='chapter-b',messages:turns.get(chapter)||[],focusQuestionId:questionId||null};
  }else if(p==='/api/questions'&&req.method()==='POST'){
   const list=turns.get(value.chapterId);if(!list.some(m=>m.id===value.id))list.push({id:value.id,role:'user',content:value.question,status:'pending',seq:Math.max(0,...list.map(m=>m.seq))+1});
   if(lost){lost=false;return route.abort();}if(hold)await new Promise(resolve=>{release=resolve;});body={ok:true};
  }else if(p==='/api/questions'){
   if(holdRead){holdRead=false;readStarted?.();await new Promise(resolve=>{releaseRead=resolve;});}
   const chapter=url.searchParams.get('chapter');body={threadId:chapter,messages:turns.get(chapter)||[],readOnly:chapter==='chapter-b'};
  }else if(p.endsWith('/seen'))body={ok:true};
  return route.fulfill({json:body});
 }
 try{const name=p.slice(1);return route.fulfill({body:await readFile('web/'+name),contentType:name.endsWith('.js')?'text/javascript':name.endsWith('.css')?'text/css':'text/plain'});}catch{return route.fulfill({status:404,body:''});}
});
const open=async()=>{await page.locator('#questionsButton').click();await page.waitForFunction(()=>!document.querySelector('#questionChapter').disabled);};
const close=async()=>{await page.locator('[data-close="questionsDialog"]').click();await page.waitForFunction(()=>!document.querySelector('#questionsDialog').open);};
const sent=()=>requests.filter(r=>r.path==='/api/questions'&&r.method==='POST');
try{
 await page.goto(origin);await page.waitForFunction(()=>window.ready);await open();
 lost=true;await page.locator('#questionText').fill('丢失回执的问题');await page.locator('#questionSend').click();await page.waitForFunction(()=>!document.querySelector('#questionSend').disabled);const original=sent().at(-1).value.id;
 check('lost ACK leaves original draft',await page.locator('#questionText').inputValue()==='丢失回执的问题');
 await close();await page.reload();await page.waitForFunction(()=>window.ready);await open();
 check('draft survives close and reload',await page.locator('#questionText').inputValue()==='丢失回执的问题');
 await page.locator('#questionSend').click();await page.waitForFunction(()=>!document.querySelector('#questionSend').disabled);
 check('explicit retry after reload preserves original request ID',sent().at(-1).value.id===original);check('server retains one accepted question',turns.get('chapter-a').filter(m=>m.id===original).length===1);
 hold=true;await page.locator('#questionText').fill('发送中的问题');await page.locator('#questionSend').click();while(!release)await new Promise(resolve=>setTimeout(resolve,5));await page.locator('#questionText').fill('下一问草稿');release();hold=false;release=null;await page.waitForFunction(()=>!document.querySelector('#questionSend').disabled);
 check('new draft survives earlier send ACK',await page.locator('#questionText').inputValue()==='下一问草稿');
 await page.evaluate(()=>{const original=Storage.prototype.setItem;window.restoreStorage=()=>Storage.prototype.setItem=original;Storage.prototype.setItem=function(key,value){if(key.startsWith('second-language-question-pending-v1:'))throw Error('quota fixture');return original.call(this,key,value);};});
 const before=sent().length;await page.locator('#questionText').fill('不能持久保存时不发送');await page.locator('#questionSend').click();await page.waitForFunction(()=>!document.querySelector('#questionSend').disabled);check('unavailable durable storage stops before request',sent().length===before);await page.evaluate(()=>window.restoreStorage());
 await close();turns.get('chapter-a').push({id:uid(500),role:'user',content:'未知结果',status:'failed',error:'API结果待核对，暂不重复生成',seq:500},{id:uid(501),role:'user',content:'可重做',status:'failed',error:'处理暂未完成，请稍后重试',seq:501});await open();
 check('unknown result has no retry action',await page.locator(`[data-message-id="${uid(500)}"] button`).count()===0);check('known failure retains retry action',await page.locator(`[data-message-id="${uid(501)}"] button`).count()===1);
 await close();await page.evaluate(({chapterId,digest,questionId})=>ui.openTarget({chapterId,digest,questionId}),{chapterId:'chapter-b',digest:b,questionId:uid(110)});await page.waitForFunction(()=>!document.querySelector('#questionChapter').disabled);
 check('notification opens exact historical revision',await page.locator('#questionChapter').inputValue()==='chapter-b@'+b);
 const offset=await page.locator(`[data-question-id="${uid(110)}"]`).evaluate(e=>e.getBoundingClientRect().top-document.querySelector('#questionMessages').getBoundingClientRect().top);check('notification scrolls to its question',Math.abs(offset)<3);
 check('archived history is read-only',await page.locator('#questionSend').isDisabled());check('notification does not switch text identity',await page.evaluate(()=>contextState.current.id)==='chapter-a');
 await page.screenshot({path:out+'/notification-history-402x874.png'});
 const anchor=await page.locator('#questionMessages').evaluate(list=>{list.scrollTop=220;const node=[...list.querySelectorAll('[data-message-id]')].find(n=>n.getBoundingClientRect().bottom>list.getBoundingClientRect().top);return {id:node.dataset.messageId,offset:node.getBoundingClientRect().top-list.getBoundingClientRect().top};});
 turns.get('chapter-b').find(m=>m.role==='assistant').content='新增详细回复。'.repeat(400);await page.evaluate(()=>document.dispatchEvent(new Event('visibilitychange')));await page.waitForTimeout(120);
 const after=await page.locator(`[data-message-id="${anchor.id}"]`).evaluate(e=>e.getBoundingClientRect().top-document.querySelector('#questionMessages').getBoundingClientRect().top);check('late content preserves reading anchor',Math.abs(after-anchor.offset)<3);
 let started;const start=new Promise(resolve=>{started=resolve;});holdRead=true;readStarted=started;await page.evaluate(()=>document.dispatchEvent(new Event('visibilitychange')));await start;await close();const seenBefore=requests.filter(r=>r.path.endsWith('/seen')).length;releaseRead();await page.waitForTimeout(100);check('closing a pending refresh never acknowledges replies',requests.filter(r=>r.path.endsWith('/seen')).length===seenBefore);
 check('no browser errors',errors.length===0);await writeFile(out+'/results.json',JSON.stringify({checks,errors,paidCalls:0,liveRequests:0},null,2));console.log(JSON.stringify({checks:checks.length,errors,paidCalls:0,liveRequests:0}));
}catch(error){await page.screenshot({path:out+'/failure.png'}).catch(()=>{});console.error(JSON.stringify({errors,status:await page.locator('#questionStatus').textContent(),recent:requests.slice(-5)}));throw error;}finally{await browser.close();}

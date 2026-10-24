import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
const {chromium}=createRequire(process.execPath)('playwright');
const output=path.resolve('.cache/voice-dialogue-ui');await mkdir(path.join(output,'tmp'),{recursive:true});process.env.TEMP=process.env.TMP=path.join(output,'tmp');
const words=Array.from({length:50},(_,i)=>({id:'W'+String(i+1).padStart(3,'0'),use:'U'+String(i+1).padStart(3,'0'),text:'fixture'+String(i+1).padStart(3,'0')}));
const markdown='<!-- PART:one -->\n'+words.map(w=>`<!-- WORD:${w.id} -->\n# ${w.text}\n\n**词源**：隔离界面验证。\n\n<!-- USE:${w.use} -->\n## ${w.text} · 测试义 /test/\n\`只为验证界面。\`\n保持这一条完整教学说明。`).join('\n')+'\n<!-- PART:two -->\n'+words.map(w=>`<!-- WORD:${w.id} -->\n# ${w.text}\n<!-- EXAMPLE:${w.use} -->\nThis fixture uses ${w.text}.\n\`隔离验证例句。\``).join('\n')+'\n<!-- PART:three -->\n<!-- ARTICLE:A01 -->\n# Isolated UI fixture\n'+words.map((w,i)=>`<!-- SENTENCE:S${i+1} USE:${w.use} -->\nA self-written fixture paragraph uses ${w.text}.\n\`这是独立界面验证材料。\``).join('\n');
const chapter={id:'2026-10-24',date:'2026-10-24',number:'第 1 章',title:'隔离验证章',wordCount:50,sourcePolicy:'current-affairs-v1',markdown,digest:createHash('sha256').update(markdown).digest('hex')};
const key='second-language-voice-dialogue-lab:v1',checks=[],errors=[],requests=[];
const check=(name,value)=>{assert(value,name);checks.push(name);};
let mode='empty',auth=true;
const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_EXECUTABLE||'C:/Users/huawei/AppData/Local/ms-playwright/chromium-1223/chrome-win64/chrome.exe'});
const context=await browser.newContext({viewport:{width:393,height:852},deviceScaleFactor:2,isMobile:true,hasTouch:true,serviceWorkers:'block',acceptDownloads:true});
await context.addInitScript(()=>{
 Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{window.__copied=text;}}});
 Object.defineProperty(navigator,'canShare',{configurable:true,value:()=>true});
 Object.defineProperty(navigator,'share',{configurable:true,value:async data=>{window.__shareCalls=(window.__shareCalls||0)+1;if(window.__shareAbort)throw new DOMException('Cancelled','AbortError');window.__sharedText=await data.files[0].text();}});
});
await context.route('**/*',async route=>{
 const request=route.request(),url=new URL(request.url());assert.equal(url.hostname,'voice-dialogue.test','No external network');
 if(url.pathname.startsWith('/api/')){
  requests.push({path:url.pathname,method:request.method(),fresh:url.searchParams.has('voice_lab')});assert.equal(request.method(),'GET','Trial performs no production writes');
  if(mode==='offline')return route.abort('internetdisconnected');
  if(url.pathname==='/api/session')return route.fulfill({json:{authenticated:auth,demo:false}});
  if(!auth)return route.fulfill({status:401,json:{error:'Sign in'}});
  if(url.pathname==='/api/chapters')return route.fulfill({json:{chapters:mode==='empty'||mode==='revoked'?[]:[chapter]}});
  if(url.pathname==='/api/chapters/'+chapter.id)return route.fulfill({json:mode==='wrong-digest'?{...chapter,digest:'a'.repeat(64)}:chapter});
  throw Error('Unexpected API request '+url.pathname);
 }
 const p=url.pathname.endsWith('/')?url.pathname+'index.html':url.pathname,file=path.resolve('web','.'+p);assert(file.startsWith(path.resolve('web')+path.sep));
 try{return route.fulfill({body:await readFile(file),contentType:{html:'text/html',js:'text/javascript',css:'text/css',svg:'image/svg+xml'}[file.split('.').at(-1)]||'application/octet-stream'});}catch{return route.fulfill({status:404,body:''});}
});
const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));let downloads=0;page.on('download',()=>downloads++);
const stored=()=>page.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);
const active=async()=>{const store=await stored();return store.records[store.activeId];};
const screenshot=async name=>{await page.waitForTimeout(150);return page.screenshot({path:path.join(output,name+'.png'),scale:'css'});};
async function newDemo(){await page.locator('#demoButton').click();if(await page.locator('#replaceNotice').isVisible())await page.locator('#confirmNewButton').click();await page.waitForFunction(()=>!document.getElementById('trainingSection').hidden&&document.getElementById('status').textContent.includes('就绪'));}
try{
 await page.goto('https://voice-dialogue.test/labs/voice-dialogue/');await page.waitForFunction(()=>document.getElementById('status').textContent.includes('等待新正式'));
 check('Empty formal catalogue permits only explicit demonstration',await page.locator('#generateButton').isDisabled()&&!(await page.locator('#demoButton').isDisabled()));
 check('Narrow screen does not overflow',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await screenshot('empty');
 await page.locator('#topicInput').fill('A weekend trip with friends');await newDemo();
 let record=await active(),session=record.session;
 check('Demonstration has its own nonformal identity',session.source.kind==='demo'&&session.source.id==='voice-demo-v1');
 check('Targets stay folded before the dialogue',!(await page.locator('.disclosure').first().getAttribute('open')));
 await page.locator('#copyPrompt').click();const prompt=await page.evaluate(()=>window.__copied);check('Copy contains bound exact target data',prompt.includes(session.id)&&prompt.includes(session.source.digest)&&prompt.includes('compromise'));
 const downloadEvent=page.waitForEvent('download');await page.locator('#downloadPrompt').click();const download=await downloadEvent;const saved=path.join(output,'training.txt');await download.saveAs(saved);assert.equal(await readFile(saved,'utf8'),prompt);
 const previousDownloads=downloads;await page.evaluate(()=>window.__shareAbort=true);await page.locator('#sharePrompt').click();await page.waitForFunction(()=>document.getElementById('status').textContent.includes('取消分享'));check('Cancelling iOS-style share does not trigger an unwanted download',downloads===previousDownloads);
 await page.evaluate(()=>window.__shareAbort=false);await page.locator('#sharePrompt').click();await page.waitForFunction(()=>Boolean(window.__sharedText));check('Share carries the same complete training file',await page.evaluate(()=>window.__sharedText)===prompt);
 const report={schema:'tsl.voice.report.v1',sessionId:session.id,sourceId:session.source.id,sourceDigest:session.source.digest,entries:session.targets.map((use,i)=>({useId:use.id,outcome:i?'not_observed':'independent',cueLevel:0,learnerQuote:i?'':use.examples[0].text,assistantPrompt:i?'':'What would you suggest in this situation?',note:i?'':'<img src=x onerror=alert(1)>仅隔离测试'}))};
 await page.locator('#reportInput').fill(JSON.stringify({...report,sourceDigest:'0'.repeat(64)}));await page.locator('#reviewReport').click();check('A report for another digest is rejected without losing its draft',await page.locator('#reportError').isVisible()&&(await active()).draft.includes('000000'));
 await page.locator('#reportInput').fill(JSON.stringify(report));await page.locator('#reviewReport').click();await page.locator('#reportReview').waitFor({state:'visible'});
 check('Report preview cannot change practice scheduling',Object.keys((await stored()).history).length===0);
 check('External model content renders as text',await page.locator('#reportResults img').count()===0&&(await page.locator('#reportResults').textContent()).includes('<img'));
 await screenshot('feedback-preview');await page.locator('#saveReport').click();check('Explicit confirmation saves the report once',(await active()).saved===true&&await page.locator('#reportInput').getAttribute('readonly')!==null);
 const historyOnce=JSON.stringify((await stored()).history);await page.locator('#saveReport').dispatchEvent('click');assert.equal(JSON.stringify((await stored()).history),historyOnce);
 await page.reload();await page.locator('#trainingSection').waitFor({state:'visible'});check('Refresh restores the bound session and locked report',(await active()).session.id===session.id&&(await active()).saved===true);
 await newDemo();const unsaved=(await active()).session.id;await page.locator('#reportInput').fill('An incomplete report draft');await page.reload();await page.locator('#trainingSection').waitFor({state:'visible'});check('Unsubmitted report draft survives refresh',await page.locator('#reportInput').inputValue()==='An incomplete report draft');
 mode='formal';await page.locator('#refreshCatalog').click();await page.locator('#generateButton').waitFor({state:'visible'});await page.waitForFunction(()=>!document.getElementById('generateButton').disabled);
 mode='revoked';await page.locator('#generateButton').click();await page.locator('#confirmNewButton').click();await page.waitForFunction(()=>document.getElementById('status').textContent.includes('已不在当前正式目录'));check('Withdrawal before generation keeps previous source and draft',(await active()).session.id===unsaved&&await page.locator('#reportInput').inputValue()==='An incomplete report draft');
 mode='formal';await page.locator('#refreshCatalog').click();await page.waitForFunction(()=>!document.getElementById('generateButton').disabled);mode='wrong-digest';await page.locator('#generateButton').click();await page.locator('#confirmNewButton').click();await page.waitForFunction(()=>document.getElementById('status').textContent.includes('不一致'));check('Wrong chapter readback cannot replace the session',(await active()).session.id===unsaved);
 mode='formal';await page.locator('#generateButton').click();await page.locator('#confirmNewButton').click();await page.waitForFunction(()=>document.getElementById('status').textContent.includes('训练包已就绪'));check('A live exact formal chapter becomes a new fixed session',(await active()).session.source.digest===chapter.digest&&(await active()).session.source.kind==='chapter');
 await screenshot('formal-ready');const formalId=(await active()).session.id;mode='offline';await page.reload();await page.locator('#trainingSection').waitFor({state:'visible'});await page.waitForFunction(()=>document.getElementById('status').dataset.tone==='error');check('Offline recovery retains old session but blocks new formal production',(await active()).session.id===formalId&&await page.locator('#generateButton').isDisabled());
 const exportIds=['copyPrompt','sharePrompt','downloadPrompt','downloadChapter'];
 check('Offline restored formal material cannot be exported as a current training pack',(await Promise.all(exportIds.map(id=>page.locator('#'+id).isDisabled()))).every(Boolean));
 await page.locator('#copyReportRequest').click();check('A historical session can still request its own after-session report',(await page.evaluate(()=>window.__copied)).includes(formalId));
 const backupEvent=page.waitForEvent('download');await page.locator('#exportRecords').click();const backupDownload=await backupEvent;const backupPath=path.join(output,'local-backup.json');await backupDownload.saveAs(backupPath);const backup=JSON.parse(await readFile(backupPath,'utf8'));
 check('Personal backup preserves full original snapshots even when offline',backup.archiveOnly===true&&Object.values(backup.sourceSnapshots).some(s=>s.digest===chapter.digest&&s.markdown===markdown)&&Boolean(backup.records[formalId]));
 mode='revoked';await page.locator('#refreshCatalog').click();await page.waitForFunction(()=>document.getElementById('status').textContent.includes('等待新正式'));check('Withdrawal also disables old training export without discarding the session',(await Promise.all(exportIds.map(id=>page.locator('#'+id).isDisabled()))).every(Boolean)&&(await active()).session.id===formalId);
 mode='formal';await page.locator('#refreshCatalog').click();await page.waitForFunction(()=>document.getElementById('status').textContent.includes('目录已更新'));check('A separately refreshed matching catalogue restores export without changing the session',(await Promise.all(exportIds.map(id=>page.locator('#'+id).isEnabled()))).every(Boolean)&&(await active()).session.id===formalId);
 await page.evaluate(()=>window.dispatchEvent(new Event('offline')));check('A live offline event immediately revokes formal training export',(await Promise.all(exportIds.map(id=>page.locator('#'+id).isDisabled()))).every(Boolean));
 await page.evaluate(()=>localStorage.setItem('unrelated-project-key','keep'));await page.locator('#clearRecords').click();await page.locator('#confirmClear').click();check('Clear touches only the trial storage',await page.evaluate(k=>localStorage.getItem(k)===null&&localStorage.getItem('unrelated-project-key')==='keep',key));
 check('Every chapter lookup requires a fresh online query',requests.every(r=>r.fresh));check('All runtime errors are absent',errors.length===0);
 await writeFile(path.join(output,'report.json'),JSON.stringify({ok:true,checks,requestCount:requests.length,errors,scope:'Chromium mobile emulation; real iOS ChatGPT Voice interaction requires the user'},null,2));console.log(JSON.stringify({ok:true,checks:checks.length,requestCount:requests.length,errors,mobileViewport:'393x852',screenshots:output}));
}finally{await browser.close();}

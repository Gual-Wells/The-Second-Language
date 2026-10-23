import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {resolve} from 'node:path';

// All chapter text, facts and server responses are self-written UI fixtures.
// The external-link click is intercepted too; this check reads no live news.
const {chromium}=createRequire(process.execPath)('playwright');
const out=resolve('.cache/chapter-sources-ui'),temporary=resolve(out,'tmp');
await mkdir(temporary,{recursive:true});process.env.TEMP=temporary;process.env.TMP=temporary;
const sha=text=>createHash('sha256').update(text).digest('hex');
const words=Array.from({length:50},(_,i)=>`fixture${i+1}`);
const markdown=[
 '<!-- PART:one -->',...words.map(word=>`# ${word}\n\n## ${word} · 界面占位义项 /test/\n\n这是独立编写的布局材料，不是正式课程。\n`),
 '<!-- PART:two -->',...words.map(word=>`# ${word}\n\nThis ${word} sentence exists only for interface inspection.\n\n\`本句仅用于界面检查。\`\n`),
 '<!-- PART:three -->','# A self-written interface story',...Array.from({length:12},(_,i)=>`\n<!-- SENTENCE:S${i+1} -->\nA fictional reader checks a small sources window and then returns to the same page.\n\`一位虚构读者查看小型来源窗口，随后回到同一页。\`\n`)
].join('\n');
const chapter={id:'2026-10-24',date:'2026-10-24',number:'第 1 章',title:'现实参考 · 独立界面检查',subtitle:'自写50词占位材料，不是正式课程',markdown,digest:sha(markdown),sourcePolicy:'current-affairs-v1',sourceDigest:sha('isolated-source-package')};
const sourcePackage={schemaVersion:1,chapterDigest:chapter.digest,context:'这是隔离界面样例：事实摘要及人物均为自写占位材料，不代表真实报道。<img src=x onerror=alert(1)>',sources:[
 {publisher:'Fixture public agency',title:'Self-written source fixture <img src=x onerror=alert(2)>',url:'https://www.nasa.gov/news/',publishedAt:'2026-10-22',readAt:'2026-10-23T10:00:00.000Z',facts:['This statement only checks source presentation.'],limitations:'This fixture makes no real-world factual claim.'},
 {publisher:'Fixture research institution',title:'A source with no publication date',url:'https://www.who.int/news',readAt:'2026-10-23T10:05:00.000Z',facts:['The missing publication date must remain unknown.']}
]};
let scenario='normal',sourceMode='normal',releaseSource;
const calls=[],errors=[],checks=[],screens=[];
const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_EXECUTABLE||'C:/Users/huawei/AppData/Local/ms-playwright/chromium-1223/chrome-win64/chrome.exe'});
const context=await browser.newContext({viewport:{width:402,height:874},deviceScaleFactor:3,isMobile:true,hasTouch:true,serviceWorkers:'block'});
const page=await context.newPage();page.on('pageerror',error=>errors.push(error.message));
await context.route('**/*',async route=>{
 const request=route.request(),url=new URL(request.url()),p=url.pathname;
 if(url.hostname!=='chapter-sources.test')return route.fulfill({body:'Isolated external-link click fixture',contentType:'text/plain'});
 if(p.startsWith('/api/')||p.startsWith('/auth/')){
  if(p.endsWith('/sources')){
   calls.push({url:url.href,method:request.method()});
   if(sourceMode==='hold')await new Promise(resolve=>{releaseSource=resolve;});
   if(sourceMode==='error')return route.fulfill({status:503,json:{error:'来源包原件暂不可核对'}});
   const body={chapterId:chapter.id,chapterDigest:chapter.digest,sourcePolicy:chapter.sourcePolicy,sourceDigest:chapter.sourceDigest,sourcePackage:structuredClone(sourcePackage)};
   if(sourceMode==='mismatch')body.chapterDigest='f'.repeat(64);
   if(sourceMode==='unsafe')body.sourcePackage.sources[0].url='javascript:alert(3)';
   return route.fulfill({json:body});
  }
  const detail={...chapter};if(scenario==='no-source')delete detail.sourcePolicy;
  const data=p==='/api/session'?{authenticated:scenario!=='login',demo:scenario==='demo'}:p==='/api/chapters'?{chapters:scenario==='empty'?[]:[detail]}:p===`/api/chapters/${chapter.id}`?detail:p==='/auth/status'?{enrolled:true,enrollmentOpen:false}:p==='/api/questions/summary'?{threads:[]}:p==='/api/temporary'?{pages:[]}:p==='/api/settings'?{goal:'',restRequested:false,temporaryRequested:false}:{};
  return route.fulfill({json:data});
 }
 const name=p==='/'?'index.html':p.slice(1),contentType={js:'text/javascript',css:'text/css',html:'text/html',svg:'image/svg+xml'}[name.split('.').at(-1)]||'application/octet-stream';
 try{return route.fulfill({body:await readFile(resolve('web',name)),contentType});}catch{return route.fulfill({status:404,body:''});}
});
const check=(name,result)=>{assert(result,name);checks.push(name);};
const shot=async name=>{const path=resolve(out,name+'.png');await page.screenshot({path,scale:'css'});screens.push(path);};
const close=async()=>page.locator('#chapterSourcesDialog .sheet-close').click();
const open=async()=>{await page.locator('#chapterSourcesButton').click();await page.locator('.chapter-source-item').first().waitFor();};
try{
 await page.goto('https://chapter-sources.test/');await page.locator('#reader').waitFor({state:'visible'});
 await page.addStyleTag({content:':root {--safe-top:62px;--safe-bottom:34px}'});
 check('self-written fifty-word fixture renders',await page.locator('#article .word-entry').count()===50);
 check('sources are not prefetched',calls.length===0);
 check('part one has no visible sources entry',await page.locator('#chapterSourcesButton').isHidden());await shot('part-one');
 await page.locator('#wordIndexButton').click();await shot('index');await page.locator('#indexDialog .sheet-close').click();
 await page.locator('[data-part=two]').click();check('part two has no visible sources entry',await page.locator('#chapterSourcesButton').isHidden());await shot('part-two');
 await page.locator('[data-part=three]').click();await page.locator('#chapterSourcesButton').scrollIntoViewIfNeeded();await shot('entry');
 check('one entry uses the existing end actions outside article',await page.locator('#reflection .button-row #chapterSourcesButton').count()===1&&await page.locator('#article #chapterSourcesButton').count()===0);
 const before=await page.locator('#readingScroll').evaluate(e=>e.scrollTop);
 sourceMode='hold';await page.locator('#chapterSourcesButton').click();await page.locator('#chapterSourcesStatus').getByText('正在读取本章现实参考…').waitFor();
 await page.waitForFunction(()=>document.querySelector('#chapterSourcesDialog').open);await new Promise(resolve=>setTimeout(resolve,25));
 check('loading is shown inside one native modal',await page.locator('dialog[open]').count()===1);releaseSource();await page.locator('.chapter-source-item').first().waitFor();sourceMode='normal';
 check('request is bound to chapter and digest',calls.length===1&&calls[0].method==='GET'&&new URL(calls[0].url).pathname===`/api/chapters/${chapter.id}/sources`&&new URL(calls[0].url).searchParams.get('digest')===chapter.digest);
 check('publisher title and fact/fiction boundary display as safe text',await page.locator('.chapter-source-context').innerText().then(text=>text.includes(sourcePackage.context))&&await page.locator('.chapter-source-item h3').first().textContent()===sourcePackage.sources[0].title&&await page.locator('#chapterSourcesDialog img, #chapterSourcesDialog script').count()===0);
 check('publication day keeps original precision',await page.locator('.chapter-source-item').first().locator('time').first().getAttribute('datetime')==='2026-10-22');
 const unknown=page.locator('.chapter-source-item').nth(1);
 check('read time is separate and never fills missing publication date',await unknown.locator('time').count()===1&&(await unknown.innerText()).includes('发布日期未注明')&&(await unknown.locator('time').textContent()).startsWith('查阅：'));
 await shot('sources');
 const [popup]=await Promise.all([context.waitForEvent('page'),page.locator('.chapter-source-link').first().click()]);await popup.waitForLoadState('domcontentloaded');
 check('actual original-link click opens its exact URL',popup.url()==='https://www.nasa.gov/news/'&&await page.locator('.chapter-source-link').first().getAttribute('rel')==='noopener noreferrer');await popup.close();
 await page.clock.install();await page.clock.fastForward(35000);check('source sheet does not poll',calls.length===1);await page.clock.resume();
 await page.setViewportSize({width:402,height:714});await shot('sources-short');
 check('short iPhone viewport keeps close and content within width',await page.locator('#chapterSourcesDialog').evaluate(e=>e.getBoundingClientRect().left>=0&&e.getBoundingClientRect().right<=innerWidth&&e.scrollWidth<=e.clientWidth+1)&&await page.locator('#chapterSourcesDialog .sheet-close').isVisible());
 await close();check('closing preserves reading position',Math.abs(await page.locator('#readingScroll').evaluate(e=>e.scrollTop)-before)<2);await page.setViewportSize({width:402,height:874});
 sourceMode='error';await page.locator('#chapterSourcesButton').click();await page.locator('#chapterSourcesRetry').waitFor({state:'visible'});check('server failure is visible and offers explicit retry',(await page.locator('#chapterSourcesStatus').innerText()).includes('暂不可核对'));sourceMode='normal';await page.locator('#chapterSourcesRetry').click();await page.locator('.chapter-source-item').first().waitFor();await close();
 sourceMode='mismatch';await page.locator('#chapterSourcesButton').click();await page.locator('#chapterSourcesRetry').waitFor({state:'visible'});check('mismatched revision is not presented',await page.locator('.chapter-source-item').count()===0&&(await page.locator('#chapterSourcesStatus').innerText()).includes('版本不一致'));await close();
 sourceMode='unsafe';await open();check('unsafe source URL is never clickable',await page.locator('.chapter-source-item').first().locator('a').count()===0);await close();
 sourceMode='hold';await page.locator('#chapterSourcesButton').click();await page.locator('#chapterSourcesStatus').getByText('正在读取本章现实参考…').waitFor();await new Promise(resolve=>setTimeout(resolve,25));await close();releaseSource();await page.waitForTimeout(60);check('closed sheet ignores late responses',await page.locator('.chapter-source-item').count()===0);sourceMode='normal';
 await page.locator('#chapterJump').click();await shot('chapter-book');await page.locator('#calendarDialog .sheet-close').click();await page.locator('#settingsButton').click();await shot('settings');await page.locator('#settingsDialog .sheet-close').click();
 for(const value of ['no-source','demo','login','empty']){scenario=value;await page.goto('https://chapter-sources.test/');if(value==='login'){await page.locator('#loginState').waitFor({state:'visible'});await shot('login');}else if(value==='empty'){await page.locator('#emptyState').waitFor({state:'visible'});await shot('empty');}else{await page.locator('#reader').waitFor({state:'visible'});await page.locator('[data-part=three]').click();check(value+' has no sources entry',await page.locator('#chapterSourcesButton').isHidden());}}
 check('no JavaScript errors',errors.length===0);
 await writeFile(resolve(out,'results.json'),JSON.stringify({checks,errors,screens,liveRequests:0,paidCalls:0,target:'402×874 and 402×714 Chromium mobile touch with iPhone safe-area simulation; not physical iPhone or iOS Safari',fixture:'Self-written new chapter and source metadata; no production or archived chapter content.'},null,2));
 console.log(JSON.stringify({checks:checks.length,errors,liveRequests:0,paidCalls:0,output:out}));
}catch(error){await page.screenshot({path:resolve(out,'failure.png'),scale:'css'}).catch(()=>{});await writeFile(resolve(out,'failure.json'),JSON.stringify({error:error.message,checks,errors},null,2));throw error;}
finally{await browser.close();}

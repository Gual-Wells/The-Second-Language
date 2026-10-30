import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import path from 'node:path';
import {assembleTeachingCollection} from './lib/teaching-authoring.mjs';

// Every request is intercepted. This fixture does not publish a course, send a
// question to a model, obtain news or generate paid audio.
const {chromium}=createRequire(process.execPath)('playwright');
const out=path.resolve('.cache/article-collection-ui');await mkdir(path.join(out,'tmp'),{recursive:true});process.env.TEMP=process.env.TMP=path.join(out,'tmp');
const words=Array.from({length:50},(_,i)=>{
  const n=String(i+1).padStart(3,'0'),word='fixture'+n,id='W'+n,u='U'+n;
  return{text:word,wordId:id,partOne:`<!-- WORD:${id} -->\n# ${word}\n\n**词源**：独立界面测试材料。\n\n<!-- USE:${u} -->\n## ${word} · 样例义 /test/\n\`仅为隔离界面验证。\``,partTwo:`<!-- WORD:${id} -->\n# ${word}\n\n<!-- EXAMPLE:${u} -->\nThis example uses ${word} only to check an isolated interface.\n\`本句仅用于隔离验证。\``};
});
const article=(id,title,indices,url)=>({id,title,sourceUrls:[url],paragraphs:indices.map(i=>[{id:'S'+String(i).padStart(3,'0'),uses:['U'+String(i).padStart(3,'0')],text:`This self-written fixture paragraph ${i} checks a reader interface without reporting any real event or asking for an external service.`,translation:`第${i}段是隔离验证材料，不是实际报道或正式课程。`}])});
const articles=[article('A03','An independent third topic',Array.from({length:20},(_,i)=>50-i),'https://example.org/third'),article('A01','A second independent topic',Array.from({length:15},(_,i)=>15-i),'https://example.org/second'),article('A02','A final independent topic',Array.from({length:15},(_,i)=>30-i),'https://example.org/final')];
const {markdown}=assembleTeachingCollection(words,articles,{expectedWordCount:50});
const sha=s=>createHash('sha256').update(s).digest('hex');
const chapter={id:'2026-10-24',date:'2026-10-24',number:'第 1 章',title:'隔离多篇阅读验证',subtitle:'非正式课程',wordCount:50,markdown,digest:sha(markdown),sourcePolicy:'current-affairs-v1',sourceDigest:sha('isolated collection sources')};
await writeFile(path.join(out,'fixture-chapter.json'),JSON.stringify(chapter));
const sourcePackage={schemaVersion:1,chapterDigest:chapter.digest,context:'This is a self-written interface fixture, not news.',articles:articles.map(({id,title,sourceUrls})=>({id,title,sourceUrls})),sources:articles.map((a,i)=>({sourceId:'fixture',publisher:'Fixture agency',title:'Source '+(i+1),url:a.sourceUrls[0],readAt:'2026-10-24T00:00:00Z',facts:['Self-written fixture fact.']}))};
const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_EXECUTABLE||'C:/Users/huawei/AppData/Local/ms-playwright/chromium-1223/chrome-win64/chrome.exe'});
const context=await browser.newContext({viewport:{width:402,height:874},deviceScaleFactor:3,isMobile:true,hasTouch:true,serviceWorkers:'block'}),page=await context.newPage();
const errors=[],questions=[],sound=[],checks=[];page.on('pageerror',e=>errors.push(e.message));
await context.route('**/*',async route=>{
  const request=route.request(),url=new URL(request.url()),p=url.pathname;
  assert.equal(url.hostname,'article-collection.test','All external requests are blocked');
  if(p.startsWith('/api/')||p.startsWith('/auth/')){
    if(p==='/api/questions'&&request.method()==='POST'){
      const body=request.postDataJSON();questions.push(body);return route.fulfill({json:{ok:true,id:body.id,threadId:'fixture-thread'}});
    }
    if(p.includes('/pronunciation')){sound.push(request.postDataJSON());return route.fulfill({status:503,json:{error:'Fixture: no paid audio'}});}
    const data=p==='/api/session'?{authenticated:true,demo:false}:p==='/api/chapters'?{chapters:[chapter]}:p.endsWith('/sources')?{chapterId:chapter.id,chapterDigest:chapter.digest,sourcePolicy:chapter.sourcePolicy,sourceDigest:chapter.sourceDigest,sourcePackage}:p===`/api/chapters/${chapter.id}`?chapter:p==='/auth/status'?{enrolled:true,enrollmentOpen:false}:p==='/api/questions/summary'?{threads:[]}:p==='/api/temporary'?{pages:[]}:p==='/api/settings'?{goal:'',restRequested:false,temporaryRequested:false}:{};
    return route.fulfill({json:data});
  }
  const name=p==='/'?'index.html':p.slice(1),type={html:'text/html',js:'text/javascript',css:'text/css',svg:'image/svg+xml'}[name.split('.').at(-1)]||'application/octet-stream';
  try{return route.fulfill({body:await readFile(path.resolve('web',name)),contentType:type});}catch{return route.fulfill({status:404,body:''});}
});
const check=(name,value)=>{assert(value,name);checks.push(name);};
const shot=async name=>page.screenshot({path:path.join(out,name+'.png'),scale:'css'});
try{
  await page.goto('https://article-collection.test/');await page.locator('#reader').waitFor({state:'visible'});
  await page.locator('[data-part=three]').click();
  check('three articles render in author order',JSON.stringify(await page.locator('.story-article').evaluateAll(nodes=>nodes.map(n=>n.dataset.articleId)))===JSON.stringify(['A03','A01','A02']));
  check('all fifty out-of-order sentences render',await page.locator('.story-sentence').count()===50);
  check('original index becomes article navigation',await page.locator('#wordIndexButton').textContent()==='篇目');await shot('collection-start');
  await page.locator('#wordIndexButton').click();check('article index is searchable',await page.locator('#indexTitle').textContent()==='选读篇目');
  await page.locator('#indexFilter').fill('second');check('article filter matches title',await page.locator('#indexList button').count()===1);
  await page.locator('#indexList button').click();await page.locator('.reader-jump-cover').waitFor({state:'hidden'});
  const point=await page.locator('#story-article-A01').boundingBox(),panel=await page.locator('#readingScroll').boundingBox();
  check('article index reveals selected article',point.y>=panel.y&&point.y<panel.y+100);await shot('article-jump');
  const before=await page.locator('#readingScroll').evaluate(e=>e.scrollTop);
  await page.locator('#translationButton').click();check('translations include every article',await page.locator('.story-translation:visible').count()===50);
  check('marked-use control is removed while real-use identities remain',await page.locator('#highlightButton').count()===0&&await page.locator('.story-sentence.linked-use').count()===50);
  await page.locator('#translationButton').click();
  await page.locator('[data-part=one]').click();await page.locator('[data-part=three]').click();
  await page.waitForTimeout(80);check('part switching restores article reading location',Math.abs(await page.locator('#readingScroll').evaluate(e=>e.scrollTop)-before)<4);

  const focus=await page.evaluate(async()=>{const m=await import('/reader-focus.js?v=47');const sentence=document.querySelector('#story-article-A01 .story-sentence');const f=m.readerFocus(sentence);return{focus:f,question:m.focusQuestion(f)};});
  check('question focus identifies exact article and original sentence',focus.focus.articleTitle==='A second independent topic'&&focus.focus.sentenceId==='S015'&&focus.question.includes('S015'));
  check('sentence retains its use identity without a removed navigation action',await page.locator('#story-article-A01 .story-sentence').first().getAttribute('data-use-refs')==='U015'&&await page.locator('#story-article-A01 .story-sentence').first().getAttribute('role')===null);
  await page.locator('#chapterSourcesButton').click();await page.locator('#chapterSourcesArticle').waitFor();
  check('all sources initially available',await page.locator('.chapter-source-item').count()===3);
  await page.locator('#chapterSourcesArticle').selectOption('A01');check('article source filter shows only corresponding actual source',await page.locator('.chapter-source-item').count()===1&&await page.locator('.chapter-source-item a').getAttribute('href')==='https://example.org/second');await shot('article-sources');
  await page.locator('#chapterSourcesDialog .sheet-close').click();
  check('no unsolicited model or sound calls',questions.length===0&&sound.length===0);
  const held=page.locator('#story-article-A01 .story-sentence').first();await held.scrollIntoViewIfNeeded();await page.waitForTimeout(120);const box=await held.boundingBox();
  await page.mouse.move(box.x+12,box.y+10);await page.mouse.down();await page.waitForTimeout(720);await page.mouse.up();await page.waitForTimeout(150);
  check('actual hold submits the article and exact sentence with fixed chapter identity',questions.length===1&&questions[0].question.includes('A second independent topic')&&questions[0].question.includes('S015')&&questions[0].digest===chapter.digest);
  check('hold does not also play audio',sound.length===0);
  check('no horizontal overflow',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  assert.deepEqual(errors,[]);await writeFile(path.join(out,'result.json'),JSON.stringify({checks,errors,fixture:true,viewport:'402x874',productionWrites:0,paidCalls:0},null,2));
  console.log(JSON.stringify({ok:true,checks:checks.length,screenshots:out,noProductionCalls:true}));
}catch(error){await shot('failure');await writeFile(path.join(out,'failure.json'),JSON.stringify({error:error.message,errors,status:await page.locator('#chapterSourcesStatus').textContent(),dialogs:await page.locator('dialog[open]').evaluateAll(nodes=>nodes.map(n=>n.id)),body:await page.locator('#chapterSourcesDialog').textContent()},null,2));throw error;}finally{await browser.close();}

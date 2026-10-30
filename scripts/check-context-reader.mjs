import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir,realpath} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import path from 'node:path';
import {validateAnnotatedContent} from '../web/annotations.js';
import {isChapterAudioRequest} from '../web/audio-plan.js';
import {qualityPolicy} from '../protocol/chapter-quality-contract.mjs';
import {parseTeachingHeading} from '../web/teaching-units.js';

// Real reader and browser; every API, source link and paid request is isolated.
const root=await realpath(process.cwd());
if(process.platform==='win32'&&!/^D:[\\/]/i.test(root))throw Error('界面核验资料须实际存D盘');
const out=path.resolve('.cache/context-reader'),temporary=path.join(out,'tmp');
await mkdir(temporary,{recursive:true});process.env.TEMP=temporary;process.env.TMP=temporary;
const {chromium}=createRequire(process.execPath)('playwright');
const sha=text=>createHash('sha256').update(text).digest('hex');
const lines=['<!-- FORMAT:usage-context-v1 -->'];
const secret='整份译文甲：第一段。\n\n第二段包含 <img src=x onerror=alert(1)> 字样。';
for(let i=1;i<=50;i++){
  const n=String(i).padStart(3,'0'),use='U'+n+'01',word='W'+n;
  const heading=i===5?`fixture${n} · 旧版释义 /test/`:i===4?`fixture${n} /test/ n.; fixtures${n} /tests/ n. · 同一用途的不同形式`:i===6?`fixture${n} /test/ n.`:`fixture${n} /test/ n. · 快捷识别记录`;
  lines.push(`<!-- WORD:${word} -->\n# fixture${n}\n\n**词源**：独立自写界面材料。\n\n<!-- USE:${use} -->\n## ${heading}\n\`用于界面核对的用法。\`\n\n`);
  if(i===2){lines.push('<!-- CONTEXT_REF:C001 USE:U00201 -->');continue;}
  const refs=i===1?'U00101,U00201':use;
  const meta={title:i===1?'Working together':'A reading task',sourceUrls:i===3?['https://source.context-reader.test/item']:[],displayContext:'这是独立自写的界面核验材料。',...(i===1?{speakers:{S001:'Reader A',S001b:'Reader B'}}:{})};
  lines.push(`<!-- CONTEXT:C${n} USE:${refs} KIND:${i===3?'abridgment':'example'} -->\n<!-- CONTEXT_META:${JSON.stringify(meta)} -->`);
  lines.push(`<!-- SENTENCE:S${n} USE:${refs} -->\nA reader keeps a record and shares that **record** with a colleague.`);
  if(i===1)lines.push('\n<!-- SENTENCE:S001b -->\nThey compare the notes before making a choice.');
  lines.push(`<!-- TRANSLATION:C${n} -->\n${i===1?secret:'这位读者保留记录，并与同事分享记录。'}\n<!-- END_CONTEXT:C${n} -->`);
}
const markdown=lines.join('\n'),parsed=validateAnnotatedContent(markdown,{expectedWordCount:50});
assert.equal(parsed.contexts.length,49);assert.equal(parsed.format,'usage-context-v1');
assert.equal(parseTeachingHeading('integrate /a/ n./adj.').forms[0].partOfSpeech,'n. / adj.');
assert.equal(parseTeachingHeading('a /a/ n.; b /b/ n.').forms.length,2);
assert.equal(parseTeachingHeading('word /test/ nonsense'),null);
assert.equal(parseTeachingHeading('adapt /a/ v. · 适应新环境').quickGloss,'适应新环境');
assert.equal(parseTeachingHeading('a /a/ n.; b /b/ n. · 一组词形').forms.length,2);
assert.equal(parseTeachingHeading('a /a/ n.; b /b/ n. · 一组词形').quickGloss,'一组词形');
assert.equal(parseTeachingHeading('adapt /a/ v.').quickGloss,'');
assert.equal(parseTeachingHeading('adapt · 原有短义 /a/').definition,'原有短义');
assert.equal(parseTeachingHeading('adapt · 原有短义 /a/').quickGloss,'');
assert.equal(parseTeachingHeading('adapt /a/ v. · <bad>'),null);
const originalDigest=sha(markdown);
const chapter={id:'2026-10-27',date:'2026-10-27',number:'第 2 章',title:'语境阅读 · 隔离界面核验',subtitle:'自写材料，不是正式课程',wordCount:50,markdown,digest:originalDigest,sourcePolicy:'current-affairs-v1',sourceDigest:sha('source-fixture')};
const legacyMeta=JSON.parse(await readFile('chapters/history/2026-10-24/4cc6a2f9/meta.json','utf8'));
const legacyText=await readFile('chapters/history/2026-10-24/4cc6a2f9/chapter.md','utf8');
const legacy={...legacyMeta,id:legacyMeta.date,markdown:legacyText,digest:sha(legacyText)};
let readerUserId='isolated-reader-A';
let qualityComplete=false;
const points=[],questions=[],qualityRequests=[],checks=[],errors=[];
const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_EXECUTABLE||'C:/Users/huawei/AppData/Local/ms-playwright/chromium-1223/chrome-win64/chrome.exe'});
const context=await browser.newContext({viewport:{width:402,height:874},isMobile:true,hasTouch:true,serviceWorkers:'block'});
await context.addInitScript(()=>{try{localStorage.setItem('second-language-article-display-v1',JSON.stringify({'2026-10-27':{highlight:true,translations:false},old:{highlight:true,translations:true}}));}catch{}});
context.on('page',page=>page.on('pageerror',error=>errors.push(error.message)));
await context.route('**/*',async route=>{
  const request=route.request(),url=new URL(request.url()),p=url.pathname;
  if(url.hostname!=='context-reader.test')return route.abort();
  if(p.startsWith('/api/')||p.startsWith('/auth/')){
    let body={};
    if(p==='/api/session')body={authenticated:true,demo:false,readerUserId};
    else if(p==='/api/chapters')body={chapters:[legacy,chapter]};
    else if(p.startsWith('/api/chapters/')&&p.endsWith('/sources'))body={chapterId:chapter.id,chapterDigest:chapter.digest,sourcePolicy:chapter.sourcePolicy,sourceDigest:chapter.sourceDigest,sourcePackage:{chapterDigest:chapter.digest,context:'独立自写来源包，不是事实证据。',sources:[{url:'https://source.context-reader.test/item',title:'Self-written source fixture',publisher:'Fixture publisher',readAt:'2026-10-27T00:00:00Z',facts:['Only a safe interface fixture.']}]}};
    else if(p.startsWith('/api/chapters/')){assert.equal(request.headers()['x-reader-layout'],'3');body=p.includes(legacy.id)?legacy:chapter;}
    else if(p==='/api/temporary')body={pages:[]};
    else if(p==='/api/questions/summary')body={threads:[]};
    else if(p==='/api/questions'&&request.method()==='POST'){questions.push(request.postDataJSON());body={id:questions.at(-1).id};}
    else if(p==='/api/chapter-quality/capabilities')body={policy:qualityPolicy.id};
    else if(p==='/api/chapter-quality'&&request.method()==='POST'){qualityRequests.push(request.postDataJSON());body={id:'quality-fixture'};}
    else if(p==='/api/chapter-quality')body={requests:qualityComplete?[{id:'quality-fixture',digest:chapter.digest,status:'completed',decision:'revision_required',createdAt:Date.now()}]:[]};
    else if(p==='/api/chapter-quality/quality-fixture')body={request:{id:'quality-fixture',status:qualityComplete?'completed':'pending'}};
    else if(p==='/api/chapter-quality/quality-fixture/report')body={chapter:{id:chapter.id,digest:chapter.digest,title:chapter.title},decision:'revision_required',coverage:{completed:1,expected:1,words:50},words:[{id:'W003',text:'fixture003'}],locations:{'context-source:C003':{part:'one',contextId:'C003'}},findings:[{targetId:'context-source:C003',severity:'suggestion',quote:'Only a location fixture.',explanation:'仅核对语境定位，未执行语义质检。',action:'跳转到第三份语境。'}],checks:[],limitations:['独立自写界面样例。']};
    else if(p==='/api/practice/pronunciation'){points.push(request.postDataJSON());body={id:'a'.repeat(64),state:'failed'};}
    else if(p==='/api/audio-config')body={next:['two'],supportedParts:['contexts'],revision:1,jobs:[]};
    else if(p==='/api/audio-config/estimate'){const old=request.postDataJSON().chapterId===legacy.id;body={availableParts:old?['two','three']:['contexts'],estimates:(old?['two','three']:['contexts']).map(part=>({part,cost:[0,0]}))};}
    else if(p==='/api/practice')body={sets:[]};
    return route.fulfill({json:body});
  }
  try{const name=p==='/'?'index.html':p.slice(1),types={html:'text/html',js:'text/javascript',css:'text/css',svg:'image/svg+xml',png:'image/png',webmanifest:'application/manifest+json'};return route.fulfill({body:await readFile(path.join('web',name)),contentType:types[name.split('.').at(-1)]||'application/octet-stream'});}catch{return route.fulfill({status:404,body:''});}
});
const page=await context.newPage();
const check=(name,value)=>{assert.ok(value,name);checks.push(name);};
const open=async()=>{await page.goto('https://context-reader.test/?chapter='+chapter.id);await page.locator('#article .usage-context').first().waitFor();};
const copy=()=>page.evaluate(()=>{const selection=getSelection(),range=document.createRange();range.selectNodeContents(document.getElementById('article'));selection.removeAllRanges();selection.addRange(range);const text=selection.toString();selection.removeAllRanges();return text;});
const shared=()=>page.locator('.context-translation[data-context-id="C001"]');
const click=async locator=>{await locator.scrollIntoViewIfNeeded();await page.waitForTimeout(120);await locator.click();await page.waitForTimeout(380);};
const shot=async name=>{await page.screenshot({path:path.join(out,name+'.png'),scale:'css'});check(name+' has no horizontal overflow',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));};
const hold=async locator=>{await locator.scrollIntoViewIfNeeded();await page.waitForTimeout(100);const box=await locator.evaluate(e=>{const range=document.createRange();range.selectNodeContents(e);const r=range.getClientRects()[0]||e.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height};});await page.mouse.move(box.x+Math.min(12,box.width/2),box.y+box.height/2);await page.mouse.down();await page.waitForTimeout(720);await page.mouse.up();await page.waitForTimeout(100);};
try{
  await open();
  check('new format is one reader stream',await page.locator('#app').evaluate(e=>e.classList.contains('context-mode'))&&await page.locator('.toolbar').isHidden());
  check('contexts have one translation each, never sentence translations',await page.locator('.context-translation').count()===50&&await page.locator('.story-translation').count()===0);
  check('shared context repeats with the same identity',await shared().count()===2);
  check('all contexts default masked',await page.locator('.translation-revealed').count()===0);
  check('hidden translations do not enter copied text',!(await copy()).includes('整份译文甲'));
  const accessible=await shared().first().ariaSnapshot();
  check('hidden translations do not enter accessibility names',!accessible.includes('整份译文甲')&&accessible.includes('译文'));
  check('speaker labels are outside actual spoken sentences',await page.locator('.context-speaker').first().innerText()==='Reader A：'&&!(await page.locator('.context-sentence').first().innerText()).includes('Reader A'));
  const hiddenHeight=await shared().first().evaluate(e=>e.getBoundingClientRect().height);
  await shot('masked');await click(shared().first());
  check('shared translation states update together',await page.locator('.context-translation[data-context-id="C001"].translation-revealed').count()===2);
  check('reveal preserves allocated block height',Math.abs(await shared().first().evaluate(e=>e.getBoundingClientRect().height)-hiddenHeight)<=1);
  check('revealed translation is copyable',(await copy()).includes('整份译文甲'));
  check('translation renders unsafe markup as text',await page.locator('.context-translation img').count()===0);
  await shot('revealed');await open();
  check('revealed preference persists across reload',await shared().first().getAttribute('aria-expanded')==='true');
  await click(shared().first());await open();check('hidden preference persists across reload',await shared().first().getAttribute('aria-expanded')==='false');
  await click(shared().first());readerUserId='isolated-reader-B';await open();check('another user never inherits revealed translations',await shared().first().getAttribute('aria-expanded')==='false');
  readerUserId='isolated-reader-A';chapter.markdown=markdown+'\n';chapter.digest=sha(chapter.markdown);await open();check('another digest never inherits revealed translations',await shared().first().getAttribute('aria-expanded')==='false');
  chapter.markdown=markdown;chapter.digest=originalDigest;await open();check('original user and version recover their own preference',await shared().first().getAttribute('aria-expanded')==='true');
  let count=points.length;await click(page.locator('.word-heading h1').first());await click(page.locator('.fused-explanation').first());await click(page.locator('.sense-quick-gloss').first());check('titles, quick glosses and definitions remain silent',points.length===count);
  const sentence=page.locator('.context-sentence').first(),sentenceText=await sentence.innerText();await click(sentence);
  check('context tap submits only the complete English sentence',points.length===count+1&&points.at(-1).text===sentenceText&&points.at(-1).kind==='sentence'&&points.at(-1).digest===chapter.digest);
  check('shared server audio contract accepts rendered English only',isChapterAudioRequest(markdown,sentenceText,'sentence')&&!isChapterAudioRequest(markdown,secret,'sentence'));
  count=points.length;await click(shared().first());check('translation toggle does not pronounce or submit a question',points.length===count&&questions.length===0);
  await hold(sentence);check('sentence hold carries complete English context and stable identity',questions.length===1&&questions[0].question.includes('C001')&&questions[0].question.includes('S001')&&questions[0].question.includes('They compare the notes')&&points.length===count);
  check('questions carry no hidden translation text',!questions[0].question.includes('整份译文甲'));
  await sentence.scrollIntoViewIfNeeded();await page.waitForTimeout(100);const wordBox=await sentence.locator('strong').boundingBox();
  await page.touchscreen.tap(wordBox.x+wordBox.width/2,wordBox.y+wordBox.height/2);await page.touchscreen.tap(wordBox.x+wordBox.width/2,wordBox.y+wordBox.height/2);await page.waitForTimeout(400);
  check('context word double-tap resolves its actual repeated occurrence',questions.length===2&&questions.at(-1).question.includes('第 2 处「record」')&&points.length===count&&!await page.locator('#app').evaluate(e=>e.classList.contains('pure-reading')));
  await page.locator('.word-heading h1').first().scrollIntoViewIfNeeded();await page.waitForTimeout(100);
  await page.locator('.word-heading h1').first().dblclick({delay:80});await page.waitForTimeout(100);
  check('pure reader still enters',await page.locator('#app').evaluate(e=>e.classList.contains('pure-reading')));
  await shot('pure');await page.locator('.word-heading h1').first().dblclick({delay:80});await page.waitForTimeout(100);
  check('pure reader still exits',!await page.locator('#app').evaluate(e=>e.classList.contains('pure-reading')));
  const geometry=()=>page.evaluate(()=>{const scope=document.getElementById('readingScroll'),article=document.getElementById('article');return{scroll:scope.scrollTop,max:scope.scrollHeight-scope.clientHeight,origin:article.getBoundingClientRect().top+scope.scrollTop};});
  const toggle=()=>page.evaluate(async()=>{const target=document.getElementById('article');for(let i=0;i<2;i++){target.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,isPrimary:true,button:0,pointerId:1,clientX:20,clientY:400}));target.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,isPrimary:true,button:0,pointerId:1,clientX:20,clientY:400}));target.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,detail:1,clientX:20,clientY:400}));}await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));});
  const max=(await geometry()).max;
  for(const y of [0,300,1000,max-150,max]){
    await page.locator('#readingScroll').evaluate((e,y)=>e.scrollTop=y,y);
    for(let n=0;n<2;n++){const a=await geometry();await toggle();const b=await geometry(),wanted=a.scroll+b.origin-a.origin,expected=Math.max(0,Math.min(b.max,wanted));assert(Math.abs(b.scroll-expected)<=1,'new reader preserves native bounded pure-mode coordinates');}
  }
  checks.push('new pure-mode coordinates preserve interior and native scroll boundaries');
  check('marked-use controls and source/hint chrome are absent',await page.locator('#highlightButton,#usageDialog,.context-source,.context-kind,.context-introduction,.context-translation-hint').count()===0);
  check('old highlight preference is removed without removing translations',await page.evaluate(()=>{const p=JSON.parse(localStorage.getItem('second-language-article-display-v1'));return Object.values(p).every(row=>!Object.hasOwn(row,'highlight'))&&p.old.translations===true;}));
  check('POS follows each corresponding IPA',await page.locator('.sense-pos').first().innerText()==='n.'&&await page.locator('[data-use-id="U00401"] .sense-form').count()===2);
  check('quick gloss follows the final POS within its heading',await page.locator('[data-use-id="U00101"] h2').evaluate(e=>{const p=e.querySelector('.sense-pos'),g=e.querySelector('.sense-quick-gloss');return g?.textContent==='快捷识别记录'&&Boolean(p.compareDocumentPosition(g)&Node.DOCUMENT_POSITION_FOLLOWING)&&g.parentElement===e;}));
  check('multi-form use has one quick gloss after both form categories',await page.locator('[data-use-id="U00401"] h2').evaluate(e=>e.querySelectorAll('.sense-form').length===2&&e.querySelectorAll('.sense-quick-gloss').length===1&&e.lastElementChild.classList.contains('sense-quick-gloss')));
  check('previous modern heading without quick gloss remains readable',await page.locator('[data-use-id="U00601"] .fused-explanation').count()===1&&await page.locator('[data-use-id="U00601"] .sense-quick-gloss').count()===0);
  check('new explanation has one ordinary paragraph and no extra short gloss',await page.locator('[data-use-id="U00101"] .fused-explanation').count()===1&&await page.locator('[data-use-id="U00101"] .sense-definition').count()===0);
  check('legacy heading retains its own original short gloss',await page.locator('[data-use-id="U00501"] .sense-definition').innerText()==='旧版释义');
  check('translation has no native tooltip',await shared().first().getAttribute('title')===null);
  count=points.length;await click(page.locator('.context-sentence').first());
  check('stale highlight cannot intercept normal sentence audio',points.length===count+1&&await page.locator('#article').evaluate(e=>!e.classList.contains('highlight-sentences')));
  const questionCount=questions.length;await hold(page.locator('.sense-head h2').first());
  check('POS and quick-gloss heading long-press targets the real vocabulary',questions.length===questionCount+1&&questions.at(-1).question.includes('fixture001')&&questions.at(-1).question.includes('/test/ n.')&&questions.at(-1).question.includes('快捷识别记录'));
  await page.locator('#wordIndexButton').click();await page.locator('.index-item').nth(20).click();await page.locator('.reader-jump-cover').waitFor({state:'hidden'});
  check('word index clears sticky toolbar',await page.locator('.word-entry').nth(20).evaluate(e=>{const b=document.getElementById('readingScroll').getBoundingClientRect(),h=document.getElementById('articleTools').getBoundingClientRect().height;return Math.abs(e.getBoundingClientRect().top-b.top-h-12)<=1;}));
  await click(page.locator('#chapterSourcesButton'));await page.locator('#chapterSourcesDialog[open]').waitFor();check('source evidence remains available outside the learning unit',await page.locator('#chapterSourcesDialog').innerText().then(t=>t.includes('Fixture publisher')));await page.locator('[data-close="chapterSourcesDialog"]').click();
  await page.locator('#chapterQualityButton').click();await page.locator('#chapterQualityApply').waitFor({state:'visible'});await page.waitForFunction(()=>!document.getElementById('chapterQualityApply').disabled);await page.locator('#chapterQualityApply').click();await page.locator('#chapterQualityStatus').getByText('等待质检',{exact:true}).waitFor();
  check('new quality request uses advertised context policy',qualityRequests.length===1&&qualityRequests[0].policy===qualityPolicy.id);await page.locator('[data-close="chapterQualityDialog"]').click();
  qualityComplete=true;await page.locator('#chapterQualityButton').click();await page.locator('#chapterQualityBody .chapter-test-record').click();await page.locator('.quality-finding button').click();await page.waitForFunction(()=>{const e=document.querySelector('#article .usage-context[data-context-id="C003"]'),scope=document.getElementById('readingScroll'),tools=document.getElementById('articleTools');return e&&scope&&tools&&Math.abs(e.getBoundingClientRect().top-scope.getBoundingClientRect().top-tools.getBoundingClientRect().height-12)<=1;});await page.locator('.reader-jump-cover').waitFor({state:'hidden'});
  check('context-level quality finding locates its frozen context',await page.locator('.usage-context[data-context-id="C003"]').evaluate(e=>{const scope=document.getElementById('readingScroll').getBoundingClientRect(),h=document.getElementById('articleTools').getBoundingClientRect().height;return Math.abs(e.getBoundingClientRect().top-scope.top-h-12)<=1;}));
  await page.locator('#settingsButton').click();await page.locator('.settings-row').getByText('音频配置',{exact:true}).click();await page.locator('#audioNextChoice').click();await page.waitForFunction(()=>!document.getElementById('audioSave').disabled);
  check('new next chapter shows only context audio scope',await page.locator('#audioPart-contexts').isVisible()&&await page.locator('#audioPart-two').isHidden()&&!await page.locator('#audioPart-contexts').isChecked());
  check('old next scope is not silently converted',await page.locator('#audioConfigStatus').innerText().then(t=>t.includes('重新选择')));
  await page.locator('#audioConfigBack').click();await page.locator('#audioExistingChoice').click();await page.waitForFunction(()=>!document.getElementById('audioSave').disabled);await page.locator('#audioChapter').selectOption(legacy.id);await page.waitForFunction(()=>!document.getElementById('audioPart-two').closest('label').hidden);
  check('old chapter keeps original audio scope',await page.locator('#audioPart-two').isVisible()&&await page.locator('#audioPart-three').isVisible()&&await page.locator('#audioPart-contexts').isHidden());
  await page.locator('#audioChapter').selectOption(chapter.id);await page.waitForFunction(()=>!document.getElementById('audioPart-contexts').closest('label').hidden);check('new chapter audio estimate restores context-only scope',await page.locator('#audioPart-two').isHidden()&&await page.locator('#audioPart-contexts').isVisible());
  await page.locator('[data-close="settingsDialog"]').click();
  await page.setViewportSize({width:320,height:620});await shot('narrow');await page.setViewportSize({width:402,height:874});
  await page.goto('https://context-reader.test/?chapter='+legacy.id);await page.locator('.word-entry').first().waitFor();
  check('old formal chapter retains three-part controls',!await page.locator('#app').evaluate(e=>e.classList.contains('context-mode'))&&await page.locator('[data-part="two"]').isVisible());
  await page.locator('[data-part="three"]').click();check('old story sentence rendering remains',await page.locator('.story-sentence').count()>0&&await page.locator('#translationButton').isVisible());
  readerUserId='synchronized-reader';const twins=await Promise.all([context.newPage(),context.newPage()]);await Promise.all(twins.map(tab=>tab.goto('https://context-reader.test/?chapter='+chapter.id)));await Promise.all(twins.map(tab=>tab.locator('.context-translation').first().waitFor()));await twins[0].locator('.context-translation').first().click();await twins[1].waitForFunction(()=>document.querySelector('.context-translation').getAttribute('aria-expanded')==='true');await twins[1].locator('.context-translation').first().click();await twins[0].waitForFunction(()=>document.querySelector('.context-translation').getAttribute('aria-expanded')==='false');check('same-user tabs synchronize both reveal and hide',true);await Promise.all(twins.map(tab=>tab.close()));
  readerUserId=null;const anonymous=await context.newPage();await anonymous.goto('https://context-reader.test/?chapter='+chapter.id);const anonymousTranslation=anonymous.locator('.context-translation').first();await anonymousTranslation.waitFor();check('missing user identity defaults to masked',await anonymousTranslation.getAttribute('aria-expanded')==='false');await anonymousTranslation.click();check('missing user identity still supports local toggle',await anonymousTranslation.getAttribute('aria-expanded')==='true');await anonymous.reload();await anonymousTranslation.waitFor();check('missing user identity never persists across reload',await anonymousTranslation.getAttribute('aria-expanded')==='false');await anonymous.close();
  readerUserId='quota-isolated-reader';const quota=await context.newPage();await quota.addInitScript(()=>{Storage.prototype.setItem=function(){throw new DOMException('Isolated quota fixture','QuotaExceededError');};});await quota.goto('https://context-reader.test/?chapter='+chapter.id);const qt=quota.locator('.context-translation').first();await qt.waitFor();await qt.click();assert.equal(await qt.getAttribute('aria-expanded'),'true');await qt.click();check('storage quota failure leaves reversible memory-only translation controls',await qt.getAttribute('aria-expanded')==='false');await quota.close();
  check('no runtime page errors',errors.length===0);
  const result={format:'usage-context-v1',checks,errors,browser:'Chromium touch emulation, 402x874 and 320x620; not physical iOS Safari',paidCalls:0,liveApiCalls:0};
  await writeFile(path.join(out,'result.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
}catch(error){await page.screenshot({path:path.join(out,'failure.png'),scale:'css'});console.log(JSON.stringify({errors,checks,questions,points:points.length,toast:await page.locator('#toast').textContent(),url:page.url()}));throw error;}
finally{await browser.close();}

// Isolated format study, not a complete lesson or a production test suite.
// Run from the repo root with Node. Browser images and profiles stay on D:.
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createServer} from 'node:http';
import {createHash} from 'node:crypto';
import {validateAnnotatedContent} from '../web/annotations.js';
import {audioUnits,pointAudioKeys} from '../web/audio-plan.js';

const out=new URL('../.cache/etymology-protocol-study-2026-10-16/',import.meta.url);
await mkdir(out,{recursive:true});
const baseline=`<!-- PART:one -->
<!-- WORD:W001 -->
# cleave
<!-- USE:U001 -->
## cleave · 劈开 /kliːv/
\`劈开；裂开。\`
及物结构接被劈开的对象；不及物结构由裂开的物体作主语。文学用语。
<!-- USE:U002 -->
## cleave to · 坚守 /kliːv/
\`依恋；坚持。\`
接人、原则或信念等；注意正式或文学语境。
<!-- PART:two -->
<!-- WORD:W001 -->
# cleave
<!-- EXAMPLE:U001 -->
The worker cleaved the log in two.
\`工人把木头劈成了两半。\`
<!-- EXAMPLE:U002 -->
She cleaved to her principles.
\`她坚守自己的原则。\`
<!-- PART:three -->
<!-- SENTENCE:S001 USE:U001 -->
He cleaved a log for the fire.
\`他为生火劈开一块木头。\`
<!-- SENTENCE:S002 USE:U002 -->
His sister still cleaved to her principles.
\`他的姐姐依然坚守自己的原则。\`
`;
const etymology='**词源**：这里有两个来源不同、后来拼写相同的动词。“劈开”与古英语“分开”的动词有关；“黏附、坚守”来自另一支。不能把两支编成共同的演变故事。';
const etyOnly=baseline.replace('# cleave\n','# cleave\n\n'+etymology+'\n\n');
const fused=etyOnly.replace('`劈开；裂开。`','`劈开某物；某物因劈砍而裂开。`').replace('`依恋；坚持。`','`坚定地忠于某人或坚持某种信念。`');
const before=validateAnnotatedContent(baseline,{expectedWordCount:1});
const after=validateAnnotatedContent(fused,{expectedWordCount:1});
validateAnnotatedContent(etyOnly,{expectedWordCount:1});
assert.deepEqual(before.words,after.words);
assert.deepEqual([...before.uses],[...after.uses]);
assert.deepEqual(before.sentences,after.sentences);
assert.equal(before.parts.two,after.parts.two);
assert.equal(before.parts.three,after.parts.three);
assert.deepEqual(audioUnits(baseline),audioUnits(fused));
assert.deepEqual([...pointAudioKeys(baseline)],[...pointAudioKeys(fused)]);
const rejected={};
for(const [name,input] of Object.entries({missingSummary:fused.replace('`劈开某物；某物因劈砍而裂开。`\n',''),unsupportedMarker:fused.replace(etymology,'<!-- ETY:E001 -->\n'+etymology)})){
 let message=null;try{validateAnnotatedContent(input,{expectedWordCount:1});}catch(error){message=error.message;}
 assert.ok(message,`${name} should be rejected`);rejected[name]=message;
}
await writeFile(new URL('fixture.md',out),fused);
const renderer=await readFile(new URL('../web/render.js',import.meta.url));
const styles=await readFile(new URL('../web/styles.css',import.meta.url));
const html=`<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/styles.css"><title>词源结构研究夹具</title><body><main class="reader"><section class="article" id="target"></section></main><script type="module">import {renderPart} from '/render.js';window.renderStudy=(text)=>renderPart(text,'one',document.getElementById('target'));window.studyReady=true;</script></body></html>`;
const server=createServer((req,res)=>{
 const file=req.url==='/render.js'?renderer:req.url==='/styles.css'?styles:Buffer.from(html);
 res.setHeader('content-type',req.url==='/render.js'?'text/javascript; charset=utf-8':req.url==='/styles.css'?'text/css; charset=utf-8':'text/html; charset=utf-8');res.end(file);
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
let browser;
try{
 const {chromium}=await import('playwright').catch(()=>import('../.cache/browser-tools/package/index.mjs'));
 browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_EXECUTABLE||'C:/Users/huawei/AppData/Local/ms-playwright/chromium-1223/chrome-win64/chrome.exe'});
 const context=await browser.newContext({viewport:{width:402,height:874},isMobile:true,hasTouch:true,deviceScaleFactor:2,serviceWorkers:'block'});
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`http://127.0.0.1:${server.address().port}/`);await page.waitForFunction(()=>window.studyReady);
 await page.evaluate(part=>window.renderStudy(part),after.parts.one);
 const rendered=await page.evaluate(()=>{
  const root=document.getElementById('target'),word=root.querySelector('.word-entry'),ety=[...word.children].find(e=>e.tagName==='P'&&e.textContent.startsWith('词源'));
  return {wordCount:root.querySelectorAll('.word-entry').length,senseCount:root.querySelectorAll('.sense-block').length,etymologyAtWordLevel:!!ety&&ety.parentElement===word,etymologyBeforeFirstSense:!!ety&&!!(ety.compareDocumentPosition(word.querySelector('.sense-block'))&Node.DOCUMENT_POSITION_FOLLOWING),jumpUseIds:[...root.querySelectorAll('.sense-head[data-use-id]')].map(e=>e.dataset.useId),summaries:[...root.querySelectorAll('.mono')].map(e=>e.textContent),viewportWidth:innerWidth,documentWidth:document.documentElement.scrollWidth};
 });
 assert.equal(rendered.wordCount,1);assert.equal(rendered.senseCount,2);assert.ok(rendered.etymologyAtWordLevel&&rendered.etymologyBeforeFirstSense);assert.deepEqual(rendered.jumpUseIds,['U001','U002']);assert.equal(rendered.documentWidth,rendered.viewportWidth);assert.deepEqual(errors,[]);
 await page.screenshot({path:new URL('iphone-format-study.png',out).pathname.replace(/^\/([A-Za-z]:)/,'$1'),fullPage:true});
 const etymologyGeometry=await page.evaluate(()=>{
  const word=document.querySelector('.word-entry'),ety=word.querySelector(':scope > p'),sense=word.querySelector('.sense-block');
  return {paragraphInset:Math.round(ety.getBoundingClientRect().left-word.getBoundingClientRect().left),sensePadding:parseFloat(getComputedStyle(sense).paddingLeft)};
 });
 // A study-only candidate; the production stylesheet is not changed.
 await page.addStyleTag({content:`.article .word-entry > p { margin-left: ${etymologyGeometry.sensePadding}px; margin-right: ${etymologyGeometry.sensePadding}px; }`});
 const proposedLayout=await page.evaluate(()=>({paragraphInset:Math.round(document.querySelector('.word-entry > p').getBoundingClientRect().left-document.querySelector('.word-entry').getBoundingClientRect().left),documentWidth:document.documentElement.scrollWidth}));
 assert.ok(proposedLayout.paragraphInset>etymologyGeometry.paragraphInset);
 assert.equal(proposedLayout.documentWidth,rendered.viewportWidth);
 await page.screenshot({path:new URL('iphone-format-proposed.png',out).pathname.replace(/^\/([A-Za-z]:)/,'$1'),fullPage:true});
 const sha=buffer=>createHash('sha256').update(buffer).digest('hex');
 const result={checkedAt:new Date().toISOString(),scope:'Isolated two-usage fragment; not a complete source-conserving chapter or iOS Safari acceptance.',checks:{plainEtymologyAccepted:true,fusedSummaryStructurallyAccepted:true,wordUseAndSentenceIdsUnchanged:true,partsTwoThreeUnchanged:true,audioUnitsUnchanged:true,pointAudioKeysUnchanged:true},counts:{words:after.words.length,uses:after.uses.size,audioUnits:audioUnits(fused).length,uniqueAudioKeys:pointAudioKeys(fused).size},rejected,rendered,etymologyGeometry,proposedLayout,browserErrors:errors,inputs:{fixtureSha256:sha(fused),annotationSha256:sha(await readFile(new URL('../web/annotations.js',import.meta.url))),renderSha256:sha(renderer),audioPlanSha256:sha(await readFile(new URL('../web/audio-plan.js',import.meta.url))),stylesSha256:sha(styles)},paidCalls:0};
 await writeFile(new URL('etymology-and-unified-usage-compatibility-2026-10-16.json',import.meta.url),JSON.stringify(result,null,2)+'\n');
 console.log(JSON.stringify(result,null,2));
}finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}

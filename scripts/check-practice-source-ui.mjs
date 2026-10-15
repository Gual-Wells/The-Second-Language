import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const {chromium}=await import('playwright').catch(()=>import('../.cache/browser-tools/package/index.mjs'));
const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_EXECUTABLE||'C:/Users/huawei/AppData/Local/ms-playwright/chromium-1223/chrome-win64/chrome.exe'});
const page=await browser.newPage({viewport:{width:402,height:874},isMobile:true,hasTouch:true,serviceWorkers:'block'}),errors=[];
page.on('pageerror',e=>errors.push(e.message));
const bootstrap=`import {createPracticeUI} from '/practice.js';
const oldDigest='a'.repeat(64),newDigest='b'.repeat(64),chapter={id:'2026-10-02',date:'2026-10-02',title:'Revised chapter',digest:newDigest};
const set={id:'fixture',title:'Historical source fixture',introduction:'UI isolation only',focusChapterId:chapter.id,sources:[{id:chapter.id,digest:oldDigest}],profiles:{},attempts:[],questions:[{id:'fixture-question',position:0,kind:'writing',part:'writing-2',prompt:'Fixture question',guidance:'',referenceAnswer:'Fixture reference',referenceNotes:'',revealed:true,links:[{chapterId:chapter.id,useId:'U001'}]}]};
window.sourceCalls=[];const api=async p=>{if(p==='/api/practice')return{sets:[{...set,createdAt:Date.now()}],active:null};if(p.startsWith('/api/practice/index'))return{questions:[]};if(p==='/api/practice/sets/fixture')return set;throw Error('Unexpected API '+p);};
const ui=createPracticeUI({api,toast:message=>{throw Error(message);},showDialog:id=>document.getElementById(id).showModal(),getContext:()=>({authenticated:true,demo:false,chapters:[chapter],current:chapter}),openSource:(chapterId,useId,digest)=>window.sourceCalls.push({chapterId,useId,digest})});await ui.open();`;
await page.route('**/*',async route=>{const p=new URL(route.request().url()).pathname;if(p==='/bootstrap.js')return route.fulfill({body:bootstrap,contentType:'text/javascript'});const name=p==='/'?'index.html':p.slice(1);try{let data=await readFile('web/'+name);if(name==='index.html')data=Buffer.from(data.toString().replace(/\/app\.js\?v=\d+/,'/bootstrap.js'));await route.fulfill({body:data,contentType:name.endsWith('.js')?'text/javascript':name.endsWith('.css')?'text/css':'text/html'});}catch{await route.fulfill({status:404,body:''});}});
try{
 await page.goto('https://source-fixture.invalid/');await page.locator('#practiceList .practice-shelf-item').click();
 const sources=page.locator('#practice-fixture-question .practice-source-details');await sources.locator('summary').click();await sources.locator('button').click();
 assert.deepEqual(await page.evaluate(()=>window.sourceCalls),[{chapterId:'2026-10-02',useId:'U001',digest:'a'.repeat(64)}]);assert.deepEqual(errors,[]);
 console.log('通过：真实 iPhone 视口练习组件在章节已修订时仍把旧快照 digest 交给来源跳转，不使用当前版本；无真实 API 或模型调用。');
}finally{await browser.close();}

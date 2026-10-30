// Mature extractors only. A saved response is evidence of bytes, not of the
// correct article, factual accuracy, completeness or permission to republish.
import path from 'node:path';
import {readFileSync,realpathSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';

const require=createRequire(import.meta.url),helper=fileURLToPath(new URL('./extract-html.py',import.meta.url));
const runtime=JSON.parse(readFileSync(new URL('../../resources/current-affairs/extraction-runtime.json',import.meta.url),'utf8'));
const notice='Article candidate only: check the actual title/body, captions, footnotes, attachments and page role; extraction and metadata do not verify meaning or publication rights.';
function tools(){
 const home=process.env.SECOND_LANGUAGE_EXTRACTION_HOME||(process.platform==='win32'?runtime.defaultWindowsHome:null);
 const python=process.env.SECOND_LANGUAGE_EXTRACTION_PYTHON||(home?path.join(home,'.venv',process.platform==='win32'?'Scripts/python.exe':'bin/python'):process.env.SECOND_LANGUAGE_PYTHON);
 if(!python||!path.isAbsolute(python))throw Error('Configure SECOND_LANGUAGE_EXTRACTION_HOME or absolute SECOND_LANGUAGE_EXTRACTION_PYTHON; otherwise use codex-web/codex-pdf original text import.');
 try{if(process.platform==='win32')for(const file of [python,...(home?[home]:[])]){
   if(!/^D:[\\/]/i.test(file)||!/^D:[\\/]/i.test(realpathSync(file)))throw Error('Article extraction runtime and dependencies must physically reside on D:.');
  }}catch{throw Error('Configured article extraction runtime is unavailable or outside D:; verify SECOND_LANGUAGE_EXTRACTION_HOME/PYTHON or use original tool text import.');}
 return{home,python};
}
export function articleExtractionRoute(url){
 const host=new URL(url).hostname.toLowerCase().replace(/^www\./,'');
 // Verified templates: KFF's short radio companions include related-card text
 // in Trafilatura; CNRS loses introductions/notes in that route. No per-page
 // double extraction, merging, or "shorter is better" selection.
 return runtime.readabilityHosts.some(h=>host===h||host.endsWith('.'+h))?'readability':'trafilatura';
}
function readableArticle(bytes,url,encoding,home){
 if(!home)throw Error('Readability requires the configured SECOND_LANGUAGE_EXTRACTION_HOME; use original tool text import.');
 const modules=path.join(home,'node_modules'),readabilityPath=path.join(modules,'@mozilla/readability'),domPath=path.join(modules,'jsdom');
 const version=JSON.parse(readFileSync(path.join(readabilityPath,'package.json'),'utf8')).version;
 const domVersion=JSON.parse(readFileSync(path.join(domPath,'package.json'),'utf8')).version;
 if(version!==runtime.readability.version||domVersion!==runtime.jsdom.version)throw Error('Readability/jsdom differs from the verified pinned runtime; verify dependencies before use.');
 const {Readability}=require(readabilityPath),{JSDOM}=require(domPath);
 const dom=new JSDOM(bytes,{url,contentType:encoding?`text/html; charset=${encoding}`:'text/html'});
 try{
  const article=new Readability(dom.window.document,{keepClasses:false}).parse();
  if(!article)throw Error('Readability returned no article candidate; use original tool text import.');
  // Serialize only Readability's chosen subtree, preserving block boundaries.
  // JSDOM uses its defaults: no runScripts, resources or remote fetching.
  const fragment=dom.window.document.createElement('div');fragment.innerHTML=article.content;
  const blocks=new Set(['P','DIV','SECTION','ARTICLE','MAIN','H1','H2','H3','H4','H5','H6','LI','BLOCKQUOTE','PRE','TR','TD','TH','BR']);
  const pieces=[];const visit=node=>{if(node.nodeType===3){pieces.push(node.textContent);return;}if(node.nodeType!==1)return;if(['SCRIPT','STYLE','NOSCRIPT','TEMPLATE','IFRAME'].includes(node.tagName))return;const block=blocks.has(node.tagName);if(block)pieces.push('\n');for(const child of node.childNodes)visit(child);if(block)pieces.push('\n');};visit(fragment);
  return{text:pieces.join('').split(/\r?\n/).map(s=>s.replace(/[^\S\n]+/g,' ').trim()).filter(Boolean).join('\n'),extractionMethod:'mozilla-readability-template',extractionTool:{name:'@mozilla/readability',version,domVersion,profile:'verified-kff-cnrs-template'},readabilityTitle:article.title};
 }finally{dom.window.close();}
}
export function extractMatureHtml(html,url,encoding=null){
 const {home,python}=tools(),route=articleExtractionRoute(url),bytes=Buffer.isBuffer(html)?html:Buffer.from(html,'utf8');
 const result=spawnSync(python,[helper],{input:JSON.stringify({htmlBase64:bytes.toString('base64'),url,encoding,trafilaturaVersion:runtime.trafilatura.version,extractor:route==='readability'?'metadata':'trafilatura'}),encoding:'utf8',maxBuffer:8*1024*1024,timeout:30000,windowsHide:true,env:{...process.env,PYTHONIOENCODING:'utf-8',PYTHONDONTWRITEBYTECODE:'1'}});
 if(result.status!==0)throw Error('Mature HTML extraction unavailable or failed; verify configured Trafilatura 2.3.1 runtime or use codex-web/codex-pdf original text import. No legacy body fallback was used.');
 const data=JSON.parse(result.stdout.replace(/^\uFEFF/,''));
 if(route==='readability')Object.assign(data,readableArticle(bytes,url,encoding,home));
 if(typeof data.text!=='string'||data.text.trim().length<120||/^(access denied|just a moment|attention required|verify (?:you|that))/i.test(data.title||''))throw Error('No readable article candidate; authentication, challenge or script-only page may be present. Use original tool text import.');
 return {...data,warnings:[notice]};
}

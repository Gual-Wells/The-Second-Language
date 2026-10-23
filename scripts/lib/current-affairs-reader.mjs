// On-demand private research reader. No model calls, facts generation, VIX writes or publishing.
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash, randomUUID} from 'node:crypto';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';

export const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const digest = value => createHash('sha256').update(value).digest('hex');
const stamp = () => new Date().toISOString();
const host = value => new URL(value).hostname.toLowerCase().replace(/^www\./, '');
const readJson = async file => JSON.parse(await fs.readFile(file, 'utf8'));
async function maybeJson(file) {try {return await readJson(file);} catch(e) {if(e.code === 'ENOENT') return null; throw e;}}
async function exists(file) {try {await fs.stat(file);return true;} catch(e) {if(e.code === 'ENOENT') return false;throw e;}}
const samePath = (a,b) => process.platform==='win32' ? path.resolve(a).toLowerCase()===path.resolve(b).toLowerCase() : path.resolve(a)===path.resolve(b);
async function assertPrivateLocation(target) {
  target=path.resolve(target);
  if(process.platform==='win32' && !/^D:\\/i.test(target)) throw Error('Research path must reside on D:');
  let ancestor=target;
  while(!await exists(ancestor)) {const parent=path.dirname(ancestor);if(parent===ancestor) throw Error('Research path has no existing ancestor');ancestor=parent;}
  const physical=await fs.realpath(ancestor);
  if(process.platform==='win32' && !/^D:\\/i.test(physical)) throw Error('Research path physically resolves outside D:');
  if(!samePath(ancestor,physical)) throw Error('Research path redirects outside its own directory');
  return target;
}
async function privateJson(file) {await assertPrivateLocation(file);return maybeJson(file);}
async function ensurePrivateDirectory(directory) {
  await assertPrivateLocation(directory);
  await fs.mkdir(directory,{recursive:true});
  await assertPrivateLocation(directory);
}
async function atomicJson(file, value) {
  await ensurePrivateDirectory(path.dirname(file));
  await assertPrivateLocation(file);
  const temp = file + '.' + randomUUID() + '.tmp';
  try {await fs.writeFile(temp, JSON.stringify(value,null,2)+'\n', {flag:'wx'});await fs.rename(temp,file);}
  finally {await fs.unlink(temp).catch(e => {if(e.code !== 'ENOENT') throw e;});}
}
async function immutableJson(file, value) {
  await ensurePrivateDirectory(path.dirname(file));
  await assertPrivateLocation(file);
  await fs.writeFile(file, JSON.stringify(value,null,2)+'\n', {flag:'wx'});
}
export function assertDate(date) {
  if(!/^20\d{2}-\d{2}-\d{2}$/.test(date||'')) throw Error('Use a new-chapter research date YYYY-MM-DD');
  const value = new Date(date+'T00:00:00Z');
  if(!Number.isFinite(+value) || value.toISOString().slice(0,10)!==date) throw Error('Invalid calendar date');
}
async function researchStore(root,{create=true}={}) {
  root = await fs.realpath(root);
  if(process.platform === 'win32' && !/^D:\\/i.test(root)) throw Error('Research data must physically reside on D:');
  const candidate = path.join(root,'.cache','current-affairs-research');
  const cacheParent = path.join(root,'.cache');
  if(await exists(cacheParent)) {
    const physical = await fs.realpath(cacheParent);
    if(process.platform === 'win32' && !/^D:\\/i.test(physical)) throw Error('Research cache resolves outside D:');
  }
  if(create) await fs.mkdir(candidate,{recursive:true});
  const base = await fs.realpath(candidate);
  if(process.platform === 'win32' && !/^D:\\/i.test(base)) throw Error('Research cache resolves outside D:');
  return {root,base};
}
async function researchPaths(root, date) {
  assertDate(date);
  const paths=await researchStore(root);
  const metaFile=path.join(paths.root,'chapters',date,'meta.json');
  if(await exists(metaFile) && (await readJson(metaFile))?.sourcePolicy!=='current-affairs-v1') throw Error('Existing legacy chapter is archived: research reader only prepares current-affairs chapters');
  const {base}=paths;
  const day = path.join(base,date);
  await ensurePrivateDirectory(day);
  return {...paths,day};
}
export async function loadReaderConfig(root=repositoryRoot) {
  const registry = await readJson(path.join(root,'resources/current-affairs/sources.json'));
  const config = await readJson(path.join(root,'resources/current-affairs/feeds.json'));
  if(registry.schemaVersion!==1 || config.schemaVersion!==1 || !Array.isArray(registry.sources) || !Array.isArray(config.feeds)) throw Error('Invalid source/feed registry');
  for(const key of ['maxFeeds','concurrency','timeoutMs','maxFeedBytes','maxArticleBytes','maxRequests','maxItemsPerFeed']) if(!Number.isSafeInteger(config.limits?.[key]) || config.limits[key]<1) throw Error('Invalid per-run reader limit: '+key);
  if(registry.sources.some(s=>!s || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s.id))) throw Error('Invalid registered source ID');
  const sources = new Map(registry.sources.map(s=>[s.id,s]));
  const ids = new Set();
  for(const f of config.feeds) {
    if(!sources.has(f.sourceId) || ids.has(f.sourceId) || f.verification?.status!==200 || !f.discoveredOn || !Array.isArray(f.articleHosts)) throw Error('Unverified or duplicate feed configuration: '+f.sourceId);
    ids.add(f.sourceId);
    for(const url of [f.url,f.discoveredOn]) if(new URL(url).protocol!=='https:') throw Error('Only official HTTPS feed sources are accepted');
  }
  return {registry,config,sources};
}
function xmlLibrary() {
  const candidates = [
    process.env.SECOND_LANGUAGE_AFFAIRS_MODULES && path.join(process.env.SECOND_LANGUAGE_AFFAIRS_MODULES,'package.json'),
    path.resolve(path.dirname(process.execPath),'../package.json'),
    path.join(process.env.USERPROFILE||'', '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json')
  ].filter(Boolean);
  for(const base of candidates) {try {return createRequire(base)('xml-js');} catch {}}
  throw Error('Installed xml-js not found; set SECOND_LANGUAGE_AFFAIRS_MODULES to an existing tools directory. No dependencies were installed.');
}
const localName = name => (name||'').split(':').at(-1);
const children = (node,name) => (node?.elements||[]).filter(x=>x.type==='element' && localName(x.name)===name);
const child = (node,name) => children(node,name)[0];
const nodeText = node => node ? (node.elements||[]).map(x=>x.type==='text'||x.type==='cdata' ? x.text??x.cdata??'' : nodeText(x)).join('') : null;
const value = (node,name) => nodeText(child(node,name));
const iso = raw => {const n=raw ? Date.parse(raw) : NaN;return Number.isFinite(n)?new Date(n).toISOString():null;};
export function canonicalizeUrl(raw, feed) {
  const u = new URL(raw);u.hash='';
  for(const [key, values] of Object.entries(feed?.trackingQueryValues||{})) if(values.includes(u.searchParams.get(key))) u.searchParams.delete(key);
  return u.href;
}
export function parseFeed(xml, {source,feed,observedAt=stamp()}) {
  if(/<!DOCTYPE|<!ENTITY/i.test(xml)) throw Error('DTD/entity declarations are not accepted in feeds');
  const tree = xmlLibrary().xml2js(xml,{compact:false,ignoreComment:true,ignoreDeclaration:true,alwaysChildren:true});
  const root = tree.elements?.find(x=>x.type==='element');
  const atom = localName(root?.name)==='feed';
  const channel = atom ? root : localName(root?.name)==='rss' ? child(root,'channel') : null;
  if(!channel) throw Error('Response is not an RSS or Atom feed');
  const entries = children(channel,atom?'entry':'item');
  const items = [];
  const seen = new Map();
  for(const item of entries) {
    let linkNode = children(item,'link').find(x=>!atom || !x.attributes?.rel || x.attributes.rel==='alternate');
    const link = atom ? linkNode?.attributes?.href : nodeText(linkNode);
    if(!link) continue;
    let url;
    try {url=canonicalizeUrl(new URL(link,feed.url).href,feed);assertUrl(url,allowedHosts(source,feed));} catch {continue;}
    const title = (value(item,'title')||'').trim();
    if(!title) continue;
    const publishedRaw = value(item,atom?'published':'pubDate');
    const updatedRaw = value(item,'updated');
    const dcDateRaw = children(item,'date').map(nodeText).find(Boolean)||null;
    const publishedAt = iso(publishedRaw), updatedAt=iso(updatedRaw);
    const entryId = value(item,atom?'id':'guid') || null;
    const candidate = {
      id:source.id+':'+digest(url).slice(0,24),sourceId:source.id,sourceName:source.name,sourceRole:source.role,
      title,url,originalLink:link,feedEntryId:entryId,feedUrl:feed.url,
      publishedRaw:publishedRaw||null,updatedRaw:updatedRaw||null,dcDateRaw,
      publishedAt,updatedAt,dateBasis:publishedAt?'published':updatedAt?'updated-only':'unknown',
      dateWarnings:[...((publishedRaw&&!publishedAt||updatedRaw&&!updatedAt)?['unparseable-timestamp']:[]),
        ...([publishedAt,updatedAt].some(x=>x&&Date.parse(x)>Date.parse(observedAt)+300000)?['future-timestamp']:[]),
        ...(feed.timeCaveats||[])],
      language:source.language,rightsMode:feed.rights.mode,observedAt,
      kind:'discovery-metadata',factsVerified:false
    };
    const previous = seen.get(url);
    const revisionTime = entry => Date.parse(entry.updatedAt || entry.publishedAt || '') || 0;
    if(!previous || revisionTime(candidate) > revisionTime(previous)) seen.set(url,candidate);
  }
  items.push(...seen.values());
  return {format:atom?'atom':'rss',title:value(channel,'title'),feedUpdatedRaw:value(channel,'updated'),lastBuildDateRaw:value(channel,'lastBuildDate'),itemCount:entries.length,items};
}
function allowedHosts(source,feed) {
  return new Set([source.home,source.entryUrl].map(host).concat((feed?.articleHosts||[]).map(x=>x.toLowerCase().replace(/^www\./,''))));
}
function assertUrl(raw, allowed) {
  const u=new URL(raw);
  if(u.protocol!=='https:' || u.username || u.password || u.port && u.port!=='443' || !allowed.has(host(u.href))) throw Error('URL is outside this registered official source: '+u.origin);
  return u;
}
async function request(url,{allowed,fetchImpl=fetch,headers={},limit,timeoutMs,budget}) {
  let current=assertUrl(url,allowed).href;
  const startedAt=stamp();
  for(let redirect=0;redirect<4;redirect++) {
    if(budget.used>=budget.max) throw Error('This research run reached its request limit');
    budget.used++;
    const response=await fetchImpl(current,{method:'GET',redirect:'manual',headers:{'user-agent':'SecondLanguageResearchReader/1.0 (on-demand official source reading)',accept:'application/rss+xml, application/atom+xml, application/xml, text/xml, text/html;q=0.9',...headers},signal:AbortSignal.timeout(timeoutMs)});
    if([301,302,303,307,308].includes(response.status)) {
      const location=response.headers.get('location');await response.body?.cancel();
      if(!location) throw Error('Redirect has no Location');
      current=assertUrl(new URL(location,current).href,allowed).href;continue;
    }
    const responseHeaders=Object.fromEntries(['content-type','date','etag','last-modified','cache-control','retry-after'].map(k=>[k,response.headers.get(k)]));
    if(![200,304].includes(response.status)) {await response.body?.cancel();const error=Error('HTTP '+response.status+(responseHeaders['retry-after']?' Retry-After='+responseHeaders['retry-after']:''));error.httpStatus=response.status;error.retryAfter=responseHeaders['retry-after'];throw error;}
    const chunks=[];let size=0;
    if(response.body) for await(const chunk of response.body) {
      size+=chunk.length;
      if(size>limit) {await response.body.cancel().catch(()=>{});throw Error('Response exceeds research byte limit');}
      chunks.push(chunk);
    }
    const bytes=Buffer.concat(chunks);
    return {bytes,observation:{requestedUrl:url,finalUrl:current,method:'GET',startedAt,checkedAt:stamp(),httpStatus:response.status,headers:responseHeaders,bytes:size,responseDigest:digest(bytes)}};
  }
  throw Error('Too many redirects');
}
async function limitedMap(items, concurrency, fn) {
  const out=new Array(items.length);let next=0;
  await Promise.all(Array.from({length:Math.min(concurrency,items.length)},async()=>{while(next<items.length){const i=next++;out[i]=await fn(items[i],i);}}));
  return out;
}
export async function discoverMaterials(date,{root=repositoryRoot,sourceIds=[],topic=null,offline=false,fetchImpl=fetch}={}) {
  const paths=await researchPaths(root,date);
  const {config,sources}=await loadReaderConfig(root);
  for(const id of sourceIds) if(!config.feeds.some(f=>f.sourceId===id)) throw Error('Source has no verified feed adapter: '+id);
  const selected=config.feeds.filter(f=>(sourceIds.length?sourceIds.includes(f.sourceId):topic?true:f.defaultEnabled) && (!topic||sources.get(f.sourceId).topics.includes(topic)));
  if(selected.length>config.limits.maxFeeds) throw Error('Feed allowlist limit exceeded');
  const budget={used:0,max:config.limits.maxRequests};
  const observations=await limitedMap(selected,config.limits.concurrency,async feed=>{
    const source=sources.get(feed.sourceId),cacheFile=path.join(paths.base,'feed-cache',source.id+'.json');
    const cached=await privateJson(cacheFile);
    if(cached && (cached.sourceId!==source.id || cached.feedUrl!==feed.url || !Array.isArray(cached.items) || cached.items.some(item=>item.sourceId!==source.id))) throw Error('Feed cache identity mismatch: '+source.id);
    const checkedAt=stamp();
    if(offline) return {sourceId:source.id,status:cached?'cached-offline':'unavailable-offline',asOf:cached?.fetchedAt||null,checkedAt,items:cached?.items||[],stale:true,networkAttempted:false};
    try {
      const headers=cached?.etag?{'if-none-match':cached.etag}:cached?.lastModified?{'if-modified-since':cached.lastModified}:{};
      const allowed=new Set([host(feed.url)]);
      const result=await request(feed.url,{allowed,fetchImpl,headers,limit:config.limits.maxFeedBytes,timeoutMs:config.limits.timeoutMs,budget});
      if(result.observation.httpStatus===304) {
        if(!cached) throw Error('304 without a prior metadata cache');
        await atomicJson(cacheFile,{...cached,lastCheckedAt:result.observation.checkedAt});
        return {sourceId:source.id,status:'not-modified',asOf:cached.fetchedAt,checkedAt:result.observation.checkedAt,items:cached.items,stale:false,networkAttempted:true,http:result.observation};
      }
      if(!/xml|rss|atom/i.test(result.observation.headers['content-type']||'')) throw Error('Feed response is not XML');
      const parsed=parseFeed(result.bytes.toString('utf8'),{source,feed,observedAt:result.observation.checkedAt});
      const items=parsed.items.slice(0,config.limits.maxItemsPerFeed);
      const cache={schemaVersion:1,sourceId:source.id,feedUrl:feed.url,fetchedAt:result.observation.checkedAt,lastCheckedAt:result.observation.checkedAt,etag:result.observation.headers.etag,lastModified:result.observation.headers['last-modified'],responseDigest:result.observation.responseDigest,format:parsed.format,feedUpdatedRaw:parsed.feedUpdatedRaw,lastBuildDateRaw:parsed.lastBuildDateRaw,items};
      await atomicJson(cacheFile,cache);
      return {sourceId:source.id,status:'fetched',asOf:cache.fetchedAt,checkedAt:cache.fetchedAt,stale:false,networkAttempted:true,itemCount:parsed.itemCount,items,http:result.observation};
    } catch(e) {
      return {sourceId:source.id,status:cached?'cached-after-error':'failed',asOf:cached?.fetchedAt||null,checkedAt:stamp(),items:cached?.items||[],stale:true,networkAttempted:true,error:e.message,httpStatus:e.httpStatus||null,retryAfter:e.retryAfter||null};
    }
  });
  const report={schemaVersion:1,kind:'current-affairs-discovery',researchDate:date,createdAt:stamp(),automaticFacts:false,networkRequests:budget.used,observations,items:observations.flatMap(o=>o.items.map(item=>({...item,asOf:o.asOf,cacheState:o.status,stale:o.stale})))};
  const file=path.join(paths.day,'discoveries',new Date().toISOString().replace(/[:.]/g,'-')+'-'+randomUUID().slice(0,8)+'.json');
  await immutableJson(file,report);
  await atomicJson(path.join(paths.day,'discovery-index.json'),{latest:file,createdAt:report.createdAt});
  return {...report,file};
}

const htmlProgram = String.raw`
import sys,json,re,base64
from lxml import html
v=json.load(sys.stdin)
body=base64.b64decode(v["htmlBase64"]) if v.get("htmlBase64") else v["html"]
doc=html.fromstring(body,base_url=v["url"],parser=html.HTMLParser(encoding=v.get("encoding")))
def first(xs): return xs[0].strip() if xs and isinstance(xs[0],str) else None
title=first(doc.xpath("//meta[@property='og:title']/@content")) or first(doc.xpath("//title/text()"))
canonical=first(doc.xpath("//link[contains(concat(' ',normalize-space(@rel),' '),' canonical ')]/@href"))
dates=[]
for n in doc.xpath("//meta[@content]"):
 key=n.get("property") or n.get("name") or n.get("itemprop") or ""
 if key.lower() in ["article:published_time","article:modified_time","datepublished","datemodified","pubdate","publishdate"]:
  dates.append({"field":key,"raw":n.get("content"),"origin":"html-meta"})
for n in doc.xpath("//time[@datetime]"):
 dates.append({"field":"time","raw":n.get("datetime"),"origin":"html-time"})
for n in doc.xpath("//script[@type='application/ld+json']"):
 try:
  data=json.loads(n.text or "")
  stack=data if isinstance(data,list) else [data]
  while stack:
   obj=stack.pop()
   if not isinstance(obj,dict): continue
   for key in ["datePublished","dateModified"]:
    if isinstance(obj.get(key),str): dates.append({"field":key,"raw":obj[key],"origin":"json-ld"})
   g=obj.get("@graph")
   if isinstance(g,list): stack.extend(g)
 except (ValueError,TypeError): pass
for n in doc.xpath("//script|//style|//noscript|//template|//nav|//header|//footer|//aside|//form|//button|//svg|//iframe"):
 n.drop_tree()
candidates=doc.xpath("//article")
method="lxml-article"
if not candidates: candidates=doc.xpath("//main|//*[@role='main']");method="lxml-main"
if not candidates: candidates=[doc];method="lxml-body-fallback"
node=max(candidates,key=lambda x:len(x.text_content()))
blocks={"p","div","section","article","main","h1","h2","h3","h4","h5","h6","li","blockquote","pre","tr","td","th","br"}
for n in node.iter():
 if isinstance(n.tag,str) and n.tag.lower() in blocks:
  n.text="\n"+(n.text or "")
  n.tail="\n"+(n.tail or "")
lines=[re.sub(r"[^\S\n]+"," ",x).strip() for x in node.text_content().splitlines()]
text="\n".join(x for x in lines if x)
print(json.dumps({"title":title,"canonicalUrl":canonical,"text":text,"pageTimestamps":dates,"extractionMethod":method,"warnings":["Body fallback may include navigation or omit visual context"] if method=="lxml-body-fallback" else []},ensure_ascii=False))
`;
function pythonExecutable() {
  return process.env.SECOND_LANGUAGE_PYTHON || path.resolve(path.dirname(process.execPath),'../../python/python.exe');
}
export function extractHtml(html,url,encoding=null) {
  const input=Buffer.isBuffer(html)?{htmlBase64:html.toString('base64'),url,encoding}:{html,url,encoding};
  const result=spawnSync(pythonExecutable(),['-c',htmlProgram],{input:JSON.stringify(input),encoding:'utf8',maxBuffer:8*1024*1024,timeout:20000,windowsHide:true,env:{...process.env,PYTHONIOENCODING:'utf-8'}});
  if(result.status!==0) throw Error('Installed lxml HTML extraction failed: '+(result.error?.message||result.stderr?.slice(0,300)||'Python unavailable; set SECOND_LANGUAGE_PYTHON'));
  const data=JSON.parse(result.stdout.replace(/^\uFEFF/,''));
  if(data.text.length<120 || /^(access denied|just a moment|attention required|verify (?:you|that))/i.test(data.title||'')) throw Error('No readable article text; authentication, challenge or script-only page may be present');
  data.pageTimestamps=data.pageTimestamps.map(t=>({...t,parsedAt:iso(t.raw)}));
  return data;
}
function readFolder(base,sourceId,canonicalUrl) {
  return path.join(base,'reads',sourceId+'-'+digest(canonicalUrl).slice(0,24));
}
function recordFileInFolder(file,folder) {
  if(typeof file!=='string' || !path.isAbsolute(file) || !samePath(path.dirname(file),folder) || !/^20\d{2}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z-[a-f0-9]{8}\.json$/.test(path.basename(file))) throw Error('Read record must stay in its source/URL original directory');
  return path.resolve(file);
}
const externalMethods=new Set(['codex-web','codex-pdf']);
const externalEvidenceNotice='Executor-supplied original tool text only; evidenceRef is not machine verified or signed proof, and readScope is not proof of semantic completeness. Codex must read the original and judge its limits; summaries and rewrites are not originals.';
function requiredText(value,label,maxLength) {
  if(typeof value!=='string' || !value.trim() || value.length>maxLength || value.includes('\0')) throw Error('Provide a nonempty '+label+' (at most '+maxLength+' characters)');
  return value.trim();
}
function normalizedReadAt(value) {
  if(typeof value!=='string' || !/^20\d{2}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/.test(value) || !iso(value)) throw Error('Provide the actual tool readAt as an ISO timestamp with timezone');
  assertDate(value.slice(0,10));
  if(Date.parse(value)>Date.now()+300000) throw Error('Actual tool readAt cannot be in the future');
  return iso(value);
}
async function checkedReadRecord(recordPath,{base,source,feed,canonicalUrl}) {
  const folder=readFolder(base,source.id,canonicalUrl);
  recordPath=recordFileInFolder(recordPath,folder);
  await assertPrivateLocation(recordPath);
  const record=await readJson(recordPath);
  if(record.schemaVersion!==1 || record.kind!=='read-original-text' || record.sourceId!==source.id || record.canonicalUrl!==canonicalUrl || typeof record.recordPath!=='string' || !path.isAbsolute(record.recordPath) || !samePath(record.recordPath,recordPath)) throw Error('Read record source/URL/file identity mismatch');
  if(typeof record.readAt!=='string' || iso(record.readAt)!==record.readAt || Date.parse(record.readAt)>Date.now()+300000) throw Error('Invalid original read timestamp');
  const recordedAt=record.recordedAt??record.readAt;
  if(typeof recordedAt!=='string' || iso(recordedAt)!==recordedAt || Date.parse(recordedAt)>Date.now()+300000 || Date.parse(record.readAt)>Date.parse(recordedAt)+300000 || !path.basename(recordPath).startsWith(recordedAt.replace(/[:.]/g,'-')+'-')) throw Error('Invalid original recording timestamp');
  const allowed=allowedHosts(source,feed);
  for(const url of [record.requestedUrl,...(record.finalUrl?[record.finalUrl]:[]),...(record.pageCanonicalUrl?[record.pageCanonicalUrl]:[])]) assertUrl(url,allowed);
  if(canonicalizeUrl(record.requestedUrl,feed)!==canonicalUrl) throw Error('Read record requested URL identity mismatch');
  const method=record.acquisitionMethod??'native-get';
  if(method==='native-get') {
    assertUrl(record.finalUrl,allowed);
    if(record.http?.method!=='GET' || record.http.httpStatus!==200 || record.http.requestedUrl!==record.requestedUrl || record.http.finalUrl!==record.finalUrl || record.http.checkedAt!==record.readAt || !iso(record.http.startedAt) || Date.parse(record.http.startedAt)>Date.parse(record.readAt) || !/^(text\/html|application\/xhtml\+xml)(;|$)/i.test(record.http.headers?.['content-type']||'') || !/^[a-f0-9]{64}$/.test(record.responseDigest||'') || record.http.responseDigest!==record.responseDigest || record.textChars<120) throw Error('Read record is not bound to its actual HTML GET observation');
  } else if(externalMethods.has(method)) {
    requiredText(record.evidenceRef,'actual tool evidenceRef',4000);
    requiredText(record.readScope,'explicit tool readScope',2000);
    if(record.http!==null || record.responseDigest!==null || record.finalUrl!==null || record.pageCanonicalUrl!==null || !record.recordedAt || typeof record.importedFrom!=='string' || !path.isAbsolute(record.importedFrom) || process.platform==='win32' && !/^D:\\/i.test(record.importedFrom)) throw Error('External read record must retain tool evidence and recording time without an invented HTTP response');
  } else throw Error('Unsupported read acquisitionMethod');
  if(!/^[a-f0-9]{64}$/.test(record.textDigest||'') || !Number.isSafeInteger(record.textChars) || record.textChars<1 || record.publicBodyReuseAuthorized!==false || record.factsVerified!==false) throw Error('Invalid original text metadata');
  const textPath=path.join(folder,record.textDigest.slice(0,32)+'.txt');
  if(typeof record.textPath!=='string' || !path.isAbsolute(record.textPath) || !samePath(record.textPath,textPath)) throw Error('Original text must stay in its source/URL directory with its digest filename');
  await assertPrivateLocation(textPath);
  const text=await fs.readFile(textPath,'utf8');
  if(digest(text)!==record.textDigest || text.length!==record.textChars) throw Error('Previously read original text failed digest verification; refusing to replace it');
  return record;
}
// Shared by a metadata packer: validates existing private files; does not fetch or emit text.
export async function validateReadRecord(recordPath,{root=repositoryRoot,sourceId,url}={}) {
  const {base}=await researchStore(root,{create:false});
  const {config,sources}=await loadReaderConfig(root);
  const source=sources.get(sourceId);
  if(!source) throw Error('Unknown registered source');
  const feed=config.feeds.find(f=>f.sourceId===sourceId);
  assertUrl(url,allowedHosts(source,feed));
  return checkedReadRecord(recordPath,{base,source,feed,canonicalUrl:canonicalizeUrl(url,feed)});
}
async function existingRead(indexFile,context) {
  const index=await privateJson(indexFile);
  if(!index) return null;
  const folder=readFolder(context.base,context.source.id,context.canonicalUrl);
  if(index.canonicalUrl!==context.canonicalUrl || !Array.isArray(index.revisions) || !index.revisions.includes(index.latest)) throw Error('Read index identity mismatch');
  for(const file of index.revisions) recordFileInFolder(file,folder);
  const record=await checkedReadRecord(index.latest,context);
  return {record,index};
}
// Serialize same-URL writes in this process; the small file lock rejects a competing CLI.
const readWrites=new Map();
async function withReadWriteLock(folder,fn) {
  const previous=readWrites.get(folder)||Promise.resolve();
  let release;
  const finished=new Promise(resolve=>{release=resolve;});
  readWrites.set(folder,finished);
  await previous;
  let lock;
  const lockPath=path.join(folder,'write.lock');
  try {
    await ensurePrivateDirectory(folder);
    await assertPrivateLocation(lockPath);
    try {lock=await fs.open(lockPath,'wx');}
    catch(e) {if(e.code==='EEXIST') throw Error('Read write lock exists: '+lockPath+'. Wait for the other reader. If it stopped, inspect its owner in this lock before removing only the stale lock; original files stay unchanged.');throw e;}
    await lock.writeFile(JSON.stringify({pid:process.pid,startedAt:stamp()}));
    return await fn();
  } finally {
    try {if(lock) {await lock.close();await fs.unlink(lockPath);}}
    finally {release();if(readWrites.get(folder)===finished) readWrites.delete(folder);}
  }
}
async function saveReadOriginal(paths,{source,feed,record,text}) {
  const {canonicalUrl}=record,folder=readFolder(paths.base,source.id,canonicalUrl),indexFile=path.join(folder,'index.json');
  return withReadWriteLock(folder,async()=>{
    const prior=await existingRead(indexFile,{base:paths.base,source,feed,canonicalUrl});
    const textDigest=digest(text),textPath=path.join(folder,textDigest.slice(0,32)+'.txt');
    await assertPrivateLocation(textPath);
    try {await fs.writeFile(textPath,text,{flag:'wx'});}
    catch(e) {if(e.code!=='EEXIST') throw e;if(digest(await fs.readFile(textPath,'utf8'))!==textDigest) throw Error('Stored text digest conflict');}
    const recordedAt=stamp(),recordPath=path.join(folder,recordedAt.replace(/[:.]/g,'-')+'-'+randomUUID().slice(0,8)+'.json');
    record={...record,recordedAt,textPath,textDigest,textChars:text.length,recordPath};
    await immutableJson(recordPath,record);
    const latest=prior && Date.parse(prior.record.readAt)>Date.parse(record.readAt) ? prior.record.recordPath : recordPath;
    await atomicJson(indexFile,{canonicalUrl,latest,revisions:[...(prior?.index.revisions||[]),recordPath]});
    await immutableJson(path.join(paths.day,'read-observations',randomUUID()+'.json'),{sourceId:source.id,url:record.requestedUrl,recordPath,readAt:record.readAt,recordedAt,textDigest,acquisitionMethod:record.acquisitionMethod});
    return record;
  });
}
function publicRead(record, extra={}) {
  const notice='Private research text is at textPath; metadata is not verified facts or permission to republish.';
  return {...record,...extra,actualTextIncluded:false,notice:externalMethods.has(record.acquisitionMethod)?notice+' '+externalEvidenceNotice:notice};
}
export async function readMaterial(date,{root=repositoryRoot,sourceId,url,offline=false,refresh=false,fetchImpl=fetch}={}) {
  const paths=await researchPaths(root,date);
  const {config,sources}=await loadReaderConfig(root);
  const source=sources.get(sourceId);
  if(!source) throw Error('Unknown registered source');
  const feed=config.feeds.find(f=>f.sourceId===sourceId);
  const allowed=allowedHosts(source,feed);
  assertUrl(url,allowed);
  const canonicalUrl=canonicalizeUrl(url,feed);
  const folder=readFolder(paths.base,source.id,canonicalUrl),indexFile=path.join(folder,'index.json');
  const prior=await existingRead(indexFile,{base:paths.base,source,feed,canonicalUrl});
  if(prior && (!refresh||offline)) return publicRead(prior.record,{researchDate:date,reused:true,cacheState:offline?'read-offline':'already-read',asOf:prior.record.readAt,networkAttempted:false});
  if(offline) throw Error('No previously read original is available offline for this URL');
  try {
    const response=await request(url,{allowed,fetchImpl,limit:config.limits.maxArticleBytes,timeoutMs:config.limits.timeoutMs,budget:{used:0,max:4},headers:{accept:'text/html, application/xhtml+xml'},});
    if(!/^(text\/html|application\/xhtml\+xml)(;|$)/i.test(response.observation.headers['content-type']||'')) throw Error('read accepts actual text/html only; PDF and other formats need a separate reader');
    const charset=(response.observation.headers['content-type']||'').match(/charset\s*=\s*["']?([^;"'\s]+)/i)?.[1]||null;
    const extracted=extractHtml(response.bytes,response.observation.finalUrl,charset);
    let pageCanonicalUrl=null;
    if(extracted.canonicalUrl) {try {pageCanonicalUrl=assertUrl(new URL(extracted.canonicalUrl,response.observation.finalUrl).href,allowed).href;} catch {}}
    const readAt=response.observation.checkedAt;
    const record=await saveReadOriginal(paths,{source,feed,text:extracted.text,record:{schemaVersion:1,kind:'read-original-text',acquisitionMethod:'native-get',sourceId,sourceName:source.name,sourceRole:source.role,canonicalUrl,requestedUrl:url,finalUrl:response.observation.finalUrl,pageCanonicalUrl,title:extracted.title,readAt,responseDigest:response.observation.responseDigest,extractionMethod:extracted.extractionMethod,pageTimestamps:extracted.pageTimestamps,warnings:extracted.warnings,http:response.observation,rightsMode:feed?.rights.mode||'private-research-only',publicBodyReuseAuthorized:false,factsVerified:false}});
    return publicRead(record,{researchDate:date,reused:false,cacheState:'read-from-official-page',asOf:readAt,networkAttempted:true});
  } catch(e) {
    const observationPath=path.join(paths.day,'read-observations',randomUUID()+'.json');
    await immutableJson(observationPath,{sourceId,url,attemptedAt:stamp(),error:e.message,httpStatus:e.httpStatus||null,reusedRecordPath:prior?.record.recordPath||null,asOf:prior?.record.readAt||null});
    e.observationPath=observationPath;
    if(!prior) throw e;
    return publicRead(prior.record,{researchDate:date,reused:true,cacheState:'read-after-error',asOf:prior.record.readAt,networkAttempted:true,latestAttemptAt:stamp(),error:e.message,observationPath});
  }
}
export async function importReadMaterial(date,{root=repositoryRoot,sourceId,url,textFile,acquisitionMethod,evidenceRef,readAt,readScope}={}) {
  const paths=await researchPaths(root,date);
  const {config,sources}=await loadReaderConfig(root);
  const source=sources.get(sourceId);
  if(!source) throw Error('Unknown registered source');
  const feed=config.feeds.find(f=>f.sourceId===sourceId);
  assertUrl(url,allowedHosts(source,feed));
  if(!externalMethods.has(acquisitionMethod)) throw Error('Import method must be codex-web or codex-pdf');
  evidenceRef=requiredText(evidenceRef,'actual tool evidenceRef',4000);
  readScope=requiredText(readScope,'explicit tool readScope',2000);
  readAt=normalizedReadAt(readAt);
  if(typeof textFile!=='string' || !path.isAbsolute(textFile)) throw Error('Import requires an absolute D: UTF-8 task textFile');
  textFile=await assertPrivateLocation(textFile);
  const stat=await fs.stat(textFile);
  if(!stat.isFile() || stat.size<1 || stat.size>config.limits.maxArticleBytes) throw Error('Import text file is empty, not a regular file or exceeds the article byte limit');
  const bytes=await fs.readFile(textFile);
  if(bytes.length>config.limits.maxArticleBytes) throw Error('Import text file exceeds the article byte limit');
  let text;
  try {text=new TextDecoder('utf-8',{fatal:true,ignoreBOM:true}).decode(bytes);}
  catch {throw Error('Import accepts actual tool original text encoded as valid UTF-8');}
  if(!text.trim() || text.includes('\0') || text.startsWith('%PDF-')) throw Error('Import requires original tool text, not an empty file, binary data or raw PDF');
  const canonicalUrl=canonicalizeUrl(url,feed);
  const record=await saveReadOriginal(paths,{source,feed,text,record:{schemaVersion:1,kind:'read-original-text',acquisitionMethod,sourceId,sourceName:source.name,sourceRole:source.role,canonicalUrl,requestedUrl:url,finalUrl:null,pageCanonicalUrl:null,title:null,readAt,evidenceRef,readScope,importedFrom:textFile,responseDigest:null,extractionMethod:'external-tool-original-text',pageTimestamps:[],warnings:[externalEvidenceNotice],http:null,rightsMode:feed?.rights.mode||'private-research-only',publicBodyReuseAuthorized:false,factsVerified:false}});
  return publicRead(record,{researchDate:date,reused:false,cacheState:'imported-tool-original',asOf:readAt,networkAttempted:false});
}
export async function listMaterials(date,{root=repositoryRoot}={}) {
  const paths=await researchPaths(root,date),index=await privateJson(path.join(paths.day,'discovery-index.json'));
  return {researchDate:date,latestDiscovery:index,privateResearchDirectory:paths.day,notice:'No article text is emitted. Use readMaterial textPath for private full reading.'};
}

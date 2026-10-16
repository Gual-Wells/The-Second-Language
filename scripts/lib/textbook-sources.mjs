import {readFile,readdir,mkdir,writeFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import {createHash} from 'node:crypto';
export const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const gitHash=bytes=>createHash('sha1').update(Buffer.from(`blob ${bytes.length}\0`)).update(bytes).digest('hex');
export const textbookNames={collins:'Collins_COBUILD_Chat_Project.md',oxford:'Oxford_English_Chinese_Chat_Project.md',chambers:'Chambers_Etymology_Chat_Project.md',onions:'Oxford_Etymology_Chat_Project.md',klein:'Klein_Etymology_Chat_Project.md'};
export function indexTextbook(bytes,book){
 const text=bytes.toString('utf8'),digest=hash(bytes),heads=[...text.matchAll(/^## ([^\r\n]+)\r?$/gm)].map(m=>({heading:m[1],start:m.index}));
 const normalized=s=>s.trim().toLowerCase().replace(/[¹²³⁴⁵⁶⁷⁸⁹⁰]/g,c=>'¹²³⁴⁵⁶⁷⁸⁹⁰'.indexOf(c)+1+'');
 function entry(i){const h=heads[i],end=heads[i+1]?.start??text.length,content=text.slice(h.start,end);return{id:book+':'+h.start,book,bookDigest:digest,heading:h.heading,start:Buffer.byteLength(text.slice(0,h.start)),end:Buffer.byteLength(text.slice(0,end)),text:content,excerptDigest:hash(Buffer.from(content))};}
 return {book,digest,bytes:bytes.length,lookup(term){
  const needle=normalized(term),ids=new Set();heads.forEach((h,i)=>{if(normalized(h.heading)===needle||!/[0-9]$/.test(needle)&&normalized(h.heading).replace(/\d+$/,'')===needle)ids.add(i);});
  if(!ids.size){const escaped=term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),pattern=new RegExp('(?:^|\\n)(?:Phr & Deriv:\\s*)?'+escaped+'(?:[ \\t,/]|$)','gim');for(const m of text.matchAll(pattern)){let lo=0,hi=heads.length;while(lo<hi){const mid=(lo+hi)>>1;if(heads[mid].start<=m.index+1)lo=mid+1;else hi=mid;}if(lo)ids.add(lo-1);}}
  return [...ids].sort((a,b)=>a-b).map(entry);
 }};
}
async function gitHeaders(){const result=spawnSync('git',['credential','fill'],{input:'protocol=https\nhost=github.com\n\n',encoding:'utf8',windowsHide:true});const token=process.env.GITHUB_TOKEN||process.env.GH_TOKEN||result.stdout?.split(/\r?\n/).find(x=>x.startsWith('password='))?.slice(9);return {accept:'application/vnd.github+json',...(token?{authorization:`Bearer ${token}`}:{})};}
export async function loadTextbooks({root,commit,etymology=false}){
 if(!/^[a-f0-9]{40}$/.test(commit||''))throw Error('缺少固定 VIX 来源版本');
 const headers=await gitHeaders();async function api(route){const r=await fetch('https://api.github.com/repos/Gual-Wells/IELTS-Vocabulary-Index-List'+route,{headers,signal:AbortSignal.timeout(90000)});if(!r.ok)throw Error('固定教材读取失败 '+r.status);return r.json();}
 const dest=path.join(root,'.cache/vix',commit);await mkdir(dest,{recursive:true});let tree;
 const lock=path.join(dest,'source-tree.json');try{tree=JSON.parse(await readFile(lock,'utf8'));if(tree.commit!==commit)throw Error('来源树身份不一致');}catch(e){if(e.code!=='ENOENT')throw e;const value=await api('/git/trees/'+commit+'?recursive=1');if(value.truncated)throw Error('来源树被截断');tree={commit,files:value.tree.filter(e=>e.type==='blob'&&e.path.startsWith('textbook/'))};await writeFile(lock,JSON.stringify(tree));}
 const cacheRoots=[];for(const directory of await readdir(path.join(root,'.cache/vix'),{withFileTypes:true}))if(directory.isDirectory())cacheRoots.push(path.join(root,'.cache/vix',directory.name,'textbook'));
 cacheRoots.push('D:/CodexStorage/workspaces/etymology-textbook-ingestion/textbook','D:/CodexStorage/workspaces/second-language-daily-2026-10-15/vix-input/textbook');
 const books=[];for(const [book,name] of Object.entries(textbookNames)){if(!etymology&&!['collins','oxford'].includes(book))continue;const expected=tree.files.find(e=>e.path==='textbook/'+name);if(!expected){if(['collins','oxford'].includes(book))throw Error('固定版本缺少教材 '+book);continue;}let bytes;
  for(const candidate of cacheRoots){try{const b=await readFile(path.join(candidate,name));if(gitHash(b)===expected.sha){bytes=b;break;}}catch(e){if(e.code!=='ENOENT')throw e;}}
  if(!bytes){const blob=await api('/git/blobs/'+expected.sha);if(blob.encoding!=='base64')throw Error('教材编码无效');bytes=Buffer.from(blob.content,'base64');if(gitHash(bytes)!==expected.sha)throw Error('固定教材摘要不一致');}
  const local=path.join(dest,'textbook',name);await mkdir(path.dirname(local),{recursive:true});try{if(gitHash(await readFile(local))!==expected.sha)await writeFile(local,bytes);}catch(e){if(e.code!=='ENOENT')throw e;await writeFile(local,bytes);}
  books.push({...indexTextbook(bytes,book),file:name,gitBlob:expected.sha,commit});
 }
 return books;
}
export function lookupBooks(books,terms){const entries=new Map();for(const book of books)for(const term of terms)for(const e of book.lookup(term))entries.set(e.id,e);return [...entries.values()];}

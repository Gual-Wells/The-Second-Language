import {createHash} from 'node:crypto';
import {textbookSource,readLibraryFile} from './textbook-library.mjs';
export const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
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
export async function loadTextbooks({root,commit,date,etymology=false}){
 const library=await textbookSource(root,{date,commit}),books=[];
 for(const file of library.source.files){
  if(!file.book||!etymology&&!['collins','oxford'].includes(file.book))continue;
  const bytes=await readLibraryFile(library,file);
  books.push({...indexTextbook(bytes,file.book),file:file.file,gitBlob:file.gitBlob,commit,libraryId:library.catalog.id});
 }
 if(!['collins','oxford'].every(book=>books.some(b=>b.book===book)))throw Error('独立资料库须保两份完整教材');
 return books;
}
export function lookupBooks(books,terms){const entries=new Map();for(const book of books)for(const term of terms)for(const e of book.lookup(term))entries.set(e.id,e);return [...entries.values()];}

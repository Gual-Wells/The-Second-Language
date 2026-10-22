// Licensed, publicly exposed files only. Third-party scripts stay out of Git.
import {mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const dir='web/labs/certification-reader/assets/audio-sources/performance-recordings';
const evidence='research/scroll-craft-and-audio-2026-10-22';
await mkdir(dir,{recursive:true});await mkdir(evidence,{recursive:true});
const candidates=[
 {id:'parchment',author:'Vrymaa',title:'Parchment - Unroll',page:'https://freesound.org/people/Vrymaa/sounds/753282/',license:'CC0-1.0',file:'vrymaa-parchment-unroll-hq.mp3'},
 {id:'leather',author:'Joao_Janz',title:'Leather Belt Stretching 1_8',page:'https://freesound.org/people/Joao_Janz/sounds/493154/',license:'CC0-1.0',file:'joao-janz-leather-belt-hq.mp3'},
 {id:'buckle',author:'Joseph SARDIN',title:'Belt buckle',page:'https://bigsoundbank.com/belt-buckle-s0575.html',license:'CC0-1.0',file:'joseph-sardin-belt-buckle.wav'}
];
const hash=b=>createHash('sha256').update(b).digest('hex');
for(const item of candidates){
 const response=await fetch(item.page);if(!response.ok)throw Error(`${item.id} page: ${response.status}`);
 const html=await response.text();
 if(item.id==='buckle'){
  const data=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
  item.download=data.find(x=>x['@type']==='AudioObject').encoding.find(x=>x.encodingFormat==='audio/wav').contentUrl;
 }else{
  item.download=html.match(/data-static-file-url="(https:\/\/cdn\.freesound\.org\/previews\/[^" ]+-hq\.mp3)"/)?.[1];
 }
 if(!item.download)throw Error('No author-exposed file '+item.id);
 const audio=await fetch(item.download);if(!audio.ok)throw Error(`${item.id} recording: ${audio.status}`);
 const bytes=Buffer.from(await audio.arrayBuffer());await writeFile(dir+'/'+item.file,bytes);
 item.bytes=bytes.length;item.sha256=hash(bytes);item.retrievedAt=new Date().toISOString();
 item.formatNote=item.id==='buckle'?'Author-exposed original WAV; inspect actual PCM format.':'Public HQ MP3 derivative, not the login-protected original WAV.';
 const visible=html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi,'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
 // Keep only the author-facing sound description/license, no login forms or site scripts.
 let start=visible.indexOf(item.title);
 const second=visible.indexOf(item.title,start+item.title.length);if(second>=0&&second-start<1500)start=second;
 const end=visible.indexOf('Get attribution text',start);
 const excerpt=visible.slice(Math.max(0,start),end>start?end+20:Math.max(0,start)+7000);
 await writeFile(evidence+'/'+item.id+'-author.txt',`Source: ${item.page}\nRetrieved: ${item.retrievedAt}\nOriginal HTML SHA256: ${hash(html)}\n${excerpt}\n`);
}
await writeFile(dir+'/sources.json',JSON.stringify({schema:'second-language.recorded-performance-sources.v1',sources:candidates},null,2)+'\n');
console.log(JSON.stringify(candidates.map(({id,bytes,sha256,download})=>({id,bytes,sha256,download})),null,2));

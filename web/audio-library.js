const CACHE='second-language-point-audio-v1',SETTING='second-language-audio-preload',sha=async bytes=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(x=>x.toString(16).padStart(2,'0')).join('');
let chapter=null,clips=new Map(),serial=0,controller=null;
export const preloadEnabled=()=>{try{return localStorage.getItem(SETTING)!=='off';}catch{return true;}};
export function setPreload(enabled){try{localStorage.setItem(SETTING,enabled?'on':'off');}catch{}if(enabled&&chapter)openAudioChapter(chapter);else{serial++;controller?.abort();}}
export async function cachedPronunciation(text){const clip=clips.get(text.replace(/\s+/g,' ').trim());if(!clip)return null;try{return(await caches.open(CACHE)).match(`/api/practice/pronunciation/${clip.id}/audio`);}catch{return null;}}
export async function keepPronunciation(id,response,text){if(text)clips.set(text.replace(/\s+/g,' ').trim(),{id});try{if(response.ok)await(await caches.open(CACHE)).put(`/api/practice/pronunciation/${id}/audio`,response.clone());}catch{}}
export function clearAudioLibrary(){serial++;controller?.abort();chapter=null;clips.clear();return caches.delete(CACHE);}
export async function openAudioChapter(current){
 serial++;controller?.abort();controller=new AbortController();chapter=current;clips.clear();
 if(!current||current.kind||!current.digest)return;
 const ticket=serial,signal=controller.signal;
 try {
  const cache=await caches.open(CACHE),manifestUrl=`/api/storage/chapters/${encodeURIComponent(current.id)}?digest=${current.digest}`;
  let r;if(navigator.onLine)try{r=await fetch(manifestUrl,{credentials:'same-origin',signal});if(r.ok)await cache.put(manifestUrl,r.clone());}catch{}if(!r?.ok)r=await cache.match(manifestUrl);if(!r?.ok)return;
  const manifest=await r.json();if(ticket!==serial)return;
  for(const clip of manifest.clips||[])if(clip.voice==='af_bella')clips.set(clip.text,clip);
  if(!preloadEnabled()||!navigator.onLine)return;
  // One chapter unit, sequential 8 MiB packs: no scroll prediction or per-word network prefetch.
  for(const [index,pack] of (manifest.packs||[]).entries()){
   if(ticket!==serial||!preloadEnabled())return;
   const wanted=manifest.clips.filter(c=>c.pack===index);if((await Promise.all(wanted.map(c=>cache.match(`/api/practice/pronunciation/${c.id}/audio`)))).every(Boolean))continue;
   const response=await fetch(`/api/storage/pack?key=${encodeURIComponent(pack.key)}`,{credentials:'same-origin',signal});if(!response.ok)continue;
   const bytes=await response.arrayBuffer();if(ticket!==serial)return;if(await sha(bytes)!==pack.digest)continue;
   for(const clip of wanted){if(clip.offset<0||clip.length<=0||clip.offset+clip.length>bytes.byteLength)continue;const audio=bytes.slice(clip.offset,clip.offset+clip.length);if(await sha(audio)!==clip.digest)continue;await cache.put(`/api/practice/pronunciation/${clip.id}/audio`,new Response(audio,{headers:{'content-type':'audio/mpeg'}}));}
  }
 }catch{}
}
export function chapterIdentity(){return chapter&&!chapter.kind?{chapterId:chapter.id,digest:chapter.digest}:{};}

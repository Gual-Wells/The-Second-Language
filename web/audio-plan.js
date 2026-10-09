// Shared by the reader and Worker. Content identities stay outside chapter originals.
export const audioParts=['one','two','three'];
export const pointAudioPolicy='chapter-titles-and-sentences-v1';
export const audioPrice={usdPerMillion:[.62,.99],usdCny:7,checkedAt:'2026-10-09',exchange:'预算换算，非实时汇率'};
export const normalizeAudioText=text=>text.replace(/\s+/g,' ').trim();
export const pronunciationKey=(text,phonemes='')=>JSON.stringify([normalizeAudioText(text),phonemes]);
export function ipaToKokoro(ipa){
 let p=ipa.replace(/^\/|\/$/g,'').normalize('NFC').replace(/tʃ/g,'ʧ').replace(/dʒ/g,'ʤ').replace(/eɪ/g,'A').replace(/oʊ/g,'O').replace(/aɪ/g,'I').replace(/aʊ/g,'W').replace(/ɔɪ/g,'Y').replace(/ɚ/g,'əɹ').replace(/ɝ/g,'ɜɹ').replace(/r/g,'ɹ').replace(/g/g,'ɡ').replace(/e/g,'ɛ').replace(/[ː.]/g,'');
 if(!p||/[^AIOWYbdfhijklmnpstuvwzæðŋɑɔəɛɜɡɪɹɾʃʊʌʒʤʧˈˌθᵊᵻʔ ]/.test(p))return null;
 return p;
}
export function headingWord(label){return normalizeAudioText(label.split(/\s*[·•]|\s*\(/)[0].match(/^[A-Za-z][A-Za-z'’ -]*/)?.[0]||'');}
export function audioUnits(markdown){
 const units=[],uses=new Map(),words=new Map();let part='',wordId='',useId='',example=false,sentence=false;
 for(const raw of markdown.replace(/\r/g,'').split('\n')){
  const line=raw.trim();if(!line)continue;
  let m=line.match(/^<!-- PART:(one|two|three) -->$/);if(m){part=m[1];continue;}
  m=line.match(/^<!-- WORD:([^ ]+) -->$/);if(m){wordId=m[1];continue;}
  m=line.match(/^<!-- USE:([^ ]+) -->$/);if(m){useId=m[1];continue;}
  if(part==='one'&&line.startsWith('# ')){const text=headingWord(line.slice(2));const u={part,kind:'word',text,wordId,unit:wordId};units.push(u);words.set(wordId,u);}
  if(part==='one'&&/^#{2,3} /.test(line)){
   const h=line.replace(/^#{2,3} /,'').match(/^(.*?)\s+(\/[^/]+\/)$/);if(!h)continue;
   const text=headingWord(h[1]),phonemes=ipaToKokoro(h[2]),u={part,kind:'word',text,ipa:h[2],phonemes:phonemes||'',unsupported:!phonemes,wordId,unit:useId};
   units.push(u);uses.set(useId,u);const main=words.get(wordId);if(main&&main.text===text&&!main.ipa)Object.assign(main,{ipa:u.ipa,phonemes:u.phonemes,unsupported:u.unsupported});
  }
  if(part==='two'&&line.startsWith('<!-- EXAMPLE:')){example=true;continue;}
  if(part==='two'&&example&&!line.startsWith('<!--')){units.push({part,kind:'sentence',text:normalizeAudioText(line.replace(/\*|`/g,''))});example=false;}
  if(part==='three'&&line.startsWith('<!-- SENTENCE:')){sentence=true;continue;}
  if(part==='three'&&sentence&&!line.startsWith('<!--')){units.push({part,kind:'sentence',text:normalizeAudioText(line.replace(/\*|`/g,''))});sentence=false;}
 }
 return units.filter(u=>u.text);
}
export function uniqueAudioUnits(units){const seen=new Set();return units.filter(u=>{const k=pronunciationKey(u.text,u.phonemes);if(seen.has(k))return false;seen.add(k);return true;});}
export function pointAudioKeys(markdown){return new Set(audioUnits(markdown).filter(u=>!u.unsupported&&(u.kind!=='word'||u.ipa)).map(u=>pronunciationKey(u.text,u.phonemes||'')));}
export function isPointAudioClip(clip,keys){return clip.voice==='af_bella'&&keys.has(pronunciationKey(clip.text,clip.phonemes||''));}
export function isChapterAudioRequest(markdown,text,kind,phonemes=''){return audioUnits(markdown).some(u=>!u.unsupported&&u.kind===kind&&(kind!=='word'||u.ipa)&&pronunciationKey(u.text,u.phonemes||'')===pronunciationKey(text,phonemes));}
export function audioCost(characters){return audioPrice.usdPerMillion.map(rate=>characters*rate/1e6*audioPrice.usdCny);}
export function costLabel(range){return range[1]===0?'¥0':range[1]<.01?'不足 ¥0.01':`约 ¥${range[0].toFixed(2)}–${range[1].toFixed(2)}`;}

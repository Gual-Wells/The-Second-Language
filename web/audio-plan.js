// Shared by the reader and Worker. Content identities stay outside chapter originals.
import {isUsageContextContent} from './usage-context.js';
export const audioParts=['two','three','contexts'];
export const audioPartsFor=markdown=>isUsageContextContent(markdown)?['contexts']:['two','three'];
export const pointAudioPolicy='chapter-sentences-only-v3';
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
 if(isUsageContextContent(markdown))return contextAudioUnits(markdown);
 const units=[];let part='',example=false,sentence=false;
 for(const raw of markdown.replace(/\r/g,'').split('\n')){
  const line=raw.trim();if(!line)continue;
  const m=line.match(/^<!-- PART:(one|two|three) -->$/);if(m){part=m[1];continue;}
  if(part==='two'&&line.startsWith('<!-- EXAMPLE:')){example=true;continue;}
  if(part==='two'&&example&&!line.startsWith('<!--')){units.push({part,kind:'sentence',text:normalizeAudioText(line.replace(/\*|`/g,''))});example=false;}
  if(part==='three'&&line.startsWith('<!-- SENTENCE:')){sentence=true;continue;}
  if(part==='three'&&sentence&&!line.startsWith('<!--')){units.push({part,kind:'sentence',text:normalizeAudioText(line.replace(/\*|`/g,''))});sentence=false;}
 }
 return units.filter(u=>u.text&&u.kind==='sentence');
}
export function uniqueAudioUnits(units){const seen=new Set();return units.filter(u=>{const k=pronunciationKey(u.text,u.phonemes);if(seen.has(k))return false;seen.add(k);return true;});}
export function pointAudioKeys(markdown){return new Set(audioUnits(markdown).filter(u=>!u.unsupported&&(u.kind!=='word'||u.ipa)).map(u=>pronunciationKey(u.text,u.phonemes||'')));}
export function isPointAudioClip(clip,keys){return clip.voice==='af_bella'&&keys.has(pronunciationKey(clip.text,clip.phonemes||''));}
export function isChapterAudioRequest(markdown,text,kind,phonemes=''){
 if(kind!=='sentence'||phonemes)return false;
 // Validate only the requested unit. Building every heading/IPA/sentence for each
 // click can exhaust the free Worker's CPU before a paid response is saved.
 const wanted=normalizeAudioText(text);
 if(isUsageContextContent(markdown))return contextAudioUnits(markdown).some(unit=>unit.text===wanted);
 let part='',example=false,sentence=false;
 for(const raw of markdown.split('\n')){
  const line=raw.trim();if(!line)continue;
  if(line.startsWith('<!-- PART:')){const m=line.match(/^<!-- PART:(one|two|three) -->$/);if(m){part=m[1];continue;}}
   if(part==='two'&&line.startsWith('<!-- EXAMPLE:')){example=true;continue;}
   if(part==='three'&&line.startsWith('<!-- SENTENCE:')){sentence=true;continue;}
   if((part==='two'&&example||part==='three'&&sentence)&&!line.startsWith('<!--')){
    if(part==='two')example=false;else sentence=false;
    if(normalizeAudioText(line.replace(/\*|`/g,''))===wanted)return true;
   }
 }
 return false;
}
function contextAudioUnits(markdown){
 const units=[];let contextId='',translation=false,pending='';
 for(const raw of markdown.replace(/\r/g,'').split('\n')){
  const line=raw.trim();if(!line)continue;
  const context=/^<!-- CONTEXT:([A-Za-z][A-Za-z0-9_-]{0,31}) USE:[^ ]+ KIND:(?:abridgment|excerpt|example) -->$/.exec(line);
  if(context){contextId=context[1];translation=false;pending='';continue;}
  if(line.startsWith('<!-- END_CONTEXT:')){contextId='';translation=false;pending='';continue;}
  if(!contextId)continue;
  if(line===`<!-- TRANSLATION:${contextId} -->`){translation=true;pending='';continue;}
  if(translation)continue;
  const sentence=/^<!-- SENTENCE:([A-Za-z][A-Za-z0-9_-]{0,31})(?: USE:[^ ]+)? -->$/.exec(line);
  if(sentence){pending=sentence[1];continue;}
  if(pending&&!line.startsWith('<!--')){units.push({part:'contexts',kind:'sentence',text:normalizeAudioText(line.replace(/\*|`/g,'')),contextId,sentenceId:pending});pending='';}
 }
 return units.filter(u=>u.text);
}
export function audioCost(characters){return audioPrice.usdPerMillion.map(rate=>characters*rate/1e6*audioPrice.usdCny);}
export function costLabel(range){return range[1]===0?'¥0':range[1]<.01?'不足 ¥0.01':`约 ¥${range[0].toFixed(2)}–${range[1].toFixed(2)}`;}

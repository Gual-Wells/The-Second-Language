import {cachedPronunciation,keepPronunciation,chapterIdentity} from './audio-library.js?v=26';
import {audioUnits,headingWord,ipaToKokoro,pronunciationKey} from './audio-plan.js?v=26';
export function installReaderSpeech({toast,onWordJump=()=>{}}){
 const mode=document.getElementById('speechMode'),label=document.getElementById('speechModeLabel'),stopButton=document.getElementById('speechStop'),buffers=new Map();let context,current,serial=0;
 function renderMode(){mode.dataset.mode='word';label.textContent='点读';mode.removeAttribute('aria-pressed');mode.setAttribute('aria-label','点读说明');}
 renderMode();
 function stop(){serial++;if(current)try{current.stop();}catch{}current=null;stopButton.hidden=true;stopButton.textContent='停止';}
 function clear(){stop();buffers.clear();}
 mode.onclick=()=>toast('词汇标题读词，例句和范文读整句；例句标题返回词汇');stopButton.onclick=stop;
 async function api(path,options={}){const r=await fetch(path,{credentials:'same-origin',...options});let b;try{b=await r.json();}catch{throw Error('朗读服务暂不可用');}if(!r.ok)throw Error(b.error||'发音请求未完成');return b;}
 function prepareTap(){try{context??=new(window.AudioContext||window.webkitAudioContext)({latencyHint:'playback'});context.resume().catch(()=>{});}catch{}}
 let titleUnits=[];
 async function say(text,kind,ipa=''){
  if(!/[A-Za-z]/.test(text))return;stop();const ticket=serial;stopButton.hidden=false;stopButton.textContent='取消';
  try{
   try{if(navigator.audioSession)navigator.audioSession.type='playback';}catch{}
   // Resume inside the original tap before awaiting any network work on iPhone.
   context??=new(window.AudioContext||window.webkitAudioContext)({latencyHint:'playback'});await context.resume();
   const phonemes=ipa?ipaToKokoro(ipa):'',cacheKey=pronunciationKey(text,phonemes||'');let audio=buffers.get(cacheKey);
   if(ipa&&!phonemes)throw Error('这个读音需要单独核对');
   if(!audio){const cached=await cachedPronunciation(text,phonemes);if(cached)audio=await context.decodeAudioData(await cached.arrayBuffer());}
   if(!audio){
    if(!navigator.onLine)throw Error('这段声音尚未下载，请联网后点读');
    toast('正在准备声音…');let result=await api('/api/practice/pronunciation',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({text,kind,...(ipa?{ipa}:{}),...chapterIdentity()})});
    for(let i=0;result.state==='calling'&&i<240;i++){
     if(ticket!==serial)return;await new Promise(resolve=>setTimeout(resolve,1000));if(ticket!==serial)return;
     result=await api('/api/practice/pronunciation/'+result.id);
    }
    if(ticket!==serial)return;
    if(result.state==='waiting_credit')throw Error('声音余额不足，请充值后重新点读；已有声音仍可播放');
    if(result.state!=='ready')throw Error(result.state==='outcome_unknown'?'声音请求结果待核对，不会重复付费重试':'朗读暂不可用，请稍后再试');
    const response=await fetch(result.audioUrl,{credentials:'same-origin'});if(!response.ok)throw Error('声音暂时无法读取');await keepPronunciation(result.id,response,text,phonemes);audio=await context.decodeAudioData(await response.arrayBuffer());
    if(buffers.size>=30)buffers.delete(buffers.keys().next().value);buffers.set(cacheKey,audio);
   }
   if(ticket!==serial)return;
   const source=context.createBufferSource();source.buffer=audio;source.connect(context.destination);current=source;stopButton.textContent='停止';source.onended=()=>{if(ticket===serial){current=null;stopButton.hidden=true;}};source.start();
  }catch(error){if(ticket===serial){stop();toast(error.message||'朗读暂不可用');}}
 }
 document.getElementById('article').addEventListener('click',event=>{
  if(event.target.closest('button,a,.story-translation,.mono'))return;
  if(window.getSelection()?.isCollapsed===false)return;
  if(document.getElementById('article').classList.contains('highlight-sentences')&&event.target.closest('.linked-use'))return;
  const part=document.getElementById('article').dataset.audioPart;let unit;
  if(part==='two'&&event.target.closest('.word-heading h1')){event.preventDefault();event.stopImmediatePropagation();stop();onWordJump(event.target.closest('.word-entry')?.dataset.wordId);return;}
  if(part==='one'){
   const heading=event.target.closest('h1,h2,h3');
   if(heading){const wordId=heading.closest('.word-entry')?.dataset.wordId,word=headingWord(heading.textContent);
    if(heading.tagName==='H1')unit=titleUnits.find(u=>u.unit===wordId&&u.text===word);
    else {const ipa=heading.textContent.match(/\/[^/]+\/\s*$/)?.[0]?.trim();unit=titleUnits.find(u=>u.wordId===wordId&&u.text===word&&u.ipa===ipa);}
    if(!unit?.ipa){toast('这个标题的读音需要核对');return;}
   }
  }
  if(!unit&&part==='two'){const sentence=event.target.closest('.example-pair p');if(sentence)unit={text:sentence.textContent,kind:'sentence'};}
  if(!unit&&part==='three'){const sentence=event.target.closest('.story-sentence');if(sentence)unit={text:sentence.textContent,kind:'sentence'};}
  if(unit){event.preventDefault();event.stopImmediatePropagation();say(unit.text,unit.kind,unit.ipa||'');}
 },true);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});document.getElementById('practiceButton').addEventListener('click',stop,true);window.addEventListener('tsl-stop-speech',stop);return{stop,clear,prepareTap,setChapter:markdown=>{titleUnits=audioUnits(markdown).filter(u=>u.part==='one');}};
}

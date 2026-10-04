export function installReaderSpeech({toast}){
 const mode=document.getElementById('speechMode'),stopButton=document.getElementById('speechStop'),key='tsl-bella-speech-v1',buffers=new Map();let settings;try{settings=JSON.parse(localStorage.getItem(key)||'{}');}catch{settings={};}
 mode.value=['off','word','sentence'].includes(settings?.mode)?settings.mode:'off';let context,current,serial=0;
 const save=()=>{try{localStorage.setItem(key,JSON.stringify({mode:mode.value}));}catch{}};
 function stop(){serial++;if(current)try{current.stop();}catch{}current=null;stopButton.hidden=true;stopButton.textContent='停止';}
 function clear(){stop();buffers.clear();}
 mode.onchange=()=>{stop();save();};stopButton.onclick=stop;
 async function api(path,options={}){const r=await fetch(path,{credentials:'same-origin',...options});let b;try{b=await r.json();}catch{throw Error('Bella 发音服务暂不可用');}if(!r.ok)throw Error(b.error||'发音请求未完成');return b;}
 async function say(text,kind){
  if(!/[A-Za-z]/.test(text))return;stop();const ticket=serial;stopButton.hidden=false;stopButton.textContent='取消';
  try{
   if(!navigator.onLine)throw Error('Bella 发音需要联网');
   try{if(navigator.audioSession)navigator.audioSession.type='playback';}catch{}
   // Resume inside the original tap before awaiting any network work on iPhone.
   context??=new(window.AudioContext||window.webkitAudioContext)({latencyHint:'playback'});await context.resume();
   const cacheKey=text.replace(/\s+/g,' ').trim();let audio=buffers.get(cacheKey);
   if(!audio){
    toast('正在准备 Bella 发音…');let result=await api('/api/practice/pronunciation',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({text,kind})});
    for(let i=0;result.state==='calling'&&i<240;i++){
     if(ticket!==serial)return;await new Promise(resolve=>setTimeout(resolve,1000));if(ticket!==serial)return;
     result=await api('/api/practice/pronunciation/'+result.id);
    }
    if(ticket!==serial)return;
    if(result.state==='waiting_credit')throw Error('声音余额不足，已保留进度；充值后次日可继续');
    if(result.state!=='ready')throw Error(result.state==='outcome_unknown'?'声音请求结果待核对，不会重复付费重试':'Bella 发音暂不可用，请稍后再试');
    const response=await fetch(result.audioUrl,{credentials:'same-origin'});if(!response.ok)throw Error('声音暂时无法读取');audio=await context.decodeAudioData(await response.arrayBuffer());
    if(buffers.size>=30)buffers.delete(buffers.keys().next().value);buffers.set(cacheKey,audio);
   }
   if(ticket!==serial)return;
   const source=context.createBufferSource();source.buffer=audio;source.connect(context.destination);current=source;stopButton.textContent='停止';source.onended=()=>{if(ticket===serial){current=null;stopButton.hidden=true;}};source.start();
  }catch(error){if(ticket===serial){stop();toast(error.message||'Bella 发音暂不可用');}}
 }
 document.getElementById('article').addEventListener('click',event=>{
  if(mode.value==='off'||event.target.closest('button,a,code,.story-translation,.mono'))return;
  let text='';if(mode.value==='sentence'){
   const sentence=event.target.closest('.story-sentence,.example-pair p');if(sentence)text=sentence.textContent;else if(event.target.closest('.word-heading h1'))text=event.target.closest('h1').textContent;
  }else{
   const range=document.caretRangeFromPoint?.(event.clientX,event.clientY);let node=range?.startContainer,offset=range?.startOffset;
   if(!node){const pos=document.caretPositionFromPoint?.(event.clientX,event.clientY);node=pos?.offsetNode;offset=pos?.offset;}
   if(node?.nodeType===Node.TEXT_NODE&&document.getElementById('article').contains(node))for(const m of node.textContent.matchAll(/[A-Za-z]+(?:['’-][A-Za-z]+)*/g))if(offset>=m.index&&offset<=m.index+m[0].length){text=m[0];break;}
  }
  if(!text&&event.target.closest('.word-heading h1'))text=event.target.closest('h1').textContent;
  if(text){event.preventDefault();event.stopImmediatePropagation();say(text,mode.value);}
 },true);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});document.getElementById('practiceButton').addEventListener('click',stop,true);window.addEventListener('tsl-stop-speech',stop);return{stop,clear};
}

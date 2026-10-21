import {SoundDirector} from './labs/certification-reader/sound.js?v=38';

// Only finished, actual artifacts belong here. No row is synthesized from a
// chapter index or a score, and the specimen's original status stays unchanged.
export const READING_WORKS=Object.freeze([
 Object.freeze({number:1,chapter:'one',chapterId:'2026-10-02',issued:false}),
 Object.freeze({number:5,chapter:'five',chapterId:'2026-10-12',issued:false})
]);
const chinese=new Intl.NumberFormat('zh-CN',{style:'decimal'});
const name=n=>`第${({1:'一',5:'五'})[n]||chinese.format(n)}章`;
const prefKey='second-language-certification-sound-v1';
export function createCertificationReader({showDialog,stopLearningAudio=()=>{}}){
 const $=id=>document.getElementById(id),list=$('certificationCatalogue'),reader=$('certificationViewer'),stage=$('certificationStage');
 const sound=new SoundDirector();
 let saved;try{saved=JSON.parse(localStorage.getItem(prefKey)||'{}');}catch{saved={};}
 const preferences={music:saved.music===true,foley:saved.foley===true,musicVolume:Number.isFinite(saved.musicVolume)?saved.musicVolume:.35,foleyVolume:Number.isFinite(saved.foleyVolume)?saved.foleyVolume:.65};
 let viewer=null,selected=null,request=0,ready=false,lost=false,controlsTimer=0,returnToList=false;
 const setStatus=(text,error=false)=>{$('certificationLoading').hidden=!text;$('certificationStatus').textContent=text;$('certificationRetry').hidden=!error;};
 function soundControls(){
  $('certificationMusic').checked=preferences.music;$('certificationFoley').checked=preferences.foley;
  $('certificationMusicVolume').value=Math.round(preferences.musicVolume*100);$('certificationFoleyVolume').value=Math.round(preferences.foleyVolume*100);
  sound.setMusicEnabled(preferences.music);sound.setFoleyEnabled(preferences.foley);sound.setMusicVolume(preferences.musicVolume);sound.setFoleyVolume(preferences.foleyVolume);
  $('certificationSound').setAttribute('aria-pressed',String(preferences.music||preferences.foley));
 }
 function saveSound(){try{localStorage.setItem(prefKey,JSON.stringify(preferences));}catch{}soundControls();}
 function showControls(){
  clearTimeout(controlsTimer);stage.classList.add('controls-visible');$('certificationHud').inert=false;
  if($('certificationSoundPanel').hidden&&ready&&!lost)controlsTimer=setTimeout(()=>{if(stage.contains(document.activeElement)&&document.activeElement!==$('certificationCanvas'))return;stage.classList.remove('controls-visible');$('certificationHud').inert=true;},3200);
 }
 function hideSound(){ $('certificationSoundPanel').hidden=true;$('certificationSound').setAttribute('aria-expanded','false');showControls(); }
 function resize(){const b=stage.getBoundingClientRect();viewer?.resize(b.width,b.height);}
 function freshCanvas(){for(const id of ['certificationCanvas','certificationMist']){const old=$(id),next=old.cloneNode(false);old.replaceWith(next);}}
 function releaseViewer(){request++;ready=false;lost=false;viewer?.dispose();viewer=null;freshCanvas();$('certificationStatic').removeAttribute('src');$('certificationStatic').hidden=true;}
 async function view(work){
  stopLearningAudio();returnToList=true;
  // The catalogue's settings return must not fire while moving into its child.
  const parent=list.returnDialog;list.returnDialog=null;list.close();list.savedReturn=parent;
  if(!reader.open)reader.showModal();selected=work;releaseViewer();const ticket=request;
  hideSound();setStatus('正在准备卷轴…');sound.setActive(true);soundControls();
  // Resume within the actual chapter tap. Loading never waits for audio.
  sound.unlock().catch(()=>{});resize();
  try{
   const {ScrollViewer}=await import('./labs/certification-reader/reader.bundle.js?v=38');
   if(ticket!==request||!reader.open)return;
   viewer=new ScrollViewer($('certificationCanvas'),$('certificationMist'),{
    onProgress:state=>sound.motion(state),
    onStatus:(text,meta)=>{
     if(ticket!==request||!reader.open)return;
     if(['failed','context-lost','restoring'].includes(meta.status)){
      lost=true;ready=false;const image=viewer?.exportDocument();if(image){$('certificationStatic').src=image;$('certificationStatic').hidden=false;}
      setStatus(meta.status==='restoring'?'正在恢复显示…':'显示暂时中断，可重试。',meta.status!=='restoring');showControls();
     }else if(meta.status==='ready'){lost=false;ready=true;$('certificationStatic').hidden=true;setStatus('');showControls();}
    }
   });
   resize();await viewer.prepare({chapter:work.chapter,initialProgress:0});
   if(ticket!==request||!reader.open)return;
   ready=true;setStatus('');viewer.bindPointerInput();showControls();
   $('certificationCanvas').addEventListener('pointerdown',()=>{showControls();sound.unlock().catch(()=>{});});
   $('certificationCanvas').addEventListener('keydown',event=>{if(['Enter',' '].includes(event.key)){event.preventDefault();viewer.animate(viewer.animation?(viewer.animation.to?0:1):(viewer.progress>.5?0:1));}});
  }catch(error){if(ticket===request&&reader.open){console.error('Certification reader',error);ready=false;setStatus('卷轴暂未载入，请重试。',true);showControls();}}
 }
 for(const work of READING_WORKS){const button=document.createElement('button');button.type='button';button.className='settings-row certification-chapter';button.textContent=work.label||name(work.number);if(work.number)button.dataset.chapter=String(work.number);else button.dataset.work=work.id;button.addEventListener('click',()=>view(work));$('certificationChapters').append(button);}
 $('certificationReaderButton').addEventListener('click',()=>{stopLearningAudio();showDialog('certificationCatalogue');});
 $('certificationBack').addEventListener('click',()=>reader.close());
 $('certificationRetry').addEventListener('click',()=>{if(selected)view(selected);});
 $('certificationSound').addEventListener('click',()=>{const opening=$('certificationSoundPanel').hidden;$('certificationSoundPanel').hidden=!opening;$('certificationSound').setAttribute('aria-expanded',String(opening));showControls();if(opening)$('certificationMusic').focus();});
 $('certificationSoundClose').addEventListener('click',hideSound);
 for(const [id,key]of [['certificationMusic','music'],['certificationFoley','foley']])$(id).addEventListener('change',()=>{preferences[key]=$(id).checked;saveSound();sound.unlock().catch(()=>{$('certificationSoundStatus').textContent='声音被系统暂停，请再次轻触开关。';});});
 for(const [id,key]of [['certificationMusicVolume','musicVolume'],['certificationFoleyVolume','foleyVolume']])$(id).addEventListener('input',()=>{preferences[key]=Number($(id).value)/100;saveSound();});
 reader.addEventListener('close',()=>{
  clearTimeout(controlsTimer);releaseViewer();sound.setActive(false);hideSound();setStatus('');
  if(returnToList){returnToList=false;list.returnDialog=list.savedReturn||'settingsDialog';list.savedReturn=null;requestAnimationFrame(()=>{if(!document.querySelector('dialog[open]'))list.showModal();});}
 });
 reader.addEventListener('cancel',event=>{if(!$('certificationSoundPanel').hidden){event.preventDefault();hideSound();}});
 stage.addEventListener('pointerdown',event=>{if(!event.target.closest('.certification-sound-panel')&&!event.target.closest('#certificationSound'))hideSound();else showControls();});
 stage.addEventListener('keydown',()=>showControls());
 document.addEventListener('visibilitychange',()=>{if(document.hidden){viewer?.pause();sound.pause();}else if(reader.open){viewer?.resume();sound.resume();}});
 globalThis.addEventListener('pagehide',()=>{viewer?.pause();sound.setActive(false);});
 globalThis.addEventListener('pageshow',()=>{if(reader.open){viewer?.resume();sound.setActive(true);sound.resume();}});
 new ResizeObserver(resize).observe(stage);soundControls();
 // Read-only diagnostics are useful for testing lifecycle without issuing data.
 return {snapshot:()=>({open:reader.open,ready,lost,chapter:selected?.number??null,category:selected?.category||'chapter-specimen',issued:selected?.issued??false,viewer:viewer?.snapshot(),sound:sound.snapshot()}),setProgress:p=>viewer?.setProgress(p),openChapter:n=>view(READING_WORKS.find(w=>w.number===n)),exportRecord:()=>viewer?.exportRecord(),exportDocument:()=>viewer?.exportDocument()};
}

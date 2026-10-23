import {SoundDirector} from './labs/certification-reader/sound.js?v=42';

// Only published work is catalogued. Original research specimens stay in labs.
export const READING_WORKS=Object.freeze([
 Object.freeze({id:'project-beginning',category:'project-commemorative',label:'项目纪念',chapter:'beginning',issued:false})
]);
const fullSHA=/^[0-9a-f]{64}$/;
const validInstant=value=>typeof value==='string'&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)&&Number.isFinite(Date.parse(value));
async function readerAPI(path,options={}){const response=await fetch(path,{credentials:'same-origin',cache:'no-store',...options});const value=await response.json();if(!response.ok)throw Error(value.error||'暂时无法读取，请稍后重试。');return value;}
function localInstant(value){
 if(!validInstant(value))return null;
 const p=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',fractionalSecondDigits:3,hourCycle:'h23'}).formatToParts(new Date(value)).map(({type,value})=>[type,value]));
 return `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}:${p.second}.${p.fractionalSecond} +08:00`;
}
function manuscriptLines(copy){return [copy.rubric,copy.institution,copy.artTitle,'',...copy.verse.slice(0,3),'',...copy.verse.slice(3),'',...copy.colophon,'',...copy.sealLegends,copy.status].filter(value=>typeof value==='string');}
export function createCertificationReader({showDialog,api=readerAPI,stopLearningAudio=()=>{}}){
 const $=id=>document.getElementById(id),list=$('certificationCatalogue'),reader=$('certificationViewer'),stage=$('certificationStage'),panel=$('certificationDocumentPanel');
 const sound=new SoundDirector();
 // Product defaults: old saved mute/false preferences are not read or applied.
 sound.setMusicEnabled(true);sound.setFoleyEnabled(true);
 let viewer=null,selected=null,request=0,ready=false,lost=false,controlsTimer=0,returnToList=false;
 let documentRecord=null,documentIdentity='',language='en';
 let catalogueRequest=0,works=[...READING_WORKS];
 function chapterLabel(number){const value=String(number).replace(/课/g,'章');return /^\d+$/.test(value)?`第 ${value} 章`:value;}
 function renderCatalogue(){const host=$('certificationChapters');host.replaceChildren();for(const work of works){const button=document.createElement('button');button.type='button';button.className='settings-row certification-chapter';button.textContent=work.label;button.dataset.work=work.id;button.addEventListener('click',()=>view(work));host.append(button);}}
 async function loadCatalogue(){const ticket=++catalogueRequest;works=[...READING_WORKS];renderCatalogue();$('certificationCatalogueNotice').hidden=false;$('certificationCatalogueStatus').textContent='正在读取…';$('certificationCatalogueRetry').hidden=true;try{const data=await api('/api/scrolls');if(ticket!==catalogueRequest||!list.open)return;works.push(...(data.items||[]).filter(item=>item.category==='chapter-certified'&&item.claimedAt&&item.status==='ready').map(item=>({...item,label:chapterLabel(item.chapterNumber),issued:true})));renderCatalogue();$('certificationCatalogueNotice').hidden=true;}catch(error){if(ticket!==catalogueRequest||!list.open)return;$('certificationCatalogueStatus').textContent='章节卷轴暂未载入。项目纪念仍可阅览。';$('certificationCatalogueRetry').hidden=false;}}
 function openCatalogue(){stopLearningAudio();showDialog('certificationCatalogue');list.returnDialog||='settingsDialog';loadCatalogue();}
 const setStatus=(text,error=false)=>{$('certificationLoading').hidden=!text;$('certificationStatus').textContent=text;$('certificationRetry').hidden=!error;};
 function showControls(){
  clearTimeout(controlsTimer);stage.classList.add('controls-visible');$('certificationHud').inert=false;
  if(panel.hidden&&ready&&!lost)controlsTimer=setTimeout(()=>{if(stage.contains(document.activeElement)&&document.activeElement!==$('certificationCanvas'))return;stage.classList.remove('controls-visible');$('certificationHud').inert=true;},3200);
 }
 function setLanguage(next,{focus=false}={}){
  language=next;
  for(const [lang,tabId,pageId]of [['en','certificationEnglishTab','certificationEnglishPage'],['zh-CN','certificationChineseTab','certificationChinesePage']]){
   const active=lang===language,tab=$(tabId),page=$(pageId);tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;page.hidden=!active;page.inert=!active;if(active&&focus)tab.focus();
  }
  $('certificationCopyText').textContent=language==='en'?'复制英文原稿':'复制中文译稿';$('certificationCopyStatus').textContent='';
 }
 function hideDocument({focus=false}={}){panel.hidden=true;panel.inert=true;stage.classList.remove('document-open');$('certificationCanvas').inert=false;$('certificationDocument').setAttribute('aria-expanded','false');showControls();if(focus&&reader.open)$('certificationCanvas').focus({preventScroll:true});}
 function clearDocument(){
  documentRecord=null;documentIdentity='';$('certificationEnglishCopy').replaceChildren();$('certificationChineseCopy').replaceChildren();$('certificationDocumentNotice').hidden=false;$('certificationDocumentNotice').textContent='正在准备文书…';$('certificationDocumentMetadata').hidden=true;
  for(const id of ['certificationCopyText','certificationCopyCode','certificationCopyTime'])$(id).disabled=true;setLanguage('en');
 }
 function renderCopy(container,copy){
  container.replaceChildren();const add=(tag,text,className)=>{const el=document.createElement(tag);el.textContent=text;if(className)el.className=className;container.append(el);};
  add('p',copy.rubric,'document-rubric');add('h3',copy.institution);add('h4',copy.artTitle);if(documentRecord?.category==='project-commemorative'){add('p',copy.verse.slice(0,3).join('\n'),'document-verse');add('p',copy.verse.slice(3).join('\n'),'document-verse');}else add('p',copy.verse.join('\n'),'document-verse');add('p',copy.colophon.join('\n'),'document-colophon');add('p',copy.sealLegends.join('\n'),'document-impression');add('p',copy.status,'document-kind');
 }
 function updateDocument(){
  const record=viewer?.exportRecord();if(!record)return;const copy=record.copy,translation=copy?.translation;
  if(!copy||!translation||![copy,translation].every(c=>typeof c.institution==='string'&&typeof c.artTitle==='string'&&Array.isArray(c.verse)&&Array.isArray(c.colophon)&&Array.isArray(c.sealLegends)))return;
  const identity=`${record.sha256}|${record.publishedAt??''}`;if(identity===documentIdentity)return;documentRecord=record;documentIdentity=identity;
  renderCopy($('certificationEnglishCopy'),copy);renderCopy($('certificationChineseCopy'),translation);
  const made=localInstant(record.madeAt),published=localInstant(record.publishedAt),code=fullSHA.test(record.sha256||'')?record.sha256:null;
  $('certificationMadeAt').textContent=made||'未记录';if(made)$('certificationMadeAt').dateTime=record.madeAt;else $('certificationMadeAt').removeAttribute('datetime');
  $('certificationShortCode').textContent=code?code.slice(0,16).toUpperCase().match(/.{4}/g).join(' '):'未记录';$('certificationContentCode').textContent=code||'未记录';
  $('certificationPublishedRow').hidden=!published;$('certificationPublishedAt').textContent=published||'';if(published)$('certificationPublishedAt').dateTime=record.publishedAt;else $('certificationPublishedAt').removeAttribute('datetime');
  const passed=localInstant(record.passedAt);$('certificationPassedRow').hidden=!passed;$('certificationPassedAt').textContent=passed||'';if(passed)$('certificationPassedAt').dateTime=record.passedAt;else $('certificationPassedAt').removeAttribute('datetime');
  $('certificationDocumentNotice').hidden=true;$('certificationDocumentMetadata').hidden=false;$('certificationCopyText').disabled=false;$('certificationCopyCode').disabled=!code;$('certificationCopyTime').disabled=!made;
 }
 async function copyText(text){
  if(!text)return;const ticket=request;let copied=false;
  try{if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(text);copied=true;}}catch{}
  if(ticket!==request||!reader.open||panel.hidden)return;
  if(!copied){const active=document.activeElement,buffer=document.createElement('textarea');buffer.className='certification-copy-buffer';buffer.value=text;buffer.readOnly=true;panel.append(buffer);buffer.select();buffer.setSelectionRange(0,text.length);try{copied=document.execCommand('copy');}catch{}finally{buffer.remove();if(active?.isConnected)active.focus({preventScroll:true});}}
  if(ticket===request&&reader.open&&!panel.hidden)$('certificationCopyStatus').textContent=copied?'已复制':'未能自动复制，可长按文字选择复制。';
 }
 function documentText(){
  if(!documentRecord)return '';const english=language==='en',r=documentRecord,copy=english?r.copy:r.copy.translation,mark=r.sha256.slice(0,16).toUpperCase().match(/.{4}/g).join(' ');
  const metadata=[`${english?'Made':'制作时间'}: ${localInstant(r.madeAt)}`,`${english?'Content mark':'内容短码'}: ${mark}`,`${english?'Content SHA-256':'完整内容认证码（SHA-256）'}: ${r.sha256}`];if(validInstant(r.passedAt))metadata.push(`${english?'First passed':'首次认证通过'}: ${localInstant(r.passedAt)}`);if(validInstant(r.publishedAt))metadata.push(`${english?'Published':'发行时间'}: ${localInstant(r.publishedAt)}`);return [...manuscriptLines(copy),'',...metadata].join('\n');
 }
 function resize(){const b=stage.getBoundingClientRect();viewer?.resize(b.width,b.height);}
 function freshCanvas(){for(const id of ['certificationCanvas','certificationMist']){const old=$(id),next=old.cloneNode(false);old.replaceWith(next);}}
 function releaseViewer(){request++;ready=false;lost=false;viewer?.dispose();viewer=null;freshCanvas();clearDocument();$('certificationStatic').removeAttribute('src');$('certificationStatic').hidden=true;}
 function unlockSound(){sound.unlock().catch(()=>{});}
 async function view(work){
  if(!work||!works.includes(work))throw Error('该作品不在正式目录中');stopLearningAudio();returnToList=true;
  const parent=list.returnDialog;list.returnDialog=null;list.close();list.savedReturn=parent;if(!reader.open)reader.showModal();selected=work;releaseViewer();const ticket=request;
  hideDocument();setStatus('正在准备卷轴…');sound.setMusicEnabled(true);sound.setFoleyEnabled(true);sound.setActive(true);
  // Synchronous call in the actual work click, before imports or awaits.
  unlockSound();resize();
  try{
   let manifest=null;if(work.issued){const detail=await api(`/api/scrolls/${encodeURIComponent(work.id)}`);if(ticket!==request||!reader.open)return;if(!detail.claimedAt||detail.status!=='ready'||detail.manifest?.viewer?.record?.certificationId!==work.certificationId)throw Error('该卷轴尚未领取或记录不一致');manifest=detail.manifest.viewer;}
   const {ScrollViewer}=await import('./labs/certification-reader/reader.bundle.js?v=43');if(ticket!==request||!reader.open)return;
   viewer=new ScrollViewer($('certificationCanvas'),$('certificationMist'),{onProgress:state=>sound.motion({...state,mode:viewer?.drag?'drag':'automatic'}),onStatus:(text,meta)=>{
    if(ticket!==request||!reader.open)return;updateDocument();
    if(['failed','context-lost','restoring'].includes(meta.status)){lost=true;ready=false;const image=viewer?.exportDocument();if(image){$('certificationStatic').src=image;$('certificationStatic').hidden=false;}setStatus(meta.status==='restoring'?'正在恢复显示…':'显示暂时中断，可重试。',meta.status!=='restoring');showControls();}
    else if(meta.status==='ready'){lost=false;ready=true;$('certificationStatic').hidden=true;setStatus('');showControls();}
   }});
   resize();await viewer.prepare(manifest?{manifest,scrollId:work.id,initialProgress:0}:{chapter:work.chapter,initialProgress:0});if(ticket!==request||!reader.open)return;ready=true;setStatus('');updateDocument();viewer.bindPointerInput();showControls();
   $('certificationCanvas').addEventListener('pointerdown',()=>{showControls();unlockSound();});$('certificationCanvas').addEventListener('keydown',event=>{if(['Enter',' '].includes(event.key)){event.preventDefault();unlockSound();viewer.animate(viewer.animation?(viewer.animation.to?0:1):(viewer.progress>.5?0:1));}});
  }catch(error){if(ticket===request&&reader.open){console.error('Certification reader',error);updateDocument();ready=false;setStatus('卷轴暂未载入，请重试。',true);showControls();}}
 }
 renderCatalogue();$('certificationReaderButton').addEventListener('click',openCatalogue);$('certificationCatalogueRetry').addEventListener('click',loadCatalogue);document.addEventListener('certification-open-catalogue',openCatalogue);document.addEventListener('certification-updated',()=>{if(list.open)loadCatalogue();});list.addEventListener('close',()=>{catalogueRequest++;});$('certificationBack').addEventListener('click',()=>reader.close());$('certificationRetry').addEventListener('click',()=>{if(selected)view(selected);});
 $('certificationDocument').addEventListener('click',()=>{if(!panel.hidden){hideDocument({focus:true});return;}updateDocument();panel.hidden=false;panel.inert=false;stage.classList.add('document-open');$('certificationCanvas').inert=true;$('certificationDocument').setAttribute('aria-expanded','true');showControls();setLanguage(language,{focus:true});unlockSound();});
 $('certificationDocumentClose').addEventListener('click',()=>hideDocument({focus:true}));
 for(const [id,lang]of [['certificationEnglishTab','en'],['certificationChineseTab','zh-CN']])$(id).addEventListener('click',()=>setLanguage(lang));
 $('certificationDocumentTabs').addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();setLanguage(event.key==='Home'?'en':event.key==='End'?'zh-CN':language==='en'?'zh-CN':'en',{focus:true});});
 $('certificationCopyText').addEventListener('click',()=>copyText(documentText()));$('certificationCopyCode').addEventListener('click',()=>copyText(documentRecord?.sha256));$('certificationCopyTime').addEventListener('click',()=>copyText(localInstant(documentRecord?.madeAt)));
 reader.addEventListener('close',()=>{clearTimeout(controlsTimer);releaseViewer();sound.setActive(false);hideDocument();clearTimeout(controlsTimer);setStatus('');if(returnToList){returnToList=false;list.returnDialog=list.savedReturn||'settingsDialog';list.savedReturn=null;requestAnimationFrame(()=>{if(!document.querySelector('dialog[open]'))list.showModal();});}});
 reader.addEventListener('cancel',event=>{if(!panel.hidden){event.preventDefault();hideDocument({focus:true});}});
 stage.addEventListener('pointerdown',event=>{if(!panel.hidden&&!event.target.closest('.certification-document-panel')&&!event.target.closest('#certificationDocument'))hideDocument();else showControls();});stage.addEventListener('keydown',()=>showControls());
 document.addEventListener('visibilitychange',()=>{if(document.hidden){viewer?.pause();sound.pause();}else if(reader.open){viewer?.resume();sound.resume();}});globalThis.addEventListener('pagehide',()=>{viewer?.pause();sound.setActive(false);});globalThis.addEventListener('pageshow',()=>{if(reader.open){viewer?.resume();sound.setActive(true);sound.resume();}});
 new ResizeObserver(resize).observe(stage);clearDocument();hideDocument();
 return {snapshot:()=>({open:reader.open,ready,lost,chapter:selected?.chapterId??null,workId:selected?.id??null,category:selected?.category??null,issued:selected?.issued===true,viewer:viewer?.snapshot(),sound:sound.snapshot(),document:{open:!panel.hidden,language,ready:Boolean(documentRecord),madeAt:documentRecord?.madeAt??null,publishedAt:documentRecord?.publishedAt??null,contentSHA256:documentRecord?.sha256??null}}),setProgress:p=>viewer?.setProgress(p),openCatalogue,refresh:loadCatalogue,openWork:id=>view(works.find(w=>w.id===id)),exportRecord:()=>viewer?.exportRecord(),exportDocument:()=>viewer?.exportDocument()};
}

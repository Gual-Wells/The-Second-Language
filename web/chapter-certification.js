const node=(tag,text,className)=>{const el=document.createElement(tag);if(text)el.textContent=text;if(className)el.className=className;return el;};
const date=value=>new Date(value).toLocaleString('zh-CN',{year:'numeric',month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'});

// This is part of the chapter-test window. It never creates a certificate from
// a score on the client, nor inserts an unclaimed artwork into the collection.
export function createChapterCertification({api,onCatalogue=()=>{}}){
 let serial=0,container=null,chapter=null,busy=false;
 async function mount(host,chapterId){
  const ticket=++serial;container=host;chapter=chapterId;if(!host)return;
  host.replaceChildren();host.hidden=true;
  try{const state=await api(`/api/certifications?chapter=${encodeURIComponent(chapterId)}`);if(ticket!==serial||!host.isConnected)return;render(host,state,ticket);}
  catch(error){if(ticket!==serial||!host.isConnected)return;host.hidden=false;host.append(node('p','认证记录暂未载入。','chapter-certification-note'));const retry=node('button','重新读取','bevel-button');retry.type='button';retry.onclick=()=>mount(host,chapterId);host.append(retry);}
 }
 function render(host,{certification,scroll},ticket){
  host.replaceChildren();host.hidden=!certification;if(!certification)return;
  host.append(node('h3','本章已认证'),node('p',`首次通过：${date(certification.passedAt)}`,'chapter-certification-note'));
  const message=scroll?.claimedAt?'纪念卷轴已领取，可在认证阅览中重温。':scroll?.status==='ready'?'纪念卷轴已经制作完成。':scroll?.status==='attention'?'制作已保留进度，待处理后继续。':scroll?.status==='failed'?'制作暂未完成，已保留原件与认证记录。':scroll?'纪念卷轴正在制作，完成后可在这里领取。':'首次通过记录永久保留；重测不改变认证。可以申请制作本章的纪念卷轴。';
  host.append(node('p',message,'chapter-certification-note'));
  const button=node('button',scroll?.claimedAt?'前往认证阅览':scroll?.status==='ready'?'领取纪念卷轴':scroll?'刷新制作状态':'申请纪念卷轴','bevel-button');button.type='button';host.append(button);
  const status=node('p','','chapter-certification-note');status.setAttribute('role','status');host.append(status);
  button.onclick=async()=>{
   if(busy||ticket!==serial)return;if(scroll?.claimedAt){onCatalogue();return;}
   if(scroll&&scroll.status!=='ready'){await mount(host,chapter);return;}
   if(!navigator.onLine){status.textContent='请联网后继续。';return;}
   if(!scroll&&!confirm('申请制作本章纪念卷轴？提交后将按本章内容独立创作，已有认证与作品不会重复生成。'))return;
   const currentChapter=chapter;busy=true;button.disabled=true;status.textContent=scroll?'正在领取…':'正在提交申请…';
   try{
    if(scroll)await api(`/api/scrolls/${encodeURIComponent(scroll.id)}/claim`,{method:'POST',headers:{'content-type':'application/json'},body:'{}'});
    else{
     const key=`second-language-scroll-request:${certification.id}`;let id;try{id=localStorage.getItem(key);}catch{}id||=crypto.randomUUID();try{localStorage.setItem(key,id);}catch{}
     await api('/api/scrolls/request',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id,certificationId:certification.id})});try{localStorage.removeItem(key);}catch{}
    }
    document.dispatchEvent(new CustomEvent('certification-updated'));if(ticket===serial)await mount(host,currentChapter);
   }catch(error){if(ticket===serial)status.textContent=error.message||'暂未完成，请重试。';}finally{busy=false;if(button.isConnected)button.disabled=false;}
  };
 }
 return {mount,clear(){serial++;container=null;chapter=null;},refresh(){if(container?.isConnected&&chapter&&!busy)mount(container,chapter);}};
}

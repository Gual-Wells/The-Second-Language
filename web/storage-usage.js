export function createStorageUsageUI({api,showDialog}){
 const $=id=>document.getElementById(id),format=n=>{if(!Number.isFinite(n))return '未核实';const units=['B','KB','MB','GB','TB'];let i=0;while(n>=1000&&i<4){n/=1000;i++;}return `${n.toLocaleString('zh-CN',{maximumFractionDigits:i<2?0:2})} ${units[i]}`;},date=n=>new Date(n).toLocaleString('zh-CN',{timeZone:'Asia/Shanghai',hour12:false});
 const node=(tag,text,cls)=>{const n=document.createElement(tag);if(text!=null)n.textContent=text;if(cls)n.className=cls;return n;};
 let scope='language',generation=0;
 const dialog=$('storageUsageDialog'),currentRequest=current=>current===generation&&dialog.open;
 dialog.addEventListener('close',()=>{if(!dialog.open)generation++;});
 const scopes=node('div',null,'storage-scope');scopes.setAttribute('aria-label','存储范围');
 for(const [id,label] of [['language','第二语言'],['series','第二系列']]){const button=node('button',label,'bevel-button');button.type='button';button.dataset.scope=id;button.onclick=()=>{scope=id;open();};scopes.append(button);}
 $('storageUsageStatus').before(scopes);
 function seriesCards(result,list){
  const names=new Map(result.projects.map(p=>[p.id,p.name]));
  for(const p of result.capacityGroups){
   const card=node('section',null,'balance-card'),heading=node('div',null,'balance-heading');
   heading.append(node('strong',p.name),node('span',format(p.usedBytes),'balance-amount'));card.append(heading);
   const state={planned:'待接入',verified:'已验证',active:'已接入'}[p.state]||'待核实';
   const limit=p.limitBytes??p.providerPlanLimitBytes;
   card.append(node('p',state+' · '+({relational:'事务与状态',cache:'近期缓存',file:'永久文件',archive:'低频档案'}[p.kind]||'存储')));
   card.append(node('small',(p.limitBytes!=null?'容量上限：':'方案容量：')+format(limit)+'（账户共享）'));
   if(p.state==='active'&&Number.isFinite(p.usedBytes)&&limit>0){const meter=document.createElement('progress');meter.className='storage-meter';meter.max=limit;meter.value=Math.min(p.usedBytes,limit);meter.setAttribute('aria-label',p.name+'存储占用');card.append(meter);}
   for(const child of result.resources.filter(r=>r.scope==='project'&&r.quotaGroup===p.id))card.append(node('small',child.name+'：'+format(child.usedBytes)+' / '+format(child.limitBytes??child.providerPlanLimitBytes)));
   if(p.projectAttributedBytes)for(const [id,value] of Object.entries(p.projectAttributedBytes))card.append(node('small',(names.get(id)||id)+'：'+format(value)));
   if(p.otherUsedBytes!=null)card.append(node('small','其他资源：'+format(p.otherUsedBytes)));
   if(p.measurement==='inventory')card.append(node('small','按文件目录盘点；剩余容量尚未核实。'));
   if(p.measurement==='daily-high-water')card.append(node('small','最近有记录日期的存储高位，非实时占用。'));
   card.append(node('small',p.observedAt?'核对：'+date(p.observedAt)+(p.stale?' · 旧记录':''):'尚无核对记录'));
   if(p.updateFailed)card.append(node('small','最近一次更新未成功，以上保留原记录。'));
   list.append(card);
  }
 }
 async function open(){const current=++generation;showDialog('storageUsageDialog');$('storageUsageStatus').textContent='读取存储记录…';const list=$('storageUsagePools');list.replaceChildren();
  for(const button of scopes.children)button.setAttribute('aria-pressed',String(button.dataset.scope===scope));
  if(scope==='series'){try{const result=await api('/api/series/storage');if(!currentRequest(current))return;seriesCards(result,list);$('storageUsageStatus').textContent='各存储池分别计算容量；显示上次核对记录。';}catch(e){if(currentRequest(current))$('storageUsageStatus').textContent=e.message||'存储记录暂不可用';}return;}
  try{const result=await api('/api/storage/usage');if(!currentRequest(current))return;for(const p of result.pools){const card=node('section',null,'balance-card'),heading=node('div',null,'balance-heading');heading.append(node('strong',p.name),node('span',format(p.usedBytes),'balance-amount'));card.append(heading,node('p',p.note));
   const limit=p.pool==='onedrive'?format(p.limitBytes):p.pool==='kv'?'1 GB（账户共享）':'500 MB（单库）';card.append(node('small','容量上限：'+limit));
   if(Number.isFinite(p.usedBytes)&&p.limitBytes>0){const meter=document.createElement('progress');meter.className='storage-meter';meter.max=p.limitBytes;meter.value=Math.min(p.usedBytes,p.limitBytes);meter.setAttribute('aria-label',p.name+'存储占用');card.append(meter);}
   if(p.pool==='onedrive'){card.append(node('small','本项目：'+format(p.projectBytes)));if(typeof p.freeFits==='boolean')card.append(node('p',p.freeFits?'免费版 5 GB 可容纳当前文件。':'当前文件已超过免费版 5 GB。',p.freeFits?'storage-fit':'balance-warning'));if(p.statisticsDiffer)card.append(node('small','账户用量与目录统计不一致；免费版评估按较大值计算。'));}
   if(p.pool==='kv'){card.append(node('small','章节缓存：'+format(p.chapterCacheBytes)+' · 练习缓存：'+format(p.practiceCacheBytes)));if(p.measurementDate)card.append(node('small',p.measurementDate+' 当天存储高位，包含同账户其他项目。'));}
   card.append(node('small',p.checkedAt?'核对：'+date(p.checkedAt)+(p.stale?' · 旧记录':''):'尚无核对记录'));
   if(p.updateFailed)card.append(node('small','最近一次更新未成功，以上保留原记录。'));
   if(p.near)card.append(node('p',['main','practice','lab'].includes(p.pool)?'数据库空间增长较多，需要检查容量。':'存储空间接近上限。','balance-warning'));list.append(card);}
   $('storageUsageStatus').textContent='上次核对的存储记录';
  }catch(e){if(currentRequest(current))$('storageUsageStatus').textContent=e.message||'存储记录暂不可用';}
 }
 $('storageUsageButton').addEventListener('click',open);return{open};
}

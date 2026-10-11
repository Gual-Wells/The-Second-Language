export function createStorageUsageUI({api,showDialog}){
 const $=id=>document.getElementById(id),format=n=>{if(!Number.isFinite(n))return '未核实';const units=['B','KB','MB','GB','TB'];let i=0;while(n>=1000&&i<4){n/=1000;i++;}return `${n.toLocaleString('zh-CN',{maximumFractionDigits:i<2?0:2})} ${units[i]}`;},date=n=>new Date(n).toLocaleString('zh-CN',{timeZone:'Asia/Shanghai',hour12:false});
 const node=(tag,text,cls)=>{const n=document.createElement(tag);if(text!=null)n.textContent=text;if(cls)n.className=cls;return n;};
 async function open(){showDialog('storageUsageDialog');$('storageUsageStatus').textContent='读取存储记录…';const list=$('storageUsagePools');list.replaceChildren();
  try{const result=await api('/api/storage/usage');for(const p of result.pools){const card=node('section',null,'balance-card'),heading=node('div',null,'balance-heading');heading.append(node('strong',p.name),node('span',format(p.usedBytes),'balance-amount'));card.append(heading,node('p',p.note));
   const limit=p.pool==='onedrive'?format(p.limitBytes):p.pool==='kv'?'1 GB（账户共享）':'500 MB（单库）';card.append(node('small','容量上限：'+limit));
   if(Number.isFinite(p.usedBytes)&&p.limitBytes>0){const meter=document.createElement('progress');meter.className='storage-meter';meter.max=p.limitBytes;meter.value=Math.min(p.usedBytes,p.limitBytes);meter.setAttribute('aria-label',p.name+'存储占用');card.append(meter);}
   if(p.pool==='onedrive'){card.append(node('small','本项目：'+format(p.projectBytes)));if(typeof p.freeFits==='boolean')card.append(node('p',p.freeFits?'免费版 5 GB 可容纳当前文件。':'当前文件已超过免费版 5 GB。',p.freeFits?'storage-fit':'balance-warning'));if(p.statisticsDiffer)card.append(node('small','账户用量与目录统计不一致；免费版评估按较大值计算。'));}
   if(p.pool==='kv'){card.append(node('small','章节缓存：'+format(p.chapterCacheBytes)+' · 练习缓存：'+format(p.practiceCacheBytes)));if(p.measurementDate)card.append(node('small',p.measurementDate+' 当天存储高位，包含同账户其他项目。'));}
   card.append(node('small',p.checkedAt?'核对：'+date(p.checkedAt)+(p.stale?' · 旧记录':''):'尚无核对记录'));
   if(p.updateFailed)card.append(node('small','最近一次更新未成功，以上保留原记录。'));
   if(p.near)card.append(node('p',['main','practice','lab'].includes(p.pool)?'数据库空间增长较多，需要检查容量。':'存储空间接近上限。','balance-warning'));list.append(card);}
   $('storageUsageStatus').textContent='上次核对的存储记录';
  }catch(e){$('storageUsageStatus').textContent=e.message||'存储记录暂不可用';}
 }
 $('storageUsageButton').addEventListener('click',open);return{open};
}

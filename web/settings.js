export function installSettingsNavigation() {
 const $=id=>document.getElementById(id),sheet=$('settingsDialog').querySelector('.sheet'),head=sheet.querySelector('.sheet-head');
 const sections=[...sheet.querySelectorAll('.settings-section')],home=document.createElement('div'),detail=document.createElement('div'),back=document.createElement('button');
 home.className='settings-home';detail.className='settings-detail';detail.hidden=true;
 back.type='button';back.className='bevel-button settings-back';back.textContent='‹ 设置';back.hidden=true;head.prepend(back);sheet.append(home,detail);
 const titles=['正文点读','学习目标','临时推送','休息安排','音频下载','服务额度','提醒','主屏幕与账户','音频配置'];
 function reset(){home.hidden=false;detail.hidden=true;back.hidden=true;$('settingsTitle').textContent='阅读器设置';}
 function show(index){home.hidden=true;detail.hidden=false;back.hidden=false;$('settingsTitle').textContent=titles[index];for(const [i,section]of sections.entries())section.hidden=i!==index;}
 back.onclick=reset;
 function group(title,indices){const band=document.createElement('div');band.className='section-band';band.textContent=title;home.append(band);for(const index of indices){const row=document.createElement('button');row.type='button';row.className='settings-row';const text=document.createElement('span');text.textContent=titles[index];const arrow=document.createElement('b');arrow.textContent='›';row.append(text,arrow);row.onclick=()=>show(index);home.append(row);}}
 group('阅读',[0,8]);
 const audio=sections[4];audio.hidden=false;audio.classList.add('settings-audio-row');home.append(audio);
 group('学习安排',[1,2,3]);group('服务与账户',[5,6,7]);
 for(const [i,section]of sections.entries())if(i!==4)detail.append(section);
 $('settingsDialog').addEventListener('close',reset);
 return {reset};
}

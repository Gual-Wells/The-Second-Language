export function createBalanceUI({api,showDialog}){
 const $=id=>document.getElementById(id);
 const money=p=>p.verified?(p.unit==='USD'?`$${p.remaining.toFixed(3)}`:`${Math.floor(p.remaining).toLocaleString()} ${p.unit==='calls'?'计费次':'Neurons'}`):p.pool==='tencent'?'套餐余量待核实':'未核实';
 const date=value=>value?new Date(value).toLocaleString('zh-CN',{timeZone:'Asia/Shanghai',hour12:false}):'尚无记录';
 async function open(){
  showDialog('balancesDialog');$('balanceStatus').textContent='正在读取上次任务记录…';$('balancePools').replaceChildren();$('balanceEstimates').replaceChildren();
  try{
   const result=await api('/api/balances');
   for(const p of result.pools){
    const card=document.createElement('section');card.className='balance-card';
    const heading=document.createElement('div');heading.className='balance-heading';
    const name=document.createElement('strong');name.textContent={openrouter:'OpenRouter',cloudflare:'Whisper · 每日免费额度',tencent:'腾讯云 · 口语专项'}[p.pool];
    const amount=document.createElement('span');amount.className='balance-amount';amount.textContent=money(p);heading.append(name,amount);
    const note=document.createElement('p');note.textContent=p.note;
    const time=document.createElement('small');time.textContent=`核对：${date(p.checkedAt)}${p.stale?' · 旧记录，请以服务商当前账户为准':''}`;
    card.append(heading,note,time);
    if(Number.isFinite(p.cashBalanceCny)){const cash=document.createElement('small');cash.textContent=`现金余额（补充）：¥${p.cashBalanceCny.toFixed(2)}`;card.append(cash);}
    if(p.expiresAt){const expiry=document.createElement('small');expiry.textContent=`套餐到期：${date(p.expiresAt)}`;card.append(expiry);}
    if(p.refreshAt){const reset=document.createElement('small');reset.textContent=`该记录对应刷新时间：${date(p.refreshAt)}`;card.append(reset);}
    if(p.low){const warning=document.createElement('p');warning.className='balance-warning';warning.textContent=p.warning;card.append(warning);}
    $('balancePools').append(card);
   }
   for(const e of result.estimates){
    const item=document.createElement('div');item.className='balance-estimate';
    const title=document.createElement('strong');title.textContent=e.task;
    const amount=document.createElement('p');amount.textContent=`${e.pool} · ${e.value}`;
    const basis=document.createElement('small');basis.textContent=e.basis;item.append(title,amount,basis);$('balanceEstimates').append(item);
   }
   $('balanceStatus').textContent='余额来自最近一次任务末尾核对；本页不会触发实时查询或付费调用。';
  }catch(e){$('balanceStatus').textContent=e.message;}
 }
 $('balanceButton').addEventListener('click',open);
 return {open};
}

export function createBalanceUI({api,showDialog}){
 const $=id=>document.getElementById(id);
 const money=p=>Number.isFinite(p.remaining)?(p.unit==='USD'?`$${p.remaining.toFixed(3)}`:`${Math.floor(p.remaining).toLocaleString()} ${p.unit==='calls'?'计费次':'Neurons'}`):p.pool==='tencent'?'套餐余量待核实':'未核实';
 const date=value=>value?new Date(value).toLocaleString('zh-CN',{timeZone:'Asia/Shanghai',hour12:false}):'尚无记录';
 async function open(){
  showDialog('balancesDialog');$('balanceStatus').textContent='读取额度记录…';$('balancePools').replaceChildren();$('balanceEstimates').replaceChildren();
  try{
   const result=await api('/api/balances');
   for(const p of result.pools){
    const card=document.createElement('section');card.className='balance-card';
    const heading=document.createElement('div');heading.className='balance-heading';
    const name=document.createElement('strong');name.textContent={openrouter:'OpenRouter',cloudflare:'Whisper · 每日免费额度',tencent:'腾讯云 · 口语专项'}[p.pool];
    const amount=document.createElement('span');amount.className='balance-amount';amount.textContent=money(p);heading.append(name,amount);
    const note=document.createElement('p');note.textContent=p.note;
    const time=document.createElement('small');time.textContent=`${p.estimated?'更新':'核对'}：${date(p.checkedAt)}${p.stale?' · 旧记录':''}`;
    card.append(heading,note,time);
    if(Number.isFinite(p.cashBalanceCny)){const cash=document.createElement('small');cash.textContent=`现金余额（补充）：¥${p.cashBalanceCny.toFixed(2)}`;card.append(cash);}
    if(p.uncertainCalls){const pending=document.createElement('small');pending.textContent=`${p.uncertainCalls} 次调用待核对`;card.append(pending);}
    if(p.expiresOn){const expiry=document.createElement('small');expiry.textContent=`套餐有效至 ${p.expiresOn}`;card.append(expiry);}
    if(p.expiresAt){const expiry=document.createElement('small');expiry.textContent=`套餐到期：${date(p.expiresAt)}`;card.append(expiry);}
    if(p.refreshAt){const reset=document.createElement('small');reset.textContent=`刷新：${date(p.refreshAt)}`;card.append(reset);}
    if(p.low){const warning=document.createElement('p');warning.className='balance-warning';warning.textContent=p.warning;card.append(warning);}
    $('balancePools').append(card);
   }
   const format=(range,pool)=>{
    if(range[1]===0)return '0';
    const value=n=>pool==='openrouter'?'$'+(n===0?'0':n.toFixed(n<.01?4:3)):Math.ceil(n).toLocaleString();
    return range[0]===range[1]?value(range[1]):value(range[0])+'–'+value(range[1]);
   };
   const selector=document.createElement('select');selector.className='text-input';selector.setAttribute('aria-label','学习任务用量');
   const all=document.createElement('option');all.value='all';all.textContent='所有学习任务';selector.append(all);
   for(const [i,e]of result.estimates.entries()){const option=document.createElement('option');option.value=String(i);option.textContent=e.task;selector.append(option);}
   $('balanceEstimates').append(selector);const items=[];
   for(const e of result.estimates){
    const item=document.createElement('section');item.className='balance-estimate';
    const title=document.createElement('strong');title.textContent=e.task;
    const detail=document.createElement('small');detail.textContent=e.detail;
    const values=document.createElement('dl');values.className='balance-costs';
    for(const [pool,label]of [['openrouter','OpenRouter · 美元'],['cloudflare','Whisper · Neurons'],['tencent','腾讯 · 计费次']]){
     const pair=document.createElement('div'),name=document.createElement('dt'),amount=document.createElement('dd');
     name.textContent=label;amount.textContent=format(e.costs[pool],pool);pair.append(name,amount);values.append(pair);
    }
    item.append(title,detail,values);$('balanceEstimates').append(item);items.push(item);
   }
   const filter=()=>items.forEach((item,i)=>item.hidden=selector.value!=='all'&&selector.value!==String(i));selector.value=result.estimates.length?'0':'all';selector.onchange=filter;filter();
   $('balanceStatus').textContent='上次更新的额度记录';
  }catch(e){$('balanceStatus').textContent=e.message;}
 }
 $('balanceButton').addEventListener('click',open);
 return {open};
}

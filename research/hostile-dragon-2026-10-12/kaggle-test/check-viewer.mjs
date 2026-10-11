import {spawn} from 'node:child_process';
import {writeFile,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname),out=resolve(root,process.argv[3]||'outputs/coin-viewer');
if(!out.startsWith(resolve(root,'outputs')+'/')&&!out.startsWith(resolve(root,'outputs')+'\\'))throw new Error('Review output must remain task local');
await mkdir(out,{recursive:true});
const profile=resolve(root,'tmp/chrome-cdp-review'),cache=resolve(root,'cache/chrome');
await mkdir(profile,{recursive:true});await mkdir(cache,{recursive:true});
const port=9236;
const child=spawn('C:/Program Files/Google/Chrome/Application/chrome.exe',[
  '--headless=new','--enable-unsafe-swiftshader','--no-first-run','--disable-background-networking','--disable-component-update',
  `--user-data-dir=${profile}`,`--disk-cache-dir=${cache}`,`--remote-debugging-port=${port}`,'--window-size=1100,900','about:blank'
],{windowsHide:true,stdio:'ignore',env:{...process.env,TEMP:resolve(root,'tmp'),TMP:resolve(root,'tmp')}});
let socket;const report={stage:'browser_check',errors:[],screenshots:[]};let serial=0;const pending=new Map();
const delay=ms=>new Promise(r=>setTimeout(r,ms));
function call(method,params={}){
  return new Promise((resolve,reject)=>{
    const id=++serial,timer=setTimeout(()=>{pending.delete(id);reject(new Error(`Timeout: ${method}`))},65000);
    pending.set(id,{resolve,reject,timer});socket.send(JSON.stringify({id,method,params}));
  });
}
async function image(name){await delay(800);const shot=await call('Page.captureScreenshot',{format:'png'});await writeFile(resolve(out,name),Buffer.from(shot.data,'base64'));report.screenshots.push(name)}
try{
  let targets;for(let n=0;n<50;n++){try{targets=await(await fetch(`http://127.0.0.1:${port}/json/list`)).json();if(targets.some(t=>t.type==='page'))break}catch{}await delay(200)}
  const target=targets?.find(t=>t.type==='page');if(!target)throw new Error('Browser endpoint unavailable');
  socket=new WebSocket(target.webSocketDebuggerUrl);await new Promise((r,j)=>{socket.onopen=r;socket.onerror=j});
  socket.onmessage=event=>{
    const message=JSON.parse(event.data);if(message.id){const p=pending.get(message.id);if(!p)return;clearTimeout(p.timer);pending.delete(message.id);message.error?p.reject(new Error(message.error.message)):p.resolve(message.result)}
    else if(message.method==='Runtime.exceptionThrown')report.errors.push(message.params.exceptionDetails.exception?.description||message.params.exceptionDetails.text);
  };
  await call('Runtime.enable');await call('Page.enable');await call('Network.enable');await call('Network.setCacheDisabled',{cacheDisabled:true});
  await call('Emulation.setDeviceMetricsOverride',{width:1100,height:900,deviceScaleFactor:1,mobile:false});
  const url=process.argv[2]||'http://127.0.0.1:8767/coin-viewer/';
  if(!url.startsWith('http://127.0.0.1:8767/coin-viewer/'))throw new Error('Only task preview accepted');
  await call('Page.navigate',{url});
  const loaded=await call('Runtime.evaluate',{expression:`new Promise(resolve=>{const started=Date.now();const timer=setInterval(()=>{if(document.body?.dataset.loaded==='true'){clearInterval(timer);resolve({loaded:true,status:document.querySelector('#status').textContent})}else if(Date.now()-started>55000){clearInterval(timer);resolve({loaded:false,status:document.querySelector('#status')?.textContent,error:document.querySelector('#error')?.textContent})}},200)})`,awaitPromise:true,returnByValue:true});
  report.load=loaded.result.value;await image('interactive-front.png');
  if(!report.load.loaded)throw new Error('Model not ready: '+JSON.stringify(report.load));
  await call('Runtime.evaluate',{expression:"document.querySelector('#back').click()"});await image('interactive-back.png');
  await call('Runtime.evaluate',{expression:"document.querySelector('#front').click();document.querySelector('#clay').click()"});await image('interactive-clay.png');
  report.stage='actual_model_and_controls_verified';
}catch(error){report.stage='browser_check_failed';report.error=String(error)}
finally{
  await writeFile(resolve(out,'browser-review.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
  if(socket?.readyState===1){try{await call('Browser.close')}catch{}socket.close()}
  child.kill();for(const p of pending.values()){clearTimeout(p.timer);p.reject(new Error('Browser closed'))}pending.clear();
}

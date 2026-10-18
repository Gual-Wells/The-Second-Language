import {createServer} from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const root=path.resolve('.cache/scroll-v15/resources'),out=path.resolve('research/scroll-lab-v15/resource-trials');await mkdir(out,{recursive:true});
await mkdir('.cache/scroll-v15/tmp',{recursive:true});process.env.TEMP=process.env.TMP=path.resolve('.cache/scroll-v15/tmp');
const server=createServer(async(req,res)=>{try{const p=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://local').pathname)),file=p.endsWith(path.sep)?p+'index.html':p;if(!file.startsWith(root+path.sep))throw Error('path');const type={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.jpg':'image/jpeg','.gz':'application/octet-stream'}[path.extname(file)]??'application/octet-stream';res.setHeader('Content-Type',type);res.end(await readFile(file));}catch{res.statusCode=404;res.end('Not found');}});await new Promise(r=>server.listen(0,'127.0.0.1',r));
const {chromium}=await import(pathToFileURL('D:/CodexStorage/workspaces/second-language-maintenance/.cache/browser-tools/package/index.mjs'));
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',proxy:{server:'http://127.0.0.1:6987'},args:['--no-first-run']});
try{
 const evidence=[];
 for(const [name,url]of [['smoke','realistic-smoke/examples/minimal.html'],['volume','volume-renderer/index.html']]){
  const p=await browser.newPage({viewport:{width:402,height:874},deviceScaleFactor:2}),errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.goto(`http://127.0.0.1:${server.address().port}/${url}`);await p.waitForTimeout(8000);
  if(name==='volume'){
   const selects=p.locator('select');const options=await selects.evaluateAll(es=>es.map(e=>[...e.options].map(x=>x.value)));
   for(let i=0;i<options.length;i++)if(options[i].includes('Animated Smoke')){await selects.nth(i).selectOption('Animated Smoke');break;}
   const labels=p.locator('.lil-gui .name');const count=await labels.count();for(let i=0;i<count;i++){const text=await labels.nth(i).innerText();if(/^Load Sample$/i.test(text)){await labels.nth(i).click();break;}}
   await p.waitForTimeout(5000);
  }
  for(const i of [0,1,2]){await p.screenshot({path:path.join(out,`${name}-original-${i}.png`),scale:'css'});await p.waitForTimeout(1600);}
  evidence.push({name,url,errors,body:(await p.locator('body').innerText()).slice(0,1600)});await p.close();
 }
 await writeFile(path.join(out,'inspection.json'),JSON.stringify(evidence,null,2));console.log(JSON.stringify(evidence));
}finally{await browser.close();await new Promise(r=>server.close(r));}

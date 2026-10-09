// Actual unchanged browser physics worker in a Node worker, independent of software WebGL stalls.
import {Worker,parentPort} from 'node:worker_threads';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
if(parentPort){globalThis.postMessage=v=>parentPort.postMessage(v);globalThis.onmessage=null;parentPort.on('message',data=>globalThis.onmessage?.({data}));await import('../web/labs/certification-v2/physics-worker.js');}
else{
 const results=[],w=new Worker(new URL(import.meta.url));let latest=null,lastJar=null,ready=false,fail=null;
 w.on('error',e=>fail=e);w.on('message',m=>{if(m.type==='ready')ready=true;if(m.type==='error')fail=Error(m.message);if(m.type==='snapshot'){latest=m.stats;lastJar=m.jar;w.postMessage({type:'ack'});}});
 const until=async fn=>{const start=Date.now();while(!fn()){if(fail)throw fail;if(Date.now()-start>60000)throw Error('Physics progress timed out');await new Promise(r=>setTimeout(r,40));}};
 const inside=s=>s.bounds.maxRadius<1.53&&s.bounds.minY>-2.16&&s.bounds.maxY<2.22;
 try{await until(()=>ready);for(const count of [32,128,500]){
  latest=null;w.postMessage({type:'init',count});await until(()=>latest?.count===count&&latest.steps>=20);assert(inside(latest),'initial fit '+count);
  if(count===32){await until(()=>latest.sleeping===count);const at=latest.steps,impacts=latest.impacts;await new Promise(r=>setTimeout(r,300));assert.equal(latest.steps,at);assert.equal(latest.impacts,impacts);results.push({case:'rest-sleeps-without-new-impacts',...latest});}
  const before=latest.steps;w.postMessage({type:'shake',strength:2});await until(()=>latest.steps>=before+90);assert(inside(latest),'shake confinement '+count);assert(latest.impacts>0);results.push({case:'shake',...latest});
  if(count===32){for(const [name,gravity]of [['tilt',{x:7,y:-6.87,z:0}],['inverted',{x:0,y:9.81,z:0}],['upright',{x:0,y:-9.81,z:0}]]){const step=latest.steps;w.postMessage({type:'input',gravity,linear:{x:0,y:0,z:0}});await until(()=>latest.steps>=step+90||latest.sleeping===count&&latest.steps>step+20);assert(inside(latest),name+' confinement');results.push({case:name,...latest});if(name==='tilt'){const at=latest.steps;w.postMessage({type:'input',gravity,linear:{x:2,y:0,z:0}});await until(()=>latest.steps>=at+8);assert(lastJar.position.y<2.35,'device acceleration rotates into world frame');assert(inside(latest));results.push({case:'tilted-linear-acceleration',...latest});}}
   w.postMessage({type:'pause',value:true});await new Promise(r=>setTimeout(r,120));const at=latest.steps;await new Promise(r=>setTimeout(r,240));assert.equal(latest.steps,at);w.postMessage({type:'pause',value:false});w.postMessage({type:'shake',strength:1});await until(()=>latest.steps>at+20);assert(inside(latest));results.push({case:'pause/resume',...latest});
  }
 }
 await mkdir('.cache/certification-v2',{recursive:true});await writeFile('.cache/certification-v2/physics-results.json',JSON.stringify({target:'Node actual Rapier worker; not iPhone performance',results},null,2));console.log(JSON.stringify({cases:results.length,results}));
 }finally{await w.terminate();}
}

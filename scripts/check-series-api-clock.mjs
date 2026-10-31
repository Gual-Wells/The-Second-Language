import assert from 'node:assert/strict';
import worker,{tickSeriesAPI} from '../worker/api-clock/src/index.mjs';
let called=[];const env=Object.fromEntries(['LANGUAGE_API','ALGORITHM_API','SCHEDULE_API','LEDGER_API'].map(name=>[name,{run:async(...args)=>{assert.equal(args.length,0);called.push(name);return {completed:true,privateAnswer:'must never be forwarded'};}}]));
const states=await tickSeriesAPI(env);assert.equal(called.length,4);assert(!JSON.stringify(states).includes('privateAnswer'));assert(!JSON.stringify(states).includes('must never'));
const partial=await tickSeriesAPI({...env,SCHEDULE_API:{run:async()=>{throw Error('private error');}}});assert.equal(partial.find(s=>s.project==='schedule').status,'unavailable');assert.equal(partial.find(s=>s.project==='language').status,'completed');
const unavailable=await tickSeriesAPI({...env,LANGUAGE_API:{run:async()=>({configured:false,privateAnswer:'not logged'})}});assert.equal(unavailable[0].status,'unconfigured');assert(!JSON.stringify(unavailable).includes('privateAnswer'));
assert.equal((await worker.fetch(new Request('https://clock.invalid/run'))).status,404);
process.stdout.write(JSON.stringify({ok:true,checks:4,paidCalls:0})+'\n');

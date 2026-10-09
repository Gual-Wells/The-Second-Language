import assert from 'node:assert/strict';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fixture,correctAnswers} from '../trials/certification-lab/fixture.mjs';
import {bankV2,chapterV2} from '../worker/src/certification-bank-v2.js';
import {createPaper} from '../worker/src/certification-lab.js';
import {splitMotion,MotionInput,fromTo,rotate,screenVector} from '../web/labs/certification-v2/motion.js';
const checks=[],check=(name,value)=>{assert.ok(value,name);checks.push(name);},f=await fixture();
const down={x:0,y:-9.81,z:0},quiet={acceleration:{x:0,y:0,z:0},accelerationIncludingGravity:down};
try{
 check('v2 chapter matches actual content',createHash('sha256').update(await readFile('chapters/2026-10-09/chapter.md')).digest('hex')===chapterV2.digest);
 check('semantic choices only, twenty distinct learning targets',bankV2.every(q=>['single','multi'].includes(q.type))&&new Set(bankV2.map(q=>q.target)).size===20);
 const seeds=new Set();for(let i=0;i<200;i++){const p=createPaper('v2');assert.equal(p.items.length,16);assert.equal(new Set(p.items.map(q=>q.target)).size,16);assert(!seeds.has(p.seed));seeds.add(p.seed);for(const q of p.items){assert(q.correct.every(id=>q.options.some(o=>o.id===id)));assert(q.correct.length<q.options.length);}}
 check('200 independent papers, sixteen distinct targets and valid shuffled answer keys',true);
 check('old page still defaults to eight questions',createPaper().items.length===8);
 check('unsupported version rejected',(await f.request('/attempts',{id:crypto.randomUUID(),version:'v3'})).status===400);
 const id=crypto.randomUUID(),p=(await f.request('/attempts',{id,version:'v2'})).data;
 check('new page receives sixteen questions without answer leakage',p.items.length===16&&p.items.every(q=>!('correct'in q)&&!('sourceId'in q)&&!('explanation'in q)));
 check('retry version changes cannot replace immutable paper',JSON.stringify((await f.request('/attempts',{id,version:'v1'})).data)===JSON.stringify(p));
 const answers=correctAnswers(f.privatePaper(id));const q=f.privatePaper(id).items[0];answers[q.id]=q.type==='multi'?[q.options.find(o=>!q.correct.includes(o.id)).id]:q.options.find(o=>!q.correct.includes(o.id)).id;
 const failed=await f.request('/attempts/'+id+'/submit',{answers,timing:{foregroundMs:620100,elapsedMs:790000,backgroundCount:2,noise:'no'}});
 check('one wrong answer fails and records bounded timing',failed.data.result.score===93.75&&!failed.data.result.passed&&failed.data.result.timing.foregroundMs===620100&&!('noise'in failed.data.result.timing));
 check('retry of submitted answers preserves timing and result',JSON.stringify((await f.request('/attempts/'+id+'/submit',{answers,timing:{foregroundMs:1}})).data)===JSON.stringify(failed.data));
 for(let i=0;i<5;i++){const rid=crypto.randomUUID();await f.request('/attempts',{id:rid,version:'v2'});await f.request('/attempts/'+rid+'/submit',{answers:correctAnswers(f.privatePaper(rid))});}
 check('five perfect retries create only one preview certificate',f.sqlite.prepare('SELECT count(*) n FROM lab_certificates').get().n===1);
 check('abandoned research proxy removed',(await f.request('/research-source/river',null,{isPublisher:true})).status===404);
 const split=splitMotion({acceleration:{x:2,y:0,z:0},accelerationIncludingGravity:{x:2,y:-9.81,z:0}});assert.deepEqual(split.gravity,down);check('linear acceleration subtracted once, never double gravity',split.linear.x===2);
 check('missing linear acceleration is not guessed',splitMotion({accelerationIncludingGravity:down})===null);
 const m=new MotionInput();check('moving first reading cannot calibrate',!m.feed({acceleration:{x:3,y:0,z:0},accelerationIncludingGravity:{x:3,y:-9.81,z:0}},0,0));for(let i=0;i<11;i++)assert(!m.feed(quiet,0,100+i*16));check('requires twelve stable quiet samples',m.feed(quiet,0,276)&&m.stats().calibrated);
 for(let i=0;i<500;i++)m.feed(quiet,0,300+i*16);check('diagnostic trace remains bounded',m.stats().trace.length===12);
 check('screen rotation forces new calibration',!m.feed(quiet,90,9000)&&!m.stats().calibrated);
 const upside=rotate({x:0,y:9.81,z:0},fromTo({x:0,y:9.81,z:0},down));check('inversion produces finite aligned gravity',Math.abs(upside.y+9.81)<1e-6&&Object.values(upside).every(Number.isFinite));
 check('screen axis rotation maps correctly',Math.abs(screenVector({x:1,y:0,z:0},90).y-1)<1e-6);
 const response=hz=>{const x=new MotionInput();for(let i=0;i<12;i++)x.feed(quiet,0,i*1000/hz);for(let i=1;i<=hz;i++)x.feed({acceleration:{x:0,y:0,z:0},accelerationIncludingGravity:{x:4,y:-8.9,z:0}},0,(11+i)*1000/hz);return x.gravity.x;};check('one second tilt independent of sample rate',Math.abs(response(30)-response(60))<.002);
 for(const n of ['map','ledger','wetland']){const b=await readFile(`web/labs/certification-v2/assets/${n}-face.png`);assert(b.length>100000);assert.equal(b.subarray(1,4).toString(),'PNG');}
 for(const n of ['theme-map','theme-ledger','theme-wetland','glass-1','glass-2','glass-3','metal-1','metal-2','metal-3'])assert((await readFile(`web/labs/certification-v2/assets/${n}.mp3`)).length>1000);
 check('all three artworks and nine real audio assets present',true);
 await mkdir('.cache/certification-v2',{recursive:true});await writeFile('.cache/certification-v2/backend-results.json',JSON.stringify({checks,questionBank:bankV2.length,targets:20,draws:200,paidApiCalls:0},null,2));console.log(JSON.stringify({checks:checks.length,questions:bankV2.length,draws:200}));
}finally{f.close();}

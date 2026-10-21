import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {MaterialPath,RELEASE_END} from '../web/labs/chapter-scroll-v17/keeper-motion.js';
import {materialMotion} from '../web/labs/certification-reader/material-motion.js';
// Ground the test in the existing actual keeper path, not mock cue thresholds.
const path=new MaterialPath(JSON.parse(await readFile('web/labs/chapter-scroll-v17/keeper-path.json','utf8'))),trace=[],contacts=[];
const state=progress=>{const r=Math.min(1,progress/RELEASE_END),p=path.sample(r);return{progress,paperProgress:Math.max(0,(progress-RELEASE_END)/(1-RELEASE_END)),active:true,keeper:{r,phase:p.phase,pin:p.pin,angle:p.angle,along:p.along,feed:p.feed,slide:p.slide,depart:p.depart,visible:progress<RELEASE_END}};};
let previous=state(0),movingPaper=0,movingLeather=0;
for(const direction of [1,-1])for(let i=1;i<=600;i++){
 const current=state(direction===1?i/600:1-i/600),response=materialMotion(current,previous,5.6/600);
 assert.ok(response.paper>=0&&response.leather>=0&&response.paper<=.2&&response.leather<=.17);
 if(response.paper>0){assert.equal(current.keeper.r,1);assert.ok(current.paperProgress>0);assert.equal(response.leather,0);movingPaper++;}
 if(response.leather>0){assert.equal(current.paperProgress,0);assert.equal(current.keeper.visible,true);assert.ok(current.keeper.r<.95);assert.equal(response.paper,0);movingLeather++;}
 if(response.contact)contacts.push({kind:response.contact,progress:current.progress,r:current.keeper.r,phase:current.keeper.phase,pin:current.keeper.pin});
 if(i%12===0||response.contact)trace.push({direction,progress:current.progress,paperProgress:current.paperProgress,phase:current.keeper.phase,...response});
 previous=current;
}
assert.ok(movingPaper>500&&movingLeather>200);
assert.deepEqual(contacts.map(c=>c.kind),['prong-park','prong-seat']);
assert.equal(contacts[0].phase,'park-pin');assert.ok(contacts[0].pin< -1.16);
assert.equal(contacts[1].phase,'unload-hole');assert.ok(contacts[1].r<=.012);
for(const [current,prior,dt]of [[{...state(.65),active:false},state(.64),.016],[state(.6),state(.6),.016],[state(.9),state(.1),.016],[state(.62),state(.6),.7]]){
 const r=materialMotion(current,prior,dt);assert.equal(r.paper,0);assert.equal(r.leather,0);assert.equal(r.contact,null);
}
const out='research/scroll-reader-correction-2026-10-22';await mkdir(out,{recursive:true});
const report={checkedAt:new Date().toISOString(),checks:{realPathInput:true,materialPhaseSeparation:true,speedBounded:true,noStaticOrSeekFoley:true,noLateFrameFoley:true,onlyActualProngContact:true,forwardAndReverse:true},movingPaper,movingLeather,contacts,trace,scope:'CPU real keeper path and sound-parameter correspondence. Does not assert timbre/listening acceptance, WebAudio playback or physical simulation.'};
await writeFile(out+'/motion-verification.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({checks:report.checks,contacts}));

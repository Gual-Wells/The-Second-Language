import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {keeperPose,KEEPER} from '../web/labs/chapter-scroll-v7/keeper-path.js';
import {assertCharter,charterCopy,identityLines} from '../web/labs/chapter-scroll-v7/charter.js';
import {rollRadius} from '../web/labs/chapter-scroll/vendor/paperlab-roll.js';
const template={width:4.5,height:6.3,coreRadius:.145,layerThickness:.035},checks=[],check=(n,v)=>{assert.ok(v,n);checks.push(n);};
let minimumClearance=Infinity;
for(let i=0;i<=1000;i++){
 const p=i/1000,k=keeperPose(p,template);if(!k.visible)continue;
 const frontBound=2*rollRadius(template.height,template.coreRadius,template.layerThickness)+.04;
 minimumClearance=Math.min(minimumClearance,k.z-frontBound);
 assert.ok(k.z>frontBound+.02,'keeper plane penetrates conservative closed-roll front bound');
 assert.ok(p<.18,'keeper still present when paper begins to unwind');
 const half=KEEPER.width/2*Math.abs(Math.cos(k.rotationZ))+KEEPER.height/2*Math.abs(Math.sin(k.rotationZ));
 if(k.opacity<.999)assert.ok(k.x+half<-template.width/2-.03,'keeper fades while still above paper silhouette');
 if(k.phase==='lift')assert.ok(Math.abs(k.x)<1e-12,'sideways movement begins before lifting');
 if(k.phase==='slide')assert.ok(k.z>=k.paperFront+.279,'slide loses forward clearance');
}
check('visible keeper remains in front of conservative complete roll bounds',minimumClearance>.02);
check('fade starts only outside the rotated rectangular keeper footprint',true);
check('paper stays wound until the keeper has departed',true);
let jump=0;for(const r of [.22,.82,.84,1]){const a=keeperPose(r*.18-1e-7,template),b=keeperPose(r*.18+1e-7,template);jump=Math.max(jump,Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z),Math.abs(a.opacity-b.opacity));}check('phase boundaries have no pose or opacity jumps',jump<.0001);
const source=JSON.parse(await readFile('web/labs/chapter-scroll-v7/chapter-sample.json','utf8'));assertCharter(source);
check('published specimen has no invented passing event',source.status==='specimen'&&source.attestation===null&&identityLines(source)[0]==='UNISSUED SPECIMEN');
check('specimen prose does not grant certification',charterCopy(source).paragraphs.join(' ').includes('grants no certification'));
assert.throws(()=>assertCharter({...source,status:'issued'}));check('missing real-event fields prevent an issued presentation',true);
// Isolated contract fixture; never submitted to a backend or published as a record.
const fixture={...source,status:'issued',attestation:{id:'synthetic-fixture',attemptId:'synthetic-attempt',assessmentVersion:'synthetic-version',allCorrect:true,publicCode:'A1B2C3D4E5F67890',passedAt:'2026-10-17T00:01:02.345Z'}};
assertCharter(fixture);assert.deepEqual(identityLines(fixture),['A1B2 C3D4 E5F6 7890','2026-10-17  08:01:02.345  +08:00']);
check('identity preserves four hex groups, milliseconds and explicit display offset',true);
assert.throws(()=>assertCharter({...fixture,attestation:{...fixture.attestation,passedAt:'2026-02-31T00:01:02.345Z'}}));check('impossible calendar dates are not silently normalized',true);
check('issued prose limits its claim to the saved assessment',charterCopy(fixture).paragraphs.join(' ').includes('that assessment alone'));
assert.throws(()=>assertCharter({...source,attestation:fixture.attestation}));assert.throws(()=>assertCharter({...fixture,attestation:{...fixture.attestation,allCorrect:false}}));check('a failed result cannot become a specimen-shaped issued document',true);
const icon=await readFile('web/icon.svg','utf8'),seal=await readFile('web/labs/chapter-scroll-v7/assets/project-seal.svg','utf8');
for(const m of icon.matchAll(/\bd="([^"]+)"/g))assert.ok(seal.includes(m[1]),'seal lost original book geometry');
check('all three original project icon paths are reused unchanged',true);
check('seal contains exact English institution and purpose legends',seal.includes('THE SECOND LANGUAGE')&&seal.includes('CHAPTER ATTESTATION'));
await writeFile('research/scroll-lab-v7/contract-checks.json',JSON.stringify({checks,minimumClosedRollDepthClearance:minimumClearance,poseBoundaryJump:jump,limits:'2.5D plane and conservative roll envelope, not a 360-degree strap/collision model; no production certification events written'},null,2)+'\n');console.log(JSON.stringify({checks,minimumClearance,jump},null,2));

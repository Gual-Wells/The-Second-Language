import * as THREE from './vendor/three.module.js';
import RAPIER from './vendor/rapier.js';
import {hash} from './sound.js';
const TAU=Math.PI*2;
export const sampleCoins=[{id:'sample-map',chapter:'第 1 章',title:'地图上的那条线',mark:'I',theme:'map',seed:'map-rainforest-hearing'},{id:'sample-ledger',chapter:'第 2 章',title:'河流的账本',mark:'II',theme:'river',seed:'river-ledger-drought'},{id:'sample-wetland',chapter:'第 3 章',title:'水回来的地方',mark:'III',theme:'wetland',seed:'wetland-water-archive'}];
function face(coin){const canvas=document.createElement('canvas');canvas.width=canvas.height=512;const c=canvas.getContext('2d'),g=c.createRadialGradient(200,130,12,256,256,250);g.addColorStop(0,'#fcefc5');g.addColorStop(.6,'#c8a564');g.addColorStop(1,'#78592e');c.fillStyle=g;c.fillRect(0,0,512,512);c.strokeStyle='#f7e6b3';c.lineWidth=5;for(const r of [228,212,190]){c.beginPath();c.arc(256,256,r,0,TAU);c.stroke();}c.strokeStyle='#765a35';c.lineWidth=8;c.lineCap='round';
 if(coin.theme==='map'){c.beginPath();c.moveTo(147,310);c.lineTo(210,195);c.lineTo(266,288);c.lineTo(337,167);c.stroke();c.beginPath();c.arc(337,167,12,0,TAU);c.stroke();}
 else if(coin.theme==='river'){for(let j=0;j<3;j++){c.beginPath();c.moveTo(146,210+j*37);c.bezierCurveTo(190,155+j*37,296,335+j*24,365,210+j*37);c.stroke();}}
 else{for(let i=0;i<3;i++){c.beginPath();c.moveTo(225+i*40,308);c.quadraticCurveTo(232+i*35,220,200+i*47,161);c.stroke();}c.beginPath();c.moveTo(137,334);c.quadraticCurveTo(230,363,377,326);c.stroke();}
 c.fillStyle='#694d2d';c.textAlign='center';c.font='25px Georgia';c.fillText('THE SECOND LANGUAGE',256,126);c.font='bold 40px Georgia';c.fillText(coin.mark,256,410);const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;return texture;}
export async function createScenes({root,sound,onFocus,onStatus,certificate}){
 function setCertificate(value){if(value?.chapter_id==='2026-10-09'){sampleCoins[2].seed=value.coin_seed;sampleCoins[2].certified=true;sampleCoins[2].attemptId=value.attempt_id;}}
 setCertificate(certificate);
 await RAPIER.init();
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));renderer.setClearColor('#d7e2e9');renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;root.append(renderer.domElement);
 const scene=new THREE.Scene();scene.fog=new THREE.Fog('#d7e2e9',13,30);const camera=new THREE.PerspectiveCamera(43,1,.1,60);
 scene.add(new THREE.HemisphereLight('#fff3d6','#7b95a7',2.6));const sun=new THREE.DirectionalLight('#fff5df',4.3);sun.position.set(-4,9,6);scene.add(sun);const fill=new THREE.DirectionalLight('#dbeaff',2);fill.position.set(5,3,-3);scene.add(fill);
 let objects=new THREE.Group();scene.add(objects);let mode='plaza',world=null,events=null,bodies=[],meshSlots=[],coinByHandle=new Map(),angle=0,velocity=0,drag=null,focus=-1,frame=0,last=0,accumulator=0,suspended=false,motionState={x:0,y:0,z:0},motionAllowed=false,motionCalibration=null;
 let measurements=[],frames=0,start=performance.now(),collisions=0,steps=0,count=32,lastStatus=0,visibleCount=3;
 const textures=sampleCoins.map(face),coinGeometry=new THREE.CylinderGeometry(.26,.26,.09,20),edge=new THREE.MeshStandardMaterial({color:'#b38e50',metalness:.7,roughness:.33});
 const coinMaterials=textures.map(map=>[edge,new THREE.MeshStandardMaterial({map,color:'#f9e9bc',metalness:.53,roughness:.31}),new THREE.MeshStandardMaterial({map,color:'#cfb880',metalness:.55,roughness:.4})]);
 const matrixObject=new THREE.Object3D(),stone=new THREE.MeshStandardMaterial({color:'#b9cad7',roughness:.82});
 function addMesh(geometry,material,x=0,y=0,z=0){const mesh=new THREE.Mesh(geometry,material);mesh.position.set(x,y,z);objects.add(mesh);return mesh;}
 function clear(){world?.free();events?.free();world=null;events=null;bodies=[];meshSlots=[];coinByHandle.clear();scene.remove(objects);objects.traverse(o=>{if(o.isInstancedMesh)o.dispose();if(o.geometry&&o.geometry!==coinGeometry)o.geometry.dispose();if(o.material&&o.material!==stone&&!coinMaterials.includes(o.material)&&o.material!==edge){for(const m of Array.isArray(o.material)?o.material:[o.material])if(!coinMaterials.flat().includes(m)&&m!==stone)m.dispose();}});objects=new THREE.Group();scene.add(objects);measurements=[];frames=steps=collisions=0;start=performance.now();accumulator=0;}
 function base(){const floor=addMesh(new THREE.CircleGeometry(13,64),new THREE.MeshStandardMaterial({color:'#b5c6d2',roughness:.92}));floor.rotation.x=-Math.PI/2;floor.position.y=.03;}
 function buildPlaza(){mode='plaza';clear();base();camera.position.set(0,5.9,10.4);camera.lookAt(0,.7,0);visibleCount=3;
  for(let i=0;i<3;i++)addMesh(new THREE.CylinderGeometry(1.75-i*.22,1.9-i*.22,.16,48),stone,0,.12+i*.15,0);
  addMesh(new THREE.CylinderGeometry(.66,.82,.6,32),stone,0,.82,0);
  const crown=addMesh(new THREE.IcosahedronGeometry(.47,0),new THREE.MeshStandardMaterial({color:'#4c859d',metalness:.4,roughness:.2}),0,1.5,0);crown.rotation.z=.25;
  const ring=addMesh(new THREE.TorusGeometry(3.28,.024,8,96),new THREE.MeshStandardMaterial({color:'#a98c56',metalness:.65,roughness:.37}),0,.08,0);ring.rotation.x=Math.PI/2;
  for(let i=0;i<3;i++){const theta=i*TAU/3,group=new THREE.Group();group.position.set(Math.sin(theta)*3.28,.45,Math.cos(theta)*3.28);group.rotation.y=theta;const plinth=new THREE.Mesh(new THREE.CylinderGeometry(.6,.73,.35,32),stone);group.add(plinth);const coin=new THREE.Mesh(new THREE.CylinderGeometry(.57,.57,.09,48),coinMaterials[i]);coin.rotation.x=Math.PI/2;coin.position.y=.77;coin.userData.coinIndex=i;group.add(coin);objects.add(group);meshSlots.push({group,coin,theta});}
  for(const x of [-4.8,4.8]){addMesh(new THREE.CylinderGeometry(.18,.25,1.9,12),stone,x,1,-2.2);addMesh(new THREE.SphereGeometry(.17,12,12),new THREE.MeshBasicMaterial({color:'#c39a59'}),x,2.06,-2.2);}
  angle=velocity=0;focus=-1;updatePlaza();wake();}
 function updatePlaza(){for(const s of meshSlots){const theta=s.theta+angle;s.group.position.x=Math.sin(theta)*3.28;s.group.position.z=Math.cos(theta)*3.28;s.group.rotation.y=theta;}
  const next=((Math.round(-angle/(TAU/3))%3)+3)%3;if(next!==focus){focus=next;onFocus(sampleCoins[next]);}}
 function buildJar(amount){mode='jar';clear();base();count=amount;visibleCount=amount;camera.position.set(0,3.9,10);camera.lookAt(0,2.22,0);
  world=new RAPIER.World({x:0,y:-9.81,z:0});world.timestep=1/60;world.numSolverIterations=6;events=new RAPIER.EventQueue(true);
  world.createCollider(RAPIER.ColliderDesc.cuboid(2,.12,2).setTranslation(0,.1,0));world.createCollider(RAPIER.ColliderDesc.cuboid(2,.1,2).setTranslation(0,4.5,0));
  for(let i=0;i<24;i++){const theta=i*TAU/24;world.createCollider(RAPIER.ColliderDesc.cuboid(.215,2.16,.10).setTranslation(Math.sin(theta)*1.48,2.32,Math.cos(theta)*1.48).setRotation({x:0,y:Math.sin(theta/2),z:0,w:Math.cos(theta/2)}));}
  addMesh(new THREE.CylinderGeometry(1.64,1.75,.22,64),new THREE.MeshStandardMaterial({color:'#8098aa',metalness:.6,roughness:.3}),0,.12,0);
  const glass=addMesh(new THREE.CylinderGeometry(1.53,1.53,4.24,64,1,true),new THREE.MeshPhysicalMaterial({color:'#c7e4ee',transparent:true,opacity:.12,roughness:.12,metalness:.02,side:THREE.DoubleSide,depthWrite:false}),0,2.34,0);glass.renderOrder=5;
  for(const x of [-1.51,1.51])addMesh(new THREE.CylinderGeometry(.009,.009,4.2,6),new THREE.MeshBasicMaterial({color:'#f1f9fd',transparent:true,opacity:.62}),x,2.34,.02);
  for(const y of [.26,4.46]){const rim=addMesh(new THREE.TorusGeometry(1.53,.055,12,64),new THREE.MeshStandardMaterial({color:'#bbcdd8',metalness:.68,roughness:.22}),0,y,0);rim.rotation.x=Math.PI/2;}
  addMesh(new THREE.CylinderGeometry(1.56,1.56,.12,64),new THREE.MeshStandardMaterial({color:'#b2c4d0',metalness:.6,roughness:.25}),0,4.54,0);
  const meshes=coinMaterials.map((material,k)=>{const m=new THREE.InstancedMesh(coinGeometry,material,Math.ceil((amount-k)/3));m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);m.frustumCulled=false;objects.add(m);return m;});
  const spots=[];for(let x=-2;x<=2;x++)for(let z=-2;z<=2;z++)if(Math.hypot(x*.55,z*.55)<=1.11)spots.push({x:x*.55,z:z*.55});
  for(let i=0;i<amount;i++){const spot=spots[i%spots.length],layer=Math.floor(i/spots.length),body=world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(spot.x,.29+layer*.104,spot.z).setLinearDamping(.65).setAngularDamping(.65));
   const collider=world.createCollider(RAPIER.ColliderDesc.cylinder(.045,.26).setDensity(1).setFriction(.43).setRestitution(.13).setActiveEvents(RAPIER.ActiveEvents.CONTACT_FORCE_EVENTS).setContactForceEventThreshold(.03),body);
   const entry={body,mesh:meshes[i%3],index:Math.floor(i/3),seed:sampleCoins[i%3].seed+'-specimen-'+i};bodies.push(entry);coinByHandle.set(collider.handle,entry);}
  onFocus(null);wake();}
 function resize(){const w=root.clientWidth,h=root.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();wake();}
 const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(root);
 function render(now){frame=0;if(suspended||document.hidden)return;const dt=Math.min(.05,Math.max(0,(now-last)/1000));last=now;let moving=false;
  if(mode==='plaza'){if(!drag){angle+=velocity;velocity*=.91;if(Math.abs(velocity)<.004){velocity=0;const desired=Math.round(angle/(TAU/3))*(TAU/3),delta=desired-angle;if(Math.abs(delta)>.001){angle+=delta*.14;moving=true;}}else moving=true;}updatePlaza();}
  else if(world){const before=performance.now();accumulator+=dt;let n=0;const hits=new Map(),budget=measurements.at(-1)>20?1:3;while(accumulator>=1/60&&n<budget){world.step(events);steps++;events.drainContactForceEvents(event=>{collisions++;const magnitude=event.totalForceMagnitude()/60;for(const h of [event.collider1(),event.collider2()]){const coin=coinByHandle.get(h);if(coin)hits.set(coin,Math.max(hits.get(coin)||0,magnitude));}});accumulator-=1/60;n++;}
   if(n===budget)accumulator=0;measurements.push(performance.now()-before);if(measurements.length>300)measurements.shift();for(const [coin,power]of [...hits].sort((a,b)=>b[1]-a[1]).slice(0,4))if(power>.002)sound.play(coin.seed,Math.min(1,Math.sqrt(power)*3),true);
   for(const e of bodies){const p=e.body.translation(),q=e.body.rotation();matrixObject.position.set(p.x,p.y,p.z);matrixObject.quaternion.set(q.x,q.y,q.z,q.w);matrixObject.updateMatrix();e.mesh.setMatrixAt(e.index,matrixObject.matrix);if(!e.body.isSleeping())moving=true;}
   for(const e of bodies.slice(0,3))e.mesh.instanceMatrix.needsUpdate=true;
  }
  renderer.render(scene,camera);frames++;if(now-lastStatus>900){lastStatus=now;onStatus(mode==='plaza'?'左右拖动 · 点币聆听':`${visibleCount} 枚示意币 · ${moving?'碰撞模拟中':'已静止'}`);}
  if(moving||drag)frame=requestAnimationFrame(render);
 }
 function wake(){if(!suspended&&!document.hidden&&!frame){last=performance.now();frame=requestAnimationFrame(render);}}
 function impulse(strength,x=1,z=.2){if(!world)return;for(const e of bodies){const n=hash(e.seed),jitter=.8+(n%41)/100;e.body.applyImpulse({x:x*strength*.012*jitter,y:strength*.004,z:z*strength*.012*jitter},true);e.body.applyTorqueImpulse({x:strength*.00008*((n%7)-3),y:strength*.00004*((n%5)-2),z:strength*.00008*(((n>>>4)%7)-3)},true);}wake();}
 const canvas=renderer.domElement,raycaster=new THREE.Raycaster();
 canvas.addEventListener('pointerdown',e=>{if(!e.isPrimary)return;drag={id:e.pointerId,x:e.clientX,y:e.clientY,lastX:e.clientX,lastY:e.clientY,moved:false};canvas.setPointerCapture(e.pointerId);velocity=0;wake();});
 canvas.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;const dx=e.clientX-drag.lastX,dy=e.clientY-drag.lastY;drag.moved ||=Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>8;if(mode==='plaza'){angle+=dx*.009;velocity=dx*.006;}else if(drag.moved)impulse(Math.min(2,Math.hypot(dx,dy)/10),dx/10,-dy/10);drag.lastX=e.clientX;drag.lastY=e.clientY;wake();});
 canvas.addEventListener('pointerup',e=>{if(!drag||drag.id!==e.pointerId)return;const tap=!drag.moved;drag=null;if(tap&&mode==='plaza'){const rect=canvas.getBoundingClientRect();raycaster.setFromCamera({x:(e.clientX-rect.left)/rect.width*2-1,y:-(e.clientY-rect.top)/rect.height*2+1},camera);const hit=raycaster.intersectObjects(meshSlots.map(s=>s.coin))[0];if(hit){sound.prepare().then(()=>sound.play(sampleCoins[hit.object.userData.coinIndex].seed));}}wake();});
 canvas.addEventListener('pointercancel',()=>{drag=null;velocity=0;wake();});
 function motion(event){if(!motionAllowed||suspended||document.hidden||mode!=='jar'||!world)return;const a=event.acceleration,g=event.accelerationIncludingGravity;if(!g||![g.x,g.y,g.z].every(Number.isFinite))return;
  const raw=new THREE.Vector3(-g.x,-g.y,g.z);if(raw.length()<1)return;
  motionCalibration ||=new THREE.Quaternion().setFromUnitVectors(raw.clone().normalize(),new THREE.Vector3(0,-1,0));
  const next=raw.applyQuaternion(motionCalibration).clampLength(0,14),changed=next.distanceTo(new THREE.Vector3(motionState.x,motionState.y,motionState.z));motionState={x:next.x,y:next.y,z:next.z};world.gravity={...motionState};
  const inertia=new THREE.Vector3(-(a?.x||0),-(a?.y||0),a?.z||0).applyQuaternion(motionCalibration).clampLength(0,14);
  if(changed>.3||inertia.length()>1){for(const e of bodies){e.body.wakeUp();e.body.applyImpulse({x:inertia.x*.00035,y:inertia.y*.00035,z:inertia.z*.00035},true);}wake();}}
 window.addEventListener('devicemotion',motion);function pause(value){suspended=value;if(value){cancelAnimationFrame(frame);frame=0;sound.stop();drag=null;}else wake();}
 document.addEventListener('visibilitychange',()=>pause(document.hidden||root.closest('[hidden]')!==null));
 buildPlaza();resize();
 return {setCertificate(value){setCertificate(value);if(mode==='plaza'&&focus===2)onFocus(sampleCoins[2]);},show(kind,amount=count){pause(false);if(kind==='plaza')buildPlaza();else buildJar(Number(amount));resize();},pause,move(direction){angle+=direction*TAU/3;velocity=0;wake();},play(){sound.prepare().then(()=>sound.play(sampleCoins[focus]?.seed||sampleCoins[0].seed));},shake(strength=1){impulse(strength);},async enableMotion(){if(!window.DeviceMotionEvent)throw Error('此设备不提供运动数据，请用拖动或轻摇按钮');const permission=typeof DeviceMotionEvent.requestPermission==='function'?DeviceMotionEvent.requestPermission():Promise.resolve('granted');const audio=sound.prepare();if(await permission!=='granted'){await audio;throw Error('未获得运动权限，仍可拖动或点按摇晃');}await audio;motionCalibration=null;motionAllowed=true;return true;},stats(){const sorted=[...measurements].sort((a,b)=>a-b);return{mode,focusedCoin:mode==='plaza'?{id:sampleCoins[focus]?.id,seed:sampleCoins[focus]?.seed,certified:Boolean(sampleCoins[focus]?.certified)}:null,count:visibleCount,frames,steps,collisions,physicsP95Ms:sorted[Math.floor(sorted.length*.95)]||0,sleeping:bodies.filter(e=>e.body.isSleeping()).length,activePhysics:!suspended&&Boolean(frame),motionAllowed,gravity:world?.gravity||null,bounds:bodies.length?{maxRadius:Math.max(...bodies.map(e=>{const p=e.body.translation();return Math.hypot(p.x,p.z);})),minY:Math.min(...bodies.map(e=>e.body.translation().y)),maxY:Math.max(...bodies.map(e=>e.body.translation().y))}:null,rendererCalls:renderer.info.render.calls,sound:sound.stats()};}};
}

import * as THREE from 'three';
import {GLTFLoader} from './vendor/GLTFLoader.js';
import {RoomEnvironment} from './vendor/RoomEnvironment.js';
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(innerWidth,innerHeight);
renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.95;
document.body.prepend(renderer.domElement);
const scene=new THREE.Scene();scene.background=new THREE.Color('#121719');
const camera=new THREE.PerspectiveCamera(32,innerWidth/innerHeight,.01,30);camera.position.set(0,0,2.7);
const pmrem=new THREE.PMREMGenerator(renderer);const room=new RoomEnvironment();
scene.environment=pmrem.fromScene(room,.035).texture;room.dispose();pmrem.dispose();
const key=new THREE.DirectionalLight(0xffefd8,2.4);key.position.set(-2,3,4);scene.add(key);
const fill=new THREE.DirectionalLight(0xbed7ff,1.25);fill.position.set(3,-1,2);scene.add(fill);
const rim=new THREE.DirectionalLight(0xf7ddb2,2);rim.position.set(0,1,-3);scene.add(rim);
const root=new THREE.Group();scene.add(root);
const originals=new Map(),clay=new THREE.MeshStandardMaterial({color:0x92918a,metalness:0,roughness:.72});
let spinning=false,mode=false,angle=0,ready=false,lightIndex=0,last=performance.now();
const status=document.querySelector('#status'),error=document.querySelector('#error');
const params=new URLSearchParams(location.search);const model=params.get('model')||'../outputs/hostile-dragon-fitted-candidate.glb';
if(model!=='../outputs/hostile-dragon-fitted-candidate.glb')throw new Error('Only this sample model is accepted');
new GLTFLoader().load(model,gltf=>{
  const obj=gltf.scene;const box=new THREE.Box3().setFromObject(obj),size=box.getSize(new THREE.Vector3()),center=box.getCenter(new THREE.Vector3());
  const pivot=new THREE.Group();pivot.add(obj);
  pivot.scale.setScalar(1/Math.max(size.x,size.y,size.z));root.add(pivot);
  obj.traverse(o=>{if(o.isMesh)originals.set(o,o.material)});window.sampleEvidence={meshCount:originals.size,dimensionsMetres:size.toArray()};
  ready=true;status.textContent='真实三维 · 可翻背';document.body.dataset.loaded='true';
},event=>{if(event.total)status.textContent=`读取 ${Math.round(event.loaded/event.total*100)}%`},e=>{
  status.textContent='读取失败';error.textContent='模型未能打开。请通过本地 HTTP 预览入口访问。';console.error(e);
});
document.querySelector('#front').onclick=()=>{root.rotation.set(0,0,0);angle=0};
document.querySelector('#back').onclick=()=>{root.rotation.set(0,Math.PI,0);angle=Math.PI};
document.querySelector('#clay').onclick=e=>{mode=!mode;e.currentTarget.setAttribute('aria-pressed',String(mode));originals.forEach((mat,o)=>o.material=mode?clay:mat)};
document.querySelector('#turn').onclick=e=>{spinning=!spinning;e.currentTarget.setAttribute('aria-pressed',String(spinning))};
document.querySelector('#light').onclick=()=>{lightIndex=(lightIndex+1)%3;const p=[[-2,3,4],[3,1,3],[-1,-2,3]][lightIndex];key.position.set(...p)};
const pointers=new Map();let previousDistance=0;
renderer.domElement.addEventListener('pointerdown',e=>{renderer.domElement.setPointerCapture(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});previousDistance=0;spinning=false;document.querySelector('#turn').setAttribute('aria-pressed','false')});
renderer.domElement.addEventListener('pointermove',e=>{
  const old=pointers.get(e.pointerId);if(!old)return;const dx=e.clientX-old.x,dy=e.clientY-old.y;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(pointers.size===1){root.rotation.y+=dx*.007;root.rotation.x=THREE.MathUtils.clamp(root.rotation.x+dy*.005,-1.25,1.25);angle=root.rotation.y}
  else{const [a,b]=[...pointers.values()];const d=Math.hypot(a.x-b.x,a.y-b.y);if(previousDistance)camera.position.z=THREE.MathUtils.clamp(camera.position.z*previousDistance/d,1.3,4.6);previousDistance=d}
});
for(const name of ['pointerup','pointercancel','lostpointercapture'])renderer.domElement.addEventListener(name,e=>{pointers.delete(e.pointerId);previousDistance=0});
renderer.domElement.addEventListener('wheel',e=>{e.preventDefault();camera.position.z=THREE.MathUtils.clamp(camera.position.z*Math.exp(e.deltaY*.001),1.3,4.6)},{passive:false});
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
renderer.setAnimationLoop(t=>{const dt=Math.min((t-last)/1000,.05);last=t;if(spinning&&ready){angle+=dt*.11;root.rotation.y=angle}if(!document.hidden)renderer.render(scene,camera)});

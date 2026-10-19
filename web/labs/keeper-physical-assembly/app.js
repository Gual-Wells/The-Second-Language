import * as T from 'three';
import {GLTFLoader} from '../keeper-asset-study/vendor/GLTFLoader.js';
import {OrbitControls} from '../keeper-asset-study/vendor/OrbitControls.js';
import {RoomEnvironment} from '../keeper-asset-study/vendor/RoomEnvironment.js';
const canvas=document.querySelector('#view'),stage=document.querySelector('#stage'),status=document.querySelector('#state');
const renderer=new T.WebGLRenderer({canvas,antialias:true,preserveDrawingBuffer:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=.85;
const scene=new T.Scene();scene.background=new T.Color(0x292e2c);
const camera=new T.PerspectiveCamera(35,1,.002,30),controls=new OrbitControls(camera,canvas);controls.enableDamping=true;controls.minDistance=.4;controls.maxDistance=6;
const pmrem=new T.PMREMGenerator(renderer),room=new RoomEnvironment();scene.environment=pmrem.fromScene(room,.04).texture;scene.environmentIntensity=.45;room.dispose();pmrem.dispose();
scene.add(new T.HemisphereLight(0xfff1db,0x434a4e,1));const key=new T.DirectionalLight(0xffeed7,2);key.position.set(-2,3,4);scene.add(key);const fill=new T.DirectionalLight(0xc7d6e4,.6);fill.position.set(3,1,-2);scene.add(fill);
const holder=new T.Group();scene.add(holder);let model,strap,meshes=[],ready=false,clay=false,current='front',frame=0;
const originals=new Map(),clayMaterial=new T.MeshStandardMaterial({color:0xb2aca0,roughness:.8,metalness:0});
const notes={front:'一条有两端的皮带穿过独立针扣，活动带尾从左侧前方伸出。',top:'俯视检查两端、折返与重叠层，不再是封死的圆环。',inside:'内侧可查看固定折返、针轴和独立金属扣框。',flat:'同一张皮料的展平状态，能看到固定折返槽、铆接孔和调节孔。这不是解扣动画。',parts:'暂时隐藏皮革，查看完整扣针、左侧轴眼与扣框；并非只有露在外面的装饰针尖。'};
function render(){controls.update();renderer.render(scene,camera);if(!document.hidden)frame=requestAnimationFrame(render);}render();
function resize(){const r=stage.getBoundingClientRect();renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();}new ResizeObserver(resize).observe(stage);
document.addEventListener('visibilitychange',()=>{cancelAnimationFrame(frame);if(!document.hidden)render();});
function state(name){
 if(!ready)return;current=name;
 for(const m of meshes)m.visible=name==='flat'?m===strap:name==='parts'?m!==strap:true;
 strap.morphTargetInfluences[0]=name==='flat'?1:0;
 holder.scale.setScalar(1);model.position.set(0,0,0);holder.updateMatrixWorld(true);
 const box=new T.Box3();for(const m of meshes)if(m.visible){let local;if(m.isSkinnedMesh){m.skeleton.update();m.computeBoundingBox();local=m.boundingBox;}else{m.geometry.computeBoundingBox();local=m.geometry.boundingBox;}box.union(local.clone().applyMatrix4(m.matrixWorld));}
 const center=box.getCenter(new T.Vector3()),size=box.getSize(new T.Vector3());model.position.sub(center);holder.scale.setScalar(1/Math.max(size.x,size.y,size.z));
 holder.updateMatrixWorld(true);
 const views={front:[0,1.2,2.8],top:[0,3.1,.001],inside:[1.8,1.6,-2.2],flat:[0,.15,2.9],parts:[0,.4,2.8]};
 camera.position.fromArray(views[name]);controls.target.set(0,0,0);controls.update();document.querySelector('#note').textContent=notes[name];
 for(const b of document.querySelectorAll('[data-view]'))b.setAttribute('aria-pressed',String(b.dataset.view===name));
}
for(const b of document.querySelectorAll('[data-view]'))b.onclick=()=>state(b.dataset.view);
document.querySelector('#clay').onclick=e=>{clay=!clay;for(const[m,mat]of originals)m.material=clay?clayMaterial:mat;e.target.textContent=clay?'材质':'灰模';e.target.setAttribute('aria-pressed',String(clay));};
try{
 const gltf=await new GLTFLoader().loadAsync('assets/keeper-physical.glb');model=gltf.scene;holder.add(model);
 model.traverse(o=>{if(o.isMesh){meshes.push(o);originals.set(o,o.material);if(o.isSkinnedMesh&&o.morphTargetInfluences?.length)strap=o;}});
 if(!strap)throw Error('Bound continuous strap or inspection shape missing');
 ready=true;resize();state('front');await renderer.compileAsync(scene,camera);renderer.render(scene,camera);status.hidden=true;
 window.keeperPhysical={snapshot:()=>({ready,current,clay,meshes:meshes.length,strapName:strap.name,bones:strap.skeleton.bones.length,morph:strap.morphTargetInfluences[0],visible:meshes.filter(m=>m.visible).map(m=>m.name),bound:true,completeUnfastening:false})};
}catch(error){status.textContent='模型暂未读取成功，请稍后重试。';console.error(error);}

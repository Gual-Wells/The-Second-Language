import * as T from 'three';
import {GLTFLoader} from '../keeper-asset-study/vendor/GLTFLoader.js';
import {OrbitControls} from '../keeper-asset-study/vendor/OrbitControls.js';
import {RoomEnvironment} from '../keeper-asset-study/vendor/RoomEnvironment.js';
const canvas=document.querySelector('#view'),stage=document.querySelector('#stage'),status=document.querySelector('#state');
const renderer=new T.WebGLRenderer({canvas,antialias:true,preserveDrawingBuffer:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=.9;
const scene=new T.Scene();scene.background=new T.Color(0x292e2c);const camera=new T.PerspectiveCamera(35,1,.01,30);camera.position.set(0,.22,2.6);
const controls=new OrbitControls(camera,canvas);controls.enableDamping=true;controls.minDistance=.9;controls.maxDistance=5;
const pmrem=new T.PMREMGenerator(renderer),room=new RoomEnvironment();scene.environment=pmrem.fromScene(room,.04).texture;scene.environmentIntensity=.55;room.dispose();pmrem.dispose();
scene.add(new T.HemisphereLight(0xfff3df,0x414a4d,1));const key=new T.DirectionalLight(0xffeed7,2);key.position.set(-2,3,4);scene.add(key);const fill=new T.DirectionalLight(0xc7d6e4,.7);fill.position.set(3,-1,2);scene.add(fill);
let clay=false,ready=false,frame=0;const originals=new Map(),clayMaterial=new T.MeshStandardMaterial({color:0xb5b1a7,roughness:.76,metalness:0});
function render(){controls.update();renderer.render(scene,camera);if(!document.hidden)frame=requestAnimationFrame(render);}render();
new ResizeObserver(()=>{const r=stage.getBoundingClientRect();renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();}).observe(stage);
document.addEventListener('visibilitychange',()=>{cancelAnimationFrame(frame);if(!document.hidden)render();});
const positions={front:[0,.22,2.6],quarter:[1.15,.6,2.35],side:[2.6,.25,0],back:[0,.22,-2.6]};
for(const b of document.querySelectorAll('[data-view]'))b.onclick=()=>{camera.position.fromArray(positions[b.dataset.view]);controls.target.set(0,0,0);controls.update();document.querySelector('#reference').hidden=true;document.querySelector('#compare').setAttribute('aria-pressed','false');};
document.querySelector('#clay').onclick=e=>{clay=!clay;for(const[o,m]of originals)o.material=clay?clayMaterial:m;e.target.textContent=clay?'材质':'灰模';};
document.querySelector('#compare').onclick=e=>{const ref=document.querySelector('#reference');ref.hidden=!ref.hidden;e.target.setAttribute('aria-pressed',String(!ref.hidden));};
try{
 const gltf=await new GLTFLoader().loadAsync('assets/keeper-model.glb'),model=gltf.scene;
 const box=new T.Box3().setFromObject(model),size=box.getSize(new T.Vector3()),center=box.getCenter(new T.Vector3()),scale=1/Math.max(size.x,size.y,size.z);model.position.sub(center);const holder=new T.Group();holder.add(model);holder.scale.setScalar(scale);scene.add(holder);
 let vertices=0,triangles=0;model.traverse(o=>{if(o.isMesh){originals.set(o,o.material);vertices+=o.geometry.attributes.position.count;triangles+=(o.geometry.index?.count??o.geometry.attributes.position.count)/3;}});
 await renderer.compileAsync(scene,camera);ready=true;status.hidden=true;
 window.keeperBeltModel={snapshot:()=>({ready,vertices,triangles,meshes:originals.size,clay,rigged:false}),export:()=>{renderer.render(scene,camera);return canvas.toDataURL('image/png');}};
}catch(error){status.textContent='模型暂未读取成功，请稍后重试。';console.error(error);}

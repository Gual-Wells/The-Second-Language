import * as T from '../certification/vendor/three.module.js';
import {GLTFLoader} from '../keeper-asset-study/vendor/GLTFLoader.js';
import {HDRLoader} from '../chapter-scroll-v3/vendor/HDRLoader.js';
import {mergeGeometries} from '../keeper-asset-study/vendor/BufferGeometryUtils.js';
import {rollRadius} from '../chapter-scroll/vendor/paperlab-roll.js';
import {getTemplate} from '../chapter-scroll-v14/templates.js';

// Cabinet numbers are a navigation device; every actual scroll comes only from
// the supplied specimen list. Empty compartments never become invented awards.
const PER_CABINET=6, STEP=3.52;
const clamp=T.MathUtils.clamp, ease=t=>{t=clamp(t,0,1);return t*t*(3-2*t);};
const asset=name=>new URL(`./assets/${name}`,import.meta.url).href;
const V=(x,y,z)=>new T.Vector3(x,y,z);
const bronze=new T.Color('#81704a');

function rounded(width,height,depth,radius=.018){
 const r=Math.min(radius,width*.2,height*.2,depth*.2),s=new T.Shape();
 s.moveTo(-width/2+r,-height/2);s.lineTo(width/2-r,-height/2);s.quadraticCurveTo(width/2,-height/2,width/2,-height/2+r);
 s.lineTo(width/2,height/2-r);s.quadraticCurveTo(width/2,height/2,width/2-r,height/2);
 s.lineTo(-width/2+r,height/2);s.quadraticCurveTo(-width/2,height/2,-width/2,height/2-r);
 s.lineTo(-width/2,-height/2+r);s.quadraticCurveTo(-width/2,-height/2,-width/2+r,-height/2);
 const g=new T.ExtrudeGeometry(s,{depth:depth-2*r,bevelEnabled:true,bevelThickness:r,bevelSize:r*.42,bevelSegments:2,curveSegments:2,steps:1});
 g.translate(0,0,-depth/2+r);return g;
}
function ringSegment(inner,outer,start,end,depth){
 const shape=new T.Shape(),steps=10;
 for(let i=0;i<=steps;i++){const a=start+(end-start)*i/steps;const x=Math.cos(a)*outer,y=Math.sin(a)*outer;i?shape.lineTo(x,y):shape.moveTo(x,y);}
 for(let i=steps;i>=0;i--){const a=start+(end-start)*i/steps;shape.lineTo(Math.cos(a)*inner,Math.sin(a)*inner);}
 shape.closePath();const g=new T.ExtrudeGeometry(shape,{depth,bevelEnabled:true,bevelThickness:.006,bevelSize:.005,bevelSegments:1,steps:1});g.translate(0,0,-depth/2);return g;
}
function canvasMap(width,height,paint){
 const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;paint(canvas.getContext('2d'),width,height);
 const map=new T.CanvasTexture(canvas);map.colorSpace=T.SRGBColorSpace;return map;
}
function plaqueMap(heading,subheading=''){
 return canvasMap(1024,160,(c,w,h)=>{
  c.clearRect(0,0,w,h);c.fillStyle='#cfbc91';c.textAlign='center';c.textBaseline='middle';
  c.font='500 51px Georgia, "Times New Roman", serif';c.fillText(heading,w/2,subheading?58:80,w-42);
  if(subheading){c.fillStyle='#aa9776';c.font='26px Georgia, serif';c.fillText(subheading,w/2,118,w-40);}
 });
}

export class MuseumScene{
 constructor(canvas,{onSelect=()=>{},onStatus=()=>{}}={}){
  this.canvas=canvas;this.onSelect=onSelect;this.onStatus=onStatus;this.items=[];this.proxies=new Map();this.bays=new Map();this.maps=[];this.materials=[];this.geometries=[];this.hitTargets=[];
  this.width=1;this.height=1;this.time=0;this.cabinet=0;this.selected=null;this.stage='browse';this.stageProgress=0;this.disposed=false;this.dirty=true;
  this.renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'low-power',preserveDrawingBuffer:true});
  this.renderer.setPixelRatio(1);this.renderer.outputColorSpace=T.SRGBColorSpace;this.renderer.toneMapping=T.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.22;
  this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=T.PCFSoftShadowMap;this.renderer.shadowMap.autoUpdate=false;
  this.scene=new T.Scene();this.scene.background=new T.Color('#171814');this.scene.fog=new T.Fog('#25231b',16,36);
  this.camera=new T.PerspectiveCamera(34,1,.08,65);this.camera.position.set(0,2.35,9);
  this.cameraTarget=V(0,1.88,0);this.camera.lookAt(this.cameraTarget);this.cameraGoal=this.camera.position.clone();this.targetGoal=this.cameraTarget.clone();
  this.raycaster=new T.Raycaster();this.pointer=new T.Vector2();
  this.onDown=e=>{if(this.stage!=='browse')return;this.drag={id:e.pointerId,x:e.clientX,y:e.clientY};};
  this.onUp=e=>{
   const drag=this.drag;this.drag=null;if(!drag||drag.id!==e.pointerId||this.stage!=='browse')return;
   const dx=e.clientX-drag.x,dy=e.clientY-drag.y;
   if(Math.abs(dx)>52&&Math.abs(dx)>Math.abs(dy)*1.3){this.navigateCabinet(dx<0?1:-1);return;}
   if(Math.hypot(dx,dy)>12)return;
   const r=canvas.getBoundingClientRect();this.pointer.set((e.clientX-r.left)/r.width*2-1,1-(e.clientY-r.top)/r.height*2);this.raycaster.setFromCamera(this.pointer,this.camera);
   const found=this.raycaster.intersectObjects(this.hitTargets,false)[0];if(found){const id=found.object.userData.itemId;this.focus(id);this.onSelect(id);}
  };
  this.onCancel=()=>{this.drag=null;};
  canvas.addEventListener('pointerdown',this.onDown);canvas.addEventListener('pointerup',this.onUp);canvas.addEventListener('pointercancel',this.onCancel);
 }
 mesh(geometry,material,parent=this.scene){
  const m=new T.Mesh(geometry,material);m.castShadow=true;m.receiveShadow=true;parent.add(m);this.geometries.push(geometry);return m;
 }
 mat(settings){const m=new T.MeshStandardMaterial(settings);this.materials.push(m);return m;}
 block(parent,w,h,d,x,y,z,material,r=.012){const m=this.mesh(rounded(w,h,d,r),material,parent);m.position.set(x,y,z);return m;}
 batchStatic(root){
  root.updateMatrixWorld(true);const inverse=root.matrixWorld.clone().invert(),batches=new Map(),removed=new Set();
  root.traverse(object=>{
   if(!object.isMesh||!object.material||Array.isArray(object.material)||object.material.transparent||object.material.visible===false)return;
   for(let parent=object;parent&&parent!==root;parent=parent.parent)if(parent.userData.dynamic)return;
   const g=object.geometry.index?object.geometry.toNonIndexed():object.geometry.clone();g.applyMatrix4(inverse.clone().multiply(object.matrixWorld));
   const material=object.material;let batch=batches.get(material);if(!batch){batch={geometry:[],objects:[]};batches.set(material,batch);}batch.geometry.push(g);batch.objects.push(object);
  });
  for(const [material,batch]of batches){
   if(batch.objects.length<2){for(const g of batch.geometry)g.dispose();continue;}
   const geometry=mergeGeometries(batch.geometry,false);for(const g of batch.geometry)g.dispose();if(!geometry)continue;
   for(const object of batch.objects){object.removeFromParent();removed.add(object.geometry);object.geometry.dispose();}
   this.mesh(geometry,material,root).name='static-joinery-batch';
  }
  this.geometries=this.geometries.filter(g=>!removed.has(g));
 }
 async prepare(items){
  if(this.ready)throw Error('MuseumScene already prepared');
  this.items=items.filter(i=>i&&i.id&&Number.isInteger(i.chapterNumber)&&i.chapterNumber>0).map(i=>({...i}));
  this.onStatus('Preparing the cabinet and its materials…');
  const loader=new T.TextureLoader(),load=async(file,color=false)=>{const map=await loader.loadAsync(asset(file));map.wrapS=map.wrapT=T.RepeatWrapping;map.anisotropy=Math.min(6,this.renderer.capabilities.getMaxAnisotropy());if(color)map.colorSpace=T.SRGBColorSpace;this.maps.push(map);return map;};
  const [wood,woodNormal,woodRough,stone,stoneNormal,stoneRough]=await Promise.all([
   load('scene-wood-color.jpg',true),load('scene-wood-normal.jpg'),load('scene-wood-roughness.jpg'),
   load('scene-stone-color.jpg',true),load('scene-stone-normal.jpg'),load('scene-stone-roughness.jpg')]);
  this.wood=this.mat({map:wood,normalMap:woodNormal,normalScale:new T.Vector2(.12,.12),roughnessMap:woodRough,roughness:.86,color:'#968d76'});
  this.woodDark=this.wood.clone();this.woodDark.color.set('#5b5748');this.materials.push(this.woodDark);
  this.woodEdge=this.wood.clone();this.woodEdge.color.set('#b5aa8c');this.woodEdge.roughness=.67;this.materials.push(this.woodEdge);
  this.stone=this.mat({map:stone,normalMap:stoneNormal,normalScale:new T.Vector2(.18,.18),roughnessMap:stoneRough,roughness:.98,color:'#8f907e'});
  this.cutStone=this.stone.clone();this.cutStone.color.set('#a5a38c');this.materials.push(this.cutStone);
  this.dark=this.mat({color:'#1c1913',roughness:1});
  this.bronze=this.mat({color:bronze,roughness:.67,metalness:.78});this.leather=this.mat({map:wood,normalMap:woodNormal,normalScale:new T.Vector2(.13,.13),color:'#442a19',roughness:.94});
  this.paperTexture=await loader.loadAsync(new URL('../chapter-scroll-v14/assets/parchment.webp',import.meta.url).href);this.paperTexture.colorSpace=T.SRGBColorSpace;
  // A rolled outer membrane samples the interior skin, not the flat sheet's
  // transparent cut perimeter and its hidden RGB edge pixels.
  this.paperTexture.offset.set(.13,.13);this.paperTexture.repeat.set(.74,.74);this.maps.push(this.paperTexture);
  this.addLighting();this.buildArchitecture();this.batchStatic(this.scene);
  const available=this.items.map(i=>Math.floor((i.chapterNumber-1)/PER_CABINET));
  this.maxCabinet=Math.max(0,...available);this.buildVisibleCabinets();
  await Promise.all([this.loadTable(),this.loadEnvironment()]);
  this.addDust();this.ready=true;this.resize(this.width,this.height);this.applyCamera(true);this.scene.updateMatrixWorld(true);
  await this.renderer.compileAsync(this.scene,this.camera);this.renderer.shadowMap.needsUpdate=true;this.render();
  this.onStatus('Specimen collection · no formal scrolls issued');return this;
 }
 addLighting(){
  this.scene.add(new T.HemisphereLight('#d8dfd6','#24170d',1.5));
  const key=new T.DirectionalLight('#fff4e5',3.0);key.position.set(-4.8,7,5.5);key.castShadow=true;key.shadow.mapSize.set(2048,2048);
  Object.assign(key.shadow.camera,{left:-6,right:6,top:7,bottom:-2,near:.1,far:23});key.shadow.normalBias=.018;key.shadow.bias=-.00015;this.scene.add(key);this.key=key;
  const warm=new T.PointLight('#e8b66a',18,9,2);warm.position.set(2.4,3.1,2.3);this.scene.add(warm);
  const rim=new T.DirectionalLight('#94a9b1',.85);rim.position.set(3.5,4,-3);this.scene.add(rim);
 }
 buildArchitecture(){
  const floorMaterial=this.stone.clone();this.materials.push(floorMaterial);
  for(const key of ['map','normalMap','roughnessMap']){floorMaterial[key]=floorMaterial[key].clone();floorMaterial[key].repeat.set(16,13);floorMaterial[key].needsUpdate=true;this.maps.push(floorMaterial[key]);}
  floorMaterial.color.set('#808578');
  const floor=this.mesh(new T.PlaneGeometry(28,22),floorMaterial);floor.rotation.x=-Math.PI/2;floor.position.set(0,-.03,0);
  // Individual slabs and joint shadows keep the room from being a flat PBR box.
  for(let row=0;row<5;row++)for(let col=-7;col<=7;col++){
   const x=col*1.18+(row%2)*.59,y=.5+row*.92;
   const b=this.block(this.scene,1.16,.90,.19,x,y,-.83,this.stone,.008);b.rotation.z=Math.sin(col*17+row*3)*.0018;
  }
  for(const x of [-5.2,-1.94,1.94,5.2]){
   const pillar=this.block(this.scene,.22,3.45,.45,x,1.72,-.16,this.cutStone,.016);
   this.block(this.scene,.34,.15,.56,x,.10,-.11,this.cutStone,.015);
   this.block(this.scene,.35,.15,.55,x,3.43,-.12,this.cutStone,.012);
   for(let i=0;i<11;i++){
    const a=i*Math.PI/11+.008,b=(i+1)*Math.PI/11-.008;
    const arc=this.mesh(ringSegment(1.43,1.62,a,b,.32),this.cutStone);arc.position.set(x+1.63,3.45,-.16);
   }
  }
  // Left window is a genuine opening in front of a recessed lit niche; no
  // emissive rectangle is pasted on the front of the cabinet.
  const windowGroup=new T.Group();windowGroup.position.set(-3.25,2.6,-.52);this.scene.add(windowGroup);
  const glass=this.mat({color:'#8faaa8',emissive:'#667b77',emissiveIntensity:.7,roughness:.91});
  const pane=this.mesh(new T.PlaneGeometry(.85,1.85),glass,windowGroup);pane.position.z=-.16;
  for(const x of [-.46,.46])this.block(windowGroup,.14,2.03,.26,x,0,0,this.cutStone);
  for(const y of [-1.0,1.0])this.block(windowGroup,1.02,.13,.30,0,y,.01,this.cutStone);
  for(const x of [-.28,0,.28])this.block(windowGroup,.018,1.85,.025,x,0,.01,this.bronze,.003);
  for(const y of [-.60,0,.60])this.block(windowGroup,.85,.018,.025,0,y,.01,this.bronze,.003);
  // A wall bracket with dull, aged metal—not a blazing fantasy torch.
  const bracket=new T.Group();bracket.position.set(2.13,2.8,.08);this.scene.add(bracket);
  this.block(bracket,.13,.36,.045,0,0,0,this.bronze,.01);
  this.block(bracket,.04,.04,.35,0,-.04,.17,this.bronze,.009);
  const cup=this.mesh(new T.CylinderGeometry(.09,.055,.09,12),this.bronze,bracket);cup.position.set(0,-.015,.31);
  const candleMat=this.mat({color:'#c3af7b',roughness:.95});const candle=this.mesh(new T.CylinderGeometry(.031,.039,.18,12),candleMat,bracket);candle.position.set(0,.11,.31);
  const flame=this.mesh(new T.SphereGeometry(.027,10,6),new T.MeshBasicMaterial({color:'#e8ba75'}),bracket);flame.scale.y=1.8;flame.position.set(0,.22,.31);
 }
 cabinetLabel(text,x,y,z,parent){
  const material=new T.MeshBasicMaterial({map:plaqueMap(text),transparent:true,depthWrite:false,toneMapped:false});material.userData.bayOwned=true;this.maps.push(material.map);this.materials.push(material);
  const p=this.mesh(new T.PlaneGeometry(1.15,.18),material,parent);p.position.set(x,y,z);p.castShadow=false;return p;
 }
 buildVisibleCabinets(){
  // Only current and immediate neighbour bays have geometry; range addressing
  // works at 500+ without an ever-growing render graph.
  const wanted=new Set([this.cabinet-1,this.cabinet,this.cabinet+1].filter(i=>i>=0&&i<=Math.max(this.maxCabinet,1)));
  for(const [index,group]of this.bays)if(!wanted.has(index)){
   this.scene.remove(group);this.bays.delete(index);for(const [id,p]of this.proxies)if(p.userData.cabinet===index){this.proxies.delete(id);this.hitTargets=this.hitTargets.filter(h=>h.userData.itemId!==id);}
   const geometry=new Set(),materials=new Set(),maps=new Set();group.traverse(o=>{if(o.geometry)geometry.add(o.geometry);for(const m of o.material?(Array.isArray(o.material)?o.material:[o.material]):[])if(m.userData.bayOwned){materials.add(m);if(m.map&&m.map!==this.paperTexture)maps.add(m.map);}});
   for(const g of geometry)g.dispose();for(const m of materials)m.dispose();for(const map of maps)map.dispose();
   this.geometries=this.geometries.filter(g=>!geometry.has(g));this.materials=this.materials.filter(m=>!materials.has(m));this.maps=this.maps.filter(m=>!maps.has(m));
  }
  for(const index of wanted)if(!this.bays.has(index))this.buildCabinet(index);
 }
 buildCabinet(index){
  const g=new T.Group();g.position.x=index*STEP;g.name=`chapter-cabinet-${index+1}`;this.bays.set(index,g);this.scene.add(g);
  // Frame, back planks, shelves and distinct hand-worn mouldings are separate
  // joinery. All use the verified CC0 scan, with restrained colour variation.
  this.block(g,2.94,2.78,.13,0,1.91,-.39,this.woodDark);
  for(let k=0;k<6;k++)this.block(g,.47,2.7,.025,-1.18+k*.47,1.94,-.305,k%2?this.woodDark:this.wood,.004);
  for(const x of [-1.49,1.49]){
   this.block(g,.17,2.93,.56,x,1.96,-.06,this.wood);
   this.block(g,.055,2.83,.07,x,1.98,.25,this.woodEdge,.01);
   this.block(g,.23,.15,.64,x,.48,-.01,this.woodEdge);
   for(let j=0;j<3;j++)this.block(g,.036,2.5,.018,x+(j-1)*.045,1.99,.291,this.woodDark,.004);
  }
  this.block(g,3.16,.16,.66,0,3.43,-.03,this.woodEdge);
  this.block(g,3.30,.09,.72,0,3.55,-.04,this.wood,.01);
  this.block(g,3.12,.08,.63,0,3.29,-.01,this.woodDark,.012);
  this.block(g,3.13,.24,.65,0,.36,-.01,this.wood);
  this.block(g,3.23,.09,.71,0,.21,.01,this.woodEdge);
  for(const x of [-1.30,1.30])this.block(g,.22,.22,.49,x,.10,.01,this.woodDark);
  this.block(g,.10,2.69,.48,0,1.94,-.05,this.wood);
  for(const y of [.63,1.49,2.35,3.21]){
   this.block(g,2.90,.095,.62,0,y,-.02,this.wood);
   this.block(g,2.98,.038,.055,0,y-.014,.302,this.woodEdge,.006);
   this.block(g,2.95,.016,.025,0,y+.025,.338,this.woodDark,.004);
  }
  // Subtle linenfold-like recessed lower panels; they are furniture ornament,
  // not invented manuscript objects or fake chapter rewards.
  for(const x of [-1.10,-.55,0,.55,1.10]){
   this.block(g,.44,.14,.024,x,.36,.33,this.woodDark,.007);
   for(const dx of [-.10,.10])this.block(g,.018,.115,.026,x+dx,.36,.35,this.woodEdge,.004);
  }
  this.block(g,1.51,.13,.028,0,3.43,.313,this.dark,.006);
  this.cabinetLabel(`CHAPTERS ${String(index*6+1).padStart(2,'0')} — ${String(index*6+6).padStart(2,'0')}`,0,3.43,.334,g);
  const chapterItems=this.items.filter(i=>Math.floor((i.chapterNumber-1)/6)===index);
  for(let row=0;row<3;row++)for(let col=0;col<2;col++){
   const n=index*6+row*2+col+1,x=col?.76:-.76,y=2.57-row*.86,item=chapterItems.find(i=>i.chapterNumber===n);
   // An empty support is simply furniture, without locked icons or fabricated
   // text. No gallery totals imply that unseen chapters have been passed.
   if(!item)for(const dx of [-.45,.45])this.block(g,.075,.045,.35,x+dx,y-.15,.04,this.woodDark,.009);
   if(!item)continue;
   const proxy=this.closedScroll(item);proxy.position.set(x,y-(.125-proxy.userData.rollRadius),.03);proxy.userData.home=proxy.position.clone();proxy.userData.cabinet=index;proxy.userData.item=item;g.add(proxy);this.proxies.set(item.id,proxy);
   this.block(g,1.24,.135,.023,x,y-.24,.337,this.dark,.009);
   this.cabinetLabel(`CHAPTER ${String(n).padStart(2,'0')} · SPECIMEN`,x,y-.24,.355,g).scale.set(.91,.74,1);
   const hitMaterial=new T.MeshBasicMaterial({visible:false});hitMaterial.userData.bayOwned=true;this.materials.push(hitMaterial);
   const hit=this.mesh(new T.BoxGeometry(1.36,.62,.55),hitMaterial,g);hit.position.set(x,y,.09);hit.userData.itemId=item.id;this.hitTargets.push(hit);
  }
  this.batchStatic(g);
 }
 closedScroll(item){
  const group=new T.Group();group.name=`specimen-proxy-${item.id}`;group.userData.dynamic=true;
  const paper=this.mat({map:this.paperTexture,color:'#e3d7bf',roughness:.97,metalness:0});
  paper.userData.bayOwned=true;
  // Derive the closed roll's proportions from the accepted winding profile,
  // rather than handing over a thick cylinder to a thinner real manuscript.
  const length=1.15,profile=getTemplate('manuscript-memento-v14');
  const r=rollRadius(profile.height,profile.coreRadius,profile.layerThickness)*length/profile.width,detail=r/.125;
  group.userData.rollRadius=r;
  const roll=this.mesh(new T.CylinderGeometry(r,r*.99,length,48,1,true),paper,group);roll.rotation.z=Math.PI/2;
  // The edge is a real set of concentric paper membranes with a small hollow
  // core. No wooden spindle is introduced into the accepted scroll design.
  const edgeMat=this.mat({color:'#b8a078',roughness:1});
  edgeMat.userData.bayOwned=true;
  for(const side of [-1,1]){
   const disk=this.mesh(new T.RingGeometry(r*.216,r*.98,56),paper,group);disk.rotation.y=side*Math.PI/2;disk.position.x=side*length/2;
   for(let j=0;j<8;j++){
    const layer=this.mesh(new T.TorusGeometry(r*(.24+j*.10),r*.0136,4,48),edgeMat,group);layer.rotation.y=Math.PI/2;layer.position.x=side*(length/2+.001+j*.00012);
   }
   const core=this.mesh(new T.CircleGeometry(r*.208,32),this.dark,group);core.rotation.y=side*Math.PI/2;core.position.x=side*(length/2-.004);
  }
  // A narrow separate leather band wraps the roll; this is a low-detail closed
  // proxy only. The accepted real keeper plays in the full object viewer.
  const strap=this.mesh(new T.CylinderGeometry(r+.009*detail,r+.009*detail,.22978254735617945*length/profile.width,48,1,true),this.leather,group);strap.rotation.z=Math.PI/2;
  const buckle=new T.Group();buckle.position.set(0,.018*detail,r+.015*detail);group.add(buckle);
  for(const x of [-.040,.040])this.block(buckle,.011,.11*detail,.016,x,0,0,this.bronze,.004);
  for(const y of [-.049,.049])this.block(buckle,.073,.011,.016,0,y*detail,0,this.bronze,.004);
  this.block(buckle,.008,.075*detail,.012,0,-.009*detail,.012,this.bronze,.003);
  const tail=this.block(group,.055,.14*detail,.011,0,-.060*detail,r+.029*detail,this.leather,.005);tail.rotation.x=-.04;
  this.batchStatic(group);group.userData.bodyMeshes=group.children.filter(o=>o.isMesh);
  // A removable shallow wooden support accompanies the manuscript. The
  // first-person carrying shot omits hands; it does not simulate a free-flying
  // manuscript. The roll rests on two shaped pads throughout the transfer.
  const carrier=new T.Group();carrier.name='removable-manuscript-support';group.add(carrier);group.userData.carrier=carrier;
  this.block(carrier,1.29,.035,.39,0,-r-.028,0,this.wood,.009);
  for(const x of [-.49,.49])this.block(carrier,.08,.012,.30,x,-r-.0065,0,this.leather,.002);
  for(const z of [-.19,.19])this.block(carrier,1.29,.045,.020,0,-r-.012,z,this.woodEdge,.006);
  this.batchStatic(carrier);
  group.userData.rollBounds=new T.Box3(V(-length/2-.02,-r-.015,-r-.015),V(length/2+.02,r+.015,r+.045));return group;
 }
 async loadTable(){
  try{
   const gltf=await new GLTFLoader().loadAsync(asset('scene-table/WoodenTable_01_1k.gltf'));
   const model=gltf.scene;model.updateMatrixWorld(true);const box=new T.Box3().setFromObject(model),size=box.getSize(new T.Vector3()),center=box.getCenter(new T.Vector3());
   const outer=new T.Group();model.position.sub(center);outer.add(model);outer.scale.setScalar(2.5/size.x);outer.position.set(0,.30,2.35);outer.rotation.y=.025;
   model.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;for(const m of Array.isArray(o.material)?o.material:[o.material]){m.roughness=Math.max(.8,m.roughness||0);this.materials.push(m);for(const p of ['map','normalMap','roughnessMap','metalnessMap','aoMap'])if(m[p])this.maps.push(m[p]);}this.geometries.push(o.geometry);}});
   // Place the scanned furniture's feet on the floor without nonuniformly
   // stretching the source model to manufacture an implausible new table.
   this.scene.add(outer);outer.updateMatrixWorld(true);const b=new T.Box3().setFromObject(outer);outer.position.y-=b.min.y;
   this.table=outer;this.tableTop=b.max.y-b.min.y;
  }catch(error){
   // This is not a silent art fallback: retain the reason in the snapshot.
   this.tableError=String(error);this.onStatus('The scanned table is unavailable; cabinet view remains available.');
  }
 }
 async loadEnvironment(){
  try{const hdr=await new HDRLoader().loadAsync(new URL('../chapter-scroll-v3/assets/studio.hdr',import.meta.url).href);const pmrem=new T.PMREMGenerator(this.renderer);this.environment=pmrem.fromEquirectangular(hdr);this.scene.environment=this.environment.texture;this.scene.environmentIntensity=.20;hdr.dispose();pmrem.dispose();}catch(error){this.environmentError=String(error);}
 }
 addDust(){
  const count=90,positions=new Float32Array(count*3);for(let i=0;i<count;i++){positions.set([Math.sin(i*32.17)*5,1+(Math.sin(i*9.72)+1)*1.9,Math.cos(i*9.1)*3],i*3);}
  const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.BufferAttribute(positions,3));this.geometries.push(geometry);
  const material=new T.PointsMaterial({color:'#c1ad7b',size:.013,transparent:true,opacity:.17,depthWrite:false,sizeAttenuation:true});this.materials.push(material);
  this.dust=new T.Points(geometry,material);this.scene.add(this.dust);
 }
 resize(width,height){
  if(!width||!height)return;this.width=width;this.height=height;const dpr=Math.min(window.devicePixelRatio||1,2),limit=2_500_000,ratio=Math.min(dpr,Math.sqrt(limit/(width*height)));
  this.renderer.setSize(Math.max(1,Math.floor(width*ratio)),Math.max(1,Math.floor(height*ratio)),false);this.camera.aspect=width/height;this.camera.updateProjectionMatrix();this.applyCamera(true);this.dirty=true;
 }
 browseCamera(){
  const a=this.width/this.height,fit=Math.max(5.65,3.52/(2*Math.tan(T.MathUtils.degToRad(17))*a));
  return{position:V(this.cabinet*STEP+.70,2.62,fit),target:V(this.cabinet*STEP,1.84,0)};
 }
 applyCamera(immediate=false){
  const base=this.browseCamera(),p=this.stage==='browse'?0:ease(this.stageProgress);
  // The selected object moves on a short controlled path out of its shelf.
  // The camera approaches the same object; transferPose reports its actual
  // screen projection for the full-fidelity viewer to take over.
  const selected=this.proxies.get(this.selected),from=selected?selected.userData.home.clone().add(V(selected.userData.cabinet*STEP,0,0)):V(this.cabinet*STEP,1.8,0);
  const desk=V(this.cabinet*STEP,(this.tableTop||.8)+(selected?.userData.rollRadius||.125)+.047,2.16);
  const endDistance=1.22/(.885*2*Math.tan(T.MathUtils.degToRad(17))*Math.max(.35,this.width/this.height));
  const finalPosition=desk.clone().add(V(.02,.12,Math.max(2.6,endDistance))),finalTarget=desk.clone();
  this.cameraGoal.copy(base.position).lerp(finalPosition,p);this.targetGoal.copy(base.target).lerp(finalTarget,p);
  if(selected){
   // First draw the support straight out, at constant shelf height, until its
   // rear clears the shelf front. Only then carry it toward the viewing desk.
   // Reversal traverses the same path in reverse, without a new collision path.
   const cleared=from.clone();cleared.z=.69;
   const out=ease(p/.35),carry=ease((p-.35)/.65);
   const world=p<.35?from.clone().lerp(cleared,out):cleared.clone().lerp(desk,carry);
   if(p>.35)world.y+=Math.sin(carry*Math.PI)*.055;
   selected.position.copy(world).sub(V(selected.userData.cabinet*STEP,0,0));selected.rotation.set(0,p*.035,0);
  }
  if(immediate){this.camera.position.copy(this.cameraGoal);this.cameraTarget.copy(this.targetGoal);this.camera.lookAt(this.cameraTarget);}
  this.renderer.shadowMap.needsUpdate=true;this.dirty=true;
 }
 focus(id){
  const item=this.items.find(i=>i.id===id);if(!item)return false;
  this.cabinet=Math.floor((item.chapterNumber-1)/PER_CABINET);this.buildVisibleCabinets();this.setSelected(id);this.applyCamera(false);return true;
 }
 setSelected(id){
  if(this.selected&&this.proxies.has(this.selected)){const old=this.proxies.get(this.selected);old.position.copy(old.userData.home);old.rotation.set(0,0,0);old.visible=true;for(const body of old.userData.bodyMeshes||[])body.visible=true;}
  this.selected=this.proxies.has(id)?id:null;this.dirty=true;
 }
 setStage(stage,progress=0){
  if(!['browse','retrieve','inspect','return'].includes(stage))throw Error('Unknown museum stage');
  this.stage=stage;this.stageProgress=stage==='browse'?0:stage==='inspect'?1:stage==='return'?1-clamp(progress,0,1):clamp(progress,0,1);
  this.applyCamera(true);
 }
 setProxyVisible(visible){const p=this.proxies.get(this.selected);if(p){for(const body of p.userData.bodyMeshes||[])body.visible=Boolean(visible);this.dirty=true;}}
 getTransferPose(){
  const proxy=this.proxies.get(this.selected);if(!proxy)return null;
  this.scene.updateMatrixWorld(true);this.camera.updateMatrixWorld(true);const b=proxy.userData.rollBounds,points=[];
  for(const x of [b.min.x,b.max.x])for(const y of [b.min.y,b.max.y])for(const z of [b.min.z,b.max.z])points.push(V(x,y,z).applyMatrix4(proxy.matrixWorld).project(this.camera));
  const xs=points.map(p=>(p.x*.5+.5)*this.width),ys=points.map(p=>(.5-p.y*.5)*this.height),left=Math.min(...xs),right=Math.max(...xs),top=Math.min(...ys),bottom=Math.max(...ys);
  return{units:'css-pixels',x:(left+right)/2,y:(top+bottom)/2,width:right-left,height:bottom-top,left,top,canvasWidth:this.width,canvasHeight:this.height,axis:'horizontal',id:this.selected};
 }
 transferPose(){return this.getTransferPose();}
 navigateCabinet(direction){
  if(this.stage!=='browse')return false;
  const next=clamp(this.cabinet+Math.sign(direction),0,this.maxCabinet);if(next===this.cabinet)return false;
  this.cabinet=next;this.setSelected(null);this.buildVisibleCabinets();this.applyCamera(false);const label=`第 ${next+1} 柜 · 第 ${next*6+1}—${next*6+6} 章`;this.onStatus(label);return{moved:true,cabinet:next+1,label};
 }
 update(dt){
  if(!this.ready||this.disposed)return false;this.time+=Math.min(.05,dt||0);
  const t=1-Math.exp(-Math.min(.1,dt||0)*7);const moving=this.camera.position.distanceToSquared(this.cameraGoal)+this.cameraTarget.distanceToSquared(this.targetGoal)>.000001;
  if(moving){this.camera.position.lerp(this.cameraGoal,t);this.cameraTarget.lerp(this.targetGoal,t);this.camera.lookAt(this.cameraTarget);this.dirty=true;}
  if(this.dust){this.dust.rotation.y=Math.sin(this.time*.021)*.014;this.dust.position.y=Math.sin(this.time*.11)*.025;this.dirty=true;}
  return this.dirty;
 }
 render(){if(!this.disposed){this.renderer.render(this.scene,this.camera);this.dirty=false;}}
 snapshot(){
  return{ready:!!this.ready,stage:this.stage,stageProgress:this.stageProgress,selected:this.selected,cabinet:this.cabinet+1,range:[this.cabinet*6+1,this.cabinet*6+6],specimens:this.items.map(i=>({id:i.id,chapterNumber:i.chapterNumber,issued:false})),visibleCabinets:this.bays.size,proxyCount:this.proxies.size,transfer:this.getTransferPose(),table:'Poly Haven WoodenTable_01, CC0',tableError:this.tableError||null,environmentAvailable:Boolean(this.scene.environment),environmentError:this.environmentError||null,resources:'scene-sources.json',drawBuffer:{width:this.canvas.width,height:this.canvas.height},render:this.renderer.info.render,notes:'Cabinet furniture and distant closed proxies are new study geometry. Full v20 paper/keeper animation belongs to the separate object viewer.'};
 }
 dispose(){
  if(this.disposed)return;this.disposed=true;for(const [type,fn]of [['pointerdown',this.onDown],['pointerup',this.onUp],['pointercancel',this.onCancel]])this.canvas.removeEventListener(type,fn);
  for(const g of new Set(this.geometries))g.dispose();for(const m of new Set(this.materials))m.dispose();for(const map of new Set(this.maps))map.dispose();this.environment?.dispose();this.renderer.dispose();
 }
}

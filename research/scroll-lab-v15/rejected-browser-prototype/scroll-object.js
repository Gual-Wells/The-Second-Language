import * as T from '../certification/vendor/three.module.js';
import {ScrollObject as StableScroll} from '../chapter-scroll-runtime/scroll-object.js';
import {Keeper} from './keeper.js';
export class ScrollObject extends StableScroll{
 constructor(...args){
  super(...args);this.closure.dispose();this.closure=new Keeper(this.scene,null,this.template);
  const old=this.environmentReady;
  this.environmentReady=Promise.all([old,this.closure.ready]).then(()=>{
   for(const map of [this.material.normalMap,this.material.roughnessMap]){map.wrapS=map.wrapT=T.ClampToEdgeWrapping;map.repeat.set(1,1);map.needsUpdate=true;}
   this.material.normalScale.set(.055,.055);this.material.needsUpdate=true;
  });
  // Broad folds follow this particular sheet. Pigment/age staining remains
  // albedo; only these two inspected creases contribute geometric relief.
  const addFolds=shader=>{shader.vertexShader=shader.vertexShader.replace('v.z=.009*sin',`float u=q.x/scrollWidth+.5, sheetV=.5-q.y/scrollHeight;
   float diagonal=exp(-pow((sheetV-(.535+.18*u))/.009,2.));
   float crossfold=exp(-pow((sheetV-(.392+.006*u))/.009,2.));
   v.z=-.009*diagonal-.010*crossfold;
   v.z+=.009*sin`);};
  for(const material of [this.material,this.sheet.customDepthMaterial]){const previous=material.onBeforeCompile;material.onBeforeCompile=s=>{previous(s);addFolds(s);};material.customProgramCacheKey=()=>material===this.material?'chapter-five-v15-folds':'chapter-five-v15-fold-shadow';material.needsUpdate=true;}
  this.setProgress(0);
 }
 snapshot(){return {...super.snapshot(),edition:'v15',keeperMotion:'pin lifts, leather feeds, keeper slides outside roll; no scale/alpha disappearance',paperMaterial:'independently authored chapter-five sheet'};}
 exportKeeper({angle='oblique',phase=0}={}){
  const progress=this.progress,camera=this.camera,size=this.renderer.getSize(new T.Vector2()),visible=this.scene.children.map(o=>[o,o.visible]);
  this.setProgress(phase);this.closure.group.position.set(0,0,-this.closure.radius);
  for(const [o]of visible)if(o!==this.closure.group&&!o.isLight)o.visible=false;
  this.closure.group.visible=true;this.camera=new T.PerspectiveCamera(32,1,.05,30);this.camera.position.fromArray(angle==='front'?[0,0,2.1]:angle==='side'?[1.9,.12,.60]:[.72,.23,2.0]);this.camera.lookAt(0,0,.12);
  this.renderer.setSize(900,900,false);this.renderer.render(this.scene,this.camera);const png=this.renderer.domElement.toDataURL('image/png');
  this.camera=camera;this.renderer.setSize(size.x,size.y,false);for(const[o,v]of visible)o.visible=v;this.setProgress(progress);this.render();return png;
 }
 interaction(){
  const project=(x,y,z)=>{const p=new T.Vector3(x,y,z).project(this.camera);return{x:.5+.5*p.x,y:.5+.5*p.y};};
  const half=this.width/2;
  return {top:[project(-half,this.bounds.top,0),project(half,this.bounds.top,0)],bottom:[project(-half,this.bounds.bottom,0),project(half,this.bounds.bottom,0)],keeper:this.closure.group.visible?project(this.closure.group.position.x,this.closure.group.position.y,2*this.closure.radius):null,paperProgress:this.paperProgress};
 }
}

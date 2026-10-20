import * as T from '../certification/vendor/three.module.js';
import {ScrollObject as StableScroll} from '../chapter-scroll-runtime/scroll-object.js';
import {ScrollObject as PaperCore} from '../chapter-scroll-v6/scroll-object.js';
import {Keeper} from './keeper.js';
import {RELEASE_END} from './keeper-motion.js';
export class ScrollObject extends StableScroll{
 constructor(...args){
  super(...args);this.closure.dispose();this.closure=new Keeper(this.scene,this.template);this.integrated=true;
  const old=this.environmentReady;this.environmentReady=Promise.all([old,this.closure.ready]).then(()=>{
   this.maps.push(...this.closure.maps);for(const map of [this.material.normalMap,this.material.roughnessMap]){map.wrapS=map.wrapT=T.ClampToEdgeWrapping;map.repeat.set(1,1);map.needsUpdate=true;}
   this.material.normalScale.set(.11,.11);this.material.needsUpdate=true;
  });
  // Preserve v14's paper/fold treatment; this iteration changes the prop only.
  const folds=shader=>{shader.vertexShader=shader.vertexShader.replace('v.z=.009*sin',`float u=q.x/scrollWidth+.5, sheetV=.5-q.y/scrollHeight;
   float diagonal=exp(-pow((sheetV-(.11+.365*u))/.009,2.))*(1.-smoothstep(.42,.55,u));
   float crossfold=exp(-pow((sheetV-(.645+.04*u))/.010,2.));
   v.z=-.008*diagonal-.011*crossfold;
   v.z+=.009*sin`);};
  for(const material of [this.material,this.sheet.customDepthMaterial]){const previous=material.onBeforeCompile;material.onBeforeCompile=s=>{previous(s);folds(s);};material.customProgramCacheKey=()=>material===this.material?'chapter-five-v14-folds':'chapter-five-v14-fold-shadow';material.needsUpdate=true;}
  this.setProgress(0);
 }
 setProgress(value){
  if(!this.integrated)return super.setProgress(value);
  const raw=T.MathUtils.clamp(value,0,1),paper=T.MathUtils.clamp((raw-RELEASE_END)/(1-RELEASE_END),0,1);
  PaperCore.prototype.setProgress.call(this,.18+.82*paper);this.progress=raw;
  this.closure.update(raw,this.height/2+this.sheet.position.y);
 }
 async prepareMotion(initial){
  const started=performance.now();await this.environmentReady;for(const map of new Set([...this.maps,this.sealBump]))this.renderer.initTexture(map);
  this.setProgress(0);await this.renderer.compileAsync(this.scene,this.camera);
  for(const p of [0,.05,.1,.17,.23,.3,.339,1,initial]){this.setProgress(p);this.render();await new Promise(r=>requestAnimationFrame(r));}
  this.motionPrepared=true;this.preparationMs=performance.now()-started;this.preparedPrograms=this.renderer.info.programs.length;
 }
 snapshot(){return {...super.snapshot(),edition:'v17 physical keeper integration',keeperMotion:'material-coordinate unfastening and rigid hinged prong',keeperSize:[.018*this.closure.scale,.060*this.closure.scale],paperMaterial:'unchanged chapter-five v14'};}
 exportKeeper(){
  const p=this.progress,camera=this.camera,size=this.renderer.getSize(new T.Vector2()),visible=this.scene.children.map(o=>[o,o.visible]);
  this.closure.group.position.set(0,0,0);this.closure.group.rotation.set(0,0,0);this.closure.group.visible=true;
  for(const[o]of visible)if(o!==this.closure.group&&!o.isLight)o.visible=false;
  this.camera=new T.PerspectiveCamera(32,1,.01,30);this.camera.position.set(.42,.20,1.8);this.camera.lookAt(0,0,.08);this.renderer.setSize(900,900,false);this.render();const png=this.renderer.domElement.toDataURL('image/png');
  this.camera=camera;this.renderer.setSize(size.x,size.y,false);for(const[o,v]of visible)o.visible=v;this.setProgress(p);this.render();return png;
 }
 interaction(){
  const project=(x,y,z)=>{const p=new T.Vector3(x,y,z).project(this.camera);return{x:.5+.5*p.x,y:.5+.5*p.y};};
  return {top:[project(-this.width/2,this.bounds.top,0),project(this.width/2,this.bounds.top,0)],bottom:[project(-this.width/2,this.bounds.bottom,0),project(this.width/2,this.bounds.bottom,0)],keeper:this.closure.group.visible?project(this.closure.group.position.x,this.closure.group.position.y,this.closure.group.position.z+this.closure.radius):null,paperProgress:this.paperProgress};
 }
 inspectionGeometry(){
  if(this.paperProgress!==0)throw Error('Contact inspection expects the closed paper');
  const result=this.closure.inspectionGeometry();
  if(this.progress===0){
   // CPU transcription of the existing closed-paper vertex shader, for offline
   // collision inspection only. Includes the actual v14 edge/fold displacement.
   const p=this.geometry.attributes.position,vertices=[],R=this.closure.radius,k=this.template.layerThickness/(2*Math.PI),boundary=-this.height/2;
   this.sheet.updateMatrixWorld(true);const point=new T.Vector3();
   for(let i=0;i<p.count;i++){
    const x=p.getX(i),y=p.getY(i),u=x/this.width+.5,v=.5-y/this.height,edge=(Math.abs(x)/(this.width/2))**6;
    const diagonal=Math.exp(-(((v-(.11+.365*u))/.009)**2))*(1-T.MathUtils.smoothstep(u,.42,.55)),fold=Math.exp(-(((v-(.645+.04*u))/.010)**2));
    let z=-.008*diagonal-.011*fold+.009*Math.sin(y*4+x*2)+.025*edge*Math.sin(y*3.2+.4),py=y,pz=z;
    const s=-y-boundary;if(s>0){const min=R*.08,tf=(R-min)/k,sf=R*tf-.5*k*tf*tf,theta=s>=sf?tf+(s-sf)/min:2*s/(R+Math.sqrt(Math.max(0,R*R-2*k*s))),r=Math.max(R-k*theta,min)-z;py=-(boundary+r*Math.sin(theta));pz=R-r*Math.cos(theta);}
    point.set(x,py,pz).applyMatrix4(this.sheet.matrixWorld);vertices.push(point.x,point.y,point.z);
   }
   result.paperMesh={vertices,indices:Array.from(this.geometry.index.array)};
  }
  return result;
 }
}

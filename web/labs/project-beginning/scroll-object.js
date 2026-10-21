import * as T from '../certification/vendor/three.module.js';
import {ScrollObject as FinishedScroll} from '../chapter-scroll-v19/scroll-object.js';

const oldFolds=/float u=q\.x\/scrollWidth\+\.5, sheetV=\.5-q\.y\/scrollHeight;\s*float diagonal=exp\(-pow\(\(sheetV-\(\.11\+\.365\*u\)\)\/\.009,2\.\)\)\*\(1\.-smoothstep\(\.42,\.55,u\)\);\s*float crossfold=exp\(-pow\(\(sheetV-\(\.645\+\.04\*u\)\)\/\.010,2\.\)\);\s*v\.z=-\.008\*diagonal-\.011\*crossfold;\s*v\.z\+=\.009\*sin/;
const literal=value=>{if(!Number.isFinite(value))throw Error('Invalid trial fold parameter');return value.toFixed(10);};
export function applyProjectFolds(shader,folds){
 if(!oldFolds.test(shader.vertexShader))throw Error('The inherited paper fold shader changed; review the project-only adaptation');
 const d=folds.diagonal,l=folds.lower;
 shader.vertexShader=shader.vertexShader.replace(oldFolds,`float u=q.x/scrollWidth+.5, sheetV=.5-q.y/scrollHeight;
   float projectDiagonal=exp(-pow((sheetV-(${literal(d.offset)}+${literal(d.slope)}*u))/${literal(d.width)},2.));
   float projectLower=exp(-pow((sheetV-(${literal(l.offset)}+${literal(l.sine)}*sin(3.141592653589793*u)+${literal(l.slope)}*u))/${literal(l.width)},2.));
   v.z=-${literal(d.depth)}*projectDiagonal-${literal(l.depth)}*projectLower;
   v.z+=.009*sin`);
}
// CPU correspondence for closed-paper contact inspection, not a substitute for
// compiling or testing the real vertex, finite-difference normal and depth GLSL.
export function projectFoldDisplacement(u,v,folds){
 const d=folds.diagonal,l=folds.lower;
 return -d.depth*Math.exp(-(((v-(d.offset+d.slope*u))/d.width)**2))
  -l.depth*Math.exp(-(((v-(l.offset+l.sine*Math.sin(Math.PI*u)+l.slope*u))/l.width)**2));
}
export class ScrollObject extends FinishedScroll{
 constructor(...args){
  super(...args);const folds=this.template.paperFolds,profile=this.template.paperMicrostructure;
  for(const material of [this.material,this.sheet.customDepthMaterial]){
   const previous=material.onBeforeCompile;material.onBeforeCompile=shader=>{previous(shader);applyProjectFolds(shader,folds);};
   material.customProgramCacheKey=()=>`project-beginning-fold-trial-v1-${material===this.material?'paper':'shadow'}-${JSON.stringify(folds)}`;material.needsUpdate=true;
  }
  // v17 changes wrapping and normalScale after its async preparation. Restore
  // this work's first-chapter starting profile only AFTER that entire chain,
  // including v19 keeper finishing. Other chapters retain their own values.
  const prepared=this.environmentReady;
  this.environmentReady=prepared.then(()=>{
   for(const map of [this.material.normalMap,this.material.roughnessMap]){
    if(!map)throw Error('The independent paper microstructure did not load');
    map.wrapS=map.wrapT=T.RepeatWrapping;map.repeat.set(...profile.repeat);map.needsUpdate=true;
   }
   this.material.normalScale.set(profile.normalScale,profile.normalScale);this.material.bumpScale=profile.impressionScale;
   this.material.needsUpdate=true;this.paperProfilePrepared=true;this.dirty=true;
  });
 }
 inspectionGeometry(){
  const result=this.closure.inspectionGeometry();
  if(this.progress!==0||this.paperProgress!==0)return result;
  const p=this.geometry.attributes.position,vertices=[],R=this.closure.radius,k=this.template.layerThickness/(2*Math.PI),boundary=-this.height/2,point=new T.Vector3();
  this.sheet.updateMatrixWorld(true);
  for(let i=0;i<p.count;i++){
   const x=p.getX(i),y=p.getY(i),u=x/this.width+.5,v=.5-y/this.height,edge=(Math.abs(x)/(this.width/2))**6;
   const z=projectFoldDisplacement(u,v,this.template.paperFolds)+.009*Math.sin(y*4+x*2)+.025*edge*Math.sin(y*3.2+.4);let py=y,pz=z;
   const s=-y-boundary;
   if(s>0){const min=R*.08,tf=(R-min)/k,sf=R*tf-.5*k*tf*tf,theta=s>=sf?tf+(s-sf)/min:2*s/(R+Math.sqrt(Math.max(0,R*R-2*k*s))),r=Math.max(R-k*theta,min)-z;py=-(boundary+r*Math.sin(theta));pz=R-r*Math.cos(theta);}
   point.set(x,py,pz).applyMatrix4(this.sheet.matrixWorld);vertices.push(point.x,point.y,point.z);
  }
  result.paperMesh={vertices,indices:Array.from(this.geometry.index.array)};return result;
 }
 snapshot(){
  const texture=map=>map?{repeat:map.repeat.toArray(),wrapS:map.wrapS,wrapT:map.wrapT,colorSpace:map.colorSpace,source:map.image?.currentSrc||map.image?.src||null}:null;
  return {...super.snapshot(),edition:'project beginning — manufacturing trial',
   paperMaterial:'chapter-one scan microstructure starting profile; independent new albedo; retained v6 matte response',
   paperFolds:this.template.paperFolds,paperProfilePrepared:this.paperProfilePrepared??false,
   paperProfile:{normalScale:this.material.normalScale.toArray(),bumpScale:this.material.bumpScale,
    normal:texture(this.material.normalMap),roughness:texture(this.material.roughnessMap),
    sheen:this.material.sheen,specularIntensity:this.material.specularIntensity,envMapIntensity:this.material.envMapIntensity,
    actualGPUVerified:false,artisticApproval:false}};
 }
}

import * as T from '../certification/vendor/three.module.js';
import {ScrollObject as FinishedScroll} from '../chapter-scroll-v19/scroll-object.js';

const oldFolds=/float u=q\.x\/scrollWidth\+\.5, sheetV=\.5-q\.y\/scrollHeight;\s*float diagonal=exp\(-pow\(\(sheetV-\(\.11\+\.365\*u\)\)\/\.009,2\.\)\)\*\(1\.-smoothstep\(\.42,\.55,u\)\);\s*float crossfold=exp\(-pow\(\(sheetV-\(\.645\+\.04\*u\)\)\/\.010,2\.\)\);\s*v\.z=-\.008\*diagonal-\.011\*crossfold;\s*v\.z\+=\.009\*sin/;
export function applyProjectFold(shader,fold){
 if(!oldFolds.test(shader.vertexShader))throw Error('The inherited paper fold shader changed; review the project-only adaptation');
 shader.vertexShader=shader.vertexShader.replace(oldFolds,`float sheetV=.5-q.y/scrollHeight;\n   float projectFold=exp(-pow((sheetV-${fold.position.toFixed(10)})/${fold.width.toFixed(5)},2.));\n   v.z=-${fold.depth.toFixed(5)}*projectFold;\n   v.z+=.009*sin`);
}
// Same accepted paper, keeper, v19 finishing and prewarm. Only this work's
// authored fold changes; the chapter-five diagonal/cross-fold is not inherited.
export class ScrollObject extends FinishedScroll{
 constructor(...args){
  super(...args);const fold=this.template.paperFold;
  for(const material of [this.material,this.sheet.customDepthMaterial]){
   const previous=material.onBeforeCompile;material.onBeforeCompile=shader=>{previous(shader);applyProjectFold(shader,fold);};
   material.customProgramCacheKey=()=>`returning-thread-fold-v1-${material===this.material?'paper':'shadow'}-${fold.position}-${fold.width}-${fold.depth}`;material.needsUpdate=true;
  }
 }
 inspectionGeometry(){
  const result=super.inspectionGeometry();if(this.progress!==0||this.paperProgress!==0)return result;
  // Keep the contact inspector's CPU transcription consistent with the single
  // project fold; do not report the superseded chapter-five paper silhouette.
  const p=this.geometry.attributes.position,vertices=[],R=this.closure.radius,k=this.template.layerThickness/(2*Math.PI),boundary=-this.height/2,fold=this.template.paperFold,point=new T.Vector3();
  this.sheet.updateMatrixWorld(true);
  for(let i=0;i<p.count;i++){
   const x=p.getX(i),y=p.getY(i),v=.5-y/this.height,edge=(Math.abs(x)/(this.width/2))**6;
   let z=-fold.depth*Math.exp(-(((v-fold.position)/fold.width)**2))+.009*Math.sin(y*4+x*2)+.025*edge*Math.sin(y*3.2+.4),py=y,pz=z;
   const s=-y-boundary;
   if(s>0){const min=R*.08,tf=(R-min)/k,sf=R*tf-.5*k*tf*tf,theta=s>=sf?tf+(s-sf)/min:2*s/(R+Math.sqrt(Math.max(0,R*R-2*k*s))),r=Math.max(R-k*theta,min)-z;py=-(boundary+r*Math.sin(theta));pz=R-r*Math.cos(theta);}
   point.set(x,py,pz).applyMatrix4(this.sheet.matrixWorld);vertices.push(point.x,point.y,point.z);
  }
  result.paperMesh={vertices,indices:Array.from(this.geometry.index.array)};return result;
 }
 snapshot(){return {...super.snapshot(),edition:'project commemorative — The Returning Thread',paperMaterial:'independent project parchment; unchanged v19 matte response',paperFold:this.template.paperFold};}
}

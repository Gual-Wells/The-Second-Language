import * as T from '../certification/vendor/three.module.js';
import {GLTFLoader} from '../keeper-asset-study/vendor/GLTFLoader.js';
import {rollRadius} from '../chapter-scroll/vendor/paperlab-roll.js';
import {MaterialPath,RELEASE_END} from './keeper-motion.js';
export class Keeper{
 constructor(scene,template){
  this.template=template;this.radius=rollRadius(template.height,template.coreRadius,template.layerThickness);this.group=new T.Group();this.group.name='accepted-keeper-scroll-fitting';scene.add(this.group);
  this.parts=[];this.maps=[];this.pose={phase:'loading'};this.pending=[0,0];
  this.ready=this.load();
 }
 async load(){
  const response=await fetch(new URL('./keeper-path.json',import.meta.url));if(!response.ok)throw Error('Keeper path unavailable');const data=await response.json();this.path=new MaterialPath(data);
  const gltf=await new GLTFLoader().loadAsync(new URL('../keeper-physical-assembly/assets/keeper-physical.glb',import.meta.url).href);this.model=gltf.scene;
  // Record bind-space frames before fitting the whole object to the paper.
  this.model.updateMatrixWorld(true);this.bones=Array.from({length:data.boneCount},(_,i)=>this.model.getObjectByName(`STRAP_${String(i).padStart(2,'0')}`));
  this.rest=this.bones.map(b=>{const p=new T.Vector3(),q=new T.Quaternion(),s=new T.Vector3();b.matrixWorld.decompose(p,q,s);return {p,q,s,parent:b.parent.matrixWorld.clone()};});
  this.hinge=this.model.getObjectByName('Prong_hinge_|_heel-bar_axis');if(!this.hinge)this.model.traverse(o=>{if(o.name.startsWith('Prong_hinge'))this.hinge=o;});
  if(!this.hinge||this.bones.some(b=>!b))throw Error('Accepted keeper rig missing');this.hingeRest=this.hinge.quaternion.clone();
  this.model.traverse(o=>{if(o.isMesh){this.parts.push(o);o.frustumCulled=false;o.castShadow=true;o.receiveShadow=true;o.material.transparent=false;o.material.opacity=1;for(const key of ['map','normalMap','roughnessMap','metalnessMap'])if(o.material[key])this.maps.push(o.material[key]);if(o.isSkinnedMesh){this.strap=o;o.morphTargetInfluences.fill(0);}}});
  this.gap=.014;this.scale=(this.radius+this.gap)/((data.radiusMm-data.thicknessMm/2)*.001);
  this.fitting=new T.Group();this.fitting.rotation.z=Math.PI/2;this.fitting.scale.setScalar(this.scale);this.fitting.add(this.model);this.group.add(this.fitting);
  this.halfWidth=.014*this.scale;this.deltaQ=new T.Quaternion();this.local=new T.Matrix4();this.desired=new T.Matrix4();this.inv=new T.Matrix4();this.axis=new T.Vector3(0,1,0);this.unit=new T.Vector3(1,1,1);
  this.update(...this.pending);
 }
 update(progress,centerY){
  this.pending=[progress,centerY];if(!this.path||!this.fitting)return;
  const r=T.MathUtils.clamp(progress/RELEASE_END,0,1),pose=this.path.sample(r),world=[];
  if(r===0){for(let i=0;i<this.bones.length;i++){const b=this.bones[i],rest=this.rest[i];this.inv.copy(rest.parent).invert();this.desired.compose(rest.p,rest.q,rest.s);this.local.multiplyMatrices(this.inv,this.desired);this.local.decompose(b.position,b.quaternion,b.scale);}}
  else for(let i=0;i<this.bones.length;i++){
   const b=this.bones[i],rest=this.rest[i],head=pose.heads[i],tail=pose.heads[i+1];
   const oldTail=i+1<this.bones.length?this.rest[i+1].p:new T.Vector3(this.path.points.at(-1)[0]*.001,0,-this.path.points.at(-1)[1]*.001);
   const before=oldTail.clone().sub(rest.p).normalize(),after=new T.Vector3(tail[0]-head[0],0,-tail[1]+head[1]).normalize();
   this.deltaQ.setFromUnitVectors(before,after);const q=this.deltaQ.clone().multiply(rest.q);
   this.desired.compose(new T.Vector3(head[0]*.001,0,-head[1]*.001),q,rest.s);world.push(this.desired.clone());
   this.inv.copy(i?world[i-1]:rest.parent).invert();this.local.multiplyMatrices(this.inv,this.desired);this.local.decompose(b.position,b.quaternion,b.scale);
  }
  this.hinge.quaternion.copy(this.hingeRest).multiply(new T.Quaternion().setFromAxisAngle(this.axis,pose.pin));
  const slideDistance=this.template.width/2+this.halfWidth+.14;
  this.group.position.set(-slideDistance*pose.slide-.85*pose.depart,centerY,this.radius+.10*pose.depart);
  this.group.rotation.set(0,.08*pose.depart,-.1*pose.depart);this.group.visible=progress<RELEASE_END;
  this.group.updateMatrixWorld(true);this.strap.skeleton.update();
  this.pose={...pose,heads:undefined,visible:this.group.visible,opacity:1,x:this.group.position.x,y:this.group.position.y,z:this.group.position.z,fitScale:this.scale,closedRadialGap:this.gap,usesFade:false,usesFrontCutout:false,bones:this.bones.length,model:'accepted continuous physical strap; same GLB and textures',materialLengthMm:this.path.length};
 }
 snapshot(){return {...this.pose};}
 inspectionGeometry(){
  this.group.updateMatrixWorld(true);this.strap.skeleton.update();const p=new T.Vector3();
  return {paperRadius:this.radius+.006,paperCenterY:this.pending[1],paperCenterZ:this.radius,paperHalfWidth:this.template.width/2,meshes:this.parts.map(o=>{
   const vertices=[];for(let i=0;i<o.geometry.attributes.position.count;i++){o.getVertexPosition(i,p);p.applyMatrix4(o.matrixWorld);vertices.push(p.x,p.y,p.z);}
   return {name:o.name,leather:o===this.strap,vertices,indices:o.geometry.index?Array.from(o.geometry.index.array):Array.from({length:vertices.length/3},(_,i)=>i)};
  })};
 }
 dispose(){for(const o of this.parts){o.geometry.dispose();o.material.dispose();}for(const t of new Set(this.maps))t.dispose();this.group.removeFromParent();}
}

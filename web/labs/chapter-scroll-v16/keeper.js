import * as T from '../certification/vendor/three.module.js';
import {GLTFLoader} from '../keeper-asset-study/vendor/GLTFLoader.js';
import {rollRadius} from '../chapter-scroll/vendor/paperlab-roll.js';
import {fittingPose} from './keeper-motion.js';
export class Keeper{
 constructor(scene,template){
  this.template=template;this.radius=rollRadius(template.height,template.coreRadius,template.layerThickness);this.group=new T.Group();this.group.name='accepted-keeper-scroll-fitting';scene.add(this.group);
  this.parts=[];this.maps=[];this.pose={phase:'loading'};this.pending=[0,0];this.ready=this.load();
 }
 async load(){
  const response=await fetch(new URL('./keeper-path.json',import.meta.url));if(!response.ok)throw Error('Keeper dimensions unavailable');this.spec=await response.json();
  const gltf=await new GLTFLoader().loadAsync(new URL('../keeper-physical-assembly/assets/keeper-physical.glb',import.meta.url).href);this.model=gltf.scene;
  this.model.traverse(o=>{if(o.isMesh){this.parts.push(o);o.frustumCulled=false;o.castShadow=true;o.receiveShadow=true;o.material.transparent=false;o.material.opacity=1;for(const key of ['map','normalMap','roughnessMap','metalnessMap'])if(o.material[key])this.maps.push(o.material[key]);if(o.isSkinnedMesh){this.strap=o;o.morphTargetInfluences.fill(0);}}});
  if(!this.strap)throw Error('Accepted keeper rig missing');
  this.gap=.014;this.scale=(this.radius+this.gap)/((this.spec.radiusMm-this.spec.thicknessMm/2)*.001);
  this.fitting=new T.Group();this.fitting.rotation.z=Math.PI/2;this.fitting.scale.setScalar(this.scale);this.fitting.add(this.model);this.group.add(this.fitting);this.halfWidth=.014*this.scale;
  this.update(...this.pending);
 }
 update(progress,centerY){
  this.pending=[progress,centerY];if(!this.fitting)return;
  const pose=fittingPose(progress,this.template.width,this.halfWidth);this.group.position.set(pose.x,centerY,this.radius+pose.z);this.group.rotation.set(0,pose.rotationY,pose.rotationZ);this.group.visible=pose.visible;
  this.group.updateMatrixWorld(true);this.strap.skeleton.update();
  this.pose={...pose,y:this.group.position.y,z:this.group.position.z,fitScale:this.scale,closedRadialGap:this.gap,usesFade:false,usesFrontCutout:false,usesStrapDeformation:false,bones:this.strap.skeleton.bones.length-1,model:'accepted continuous physical strap; same GLB and textures',materialLengthMm:this.spec.lengthMm};
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

import * as T from '../certification/vendor/three.module.js';
import {GLTFLoader} from '../keeper-asset-study/vendor/GLTFLoader.js';
import {rollRadius} from '../chapter-scroll/vendor/paperlab-roll.js';
import {MaterialPath,RELEASE_END} from './keeper-motion.js';

// Material-coordinate curve deformation, the same approach used by Three's
// CurveModifier. Original cut edges, holes, UVs and scanned PBR remain intact.
// The flat inspection morph supplies material coordinates, never an on-screen
// replacement. Metal remains rigid. CPU inspection shares the rendered curve.
const SIZE=1024;
const vertex=`
uniform sampler2D keeperCurve;
uniform float keeperLength;
attribute vec3 keeperMaterial,keeperNormal,keeperResidual;
varying vec3 vKeeperMaterial;
vec3 keeperRow(float row){
 float f=clamp(keeperMaterial.x/keeperLength,0.,1.)*${SIZE-1}.;
 float i=floor(f);vec3 a=texture2D(keeperCurve,vec2((i+.5)/${SIZE}.,(row+.5)/4.)).xyz;
 vec3 b=texture2D(keeperCurve,vec2((min(i+1.,${SIZE-1}.)+.5)/${SIZE}.,(row+.5)/4.)).xyz;
 return mix(a,b,fract(f));
}
`;
export class Keeper{
 constructor(scene,template){
  this.template=template;this.radius=rollRadius(template.height,template.coreRadius,template.layerThickness);
  this.group=new T.Group();this.group.name='continuous-unfastening-keeper';scene.add(this.group);
  this.parts=[];this.maps=[];this.pending=[0,0];this.pose={phase:'loading'};this.ready=this.load();
 }
 async load(){
  const data=await(await fetch(new URL('./keeper-path.json',import.meta.url))).json();this.path=new MaterialPath(data);
  const gltf=await new GLTFLoader().loadAsync(new URL('./assets/keeper-physical.glb',import.meta.url).href,e=>this.onLoadingProgress?.(Math.min(1,e.loaded/(e.total||16838068))));
  this.model=gltf.scene;this.model.updateMatrixWorld(true);this.sourceMeshes=[];
  this.model.traverse(o=>{if(o.name.startsWith('Prong_hinge'))this.hinge=o;if(o.isMesh)this.sourceMeshes.push(o);});
  if(!this.hinge)throw Error('Rigid prong hinge unavailable');this.hingeRest=this.hinge.quaternion.clone();
  const original=this.sourceMeshes.find(o=>o.isSkinnedMesh);if(!original)throw Error('Original continuous strap unavailable');
  const geometry=original.geometry.clone(),p=geometry.attributes.position,n=geometry.attributes.normal,morph=geometry.morphAttributes.position[0];
  this.curveData=new Float32Array(SIZE*4*4);this.curve=new T.DataTexture(this.curveData,SIZE,4,T.RGBAFormat,T.FloatType);this.curve.minFilter=this.curve.magFilter=T.NearestFilter;this.curve.generateMipmaps=false;
  this.uniforms={keeperCurve:{value:this.curve},keeperLength:{value:data.lengthMm}};
  const flat=new Float32Array(p.count*3),norm=new Float32Array(p.count*3),base=new T.Vector3(),normal=new T.Vector3();
  for(let i=0;i<p.count;i++){
   base.fromBufferAttribute(p,i);const f=new T.Vector3().fromBufferAttribute(morph,i);if(geometry.morphTargetsRelative)f.add(base);
   const s=(f.x+data.lengthMm*.0005)*1000,o=f.z*1000,w=f.y*1000;flat.set([s,o,w],i*3);
   const frame=this.path.restFrame(s);normal.fromBufferAttribute(n,i);
   norm.set([normal.x*frame[2]-normal.z*frame[3],normal.y,-normal.x*frame[3]-normal.z*frame[2]],i*3);
  }
  geometry.morphAttributes={};geometry.deleteAttribute('skinIndex');geometry.deleteAttribute('skinWeight');
  geometry.setAttribute('keeperMaterial',new T.BufferAttribute(flat,3));geometry.setAttribute('keeperNormal',new T.BufferAttribute(norm,3));
  this.residual=new Float32Array(p.count*3);geometry.setAttribute('keeperResidual',new T.BufferAttribute(this.residual,3));
  // Correct the scan's physical texel scale across the narrow strap; the old
  // 300mm UV tile sampled a thin strip that read like stretched wood grain.
  const uv=geometry.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)*3,uv.getY(i)*3);
  this.flat=flat;this.strap=new T.Mesh(geometry,original.material.clone());this.strap.name=original.name;
  this.strap.position.copy(original.position);this.strap.quaternion.copy(original.quaternion);this.strap.scale.copy(original.scale);
  original.parent.add(this.strap);original.removeFromParent();this.sourceMeshes=this.sourceMeshes.filter(o=>o!==original);this.sourceMeshes.push(this.strap);
  const deform=(mat,normals)=>{mat.onBeforeCompile=s=>{
   Object.assign(s.uniforms,this.uniforms);s.vertexShader=vertex+s.vertexShader;
   s.vertexShader=s.vertexShader.replace('#include <begin_vertex>',`vKeeperMaterial=keeperMaterial;vec3 transformed=(keeperRow(0.)+normalize(keeperRow(2.))*keeperMaterial.z+normalize(keeperRow(3.))*keeperMaterial.y+mat3(normalize(keeperRow(1.)),normalize(keeperRow(2.)),normalize(keeperRow(3.)))*keeperResidual)*.001;`);
   if(normals)s.vertexShader=s.vertexShader.replace('#include <beginnormal_vertex>',`vec3 objectNormal=normalize(mat3(normalize(keeperRow(1.)),normalize(keeperRow(2.)),normalize(keeperRow(3.)))*keeperNormal);`);
   if(normals){s.fragmentShader='varying vec3 vKeeperMaterial;\n'+s.fragmentShader;
    s.fragmentShader=s.fragmentShader.replace('#include <map_fragment>',`#include <map_fragment>
     float rubbed=smoothstep(7.7,9.1,abs(vKeeperMaterial.z));
     float grain=dot(diffuseColor.rgb,vec3(.3,.59,.11));
     float irregular=.65+.35*sin(vKeeperMaterial.x*.61+sin(vKeeperMaterial.x*.19)*2.);
     diffuseColor.rgb=mix(diffuseColor.rgb*.87,vec3(.25,.135,.058)*(1.+grain),rubbed*irregular*.40);
     float crease=exp(-pow((vKeeperMaterial.x-${data.selectedHoleMm.toFixed(4)})/1.2,2.))*(.7+.3*cos(vKeeperMaterial.z*1.3));
     diffuseColor.rgb*=1.-.18*crease;
    `);
    s.fragmentShader=s.fragmentShader.replace('#include <roughnessmap_fragment>',`#include <roughnessmap_fragment>\nroughnessFactor=clamp(.65+roughnessFactor*.28,.7,.96);`);
   }
  };mat.customProgramCacheKey=()=>`material-coordinate-keeper-v17-${normals}`;mat.needsUpdate=true;};
  deform(this.strap.material,true);this.strap.customDepthMaterial=new T.MeshDepthMaterial({depthPacking:T.RGBADepthPacking});deform(this.strap.customDepthMaterial,false);
  this.strap.material.normalScale.set(.45,.45);this.strap.material.envMapIntensity=.65;
  // Dimensioned 30mm-loop derivative retains the original hardware/section.
  // Uniform scale only: no stretched metal or artificially widened strap.
  this.gap=.065;this.scale=(this.radius+this.gap)/((data.radiusMm-data.thicknessMm/2)*.001);
  this.fitting=new T.Group();this.fitting.rotation.z=Math.PI/2;this.fitting.scale.setScalar(this.scale);this.fitting.add(this.model);this.group.add(this.fitting);this.halfWidth=.014*this.scale;
  for(const o of this.sourceMeshes){this.parts.push(o);o.frustumCulled=false;o.castShadow=true;o.receiveShadow=true;o.material.transparent=false;o.material.opacity=1;if(o!==this.strap){o.material.envMapIntensity=3.;o.material.roughness=.85;}for(const key of ['map','normalMap','roughnessMap','metalnessMap'])if(o.material[key])this.maps.push(o.material[key]);}
  this.maps.push(this.curve);this.update(...this.pending);
  // Preserve the native Boolean bevels exactly in the closed pose. Carry the
  // tiny rest-to-curve residual in its material frame instead of smoothing it.
  for(let i=0;i<p.count;i++){const v=this.vertex(i,new T.Vector3()),delta=new T.Vector3().fromBufferAttribute(p,i).sub(v).multiplyScalar(1000),basis=this.rows(flat[i*3]);this.residual.set([1,2,3].map(k=>delta.dot(new T.Vector3(...basis[k]))),i*3);}
  const check=new T.Vector3();let maximum=0,total=0;for(let i=0;i<p.count;i++){this.vertex(i,check);const error=check.distanceTo(new T.Vector3().fromBufferAttribute(p,i));maximum=Math.max(maximum,error);total+=error;}
  this.restDeviationMm={maximum:maximum*1000,mean:total/p.count*1000};this.onLoadingProgress?.(1);
 }
 update(progress,centerY){
  this.pending=[progress,centerY];if(!this.path||!this.fitting)return;
  const r=T.MathUtils.clamp(progress/RELEASE_END,0,1),pose=this.path.sample(r);
  for(let i=0;i<SIZE;i++){const f=this.path.frame(this.path.length*i/(SIZE-1),pose);for(let row=0;row<4;row++)this.curveData.set(f.slice(row*3,row*3+3),(row*SIZE+i)*4);}this.curve.needsUpdate=true;
  this.hinge.quaternion.copy(this.hingeRest).multiply(new T.Quaternion().setFromAxisAngle(new T.Vector3(0,1,0),pose.pin));
  const slideDistance=this.template.width/2+this.halfWidth+.18;
  this.group.position.set(-slideDistance*pose.slide-.85*pose.depart,centerY+.025*Math.sin(pose.slide*Math.PI)-pose.circleCenter[0]*.001*this.scale,this.radius+.12*pose.depart+pose.circleCenter[1]*.001*this.scale);
  this.group.rotation.set(0,.10*pose.depart,-.12*pose.depart);this.group.visible=progress<RELEASE_END;this.group.updateMatrixWorld(true);
  this.pose={...pose,heads:undefined,point:undefined,visible:this.group.visible,opacity:1,x:this.group.position.x,y:this.group.position.y,z:this.group.position.z,fitScale:this.scale,fitScaleVector:this.fitting.scale.toArray(),bandWidth:.018*this.scale,usesFade:false,usesStrapDeformation:true,deformation:'material-coordinate curve; dimensioned continuous cut mesh; native bevel residual',sourceBones:76};
 }
 snapshot(){const {circle,suffix,suffixArc,...p}=this.pose;return {...p,restDeviationMm:this.restDeviationMm};}
 rows(s){const f=Math.max(0,Math.min(SIZE-1,s/this.path.length*(SIZE-1))),lo=Math.floor(f),hi=Math.min(SIZE-1,lo+1),a=f-lo,d=this.curveData;return Array.from({length:4},(_,r)=>{const v=Array.from({length:3},(_,k)=>d[(r*SIZE+lo)*4+k]*(1-a)+d[(r*SIZE+hi)*4+k]*a);if(r){const l=Math.hypot(...v);return v.map(x=>x/l);}return v;});}
 vertex(i,v){const o=this.flat[i*3+1],w=this.flat[i*3+2],b=this.rows(this.flat[i*3]),r=this.residual;return v.set(...b[0].map((x,k)=>(x+w*b[2][k]+o*b[3][k]+b[1][k]*r[i*3]+b[2][k]*r[i*3+1]+b[3][k]*r[i*3+2])*.001));}
 inspectionGeometry(){
  this.group.updateMatrixWorld(true);const v=new T.Vector3();return{paperRadius:this.radius+.006,paperCenterY:this.pending[1],paperCenterZ:this.radius,paperHalfWidth:this.template.width/2,meshes:this.parts.map(o=>{
   const vertices=[];for(let i=0;i<o.geometry.attributes.position.count;i++){if(o===this.strap)this.vertex(i,v);else o.getVertexPosition(i,v);v.applyMatrix4(o.matrixWorld);vertices.push(v.x,v.y,v.z);}
   return{name:o.name,leather:o===this.strap,vertices,indices:o.geometry.index?Array.from(o.geometry.index.array):Array.from({length:vertices.length/3},(_,i)=>i)};
  })};
 }
 dispose(){for(const o of this.parts){o.geometry.dispose();o.material.dispose();o.customDepthMaterial?.dispose();}for(const map of new Set(this.maps))map.dispose();this.group.removeFromParent();}
}

import * as THREE from '../certification/vendor/three.module.js';
import {KEEPER,keeperPose} from './keeper-path.js';
// Native morph targets: authored tight/loose endpoint poses, no spring.
// Approved art supplies UVs; false back-loop pixels are excluded from the
// front layer. The actual hoop below has rear depth and a solid section.
const filter=`
float iy=1.0-vMapUv.y;
float left=mix(.305,.262,smoothstep(.28,.34,iy))+.043*smoothstep(.76,.9,iy);
float right=mix(.704,.758,smoothstep(.28,.35,iy))-.046*smoothstep(.76,.91,iy);
if(vMapUv.x<left||vMapUv.x>right)discard;
`;
function sourceMaterial(map,plate){
 const m=new THREE.MeshBasicMaterial({map,transparent:true,alphaTest:.08,depthWrite:true,depthTest:true,toneMapped:false,side:THREE.DoubleSide});
 m.onBeforeCompile=s=>{s.fragmentShader=s.fragmentShader.replace('#include <alphatest_fragment>',`#include <alphatest_fragment>\n${filter}\n${plate?'if(iy<.30||iy>.76)discard;':'if(iy>=.30&&iy<=.76)discard;'}`);};
 m.customProgramCacheKey=()=>`keeper-layer-v8-${plate}`;return m;
}
function frontPose(source,radius,loose,plate){
 const out=source.clone();
 for(let i=0;i<source.count;i++){
  const x=source.getX(i),raw=source.getY(i),free=Math.max(0,Math.abs(raw)-.16);
  const y=plate?raw:raw+Math.sign(raw)*free*.31*loose;
  const ry=radius+KEEPER.closedGap+(KEEPER.looseGap-KEEPER.closedGap)*loose;
  const z=plate?ry+.029:Math.sqrt(Math.max(.002,ry*ry-y*y))+.016;
  out.setXYZ(i,x,y,radius+z);
 }return out;
}
function faceGeometry(radius,plate){
 const g=new THREE.PlaneGeometry(KEEPER.width,KEEPER.height,12,84),source=g.attributes.position.clone();
 g.setAttribute('position',frontPose(source,radius,0,plate));g.morphAttributes.position=[frontPose(source,radius,1,plate)];g.computeVertexNormals();return g;
}
function hoopGeometry(radius){
 const positions=[],open=[],uv=[],indices=[],n=112;
 for(let j=0;j<=n;j++)for(let k=0;k<4;k++){
  const a=j/n*Math.PI*2,x=(k%2?.5:-.5)*KEEPER.bandWidth,inner=k>=2?.009:0;
  for(const [array,gap]of [[positions,KEEPER.closedGap],[open,KEEPER.looseGap]]){const r=radius+gap-inner;array.push(x,Math.sin(a)*r,radius+Math.cos(a)*r);}
  uv.push(.38+.22*(k%2),.795+.06*(.5+.5*Math.cos(a*4)));
 }
 for(let j=0;j<n;j++)for(const [a,b]of [[0,1],[1,3],[3,2],[2,0]]){const q=j*4;indices.push(q+a,q+b,q+b+4,q+a,q+b+4,q+a+4);}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(indices);g.morphAttributes.position=[new THREE.Float32BufferAttribute(open,3)];g.computeVertexNormals();return g;
}
export class Keeper {
 constructor(scene,map,template){
  this.template=template;this.group=new THREE.Group();scene.add(this.group);const {radius}=keeperPose(0,template);
  this.band=new THREE.Mesh(hoopGeometry(radius),new THREE.MeshStandardMaterial({map,roughness:.96,metalness:0,side:THREE.DoubleSide}));
  this.front=new THREE.Mesh(faceGeometry(radius,false),sourceMaterial(map,false));this.plate=new THREE.Mesh(faceGeometry(radius,true),sourceMaterial(map,true));
  this.parts=[this.band,this.front,this.plate];this.group.add(...this.parts);
  for(const mesh of this.parts){mesh.frustumCulled=false;mesh.renderOrder=0;}
 }
 update(progress,centerY){
  const p=this.pose=keeperPose(progress,this.template);this.group.visible=p.visible;
  this.group.position.set(p.x,centerY+p.y,p.z);this.group.rotation.set(0,p.rotationY,p.rotationZ);
  for(const mesh of this.parts){mesh.morphTargetInfluences[0]=p.loosen;mesh.material.opacity=p.opacity;mesh.material.transparent=p.opacity<1||mesh!==this.band;}
 }
 snapshot(){return {...this.pose,model:'layered hoop + rigid buckle + authored tight/loose morph',depthTest:true,depthWrite:true};}
 dispose(){for(const mesh of this.parts){mesh.geometry.dispose();mesh.material.dispose();}this.group.removeFromParent();}
}

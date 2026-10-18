import * as T from '../certification/vendor/three.module.js';
import {rollRadius} from '../chapter-scroll/vendor/paperlab-roll.js';
const ease=(a,b,x)=>{const t=T.MathUtils.clamp((x-a)/(b-a),0,1);return t*t*(3-2*t);};
const END=.24, WIDTH=.29, THICKNESS=.012;

function leatherBand(radius,material){
 const points=[],uv=[],indices=[],joints=[],weights=[],bones=[],N=64;
 for(let j=0;j<N;j++){const bone=new T.Bone();bone.name=`leather-section-${j}`;bones.push(bone);}
 for(let j=0;j<=N;j++)for(let k=0;k<4;k++){
  const angle=j/N*Math.PI*2,r=radius+.028-(k>=2?THICKNESS:0);
  points.push((k%2?.5:-.5)*WIDTH,Math.sin(angle)*r,radius+Math.cos(angle)*r);
  uv.push(k%2,j/N*3.1);joints.push(j%N,0,0,0);weights.push(1,0,0,0);
 }
 for(let j=0;j<N;j++)for(const [a,b]of [[0,1],[1,3],[3,2],[2,0]]){const q=j*4;indices.push(q+a,q+b,q+b+4,q+a,q+b+4,q+a+4);}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(points,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setAttribute('skinIndex',new T.Uint16BufferAttribute(joints,4));g.setAttribute('skinWeight',new T.Float32BufferAttribute(weights,4));g.setIndex(indices);g.computeVertexNormals();
 const mesh=new T.SkinnedMesh(g,material);const root=new T.Bone();root.name='keeper-root';root.add(...bones);mesh.add(root);mesh.bind(new T.Skeleton([root,...bones]));
 // Indices include the skeleton root at slot zero.
 const si=g.getAttribute('skinIndex');for(let i=0;i<si.count;i++)si.setX(i,si.getX(i)+1);
 return {mesh,bones};
}
function tailGeometry(){
 const s=new T.Shape();s.moveTo(-.137,.26);s.lineTo(.137,.26);s.lineTo(.137,-.20);s.quadraticCurveTo(.13,-.34,0,-.375);s.quadraticCurveTo(-.13,-.34,-.137,-.20);s.closePath();
 for(const y of [.075,-.09]){const h=new T.Path();h.absellipse(0,y,.017,.022,0,Math.PI*2,true);s.holes.push(h);}
 const g=new T.ExtrudeGeometry(s,{depth:THICKNESS,bevelEnabled:true,bevelSize:.003,bevelThickness:.003,bevelSegments:2,steps:1,curveSegments:20});
 const uv=g.getAttribute('uv'),p=g.getAttribute('position');for(let i=0;i<uv.count;i++)uv.setXY(i,(p.getX(i)+.145)/.29,(p.getY(i)+.38)/.65);return g;
}
export class Keeper{
 constructor(scene,unusedMap,template){
  this.template=template;this.group=new T.Group();this.group.name='forged-buckle-and-leather-keeper';scene.add(this.group);
  this.radius=rollRadius(template.height,template.coreRadius,template.layerThickness);this.maps=[];
  this.leather=new T.MeshStandardMaterial({color:0xd4b794,roughness:.94,metalness:0,side:T.DoubleSide});
  this.leather.onBeforeCompile=s=>{s.fragmentShader=s.fragmentShader.replace('#include <map_fragment>',`#include <map_fragment>
   #ifdef USE_MAP
    float rubbed=pow(clamp(abs(vMapUv.x-.5)*2.,0.,1.),10.);
    float grain=texture2D(map,vMapUv*vec2(2.3,1.7)).r;
    diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.19,.105,.047),rubbed*(.42+.25*grain));
   #endif`);};this.leather.customProgramCacheKey=()=> 'edge-rubbed-leather-v14';
  this.metal=new T.MeshStandardMaterial({color:0xe6d7bd,roughness:.88,metalness:.77});
  this.metal.onBeforeCompile=s=>{s.fragmentShader=s.fragmentShader.replace('#include <roughnessmap_fragment>','#include <roughnessmap_fragment>\nroughnessFactor=max(.64,roughnessFactor);');};this.metal.customProgramCacheKey=()=> 'worn-forged-bronze-v14';
  this.edge=new T.MeshStandardMaterial({color:0x342318,roughness:1,metalness:0});
  const band=leatherBand(this.radius,this.leather);this.band=band.mesh;this.bones=band.bones;this.group.add(this.band);
  this.fitting=new T.Group();this.group.add(this.fitting);
  const pts=[];for(let i=0;i<64;i++){const a=i/64*Math.PI*2;pts.push(new T.Vector3(.165*Math.cos(a)*(1+.035*Math.sin(a*3)),.215*Math.sin(a),.006*Math.sin(a*2)));}
  this.frame=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts,true),96,.024,10,true),this.metal);this.fitting.add(this.frame);
  const fp=this.frame.geometry.attributes.position,fn=this.frame.geometry.attributes.normal;for(let i=0;i<fp.count;i++){const d=.00055*Math.sin(i*1.73)+.00035*Math.cos(i*.63);fp.setXYZ(i,fp.getX(i)+fn.getX(i)*d,fp.getY(i)+fn.getY(i)*d,fp.getZ(i)+fn.getZ(i)*d);}this.frame.geometry.computeVertexNormals();
  this.tail=new T.Group();this.fitting.add(this.tail);this.tail.add(new T.Mesh(tailGeometry(),this.leather));this.tail.position.z=-.018;
  this.pin=new T.Group();this.pin.position.set(0,-.155,.018);this.fitting.add(this.pin);
  const pinCurve=new T.CatmullRomCurve3([new T.Vector3(0,0,0),new T.Vector3(0,.10,.003),new T.Vector3(0,.20,0),new T.Vector3(0,.23,-.036)]);
  const prong=new T.Mesh(new T.TubeGeometry(pinCurve,30,.010,10,false),this.metal);this.pin.add(prong);
  const axle=new T.Mesh(new T.CylinderGeometry(.014,.014,.25,10),this.metal);axle.rotation.z=Math.PI/2;axle.position.set(0,-.155,.018);this.fitting.add(axle);
  for(const x of [-.096,.096]){const rivet=new T.Mesh(new T.SphereGeometry(.015,12,8),this.metal);rivet.position.set(x,.24,.003);this.tail.add(rivet);}
  this.parts=[];this.group.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;o.frustumCulled=false;this.parts.push(o);}});
  const loader=new T.TextureLoader();const load=async(name,color=false)=>{const m=await loader.loadAsync(`assets/${name}.jpg`);if(color)m.colorSpace=T.SRGBColorSpace;m.wrapS=m.wrapT=T.RepeatWrapping;m.anisotropy=4;this.maps.push(m);return m;};
  this.ready=Promise.all([load('leather-color',true),load('leather-normalgl'),load('leather-roughness'),load('metal-normal'),load('metal-roughness'),load('metal-color',true)]).then(([c,n,r,mn,mr,mc])=>{
   this.leather.map=c;this.leather.normalMap=n;this.leather.normalScale.set(.25,.25);this.leather.roughnessMap=r;this.leather.needsUpdate=true;
   for(const map of [mc,mn,mr])map.repeat.set(4,.5);
   this.metal.map=mc;this.metal.normalMap=mn;this.metal.normalScale.set(.16,.16);this.metal.roughnessMap=mr;this.metal.needsUpdate=true;
  });this.update(0,0);
 }
 update(progress,centerY){
  const r=T.MathUtils.clamp(progress/END,0,1),unlock=ease(0,.25,r),loose=ease(.16,.38,r),slide=ease(.38,.89,r),off=ease(.89,1,r),gap=.038*loose;
  // Added circumference feeds out through the buckle; the tail shortens by the
  // corresponding amount. Closed ring remains outside the paper cylinder.
  for(let j=0;j<this.bones.length;j++){const a=j/this.bones.length*Math.PI*2;this.bones[j].position.set(0,Math.sin(a)*gap,Math.cos(a)*gap);}
  this.fitting.position.z=2*this.radius+.028+gap+.020;
  this.pin.rotation.x=.72*unlock;
  this.tail.position.y=.22*loose;this.tail.rotation.x=-.12*unlock;
  this.group.position.set(-(this.template.width/2+WIDTH/2+.16)*slide-.58*off,centerY+.015*off,.018*loose+.05*off);
  this.group.rotation.set(.015*off,.06*off,-.13*off);this.group.visible=progress<END;
  this.pose={phase:r<.25?'release-pin':r<.38?'feed-and-loosen':r<.89?'slide-clear':r<1?'depart':'off',x:this.group.position.x,y:this.group.position.y,z:this.group.position.z,visible:this.group.visible,loosen:loose,pinAngle:this.pin.rotation.x,minimumRadialClearance:.016+gap,opacity:1};
 }
 snapshot(){return {...this.pose,model:'solid leather band with 64 controlled bones; volumetric forged frame, axle, pin and perforated leather tongue',meshCount:this.parts.length,bones:this.bones.length,usesFrontCutout:false,usesFade:false};}
 dispose(){for(const o of this.parts)o.geometry.dispose();for(const m of [this.leather,this.metal,this.edge])m.dispose();for(const t of this.maps)t.dispose();this.group.removeFromParent();}
}

import * as T from '../certification/vendor/three.module.js';
import {rollRadius} from '../chapter-scroll/vendor/paperlab-roll.js';
const ease=(a,b,x)=>{const t=T.MathUtils.clamp((x-a)/(b-a),0,1);return t*t*(3-2*t);};
const END=.24, WIDTH=.29, THICKNESS=.014;
function leatherBand(radius,material,edge){
 const points=[],uv=[],indices=[],joints=[],weights=[],bones=[],N=64;
 for(let j=0;j<N;j++){const bone=new T.Bone();bone.name=`leather-section-${j}`;bones.push(bone);}
 for(let j=0;j<=N;j++)for(let k=0;k<4;k++){
  const a=j/N*Math.PI*2,r=radius+.029-(k>=2?THICKNESS:0),side=k%2?1:-1;
  const cut=.0017*Math.sin(a*11+side)+.0011*Math.cos(a*19+side*4),wrinkle=.0022*Math.sin(a*7+.3)+.0013*Math.cos(a*17);
  points.push(side*(WIDTH/2+cut),Math.sin(a)*(r+wrinkle),radius+Math.cos(a)*(r+wrinkle));uv.push(k%2,j/N*2.7);joints.push(j%N+1,0,0,0);weights.push(1,0,0,0);
 }
 const g=new T.BufferGeometry();for(const [a,b,mat]of [[0,1,0],[1,3,1],[3,2,0],[2,0,1]]){const start=indices.length;for(let j=0;j<N;j++){const q=j*4;indices.push(q+a,q+b,q+b+4,q+a,q+b+4,q+a+4);}g.addGroup(start,indices.length-start,mat);}
 g.setAttribute('position',new T.Float32BufferAttribute(points,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setAttribute('skinIndex',new T.Uint16BufferAttribute(joints,4));g.setAttribute('skinWeight',new T.Float32BufferAttribute(weights,4));g.setIndex(indices);g.computeVertexNormals();
 const mesh=new T.SkinnedMesh(g,[material,edge]),root=new T.Bone();root.name='keeper-root';root.add(...bones);mesh.add(root);mesh.bind(new T.Skeleton([root,...bones]));return {mesh,bones};
}
function tongueGeometry(){
 const s=new T.Shape();s.moveTo(-.137,.37);s.lineTo(.138,.37);s.lineTo(.136,.17);s.lineTo(.131,.09);s.lineTo(.137,-.06);s.lineTo(.128,-.25);s.bezierCurveTo(.12,-.34,.054,-.407,-.003,-.418);s.bezierCurveTo(-.064,-.406,-.128,-.35,-.137,-.25);s.lineTo(-.134,-.12);s.lineTo(-.13,-.065);s.lineTo(-.138,.08);s.closePath();
 // One engaged hole and one adjustment hole, both in the free tongue.
 for(const [x,y,rx,ry]of [[.001,.145,.018,.026],[-.002,.29,.017,.021]]){const h=new T.Path();h.absellipse(x,y,rx,ry,-.13,Math.PI*2-.13,true);s.holes.push(h);}
 const g=new T.ExtrudeGeometry(s,{depth:THICKNESS,bevelEnabled:true,bevelSize:.0032,bevelThickness:.0025,bevelSegments:3,curveSegments:24,steps:1,material:0,extrudeMaterial:1}),p=g.attributes.position,uv=g.attributes.uv;
 for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i);p.setZ(i,p.getZ(i)+.014*Math.exp(-Math.pow((y+.37)/.09,2))+.003*Math.sin(y*27+x*7));uv.setXY(i,(x+.145)/.29,(y+.42)/.8);}g.computeVertexNormals();return g;
}
function rounded(s,w,h,r,reverse=false){
 if(reverse){s.moveTo(-w+r,-h);s.lineTo(w-r,-h);s.quadraticCurveTo(w,-h,w,-h+r);s.lineTo(w,h-r);s.quadraticCurveTo(w,h,w-r,h);s.lineTo(-w+r,h);s.quadraticCurveTo(-w,h,-w,h-r);s.lineTo(-w,-h+r);s.quadraticCurveTo(-w,-h,-w+r,-h);}
 else{s.moveTo(-w+r,h);s.lineTo(w-r,h);s.quadraticCurveTo(w,h,w,h-r);s.lineTo(w,-h+r);s.quadraticCurveTo(w,-h,w-r,-h);s.lineTo(-w+r,-h);s.quadraticCurveTo(-w,-h,-w,-h+r);s.lineTo(-w,h-r);s.quadraticCurveTo(-w,h,-w+r,h);}s.closePath();
}
function frameGeometry(){
 const s=new T.Shape();rounded(s,.205,.222,.089);const h=new T.Path();rounded(h,.146,.163,.063,true);s.holes.push(h);
 const g=new T.ExtrudeGeometry(s,{depth:.024,bevelEnabled:true,bevelSize:.009,bevelThickness:.009,bevelSegments:3,curveSegments:28,steps:1}),p=g.attributes.position,uv=g.attributes.uv,n=g.attributes.normal;
 const dents=[[-.16,.145,.020,.0028],[.12,.18,.016,.0023],[.19,-.075,.018,.0035]];
 for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i),a=Math.atan2(y,x);let d=0;for(const[cx,cy,r,depth]of dents)d+=depth*Math.exp(-((x-cx)**2+(y-cy)**2)/(r*r));p.setXYZ(i,x*(1+.009*Math.sin(a*5)),y+.0018*Math.sin(a*7),z+.0015*Math.sin(x*43+y*31)-d);
  if(Math.abs(n.getZ(i))>.35)uv.setXY(i,(x+.218)/.436,(y+.235)/.47);
  else if(Math.abs(n.getX(i))>Math.abs(n.getY(i)))uv.setXY(i,.5+z/.436,(y+.235)/.47);
  else uv.setXY(i,(x+.218)/.436,.5+z/.47);
 }g.computeVertexNormals();return g;
}
export class Keeper{
 constructor(scene,unusedMap,template){
  this.template=template;this.group=new T.Group();this.group.name='aged-single-frame-buckle-and-sewn-leather';scene.add(this.group);this.radius=rollRadius(template.height,template.coreRadius,template.layerThickness);this.maps=[];
  this.leather=new T.MeshStandardMaterial({color:0xffffff,roughness:.91,metalness:0,side:T.DoubleSide});
  this.leather.onBeforeCompile=s=>{s.fragmentShader=s.fragmentShader.replace('#include <map_fragment>',`#include <map_fragment>
   #ifdef USE_MAP
    float edgeWear=pow(clamp(abs(vMapUv.x-.5)*2.,0.,1.),14.);
    float irregular=.55+.45*texture2D(map,vMapUv*vec2(1.1,1.7)).r;
    diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.24,.135,.062),edgeWear*irregular*.64);
   #endif`);};this.leather.customProgramCacheKey=()=> 'aged-cut-leather-v15';
  this.metal=new T.MeshStandardMaterial({color:0xffffff,roughness:1,metalness:1,envMapIntensity:1.15});this.edge=new T.MeshStandardMaterial({color:0x68503a,roughness:.98,metalness:0});this.thread=new T.MeshStandardMaterial({color:0x756046,roughness:1,metalness:0});
  const band=leatherBand(this.radius,this.leather,this.edge);this.band=band.mesh;this.bones=band.bones;this.group.add(this.band);this.fitting=new T.Group();this.group.add(this.fitting);
  this.frame=new T.Mesh(frameGeometry(),this.metal);this.frame.position.set(0,.012,.005);this.fitting.add(this.frame);
  this.tail=new T.Group();this.fitting.add(this.tail);this.tail.add(new T.Mesh(tongueGeometry(),[this.leather,this.edge]));this.tail.position.z=-.024;
  // Fixed end folds around the hinge bar and is tunnel stitched back to itself.
  this.fixed=new T.Group();this.fitting.add(this.fixed);const foldCurve=new T.CatmullRomCurve3([new T.Vector3(0,-.35,-.055),new T.Vector3(0,-.235,-.045),new T.Vector3(0,-.18,-.020),new T.Vector3(0,-.215,.009),new T.Vector3(0,-.33,.003)]);
  const ribbon=new T.Shape();ribbon.moveTo(-.132,-.007);ribbon.lineTo(.132,-.007);ribbon.lineTo(.132,.007);ribbon.lineTo(-.132,.007);ribbon.closePath();const fg=new T.ExtrudeGeometry(ribbon,{steps:30,bevelEnabled:false,extrudePath:foldCurve}),fp=fg.attributes.position,fu=fg.attributes.uv;
  for(let i=0;i<fp.count;i++)fu.setXY(i,(fp.getX(i)+.145)/.29,(fp.getY(i)+.4)/.29);this.fixed.add(new T.Mesh(fg,this.leather));
  for(const x of [-.105,-.063,-.021,.021,.063,.105]){const c=new T.CatmullRomCurve3([new T.Vector3(x,-.298,.007),new T.Vector3(x+.005,-.31,.012),new T.Vector3(x,-.322,.007)]);this.fixed.add(new T.Mesh(new T.TubeGeometry(c,6,.0018,5,false),this.thread));}
  this.pin=new T.Group();this.pin.position.set(0,-.179,.032);this.fitting.add(this.pin);const path=new T.CatmullRomCurve3([new T.Vector3(0,0,0),new T.Vector3(-.003,.10,.009),new T.Vector3(.001,.28,.012),new T.Vector3(.001,.353,-.009)]);
  const pinGeo=new T.TubeGeometry(path,40,.013,10,false),pp=pinGeo.attributes.position,pu=pinGeo.attributes.uv;for(let i=0;i<pp.count;i++){const y=pp.getY(i),t=T.MathUtils.clamp(y/.353,0,1);pp.setX(i,pp.getX(i)*(1-.35*t));pu.setXY(i,pu.getX(i)*.9,pu.getY(i)*.18);}pinGeo.computeVertexNormals();this.pin.add(new T.Mesh(pinGeo,this.metal));
  const axle=new T.Mesh(new T.CylinderGeometry(.014,.014,.303,14),this.metal);axle.rotation.z=Math.PI/2;axle.position.set(0,-.179,.028);this.fitting.add(axle);
  this.parts=[];this.group.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;o.frustumCulled=false;this.parts.push(o);}});
  const loader=new T.TextureLoader(),load=async(name,color=false)=>{const m=await loader.loadAsync(`assets/${name}.jpg`);if(color)m.colorSpace=T.SRGBColorSpace;m.wrapS=m.wrapT=T.RepeatWrapping;m.anisotropy=8;this.maps.push(m);return m;};
  this.ready=Promise.all([load('leather-color',true),load('leather-normalgl'),load('leather-roughness'),load('metal-color',true),load('metal-normal'),load('metal-roughness'),load('metal-metalness')]).then(([c,n,r,mc,mn,mr,mm])=>{this.leather.map=c;this.leather.normalMap=n;this.leather.normalScale.set(.38,.38);this.leather.roughnessMap=r;this.leather.needsUpdate=true;this.metal.map=mc;this.metal.normalMap=mn;this.metal.normalScale.set(.29,.29);this.metal.roughnessMap=mr;this.metal.metalnessMap=mm;this.metal.needsUpdate=true;});this.update(0,0);
 }
 update(progress,centerY){
  const r=T.MathUtils.clamp(progress/END,0,1),unlock=ease(0,.25,r),loose=ease(.16,.38,r),slide=ease(.38,.89,r),off=ease(.89,1,r),gap=.038*loose;
  for(let j=0;j<this.bones.length;j++){const a=j/this.bones.length*Math.PI*2;this.bones[j].position.set(0,Math.sin(a)*gap,Math.cos(a)*gap);}
  this.fitting.position.z=2*this.radius+.029+gap+.017;this.pin.rotation.x=.87*unlock;this.tail.position.y=.22*loose;this.tail.rotation.x=-.055*unlock;
  this.group.position.set(-(this.template.width/2+WIDTH/2+.20)*slide-.58*off,centerY+.015*off,.018*loose+.05*off);this.group.rotation.set(.015*off,.06*off,-.13*off);this.group.visible=progress<END;
  this.pose={phase:r<.25?'release-pin':r<.38?'feed-and-loosen':r<.89?'slide-clear':r<1?'depart':'off',x:this.group.position.x,y:this.group.position.y,z:this.group.position.z,visible:this.group.visible,loosen:loose,pinAngle:this.pin.rotation.x,minimumRadialClearance:.015+gap,opacity:1};
 }
 snapshot(){return {...this.pose,model:'broad flattened frame; separate pin/bar; stitched fixed fold and two-hole free tongue; controlled loose band',meshCount:this.parts.length,bones:this.bones.length,usesFrontCutout:false,usesFade:false,materials:'co-registered bronze oxide/metalness and worn leather',structure:'historic buckle construction adapted to a fictional removable scroll keeper'};}
 dispose(){for(const o of this.parts)o.geometry.dispose();for(const m of [this.leather,this.metal,this.edge,this.thread])m.dispose();for(const t of this.maps)t.dispose();this.group.removeFromParent();}
}

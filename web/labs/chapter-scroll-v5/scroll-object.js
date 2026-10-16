import * as THREE from '../certification/vendor/three.module.js';
import {ScrollObject as BaseScroll} from '../chapter-scroll-v3/scroll-object.js';
import {rollRadius,rollPoint} from '../chapter-scroll/vendor/paperlab-roll.js';
import {Keeper} from './keeper.js';
// Paperlab winding in the vertex shader; rest curvature is an art-directed
// response to conservation evidence, not a material-calibrated FEM simulation.
const deformation=`
uniform float scrollBoundary,scrollRadius,scrollThickness,scrollHeight,scrollWidth,scrollOpen;
vec3 parchment(vec3 q){
 float edge=pow(abs(q.x)/(scrollWidth*.5),6.0);
 float s=-q.y-scrollBoundary;
 vec3 v=q;
 v.z=.009*sin(q.y*4.0+q.x*2.0)+.025*edge*sin(q.y*3.2+.4);
 if(s>0.0){
  float k=scrollThickness/6.28318530718;
  float rmin=scrollRadius*.08,tf=(scrollRadius-rmin)/k,sf=scrollRadius*tf-.5*k*tf*tf;
  float theta=s>=sf?tf+(s-sf)/rmin:2.0*s/(scrollRadius+sqrt(max(0.0,scrollRadius*scrollRadius-2.0*k*s)));
  float r=max(scrollRadius-k*theta,rmin)-v.z;
  v.y=-(scrollBoundary+r*sin(theta));v.z=scrollRadius-r*cos(theta);
 }else{
  // Blend out residual deformation at the winding tangent; restore the final
  // bottom lip only as the last turn releases. No geometric crack at the join.
  float open=smoothstep(.35,1.0,scrollOpen)*mix(smoothstep(0.0,.45,-s),1.0,smoothstep(.91,1.0,scrollOpen));
  float bottom=max(0.0,.56-(q.y+scrollHeight*.5)),top=max(0.0,.37-(scrollHeight*.5-q.y));
  float rb=.64+.07*sin(q.x*1.5),rt=.78+.09*cos(q.x*1.2);
  v.y+=open*(bottom-rb*sin(bottom/rb)-top+rt*sin(top/rt));
  v.z+=open*(rb*(1.0-cos(bottom/rb))+rt*(1.0-cos(top/rt))+.043*sin(q.y*1.37+q.x*.43)+.024*sin(q.y*2.7-q.x*.85)+edge*(.09+.038*sin(q.y*2.0+q.x)));
 }
 return v;
}
`;
export class ScrollObject extends BaseScroll {
 constructor(canvas,surfaces,keeperImage,template){
  super(canvas,surfaces,keeperImage,template);
  this.renderer.setPixelRatio(1);
  this.renderer.shadowMap.enabled=true;
  this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  this.geometry.dispose();this.geometry=new THREE.PlaneGeometry(this.width,this.height,52,280);this.sheet.geometry=this.geometry;
  this.sheet.frustumCulled=false;this.sheet.castShadow=true;this.sheet.receiveShadow=false;
  this.scene.remove(this.keeper);this.keeper.geometry.dispose();this.keeper.material.dispose();
  this.closure=new Keeper(this.scene,this.maps[2]);this.keeper=this.closure.mesh;
  this.uniforms={scrollBoundary:{value:0},scrollRadius:{value:.2},scrollThickness:{value:template.layerThickness},scrollHeight:{value:this.height},scrollWidth:{value:this.width},scrollOpen:{value:0}};
  this.material.bumpMap=null;this.material.sheen=.06;this.material.roughness=.93;
  const original=this.material.onBeforeCompile;
  this.material.onBeforeCompile=shader=>{
   original(shader);Object.assign(shader.uniforms,this.uniforms);
   shader.vertexShader=deformation+shader.vertexShader;
   shader.vertexShader=shader.vertexShader.replace('#include <beginnormal_vertex>',`vec3 objectNormal=normalize(cross(parchment(position+vec3(.001,0.,0.))-parchment(position-vec3(.001,0.,0.)),parchment(position+vec3(0.,.001,0.))-parchment(position-vec3(0.,.001,0.))));`);
   shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','vec3 transformed=parchment(position);');
   shader.fragmentShader=shader.fragmentShader.replace('#include <roughnessmap_fragment>',`float roughnessFactor=roughness;
    #ifdef USE_ROUGHNESSMAP
      roughnessFactor=.88+.10*texture2D(roughnessMap,vRoughnessMapUv).g;
    #endif`);
  };
  this.material.customProgramCacheKey=()=> 'charter-gpu-restcurl-v5';this.material.needsUpdate=true;
  const depth=new THREE.MeshDepthMaterial({map:this.maps[0],alphaTest:.55,side:THREE.DoubleSide,depthPacking:THREE.RGBADepthPacking});
  depth.onBeforeCompile=shader=>{Object.assign(shader.uniforms,this.uniforms);shader.vertexShader=deformation+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','vec3 transformed=parchment(position);');};
  depth.customProgramCacheKey=()=> 'charter-gpu-shadow-v5';this.sheet.customDepthMaterial=depth;
  const shadow=new THREE.Mesh(new THREE.PlaneGeometry(20,20),new THREE.ShadowMaterial({opacity:.20}));shadow.position.z=-.10;shadow.receiveShadow=true;this.scene.add(shadow);
  this.renderer.shadowMap.autoUpdate=false;
  const loader=new THREE.TextureLoader(),environment=this.environmentReady;
  this.environmentReady=Promise.all([environment,loader.loadAsync('../chapter-scroll-v4/assets/skin-normal.jpg'),loader.loadAsync('../chapter-scroll-v4/assets/skin-roughness.jpg')]).then(([,normal,rough])=>{
   for(const map of [normal,rough]){map.wrapS=map.wrapT=THREE.RepeatWrapping;map.repeat.set(1.4,2.1);this.maps.push(map);}
   this.material.normalMap=normal;this.material.normalScale.set(.035,.035);this.material.roughnessMap=rough;this.material.needsUpdate=true;
  });this.dirty=true;
 }
 setProgress(value){
  this.progress=THREE.MathUtils.clamp(value,0,1);const p=THREE.MathUtils.clamp((this.progress-.23)/.77,0,1);this.paperProgress=p;this.closure.setProgress(this.progress);
  const boundary=-this.height/2+p*this.height,radius=rollRadius(this.height*(1-p),this.template.coreRadius,this.template.layerThickness);
  this.uniforms.scrollBoundary.value=boundary;this.uniforms.scrollRadius.value=radius;this.uniforms.scrollOpen.value=p;
  let min=Infinity,max=-Infinity;
  for(let i=0;i<=280;i++){const y=-this.height/2+i*this.height/280,[,py]=rollPoint(0,y,0,boundary,radius,this.template.layerThickness);min=Math.min(min,py);max=Math.max(max,py);}
  this.sheet.position.y=-(min+max)/2;this.bounds={bottom:min+this.sheet.position.y,top:max+this.sheet.position.y};this.renderer.shadowMap.needsUpdate=true;this.dirty=true;
 }
 advance(dt){this.closure.tick(dt);if(this.closure.moving)this.dirty=true;}
 settle(){this.closure.reset();this.dirty=true;}
 get needsMotion(){return this.closure?.moving??false;}
 resize(width,height){
  if(!width||!height)return;const ratio=window.devicePixelRatio||1,limit=3_500_000,scale=Math.min(1,Math.sqrt(limit/(width*height*ratio*ratio)));
  this.renderer.setSize(Math.floor(width*ratio*scale),Math.floor(height*ratio*scale),false);
  const a=width/height,v=Math.max(this.height+.66,(this.width+.45)/a);this.viewHeight=v;
  Object.assign(this.camera,{left:-v*a/2,right:v*a/2,top:v/2,bottom:-v/2});this.camera.updateProjectionMatrix();this.dirty=true;
 }
 render(){super.render();this.dirty=false;}
 snapshot(){return {...super.snapshot(),drawBuffer:{width:this.renderer.domElement.width,height:this.renderer.domElement.height},deformation:'GPU Paperlab winding + persistent rest curvature',keeperMotion:'Cannon spring mass; flexible leather; rigid frame',keeperEnergy:this.closure.energy,restCurl:true};}
}

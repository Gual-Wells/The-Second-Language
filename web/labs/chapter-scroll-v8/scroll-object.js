import * as THREE from '../certification/vendor/three.module.js';
import {ScrollObject as PreviousScroll} from '../chapter-scroll-v6/scroll-object.js';
import {Keeper} from './keeper.js';
import {keeperPose} from './keeper-path.js';
export class ScrollObject extends PreviousScroll {
 constructor(canvas,surfaces,keeperImage,template){
  super(canvas,surfaces,keeperImage,template);this.scene.remove(this.keeper);this.keeper.visible=false;
  this.closure=new Keeper(this.scene,this.maps[2],template);
  this.camera=new THREE.PerspectiveCamera(35,1,.1,40);this.camera.position.set(0,0,12);this.camera.lookAt(0,0,0);
  this.sealBump=new THREE.CanvasTexture(surfaces.relief);this.sealBump.needsUpdate=true;
  this.material.bumpMap=this.sealBump;this.material.bumpScale=.0025;
  const original=this.material.onBeforeCompile;
  this.material.onBeforeCompile=shader=>{
   original(shader);
   // Three normally chooses normalMap OR bumpMap. Keep the existing parchment
   // normal texture, then compose the local seal impression with that normal.
   shader.fragmentShader=shader.fragmentShader.replace('#include <normal_fragment_maps>',`#include <normal_fragment_maps>
    #if defined(USE_BUMPMAP) && defined(USE_NORMALMAP_TANGENTSPACE)
     normal=perturbNormalArb(-vViewPosition,normal,dHdxy_fwd(),faceDirection);
    #endif`);
  };
  this.material.customProgramCacheKey=()=> 'charter-v8-composed-impression';this.material.needsUpdate=true;
 }
 setProgress(value){
  const raw=THREE.MathUtils.clamp(value,0,1),p=keeperPose(raw,this.template);
  super.setProgress(.18+.82*p.paperProgress);this.progress=raw;
  if(this.closure)this.closure.update(raw,this.height/2+this.sheet.position.y);
 }
 resize(width,height){
  if(!width||!height)return;const ratio=window.devicePixelRatio||1,scale=Math.min(1,Math.sqrt(3_500_000/(width*height*ratio*ratio)));
  this.renderer.setSize(Math.floor(width*ratio*scale),Math.floor(height*ratio*scale),false);
  const a=width/height,v=Math.max(this.height+.76,(this.width+.60)/a);this.viewHeight=v;
  this.camera.aspect=a;this.camera.fov=THREE.MathUtils.radToDeg(2*Math.atan(v/(2*this.camera.position.z)));this.camera.updateProjectionMatrix();this.dirty=true;
 }
 snapshot(){return {...super.snapshot(),cameraType:'PerspectiveCamera',keeperVisible:this.closure?.group.visible??false,keeperMotion:'loosen, unthread, then approach; exact reverse on closing',keeperPose:this.closure?.snapshot(),sealRelief:true};}
 dispose(){this.closure.dispose();this.sealBump.dispose();super.dispose();}
}

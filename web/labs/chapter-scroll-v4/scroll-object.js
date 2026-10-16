import * as THREE from '../certification/vendor/three.module.js';
import {ScrollObject as PreviousScroll} from '../chapter-scroll-v3/scroll-object.js';
export class ScrollObject extends PreviousScroll {
 constructor(canvas,surfaces,keeper,template){
  super(canvas,surfaces,keeper,template);
  this.material.bumpMap=null;this.material.sheen=.045;this.material.roughness=.95;
  // A photographic leather scan supplies low-amplitude skin microstructure only.
  // It is an artistic adaptation, not a measured scan of historic parchment.
  const loader=new THREE.TextureLoader();const environment=this.environmentReady;
  this.environmentReady=Promise.all([environment,loader.loadAsync('assets/skin-normal.jpg'),loader.loadAsync('assets/skin-roughness.jpg')]).then(([,normal,rough])=>{
   for(const map of [normal,rough]){map.wrapS=map.wrapT=THREE.RepeatWrapping;map.repeat.set(1.4,2.1);this.maps.push(map);}
   this.material.normalMap=normal;this.material.normalScale.set(.065,.065);this.material.roughnessMap=rough;
   const parentCompile=this.material.onBeforeCompile;
   this.material.onBeforeCompile=shader=>{parentCompile(shader);shader.fragmentShader=shader.fragmentShader.replace('#include <roughnessmap_fragment>',`float roughnessFactor=roughness;
    #ifdef USE_ROUGHNESSMAP
      roughnessFactor=.86+.12*texture2D(roughnessMap,vRoughnessMapUv).g;
    #endif`);};
   this.material.customProgramCacheKey=()=> 'solemn-charter-skin-v4';this.material.needsUpdate=true;
  });
 }
}

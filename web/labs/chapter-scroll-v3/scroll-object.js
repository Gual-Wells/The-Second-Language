import * as THREE from '../certification/vendor/three.module.js';
import {rollRadius,rollPoint} from '../chapter-scroll/vendor/paperlab-roll.js';
import {HDRLoader} from './vendor/HDRLoader.js';

const smooth=t=>{t=THREE.MathUtils.clamp(t,0,1);return t*t*(3-2*t);};
export class ScrollObject {
 constructor(canvas,surfaces,keeperImage,template){
  this.template=template;this.width=template.width;this.height=template.height;this.progress=0;this.renderCount=0;this.paperProgress=0;
  this.renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,preserveDrawingBuffer:true,powerPreference:'low-power'});
  const r=this.renderer;r.setPixelRatio(Math.min(devicePixelRatio,2));r.setClearColor(0,0);
  r.outputColorSpace=THREE.SRGBColorSpace;r.toneMapping=THREE.ACESFilmicToneMapping;r.toneMappingExposure=1.08;
  r.shadowMap.enabled=true;r.shadowMap.type=THREE.PCFShadowMap;
  this.scene=new THREE.Scene();this.camera=new THREE.OrthographicCamera(-4,4,4,-4,.1,30);
  this.camera.position.set(0,0,12);this.camera.lookAt(0,0,0);
  this.scene.add(new THREE.HemisphereLight(0xf1dfbc,0x4b5057,1.1));
  const key=new THREE.DirectionalLight(0xffe3ba,2.8);key.position.set(-3,4,6);key.castShadow=true;
  key.shadow.mapSize.set(1024,1024);Object.assign(key.shadow.camera,{left:-4,right:4,top:5,bottom:-5,near:.1,far:20});key.shadow.normalBias=.015;
  this.scene.add(key);
  const fill=new THREE.DirectionalLight(0xb9c9d1,.9);fill.position.set(4,0,4);this.scene.add(fill);
  const edgeLight=new THREE.DirectionalLight(0xf4cf83,.7);edgeLight.position.set(-3,-2,-1);this.scene.add(edgeLight);
  this.maps=[new THREE.CanvasTexture(surfaces.front),new THREE.CanvasTexture(surfaces.back),new THREE.Texture(keeperImage)];
  for(const map of this.maps){map.needsUpdate=true;map.colorSpace=THREE.SRGBColorSpace;map.anisotropy=Math.min(8,r.capabilities.getMaxAnisotropy());}
  const [front,back,keeper]=this.maps;
  this.geometry=new THREE.PlaneGeometry(this.width,this.height,40,300);
  this.geometry.attributes.position.setUsage(THREE.DynamicDrawUsage);this.base=new Float32Array(this.geometry.attributes.position.array);
  this.material=new THREE.MeshPhysicalMaterial({map:front,roughness:.84,metalness:0,side:THREE.DoubleSide,alphaTest:.55,
    bumpMap:back,bumpScale:.009,sheen:.16,sheenRoughness:.9,sheenColor:0xf0d0a1});
  this.material.onBeforeCompile=shader=>{
   shader.uniforms.backPaper={value:back};shader.fragmentShader='uniform sampler2D backPaper;\n'+shader.fragmentShader;
   shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`#ifdef USE_MAP
    vec4 sheetColor=gl_FrontFacing?texture2D(map,vMapUv):texture2D(backPaper,vMapUv);
    diffuseColor*=sheetColor;
    #endif`);
  };
  this.material.customProgramCacheKey=()=> 'vellum-front-reverse-v3';
  this.sheet=new THREE.Mesh(this.geometry,this.material);this.sheet.castShadow=true;this.sheet.receiveShadow=true;this.scene.add(this.sheet);
  // A deliberately camera-facing 2.5D closure: its source is an independent
  // authored prop, not a photographed complete scroll or a fake knot simulation.
  this.keeper=new THREE.Mesh(new THREE.PlaneGeometry(.53,.99),new THREE.MeshBasicMaterial({map:keeper,transparent:true,depthWrite:false,toneMapped:false}));
  this.keeper.renderOrder=5;this.scene.add(this.keeper);
  this.environmentReady=new HDRLoader().loadAsync(template.environment).then(hdr=>{
   const pmrem=new THREE.PMREMGenerator(r);this.environment=pmrem.fromEquirectangular(hdr);this.scene.environment=this.environment.texture;
   this.scene.environmentIntensity=.22;hdr.dispose();pmrem.dispose();
  }).catch(()=>{});
 }
 setProgress(value){
  this.progress=THREE.MathUtils.clamp(value,0,1);
  // The closed keeper first slides clear along the axis, then the membrane opens.
  // The keeper stays intact; this is not represented as an untying animation.
  const release=smooth(this.progress/.18),p=THREE.MathUtils.clamp((this.progress-.18)/.82,0,1);this.paperProgress=p;
  this.keeper.position.set(-release*3.05,-.01+.10*Math.sin(release*Math.PI),.62);
  this.keeper.rotation.z=release*.2;this.keeper.material.opacity=1-smooth((release-.72)/.28);this.keeper.visible=release<.999;
  const boundary=-this.height/2+p*this.height,wound=Math.max(0,this.height/2-boundary);
  const radius=rollRadius(wound,this.template.coreRadius,this.template.layerThickness),pos=this.geometry.attributes.position;
  let minY=Infinity,maxY=-Infinity;
  for(let i=0;i<pos.count;i++){
   const x=this.base[i*3],y=this.base[i*3+1],edge=Math.pow(Math.abs(x)/(this.width/2),6);
   const waviness=.009*Math.sin(y*4+x*2)+.038*edge*Math.sin(y*3.2+.4);
   const [px,py,pz]=rollPoint(x,y,waviness,boundary,radius,this.template.layerThickness);
   // A quiet residual lip at the bottom shows membrane thickness without a shaft.
   const lip=p>.94?.055*smooth((p-.94)/.06)*Math.exp(-Math.pow((y+this.height/2)/.17,2)):0;
   pos.setXYZ(i,px,py,pz+lip);minY=Math.min(minY,py);maxY=Math.max(maxY,py);
  }
  pos.needsUpdate=true;this.geometry.computeVertexNormals();this.geometry.computeBoundingSphere();this.sheet.position.y=-(minY+maxY)/2;
  this.bounds={bottom:minY+this.sheet.position.y,top:maxY+this.sheet.position.y};
 }
 resize(width,height){if(!width||!height)return;this.renderer.setSize(width,height,false);const a=width/height,v=Math.max(this.height+.7,(this.width+.45)/a);
  this.viewHeight=v;Object.assign(this.camera,{left:-v*a/2,right:v*a/2,top:v/2,bottom:-v/2});this.camera.updateProjectionMatrix();}
 render(){this.renderer.render(this.scene,this.camera);this.renderCount++;}
 snapshot(){return {progress:this.progress,paperProgress:this.paperProgress,renderCount:this.renderCount,vertices:this.geometry.attributes.position.count,camera:this.camera.position.toArray(),keeperVisible:this.keeper.visible,viewHeight:this.viewHeight};}
 exportObject(){this.render();return this.renderer.domElement.toDataURL('image/png');}
 dispose(){this.geometry.dispose();this.material.dispose();this.keeper.geometry.dispose();this.keeper.material.dispose();for(const m of this.maps)m.dispose();this.environment?.dispose();this.renderer.dispose();}
}

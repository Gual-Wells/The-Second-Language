import * as T from '../certification/vendor/three.module.js';
export const RELEASE_END=.38;
const smooth=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);};
export class Cord{
 constructor(scene,template){
  this.template=template;this.group=new T.Group();this.group.name='authored-silk-cord-frames';scene.add(this.group);
  this.maps=[];this.parts=[];this.pending=[0,0];this.pose={phase:'loading'};this.ready=this.load();
 }
 async load(){
  const manifest=await(await fetch(new URL('./assets/cord-frames.json',import.meta.url))).json();this.manifest=manifest;
  const loader=new T.TextureLoader();let count=0;
  const load=async url=>{const map=await loader.loadAsync(new URL(url,import.meta.url).href);map.colorSpace=T.SRGBColorSpace;map.generateMipmaps=false;map.minFilter=map.magFilter=T.LinearFilter;this.maps.push(map);this.onLoadingProgress?.(++count/(manifest.pages.length+1));return map;};
  this.pages=await Promise.all(manifest.pages.map(load));const rearMap=await load(manifest.rear);
  for(const map of this.pages)map.repeat.set(1/manifest.columns,1/manifest.rows);
  const material=map=>new T.MeshBasicMaterial({map,transparent:true,alphaTest:.015,depthTest:true,depthWrite:false,toneMapped:false,side:T.DoubleSide});
  const geometry=new T.PlaneGeometry(manifest.worldSize,manifest.worldSize);
  this.front=new T.Mesh(geometry,material(this.pages[0]));this.back=new T.Mesh(geometry.clone(),material(rearMap));
  this.front.position.z=.635;this.back.position.z=-.014;this.front.renderOrder=3;this.back.renderOrder=-1;
  this.parts=[this.back,this.front];this.group.add(...this.parts);this.parts.forEach(o=>o.frustumCulled=false);
  this.update(...this.pending);
 }
 update(progress,centerY){
  this.pending=[progress,centerY];if(!this.manifest)return;
  const r=T.MathUtils.clamp(progress/RELEASE_END,0,1),index=Math.min(this.manifest.frames-1,Math.round(r*(this.manifest.frames-1))),page=Math.floor(index/16),cell=index%16,map=this.pages[page];
  map.offset.set((cell%4)/4,1-(Math.floor(cell/4)+1)/4);this.front.material.map=map;
  const depart=smooth(.77,1,r);
  this.group.position.set(-4.1*depart,centerY-.16*Math.sin(depart*Math.PI),.06*smooth(.58,.78,r));
  this.group.rotation.z=.09*depart;this.group.visible=progress<RELEASE_END;
  this.pose={phase:r<.08?'take-up':r<.43?'release-first-loop':r<.65?'release-second-loop':r<.78?'open-binding':'lift-clear',frame:index,frames:this.manifest.frames,progress:r,visible:this.group.visible,x:this.group.position.x,y:this.group.position.y,z:this.group.position.z,opacity:1,usesFade:false,mode:'prebaked transparent 2D frames; fixed frontal viewing',physicalSimulation:false};
 }
 snapshot(){return{...this.pose,sourceSha256:this.manifest?.sourceSha256,decodedRGBABytes:this.manifest?.decodedRGBABytes};}
 exportFrame(){
  if(!this.manifest)return'';const n=this.manifest.frameSize,index=this.pose.frame||0,page=Math.floor(index/16),cell=index%16,canvas=document.createElement('canvas');canvas.width=canvas.height=n;
  canvas.getContext('2d').drawImage(this.pages[page].image,(cell%4)*n,Math.floor(cell/4)*n,n,n,0,0,n,n);return canvas.toDataURL('image/png');
 }
 dispose(){for(const p of this.parts){p.geometry.dispose();p.material.dispose();}this.maps.forEach(m=>m.dispose());this.group.removeFromParent();}
}

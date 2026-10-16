import * as THREE from '../certification/vendor/three.module.js';
import {World,Body,Box,Vec3,Spring} from './vendor/cannon-es.js';
// Preserve the approved aged surface. This is an elastic keeper being taken
// off, not a simulation of a buckle tongue being unfastened.
export class Keeper {
 constructor(scene,map){
  this.world=new World({gravity:new Vec3(0,-.7,0)});
  this.body=new Body({mass:.045,shape:new Box(new Vec3(.20,.45,.045)),linearDamping:.8,angularDamping:.95});
  this.anchor=new Body({type:Body.KINEMATIC});this.world.addBody(this.anchor);this.world.addBody(this.body);
  this.spring=new Spring(this.anchor,this.body,{restLength:0,stiffness:32,damping:1.8});
  this.geometry=new THREE.PlaneGeometry(.64,1.16,12,48);this.base=this.geometry.attributes.position.array.slice();
  this.mesh=new THREE.Mesh(this.geometry,new THREE.MeshBasicMaterial({map,transparent:true,depthWrite:false,toneMapped:false,side:THREE.DoubleSide}));
  this.mesh.renderOrder=5;scene.add(this.mesh);this.progress=0;this.energy=0;this.reset();
 }
 target(p){const r=THREE.MathUtils.smoothstep(p,0,.23);return {x:-3.3*r,y:-.01-.23*r,z:.62+.15*Math.sin(r*Math.PI),r};}
 reset(){const t=this.target(this.progress);this.anchor.position.set(t.x,t.y,t.z);this.body.position.copy(this.anchor.position);this.body.velocity.setZero();this.body.angularVelocity.setZero();this.body.quaternion.set(0,0,0,1);this.energy=0;this.updateSurface(t);}
 setProgress(p){const wasVisible=this.mesh.visible;this.progress=p;const t=this.target(p);this.anchor.position.set(t.x,t.y,t.z);this.mesh.visible=p<.26;if(!wasVisible&&this.mesh.visible)this.reset();}
 tick(dt){
  if(!this.mesh.visible)return;
  const t=this.target(this.progress);
  for(let i=0,n=Math.max(1,Math.ceil(dt/(1/120)));i<n;i++){
   this.body.force.y+=.045*.7;this.spring.applyForce();this.world.step(dt/n);
  }
  this.energy=this.body.velocity.lengthSquared()+this.body.position.distanceSquared(this.anchor.position)*80;
  this.updateSurface(t);
 }
 updateSurface(t){
  this.mesh.position.copy(this.body.position);this.mesh.rotation.z=-t.r*.22;
  const a=this.geometry.attributes.position,lag=THREE.MathUtils.clamp(this.body.position.x-this.anchor.position.x,-.15,.15);
  for(let i=0;i<a.count;i++){
   const x=this.base[i*3],y=this.base[i*3+1],free=Math.max(0,(Math.abs(y)-.20)/.38);
   // The central metal frame stays rigid; only exposed leather flexes.
   a.setXYZ(i,x+lag*free*free*.45,y,.025*(x/.32)**2+free*free*lag*.42);
  }a.needsUpdate=true;
  this.mesh.material.opacity=1-THREE.MathUtils.smoothstep(this.progress,.20,.26);
 }
 get moving(){return this.mesh.visible&&this.energy>.000005;}
 dispose(){this.geometry.dispose();this.mesh.material.dispose();}
}

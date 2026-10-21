// Reuses Pavel Dobryakov's pressure/advection solver and Ashima/Gustavson noise.
// Spatial modulation is applied to the stream function BEFORE taking its curl
// (Bridson et al., 2007), not by multiplying the resulting velocity field.
export function fieldFactory(noise){return({gl,Program,baseVertexShader,compileShader,blit,velocity,dye})=>{
 const source=`precision highp float;precision highp sampler2D;
 varying vec2 vUv;uniform sampler2D uTarget;
 uniform float time,dt,aspect,mode,cells,interactionGain;
 uniform vec4 edges,keeper,regions[8],currents[4],winds[4];uniform vec2 span;
 ${noise}
 float potential(vec2 q){
  // Most energy belongs to broad, travelling folds. No full-screen fine octave.
  vec2 drift=vec2(.013*sin(time*.083+.5)+.008*cos(time*.19+1.4),.010*cos(time*.061+1.1)+.006*sin(time*.16));
  float psi=drift.x*q.y-drift.y*q.x+.0028*snoise(q*1.35+vec2(sin(time*.071)*.6,time*.037));
  for(int i=0;i<4;i++){
   vec2 d=q-currents[i].xy*vec2(aspect,1.);
   float r=currents[i].z;vec2 v=winds[i].xy;
   vec2 along=vec2(cos(winds[i].w),sin(winds[i].w)),across=vec2(-along.y,along.x);
   // Long passing banks, not circular Gaussian cells with a vortex pair at
   // every perimeter. Different banks still accelerate and turn independently.
   float window=exp(-pow(dot(d,across)/r,2.)-pow(dot(d,along)/(r*2.5),2.));
   psi+=window*(v.x*d.y-v.y*d.x);
   // A little folding only in active patches, much lower derivative energy
   // than the transport term. Radius, clock and strength are independent.
   psi+=.0008*currents[i].w*window*snoise(q*5.2+vec2(winds[i].z,time*.14+winds[i].z));
  }
  return psi;
 }
 float strip(float y){return exp(-pow((vUv.y-y)/.064,2.))*smoothstep(span.x-.07,span.x+.04,vUv.x)*(1.-smoothstep(span.y-.04,span.y+.07,vUv.x));}
 void main(){
  vec2 q=vec2(vUv.x*aspect,vUv.y);vec3 old=texture2D(uTarget,vUv).rgb;
  if(mode<.5){
   float e=.004;vec2 target=vec2(potential(q+vec2(0,e))-potential(q-vec2(0,e)),-potential(q+vec2(e,0))+potential(q-vec2(e,0)))/(2.*e)*cells;
   // Broad currents have a finite response time; they do not instantly replace
   // motion left by the sheet or keeper. Ordinary flow stays below the guard.
   vec2 v=old.xy+dt*(target*1.45-old.xy*.16);
   float sheet=strip(edges.x)*edges.y+strip(edges.z)*edges.w;
   v+=dt*interactionGain*5.8*vec2(0.,sheet)*cells;
   vec2 d=(vUv-keeper.xy)*vec2(aspect,1.);float wake=exp(-dot(d,d)/.019);
   v+=dt*interactionGain*4.6*wake*keeper.zw*cells;
   float speed=length(v),limit=cells*.27;
   v*=min(1.,limit/max(speed,.0001));
   gl_FragColor=vec4(v,0.,1.);
  }else{
   // Broad, staggered births/decay; no stamping of the velocity noise into dye.
   vec2 drift=vec2(time*.025,7.3-time*.016);
   float n=.5+.5*(.57*snoise(q*3.1+drift)+.29*snoise(q*7.4+drift*1.37)+.14*snoise(q*15.3-drift*.71));
   float veil=smoothstep(.23,.76,n);
   float border=max(smoothstep(.19,.45,abs(vUv.x-.5)),smoothstep(.25,.47,abs(vUv.y-.5))),local=0.;
   for(int i=0;i<8;i++){vec2 d=(vUv-regions[i].xy)*vec2(aspect,1.);local+=regions[i].w*exp(-dot(d,d)/(regions[i].z*regions[i].z));}
   float source=(.02+.10*veil)*border+local*(.12+1.28*veil*veil);
   // Lower replenishment lets advected openings and wakes remain readable.
   vec3 c=clamp(old+dt*(source*vec3(.86,.90,.88)*.24-old*.055),vec3(0.),vec3(.78));
   gl_FragColor=vec4(c,1.);
  }
 }`;
 const program=new Program(baseVertexShader,compileShader(gl.FRAGMENT_SHADER,source));
 return(time,dt,m)=>{
  program.bind();const u=program.uniforms;
  gl.uniform1f(u.time,time);gl.uniform1f(u.dt,dt);gl.uniform1f(u.aspect,gl.canvas.width/gl.canvas.height);
  gl.uniform4fv(u.edges,m.edges);gl.uniform4fv(u.keeper,m.keeper);gl.uniform4fv(u['regions[0]'],m.regions);
  gl.uniform4fv(u['currents[0]'],m.currents);gl.uniform4fv(u['winds[0]'],m.winds);
  gl.uniform2fv(u.span,m.span);gl.uniform1f(u.cells,velocity().height);gl.uniform1f(u.interactionGain,m.interactionGain);
  for(const[mode,target]of[[0,velocity()],[1,dye()]]){gl.uniform1f(u.mode,mode);gl.uniform1i(u.uTarget,target.read.attach(0));blit(target.write);target.swap();}
 };
};}

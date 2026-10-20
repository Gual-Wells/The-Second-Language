// Pavel Dobryakov's MIT fluid solver and Ashima/Gustavson noise are reused.
// This small scene adapter bounds the additional motion in solver cell units.
export function fieldFactory(noise){return({gl,Program,baseVertexShader,compileShader,blit,velocity,dye})=>{
 const source=`precision highp float;precision highp sampler2D;
 varying vec2 vUv;uniform sampler2D uTarget;uniform float time,dt,aspect,mode,cells;
 uniform vec4 edges,keeper,regions[8];uniform vec2 span;
 ${noise}
 float potential(vec2 p){return .65*snoise(p*.92+vec2(sin(time*.16),cos(time*.13))*.47)+.19*snoise(p*2.4+vec2(cos(time*.20),sin(time*.17))*.55)+.045*snoise(p*5.6+vec2(time*.06,-time*.041));}
 float strip(float y){return exp(-pow((vUv.y-y)/.07,2.))*smoothstep(span.x-.08,span.x+.06,vUv.x)*(1.-smoothstep(span.y-.06,span.y+.08,vUv.x));}
 void main(){
  vec2 p=vec2(vUv.x*aspect,vUv.y)*3.;vec3 old=texture2D(uTarget,vUv).rgb;
  if(mode<.5){
   float e=.018;vec2 curl=vec2(potential(p+vec2(0,e))-potential(p-vec2(0,e)),-potential(p+vec2(e,0))+potential(p-vec2(e,0)))/(2.*e);
   vec2 v=old.xy+dt*curl*2.6;
   v+=dt*1.25*vec2(0.,strip(edges.x)*edges.y+strip(edges.z)*edges.w)*cells;
   vec2 d=(vUv-keeper.xy)*vec2(aspect,1.);float k=exp(-dot(d,d)/.014);
   v+=dt*1.5*k*keeper.zw*cells;
   float speed=length(v),limit=cells*.14;v*=min(1.,limit/max(speed,.0001));
   gl_FragColor=vec4(v,0,1);
  }else{
   float n=.5+.5*potential(p*.72+vec2(3.7,5.1)),structure=smoothstep(.22,.86,n);
   float border=max(smoothstep(.24,.43,abs(vUv.x-.5)),smoothstep(.29,.46,abs(vUv.y-.5))),local=0.;
   for(int i=0;i<8;i++){vec2 d=(vUv-regions[i].xy)*vec2(aspect,1.);local+=regions[i].w*exp(-dot(d,d)/(regions[i].z*regions[i].z));}
   float desired=(.06+.27*structure)*border+local*(.52+.58*structure);
   vec3 c=clamp(old+dt*.32*(desired*vec3(.86,.90,.88)-old*.32),vec3(0.),vec3(.78));
   gl_FragColor=vec4(c,1.);
  }
 }`;
 const program=new Program(baseVertexShader,compileShader(gl.FRAGMENT_SHADER,source));
 return(time,dt,m)=>{program.bind();const u=program.uniforms;gl.uniform1f(u.time,time);gl.uniform1f(u.dt,dt);gl.uniform1f(u.aspect,gl.canvas.width/gl.canvas.height);gl.uniform4fv(u.edges,m.edges);gl.uniform4fv(u.keeper,m.keeper);gl.uniform4fv(u['regions[0]'],m.regions);gl.uniform2fv(u.span,m.span);gl.uniform1f(u.cells,velocity().height);
  for(const[mode,target]of[[0,velocity()],[1,dye()]]){gl.uniform1f(u.mode,mode);gl.uniform1i(u.uTarget,target.read.attach(0));blit(target.write);target.swap();}
 };
};}

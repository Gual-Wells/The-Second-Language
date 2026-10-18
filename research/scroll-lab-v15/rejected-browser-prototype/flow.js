// The solver is Pavel Dobryakov's existing MIT fluid. Noise is the separately
// licensed Ashima/Gustavson implementation. This is the scene forcing adapter.
export function fieldFactory(noise){return({gl,Program,baseVertexShader,compileShader,blit,velocity,dye})=>{
 const source=`precision highp float; precision highp sampler2D;
 varying vec2 vUv;uniform sampler2D uTarget;uniform float time,dt,aspect,mode;
 uniform vec4 edges,keeper,regions[8];uniform vec2 span;uniform float cells;
 ${noise}
 float potential(vec2 p){
  return .72*snoise(p*.82+vec2(sin(time*.13),cos(time*.097))*.6)
   +.19*snoise(p*2.3+vec2(cos(time*.31),sin(time*.22))*.72)
   +.032*snoise(p*5.3+vec2(sin(time*.71),cos(time*.53))*.8);
 }
 float strip(float y){return exp(-pow((vUv.y-y)/.055,2.))*smoothstep(span.x-.08,span.x+.06,vUv.x)*(1.-smoothstep(span.y-.06,span.y+.08,vUv.x));}
 void main(){
  vec2 p=vec2(vUv.x*aspect,vUv.y)*3.;vec3 old=texture2D(uTarget,vUv).rgb;
  if(mode<.5){
   float e=.018;vec2 curl=vec2(potential(p+vec2(0,e))-potential(p-vec2(0,e)),-potential(p+vec2(e,0))+potential(p-vec2(e,0)))/(2.*e);
   vec2 wind=curl*(3.0+.7*sin(time*.37));
   vec2 uv=old.xy+dt*wind;
   float top=strip(edges.x),bottom=strip(edges.z);
   uv+=dt*4.1*vec2(0.,top*edges.y+bottom*edges.w)*cells;
   vec2 d=(vUv-keeper.xy)*vec2(aspect,1.);float k=exp(-dot(d,d)/.008);
   uv+=dt*5.0*k*keeper.zw*cells;
   gl_FragColor=vec4(uv,0,1);
  }else{
   float n=.5+.5*snoise(p*1.7+vec2(sin(time*.27),cos(time*.19))*.45);
   float structure=smoothstep(.27,.79,n);
   float border=max(smoothstep(.24,.43,abs(vUv.x-.5)),smoothstep(.29,.46,abs(vUv.y-.5)));
   float local=0.;
   for(int i=0;i<8;i++){
    vec2 d=(vUv-regions[i].xy)*vec2(aspect,1.);
    float cloud=exp(-dot(d,d)/(regions[i].z*regions[i].z));
    local+=regions[i].w*cloud;
   }
   float desired=(.035+.19*structure)*border+local*(.16+.88*structure);
   // Density is born over broad broken regions, then sheared by the solver;
   // it is not a row of periodic particle emitters or a global UV translation.
   vec3 c=max(vec3(0.),old+dt*.61*(desired*vec3(.86,.90,.88)-old*.40));
   gl_FragColor=vec4(c,1.);
  }
 }`;
 const program=new Program(baseVertexShader,compileShader(gl.FRAGMENT_SHADER,source));
 return(time,dt,m)=>{
  program.bind();const u=program.uniforms;gl.uniform1f(u.time,time);gl.uniform1f(u.dt,dt);gl.uniform1f(u.aspect,gl.canvas.width/gl.canvas.height);
  gl.uniform4fv(u.edges,m.edges);gl.uniform4fv(u.keeper,m.keeper);gl.uniform4fv(u['regions[0]'],m.regions);gl.uniform2fv(u.span,m.span);gl.uniform1f(u.cells,velocity().height);
  for(const [mode,target]of [[0,velocity()],[1,dye()]]){gl.uniform1f(u.mode,mode);gl.uniform1i(u.uTarget,target.read.attach(0));blit(target.write);target.swap();}
 };
};}

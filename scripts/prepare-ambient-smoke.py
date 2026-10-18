"""Narrow project fork of the inspected MIT particle effect; keep its rendering chain."""
from pathlib import Path
import hashlib,json
root=Path(__file__).resolve().parents[1]
source=root/'.cache/scroll-v15/resources/realistic-smoke'
dest=root/'web/labs/scroll-atmosphere-study'
(dest/'vendor').mkdir(parents=True,exist_ok=True)
t=(source/'src/realistic-smoke.js').read_text(encoding='utf-8')
sha=hashlib.sha256(t.encode()).hexdigest()
def replace(a,b):
 global t
 if t.count(a)!=1:raise ValueError('Upstream anchor changed: '+a[:70])
 t=t.replace(a,b)
replace('const UPDATE_UNIFORMS = [','const UPDATE_UNIFORMS = [\n  "u_edges", "u_span", "u_keeper",')
replace('  uniform float u_dt;', '  uniform float u_dt;\n  uniform vec4 u_edges,u_keeper;\n  uniform vec2 u_span;')
replace('      pos.y = u_originY + subFrameOffset;', '''      pos.y = u_originY + subFrameOffset;
      // Ambient regions replace the original incense nozzle. Birth is spread
      // over a region, not a visible point; classes have independent lifespans.
      vec2 center=vec2(sin(wispIndex*2.41+u_time*.083),cos(wispIndex*3.17-u_time*.061))*.85;
      pos=center+vec2(rand(v_uv+u_time+3.),rand(v_uv-u_time+7.))*.8-.4;''')
replace('      float height = pos.y;', '      float height = .8;')
replace('      velocity.y = max(velocity.y, u_minimumUpwardSpeed);','      velocity.y += .013*sin(wispIndex*2.1+u_time*.37);')
replace('      pos += velocity * u_dt;', '''      float widthMask=smoothstep(u_span.x-.12,u_span.x+.04,pos.x)*(1.-smoothstep(u_span.y-.04,u_span.y+.12,pos.x));
      float top=exp(-pow((pos.y-u_edges.x)/.10,2.))*widthMask;
      float bottom=exp(-pow((pos.y-u_edges.z)/.10,2.))*widthMask;
      vec2 d=pos-u_keeper.xy;
      velocity+=vec2(0.,.8*(top*u_edges.y+bottom*u_edges.w))+.9*exp(-dot(d,d)/.045)*u_keeper.zw;
      // This is an art-directed particle field, not a pressure solver.
      velocity=velocity/(1.+length(velocity)/.42);
      pos += velocity * u_dt;''')
replace('      initialData[offset] = originX;','      initialData[offset] = Math.sin(wispIndex*2.41)*.85+(random()-.5)*.8;')
replace('      initialData[offset + 1] = originY;','      initialData[offset + 1] = Math.cos(wispIndex*3.17)*.85+(random()-.5)*.8;')
replace('    float alphaIn = smoothstep(u_fadeInStart, u_fadeInEnd, pos.y);','    float alphaIn = smoothstep(0.0, .17, age);')
replace('    float heightBlur = smoothstep(\n      u_blurStartHeight,\n      u_blurEndHeight,\n      pos.y\n    );','    float heightBlur = .60+.35*fract(v_seed*73.7);')
replace('    gl.uniform1f(this.updateUniforms.u_dt, deltaTime);','''    gl.uniform1f(this.updateUniforms.u_dt, deltaTime);
    gl.uniform4fv(this.updateUniforms.u_edges,this.motion?.edges??[3,0,-3,0]);
    gl.uniform2fv(this.updateUniforms.u_span,this.motion?.span??[-1,1]);
    gl.uniform4fv(this.updateUniforms.u_keeper,this.motion?.keeper??[3,3,0,0]);''')
replace('  _stepSimulation(deltaTime) {','''  step(deltaTime,motion){
    if(this.contextLost||this.destroyed)return;
    this.motion=motion;this.globalTime+=deltaTime;
    this._stepSimulation(deltaTime);this._drawToScreen();
  }
  _stepSimulation(deltaTime) {''')
(dest/'vendor/ambient-smoke.js').write_text(t,encoding='utf-8')
for name in ['LICENSE','THIRD_PARTY_NOTICES.md']:(dest/'vendor'/name).write_bytes((source/name).read_bytes())
(root/'research/scroll-lab-v15/resource-trials/ambient-fork.json').write_text(json.dumps({'upstream':'https://github.com/zlollo/realistic-webgl-smoke','commit':'87c1d57fded21f60b0ae18f7f7d979bcf4d8ab60','sourceSHA256':sha,'changes':['distributed birth and initial ages','no mandatory upward velocity','screen sheet/keeper velocity response','age-based entry fade','external scheduler step; original point/blur/blend renderer retained'],'status':'exploration, not user accepted'},indent=2))
print('Project ambient fork prepared from pinned MIT source')

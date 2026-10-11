import bpy,numpy as np,json,pathlib,random
from mathutils import Vector
r=pathlib.Path('D:/CodexStorage/workspaces/hostile-dragon-coin');bpy.ops.wm.open_mainfile(filepath=str(r/'working/reconstructed-clay.blend'))
o=[x for x in bpy.context.scene.objects if x.type=='MESH'][0];xyz=np.array([o.matrix_world@v.co for v in o.data.vertices]);rng=np.random.default_rng(3817);subset=xyz[rng.choice(len(xyz),min(6000,len(xyz)),replace=False)];best=None
for _ in range(600):
 a,b,c=subset[rng.choice(len(subset),3,replace=False)];n=np.cross(b-a,c-a);n/=max(np.linalg.norm(n),1e-9)
 if n[1]<0:n=-n
 if n[1]<.75:continue
 d=-n.dot(a);mask=np.abs(subset@n+d)<.002;score=mask.sum()
 if best is None or score>best[0]:best=(score,n,d,mask)
score,n,d,mask=best;pts=subset[mask];mid=pts.mean(0);_,_,vv=np.linalg.svd(pts-mid,full_matrices=False);n=vv[-1];n*=1 if n[1]>0 else -1;d=-n.dot(mid);print('Back plane',score,n.tolist(),d,flush=True)
x=Vector((1,0,0));n=Vector(n.tolist());x=(x-x.dot(n)*n).normalized();z=x.cross(n).normalized();basis=[list(x),list(n),list(z)]
(r/'working/alignment.json').write_text(json.dumps({'basis':basis,'backOffset':float(-d),'backCenter':list(mid)},indent=2))

import bpy,bmesh,json,numpy as np
from pathlib import Path
ROOT=Path('D:/CodexStorage/workspaces/hostile-dragon-coin/studio-20261013')
obj=bpy.data.objects['User-selected regional candidate — repaired branch']
mesh=obj.data;mesh.calc_loop_triangles()
v=np.empty(len(mesh.vertices)*3,np.float32);mesh.vertices.foreach_get('co',v);v=v.reshape(-1,3)
f=np.empty(len(mesh.loop_triangles)*3,np.int32);mesh.loop_triangles.foreach_get('vertices',f);f=f.reshape(-1,3)
np.savez_compressed(ROOT/'outputs/user-selected-regional/quiet-geometry.npz',vertices=v,faces=f)
bm=bmesh.new();bm.from_mesh(mesh)
boundary=[e for e in bm.edges if e.is_boundary]
unseen=set(boundary);loops=[]
while unseen:
 e=unseen.pop();group={e};queue=[e]
 while queue:
  edge=queue.pop()
  for vertex in edge.verts:
   for near in vertex.link_edges:
    if near in unseen:unseen.remove(near);group.add(near);queue.append(near)
 verts={v for edge in group for v in edge.verts}
 p=np.array([v.co[:] for v in verts]);centroid=p.mean(0)
 if (centroid[0]<-.20 and centroid[2]>.1 and centroid[1]>.015) or (centroid[0]>.23 and centroid[2]<-.1 and centroid[1]>.015):
  loops.append({'edges':len(group),'perimeter':sum(e.calc_length() for e in group),'centre':centroid.tolist(),'bounds':[p.min(0).tolist(),p.max(0).tolist()],'closed':all(sum(e in group for e in v.link_edges)==2 for v in verts)})
bm.free()
result={'boundary_edges':len(boundary),'extension_boundary_groups':sorted(loops,key=lambda x:x['perimeter'],reverse=True)}
(ROOT/'outputs/user-selected-regional/extensions-audit.json').write_text(json.dumps(result,indent=2));

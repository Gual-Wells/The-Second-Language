"""Remove only unattached microscopic reconstruction debris from the assembled sample."""
from pathlib import Path
import numpy as np,manifold3d as m,json
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'outputs'
names=['special-blank-notched','fitted-front-and-grips','fitted-reverse-foliage','fitted-reverse-book','reverse-inscribed-plate','reverse-cartouche-border','reverse-legend-band','reverse-circular-borders','reverse-book-medallion','reverse-rayed-disc']
bodies=[]
for n in names:
    d=np.load(OUT/(n+'.npz'));bodies.append(m.Manifold(m.Mesh(np.ascontiguousarray(d['vertices'],dtype=np.float32),np.ascontiguousarray(d['faces'],dtype=np.uint32))))
union=m.Manifold.batch_boolean(bodies,m.OpType.Add);parts=sorted(union.decompose(),key=lambda p:p.volume(),reverse=True)
assert parts and parts[0].volume()/union.volume()>.999,'Large disconnected design object; do not auto-delete'
assert max([p.volume() for p in parts[1:]] or [0])<.1,'Unexpected large fragment'
main=parts[0]
for n,body in zip(names,bodies):
    clean=body^main;assert clean.status()==m.Error.NoError
    mesh=clean.to_mesh();np.savez_compressed(OUT/(n+'.npz'),vertices=np.array(mesh.vert_properties[:,:3]),faces=np.array(mesh.tri_verts))
(OUT/'debris-cleanup.json').write_text(json.dumps({'decomposed_extra_shells_examined':len(parts)-1,'positive_shells_excluded':sum(p.volume()>0 for p in parts[1:]),'negative_cavity_shells_examined':sum(p.volume()<0 for p in parts[1:]),'largest_positive_shell_excluded_mm3':max([p.volume() for p in parts[1:]] or [0]),'protected_main_outer_shell_volume_mm3':main.volume(),'policy':'intersect each original component with the dominant connected outer shell; original enclosed negative cavity shells are preserved by intersection; floating numerical shells may remain below tolerance'},indent=2))
print('DOMINANT_CONNECTED_SHELL_FILTER_APPLIED',flush=True)

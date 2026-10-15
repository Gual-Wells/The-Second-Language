"""Measure actual meshes. Technical results do not certify artistic quality."""
from pathlib import Path
import json,hashlib,math,time
import numpy as np,manifold3d as m
ROOT=Path(__file__).resolve().parents[1];PACK=ROOT.parent if (ROOT.parent/'spec/design-spec.json').exists() else ROOT.parent/'coin-original-design-pack-20261015';OUT=ROOT/'outputs'
names=['special-blank-notched','fitted-front-and-grips','fitted-reverse-foliage','fitted-reverse-book','reverse-inscribed-plate','reverse-cartouche-border','reverse-legend-band','reverse-circular-borders','reverse-book-medallion','reverse-rayed-disc']
bodies=[];report={'schema':'tsl.fitted-model-check/1','art_accepted':False,'units':'mm','components':[]}
for name in names:
    d=np.load(OUT/(name+'.npz'));v=d['vertices'];f=d['faces'];body=m.Manifold(m.Mesh(np.ascontiguousarray(v,dtype=np.float32),np.ascontiguousarray(f,dtype=np.uint32)))
    edges=np.sort(np.concatenate([f[:,[0,1]],f[:,[1,2]],f[:,[2,0]]]),axis=1);_,counts=np.unique(edges,axis=0,return_counts=True)
    assert body.status()==m.Error.NoError and np.isfinite(v).all() and (counts==2).all(),name
    bodies.append(body);report['components'].append({'name':name,'vertices':len(v),'triangles':len(f),'nonmanifold_edges':int((counts!=2).sum()),'volume_mm3':body.volume(),'bounds_mm':[v.min(0).tolist(),v.max(0).tolist()]})
whole=m.Manifold.batch_boolean(bodies,m.OpType.Add);assert whole.status()==m.Error.NoError
parts=whole.decompose();report['union']={'volume_mm3':whole.volume(),'component_volumes_mm3':sorted([p.volume() for p in parts],reverse=True),'bounds_mm':list(whole.bounding_box()),'triangles':whole.num_tri()}
# Probe the ACTUAL unnotched engraved blank, independently of the future art coverings.
d=np.load(OUT/'parameter-blank-engraved.npz');blank=m.Manifold(m.Mesh(np.ascontiguousarray(d['vertices'],dtype=np.float32),np.ascontiguousarray(d['faces'],dtype=np.uint32)))
curves=json.loads((PACK/'vectors/edge-curves.json').read_text(encoding='utf-8'))
witnesses=[]
for g in curves['glyphs']:
    bounds=g.get('ink_bbox_uv')
    if not bounds:continue
    # Ink bounding box is u_min,v_min,u_max,v_max. Holes are avoided by searching actual ray depths.
    values=[]
    for u in np.linspace(bounds[0],bounds[2],9):
        for v in np.linspace(bounds[1],bounds[3],9):
            a=math.radians(curves['cut_theta'])-u/20;direction=np.array([math.sin(a),0,math.cos(a)])
            origin=direction*20.2;origin[1]=-v;end=direction*19.7;end[1]=-v
            hits=blank.ray_cast(origin.tolist(),end.tolist())
            if hits:values.append(20-math.hypot(hits[0].position[0],hits[0].position[2]))
    depth=max(values);assert .054<depth<.0552,(g['id'],depth)
    witnesses.append({'id':g['id'],'measured_floor_depth_mm':depth})
assert len(witnesses)==51
report['actual_edge_letter_probes']=witnesses
report['source_mesh_sha256']={n:hashlib.sha256((ROOT/'art'/(n+'.npz')).read_bytes()).hexdigest() for n in ['front','reverse']}
report['passed']=True
(OUT/'model-checks.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print(json.dumps({'passed':True,'closed_meshes':len(bodies),'actual_letter_floor_probes':len(witnesses),'union_parts':len(parts),'largest_parts_mm3':report['union']['component_volumes_mm3'][:10],'art_accepted':False}),flush=True)

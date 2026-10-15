"""Make a real closed parametric blank and real cylindrical incisions with Manifold/Clipper2.
No sculptural design is inferred from these parameters. Geometry units here are millimetres.
"""
from pathlib import Path
import json,math,time,hashlib
import numpy as np
import manifold3d as m
ROOT=Path(__file__).resolve().parents[1];PACK=ROOT.parent if (ROOT.parent/'spec/design-spec.json').exists() else ROOT.parent/'coin-original-design-pack-20261015'
OUT=ROOT/'outputs';OUT.mkdir(exist_ok=True);START=time.monotonic()
S=json.loads((PACK/'spec/design-spec.json').read_text(encoding='utf-8'))
D=json.loads((PACK/'vectors/edge-curves.json').read_text(encoding='utf-8'))
def log(stage,**data):
    print(json.dumps({'stage':stage,'elapsed':round(time.monotonic()-START,2),**data}),flush=True)
def save_mesh(body,name):
    assert body.status()==m.Error.NoError,(name,body.status())
    mesh=body.to_mesh();v=np.asarray(mesh.vert_properties[:,:3],dtype=np.float64);f=np.asarray(mesh.tri_verts,dtype=np.int32)
    np.savez_compressed(OUT/(name+'.npz'),vertices=v,faces=f)
    return v,f
B=S['blank'];R=B['radius'];h=B['field_half_thickness'];H=B['rim_half_thickness'];sr=B['shoulder_radius'];rf=B['rim_flat_outer_radius']
profile=[(0,-h),(B['field_radius'],-h),(B['ramp_outer_radius'],-H),(rf,-H)]
for a in np.linspace(-90,0,17)[1:]:profile.append((rf+sr*math.cos(math.radians(a)),-h+sr*math.sin(math.radians(a))))
profile.append((R,h))
for a in np.linspace(0,90,17)[1:]:profile.append((rf+sr*math.cos(math.radians(a)),h+sr*math.sin(math.radians(a))))
profile.extend([(B['ramp_outer_radius'],H),(B['field_radius'],h),(0,h)])
base=m.CrossSection([np.array(profile)],m.FillRule.NonZero).revolve(1440).transform([[1,0,0,0],[0,0,1,0],[0,-1,0,0]])
save_mesh(base,'parameter-blank-plain');log('closed_blank',triangles=base.num_tri(),volume=base.volume())

def stroke(poly,width):
    pieces=[];rr=width/2
    for p in poly:pieces.append(m.CrossSection.circle(rr,12).translate(p))
    for a,b in zip(poly,poly[1:]):
        a=np.array(a);b=np.array(b);delta=b-a;length=np.linalg.norm(delta)
        if length<1e-10:continue
        n=np.array([-delta[1],delta[0]])/length*rr
        pieces.append(m.CrossSection([np.array([a+n,a-n,b-n,b+n])],m.FillRule.NonZero))
    out=m.CrossSection()
    for p in pieces:out=out+p
    return out

cutters=[];count=0
for shape in D['projection_polylines']:
    if shape['type']=='stroke':
        cs=m.CrossSection()
        for p in shape['contours']:cs=cs+stroke(p,shape['width'])
        depth=S['edge']['ornament_incuse_depth']
    else:
        cs=m.CrossSection([np.array(p) for p in shape['contours']],m.FillRule.NonZero)
        depth=S['edge']['incuse_depth'] if shape['id'].startswith('T') else S['edge']['ornament_incuse_depth']
    # Limit chord error on the cylindrical floor to <0.0001 mm.
    solid=cs.extrude(depth+.12).refine_to_length(.12)
    def wrap(p,depth=depth):
        a=math.radians(D['cut_theta'])-p[:,0]/R;r=R-depth+p[:,2]
        return np.column_stack([r*np.sin(a),-p[:,1],r*np.cos(a)])
    solid=solid.warp_batch(wrap)
    assert solid.status()==m.Error.NoError,(shape['id'],solid.status())
    cutters.append(solid);count+=1
    if count%10==0:log('cylindrical_cutters',completed=count)
log('boolean_start',cutters=len(cutters))
engraved=m.Manifold.batch_boolean([base,*cutters],m.OpType.Subtract)
v,f=save_mesh(engraved,'parameter-blank-engraved')
edge=np.sort(np.vstack([f[:,[0,1]],f[:,[1,2]],f[:,[2,0]]]),axis=1)
_,counts=np.unique(edge,axis=0,return_counts=True)
report={'schema':'tsl.blank.manufacture/1','passed':True,'units':'mm','source_package_version':S['version'],
 'vertices':len(v),'triangles':len(f),'nonmanifold_edges':int(np.sum(counts!=2)),
 'max_radius_mm':float(np.hypot(v[:,0],v[:,2]).max()),'rim_thickness_mm':float(np.ptp(v[:,1])),
 'profile_shoulder_radius_mm':.2,'circle_segments':1440,'incision_groups':len(cutters),
 'text_groups':3,'text_centres_deg':[0,120,240],'ornament_centres_deg':[60,180,300],
 'font_incise_depth_mm':.055,'ornament_incise_depth_mm':.045,'max_curve_chord_error_mm':.0001,
 'plain_volume_mm3':base.volume(),'engraved_volume_mm3':engraved.volume(),'material_removed_mm3':base.volume()-engraved.volume(),
 'art_sculpture_present':False,'notch_applied':False,'elapsed_seconds':time.monotonic()-START}
assert report['nonmanifold_edges']==0 and abs(report['rim_thickness_mm']-3.2)<1e-5
assert abs(report['max_radius_mm']-20)<1e-5 and report['material_removed_mm3']>0
(OUT/'blank-report.json').write_text(json.dumps(report,indent=2),encoding='utf-8');log('engraved_blank_saved',**report)

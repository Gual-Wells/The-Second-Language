"""Native full-coin inspection of the exact candidate pointed out by the user."""
import bpy,bmesh,numpy as np,json,hashlib,math
from pathlib import Path
ROOT=Path('D:/CodexStorage/workspaces/hostile-dragon-coin/studio-20261013')
REMOTE=Path('D:/CodexStorage/workspaces/hostile-dragon-coin/kaggle-test/regional-selected-repair-20261013/remote/selected-regional-repair')
OUT=ROOT/'outputs/user-selected-regional/inspection';OUT.mkdir(parents=True,exist_ok=True)
r=json.loads((REMOTE/'repair.json').read_text())
p=REMOTE/'repaired-candidate.npz'
if r['stage']!='repaired_candidate_saved' or r['geometry_resampled']:raise RuntimeError('Invalid repair')
if hashlib.sha256(p.read_bytes()).hexdigest()!=r['output_sha256']:raise RuntimeError('Repair artifact changed')
source=bpy.data.objects['geometry_0']
parent=np.load(ROOT/'outputs/prepared-grip.npz')['vertices']
if not np.array_equal(np.array([v.co[:] for v in source.data.vertices],np.float32),parent):raise RuntimeError('Old source changed')
name='User-selected regional candidate — repaired branch'
if bpy.data.objects.get(name):raise RuntimeError('Branch already exists; inspect before repeating')
source.hide_render=True;source.hide_set(True)
for o in bpy.context.scene.objects:
 if 'inspection only' in o.name or 'whole-context inspection' in o.name:o.hide_render=True;o.hide_set(True)
d=np.load(p);v=d['vertices'];f=d['faces']
mesh=bpy.data.meshes.new(name);mesh.from_pydata(v,[],f);mesh.update()
obj=bpy.data.objects.new(name,mesh);bpy.context.scene.collection.objects.link(obj)
for face in mesh.polygons:face.use_smooth=True
scene=bpy.context.scene;scene.render.engine='BLENDER_WORKBENCH';scene.display.shading.color_type='SINGLE';scene.display.shading.single_color=(.65,.65,.65)
cam=scene.camera;cam.data.type='ORTHO';cam.data.ortho_scale=1.25
for name,pos in [('front-before-reverse',(0,-3,.1)),('back-before-reverse',(0,3,.1))]:
 cam.location=pos;cam.rotation_euler=(-cam.location).to_track_quat('-Z','Y').to_euler();scene.render.filepath=str(OUT/(name+'.png'));bpy.ops.render.render(write_still=True)
# Same proven quiet reverse operation, scoped to the inner false mirrored relief.
# Legitimate grasp extensions remain; never cut the entire coin at one depth.
def protected(p):
 x,y,z=p
 return y>.063 and ((((x+.34)/.165)**2+((z-.28)/.16)**2<1) or (((x-.34)/.17)**2+((z+.25)/.19)**2<1))
def signature(verts,predicate):
 a=np.array(sorted(tuple(float(c) for c in v.co) for v in verts if predicate(v.co)),dtype=np.float32)
 return len(a),hashlib.sha256(a.tobytes()).hexdigest()
bm=bmesh.new();bm.from_mesh(mesh)
before=signature(bm.verts,lambda p:p.y<.025);claws=signature(bm.verts,protected)
cut=.037
bmesh.ops.bisect_plane(bm,geom=list(bm.verts)+list(bm.edges)+list(bm.faces),dist=1e-7,plane_co=(0,cut,0),plane_no=(0,1,0),clear_inner=False,clear_outer=False)
false=[face for face in bm.faces if face.calc_center_median().y>cut+1e-7 and math.hypot(face.calc_center_median().x,face.calc_center_median().z)<.436 and not any(protected(v.co) for v in face.verts)]
removed=len(false);bmesh.ops.delete(bm,geom=false,context='FACES')
edges=[e for e in bm.edges if e.is_boundary and all(abs(v.co.y-cut)<2e-6 for v in e.verts)]
if edges:bmesh.ops.holes_fill(bm,edges=edges,sides=0)
if signature(bm.verts,lambda p:p.y<.025)!=before or signature(bm.verts,protected)!=claws:raise RuntimeError('Quiet reverse damaged front/grips')
bm.normal_update();bm.to_mesh(mesh);bm.free();mesh.update()
for face in mesh.polygons:face.use_smooth=True
for name,pos in [('front',(0,-3,.1)),('quarter',(1.65,-3,.65)),('opposite-quarter',(-1.65,-3,.65)),('side',(3,-.15,.08)),('back',(0,3,.1))]:
 cam.location=pos;cam.rotation_euler=(-cam.location).to_track_quat('-Z','Y').to_euler();scene.render.filepath=str(OUT/(name+'.png'));bpy.ops.render.render(write_still=True)
cam.location=(0,-3,.1);cam.rotation_euler=(-cam.location).to_track_quat('-Z','Y').to_euler()
scene['artist_status']='USER_SELECTED_REGIONAL_BRANCH: repaired, quiet reverse; needs target comparison'
scene['regional_source_sha256']=r['source_sha256']
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'selected-regional-repaired.blend'))
result={'user_selected':'regional v1 pointed out by screenshot','repair_resampled_geometry':False,'old_source_unchanged_exact':True,'new_candidate_front_unchanged_by_reverse_operation':True,'new_candidate_wrapping_grips_unchanged_by_reverse_operation':True,'false_rear_faces_removed':removed,'art_status':'Candidate, not final target-version approval','views':['front','quarter','opposite-quarter','side','back']}
(OUT/'inspection.json').write_text(json.dumps(result,indent=2),encoding='utf-8')

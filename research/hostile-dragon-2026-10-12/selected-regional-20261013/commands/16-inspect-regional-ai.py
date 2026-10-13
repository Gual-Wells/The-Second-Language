import bpy,bmesh,numpy as np,json
from pathlib import Path
ROOT=Path('D:/CodexStorage/workspaces/hostile-dragon-coin/studio-20261013')
REMOTE=Path('D:/CodexStorage/workspaces/hostile-dragon-coin/kaggle-test/regional-rebuild-20261013/remote/dragon-regional-rebuild')
OUT=ROOT/'outputs/regional-ai/inspection';OUT.mkdir(exist_ok=True)
report=json.loads((REMOTE/'generation.json').read_text())
if report['stage']!='regional_candidate_saved' or not report.get('protected_latents_exact'):raise RuntimeError('Remote candidate is not valid for inspection')
if report.get('rejected_mesh_used') is not False:raise RuntimeError('Forbidden reconstruction input')
old=bpy.data.objects['geometry_0'];parent=np.load(ROOT/'outputs/prepared-grip.npz')['vertices']
if not np.array_equal(np.array([v.co[:] for v in old.data.vertices],dtype=np.float32),parent):raise RuntimeError('Old source changed')
old.hide_render=True
data=np.load(REMOTE/'regional-candidate.npz');v=data['vertices'];f=data['faces']
mesh=bpy.data.meshes.new('Regional image-conditioned candidate');mesh.from_pydata(v,[],f);mesh.update()
obj=bpy.data.objects.new('Regional AI — whole-context inspection',mesh);bpy.context.scene.collection.objects.link(obj)
for p in mesh.polygons:p.use_smooth=True
scene=bpy.context.scene;scene.render.engine='BLENDER_WORKBENCH';scene.display.shading.color_type='SINGLE';scene.display.shading.single_color=(.65,.65,.65)
cam=scene.camera;cam.data.type='ORTHO';cam.data.ortho_scale=1.25
for name,pos in [('front',(0,-3,.1)),('quarter',(1.65,-3,.65)),('opposite-quarter',(-1.65,-3,.65)),('side',(3,-.15,.08)),('back',(0,3,.1))]:
 cam.location=pos;cam.rotation_euler=(-cam.location).to_track_quat('-Z','Y').to_euler()
 scene.render.filepath=str(OUT/(name+'.png'));bpy.ops.render.render(write_still=True)
obj.hide_render=True;obj.hide_set(True);old.hide_render=False
cam.location=(0,-3,.1);cam.rotation_euler=(-cam.location).to_track_quat('-Z','Y').to_euler()
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'regional-inspection.blend'))
result={'vertices':len(v),'faces':len(f),'original_old_geometry_unchanged':True,'regional_ai_candidate_inspected':True,'source':'Original old latent + approved full drawing; no rejected-source inputs','art_status':'Not automatically accepted'}
(OUT/'inspection.json').write_text(json.dumps(result,indent=2),encoding='utf-8')

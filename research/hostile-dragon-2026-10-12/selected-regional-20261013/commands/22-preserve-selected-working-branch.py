"""Save a clean editable branch and neutral GLB, excluding failed experiments."""
import bpy,json,hashlib,numpy as np
from pathlib import Path
ROOT=Path('D:/CodexStorage/workspaces/hostile-dragon-coin/studio-20261013')
OUT=ROOT/'outputs/user-selected-regional/deliverable';OUT.mkdir(exist_ok=True)
obj=bpy.data.objects['User-selected regional candidate — repaired branch']
old=bpy.data.objects['geometry_0'];parent=np.load(ROOT/'outputs/prepared-grip.npz')['vertices']
if not np.array_equal(np.array([v.co[:] for v in old.data.vertices],np.float32),parent):raise RuntimeError('Old baseline changed')
for name in ['User-selected branch — scoped rear support','Reference-guided AI — inspection only']:
 bad=bpy.data.objects.get(name)
 if bad:
  data=bad.data;bpy.data.objects.remove(bad,do_unlink=True)
  if data.users==0:bpy.data.meshes.remove(data)
obj.hide_set(False);obj.hide_render=False;old.hide_set(True);old.hide_render=True
gray=bpy.data.materials.new('Neutral geometry review clay');gray.use_nodes=True
shader=gray.node_tree.nodes.get('Principled BSDF')
shader.inputs['Base Color'].default_value=(.58,.58,.58,1)
shader.inputs['Metallic'].default_value=0;shader.inputs['Roughness'].default_value=.75
obj.data.materials.clear();obj.data.materials.append(gray)
for p in obj.data.polygons:p.material_index=0
targets=[obj]+[o for o in bpy.context.scene.objects if o.name=='Independent inset reverse blank' or o.name.startswith('Inset transition lip')]
for o in targets[1:]:
 o.data=o.data.copy();o.data.materials.clear();o.data.materials.append(gray)
 if o.type=='MESH':
  for p in o.data.polygons:p.material_index=0
bpy.ops.object.select_all(action='DESELECT')
for o in targets:o.select_set(True)
bpy.context.view_layer.objects.active=obj
scene=bpy.context.scene;cam=scene.camera
cam.location=(0,-3,.1);cam.rotation_euler=(-cam.location).to_track_quat('-Z','Y').to_euler()
scene['artist_status']='WORKING_BRANCH: user-selected regional v1, repaired. Formal drawing unchanged. NOT FINAL.'
bpy.ops.file.pack_all()
blend=OUT/'hostile-dragon-selected-working.blend';glb=OUT/'hostile-dragon-selected-working.glb'
bpy.ops.wm.save_as_mainfile(filepath=str(blend))
bpy.ops.export_scene.gltf(filepath=str(glb),export_format='GLB',use_selection=True,export_apply=True)
result={'blend':str(blend),'glb':str(glb),'glb_bytes':glb.stat().st_size,'glb_sha256':hashlib.sha256(glb.read_bytes()).hexdigest(),'source_old_geometry_exact':True,'gray_geometry_review':True,'formal_target_changed':False,'canonical_promoted':False,'excluded_failed_branches':True,'remaining_issues':['upper rear hollow shell','side-edge thin skin and continuity','target hand articulation and notch translation']}
(OUT/'artifact.json').write_text(json.dumps(result,indent=2),encoding='utf-8')

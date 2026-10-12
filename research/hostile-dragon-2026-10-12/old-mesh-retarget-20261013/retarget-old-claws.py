"""Reference-driven pose study on ORIGINAL geometry, with native editable lattice cages.
The target is the approved whole-coin drawing. No generated mesh is imported.
"""
import bpy,json,hashlib,numpy as np
from pathlib import Path
from mathutils import Vector
root=Path('D:/CodexStorage/workspaces/hostile-dragon-coin/kaggle-test/outputs/retarget-old-20261013')
out=root/'pose-d';out.mkdir(parents=True,exist_ok=True)
source=Path('D:/CodexStorage/workspaces/hostile-dragon-coin/kaggle-test/outputs/original-eye-v5/working-master.blend')
target=Path('D:/CodexStorage/workspaces/ai3d-design-research/design-engineering/concept-anchor-v1/assets/selected-anchor.png')
assert hashlib.sha256(source.read_bytes()).hexdigest()=='29d468975ebb83d3295f88318c3fcc505c6e73624566455c6aeded65f58b6303'
assert hashlib.sha256(target.read_bytes()).hexdigest()=='6608204082a4036120e0c2b607fad6f27b2aa16fa3122afa37a43ac94d4f967d'
bpy.ops.wm.open_mainfile(filepath=str(source))
bpy.context.preferences.filepaths.temporary_directory='D:/CodexStorage/tmp/dragon-coin'
scene=bpy.context.scene;obj=bpy.data.objects['geometry_0']
original=np.empty(len(obj.data.vertices)*3,dtype=np.float32)
obj.data.vertices.foreach_get('co',original);original=original.reshape(-1,3)
x,y,z=original.T
def smooth(a,b,t):
 s=np.clip((t-a)/(b-a),0,1);return s*s*(3-2*s)
def group(name,weights):
 g=obj.vertex_groups.new(name=name)
 # Quantized native weights: batched assignment, never move the underlay by a rectangle.
 bins=np.rint(weights*100).astype(int)
 for level in range(1,101):
  ids=np.flatnonzero(bins==level)
  if len(ids):g.add(ids.tolist(),float(level)/100,'REPLACE')
 return g
def cage(name,lo,hi,weights,delta):
 data=bpy.data.lattices.new(name);data.points_u=4;data.points_v=3;data.points_w=5
 data.interpolation_type_u=data.interpolation_type_v=data.interpolation_type_w='KEY_LINEAR'
 ob=bpy.data.objects.new(name,data);scene.collection.objects.link(ob)
 lo=np.asarray(lo);hi=np.asarray(hi);size=hi-lo;center=(lo+hi)/2
 ob.location=center;ob.scale=size;ob.hide_render=True;ob.display_type='WIRE'
 for p in data.points:
  local=np.array(p.co_deform);world=center+local*size
  p.co_deform=local+np.array(delta(world))/size
 g=group(name+' protected mesh region',weights)
 mod=obj.modifiers.new(name,'LATTICE');mod.object=ob;mod.vertex_group=g.name
 return {'name':name,'affected_vertices':int((weights>.005).sum()),'bounds':[lo.tolist(),hi.tolist()]}
# Front depth separates existing claw volumes from the neck and coin below them.
# The side/rear cage ends at zero motion: the original wrapping roots stay attached.
upper=(smooth(-.432,-.408,x)*(1-smooth(-.22,-.195,x)) *
       smooth(.125,.145,z)*(1-smooth(.355,.378,z))*
       (1-smooth(-.060,-.027,y)))
def capsule_2d(points,radius):
 p=np.column_stack([x,z]);distance=np.full(len(p),np.inf)
 for a,b in zip(points[:-1],points[1:]):
  a=np.asarray(a);b=np.asarray(b);d=b-a
  t=np.clip(((p-a)@d)/(d@d),0,1)
  distance=np.minimum(distance,np.linalg.norm(p-(a+t[:,None]*d),axis=1))
 return 1-smooth(radius,radius+.012,distance)
lower_envelope=np.maximum(
 capsule_2d([(.255,-.232),(.325,-.195),(.444,-.18)],.026),
 capsule_2d([(.225,-.303),(.295,-.269),(.431,-.276)],.026))
# Give the whole existing nail its movement. Fading at the tip itself folds a nail.
lower=lower_envelope*(1-smooth(-.040,-.017,y))
def upper_delta(p):
 a,b,c=p
 depth=float(1-smooth(-.060,.015,b))
 down=float(1-smooth(.255,.355,c))
 # Registered reference: finger tips slightly inward/down, fixed upper root.
 return (.017*down*depth,0,-.026*down*depth)
def lower_delta(p):
 a,b,c=p
 depth=float(1-smooth(-.040,.015,b))
 reach=float(1-smooth(.275,.450,a))
 # Same existing digits, stronger inward reach; lower rim/back contact retained.
 return (-.035*reach*depth,-.003*reach*depth,-.009*reach*depth)
changes=[cage('Upper grip to approved drawing',(-.44,-.15,.115),(-.185,.06,.385),upper,upper_delta),
         cage('Lower grip to approved drawing',(.205,-.15,-.39),(.515,.065,-.12),lower,lower_delta)]
deps=bpy.context.evaluated_depsgraph_get();ev=obj.evaluated_get(deps)
mesh=ev.to_mesh();after=np.empty(len(mesh.vertices)*3,dtype=np.float32)
mesh.vertices.foreach_get('co',after);after=after.reshape(-1,3);ev.to_mesh_clear()
mask=(upper>0)|(lower>0)
assert np.array_equal(after[~mask],original[~mask]),'Non-grip source coordinates drifted'
scene['reference_target_sha256']=hashlib.sha256(target.read_bytes()).hexdigest()
scene['engineering_parent_sha256']=hashlib.sha256(source.read_bytes()).hexdigest()
scene['authority_note']='Approved drawing is the visual target; old geometry is the editable engineering parent. Pose study is not yet an accepted finished model.'
index_attribute=obj.data.attributes.new(name='source_vertex_index',type='INT',domain='POINT')
index_attribute.data.foreach_set('value',np.arange(len(original),dtype=np.int32))
# Chip separation was trialled separately and left connected thin shells.
# Keep ALL existing source components until the intended notch/fracture edit.
raw=np.empty(len(obj.data.vertices)*3,dtype=np.float32);obj.data.vertices.foreach_get('co',raw)
assert np.array_equal(raw.reshape(-1,3),original),'Original mesh basis was changed'
# A view-only image guide in the native file, hidden from actual geometry renders.
guide=bpy.data.objects.new('Approved front drawing — reference only',None)
guide.empty_display_type='IMAGE';guide.data=bpy.data.images.load(str(target));guide.data.pack()
calibration=json.loads((root/'image-registration.json').read_text(encoding='utf-8'))
inv=np.asarray(calibration['target_to_source']);size_pixels=1254
center_px=inv@np.array([size_pixels/2,size_pixels/2,1])
reference_rotation=float(np.arctan2(inv[1,0],inv[0,0]))
guide.rotation_euler=(np.pi/2,reference_rotation,0)
guide.location=((center_px[0]-625)/1000,.20,(625-center_px[1])/1000-.20/30)
guide.empty_display_size=float(np.hypot(inv[0,0],inv[1,0])*size_pixels/1000)
guide.color=(1,1,1,.35);guide.hide_render=True
scene.collection.objects.link(guide);guide.hide_set(True)
scene.render.engine='BLENDER_WORKBENCH'
scene.display.shading.light='STUDIO';scene.display.shading.color_type='SINGLE'
scene.display.shading.single_color=(.65,.65,.65)
scene.display.shading.show_cavity=True;scene.display.shading.cavity_type='BOTH'
scene.view_settings.view_transform='Standard'
scene.render.resolution_x=scene.render.resolution_y=1250
scene.render.resolution_percentage=100
cam=scene.camera;cam.data.type='ORTHO';cam.data.ortho_scale=1.25
cam.location=(0,-3,.1);cam.rotation_euler=(-cam.location).to_track_quat('-Z','Y').to_euler()
bpy.ops.wm.save_as_mainfile(filepath=str(out/'old-copy-reference-retarget.blend'))
bpy.ops.object.select_all(action='DESELECT')
for ob in scene.objects:
 if ob.type in ['MESH','CURVE'] and not ob.hide_render:ob.select_set(True)
bpy.ops.export_scene.gltf(filepath=str(out/'old-copy-reference-retarget.glb'),export_format='GLB',use_selection=True,export_apply=True,export_morph=False)
report={'source_sha256':hashlib.sha256(source.read_bytes()).hexdigest(),
 'target_sha256':hashlib.sha256(target.read_bytes()).hexdigest(),
 'whole_coin_regenerated':False,'new_artistic_meshes_created':False,
 'source_island_topology_preserved':True,'untouched_vertices_exact':True,
 'source_geometry_recoverable_exact':True,
 'old_floating_fragments_preserved_pending_fracture_design':True,
 'reference_overlay_registered_to_original_camera':True,
 'vertices_outside_grip_regions':int((~mask).sum()),'changes':changes,
 'maximum_vertex_displacement':float(np.max(np.linalg.norm(after-original,axis=1))),
 'art_accepted':False,'scope':'First existing-claw pose retarget; not a replacement for missing detailed sculpt or notch/side/back completion.',
 'pending':['Broader joint planes and digit articulation to match drawing','Upper notch clearance and integrated chip','Old floating fragment replacement to match approved drawing','Returning lower digit/side contact','Reverse extensions cleanup without flattening grasp'],
 'views':[]}
(out/'revision.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
for name,pos in [('front',(0,-3,.1)),('quarter',(1.65,-3,.3)),('side',(3,0,0)),('back',(0,3,0))]:
 cam.location=pos;cam.rotation_euler=(-cam.location).to_track_quat('-Z','Y').to_euler()
 scene.render.filepath=str(out/(name+'.png'));bpy.ops.render.render(write_still=True)
 report['views'].append(name+'.png')
 (out/'revision.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print(json.dumps(report))


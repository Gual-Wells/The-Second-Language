import bpy,numpy as np,json
from pathlib import Path
from mathutils import Vector
from mathutils.bvhtree import BVHTree
from bpy_extras.view3d_utils import location_3d_to_region_2d
ROOT=Path('D:/CodexStorage/workspaces/hostile-dragon-coin/studio-20261013')
obj=bpy.data.objects['geometry_0'];mesh=obj.data
parent=np.load(ROOT/'outputs/prepared-grip.npz');a=np.load(ROOT/'outputs/grip-sculpt-trial-a.npz')['vertices']
mesh.vertices.foreach_set('co',a.ravel());mesh.update()
before=np.array([v.co[:] for v in mesh.vertices],dtype=np.float32)
if obj.mode!='OBJECT':bpy.ops.object.mode_set(mode='OBJECT')
bpy.context.view_layer.objects.active=obj;bpy.ops.object.select_all(action='DESELECT');obj.select_set(True)
bpy.ops.object.mode_set(mode='SCULPT')
win=bpy.context.window;area=next(a for a in win.screen.areas if a.type=='VIEW_3D');region=next(r for r in area.regions if r.type=='WINDOW')
rv=area.spaces.active.region_3d;rv.view_perspective='ORTHO';rv.view_distance=1.6;rv.view_location=(0,0,0);rv.view_rotation=Vector((0,1,0)).to_track_quat('-Z','Y')
jobs=[('Scrape/Fill',.07,.32,'outer knuckle plane',[(-.365,.258),(-.358,.260),(-.35,.260),(-.342,.259)]),('Scrape/Fill',.065,.30,'inner knuckle plane',[(-.288,.313),(-.28,.315),(-.272,.314),(-.264,.31)]),('Crease Polish',.017,.13,'outer finger joint fold',[(-.342,.237),(-.334,.233),(-.327,.229)]),('Crease Polish',.016,.13,'inner finger joint fold',[(-.286,.274),(-.277,.269),(-.269,.264)])]
log=[]
with bpy.context.temp_override(window=win,area=area,region=region):
 for name,diameter,strength,label,points in jobs:
  bpy.ops.brush.asset_activate(asset_library_type='ESSENTIALS',relative_asset_identifier='brushes/essentials_brushes-mesh_sculpt.blend/Brush/'+name)
  brush=bpy.context.tool_settings.sculpt.brush;brush.use_locked_size='SCENE';brush.unprojected_size=diameter;brush.strength=strength;brush.use_frontface=True
  tree=BVHTree.FromObject(obj,bpy.context.evaluated_depsgraph_get());stroke=[]
  for i,(x,z) in enumerate(points):
   hit=tree.ray_cast(Vector((x,-1,z)),Vector((0,1,0)))
   if hit[0] is None:raise RuntimeError('No surface')
   xy=location_3d_to_region_2d(region,rv,hit[0]);mouse=tuple(xy) if xy else (region.width*.5+i*12,region.height*.5)
   stroke.append({'name':label,'location':tuple(hit[0]),'mouse':mouse,'mouse_event':mouse,'pressure':.6,'size':50.,'time':i*.12,'is_start':i==0,'x_tilt':0.,'y_tilt':0.})
  prev=np.array([v.co[:] for v in mesh.vertices],dtype=np.float32)
  op=bpy.ops.sculpt.brush_stroke(stroke=stroke,override_location=False)
  now=np.array([v.co[:] for v in mesh.vertices],dtype=np.float32)
  log.append({'brush':name,'purpose':label,'operator':list(op),'changed_vertices':int((np.linalg.norm(now-prev,axis=1)>1e-8).sum())})
bpy.ops.object.mode_set(mode='OBJECT')
after=np.array([v.co[:] for v in mesh.vertices],dtype=np.float32)
if not np.array_equal(after[parent['protected']],parent['vertices'][parent['protected']]):
 mesh.vertices.foreach_set('co',before.ravel());mesh.update()
 raise RuntimeError('Protected coordinates changed; coordinates restored')
np.savez_compressed(ROOT/'outputs/grip-sculpt-trial-b.npz',vertices=after)
scene=bpy.context.scene;scene['trial_status']='TRIAL_B_NATIVE_PLANES_FOLDS_NOT_APPROVED'
cam=scene.camera;cam.location=(0,-3,.1);cam.rotation_euler=(-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.ortho_scale=1.25
scene.render.filepath=str(ROOT/'outputs/grip-trial-b-front.png');bpy.ops.render.render(write_still=True)
cam.location=(1.65,-3,.65);cam.rotation_euler=(-cam.location).to_track_quat('-Z','Y').to_euler()
scene.render.filepath=str(ROOT/'outputs/grip-trial-b-quarter.png');bpy.ops.render.render(write_still=True)
cam.location=(0,-3,.1);cam.rotation_euler=(-cam.location).to_track_quat('-Z','Y').to_euler()
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'outputs/studio-grip-trial-b.blend'))
result={'native_passes':log,'protected_exact':True,'art_status':'Exploratory; whole-coin render review required'}
(ROOT/'outputs/grip-sculpt-trial-b.json').write_text(json.dumps(result,indent=2),encoding='utf-8')

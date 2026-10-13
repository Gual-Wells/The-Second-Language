import bpy, numpy as np, json
from pathlib import Path
from mathutils import Vector
from mathutils.bvhtree import BVHTree
ROOT=Path('D:/CodexStorage/workspaces/hostile-dragon-coin/studio-20261013')
obj=bpy.data.objects['geometry_0'];mesh=obj.data
parent=np.load(ROOT/'outputs/prepared-grip.npz')
if len(mesh.vertices)!=len(parent['vertices']):raise RuntimeError('Trial topology differs from prepared parent')
mesh.vertices.foreach_set('co',parent['vertices'].ravel());mesh.update()
before=np.array([v.co[:] for v in mesh.vertices],dtype=np.float32)
mask_values=np.empty(len(mesh.vertices),dtype=np.float32)
mesh.attributes['.sculpt_mask'].data.foreach_get('value',mask_values)
mask_values[parent['protected']]=1
mesh.attributes['.sculpt_mask'].data.foreach_set('value',mask_values)
bpy.context.view_layer.objects.active=obj
bpy.ops.object.select_all(action='DESELECT');obj.select_set(True)
bpy.ops.object.mode_set(mode='SCULPT')
win=bpy.context.window;area=next(a for a in win.screen.areas if a.type=='VIEW_3D');region=next(r for r in area.regions if r.type=='WINDOW')
rv=area.spaces.active.region_3d
rv.view_perspective='ORTHO';rv.view_distance=1.6;rv.view_location=(0,0,0)
rv.view_rotation=Vector((0,1,0)).to_track_quat('-Z','Y')
paths=[('outer proximal knuckle',[(-.357,.263),(-.352,.270),(-.345,.273),(-.337,.273)]),('inner proximal knuckle',[(-.291,.318),(-.281,.321),(-.271,.320),(-.264,.315)]),('outer finger upper plane',[(-.328,.231),(-.320,.225),(-.314,.218)])]
log=[]
with bpy.context.temp_override(window=win,area=area,region=region):
 bpy.ops.brush.asset_activate(asset_library_type='ESSENTIALS',relative_asset_identifier='brushes/essentials_brushes-mesh_sculpt.blend/Brush/Draw')
 brush=bpy.context.tool_settings.sculpt.brush
 brush.use_locked_size='SCENE';brush.unprojected_size=.062;brush.strength=.28;brush.use_frontface=True
 for label,points in paths:
  tree=BVHTree.FromObject(obj,bpy.context.evaluated_depsgraph_get())
  locations=[]
  for x,z in points:
   hit=tree.ray_cast(Vector((x,-1,z)),Vector((0,1,0)))
   if hit[0] is None:raise RuntimeError('No source surface at '+label)
   locations.append(tuple(hit[0]))
  stroke=[{'name':label,'location':p,'mouse':(region.width*.5,region.height*.5),'mouse_event':(region.width*.5,region.height*.5),'pressure':.65,'size':60.,'time':i*.12,'is_start':i==0,'x_tilt':0.,'y_tilt':0.} for i,p in enumerate(locations)]
  op=bpy.ops.sculpt.brush_stroke(stroke=stroke,override_location=False)
  log.append({'purpose':label,'brush':brush.name,'locations':locations,'operator':list(op)})
bpy.ops.object.mode_set(mode='OBJECT')
after=np.array([v.co[:] for v in mesh.vertices],dtype=np.float32)
protected=parent['protected']
if not np.array_equal(before[protected],after[protected]):
 mesh.vertices.foreach_set('co',before.ravel());mesh.update()
 raise RuntimeError('Protected source changed; coordinates restored')
delta=np.linalg.norm(after-before,axis=1)
if not (delta>1e-8).any():raise RuntimeError('No geometry edited')
np.savez_compressed(ROOT/'outputs/grip-sculpt-trial-a.npz',vertices=after)
scene=bpy.context.scene
scene['trial_status']='NATIVE_SCULPT_EXPLORATION_NOT_ART_ACCEPTED'
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'outputs/studio-grip-trial-a.blend'))
cam=scene.camera
cam.location=(0,-3,.1);cam.rotation_euler=(-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.type='ORTHO';cam.data.ortho_scale=1.25
scene.render.filepath=str(ROOT/'outputs/grip-trial-a-front.png');bpy.ops.render.render(write_still=True)
cam.location=(1.65,-3,.65);cam.rotation_euler=(-cam.location).to_track_quat('-Z','Y').to_euler()
scene.render.filepath=str(ROOT/'outputs/grip-trial-a-quarter.png');bpy.ops.render.render(write_still=True)
cam.location=(0,-3,.1);cam.rotation_euler=(-cam.location).to_track_quat('-Z','Y').to_euler()
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'outputs/studio-grip-trial-a.blend'))
result={'brushes':log,'changed_vertices':int((delta>1e-8).sum()),'maximum_displacement':float(delta.max()),'protected_exact':True,'status':'TECHNICAL_EXECUTION_VERIFIED; ARTISTIC_QUALITY_REQUIRES_RENDER_REVIEW'}
(ROOT/'outputs/grip-sculpt-trial-a.json').write_text(json.dumps(result,indent=2),encoding='utf-8')

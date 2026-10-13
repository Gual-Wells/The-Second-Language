import bpy,numpy as np,json
from mathutils import Vector
bpy.ops.object.mode_set(mode='OBJECT')
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
bpy.ops.mesh.primitive_uv_sphere_add(segments=96,ring_count=64,radius=.3)
obj=bpy.context.object;obj.name='TECH_ONLY_ProtectedBrushProbe'
before=np.array([v.co[:] for v in obj.data.vertices])
mask=obj.data.attributes.new(name='.sculpt_mask',type='FLOAT',domain='POINT')
protected=before[:,2]<.045
values=protected.astype(np.float32);mask.data.foreach_set('value',values)
obj.use_mesh_mirror_x=False;obj.use_mesh_mirror_y=False;obj.use_mesh_mirror_z=False
bpy.ops.object.mode_set(mode='SCULPT')
win=bpy.context.window;area=next(a for a in win.screen.areas if a.type=='VIEW_3D');region=next(r for r in area.regions if r.type=='WINDOW')
area.spaces.active.region_3d.view_perspective='ORTHO';area.spaces.active.region_3d.view_distance=.9
area.spaces.active.region_3d.view_location=(0,0,0);area.spaces.active.region_3d.view_rotation=Vector((0,1,0)).to_track_quat('-Z','Y')
with bpy.context.temp_override(window=win,area=area,region=region):
 brush=bpy.context.tool_settings.sculpt.brush
 brush.strength=.10;brush.use_locked_size='SCENE';brush.unprojected_size=.10;brush.use_frontface=True
 stroke=[{'name':'Protected sculpt probe','location':(x,-.2828427,.1),'mouse':(region.width/2,region.height/2),'mouse_event':(region.width/2,region.height/2),'pressure':.3,'size':50.,'time':i*.1,'is_start':i==0,'x_tilt':0.,'y_tilt':0.} for i,x in enumerate([-.01,0,.01])]
 op=bpy.ops.sculpt.brush_stroke(stroke=stroke,override_location=False)
bpy.ops.object.mode_set(mode='OBJECT')
after=np.array([v.co[:] for v in obj.data.vertices]);displacement=np.linalg.norm(after-before,axis=1)
result={'operator':list(op),'vertices':len(after),'changed_vertices':int((displacement>1e-8).sum()),'protected_unchanged_exact':bool(np.array_equal(before[protected],after[protected])),'max_displacement':float(displacement.max()),'is_artistic_asset':False}
if not result['changed_vertices']:raise RuntimeError('Brush completed without changing geometry')
if not result['protected_unchanged_exact']:raise RuntimeError('Brush moved protected calibration geometry')

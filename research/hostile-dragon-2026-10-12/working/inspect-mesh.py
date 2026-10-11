import bpy,sys,json,os,math,pathlib
from mathutils import Vector
r=pathlib.Path('D:/CodexStorage/workspaces/hostile-dragon-coin'); bpy.context.preferences.filepaths.temporary_directory='D:/CodexStorage/tmp/dragon-coin'
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
f=sys.argv[sys.argv.index('--')+1]
bpy.ops.import_scene.gltf(filepath=f)
objs=[o for o in bpy.context.scene.objects if o.type=='MESH']; pts=[o.matrix_world@Vector(v) for o in objs for v in o.bound_box];lo=Vector([min(p[i] for p in pts) for i in range(3)]);hi=Vector([max(p[i] for p in pts) for i in range(3)]);mid=(lo+hi)/2;span=max(hi-lo);print('Bounds',list(lo),list(hi),flush=True)
for o in objs:
 o.location-=mid
 o.location/=span
 o.scale/=span
 m=bpy.data.materials.get('Clay')
 if not m:
  m=bpy.data.materials.new('Clay');m.diffuse_color=(.33,.34,.35,1);m.use_nodes=True;p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(.33,.34,.35,1);p.inputs['Roughness'].default_value=.53
 o.data.materials.clear();o.data.materials.append(m)
 for p in o.data.polygons:p.use_smooth=True
s=bpy.context.scene;s.render.engine='CYCLES';s.cycles.samples=24;s.cycles.use_denoising=True;s.render.resolution_x=900;s.render.resolution_y=900;s.render.resolution_percentage=100;s.render.image_settings.file_format='PNG';s.render.film_transparent=False;s.world.use_nodes=True;s.world.node_tree.nodes['Background'].inputs[0].default_value=(.065,.07,.08,1);s.world.node_tree.nodes['Background'].inputs[1].default_value=.5
for name,pos,power,size in [('Key',(-2,-3,3),350,2.6),('Fill',(2,-2,1),150,2),('Rim',(0,2,2),400,1.5)]:
 bpy.ops.object.light_add(type='AREA',location=pos);o=bpy.context.object;o.name=name;o.data.energy=power;o.data.shape='DISK';o.data.size=size;o.rotation_euler=(Vector((0,0,0))-o.location).to_track_quat('-Z','Y').to_euler()
bpy.ops.object.camera_add();cam=bpy.context.object;cam.data.type='ORTHO';cam.data.ortho_scale=1.35;s.camera=cam
out=r/'working/clay';out.mkdir(exist_ok=True)
for name,pos in [('front',(0,-3,0)),('quarter',(1.6,-2.5,.1)),('side',(3,0,0)),('back',(0,3,0))]:
 cam.location=pos;cam.rotation_euler=(-cam.location).to_track_quat('-Z','Y').to_euler();s.render.filepath=str(out/(name+'.png'));bpy.ops.render.render(write_still=True)
bpy.ops.wm.save_as_mainfile(filepath=str(r/'working/reconstructed-clay.blend'))
(r/'working/mesh-report.json').write_text(json.dumps({'source':f,'dimensions':list((hi-lo)/span),'objects':len(objs),'vertices':sum(len(o.data.vertices) for o in objs),'faces':sum(len(o.data.polygons) for o in objs)},indent=2))

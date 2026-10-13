import bpy,hashlib,json,numpy as np
from pathlib import Path
ROOT=Path('D:/CodexStorage/workspaces/hostile-dragon-coin/studio-20261013')
source=ROOT/'assets/old-mother-read-copy.blend';art=ROOT/'assets/approved-front.png'
assert hashlib.sha256(source.read_bytes()).hexdigest()=='29d468975ebb83d3295f88318c3fcc505c6e73624566455c6aeded65f58b6303'
assert hashlib.sha256(art.read_bytes()).hexdigest()=='6608204082a4036120e0c2b607fad6f27b2aa16fa3122afa37a43ac94d4f967d'
if bpy.context.object and bpy.context.object.mode!='OBJECT':bpy.ops.object.mode_set(mode='OBJECT')
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
with bpy.data.libraries.load(str(source),link=False) as (data_from,data_to):
 data_to.objects=data_from.objects
for obj in data_to.objects:
 if obj is not None:bpy.context.scene.collection.objects.link(obj)
obj=bpy.data.objects['geometry_0'];bpy.context.view_layer.objects.active=obj
obj.select_set(True)
scene=bpy.context.scene;scene.camera=next(o for o in data_to.objects if o and o.type=='CAMERA')
scene.render.engine='BLENDER_WORKBENCH';scene.display.shading.light='STUDIO'
scene.display.shading.color_type='SINGLE';scene.display.shading.single_color=(.65,.65,.65)
scene.display.shading.show_cavity=True;scene.display.shading.cavity_type='BOTH'
scene.view_settings.view_transform='Standard';scene.render.resolution_x=scene.render.resolution_y=1250
scene.render.resolution_percentage=100
guide=bpy.data.objects.new('Formal approved front — view-only guide',None)
guide.empty_display_type='IMAGE';guide.data=bpy.data.images.load(str(art));guide.data.pack()
guide.empty_display_size=1.082;guide.rotation_euler=(np.pi/2,.006,0)
guide.location=(.012,.20,-.028);guide.color=(1,1,1,.35);guide.hide_render=True
scene.collection.objects.link(guide);guide.hide_set(True)
xyz=np.empty(len(obj.data.vertices)*3,dtype=np.float32);obj.data.vertices.foreach_get('co',xyz);xyz=xyz.reshape(-1,3)
triangles=np.empty(len(obj.data.loop_triangles)*3,dtype=np.int32)
obj.data.calc_loop_triangles();triangles=np.empty(len(obj.data.loop_triangles)*3,dtype=np.int32)
obj.data.loop_triangles.foreach_get('vertices',triangles);triangles=triangles.reshape(-1,3)
np.savez_compressed(ROOT/'outputs/source-geometry.npz',vertices=xyz,faces=triangles)
(ROOT/'outputs/source-coordinate-sha256.txt').write_text(hashlib.sha256(xyz.tobytes()).hexdigest())
scene['studio_parent_sha256']=hashlib.sha256(source.read_bytes()).hexdigest()
scene['approved_front_sha256']=hashlib.sha256(art.read_bytes()).hexdigest()
scene['artist_status']='EXPLORATION_ONLY: approved front remains goal; source mother preserved'
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'outputs/studio-base.blend'))
result={'objects':[o.name for o in data_to.objects if o],'vertices':len(xyz),'triangles':len(triangles),'studio_file':str(ROOT/'outputs/studio-base.blend'),'old_source_unchanged':True,'target_unchanged':True}

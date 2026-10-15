import bpy,sys,json,math
from pathlib import Path
import numpy as np
from mathutils import Vector,Matrix
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'outputs';MM=.001
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
data=np.load(OUT/'parameter-blank-engraved.npz');me=bpy.data.meshes.new('ParametricEngravedBlank')
me.from_pydata((data['vertices']*MM).tolist(),[],data['faces'].tolist());me.update()
obj=bpy.data.objects.new('CoinBlank_D40_T2.8_Rim3.2',me);bpy.context.collection.objects.link(obj)
for name,rough in [('Satin silver field',.32),('Burnished shoulders',.20),('Satin lettered edge',.29),('Incuse silver recess',.43)]:
    mat=bpy.data.materials.new(name);mat.use_nodes=True;p=mat.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(.72,.70,.67,1);p.inputs['Metallic'].default_value=1;p.inputs['Roughness'].default_value=rough;me.materials.append(mat)
for p in me.polygons:
    c=p.center/MM;r=math.hypot(c.x,c.z)
    p.material_index=0 if r<19.24 else (1 if abs(c.y)>1.39 else (3 if r<19.99 else 2))
    p.use_smooth=(r>19.76 and p.material_index!=3)
obj['geometry_units']='metres; parameters and NPZ in millimetres';obj['source_design_version']='1.1';obj['real_incised_groups']=81
sc=bpy.context.scene;sc.unit_settings.system='METRIC';sc.unit_settings.length_unit='MILLIMETERS'
sc.render.engine='CYCLES';sc.cycles.device='CPU';sc.cycles.samples=32;sc.cycles.use_denoising=True
sc.render.threads_mode='FIXED';sc.render.threads=4;sc.render.image_settings.file_format='PNG';sc.render.resolution_percentage=100
sc.world.use_nodes=True;bg=sc.world.node_tree.nodes['Background'];bg.inputs[0].default_value=(.14,.16,.19,1);bg.inputs[1].default_value=.5
sc.view_settings.view_transform='AgX';sc.view_settings.exposure=-4
def aim(o,p):o.rotation_euler=(Vector(p)-o.location).to_track_quat('-Z','Y').to_euler()
def area(name,loc,energy,size,sizey,target=(0,0,0)):
    d=bpy.data.lights.new(name,'AREA');d.energy=energy;d.shape='RECTANGLE';d.size=size;d.size_y=sizey;o=bpy.data.objects.new(name,d);bpy.context.collection.objects.link(o);o.location=loc;aim(o,target)
area('Front softbox',(-.035,-.045,.07),14,.065,.035);area('Reverse softbox',(.04,.055,.06),18,.05,.025)
area('Side raking strip',(0,-.012,.065),7,.05,.004)
bpy.ops.object.camera_add();cam=bpy.context.object;cam.data.type='ORTHO';cam.data.clip_start=.0001;cam.data.clip_end=10;sc.camera=cam
cam.location=(.032,-.058,.039);aim(cam,(0,0,0));cam.data.ortho_scale=.055
sc.render.resolution_x=1200;sc.render.resolution_y=1000
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'parameter-blank.blend'))
sc.render.filepath=str(OUT/'blank-oblique.png');bpy.ops.render.render(write_still=True)
for angle in [0,120,240]:
    a=math.radians(angle);normal=Vector((math.sin(a),0,math.cos(a)));right=Vector((-math.cos(a),0,math.sin(a)));up=Vector((0,-1,0))
    matrix=Matrix(((right.x,up.x,normal.x,0),(right.y,up.y,normal.y,0),(right.z,up.z,normal.z,0),(0,0,0,1)))
    matrix.translation=normal*.085;cam.matrix_world=matrix;cam.data.ortho_scale=.032
    sc.render.resolution_x=1600;sc.render.resolution_y=600
    sc.render.filepath=str(OUT/f'blank-edge-{angle:03d}.png');bpy.ops.render.render(write_still=True)
print('PARAMETER_BLANK_SAVED')

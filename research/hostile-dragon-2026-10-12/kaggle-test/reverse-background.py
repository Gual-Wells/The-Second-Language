"""Restrained reverse and continuous coin-edge study; no competing emblem."""
import bpy,sys,json,math
from pathlib import Path
from mathutils import Vector
source,output=sys.argv[sys.argv.index('--')+1:]
out=Path(output);out.mkdir(parents=True,exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=source)
bpy.context.preferences.filepaths.temporary_directory='D:/CodexStorage/tmp/dragon-coin'
removed=[]
for o in list(bpy.context.scene.objects):
    if o.type in ['MESH','CURVE'] and not (o.name=='geometry_0' or o.name=='Independent inset reverse blank' or o.name.startswith('Inset transition lip')):
        removed.append(o.name);bpy.data.objects.remove(o,do_unlink=True)
plate=bpy.data.objects['Independent inset reverse blank']
# Satin field with a subdued warm-silver finish: the reverse is a backing
# surface, and the claws and damaged rim remain the only focal structures.
m=plate.data.materials[0];p=m.node_tree.nodes.get('Principled BSDF')
p.inputs['Base Color'].default_value=(.31,.30,.275,1)
p.inputs['Roughness'].default_value=.42
report={'stage':'background_only_study','art_accepted':False,'source_scene':source,'user_decision':'reverse supports the front and does not introduce another focal emblem','removed_competing_components':removed,'preserved':['original front','original wrapped claw vertices','original rim and fragments'],'transition':'thin inset blank with interrupted narrow lips; requires side and contact review'}
def save():(out/'background-review.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
scene=bpy.context.scene;cam=scene.camera
scene.cycles.samples=24;scene.cycles.device='CPU';scene.render.resolution_x=scene.render.resolution_y=1000
scene.view_layers[0].material_override=None
bpy.ops.wm.save_as_mainfile(filepath=str(out/'background-master.blend'))
bpy.ops.object.select_all(action='DESELECT')
for o in scene.objects:
    if o.type in ['MESH','CURVE']:o.select_set(True)
bpy.ops.export_scene.gltf(filepath=str(out/'hostile-dragon-background-study.glb'),export_format='GLB',use_selection=True,export_apply=True)
save()
views=[('back',(0,3,.1),(0,0,0),1.22),('side',(3,.15,.1),(0,0,0),1.22),('upper-claw-join',(-.65,2,1),(-.30,.06,.26),.39),('lower-claw-join',(.7,2,-.4),(.31,.06,-.25),.40)]
for name,pos,target,scale in views:
    cam.location=pos;cam.data.ortho_scale=scale;cam.rotation_euler=(Vector(target)-cam.location).to_track_quat('-Z','Y').to_euler();scene.render.filepath=str(out/(name+'.png'))
    bpy.ops.render.render(write_still=True);report.setdefault('views',[]).append(name+'.png');save()
report['stage']='background_ready_for_actual_review';save()

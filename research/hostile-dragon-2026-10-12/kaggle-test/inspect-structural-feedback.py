"""Whole-form context plus targeted views for user-identified structural faults.

Inspection does not alter anatomy, make acceptance claims or reinterpret the eye.
"""
import bpy,sys,json
from pathlib import Path
from mathutils import Vector
source,output=sys.argv[sys.argv.index('--')+1:]
source=str(Path(source).resolve());out=Path(output).resolve();out.mkdir(parents=True,exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=source)
bpy.context.preferences.filepaths.temporary_directory='D:/CodexStorage/tmp/dragon-coin'
scene=bpy.context.scene;scene.cycles.device='CPU';scene.cycles.samples=16
scene.render.resolution_x=scene.render.resolution_y=900
clay=bpy.data.materials.new('Whole-form context clay');clay.use_nodes=True
p=clay.node_tree.nodes['Principled BSDF'];p.inputs['Base Color'].default_value=(.32,.32,.32,1);p.inputs['Roughness'].default_value=.75
scene.view_layers[0].material_override=clay
cam=scene.camera;cam.data.type='ORTHO'
report={'stage':'structural_feedback_inspection','eye_preserved':True,'art_accepted':False,'views':[]}
views=[
 ('nose-mouth-root',(.29,-.08,.015),.37,(0,-3,.02)),
 ('head-upper-left-junction',(-.075,-.06,.28),.57,(0,-3,.02)),
 ('lower-claw-front-and-rim',(.335,-.02,-.25),.43,(.8,-3,.15)),
 ('neck-chest-whole-form',(-.11,-.03,-.08),.77,(0,-3,.02))
]
for name,target,scale,offset in views:
    t=Vector(target);cam.location=t+Vector(offset);cam.rotation_euler=(t-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.ortho_scale=scale
    scene.render.filepath=str(out/(name+'.png'));bpy.ops.render.render(write_still=True)
    report['views'].append(name+'.png');(out/'inspection.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
report['stage']='views_saved_for_actual_review';(out/'inspection.json').write_text(json.dumps(report,indent=2),encoding='utf-8')

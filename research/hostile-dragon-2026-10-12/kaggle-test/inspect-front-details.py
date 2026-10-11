"""Actual orthographic gray geometry inspection before sculpt repair."""
import bpy,sys,json
from pathlib import Path
from mathutils import Vector
source,output=sys.argv[sys.argv.index('--')+1:]
out=Path(output);out.mkdir(parents=True,exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=source)
bpy.context.preferences.filepaths.temporary_directory='D:/CodexStorage/tmp/dragon-coin'
scene=bpy.context.scene;scene.cycles.device='CPU';scene.cycles.samples=24
scene.render.resolution_x=scene.render.resolution_y=1000
clay=bpy.data.materials.new('Inspection only neutral clay');clay.use_nodes=True
s=clay.node_tree.nodes['Principled BSDF'];s.inputs['Base Color'].default_value=(.35,.35,.35,1);s.inputs['Roughness'].default_value=.75
scene.view_layers[0].material_override=clay
cam=scene.camera;cam.data.type='ORTHO'
targets=[('near-eye',(.14,-.09,.09),.30),('mouth-and-teeth',(.16,-.10,-.12),.40),('upper-gripping-claw',(-.34,-.025,.28),.43),('lower-gripping-claw',(.33,-.04,-.26),.43)]
report={'stage':'detail_inspection','art_accepted':False,'source':source,'views':[]}
for name,target,scale in targets:
    t=Vector(target);cam.location=t+Vector((0,-3,.1));cam.rotation_euler=(t-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.ortho_scale=scale
    scene.render.filepath=str(out/(name+'.png'));bpy.ops.render.render(write_still=True)
    report['views'].append(name+'.png');(out/'inspection.json').write_text(json.dumps(report,indent=2))
report['stage']='details_ready_for_visual_audit';(out/'inspection.json').write_text(json.dumps(report,indent=2))

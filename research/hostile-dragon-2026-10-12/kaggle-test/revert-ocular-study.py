"""Remove only the rejected ocular additions; preserve source geometry.

The user explicitly corrected a false defect diagnosis made from a local crop.
An oblique minted relief must be judged in its whole-head context first.
"""
import bpy, sys, json, hashlib
from pathlib import Path

source, output = sys.argv[sys.argv.index('--') + 1:]
source=str(Path(source).resolve())
out = Path(output).resolve(); out.mkdir(parents=True, exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=source)
bpy.context.preferences.filepaths.temporary_directory='D:/CodexStorage/tmp/dragon-coin'

def fingerprint(obj):
    return hashlib.sha256(b''.join(__import__('struct').pack('<3f', *v.co) for v in obj.data.vertices)).hexdigest()

original=bpy.data.objects.get('geometry_0')
if original is None: raise RuntimeError('Original source mesh missing')
before=fingerprint(original)
removed=[]
for name in ['Near eye — socket-seated ocular globe', 'Dark floor below pupil incision']:
    obj=bpy.data.objects.get(name)
    if obj is None: raise RuntimeError('Rejected study object missing: '+name)
    removed.append(obj.name);bpy.data.objects.remove(obj, do_unlink=True)
assert fingerprint(original)==before, 'Source geometry changed while removing additions'

scene=bpy.context.scene;scene.cycles.device='CPU';scene.cycles.samples=24
scene.render.resolution_x=scene.render.resolution_y=1000
scene.view_layers[0].material_override=None
bpy.ops.wm.save_as_mainfile(filepath=str(out/'working-master.blend'))
bpy.ops.object.select_all(action='DESELECT')
for obj in scene.objects:
    if obj.type in ['MESH','CURVE']:obj.select_set(True)
bpy.ops.export_scene.gltf(filepath=str(out/'hostile-dragon-original-eye-study.glb'),export_format='GLB',use_selection=True,export_apply=True)
report={'stage':'ocular_additions_reverted','art_accepted':False,'removed':removed,
        'source_mesh_preserved':True,'source_geometry_sha256':before,
        'user_correction':'The original eye is not defective; evaluate local anatomy only after understanding the global form.',
        'retained_experiment':'Quiet reverse and official mesh repair remain separate, unaccepted studies.', 'views':[]}
def save():
    (out/'review.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
save()
clay=bpy.data.materials.new('Global form inspection clay');clay.use_nodes=True
p=clay.node_tree.nodes['Principled BSDF'];p.inputs['Base Color'].default_value=(.36,.36,.36,1);p.inputs['Roughness'].default_value=.72
cam=scene.camera
for name,pos,mode in [('front',(0,-3,.1),'pbr'),('front-clay',(0,-3,.1),'clay')]:
    scene.view_layers[0].material_override=clay if mode=='clay' else None
    cam.location=pos;cam.rotation_euler=(-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.ortho_scale=1.22
    scene.render.filepath=str(out/(name+'.png'));bpy.ops.render.render(write_still=True)
    report['views'].append(name+'.png');save()
report['stage']='reverted_model_and_views_saved';save()

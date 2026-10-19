"""Put the actual generated surface and editable rig preparation in one scene.

No automatic cross-layer weights: contact regions still require part separation.
"""
from pathlib import Path
import bpy,sys,json,hashlib
from mathutils import Vector,Matrix
ROOT=Path(__file__).resolve().parents[1]
args=sys.argv[sys.argv.index('--')+1:];SOURCE=Path(args[0]).resolve()
OUT=ROOT/'.cache/keeper-engineering';OUT.mkdir(exist_ok=True)
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=str(SOURCE))
meshes=[o for o in bpy.context.scene.objects if o.type=='MESH']
points=[o.matrix_world@Vector(c) for o in meshes for c in o.bound_box]
lo=Vector([min(p[i] for p in points) for i in range(3)]);hi=Vector([max(p[i] for p in points) for i in range(3)])
center=(lo+hi)/2;extent=max(hi-lo)
with bpy.data.libraries.load(str(ROOT/'.cache/keeper-rig/keeper-rig-preparation.blend'),link=False) as (available,load):
 load.objects=['Keeper_Rig_PREPARATION']
rig=load.objects[0];bpy.context.scene.collection.objects.link(rig)
rig.matrix_world=Matrix.Translation(center)@Matrix.Scale(extent,4)
rig['bound_to_art_asset']=False
rig['placement']='Nominal guide scaled to real asset bounds; contact pivots/strip midline require fitting during separation'
scene=bpy.context.scene;scene.frame_start=0;scene.frame_end=180;scene.render.fps=60
for frame,name in [(0,'CLOSED'),(24,'TENSION_RELEASED'),(42,'PIN_CLEAR'),(90,'TAIL_CLEAR'),(115,'RING_OPEN'),(180,'REMOVED')]:scene.timeline_markers.new(name,frame=frame)
scene.frame_set(0)
for mesh in meshes:mesh['status']='Generated static surface; not yet separated into independently moving mechanical parts'
scene['status']='Static model with rig preparation; no unfastening animation claimed'
scene['reference_sha256']='63343355742f1e7c112547cef9fc329e30a0921a4494dc08c8183450a569ba37'
bpy.ops.file.pack_all()
bpy.context.view_layer.objects.active=rig;bpy.ops.object.select_all(action='DESELECT');rig.select_set(True)
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'keeper-model-and-rig.blend'))
report={'source_sha256':hashlib.sha256(SOURCE.read_bytes()).hexdigest(),'source_bytes':SOURCE.stat().st_size,
        'bones':len(rig.data.bones),'mesh_objects':len(meshes),'bound_meshes':0,
        'motion_parameter_tracks':True,'rig_complete':False,'art_accepted':False,
        'remaining':'Independent part separation, hidden prong/fold geometry, contact fitting and actual skinning'}
(OUT/'engineering.json').write_text(json.dumps(report,indent=2));print(json.dumps(report))

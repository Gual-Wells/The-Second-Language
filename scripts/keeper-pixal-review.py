"""Inspect the actual new reconstruction in Blender; no shape invention."""
from pathlib import Path
import bpy,sys,json,math,hashlib
from mathutils import Vector
ROOT=Path(__file__).resolve().parents[1]
args=sys.argv[sys.argv.index('--')+1:]
SOURCE=Path(args[0]).resolve()
label=args[1] if len(args)>1 else 'native'
if label not in ['native','author']:raise RuntimeError('Unknown review label')
OUT=ROOT/('.cache/keeper-pixal-review' if label=='native' else '.cache/keeper-author-review');OUT.mkdir(exist_ok=True)
EVIDENCE=ROOT/'research/scroll-keeper-pixal-2026-10-19'
if label=='author':EVIDENCE=EVIDENCE/'author'
EVIDENCE.mkdir(exist_ok=True)
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=str(SOURCE))
meshes=[o for o in bpy.context.scene.objects if o.type=='MESH']
pts=[o.matrix_world@Vector(c) for o in meshes for c in o.bound_box]
lo=Vector([min(p[i] for p in pts) for i in range(3)]);hi=Vector([max(p[i] for p in pts) for i in range(3)])
center=(lo+hi)*.5;extent=max(hi-lo)
scene=bpy.context.scene;scene.render.engine='CYCLES';scene.cycles.samples=24
scene.render.resolution_x=1400;scene.render.resolution_y=1100;scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG';scene.render.film_transparent=False
scene.world=bpy.data.worlds.new('Neutral inspection world');scene.world.use_nodes=True
scene.world.node_tree.nodes['Background'].inputs['Color'].default_value=(.12,.12,.12,1)
scene.world.node_tree.nodes['Background'].inputs['Strength'].default_value=.5
scene.view_settings.view_transform='AgX'
# This host's MX250 driver cannot load Blender 5.1's CUDA cubin. Keep CPU
# inspection deterministic instead of modifying the user's display driver.
scene.cycles.device='CPU'
def light(name,loc,power,size):
 data=bpy.data.lights.new(name,'AREA');data.energy=power;data.shape='DISK';data.size=size*extent
 o=bpy.data.objects.new(name,data);scene.collection.objects.link(o);o.location=center+Vector(loc)*extent
 o.rotation_euler=(center-o.location).to_track_quat('-Z','Y').to_euler()
light('Large warm key',(-1.5,-2.3,2.7),250*extent**2,2.6)
light('Cool fill',(2,-1,1),130*extent**2,2)
light('Back rim',(.6,1.5,2),180*extent**2,1.5)
camdata=bpy.data.cameras.new('Review camera');cam=bpy.data.objects.new('Review camera',camdata);scene.collection.objects.link(cam);scene.camera=cam
camdata.type='ORTHO';camdata.ortho_scale=extent*1.3;camdata.lens=50
clay=bpy.data.materials.new('Geometry only neutral clay');clay.diffuse_color=(.38,.37,.35,1);clay.use_nodes=True
principled=clay.node_tree.nodes.get('Principled BSDF');principled.inputs['Base Color'].default_value=(.38,.37,.35,1);principled.inputs['Roughness'].default_value=.7
report={'source':str(SOURCE),'sha256':hashlib.sha256(SOURCE.read_bytes()).hexdigest(),'bounds':[list(lo),list(hi)],
        'meshes':[{'name':o.name,'vertices':len(o.data.vertices),'faces':len(o.data.polygons),'materials':[m.name for m in o.data.materials]} for o in meshes],
        'art_accepted':False,'rigged':False,'renders':[]}
def save():(EVIDENCE/'review.json').write_text(json.dumps(report,indent=2))
for name,pos,neutral in [('front',(0,-3,.28),False),('quarter',(-1.4,-2.8,1),False),('side',(3,0,.4),False),('back',(0,3,.3),False),('clay-front',(0,-3,.28),True),('clay-inside',(0,-1,3),True)]:
 scene.view_layers[0].material_override=clay if neutral else None
 cam.location=center+Vector(pos)*extent;cam.rotation_euler=(center-cam.location).to_track_quat('-Z','Y').to_euler()
 scene.render.filepath=str(EVIDENCE/(name+'.png'));bpy.ops.render.render(write_still=True)
 report['renders'].append(name+'.png');save()
scene.view_layers[0].material_override=None
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'keeper-pixal-review.blend'));save()
print(json.dumps(report))

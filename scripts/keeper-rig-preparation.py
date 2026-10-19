"""Build an editable Blender rig guide. No rejected geometry or fake finished rig.

The guide is normalized to diameter 1; fit to the reconstructed strip midline
after contact-region separation. It contains no rendered stand-in art mesh.
"""
from pathlib import Path
import bpy, math, json
from mathutils import Vector

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'.cache/keeper-rig';OUT.mkdir(exist_ok=True)
bpy.ops.wm.read_factory_settings(use_empty=True)
scene=bpy.context.scene;scene.render.fps=60;scene.frame_start=0;scene.frame_end=180
scene.unit_settings.system='METRIC'
scene['status']='Rig placement guide only; generated surface not yet bound'
scene['reference_sha256']='63343355742f1e7c112547cef9fc329e30a0921a4494dc08c8183450a569ba37'
scene['axes']='Guide ring in XY, width along Z; front is -Y; later align to scroll axis'

arm=bpy.data.armatures.new('Keeper deformation and rigid parts')
rig=bpy.data.objects.new('Keeper_Rig_PREPARATION',arm);scene.collection.objects.link(rig)
rig.show_in_front=True;rig['bound_to_art_asset']=False
bpy.context.view_layer.objects.active=rig;rig.select_set(True);bpy.ops.object.mode_set(mode='EDIT')
def bone(name,a,b,parent=None,connected=False,deform=True):
 o=arm.edit_bones.new(name);o.head=a;o.tail=b;o.use_deform=deform
 if parent:o.parent=arm.edit_bones[parent];o.use_connect=connected
 return o
bone('ROOT',(0,0,-.35),(0,0,-.2),deform=False)
bone('FRAME',(-.16,-.48,0),(-.16,-.48,.1),'ROOT')
bone('PRONG',(-.16,-.5,0),(.15,-.5,0),'FRAME')
bone('FIXED_FOLD',(-.19,-.46,-.1),(-.19,-.46,.1),'FRAME')
# A continuous guide chain runs from the fixed side around the inner loop.
# The fitting pass must replace this nominal centerline with actual geometry.
count=40
for i in range(count):
 a=-math.pi/2-(i/count)*2*math.pi;b=-math.pi/2-((i+1)/count)*2*math.pi
 r=.46
 bone(f'LEATHER_{i:02}',(r*math.cos(a),r*math.sin(a),0),(r*math.cos(b),r*math.sin(b),0),
      'ROOT' if i==0 else f'LEATHER_{i-1:02}',i>0)
# Free tip runs toward the left, in front of the left fixed fold.
for i in range(8):
 x=.15-i*.055
 bone(f'TAIL_{i:02}',(x,-.52,0),(x-.055,-.52,0),
      'ROOT' if i==0 else f'TAIL_{i-1:02}',i>0)
bpy.ops.object.mode_set(mode='OBJECT')
for name in ['FRAME','PRONG','FIXED_FOLD']:
 p=rig.pose.bones[name];p.lock_scale=(True,True,True)
rig.pose.bones['PRONG'].rotation_mode='QUATERNION'
# Parameter tracks are explicit preparation, not a disguised mesh animation.
params={'release_tension':[(0,0),(24,1),(180,1)],
        'prong_clear':[(0,0),(24,0),(42,1),(180,1)],
        'tail_withdraw':[(0,0),(42,0),(90,1),(180,1)],
        'open_ring':[(0,0),(90,0),(115,1),(180,1)],
        'axial_remove':[(0,0),(115,0),(180,1)]}
for name,keys in params.items():
 rig[name]=0.0;rig.id_properties_ui(name).update(min=0,max=1,description='Preparation progress; bind actual geometry before use')
 for frame,value in keys:
  rig[name]=value;rig.keyframe_insert(data_path=f'["{name}"]',frame=frame)
for frame,name in [(0,'CLOSED'),(24,'TENSION_RELEASED'),(42,'PIN_CLEAR'),(90,'TAIL_CLEAR'),(115,'RING_OPEN'),(180,'REMOVED')]:
 scene.timeline_markers.new(name,frame=frame)
ref=bpy.data.objects.new('Approved-direction image reference',None);scene.collection.objects.link(ref)
ref.empty_display_type='IMAGE';ref.data=bpy.data.images.load(str(ROOT/'research/scroll-keeper-reference-2026-10-19/closed-standard-belt-v1.png'))
ref.empty_display_size=1.2;ref.location=(0,.7,0);ref.rotation_euler=(math.pi/2,0,0);ref.hide_render=True
ref['role']='Visual reference; perspective image is not camera-calibrated geometry'
scene.frame_set(0)
report={'stage':'rig_preparation','bones':len(arm.bones),'bound_meshes':0,'metal_scale_locked':True,
        'controls':list(params),'frames':180,'fps':60,'axes':scene['axes'],
        'art_accepted':False,'rig_complete':False}
(OUT/'rig-preparation.json').write_text(json.dumps(report,indent=2))
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'keeper-rig-preparation.blend'))
print(json.dumps(report))

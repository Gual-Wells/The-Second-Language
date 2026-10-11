"""Inspect actual GLB geometry and PBR from canonical views; keep the source immutable."""
import bpy,json,math,sys,time
from pathlib import Path
from mathutils import Vector

arguments=sys.argv[sys.argv.index('--')+1:]
source,folder=arguments[:2]
brief='--brief' in arguments
root=Path(folder);out=root/'review';out.mkdir(parents=True,exist_ok=True)
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.context.preferences.filepaths.temporary_directory='D:/CodexStorage/tmp/dragon-coin'
bpy.ops.import_scene.gltf(filepath=source)
meshes=[o for o in bpy.context.scene.objects if o.type=='MESH']
points=[o.matrix_world@Vector(v) for o in meshes for v in o.bound_box]
lo=Vector([min(p[i] for p in points) for i in range(3)])
hi=Vector([max(p[i] for p in points) for i in range(3)])
center=(lo+hi)/2;extent=max(hi-lo)
scene=bpy.context.scene;scene.render.engine='CYCLES';scene.cycles.samples=16 if brief else 32
scene.cycles.use_denoising=True
prefs=bpy.context.preferences.addons['cycles'].preferences
prefs.compute_device_type='CUDA';prefs.get_devices()
gpu=[d for d in prefs.devices if d.type=='CUDA']
for d in prefs.devices:d.use=d.type=='CUDA'
scene.cycles.device='GPU' if gpu else 'CPU'
scene.render.resolution_x=scene.render.resolution_y=850 if brief else 1200
scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG';scene.view_settings.view_transform='AgX'
scene.world=bpy.data.worlds.new('Neutral studio');scene.world.use_nodes=True
scene.world.node_tree.nodes['Background'].inputs[0].default_value=(.06,.065,.07,1)
scene.world.node_tree.nodes['Background'].inputs[1].default_value=.28
for name,pos,energy,size,color in [('Large soft key',(-1.5,-2.5,2.2),170,1.7,(1,.95,.88)),('Fill',(1.7,-1.2,.8),65,1.6,(.8,.88,1)),('Rear',(0,1.9,1.6),130,1.5,(.9,.94,1))]:
    bpy.ops.object.light_add(type='AREA',location=center+Vector(pos)*extent)
    obj=bpy.context.object;obj.name=name;obj.data.energy=energy*extent**2
    obj.data.shape='DISK';obj.data.size=size*extent;obj.data.color=color
    obj.rotation_euler=(center-obj.location).to_track_quat('-Z','Y').to_euler()
bpy.ops.object.camera_add();camera=bpy.context.object;camera.data.type='ORTHO'
camera.data.ortho_scale=extent*1.32;scene.camera=camera
report={'source':source,'stage':'rendering','art_accepted':False,'dimensions':list(hi-lo),'vertices':sum(len(o.data.vertices) for o in meshes),'faces':sum(len(o.data.polygons) for o in meshes),'renderer_device':scene.cycles.device,'cuda_devices':[d.name for d in gpu],'views':[],'note':'Canonical axis names; front identified from actual views, never inferred from name.'}
def save():(root/'mesh-review.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
clay=bpy.data.materials.new('Geometry only neutral clay');clay.use_nodes=True
shader=clay.node_tree.nodes.get('Principled BSDF');shader.inputs['Base Color'].default_value=(.4,.4,.4,1)
shader.inputs['Metallic'].default_value=0;shader.inputs['Roughness'].default_value=.7
views=[('minus-y',(0,-3,.1)),('left-quarter',(-1.6,-2.5,.1)),('right-quarter',(1.6,-2.5,.1)),('side',(3,0,.1)),('plus-y',(0,3,.1))]
if brief:views=[views[i] for i in [0,3,4]]
save()
for mode in (['clay'] if brief else ['clay','pbr']):
    scene.view_layers[0].material_override=clay if mode=='clay' else None
    for name,position in views:
        camera.location=center+Vector(position)*extent
        camera.rotation_euler=(center-camera.location).to_track_quat('-Z','Y').to_euler()
        scene.render.filepath=str(out/(mode+'-'+name+'.png'))
        start=time.monotonic()
        try:bpy.ops.render.render(write_still=True)
        except RuntimeError as error:
            if scene.cycles.device!='GPU' or 'CUDA kernel' not in str(error):raise
            report['gpu_render_failure']=str(error)
            scene.cycles.device='CPU';report['renderer_device']='CPU';save()
            bpy.ops.render.render(write_still=True)
        report['views'].append({'file':Path(scene.render.filepath).name,'seconds':round(time.monotonic()-start,2)});save()
scene.view_layers[0].material_override=None;bpy.ops.file.pack_all()
bpy.ops.wm.save_as_mainfile(filepath=str(root/'candidate-master.blend'))
report['stage']='ready_for_art_review';save();print(json.dumps(report),flush=True)

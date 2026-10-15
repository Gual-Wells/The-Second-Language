"""Assemble the real fitted components; render real cameras, not generated view sheets."""
import bpy,sys,json,math
from pathlib import Path
import numpy as np
from mathutils import Vector
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'outputs';VIEWS=OUT/'candidate-views';VIEWS.mkdir(exist_ok=True)
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
items=[('special-blank-notched','Measured blank and strict edge',.36),('fitted-front-and-grips','Dragon relief and continuous grips',.33),('fitted-reverse-foliage','Reference scroll relief',.32),('fitted-reverse-book','Reference book with three bars per page',.28),('reverse-inscribed-plate','Foundation inscription plate',.37),('reverse-cartouche-border','Cartouche frame',.24),('reverse-legend-band','Outer name band',.36),('reverse-circular-borders','Reverse narrow borders',.24),('reverse-book-medallion','Book medallion rim',.24),('reverse-rayed-disc','Rayed book background',.40)]
oxide=bpy.data.materials.new('Localized dark silver patina in real incisions');oxide.use_nodes=True;op=oxide.node_tree.nodes.get('Principled BSDF');op.inputs['Base Color'].default_value=(.026,.023,.020,1);op.inputs['Metallic'].default_value=.35;op.inputs['Roughness'].default_value=.58
for stem,name,rough in items:
    d=np.load(OUT/(stem+'.npz'));me=bpy.data.meshes.new(name);me.from_pydata((d['vertices']*.001).tolist(),[],d['faces'].tolist());me.update();obj=bpy.data.objects.new(name,me);bpy.context.collection.objects.link(obj)
    mat=bpy.data.materials.new(name+' | silver');mat.use_nodes=True;p=mat.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(.67,.64,.60,1);p.inputs['Metallic'].default_value=1;p.inputs['Roughness'].default_value=rough;me.materials.append(mat)
    me.materials.append(oxide)
    for face in me.polygons:
        face.use_smooth=(stem.startswith('fitted'))
        c=face.center*1000;r=math.hypot(c.x,c.z);patina=False
        if stem=='reverse-inscribed-plate':patina=abs(c.y-1.88)<.008 and face.normal.y>.6
        elif stem=='reverse-legend-band':patina=abs(c.y-1.70)<.008 and face.normal.y>.6
        elif stem=='reverse-rayed-disc':patina=abs(c.y-1.635)<.008 and face.normal.y>.6
        elif stem=='special-blank-notched':patina=19.84<r<19.978 and abs(c.y)<1.21
        elif stem=='fitted-reverse-book':
            s=min(abs(c.x)/5.2,1);roof=1.65+.70+.35*math.sin(math.pi*s)**.8
            patina=roof-.14<c.y<roof-.075 and face.normal.y>.45
        if patina:face.material_index=1
    obj['source_component']=stem;obj['source_units']='mm -> metres exactly once';obj['design_parent']='new approved-concept mesh; not a historic model'
sc=bpy.context.scene;sc.unit_settings.system='METRIC';sc.unit_settings.length_unit='MILLIMETERS';sc.render.engine='CYCLES';sc.cycles.device='CPU';sc.cycles.samples=16;sc.cycles.use_denoising=True;sc.render.threads_mode='FIXED';sc.render.threads=4
sc.render.resolution_x=1200;sc.render.resolution_y=1200;sc.render.resolution_percentage=100;sc.render.image_settings.file_format='PNG';sc.view_settings.view_transform='AgX';sc.view_settings.exposure=-7.0
sc.world.use_nodes=True;sc.world.node_tree.nodes['Background'].inputs[0].default_value=(.11,.12,.14,1);sc.world.node_tree.nodes['Background'].inputs[1].default_value=.45
def aim(o,p=(0,0,0)):o.rotation_euler=(Vector(p)-o.location).to_track_quat('-Z','Y').to_euler()
for name,loc,power,size,sizey in [('Large key',(-.045,-.055,.060),16,.07,.045),('Broad rear',(.04,.055,.05),20,.07,.04),('Left return',(-.055,.020,-.010),9,.05,.04)]:
    d=bpy.data.lights.new(name,'AREA');d.energy=power;d.shape='RECTANGLE';d.size=size;d.size_y=sizey;o=bpy.data.objects.new(name,d);bpy.context.collection.objects.link(o);o.location=loc;aim(o)
bpy.ops.object.camera_add();cam=bpy.context.object;cam.data.type='ORTHO';cam.data.ortho_scale=.054;cam.data.clip_start=.0001;sc.camera=cam
clay=bpy.data.materials.new('Untextured shape evidence');clay.use_nodes=True;p=clay.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(.47,.47,.47,1);p.inputs['Metallic'].default_value=0;p.inputs['Roughness'].default_value=.7
views=[('front',(0,-.10,0)),('front-quarter',(.055,-.085,.010)),('right-side',(.11,0,0)),('reverse',(0,.10,0)),('reverse-quarter',(-.055,.085,.010)),('left-side',(-.11,0,0))]
if '--inspect' in sys.argv:
    VIEWS=OUT/'repair-review';VIEWS.mkdir(exist_ok=True)
    views=[views[2],views[3],views[4]];sc.render.resolution_x=700;sc.render.resolution_y=700;sc.cycles.samples=8
cam.location=views[0][1];aim(cam);bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'hostile-dragon-fitted-candidate.blend'),compress=True)
report=[]
for name,pos in views:
    cam.location=pos;aim(cam);sc.view_layers[0].material_override=clay;sc.render.filepath=str(VIEWS/(name+'-clay.png'));bpy.ops.render.render(write_still=True);report.append(name)
    (OUT/'candidate-render-progress.json').write_text(json.dumps(report))
sc.view_layers[0].material_override=None
sc.view_settings.exposure=-6.0
for name,pos in ([] if '--inspect' in sys.argv else [('front-silver',(.022,-.10,.010)),('reverse-silver',(-.022,.10,.010))]):
    cam.location=pos;aim(cam);sc.cycles.samples=32;sc.render.filepath=str(VIEWS/(name+'.png'));bpy.ops.render.render(write_still=True)
sc.view_layers[0].material_override=None;cam.location=(.022,-.10,.01);aim(cam)
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'hostile-dragon-fitted-candidate.blend'),compress=True)
bpy.ops.export_scene.gltf(filepath=str(OUT/'hostile-dragon-fitted-candidate.glb'),export_format='GLB',use_visible=True,export_cameras=False,export_lights=False)
print('FITTED_CANDIDATE_RENDERED')

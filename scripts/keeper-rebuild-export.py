"""DCC export repair: decimate pristine raw geometry, rebake existing PBR.

No AI resampling, no invented geometry, no raster art repaint. Selected-to-active
emission baking transfers the generated albedo and material channels to clean UVs.
"""
from pathlib import Path
import bpy,math,json,time,sys
from mathutils import Vector
ROOT=Path(__file__).resolve().parents[1]
voxel='--voxel' in sys.argv
OUT=ROOT/('.cache/keeper-dcc-voxel' if voxel else '.cache/keeper-dcc-export');OUT.mkdir(exist_ok=True)
start=time.monotonic()
def record(stage,**data):
 result={'stage':stage,'seconds':round(time.monotonic()-start,2),**data}
 (OUT/'progress.json').write_text(json.dumps(result,indent=2));print(json.dumps(result),flush=True)
bpy.ops.wm.open_mainfile(filepath=str(ROOT/'.cache/keeper-pixal-review/keeper-pixal-review.blend'))
scene=bpy.context.scene;scene.cycles.device='CPU';scene.cycles.samples=1
source=next(o for o in scene.objects if o.type=='MESH');source.name='Generated PBR projection source'
bpy.ops.import_scene.gltf(filepath=str(ROOT/'.cache/keeper-pixal-kaggle/output-v3/keeper-pixal/models/keeper-raw-shape_00001_.glb'))
target=next(o for o in bpy.context.selected_objects if o.type=='MESH');target.name='Keeper clean reconstructed surface'
bpy.context.view_layer.objects.active=target
if voxel:
 record('openvdb_surface_repair',voxel_size=.0015)
 remesh=target.modifiers.new('OpenVDB repair of microscopic inverted surface pieces','REMESH')
 remesh.mode='VOXEL';remesh.voxel_size=.0015;remesh.use_smooth_shade=True
 bpy.ops.object.modifier_apply(modifier=remesh.name)
dec=target.modifiers.new('Blender collapse from untouched raw shape','DECIMATE');dec.ratio=400000/len(target.data.polygons)
record('decimating_raw',source_faces=len(target.data.polygons))
bpy.ops.object.modifier_apply(modifier=dec.name)
for p in target.data.polygons:p.use_smooth=True
if target.data.has_custom_normals:target.data.normals_split_custom_set([(0.,0.,0.)]*len(target.data.loops))
record('unwrapping',faces=len(target.data.polygons))
bpy.ops.object.select_all(action='DESELECT');target.select_set(True);bpy.context.view_layer.objects.active=target
bpy.ops.object.mode_set(mode='EDIT');bpy.ops.mesh.select_all(action='SELECT')
bpy.ops.uv.smart_project(angle_limit=math.radians(66),island_margin=.008,area_weight=.3,correct_aspect=True)
bpy.ops.object.mode_set(mode='OBJECT')
target.data.materials.clear();mat=bpy.data.materials.new('Reprojected aged leather and bronze');mat.use_nodes=True;target.data.materials.append(mat)
bsdf=mat.node_tree.nodes.get('Principled BSDF');tex=mat.node_tree.nodes.new('ShaderNodeTexImage')
color=bpy.data.images.new('Keeper Albedo',width=2048,height=2048,alpha=False)
mr=bpy.data.images.new('Keeper ORM',width=2048,height=2048,alpha=False);mr.colorspace_settings.name='Non-Color'
tex.image=color;tex.select=True;mat.node_tree.nodes.active=tex
# Direct source shader inputs eliminate lighting/highlight contamination.
sm=source.data.materials[0];nodes=sm.node_tree.nodes;links=sm.node_tree.links
srcbsdf=next(n for n in nodes if n.type=='BSDF_PRINCIPLED');output=next(n for n in nodes if n.type=='OUTPUT_MATERIAL')
emission=nodes.new('ShaderNodeEmission');links.new(srcbsdf.inputs['Base Color'].links[0].from_socket,emission.inputs['Color'])
links.new(emission.outputs[0],output.inputs['Surface'])
scene.render.bake.use_selected_to_active=True;scene.render.bake.use_cage=False
scene.render.bake.cage_extrusion=.006;scene.render.bake.max_ray_distance=.018;scene.render.bake.margin=16
source.select_set(True);target.select_set(True);bpy.context.view_layer.objects.active=target
record('baking_color');bpy.ops.object.bake(type='EMIT')
pack=nodes.new('ShaderNodeCombineColor');pack.mode='RGB';pack.inputs['Red'].default_value=1
for source_name,channel in [('Roughness','Green'),('Metallic','Blue')]:
 sock=srcbsdf.inputs[source_name]
 if sock.is_linked:links.new(sock.links[0].from_socket,pack.inputs[channel])
 else:pack.inputs[channel].default_value=sock.default_value
links.new(pack.outputs['Color'],emission.inputs['Color']);tex.image=mr
record('baking_material_channels');bpy.ops.object.bake(type='EMIT')
links.new(srcbsdf.outputs[0],output.inputs['Surface'])
albedo_tex=mat.node_tree.nodes.new('ShaderNodeTexImage');albedo_tex.image=color
mat.node_tree.links.new(albedo_tex.outputs['Color'],bsdf.inputs['Base Color'])
mr_tex=mat.node_tree.nodes.new('ShaderNodeTexImage');mr_tex.image=mr
sep=mat.node_tree.nodes.new('ShaderNodeSeparateColor');sep.mode='RGB';mat.node_tree.links.new(mr_tex.outputs['Color'],sep.inputs['Color'])
mat.node_tree.links.new(sep.outputs['Green'],bsdf.inputs['Roughness']);mat.node_tree.links.new(sep.outputs['Blue'],bsdf.inputs['Metallic'])
mat.node_tree.nodes.remove(tex)
for image,name in [(color,'albedo.png'),(mr,'orm.png')]:
 image.filepath_raw=str(OUT/name);image.file_format='PNG';image.save();image.pack()
source.hide_render=True;source.hide_set(True)
scene.view_layers[0].material_override=None;scene.cycles.samples=20
pts=[target.matrix_world@Vector(c) for c in target.bound_box]
lo=Vector([min(p[i] for p in pts) for i in range(3)]);hi=Vector([max(p[i] for p in pts) for i in range(3)]);center=(lo+hi)/2;extent=max(hi-lo)
scene.camera.location=center+Vector((0,-3,.28))*extent;scene.camera.rotation_euler=(center-scene.camera.location).to_track_quat('-Z','Y').to_euler()
scene.render.resolution_x=1200;scene.render.resolution_y=940
record('rendering_clean_export')
scene.render.filepath=str(OUT/'clean-pbr.png');bpy.ops.render.render(write_still=True)
neutral=bpy.data.materials.new('Clean clay');neutral.use_nodes=True;neutral.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value=(.38,.37,.35,1)
neutral.node_tree.nodes['Principled BSDF'].inputs['Roughness'].default_value=.7
scene.view_layers[0].material_override=neutral;scene.render.filepath=str(OUT/'clean-clay.png');bpy.ops.render.render(write_still=True)
scene.view_layers[0].material_override=None
bpy.ops.object.select_all(action='DESELECT');target.select_set(True);bpy.context.view_layer.objects.active=target
bpy.ops.export_scene.gltf(filepath=str(OUT/'keeper-clean.glb'),export_format='GLB',use_selection=True,export_cameras=False,export_lights=False)
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'keeper-clean-master.blend'))
record('complete',faces=len(target.data.polygons),vertices=len(target.data.vertices),art_accepted=False,rigged=False)

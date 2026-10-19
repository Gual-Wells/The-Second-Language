"""Compare raw generation to processed export before any more repair."""
from pathlib import Path
import bpy,json
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'.cache/keeper-pixal-cleanup'
bpy.ops.wm.open_mainfile(filepath=str(ROOT/'.cache/keeper-pixal-review/keeper-pixal-review.blend'))
scene=bpy.context.scene
for o in [o for o in scene.objects if o.type=='MESH']:bpy.data.objects.remove(o,do_unlink=True)
bpy.ops.import_scene.gltf(filepath=str(ROOT/'.cache/keeper-pixal-kaggle/output-v3/keeper-pixal/models/keeper-raw-shape_00001_.glb'))
scene.view_layers[0].material_override=None
mat=bpy.data.materials.new('Raw neutral');mat.use_nodes=True
mat.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value=(.38,.37,.35,1)
mat.node_tree.nodes['Principled BSDF'].inputs['Roughness'].default_value=.7
for o in [o for o in scene.objects if o.type=='MESH']:
 o.data.materials.clear();o.data.materials.append(mat)
 # Flat normals isolate surface orientation from supplied split normals.
 for p in o.data.polygons:p.use_smooth=False
scene.camera.location=(0,-3,.22);scene.camera.rotation_euler=((__import__('mathutils').Vector((0,0,.05)))-scene.camera.location).to_track_quat('-Z','Y').to_euler()
scene.render.resolution_x=1000;scene.render.resolution_y=800
scene.render.filepath=str(OUT/'raw-flat-clay.png');bpy.ops.render.render(write_still=True)

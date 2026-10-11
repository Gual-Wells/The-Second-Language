"""Preserve exported textures/geometry and render the real editable candidate."""
import bpy
import json
from pathlib import Path
import sys
from mathutils import Vector

ROOT = Path('D:/CodexStorage/workspaces/hostile-dragon-coin/working/resume-2026-10-11')
task_args = sys.argv[sys.argv.index('--')+1:]
if len(task_args) > 1:
    ROOT = Path(task_args[1])
OUT = ROOT / 'review'
OUT.mkdir(exist_ok=True)
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.context.preferences.filepaths.temporary_directory = 'D:/CodexStorage/tmp/dragon-coin'
source = sys.argv[sys.argv.index('--')+1]
bpy.ops.import_scene.gltf(filepath=source)
meshes = [o for o in bpy.context.scene.objects if o.type == 'MESH']
points = [o.matrix_world @ Vector(v) for o in meshes for v in o.bound_box]
lo = Vector([min(p[i] for p in points) for i in range(3)])
hi = Vector([max(p[i] for p in points) for i in range(3)])
center = (lo+hi)/2
scene = bpy.context.scene
scene.render.engine = 'CYCLES'
scene.cycles.samples = 24
scene.cycles.use_denoising = True
scene.render.resolution_x = scene.render.resolution_y = 1000
scene.render.resolution_percentage = 100
scene.world = bpy.data.worlds.new('Neutral review studio')
scene.world.use_nodes = True
scene.world.node_tree.nodes['Background'].inputs[0].default_value = (.06,.065,.07,1)
scene.world.node_tree.nodes['Background'].inputs[1].default_value = .35
scene.view_settings.view_transform = 'AgX'
scene.render.image_settings.file_format = 'PNG'
for name, pos, energy, size, colour in [
    ('Soft key', (-1.5,-2.5,2.2), 170, 1.7, (1,.9,.78)),
    ('Cool fill', (1.7,-1.2,.8), 65, 1.6, (.75,.85,1)),
    ('Reverse rim', (-.8,1.9,1.6), 130, 1.5, (.9,.94,1))]:
    bpy.ops.object.light_add(type='AREA', location=center+Vector(pos))
    lamp = bpy.context.object
    lamp.name = name
    lamp.data.energy = energy
    lamp.data.shape = 'DISK'
    lamp.data.size = size
    lamp.data.color = colour
    lamp.rotation_euler = (center-lamp.location).to_track_quat('-Z','Y').to_euler()
bpy.ops.object.camera_add()
camera = bpy.context.object
camera.data.type = 'ORTHO'
camera.data.ortho_scale = max(hi-lo)*1.4
scene.camera = camera
report = {'source': source, 'dimensions': list(hi-lo), 'mesh_objects': len(meshes),
          'vertices': sum(len(o.data.vertices) for o in meshes),
          'faces': sum(len(o.data.polygons) for o in meshes),
          'materials': [m.name for m in bpy.data.materials],
          'note': 'Camera names are canonical axis views; verify artistic front from images.'}
(ROOT/'mesh-report.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
for name, position in [('minus-y', (0,-3,.12)), ('quarter', (1.5,-2.5,.15)),
                        ('side', (3,0,.05)), ('plus-y', (0,3,.12))]:
    camera.location = center+Vector(position)
    camera.rotation_euler = (center-camera.location).to_track_quat('-Z','Y').to_euler()
    scene.render.filepath = str(OUT/f'{name}.png')
    bpy.ops.render.render(write_still=True)
clay = bpy.data.materials.new('Neutral clay geometry review')
clay.use_nodes = True
clay_shader = clay.node_tree.nodes.get('Principled BSDF')
clay_shader.inputs['Base Color'].default_value = (.45,.45,.45,1)
clay_shader.inputs['Metallic'].default_value = 0
clay_shader.inputs['Roughness'].default_value = .72
scene.view_layers[0].material_override = clay
for name, position in [('minus-y', (0,-3,.12)), ('quarter', (1.5,-2.5,.15)),
                        ('side', (3,0,.05)), ('plus-y', (0,3,.12))]:
    camera.location = center+Vector(position)
    camera.rotation_euler = (center-camera.location).to_track_quat('-Z','Y').to_euler()
    scene.render.filepath = str(OUT/f'clay-{name}.png')
    bpy.ops.render.render(write_still=True)
scene.view_layers[0].material_override = None
# Keep images packed; GLB remains the immutable raw candidate alongside this editable master.
bpy.ops.file.pack_all()
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'candidate-master.blend'))
print(json.dumps(report), flush=True)

"""Bake a licensed JangaFX density volume for the fixed-view browser mist.
No fluid simulation, image generation or new cloud shape construction.
Usage: blender --background --factory-startup --python this.py -- source.vdb output.png
"""
import bpy, sys, json, math
from pathlib import Path
from mathutils import Vector

source, output = sys.argv[sys.argv.index('--') + 1:]
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
bpy.ops.object.volume_import(filepath=str(Path(source).resolve()))
volume = bpy.context.object
volume.data.grids.load()
bpy.context.view_layer.update()
corners = [volume.matrix_world @ Vector(corner) for corner in volume.bound_box]
lo = Vector([min(p[i] for p in corners) for i in range(3)])
hi = Vector([max(p[i] for p in corners) for i in range(3)])
size = hi - lo
if max(size) <= 0:
    raise RuntimeError('VDB bounds unavailable')
factor = 4.0 / max(size)
volume.scale = (factor,) * 3
volume.location = -(lo + hi) * .5 * factor
bpy.context.view_layer.update()

material = bpy.data.materials.new('JangaFX density, soft neutral scattering')
material.use_nodes = True
nodes = material.node_tree.nodes
nodes.clear()
attribute = nodes.new('ShaderNodeAttribute')
attribute.attribute_name = 'density'
multiply = nodes.new('ShaderNodeMath')
multiply.operation = 'MULTIPLY'
multiply.inputs[1].default_value = .22
scatter = nodes.new('ShaderNodeVolumeScatter')
scatter.inputs['Color'].default_value = (.88, .9, .92, 1)
scatter.inputs['Anisotropy'].default_value = .1
out = nodes.new('ShaderNodeOutputMaterial')
material.node_tree.links.new(attribute.outputs['Fac'], multiply.inputs[0])
material.node_tree.links.new(multiply.outputs[0], scatter.inputs['Density'])
material.node_tree.links.new(scatter.outputs[0], out.inputs['Volume'])
volume.data.materials.append(material)

scene = bpy.context.scene
scene.render.engine = 'CYCLES'
scene.cycles.device = 'CPU'
scene.cycles.samples = 24
scene.cycles.use_denoising = True
scene.cycles.volume_bounces = 1
scene.world.color = (.32, .32, .32)
for loc, energy, light_size in [((-3,-4,6), 900, 5), ((4,2,4), 550, 4)]:
    data = bpy.data.lights.new('soft bake light', 'AREA')
    data.energy = energy
    data.shape = 'DISK'
    data.size = light_size
    light = bpy.data.objects.new(data.name, data)
    scene.collection.objects.link(light)
    light.location = loc
    light.rotation_euler = (-light.location).to_track_quat('-Z','Y').to_euler()
camera_data = bpy.data.cameras.new('orthographic density reference')
camera_data.type = 'ORTHO'
camera_data.ortho_scale = 4.5
camera = bpy.data.objects.new('camera', camera_data)
scene.collection.objects.link(camera)
camera.location = (0, -8, .8)
camera.rotation_euler = (-camera.location).to_track_quat('-Z','Y').to_euler()
scene.camera = camera
scene.render.resolution_x = 512
scene.render.resolution_y = 512
scene.render.resolution_percentage = 100
scene.render.film_transparent = True
scene.view_settings.view_transform = 'Standard'
scene.render.image_settings.file_format = 'PNG'
scene.render.image_settings.color_mode = 'RGBA'
scene.render.filepath = str(Path(output).resolve())
print(json.dumps({'source':source,'bounds':list(size),'gridNames':[grid.name for grid in volume.data.grids],'output':output}), flush=True)
bpy.ops.render.render(write_still=True)

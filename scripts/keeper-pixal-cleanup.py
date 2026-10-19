"""Repair import shading on a copy, preserving positions and loop UVs."""
from pathlib import Path
import bpy,bmesh,json,math
from mathutils import Vector
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'.cache/keeper-pixal-cleanup';OUT.mkdir(exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=str(ROOT/'.cache/keeper-pixal-review/keeper-pixal-review.blend'))
scene=bpy.context.scene;scene.render.resolution_x=1200;scene.render.resolution_y=940
report={'stage':'shading_diagnosis','operations':[],'geometry_smoothing':False,'art_accepted':False}
for obj in [o for o in scene.objects if o.type=='MESH']:
 mesh=obj.data;before={'vertices':len(mesh.vertices),'faces':len(mesh.polygons),'custom_normals':mesh.has_custom_normals}
 bm=bmesh.new();bm.from_mesh(mesh)
 bmesh.ops.remove_doubles(bm,verts=list(bm.verts),dist=1e-6)
 bmesh.ops.recalc_face_normals(bm,faces=list(bm.faces))
 bm.to_mesh(mesh);bm.free()
 for poly in mesh.polygons:poly.use_smooth=True
 mesh.normals_split_custom_set([(0.,0.,0.)]*len(mesh.loops));mesh.set_sharp_from_angle(angle=math.radians(55));mesh.update()
 report['operations'].append({'before':before,'after':{'vertices':len(mesh.vertices),'faces':len(mesh.polygons)},'weld_distance':1e-6,'normals':'recalculated outward plus zero custom normals; crease55'})
pts=[o.matrix_world@Vector(c) for o in scene.objects if o.type=='MESH' for c in o.bound_box]
lo=Vector([min(p[i] for p in pts) for i in range(3)]);hi=Vector([max(p[i] for p in pts) for i in range(3)]);center=(lo+hi)/2;extent=max(hi-lo)
scene.camera.location=center+Vector((0,-3,.28))*extent;scene.camera.rotation_euler=(center-scene.camera.location).to_track_quat('-Z','Y').to_euler()
neutral=bpy.data.materials.new('Cleanup neutral clay');neutral.diffuse_color=(.38,.37,.35,1);neutral.use_nodes=True
neutral.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value=(.38,.37,.35,1)
neutral.node_tree.nodes['Principled BSDF'].inputs['Roughness'].default_value=.7
for name,clay in [('normals-clay',True),('normals-pbr',False)]:
 scene.view_layers[0].material_override=neutral if clay else None
 scene.render.filepath=str(OUT/(name+'.png'));bpy.ops.render.render(write_still=True)
scene.view_layers[0].material_override=None
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'keeper-normals-repaired.blend'))
bpy.ops.export_scene.gltf(filepath=str(OUT/'keeper-normals-repaired.glb'),export_format='GLB',use_selection=False)
(OUT/'cleanup.json').write_text(json.dumps(report,indent=2));print(json.dumps(report))

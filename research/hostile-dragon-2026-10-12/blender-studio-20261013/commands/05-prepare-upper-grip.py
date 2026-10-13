import bpy,bmesh,numpy as np,json,hashlib
from pathlib import Path
from mathutils import Vector
ROOT=Path('D:/CodexStorage/workspaces/hostile-dragon-coin/studio-20261013')
obj=bpy.data.objects['geometry_0'];mesh=obj.data
source=np.load(ROOT/'outputs/source-geometry.npz')['vertices']
raw=np.empty(len(mesh.vertices)*3,dtype=np.float32);mesh.vertices.foreach_get('co',raw);raw=raw.reshape(-1,3)
if not np.array_equal(raw,source):raise RuntimeError('Start from studio-base before preparing selection')
x,y,z=raw.T
# Source-render landmarks trace the two visible gripping fingers as a whole hand.
# The polygon is a selection aid inside the full coin; depth distinguishes neck below.
outline=np.array([(218,350),(213,371),(240,420),(273,438),(295,450),(329,485),(350,482),(350,443),(327,414),(307,397),(320,376),(356,417),(393,452),(423,448),(413,395),(400,350),(375,308),(356,264),(310,251),(265,273),(250,315),(227,315)],dtype=float)
px=x*1000+625;py=625-z*1000
inside=np.zeros(len(raw),dtype=bool)
for a,b in zip(outline,np.roll(outline,-1,axis=0)):
 crossing=((a[1]>py)!=(b[1]>py))&(px<(b[0]-a[0])*(py-a[1])/(b[1]-a[1]+1e-12)+a[0])
 inside^=crossing
allowed=inside&(y<-.047)
fade=np.clip((-.039-y)/.018,0,1);fade=fade*fade*(3-2*fade)
weights=inside.astype(np.float32)*fade.astype(np.float32)
if mesh.attributes.get('source_point_id'):raise RuntimeError('Already prepared; restore parent for repeat')
ids=mesh.attributes.new(name='source_point_id',type='INT',domain='POINT');ids.data.foreach_set('value',np.arange(len(raw),dtype=np.int32))
mask=mesh.attributes.new(name='.sculpt_mask',type='FLOAT',domain='POINT');mask.data.foreach_set('value',1-weights)
bm=bmesh.new();bm.from_mesh(mesh)
verts=[v for v in bm.verts if allowed[v.index]]
before=len(bm.verts)
bmesh.ops.remove_doubles(bm,verts=verts,dist=1e-8)
bm.to_mesh(mesh);bm.free();mesh.update()
current=np.empty(len(mesh.vertices)*3,dtype=np.float32);mesh.vertices.foreach_get('co',current);current=current.reshape(-1,3)
old_ids=np.empty(len(mesh.vertices),dtype=np.int32);mesh.attributes['source_point_id'].data.foreach_get('value',old_ids)
protected=~allowed[old_ids]
if not np.array_equal(current[protected],source[old_ids[protected]]):raise RuntimeError('Local seam preparation changed protected geometry')
np.savez_compressed(ROOT/'outputs/prepared-grip.npz',vertices=current,source_ids=old_ids,protected=protected)
obj.use_mesh_mirror_x=False;obj.use_mesh_mirror_y=False;obj.use_mesh_mirror_z=False
bpy.context.view_layer.objects.active=obj
bpy.ops.object.select_all(action='DESELECT');obj.select_set(True)
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'outputs/studio-upper-grip-prepared.blend'))
scene=bpy.context.scene;cam=scene.camera
cam.location=(0,-3,.1);cam.rotation_euler=(-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.type='ORTHO';cam.data.ortho_scale=1.25
scene.render.filepath=str(ROOT/'outputs/studio-before-front.png');bpy.ops.render.render(write_still=True)
# Colored selection is an internal view; not a new artistic candidate.
base=bpy.data.materials.new('Diagnostic retained original');base.diffuse_color=(.60,.60,.60,1)
selection=bpy.data.materials.new('Diagnostic visible upper grip selection');selection.diffuse_color=(.07,.32,.70,1)
old_materials=list(mesh.materials);old_indices=np.array([p.material_index for p in mesh.polygons])
mesh.materials.clear();mesh.materials.append(base);mesh.materials.append(selection)
mv=np.empty(len(mesh.vertices),dtype=np.float32);mesh.attributes['.sculpt_mask'].data.foreach_get('value',mv)
for p in mesh.polygons:p.material_index=int(min(mv[i] for i in p.vertices)<.5)
scene.display.shading.color_type='MATERIAL';scene.render.filepath=str(ROOT/'outputs/upper-grip-selection.png');bpy.ops.render.render(write_still=True)
mesh.materials.clear()
for m in old_materials:mesh.materials.append(m)
for p,i in zip(mesh.polygons,old_indices):p.material_index=int(i)
scene.display.shading.color_type='SINGLE'
asset=Path(bpy.utils.system_resource('DATAFILES'))/'assets/brushes/essentials_brushes-mesh_sculpt.blend'
with bpy.data.libraries.load(str(asset),link=False) as (a,b):brush_names=list(a.brushes)
result={'local_duplicate_vertices_welded':before-len(mesh.vertices),'protected_geometry_unchanged_exact':True,'selection_vertices':int((mv<.5).sum()),'scope':'Conservative visible finger/knuckle surfaces; hidden palm and coin break not yet assigned final semantic ownership','native_sculpt_brushes':brush_names,'views':['studio-before-front.png','upper-grip-selection.png']}
(ROOT/'outputs/grip-preparation.json').write_text(json.dumps(result,indent=2),encoding='utf-8')

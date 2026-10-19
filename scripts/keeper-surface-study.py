"""Isolate imported normals from geometry/material defects on an immutable asset copy."""
from pathlib import Path
import bpy,bmesh,json,math,sys,time,hashlib
import numpy as np
from mathutils import Vector

ROOT=Path(__file__).resolve().parents[1]
WORK=ROOT/'.cache/keeper-revision';WORK.mkdir(parents=True,exist_ok=True)
SOURCE=ROOT/'web/labs/keeper-asset-study/assets/keeper-source.glb'
EVIDENCE=ROOT/'research/scroll-keeper-revision';EVIDENCE.mkdir(exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=str(ROOT/'.cache/scroll-keeper-kaggle/asset-review/candidate-master.blend'))
scene=bpy.context.scene
scene.cycles.samples=20
scene.render.resolution_x=scene.render.resolution_y=1000
meshes=[o for o in scene.objects if o.type=='MESH']
assert len(meshes)==1
obj=meshes[0];mesh=obj.data
points=[obj.matrix_world@Vector(v) for v in obj.bound_box]
lo=Vector([min(p[i] for p in points) for i in range(3)]);hi=Vector([max(p[i] for p in points) for i in range(3)])
center=(lo+hi)/2;extent=max(hi-lo)
report={'source_sha256':hashlib.sha256(SOURCE.read_bytes()).hexdigest(),'art_accepted':False,'stage':'diagnosing','before':{'vertices':len(mesh.vertices),'faces':len(mesh.polygons),'custom_normals':mesh.has_custom_normals,'smooth_faces':sum(p.use_smooth for p in mesh.polygons)},'renders':[]}
uv=np.empty((len(mesh.loops),2),dtype=np.float32);mesh.uv_layers.active.data.foreach_get('uv',uv.ravel())
loops=np.empty((len(mesh.polygons),3),dtype=np.int32)
for p in mesh.polygons:loops[p.index]=p.loop_indices
mr=next(i for i in bpy.data.images if i.size[0]>1000 and i.colorspace_settings.name=='Non-Color')
pixels=np.empty(mr.size[0]*mr.size[1]*4,dtype=np.float32);mr.pixels.foreach_get(pixels);pixels=pixels.reshape(mr.size[1],mr.size[0],4)
sample=np.mean(uv[loops],axis=1);x=np.clip((sample[:,0]*mr.size[0]).astype(int),0,mr.size[0]-1);y=np.clip((sample[:,1]*mr.size[1]).astype(int),0,mr.size[1]-1)
metal=pixels[y,x,2];rough=pixels[y,x,1]
report['material_samples']={'metal_quantiles':np.quantile(metal,[0,.1,.5,.9,1]).tolist(),'rough_quantiles':np.quantile(rough,[0,.1,.5,.9,1]).tolist(),'metal_faces_above_half':int((metal>.5).sum())}

def save(): (EVIDENCE/'surface-study.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
def render(name,position,clay=False):
 scene.view_layers[0].material_override=bpy.data.materials.get('Geometry only neutral clay') if clay else None
 scene.camera.location=center+Vector(position)*extent
 scene.camera.rotation_euler=(center-scene.camera.location).to_track_quat('-Z','Y').to_euler()
 scene.render.filepath=str(EVIDENCE/(name+'.png'));bpy.ops.render.render(write_still=True)
 report['renders'].append(name+'.png');save()

save();render('original-back',(0,3,.1));render('original-quarter',(-1.6,-2.5,.1))
# Merge only coincident UV split vertices. Keep loop UVs and all vertex positions.
bm=bmesh.new();bm.from_mesh(mesh);bmesh.ops.remove_doubles(bm,verts=list(bm.verts),dist=1e-6);bm.to_mesh(mesh);bm.free()
for p in mesh.polygons:p.use_smooth=True
mesh.set_sharp_from_angle(angle=math.radians(55))
mesh.normals_split_custom_set([(0.,0.,0.)]*len(mesh.loops));mesh.update()
report['after']={'vertices':len(mesh.vertices),'faces':len(mesh.polygons),'operation':'coincident-vertex weld 1e-6 + automatic normals, sharp edges 55 degrees; no coordinate smoothing, texture edits or remesh'}
render('recalculated-back',(0,3,.1));render('recalculated-quarter',(-1.6,-2.5,.1));render('recalculated-clay-side',(3,0,.1),True)
scene.view_layers[0].material_override=None
bpy.ops.wm.save_as_mainfile(filepath=str(WORK/'normals-study.blend'))
report['stage']='comparison_ready';save();print(json.dumps(report),flush=True)

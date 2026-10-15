"""Close reconstruction voids in the existing grip undersides, preserving obverse sculpture.

Uses Manifold's morphological closing, not a newly invented claw design.
Only rear contact geometry of the same full-concept mesh may change.
"""
from pathlib import Path
import manifold3d as m,numpy as np,json,time,trimesh
from scipy.ndimage import distance_transform_edt,gaussian_filter
from skimage.measure import marching_cubes
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'outputs';start=time.monotonic()
d=np.load(OUT/'fitted-front-and-grips.npz');v=d['vertices'];f=d['faces']
original=m.Manifold(m.Mesh(np.ascontiguousarray(v,dtype=np.float32),np.ascontiguousarray(f,dtype=np.uint32)))
def box(x0,x1,y0,y1,z0,z1):return m.Manifold.cube([x1-x0,y1-y0,z1-z0]).translate([x0,y0,z0])
rearbox=box(-28,28,-2.5,12,-28,28)
rear=(original^rearbox).simplify(.035)
print(json.dumps({'stage':'repair_existing_rear_contacts','triangles':rear.num_tri()}),flush=True)
mesh=rear.to_mesh();tm=trimesh.Trimesh(np.array(mesh.vert_properties[:,:3]),np.array(mesh.tri_verts),process=False)
pitch=.10;radius=2.25;pad=29
vox=tm.voxelized(pitch).fill();occupied=np.pad(vox.matrix,pad)
dilated=distance_transform_edt(~occupied)*pitch<=radius
filled=distance_transform_edt(dilated)*pitch>radius
field=gaussian_filter(filled.astype(np.float32),.65)
vv,ff,_,_=marching_cubes(field,level=.5,spacing=(pitch,pitch,pitch),allow_degenerate=False)
vv+=vox.transform[:3,3]-pad*pitch
tm=trimesh.Trimesh(vv,ff,process=True);trimesh.repair.fix_normals(tm,multibody=True)
closed=m.Manifold(m.Mesh(np.ascontiguousarray(tm.vertices,dtype=np.float32),np.ascontiguousarray(tm.faces,dtype=np.uint32))).simplify(.02)
assert closed.status()==m.Error.NoError
print(json.dumps({'stage':'closing_done','triangles':closed.num_tri(),'seconds':time.monotonic()-start}),flush=True)
# Retain the exact visible negative-Y front. Repair works behind the mid-body plane only.
result=(original^box(-28,28,-24,-1.4,-28,28))+(closed^box(-28,28,-1.45,12,-28,28))
assert result.status()==m.Error.NoError
mesh=result.to_mesh();vv=np.array(mesh.vert_properties[:,:3]);ff=np.array(mesh.tri_verts)
np.savez_compressed(OUT/'fitted-front-and-grips.npz',vertices=vv,faces=ff)
(OUT/'grip-repair.json').write_text(json.dumps({'method':'Euclidean-distance volumetric closing of existing full-concept grip core/rear contacts; Lewiner marching cubes','radius_mm':radius,'voxel_mm':pitch,'field_smoothing_voxels':.65,'input_simplification_bound_mm':.035,'changes_restricted_to_y_greater_than_mm':-1.45,'visible_obverse_relief_y_less_than_mm':-1.45,'new_claw_model_used':False,'added_volume_mm3':result.volume()-original.volume(),'seconds':time.monotonic()-start,'sources':['https://docs.scipy.org/doc/scipy/reference/generated/scipy.ndimage.binary_closing.html','https://scikit-image.org/docs/stable/api/skimage.measure.html#skimage.measure.marching_cubes']},indent=2))
print('REAR_CONTACT_CLOSING_SAVED',flush=True)

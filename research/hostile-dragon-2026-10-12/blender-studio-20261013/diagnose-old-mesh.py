from pathlib import Path
import numpy as np,trimesh,json
from scipy.sparse import coo_matrix
from scipy.sparse.csgraph import connected_components
root=Path(__file__).resolve().parent
d=np.load(root/'outputs/source-geometry.npz');v=d['vertices'];f=d['faces']
mesh=trimesh.Trimesh(vertices=v,faces=f,process=False)
adj=mesh.face_adjacency
graph=coo_matrix((np.ones(len(adj),dtype=np.uint8),(adj[:,0],adj[:,1])),shape=(len(f),len(f))).tocsr()
count,labels=connected_components(graph,directed=False)
sizes=np.bincount(labels)
tri=v[f];centers=tri.mean(axis=1)
zone=(centers[:,0]<-.18)&(centers[:,0]>-.44)&(centers[:,2]>.11)&(centers[:,2]<.385)
area=np.linalg.norm(np.cross(tri[:,1]-tri[:,0],tri[:,2]-tri[:,0]),axis=1)/2
edge_counts=np.bincount(mesh.edges_unique_inverse)
report={'vertices':len(v),'triangles':len(f),'exact_edge_connected_face_components':int(count),'largest_components_faces':sorted(sizes.tolist(),reverse=True)[:12],'boundary_edges':int((edge_counts==1).sum()),'nonmanifold_edges_more_than_two_faces':int((edge_counts>2).sum()),'degenerate_triangles_area_below_1e-12':int((area<1e-12).sum()),'left_upper_spatial_zone_faces':int(zone.sum()),'left_upper_zone_components':int(len(np.unique(labels[zone]))),'is_watertight':bool(mesh.is_watertight),'diagnostic_only_original_not_processed':True,'semantic_identity':'Connectivity labels are NOT claw/rim/body labels; depth and visible source shape must be used before editing.'}
np.savez_compressed(root/'outputs/diagnostic-face-labels.npz',labels=labels)
(root/'outputs/mesh-diagnostics.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print(json.dumps(report))

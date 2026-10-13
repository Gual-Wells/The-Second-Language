import numpy as np,trimesh,json
from pathlib import Path
from scipy.sparse import coo_matrix
from scipy.sparse.csgraph import connected_components
root=Path(__file__).resolve().parent
d=np.load(root/'outputs/source-geometry.npz');v=d['vertices'];f=d['faces']
unique,inverse=np.unique(v,axis=0,return_inverse=True)
faces=inverse[f]
valid=(faces[:,0]!=faces[:,1])&(faces[:,1]!=faces[:,2])&(faces[:,0]!=faces[:,2])
mesh=trimesh.Trimesh(vertices=unique,faces=faces[valid],process=False)
adj=mesh.face_adjacency;graph=coo_matrix((np.ones(len(adj),np.uint8),(adj[:,0],adj[:,1])),shape=(len(mesh.faces),len(mesh.faces))).tocsr()
count,labels=connected_components(graph,directed=False);sizes=np.bincount(labels)
edges=np.bincount(mesh.edges_unique_inverse)
report={'original_vertices':len(v),'exact_unique_positions':len(unique),'coincident_duplicate_vertices':len(v)-len(unique),'components_after_exact_coordinate_equivalence':int(count),'largest_component_faces':sorted(sizes.tolist(),reverse=True)[:8],'boundary_edges_after_equivalence':int((edges==1).sum()),'nonmanifold_edges_after_equivalence':int((edges>2).sum()),'is_watertight_after_equivalence':bool(mesh.is_watertight),'input_coordinate_positions_changed':False,'original_file_changed':False,'interpretation':'An analysis-only equivalence graph; original-index disconnection can include export seams, not necessarily physically separated objects.'}
np.savez_compressed(root/'outputs/exact-coordinate-equivalence.npz',unique_vertices=unique,inverse=inverse,faces=faces)
(root/'outputs/coincident-seam-diagnostics.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print(json.dumps(report))

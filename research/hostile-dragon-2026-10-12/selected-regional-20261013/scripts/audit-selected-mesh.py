from pathlib import Path
import numpy as np,json,trimesh
ROOT=Path(__file__).resolve().parent
p=Path('D:/CodexStorage/workspaces/hostile-dragon-coin/kaggle-test/regional-rebuild-20261013/remote/dragon-regional-rebuild/regional-candidate.npz')
d=np.load(p);v=d['vertices'];f=d['faces']
uv,inverse=np.unique(v,axis=0,return_inverse=True)
uf=np.sort(inverse[f],axis=1);unique_faces,counts=np.unique(uf,axis=0,return_counts=True)
mesh=trimesh.Trimesh(v,f,process=False)
result={'vertices':len(v),'faces':len(f),'unique_vertex_coordinates':len(uv),'duplicate_faces_same_coordinates':int((counts-1).sum()),'face_normals_nan':int(np.isnan(mesh.face_normals).any(1).sum()),'face_area_tiny':int((mesh.area_faces<1e-12).sum()),'watertight':mesh.is_watertight,'bounds':mesh.bounds.tolist()}
(ROOT/'outputs/regional-ai/mesh-audit.json').write_text(json.dumps(result,indent=2));print(json.dumps(result))

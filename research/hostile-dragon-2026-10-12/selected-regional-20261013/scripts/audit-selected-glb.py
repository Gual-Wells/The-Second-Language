from pathlib import Path
import trimesh,numpy as np,json,hashlib
ROOT=Path(__file__).resolve().parent
OUT=ROOT/'outputs/user-selected-regional/deliverable'
scene=trimesh.load_scene(OUT/'hostile-dragon-selected-working.glb',process=False)
parts=[]
for name,mesh in scene.geometry.items():
 valid=bool(np.isfinite(mesh.vertices).all() and mesh.faces.min()>=0 and mesh.faces.max()<len(mesh.vertices))
 if not valid:raise RuntimeError('Invalid GLB primitive: '+name)
 parts.append({'name':name,'vertices':len(mesh.vertices),'faces':len(mesh.faces),'finite_vertices_and_valid_indices':valid})
old=ROOT/'assets/old-mother-read-copy.blend'
assert hashlib.sha256(old.read_bytes()).hexdigest()=='29d468975ebb83d3295f88318c3fcc505c6e73624566455c6aeded65f58b6303'
result={'glb_read_success':True,'geometry_parts':parts,'unchanged_old_file_sha256_verified':True,'glb_sha256':hashlib.sha256((OUT/'hostile-dragon-selected-working.glb').read_bytes()).hexdigest()}
(OUT/'glb-check.json').write_text(json.dumps(result,indent=2));print(json.dumps(result))

"""Measure a reconstructed asset's real connectivity and material boundaries.

Diagnostics only: a texture threshold is not a semantic segmentation or rig.
Run in Blender after importing a generated GLB; never alter the source.
"""
from pathlib import Path
import bpy,sys,json,hashlib,numpy as np
ROOT=Path(__file__).resolve().parents[1]
args=sys.argv[sys.argv.index('--')+1:];source=Path(args[0]).resolve()
out=ROOT/'.cache/keeper-parts';out.mkdir(exist_ok=True)
bpy.ops.wm.read_factory_settings(use_empty=True);bpy.ops.import_scene.gltf(filepath=str(source))
report={'source_sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'objects':[], 'part_separation_verified':False}
for obj in [o for o in bpy.context.scene.objects if o.type=='MESH']:
 mesh=obj.data;n=len(mesh.vertices);parent=np.arange(n,dtype=np.int32)
 def root(a):
  while parent[a]!=a:parent[a]=parent[parent[a]];a=int(parent[a])
  return a
 for edge in mesh.edges:
  a,b=map(root,edge.vertices)
  if a!=b:parent[b]=a
 labels=np.array([root(i) for i in range(n)]);unique,counts=np.unique(labels,return_counts=True)
 order=np.argsort(counts)[::-1]
 parts=[]
 for idx in order[:25]:
  vertex_ids=np.flatnonzero(labels==unique[idx]);coords=np.array([mesh.vertices[int(i)].co[:] for i in vertex_ids])
  parts.append({'vertices':int(counts[idx]),'min':coords.min(axis=0).tolist(),'max':coords.max(axis=0).tolist()})
 mats=[]
 for mat in mesh.materials:
  if not mat:continue
  data={'name':mat.name,'images':[]}
  if mat.use_nodes:
   for node in mat.node_tree.nodes:
    if node.type=='TEX_IMAGE' and node.image:
     img=node.image;data['images'].append({'name':img.name,'size':list(img.size),'colorspace':img.colorspace_settings.name})
  mats.append(data)
 report['objects'].append({'name':obj.name,'vertices':n,'faces':len(mesh.polygons),
                            'connected_components':len(unique),'largest_components':parts,'materials':mats})
(out/'diagnosis.json').write_text(json.dumps(report,indent=2));print(json.dumps(report))

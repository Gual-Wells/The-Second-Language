from pathlib import Path
import json,numpy as np
from mathutils.bvhtree import BVHTree
root=Path(__file__).resolve().parents[1]
poses=json.loads((root/'.cache/keeper-v17/contact-poses.json').read_text())
paper=poses[0]['paperMesh'];pv=np.array(paper['vertices']).reshape(-1,3);pf=np.array(paper['indices']).reshape(-1,3)
paper_tree=BVHTree.FromPolygons(pv.tolist(),pf.tolist(),all_triangles=True)
report=[]
for pose in poses:
 trees={};vertices={};triangles={};clearances=[]
 for mesh in pose['meshes']:
  v=np.array(mesh['vertices']).reshape(-1,3);tris=np.array(mesh['indices']).reshape(-1,3).tolist()
  if mesh['leather'] or mesh['name'].startswith(('Frame','Prong')):
   name='leather' if mesh['leather'] else mesh['name'];trees[name]=BVHTree.FromPolygons(v.tolist(),tris,all_triangles=True);vertices[name]=v;triangles[name]=np.array(tris)
  within=v[np.abs(v[:,0])<=pose['paperHalfWidth']]
  if len(within):clearances.append(float((np.hypot(within[:,1]-pose['paperCenterY'],within[:,2]-pose['paperCenterZ'])-pose['paperRadius']).min()))
 contact={};locations={};paper_contacts={name:len(t.overlap(paper_tree)) for name,t in trees.items()}
 for name,t in trees.items():
  if name=='leather':continue
  pairs=t.overlap(trees['leather']);contact[name]=len(pairs)
  if pairs:
   points=vertices['leather'][triangles['leather'][[b for a,b in pairs]]].mean(axis=1)
   locations[name]={'min':points.min(axis=0).tolist(),'max':points.max(axis=0).tolist()}
 report.append({'progress':pose['progress'],'cylinderEstimateOnly':min(clearances) if clearances else None,'actualClosedPaperTriangleIntersections':paper_contacts,'metalLeatherTriangleIntersections':contact,'collisionBounds':locations})
out=root/'research/scroll-keeper-unfastening-2026-10-20/contact-check.json';out.write_text(json.dumps(report,indent=2));print(json.dumps(report))
assert all(not any(x['metalLeatherTriangleIntersections'].values()) for x in report),'Metal intersects leather in a sampled pose'
assert all(not any(x['actualClosedPaperTriangleIntersections'].values()) for x in report),'Keeper intersects the actual displaced closed-paper mesh'

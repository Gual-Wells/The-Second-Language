import bpy,sys,json
import numpy as np
from pathlib import Path
source,target=sys.argv[sys.argv.index('--')+1:]
bpy.ops.wm.read_factory_settings(use_empty=True);bpy.ops.import_scene.gltf(filepath=source)
rows=[]
for obj in bpy.context.scene.objects:
    if obj.type!='MESH':continue
    coords=np.empty(len(obj.data.vertices)*3,dtype=np.float32);obj.data.vertices.foreach_get('co',coords)
    coords=coords.reshape(-1,3);matrix=np.array(obj.matrix_world)
    coords=(coords@matrix[:3,:3].T)+matrix[:3,3]
    row={'name':obj.name,'min':coords.min(0).tolist(),'max':coords.max(0).tolist(),'quantiles':np.quantile(coords,[.1,.25,.5,.75,.9],axis=0).tolist()}
    row['front_eye_region']={'count':int(((coords[:,0]>.1)&(coords[:,0]<.24)&(coords[:,2]>.02)&(coords[:,2]<.16)&(coords[:,1]<0)).sum())}
    rows.append(row)
Path(target).write_text(json.dumps(rows,indent=2));print(json.dumps(rows))

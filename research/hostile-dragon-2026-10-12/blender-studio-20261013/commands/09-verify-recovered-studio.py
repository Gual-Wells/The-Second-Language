import bpy,numpy as np,json,hashlib
from pathlib import Path
ROOT=Path('D:/CodexStorage/workspaces/hostile-dragon-coin/studio-20261013')
obj=bpy.data.objects['geometry_0'];a=np.load(ROOT/'outputs/grip-sculpt-trial-b.npz')['vertices'];parent=np.load(ROOT/'outputs/prepared-grip.npz')
coords=np.array([v.co[:] for v in obj.data.vertices],dtype=np.float32)
if not np.array_equal(coords,a):raise RuntimeError('Resume changed trial coordinates')
if not np.array_equal(coords[parent['protected']],parent['vertices'][parent['protected']]):raise RuntimeError('Recovered protected geometry differs')
result={'blender_version':bpy.app.version_string,'scene_file':bpy.data.filepath,'objects':len(bpy.context.scene.objects),'vertices':len(coords),'saved_trial_exact':True,'protected_coordinates_exact':True,'protected_vertices':int(parent['protected'].sum()),'background':bpy.app.background,'temp':bpy.app.tempdir,'bridge_scope':'loopback trusted local client','artistic_acceptance':False}
(ROOT/'outputs/recovered-studio-verification.json').write_text(json.dumps(result,indent=2),encoding='utf-8')

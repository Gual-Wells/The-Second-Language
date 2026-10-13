import bpy,numpy as np,hashlib,json
from pathlib import Path
ROOT=Path('D:/CodexStorage/workspaces/hostile-dragon-coin/studio-20261013')
OUT=ROOT/'outputs/user-selected-regional/deliverable'
obj=bpy.data.objects['User-selected regional candidate — repaired branch'];mesh=obj.data
before=np.array([v.co[:] for v in mesh.vertices],np.float32)
changed=mesh.validate(verbose=True,clean_customdata=False)
after=np.array([v.co[:] for v in mesh.vertices],np.float32)
if not np.array_equal(before,after):raise RuntimeError('Mesh validation changed coordinates; review branch before export')
mesh.update()
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'hostile-dragon-selected-working.blend'))
bpy.ops.export_scene.gltf(filepath=str(OUT/'hostile-dragon-selected-working.glb'),export_format='GLB',use_selection=True,export_apply=True)
p=OUT/'artifact.json';report=json.loads(p.read_text())
glb=OUT/'hostile-dragon-selected-working.glb'
report.update(native_mesh_validation_repaired_indices=changed,coordinate_change=False,glb_bytes=glb.stat().st_size,glb_sha256=hashlib.sha256(glb.read_bytes()).hexdigest())
p.write_text(json.dumps(report,indent=2),encoding='utf-8');result=report

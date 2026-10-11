import bpy,sys,json
from pathlib import Path
from mathutils import Vector
source,output=sys.argv[sys.argv.index('--')+1:]
bpy.ops.wm.read_factory_settings(use_empty=True);bpy.ops.import_scene.gltf(filepath=source)
rows=[];deps=bpy.context.evaluated_depsgraph_get()
for z in [.07,.09,.11,.13,.15]:
    row=[]
    for x in [.05,.075,.10,.125,.15,.175,.20]:
        hit,point,normal,index,obj,matrix=bpy.context.scene.ray_cast(deps,Vector((x,-1,z)),Vector((0,1,0)))
        row.append({'x':x,'z':z,'y':round(point.y,5) if hit else None})
    rows.append(row)
Path(output).write_text(json.dumps(rows,indent=2));print(json.dumps(rows))

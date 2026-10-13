import bpy,json
from mathutils import Vector
from mathutils.bvhtree import BVHTree
obj=bpy.data.objects['geometry_0'];tree=BVHTree.FromObject(obj,bpy.context.evaluated_depsgraph_get())
hits=[]
for x,z in [(-.357,.263),(-.352,.270),(-.291,.318),(-.281,.321),(-.328,.231),(-.32,.225)]:
 h=tree.ray_cast(Vector((x,-1,z)),Vector((0,1,0)))
 v=min(obj.data.vertices,key=lambda v:(v.co-h[0]).length)
 hits.append({'xz':[x,z],'hit':list(h[0]),'normal':list(h[1]),'nearest_mask':obj.data.attributes['.sculpt_mask'].data[v.index].value})
result={'hits':hits,'brush':bpy.context.tool_settings.sculpt.brush.name,'brush_type':bpy.context.tool_settings.sculpt.brush.sculpt_brush_type}

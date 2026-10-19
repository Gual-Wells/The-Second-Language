"""Verify that the new strap rig actually deforms the material, not just a helper rig."""
from pathlib import Path
import bpy,numpy as np,json
root=Path(__file__).resolve().parents[1]
bpy.ops.wm.open_mainfile(filepath=str(root/'.cache/keeper-physical/keeper-physical.blend'))
strap=bpy.data.objects['Leather | continuous strip with two ends'];rig=bpy.data.objects['Keeper functional strap rig']
def positions(obj):
 bpy.context.view_layer.update();ev=obj.evaluated_get(bpy.context.evaluated_depsgraph_get());me=ev.to_mesh();a=np.array([ev.matrix_world@v.co for v in me.vertices]);ev.to_mesh_clear();return a
rest=positions(strap);metal_names=['Frame | separate solid heel-bar buckle','Prong | eye and continuous full shaft'];metal_before=[positions(bpy.data.objects[n]) for n in metal_names]
bone=rig.pose.bones['STRAP_72'];bone.rotation_mode='XYZ';bone.rotation_euler.z=.12
moved=positions(strap);delta=np.linalg.norm(moved-rest,axis=1);changed=np.flatnonzero(delta>1e-7)
material=strap.data.shape_keys.key_blocks['Unwrapped blank | structural inspection'];length=strap['material_length_mm'];tail_s=(72/76-.02)*length
outside=[int(i) for i in changed if material.data[i].co.x*1000+length/2<tail_s]
metal_delta=[float(np.abs(positions(bpy.data.objects[n])-p).max()) for n,p in zip(metal_names,metal_before)]
weights=[sum(g.weight for g in v.groups) for v in strap.data.vertices]
report={'moved_tail_vertices':len(changed),'max_tail_displacement_mm':float(delta.max()*1000),'moved_outside_tail':len(outside),'metal_max_displacement_mm':[x*1000 for x in metal_delta],'weight_sum_range':[min(weights),max(weights)],'complete_unfastening_animation':False}
assert len(changed)>0 and delta.max()>.0001,'Rig has not actually been bound'
assert not outside and max(metal_delta)<1e-9,'Skin binding moves unrelated layers or rigid metal'
assert min(weights)>.999 and max(weights)<1.001,'Unbound or incorrectly normalized strap vertices'
bone.rotation_euler.z=0;bpy.context.view_layer.update()
(root/'research/scroll-keeper-physical-2026-10-19/rig-verification.json').write_text(json.dumps(report,indent=2));print(json.dumps(report))

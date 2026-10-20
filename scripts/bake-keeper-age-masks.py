"""Bake native AO / curvature / exposed-crown masks without editing geometry.

Cycles' mesh-derived masks follow the existing shared metal UV atlas. The
accepted GLB, rig and native source stay immutable. Material layering is in
chapter-scroll-v18/aging.js; this file only makes the spatial masks.
"""
from pathlib import Path
import bpy, json, hashlib
ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'.cache/keeper-v17-native/keeper-physical.blend'
OUT=ROOT/'web/labs/chapter-scroll-v18/assets'
CACHE=ROOT/'.cache/keeper-v18-native'
OUT.mkdir(parents=True,exist_ok=True); CACHE.mkdir(parents=True,exist_ok=True)
assert hashlib.sha256(SOURCE.read_bytes()).hexdigest()=='ba95bb3ebc448759b3984a6bd23b97bcd73040d92348dc89085c9f6ffc6d4831'
bpy.ops.wm.open_mainfile(filepath=str(SOURCE))
scene=bpy.context.scene;scene.render.engine='CYCLES';scene.cycles.device='CPU';scene.cycles.samples=32
hardware=[o for o in scene.objects if o.type=='MESH' and any(m and m.name.startswith('Bronze03') for m in o.data.materials)]
assert hardware
mat=hardware[0].data.materials[0];nodes=mat.node_tree.nodes;links=mat.node_tree.links
surface=nodes.get('Material Output').inputs['Surface']
for link in list(surface.links):links.remove(link)
geo=nodes.new('ShaderNodeNewGeometry')
ao=nodes.new('ShaderNodeAmbientOcclusion');ao.inputs['Distance'].default_value=.0032;ao.samples=32
dot=nodes.new('ShaderNodeVectorMath');dot.operation='DOT_PRODUCT';dot.inputs[1].default_value=(0,-1,0);links.new(geo.outputs['Normal'],dot.inputs[0])
absolute=nodes.new('ShaderNodeMath');absolute.operation='ABSOLUTE';links.new(dot.outputs['Value'],absolute.inputs[0])
pack=nodes.new('ShaderNodeCombineColor');pack.mode='RGB'
links.new(ao.outputs['AO'],pack.inputs[0]);links.new(geo.outputs['Pointiness'],pack.inputs[1]);links.new(absolute.outputs[0],pack.inputs[2])
em=nodes.new('ShaderNodeEmission');links.new(pack.outputs[0],em.inputs[0]);links.new(em.outputs[0],surface)
img=bpy.data.images.new('Aging masks | R visibility G pointiness B crown',width=1024,height=1024,alpha=False)
img.colorspace_settings.name='Non-Color'
target=nodes.new('ShaderNodeTexImage');target.image=img;nodes.active=target
bpy.ops.object.select_all(action='DESELECT')
for o in hardware:o.select_set(True)
bpy.context.view_layer.objects.active=hardware[0]
scene.render.bake.use_selected_to_active=False;scene.render.bake.margin=12
bpy.ops.object.bake(type='EMIT')
img.filepath_raw=str(OUT/'metal-age-masks.png');img.file_format='PNG';img.save();img.pack()
report={'sourceBlendSHA256':hashlib.sha256(SOURCE.read_bytes()).hexdigest(),'method':'Blender Cycles emission bake; AO 3.2mm/32 samples, Geometry Pointiness, exposed normal crown; existing UV atlas','size':[1024,1024],'channels':{'R':'ambient visibility (not a light/shadow decal)','G':'mesh pointiness','B':'absolute normal crown along native front/back axis'},'parts':[o.name for o in hardware],'outputSHA256':hashlib.sha256((OUT/'metal-age-masks.png').read_bytes()).hexdigest(),'geometryChanged':False}
(CACHE/'mask-bake.json').write_text(json.dumps(report,indent=2))
bpy.ops.wm.save_as_mainfile(filepath=str(CACHE/'keeper-material-study.blend'))
print(json.dumps(report))

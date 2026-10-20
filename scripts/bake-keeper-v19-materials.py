"""Multi-pass, editable Blender material finishing. No rig or mesh edits.

Photo scan -> hide variation -> use/contact wear -> age cracks -> hand tooling
-> fibre/metal exposure -> coordinated colour, roughness, metalness and normals.
The spatial maps are baked offline; the browser does not evaluate this graph.
"""
from pathlib import Path
import bpy, json, math, hashlib, time
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'web/labs/chapter-scroll-v19/assets';OUT.mkdir(parents=True,exist_ok=True)
CACHE=ROOT/'.cache/keeper-v19-native';CACHE.mkdir(parents=True,exist_ok=True)
SOURCE=ROOT/'.cache/keeper-v17-native/keeper-physical.blend'
assert hashlib.sha256(SOURCE.read_bytes()).hexdigest()=='ba95bb3ebc448759b3984a6bd23b97bcd73040d92348dc89085c9f6ffc6d4831'
bpy.ops.wm.open_mainfile(filepath=str(SOURCE))
scene=bpy.context.scene;scene.render.engine='CYCLES';scene.cycles.device='CPU';scene.cycles.samples=4
scene.render.bake.use_selected_to_active=False;scene.render.bake.margin=10
scene.render.image_settings.color_depth='8';scene.render.image_settings.compression=30
data=json.loads((ROOT/'web/labs/chapter-scroll-v17/keeper-path.json').read_text());L=data['lengthMm'];H=data['selectedHoleMm'];F=data['foldEndMm']

class Graph:
 def __init__(self,name):
  self.mat=bpy.data.materials.new(name);self.mat.use_nodes=True;self.n=self.mat.node_tree.nodes;self.l=self.mat.node_tree.links;self.n.clear();self.frame=None;self.col=0;self.row=0
  self.bs=self.node('ShaderNodeBsdfPrincipled','Final physical surface');self.out=self.node('ShaderNodeOutputMaterial','Surface output');self.l.new(self.bs.outputs[0],self.out.inputs['Surface'])
 def node(self,kind,label):
  n=self.n.new(kind);n.label=label
  if self.frame:n.parent=self.frame
  n.location=(self.col*240,-self.row*155);self.row+=1
  return n
 def stage(self,label):
  self.frame=self.n.new('NodeFrame');self.frame.label=label;self.frame.name=label;self.frame.location=(self.col*500,0);self.col+=1;self.row=0
 def put(self,socket,value):
  if hasattr(value,'node'):self.l.new(value,socket)
  else:socket.default_value=value
 def m(self,op,*values):
  n=self.node('ShaderNodeMath',op);n.operation=op
  for i,v in enumerate(values):self.put(n.inputs[i],v)
  return n.outputs[0]
 def add(self,*v):
  out=v[0]
  for x in v[1:]:out=self.m('ADD',out,x)
  return out
 def mul(self,*v):
  out=v[0]
  for x in v[1:]:out=self.m('MULTIPLY',out,x)
  return out
 def inv(self,x):return self.m('SUBTRACT',1.,x)
 def clip(self,x):return self.m('MINIMUM',1.,self.m('MAXIMUM',0.,x))
 def gauss(self,x,c,width):
  q=self.m('DIVIDE',self.m('SUBTRACT',x,c),width)
  return self.m('EXPONENT',self.mul(-1.,q,q))
 def smooth(self,a,b,x):
  n=self.node('ShaderNodeMapRange','Smooth mask');n.clamp=True;n.interpolation_type='SMOOTHSTEP';self.put(n.inputs['Value'],x);n.inputs['From Min'].default_value=a;n.inputs['From Max'].default_value=b
  return n.outputs[0]
 def vector(self,*values):
  n=self.node('ShaderNodeCombineXYZ','Material coordinates')
  for i,v in enumerate(values):self.put(n.inputs[i],v)
  return n.outputs[0]
 def noise(self,vec,scale,detail=3.):
  n=self.node('ShaderNodeTexNoise','Multiscale material variation');self.put(n.inputs['Vector'],vec);n.inputs['Scale'].default_value=scale;n.inputs['Detail'].default_value=detail;n.inputs['Roughness'].default_value=.67
  return n.outputs['Fac']
 def mix(self,a,b,fac,kind='MIX'):
  n=self.node('ShaderNodeMixRGB','Layer blend');n.blend_type=kind;self.put(n.inputs[0],fac);self.put(n.inputs[1],a);self.put(n.inputs[2],b);return n.outputs[0]
 def gray(self,x):return self.vector(x,x,x)
 def image(self,path,vector,noncolor=False):
  n=self.node('ShaderNodeTexImage',Path(path).name);n.image=bpy.data.images.load(str(path),check_existing=True);n.image.colorspace_settings.name='Non-Color' if noncolor else 'sRGB';self.put(n.inputs['Vector'],vector);return n.outputs['Color']
 def sep(self,color):
  n=self.node('ShaderNodeSeparateXYZ','Separate coordinates / masks');self.put(n.inputs[0],color);return n.outputs
 def bump(self,height,distance,normal=None):
  n=self.node('ShaderNodeBump','Physical relief; not stains');self.put(n.inputs['Height'],height);n.inputs['Distance'].default_value=distance;n.inputs['Strength'].default_value=1.
  if normal:self.put(n.inputs['Normal'],normal)
  return n.outputs['Normal']
 def finish(self,color,rough,metal,normal):
  self.color=color;self.rough=rough;self.metal=metal;self.normal=normal
  for key,val in [('Base Color',color),('Roughness',rough),('Metallic',metal),('Normal',normal)]:self.put(self.bs.inputs[key],val)

g=Graph('V19 | old vegetable-tanned leather | editable finishing stages')
g.stage('01 Scan foundation; independent broad hide variation')
tex=g.node('ShaderNodeTexCoord','Plane UV / physical dimensions');uv=g.sep(tex.outputs['UV']);s=g.mul(uv[0],L);w=g.add(g.mul(uv[1],18.),-9.);v=g.vector(s,w,0.)
sourceuv=g.vector(g.add(g.m('DIVIDE',s,64.),.19),g.add(g.m('DIVIDE',w,64.),.48),0.)
color=g.image(ROOT/'.cache/keeper-physical/leather-color.jpg',sourceuv)
aged=g.image(ROOT/'research/scroll-lab-v14/leather-albedo-source.png',sourceuv)
# Recover the previous authored material's coherent age instead of asking noise
# to invent an equally convincing hide. Scan channels still supply micrograin.
color=g.mix(color,aged,.82)
roughscan=g.sep(g.image(ROOT/'.cache/keeper-physical/leather-roughness.jpg',sourceuv,True))[0]
nm=g.node('ShaderNodeNormalMap','Original scanned pore normals');nm.inputs['Strength'].default_value=.36;g.put(nm.inputs['Color'],g.image(ROOT/'.cache/keeper-physical/leather-normal.jpg',sourceuv,True))
cloud=g.noise(v,.063);grain=g.noise(v,7.,2.);mid=g.noise(v,.72)
color=g.mix(color,g.gray(g.add(.72,g.mul(.42,cloud))),.32,'MULTIPLY')

g.stage('02 Long handling, compressed frame track, dark burnished edges')
edge=g.smooth(6.8,8.9,g.m('ABSOLUTE',w));tip=g.inv(g.smooth(2.,23.,g.add(L,g.mul(-1.,s))))
fold=g.gauss(s,F-10.,7.);track=g.gauss(s,H-7.,11.)
oil=g.clip(g.mul(g.add(g.mul(.5,edge),g.mul(.4,track),g.mul(.26,tip)),g.add(.35,cloud)))
color=g.mix(color,(.024,.010,.004,1.),g.mul(.43,oil))

g.stage('03 Worn grain coat; irregular exposed tannin fibre, not global grunge')
wear=g.clip(g.mul(g.smooth(.39,.66,mid),g.add(g.mul(.6,edge),g.mul(.44,tip),g.mul(.3,track))))
fiber=g.mix((.098,.038,.010,1.),(.28,.147,.056,1.),cloud)
color=g.mix(color,fiber,g.mul(.72,wear))

g.stage('04 Repeated flex; sparse branching cracks and transverse fold creases')
vor=g.node('ShaderNodeTexVoronoi','Sparse opened grain lines');vor.feature='DISTANCE_TO_EDGE';vor.voronoi_dimensions='2D';g.put(vor.inputs['Vector'],g.vector(g.mul(s,.85),g.mul(w,1.14),0.));vor.inputs['Scale'].default_value=1.
crazing=g.inv(g.smooth(.012,.052,vor.outputs['Distance']))
flexzone=g.clip(g.add(g.mul(.72,fold),g.mul(.65,track),g.mul(.30,tip),g.mul(.10,edge)))
cracks=g.mul(crazing,flexzone,g.smooth(.34,.60,cloud),.24)
# Broad creases have wandering centres and broken lengths, not parallel bars.
creasecoord=g.vector(g.mul(s,1.3),g.mul(w,.17),.7)
creasefield=g.noise(creasecoord,1.,2.)
creases=g.mul(g.smooth(.62,.75,creasefield),g.clip(g.add(fold,track,g.mul(.24,tip))))
color=g.mix(color,(.014,.005,.002,1.),g.clip(g.add(g.mul(.72,cracks),g.mul(.38,creases))))

g.stage('05 Quiet hand-creased borders and a worn terminal lozenge stamp')
wobble=g.mul(.10,g.add(mid,-.5));aw=g.add(g.m('ABSOLUTE',w),wobble)
border=g.add(g.gauss(aw,6.40,.13),g.mul(.65,g.gauss(aw,7.12,.10)))
endfade=g.mul(g.smooth(0.,5.,s),g.inv(g.smooth(L-9.,L-2.,s)))
border=g.mul(border,endfade)
diamondDist=g.add(g.m('DIVIDE',g.m('ABSOLUTE',g.add(s,-241.)),3.5),g.m('DIVIDE',g.m('ABSOLUTE',w),2.8))
lozenge=g.gauss(diamondDist,1.,.075)
stamp=g.mul(lozenge,g.smooth(234.,236.,s),g.inv(g.smooth(246.,248.,s)))
tool=g.mul(g.clip(g.add(g.mul(.62,border),g.mul(.72,stamp))),g.add(.40,g.mul(.60,cloud)),g.inv(g.mul(.46,wear)))
color=g.mix(color,(.026,.010,.003,1.),g.mul(.72,tool))
rimlight=g.mul(g.gauss(aw,6.16,.12),endfade,.15)
color=g.mix(color,fiber,rimlight)

g.stage('06 Coordinated height and roughness finishing')
height=g.add(.5,g.mul(-.45,cracks),g.mul(-.36,creases),g.mul(-.34,tool),g.mul(.06,grain))
normal=g.bump(height,.00012,nm.outputs['Normal'])
rough=g.clip(g.add(.63,g.mul(.24,roughscan),g.mul(.14,wear),g.mul(-.23,oil),g.mul(.08,cracks)))
g.finish(color,rough,0.,normal)

# Flat virtual swatch has exactly the same physical coordinates as the strap.
bpy.ops.mesh.primitive_plane_add(size=1,location=(L*.0005,0,0));plane=bpy.context.object;plane.name='Leather material swatch | not exported geometry';plane.scale=(L*.001,.018,1);bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);plane.data.materials.clear();plane.data.materials.append(g.mat)

b=Graph('V19 | hand-finished copper alloy | editable finishing stages')
b.stage('01 Existing bronze scan and native contact/curvature atlas')
tc=b.node('ShaderNodeTexCoord','Original packed UV');geo=b.node('ShaderNodeNewGeometry','Actual hardware surface')
pos=b.sep(geo.outputs['Position']);p=b.vector(b.mul(pos[0],1000.),b.mul(pos[1],1000.),b.mul(pos[2],1000.))
mask=b.sep(b.image(ROOT/'web/labs/chapter-scroll-v18/assets/metal-age-masks.png',tc.outputs['UV'],True))
scanCol=b.image(ROOT/'.cache/keeper-physical/bronze-BaseColor.png',tc.outputs['UV'])
agedCol=b.image(ROOT/'research/scroll-lab-v14/bronze-albedo-source.png',tc.outputs['UV'])
col=b.mix(agedCol,scanCol,.13)
oldLuma=b.node('ShaderNodeRGBToBW','Authored exposed metal / dark oxide');b.put(oldLuma.inputs['Color'],agedCol)
rs=b.sep(b.image(ROOT/'.cache/keeper-physical/bronze-Roughness.png',tc.outputs['UV'],True))[0]
norm=b.node('ShaderNodeNormalMap','Scanned micro pits');norm.inputs['Strength'].default_value=.5;b.put(norm.inputs['Color'],b.image(ROOT/'.cache/keeper-physical/bronze-normal-baked.png',tc.outputs['UV'],True))
macro=b.noise(p,.48);fine=b.noise(p,5.,2.);speck=b.noise(p,18.,2.)
contact=b.clip(b.add(b.mul(1.4,b.inv(mask[0])),b.mul(.19,b.inv(mask[2]))))

b.stage('02 Cast skin, old file dressing and shallow planishing relief')
hammer=b.node('ShaderNodeTexVoronoi','Small irregular planishing depressions');hammer.feature='F1';hammer.distance='EUCLIDEAN';b.put(hammer.inputs['Vector'],p);hammer.inputs['Scale'].default_value=1.8;hammer.inputs['Randomness'].default_value=.92
dimple=b.mul(.16,b.inv(b.smooth(.10,.49,hammer.outputs['Distance'])))
pits=b.mul(b.smooth(.66,.83,fine),b.add(.35,contact))
files=b.noise(b.vector(b.mul(pos[0],45000.),b.mul(pos[1],4000.),b.mul(pos[2],6000.)),1.,2.)
filemark=b.mul(b.smooth(.57,.75,files),b.smooth(.38,.61,macro),.09)

b.stage('03 Hand-incised paired grooves; no added heraldry')
x=b.mul(pos[0],1000.);z=b.mul(pos[2],1000.)
bar=b.smooth(9.5,10.8,b.m('ABSOLUTE',z))
grooves=b.mul(b.add(b.gauss(b.m('ABSOLUTE',x),5.65,.10),b.gauss(b.m('ABSOLUTE',x),6.35,.10)),bar)

b.stage('04 Uneven stable brown oxide; minimal subdued crevice green')
patina=b.clip(b.add(b.mul(.40,contact),b.mul(.48,b.inv(b.smooth(.025,.16,oldLuma.outputs[0])))))
col=b.mix(col,(.035,.020,.009,1.),b.mul(.28,patina))
green=b.mul(contact,b.smooth(.54,.69,fine),b.smooth(.49,.63,macro),.25)
col=b.mix(col,(.032,.058,.041,1.),green)
col=b.mix(col,(.021,.012,.005,1.),b.clip(b.add(b.mul(.55,pits),b.mul(.70,grooves))))

b.stage('05 Rubbed crowns, worn oxides and preserved old marks')
rub=b.mul(b.smooth(.55,.93,mask[2]),b.smooth(.32,.60,macro),b.inv(b.mul(.7,contact)))
col=b.mix(col,(.42,.25,.075,1.),b.mul(.20,rub))
relief=b.add(.5,b.mul(-1.,dimple),b.mul(-.35,pits),b.mul(-1.,filemark),b.mul(-.48,grooves),b.mul(.022,speck))
relief=b.mix(b.gray(relief),(.5,.5,.5,1.),b.mul(.22,rub))
normal=b.bump(b.sep(relief)[0],.000085,norm.outputs['Normal'])
rough=b.clip(b.add(.32,b.mul(.20,rs),b.mul(.30,patina),b.mul(.18,green),b.mul(-.18,rub)))
metal=b.clip(b.add(.97,b.mul(-.40,patina),b.mul(-.22,green)))
b.finish(col,rough,metal,normal)
hardware=[o for o in scene.objects if o.type=='MESH' and o is not plane and any(m and m.name.startswith('Bronze03') for m in o.data.materials)]
for o in hardware:o.data.materials.clear();o.data.materials.append(b.mat)

manifest={'sourceBlendSHA256':hashlib.sha256(SOURCE.read_bytes()).hexdigest(),'method':'Blender Cycles multi-pass native material baking; existing photo scan channels and preserved v14 authored aged albedos + use/tool/age masks','geometryChanged':False,'leatherUV':'u=s/length, v=(width+9)/18 in Blender; glTF playback flips v','leatherSize':[4096,512],'metalSize':[2048,2048],'sources':['Poly Haven Brown Leather, Rob Tuytel, CC0','cgbookcase Bronze03, CC0','Project v14 authored aged leather / bronze albedos; original imagegen provenance research/scroll-lab-v14/PROMPTS.md; not scans'],'outputs':[]}
def bake(graph,objects,prefix,size):
 bpy.ops.object.select_all(action='DESELECT')
 for o in objects:o.select_set(True)
 bpy.context.view_layer.objects.active=objects[0]
 emission=graph.n.new('ShaderNodeEmission');target=graph.n.new('ShaderNodeTexImage')
 for kind,socket in [('color',graph.color),('orm',graph.vector(.0,graph.rough,graph.metal)),('normal',None)]:
  img=bpy.data.images.new(prefix+' '+kind,width=size[0],height=size[1],alpha=False);img.colorspace_settings.name='sRGB' if kind=='color' else 'Non-Color';target.image=img;graph.n.active=target
  for link in list(graph.out.inputs['Surface'].links):graph.l.remove(link)
  if kind=='normal':graph.l.new(graph.bs.outputs[0],graph.out.inputs['Surface'])
  else:graph.put(emission.inputs['Color'],socket);graph.l.new(emission.outputs[0],graph.out.inputs['Surface'])
  started=time.time();bpy.ops.object.bake(type='NORMAL' if kind=='normal' else 'EMIT')
  filename=f'{prefix}-{kind}.png';img.filepath_raw=str(OUT/filename);img.file_format='PNG';img.save();img.pack()
  manifest['outputs'].append({'file':filename,'sha256':hashlib.sha256((OUT/filename).read_bytes()).hexdigest(),'bytes':(OUT/filename).stat().st_size,'bakeSeconds':round(time.time()-started,2)})
  print('FINISHED '+filename,flush=True)
 for link in list(graph.out.inputs['Surface'].links):graph.l.remove(link)
 graph.l.new(graph.bs.outputs[0],graph.out.inputs['Surface']);graph.n.remove(target);graph.n.remove(emission)
bake(g,[plane],'leather',(4096,512));bake(b,hardware,'bronze',(2048,2048))
for img in bpy.data.images:
 if img.source=='FILE' and img.has_data:img.pack()
(ROOT/'research/scroll-aging-v19-2026-10-20').mkdir(parents=True,exist_ok=True)
(ROOT/'research/scroll-aging-v19-2026-10-20/material-manifest.json').write_text(json.dumps(manifest,indent=2))
bpy.ops.wm.save_as_mainfile(filepath=str(CACHE/'keeper-finishing-workshop.blend'))
print(json.dumps(manifest),flush=True)

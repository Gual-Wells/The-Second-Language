import bpy, math, json, pathlib, numpy as np
from mathutils import Vector,Matrix
from mathutils.bvhtree import BVHTree
r=pathlib.Path('D:/CodexStorage/workspaces/hostile-dragon-coin');out=r/'local-study';out.mkdir(exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=str(r/'working/reconstructed-clay.blend'));bpy.context.preferences.filepaths.temporary_directory='D:/CodexStorage/tmp/dragon-coin'
o=next(x for x in bpy.context.scene.objects if x.type=='MESH');o.name='Reconstructed_Main_Sculpt'
old=np.array([o.matrix_world@v.co for v in o.data.vertices]);B=np.array(json.loads((r/'working/alignment.json').read_text())['basis']);q=old@B.T
# Match image landmarks to the reconstructed front, retaining actual sculpt geometry.
a=np.array([[330,179,1],[703,466,1],[394,730,1],[625,234,1],[570,370,1],[755,587,1]],dtype=float);t=np.array([[376/1310,1-46/1200],[1110/1310,1-544/1200],[570/1310,1-1110/1200],[943/1310,1-79/1200],[884/1310,1-425/1200],[1210/1310,1-850/1200]])
a[:,0]=(a[:,0]/900-.5)*1.35;a[:,1]=(.5-a[:,1]/900)*1.35;coef=np.linalg.lstsq(a,t,rcond=None)[0];uv=np.c_[old[:,0],old[:,2],np.ones(len(old))]@coef
front=bpy.data.images.load(str(r/'concept-v1.png'));front.pack();back=bpy.data.images.load(str(r/'concept-back-v1.png'));back.pack()
def pixels(im):return np.array(im.pixels[:],dtype=np.float32).reshape(im.size[1],im.size[0],4)
def sample(im,arr,U):
 xx=np.clip((U[:,0]*(im.size[0]-1)).astype(int),0,im.size[0]-1);yy=np.clip((U[:,1]*(im.size[1]-1)).astype(int),0,im.size[1]-1);return arr[yy,xx,:3]
fp=pixels(front);col=sample(front,fp,uv);lum=col@np.array([.2126,.7152,.0722]);norm=np.array([o.matrix_world.to_3x3()@v.normal for v in o.data.vertices])@B.T
frontMask=np.clip((-norm[:,1]-.10)/.55,0,1);q+=norm*((lum-.35)*.006*frontMask)[:,None]
o.matrix_world=Matrix.Identity(4)
for i,v in enumerate(o.data.vertices):v.co=q[i]
o.data.update();layer=o.data.uv_layers.new(name='Art_Projection')
for l in o.data.loops:layer.data[l.index].uv=uv[l.vertex_index]
def metal(name,im,backside=False):
 m=bpy.data.materials.new(name);m.use_nodes=True;n=m.node_tree.nodes;ln=m.node_tree.links;n.clear();output=n.new('ShaderNodeOutputMaterial');p=n.new('ShaderNodeBsdfPrincipled');ln.new(p.outputs[0],output.inputs['Surface']);p.inputs['Metallic'].default_value=.93;p.inputs['Roughness'].default_value=.32
 tex=n.new('ShaderNodeTexImage');tex.image=im;tex.extension='EXTEND';bw=n.new('ShaderNodeRGBToBW');ln.new(tex.outputs['Color'],bw.inputs[0]);ramp=n.new('ShaderNodeValToRGB');ramp.color_ramp.elements[0].position=.10;ramp.color_ramp.elements[0].color=(.07,.075,.08,1);ramp.color_ramp.elements[1].position=.72;ramp.color_ramp.elements[1].color=(.55,.49,.40,1);ln.new(bw.outputs[0],ramp.inputs[0]);ln.new(ramp.outputs['Color'],p.inputs['Base Color'])
 bump=n.new('ShaderNodeBump');bump.inputs['Strength'].default_value=.40;bump.inputs['Distance'].default_value=.004;ln.new(bw.outputs[0],bump.inputs['Height']);ln.new(bump.outputs[0],p.inputs['Normal'])
 rr=n.new('ShaderNodeMapRange');rr.inputs['From Min'].default_value=.1;rr.inputs['From Max'].default_value=.7;rr.inputs['To Min'].default_value=.55;rr.inputs['To Max'].default_value=.21;ln.new(bw.outputs[0],rr.inputs[0]);ln.new(rr.outputs[0],p.inputs['Roughness'])
 if not backside:
  sep=n.new('ShaderNodeSeparateColor');sep.mode='RGB';ln.new(tex.outputs['Color'],sep.inputs[0]);sub=n.new('ShaderNodeMath');sub.operation='SUBTRACT';ln.new(sep.outputs['Red'],sub.inputs[0]);ln.new(sep.outputs['Green'],sub.inputs[1]);em=n.new('ShaderNodeMapRange');em.inputs['From Min'].default_value=.12;em.inputs['From Max'].default_value=.38;em.inputs['To Min'].default_value=0;em.inputs['To Max'].default_value=1.9;ln.new(sub.outputs[0],em.inputs[0]);p.inputs['Emission Color'].default_value=(.8,.018,.003,1);ln.new(em.outputs[0],p.inputs['Emission Strength'])
 return m
mat=metal('Experimental_Antiqued_Silver_Front',front);o.data.materials.clear();o.data.materials.append(mat)
# Reverse is a relief insert with genuinely displaced engraving, not a replacement for 3D head/claws.
N=480;R=.397;cx=.024;cz=.027;verts=[];Uvs=[];faces=[]
for j in range(N+1):
 z=-R+2*R*j/N
 for i in range(N+1):
  x=-R+2*R*i/N;rr=math.hypot(x,z);verts.append((cx+x,.054,cz+z));Uvs.append((.505-.397*x/R,.500+.445*z/R))
for j in range(N):
 for i in range(N):
  if math.hypot(-R+2*R*(i+.5)/N,-R+2*R*(j+.5)/N)<R-.001:
   k=j*(N+1)+i;faces.append((k,k+1,k+N+2,k+N+1))
bp=pixels(back);bc=sample(back,bp,np.array(Uvs));bh=bc@np.array([.2126,.7152,.0722]);verts=np.array(verts);dist=np.hypot(verts[:,0]-cx,verts[:,2]-cz);fade=np.clip((R-dist)/.016,0,1);verts[:,1]+=.008*(bh-.24)*fade
me=bpy.data.meshes.new('Reverse_Engraved_Relief');me.from_pydata(verts.tolist(),[],faces);me.update();rev=bpy.data.objects.new('Reverse_Dragon_Eye_Seal',me);bpy.context.collection.objects.link(rev);ly=me.uv_layers.new(name='Art_Projection')
for l in me.loops:ly.data[l.index].uv=Uvs[l.vertex_index]
for f in me.polygons:f.use_smooth=True
me.materials.append(metal('Experimental_Antiqued_Silver_Reverse',back,True))
# Designed eye insert. Surface position comes from the reconstructed orbit.
bvh=BVHTree.FromPolygons(q.tolist(),[list(p.vertices) for p in o.data.polygons]);eyeuv=(uv[:,0]>.63)&(uv[:,0]<.70)&(uv[:,1]>.63)&(uv[:,1]<.69)&(frontMask>.7)
if eyeuv.sum():
 ec=q[eyeuv].mean(0);hit=bvh.ray_cast(Vector((ec[0],-1,ec[2])),Vector((0,1,0)),2)
 if hit[0] is not None:ec[1]=hit[0][1]-.003
 def solid(name,color,metallic,rough,emit=0):
  m=bpy.data.materials.new(name);m.use_nodes=True;p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(*color,1);p.inputs['Metallic'].default_value=metallic;p.inputs['Roughness'].default_value=rough;p.inputs['Emission Color'].default_value=(*color,1);p.inputs['Emission Strength'].default_value=emit;return m
 iris=solid('Blood_Red_Iris',(.28,.012,.004),.3,.18,.45);pupil=solid('Deep_Slit_Pupil',(.003,.001,.001),.05,.22)
 vv=[tuple(ec)];ff=[];nr=12;nt=96
 for ri in range(1,nr+1):
  rad=ri/nr
  for ti in range(nt):
   ang=ti*math.tau/nt;x=.023*rad*math.cos(ang);z=.013*rad*math.sin(ang)*(abs(math.sin(ang))**.35)-x*.17;y=-.008*math.sqrt(max(0,1-rad*rad));vv.append(tuple(ec+np.array([x,y,z])))
 for t1 in range(nt):ff.append((0,1+t1,1+(t1+1)%nt))
 for ri in range(nr-1):
  for ti in range(nt):
   a1=1+ri*nt+ti;b1=1+ri*nt+(ti+1)%nt;ff.append((a1,b1,b1+nt,a1+nt))
 mm=bpy.data.meshes.new('Hostile_Almond_Eye');mm.from_pydata(vv,[],ff);mm.update();ee=bpy.data.objects.new('Near_Left_Eye',mm);bpy.context.collection.objects.link(ee);mm.materials.append(iris)
 for f in mm.polygons:f.use_smooth=True
 # Angular slit follows the brow, with actual depth.
 sv=[tuple(ec+np.array([x,-.0084,z])) for x,z in [(0,.010),(.0025,.003),(.001,-.007),(0,-.011),(-.002,-.002)]];sm=bpy.data.meshes.new('Slit');sm.from_pydata(sv,[],[(0,1,2,3,4)]);sm.materials.append(pupil);so=bpy.data.objects.new('Vertical_Slit',sm);bpy.context.collection.objects.link(so)
 print('Eye insert',ec.tolist(),'samples',int(eyeuv.sum()),flush=True)
for x in list(bpy.context.scene.objects):
 if x.type in {'LIGHT','CAMERA'}:bpy.data.objects.remove(x,do_unlink=True)
s=bpy.context.scene;s.render.engine='CYCLES';s.cycles.samples=48;s.cycles.use_denoising=True;s.render.resolution_x=1200;s.render.resolution_y=1200;s.render.resolution_percentage=100;s.render.film_transparent=False;s.world.node_tree.nodes['Background'].inputs[0].default_value=(.075,.08,.09,1);s.world.node_tree.nodes['Background'].inputs[1].default_value=.55
for name,pos,power,size,color in [('Key',(-1.3,-2,2),100,1.8,(1,.87,.7)),('Fill',(1.8,-1,.6),80,1.4,(.75,.85,1)),('Rim',(-.4,1.4,1.5),180,1.3,(.85,.94,1))]:
 bpy.ops.object.light_add(type='AREA',location=pos);l=bpy.context.object;l.name=name;l.data.energy=power;l.data.shape='DISK';l.data.size=size;l.data.color=color;l.rotation_euler=(-l.location).to_track_quat('-Z','Y').to_euler()
bpy.ops.object.camera_add();cam=bpy.context.object;cam.data.type='ORTHO';cam.data.ortho_scale=1.2;s.camera=cam
cam.location=(.18,-2.8,.15);cam.rotation_euler=(Vector((.02,0,.02))-cam.location).to_track_quat('-Z','Y').to_euler();s.render.filepath=str(out/'front.png');bpy.ops.wm.save_as_mainfile(filepath=str(out/'local-study.blend'));bpy.ops.render.render(write_still=True)
cam.location=(-.3,2.8,.12);cam.rotation_euler=(Vector((.02,0,.02))-cam.location).to_track_quat('-Z','Y').to_euler();s.render.filepath=str(out/'back.png');bpy.ops.render.render(write_still=True)

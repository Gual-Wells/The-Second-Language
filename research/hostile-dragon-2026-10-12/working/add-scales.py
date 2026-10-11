import bpy,pathlib,numpy as np,json,math
from mathutils import Vector
from mathutils.bvhtree import BVHTree
r=pathlib.Path('D:/CodexStorage/workspaces/hostile-dragon-coin');bpy.ops.wm.open_mainfile(filepath=str(r/'local-study/local-study.blend'));bpy.context.preferences.filepaths.temporary_directory='D:/CodexStorage/tmp/dragon-coin'
o=bpy.data.objects['Reconstructed_Main_Sculpt'];bvh=BVHTree.FromPolygons([tuple(v.co) for v in o.data.vertices],[list(p.vertices) for p in o.data.polygons]);B=np.array(json.loads((r/'working/alignment.json').read_text())['basis']);a=np.array([[330,179,1],[703,466,1],[394,730,1],[625,234,1],[570,370,1],[755,587,1]],float);t=np.array([[376/1310,1-46/1200],[1110/1310,1-544/1200],[570/1310,1-1110/1200],[943/1310,1-79/1200],[884/1310,1-425/1200],[1210/1310,1-850/1200]]);a[:,0]=(a[:,0]/900-.5)*1.35;a[:,1]=(.5-a[:,1]/900)*1.35;coef=np.linalg.lstsq(a,t,rcond=None)[0];inv=np.linalg.inv(coef[:2]);direction=Vector(B@np.array([0,1,0]));frontImage=bpy.data.images['concept-v1.png']
def ray_uv(u,v):
 xz=(np.array([u,v])-coef[2])@inv;origin=Vector(B@np.array([xz[0],-1,xz[1]]));return bvh.ray_cast(origin,direction,2)
def bez(t):
 # Neck flow is designed as a broad C curl; narrower scales appear near articulations.
 p=np.array([[520,985],[325,720],[365,390],[681,274]],float);return (1-t)**3*p[0]+3*(1-t)**2*t*p[1]+3*(1-t)*t*t*p[2]+t**3*p[3]
verts=[];uvs=[];faces=[];kept=0
for row in range(67):
 tt=(row+.35)/67;pixel=bez(tt);der=bez(min(1,tt+.005))-bez(max(0,tt-.005));der/=np.linalg.norm(der);perp=np.array([-der[1],der[0]]);width=110+45*math.sin(tt*math.pi);ncol=15+int(7*math.sin(tt*math.pi))
 for col in range(ncol):
  zz=(col+.5+.45*(row%2))/ncol*2-1;pp=pixel+perp*width*zz
  U=pp[0]/1310;V=1-pp[1]/1200;hit,norm,_,_=ray_uv(U,V)
  if hit is None or norm.dot(-direction)<.12:continue
  lp=11+8*math.sin(tt*math.pi);wp=width*2/ncol*.95;hh=.0008+.0009*math.sin(tt*math.pi);off=len(verts);valid=True;local=[];luv=[]
  for j in range(6):
   v1=j/5;ww=(math.sin(math.pi*v1)**.8)*wp*.5+.001
   for i in range(5):
    side=(i/4*2-1);pic=pp+der*(v1-.45)*lp+perp*side*ww;u=pic[0]/1310;v=1-pic[1]/1200;pos,n,_,_=ray_uv(u,v)
    if pos is None:valid=False;break
    height=hh*(math.sin(math.pi*v1)**.5)*(1-side*side)+.00012
    local.append(tuple(pos+n*height));luv.append((u,v))
   if not valid:break
  if not valid:continue
  verts.extend(local);uvs.extend(luv);kept+=1
  for j in range(5):
   for i in range(4):
    k=off+j*5+i;faces.append((k,k+1,k+6,k+5))
me=bpy.data.meshes.new('Directional_Overlapping_Neck_Scales');me.from_pydata(verts,[],faces);me.update();ob=bpy.data.objects.new('Custom_Neck_Scale_Carving',me);bpy.context.collection.objects.link(ob);ly=me.uv_layers.new(name='Art_Projection')
for l in me.loops:ly.data[l.index].uv=uvs[l.vertex_index]
me.materials.append(o.data.materials[0])
for p in me.polygons:p.use_smooth=True
print('New sculpted scales',kept,'faces',len(faces),flush=True)
s=bpy.context.scene;s.cycles.samples=24;s.render.resolution_x=1000;s.render.resolution_y=1000;cam=s.camera;cam.location=(.15,-2.8,.10);cam.rotation_euler=(Vector((.02,0,.02))-cam.location).to_track_quat('-Z','Y').to_euler();s.render.filepath=str(r/'local-study/front-v2.png');bpy.ops.wm.save_as_mainfile(filepath=str(r/'local-study/local-study-v2.blend'));bpy.ops.render.render(write_still=True)

"""Heel-bar buckle assembly from an open, continuous strap blank.

Mature DCC operations: Solidify, exact Boolean punches, Bevel, arclength bending,
Armature weights and rigid hinge parenting. Whole-object AI mesh is not used.
Millimetres below are working specimen dimensions, not a historical standard.
"""
from pathlib import Path
import bpy,bmesh,math,json,time,sys,numpy as np
from mathutils import Vector,Matrix
from mathutils.bvhtree import BVHTree
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'.cache/keeper-physical';OUT.mkdir(exist_ok=True)
EVIDENCE=ROOT/'research/scroll-keeper-physical-2026-10-19';EVIDENCE.mkdir(exist_ok=True)
WEB=ROOT/'web/labs/keeper-physical-assembly/assets';WEB.mkdir(parents=True,exist_ok=True)
START=time.monotonic()
def log(stage,**kw):
 d={'stage':stage,'seconds':round(time.monotonic()-START,2),**kw};(OUT/'progress.json').write_text(json.dumps(d,indent=2));print(json.dumps(d),flush=True)
bpy.ops.wm.read_factory_settings(use_empty=True)
scene=bpy.context.scene;scene.unit_settings.system='METRIC';scene.render.engine='CYCLES';scene.cycles.samples=20;scene.cycles.device='CPU'

def bezier(a,b,c,d,n=80):
 t=np.linspace(0,1,n)[:,None];return (1-t)**3*a+3*(1-t)**2*t*b+3*(1-t)*t*t*c+t**3*d
R=45.;T=2.5;W=18.;BX=-10.;BY=-math.sqrt(R*R-BX*BX)-3.5
fold_radius=3.5
theta0=math.atan2(BY+fold_radius,BX);theta1=math.atan2(BY+fold_radius,-BX)-2*math.pi
p0=np.array([math.cos(math.radians(-126)),math.sin(math.radians(-126))])*(R+2.65)
leaf=bezier(p0,np.array([-22.,-43.2]),np.array([-16.,BY-fold_radius]),np.array([BX,BY-fold_radius]))
ang=np.linspace(-math.pi/2,math.pi/2,100);fold=np.stack([BX+fold_radius*np.cos(ang),BY+fold_radius*np.sin(ang)],1)
ang=np.linspace(theta0,theta1,900);main=np.stack([R*np.cos(ang),R*np.sin(ang)],1)
# Active tongue traverses the empty buckle window: right/back -> left/front.
cross=bezier(main[-1],np.array([3.,BY+3.5]),np.array([6.,BY-6.0]),np.array([-10.,BY-5.8]),180)
tail=bezier(cross[-1],np.array([-20.,BY-5.8]),np.array([-32.,-40.]),np.array([-36.,-34.]),130)
segments=[leaf,fold[1:],main[1:],cross[1:],tail[1:]]
path=np.concatenate(segments);arcs=np.concatenate([[0.],np.cumsum(np.linalg.norm(np.diff(path,axis=0),axis=1))]);L=float(arcs[-1])
leaf_end=float(arcs[len(leaf)-1]);fold_end=float(arcs[len(leaf)+len(fold)-2]);main_end=float(arcs[len(leaf)+len(fold)+len(main)-3])
def center(s):return np.array([np.interp(s,arcs,path[:,0]),np.interp(s,arcs,path[:,1])])
def normal(s):
 v=center(min(L,s+.05))-center(max(0,s-.05));v/=np.linalg.norm(v);return np.array([-v[1],v[0]])
def closed_xyz(s,y,z):
 xy=center(s)+normal(s)*y;return Vector((xy[0],xy[1],z))
# Pin is a complete forged eye and shaft, not a detached visible nub.
pin_curve=bezier(np.array([-6.5,BY]),np.array([-.5,BY-.2]),np.array([6.8,BY-2.9]),np.array([10.,BY-3.2]),120)
def pin_y(x):return np.interp(x,pin_curve[:,0],pin_curve[:,1])
candidate=np.linspace(main_end,main_end+np.linalg.norm(np.diff(cross,axis=0),axis=1).sum(),500)
hole_s=min(candidate,key=lambda s:abs(center(s)[1]-pin_y(center(s)[0])))

def apply(obj,mod):bpy.context.view_layer.objects.active=obj;bpy.ops.object.modifier_apply(modifier=mod.name)
log('forming_open_strap',length_mm=L,working_width_mm=W,working_thickness_mm=T)
nu=math.ceil(L/.7);nv=20;verts=[];faces=[]
for i in range(nu+1):
 s=L*i/nu;tip=max(0,(s-(L-13))/13);half=W/2*math.cos(tip*math.pi/2) if tip else W/2;half=max(.45,half)
 # Small edge irregularity follows material length; no melting or random holes.
 half+=.06*math.sin(s*.43)*(1-tip)
 for j in range(nv+1):verts.append((s,0,(j/nv*2-1)*half))
for i in range(nu):
 for j in range(nv):a=i*(nv+1)+j;faces.append((a,a+nv+1,a+nv+2,a+1))
mesh=bpy.data.meshes.new('Single open strap blank');mesh.from_pydata(verts,[],faces);mesh.update()
strap=bpy.data.objects.new('Leather | continuous strip with two ends',mesh);scene.collection.objects.link(strap)
bpy.context.view_layer.objects.active=strap;strap.select_set(True)
solid=strap.modifiers.new('Actual 2.5mm leather thickness','SOLIDIFY');solid.thickness=T;solid.offset=0;apply(strap,solid)
def punch(s,rs,rz,name):
 bpy.ops.mesh.primitive_cylinder_add(vertices=64,radius=1,depth=12,location=(s,0,0),rotation=(math.pi/2,0,0))
 cutter=bpy.context.object;cutter.name=name;cutter.scale=(rs,rz,1)
 bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
 mod=strap.modifiers.new(name,'BOOLEAN');mod.operation='DIFFERENCE';mod.solver='EXACT';mod.object=cutter;apply(strap,mod);bpy.data.objects.remove(cutter,do_unlink=True)
def punch_at(s,z,r,name):
 bpy.ops.mesh.primitive_cylinder_add(vertices=32,radius=r,depth=12,location=(s,0,z),rotation=(math.pi/2,0,0))
 cutter=bpy.context.object;mod=strap.modifiers.new(name,'BOOLEAN');mod.operation='DIFFERENCE';mod.solver='EXACT';mod.object=cutter;apply(strap,mod);bpy.data.objects.remove(cutter,do_unlink=True)
punch((leaf_end+fold_end)/2,(fold_end-leaf_end)/2+4.0,3.0,'Fixed fold prong clearance slot')
q_rivet=center(3.);main_start=len(leaf)+len(fold)-1
main_range=path[main_start:main_start+len(main)-1];main_ri=int(np.argmin(np.linalg.norm(main_range-q_rivet,axis=1)))
rivet_s_main=float(arcs[main_start+main_ri])
for s in [3.,rivet_s_main]:
 for z in [-5.6,5.6]:punch_at(s,z,.95,'Actual through-hole for fixed return rivet')
for s in [hole_s,hole_s+12,hole_s+24]:
 if s<L-9:punch(s,3.0 if s==hole_s else 2.1,2.1,'Real adjustment through-hole')
bevel=strap.modifiers.new('Rounded cut leather edges','BEVEL');bevel.width=.22;bevel.segments=3;apply(strap,bevel)
mesh=strap.data
while mesh.uv_layers:mesh.uv_layers.remove(mesh.uv_layers[0])
uv=mesh.uv_layers.new(name='Material-length UV')
uv.active_render=True
for poly in mesh.polygons:
 poly.use_smooth=True
 for li in poly.loop_indices:
  p=mesh.vertices[mesh.loops[li].vertex_index].co;uv.data[li].uv=(p.x/300,(p.z+20)/300)
flat=np.array([v.co[:] for v in mesh.vertices],dtype=np.float64)
for v,p in zip(mesh.vertices,flat):v.co=closed_xyz(float(np.clip(p[0],0,L)),p[1],p[2])*.001
# Commit the bent coordinates before Blender creates the Basis/evaluated mesh.
# Without this, the first render can retain the pre-bend modifier cache.
mesh.update()
strap.shape_key_add(name='Basis');flat_key=strap.shape_key_add(name='Unwrapped blank | structural inspection')
for v,p in zip(flat_key.data,flat):v.co=((p[0]-L/2)*.001,-p[1]*.001,p[2]*.001)
strap.data.update();strap.update_tag(refresh={'DATA'});bpy.context.view_layer.update()
strap['construction']='One continuous open strap: short fixed end -> fold around heel bar -> main band -> perforated free tongue'
strap['material_length_mm']=L;strap['closed_loop_weld']=False

def image_node(mat,path,noncolor=False):
 n=mat.node_tree.nodes.new('ShaderNodeTexImage');n.image=bpy.data.images.load(str(path),check_existing=True)
 if noncolor:n.image.colorspace_settings.name='Non-Color'
 return n
leather=bpy.data.materials.new('Scanned brown leather | Poly Haven CC0');leather.use_nodes=True;nodes=leather.node_tree.nodes;links=leather.node_tree.links;bs=nodes.get('Principled BSDF')
color=image_node(leather,OUT/'leather-color.jpg');rough=image_node(leather,OUT/'leather-roughness.jpg',True);norm=image_node(leather,OUT/'leather-normal.jpg',True)
links.new(color.outputs['Color'],bs.inputs['Base Color']);links.new(rough.outputs['Color'],bs.inputs['Roughness'])
normal_node=nodes.new('ShaderNodeNormalMap');normal_node.inputs['Strength'].default_value=.3;links.new(norm.outputs['Color'],normal_node.inputs['Color']);links.new(normal_node.outputs['Normal'],bs.inputs['Normal'])
strap.data.materials.clear();strap.data.materials.append(leather)
for poly in strap.data.polygons:poly.material_index=0
bronze=bpy.data.materials.new('Bronze03 | cgbookcase CC0');bronze.use_nodes=True;bn=bronze.node_tree.nodes;bl=bronze.node_tree.links;bb=bn.get('Principled BSDF')
for kind,socket in [('BaseColor','Base Color'),('Roughness','Roughness'),('Metallic','Metallic')]:
 tex=image_node(bronze,OUT/f'bronze-{kind}.png',kind!='BaseColor');bl.new(tex.outputs['Color'],bb.inputs[socket])
height=image_node(bronze,OUT/'bronze-Height.png',True);bump=bn.new('ShaderNodeBump');bump.inputs['Strength'].default_value=.32;bump.inputs['Distance'].default_value=.00004;bl.new(height.outputs['Color'],bump.inputs['Height']);bl.new(bump.outputs['Normal'],bb.inputs['Normal'])

def tube(name,points,radius,closed=False):
 data=bpy.data.curves.new(name,'CURVE');data.dimensions='3D';data.resolution_u=2;data.bevel_depth=radius*.001;data.bevel_resolution=6;data.use_fill_caps=True
 spl=data.splines.new('POLY');spl.points.add(len(points)-1)
 for p,co in zip(spl.points,points):p.co=(co[0]*.001,co[1]*.001,co[2]*.001,1)
 spl.use_cyclic_u=closed;o=bpy.data.objects.new(name,data);scene.collection.objects.link(o)
 bpy.ops.object.select_all(action='DESELECT');o.select_set(True);bpy.context.view_layer.objects.active=o;bpy.ops.object.convert(target='MESH')
 o=bpy.context.object
 for p in o.data.polygons:p.use_smooth=True
 o.data.materials.append(bronze);return o
frame_points=[]
for cx,cz,start in [(6.5,8.5,0),(-6.5,8.5,90),(-6.5,-8.5,180),(6.5,-8.5,270)]:
 for t in np.linspace(math.radians(start),math.radians(start+90),24,endpoint=False):frame_points.append((cx+3.5*math.cos(t),BY,cz+3.5*math.sin(t)))
frame=tube('Frame | separate solid heel-bar buckle',frame_points,2,True)
frame['role']='Rigid frame, independent of the leather';hardware=[frame]
eye_points=[(BX+2.9*math.cos(t),BY+2.9*math.sin(t),0) for t in np.linspace(0,2*math.pi,80,endpoint=False)]
eye=tube('Prong eye around heel bar',eye_points,.65,True)
shaft=tube('Prong | full hidden shaft and exposed tip',[(x,y,0) for x,y in pin_curve],1.15)
# Union the eye and shaft into one actual metal part.
union=shaft.modifiers.new('Forged eye to shaft union','BOOLEAN');union.operation='UNION';union.solver='EXACT';union.object=eye;apply(shaft,union);bpy.data.objects.remove(eye,do_unlink=True)
pin=shaft;pin.name='Prong | eye and continuous full shaft';hardware.append(pin)
hinge=bpy.data.objects.new('Prong hinge | heel-bar axis',None);scene.collection.objects.link(hinge);hinge.location=(BX*.001,BY*.001,0)
bpy.context.view_layer.update()
world=pin.matrix_world.copy();pin.parent=hinge;pin.matrix_world=world
hinge['axis']='Local Z; independent rigid rotation, no metal skinning'

# Two through-rivets clamp the short return to the same strap's main body.
q=center(3.);main_range=path[len(leaf)+len(fold)-1:len(leaf)+len(fold)+len(main)-2];near=main_range[np.argmin(np.linalg.norm(main_range-q,axis=1))]
axis=q-near;axis/=np.linalg.norm(axis);mid=(q+near)/2;distance=np.linalg.norm(q-near)+T
for z in [-5.6,5.6]:
 bpy.ops.mesh.primitive_cylinder_add(vertices=28,radius=.85*.001,depth=distance*.001,location=(mid[0]*.001,mid[1]*.001,z*.001))
 rivet=bpy.context.object;rivet.name=f'Rivet shank {z:+g}';rivet.rotation_euler=Vector((axis[0],axis[1],0)).to_track_quat('Z','Y').to_euler();rivet.data.materials.append(bronze);hardware.append(rivet)
 for point,sign in [(q,1),(near,-1)]:
  p=point+axis*sign*(T/2+.25)
  bpy.ops.mesh.primitive_uv_sphere_add(segments=24,ring_count=12,radius=1,location=(p[0]*.001,p[1]*.001,z*.001))
  cap=bpy.context.object;cap.name=f'Rivet cap {z:+g} {sign:+g}';cap.scale=(1.6*.001,1.6*.001,.6*.001);cap.rotation_euler=Vector((axis[0],axis[1],0)).to_track_quat('Z','Y').to_euler();bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);cap.data.materials.append(bronze);hardware.append(cap)
  for p in cap.data.polygons:p.use_smooth=True

log('binding_actual_strap',vertices=len(mesh.vertices),selected_hole_s_mm=hole_s)
# Arc-length weights distinguish adjacent layers even where they almost touch.
armdata=bpy.data.armatures.new('Continuous material-length chain');rig=bpy.data.objects.new('Keeper functional strap rig',armdata);scene.collection.objects.link(rig);rig.show_in_front=True
bpy.ops.object.select_all(action='DESELECT');rig.select_set(True);bpy.context.view_layer.objects.active=rig;bpy.ops.object.mode_set(mode='EDIT')
root=armdata.edit_bones.new('ROOT');root.head=(0,0,0);root.tail=(0,0,.015);root.use_deform=False
count=76
for i in range(count):
 b=armdata.edit_bones.new(f'STRAP_{i:02}');p=center(L*i/count);q2=center(L*(i+1)/count)
 b.head=(p[0]*.001,p[1]*.001,0);b.tail=(q2[0]*.001,q2[1]*.001,0)
 b.parent=root if i==0 else armdata.edit_bones[f'STRAP_{i-1:02}'];b.use_connect=i>0
bpy.ops.object.mode_set(mode='OBJECT')
groups=[strap.vertex_groups.new(name=f'STRAP_{i:02}') for i in range(count)]
for vi,p in enumerate(flat):
 f=float(np.clip(p[0]/L*count-.5,0,count-1));i=int(f);a=f-i;groups[i].add([vi],1-a,'REPLACE')
 if a>0 and i+1<count:groups[i+1].add([vi],a,'REPLACE')
mod=strap.modifiers.new('Material-length armature binding','ARMATURE');mod.object=rig
strap.parent=rig
rig['bound_mesh']='Leather | continuous strip with two ends';rig['weights']='Material coordinate, not proximity or automatic heat weights'

# Hardware UVs share a packed atlas for the real scanned bronze channels.
bpy.ops.object.select_all(action='DESELECT')
for o in hardware:o.select_set(True)
bpy.context.view_layer.objects.active=frame;bpy.ops.object.mode_set(mode='EDIT');bpy.ops.mesh.select_all(action='SELECT');bpy.ops.uv.smart_project(angle_limit=math.radians(66),island_margin=.02);bpy.ops.object.mode_set(mode='OBJECT')
# Bake Bump to a standard tangent normal map, keeping the resource material.
log('baking_bronze_normal')
normal_img=bpy.data.images.new('Bronze tangent normal',width=1024,height=1024,alpha=False);normal_img.colorspace_settings.name='Non-Color'
target=bn.new('ShaderNodeTexImage');target.image=normal_img;bn.active=target
scene.cycles.samples=1;scene.render.bake.use_selected_to_active=False;scene.render.bake.margin=8;bpy.ops.object.bake(type='NORMAL')
normal_img.filepath_raw=str(OUT/'bronze-normal-baked.png');normal_img.file_format='PNG';normal_img.save();normal_img.pack()
bl.remove(bb.inputs['Normal'].links[0]);bn.remove(target)
new_tex=bn.new('ShaderNodeTexImage');new_tex.image=normal_img;nm=bn.new('ShaderNodeNormalMap');bl.new(new_tex.outputs['Color'],nm.inputs['Color']);bl.new(nm.outputs['Normal'],bb.inputs['Normal'])
for image in bpy.data.images:
 if image.source=='FILE':image.pack()

# Re-load the serialized assembly before inspection/export. Blender's live
# dependency graph retains the pre-bend evaluated mesh after the edit-mode UV
# and shape-key construction sequence, despite updated source/key coordinates.
# A real file round trip is also the recoverable hand-off between DCC stages.
hardware_names=[o.name for o in hardware]
checkpoint=OUT/'keeper-physical.blend'
bpy.ops.wm.save_as_mainfile(filepath=str(checkpoint))
bpy.ops.wm.open_mainfile(filepath=str(checkpoint))
scene=bpy.context.scene;strap=bpy.data.objects['Leather | continuous strip with two ends']
rig=bpy.data.objects['Keeper functional strap rig'];hinge=bpy.data.objects['Prong hinge | heel-bar axis']
hardware=[bpy.data.objects[name] for name in hardware_names]
frame=hardware[0];pin=hardware[1];mesh=strap.data
flat_key=mesh.shape_keys.key_blocks['Unwrapped blank | structural inspection'];flat_key.value=0
bpy.context.view_layer.update()

def tree(obj):
 obj.update_tag(refresh={'DATA'})
 bpy.context.view_layer.update()
 dg=bpy.context.evaluated_depsgraph_get();ob=obj.evaluated_get(dg);me=ob.to_mesh();v=[ob.matrix_world@x.co for x in me.vertices];polys=[list(p.vertices) for p in me.polygons];t=BVHTree.FromPolygons(v,polys);ob.to_mesh_clear();return t
log('checking_contact_boundaries')
strap_tree=tree(strap);report={'working_dimensions_mm':{'radius':R,'width':W,'thickness':T,'strap_length':L},'strap_is_open_blank':True,'physical_parts':[o.name for o in [strap,*hardware]],'bound_strap_bones':count,'prong_full_eye_and_shaft':True,'closed_intersections':{'frame_vs_strap':len(tree(frame).overlap(strap_tree)),'prong_vs_strap':len(tree(pin).overlap(strap_tree))},'complete_unfastening_animation':False,'art_accepted':False}
bm=bmesh.new();bm.from_mesh(strap.data)
remaining=set(bm.verts);components=[]
while remaining:
 pending=[remaining.pop()];n=0
 while pending:
  v=pending.pop();n+=1
  for edge in v.link_edges:
   other=edge.other_vert(v)
   if other in remaining:remaining.remove(other);pending.append(other)
 components.append(n)
report['mesh_integrity']={'connected_components':components,'boundary_edges':sum(e.is_boundary for e in bm.edges),'nonmanifold_edges':sum(not e.is_manifold for e in bm.edges)};bm.free()
evaluated=strap.evaluated_get(bpy.context.evaluated_depsgraph_get());coords=np.array([v.co[:] for v in evaluated.data.vertices])
report['evaluated_closed_size_mm']=((coords.max(axis=0)-coords.min(axis=0))*1000).tolist()
assert report['evaluated_closed_size_mm'][0]<110,'Stale flat mesh instead of the closed assembly'
(OUT/'assembly.json').write_text(json.dumps(report,indent=2));log('assembly_ready',**report)
if '--structure-only' in sys.argv:
 bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'keeper-physical.blend'));sys.exit(0)
assert not any(report['closed_intersections'].values()),'Contact intersections: inspect before render/export'

scene.world=bpy.data.worlds.new('Neutral world');scene.world.use_nodes=True;scene.world.node_tree.nodes['Background'].inputs['Color'].default_value=(.12,.12,.12,1);scene.world.node_tree.nodes['Background'].inputs['Strength'].default_value=.55
def light(name,loc,energy,size):
 d=bpy.data.lights.new(name,'AREA');d.energy=energy;d.shape='DISK';d.size=size;o=bpy.data.objects.new(name,d);scene.collection.objects.link(o);o.location=loc;o.rotation_euler=(-o.location).to_track_quat('-Z','Y').to_euler()
light('Broad key',(-.12,-.16,.22),1.8,.20);light('Cool fill',(.15,-.06,.09),.72,.15);light('Back reflection',(.08,.14,.16),1.44,.12)
camdata=bpy.data.cameras.new('Inspection camera');cam=bpy.data.objects.new('Inspection camera',camdata);scene.collection.objects.link(cam);scene.camera=cam;camdata.type='ORTHO';camdata.ortho_scale=.122
scene.cycles.samples=20;scene.view_settings.view_transform='AgX';scene.render.resolution_x=1400;scene.render.resolution_y=1050;scene.render.resolution_percentage=100
def render(name,pos,look=(0,0,0),scale=.122):
 strap.update_tag(refresh={'DATA'})
 bpy.context.view_layer.update()
 cam.location=pos;cam.rotation_euler=(Vector(look)-cam.location).to_track_quat('-Z','Y').to_euler();camdata.ortho_scale=scale;scene.render.filepath=str(EVIDENCE/(name+'.png'));bpy.ops.render.render(write_still=True)
rig.hide_render=True
render('closed-front',(0,-.24,.12));render('closed-top',(0,0,.25));render('closed-inside',(.14,.18,.12))
# The flat state is a manufacturing/inspection state, not a claimed physical animation.
flat_key.value=1
for o in hardware:o.hide_render=True
render('one-piece-blank',(0,-.35,.15),scale=L*.001*1.12)
flat_key.value=0
for o in hardware:o.hide_render=False
bpy.ops.object.select_all(action='DESELECT');strap.select_set(True);rig.select_set(True)
for o in hardware:o.select_set(True)
hinge.select_set(True);bpy.context.view_layer.objects.active=strap
bpy.ops.export_scene.gltf(filepath=str(WEB/'keeper-physical.glb'),export_format='GLB',use_selection=True,export_cameras=False,export_lights=False,export_animations=False)
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'keeper-physical.blend'))
(EVIDENCE/'assembly.json').write_text(json.dumps(report,indent=2));log('saved')

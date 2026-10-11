"""Editable geometry/material study from an immutable source, never declared final art."""
import bpy,sys,math,json,time
from pathlib import Path
from mathutils import Vector
source,output=sys.argv[sys.argv.index('--')+1:]
out=Path(output);out.mkdir(parents=True,exist_ok=True)
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.context.preferences.filepaths.temporary_directory='D:/CodexStorage/tmp/dragon-coin'
bpy.ops.import_scene.gltf(filepath=source)
originals=[o for o in bpy.context.scene.objects if o.type=='MESH']
for obj in originals:
    bpy.context.view_layer.objects.active=obj;obj.select_set(True)
    bpy.ops.object.transform_apply(location=False,rotation=True,scale=True);obj.select_set(False)

def metal(name,color,roughness=.32):
    m=bpy.data.materials.new(name);m.use_nodes=True
    nodes=m.node_tree.nodes;links=m.node_tree.links;s=nodes.get('Principled BSDF')
    s.inputs['Base Color'].default_value=(*color,1);s.inputs['Metallic'].default_value=.95;s.inputs['Roughness'].default_value=roughness
    n=nodes.new('ShaderNodeTexNoise');n.inputs['Scale'].default_value=220;n.inputs['Detail'].default_value=3
    bump=nodes.new('ShaderNodeBump');bump.inputs['Strength'].default_value=.15;bump.inputs['Distance'].default_value=.0008
    links.new(n.outputs['Fac'],bump.inputs['Height']);links.new(bump.outputs['Normal'],s.inputs['Normal'])
    return m
dark=metal('Reworked back — oxidized silver',(.10,.115,.13),.36)
bright=metal('Machined relief edges',(.31,.335,.35),.27)
black=metal('Deep chased recess',(.018,.023,.026),.47)
report={'source':source,'stage':'geometry_refinement_study','art_accepted':False,'source_unchanged':True,'changes':[]}

# Flatten the false inner back relief. Preserve the outer rim and the actual wrapped claws.
edited=0
for obj in originals:
    index=len(obj.data.materials);obj.data.materials.append(dark)
    for v in obj.data.vertices:
        x,y,z=v.co;r=math.hypot(x,z)
        claw=(((x+.34)/.16)**2+((z-.28)/.15)**2<1) or (((x-.34)/.16)**2+((z+.25)/.18)**2<1)
        if y>.035 and r<.431 and not claw:
            t=max(0,min(1,(.431-r)/.035));t=t*t*(3-2*t)
            v.co.y=y*(1-t)+.043*t;edited+=1
    for p in obj.data.polygons:
        center=sum((obj.data.vertices[i].co for i in p.vertices),Vector())/len(p.vertices)
        if center.y>.031 and math.hypot(center.x,center.z)<.429:p.material_index=index
    obj.data.update()
report['changes'].append({'operation':'remove mirror relief from central back, preserve outer claws','vertices_changed':edited})

def curve(name,points,thickness,mat):
    c=bpy.data.curves.new(name,'CURVE');c.dimensions='3D';c.resolution_u=20;c.bevel_depth=thickness;c.bevel_resolution=4
    s=c.splines.new('BEZIER');s.bezier_points.add(len(points)-1)
    for b,p in zip(s.bezier_points,points):b.co=p;b.handle_left_type=b.handle_right_type='AUTO'
    obj=bpy.data.objects.new(name,c);bpy.context.collection.objects.link(obj);obj.data.materials.append(mat);return obj
for radius,width,y in [(.398,.004,.048),(.378,.0018,.047),(.315,.0013,.046)]:
    # Interrupted rings: a designed reverse, not a second dragon face.
    for start,end in [(8,112),(146,286),(315,354)]:
        points=[(radius*math.cos(math.radians(a)),y,radius*math.sin(math.radians(a))) for a in range(start,end+1,3)]
        curve('Interrupted chased silver ring',points,width,bright)
for i in range(48):
    a=2*math.pi*i/48
    if 1.94<a<2.65 or 5.35<a<5.95:continue
    p=[]
    for d,r in [(-.016,.348),(0,.362),(.016,.348)]:p.append((r*math.cos(a+d),.047,r*math.sin(a+d)))
    curve('Hand-cut perimeter scale',p,.0015,bright)

# A volumetric dark garnet eye, framed by physical chased lids and angular brow plates.
gem=bpy.data.materials.new('Garnet reverse eye');gem.use_nodes=True;s=gem.node_tree.nodes.get('Principled BSDF')
s.inputs['Base Color'].default_value=(.095,.0015,.003,1);s.inputs['Metallic'].default_value=.34;s.inputs['Roughness'].default_value=.16
s.inputs['Coat Weight'].default_value=.65;s.inputs['Coat Roughness'].default_value=.08
bpy.ops.mesh.primitive_uv_sphere_add(segments=64,ring_count=24,location=(0,.061,0))
eye=bpy.context.object;eye.name='Reverse eye — solid garnet inset';eye.scale=(.155,.021,.053);eye.data.materials.append(gem)
for p in eye.data.polygons:p.use_smooth=True
for top in [1,-1]:
    curve('Chased hostile lid',[(x,.064,top*(.047*math.sin(math.pi*(x+.17)/.34))) for x in [-.17,-.12,-.06,0,.06,.12,.17]],.009,bright)
curve('Slit carved into reverse garnet',[(0,.083,-.044),(-.003,.084,0),(0,.083,.044)],.0035,black)
for sign in [-1,1]:
    curve('Swept angular reverse brow',[(sign*.19,.048,.087),(sign*.13,.055,.115),(sign*.032,.057,.085)],.012,bright)
    curve('Lower fang flourish',[(sign*.19,.049,-.075),(sign*.145,.05,-.115),(sign*.11,.048,-.15)],.005,bright)
report['changes'].append({'operation':'independent crafted reverse','materials':'oxidized silver, silver chase, dark garnet','symbol':'hostile slit eye','not_a_texture':True})

scene=bpy.context.scene;scene.render.engine='CYCLES';scene.cycles.device='CPU';scene.cycles.samples=24;scene.cycles.use_denoising=True
scene.render.resolution_x=scene.render.resolution_y=1000;scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG';scene.view_settings.view_transform='AgX'
scene.world=bpy.data.worlds.new('Craft studio');scene.world.use_nodes=True
scene.world.node_tree.nodes['Background'].inputs[0].default_value=(.045,.055,.065,1)
scene.world.node_tree.nodes['Background'].inputs[1].default_value=.35
for name,position,energy,size,color in [('Key',(-1.7,-2.3,2.1),180,1.8,(1,.94,.84)),('Fill',(1.7,-1,.4),90,1.5,(.78,.89,1)),('Back key',(-1.2,2.1,1.6),190,1.5,(1,.93,.85))]:
    bpy.ops.object.light_add(type='AREA',location=position);o=bpy.context.object;o.name=name;o.data.energy=energy;o.data.size=size;o.data.color=color;o.rotation_euler=(-o.location).to_track_quat('-Z','Y').to_euler()
bpy.ops.object.camera_add();cam=bpy.context.object;cam.data.type='ORTHO';cam.data.ortho_scale=1.32;scene.camera=cam
bpy.ops.file.pack_all();bpy.ops.wm.save_as_mainfile(filepath=str(out/'refinement-study.blend'))
for name,position in [('back',(.36,3,.12)),('front',(-.2,-3,.12))]:
    cam.location=position;cam.rotation_euler=(-cam.location).to_track_quat('-Z','Y').to_euler()
    scene.render.filepath=str(out/(name+'.png'));bpy.ops.render.render(write_still=True)
report['stage']='study_rendered';(out/'refinement.json').write_text(json.dumps(report,indent=2));print(json.dumps(report))

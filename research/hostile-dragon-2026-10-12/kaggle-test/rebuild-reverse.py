"""Independent reverse sculpt study using Blender's native mesh tools.

Immutable input; no painting a reverse onto the mirrored relief. The study is
never promoted automatically. Original front and protected claw vertices are
checked after native bisect and removal of the false reverse faces.
"""
import bpy,bmesh,sys,math,json,hashlib,time
from pathlib import Path
from mathutils import Vector
source,output=sys.argv[sys.argv.index('--')+1:]
source=str(Path(source).resolve())
out=Path(output).resolve();out.mkdir(parents=True,exist_ok=True)
report={'stage':'starting','source':source,'source_sha256':hashlib.sha256(Path(source).read_bytes()).hexdigest(),'art_accepted':False,'operations':[]}
def save():
    (out/'reverse-study.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
    print(json.dumps(report),flush=True)
save()
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.context.preferences.filepaths.temporary_directory='D:/CodexStorage/tmp/dragon-coin'
bpy.ops.import_scene.gltf(filepath=source)
originals=[o for o in bpy.context.scene.objects if o.type=='MESH']
for obj in originals:
    bpy.context.view_layer.objects.active=obj;obj.select_set(True)
    bpy.ops.object.transform_apply(location=False,rotation=True,scale=True);obj.select_set(False)

def protected(x,y,z):
    # Original wrapped claws in front coordinates. Preserve the original
    # contact volumes rather than cutting the whole object in half.
    return y>.063 and ((((x+.34)/.165)**2+((z-.28)/.16)**2<1) or (((x-.34)/.17)**2+((z+.25)/.19)**2<1))
def signature(vertices,predicate):
    pts=sorted(tuple(round(float(c),7) for c in v.co) for v in vertices if predicate(*v.co))
    return len(pts),hashlib.sha256(repr(pts).encode()).hexdigest()

cut=.037
for obj in originals:
    bm=bmesh.new();bm.from_mesh(obj.data)
    before_front=signature(bm.verts,lambda x,y,z:y<.025)
    before_claws=signature(bm.verts,protected)
    bmesh.ops.bisect_plane(bm,geom=list(bm.verts)+list(bm.edges)+list(bm.faces),dist=1e-7,plane_co=(0,cut,0),plane_no=(0,1,0),clear_inner=False,clear_outer=False)
    false=[]
    for f in bm.faces:
        c=f.calc_center_median()
        if c.y>cut+1e-7 and math.hypot(c.x,c.z)<.436 and not any(protected(*v.co) for v in f.verts):false.append(f)
    bmesh.ops.delete(bm,geom=false,context='FACES')
    # Fill only closed boundaries created at the new cut plane. Do not fill
    # all original breaks or remove disconnected commemorative fragments.
    edges=[e for e in bm.edges if e.is_boundary and all(abs(v.co.y-cut)<2e-6 for v in e.verts)]
    filled=bmesh.ops.holes_fill(bm,edges=edges,sides=0)['faces'] if edges else []
    bm.normal_update()
    after_front=signature(bm.verts,lambda x,y,z:y<.025)
    after_claws=signature(bm.verts,protected)
    if before_front!=after_front or before_claws!=after_claws:raise RuntimeError('Protected original geometry changed')
    report['operations'].append({'native_tools':['bmesh.bisect_plane','bmesh.delete','bmesh.holes_fill'],'removed_false_faces':len(false),'filled_cut_faces':len(filled),'front_unchanged':True,'claw_vertices_unchanged':True})
    bm.to_mesh(obj.data);bm.free();obj.data.update()
report['stage']='false_reverse_removed';save()

def metal(name,color,roughness):
    m=bpy.data.materials.new(name);m.use_nodes=True
    n=m.node_tree.nodes;l=m.node_tree.links;p=n.get('Principled BSDF')
    p.inputs['Base Color'].default_value=(*color,1);p.inputs['Metallic'].default_value=1;p.inputs['Roughness'].default_value=roughness
    # Deliberately subdued polish grain. No macro noise or painted cracks.
    tex=n.new('ShaderNodeTexNoise');tex.inputs['Scale'].default_value=620;tex.inputs['Detail'].default_value=1;tex.inputs['Roughness'].default_value=.38
    ramp=n.new('ShaderNodeMapRange');ramp.inputs['To Min'].default_value=roughness-.025;ramp.inputs['To Max'].default_value=roughness+.025
    l.new(tex.outputs['Fac'],ramp.inputs['Value']);l.new(ramp.outputs['Result'],p.inputs['Roughness'])
    return m
silver=metal('Hand finished antiqued silver',(.34,.315,.275),.32)
field=metal('Satin reverse field',(.23,.215,.19),.43)
recess=metal('Darkened engraved recesses',(.05,.041,.032),.5)
for obj in originals:
    obj.data.materials.clear();obj.data.materials.append(silver)
    for p in obj.data.polygons:p.material_index=0

def activate(obj):
    bpy.ops.object.select_all(action='DESELECT');obj.select_set(True);bpy.context.view_layer.objects.active=obj
def apply(obj,modifier):activate(obj);bpy.ops.object.modifier_apply(modifier=modifier.name)
def curve(name,pts,radius,mat=None):
    c=bpy.data.curves.new(name,'CURVE');c.dimensions='3D';c.resolution_u=24;c.bevel_depth=radius;c.bevel_resolution=3;c.use_fill_caps=True
    s=c.splines.new('BEZIER');s.bezier_points.add(len(pts)-1)
    for b,p in zip(s.bezier_points,pts):b.co=p;b.handle_left_type=b.handle_right_type='AUTO'
    obj=bpy.data.objects.new(name,c);bpy.context.collection.objects.link(obj)
    if mat:obj.data.materials.append(mat)
    return obj
def cylinder(name,radius,depth,y,mat):
    bpy.ops.mesh.primitive_cylinder_add(vertices=256,radius=radius,depth=depth,location=(0,y,0),rotation=(math.pi/2,0,0))
    o=bpy.context.object;o.name=name;o.data.materials.append(mat)
    mod=o.modifiers.new('Rounded die edge','BEVEL');mod.width=.002;mod.segments=3
    apply(o,mod)
    for p in o.data.polygons:p.use_smooth=len(p.vertices)==4
    return o
plate=cylinder('Independent inset reverse blank',.433,.011,.038,field)
# Two narrow lips provide a physical transition into the existing rim; no
# separate thick coin glued to the source. Real claw-contact areas overlap.
for radius in [.416,.424]:
    for start,end in [(3,113),(153,290),(327,357)]:
        curve('Inset transition lip',[(radius*math.cos(math.radians(a)),.0445,radius*math.sin(math.radians(a))) for a in range(start,end+1,3)],.0015,silver)

def relief(name,outline,height,base=.044,mat=silver):
    # A closed artist control mesh, subdivided by Blender. Each silhouette
    # below is chosen explicitly, with a distinct ridge and tapered tip.
    count=len(outline);center=Vector((sum(p[0] for p in outline)/count,sum(p[1] for p in outline)/count))
    verts=[];faces=[]
    for factor,depth in [(1,0),(.91,.25),(.59,.78),(.12,1)]:
        for x,z in outline:
            v=center+(Vector((x,z))-center)*factor
            verts.append((v.x,base+height*depth,v.y))
    for ring in range(3):
        for i in range(count):j=(i+1)%count;faces.append((ring*count+i,ring*count+j,(ring+1)*count+j,(ring+1)*count+i))
    faces.append(tuple(range(3*count,4*count)))
    faces.append(tuple(reversed(range(count))))
    mesh=bpy.data.meshes.new(name);mesh.from_pydata(verts,[],faces);mesh.update()
    o=bpy.data.objects.new(name,mesh);bpy.context.collection.objects.link(o);o.data.materials.append(mat)
    mod=o.modifiers.new('Sculpted rounded control cage','SUBSURF');mod.levels=2;mod.render_levels=2;apply(o,mod)
    # A mirrored silhouette in the xz plane does not determine face normals.
    bm=bmesh.new();bm.from_mesh(o.data);bmesh.ops.recalc_face_normals(bm,faces=list(bm.faces));bm.to_mesh(o.data);bm.free()
    for p in o.data.polygons:p.use_smooth=True
    return o

# Dragon-armour wreath: spaced, deliberately unequal chased plates, with
# readable negative space. No randomly packed micro-scales.
plates=[
 [(-.31,.13),(-.34,.24),(-.27,.32),(-.10,.34),(-.23,.27),(-.26,.18)],
 [(-.26,.19),(-.22,.31),(-.08,.36),(.10,.32),(-.07,.30),(-.18,.22)],
 [(-.12,.24),(-.02,.32),(.17,.31),(.29,.22),(.10,.25),(-.01,.21)],
 [(.05,.22),(.21,.27),(.32,.17),(.36,.02),(.28,.13),(.16,.18)],
 [(.23,.12),(.35,.10),(.37,-.07),(.31,-.21),(.30,-.05),(.25,.035)],
 [(.28,-.04),(.32,-.16),(.23,-.31),(.08,-.35),(.20,-.23),(.24,-.13)],
 [(.17,-.20),(.15,-.33),(-.05,-.35),(-.23,-.27),(-.04,-.29),(.06,-.22)],
 [(-.03,-.23),(-.18,-.29),(-.30,-.19),(-.36,-.05),(-.26,-.16),(-.14,-.20)],
 [(-.23,-.12),(-.35,-.10),(-.36,.045),(-.29,.19),(-.29,.045),(-.25,-.035)],
 [(-.21,.08),(-.23,.17),(-.10,.24),(.065,.23),(-.08,.18),(-.15,.10)],
 [(.025,.17),(.17,.20),(.25,.11),(.28,-.02),(.19,.08),(.12,.12)],
 [(.20,-.07),(.23,-.17),(.11,-.25),(-.055,-.23),(.075,-.18),(.14,-.10)],
 [(-.035,-.17),(-.17,-.22),(-.25,-.115),(-.26,.015),(-.19,-.08),(-.13,-.12)]
]
for i,outline in enumerate(plates):relief('Chased dragon armour %02d'%i,outline,.009 if i<9 else .014)

# A hostile eye is modeled as intersecting lid planes, an engraved pupil
# and a convex iris. There is no luminous gem or separate emoji eyebrow.
eye_outline=[(-.185,.005),(-.12,.042),(-.048,.047),(.05,.028),(.145,-.009),(.184,-.044),(.09,-.065),(-.025,-.065),(-.12,-.035)]
eye=relief('Solid silver ocular relief',eye_outline,.029,base=.045)
upper=[(-.195,.012),(-.122,.067),(-.025,.069),(.075,.039),(.174,-.017),(.149,-.034),(.047,.004),(-.046,.029),(-.13,.018)]
relief('Angular upper socket and lid',upper,.014,base=.067)
lower=[(-.17,-.017),(-.095,-.047),(.016,-.071),(.119,-.067),(.189,-.041),(.174,-.069),(.078,-.093),(-.043,-.087),(-.124,-.051)]
relief('Lower socket undercut',lower,.013,base=.049)
# The pupil is an actual incision into the solid eye, cut with the native
# Boolean modifier. A dark floor is set below the opening, not on top.
pupil=curve('Pupil engraving cutter',[(-.012,.077,-.067),(-.005,.080,-.018),(.009,.077,.031)],.0038)
activate(pupil);bpy.ops.object.convert(target='MESH')
mod=eye.modifiers.new('Deep incuse pupil','BOOLEAN');mod.operation='DIFFERENCE';mod.solver='EXACT';mod.object=pupil;apply(eye,mod)
bpy.data.objects.remove(pupil,do_unlink=True)
curve('Oxidised floor inside pupil',[(-.012,.074,-.060),(-.005,.076,-.018),(.009,.074,.027)],.0014,recess)

# Restrained engraved accents lie within the sculpt, not floating ribbons.
for name,pts in [
 ('Upper armour chase',[(-.28,.051,.24),(-.19,.052,.29),(-.095,.051,.315)]),
 ('Right armour chase',[(.28,.051,.16),(.325,.052,.035),(.322,.051,-.095)]),
 ('Lower armour chase',[(.17,.051,-.265),(.03,.052,-.311),(-.10,.051,-.30)]),
 ('Left armour chase',[(-.29,.051,-.15),(-.323,.052,-.05),(-.316,.051,.045)])
]:
    # These raised chase ridges are intentionally minute, like die detail.
    curve(name,pts,.00085,silver)

report.update(stage='independent_reverse_sculpted',reverse_components=len([o for o in bpy.context.scene.objects if o.type in ['MESH','CURVE']])-len(originals),design='slanted metallic dragon eye within spaced chased armour; satin negative space; preserved wrap-around claws')
save()
scene=bpy.context.scene;scene.render.engine='CYCLES';scene.cycles.device='CPU';scene.cycles.samples=32;scene.cycles.use_denoising=True
scene.render.resolution_x=scene.render.resolution_y=1100;scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG';scene.view_settings.view_transform='AgX'
scene.world=bpy.data.worlds.new('Licensed studio HDRI');scene.world.use_nodes=True
nodes=scene.world.node_tree.nodes;links=scene.world.node_tree.links
hdr=nodes.new('ShaderNodeTexEnvironment');hdr.image=bpy.data.images.load(str(Path(__file__).resolve().parent/'inputs/studio/studio_small_09_2k.hdr'));links.new(hdr.outputs['Color'],nodes['Background'].inputs['Color']);nodes['Background'].inputs['Strength'].default_value=.45
for name,pos,energy,size in [('Large photographic key',(-1.5,2.5,1.8),120,1.5),('Rim softbox',(1.4,-1.5,.8),100,1.1)]:
    bpy.ops.object.light_add(type='AREA',location=pos);o=bpy.context.object;o.name=name;o.data.energy=energy;o.data.size=size;o.rotation_euler=(-o.location).to_track_quat('-Z','Y').to_euler()
bpy.ops.object.camera_add();cam=bpy.context.object;cam.data.type='ORTHO';cam.data.ortho_scale=1.22;scene.camera=cam
bpy.ops.file.pack_all();bpy.ops.wm.save_as_mainfile(filepath=str(out/'reverse-master.blend'))
mesh_objects=[o for o in bpy.context.scene.objects if o.type in ['MESH','CURVE']]
bpy.ops.object.select_all(action='DESELECT')
for o in mesh_objects:o.select_set(True)
bpy.ops.export_scene.gltf(filepath=str(out/'hostile-dragon-reverse-study.glb'),export_format='GLB',use_selection=True,export_apply=True)
clay=bpy.data.materials.new('Geometry inspection clay');clay.use_nodes=True;clay.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value=(.36,.36,.36,1);clay.node_tree.nodes['Principled BSDF'].inputs['Roughness'].default_value=.72
for name,pos,mode in [('back',(0,3,.10),'pbr'),('back-quarter',(.9,3,.12),'pbr'),('side',(3,.25,.1),'pbr'),('front',(0,-3,.1),'pbr'),('back-clay',(0,3,.1),'clay')]:
    scene.view_layers[0].material_override=clay if mode=='clay' else None
    cam.location=pos;cam.rotation_euler=(-cam.location).to_track_quat('-Z','Y').to_euler();scene.render.filepath=str(out/(name+'.png'))
    bpy.ops.render.render(write_still=True)
    report.setdefault('views',[]).append(name+'.png');save()
report['stage']='study_ready_for_review';save()

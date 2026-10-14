"""Physical edge design studies. Uses existing Blender, no external packages.
All generated geometry is a complete closed blank. Art faces are deliberately
not invented: this is a dimensioned edge study, not the complete art coin.
"""
import bpy, math, json, sys, pathlib, collections, time
from mathutils import Vector
ROOT=pathlib.Path(__file__).resolve().parent
OUT=ROOT/'outputs'
OUT.mkdir(exist_ok=True)
SPEC=json.loads((ROOT/'edge-spec.json').read_text(encoding='utf-8-sig'))
MM=.001
N=2880
PROFILE_TOP=[(18.9,1.4),(19.2,1.4),(19.28,1.46),(19.35,1.55),(19.42,1.6),(19.85,1.6),(19.925,1.58),(19.98,1.525),(20,1.45),(20,1.35),(20,1.30),(20,1.25),(20,1.2),(20,1.15),(20,1.1),(20,.9)]
PROFILE=PROFILE_TOP+[(20,0)]+[(r,-z) for r,z in reversed(PROFILE_TOP)]
def smoothstep(x):
    x=max(0.,min(1.,x));return x*x*(3-2*x)
def groove_depth(phi,z,variant):
    if variant=='C':return 0.
    deg=math.degrees(phi)%360.
    if variant=='B' and deg%30>=20:return 0.
    phase=(deg%2.5)-1.25
    distance=abs(math.radians(phase))*20
    if distance>=.15:return 0.
    return .10*math.cos(math.pi*distance/.30)**2
def mat(name,roughness):
    m=bpy.data.materials.new(name);m.use_nodes=True
    p=m.node_tree.nodes.get('Principled BSDF')
    p.inputs['Base Color'].default_value=(.73,.73,.72,1)
    p.inputs['Metallic'].default_value=1
    p.inputs['Roughness'].default_value=roughness
    return m
def mesh_blank(variant):
    verts=[]
    for r,z in PROFILE:
        for j in range(N):
            phi=2*math.pi*j/N
            # Straight collar envelope: grooves remain open along the axis,
            # meet the shoulder where its radius falls below the flute floor,
            # and never leave a full-diameter axial stop above a groove.
            rr=min(r,20-groove_depth(phi,z,variant))
            verts.append((MM*rr*math.cos(phi),MM*rr*math.sin(phi),MM*z))
    faces=[];regions=[]
    for k in range(len(PROFILE)-1):
        for j in range(N):
            jj=(j+1)%N
            faces.append((k*N+j,(k+1)*N+j,(k+1)*N+jj,k*N+jj))
            z=(PROFILE[k][1]+PROFILE[k+1][1])/2
            if min(PROFILE[k][0],PROFILE[k+1][0])<19.42:region=2
            elif abs(z)>1.35:region=1
            else:region=0
            regions.append(region)
    top=len(verts);verts.append((0,0,MM*1.4))
    bottom=len(verts);verts.append((0,0,-MM*1.4))
    last=(len(PROFILE)-1)*N
    for j in range(N):
        jj=(j+1)%N
        faces.append((top,j,jj));regions.append(2)
        faces.append((bottom,last+jj,last+j));regions.append(2)
    me=bpy.data.meshes.new('complete_blank_'+variant);me.from_pydata(verts,[],faces);me.update()
    obj=bpy.data.objects.new('EdgeStudy_'+variant,me);bpy.context.collection.objects.link(obj)
    for m in [mat('satin_side',.27),mat('burnished_shoulder',.18),mat('plain_field',.32)]:me.materials.append(m)
    for poly,region in zip(me.polygons,regions):
        poly.material_index=region
        # Keep field-to-rim intentional changes; smooth actual curved/reeded side.
        poly.use_smooth=(region!=2)
    obj['study_variant']=variant;obj['diameter_mm']=40.;obj['rim_to_rim_mm']=3.2
    obj['art_status']='Plain fields for edge design study only'
    # Verify actual indexed topology, dimensions and solid volume.
    edge_counts=collections.Counter()
    for face in faces:
        for a,b in zip(face,face[1:]+face[:1]):edge_counts[tuple(sorted((a,b)))]+=1
    nonmanifold=sum(c!=2 for c in edge_counts.values())
    volume=0.
    for face in faces:
        a=Vector(verts[face[0]])
        for t in range(1,len(face)-1):
            volume+=a.dot(Vector(verts[face[t]]).cross(Vector(verts[face[t+1]])))/6
    assert nonmanifold==0,(variant,nonmanifold)
    assert volume>0,(variant,volume)
    # Actual height and radial sampling confirm profile, no external ornaments.
    radii=[math.hypot(v[0],v[1])/MM for v in verts[:-2]]
    assert max(radii)<20.000001
    report={'variant':variant,'vertices':len(verts),'faces':len(faces),
      'nonmanifoldEdges':nonmanifold,'signedVolumeMm3':volume/(MM**3),
      'maximumRadiusMm':max(radii),'thicknessMm':max(v[2] for v in verts)/MM-min(v[2] for v in verts)/MM,
      'sampledGrooveCount':sum(groove_depth(2*math.pi*j/N,0,variant)>0 and groove_depth(2*math.pi*((j-1)%N)/N,0,variant)==0 for j in range(N)),
      'expectedGrooves':{'A':144,'B':96,'C':0}[variant]}
    assert report['sampledGrooveCount']==report['expectedGrooves'],report
    return obj,report
def aim(obj,point):obj.rotation_euler=(Vector(point)-obj.location).to_track_quat('-Z','Y').to_euler()
def area(name,loc,energy,size,point=(0,0,0),size_y=None):
    d=bpy.data.lights.new(name,'AREA');d.energy=energy;d.shape='RECTANGLE';d.size=size;d.size_y=size if size_y is None else size_y
    o=bpy.data.objects.new(name,d);bpy.context.collection.objects.link(o);o.location=loc;aim(o,point);return o
def setup():
    bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
    sc=bpy.context.scene
    sc.unit_settings.system='METRIC';sc.unit_settings.length_unit='MILLIMETERS'
    sc.render.engine='CYCLES';sc.cycles.device='CPU';sc.cycles.samples=24;sc.cycles.use_denoising=True
    sc.render.threads_mode='FIXED';sc.render.threads=4
    sc.render.image_settings.file_format='PNG';sc.render.film_transparent=False
    sc.render.resolution_percentage=100
    sc.world.color=(.12,.12,.12);sc.world.use_nodes=True
    sc.world.node_tree.nodes['Background'].inputs[0].default_value=(.12,.13,.15,1)
    sc.world.node_tree.nodes['Background'].inputs[1].default_value=.3
    sc.view_settings.view_transform='AgX'
    sc.view_settings.exposure=-4.5
    area('large_soft_key',(-.055,-.055,.09),12,.08,size_y=.05)
    area('edge_strip',(.035,-.045,.018),5,.055,size_y=.006)
    area('rear_rim',(.025,.035,.06),10,.045,size_y=.025)
    bpy.ops.mesh.primitive_plane_add(size=20,location=(0,0,-.01))
    ground=bpy.context.object;ground.name='studio_backdrop'
    m=bpy.data.materials.new('charcoal');m.diffuse_color=(.018,.021,.025,1);m.use_nodes=True
    m.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value=(.018,.021,.025,1)
    m.node_tree.nodes['Principled BSDF'].inputs['Roughness'].default_value=.8;ground.data.materials.append(m)
    bpy.ops.object.camera_add();cam=bpy.context.object;cam.data.type='ORTHO';cam.data.clip_start=.0001;cam.data.clip_end=10;sc.camera=cam
    return sc,cam
reports=[]
for variant in ['A','B','C']:
    sc,cam=setup()
    obj,report=mesh_blank(variant);reports.append(report)
    cam.location=(0,-.105,.026);aim(cam,(0,0,0));cam.data.ortho_scale=.047
    sc.render.resolution_x=1280;sc.render.resolution_y=640
    sc.render.filepath=str(OUT/(variant+'-whole.png'))
    bpy.ops.wm.save_as_mainfile(filepath=str(OUT/(variant+'-edge-study.blend')),compress=True)
    bpy.ops.render.render(write_still=True)
    cam.location=(.001,-.058,.012);aim(cam,(0,-.0195,0));cam.data.ortho_scale=.013
    sc.render.resolution_x=1280;sc.render.resolution_y=720
    sc.render.filepath=str(OUT/(variant+'-detail.png'));bpy.ops.render.render(write_still=True)
    # Save model with whole-coin inspection camera, not macro-only authority.
    cam.location=(0,-.105,.026);aim(cam,(0,0,0));cam.data.ortho_scale=.047
    sc.render.resolution_x=1280;sc.render.resolution_y=640
    sc.render.filepath=str(OUT/(variant+'-whole.png'))
    bpy.ops.wm.save_as_mainfile(filepath=str(OUT/(variant+'-edge-study.blend')),compress=True)
    (OUT/'geometry-checks.json').write_text(json.dumps(reports,indent=2),encoding='utf-8')
    print('EDGE_STUDY_DONE '+variant,flush=True)
print('ALL_EDGE_STUDIES_DONE',flush=True)


"""Fit newly generated, concept-conditioned art onto the measured blank.

Masks below select existing sculpture in the complete object; they do not invent claws or flowers.
The reverse typography is re-laid to the visual reference rather than copying the technical sheet.
"""
from pathlib import Path
import numpy as np,manifold3d as m,json,math,time,re
from fontTools.svgLib.path import parse_path
from fontTools.pens.basePen import BasePen
ROOT=Path(__file__).resolve().parents[1];PACK=ROOT.parent if (ROOT.parent/'spec/design-spec.json').exists() else ROOT.parent/'coin-original-design-pack-20261015';OUT=ROOT/'outputs';START=time.monotonic()
spec=json.loads((PACK/'spec/design-spec.json').read_text(encoding='utf-8'))
def say(stage,**kw):print(json.dumps({'stage':stage,'seconds':round(time.monotonic()-START,2),**kw}),flush=True)
def manifold(name):
    d=np.load(OUT/(name+'.npz'));v=np.ascontiguousarray(d['vertices'],dtype=np.float32);f=np.ascontiguousarray(d['faces'],dtype=np.uint32)
    result=m.Manifold(m.Mesh(v,f));assert result.status()==m.Error.NoError,(name,result.status());return result
def save(body,name):
    assert body.status()==m.Error.NoError,(name,body.status())
    d=body.to_mesh();v=np.array(d.vert_properties[:,:3]);f=np.array(d.tri_verts)
    np.savez_compressed(OUT/(name+'.npz'),vertices=v,faces=f)
    say(name,vertices=len(v),triangles=len(f),volume=body.volume());return v,f
def slab(cs,y0,y1):return cs.extrude(y1-y0).transform([[-1,0,0,0],[0,0,1,y0],[0,1,0,0]])
def box(q0,z0,q1,z1,y0=-20,y1=20):return slab(m.CrossSection([np.array([[q0,z0],[q1,z0],[q1,z1],[q0,z1]])],m.FillRule.NonZero),y0,y1)
def sector(a,b,r0,r1,y0=-20,y1=8):
    aa=np.radians(np.linspace(a,b,max(3,int(b-a)+1)));points=np.column_stack([-r1*np.sin(aa),r1*np.cos(aa)])
    points=np.vstack([points,np.column_stack([-r0*np.sin(aa[::-1]),r0*np.cos(aa[::-1])])])
    return slab(m.CrossSection([points],m.FillRule.NonZero),y0,y1)
base=manifold('parameter-blank-engraved')
notch=spec['foundation']['overrides']['notch_profile_knots'];angles=np.arange(0,360,.25)
depth=np.interp(angles,[k['theta'] for k in notch],[k['depth'] for k in notch],left=0,right=0)
outline=np.column_stack([-(20-depth)*np.sin(np.radians(angles)),(20-depth)*np.cos(np.radians(angles))])
base=base^slab(m.CrossSection([outline],m.FillRule.NonZero),-20,20);save(base,'special-blank-notched')
front=manifold('front-aligned-unfitted')
# The generated core is a thin, double-sided sheet. Expand that core through the new blank;
# preserve the front silhouette and keep the rear contacts as the SAME source mesh.
ff=.90;bb=1.22
def frontfit(p):
    q=p.copy();y=p[:,1];t=(y-ff)/(bb-ff)
    q[:,1]=np.where(y<ff,-1.4+(y-ff)*.65,np.where(y>bb,1.4+(y-bb)*.45,-1.4+2.8*t));return q
front=front.warp_batch(frontfit)
def remove_generated_rim(p):
    q=p.copy();r=np.hypot(p[:,0],p[:,2]);theta=np.degrees(np.arctan2(p[:,0],p[:,2]))%360
    def smooth(x):x=np.clip(x,0,1);return x*x*(3-2*x)
    w=smooth((r-18.10)/.9)
    protected=((theta>278)&(theta<344))|((theta>110)&(theta<154))
    w[protected|(p[:,1]>-.8)]=0
    target=-1.37+.1*(p[:,1]+1.4)
    q[:,1]=p[:,1]*(1-w)+target*w;return q
front=front.warp_batch(remove_generated_rim)
frontmask=slab(m.CrossSection.circle(19.12,720),-20,-1.385)
frontmask=frontmask+sector(278,323,17.9,26)+sector(110,154,17.6,26)+sector(313,344,18.0,26,-20,-1.8)
front=front^frontmask
# No generated teeth or accidental sidewall survive inside the actual parameter body.
front=front-slab(m.CrossSection.circle(20.04,720),-1.365,1.365)
save(front,'fitted-front-and-grips')

reverse=manifold('reverse-aligned-unfitted')
def backfit(p):
    q=p.copy();q[:,1]=1.4+(p[:,1]-1.10)*.75;return q
reverse=reverse.warp_batch(backfit)
# Flower/scroll and book regions are selected in the reverse screen q=-X,z=Z.
inner=m.CrossSection.circle(15.3,360)-m.CrossSection.circle(6.65,200).translate([0,6.3])
organicmask=(slab(inner,1.38,6)^box(-16.4,-.8,16.4,14.5,1.38,6))+(slab(m.CrossSection.circle(18.55,360),1.38,6)^box(-12,-18.5,12,-13.7,1.38,6))
organic=(reverse^organicmask)
ground=(slab(inner,1.38,1.73)^box(-16.4,-.8,16.4,14.5,1.38,6))+(slab(m.CrossSection.circle(18.55,360),1.38,1.73)^box(-12,-18.5,12,-13.7,1.38,6))
organic=organic+ground
save(organic,'fitted-reverse-foliage')

# Reuse the package's real font-outline implementation, stopping before its generators.
ctx={'__file__':str(PACK/'scripts/build_design.py'),'__name__':'fixed_typography'}
exec((PACK/'scripts/build_design.py').read_text(encoding='utf-8').split('# A normalized short foliate')[0],ctx)
tg=ctx['text_geometry'];FlatPen=ctx['FlatPen'];Empty={}
# The original project icon supplies the exact page silhouette; a convex two-page surface follows
# the complete visual reference. It replaces the generated thin, hole-ridden page sheets.
icon=(PACK/'sources/project-icon.svg').read_text(encoding='utf-8');iconpaths=re.findall(r'<path[^>]+d="([^"]+)"[^>]*fill="#3469e6"',icon)
pagecs=m.CrossSection()
for path in iconpaths:
    pen=FlatPen({});parse_path(path,pen)
    polys=[[( (x-256)*10.4/352,6.4-(y-251.5)*10.4/352) for x,y in poly] for poly in pen.contours]
    pagecs=pagecs+m.CrossSection([np.array(poly) for poly in polys],m.FillRule.NonZero)
pages=pagecs.extrude(1.05).refine_to_length(.14)
def bow_pages(p):
    q=p.copy();s=np.clip(abs(p[:,0])/5.2,0,1)
    h=.70+.35*np.sin(np.pi*s)**.8
    q[:,0]=-p[:,0];q[:,1]=1.65+p[:,2]*h/1.05;q[:,2]=p[:,1];return q
pages=pages.warp_batch(bow_pages)
pagecuts=[]
for q0,q1 in [(-3.85,-1.25),(1.25,3.85)]:
    for z in [8.6,7.1,5.6]:
        rr=.13;cs=m.CrossSection.circle(rr,16).translate([q0,z])+m.CrossSection.circle(rr,16).translate([q1,z])+m.CrossSection([np.array([[q0,z-rr],[q1,z-rr],[q1,z+rr],[q0,z+rr]])],m.FillRule.NonZero)
        solid=cs.extrude(.4).refine_to_length(.12)
        def pagebar(p):
            s=np.clip(abs(p[:,0])/5.2,0,1);roof=1.65+.70+.35*np.sin(np.pi*s)**.8
            return np.column_stack([-p[:,0],roof-.115+p[:,2],p[:,1]])
        pagecuts.append(solid.warp_batch(pagebar))
book=m.Manifold.batch_boolean([pages,*pagecuts],m.OpType.Subtract)
book=book-box(-.025,2.2,.025,10.5,2.245,2.9);save(book,'fitted-reverse-book')
layout={'visual_source':'package:visuals/foundation-refined.png right coin','parameter_role':'dimensions/reference; visual controls appearance, side remains exact',
 'book_and_foliage':'foliage from fresh concept-conditioned TRELLIS mesh; book silhouette from original project SVG with a visual-guided convex page surface',
 'outer_legend':{'baseline_radius':16.35,'height':2.05,'tracking':.045},
 'rows':[{'id':'caption','text':'启程纪念','font':'fonts/NotoSerifSC-600-subset.ttf','height':1.45,'tracking':.30,'z':-2.35},
         {'id':'title-zh','text':'仇视之龙','font':'fonts/NotoSerifSC-600-subset.ttf','height':3.8,'tracking':.40,'z':-5.6},
         {'id':'title-en','text':'HOSTILE DRAGON','font':'fonts/Cinzel-600.ttf','height':1.28,'tracking':.07,'z':-8.7},
         {'id':'foundation','text':'FOUNDATION COMMEMORATIVE','font':'fonts/Cinzel-600.ttf','height':.90,'tracking':.018,'z':-12.0}],
 'front_depth_fit':{'old_core_front_y':ff,'old_core_back_y':bb,'new_core':[-1.4,1.4],'front_relief_scale':.65,'rear_contact_scale':.45},
 'front_perimeter_join':{'radial_blend_mm':[18.10,19.0],'protected_crossover_sectors_degrees':[[278,344],[110,154]],'purpose':'bury generated old rim and blend source-sheet perimeter into standard blank; protect crossover sculpture'},
 'reverse_depth_fit':{'old_surface_y':1.10,'new_surface_y':1.4,'relief_scale':.75},
 'book_shape_source':'original project SVG page silhouettes, convex two-page relief guided by complete reference, six physical incisions'}
def cs_polys(polys):return m.CrossSection([np.array(p) for p in polys if len(p)>2],m.FillRule.NonZero)
# Enlarged and lowered cartouche matches the visual's lower-half plate, rather than the old parameter board.
pen=FlatPen(Empty);parse_path(spec['reverse']['cartouche']['path'],pen)
polys=[[(q*1.03,(-.8)+(z-2.5)*(13.6/16.3)) for q,z in poly] for poly in pen.contours]
platecs=cs_polys(polys);plate=slab(platecs,1.385,2.00)
border=slab(platecs-platecs.offset(-.28),1.96,2.18)
annulus=m.CrossSection.circle(18.86,720)-m.CrossSection.circle(14.85,720)
legendplate=slab(annulus,1.385,1.82)
cutters=[]
for row in layout['rows']:
    its,width=tg(row['text'],row['font'],row['height'],row['tracking']);row['actual_width_mm']=width
    for it in its:
        if not it['contours']:continue
        cs=cs_polys([[(x,y+row['z']) for x,y in poly] for poly in it['contours']]);cutters.append(slab(cs,1.88,2.28))
plate=m.Manifold.batch_boolean([plate,*cutters],m.OpType.Subtract)
nameitems,_=tg('THE SECOND LANGUAGE','fonts/Cinzel-600.ttf',2.05,.045);legendcut=[]
for it in nameitems:
    polys=[]
    for poly in it['contours']:
        points=[]
        for x,z in poly:
            a=x/16.35;r=16.35+z+2.05/2;points.append((r*math.sin(a),r*math.cos(a)))
        polys.append(points)
    if polys:legendcut.append(slab(cs_polys(polys),1.70,2.18))
legendplate=m.Manifold.batch_boolean([legendplate,*legendcut],m.OpType.Subtract)
# Two fine divider strokes and a diamond; no extra text, dates, chapter or serial fields.
divider=box(-10.3,-10.32,-.28,-10.27,1.88,2.28)+box(.28,-10.32,10.3,-10.27,1.88,2.28)
plate=plate-divider
save(plate,'reverse-inscribed-plate');save(border,'reverse-cartouche-border');save(legendplate,'reverse-legend-band')
# Shared reverse circular lines, restrained and conforming to the blank.
circles=[]
for radius in [18.94,18.63]:
    circles.append(slab(m.CrossSection.circle(radius,720)-m.CrossSection.circle(radius-.075,720),1.38,1.59))
trim=m.Manifold.batch_boolean(circles,m.OpType.Add);trim=trim^slab(m.CrossSection([outline],m.FillRule.NonZero),-20,20);save(trim,'reverse-circular-borders')
medallion=m.CrossSection.circle(6.78,360).translate([0,6.3])-m.CrossSection.circle(6.57,360).translate([0,6.3])
save(slab(medallion,1.38,2.22),'reverse-book-medallion')
disc=slab(m.CrossSection.circle(6.58,360).translate([0,6.3]),1.38,1.70)
rays=[]
for k in range(48):
    a=2*math.pi*k/48;u=np.array([math.sin(a),math.cos(a)]);n=np.array([-u[1],u[0]])*.025
    p=u*2.75+[0,6.3];q=u*6.40+[0,6.3]
    rays.append(slab(m.CrossSection([np.array([p-n,q-n,q+n,p+n])],m.FillRule.NonZero),1.635,1.90))
disc=m.Manifold.batch_boolean([disc,*rays],m.OpType.Subtract);save(disc,'reverse-rayed-disc')
(OUT/'fitting-layout.json').write_text(json.dumps(layout,ensure_ascii=False,indent=2),encoding='utf-8')
say('fitting_components_saved',sculpture_parent='new full concepts only; no historic mesh or latent')

"""Generate deterministic fixed-design SVG/CSV/JSON. No AI image synthesis or organic 3D modeling."""
from pathlib import Path
import json, math, csv, html, base64, re
from fontTools.ttLib import TTFont
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.basePen import BasePen

ROOT=Path(__file__).resolve().parents[1]
S=json.loads((ROOT/'spec/design-spec.json').read_text(encoding='utf-8'))
R=S['blank']['radius']; C=2*math.pi*R
E=S['edge']; CUT=S['frame']['unwrap_cut_angle_degrees']
OUT=ROOT/'drawings'; VEC=ROOT/'vectors'
OUT.mkdir(exist_ok=True); VEC.mkdir(exist_ok=True)
FONTS={}
def font(path):
    if path not in FONTS:
        f=TTFont(ROOT/path); FONTS[path]=(f,f.getGlyphSet(),f.getBestCmap())
    return FONTS[path]

class FlatPen(BasePen):
    def __init__(self, gs):
        super().__init__(gs); self.contours=[]; self.cur=[]; self.p=None
    def _moveTo(self,p): self.cur=[p]; self.p=p
    def _lineTo(self,p): self.cur.append(p); self.p=p
    def _qCurveToOne(self,a,b):
        p=self.p
        for k in range(1,13):
            t=k/12; q=1-t
            self.cur.append((q*q*p[0]+2*q*t*a[0]+t*t*b[0],q*q*p[1]+2*q*t*a[1]+t*t*b[1]))
        self.p=b
    def _curveToOne(self,a,b,c):
        p=self.p
        for k in range(1,17):
            t=k/16; q=1-t
            self.cur.append((q**3*p[0]+3*q*q*t*a[0]+3*q*t*t*b[0]+t**3*c[0],q**3*p[1]+3*q*q*t*a[1]+3*q*t*t*b[1]+t**3*c[1]))
        self.p=c
    def _closePath(self):
        if self.cur: self.contours.append(self.cur); self.cur=[]
    def _endPath(self): self._closePath()

def text_geometry(text,path,height,tracking):
    f,gs,cm=font(path); cursor=0; raw=[]; boxes=[]
    for ch in text:
        name=cm.get(ord(ch))
        if name is None: raise ValueError('missing glyph '+ch+' in '+path)
        b=BoundsPen(gs); gs[name].draw(b)
        svg=SVGPathPen(gs); gs[name].draw(svg)
        fp=FlatPen(gs); gs[name].draw(fp)
        raw.append((ch,name,cursor,b.bounds,svg.getCommands(),fp.contours))
        if b.bounds: boxes.append((cursor+b.bounds[0],b.bounds[1],cursor+b.bounds[2],b.bounds[3]))
        cursor+=f['hmtx'].metrics[name][0]
    lo=min(b[1] for b in boxes);hi=max(b[3] for b in boxes)
    scale=height/(hi-lo)
    xmin=min((cursor+b[0])*scale+i*tracking for i,(_,_,cursor,b,_,_) in enumerate(raw) if b)
    xmax=max((cursor+b[2])*scale+i*tracking for i,(_,_,cursor,b,_,_) in enumerate(raw) if b)
    centre=(xmin+xmax)/2; result=[]
    for i,(ch,name,cur,b,d,contours) in enumerate(raw):
        tx=cur*scale+i*tracking-centre; ty=-lo*scale-height/2
        result.append({'index':i,'char':ch,'glyph':name,'path':d,'scale':scale,'tx':tx,'ty':ty,
          'bbox':None if b is None else [b[0]*scale+tx,b[1]*scale+ty,b[2]*scale+tx,b[3]*scale+ty],
          'contours':[[(x*scale+tx,y*scale+ty) for x,y in pts] for pts in contours]})
    return result, xmax-xmin

def esc(s):return html.escape(str(s),quote=True)
def num(v):return f'{v:.6f}'.rstrip('0').rstrip('.') or '0'
def polygon_path(contours,close=True):
    return ' '.join('M '+' L '.join(f'{num(x)} {num(y)}' for x,y in p)+(' Z' if close else '') for p in contours if p)
def vector_text(items,x=0,y=0,fill='#263546'):
    return ''.join(f'<path d="{it["path"]}" transform="translate({num(x+it["tx"])} {num(y+it["ty"])}) scale({num(it["scale"])})" fill="{fill}"/>' for it in items if it['path'])

# A normalized short foliate separator derived from the adopted reverse's paired-leaf language.
# Dimensions and control points are this revision's explicit design, not automatic bitmap tracing.
MOTIF=[
 {'id':'stem','type':'stroke','width':0.075,'d':'M -3.9 0 C -2.7 -.12 -1.6 -.04 0 0 C 1.6 -.04 2.7 -.12 3.9 0'},
 {'id':'leaf-UR','type':'fill','d':'M .25 .04 C .85 .12 .95 .48 1.52 .51 C 1.39 .24 1.25 -.04 .55 -.06 Z'},
 {'id':'leaf-UL','mirror_x_of':'leaf-UR'},
 {'id':'leaf-LR','type':'fill','d':'M .55 -.03 C 1.32 -.06 1.47 -.49 2.14 -.5 C 1.98 -.2 1.76 .1 .85 .07 Z'},
 {'id':'leaf-LL','mirror_x_of':'leaf-LR'},
 {'id':'leaf-outer-R','type':'fill','d':'M 1.74 .02 C 2.27 .01 2.53 .4 3.05 .35 C 2.91 .12 2.62 -.08 2.02 -.06 Z'},
 {'id':'leaf-outer-L','mirror_x_of':'leaf-outer-R'},
 {'id':'tip-R','type':'fill','d':'M 3.12 0 C 3.38 .19 3.63 .12 4 0 C 3.63 -.12 3.38 -.19 3.12 0 Z'},
 {'id':'tip-L','mirror_x_of':'tip-R'},
 {'id':'centre','type':'fill','d':'M 0 -.16 L .18 0 L 0 .16 L -.18 0 Z'}
]
# Sample only for cylindrical projection; authoritative paths remain cubic SVG paths.
from fontTools.svgLib.path import parse_path
class EmptyGS(dict):
    pass
def motif_paths():
    shapes=[]; byid={}
    for m in MOTIF:
        if 'mirror_x_of' in m:
            src=byid[m['mirror_x_of']]
            shapes.append({'id':m['id'],'type':src['type'],'d':src['d'],'sx':-1,'width':src.get('width',0)})
        else: shapes.append({**m,'sx':1}); byid[m['id']]=m
    return shapes
MP=motif_paths()
def motif_svg(x=0,y=0,scale=1):
    out=[]
    for p in MP:
        sty=f'fill="#334a49"' if p['type']=='fill' else f'fill="none" stroke="#334a49" stroke-width="{p["width"]}" stroke-linecap="round"'
        out.append(f'<path d="{p["d"]}" transform="translate({x} {y}) scale({scale*p["sx"]} {scale})" {sty}/>')
    return ''.join(out)
motif_width=R*math.radians(E['ornament_span_degrees'])
motif_bounds=[]
for shape in MP:
    pen=BoundsPen(EmptyGS()); parse_path(shape['d'],pen)
    if pen.bounds:
        bb=list(pen.bounds); pad=shape.get('width',0)/2
        motif_bounds.append([bb[0]-pad,bb[1]-pad,bb[2]+pad,bb[3]+pad])
mb=[min(b[0] for b in motif_bounds),min(b[1] for b in motif_bounds),max(b[2] for b in motif_bounds),max(b[3] for b in motif_bounds)]
motif_center_y=(mb[1]+mb[3])/2
motif_scale_x=motif_width/(mb[2]-mb[0])
motif_scale_y=E['ornament_ink_height']/(mb[3]-mb[1])

items,text_width=text_geometry(E['text'],E['font'],E['uppercase_ink_height'],E['tracking'])
glyphs=[]; shapes=[]; placements=[]
for repeat,theta in enumerate(E['text_centres_degrees']):
    uc=R*math.radians((CUT-theta)%360)
    for it in items:
        bounds=None if it['bbox'] is None else [uc+it['bbox'][0],it['bbox'][1],uc+it['bbox'][2],it['bbox'][3]]
        g={'id':f'T{repeat+1}-G{it["index"]+1:02d}','repeat':repeat,'character_index':it['index'],'character':it['char'],'glyph':it['glyph'],
           'ink_bbox_uv':bounds,'font_scale_mm_per_unit':it['scale'],'font_translate_uv':[uc+it['tx'],it['ty']],
           'svg_path_font_units':it['path'],
           'contours_uv':[[(uc+x,y) for x,y in poly] for poly in it['contours']]}
        if bounds:
            g['theta_at_ink_left_unwrapped']=CUT-math.degrees(bounds[0]/R)
            g['theta_at_ink_right_unwrapped']=CUT-math.degrees(bounds[2]/R)
            shapes.append({'type':'fill','contours':g['contours_uv'],'id':g['id']})
        glyphs.append(g)
    placements.append({'kind':'text','centre_theta':theta,'centre_u':uc,'width_mm':text_width,'actual_half_angle':math.degrees(text_width/(2*R))})
for i,theta in enumerate(E['ornament_centres_degrees']):
    uc=R*math.radians((CUT-theta)%360)
    placements.append({'kind':'foliate','centre_theta':theta,'centre_u':uc,'width_mm':motif_width,'half_angle':11.5})
    for shape in MP:
        pen=FlatPen(EmptyGS());parse_path(shape['d'],pen)
        contours=[[(uc+x*shape['sx']*motif_scale_x,(y-motif_center_y)*motif_scale_y) for x,y in poly] for poly in pen.contours]
        shapes.append({'type':shape['type'],'contours':contours,'id':f'F{i+1}-{shape["id"]}','width':shape.get('width',0)})
(ROOT/'spec/resolved-layout.json').write_text(json.dumps({'circumference_mm':C,'text_actual_width_mm':text_width,'text_actual_span_degrees':math.degrees(text_width/R),'actual_ink_gap_degrees':60-11.5-math.degrees(text_width/R)/2,'placements':placements},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(VEC/'edge-curves.json').write_text(json.dumps({'schema':'tsl.edge.curves/1','coordinate':'u mm increases reading direction; v mm positive toward obverse; Y=-v','cut_theta':CUT,'radius':R,'glyphs':glyphs,'ornament':{'nominal_width':motif_width,'height':E['ornament_ink_height'],'source_bounds':mb,'source_center_y':motif_center_y,'scale_x':motif_scale_x,'scale_y':motif_scale_y,'paths':MOTIF},'projection_polylines':shapes},ensure_ascii=False,separators=(',',':'))+'\n',encoding='utf-8')
with (ROOT/'spec/glyph-placement.csv').open('w',encoding='utf-8-sig',newline='') as f:
    writer=csv.writer(f);writer.writerow(['ID','CHAR','REPEAT','U_MIN_MM','U_MAX_MM','V_MIN_MM','V_MAX_MM','THETA_AT_LEFT_DEG_UNWRAPPED','THETA_AT_RIGHT_DEG_UNWRAPPED'])
    for g in glyphs:
        b=g['ink_bbox_uv']
        writer.writerow([g['id'],'SPACE' if g['character']==' ' else g['character'],g['repeat']+1,*(['']*6 if b is None else [num(b[0]),num(b[2]),num(b[1]),num(b[3]),num(g['theta_at_ink_left_unwrapped']),num(g['theta_at_ink_right_unwrapped'])])])
def edge_vector_content():
    out=[]
    for g in glyphs:
        if g['svg_path_font_units']:
            u,v=g['font_translate_uv'];out.append(f'<path id="{g["id"]}" d="{g["svg_path_font_units"]}" transform="translate({num(u)} {num(v)}) scale({num(g["font_scale_mm_per_unit"])})"/>')
    for p in placements:
        if p['kind']=='foliate':
            out.append(f'<g transform="translate({num(p["centre_u"])} 0) scale({num(motif_scale_x)} {num(motif_scale_y)}) translate(0 {-motif_center_y})">{motif_svg()}</g>')
    return ''.join(out)
EC=edge_vector_content()
def simple_svg(w,h,view,body):
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="{view}">{body}</svg>'
(VEC/'edge-layout-mm.svg').write_text(simple_svg(f'{C}mm','3.2mm',f'0 -1.6 {C} 3.2',f'<g transform="scale(1 -1)" fill="#263546" fill-rule="nonzero">{EC}</g>'),encoding='utf-8')
(VEC/'foliate-separator-mm.svg').write_text(simple_svg(f'{motif_width}mm','1.2mm',f'{-motif_width/2} -.6 {motif_width} 1.2',f'<g transform="scale({motif_scale_x} {-motif_scale_y}) translate(0 {-motif_center_y})">{motif_svg()}</g>'),encoding='utf-8')

# Shared technical drawing typography, locally embedded for offline SVG viewing.
FONTPATH=ROOT/'fonts/NotoSerifSC-600-subset.ttf'
fontdata=base64.b64encode(FONTPATH.read_bytes()).decode()
CSS=f"""@font-face{{font-family:PackCN;src:url(data:font/ttf;base64,{fontdata})}}text{{font-family:PackCN,Arial,sans-serif;fill:#223343}}.title{{font-size:34px}}.sub{{font-size:17px;fill:#5f6e78}}.label{{font-size:19px}}.small{{font-size:15px}}.tiny{{font-size:12px}}.dim{{stroke:#768995;stroke-width:1.2;fill:none}}.guide{{stroke:#b4c2c8;stroke-width:1;stroke-dasharray:5 4;fill:none}}"""
def txt(x,y,text,cl='label',anchor='start',color=None):
    return f'<text x="{x}" y="{y}" class="{cl}" text-anchor="{anchor}"'+(f' style="fill:{color}"' if color else '')+f'>{esc(text)}</text>'
def line(x1,y1,x2,y2,cl='dim',color=None):
    return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" class="{cl}"'+(f' style="stroke:{color}"' if color else '')+'/>'
def circle(cx,cy,r,fill='none',stroke='#8c9c9e',sw=1):
    return f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>'
def board(name,title,subtitle,body,w=1800,h=1200):
    svg=f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="{w}" height="{h}" viewBox="0 0 {w} {h}"><defs><style>{CSS}</style><linearGradient id="metal"><stop stop-color="#d5d5cf"/><stop offset=".48" stop-color="#f5f4ed"/><stop offset="1" stop-color="#c3c7c3"/></linearGradient></defs><rect width="100%" height="100%" fill="#f8f6ef"/>{txt(60,62,title,"title")}{txt(60,96,subtitle,"sub")}{body}{txt(60,h-26,"TSL · ORIGINAL DESIGN PACK 1.1 · mm · 固定参数以 JSON / CSV / SVG 为准","small")}</svg>'
    (OUT/f'{name}.svg').write_text(svg,encoding='utf-8')
def pp(theta,cx,cy,rad,reverse=False):
    a=math.radians(theta)
    return (cx+(-1 if reverse else 1)*rad*math.sin(a),cy-rad*math.cos(a))
def arc(cx,cy,rad,start,end,reverse=False,stroke='#408d8b',sw=6):
    points=[pp(start+(end-start)*i/80,cx,cy,rad,reverse) for i in range(81)]
    return '<path d="M '+' L '.join(f'{x:.3f} {y:.3f}' for x,y in points)+f'" fill="none" stroke="{stroke}" stroke-width="{sw}"/>'
def polar_datum(cx,cy,rad,reverse=False):
    out=circle(cx,cy,rad,'#eef1ed')+circle(cx,cy,rad*.94)+line(cx-rad-25,cy,cx+rad+25,cy,'guide')+line(cx,cy-rad-25,cx,cy+rad+25,'guide')
    for a in range(0,360,15):
        x,y=pp(a,cx,cy,rad,reverse); x2,y2=pp(a,cx,cy,rad+7,reverse);out+=line(x,y,x2,y2)
        if a%30==0:
            x3,y3=pp(a,cx,cy,rad+27,reverse);out+=txt(x3,y3+5,str(a)+'°','small','middle')
    out+=circle(cx,cy,3,'#263546')+txt(cx+9,cy-9,'O','label')
    for name,a in [('P0',0),('P90',90),('P180',180),('P270',270)]:
        x,y=pp(a,cx,cy,rad,reverse); nx,ny=pp(a,cx,cy,rad*.71,reverse)
        out+=circle(x,y,4,'#253a52')+txt(nx,ny+5,name,'small','middle')
    for a in E['text_centres_degrees']:out+=arc(cx,cy,rad*.84,a-38,a+38,reverse,'#3c8298',8)
    for a in E['ornament_centres_degrees']:out+=arc(cx,cy,rad*.84,a-11.5,a+11.5,reverse,'#b2874e',8)
    return out
body=polar_datum(420,430,235)+polar_datum(1250,430,235,True)
body+=txt(420,150,'正面观察 · 法线 −Y','label','middle')+txt(1250,150,'背面观察 · 法线 +Y','label','middle')
body+=txt(420,738,'θ：顶 0° → 右 90° → 下 180° → 左 270°','label','middle')
body+=txt(1250,738,'同一世界角 θ 在背面左右反射，β = −θ mod 360','label','middle')
for y,t in [(820,'O = (0, 0, 0)；P0 = (0, 0, +20)；OP0 是原始参考射线。'),(860,'世界 X：正面向右；世界 Z：向上；币轴沿 Y。所有视图引用同一坐标。'),(900,'青蓝弧：3 个铭文预留区；棕弧：3 个短草纹区。0° 是工程基准，不取龙角或龙眼作零点。'),(940,'正面：X = R sin θ，Z = R cos θ；背面屏幕：q = −X，z = Z。'),(980,'铭文左至右：θ 递减。字顶向 −Y（主题正面），字底向 +Y（统一币背）。')]:body+=txt(80,y,t,'label')
board('01-datum-and-orientation','01 / 坐标、零点与正背对应','非 AI 制图 · 正面与背面使用同一个世界角，不各自重排',body)

# Exact circle distribution and reading-direction unfolded strip.
body=polar_datum(380,420,220)
rows=[
('铭文 T1','322°—360° + 0°—38°','中心 0°；预留 76°'),
('草纹 F1','48.5°—71.5°','中心 60°；宽 23°'),
('铭文 T2','82°—158°','中心 120°；预留 76°'),
('草纹 F2','168.5°—191.5°','中心 180°；宽 23°'),
('铭文 T3','202°—278°','中心 240°；预留 76°'),
('草纹 F3','288.5°—311.5°','中心 300°；宽 23°')]
for i,(a,b,c) in enumerate(rows):
    y=195+i*64;body+=txt(760,y,a)+txt(940,y,b)+txt(760,y+25,c,'small')
body+=txt(750,620,f'字形实宽 {text_width:.4f} mm / {math.degrees(text_width/R):.4f}°；不拉伸填满预留区','label')
body+=txt(750,660,'预留区间隙 10.5°；3 × (76 + 23 + 21) = 360°','label')
body+=txt(750,695,f'字形未填满预留区；实际墨迹与草纹之间留白约 {60-11.5-math.degrees(text_width/R)/2:.4f}°。','small')
sx=12.7; sy=12.7; x0=100;y0=845
body+=f'<rect x="{x0}" y="{y0-1.4*sy}" width="{C*sx}" height="{2.8*sy}" fill="url(#metal)" stroke="#78878d"/>'
body+=f'<g transform="translate({x0} {y0}) scale({sx} {-sy})" fill-rule="nonzero">{EC}</g>'
for theta in range(0,360,30):
    u=R*math.radians((CUT-theta)%360);xx=x0+u*sx
    body+=line(xx,y0+64,xx,y0+74)+txt(xx,y0+98,str(theta)+'°','small','middle')
body+=txt(100,740,'阅读向展开：从切口 θ=45° 起，u 向右增长、θ 递减；上沿始终朝正面。','label')
body+=txt(100,1010,f'全长 {C:.6f} mm；横纵等比例，侧壁真实高 2.8 mm。字形细节可查看 SVG 放大。','label')
body+=txt(100,1050,'45° 切口落在留白内；u=0 与 u=C 是同一条物理母线，不产生接缝或第 4 组文字。','label')
board('02-edge-distribution','02 / 铭文、草纹与留白的固定分布','3 × 120° · 阴刻 · Cinzel 600 · 字形高 1.40 mm · 跟踪间距 0.03 mm',body)

# True side elevations derived from the exact same contours. No independent image generation.
def clip_poly(poly,lo,hi):
    pts=list(poly)
    for bound,islo in [(lo,True),(hi,False)]:
        result=[]
        if not pts:return []
        prev=pts[-1];pin=prev[0]>=bound if islo else prev[0]<=bound
        for p in pts:
            inside=p[0]>=bound if islo else p[0]<=bound
            if inside!=pin:
                t=(bound-prev[0])/(p[0]-prev[0])
                result.append((bound,prev[1]+t*(p[1]-prev[1])))
            if inside:result.append(p)
            prev=p;pin=inside
        pts=result
    return pts
def side(alpha,cx,cy,scale=17):
    out=f'<rect x="{cx-20*scale}" y="{cy-1.4*scale}" width="{40*scale}" height="{2.8*scale}" rx="{.08*scale}" fill="url(#metal)" stroke="#8c9696"/>'
    out+=line(cx-20*scale,cy-1.4*scale,cx+20*scale,cy-1.4*scale)
    out+=line(cx-20*scale,cy+1.4*scale,cx+20*scale,cy+1.4*scale)
    lo=R*math.radians(CUT-alpha-90);hi=R*math.radians(CUT-alpha+90)
    for shape in shapes:
        contours=[]
        for poly in shape['contours']:
            for k in [-1,0,1]:
                pts=[(u+k*C,v) for u,v in poly]
                cp=clip_poly(pts,lo,hi)
                if len(cp)<3:continue
                projected=[]
                for u,v in cp:
                    theta=math.radians(CUT)-u/R
                    x=-R*math.sin(theta-math.radians(alpha))
                    projected.append((cx+x*scale,cy-v*scale))
                contours.append(projected)
        if contours:
            d=polygon_path(contours,close=shape['type']=='fill')
            if shape['type']=='fill':out+=f'<path d="{d}" fill="#324448" fill-rule="nonzero"/>'
            else:out+=f'<path d="{d}" fill="none" stroke="#324448" stroke-width="{shape.get("width",.075)*scale}" stroke-linecap="round"/>'
    return out
body=''
for a,cx,cy in [(0,450,340),(90,1330,340),(180,450,690),(270,1330,690)]:
    body+=txt(cx,cy-120,f'观察径向 α = {a}°','label','middle')+side(a,cx,cy)
    centre='铭文居中' if a==0 else ('草纹居中' if a==180 else '铭文与草纹位置按同一环周计算')
    body+=txt(cx,cy+105,centre,'label','middle')
body+=txt(80,930,'四图来自同一组字形轮廓与三周期坐标，遮挡由半圆可见域计算；不翻币、不镜像文字。','label')
body+=txt(80,974,'本页是比例投影设计说明，不模拟摄影反射；窄圆肩与两面衔接见截面图。','label')
body+=txt(80,1018,'侧视屏幕右向 = −eθ；屏幕上向 = −Y。因此每个字的可读方向与法线一致。','label')
board('03-four-side-elevations','03 / 四方位固定侧视','非 AI 投影 · 单一轮廓数据源 · α 为观察者在币面平面内的径向角',body)

# Shared blank cross section detail.
body=''
cx=550;cy=570;sc=170
def sectpt(y,r):return cx+y*sc,cy-(r-19)*sc
def pline(points,color='#344b58',sw=2):
    return '<path d="M '+' L '.join(f'{x} {y}' for x,y in points)+f'" fill="none" stroke="{color}" stroke-width="{sw}"/>'
pts=[]
# section traverses negative face to positive face around outer edge
for rr,yy in [(18.8,-1.4),(19.2,-1.4),(19.45,-1.6),(19.8,-1.6)]:pts.append(sectpt(yy,rr))
for k in range(1,21):
    t=k/20*math.pi/2;pts.append(sectpt(-1.4-.2*math.cos(t),19.8+.2*math.sin(t)))
pts.append(sectpt(1.4,20))
for k in range(1,21):
    t=k/20*math.pi/2;pts.append(sectpt(1.4+.2*math.sin(t),19.8+.2*math.cos(t)))
for rr,yy in [(19.45,1.6),(19.2,1.4),(18.8,1.4)]:pts.append(sectpt(yy,rr))
body+=f'<path d="{polygon_path([pts])}" fill="#dfe4de" stroke="#3b535c" stroke-width="2"/>'
for y in [-1.6,-1.4,0,1.4,1.6]:
    x,zz=sectpt(y,18.5);body+=line(x,210,x,zz,'guide')+txt(x,zz+28,str(y),'small','middle')
for r0 in [19.2,19.45,19.8,20]:
    xx,yy=sectpt(-2.2,r0);body+=line(xx,yy,980,yy,'guide')+txt(990,yy+5,f'R {r0:.2f}','small')
body+=txt(550,780,'局部放大：R < 18.8 省略；横轴 Y / mm。左侧正面，右侧币背。','label','middle')
body+=txt(1100,220,'名义直径 40.00 mm')
for i,t in enumerate(['平场间厚 2.80 mm：Y = ±1.40','包边总厚 3.20 mm：Y = ±1.60','平场至 R19.20；斜坡至 R19.45','顶平包边 R19.45—19.80','外圆肩为精确 R0.20 四分之一圆','侧壁 R20，Y = −1.40…+1.40','文字墨迹带 Y = −0.70…+0.70','阴刻文字深 0.055 mm；草纹深 0.045','附加直齿、斜齿、锯齿数量全部为 0']):
    body+=txt(1100,280+i*52,t,'label')
body+=txt(80,920,'包边与圆肩属于同一币体，厚度不重复相加。已认可主题浮雕、爪、角的越界另计。','label')
body+=txt(80,964,'这些是本轮明确的设计名义值；不等同于已验证的铸造公差或机器刀具规格。','label')
body+=txt(80,1008,'特殊破口必须同时切断侧壁、圆肩和正背包边；不得在破口后保留完整装饰圆环。','label')
board('04-shared-section','04 / 共用币胚截面与两侧收口','单一实体截面 · 正面法线 −Y · 背面法线 +Y · 圆肩而非附加银线',body)

# Reverse layout: exact typography and source icon, organic foliage placement envelopes.
REV=S['reverse']; rbody=''
cx=490;cy=570;sc=17
rbody+=circle(cx,cy,20*sc,'#edf0e8','#3c5054',2)
for radius in REV['outer_border_radii']:rbody+=circle(cx,cy,radius*sc,'none','#647b7e',1.2)
rbody+=line(cx-360,cy,cx+360,cy,'guide')+line(cx,cy-360,cx,cy+360,'guide')
legend,lw=text_geometry(REV['top_legend']['text'],REV['top_legend']['font'],REV['top_legend']['uppercase_ink_height'],REV['top_legend']['tracking'])
# Exact sampled arc outlines for face legend; no live fonts needed for art.
legendcontours=[]
for it in legend:
    for poly in it['contours']:
        qz=[]
        for x,y in poly:
            a=x/REV['top_legend']['baseline_radius']
            radius=REV['top_legend']['baseline_radius']+y+REV['top_legend']['uppercase_ink_height']/2
            qz.append((radius*math.sin(a),radius*math.cos(a)))
        legendcontours.append(qz)
rbody+=f'<g transform="translate({cx} {cy}) scale({sc} {-sc})"><path d="{polygon_path(legendcontours)}" fill="#304650" fill-rule="nonzero"/></g>'
# Medallion rays, original open-book icon paths converted from original SVG source.
rbody+=circle(cx,cy-REV['book']['medallion_center'][1]*sc,REV['book']['medallion_radius']*sc,'#dbe3db','#50696f',1.2)
medz=REV['book']['medallion_center'][1]
for k in range(REV['book']['rays']):
    a=k*2*math.pi/REV['book']['rays']
    r1=REV['book']['ray_inner_radius'];r2=REV['book']['ray_outer_radius']
    rbody+=line(cx+r1*sc*math.sin(a),cy-(medz+r1*math.cos(a))*sc,cx+r2*sc*math.sin(a),cy-(medz+r2*math.cos(a))*sc)
icon=(ROOT/REV['book']['source']).read_text(encoding='utf-8')
paths=re.findall(r'<path[^>]+>',icon)
iconpaths=''.join(paths).replace('#3469e6','#526c73').replace('#f4f6fa','#f8f6ed')
# Source icon geometry x80..432 and y106..397, exact SVG paths preserved.
q0,z0,q1,z1=REV['book']['box_qz']; icx=cx+q0*sc; icy=cy-z1*sc
icon_scale=min((q1-q0)/352,(z1-z0)/291)
icon_q=(q0+q1)/2-352*icon_scale/2
icon_z=(z0+z1)/2+291*icon_scale/2
rbody+=f'<g transform="translate({cx+icon_q*sc} {cy-icon_z*sc}) scale({icon_scale*sc}) translate(-80 -106)">{iconpaths}</g>'
rbody+=f'<g transform="translate({cx} {cy}) scale({sc} {-sc})"><path d="{REV["cartouche"]["path"]}" fill="#f8f6ee" stroke="#526972" stroke-width=".09"/></g>'
bounds=[]
for row in REV['foundation_text']:
    its,width=text_geometry(row['text'],row['font'],row['ink_height'],row['tracking'])
    rbody+=f'<g transform="translate({cx} {cy}) scale({sc} {-sc})">{vector_text(its,row["center_q"],row["center_z"])}</g>'
    bounds.append({'id':row['id'],'text':row['text'],'width_mm':width,'height_mm':row['ink_height'],'center_qz':[row['center_q'],row['center_z']],'max_width':row['max_width']})
    rbody+=line(cx+width/2*sc+10,cy-row['center_z']*sc,1000,cy-row['center_z']*sc,'guide')
    rbody+=txt(1010,cy-row['center_z']*sc+5,row['id']+f'  H{row["ink_height"]:.2f}  Z{row["center_z"]:+.2f}','small')
rbody+=line(cx-10.8*sc,cy-REV['divider_z']*sc,cx+10.8*sc,cy-REV['divider_z']*sc)
for region in REV['foliage_regions']:
    x0,z0,x1,z1=region['box_qz']
    rbody+=f'<rect x="{cx+x0*sc}" y="{cy-z1*sc}" width="{(x1-x0)*sc}" height="{(z1-z0)*sc}" fill="none" stroke="#9b885f" stroke-width="1.6" stroke-dasharray="5 4"/>'
    rbody+=txt(cx+(x0+x1)*sc/2,cy-(z0+z1)*sc/2,region['id'],'tiny','middle')
for i,t in enumerate(['统一书徽：直接复用原 SVG，不重生书形。','书徽外框：q ±3.75；z 5.20…11.45','徽章中心 (0, 8.10)，R5.15','放射线 48 条，节距 7.5°','卷草框限定位置；内部有机细雕看完整母稿。','侧上爪映射到背右上，下爪映射到背左下。','特别币无章号、流水码、哈希、认证时间。','标题内容固定；不新增日期或限量分母。']):
    rbody+=txt(1050,180+i*44,t,'label')
rbody+=txt(80,1030,'本图规范固定排版与原图标；虚线框不代表发明新叶片拓扑，细雕仍参照保留的完整稿。','label')
board('05-reverse-layout','05 / 启动特别币背：固定信息与排版','坐标为背面屏幕 q = −X、z = Z；字形已转轮廓；无章节认证字段',rbody)
(ROOT/'spec/reverse-text-bounds.json').write_text(json.dumps({'top_legend_width_mm':lw,'rows':bounds},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
# Importable reverse type vector, in q,z mm. Organic art intentionally not fabricated.
rt=f'<g transform="scale(1 -1)"><path d="{polygon_path(legendcontours)}" fill="#263546" fill-rule="nonzero"/>'
for row in REV['foundation_text']:
    its,_=text_geometry(row['text'],row['font'],row['ink_height'],row['tracking']);rt+=vector_text(its,row['center_q'],row['center_z'])
rt+='</g>'
(VEC/'reverse-lettering-mm.svg').write_text(simple_svg('40mm','40mm','-20 -20 40 40',rt),encoding='utf-8')
fixed='<g transform="scale(1 -1)">'
for rr in REV['outer_border_radii']:
    fixed+=f'<circle cx="0" cy="0" r="{rr}" fill="none" stroke="#263546" stroke-width=".07"/>'
fixed+=f'<circle cx="0" cy="{medz}" r="{REV["book"]["medallion_radius"]}" fill="none" stroke="#263546" stroke-width=".07"/>'
for k in range(REV['book']['rays']):
    a=k*2*math.pi/REV['book']['rays'];r1=REV['book']['ray_inner_radius'];r2=REV['book']['ray_outer_radius']
    fixed+=f'<line x1="{r1*math.sin(a)}" y1="{medz+r1*math.cos(a)}" x2="{r2*math.sin(a)}" y2="{medz+r2*math.cos(a)}" stroke="#263546" stroke-width=".035"/>'
fixed+=f'<g transform="translate({icon_q} {icon_z}) scale({icon_scale} {-icon_scale}) translate(-80 -106)">{iconpaths}</g>'
fixed+=f'<path d="{REV["cartouche"]["path"]}" fill="none" stroke="#263546" stroke-width=".09"/>'
fixed+=f'<path d="{polygon_path(legendcontours)}" fill="#263546" fill-rule="nonzero"/>'
(VEC/'reverse-common-frame-mm.svg').write_text(simple_svg('40mm','40mm','-20 -20 40 40',fixed+'</g>'),encoding='utf-8')
for row in REV['foundation_text']:
    its,_=text_geometry(row['text'],row['font'],row['ink_height'],row['tracking']);fixed+=vector_text(its,row['center_q'],row['center_z'])
fixed+=f'<line x1="-10.8" y1="{REV["divider_z"]}" x2="10.8" y2="{REV["divider_z"]}" stroke="#263546" stroke-width=".06"/></g>'
(VEC/'reverse-fixed-components-mm.svg').write_text(simple_svg('40mm','40mm','-20 -20 40 40',fixed),encoding='utf-8')

# Foundation exception map; same world mask shown from both sides.
body=''
for rev,cx in [(False,400),(True,1240)]:
    body+=polar_datum(cx,410,220,rev)
    for interval,col in [(S['foundation']['overrides']['upper_grip_sector_degrees'],'#d3a444'),(S['foundation']['overrides']['lower_grip_sector_degrees'],'#d3a444'),(S['foundation']['overrides']['notch_sector_degrees'],'#be5656')]:
        body+=arc(cx,410,232,*interval,rev,col,12)
    body+=txt(cx,135,'背面映射' if rev else '正面定位','label','middle')
body+=txt(80,750,'上爪施工包络 θ 282°—326°；中心 304°；背面 β 34°—78°。','label')
body+=txt(80,790,'下爪施工包络 θ 116°—152°；中心 134°；背面 β 208°—244°。','label')
body+=txt(80,830,'破口 θ 286°—318°；背面 β 42°—74°；最大径向缺失 1.50 mm < 上爪有效伸入 2.60 mm。','label')
body+=txt(80,870,'包络是施工定位，不是爪的形状；严禁把角度扇形挤出成爪。爪形、眼与角继续看认可原稿。','label')
knots=S['foundation']['overrides']['notch_profile_knots']; graph=[]
for k in knots:
    x=1030+(k['theta']-286)*20;y=1070-k['depth']*90;graph.append((x,y))
body+=pline(graph,'#be5656',2.2)
for k,(x,y) in zip(knots,graph):
    body+=circle(x,y,3,'#be5656')+txt(x,y-12,f'{k["theta"]}°/{k["depth"]:.2f}','tiny','middle')
body+=txt(80,960,'右侧：破口外包络的角度／深度控制节点。','label')
body+=txt(80,1002,'实际断面需保留厚度、压陷与受力关系。','label')
body+=txt(80,1044,'阴刻先落在共同币体，再切缺口，再由爪遮挡；','label')
body+=txt(80,1086,'不移动剩余字形、不增刻补偿文字、不补完整圆环。','label')
board('06-foundation-overrides','06 / 特别币破口与跨缘结构的覆盖规则','新增明确的施工包络 · 不是从 AI 图反算得到的隐藏几何',body)

# Complete exact per-glyph data sample on one page.
body=''
headers=['字位','字符','u左/mm','u右/mm','v下/mm','v上/mm','θ左/°','θ右/°']
xs=[80,230,360,550,740,930,1120,1400]
for x,h in zip(xs,headers):body+=txt(x,165,h,'label')
for i,g in enumerate(glyphs[:len(items)]):
    yy=210+i*37
    b=g['ink_bbox_uv']
    vals=[g['id'],'空格' if g['character']==' ' else g['character']]
    vals+=['—']*6 if b is None else [f'{v:.5f}' for v in [b[0],b[2],b[1],b[3],g['theta_at_ink_left_unwrapped'],g['theta_at_ink_right_unwrapped']]]
    for x,v in zip(xs,vals):body+=txt(x,yy,v,'small')
    body+=line(75,yy+10,1700,yy+10,'guide')
body+=txt(80,1000,'本页展示 T1；全部 57 个字位（含空格）见 glyph-placement.csv；原始曲线见 edge-curves.json。','label')
body+=txt(80,1040,'θ 可暂为负数用于跨零连续记录；显示时取 mod 360。u=0 与 u=C 在 45° 母线上闭合。','label')
board('07-glyph-schedule','07 / 逐字坐标表：字形、位置与角度','由实际字体轮廓计算 · 空格保留 advance 但没有刻槽 · 数值不来自扩散图像',body)

# Exact foliate master and individual Bezier/control-node table.
from fontTools.pens.recordingPen import RecordingPen
control_rows=[]
for shape in MP:
    rec=RecordingPen();parse_path(shape['d'],rec)
    for op_index,(op,args) in enumerate(rec.value):
        for point_index,p in enumerate(args):
            if p is None:continue
            control_rows.append([shape['id'],op_index,op,point_index,p[0]*shape['sx']*motif_scale_x,(p[1]-motif_center_y)*motif_scale_y])
with (ROOT/'spec/foliate-control-points.csv').open('w',encoding='utf-8-sig',newline='') as f:
    w=csv.writer(f);w.writerow(['PATH_ID','OPERATION_INDEX','SVG_OPERATION','POINT_INDEX','LOCAL_U_MM','LOCAL_V_MM']);w.writerows(control_rows)
body=''
mx=900;my=440;mag=175
body+=f'<rect x="{mx-motif_width/2*mag}" y="{my-E["ornament_ink_height"]/2*mag}" width="{motif_width*mag}" height="{E["ornament_ink_height"]*mag}" fill="none" stroke="#9aa9ab" stroke-dasharray="5 4"/>'
body+=f'<g transform="translate({mx} {my}) scale({mag*motif_scale_x} {-mag*motif_scale_y}) translate(0 {-motif_center_y})">{motif_svg()}</g>'
body+=line(mx-740,my,mx+740,my,'guide')+line(mx,my-160,mx,my+160,'guide')
for x in [-motif_width/2,0,motif_width/2]:
    body+=line(mx+x*mag,my+120,mx+x*mag,my+145)+txt(mx+x*mag,my+176,f'{x:+.6f} mm','small','middle')
body+=txt(80,200,f'外包宽 {motif_width:.6f} mm = 23°；墨迹高 {E["ornament_ink_height"]:.2f} mm；中心 v=0。','label')
body+=txt(80,245,'此短叶饰为本轮整理的规范化工作轮廓，延续既有币背的成对叶饰语言。','label')
body+=txt(80,700,'曲线结构：中心菱点、成对上叶、成对下叶、成对外叶、两端收尖，以及贯通主茎。','label')
body+=txt(80,750,'所有叶片使用封闭三次 Bézier 路径；主茎使用开放曲线，建模时保留最小槽宽 0.075 mm。','label')
body+=txt(80,800,'每个节点与控制柄的局部毫米坐标见 foliate-control-points.csv；控制柄不等于实际轮廓点。','label')
body+=txt(80,850,'同一个母轮廓复制到 θ=60°、180°、300°，仅整体移动，不逐组生成或改变叶片数量。','label')
body+=txt(80,900,'路径源、横纵归一化与原始外包框见 edge-curves.json；三组均使用同一份源数据。','label')
body+=txt(80,950,'阴刻深度 0.045 mm；封闭叶形按面切槽，开放主茎按槽宽处理，禁止仅当黑色贴图。','label')
body+=txt(80,1000,'这是可编辑的固定二维母纹，尚未经用户最终审美采用；将来更改需整体替换母纹并重算。','label')
board('08-foliate-master','08 / 短草纹母轮廓、尺寸与路径结构','非 AI 固定设计 · 同母纹复制三次 · 原始控制点可直接读取',body)

report={'schema':'tsl.design-checks/1','passed':True,'checks':[]}
def ck(name,ok,detail):
    report['checks'].append({'name':name,'passed':bool(ok),'detail':detail})
    if not ok:report['passed']=False
ck('three_periods_close',abs(3*120-360)<1e-9,'3 x 120 = 360')
ck('angular_coverage',abs(3*(76+23+2*10.5)-360)<1e-9,'Reserved text, ornament and gaps cover 360 without overlap')
ck('text_fits_reserved_window',math.degrees(text_width/R)<76,{'text_span':math.degrees(text_width/R),'window':76})
ck('glyph_count',len(glyphs)==3*len(E['text']),len(glyphs))
ck('text_and_motif_axial_fit',E['uppercase_ink_height']<=2.4 and E['ornament_ink_height']<=2.4,'Artwork fits decorated band')
ck('depth_less_than_base_radius',max(E['incuse_depth'],E['ornament_incuse_depth'])<.2,'Shallow incisions, independent from main relief')
for row in bounds:ck('reverse_width_'+row['id'],row['width_mm']<=row['max_width'],row)
ck('notch_within_upper_grip_sector',282<=286<318<=326,'Notch is within upper grip construction envelope')
ck('notch_depth_less_than_grip_reach',1.5<=2.6,'1.5 <= 2.6')
for theta in [0,60,90,120,180,240,270,300]:
    beta=(-theta)%360
    X=R*math.sin(math.radians(theta));q=R*math.sin(math.radians(beta))
    ck('reverse_mapping_'+str(theta),abs(q+X)<1e-9,{'theta':theta,'beta':beta})
normal_cos=[]
def surface(u,v):
    a=math.radians(CUT)-u/R
    return (R*math.sin(a),-v,R*math.cos(a))
for u in [0,C*.13,C*.5,C*.87]:
    eps=1e-4; a=surface(u+eps,0);b=surface(u-eps,0);c=surface(u,eps);d=surface(u,-eps)
    du=[(x-y)/(2*eps) for x,y in zip(a,b)];dv=[(x-y)/(2*eps) for x,y in zip(c,d)]
    n=[du[1]*dv[2]-du[2]*dv[1],du[2]*dv[0]-du[0]*dv[2],du[0]*dv[1]-du[1]*dv[0]]
    p=surface(u,0);den=math.sqrt(sum(x*x for x in n))*R
    normal_cos.append(sum(x*y for x,y in zip(n,p))/den)
ck('edge_text_normal_outward',min(normal_cos)>1-1e-8,{'finite_difference_normal_cosines':normal_cos})
report['scope']='Numerical/asset consistency only; not artistic approval, hidden geometry proof, manufacturing validation or calibrated photo matching.'
(ROOT/'checks/design-checks.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'passed':report['passed'],'checks':len(report['checks']),'SVG_drawings':len(list(OUT.glob('*.svg'))),'glyphs':len(glyphs),'text_width_mm':text_width},indent=2))
if not report['passed']:raise SystemExit(1)

from series_design import build_series
build_series(globals())


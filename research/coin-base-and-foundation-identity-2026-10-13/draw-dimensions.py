from pathlib import Path
import json, math
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent
spec = json.loads((ROOT / 'coin-base-v0.1.json').read_text(encoding='utf-8'))
im = Image.new('RGB', (1600, 1200), '#f7f5ef')
d = ImageDraw.Draw(im)
ink, muted, accent = '#253239', '#657278', '#497777'
def font(n, bold=False):
    return ImageFont.truetype('C:/Windows/Fonts/msyhbd.ttc' if bold else 'C:/Windows/Fonts/msyh.ttc', n)
def text(x,y,s,n=25,color=ink,bold=False):
    d.text((x,y),s,font=font(n,bold),fill=color)
def line(points, color=muted, width=2):
    d.line(points, fill=color, width=width)
def arrow(x1,y1,x2,y2,label,lx,ly):
    line([(x1,y1),(x2,y2)])
    angle=math.atan2(y2-y1,x2-x1)
    for x,y,sign in [(x1,y1,1),(x2,y2,-1)]:
        for side in [-1,1]:
            a=angle+side*0.48
            line([(x,y),(x+sign*12*math.cos(a),y+sign*12*math.sin(a))])
    text(lx,ly,label,23)
text(60,40,'第二语言｜系列币胚工作规格',42,bold=True)
text(60,105,'40 mm名义直径 · 一轮完整造型 · 技术比例图，非艺术样币',25,color=muted)
line([(60,158),(1540,158)],'#c7cecd')
text(60,183,'截面对比',30,bold=True)
text(60,229,'同一比例显示币身；主题浮雕另计',23,color=muted)
scale=19
for i,t in enumerate([2.4,2.8,3.4]):
    cy=325+i*132
    x0,x1=95,95+40*scale
    yt,yb=cy-t*scale/2,cy+t*scale/2
    d.rounded_rectangle((x0,yt,x1,yb),radius=3,fill='#d8dfdc',outline=accent,width=2)
    for xx in [x0,x1-spec['body']['rimRadialWidthMm']*scale]:
        d.rectangle((xx,yt-0.2*scale,xx+0.65*scale,yb+0.2*scale),fill='#a5b5b1')
    text(95,cy+46,f'{t:.1f} mm  /  {t/40:.3f}D' + ('  ← 首轮采用' if i==1 else ''),22,color=accent if i==1 else muted,bold=i==1)
    arrow(885,yt,885,yb,f'{t:.1f}',902,cy-15)
arrow(95,282,855,282,'D = 40.0 mm',355,252)
text(1000,183,'背面身份区域',30,bold=True)
cx,cy,r=1245,395,160
for rad,col in [(r,accent),(r*17.3/20,'#b3bfbc'),(r*14.5/20,'#b3bfbc'),(r*11.5/20,'#d2d9d6')]:
    d.ellipse((cx-rad,cy-rad,cx+rad,cy+rad),outline=col,width=2)
text(cx-67,cy-32,'开卷核心',27,bold=True)
text(cx-81,cy+12,'统一识别形',24,color=muted)
text(cx-89,cy-124,'系列名称上弧',23,color=accent)
text(cx-73,cy+98,'发行身份',23,color=accent)
text(1030,584,'环线仅示意分区，不是装饰环',22,color=muted)
text(60,684,'首轮共用基础',30,bold=True)
items=[('币身 / 包边','2.8 mm / 双面各0.20 mm','未破损包边总厚3.20 mm'),('金属侧缘','120条圆底轴向浅槽','平边与非金属变体可用'),('主题空间','浮雕、跨缘、缺口各有职责','不按完整圆盘裁掉艺术结构')]
for i,(title,a,b) in enumerate(items):
    x=60+i*515
    d.rounded_rectangle((x,740,x+490,892),radius=8,fill='#eeefea',outline='#d0d8d3',width=1)
    text(x+20,758,title,28,bold=True)
    text(x+20,809,a,23)
    text(x+20,849,b,21,color=muted)
text(60,933,'仇视之龙｜第二语言诞生特别纪念币',30,bold=True)
text(60,985,'同一基础与统一币背 · FOUNDATION · 2026 · F-001',25,color=accent)
text(60,1033,'独立发行身份，不占章节序号；保留已认可的完整龙稿设计。',24)
text(60,1128,'工作稿 v0.1  ·  2026-10-13  ·  尺寸是项目首轮选择，不是行业统一规格。',21,color=muted)
im.save(ROOT / 'blank-dimensions.png',optimize=True)
print(json.dumps({'image':'blank-dimensions.png','size':im.size,'bytes':(ROOT/'blank-dimensions.png').stat().st_size},ensure_ascii=False))

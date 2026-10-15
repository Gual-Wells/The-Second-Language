from pathlib import Path
import json, sys, hashlib, re
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools import subset
from fontTools.pens.boundsPen import BoundsPen

ROOT=Path(__file__).resolve().parents[1]
SOURCE=Path(sys.argv[1]) if len(sys.argv)>1 else ROOT/'fonts'/'source'
OUT=ROOT/'fonts'
OUT.mkdir(exist_ok=True)
records=[]
for folder, filename, outname, text, weight in [
 ('cinzel','Cinzel-variable.ttf','Cinzel-600.ttf','ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .:-+·',600),
 ('notoserifsc','NotoSerifSC-variable.ttf','NotoSerifSC-600-subset.ttf','启程纪念仇视之龙地图上的那条线第二语言年月日章认证通过',600)]:
    src=SOURCE/filename
    font=instantiateVariableFont(TTFont(src),{'wght':weight},inplace=False)
    if folder == 'notoserifsc':
        texts = ''.join(p.read_text(encoding='utf-8') for p in [*ROOT.glob('scripts/*.py'), *ROOT.glob('spec/*.json')])
        text += 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .:-+·'
        text += ''.join(sorted(set(re.findall(r'[\u4e00-\u9fff]', texts))))
    options=subset.Options()
    options.name_IDs=['*']
    options.name_legacy=True
    options.name_languages=['*']
    sub=subset.Subsetter(options=options)
    sub.populate(text=text)
    sub.subset(font)
    target=OUT/outname
    font.save(target)
    records.append({'family':folder,'source_file':filename,'source_sha256':hashlib.sha256(src.read_bytes()).hexdigest(),'file':outname,'weight':weight,'subset_characters':text,'sha256':hashlib.sha256(target.read_bytes()).hexdigest()})
(ROOT/'fonts'/'font-sources.json').write_text(json.dumps({'google_fonts_pin':(SOURCE/'PIN.txt').read_text().strip(),'repository':'https://github.com/google/fonts','license':'SIL Open Font License 1.1','subsets':records},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
font=TTFont(OUT/'Cinzel-600.ttf')
gs=font.getGlyphSet(); cm=font.getBestCmap(); metrics=font['hmtx'].metrics
text='THE SECOND LANGUAGE'; cursor=0; xmin=ymin=1e10;xmax=ymax=-1e10
for char in text:
    name=cm[ord(char)];pen=BoundsPen(gs);gs[name].draw(pen)
    if pen.bounds:
        x0,y0,x1,y1=pen.bounds
        xmin=min(xmin,x0+cursor);xmax=max(xmax,x1+cursor);ymin=min(ymin,y0);ymax=max(ymax,y1)
    cursor+=metrics[name][0]
scale=1.4/(ymax-ymin)
width=(xmax-xmin)*scale+(len(text)-1)*0.03
print(json.dumps({'cap_ink_height_mm':1.4,'tracking_mm':0.03,'natural_width_mm':width,'occupied_degrees':width/20*180/3.141592653589793,'font_units_bounds':[xmin,ymin,xmax,ymax]},indent=2))


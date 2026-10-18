"""Prepare source assets without editing the preserved chapter-one or v13 originals."""
from PIL import Image, ImageFilter, ImageOps
from pathlib import Path
import json, hashlib, math

root = Path(__file__).resolve().parents[1]
dest = root / 'web/labs/chapter-scroll-v14/assets'
dest.mkdir(parents=True, exist_ok=True)
paper = Image.open(root / 'research/scroll-lab-v14/parchment-source.png').convert('RGBA')
paper.save(dest / 'parchment.webp', quality=95, method=6)
# Fine material grain only. Broad age stains must not become embossed geometry.
gray = ImageOps.grayscale(paper)
soft = gray.filter(ImageFilter.GaussianBlur(2))
w,h = paper.size
p,q = gray.load(),soft.load()
height = Image.new('L',(w,h),128); z = height.load()
rough = Image.new('L',(w,h),240); rr = rough.load()
for y in range(h):
    for x in range(w):
        grain = max(-18,min(18,p[x,y]-q[x,y]))
        z[x,y] = int(128+grain*.65)
        rr[x,y] = int(max(220,min(251,240+grain*.30)))
# The normal is an explicitly derived micrograin approximation, not a scan.
normal = Image.new('RGB',(w,h)); n=normal.load()
for y in range(h):
    for x in range(w):
        dx=(z[min(w-1,x+1),y]-z[max(0,x-1),y])*.013
        dy=(z[x,min(h-1,y+1)]-z[x,max(0,y-1)])*.013
        norm=math.sqrt(1+dx*dx+dy*dy)
        n[x,y]=(int(128-127*dx/norm),int(128+127*dy/norm),int(128+127/norm))
normal.save(dest/'parchment-normal.jpg',quality=94)
rough.save(dest/'parchment-roughness.jpg',quality=94)
for name in ['Color','NormalGL','Roughness']:
    src=root/f'.cache/scroll-v14/leather/Leather030_1K-JPG_{name}.jpg'
    Image.open(src).resize((512,512),Image.Resampling.LANCZOS).save(dest/f'leather-{name.lower()}.jpg',quality=94)
for source,filename in [('leather-albedo-source.png','leather-color.jpg'),('bronze-albedo-source.png','metal-color.jpg')]:
    src=root/'research/scroll-lab-v14'/source
    if src.exists(): Image.open(src).convert('RGB').resize((512,512),Image.Resampling.LANCZOS).save(dest/filename,quality=95)
for source,filename in [('NormalGL','metal-normal.jpg'),('Roughness','metal-roughness.jpg')]:
    Image.open(root/f'.cache/scroll-v14/metal/Metal032_1K-JPG_{source}.jpg').resize((512,512),Image.Resampling.LANCZOS).save(dest/filename,quality=94)
Image.new('RGBA',(1,1),(0,0,0,0)).save(dest/'unused-keeper.png')

folder=root/'web/labs/chapter-scroll-v14'
plan=json.loads((folder/'art-plan.json').read_text(encoding='utf-8'))
plan['id']='SL-CH05-LEAF-LETTER-2'
plan['resources']['ornament']['src']='../chapter-scroll-v13/assets/leaf-and-letter.png'
plan['resources']['paper']={'src':'assets/parchment.webp','sha256':hashlib.sha256((dest/'parchment.webp').read_bytes()).hexdigest(),'variant':'individually-authored-sheet','source':'research/scroll-lab-v14/parchment-source.png','material':'independent cutout; derived micrograin normal and roughness; no mirrored mother sheet'}
plan['models']['runtimeVerification']='Current v14 specimen; no per-run model attestation available.'
text=json.dumps(plan,ensure_ascii=False,indent=2)+'\n';(folder/'art-plan.json').write_bytes(text.encode('utf-8'))
digest=hashlib.sha256(text.encode()).hexdigest()
template=(root/'web/labs/chapter-scroll-v13/templates.js').read_text(encoding='utf-8').replace('manuscript-memento-v13','manuscript-memento-v14').replace("skin:'../chapter-scroll-v6/assets/charter.webp',reverse:'../chapter-scroll-v6/assets/charter.webp'","skin:'assets/parchment.webp',reverse:'assets/parchment.webp'").replace("ornament:'assets/leaf-and-letter.png'","ornament:'../chapter-scroll-v13/assets/leaf-and-letter.png'").replace('babdc4fa311113df30933e359998798c84fe8b329fd8b591ddeb7009973e220a',digest)
template=template.replace("keeper:'../chapter-scroll-v4/assets/keeper.webp'","keeper:'assets/unused-keeper.png',paperNormal:'assets/parchment-normal.jpg',paperRoughness:'assets/parchment-roughness.jpg'")
(folder/'templates.js').write_text(template,encoding='utf-8')
record=json.loads((folder/'chapter-sample.json').read_text(encoding='utf-8')); record['template']='manuscript-memento-v14'
(folder/'chapter-sample.json').write_text(json.dumps(record,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
charter=(folder/'charter.js').read_text(encoding='utf-8').replace('SL-MEMENTO-13','SL-MEMENTO-14')
(folder/'charter.js').write_text(charter,encoding='utf-8')
print(json.dumps({'paperSize':paper.size,'paperSHA256':plan['resources']['paper']['sha256'],'planDigest':digest}))

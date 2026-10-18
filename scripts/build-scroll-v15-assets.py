"""Prepare a separate specimen. Source images stay intact; maps are art-directed approximations."""
from pathlib import Path
from PIL import Image, ImageFilter, ImageOps
import numpy as np
import json, hashlib, datetime

root = Path(__file__).resolve().parents[1]
folder = root/'web/labs/chapter-scroll-v15'
if not (folder/'app.js').exists():
    raise SystemExit('v15 is intentionally archived after rejection; restore its original location only for an explicit reproduction.')
dest = folder/'assets'
research = root/'research/scroll-lab-v15'
dest.mkdir(exist_ok=True)

def normal(height, strength):
    dy, dx = np.gradient(height.astype(float))
    z = np.ones_like(dx)
    length = np.sqrt((dx*strength)**2+(dy*strength)**2+1)
    return Image.fromarray(np.uint8(np.stack([(1-dx*strength/length)*127.5,
        (1+dy*strength/length)*127.5,(1+z/length)*127.5],axis=-1).clip(0,255)))

paper = Image.open(research/'parchment-source.png').convert('RGBA')
paper.save(dest/'parchment.webp',quality=96,method=6)
gray = ImageOps.grayscale(paper)
fine = np.array(gray,dtype=float)-np.array(gray.filter(ImageFilter.GaussianBlur(2)),dtype=float)
normal(fine,.012).save(dest/'parchment-normal.jpg',quality=95)
Image.fromarray(np.uint8(np.clip(242+fine*.2,225,251))).save(dest/'parchment-roughness.jpg',quality=94)

atlas = Image.open(research/'material-atlas.png').convert('RGB')
w,h = atlas.size
for name,box in [('leather',(0,0,w//2,h)),('metal',(w//2,0,w,h))]:
    tile=atlas.crop(box).resize((1024,1024),Image.Resampling.LANCZOS)
    tile.save(dest/f'{name}-color.jpg',quality=95)
    rgb=np.array(tile,dtype=float)/255
    lum=rgb@np.array([.2126,.7152,.0722])
    blurred=np.array(Image.fromarray(np.uint8(lum*255)).filter(ImageFilter.GaussianBlur(3)),dtype=float)/255
    grain=(lum-blurred)*255
    if name=='metal':
        # Bronze exposed at the brighter brown/yellow areas, oxide and sparse
        # green corrosion deliberately have lower metalness and higher roughness.
        green=np.clip((rgb[:,:,1]-rgb[:,:,0]+.09)*5,0,1)
        bare=np.clip((lum-.17)/.34,0,1)*(1-green)
        rough=.88-.49*bare
        metal=.08+.91*bare
        Image.fromarray(np.uint8(metal*255)).save(dest/'metal-metalness.jpg',quality=94)
        normal(grain,.018).save(dest/'metal-normal.jpg',quality=94)
    else:
        rough=np.clip(.90-grain*.002, .70,.99)
        normal(grain,.023).save(dest/'leather-normalgl.jpg',quality=94)
    Image.fromarray(np.uint8(rough*255)).save(dest/f'{name}-roughness.jpg',quality=94)

plan=json.loads((folder/'art-plan.json').read_text(encoding='utf-8-sig'))
plan['id']='SL-CH05-LEAF-LETTER-3'
plan['resources']['paper']={'src':'assets/parchment.webp','sha256':hashlib.sha256((dest/'parchment.webp').read_bytes()).hexdigest(),
    'variant':'individually-authored-sheet','source':'research/scroll-lab-v15/parchment-source.png',
    'material':'chapter-one material richness reference; new contour, fold layout and wear; no mirror'}
plan['resources']['keeper']={'source':'research/scroll-lab-v15/material-atlas.png',
    'sha256':hashlib.sha256((research/'material-atlas.png').read_bytes()).hexdigest(),
    'construction':'broad flattened copper-alloy frame, hinged pin, sewn fixed fold, perforated free tongue',
    'material':'co-registered albedo-derived roughness/oxide metalness and micrograin normal; artistic approximation'}
plan['models']['runtimeVerification']='v15 specimen; no per-run model attestation exposed.'
text=json.dumps(plan,ensure_ascii=False,indent=2)+'\n'
(folder/'art-plan.json').write_bytes(text.encode())
digest=hashlib.sha256(text.encode()).hexdigest()
template=(folder/'templates.js').read_text(encoding='utf-8-sig')
import re
template=re.sub("planDigest:'[a-f0-9]+'",f"planDigest:'{digest}'",template)
(folder/'templates.js').write_text(template,encoding='utf-8')
record=json.loads((folder/'chapter-sample.json').read_text(encoding='utf-8-sig'))
record['proof']['sampleTime']=datetime.datetime.now(datetime.timezone.utc).isoformat(timespec='milliseconds').replace('+00:00','Z')
(folder/'chapter-sample.json').write_text(json.dumps(record,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'paperSize':paper.size,'planDigest':digest,'sampleTime':record['proof']['sampleTime']}))

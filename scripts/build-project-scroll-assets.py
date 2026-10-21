"""Encode the selected imagegen originals and derive only micrograin maps.

No artistic repainting, synthetic ageing, crop, mirror or new pigment is applied.
The original RGBA files remain the recoverable master assets.
"""
from PIL import Image, ImageFilter, ImageOps
from pathlib import Path
import hashlib, json, math, shutil

root = Path(__file__).resolve().parents[1]
source = root / 'research/project-commemorative-2026-10-21/source'
dest = root / 'web/labs/project-commemorative/assets'
dest.mkdir(parents=True, exist_ok=True)
paper = Image.open(source / 'parchment.png').convert('RGBA')
paper.save(dest / 'parchment.webp', lossless=True, method=6)
shutil.copyfile(source / 'returning-thread.png', dest / 'returning-thread.png')
gray = ImageOps.grayscale(paper)
soft = gray.filter(ImageFilter.GaussianBlur(2))
w, h = paper.size
p, q = gray.load(), soft.load()
height = Image.new('L', (w, h), 128)
rough = Image.new('L', (w, h), 240)
z, rr = height.load(), rough.load()
for y in range(h):
    for x in range(w):
        grain = max(-18, min(18, p[x, y] - q[x, y]))
        z[x, y] = int(128 + grain * .65)
        rr[x, y] = int(max(220, min(251, 240 + grain * .30)))
normal = Image.new('RGB', (w, h))
n = normal.load()
for y in range(h):
    for x in range(w):
        dx = (z[min(w-1, x+1), y] - z[max(0, x-1), y]) * .013
        dy = (z[x, min(h-1, y+1)] - z[x, max(0, y-1)]) * .013
        length = math.sqrt(1 + dx*dx + dy*dy)
        n[x, y] = (int(128-127*dx/length), int(128+127*dy/length), int(128+127/length))
normal.save(dest / 'parchment-normal.jpg', quality=94)
rough.save(dest / 'parchment-roughness.jpg', quality=94)
plan_path = dest.parent / 'art-plan.json'
plan = json.loads(plan_path.read_text(encoding='utf-8'))
for role in ['paper', 'normal', 'roughness', 'ornament']:
    item = plan['resources'][role]
    file = dest.parent / item['src']
    item['sha256'] = hashlib.sha256(file.read_bytes()).hexdigest()
plan['models']['imageTool'] = 'built-in image_gen.imagegen'
plan['models']['imageModel'] = 'not exposed by tool'
plan['models']['imageQuality'] = 'not exposed by tool'
plan['models']['creativeDispatch'] = {'tool':'collaboration.spawn_agent','task':'project_scroll_art_direction','model':'gpt-6.1-sol','reasoningEffort':'xhigh','scope':'art direction, English/Chinese copy and image prompts; API dispatch parameters, not a hidden model attestation'}
plan_path.write_text(json.dumps(plan, ensure_ascii=False, indent=2) + '\n', encoding='utf-8', newline='\n')
evidence = []
for file in [source/'parchment.png', source/'returning-thread.png', *sorted(dest.iterdir())]:
    if not file.is_file() or file.suffix.lower() not in ['.png', '.jpg', '.webp']: continue
    item = {'path':file.relative_to(root).as_posix(),'bytes':file.stat().st_size,'sha256':hashlib.sha256(file.read_bytes()).hexdigest()}
    im = Image.open(file)
    item.update(size=im.size, mode=im.mode)
    if im.mode == 'RGBA': item['alphaExtrema'] = im.getchannel('A').getextrema()
    evidence.append(item)
report = {'assets':evidence,'paperSourcePixels':[w,h],'typesetPixels':[2048,2868],'notes':['Source images are original built-in imagegen results, not historical scans.','WebP preserves the selected RGBA paper losslessly; PNG miniature copied byte-for-byte.','Normal/roughness are micrograin approximations; broad ageing remains in albedo.','Typeset resolution does not imply extra native image detail.']}
(source.parent / 'asset-manifest.json').write_text(json.dumps(report, ensure_ascii=False, indent=2)+'\n', encoding='utf-8', newline='\n')
print(json.dumps({'paperSize':paper.size,'runtimeBytes':sum(f.stat().st_size for f in dest.iterdir() if f.is_file())}))

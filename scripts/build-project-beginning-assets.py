"""Prepare trial inputs without repainting their age or inventing height.

The paper/miniature remain unadopted candidates until their complete material,
typesetting and actual display have been reviewed. The micro maps are the
independent first-chapter scan channels, not paper-color-derived pseudo height.
"""
from pathlib import Path
from PIL import Image
import hashlib, json, shutil

root = Path(__file__).resolve().parents[1]
research = root / 'research/project-scroll-redesign-2026-10-21'
source = research / 'source'
directory = root / 'web/labs/project-beginning'
assets = directory / 'assets'
assets.mkdir(parents=True, exist_ok=True)
paper = Image.open(source / 'parchment.png').convert('RGBA')
paper.save(assets / 'parchment.webp', lossless=True, method=6)
shutil.copyfile(source / 'daily-miniature.png', assets / 'daily-miniature.png')
plan_file = directory / 'art-plan.json'
plan = json.loads(plan_file.read_text(encoding='utf-8'))
manifest = []
for role, entry in plan['resources'].items():
    file = (directory / entry['src']).resolve()
    if not file.is_relative_to(root / 'web'):
        raise ValueError('Resource is outside the web workspace')
    data = file.read_bytes()
    entry['sha256'] = hashlib.sha256(data).hexdigest()
    item = dict(role=role, path=file.relative_to(root).as_posix(), bytes=len(data), sha256=entry['sha256'])
    if file.suffix.lower() in ['.png', '.webp', '.jpg']:
        im = Image.open(file)
        item.update(size=im.size, mode=im.mode)
    manifest.append(item)
plan['models']['imageTool'] = 'built-in image_gen.imagegen'
plan['models']['imageModel'] = 'not exposed'
plan['models']['imageQuality'] = 'not exposed'
plan['models']['creativeDispatch'] = dict(tool='collaboration.followup_task', task='project_scroll_art_direction', inheritedModel='gpt-6.1-sol', inheritedReasoningEffort='xhigh', note='Continuing the explicitly configured creative agent; image model is separate and not exposed.')
plan_file.write_text(json.dumps(plan, ensure_ascii=False, indent=2)+'\n', encoding='utf-8', newline='\n')
report = dict(status='trial inputs, not adopted paper or artwork', paperSourcePixels=paper.size, typesetPixels=[2048,2868], resources=manifest,
    notes=['Paper encoded losslessly; miniature bytes copied unchanged; original PNGs retained.',
           'No color-stain-to-height conversion, procedural repainting, crop, mirror or sharpening.',
           'Independent micro normal and roughness reuse the first-chapter CC0 scan channels. Their material/calibration limits still apply.',
           'Runtime parameters, print/pressure and actual GPU preservation are separate later operations.'])
(research / 'trial-asset-manifest.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(dict(paperSize=paper.size, resources=len(manifest))))

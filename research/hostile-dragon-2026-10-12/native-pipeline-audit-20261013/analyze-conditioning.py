"""Inspect image preparation and sampling logs without changing either artwork."""
from pathlib import Path
from PIL import Image
import numpy as np,json,hashlib,re
from scipy import ndimage
OUT=Path(__file__).resolve().parent
ROOT=Path('D:/CodexStorage/workspaces/hostile-dragon-coin/kaggle-test')
result={}
for name,path in [
 ('old',ROOT/'inputs/dragon-art-input-20261011/generation-input.png'),
 ('new_local',ROOT/'production-front-20261013/input/front-for-trellis.png'),
 ('new_remote',ROOT/'production-front-20261013/remote/dragon-front-shape/conditioning-front.png')]:
 p=np.asarray(Image.open(path).convert('RGB'))
 foreground=p.max(2)>10
 yy,xx=np.where(foreground)
 result[name]={'size':[p.shape[1],p.shape[0]],'rgb_pixel_sha256':hashlib.sha256(p.tobytes()).hexdigest(),'nonblack_bounds':[int(xx.min()),int(yy.min()),int(xx.max()),int(yy.max())],'nonblack_pixel_fraction':float(foreground.mean())}
mask=np.asarray(Image.open(ROOT/'production-front-20261013/input/segmentation-mask.png'))>127
filled=ndimage.binary_fill_holes(mask);holes=filled&~mask
labels,n=ndimage.label(holes)
sizes=np.bincount(labels.ravel());order=np.argsort(sizes[1:])[::-1][:8]+1
result['new_segmentation']={'internal_excluded_pixels':int(holes.sum()),'internal_holes_larger_than_16_pixels':int((sizes[1:]>16).sum()),'largest_holes':[]}
for k in order:
 yy,xx=np.where(labels==k)
 if len(xx):result['new_segmentation']['largest_holes'].append({'pixels':len(xx),'bounds':[int(xx.min()),int(yy.min()),int(xx.max()),int(yy.max())]})
log=(ROOT/'outputs/remote-generation/hostile-dragon-generation-20261011.log').read_text(encoding='utf-8',errors='replace')
result['original_step_totals_from_log']={}
for stage in ['Sampling sparse structure','Sampling shape SLat']:
 totals=sorted(set(int(x) for x in re.findall(re.escape(stage)+r'.*?\b\d+/(\d+)',log)))
 result['original_step_totals_from_log'][stage]=totals
result['new_local_matches_recorded_remote_pixels']=result['new_local']['rgb_pixel_sha256']==result['new_remote']['rgb_pixel_sha256']
result['archived_notebook_runtime_checks']={}
for label,p in [('original',ROOT/'notebooks/generation/dragon.ipynb'),('recovery',ROOT/'notebooks/generation-recovery/dragon.ipynb'),('new_native',ROOT/'production-front-20261013/notebook/front.ipynb'),('regional_v1',ROOT/'regional-rebuild-20261013/notebook/regional.ipynb')]:
 if p.exists():
  notebook=json.loads(p.read_text(encoding='utf-8'))
  setup='\n'.join(''.join(c.get('source',[])) for c in notebook['cells'] if c['cell_type']=='code')
  result['archived_notebook_runtime_checks'][label]={'file':str(p),'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'has_sampling_rng_fork': 'torch.random.fork_rng' in setup,'lazy_model_nn_module': 'class LazyModel(torch.nn.Module)' in setup}
(OUT/'conditioning-audit.json').write_text(json.dumps(result,indent=2),encoding='utf-8')
print(json.dumps(result))

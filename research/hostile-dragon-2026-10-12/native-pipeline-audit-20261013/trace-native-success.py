"""Read-only asset/log provenance research. No model calls or geometry edits."""
from pathlib import Path
import hashlib,json,requests,zipfile,ast
OUT=Path(__file__).resolve().parent
ROOT=Path('D:/CodexStorage/workspaces/hostile-dragon-coin')
K=ROOT/'kaggle-test'
paths={
 'original_processed_input':K/'inputs/dragon-art-input-20261011/generation-input.png',
 'original_shape_checkpoint':K/'outputs/remote-generation/dragon-generation/sample_shape_slat-checkpoint.pt',
 'recovered_source_volume':K/'outputs/remote-generation-recovery/dragon-generation/source-volume.npz',
 'official_repaired_glb':K/'outputs/remote-mesh-repair-512/dragon-mesh-repair/hostile-dragon-repaired.glb',
 'quiet_reverse_blend':K/'outputs/quiet-repaired-v4/reverse-master.blend',
 'valid_old_blend':K/'outputs/original-eye-v5/working-master.blend',
 'approved_concept':Path('D:/CodexStorage/workspaces/ai3d-design-research/design-engineering/concept-anchor-v1/assets/selected-anchor.png'),
 'native_new_conditioning':K/'production-front-20261013/input/front-for-trellis.png',
 'latest_editable_branch':ROOT/'studio-20261013/outputs/user-selected-regional/deliverable/hostile-dragon-selected-working.blend'}
result={'scope':'Pure analysis; source files read only; no inference','files':{}}
for label,p in paths.items():
 result['files'][label]={'path':str(p),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()}
def report(rel):return json.loads((K/rel).read_text(encoding='utf-8'))
result['original_generation']=report('outputs/remote-generation/dragon-generation/generation.json')
result['recovery']=report('outputs/remote-generation-recovery/dragon-generation/generation.json')
result['official_repair']=report('outputs/remote-mesh-repair-512/dragon-mesh-repair/repair.json')
result['eye_restoration']=report('outputs/original-eye-v5/review.json')
result['new_native_trial_log_only']=report('production-front-20261013/remote/dragon-front-shape/generation.json')
result['rejected_whole_mesh_used_as_geometry']=False
with zipfile.ZipFile(paths['original_shape_checkpoint']) as z:
 result['original_checkpoint_zip_members']=[n for n in z.namelist() if '/data/' not in n]
 # Pickle is not executed; inspect available key strings only.
 b=z.read(next(n for n in z.namelist() if n.endswith('/data.pkl')))
 result['original_checkpoint_saved_rng_key_present']=b'cpu_rng_state' in b or b'cuda_rng_state' in b
url='https://huggingface.co/microsoft/TRELLIS.2-4B/resolve/af44b45f2e35a493886929c6d786e563ec68364d/pipeline.json'
session=requests.Session();session.trust_env=False
try:
 r=session.get(url,timeout=(15,45));r.raise_for_status();config=r.json()
 (OUT/'official-pinned-pipeline.json').write_text(json.dumps(config,indent=2),encoding='utf-8')
 result['official_config']={'source':url,'sha256':hashlib.sha256(r.content).hexdigest(),'args':config['args']}
except Exception as e:result['official_config_read_error']=type(e).__name__+': '+str(e)[:400]
(OUT/'analysis-evidence.json').write_text(json.dumps(result,indent=2),encoding='utf-8')
print(json.dumps({'verified_files':{k:v['sha256'] for k,v in result['files'].items()},'original_saved_rng_keys':result['original_checkpoint_saved_rng_key_present'],'official_config':result.get('official_config',{}).get('args',{}),'config_error':result.get('official_config_read_error')}))

"""Bounded T4 sparse-convolution dependency test; no model weights or secrets."""
import datetime
import hashlib
import json
import os
import pathlib
import shutil
import subprocess
import sys
import time
import traceback

START = time.monotonic()
OUT = pathlib.Path('/kaggle/working/dragon-compat')
OUT.mkdir(parents=True, exist_ok=True)
SCRATCH = pathlib.Path('/kaggle/temp/dragon-compat')
SCRATCH.mkdir(parents=True, exist_ok=True)
os.environ.update(TORCH_CUDA_ARCH_LIST='7.5', MAX_JOBS='2', PIP_CACHE_DIR=str(SCRATCH/'pip'), TMPDIR=str(SCRATCH/'tmp'), TORCH_EXTENSIONS_DIR=str(SCRATCH/'extensions'))
(SCRATCH/'tmp').mkdir(exist_ok=True)
REPORT = {'started_at': datetime.datetime.now(datetime.timezone.utc).isoformat(), 'model_generated': False, 'tests': {}, 'stage': 'starting'}

def save():
    REPORT['elapsed_seconds'] = round(time.monotonic()-START, 2)
    (OUT/'compatibility.json').write_text(json.dumps(REPORT, indent=2), encoding='utf-8')
    print(json.dumps(REPORT), flush=True)

def command(args, label, timeout=120, cwd=None):
    with (OUT/(label+'.log')).open('w', encoding='utf-8') as log:
        completed = subprocess.run(args, cwd=cwd, stdout=log, stderr=subprocess.STDOUT, timeout=timeout)
    if completed.returncode:
        raise RuntimeError(label+' failed: '+(OUT/(label+'.log')).read_text(encoding='utf-8')[-3500:])

try:
    import torch
    if not torch.cuda.is_available():
        raise RuntimeError('GPU missing; no installations performed')
    REPORT.update(torch=torch.__version__, cuda=torch.version.cuda, gpu=torch.cuda.get_device_name(), disk_free_gib=round(shutil.disk_usage(SCRATCH).free/2**30,2))
    # Reference-derived pin injected locally into this private notebook.
    PINS = SOURCE_PINS
    if globals().get('REUSE_WHEEL_SHA'):
        REPORT['stage']='reusing_preserved_wheel';save()
        wheel=next(pathlib.Path('/kaggle/input').rglob('flex_gemm*.whl'))
        if hashlib.sha256(wheel.read_bytes()).hexdigest()!=REUSE_WHEEL_SHA:
            raise RuntimeError('Attached wheel hash mismatch')
    else:
        repo = SCRATCH/'FlexGEMM'
        REPORT['stage'] = 'building_flexgemm'; save()
        command(['git','clone','--filter=blob:none','https://github.com/JeffreyXiang/FlexGEMM.git',str(repo)],'clone')
        command(['git','checkout',PINS['JeffreyXiang/FlexGEMM']], 'checkout', cwd=repo)
        command([sys.executable,'-m','pip','wheel','.', '--no-deps','--no-build-isolation','-w',str(OUT/'wheels')],'build-flexgemm',timeout=650,cwd=repo)
        wheel=next((OUT/'wheels').glob('flex_gemm*.whl'))
    command([sys.executable,'-m','pip','install','--no-deps',str(wheel)],'install-flexgemm',timeout=90)
    REPORT['wheel']={'file':wheel.name,'bytes':wheel.stat().st_size,'sha256':hashlib.sha256(wheel.read_bytes()).hexdigest()}
    import flex_gemm.ops.spconv as spconv
    # Fully occupied 8^3 sparse cube: compare the explicit route with dense Conv3d.
    grid=torch.cartesian_prod(torch.arange(8),torch.arange(8),torch.arange(8))
    coords=torch.cat([torch.zeros((len(grid),1),dtype=torch.int64),grid],dim=1).int().cuda()
    for label,dtype in [('fp16',torch.float16),('bf16',torch.bfloat16)]:
        try:
            torch.manual_seed(38017)
            feats=torch.randn((len(grid),16),device='cuda',dtype=dtype)
            weight=torch.randn((16,3,3,3,16),device='cuda',dtype=dtype)*0.05
            bias=torch.randn(16,device='cuda',dtype=dtype)*0.05
            spconv.set_algorithm(spconv.Algorithm.EXPLICIT_GEMM)
            actual,_=spconv.sparse_submanifold_conv3d(feats,coords,(1,16,8,8,8),weight,bias)
            torch.cuda.synchronize()
            expected=torch.nn.functional.conv3d(feats.reshape(8,8,8,16).permute(3,0,1,2).unsqueeze(0).float(),weight.permute(0,4,1,2,3).float(),bias.float(),padding=1).squeeze(0).permute(1,2,3,0).reshape(-1,16)
            error=(actual.float()-expected).abs().max().item()
            REPORT['tests'][label]={'finite':bool(torch.isfinite(actual).all().item()),'max_abs_vs_dense_fp32':error,'shape':list(actual.shape)}
        except Exception:
            REPORT['tests'][label]={'error':traceback.format_exc()[-5000:]}
        save()
    REPORT['stage']='dependency_probe_completed'
except Exception:
    REPORT['stage']='dependency_probe_failed'
    REPORT['error']=traceback.format_exc()[-6500:]
finally:
    save()

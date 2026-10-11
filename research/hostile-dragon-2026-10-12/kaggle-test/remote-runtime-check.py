"""Use preserved wheels to verify an actual tiny GLB export, not an art sample."""
import datetime,hashlib,json,os,pathlib,subprocess,sys,time,traceback
START=time.monotonic()
OUT=pathlib.Path('/kaggle/working/dragon-runtime');OUT.mkdir(parents=True,exist_ok=True)
REPORT={'started_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'model_generated':False,'tests':{},'stage':'installing_preserved_wheels'}
os.environ['TORCH_CUDA_ARCH_LIST']='7.5'
def save():
    REPORT['elapsed_seconds']=round(time.monotonic()-START,2)
    (OUT/'runtime.json').write_text(json.dumps(REPORT,indent=2),encoding='utf-8');print(json.dumps(REPORT),flush=True)
try:
    import torch
    if not torch.cuda.is_available():raise RuntimeError('GPU missing')
    subprocess.run([sys.executable,'-m','pip','install','trimesh','opencv-python-headless','pillow','scipy','zstandard','tqdm','plyfile','easydict'],check=True,timeout=120)
    wheels=list(pathlib.Path('/kaggle/input').rglob('*.whl'))
    checked=[]
    for name,sha in EXPECTED_WHEELS.items():
        wheel=next(w for w in wheels if w.name==name)
        if hashlib.sha256(wheel.read_bytes()).hexdigest()!=sha:raise RuntimeError('Wheel hash mismatch: '+name)
        checked.append(str(wheel))
    subprocess.run([sys.executable,'-m','pip','install','--no-deps',*checked],check=True,timeout=90)
    REPORT['stage']='attention_test';save()
    from torch.nn.attention import sdpa_kernel,SDPBackend
    # Test the T4-compatible memory-efficient FP32 route separately from math fallback.
    q=torch.randn((1,4,1024,64),device='cuda',dtype=torch.bfloat16)
    try:
        with sdpa_kernel(SDPBackend.EFFICIENT_ATTENTION):
            actual=torch.nn.functional.scaled_dot_product_attention(q.float(),q.float(),q.float())
        with sdpa_kernel(SDPBackend.MATH):
            expected=torch.nn.functional.scaled_dot_product_attention(q.float(),q.float(),q.float())
        REPORT['tests']['memory_efficient_fp32_attention']={'finite':bool(torch.isfinite(actual).all().item()),'max_abs_vs_math':(actual-expected).abs().max().item()}
    except Exception:REPORT['tests']['memory_efficient_fp32_attention']={'error':traceback.format_exc()[-2500:]}
    del q
    torch.cuda.empty_cache()
    REPORT['stage']='tiny_glb_export';save()
    import o_voxel.postprocess
    v=torch.tensor([[-.2,-.2,-.2],[.2,-.2,-.2],[.2,.2,-.2],[-.2,.2,-.2],[-.2,-.2,.2],[.2,-.2,.2],[.2,.2,.2],[-.2,.2,.2]],device='cuda',dtype=torch.float32)
    f=torch.tensor([[0,2,1],[0,3,2],[4,5,6],[4,6,7],[0,1,5],[0,5,4],[1,2,6],[1,6,5],[2,3,7],[2,7,6],[3,0,4],[3,4,7]],device='cuda',dtype=torch.int32)
    coords=torch.cartesian_prod(torch.arange(8),torch.arange(8),torch.arange(8)).int().cuda()
    attrs=torch.ones((len(coords),6),device='cuda',dtype=torch.float32)
    attrs[:,:3]=torch.tensor([0.8,0.2,0.05],device='cuda');attrs[:,3]=0.6;attrs[:,4]=0.4
    glb=o_voxel.postprocess.to_glb(vertices=v,faces=f,attr_volume=attrs,coords=coords,attr_layout={'base_color':slice(0,3),'metallic':slice(3,4),'roughness':slice(4,5),'alpha':slice(5,6)},aabb=[[-0.5,-0.5,-0.5],[0.5,0.5,0.5]],grid_size=8,decimation_target=12,texture_size=64,remesh=False,verbose=True)
    target=OUT/'technical-cube.glb';glb.export(target)
    REPORT['tests']['glb_export']={'bytes':target.stat().st_size,'sha256':hashlib.sha256(target.read_bytes()).hexdigest(),'technical_only':True}
    REPORT['stage']='runtime_export_completed'
except Exception:REPORT['stage']='runtime_export_failed';REPORT['error']=traceback.format_exc()[-6000:]
finally:save()

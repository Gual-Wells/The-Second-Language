"""Bounded CUDA geometry dependencies test, no model weights or secrets."""
import datetime, hashlib, importlib.util, json, os, pathlib, shutil, subprocess, sys, time, traceback
START=time.monotonic()
OUT=pathlib.Path('/kaggle/working/dragon-geometry');OUT.mkdir(parents=True,exist_ok=True)
SCRATCH=pathlib.Path('/kaggle/temp/dragon-geometry');SCRATCH.mkdir(parents=True,exist_ok=True)
(SCRATCH/'tmp').mkdir(exist_ok=True)
os.environ.update(TORCH_CUDA_ARCH_LIST='7.5',MAX_JOBS='4',PIP_CACHE_DIR=str(SCRATCH/'pip'),TMPDIR=str(SCRATCH/'tmp'),TORCH_EXTENSIONS_DIR=str(SCRATCH/'extensions'))
REPORT={'started_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'model_generated':False,'packages':{},'stage':'starting'}
def save():
    REPORT['elapsed_seconds']=round(time.monotonic()-START,2)
    (OUT/'geometry.json').write_text(json.dumps(REPORT,indent=2),encoding='utf-8')
    print(json.dumps(REPORT),flush=True)
def command(args,label,timeout=120,cwd=None):
    with (OUT/(label+'.log')).open('w',encoding='utf-8') as log:
        result=subprocess.run(args,cwd=cwd,stdout=log,stderr=subprocess.STDOUT,timeout=timeout)
    if result.returncode:raise RuntimeError(label+': '+(OUT/(label+'.log')).read_text(encoding='utf-8')[-3500:])
def checkout(url,sha,name,recursive=False):
    folder=SCRATCH/name
    command(['git','clone','--filter=blob:none',url,str(folder)],name+'-clone')
    command(['git','checkout',sha],name+'-checkout',cwd=folder)
    if recursive:command(['git','submodule','update','--init','--recursive'],name+'-submodules',timeout=180,cwd=folder)
    return folder
def build(folder,label,timeout):
    command([sys.executable,'-m','pip','wheel','-v','.', '--no-deps','--no-build-isolation','-w',str(OUT/'wheels')],label+'-build',timeout=timeout,cwd=folder)
    wheels=list((OUT/'wheels').glob(label+'*.whl'))
    wheel=wheels[0]
    command([sys.executable,'-m','pip','install','--no-deps',str(wheel)],label+'-install')
    return {'file':wheel.name,'bytes':wheel.stat().st_size,'sha256':hashlib.sha256(wheel.read_bytes()).hexdigest()}
try:
    import torch
    if not torch.cuda.is_available():raise RuntimeError('GPU not assigned')
    REPORT.update(torch=torch.__version__,cuda=torch.version.cuda,gpu=torch.cuda.get_device_name(),disk_free_gib=round(shutil.disk_usage(SCRATCH).free/2**30,2))
    wheel=next(pathlib.Path('/kaggle/input').rglob('flex_gemm*.whl'))
    if hashlib.sha256(wheel.read_bytes()).hexdigest()!=FLEX_WHEEL_SHA:raise RuntimeError('Flex wheel hash mismatch')
    command([sys.executable,'-m','pip','install','--no-deps',str(wheel)],'install-flex-wheel')
    REPORT['stage']='cumesh_build';save()
    repo=checkout('https://github.com/JeffreyXiang/CuMesh.git',SOURCE_PINS['JeffreyXiang/CuMesh'],'CuMesh',True)
    REPORT['packages']['cumesh']=build(repo,'cumesh',900)
    import cumesh
    mesh=cumesh.CuMesh()
    v=torch.tensor([[0,0,0],[1,0,0],[0,1,0],[0,0,1]],dtype=torch.float32,device='cuda')
    f=torch.tensor([[0,2,1],[0,1,3],[1,2,3],[2,0,3]],dtype=torch.int32,device='cuda')
    mesh.init(v,f);got_v,got_f=mesh.read();torch.cuda.synchronize()
    REPORT['packages']['cumesh']['tetrahedron']={'vertices':list(got_v.shape),'faces':list(got_f.shape),'finite':bool(torch.isfinite(got_v).all().item())};save()
    REPORT['stage']='nvdiffrast_build';save()
    repo=checkout('https://github.com/NVlabs/nvdiffrast.git','v0.4.0','nvdiffrast')
    REPORT['packages']['nvdiffrast']=build(repo,'nvdiffrast',200)
    import nvdiffrast.torch as dr
    context=dr.RasterizeCudaContext()
    pos=torch.tensor([[[-0.5,-0.5,0,1],[0.5,-0.5,0,1],[0,0.5,0,1]]],dtype=torch.float32,device='cuda')
    rast,_=dr.rasterize(context,pos,torch.tensor([[0,1,2]],dtype=torch.int32,device='cuda'),resolution=[32,32])
    REPORT['packages']['nvdiffrast']['rasterization']={'covered_pixels':int((rast[...,3]>0).sum().item())};save()
    REPORT['stage']='ovoxel_build';save()
    repo=checkout('https://github.com/microsoft/TRELLIS.2.git',SOURCE_PINS['microsoft/TRELLIS.2'],'TRELLIS.2',True)
    REPORT['packages']['o_voxel']=build(repo/'o-voxel','o_voxel',350)
    import o_voxel
    import o_voxel.postprocess
    REPORT['packages']['o_voxel']['postprocess_imported']=True
    REPORT['stage']='geometry_dependencies_completed'
except Exception:
    REPORT['stage']='geometry_dependencies_failed';REPORT['error']=traceback.format_exc()[-6000:]
finally:save()

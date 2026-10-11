"""One bounded mesh repair/export from preserved geometry and material volume; no model sampling."""
import ast, datetime, hashlib, importlib.util, json, pathlib, sys
ROOT=pathlib.Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('control',ROOT/'run-kaggle.py')
control=importlib.util.module_from_spec(spec);spec.loader.exec_module(control)
from kaggle.api.kaggle_api_extended import KaggleApi
api=KaggleApi();api.authenticate()
prefix='mesh-repair-512';kernel='gualwells/hostile-dragon-mesh-repair-20261011'
receipt=ROOT/'outputs'/(prefix+'-submission.json')
action=sys.argv[1]
if action=='status':print(control.safe(api.kernels_status(kernel)))
elif action=='fetch':
    out=ROOT/'outputs'/('remote-'+prefix);out.mkdir(exist_ok=True)
    api.kernels_output(kernel,path=str(out))
    control.save('quota-after-'+prefix+'.json',control.quotas(api))
    report=out/'dragon-mesh-repair'/'repair.json'
    print(report.read_text() if report.exists() else 'No report')
elif action=='push':
    if receipt.exists():raise RuntimeError('Submission already recorded; inspect before retry')
    source=ROOT/'outputs'/'remote-generation-recovery'/'dragon-generation'
    report=json.loads((source/'generation.json').read_text())
    if report['stage']!='editable_candidate_saved':raise RuntimeError('Complete source required')
    original=json.loads((ROOT/'outputs'/'generation-recovery-submission.json').read_text())
    if json.loads(original['response'])['versionNumber']!=1:raise RuntimeError('Review source version')
    source_hash=hashlib.sha256((source/'source-volume.npz').read_bytes()).hexdigest()
    packages=json.loads((ROOT/'outputs'/'remote-geometry-v2'/'dragon-geometry'/'geometry.json').read_text())['packages']
    expected={v['file']:v['sha256'] for v in packages.values()}
    ops=json.loads((ROOT/'outputs'/'remote-operators'/'dragon-compat'/'compatibility.json').read_text())
    expected[ops['wheel']['file']]=ops['wheel']['sha256']
    quota=control.quotas(api)
    if quota['gpu']['remaining_seconds']<3000:raise RuntimeError('Insufficient repair quota')
    control.save('quota-before-'+prefix+'.json',quota)
    remote=r'''
import pathlib,os,json,hashlib,time,subprocess,sys,traceback
OUT=pathlib.Path('/kaggle/working/dragon-mesh-repair');OUT.mkdir(parents=True,exist_ok=True)
TMP=pathlib.Path('/kaggle/temp/dragon-mesh-repair');TMP.mkdir(parents=True,exist_ok=True)
os.environ.update(TMPDIR=str(TMP),PIP_CACHE_DIR=str(TMP/'pip'),TORCH_CUDA_ARCH_LIST='7.5')
started=time.monotonic();report={'stage':'setup','art_accepted':False,'geometry_resampled':False,'source_npz_sha256':SOURCE_HASH}
def save():
    report['elapsed_seconds']=round(time.monotonic()-started,2)
    (OUT/'repair.json').write_text(json.dumps(report,indent=2));print(json.dumps(report),flush=True)
def run(args,name,timeout=180):
    with (OUT/(name+'.log')).open('w') as f:subprocess.run(args,stdout=f,stderr=subprocess.STDOUT,check=True,timeout=timeout)
save()
try:
    run([sys.executable,'-m','pip','install','trimesh','opencv-python-headless','pillow','scipy','plyfile','tqdm','imageio','zstandard'],'dependencies',240)
    run([sys.executable,'-m','pip','install','git+https://github.com/EasternJournalist/utils3d.git@9a4eb15e4021b67b12c460c7057d642626897ec8'],'utils3d')
    wheels=[]
    for name,sha in EXPECTED.items():
        p=next(pathlib.Path('/kaggle/input').rglob(name))
        if hashlib.sha256(p.read_bytes()).hexdigest()!=sha:raise RuntimeError('Wheel hash mismatch')
        wheels.append(str(p))
    run([sys.executable,'-m','pip','install','--no-deps',*wheels],'wheels',90)
    repo=TMP/'TRELLIS.2'
    run(['git','clone','--filter=blob:none','https://github.com/microsoft/TRELLIS.2.git',str(repo)],'clone',120)
    run(['git','-C',str(repo),'checkout','75fbf0183001ed9876c8dbb35de6b68552ee08bd'],'checkout',60)
    sys.path.insert(0,str(repo));import torch,numpy as np,o_voxel.postprocess
    source=next(pathlib.Path('/kaggle/input').rglob('source-volume.npz'))
    if hashlib.sha256(source.read_bytes()).hexdigest()!=SOURCE_HASH:raise RuntimeError('Source artifact mismatch')
    layout=json.loads((source.parent/'source-volume-layout.json').read_text())['layout']
    with np.load(source,allow_pickle=False) as z:
        verts=torch.from_numpy(z['vertices']).cuda();faces=torch.from_numpy(z['faces']).cuda()
        attrs=torch.from_numpy(z['attrs']).cuda();coords=torch.from_numpy(z['coords']).cuda()
        voxel=float(z['voxel_size'])
    report.update(stage='repairing',remesh=True,remesh_band=1,remesh_project=0,decimation_target=1000000,texture_size=2048);save()
    with torch.no_grad():
        glb=o_voxel.postprocess.to_glb(vertices=verts,faces=faces,attr_volume=attrs,coords=coords,attr_layout={k:slice(*v) for k,v in layout.items()},voxel_size=voxel,aabb=[[-.5,-.5,-.5],[.5,.5,.5]],decimation_target=1000000,texture_size=2048,remesh=True,remesh_band=1,remesh_project=0,verbose=True)
    path=OUT/'hostile-dragon-repaired.glb';glb.export(path,extension_webp=True)
    report.update(stage='repaired_candidate_saved',bytes=path.stat().st_size,sha256=hashlib.sha256(path.read_bytes()).hexdigest(),vertices=len(glb.vertices),faces=len(glb.faces));save()
except Exception as e:
    report.update(stage='repair_failed',error=repr(e),traceback=traceback.format_exc());save()
'''
    code='SOURCE_HASH='+repr(source_hash)+'\nEXPECTED='+repr(expected)+'\n'+remote
    ast.parse(code)
    import nbformat
    folder=ROOT/'notebooks'/prefix;folder.mkdir(parents=True,exist_ok=True)
    nb=nbformat.v4.new_notebook(metadata={'kernelspec':{'display_name':'Python 3','language':'python','name':'python3'}},cells=[nbformat.v4.new_markdown_cell('# Preserved mesh repair\nNo resampling or paid calls. Source volume and compiled dependencies are checked by hash.'),nbformat.v4.new_code_cell(code)])
    nbformat.validate(nb);nbformat.write(nb,folder/'repair.ipynb')
    sources=[json.loads((ROOT/'outputs'/p).read_text())['kernel'] for p in ['geometry-submission.json','compat-submission.json']]
    sources.append(original['kernel']+'/1')
    meta={'id':kernel,'title':'Hostile Dragon Mesh Repair 20261011','code_file':'repair.ipynb','language':'python','kernel_type':'notebook','is_private':True,'enable_gpu':True,'enable_internet':True,'dataset_sources':[],'kernel_sources':sources,'competition_sources':[],'model_sources':[]}
    (folder/'kernel-metadata.json').write_text(json.dumps(meta,indent=2))
    control.save(prefix+'-submission.json',{'stage':'submitting','kernel':kernel,'source_sha256':hashlib.sha256(code.encode()).hexdigest(),'source_npz_sha256':source_hash,'created_at':datetime.datetime.now(datetime.timezone.utc).isoformat()})
    response=api.kernels_push(str(folder),timeout='1800',acc='NvidiaTeslaT4')
    control.save(prefix+'-submission.json',{'stage':'submitted','kernel':kernel,'response':str(response),'source_npz_sha256':source_hash});print(control.safe(response))
else:raise RuntimeError('Unknown action')

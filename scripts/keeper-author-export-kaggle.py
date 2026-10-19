"""Decode the preserved author's Pixal3D latents with the proven upstream tools."""
from pathlib import Path
import importlib.util,json,hashlib,datetime,sys,shutil,os,ast
ROOT=Path(__file__).resolve().parents[1];OLD=Path('D:/CodexStorage/workspaces/hostile-dragon-coin/kaggle-test')
WORK=ROOT/'.cache/keeper-author-export';WORK.mkdir(exist_ok=True)
s=importlib.util.spec_from_file_location('control',OLD/'run-kaggle.py');control=importlib.util.module_from_spec(s);s.loader.exec_module(control)
os.environ['TEMP']=os.environ['TMP']=str(WORK/'tmp');(WORK/'tmp').mkdir(exist_ok=True)
from kaggle.api.kaggle_api_extended import KaggleApi
api=KaggleApi();api.authenticate();user=api.get_config_value('username')
KERNEL=user+'/scroll-keeper-author-export-20261019';DATASET=user+'/scroll-keeper-author-latent-20261019'
def save(name,data):(WORK/name).write_text(control.safe(json.dumps(data,indent=2,default=str)))
def show(value):print(control.safe(str(value)))
action=sys.argv[1]
if action=='prepare':
 folder=WORK/'input';folder.mkdir(exist_ok=True)
 src=next((ROOT/'.cache/keeper-pixal-hf').glob('state_*.npz'));shutil.copy2(src,folder/'author-latents.npz')
 result=json.loads((ROOT/'.cache/keeper-pixal-hf/generation-result.json').read_text());save('latent-source.json',{'sha256':hashlib.sha256(src.read_bytes()).hexdigest(),'space_revision':'40a1519aadf70a82110a500997c19b626668a144','reference_sha256':'63343355742f1e7c112547cef9fc329e30a0921a4494dc08c8183450a569ba37','camera_angle_x':result['camera_angle_x'],'distance':result['distance'],'shape_resampled':False})
 (folder/'dataset-metadata.json').write_text(json.dumps({'id':DATASET,'title':'Keeper author-generated latents 20261019','licenses':[{'name':'other'}],'description':'Private project generated sparse latents only. No credentials or model weights.'},indent=2))
 geom=json.loads((OLD/'outputs/remote-geometry-v2/dragon-geometry/geometry.json').read_text());ops=json.loads((OLD/'outputs/remote-operators/dragon-compat/compatibility.json').read_text())
 expected={v['file']:v['sha256'] for v in geom['packages'].values()};expected[ops['wheel']['file']]=ops['wheel']['sha256']
 pins=json.loads((OLD/'sources/generation-model-pins.json').read_text());adapt=(OLD/'t4-adaptation.py').read_text()
 code=(OLD/'remote-generate.py').read_text().replace('dragon-generation','keeper-author-export').replace('hostile-dragon-source.glb','keeper-author-source.glb')
 code=code.replace("'seed':38017","'seed':42")
 start=code.index("    image=Image.open(source/'generation-input.png').convert('RGB')")
 end=code.index('    shape,tex,res=latent',start)
 replacement="""    import numpy as np
    from trellis2.modules.sparse import SparseTensor
    latent_file=next(pathlib.Path('/kaggle/input').rglob('author-latents.npz'))
    if hashlib.sha256(latent_file.read_bytes()).hexdigest()!=LATENT_SHA:raise RuntimeError('Author latent SHA mismatch')
    saved=np.load(latent_file,allow_pickle=False)
    shape=SparseTensor(feats=torch.from_numpy(saved['shape_slat_feats']).cuda(),coords=torch.from_numpy(saved['coords']).cuda())
    tex=shape.replace(torch.from_numpy(saved['tex_slat_feats']).cuda())
    res=int(saved['res']);REPORT['author_latent_sha256']=LATENT_SHA
    REPORT['shape_resampled']=False;REPORT['texture_resampled']=False
    with torch.no_grad():meshes=pipeline.decode_latent(shape,tex,res)
    latent=(shape,tex,res)
"""
 code=code[:start]+replacement+code[end:]
 code=code.replace('decimation_target=500000','decimation_target=300000').replace("texture_size=2048 if PIPELINE_TYPE=='512' else 4096","texture_size=2048").replace('remesh=False,verbose=True','remesh=True,verbose=True')
 header="import signal\nfrom pathlib import Path\nPath('/kaggle/temp').mkdir(exist_ok=True)\ndef timeout(*args):raise TimeoutError('Author export bounded at 1800 seconds')\nsignal.signal(signal.SIGALRM,timeout);signal.alarm(1800)\nPath('/kaggle/temp/t4-adaptation.py').write_text("+repr(adapt)+")\n"
 header+="SOURCE_SHA='75fbf0183001ed9876c8dbb35de6b68552ee08bd'\nMODEL_PINS="+repr(pins)+"\nEXPECTED_WHEELS="+repr(expected)+"\nPIPELINE_TYPE='1024_cascade'\nVALIDATION_ONLY=False\nUSE_CACHED_INPUT=True\nADAPTATION_FILE='/kaggle/temp/t4-adaptation.py'\nLATENT_SHA="+repr(hashlib.sha256(src.read_bytes()).hexdigest())+'\n'
 code=header+code;ast.parse(code)
 nb=WORK/'notebook';nb.mkdir(exist_ok=True);(nb/'export.py').write_text(code)
 (nb/'kernel-metadata.json').write_text(json.dumps({'id':KERNEL,'title':'Scroll Keeper Author Export 20261019','code_file':'export.py','language':'python','kernel_type':'script','is_private':True,'enable_gpu':True,'enable_internet':True,'dataset_sources':[user+'/dragon-art-input-20261011',DATASET],'kernel_sources':[user+'/hostile-dragon-t4-geometry-20261011',user+'/hostile-dragon-t4-compatibility-20261011'],'model_sources':['hark99/facebookdinov3-vitl16-pretrain-lvd1689m/transformers/default/1'],'competition_sources':[]},indent=2))
 show({'prepared':KERNEL,'latent_sha256':hashlib.sha256(src.read_bytes()).hexdigest()})
elif action=='upload':
 if (WORK/'upload.json').exists():raise RuntimeError('Upload already attempted')
 save('upload.json',{'stage':'submitting'});r=api.dataset_create_new(str(WORK/'input'),public=False,quiet=True,convert_to_csv=False);save('upload.json',{'response':str(r)});show(r)
elif action=='push':
 if (WORK/'submission.json').exists():raise RuntimeError('Submission exists; inspect before retry')
 if str(api.dataset_status(DATASET)).lower()!='ready':raise RuntimeError('Latent dataset not ready')
 if json.loads(str(api.kernels_status(user+'/scroll-keeper-pixal-rig-20261019')))['status']!='COMPLETE':raise RuntimeError('Prior native job not complete')
 save('quota-before.json',control.quotas(api));save('submission.json',{'stage':'submitting'})
 r=api.kernels_push(str(WORK/'notebook'),timeout='2100',acc='NvidiaTeslaT4');save('submission.json',{'response':str(r)});show(r)
elif action=='status':
 data={'status':str(api.kernels_status(KERNEL)),'quota':control.quotas(api)};save('status.json',data);show(data)
elif action=='fetch':
 state=json.loads(str(api.kernels_status(KERNEL)))
 if state['status'] not in ['COMPLETE','ERROR','CANCELLED']:raise RuntimeError('Export still active')
 out=WORK/'output';out.mkdir(exist_ok=True);api.kernels_output(KERNEL,path=str(out));save('quota-after.json',control.quotas(api));show(state)
else:raise RuntimeError('Unknown action')

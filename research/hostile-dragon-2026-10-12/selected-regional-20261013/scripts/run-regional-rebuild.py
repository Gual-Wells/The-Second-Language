"""Private bounded masked reconstruction. No rejected model/latent inputs."""
import pathlib,requests,importlib.util,json,ast,hashlib,sys
ROOT=pathlib.Path(__file__).resolve().parent;GUIDED='--reference-guided' in sys.argv
WORK=ROOT/('regional-rebuild-guided-20261013' if GUIDED else 'regional-rebuild-20261013');WORK.mkdir(exist_ok=True)
init=requests.Session.__init__;req=requests.Session.request
def direct(self,*a,**k):init(self,*a,**k);self.trust_env=False
def bounded(self,*a,**k):k.setdefault('timeout',(10,60));return req(self,*a,**k)
requests.Session.__init__=direct;requests.Session.request=bounded
spec=importlib.util.spec_from_file_location('control',ROOT/'run-kaggle.py');control=importlib.util.module_from_spec(spec);spec.loader.exec_module(control)
from kaggle.api.kaggle_api_extended import KaggleApi
api=KaggleApi();api.authenticate();USER=api.get_config_value('username');KERNEL=USER+('/dragon-regional-guided-20261013' if GUIDED else '/dragon-regional-reconstruction-20261013')
def save(name,data):(WORK/name).write_text(control.safe(json.dumps(data,indent=2,default=str)),encoding='utf-8')
def build():
 import nbformat
 geometry=json.loads((ROOT/'outputs/remote-geometry-v2/dragon-geometry/geometry.json').read_text())
 ops=json.loads((ROOT/'outputs/remote-operators/dragon-compat/compatibility.json').read_text())
 expected={v['file']:v['sha256'] for v in geometry['packages'].values()};expected[ops['wheel']['file']]=ops['wheel']['sha256']
 old=ROOT/'outputs/remote-generation/dragon-generation/sample_shape_slat-checkpoint.pt'
 original_sha=hashlib.sha256(old.read_bytes()).hexdigest()
 header="SOURCE_SHA='75fbf0183001ed9876c8dbb35de6b68552ee08bd'\nMODEL_PINS="+repr(json.loads((ROOT/'sources/generation-model-pins.json').read_text()))+'\nEXPECTED_WHEELS='+repr(expected)+"\nPIPELINE_TYPE='512'\nVALIDATION_ONLY=False\nUSE_CACHED_INPUT=True\nADAPTATION_FILE='/kaggle/temp/t4-adaptation.py'\nORIGINAL_LATENT_SHA="+repr(original_sha)+"\nAPPROVED_URL='https://raw.githubusercontent.com/Gual-Wells/The-Second-Language/7cd0c042c2ad2d4f0b6ecb3f15af1600da9bc421/research/hostile-dragon-2026-10-12/concept-anchor-v1/assets/selected-anchor.png'\nAPPROVED_FILE_SHA='be3bc1086a39e7abfec2f7e2e303c70393bf00dd8daa8b20ae5572fd5dd8d69f'\n"
 registration=json.loads(pathlib.Path('D:/CodexStorage/workspaces/hostile-dragon-coin/kaggle-test/outputs/retarget-old-20261013/image-registration.json').read_text())
 header+='REFERENCE_GUIDED='+repr(GUIDED)+'\nREFERENCE_SOURCE_TO_TARGET='+repr(registration['source_to_target'])+'\n'
 bootstrap=(ROOT/'remote-generate.py').read_text().split("    for name in ['get_cond'")[0]
 anchor="if PIPELINE_TYPE=='512':args['models']={k:v for k,v in args['models'].items() if not k.endswith('_1024')}"
 assert bootstrap.count(anchor)==1
 bootstrap=bootstrap.replace(anchor,"if PIPELINE_TYPE=='512':args['models']={k:v for k,v in args['models'].items() if not k.endswith('_1024') and not k.startswith('tex_')}")
 bootstrap=bootstrap.replace('/dragon-generation','/dragon-regional-rebuild')
 code=header+bootstrap+(ROOT/'remote-regional-rebuild.py').read_text();ast.parse(code)
 setup="from pathlib import Path\nPath('/kaggle/temp').mkdir(exist_ok=True)\nPath('/kaggle/temp/t4-adaptation.py').write_text("+repr((ROOT/'t4-adaptation.py').read_text())+")\n"
 nb=nbformat.v4.new_notebook(metadata={'kernelspec':{'display_name':'Python 3','language':'python','name':'python3'}},cells=[nbformat.v4.new_markdown_cell('# Original coin → approved drawing: masked regional reconstruction\nChanged volumes only; protected original latents held fixed. Whole drawing provides image context. No rejected generated geometry; no PBR. Candidate requires artistic review.'),nbformat.v4.new_code_cell(setup),nbformat.v4.new_code_cell(code)])
 nbformat.validate(nb);folder=WORK/'notebook';folder.mkdir(exist_ok=True);nbformat.write(nb,folder/'regional.ipynb')
 meta={'id':KERNEL,'title':('Dragon Regional Guided 20261013' if GUIDED else 'Dragon Regional Reconstruction 20261013'),'code_file':'regional.ipynb','language':'python','kernel_type':'notebook','is_private':True,'enable_gpu':True,'enable_tpu':False,'enable_internet':True,'dataset_sources':[USER+'/dragon-art-input-20261011'],'kernel_sources':[USER+'/hostile-dragon-t4-geometry-20261011',USER+'/hostile-dragon-t4-compatibility-20261011',USER+'/hostile-dragon-generation-20261011'],'competition_sources':[],'model_sources':['hark99/facebookdinov3-vitl16-pretrain-lvd1689m/transformers/default/1']}
 (folder/'kernel-metadata.json').write_text(json.dumps(meta,indent=2))
 save('build.json',{'kernel':KERNEL,'original_latent_sha256':original_sha,'notebook_sha256':hashlib.sha256((folder/'regional.ipynb').read_bytes()).hexdigest(),'edit_type':'Masked conditional resampling of redesigned regions','source':'Original model latent + approved full drawing only','maximum_runtime_seconds':7200})
 return folder
action=sys.argv[1]
if action=='build':print(json.dumps({'built':str(build())}))
elif action=='push':
 receipt=WORK/'submission.json'
 if receipt.exists():raise RuntimeError('Submission intent exists; inspect status instead of duplicating GPU work')
 quota=control.quotas(api);save('quota-before.json',quota)
 if quota['gpu']['remaining_seconds']<7200:raise RuntimeError('Insufficient verified bounded quota')
 folder=build();save('submission.json',{'stage':'submitting','kernel':KERNEL})
 response=api.kernels_push(str(folder),timeout='7200',acc='NvidiaTeslaT4')
 save('submission.json',{'stage':'submitted','kernel':KERNEL,'response':str(response)});print(control.safe(str(response)))
elif action=='status':
 r=api.kernels_status(KERNEL);save('status.json',{'kernel':KERNEL,'response':str(r)});print(control.safe(str(r)))
elif action=='fetch':
 r=api.kernels_status(KERNEL)
 if json.loads(str(r)).get('status') not in ['COMPLETE','ERROR']:raise RuntimeError('Job still running; do not download partial output')
 out=WORK/'remote';out.mkdir(exist_ok=True);api.kernels_output(KERNEL,path=str(out));save('quota-after.json',control.quotas(api))
 reports=list(out.rglob('generation.json'))
 if reports:print(control.safe(reports[0].read_text()))
 print(json.dumps({'output':str(out)}))

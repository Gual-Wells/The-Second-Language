"""One private bounded asset trial. Reuse previously verified T4 tools, never upload credentials."""
from pathlib import Path
import importlib.util,json,hashlib,datetime,sys,ast,shutil,os
ROOT=Path(__file__).resolve().parents[1]
OLD=Path('D:/CodexStorage/workspaces/hostile-dragon-coin/kaggle-test')
WORK=ROOT/'.cache/scroll-keeper-kaggle'
WORK.mkdir(exist_ok=True)
s=importlib.util.spec_from_file_location('prior_kaggle_control',OLD/'run-kaggle.py')
control=importlib.util.module_from_spec(s);s.loader.exec_module(control)
os.environ['TEMP']=os.environ['TMP']=str(WORK/'tmp');(WORK/'tmp').mkdir(exist_ok=True)
from kaggle.api.kaggle_api_extended import KaggleApi
api=KaggleApi();api.authenticate();user=api.get_config_value('username')
KERNEL=user+'/scroll-keeper-material-study-20261019'
DATASET=user+'/scroll-keeper-reference-20261019'
def save(name,data):
 (WORK/name).write_text(control.safe(json.dumps(data,ensure_ascii=False,indent=2,default=str)),encoding='utf-8')
def response(value):
 print(control.safe(value))

def kernel_state(kernel=KERNEL):
 return json.loads(str(api.kernels_status(kernel)))

def require_prior_terminal():
 state=kernel_state()
 if state.get('status') not in ['COMPLETE','ERROR','CANCELLED']:
  raise RuntimeError('Prior modeling session still active or unknown; do not start another GPU run')
 return state
action=sys.argv[1]
if action=='prepare':
 from PIL import Image
 folder=WORK/'input';folder.mkdir(exist_ok=True)
 src=ROOT/'web/labs/chapter-scroll-v4/assets/keeper.webp'
 rgba=Image.open(src).convert('RGBA');rgba.thumbnail((950,950),Image.Resampling.LANCZOS)
 image=Image.new('RGB',(1024,1024),(0,0,0));image.paste(rgba,((1024-rgba.width)//2,(1024-rgba.height)//2),rgba)
 image.save(folder/'keeper-conditioning.png')
 save('reference.json',{'source':str(src.relative_to(ROOT)),'source_sha256':hashlib.sha256(src.read_bytes()).hexdigest(),'conditioning_sha256':hashlib.sha256((folder/'keeper-conditioning.png').read_bytes()).hexdigest(),'processing':'aspect-preserving thumbnail, alpha composited onto black, square padding only','goal':'complete 3D asset candidate; old visual material reference is not an infallible mechanical drawing'})
 (folder/'dataset-metadata.json').write_text(json.dumps({'id':DATASET,'title':'Scroll keeper reference 20261019','licenses':[{'name':'other'}],'description':'Private project-owned visual reference. One image only. Not a historical artifact scan. No credentials.'},indent=2))
 response({'stage':'prepared','dataset':DATASET})
elif action=='upload':
 if (WORK/'upload.json').exists():raise RuntimeError('Upload intent exists; inspect dataset before repeating')
 save('upload.json',{'stage':'uploading','dataset':DATASET})
 r=api.dataset_create_new(str(WORK/'input'),public=False,quiet=True,convert_to_csv=False)
 save('upload.json',{'stage':'submitted','dataset':DATASET,'response':str(r)});response(r)
elif action=='build':
 import nbformat
 reference=json.loads((WORK/'reference.json').read_text(encoding='utf-8'))
 geometry=json.loads((OLD/'outputs/remote-geometry-v2/dragon-geometry/geometry.json').read_text())
 ops=json.loads((OLD/'outputs/remote-operators/dragon-compat/compatibility.json').read_text())
 expected={v['file']:v['sha256'] for v in geometry['packages'].values()};expected[ops['wheel']['file']]=ops['wheel']['sha256']
 pins=json.loads((OLD/'sources/generation-model-pins.json').read_text())
 adaptation=(OLD/'t4-adaptation.py').read_text(encoding='utf-8');ast.parse(adaptation)
 if 'class LazyModel(torch.nn.Module)' not in adaptation:raise RuntimeError('Missing known lazy-model fix')
 first="import json,datetime,signal\nfrom pathlib import Path\nprint('KEEPER_BOOT: first notebook cell entered',flush=True)\nPath('/kaggle/working/keeper-boot.json').write_text(json.dumps({'stage':'first_cell','at':datetime.datetime.now(datetime.timezone.utc).isoformat()}))\ndef keeper_timeout(signum,frame):\n raise TimeoutError('Keeper notebook execution budget reached')\nsignal.signal(signal.SIGALRM,keeper_timeout)\nsignal.alarm(1500)\nPath('/kaggle/temp').mkdir(parents=True,exist_ok=True)\nPath('/kaggle/temp/t4-adaptation.py').write_text("+repr(adaptation)+")\n"
 code=(OLD/'remote-generate.py').read_text(encoding='utf-8').replace('dragon-generation','keeper-generation').replace('hostile-dragon-source.glb','keeper-source.glb')
 anchor="image=Image.open(source/'generation-input.png').convert('RGB')"
 replacement="keeper_input=next(pathlib.Path('/kaggle/input').rglob('keeper-conditioning.png'))\n    if hashlib.sha256(keeper_input.read_bytes()).hexdigest()!=KEEPER_INPUT_SHA:raise RuntimeError('Wrong keeper reference')\n    image=Image.open(keeper_input).convert('RGB')"
 if code.count(anchor)!=1:raise RuntimeError('Input anchor changed')
 code=code.replace(anchor,replacement).replace("hashlib.sha256((source/'generation-input.png').read_bytes()).hexdigest()","hashlib.sha256(keeper_input.read_bytes()).hexdigest()")
 code="SOURCE_SHA='75fbf0183001ed9876c8dbb35de6b68552ee08bd'\nMODEL_PINS="+repr(pins)+'\nEXPECTED_WHEELS='+repr(expected)+"\nPIPELINE_TYPE='512'\nVALIDATION_ONLY=False\nUSE_CACHED_INPUT=True\nRESUME_SHAPE=False\nSHAPE_CHECKPOINT_SHA=None\nADAPTATION_FILE='/kaggle/temp/t4-adaptation.py'\nKEEPER_INPUT_SHA="+repr(reference['conditioning_sha256'])+'\n'+code
 ast.parse(code)
 folder=WORK/'notebook';folder.mkdir(exist_ok=True)
 nb=nbformat.v4.new_notebook(metadata={'kernelspec':{'display_name':'Python 3','language':'python','name':'python3'}},cells=[nbformat.v4.new_markdown_cell('# Scroll keeper: complete asset trial\nPrivate project-owned reference; established TRELLIS.2 T4 runtime. No new purchase. Mesh, PBR volume and checkpoints saved before export. This is a candidate, not artistic acceptance.'),nbformat.v4.new_code_cell(first),nbformat.v4.new_code_cell(code)])
 nbformat.validate(nb);nbformat.write(nb,folder/'keeper.ipynb')
 meta={'id':KERNEL,'title':'Scroll Keeper Material Study 20261019','code_file':'keeper.ipynb','language':'python','kernel_type':'notebook','is_private':True,'enable_gpu':True,'enable_tpu':False,'enable_internet':True,'dataset_sources':[user+'/dragon-art-input-20261011',DATASET],'kernel_sources':[user+'/hostile-dragon-t4-geometry-20261011',user+'/hostile-dragon-t4-compatibility-20261011'],'model_sources':['hark99/facebookdinov3-vitl16-pretrain-lvd1689m/transformers/default/1'],'competition_sources':[]}
 (folder/'kernel-metadata.json').write_text(json.dumps(meta,indent=2))
 save('build.json',{'kernel':KERNEL,'input_sha256':reference['conditioning_sha256'],'notebook_sha256':hashlib.sha256((folder/'keeper.ipynb').read_bytes()).hexdigest(),'requested_session_timeout_seconds':1800,'notebook_alarm_seconds':1500,'platform_startup_wall_clock_bounded':False,'source_sha':'75fbf0183001ed9876c8dbb35de6b68552ee08bd','art_accepted':False})
 response({'stage':'built','kernel':KERNEL})
elif action=='push':
 if (WORK/'submission.json').exists():
  previous=json.loads((WORK/'submission.json').read_text())
  status=json.loads(str(api.kernels_status(KERNEL)))
  log=next((WORK/'output').glob('*.log')).read_text()
  if '--repair-kernelspec' not in sys.argv or status.get('status')!='ERROR' or 'No kernel name found in notebook' not in log or json.loads(previous['response']).get('versionNumber')!=1:raise RuntimeError('Submission exists; no verified bounded repair applies')
  shutil.copy2(WORK/'submission.json',WORK/'submission-v1-kernelspec-error.json')
 if str(api.dataset_status(DATASET)).lower()!='ready':raise RuntimeError('Input not ready')
 quota=control.quotas(api);save('quota-before.json',quota)
 if quota.get('gpu',{}).get('remaining_seconds',0)<2100:raise RuntimeError('Insufficient quota for bounded test')
 save('submission.json',{'stage':'submitting','kernel':KERNEL})
 r=api.kernels_push(str(WORK/'notebook'),timeout='1800',acc='NvidiaTeslaT4')
 save('submission.json',{'stage':'submitted','kernel':KERNEL,'response':str(r)});response(r)
elif action=='status':
 state={'queried_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'dataset':str(api.dataset_status(DATASET)),'kernel':str(api.kernels_status(KERNEL))}
 save('status-latest.json',state);response(state)
elif action=='diagnose':
 from kagglesdk.kernels.types.kernels_api_service import ApiGetKernelRequest,ApiListKernelSessionOutputRequest
 report={'queried_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'kernel':KERNEL,'status':kernel_state(),'quota':control.quotas(api)}
 with api.build_kaggle_client() as kaggle:
  request=ApiListKernelSessionOutputRequest();request.user_name=user;request.kernel_slug=KERNEL.split('/')[1]
  files=kaggle.kernels.kernels_api_client.list_kernel_session_output(request)
  report['files']=[{'name':f.file_name} for f in files.files or []]
  report['log_characters']=len(files.log)
  if files.log:save('diagnostic-log.json',{'log':files.log})
  request=ApiGetKernelRequest();request.user_name=user;request.kernel_slug=KERNEL.split('/')[1]
  detail=kaggle.kernels.kernels_api_client.get_kernel(request)
  report['server_metadata']=json.loads(str(detail.metadata))
 save('diagnostic-latest.json',report);response(report)
elif action=='build-probe':
 folder=WORK/'startup-probe';folder.mkdir(exist_ok=True)
 probe=(ROOT/'scripts/keeper-startup-probe.py').read_text(encoding='utf-8');ast.parse(probe)
 (folder/'startup-probe.py').write_text(probe,encoding='utf-8')
 metadata={'id':user+'/scroll-keeper-startup-probe-20261019','title':'Scroll Keeper Startup Probe 20261019','code_file':'startup-probe.py','language':'python','kernel_type':'script','is_private':True,'enable_gpu':True,'enable_internet':False,'dataset_sources':[],'kernel_sources':[],'model_sources':[],'competition_sources':[]}
 (folder/'kernel-metadata.json').write_text(json.dumps(metadata,indent=2),encoding='utf-8')
 response({'stage':'prepared_not_submitted','kernel':metadata['id'],'requested_session_timeout_seconds':120,'execution_alarm_seconds':90,'heavy_inputs':False})
elif action=='resolve-session':
 from kagglesdk.kernels.types.kernels_api_service import ApiDownloadKernelOutputRequest
 from urllib.parse import urlparse
 import re
 submission=json.loads(json.loads((WORK/'submission.json').read_text())['response'])
 version=submission['versionNumber']
 with api.build_kaggle_client() as kaggle:
  http=kaggle._http_client;http._init_session();send=http._session.send
  def no_redirect(*args,**kwargs):
   kwargs.update(allow_redirects=False,timeout=20)
   received=send(*args,**kwargs)
   # Kaggle sometimes labels an empty redirect body application/json. Preserve the
   # ordinary redirect before the generated SDK attempts to JSON-decode that body.
   if 300<=received.status_code<400 and not received.content:
    received.headers['Content-Type']='text/plain'
   return received
  http._session.send=no_redirect
  request=ApiDownloadKernelOutputRequest();request.owner_slug=user;request.kernel_slug=KERNEL.split('/')[1];request.version_number=version
  result=kaggle.kernels.kernels_api_client.download_kernel_output(request)
  path=urlparse(result.headers.get('Location','')).path
  match=re.fullmatch(r'/(?:api/)?v1/kernels/output/download_zip/(\d+)',path)
  record={'kernel':KERNEL,'version':version,'http_status':result.status_code,'redirect_path':path,'session_id':int(match[1]) if match else None,'source':'official version-specific DownloadKernelOutput redirect'}
  if result.headers.get('Content-Type','').startswith('application/json'):record['response']=result.json()
  result.close();save('resolved-session.json',record);response(record)
elif action=='cancel-resolved':
 from kagglesdk.kernels.types.kernels_api_service import ApiCancelKernelSessionRequest
 record=json.loads((WORK/'resolved-session.json').read_text())
 submitted=json.loads(json.loads((WORK/'submission.json').read_text())['response'])
 if record['kernel']!=KERNEL or record['version']!=submitted['versionNumber'] or not record['session_id']:raise RuntimeError('No verified exact session')
 before=kernel_state()
 if before.get('status') not in ['RUNNING','QUEUED']:raise RuntimeError('Session no longer active')
 save('cancel-intent.json',{'session':record,'status':before,'at':datetime.datetime.now(datetime.timezone.utc).isoformat()})
 with api.build_kaggle_client() as kaggle:
  request=ApiCancelKernelSessionRequest();request.kernel_session_id=record['session_id']
  result=kaggle.kernels.kernels_api_client.cancel_kernel_session(request)
  save('cancel-result.json',{'response':str(result)});response(result)
elif action=='push-probe':
 require_prior_terminal()
 folder=WORK/'startup-probe'
 if (WORK/'probe-submission.json').exists():raise RuntimeError('Probe intent exists; inspect before repeating')
 save('probe-submission.json',{'stage':'submitting','at':datetime.datetime.now(datetime.timezone.utc).isoformat()})
 r=api.kernels_push(str(folder),timeout='120',acc='NvidiaTeslaT4')
 save('probe-submission.json',{'stage':'submitted','response':str(r)});response(r)
elif action=='fetch':
 status=json.loads(str(api.kernels_status(KERNEL)))
 if status.get('status') not in ['COMPLETE','ERROR','CANCELLED']:raise RuntimeError('Still active; retain the original run')
 version=json.loads(json.loads((WORK/'submission.json').read_text())['response']).get('versionNumber',1)
 out=WORK/f'output-v{version}';out.mkdir(exist_ok=True);api.kernels_output(KERNEL,path=str(out))
 save('quota-after.json',control.quotas(api))
 report=out/'keeper-generation/generation.json';response(report.read_text() if report.exists() else status)
else:raise RuntimeError('Unknown action')

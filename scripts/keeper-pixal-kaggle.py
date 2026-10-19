"""Submit/fetch the new-reference Pixal trial without touching the old study."""
from pathlib import Path
import importlib.util,json,hashlib,datetime,sys,shutil,os,ast
ROOT=Path(__file__).resolve().parents[1]
OLD=Path('D:/CodexStorage/workspaces/hostile-dragon-coin/kaggle-test')
WORK=ROOT/'.cache/keeper-pixal-kaggle';WORK.mkdir(exist_ok=True)
s=importlib.util.spec_from_file_location('prior_kaggle_control',OLD/'run-kaggle.py')
control=importlib.util.module_from_spec(s);s.loader.exec_module(control)
os.environ['TEMP']=os.environ['TMP']=str(WORK/'tmp');(WORK/'tmp').mkdir(exist_ok=True)
from kaggle.api.kaggle_api_extended import KaggleApi
api=KaggleApi();api.authenticate();user=api.get_config_value('username')
KERNEL=user+'/scroll-keeper-pixal-rig-20261019'
DATASET=user+'/scroll-keeper-belt-reference-20261019'
def save(name,data):(WORK/name).write_text(control.safe(json.dumps(data,ensure_ascii=False,indent=2,default=str)),encoding='utf-8')
def show(x):print(control.safe(str(x)))
action=sys.argv[1]
if action=='prepare':
 folder=WORK/'input';folder.mkdir(exist_ok=True)
 ref=ROOT/'research/scroll-keeper-reference-2026-10-19'
 for name in ['closed-standard-belt-v1.png','comfy-weight-pins.json']:shutil.copy2(ref/name,folder/name)
 shutil.copy2(ROOT/'.cache/keeper-model-research/pixal3d-official-workflow.json',folder/'pixal3d-official-workflow.json')
 (folder/'dataset-metadata.json').write_text(json.dumps({'id':DATASET,'title':'Scroll keeper corrected belt reference 20261019','licenses':[{'name':'other'}],'description':'Private project reference and immutable public model pins. No credentials.'},indent=2))
 code=(ROOT/'scripts/keeper-pixal-remote.py').read_text(encoding='utf-8');ast.parse(code)
 folder=WORK/'notebook';folder.mkdir(exist_ok=True)
 (folder/'keeper-pixal.py').write_text(code,encoding='utf-8')
 meta={'id':KERNEL,'title':'Scroll Keeper Pixal Rig 20261019','code_file':'keeper-pixal.py','language':'python','kernel_type':'script','is_private':True,'enable_gpu':True,'enable_tpu':False,'enable_internet':True,'dataset_sources':[DATASET],'kernel_sources':[],'model_sources':[],'competition_sources':[]}
 (folder/'kernel-metadata.json').write_text(json.dumps(meta,indent=2))
 show({'prepared':KERNEL,'script_sha256':hashlib.sha256(code.encode()).hexdigest()})
elif action=='upload':
 if (WORK/'upload.json').exists():raise RuntimeError('Upload already attempted; inspect before retry')
 save('upload.json',{'stage':'submitting','dataset':DATASET})
 r=api.dataset_create_new(str(WORK/'input'),public=False,quiet=True,convert_to_csv=False);save('upload.json',{'response':str(r)});show(r)
elif action=='push':
 if (WORK/'submission.json').exists():
  state=json.loads(str(api.kernels_status(KERNEL)))
  prior=json.loads((WORK/'submission.json').read_text())
  if '--repair' not in sys.argv or state.get('status')!='ERROR':raise RuntimeError('Submission exists; inspect before retry')
  version=json.loads(prior['response'])['versionNumber']
  shutil.copy2(WORK/'submission.json',WORK/f'submission-v{version}.json')
 if str(api.dataset_status(DATASET)).lower()!='ready':raise RuntimeError('Reference dataset not ready')
 prior=json.loads(str(api.kernels_status(user+'/scroll-keeper-material-study-20261019')))
 if prior.get('status') not in ['COMPLETE','ERROR','CANCELLED']:raise RuntimeError('Old study not terminal')
 quota=control.quotas(api);save('quota-before.json',quota)
 if quota.get('gpu',{}).get('remaining_seconds',0)<3300:raise RuntimeError('Insufficient free GPU budget')
 save('submission.json',{'stage':'submitting','kernel':KERNEL})
 r=api.kernels_push(str(WORK/'notebook'),timeout='3300',acc='NvidiaTeslaT4')
 save('submission.json',{'stage':'submitted','response':str(r)});show(r)
elif action=='status':
 state={'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'kernel':str(api.kernels_status(KERNEL)),'quota':control.quotas(api)}
 save('status.json',state);show(state)
elif action=='fetch':
 state=json.loads(str(api.kernels_status(KERNEL)))
 if state.get('status') not in ['COMPLETE','ERROR','CANCELLED']:raise RuntimeError('Still running')
 version=json.loads(json.loads((WORK/'submission.json').read_text())['response'])['versionNumber']
 out=WORK/f'output-v{version}';out.mkdir(exist_ok=True);api.kernels_output(KERNEL,path=str(out))
 save('quota-after.json',control.quotas(api));show(state)
else:raise RuntimeError('Unknown action')

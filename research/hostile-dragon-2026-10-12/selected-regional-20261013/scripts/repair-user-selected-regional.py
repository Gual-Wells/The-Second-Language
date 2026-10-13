"""Repair the exact user-selected regional candidate, without any AI resampling."""
from pathlib import Path
import ast,json,hashlib,importlib.util,requests,sys
ROOT=Path(__file__).resolve().parent
WORK=ROOT/'regional-selected-repair-20261013';WORK.mkdir(exist_ok=True)
init=requests.Session.__init__;request=requests.Session.request
def direct(self,*a,**k):init(self,*a,**k);self.trust_env=False
def bounded(self,*a,**k):k.setdefault('timeout',(15,55));return request(self,*a,**k)
requests.Session.__init__=direct;requests.Session.request=bounded
spec=importlib.util.spec_from_file_location('control',ROOT/'run-kaggle.py');control=importlib.util.module_from_spec(spec);spec.loader.exec_module(control)
from kaggle.api.kaggle_api_extended import KaggleApi
api=KaggleApi();api.authenticate();USER=api.get_config_value('username')
KERNEL=USER+'/dragon-selected-regional-repair-20261013'
def save(name,data):(WORK/name).write_text(control.safe(json.dumps(data,indent=2,default=str)),encoding='utf-8')
action=sys.argv[1]
if action=='status':
 r=api.kernels_status(KERNEL);save('status.json',{'response':str(r)});print(control.safe(str(r)))
elif action=='fetch':
 r=api.kernels_status(KERNEL)
 if json.loads(str(r)).get('status') not in ['COMPLETE','ERROR']:raise RuntimeError('Repair running')
 out=WORK/'remote';out.mkdir(exist_ok=True);api.kernels_output(KERNEL,path=str(out));save('quota-after.json',control.quotas(api))
 for p in out.rglob('repair.json'):print(control.safe(p.read_text()))
elif action in ['build','push']:
 if action=='push' and (WORK/'submission.json').exists():raise RuntimeError('Existing intent: inspect status, never duplicate')
 source=ROOT/'regional-rebuild-20261013/remote/dragon-regional-rebuild/regional-candidate.npz'
 source_sha=hashlib.sha256(source.read_bytes()).hexdigest()
 packages=json.loads((ROOT/'outputs/remote-geometry-v2/dragon-geometry/geometry.json').read_text())['packages']
 expected={v['file']:v['sha256'] for k,v in packages.items() if 'cumesh' in k.lower() or 'cumesh' in v['file'].lower()}
 if len(expected)!=1:raise RuntimeError('Expected one pinned CuMesh wheel')
 remote='''
import os,pathlib,time,json,traceback,hashlib,subprocess,sys,signal
OUT=pathlib.Path('/kaggle/working/selected-regional-repair');OUT.mkdir(exist_ok=True)
TMP=pathlib.Path('/kaggle/temp/selected-regional-repair');TMP.mkdir(parents=True,exist_ok=True)
os.environ.update(TMPDIR=str(TMP),PIP_CACHE_DIR=str(TMP/'pip'))
start=time.monotonic();report={'stage':'setup','source_sha256':SOURCE_SHA,'geometry_resampled':False,'user_selected_candidate':'regional-rebuild-v1','art_accepted':False}
def save():
 report['elapsed_seconds']=round(time.monotonic()-start,2)
 (OUT/'repair.json').write_text(json.dumps(report,indent=2));print(json.dumps(report),flush=True)
def timeout(*a):raise TimeoutError('Bounded repair deadline')
signal.signal(signal.SIGALRM,timeout);signal.alarm(1700)
try:
 save()
 for name,sha in EXPECTED.items():
  p=next(pathlib.Path('/kaggle/input').rglob(name))
  if hashlib.sha256(p.read_bytes()).hexdigest()!=sha:raise RuntimeError('Wheel changed')
  subprocess.run([sys.executable,'-m','pip','install','--no-deps',str(p)],check=True,timeout=120)
 import torch,numpy as np,cumesh
 source=next(p for p in pathlib.Path('/kaggle/input').rglob('regional-candidate.npz') if hashlib.sha256(p.read_bytes()).hexdigest()==SOURCE_SHA)
 data=np.load(source,allow_pickle=False)
 verts=torch.from_numpy(data['vertices']).cuda();faces=torch.from_numpy(data['faces']).cuda()
 report.update(stage='repairing',source_vertices=len(verts),source_faces=len(faces));save()
 handler=cumesh.CuMesh();handler.init(verts,faces)
 handler.fill_holes(max_hole_perimeter=3e-2)
 verts,faces=handler.read();bvh=cumesh.cuBVH(verts,faces)
 verts,faces=cumesh.remeshing.remesh_narrow_band_dc(verts,faces,center=torch.zeros(3,device='cuda'),scale=515/512,resolution=512,band=1,project_back=0,verbose=True,bvh=bvh)
 handler.init(verts,faces);handler.simplify(1000000,verbose=True);verts,faces=handler.read()
 v=verts.cpu().numpy();f=faces.cpu().numpy()
 out=OUT/'repaired-candidate.npz';np.savez_compressed(out,vertices=v,faces=f)
 report.update(stage='repaired_candidate_saved',vertices=len(v),faces=len(f),output_sha256=hashlib.sha256(out.read_bytes()).hexdigest(),method='Official CuMesh narrow-band dual contouring, 512, band=1, project_back=0')
except Exception:report.update(stage='repair_failed',error=traceback.format_exc()[-6000:])
finally:save()
'''
 code='SOURCE_SHA='+repr(source_sha)+'\nEXPECTED='+repr(expected)+'\n'+remote;ast.parse(code)
 import nbformat
 folder=WORK/'notebook';folder.mkdir(exist_ok=True)
 nb=nbformat.v4.new_notebook(metadata={'kernelspec':{'display_name':'Python 3','language':'python','name':'python3'}},cells=[nbformat.v4.new_markdown_cell('# Repair user-selected geometry\nNo AI generation, no new design ancestor. Exact input and wheel verified.'),nbformat.v4.new_code_cell(code)])
 nbformat.validate(nb);nbformat.write(nb,folder/'repair.ipynb')
 meta={'id':KERNEL,'title':'Dragon Selected Regional Repair 20261013','code_file':'repair.ipynb','language':'python','kernel_type':'notebook','is_private':True,'enable_gpu':True,'enable_internet':True,'dataset_sources':[],'kernel_sources':[USER+'/hostile-dragon-t4-geometry-20261011',USER+'/dragon-regional-reconstruction-20261013/1'],'model_sources':[],'competition_sources':[]}
 (folder/'kernel-metadata.json').write_text(json.dumps(meta,indent=2))
 save('build.json',{'kernel':KERNEL,'source_sha256':source_sha,'geometry_resampled':False})
 if action=='push':
  quota=control.quotas(api);save('quota-before.json',quota)
  if quota['gpu']['remaining_seconds']<1800:raise RuntimeError('Insufficient verified quota')
  save('submission.json',{'stage':'submitting','kernel':KERNEL})
  r=api.kernels_push(str(folder),timeout='1800',acc='NvidiaTeslaT4')
  save('submission.json',{'stage':'submitted','kernel':KERNEL,'response':str(r)});print(control.safe(str(r)))
 else:print(str(folder))

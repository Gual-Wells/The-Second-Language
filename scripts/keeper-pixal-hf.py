"""Use the author's free Space as a bounded parallel asset trial.

Never buy credits or retry quota failures. Keep only this session's returned files.
"""
from pathlib import Path
import os,json,hashlib,time,re,uuid,traceback,sys,shutil
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'.cache/keeper-pixal-hf'
OUT.mkdir(exist_ok=True)
os.environ.update(HF_HOME=str(OUT/'hf'),GRADIO_TEMP_DIR=str(OUT/'tmp'),
                  HTTP_PROXY='http://127.0.0.1:6987',HTTPS_PROXY='http://127.0.0.1:6987')
from gradio_client import Client,handle_file
import requests
token=Path('D:/CodexStorage/workspaces/hostile-dragon-coin/hf-token.txt').read_text().strip()
def safe(value):return re.sub(r'hf_[A-Za-z0-9]+','[redacted]',str(value)).replace(token,'[redacted]')
def save(name,data):(OUT/name).write_text(safe(json.dumps(data,indent=2,default=str)),encoding='utf-8')
def stage(name,**kwargs):
 data={'stage':name,'at':time.time(),**kwargs};save('progress.json',data);print(safe(data),flush=True)
recover='--recover-download' in sys.argv
if (OUT/'generation-intent.json').exists():
 if not recover or (OUT/'generation-result.json').exists():raise RuntimeError('Free Space trial already attempted; inspect result before retry')
 failure=json.loads((OUT/'failure.json').read_text())
 if '403 Forbidden' not in failure['error'] or 'render_normal_0_' not in failure['error']:raise RuntimeError('No verified completed-generation download failure')
 shutil.copy2(OUT/'generation-intent.json',OUT/'generation-intent-v1.json')
 shutil.copy2(OUT/'failure.json',OUT/'failure-v1.json')
try:
 client=Client('TencentARC/Pixal3D',token=token,download_files=False,verbose=False,
               httpx_kwargs={'proxy':'http://127.0.0.1:6987','timeout':120},analytics_enabled=False)
 ref=ROOT/'research/scroll-keeper-reference-2026-10-19/closed-standard-belt-v1.png'
 if recover:
  image=handle_file(json.loads((OUT/'preprocessed.json').read_text())['result'])
 else:
  stage('preprocessing')
  image=client.predict(image=handle_file(str(ref)),api_name='/preprocess')
  save('preprocessed.json',{'result':image})
 session='keeper-'+uuid.uuid4().hex
 save('generation-intent.json',{'session':session,'seed':42,'resolution':1024,'input_sha256':hashlib.sha256(ref.read_bytes()).hexdigest(),'space_revision':json.loads((OUT/'space.json').read_text())['sha']})
 stage('generating')
 result=client.predict(image=image,seed=42,resolution=1024,session_id=session,api_name='/generate_3d')
 save('generation-result.json',result);stage('generation_returned',keys=list(result))
 for mode,files in result.get('render_paths',{}).items():
  for i,item in enumerate(files):
   url='https://tencentarc-pixal3d.hf.space/tmp/'+Path(item['path']).name
   r=requests.get(url,proxies={'https':'http://127.0.0.1:6987'},timeout=60);r.raise_for_status()
   (OUT/f'{mode}-{i:02}.jpg').write_bytes(r.content)
 # The author explicitly mounts TMP_DIR at /tmp for direct asset access.
 state_path=result.get('state_path')
 if state_path:
  url='https://tencentarc-pixal3d.hf.space/tmp/'+Path(state_path).name
  with requests.get(url,headers={'Authorization':'Bearer '+token},stream=True,timeout=120) as r:
   r.raise_for_status()
   with (OUT/Path(state_path).name).open('wb') as f:
    for block in r.iter_content(1024*1024):f.write(block)
  stage('latent_preserved',filename=Path(state_path).name)
 stage('requesting_export')
 asset=client.predict(state_path=state_path,decimation_target=400000,texture_size=2048,session_id=session,api_name='/extract_glb_api')
 save('export-returned.json',asset)
 path=asset['path'] if isinstance(asset,dict) else asset
 r=requests.get('https://tencentarc-pixal3d.hf.space/tmp/'+Path(path).name,proxies={'https':'http://127.0.0.1:6987'},timeout=120);r.raise_for_status()
 final=OUT/'keeper-author-source.glb';final.write_bytes(r.content)
 save('export-result.json',{'file':str(final),'bytes':final.stat().st_size,'sha256':hashlib.sha256(final.read_bytes()).hexdigest()})
 stage('complete',asset=str(final))
except BaseException as e:
 save('failure.json',{'error':safe(repr(e)),'traceback':safe(traceback.format_exc())})
 stage('failed',error=safe(repr(e)))
 raise SystemExit(1)

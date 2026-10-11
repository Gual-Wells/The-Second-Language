"""Download licensed DINO weights to D; prepare a private Kaggle input without credentials."""
import datetime,hashlib,json,pathlib,requests,shutil,time
ROOT=pathlib.Path(__file__).resolve().parent
TARGET=ROOT/'inputs'/'dragon-authorized-20261011'
TARGET.mkdir(parents=True,exist_ok=True)
token=(ROOT.parent/'hf-token.txt').read_text(encoding='utf-8-sig').strip()
headers={'Authorization':'Bearer '+token}
model='facebook/dinov3-vitl16-pretrain-lvd1689m'
r=requests.get('https://huggingface.co/api/models/'+model,headers=headers,params={'blobs':'true'},timeout=30)
r.raise_for_status();info=r.json();revision=info['sha']
files={v['rfilename']:v for v in info['siblings']}
selected=[f for f in ['config.json','model.safetensors','LICENSE.md','LICENSE','README.md'] if f in files]
if 'model.safetensors' not in selected:raise RuntimeError('Expected single model.safetensors not found')
need=sum(files[f].get('size',0) for f in selected)
if shutil.disk_usage(ROOT).free<need+3*2**30:raise RuntimeError('Insufficient D disk headroom')
out={'created_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'model':model,'revision':revision,'files':{}}
folder=TARGET/'dino';folder.mkdir(exist_ok=True)
for name in selected:
    target=folder/name;expected=files[name].get('lfs',{}).get('sha256')
    if target.exists() and expected and hashlib.sha256(target.read_bytes()).hexdigest()==expected:
        print('Reuse verified '+name,flush=True)
    else:
        partial=target.with_suffix(target.suffix+'.partial')
        start=partial.stat().st_size if partial.exists() else 0
        request_headers=dict(headers)
        if start:request_headers['Range']='bytes='+str(start)+'-'
        response=requests.get('https://huggingface.co/'+model+'/resolve/'+revision+'/'+name,headers=request_headers,stream=True,timeout=(30,90))
        response.raise_for_status()
        append=start>0 and response.status_code==206
        total=start if append else 0;last=0
        with partial.open('ab' if append else 'wb') as output:
            for chunk in response.iter_content(4*1024*1024):
                if not chunk:continue
                output.write(chunk);total+=len(chunk)
                if time.monotonic()-last>25:
                    print(name+': '+str(round(total/2**20,1))+' MiB',flush=True);last=time.monotonic()
        actual=hashlib.sha256(partial.read_bytes()).hexdigest()
        if expected and actual!=expected:raise RuntimeError('Hash mismatch: '+name)
        partial.replace(target)
    out['files'][name]={'bytes':target.stat().st_size,'sha256':hashlib.sha256(target.read_bytes()).hexdigest()}
for name in ['concept-v1.png','concept-back-v1.png']:
    shutil.copy2(ROOT.parent/name,TARGET/name)
    out['files'][name]={'bytes':(TARGET/name).stat().st_size,'sha256':hashlib.sha256((TARGET/name).read_bytes()).hexdigest()}
processed=ROOT.parent/'working'/'trellis2'/'994f98db7bdf194fa4dabfbe6a3b1b1ae2e958ae31d7eb771473bd8e32d7d606'/'image.png'
shutil.copy2(processed,TARGET/'generation-input.png')
out['files']['generation-input.png']={'bytes':processed.stat().st_size,'sha256':hashlib.sha256(processed.read_bytes()).hexdigest(),'role':'prior server background-removed input; run with preprocess_image=False'}
(TARGET/'input-manifest.json').write_text(json.dumps(out,indent=2),encoding='utf-8')
(TARGET/'README.md').write_text('Private input for the account owner only. DINOv3 weights retain Meta DINOv3 license; see dino/LICENSE files and original model card. Artwork is an unapproved production reference, not an accepted finished coin. No credentials included.\n',encoding='utf-8')
print(json.dumps({'stage':'input_prepared','revision':revision,'bytes':sum(v['bytes'] for v in out['files'].values())}),flush=True)

"""Read pinned upstream implementations before selecting unfamiliar production steps."""
import requests,pathlib,json,hashlib,datetime
ROOT=pathlib.Path(__file__).resolve().parent;out=ROOT/'sources'/'industry-workflows';out.mkdir(parents=True,exist_ok=True)
s=requests.Session();s.trust_env=False;s.headers['User-Agent']='DragonCoin-ResourceReview/1.0'
records=[]
for repo,paths in [('visualbruno/ComfyUI-Trellis2',['README.md','LICENSE','nodes.py','trellis2/pipelines/trellis2_image_to_3d.py','example_workflows/MeshWithTexturing_MultiView.json']),('between2058/trellis2',['README.md','LICENSE','trellis2/pipelines/trellis2_image_to_3d.py'])]:
    response=s.get('https://api.github.com/repos/'+repo+'/commits/main',timeout=25);response.raise_for_status();sha=response.json()['sha']
    folder=out/repo.replace('/','--');folder.mkdir(exist_ok=True)
    record={'repo':repo,'sha':sha,'read_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'files':{}}
    for path in paths:
        r=s.get('https://raw.githubusercontent.com/'+repo+'/'+sha+'/'+path,timeout=25)
        record['files'][path]={'http_status':r.status_code}
        if r.status_code==200:
            target=folder/path;target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(r.content)
            record['files'][path]['sha256']=hashlib.sha256(r.content).hexdigest()
    records.append(record)
(out/'manifest.json').write_text(json.dumps(records,indent=2));print(json.dumps(records))

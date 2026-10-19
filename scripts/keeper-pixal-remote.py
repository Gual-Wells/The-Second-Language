"""Private Kaggle trial of the pinned, native ComfyUI Pixal3D workflow.

The server binds loopback only. No tunnels, credentials, paid APIs, or service accounts.
Preserve the raw shape before surface processing. A generated asset is not a rig.
"""
from pathlib import Path
import os, sys, json, time, hashlib, subprocess, signal, traceback, shutil, tarfile
from concurrent.futures import ThreadPoolExecutor
import requests

OUT = Path('/kaggle/working/keeper-pixal'); OUT.mkdir(exist_ok=True)
TMP = Path('/kaggle/temp/keeper-pixal'); TMP.mkdir(parents=True, exist_ok=True)
os.environ.update(TMPDIR=str(TMP), HF_HOME=str(TMP/'hf'), PIP_CACHE_DIR=str(TMP/'pip'),
                  TORCH_HOME=str(TMP/'torch'), XDG_CACHE_HOME=str(TMP/'cache'))
COMFY_SHA = '8f04fd6ecf4a548937971e840af2a985529fab76'
INPUT_SHA = '63343355742f1e7c112547cef9fc329e30a0921a4494dc08c8183450a569ba37'
START = time.time(); server = None

def record(stage, **data):
    result = {'stage': stage, 'elapsed_seconds': round(time.time()-START, 2), **data}
    print(json.dumps(result), flush=True)
    (OUT/'progress.json').write_text(json.dumps(result, indent=2))

def budget(*args): raise TimeoutError('Private trial execution budget reached (3000 seconds)')
signal.signal(signal.SIGALRM, budget); signal.alarm(3000)

def command(args, **kw):
    print('RUN', args, flush=True)
    subprocess.run(args, check=True, timeout=kw.pop('timeout', 600), **kw)

def download(url, target, sha=None):
    target = Path(target); target.parent.mkdir(parents=True, exist_ok=True)
    h = hashlib.sha256()
    with requests.get(url, stream=True, timeout=(30, 180)) as r:
        r.raise_for_status()
        with target.open('wb') as f:
            for block in r.iter_content(4*1024*1024):
                f.write(block); h.update(block)
    if sha and h.hexdigest() != sha: raise RuntimeError('Downloaded hash mismatch: '+target.name)
    return {'file': str(target), 'bytes': target.stat().st_size, 'sha256': h.hexdigest()}

try:
    record('boot')
    input_file = next(Path('/kaggle/input').rglob('closed-standard-belt-v1.png'))
    if hashlib.sha256(input_file.read_bytes()).hexdigest() != INPUT_SHA: raise RuntimeError('Reference changed')
    input_root = input_file.parent
    pins = json.loads((input_root/'comfy-weight-pins.json').read_text())
    workflow = json.loads((input_root/'pixal3d-official-workflow.json').read_text())
    command(['nvidia-smi'])
    archive = TMP/'comfy.tar.gz'
    download(f'https://api.github.com/repos/comfyanonymous/ComfyUI/tarball/{COMFY_SHA}', archive)
    with tarfile.open(archive) as tar:
        archive_root = Path(tar.getmembers()[0].name).parts[0]
        tar.extractall(TMP, filter='data')
    comfy = TMP/archive_root
    if not (comfy/'main.py').is_file(): raise RuntimeError('Pinned archive has no ComfyUI entrypoint')
    record('installing_native_runtime', source_sha=COMFY_SHA)
    command([sys.executable, '-m', 'pip', 'install', '-q', '-r', str(comfy/'requirements.txt')], timeout=720)
    selected = [p for p in pins if p['repo'] != 'Comfy-Org/TRELLIS.2']
    def get_weight(item):
        pin, f = item
        result = download(f"https://huggingface.co/{pin['repo']}/resolve/{pin['sha']}/{f['path']}",
                          comfy/'models'/f['path'], f['lfs']['sha256'])
        record('weight_ready', **result)
        return result
    record('downloading_pinned_weights', expected_bytes=sum(f['bytes'] for p in selected for f in p['files']))
    with ThreadPoolExecutor(max_workers=3) as pool:
        weights = list(pool.map(get_weight, [(p, f) for p in selected for f in p['files']]))
    (OUT/'weight-verification.json').write_text(json.dumps(weights, indent=2))
    (comfy/'input').mkdir(exist_ok=True); shutil.copy2(input_file, comfy/'input/keeper.png')
    log = (OUT/'comfy.log').open('w')
    server = subprocess.Popen([sys.executable, str(comfy/'main.py'), '--listen', '127.0.0.1', '--port', '8188',
                               '--lowvram', '--force-fp16', '--disable-auto-launch',
                               '--output-directory', str(OUT/'models')], cwd=comfy, stdout=log, stderr=subprocess.STDOUT)
    url = 'http://127.0.0.1:8188'
    info = None
    for _ in range(150):
        if server.poll() is not None: raise RuntimeError('Native ComfyUI startup failed; inspect comfy.log')
        try:
            r=requests.get(url+'/object_info', timeout=5)
            if r.ok: info=r.json(); break
        except requests.RequestException: pass
        time.sleep(2)
    if info is None: raise TimeoutError('Native ComfyUI startup exceeded five minutes')
    (OUT/'object-info.json').write_text(json.dumps(info))
    # Follow the official node chain; omit UI previews, bypassed AO/normal nodes,
    # and the destructive UDF remesh. Resolve names against THIS server schema.
    keep = {15,40,117,118,55,193,122,192,305,56,242,298,87,199,125,108,3,119,91,279,126,18,94,23,92,98,12,93,186,238,196,147,210,260,272}
    nodes = {n['id']:n for n in workflow['nodes']}
    links = {l[0]:l for l in workflow['links']}
    overrides = {40:['pixal3d_int8_convrot.safetensors','default'],55:['moge_2_vitl_normal_fp16.safetensors'],
                 122:['keeper.png'],94:[1024],186:[400000,'midpoint'],
                 196:['pec',1,0.0002],272:['keeper-textured']}
    def endpoint(node_id, slot):
        if node_id in [96,307,249]:
            link=links[nodes[node_id]['inputs'][0]['link']]; return endpoint(link[1],link[2])
        if node_id==302:return ['305',0]
        if node_id==248:return ['192',0]
        if node_id==288:return 2048
        if node_id==241:return ['92',0]
        if node_id in [284,285]:return ['260',0]
        if node_id not in keep: raise RuntimeError(f'Unexpected upstream node {node_id}')
        return [str(node_id),slot]
    graph={}
    for i in sorted(keep):
        node=nodes[i]; cls=node['type']
        if cls not in info: raise RuntimeError('Required native node unavailable: '+cls)
        schema=info[cls]['input']; required=schema.get('required',{}); optional=schema.get('optional',{})
        inputs={}
        for inp in node.get('inputs',[]):
            if inp.get('link') is None:continue
            if i==210 and inp['name'] in ['occlusion','normal_map']:continue
            l=links[inp['link']]
            name=inp['name']
            if cls=='ImageCropToMask':name={'image':'images','mask':'masks'}.get(name,name)
            inputs[name]=endpoint(l[1],l[2])
        vals=list(overrides.get(i,node.get('widgets_values',[])))
        if cls=='KSampler': vals.pop(1) # frontend-only control_after_generate
        widget_names=[name for name,spec in {**required,**optional}.items()
                      if name not in inputs and (isinstance(spec[0],list) or spec[0] in ['INT','FLOAT','STRING','BOOLEAN','COMBO','COLOR','COMFY_DYNAMICCOMBO_V3'])]
        # An input that is connected in the UI has no widget in widgets_values.
        for name,value in zip(widget_names,vals):inputs[name]=value
        for name,spec in required.items():
            if name not in inputs:
                cfg=spec[1] if len(spec)>1 else {}
                if 'default' in cfg:inputs[name]=cfg['default']
                elif isinstance(spec[0],list):inputs[name]=spec[0][0]
                elif spec[0]=='COMBO':inputs[name]=cfg['options'][0]
                else:raise RuntimeError(f'Missing required input {cls}.{name}')
        graph[str(i)]={'class_type':cls,'inputs':inputs}
    graph['900']={'class_type':'SaveGLB','inputs':{'mesh':['92',0],'filename_prefix':'keeper-raw-shape'}}
    (OUT/'api-workflow.json').write_text(json.dumps(graph,indent=2))
    r=requests.post(url+'/prompt',json={'prompt':graph,'client_id':'keeper-private-local'},timeout=60)
    (OUT/'submission.json').write_text(json.dumps(r.json(),indent=2));r.raise_for_status()
    prompt_id=r.json()['prompt_id']; record('generating',prompt_id=prompt_id)
    last=None
    while True:
        if server.poll() is not None:raise RuntimeError('Native server exited during generation')
        history=requests.get(url+'/history/'+prompt_id,timeout=20).json()
        if prompt_id in history:
            result=history[prompt_id];(OUT/'history.json').write_text(json.dumps(result,indent=2))
            if result.get('status',{}).get('status_str')=='error':raise RuntimeError('Generation execution error; inspect history.json')
            break
        # Progress retains real GPU evidence even if Kaggle hides live notebook logs.
        if int(time.time()-START)//30!=last:
            last=int(time.time()-START)//30
            record('generating',prompt_id=prompt_id)
        time.sleep(5)
    files=[{'file':str(p.relative_to(OUT)), 'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in OUT.rglob('*.glb')]
    if not files:raise RuntimeError('Workflow completed without a GLB')
    record('complete',files=files,art_accepted=False,rigged=False)
except BaseException as e:
    (OUT/'failure.txt').write_text(traceback.format_exc())
    record('failed',error=repr(e)); print(traceback.format_exc(),flush=True)
    raise
finally:
    signal.alarm(0)
    if server and server.poll() is None:
        server.terminate()
        try:server.wait(timeout=15)
        except subprocess.TimeoutExpired:server.kill()

"""Private authorized model transfer and bounded generation controller."""
import ast,datetime,hashlib,importlib.util,json,pathlib,shutil,sys
ROOT=pathlib.Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('control',ROOT/'run-kaggle.py');control=importlib.util.module_from_spec(spec);spec.loader.exec_module(control)
from kaggle.api.kaggle_api_extended import KaggleApi
api=KaggleApi();api.authenticate();username=api.get_config_value('username')
cached='--cached-input' in sys.argv
dataset=username+('/dragon-art-input-20261011' if cached else '/dragon-authorized-input-20261011')
pipeline_type='1536_cascade' if '--high' in sys.argv else '512'
preflight='--preflight' in sys.argv
recover='--resume-shape' in sys.argv
prefix='generation-recovery' if recover else ('generation-preflight' if preflight else ('generation-high' if '--high' in sys.argv else 'generation'))
kernel=username+('/hostile-dragon-recovery-20261011' if recover else ('/hostile-dragon-preflight-20261011' if preflight else ('/hostile-dragon-high-20261011' if '--high' in sys.argv else '/hostile-dragon-generation-20261011')))
receipt=ROOT/'outputs'/(prefix+'-submission.json')
action=sys.argv[1]
if action=='upload':
    folder=ROOT/'inputs'/'dragon-authorized-20261011'
    manifest=json.loads((folder/'input-manifest.json').read_text(encoding='utf-8'))
    processed=ROOT.parent/'working'/'trellis2'/'994f98db7bdf194fa4dabfbe6a3b1b1ae2e958ae31d7eb771473bd8e32d7d606'/'image.png'
    shutil.copy2(processed,folder/'generation-input.png')
    manifest['files']['generation-input.png']={'bytes':processed.stat().st_size,'sha256':hashlib.sha256(processed.read_bytes()).hexdigest(),'role':'previous server background-removed input'}
    (folder/'input-manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
    for entry in folder.rglob('*'):
        if entry.is_file() and any(s in entry.name.lower() for s in ['token','secret','credential','partial']):raise RuntimeError('Private input contains forbidden filename')
    metadata={'id':dataset,'title':'Dragon authorized input 20261011','licenses':[{'name':'other'}],'description':'Private internal use by the approved DINOv3 licensee. Meta DINOv3 weights retain their original license included with the files. Artwork is an unapproved production reference. No credentials. Not public distribution.'}
    (folder/'dataset-metadata.json').write_text(json.dumps(metadata,indent=2),encoding='utf-8')
    transfer=ROOT/'outputs'/'input-transfer.json'
    if transfer.exists():raise RuntimeError('Transfer intent already exists; check server dataset before repeating')
    control.save('input-transfer.json',{'stage':'uploading','dataset':dataset,'is_private':True,'created_at':datetime.datetime.now(datetime.timezone.utc).isoformat()})
    response=api.dataset_create_new(str(folder),public=False,quiet=True,convert_to_csv=False,dir_mode='zip')
    control.save('input-transfer.json',{'stage':'submitted','dataset':dataset,'is_private':True,'response':str(response)})
    print(control.safe(response))
elif action=='input-status':
    print(control.safe(api.dataset_status(dataset)))
elif action=='push':
    if receipt.exists():
        old=json.loads(receipt.read_text())
        if recover and '--retry-title-conflict' in sys.argv and old.get('stage')=='submitting' and not old.get('title_conflict_repair'):
            import requests
            try:api.kernels_status(kernel)
            except requests.HTTPError as e:
                if e.response.status_code not in [403,404]:raise
            except ValueError as e:
                cause=e.__context__
                if not isinstance(cause,requests.HTTPError) or cause.response.status_code not in [403,404]:raise
            else:raise RuntimeError('Recovery exists; do not resubmit unknown outcome')
            original_kernel=json.loads((ROOT/'outputs'/'generation-submission.json').read_text())['kernel']
            if json.loads(str(api.kernels_status(original_kernel))).get('status')!='COMPLETE':raise RuntimeError('Owner access/previous terminal state must be verified')
            control.save(prefix+'-rejected-title.json',dict(old,confirmed_error='409 title/slug conflict; target absent, owner access verified'))
        else:
            if not (preflight and '--repair-known' in sys.argv):raise RuntimeError('Submission recorded; inspect server state before retry')
            version=json.loads(old['response']).get('versionNumber',1)
            if version>=4:raise RuntimeError('Bounded preflight repair limit reached')
            if json.loads(str(api.kernels_status(kernel))).get('status') not in ['COMPLETE','ERROR']:raise RuntimeError('Previous run is not terminal')
            prior_folder=ROOT/'outputs'/('remote-'+prefix+('-v'+str(version) if version>1 else ''))
            prior_report=prior_folder/'dragon-generation'/'generation.json'
            prior_log=prior_folder/'hostile-dragon-preflight-20261011.log'
            known=(prior_report.exists() and json.loads(prior_report.read_text()).get('stage')=='generation_failed') or (prior_log.exists() and "No such file or directory: '/kaggle/temp/t4-adaptation.py'" in prior_log.read_text())
            if not known:raise RuntimeError('Previous failure not confirmed')
            control.save(prefix+'-submission-v'+str(version)+'.json',old)
    runtime_receipt=json.loads((ROOT/'outputs'/'runtime-submission.json').read_text(encoding='utf-8'))
    runtime_version=json.loads(runtime_receipt['response']).get('versionNumber',1)
    runtime_folder='remote-runtime'+('-v'+str(runtime_version) if runtime_version>1 else '')
    runtime=json.loads((ROOT/'outputs'/runtime_folder/'dragon-runtime'/'runtime.json').read_text(encoding='utf-8'))
    if runtime['stage']!='runtime_export_completed':raise RuntimeError('Actual GLB export must pass before generation')
    if '--high' in sys.argv:
        previous_path=ROOT/'outputs'/'remote-generation-recovery'/'dragon-generation'/'generation.json'
        if not previous_path.exists():previous_path=ROOT/'outputs'/'remote-generation'/'dragon-generation'/'generation.json'
        previous=json.loads(previous_path.read_text(encoding='utf-8'))
        if previous.get('stage')!='editable_candidate_saved':raise RuntimeError('512 end-to-end candidate required first')
    if not preflight:
        status=api.dataset_status(dataset)
        if str(status).lower()!='ready':raise RuntimeError('Private input dataset not ready: '+str(status))
    quota=control.quotas(api)
    if quota.get('gpu',{}).get('remaining_seconds',0)<9000:raise RuntimeError('Insufficient bounded GPU quota')
    control.save('quota-before-'+prefix+'.json',quota)
    geometry=json.loads((ROOT/'outputs'/'remote-geometry-v2'/'dragon-geometry'/'geometry.json').read_text())
    ops=json.loads((ROOT/'outputs'/'remote-operators'/'dragon-compat'/'compatibility.json').read_text())
    expected={v['file']:v['sha256'] for v in geometry['packages'].values()};expected[ops['wheel']['file']]=ops['wheel']['sha256']
    import nbformat
    folder=ROOT/'notebooks'/prefix;folder.mkdir(parents=True,exist_ok=True)
    adaptation=(ROOT/'t4-adaptation.py').read_text(encoding='utf-8');ast.parse(adaptation)
    first="from pathlib import Path\nPath('/kaggle/temp').mkdir(parents=True,exist_ok=True)\nPath('/kaggle/temp/t4-adaptation.py').write_text("+repr(adaptation)+")\n"
    resume_sha=None
    if recover:
        original=ROOT/'outputs'/'remote-generation'/'dragon-generation'
        prior=json.loads((original/'generation.json').read_text())
        if "'LazyModel' object is not subscriptable" not in prior.get('error',''):raise RuntimeError('Expected texture loader failure not confirmed')
        resume_sha=hashlib.sha256((original/'sample_shape_slat-checkpoint.pt').read_bytes()).hexdigest()
    code='SOURCE_SHA='+repr('75fbf0183001ed9876c8dbb35de6b68552ee08bd')+'\nMODEL_PINS='+repr(json.loads((ROOT/'sources'/'generation-model-pins.json').read_text()))+'\nEXPECTED_WHEELS='+repr(expected)+'\nPIPELINE_TYPE='+repr(pipeline_type)+'\nVALIDATION_ONLY='+repr(preflight)+'\nUSE_CACHED_INPUT='+repr(cached)+'\nRESUME_SHAPE='+repr(recover)+'\nSHAPE_CHECKPOINT_SHA='+repr(resume_sha)+"\nADAPTATION_FILE='/kaggle/temp/t4-adaptation.py'\n"+(ROOT/'remote-generate.py').read_text(encoding='utf-8')
    ast.parse(code)
    nb=nbformat.v4.new_notebook(metadata={'kernelspec':{'display_name':'Python 3','language':'python','name':'python3'}},cells=[nbformat.v4.new_markdown_cell('# Private dragon generation\nOriginal licensed weights, no secrets in notebook. Technical candidate; artistic acceptance requires separate shape and material review.'),nbformat.v4.new_code_cell(first),nbformat.v4.new_code_cell(code)])
    nbformat.validate(nb);nbformat.write(nb,folder/'dragon.ipynb')
    sources=[json.loads((ROOT/'outputs'/p).read_text())['kernel'] for p in ['geometry-submission.json','compat-submission.json']]
    if recover:sources.append(json.loads((ROOT/'outputs'/'generation-submission.json').read_text())['kernel']+'/1')
    meta={'id':kernel,'title':'Hostile Dragon Recovery 20261011' if recover else ('Hostile Dragon Preflight 20261011' if preflight else ('Hostile Dragon High 20261011' if '--high' in sys.argv else 'Hostile Dragon Generation 20261011')),'code_file':'dragon.ipynb','language':'python','kernel_type':'notebook','is_private':True,'enable_gpu':True,'enable_tpu':False,'enable_internet':True,'dataset_sources':[] if preflight else [dataset],'kernel_sources':sources,'competition_sources':[],'model_sources':[]}
    if cached:meta['model_sources']=['hark99/facebookdinov3-vitl16-pretrain-lvd1689m/transformers/default/1']
    (folder/'kernel-metadata.json').write_text(json.dumps(meta,indent=2),encoding='utf-8')
    control.save(prefix+'-submission.json',{'stage':'submitting','kernel':kernel,'title_conflict_repair':'--retry-title-conflict' in sys.argv,'created_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'source_sha256':hashlib.sha256(code.encode()).hexdigest()})
    response=api.kernels_push(str(folder),timeout='600' if preflight else '7200',acc='NvidiaTeslaT4')
    control.save(prefix+'-submission.json',{'stage':'submitted','kernel':kernel,'response':str(response)});print(control.safe(response))
elif action=='status':print(control.safe(api.kernels_status(kernel)))
elif action=='fetch':
    record=json.loads(receipt.read_text());version=json.loads(record['response']).get('versionNumber',1)
    out=ROOT/'outputs'/('remote-'+prefix+('-v'+str(version) if version>1 else ''));out.mkdir(exist_ok=True)
    api.kernels_output(kernel,path=str(out));control.save('quota-after-'+prefix+'.json',control.quotas(api))
    report=out/'dragon-generation'/'generation.json';print(report.read_text() if report.exists() else 'No report')
else:raise RuntimeError('Unknown action')

"""Submit and retrieve one private, bounded geometry test."""
import ast,datetime,hashlib,importlib.util,json,pathlib,sys
ROOT=pathlib.Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('control',ROOT/'run-kaggle.py');control=importlib.util.module_from_spec(spec);spec.loader.exec_module(control)
from kaggle.api.kaggle_api_extended import KaggleApi
api=KaggleApi();api.authenticate()
runtime='--runtime' in sys.argv
prefix='runtime' if runtime else 'geometry'
kernel=api.get_config_value('username')+('/hostile-dragon-t4-runtime-20261011' if runtime else '/hostile-dragon-t4-geometry-20261011')
receipt=ROOT/'outputs'/(prefix+'-submission.json')
action=sys.argv[1]
if action=='push':
    import nbformat
    if receipt.exists():
        old=json.loads(receipt.read_text(encoding='utf-8'))
        if runtime and any(flag in sys.argv for flag in ['--fix-dependencies','--fix-fixture']):
            version=json.loads(old['response']).get('versionNumber',1)
            if version>=4:raise RuntimeError('Bounded dependency repair limit reached')
            if json.loads(str(api.kernels_status(old['kernel']))).get('status')!='COMPLETE':raise RuntimeError('Previous run must be terminal')
            prior_folder='remote-runtime'+('-v'+str(version) if version>1 else '')
            report=json.loads((ROOT/'outputs'/prior_folder/'dragon-runtime'/'runtime.json').read_text(encoding='utf-8'))
            if '--fix-fixture' in sys.argv:
                if 'BVH needs at least 8 triangles' not in report.get('error',''):raise RuntimeError('Expected fixture limitation not confirmed')
            elif not any("No module named '"+name+"'" in report.get('error','') for name in ['trimesh','plyfile','easydict']):raise RuntimeError('Expected missing dependency was not confirmed')
            control.save('runtime-submission-v'+str(version)+'.json',old)
        else:
            if '--retry-timeout' not in sys.argv or runtime:raise RuntimeError('Submission already recorded; inspect existing result')
            if old.get('retry_timeout'):raise RuntimeError('Bounded timeout retry already submitted')
            if json.loads(str(api.kernels_status(old['kernel']))).get('status')!='COMPLETE':raise RuntimeError('Previous run must be terminal')
            report=json.loads((ROOT/'outputs'/'remote-geometry'/'dragon-geometry'/'geometry.json').read_text(encoding='utf-8'))
            if 'TimeoutExpired' not in report.get('error',''):raise RuntimeError('Only confirmed compilation timeout may use this retry')
            control.save('geometry-submission-v1.json',old)
    previous=json.loads((ROOT/'outputs'/'remote-operators'/'dragon-compat'/'compatibility.json').read_text(encoding='utf-8'))
    if not all(previous.get('tests',{}).get(label,{}).get('finite') for label in ['fp16','bf16']):raise RuntimeError('Sparse operator tests must pass first')
    quota=control.quotas(api)
    if quota.get('gpu',{}).get('remaining_seconds',0)<1800:raise RuntimeError('Insufficient quota')
    control.save('quota-before-'+prefix+'.json',quota)
    pins={row['repo']:row['sha'] for row in json.loads((ROOT/'sources'/'compatibility-source-pins.json').read_text())}
    pins['microsoft/TRELLIS.2']='75fbf0183001ed9876c8dbb35de6b68552ee08bd'
    code='SOURCE_PINS='+repr(pins)+'\nFLEX_WHEEL_SHA='+repr(previous['wheel']['sha256'])+'\n'+(ROOT/'remote-geometry.py').read_text(encoding='utf-8');ast.parse(code)
    sources=[json.loads((ROOT/'outputs'/'compat-submission.json').read_text(encoding='utf-8'))['kernel']]
    if runtime:
        geometry_receipt=json.loads((ROOT/'outputs'/'geometry-submission.json').read_text(encoding='utf-8'))
        if json.loads(str(api.kernels_status(geometry_receipt['kernel']))).get('status')!='COMPLETE':raise RuntimeError('Geometry build must complete first')
        version=json.loads(geometry_receipt['response']).get('versionNumber',1)
        geometry_folder='remote-geometry' if version==1 else 'remote-geometry-v'+str(version)
        geometry_report=json.loads((ROOT/'outputs'/geometry_folder/'dragon-geometry'/'geometry.json').read_text(encoding='utf-8'))
        packages=geometry_report.get('packages',{})
        expected={packages[label]['file']:packages[label]['sha256'] for label in ['cumesh','nvdiffrast','o_voxel']}
        expected[previous['wheel']['file']]=previous['wheel']['sha256']
        code='EXPECTED_WHEELS='+repr(expected)+'\n'+(ROOT/'remote-runtime-check.py').read_text(encoding='utf-8');ast.parse(code)
        sources=[geometry_receipt['kernel'],json.loads((ROOT/'outputs'/'compat-submission.json').read_text(encoding='utf-8'))['kernel']]
    nb=nbformat.v4.new_notebook(metadata={'kernelspec':{'display_name':'Python 3','language':'python','name':'python3'}},cells=[nbformat.v4.new_markdown_cell('# T4 geometry dependencies\nPrivate bounded test. No weights, secrets, or paid APIs. This is not a generated coin.'),nbformat.v4.new_code_cell(code)])
    nbformat.validate(nb)
    folder=ROOT/'notebooks'/prefix;folder.mkdir(parents=True,exist_ok=True);nbformat.write(nb,folder/'geometry.ipynb')
    meta={'id':kernel,'title':'Hostile Dragon T4 Runtime 20261011' if runtime else 'Hostile Dragon T4 Geometry 20261011','code_file':'geometry.ipynb','language':'python','kernel_type':'notebook','is_private':True,'enable_gpu':True,'enable_tpu':False,'enable_internet':True,'dataset_sources':[],'competition_sources':[],'kernel_sources':sources,'model_sources':[]}
    (folder/'kernel-metadata.json').write_text(json.dumps(meta,indent=2),encoding='utf-8')
    retry='--retry-timeout' in sys.argv
    control.save(prefix+'-submission.json',{'stage':'submitting','kernel':kernel,'retry_timeout':retry,'created_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'sha256':hashlib.sha256(code.encode()).hexdigest()})
    response=api.kernels_push(str(folder),timeout='450' if runtime else '1900',acc='NvidiaTeslaT4');control.save(prefix+'-submission.json',{'stage':'submitted','kernel':kernel,'retry_timeout':retry,'dependency_fix':'--fix-dependencies' in sys.argv,'response':str(response)});print(control.safe(response))
elif action=='status':
    response=api.kernels_status(kernel);control.save(prefix+'-status.json',{'response':str(response)});print(control.safe(response))
elif action=='fetch':
    record=json.loads(receipt.read_text(encoding='utf-8'));version=json.loads(record['response']).get('versionNumber',1)
    folder_name='remote-'+prefix+('-v'+str(version) if version>1 else '')
    output=ROOT/'outputs'/folder_name;output.mkdir(exist_ok=True);api.kernels_output(kernel,path=str(output))
    control.save('quota-after-'+prefix+'.json',control.quotas(api));report=output/('dragon-runtime/runtime.json' if runtime else 'dragon-geometry/geometry.json');print(report.read_text(encoding='utf-8') if report.exists() else 'No geometry report')
else:raise RuntimeError('Unknown action')

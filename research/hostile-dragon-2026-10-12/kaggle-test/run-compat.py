"""Local credential-aware orchestration; credentials are never uploaded."""
import importlib.util
import json
import pathlib
import sys
import datetime
import hashlib
ROOT=pathlib.Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('control',ROOT/'run-kaggle.py')
control=importlib.util.module_from_spec(spec); spec.loader.exec_module(control)
from kaggle.api.kaggle_api_extended import KaggleApi
api=KaggleApi();api.authenticate()
operators='--operators' in sys.argv
prefix='operators' if operators else 'compat'
kernel=api.get_config_value('username')+('/hostile-dragon-t4-operators-20261011' if operators else '/hostile-dragon-t4-compatibility-20261011')
receipt=ROOT/'outputs'/(prefix+'-submission.json')
action=sys.argv[1]
if action=='push':
    import ast, nbformat
    if receipt.exists(): raise RuntimeError('Submission already recorded; inspect status and results instead of repeating')
    quota=control.quotas(api)
    if quota.get('gpu',{}).get('remaining_seconds',0)<1500: raise RuntimeError('Insufficient GPU quota')
    control.save('quota-before-'+prefix+'.json',quota)
    pins={row['repo']:row['sha'] for row in json.loads((ROOT/'sources'/'compatibility-source-pins.json').read_text(encoding='utf-8'))}
    code='SOURCE_PINS='+repr(pins)+'\n'+(ROOT/'remote-compat.py').read_text(encoding='utf-8')
    sources=[]
    if operators:
        previous=json.loads((ROOT/'outputs'/'compat-submission.json').read_text(encoding='utf-8'))
        if json.loads(str(api.kernels_status(previous['kernel']))).get('status')!='COMPLETE':raise RuntimeError('Previous compilation must be COMPLETE')
        report=json.loads((ROOT/'outputs'/'remote-compat'/'dragon-compat'/'compatibility.json').read_text(encoding='utf-8'))
        if not report.get('wheel',{}).get('sha256'):raise RuntimeError('No preserved compiled wheel to reuse')
        code='REUSE_WHEEL_SHA='+repr(report['wheel']['sha256'])+'\n'+code
        sources=[previous['kernel']]
    ast.parse(code)
    notebook=nbformat.v4.new_notebook(metadata={'kernelspec':{'display_name':'Python 3','language':'python','name':'python3'},'language_info':{'name':'python'}},cells=[nbformat.v4.new_markdown_cell('# T4 sparse dependency compatibility\nPrivate bounded test. No weights, no paid API, no secrets. Not an accepted coin.'),nbformat.v4.new_code_cell(code)])
    nbformat.validate(notebook)
    folder=ROOT/'notebooks'/prefix;folder.mkdir(parents=True,exist_ok=True)
    nbformat.write(notebook,folder/'compat.ipynb')
    metadata={'id':kernel,'title':'Hostile Dragon T4 Operators 20261011' if operators else 'Hostile Dragon T4 Compatibility 20261011','code_file':'compat.ipynb','language':'python','kernel_type':'notebook','is_private':True,'enable_gpu':True,'enable_tpu':False,'enable_internet':True,'dataset_sources':[],'competition_sources':[],'kernel_sources':sources,'model_sources':[]}
    (folder/'kernel-metadata.json').write_text(json.dumps(metadata,indent=2),encoding='utf-8')
    control.save(prefix+'-submission.json',{'stage':'submitting','kernel':kernel,'sha256':hashlib.sha256(code.encode()).hexdigest(),'created_at':datetime.datetime.now(datetime.timezone.utc).isoformat()})
    response=api.kernels_push(str(folder),timeout='300' if operators else '1000',acc='NvidiaTeslaT4')
    control.save(prefix+'-submission.json',{'stage':'submitted','kernel':kernel,'response':str(response)})
    print(control.safe(response))
elif action=='status':
    response=api.kernels_status(kernel);control.save(prefix+'-status.json',{'response':str(response)});print(control.safe(response))
elif action=='fetch':
    output=ROOT/'outputs'/('remote-'+prefix);output.mkdir(exist_ok=True)
    api.kernels_output(kernel,path=str(output))
    control.save('quota-after-'+prefix+'.json',control.quotas(api))
    report=output/'dragon-compat'/'compatibility.json'
    print(report.read_text(encoding='utf-8') if report.exists() else 'No compatibility report')
else: raise RuntimeError('Unknown action')

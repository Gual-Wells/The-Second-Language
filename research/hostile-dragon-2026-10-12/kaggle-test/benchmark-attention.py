"""Bounded test of existing PyTorch kernels, not a new attention implementation."""
import ast, datetime, hashlib, importlib.util, json, pathlib, sys
import requests
ROOT=pathlib.Path(__file__).resolve().parent
old_init=requests.Session.__init__
def direct(self,*a,**kw):old_init(self,*a,**kw);self.trust_env=False
requests.Session.__init__=direct
spec=importlib.util.spec_from_file_location('control',ROOT/'run-kaggle.py')
control=importlib.util.module_from_spec(spec);spec.loader.exec_module(control)
from kaggle.api.kaggle_api_extended import KaggleApi
api=KaggleApi();api.authenticate()
prefix='attention-benchmark';kernel='gualwells/dragon-native-attention-20261011'
receipt=ROOT/'outputs'/(prefix+'-submission.json')
action=sys.argv[1]
if action=='status':print(control.safe(api.kernels_status(kernel)))
elif action=='fetch':
    out=ROOT/'outputs'/('remote-'+prefix);out.mkdir(exist_ok=True)
    api.kernels_output(kernel,path=str(out))
    p=out/'attention-benchmark.json';print(p.read_text() if p.exists() else 'No benchmark report')
elif action=='push':
    if receipt.exists():
        prior=json.loads(receipt.read_text())
        metadata_retry='--retry-metadata' in sys.argv
        if metadata_retry:
            log=ROOT/'outputs/remote-attention-benchmark/dragon-native-attention-20261011.log'
            if not log.exists() or 'No kernel name found in notebook' not in log.read_text():
                raise RuntimeError('Expected startup metadata failure not established')
            if json.loads(str(api.kernels_status(kernel)))['status']!='ERROR':
                raise RuntimeError('Previous benchmark is not terminal')
            control.save('attention-benchmark-v1-startup-failure.json',prior)
        elif '--retry-capacity' not in sys.argv or prior.get('stage')!='rejected_capacity':
            raise RuntimeError('Inspect recorded submission before any retry')
        # A capacity rejection has no version or kernel/session. Never retry an
        # accepted or ambiguous response through this path.
        response=json.loads(prior['response'])
        if not metadata_retry and (response.get('kernelId')!=0 or response.get('versionNumber') is not None):
            raise RuntimeError('Rejected response contains an unexpected execution identity')
    code=r'''
import json,pathlib,time,traceback,torch
from torch.nn.functional import scaled_dot_product_attention as sdpa
from torch.nn.attention import sdpa_kernel,SDPBackend
OUT=pathlib.Path('/kaggle/working/attention-benchmark.json')
report={'stage':'started','task':'native kernel feasibility and synthetic numerical comparison','generative_quality_verified':False,'tests':[]}
def save():OUT.write_text(json.dumps(report,indent=2));print(json.dumps(report),flush=True)
save()
try:
    report.update(torch=torch.__version__,gpu=torch.cuda.get_device_name(0),capability=list(torch.cuda.get_device_capability(0)))
    torch.manual_seed(38017)
    with torch.inference_mode():
        for n,dim,amplitude in [(256,64,1),(2048,64,1),(8192,64,1),(2048,64,8),(2048,128,1)]:
            q,k,v=[(torch.randn(1,16,n,dim,device='cuda')*amplitude).bfloat16() for _ in range(3)]
            halves=[x.half() for x in (q,k,v)]
            item={'tokens':n,'heads':16,'head_dim':dim,'amplitude':amplitude,'input_max':max(x.abs().max().item() for x in (q,k,v)),'fp16_cast_finite':all(torch.isfinite(x).all().item() for x in halves),'fp16_cast_max_absolute_error':max((x.float()-y.float()).abs().max().item() for x,y in zip((q,k,v),halves))}
            results={}
            for label,inputs in [('fp32',[x.float() for x in (q,k,v)]),('fp16',halves)]:
                with sdpa_kernel(SDPBackend.EFFICIENT_ATTENTION):
                    sdpa(*inputs);torch.cuda.synchronize()
                    start=torch.cuda.Event(enable_timing=True);end=torch.cuda.Event(enable_timing=True)
                    start.record();value=sdpa(*inputs);end.record();torch.cuda.synchronize()
                item[label+'_milliseconds']=start.elapsed_time(end)
                results[label]=value.float()
            ref=results['fp32'];half=results['fp16'];delta=half-ref
            item.update(output_finite=bool(torch.isfinite(half).all()),max_absolute_error=delta.abs().max().item(),relative_rms_error=(delta.square().mean().sqrt()/ref.square().mean().sqrt().clamp_min(1e-12)).item(),bf16_output_max_error=(half.bfloat16().float()-ref.bfloat16().float()).abs().max().item(),speedup=item['fp32_milliseconds']/item['fp16_milliseconds'])
            report['tests'].append(item);save()
            del q,k,v,halves,results,ref,half,delta,value,inputs
            torch.cuda.empty_cache()
    report['linear_tests']=[]
    with torch.inference_mode():
        for tokens in [256,8192]:
            x=torch.randn(tokens,1024,device='cuda').bfloat16()
            w=(torch.randn(4096,1024,device='cuda')/32).bfloat16()
            half_x=x.half();half_w=w.half();outputs={};item={'tokens':tokens,'input_features':1024,'output_features':4096,'synthetic':True}
            for label,a,b in [('bf16',x,w),('fp16',half_x,half_w)]:
                torch.nn.functional.linear(a,b);torch.cuda.synchronize()
                start=torch.cuda.Event(enable_timing=True);end=torch.cuda.Event(enable_timing=True)
                start.record();output=torch.nn.functional.linear(a,b);end.record();torch.cuda.synchronize()
                item[label+'_milliseconds']=start.elapsed_time(end);outputs[label]=output.float()
            delta=outputs['bf16']-outputs['fp16']
            item.update(speedup=item['bf16_milliseconds']/item['fp16_milliseconds'],relative_rms_error=(delta.square().mean().sqrt()/outputs['bf16'].square().mean().sqrt()).item(),output_finite=bool(torch.isfinite(outputs['fp16']).all()))
            report['linear_tests'].append(item);save()
            del x,w,half_x,half_w,outputs,delta,output,a,b
            torch.cuda.empty_cache()
    report['stage']='synthetic_benchmark_complete';save()
except Exception as e:
    report.update(stage='benchmark_failed',error=repr(e),traceback=traceback.format_exc());save()
'''
    ast.parse(code)
    import nbformat
    folder=ROOT/'notebooks'/prefix;folder.mkdir(parents=True,exist_ok=True)
    nb=nbformat.v4.new_notebook(metadata={'kernelspec':{'display_name':'Python 3','language':'python','name':'python3'}},cells=[nbformat.v4.new_markdown_cell('# Native T4 attention benchmark\nSynthetic numerical/performance check only. No model downloads, generation or credentials.'),nbformat.v4.new_code_cell(code)])
    nbformat.validate(nb);nbformat.write(nb,folder/'benchmark.ipynb')
    meta={'id':kernel,'title':'Dragon Native Attention 20261011','code_file':'benchmark.ipynb','language':'python','kernel_type':'notebook','is_private':True,'enable_gpu':True,'enable_internet':False,'dataset_sources':[],'kernel_sources':[],'competition_sources':[],'model_sources':[]}
    (folder/'kernel-metadata.json').write_text(json.dumps(meta,indent=2))
    control.save(prefix+'-submission.json',{'stage':'submitting','kernel':kernel,'created_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'source_sha256':hashlib.sha256(code.encode()).hexdigest()})
    result=api.kernels_push(str(folder),timeout='300',acc='NvidiaTeslaT4')
    response=json.loads(str(result))
    stage='submitted' if response.get('versionNumber') is not None and not response.get('error') else ('rejected_capacity' if response.get('error')=='Maximum batch GPU session count of 2 reached.' and response.get('kernelId')==0 else 'submission_failed')
    control.save(prefix+'-submission.json',{'stage':stage,'kernel':kernel,'response':str(result)})
    print(control.safe(result))
else:raise RuntimeError('Unknown action')

"""Private short Kaggle probe: no installs, model downloads, secrets or external calls."""
import datetime,json,pathlib,signal,subprocess,sys,time

print('KEEPER_BOOT: Python script entered',flush=True)
OUT=pathlib.Path('/kaggle/working/keeper-startup-probe')
OUT.mkdir(parents=True,exist_ok=True)
report={'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'stage':'python_entered','python':sys.version,'art_accepted':False}

def save():
 (OUT/'startup.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
 print(json.dumps(report),flush=True)

def stop(signum,frame):
 report['stage']='execution_deadline';save()
 raise TimeoutError('90 second startup probe execution limit')

signal.signal(signal.SIGALRM,stop);signal.alarm(90);save()
started=time.monotonic()
try:
 result=subprocess.run(['nvidia-smi','--query-gpu=name,memory.total,driver_version','--format=csv,noheader'],capture_output=True,text=True,timeout=10)
 report.update(stage='driver_checked',driver_returncode=result.returncode,gpus=result.stdout.strip());save()
 if result.returncode:raise RuntimeError('GPU driver probe failed')
 child="""import json,torch
assert torch.cuda.is_available(),'CUDA unavailable'
x=torch.ones((256,256),device='cuda');y=x@x;torch.cuda.synchronize()
print(json.dumps({'torch':torch.__version__,'gpu':torch.cuda.get_device_name(0),'cuda':torch.version.cuda,'result':float(y[0,0])}),flush=True)
"""
 result=subprocess.run([sys.executable,'-u','-c',child],capture_output=True,text=True,timeout=60)
 (OUT/'torch.log').write_text(result.stdout+'\n'+result.stderr,encoding='utf-8')
 report.update(stage='gpu_ready' if result.returncode==0 else 'torch_failed',torch_returncode=result.returncode)
 if result.returncode==0:report['torch']=json.loads(result.stdout.strip().splitlines()[-1])
except Exception as error:
 report.update(stage='probe_failed',error=type(error).__name__+': '+str(error))
finally:
 report['elapsed_seconds']=round(time.monotonic()-started,2);save();signal.alarm(0)
if report['stage']!='gpu_ready':raise SystemExit(1)

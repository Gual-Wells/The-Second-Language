"""Collect only this experiment's submitted jobs; no generation retries or purchases."""
import datetime,importlib.util,json,pathlib,subprocess,sys,time,requests
ROOT=pathlib.Path(__file__).resolve().parent
original_init=requests.Session.__init__;original_request=requests.Session.request
def direct(self,*a,**kw):original_init(self,*a,**kw);self.trust_env=False
def bounded(self,*a,**kw):kw.setdefault('timeout',(10,30));return original_request(self,*a,**kw)
requests.Session.__init__=direct;requests.Session.request=bounded
spec=importlib.util.spec_from_file_location('control',ROOT/'run-kaggle.py')
control=importlib.util.module_from_spec(spec);spec.loader.exec_module(control)
from kaggle.api.kaggle_api_extended import KaggleApi
api=KaggleApi();api.authenticate()
report={'stage':'collecting','started_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'art_accepted':False,'generation_resubmitted':False,'jobs':{}}
def save():
    report['observed_at']=datetime.datetime.now(datetime.timezone.utc).isoformat()
    control.save('current-jobs-collection.json',report)
def run(script,args,label,timeout=1200):
    log=ROOT/'outputs'/(label+'.log')
    with log.open('w',encoding='utf-8') as stream:
        p=subprocess.run([sys.executable,str(ROOT/script),*args],cwd=ROOT,stdout=stream,stderr=subprocess.STDOUT,timeout=timeout)
    return p.returncode
deadline=time.monotonic()+3*3600
work=[('generation-high','run-generation.py',['fetch','--high']),('mesh-repair-512','reexport-candidate.py',['fetch'])]
last_terminal_count=0
save()
while time.monotonic()<deadline:
    for prefix,script,args in work:
        record=report['jobs'].setdefault(prefix,{})
        if record.get('fetched'):continue
        receipt=json.loads((ROOT/'outputs'/(prefix+'-submission.json')).read_text())
        record['kernel']=receipt['kernel']
        try:
            status=json.loads(str(api.kernels_status(receipt['kernel'])))
            record['status']=status['status'];record['failure_message']=status.get('failureMessage')
            save()
            if status['status'] in ['COMPLETE','ERROR','CANCELLED','CANCELED']:
                code=run(script,args,prefix+'-collection',1200)
                record['fetch_exit_code']=code
                record['fetched']=code==0
                save()
        except Exception as e:record['collection_error']=type(e).__name__;save()
    terminals=sum(bool(report['jobs'].get(x[0],{}).get('fetched')) for x in work)
    # The short native-kernel benchmark was explicitly rejected without a
    # session. Retry once only after a known existing session has finished.
    if terminals>last_terminal_count:
        last_terminal_count=terminals
        p=ROOT/'outputs'/'attention-benchmark-submission.json'
        receipt=json.loads(p.read_text()) if p.exists() else {}
        if receipt.get('stage')=='rejected_capacity':
            run('benchmark-attention.py',['push','--retry-capacity'],'attention-benchmark-retry',180)
    p=ROOT/'outputs'/'attention-benchmark-submission.json'
    if p.exists():
        receipt=json.loads(p.read_text())
        if receipt.get('stage')=='submitted':
            record=report['jobs'].setdefault('attention-benchmark',{})
            if not record.get('fetched'):
                try:
                    status=json.loads(str(api.kernels_status(receipt['kernel'])))
                    record.update(kernel=receipt['kernel'],status=status['status']);save()
                    if status['status'] in ['COMPLETE','ERROR','CANCELLED','CANCELED']:
                        code=run('benchmark-attention.py',['fetch'],'attention-benchmark-collection',300)
                        record.update(fetch_exit_code=code,fetched=code==0);save()
                except Exception as e:record['collection_error']=type(e).__name__;save()
    if terminals==len(work) and (report['jobs'].get('attention-benchmark',{}).get('fetched') or (p.exists() and json.loads(p.read_text()).get('stage')!='submitted')):break
    time.sleep(30)
report['stage']='collected' if all(report['jobs'].get(x[0],{}).get('fetched') for x in work) else 'collection_deadline_reached'
control.save('quota-after-current-jobs.json',control.quotas(api));save()
# Never select or promote a candidate automatically. Actual artistic review
# and comparison with the immutable original still require the active agent.

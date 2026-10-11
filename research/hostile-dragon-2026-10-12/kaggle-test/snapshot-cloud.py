"""Bounded read-only snapshot of this experiment's existing jobs."""
import importlib.util,json,pathlib,requests,sys,datetime
ROOT=pathlib.Path(__file__).resolve().parent
original_init=requests.Session.__init__;original_request=requests.Session.request
def init(self,*a,**kw):original_init(self,*a,**kw);self.trust_env=False
def request(self,*a,**kw):kw.setdefault('timeout',(10,25));return original_request(self,*a,**kw)
requests.Session.__init__=init;requests.Session.request=request
spec=importlib.util.spec_from_file_location('control',ROOT/'run-kaggle.py');control=importlib.util.module_from_spec(spec);spec.loader.exec_module(control)
from kaggle.api.kaggle_api_extended import KaggleApi
api=KaggleApi();api.authenticate()
for prefix in sys.argv[1:]:
    receipt=json.loads((ROOT/'outputs'/(prefix+'-submission.json')).read_text())
    kernel=receipt['kernel'];data={'kernel':kernel,'queried_at':datetime.datetime.now(datetime.timezone.utc).isoformat()}
    try:
        data['status']=json.loads(str(api.kernels_status(kernel)))
        log=api.kernels_logs(kernel);data['log_characters']=len(log)
        structured=[]
        for line in log.splitlines():
            try:value=json.loads(line)
            except ValueError:continue
            if isinstance(value,dict) and 'stage' in value:structured.append(value)
        if structured:data['latest_report']=structured[-1]
    except Exception as e:data['read_error']=type(e).__name__
    control.save(prefix+'-snapshot.json',data)
    print(control.safe(json.dumps(data)),flush=True)

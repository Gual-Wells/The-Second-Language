"""Read existing sampling progress only, without changing the cloud run."""
import requests,json,pathlib,importlib.util,re,datetime,time
ROOT=pathlib.Path(__file__).resolve().parent
init_original=requests.Session.__init__;request_original=requests.Session.request
def init(self,*a,**kw):init_original(self,*a,**kw);self.trust_env=False
def request(self,*a,**kw):kw.setdefault('timeout',(10,35));return request_original(self,*a,**kw)
requests.Session.__init__=init;requests.Session.request=request
spec=importlib.util.spec_from_file_location('control',ROOT/'run-kaggle.py');control=importlib.util.module_from_spec(spec);spec.loader.exec_module(control)
from kaggle.api.kaggle_api_extended import KaggleApi
api=KaggleApi();api.authenticate()
kernel=json.loads((ROOT/'outputs'/'generation-high-submission.json').read_text())['kernel']
last=None;count=0;started=time.monotonic();report=None
try:
    for event in api.kernels_logs_stream(kernel):
        for line in event.get('data','').replace('\r','\n').splitlines():
            if re.search(r'\d+/12\s+\[',line) and 'http' not in line:
                text=re.sub(r'\x1b\[[0-9;]*m','',line)[-200:]
                if text==last:continue
                last=text;count+=1
                report={'observed_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'kernel':kernel,'sampling_progress':text,'resubmitted':False}
                control.save('generation-high-progress.json',report)
        # A fixed count used to stop in historical replay before the live stage.
        # Drain the replay within a bounded read, then report only its latest item.
        if time.monotonic()-started>45:break
except requests.RequestException as error:
    print(json.dumps({'read_error':type(error).__name__,'sampling_reports':count,'resubmitted':False}))
finally:
    if report:print(json.dumps(report),flush=True)

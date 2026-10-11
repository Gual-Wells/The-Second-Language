"""Read-only bounded log stream; emit only our structured stage reports."""
import importlib.util,pathlib,json,time,sys,requests
ROOT=pathlib.Path(__file__).resolve().parent
if '--direct' in sys.argv:
    original_init=requests.Session.__init__
    def direct_init(self,*a,**kw):original_init(self,*a,**kw);self.trust_env=False
    requests.Session.__init__=direct_init
spec=importlib.util.spec_from_file_location('control',ROOT/'run-kaggle.py');control=importlib.util.module_from_spec(spec);spec.loader.exec_module(control)
from kaggle.api.kaggle_api_extended import KaggleApi
api=KaggleApi();api.authenticate()
name='generation-recovery' if '--resume-shape' in sys.argv else ('generation-high' if '--high' in sys.argv else ('generation-preflight' if '--preflight' in sys.argv else 'generation'))
kernel=json.loads((ROOT/'outputs'/(name+'-submission.json')).read_text())['kernel']
deadline=time.monotonic()+7500;last=None
original=requests.Session.get
def bounded_get(self,*a,**kw):
    kw.setdefault('timeout',(15,60));return original(self,*a,**kw)
requests.Session.get=bounded_get
live=ROOT/'outputs'/(name+'-live.json')
minimum=json.loads(live.read_text()).get('elapsed_seconds',0) if live.exists() else 0
for attempt in range(5):
    try:
        for event in api.kernels_logs_stream(kernel):
            if time.monotonic()>deadline:raise SystemExit(2)
            for line in event.get('data','').splitlines():
                try:report=json.loads(line)
                except (ValueError,TypeError):continue
                if not isinstance(report,dict) or 'stage' not in report or 'source_sha' not in report:continue
                if report.get('elapsed_seconds',0)<minimum:continue
                minimum=report.get('elapsed_seconds',0);control.save(name+'-live.json',report)
                marker=(report['stage'],report.get('loading_model'))
                if marker!=last:
                    print(control.safe(json.dumps({k:report[k] for k in ['stage','elapsed_seconds','loading_model','error','actual_resolution','faces','source_assets_saved','dino_copy'] if k in report})),flush=True);last=marker
                if report['stage'] in ['editable_candidate_saved','generation_failed','adaptation_preflight_completed']:raise SystemExit(0)
        break
    except requests.RequestException as e:
        print(json.dumps({'log_read_reconnect':attempt+1,'error_type':type(e).__name__,'generation_resubmitted':False}),flush=True);time.sleep(2)

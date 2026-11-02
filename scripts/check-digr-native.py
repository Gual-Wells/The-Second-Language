"""Fixture-only interoperability tests against the real pinned DIGR SDK."""
from pathlib import Path
import sys,json,importlib.util,subprocess
from unittest.mock import patch
import importlib._bootstrap_external,importlib.util

packet,acquisition,native_root=map(Path,sys.argv[1:])
spec=importlib.util.spec_from_file_location('language_digr_host',Path(__file__).with_name('digr-native-session.py'))
host=importlib.util.module_from_spec(spec);spec.loader.exec_module(host)
original_loader=host.load_native_runtime;cases=[];loads=[]
# A valid-timestamp poisoned bytecode file would be selected by the default
# importer despite intact source bytes. The host must use verified source.
fixture_runtime=Path(json.loads(acquisition.read_text())['runtimeDirectory'])
source=fixture_runtime/'runtime/clock_probe.py';stat=source.stat()
poison=Path(importlib.util.cache_from_source(str(source)));poison.parent.mkdir(parents=True,exist_ok=True)
poison.write_bytes(importlib._bootstrap_external._code_to_timestamp_pyc(compile("raise RuntimeError('fixture unverified pyc executed')",str(source),'exec'),int(stat.st_mtime),stat.st_size))
def fetch_bundle(request):
    from runtime.repository_transport import TransportResponse
    assert request.url.endswith('/bundle/EXECUTION_PROTOCOL.json')
    born=list((packet.parent/'runs').glob('*/startup.json'))
    assert born,'full protocol must load only after native genesis'
    loads.append(len(born))
    return TransportResponse(request.url,200,(native_root/'bundle/EXECUTION_PROTOCOL.json').read_bytes(),'direct_https','immutable_sha')
def local_loader(*args):
    authority,startup,transport=original_loader(*args);transport.fetch=fetch_bundle
    return authority,startup,transport
with patch.object(host,'load_native_runtime',local_loader):run,project,protocol_path=host.start_project_session(packet,acquisition)
poison.unlink()
cases.append('valid-timestamp stale bytecode cannot substitute for the verified SDK source')
from runtime.effective_contract import EffectiveContract,SourceContract
from runtime.interval_ledger import WorkState
from runtime.clock_probe import snapshot
from runtime.strategy_store import StrategyState
from runtime.run_recovery import verify_run_workspace
assert type(run).__module__=='runtime.run_session' and run.protocol_load.source_mode=='bundle' and len(run.protocol_load.members)==18
assert run.phase.phase.value=='GENESIS' and Path(protocol_path).is_file() and loads
cases.append('unmodified native SDK creates genesis before full protocol and persists the verified load receipt')
bad=acquisition.with_name('bad-acquisition.json');original_acquisition=json.loads(acquisition.read_text())
for change in ('message','inventory'):
    data=json.loads(json.dumps(original_acquisition))
    if change=='message':data['messageSha256']='0'*64
    else:data['files']=[item for item in data['files'] if item['path']!='runtime/clock_probe.py']
    bad.write_text(json.dumps(data),encoding='utf8')
    try:host.load_native_runtime(bad,(packet.parent/'prompt.txt').read_text(encoding='utf8'))
    except ValueError:pass
    else:raise AssertionError('bad authority/helper binding accepted')
cases.append('message substitution and incomplete SDK inventories fail before native imports or new genesis')
run.resolve_parameters();run.freeze_u0('Fixture interoperability, not chapter semantic approval.')
run.freeze_contract(EffectiveContract(1,0,1,1,SourceContract(1,0,1,1),0,1));run.transition(WorkState.MAIN,snapshot())
run.save_strategy(StrategyState(0,'Fixture native interoperability','Test actual artifact boundaries and lifecycle.'))
relative='work/runs/2026-10-24/teaching/authored/word-W001.json'
first=project.capture_candidate(run,'Fixture candidate one',[relative]);manifest=run.workspace.read_json(first.artifact_refs[0]);snapshot_path=run.workspace.path(manifest['artifacts'][0]['snapshot']);before=snapshot_path.read_bytes()
(project.root/relative).write_bytes(b'candidate-v2')
second=project.capture_candidate(run,'Fixture candidate two',[relative]);assert second.revision==1 and snapshot_path.read_bytes()==before
assert run.events.events==(), 'artifact capture must not auto-award evolution/re-entry'
cases.append('real immutable candidate snapshots survive later author edits without auto-awarding counts')
late=project.root/'work/runs/2026-10-24/vix-publication.json';late.write_text('{"fixture":"new VIX receipt"}',encoding='utf8')
assert project.seal_inputs(run)['immutable_inputs']==4
late_bytes=late.read_bytes();late.write_text('{}',encoding='utf8')
try:project.verify_inputs()
except ValueError:pass
else:raise AssertionError('late-created fixed input was not bound')
late.write_bytes(late_bytes)
substitute=packet.with_name('substitute-project.json');p=json.loads(packet.read_text());p['task']='substitute domain task';substitute.write_text(json.dumps(p),encoding='utf8')
count=len(run.candidates.items)
try:host.SecondLanguageProject(substitute).capture_candidate(run,'Must reject another task',[relative])
except ValueError:pass
else:raise AssertionError('project helper substituted another task')
assert len(run.candidates.items)==count
cases.append('inputs formed during the task are appended and protected; project helpers cannot substitute the task')
evidence=project.capture_evidence(run,'fixture-source','protocol/CONTENT.md','Fixture project source; no semantic certification.')
assert run.evidence.get('fixture-source').locator==evidence['artifact']
run.record_main_evolution('Fixture lifecycle change','Capture and compare actual artifacts','Snapshots remain bound.',evidence_refs=('fixture-source',))
run.open_source('fixture-source','Fixture SDK source','Inspect the known fixture document.')
run.transition(WorkState.SOURCE,snapshot(),active_source_ids=('fixture-source',))
run.revise_source('fixture-source',finding_summary='Fixture evidence location verified.',evidence_refs=('fixture-source',))
run.record_source_evolution('fixture-source','Fixture source binding','Read known fixture bytes','Reference preserved.',evidence_refs=('fixture-source',))
run.record_source_reentry('fixture-source',1,'Fixture independent challenge','Check the snapshot against original bytes','Retained known fixture result.',retained=True,evidence_refs=('fixture-source',))
run.transition(WorkState.MAIN,snapshot())
run.record_main_reentry(0,'Fixture snapshot challenge','Compare the earlier bytes with changed author','Second candidate records the changed artifact.',candidate_after=1,evidence_refs=('fixture-source',))
cases.append('native source activity, evidence-bound evolution and candidate-backed re-entry operate through original methods')
for relative_bad in ['../outside.json','work/../../outside.json','.cache/deployment-secrets.json']:
    try:project.capture_candidate(run,'Must fail',[relative_bad])
    except ValueError:pass
    else:raise AssertionError('unsafe artifact accepted')
assert len(run.candidates.items)==2
original=(project.root/'work/runs/2026-10-24/selection.json').read_bytes()
(project.root/'work/runs/2026-10-24/selection.json').write_bytes(b'{}')
try:project.verify_inputs()
except ValueError:pass
else:raise AssertionError('frozen selection drift accepted')
(project.root/'work/runs/2026-10-24/selection.json').write_bytes(original)
cases.append('frozen selection and project/private-path boundaries reject drift before a new candidate')
run.completion.assess('Fixture interfaces verified; no course quality or production publication claim.')
run.finish_time(snapshot());summary=run.write_run_summary();assert summary['delivery_ready'] and run.delivery_ready()
proof=run.render_proof();assert isinstance(proof,str) and proof
verify_run_workspace(run.workspace.root,run.run_id)
cases.append('native stop, summary, proof and workspace-integrity verification complete the fixture')
def broken_loader(*args):
    authority,startup,transport=original_loader(*args)
    from runtime.repository_transport import TransportResponse
    transport.fetch=lambda request:TransportResponse(request.url,200,b'{}','direct_https','immutable_sha')
    return authority,startup,transport
existing=set((packet.parent/'runs').iterdir())
with patch.object(host,'load_native_runtime',broken_loader):
    try:host.start_project_session(packet,acquisition)
    except Exception:pass
    else:raise AssertionError('invalid execution bundle accepted')
new=set((packet.parent/'runs').iterdir())-existing;assert len(new)==1
from runtime.workspace import RunWorkspace
from runtime.run_lifecycle import RunPhaseStore
failed=new.pop();assert RunPhaseStore.load(RunWorkspace.open_existing(failed,failed.name)).phase.value=='ABORTED'
cases.append('post-genesis bundle failure aborts the actual born run instead of leaving resumable genesis')
with patch.object(host,'load_native_runtime',local_loader):active,_,_=host.start_project_session(packet,acquisition)
before_journal=(active.workspace.root/'time/clock.journal.ndjson').read_bytes()
changed_packet=packet.with_name('changed-packet.json');p=json.loads(packet.read_text());p['task']='different task';changed_packet.write_text(json.dumps(p),encoding='utf8')
changed_acq=acquisition.with_name('changed-acquisition.json');a=json.loads(acquisition.read_text());a['projectPacketSha256']=host.digest(changed_packet.read_bytes());changed_acq.write_text(json.dumps(a),encoding='utf8')
with patch.object(host,'load_native_runtime',local_loader):
    try:host.start_project_session(changed_packet,changed_acq,str(active.workspace.root))
    except ValueError as error:assert 'substitute' in str(error)
    else:raise AssertionError('resume substituted task')
assert (active.workspace.root/'time/clock.journal.ndjson').read_bytes()==before_journal
cases.append('a substituted project packet is rejected before mutating the original resume journal')
script="import sys;from pathlib import Path;sys.path.insert(0,sys.argv[1]);from runtime.run_session import LiveDIGRRun;LiveDIGRRun.resume(Path(sys.argv[2]),sys.argv[3])"
child=subprocess.run([sys.executable,'-X','utf8','-c',script,str(Path(json.loads(acquisition.read_text())['runtimeDirectory'])),str(active.workspace.root),active.run_id],capture_output=True,text=True,encoding='utf8')
if sys.platform=='win32':
    assert child.returncode!=0 and 'cross-session clock continuity' in child.stderr
    cases.append('actual new Windows Python process refuses unproven boot/session continuity')
else:
    assert child.returncode==0
    cases.append('native same-boot cross-process resume supported on this host')
print(json.dumps({'passed':len(cases),'cases':cases,'scope':'fixture interoperability only','externalRequests':0,'modelCalls':0,'publishCalls':0}))

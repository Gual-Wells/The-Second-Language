"""Persistent host for the unmodified, SHA-pinned DIGR SDK plus project bindings.

Use ``python -u -i ... --packet ... --acquisition ...`` in one tool session.
The native model calls ``run`` directly after reading protocol_text_path. This
file does not choose parameters, strategy, sources, evolution counts or stop.
"""
from pathlib import Path
from hashlib import sha256
import argparse,json,sys,subprocess,uuid

def digest(data):return sha256(data).hexdigest()
def d_path(value):
    p=Path(value).resolve()
    if sys.platform=='win32' and p.drive.upper()!='D:':raise ValueError('DIGR/project data must physically reside on D')
    return p
def child_file(root,relative):
    p=(root/relative).resolve()
    if Path(relative).is_absolute() or not p.is_relative_to(root):raise ValueError('artifact outside project')
    return p

class SecondLanguageProject:
    """Domain artifact adapter. No methods emit semantic evolution/re-entry counts."""
    def __init__(self,packet_file):
        self.packet_file=d_path(packet_file)
        self.packet=json.loads(self.packet_file.read_text(encoding='utf8'))
        if self.packet.get('schemaVersion')!=1 or self.packet.get('project')!='second-language':raise ValueError('unknown project packet')
        self.root=d_path(self.packet['projectRoot'])
        self.run=None
    def verify_inputs(self):
        refs=list(self.packet['immutableInputs'])
        authority=self.packet.get('contentAuthority')
        if self.run:
            for name in ('project/binding.json','project/input-bindings.json'):
                if self.run.workspace.path(name).is_file() and self.run.workspace.read_json(name)['packetSha256']!=digest(self.packet_file.read_bytes()):raise ValueError('project helpers cannot substitute the bound task packet')
            if self.run.workspace.path('project/input-bindings.json').is_file():
                binding=self.run.workspace.read_json('project/input-bindings.json');refs+=binding['refs'];authority=binding.get('contentAuthority',authority)
        for item in refs:
            raw=child_file(self.root,item['path']).read_bytes()
            if len(raw)!=item['bytes'] or digest(raw)!=item['sha256']:raise ValueError('frozen input drift: '+item['path'])
        return {'verified':True,'immutable_inputs':len({item['path'] for item in refs}),'content_authority':authority}
    def seal_inputs(self,run,node='node'):
        self.run=run;self.verify_inputs()
        command=[node,str(Path(__file__).resolve().parent/'digr-project.mjs'),'inputs',str(self.packet_file)]
        result=subprocess.run(command,check=True,capture_output=True,text=True,encoding='utf8');current=json.loads(result.stdout)
        existing={item['path']:item for item in self.packet['immutableInputs']}
        relative='project/input-bindings.json'
        if run.workspace.path(relative).is_file():existing.update({item['path']:item for item in run.workspace.read_json(relative)['refs']})
        changed=False
        for item in current['refs']:
            if item['path'] in existing and existing[item['path']]!=item:raise ValueError('new binding cannot replace an existing frozen input')
            if item['path'] not in existing:existing[item['path']]=item;changed=True
        if changed or not run.workspace.path(relative).exists():
            value={'packetSha256':digest(self.packet_file.read_bytes()),'refs':list(existing.values()),'contentAuthority':current['contentAuthority']}
            run.workspace.write_json('project/input-seals/'+digest(json.dumps(value,sort_keys=True).encode())+'.json',value,kind='project-input-seal')
            run.workspace.write_json(relative,value,kind='project-input-bindings')
            run.refresh_brief()
        return self.verify_inputs()
    def _artifact(self,relative):
        if not isinstance(relative,str):raise ValueError('artifact path must be text')
        parts=relative.replace('\\','/').split('/')
        if parts[0] not in ('chapters','work','research','protocol','scripts','AGENTS.md') or any(p in ('.git','.cache','node_modules','__pycache__','.env','.dev.vars') or p.startswith(('.env.','.dev.vars.')) for p in parts):raise ValueError('only explicit project-domain artifacts can be captured')
        if parts[0]=='scripts' and Path(relative).suffix not in ('.mjs','.py','.ps1','.md'):raise ValueError('unsupported project code artifact')
        p=child_file(self.root,relative)
        if not p.is_file() or p.stat().st_size>64*1024*1024:raise ValueError('invalid or oversized project artifact')
        return p,p.read_bytes()
    def capture_candidate(self,run,summary,paths,evidence_refs=()):
        from runtime.candidate_store import CandidateSnapshot
        self.seal_inputs(run)
        if not paths:raise ValueError('candidate must bind real project artifacts')
        revision=len(run.candidates.items);artifacts=[];records=[]
        inputs=[(relative,*self._artifact(relative)) for relative in dict.fromkeys(paths)]
        for index,(relative,p,raw) in enumerate(inputs):
            name=f'project/candidates/r{revision:04d}/{index:03d}-{p.name}'
            target=run.workspace.path(name);target.parent.mkdir(parents=True,exist_ok=True)
            with target.open('xb') as f:f.write(raw)
            run.workspace.index_existing(name,kind='project-candidate-artifact')
            artifacts.append(name);records.append({'project_path':relative,'snapshot':name,'sha256':digest(raw),'bytes':len(raw)})
        manifest=f'project/candidates/r{revision:04d}/manifest.json'
        run.workspace.write_json(manifest,{'schemaVersion':1,'projectPacketSha256':digest(self.packet_file.read_bytes()),'artifacts':records},kind='project-candidate-manifest')
        return run.save_candidate(CandidateSnapshot(revision,summary,tuple([manifest,*artifacts]),tuple(evidence_refs)))
    def capture_evidence(self,run,evidence_id,relative,summary,source_scope=None):
        from runtime.evidence_index import EvidenceRecord
        p,raw=self._artifact(relative);name=f'project/evidence/{digest(raw)}-{p.name}'
        target=run.workspace.path(name);target.parent.mkdir(parents=True,exist_ok=True)
        if target.exists():
            if target.read_bytes()!=raw:raise ValueError('evidence snapshot conflict')
        else:
            with target.open('xb') as f:f.write(raw)
            run.workspace.index_existing(name,kind='project-evidence-artifact')
        run.evidence.add(EvidenceRecord(evidence_id,'project-artifact',name,summary,source_scope))
        run.refresh_brief();return {'evidence_id':evidence_id,'artifact':name,'sha256':digest(raw)}
    def publication_preflight(self,node='node'):
        self.verify_inputs()
        date=self.packet.get('studyDate')
        if not date:raise ValueError('publication preflight needs a chapter date')
        command=[node,str(Path(__file__).resolve().parent/'digr-project.mjs'),'preflight',date,'--root',str(self.root)]
        result=subprocess.run(command,check=True,capture_output=True,text=True,encoding='utf8')
        return json.loads(result.stdout)

def load_native_runtime(acquisition_file,message):
    record=json.loads(d_path(acquisition_file).read_text(encoding='utf8'))
    if record.get('schemaVersion')!=1 or record.get('repository')!='Gual-Wells/Deep-Iteration-GPT-Runtime':raise ValueError('invalid runtime acquisition')
    sha=record['pinnedCommit']
    if len(sha)!=40 or any(c not in '0123456789abcdef' for c in sha) or record['messageSha256']!=digest(message.encode('utf8')):raise ValueError('runtime/message binding mismatch')
    runtime=d_path(record['runtimeDirectory'])
    if runtime.name!=sha:raise ValueError('runtime directory must name immutable SHA')
    recorded={item['path'] for item in record['files']}
    required={'manifest.json','VERSION','runtime/__init__.py','runtime/run_session.py','runtime/repository_transport.py'}
    if not required.issubset(recorded) or {str(p.relative_to(runtime)).replace('\\','/') for p in (runtime/'runtime').rglob('*.py')}!={p for p in recorded if p.startswith('runtime/') and p.endswith('.py')}:raise ValueError('runtime helper inventory mismatch')
    for item in record['files']:
        raw=child_file(runtime,item['path']).read_bytes()
        if digest(raw)!=item['sha256'] or len(raw)!=item['bytes']:raise ValueError('pinned helper drift')
    for name,module in tuple(sys.modules.items()):
        if name=='runtime' or name.startswith('runtime.'):
            if not getattr(module,'__file__',None) or not Path(module.__file__).resolve().is_relative_to(runtime/'runtime'):raise ValueError('another runtime is already imported; use a fresh persistent host')
    # A per-host empty pycache namespace prevents unverified stale bytecode from
    # substituting for the SHA-verified Python sources. All paths remain on D.
    sys.dont_write_bytecode=True
    sys.pycache_prefix=str(d_path(acquisition_file).parent/'host-pycache'/uuid.uuid4().hex)
    sys.path.insert(0,str(runtime))
    from runtime.routing import ref_resolution_from_github_payload,ref_resolution_from_branch_payload,route_receipt_from_ref_resolution,discovery_plan_from_manifest_bytes
    from runtime.protocol_authority import authority_from_route_bytes
    from runtime.repository_transport import RepositoryStartupBundle,RepositoryTransportSession,UrllibDirectFetcher,AcquisitionAttemptReceipt
    ref=ref_resolution_from_github_payload(record['refObservation']);branch=ref_resolution_from_branch_payload(record['branchObservation'])
    if ref.commit_sha!=sha or branch.commit_sha!=sha:raise ValueError('live branch/ref observations disagree')
    manifest=(runtime/'manifest.json').read_bytes();version=(runtime/'VERSION').read_bytes()
    if digest(manifest)!=record['manifestSha256'] or digest(version)!=record['versionSha256']:raise ValueError('manifest/version receipt drift')
    route=route_receipt_from_ref_resolution(ref,manifest,version);authority=authority_from_route_bytes(route,manifest,version)
    if authority.P_run.protocol!='digr-v5.0':raise ValueError('this host bridge has not been validated against that runtime interface')
    plan=discovery_plan_from_manifest_bytes(route,manifest,version)
    receipts=tuple(AcquisitionAttemptReceipt(i+1,'host-transport',r['url'],r['sourceKind'],r['freshness'],r['status'],True,r['sha256'],None,None) for i,r in enumerate(record['requests']))
    startup=RepositoryStartupBundle(ref,route,manifest,version,plan,tuple((p,(runtime/p).read_bytes()) for p in plan.initial_paths),receipts)
    return authority,startup,RepositoryTransportSession(UrllibDirectFetcher())

def start_project_session(packet_file,acquisition_file,resume=None):
    project=SecondLanguageProject(packet_file);message=(project.packet_file.parent/'prompt.txt').read_text(encoding='utf8')
    acquisition=json.loads(d_path(acquisition_file).read_text(encoding='utf8'))
    if acquisition.get('projectPacketSha256')!=digest(project.packet_file.read_bytes()):raise ValueError('project packet/acquisition binding mismatch')
    authority,startup,transport=load_native_runtime(acquisition_file,message)
    from runtime.invocation_surface import classify_surface,InvocationKind
    from runtime.run_session import LiveDIGRRun
    surface=classify_surface(message)
    if surface.kind is not InvocationKind.EXECUTING:raise ValueError('prepared project task was not classified EXECUTING by pinned repository')
    if resume:
        existing=d_path(resume)
        original=json.loads((existing/'authority.json').read_text(encoding='utf8'))
        if original['P_run']['commit_sha']!=authority.P_run.commit_sha:raise ValueError('resume cannot rebind P_run')
        if json.loads((existing/'project/binding.json').read_text(encoding='utf8'))['packetSha256']!=digest(project.packet_file.read_bytes()):raise ValueError('resume cannot substitute another project task')
        run=LiveDIGRRun.resume(existing,existing.name)
    else:
        run=LiveDIGRRun.start(authority,message,workspace_parent=project.packet_file.parent/'runs',run_id='run-'+uuid.uuid4().hex)
        bundle=transport.load_execution_protocol_for_run(run,startup)
        run.workspace.write_json('project/binding.json',{'packet':str(project.packet_file),'packetSha256':digest(project.packet_file.read_bytes()),'acquisition':str(d_path(acquisition_file))},kind='project-binding')
        text='\n\n'.join('PATH '+name+'\n'+raw.decode('utf8') for name,raw in bundle.files)
        protocol=run.workspace.path('host/execution-protocol.md');protocol.parent.mkdir(parents=True,exist_ok=True);protocol.write_text(text,encoding='utf8')
        run.workspace.index_existing('host/execution-protocol.md',kind='executing-protocol-text');run.refresh_brief()
    project.run=run
    return run,project,str(run.workspace.path('host/execution-protocol.md'))

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--packet',required=True);parser.add_argument('--acquisition',required=True);parser.add_argument('--resume')
    args=parser.parse_args()
    run,project,protocol_text_path=start_project_session(args.packet,args.acquisition,args.resume)
    from runtime.clock_probe import snapshot
    print(json.dumps({'run':run.run_id,'phase':run.phase.phase.value,'protocol_text_path':protocol_text_path,'project_packet':str(project.packet_file),'instruction':'Read the pinned protocol before parameter/U0 completion; use native run APIs. Project helpers do not certify semantic quality or publish.'},ensure_ascii=True),flush=True)

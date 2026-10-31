"""Read numeric HF/Kaggle metadata inventories; never download assets or expose provider responses."""
from __future__ import annotations
import argparse, contextlib, importlib.util, json, os, pathlib, subprocess, sys, time
sys.dont_write_bytecode = True
PROJECTS = ('language', 'algorithm', 'schedule', 'ledger')
RESOURCE_IDS = {'hf': 'hf-private-account', 'kaggle': 'kaggle-private-account'}
MAX_INTEGER = 2**53 - 1

class Quiet:
    def write(self, value): return len(value)
    def flush(self): pass

def number(value): return isinstance(value, int) and not isinstance(value, bool) and 0 <= value <= MAX_INTEGER

def failure(provider, observed): return {'resourceId': RESOURCE_IDS[provider], 'revision': observed, 'observedAt': observed, 'verified': False}

def measured(provider, observed, used, attributed, complete):
    if not number(used) or any(value is not None and not number(value) for value in attributed.values()): raise ValueError('Invalid numeric inventory')
    total = sum(value for value in attributed.values() if value is not None)
    if not number(total) or total > used: raise ValueError('Inventory attribution exceeds measured bytes')
    return {'resourceId': RESOURCE_IDS[provider], 'revision': observed, 'observedAt': observed,
            'verified': True, 'measurement': 'inventory', 'complete': complete, 'usedBytes': used,
            'limitBytes': None, 'remainingBytes': None, 'projectAttributedBytes': attributed,
            'otherUsedBytes': used - total if all(value is not None for value in attributed.values()) else None}

def hf_report(rows, configuration, observed):
    owner = configuration['owner']; buckets = configuration['buckets']
    if not isinstance(owner, str) or set(buckets) != set(PROJECTS) or len(set(buckets.values())) != 4: raise ValueError('Invalid HF project map')
    expected = {f'{owner}/{buckets[project]}'.casefold(): project for project in PROJECTS}
    private, seen, attributed = 0, set(), {project: None for project in PROJECTS}
    for row in rows:
        identity = row.get('id'); visibility = row.get('visibility')
        if not isinstance(identity, str) or identity.casefold() in seen or visibility not in ('public', 'private', 'protected'): raise ValueError('Incomplete repository metadata')
        seen.add(identity.casefold())
        if identity.split('/')[0].casefold() != owner.casefold(): raise ValueError('Inventory owner mismatch')
        project = expected.get(identity.casefold())
        if project and (visibility != 'private' or row.get('type') != 'bucket'): raise ValueError('Project bucket private boundary changed')
        if visibility != 'private': continue
        value = row.get('storage')
        if not number(value): raise ValueError('Private repository bytes unavailable')
        private += value
        if not number(private): raise ValueError('Inventory overflow')
        if project: attributed[project] = value
    return measured('hf', observed, private, attributed, True)

def kaggle_report(inventory, observed):
    if inventory.get('provider') != 'kaggle' or not number(inventory.get('privateLatestBytes')): raise ValueError('Kaggle latest private metadata unavailable')
    projects = inventory.get('projects')
    if not isinstance(projects, list) or len(projects) != 4: raise ValueError('Kaggle project metadata incomplete')
    attributed = {project: None for project in PROJECTS}
    seen = set()
    for row in projects:
        project = row.get('project')
        if project not in PROJECTS or project in seen or not isinstance(row.get('present'), bool): raise ValueError('Invalid Kaggle project metadata')
        seen.add(project)
        if row['present']:
            if row.get('private') is not True or not number(row.get('latestBytes')): raise ValueError('Kaggle archive private metadata unavailable')
            attributed[project] = row['latestBytes']
    # total_bytes is the latest version, not authoritative private quota or all retained versions.
    return measured('kaggle', observed, inventory['privateLatestBytes'], attributed, False)

def local_directory(value):
    result = pathlib.Path(value)
    if not result.is_absolute() or os.name == 'nt' and result.drive.upper() != 'D:': raise ValueError('Inventory runtime must use a D-drive absolute path')
    return result

def collect_provider(provider, configuration, observed):
    inventory_config = configuration['providerInventory']; setting = inventory_config[provider]
    directory = local_directory(inventory_config['dataDirectory']); directory.mkdir(parents=True, exist_ok=True)
    sdk = local_directory(setting['sdkDirectory'])
    if not sdk.is_dir(): raise ValueError('Configured SDK is unavailable')
    for name in ('tmp', 'pycache'): (directory / name).mkdir(exist_ok=True)
    os.environ['TMP'] = os.environ['TEMP'] = str(directory / 'tmp')
    sys.path.insert(0, str(sdk))
    if provider == 'hf':
        os.environ['HF_HOME'] = str(directory / 'hf-cache'); os.environ['HF_HUB_DISABLE_TELEMETRY'] = '1'
        os.environ['HF_HUB_DISABLE_PROGRESS_BARS'] = '1'
        import huggingface_hub
        if getattr(huggingface_hub, '__version__', None) != setting.get('sdkVersion', '2.4.0'): raise ValueError('Unexpected official HF SDK version')
        token = pathlib.Path(setting['tokenFile']).read_text(encoding='utf-8-sig').strip()
        if not token: raise ValueError('HF token is unavailable')
        api = huggingface_hub.HfApi(endpoint='https://huggingface.co', token=token)
        who = api.whoami()
        if who.get('name', '').casefold() != setting['owner'].casefold(): raise ValueError('HF account mismatch')
        # The official iterator follows every Link pagination page. No file listing or media download.
        rows = [vars(row) for row in api.list_user_repos()]
        return hf_report(rows, setting, observed)
    source = pathlib.Path(__file__).with_name('series-kaggle.py')
    spec = importlib.util.spec_from_file_location('series_kaggle_inventory_client', source)
    module = importlib.util.module_from_spec(spec); spec.loader.exec_module(module)
    client_setting = {**setting, 'dataDirectory': str(directory / 'kaggle-runtime')}
    client = module.ArchiveClient(client_setting)
    return kaggle_report(client.inventory(), observed)

def run_worker(config_path, provider, observed):
    try:
        configuration = json.loads(pathlib.Path(config_path).read_text(encoding='utf-8-sig'))
        with contextlib.redirect_stdout(Quiet()), contextlib.redirect_stderr(Quiet()):
            report = collect_provider(provider, configuration, observed)
    except BaseException:
        report = failure(provider, observed)
    # The isolated worker emits only whitelisted numerical report fields, never raw SDK errors or bodies.
    print(json.dumps(report, separators=(',', ':')))

def atomic_report(filename, report):
    target = pathlib.Path(filename); parent = local_directory(str(target.resolve().parent)); parent.mkdir(parents=True, exist_ok=True)
    if not target.is_absolute(): target = target.resolve()
    temporary = target.with_name(target.name + '.new'); temporary.write_text(json.dumps(report, indent=2) + '\n', encoding='utf-8'); os.replace(temporary, target)

def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__); parser.add_argument('--config', required=True); parser.add_argument('--output'); parser.add_argument('--worker', choices=tuple(RESOURCE_IDS), help=argparse.SUPPRESS); parser.add_argument('--observed-at', type=int, help=argparse.SUPPRESS)
    args = parser.parse_args(argv); observed = args.observed_at if args.observed_at is not None else int(time.time()*1000)
    if args.worker: run_worker(args.config, args.worker, observed); return 0
    if not args.output: parser.error('--output is required')
    reports = []
    for provider in RESOURCE_IDS:
        try:
            # Isolate official SDK dependencies and their network/client settings per provider.
            command = [sys.executable, str(pathlib.Path(__file__).resolve()), '--config', str(pathlib.Path(args.config).resolve()), '--worker', provider, '--observed-at', str(observed)]
            result = subprocess.run(command, capture_output=True, text=True, timeout=110, check=False, creationflags=subprocess.CREATE_NO_WINDOW if os.name == 'nt' else 0)
            value = json.loads(result.stdout)
            if result.returncode != 0 or value.get('resourceId') != RESOURCE_IDS[provider]: raise ValueError('Invalid isolated report')
            reports.append(value)
        except BaseException: reports.append(failure(provider, observed))
    try: atomic_report(args.output, {'reports': reports})
    except BaseException:
        print('Provider storage metadata could not be saved.', file=sys.stderr); return 1
    print('Provider storage metadata recorded.'); return 0

if __name__ == '__main__': raise SystemExit(main())

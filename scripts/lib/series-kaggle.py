"""Private, immutable second-series cold archives via the official Kaggle SDK.

This tool never reads a production database. Supply an explicit source directory.
Kaggle is a versioned file archive, not a transactional database or an online cache.
"""
from __future__ import annotations
import argparse, contextlib, datetime, gzip, hashlib, io, json, os, pathlib, re, shutil, sqlite3, stat, sys, tarfile, tempfile, time, zipfile

PROJECTS = ('language', 'algorithm', 'schedule', 'ledger')
FORMAT = 'second-series-kaggle-archive-v1'
MAGIC = b'SECOND-SERIES-PRIVATE-ARCHIVE-V1\n'
MAX_PACKAGE = 24 * 1024 * 1024
MAX_MANIFEST = 1024 * 1024
MAX_UNPACKED = 256 * 1024 * 1024
MAX_FILES = 10000
BLOCKED_PARTS = {'.git', '.wrangler', 'node_modules', '.cache', 'private', 'secrets', 'credentials', '__pycache__', '.ssh', '.aws', '.azure', '.kaggle', '.gnupg', '.codex', 'appdata', 'codexdata'}
BLOCKED_NAMES = {'kaggle.json', 'id_rsa', 'id_ed25519', 'api-token.txt', 'token.txt', 'cookies.txt', 'cookies.json'}
CREDENTIAL = re.compile(rb'(?<![A-Za-z0-9])(?:sk-(?:proj-|svcacct-)?[A-Za-z0-9_-]{24,}|KGAT_[A-Za-z0-9_-]{24,}|hf_[A-Za-z0-9]{24,})(?![A-Za-z0-9])')
CREDENTIAL_FIELDS = re.compile(rb'"(?:access[_-]?token|refresh[_-]?token|api[_-]?(?:key|token)|client[_-]?secret|secret[_-]?(?:access[_-]?)?key|private[_-]?key|credentials?|password|auth[_-]?cookie|cookies?)"\s*:|"authorization"\s*:\s*"\s*(?:Bearer|Basic)\s+[^"\s]+', re.I)

def utc(): return datetime.datetime.now(datetime.timezone.utc).isoformat()
def canonical(value): return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode('utf-8')
def digest(data): return hashlib.sha256(data).hexdigest()
def read_json(path): return json.loads(pathlib.Path(path).read_text(encoding='utf-8-sig'))
def atomic_json(path, value):
    path = pathlib.Path(path); path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(path.name + '.new')
    temporary.write_bytes(canonical(value) + b'\n'); os.replace(temporary, path)

def authorize_archive(project, configuration=None):
    if project not in PROJECTS: raise ValueError('Unsupported project')
    configuration = configuration or {}
    configured = configuration.get('policyFile')
    policy_file = pathlib.Path(configured) if configured is not None else pathlib.Path(__file__).resolve().parents[2] / 'protocol' / 'series-storage.json'
    if configured is not None and not policy_file.is_absolute(): raise ValueError('Archive policyFile must be an explicit absolute path')
    policy = read_json(policy_file)
    if policy.get('schemaVersion') != 1 or policy.get('administrator') != 'language' or project not in policy.get('projects', {}): raise ValueError('Archive project policy is invalid')
    resources = [value for value in policy.get('resources', []) if value.get('id') == 'kaggle-private-account']
    routes = policy.get('allocations', {}).get(project, [])
    if len(resources) != 1 or resources[0].get('provider') != 'kaggle' or resources[0].get('state') != 'active' or not isinstance(routes, list) or not any(value.get('resourceId') == 'kaggle-private-account' and value.get('purpose') == 'cold-archive' and value.get('mode') == 'current' for value in routes):
        raise ValueError('New cold archives are disabled by the current series storage policy')
    return policy

@contextlib.contextmanager
def project_lock(root, project):
    folder = pathlib.Path(root) / 'locks'; folder.mkdir(parents=True, exist_ok=True)
    path = folder / (project + '.json'); nonce = os.urandom(16).hex()
    try: descriptor = os.open(path, os.O_CREAT | os.O_EXCL | os.O_WRONLY, 0o600)
    except FileExistsError: raise ValueError('Project archive writer is already running or has an unresolved lock; inspect it before resuming')
    try:
        with os.fdopen(descriptor, 'wb') as output: output.write(canonical({'pid': os.getpid(), 'nonce': nonce, 'startedAt': utc()}))
        yield
    finally:
        if path.exists() and read_json(path).get('nonce') == nonce: path.unlink()

def safe_relative(name):
    if not isinstance(name, str) or not name or '\\' in name or '\x00' in name or ':' in name:
        raise ValueError('Invalid relative archive path')
    value = pathlib.PurePosixPath(name)
    if value.is_absolute() or any(part in ('', '.', '..') for part in name.split('/')):
        raise ValueError('Invalid relative archive path')
    for part in value.parts:
        lower = part.lower()
        if any(ord(character) < 32 for character in part) or part.endswith((' ', '.')) or re.fullmatch(r'(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\..*)?', lower):
            raise ValueError('Invalid platform archive path')
        if lower in BLOCKED_PARTS or lower in BLOCKED_NAMES or lower.startswith(('.env', '.dev.vars')) or lower.endswith(('.pem', '.pfx', '.p12', '.key', '.dpapi', '.credentials', '.credential', '.secret', '-token.txt', '_token.txt')) or re.search(r'(?:^|[-_.])(?:credentials?|secrets?|api[-_]?keys?)(?:[-_.]|$)', lower):
            raise ValueError('Credential, runtime or private path is not eligible for archive')
    return value

def is_link(path):
    info = path.lstat()
    return path.is_symlink() or bool(getattr(info, 'st_file_attributes', 0) & 0x400)

def bounded_file(path, limit):
    if pathlib.Path(path).stat().st_size > limit: raise ValueError('File exceeds the bounded batch limit')
    with pathlib.Path(path).open('rb') as source: data = source.read(limit + 1)
    if len(data) > limit: raise ValueError('File changed beyond the bounded batch limit')
    return data

def guard_material(data, name, budget, depth=0, inspection_directory=None):
    budget[0] -= len(data)
    if budget[0] < 0: raise ValueError('Material inspection exceeds the bounded unpacked batch limit')
    if CREDENTIAL.search(data) or CREDENTIAL_FIELDS.search(data) or re.search(rb'INSERT\s+INTO\s+["`\[]?storage_connection\b', data, re.I):
        raise ValueError('Credential material, including encrypted credential records, is not an ordinary project asset')
    if data.startswith(b'SQLite format 3\x00'):
        if inspection_directory is None: raise ValueError('SQLite inspection requires the explicit archive runtime temporary directory')
        directory = pathlib.Path(inspection_directory)
        if not directory.is_absolute() or os.name == 'nt' and directory.resolve().drive.upper() != 'D:': raise ValueError('SQLite inspection temporary directory must be on D:')
        if any(parent.exists() and is_link(parent) for parent in (directory, *directory.parents)): raise ValueError('SQLite inspection cannot follow temporary-directory links')
        directory.mkdir(parents=True, exist_ok=True)
        descriptor, temporary_name = tempfile.mkstemp(prefix='.series-sqlite-inspect-', suffix='.sqlite', dir=directory)
        temporary_database, connection = pathlib.Path(temporary_name), None
        try:
            with os.fdopen(descriptor, 'wb') as temporary: temporary.write(data)
            connection = sqlite3.connect(temporary_database.as_uri() + '?mode=ro&immutable=1', uri=True)
            connection.execute('PRAGMA query_only=ON'); connection.execute('PRAGMA trusted_schema=OFF')
            def authorize(action, first, second, database, trigger):
                # Inspect table metadata and presence only. Never execute SQL functions,
                # writes, user triggers, extension loading or arbitrary PRAGMAs.
                return sqlite3.SQLITE_OK if action in (sqlite3.SQLITE_SELECT, sqlite3.SQLITE_READ) or action == sqlite3.SQLITE_PRAGMA and first == 'table_info' else sqlite3.SQLITE_DENY
            connection.set_authorizer(authorize)
            for (table,) in connection.execute("SELECT name FROM sqlite_master WHERE type='table'"):
                quoted = '"' + table.replace('"', '""') + '"'
                columns = [row[1] for row in connection.execute('PRAGMA table_info(' + quoted + ')')]
                if table.lower() == 'storage_connection' or any(re.fullmatch(r'(?:credentials?|password|access_?token|refresh_?token|api_?key|client_?secret|private_?key|secret_?access_?key)', column, re.I) for column in columns):
                    if connection.execute('SELECT 1 FROM ' + quoted + ' LIMIT 1').fetchone(): raise ValueError('Credential-bearing database requires the separate protected recovery pipeline')
        finally:
            if connection is not None: connection.close()
            temporary_database.unlink(missing_ok=True)
        return
    if data.startswith(b'\x1f\x8b'):
        if depth >= 3: raise ValueError('Nested archive inspection limit exceeded')
        with gzip.GzipFile(fileobj=io.BytesIO(data)) as archive: expanded = archive.read(min(MAX_UNPACKED, budget[0]) + 1)
        guard_material(expanded, name.removesuffix('.gz'), budget, depth + 1, inspection_directory); return
    zipped = data[len(MAGIC):] if data.startswith(MAGIC) else data
    if zipped.startswith(b'PK\x03\x04') or zipped.startswith(b'PK\x05\x06'):
        if depth >= 3: raise ValueError('Nested archive inspection limit exceeded')
        with zipfile.ZipFile(io.BytesIO(zipped)) as archive:
            if len(archive.infolist()) > MAX_FILES: raise ValueError('Nested archive has too many entries')
            for item in archive.infolist():
                safe_relative(item.filename.rstrip('/'))
                if stat.S_ISLNK(item.external_attr >> 16): raise ValueError('Nested archive links are not allowed')
                if item.is_dir(): continue
                if item.file_size > budget[0]: raise ValueError('Nested archive exceeds inspection budget')
                guard_material(archive.read(item), item.filename, budget, depth + 1, inspection_directory)
        return
    if len(data) > 262 and data[257:262] == b'ustar' or name.lower().endswith('.tar'):
        if depth >= 3: raise ValueError('Nested archive inspection limit exceeded')
        with tarfile.open(fileobj=io.BytesIO(data), mode='r:') as archive:
            for count, item in enumerate(archive):
                if count >= MAX_FILES: raise ValueError('Nested archive has too many entries')
                safe_relative(item.name.rstrip('/'))
                if item.isdir(): continue
                if not item.isfile() or item.size > budget[0]: raise ValueError('Unsupported or oversized nested archive entry')
                guard_material(archive.extractfile(item).read(), item.name, budget, depth + 1, inspection_directory)
        return
    if name.lower().endswith(('.7z', '.rar', '.bz2', '.xz', '.enc')):
        raise ValueError('Opaque encrypted or unsupported archives require a separate protected pipeline')

def build_package(project, source, destination, inspection_directory=None):
    if project not in PROJECTS: raise ValueError('Unsupported project')
    source, destination = pathlib.Path(source), pathlib.Path(destination)
    if not source.is_dir() or is_link(source): raise ValueError('Source must be a real directory')
    for parent in (source, *source.parents):
        if parent.name.lower() in BLOCKED_PARTS - {'.cache', 'node_modules', '__pycache__'}: raise ValueError('Source is under a credential or runtime directory')
        if parent.exists() and is_link(parent): raise ValueError('Source cannot follow parent links or junctions')
    entries, directories, total, inspection_budget = [], [], 0, [MAX_UNPACKED]
    for path in sorted(source.rglob('*'), key=lambda item: item.relative_to(source).as_posix()):
        relative = path.relative_to(source).as_posix(); safe_relative(relative)
        if is_link(path): raise ValueError('Archive cannot follow links or junctions')
        if path.is_dir():
            directories.append(relative); continue
        if not path.is_file(): raise ValueError('Archive only accepts regular files')
        data = bounded_file(path, MAX_UNPACKED - total)
        guard_material(data, relative, inspection_budget, inspection_directory=inspection_directory)
        total += len(data)
        if total > MAX_UNPACKED: raise ValueError('Source exceeds the 256 MiB unpacked batch limit')
        entries.append({'path': relative, 'bytes': len(data), 'sha256': digest(data)})
        if len(entries) > MAX_FILES: raise ValueError('Source contains too many files for one batch')
    if not entries: raise ValueError('Source has no eligible files')
    content = {'format': FORMAT, 'project': project, 'files': entries, 'totalBytes': total, 'fileCount': len(entries)}
    if directories: content['directories'] = directories
    record = digest(canonical(content)); destination.mkdir(parents=True, exist_ok=True)
    package = destination / ('record-' + record + '.bin')
    # A short opaque prefix prevents archive hosts from expanding the standard ZIP.
    # ZIP remains the mature container, with deterministic metadata and no links.
    with package.open('wb') as output:
        output.write(MAGIC)
        with zipfile.ZipFile(output, 'w', zipfile.ZIP_DEFLATED, compresslevel=6) as archive:
            for directory in directories:
                info = zipfile.ZipInfo(directory + '/', date_time=(2000, 1, 1, 0, 0, 0)); info.external_attr = 0o40700 << 16
                archive.writestr(info, b'')
            for entry in entries:
                data = bounded_file(source / pathlib.PurePosixPath(entry['path']), entry['bytes'])
                if len(data) != entry['bytes'] or digest(data) != entry['sha256']: raise ValueError('Source changed during archive construction')
                info = zipfile.ZipInfo(entry['path'], date_time=(2000, 1, 1, 0, 0, 0))
                info.compress_type = zipfile.ZIP_DEFLATED; info.external_attr = 0o100600 << 16
                archive.writestr(info, data)
    if package.stat().st_size > MAX_PACKAGE: raise ValueError('Encoded package exceeds the 24 MiB batch limit')
    manifest = {'format': FORMAT, 'recordId': record, 'project': project, 'content': content,
                'package': {'name': package.name, 'bytes': package.stat().st_size, 'sha256': digest(package.read_bytes())}}
    if len(canonical(manifest)) + 1 > MAX_MANIFEST: raise ValueError('Archive manifest exceeds the 1 MiB RPC-compatible batch limit')
    manifest_file = destination / ('record-' + record + '.manifest.json')
    atomic_json(manifest_file, manifest)
    return manifest, package, manifest_file

def validate_package(manifest, package, project, inspection_directory=None):
    if manifest.get('format') != FORMAT or manifest.get('project') != project: raise ValueError('Archive project or format mismatch')
    content, record = manifest.get('content'), manifest.get('recordId')
    if not isinstance(record, str) or not re.fullmatch('[a-f0-9]{64}', record) or digest(canonical(content)) != record:
        raise ValueError('Archive content manifest digest mismatch')
    if content.get('format') != FORMAT or content.get('project') != project: raise ValueError('Content project mismatch')
    payload = bounded_file(package, MAX_PACKAGE); identity = manifest.get('package', {})
    if len(payload) > MAX_PACKAGE or len(payload) != identity.get('bytes') or digest(payload) != identity.get('sha256') or not payload.startswith(MAGIC):
        raise ValueError('Archive package integrity mismatch')
    if identity.get('name') != 'record-' + record + '.bin': raise ValueError('Archive package name mismatch')
    entries = content.get('files', [])
    if not entries or len(entries) > MAX_FILES or content.get('fileCount') != len(entries): raise ValueError('Invalid archive file count')
    names = [entry.get('path') for entry in entries]
    if len(set(names)) != len(names): raise ValueError('Duplicate archive path')
    for name in names: safe_relative(name)
    directories = content.get('directories', [])
    if not isinstance(directories, list) or len(directories) > MAX_FILES or len(set(directories)) != len(directories): raise ValueError('Invalid directory manifest')
    for directory in directories: safe_relative(directory)
    if set(names) & set(directories): raise ValueError('A path cannot be both file and directory')
    all_paths = names + directories
    if len({name.casefold() for name in all_paths}) != len(all_paths): raise ValueError('Archive paths collide on a case-insensitive filesystem')
    file_paths = {name.casefold() for name in names}
    if any(parent.as_posix().casefold() in file_paths for name in all_paths for parent in pathlib.PurePosixPath(name).parents if parent.as_posix() != '.'):
        raise ValueError('Archive file conflicts with a parent directory')
    total = sum(entry.get('bytes', -1) for entry in entries)
    if total < 0 or total > MAX_UNPACKED or total != content.get('totalBytes'): raise ValueError('Invalid unpacked archive size')
    result, inspection_budget = [], [MAX_UNPACKED]
    with zipfile.ZipFile(io.BytesIO(payload[len(MAGIC):])) as archive:
        if sorted(archive.namelist()) != sorted(names + [directory + '/' for directory in directories]): raise ValueError('Package file tree does not match manifest')
        for directory in directories:
            info = archive.getinfo(directory + '/')
            if not info.is_dir() or info.file_size != 0 or stat.S_ISLNK(info.external_attr >> 16): raise ValueError('Invalid directory entry')
        for entry in entries:
            info = archive.getinfo(entry['path'])
            if info.file_size != entry['bytes'] or stat.S_ISLNK(info.external_attr >> 16): raise ValueError('Invalid package member')
            data = archive.read(info)
            if digest(data) != entry['sha256']: raise ValueError('Unpacked file integrity mismatch')
            guard_material(data, entry['path'], inspection_budget, inspection_directory=inspection_directory)
            result.append((entry['path'], data))
    return result

def restore_package(manifest, package, destination, project, inspection_directory=None):
    files = validate_package(manifest, package, project, inspection_directory=inspection_directory); destination = pathlib.Path(destination)
    if destination.exists(): raise ValueError('Restore destination must not already exist')
    if any(parent.name.lower() in BLOCKED_PARTS - {'.cache', 'node_modules', '__pycache__'} for parent in (destination, *destination.parents)): raise ValueError('Restore destination is under a credential or runtime directory')
    destination.parent.mkdir(parents=True, exist_ok=True)
    if any(is_link(parent) for parent in (destination.parent, *destination.parent.parents) if parent.exists()): raise ValueError('Restore cannot follow parent links')
    temporary = pathlib.Path(tempfile.mkdtemp(prefix='.series-restore-', dir=destination.parent))
    try:
        for directory in manifest['content'].get('directories', []):
            (temporary / pathlib.PurePosixPath(directory)).mkdir(parents=True, exist_ok=True)
        for relative, data in files:
            target = temporary / pathlib.PurePosixPath(relative); target.parent.mkdir(parents=True, exist_ok=True); target.write_bytes(data)
        os.replace(temporary, destination)
    except BaseException:
        shutil.rmtree(temporary, ignore_errors=True); raise
    return {'restored': True, 'recordId': manifest['recordId'], 'fileCount': len(files), 'totalBytes': manifest['content']['totalBytes']}

class ArchiveClient:
    def __init__(self, configuration):
        self.config = configuration; self.root = pathlib.Path(configuration['dataDirectory'])
        if os.name == 'nt' and self.root.drive.upper() != 'D:': raise ValueError('Runtime data must stay on D:')
        self.root.mkdir(parents=True, exist_ok=True)
        sdk = pathlib.Path(configuration['sdkDirectory'])
        if not sdk.is_dir(): raise ValueError('Configured official SDK directory is unavailable')
        sys.path.insert(0, str(sdk))
        for name in ('tmp', 'config', 'pycache'): (self.root / name).mkdir(exist_ok=True)
        os.environ['TEMP'] = os.environ['TMP'] = str(self.root / 'tmp')
        tempfile.tempdir = str(self.root / 'tmp')
        sys.pycache_prefix = str(self.root / 'pycache')
        os.environ['KAGGLE_CONFIG_DIR'] = str(self.root / 'config')
        os.environ['KAGGLE_API_TOKEN'] = pathlib.Path(configuration['tokenFile']).read_text(encoding='utf-8-sig').strip()
        self.secret = os.environ['KAGGLE_API_TOKEN']
        if not self.secret: raise ValueError('Kaggle credential file is empty')
        import requests, urllib.parse
        self.requests = requests
        original_init, original_send = requests.Session.__init__, requests.Session.send
        proxy_google = configuration.get('googleProxyFromEnvironment', False)
        def initialize(session, *args, **kwargs): original_init(session, *args, **kwargs); session.trust_env = False
        def send(session, request, **kwargs):
            kwargs.setdefault('timeout', (15, 60))
            host = urllib.parse.urlsplit(request.url).hostname or ''
            if proxy_google and (host == 'googleapis.com' or host.endswith('.googleapis.com')):
                kwargs['proxies'] = requests.utils.get_environ_proxies(request.url)
            for adapter in session.adapters.values(): adapter.max_retries = requests.adapters.Retry(total=0)
            return original_send(session, request, **kwargs)
        requests.Session.__init__, requests.Session.send = initialize, send
        from importlib.metadata import version
        if tuple(map(int, version('kaggle').split('.')[:3])) < (2, 2, 5) or tuple(map(int, version('certifi').split('.')[:3])) < (2026, 10, 19):
            raise ValueError('Official Kaggle SDK >=2.2.5 and certifi >=2026.10.19 are required')
        with contextlib.redirect_stdout(io.StringIO()), contextlib.redirect_stderr(io.StringIO()):
            from kaggle.api.kaggle_api_extended import KaggleApi
            from kagglesdk.datasets.types.dataset_api_service import ApiGetDatasetRequest
            self.request_class = ApiGetDatasetRequest; self.api = KaggleApi(); self.api.authenticate()
        self.api.with_retry = lambda method, *args, **kwargs: method
        self.api.MAX_UPLOAD_RESUME_ATTEMPTS = 1
        self.owner = self.api.get_config_value('username')
        if self.owner != configuration.get('owner'): raise ValueError('Authenticated owner differs from configured archive owner')

    def reference(self, project):
        if project not in PROJECTS: raise ValueError('Unsupported project')
        return self.owner + '/second-series-' + project + '-archives'

    def dataset(self, project, allow_absent=False):
        request = self.request_class(); request.owner_slug, request.dataset_slug = self.reference(project).split('/')
        try:
            with self.api.build_kaggle_client() as client: result = client.datasets.dataset_api_client.get_dataset(request)
        except self.requests.HTTPError as error:
            if allow_absent and error.response.status_code in (403, 404): return None
            raise
        if not result.is_private or result.ref != self.reference(project): raise ValueError('Archive resource is not the expected private dataset')
        return result

    def download(self, project, version, name, destination):
        safe_relative(name)
        if not isinstance(version, int) or version < 1: raise ValueError('A positive immutable dataset version is required')
        destination = pathlib.Path(destination); destination.mkdir(parents=True, exist_ok=True)
        # The SDK can deliver larger files inside a ZIP. Keep that transport wrapper separate.
        with contextlib.redirect_stdout(io.StringIO()), contextlib.redirect_stderr(io.StringIO()):
            self.api.dataset_download_file(self.reference(project) + '/' + str(version), name, path=str(destination), force=True, quiet=True)
        exact = destination / name
        if exact.is_file(): return exact
        wrapper = destination / (name + '.zip')
        if not wrapper.is_file(): raise ValueError('SDK download did not produce the requested file')
        with zipfile.ZipFile(wrapper) as archive:
            if archive.namelist() != [name] or archive.getinfo(name).file_size > MAX_PACKAGE + 1024 * 1024: raise ValueError('Unexpected download transport wrapper')
            exact.write_bytes(archive.read(name))
        return exact

    def find_record(self, project, dataset, record, work):
        if dataset is None: return None
        versions = sorted({dataset.current_version_number, *(item.version_number for item in dataset.versions)}, reverse=True)
        versions = [version for version in versions if version > 0]
        index_path = self.root / 'indexes' / (project + '.json')
        index = read_json(index_path) if index_path.exists() else {'dataset': self.reference(project), 'versions': {}}
        if index.get('dataset') != self.reference(project) or not isinstance(index.get('versions'), dict): raise ValueError('Archive index identity mismatch')
        # Each immutable version is listed once, rather than rescanning all history on every archive.
        # A lost local index can be reconstructed in bounded read-only groups across invocations.
        unseen = [version for version in versions if str(version) not in index['versions']]
        for version in unseen[:256]:
            response = self.api.dataset_list_files(self.reference(project) + '/' + str(version), page_size=200)
            if response.error_message or response.next_page_token: raise ValueError('Dataset version file listing is incomplete')
            index['versions'][str(version)] = [item.name for item in response.files]
            atomic_json(index_path, index)
        if len(unseen) > 256: raise ValueError('A bounded read-only archive index group was saved; rerun to continue indexing before any upload')
        manifest_name = 'record-' + record + '.manifest.json'
        for version in versions:
            if manifest_name not in index['versions'].get(str(version), []): continue
            target = work / ('existing-v' + str(version))
            manifest = read_json(self.download(project, version, manifest_name, target))
            if manifest.get('recordId') != record or manifest.get('project') != project: raise ValueError('Existing record identity mismatch')
            return version, manifest
        return None

    def verify(self, project, receipt):
        if receipt.get('provider') != 'kaggle' or receipt.get('project') != project or receipt.get('dataset') != self.reference(project): raise ValueError('Receipt does not belong to this project resource')
        version, record = receipt.get('version'), receipt.get('recordId')
        if not isinstance(record, str) or not re.fullmatch('[a-f0-9]{64}', record): raise ValueError('Invalid archive record identity')
        self.dataset(project)
        folder = self.root / 'readbacks' / project / record / ('v' + str(version))
        manifest = read_json(self.download(project, version, 'record-' + record + '.manifest.json', folder))
        package = self.download(project, version, 'record-' + record + '.bin', folder)
        files = validate_package(manifest, package, project, inspection_directory=self.root / 'tmp')
        if manifest['recordId'] != record or receipt.get('packageSHA256') != manifest['package']['sha256']: raise ValueError('Receipt integrity binding mismatch')
        return manifest, package, {'verified': True, 'private': True, 'project': project, 'dataset': self.reference(project), 'version': version, 'recordId': record, 'fileCount': len(files), 'totalBytes': manifest['content']['totalBytes'], 'packageBytes': manifest['package']['bytes'], 'checkedAt': utc()}

    def archive(self, project, source):
        authorize_archive(project, getattr(self, 'config', None))
        with project_lock(self.root, project): return self._archive(project, source)

    def _archive(self, project, source):
        staging = pathlib.Path(tempfile.mkdtemp(prefix='stage-', dir=self.root / 'tmp'))
        manifest, package, manifest_file = build_package(project, source, staging, inspection_directory=self.root / 'tmp')
        validate_package(manifest, package, project, inspection_directory=self.root / 'tmp')
        record = manifest['recordId']; intent_path = self.root / 'intents' / project / (record + '.json')
        dataset = self.dataset(project, allow_absent=True); existing = self.find_record(project, dataset, record, staging)
        reused = existing is not None
        if existing: version, remote_manifest = existing
        else:
            if intent_path.exists(): raise ValueError('Previous publication outcome is unresolved; inspect the retained intent, do not resend automatically')
            atomic_json(intent_path, {'status': 'sending', 'project': project, 'dataset': self.reference(project), 'recordId': record, 'at': utc()})
            metadata = {'id': self.reference(project), 'title': 'Second Series ' + project.title() + ' Archives', 'licenses': [{'name': 'other'}], 'description': 'Private project cold archives. Original data rights remain unchanged; not a public dataset or a public licence grant. Each version holds one independent content-addressed archive and manifest; restore by fixed version.'}
            atomic_json(staging / 'dataset-metadata.json', metadata)
            with contextlib.redirect_stdout(io.StringIO()), contextlib.redirect_stderr(io.StringIO()):
                result = self.api.dataset_create_new(str(staging), public=False, quiet=True, convert_to_csv=False) if dataset is None else self.api.dataset_create_version(str(staging), 'Immutable record ' + record, quiet=True, convert_to_csv=False, delete_old_versions=False)
            if result.error or str(result.status).lower() not in ('ok', 'success'): raise ValueError('Kaggle archive publication was not accepted')
            # Dataset preprocessing is asynchronous. Retain the intent if not ready; never reupload.
            names = []
            for delay in (0, 3, 6, 12, 20):
                if delay: time.sleep(delay)
                dataset = self.dataset(project); version = dataset.current_version_number
                if version < 1: continue
                response = self.api.dataset_list_files(self.reference(project) + '/' + str(version), page_size=200)
                names = sorted(item.name for item in response.files)
                if names == sorted((package.name, manifest_file.name)): break
            if names != sorted((package.name, manifest_file.name)): raise ValueError('Kaggle version is not yet ready or changed the expected opaque file tree; retain intent and retry read-only verification later')
            remote_manifest = manifest
        receipt = {'provider': 'kaggle', 'format': FORMAT, 'project': project, 'dataset': self.reference(project), 'version': version, 'recordId': record, 'packageSHA256': remote_manifest['package']['sha256'], 'packageBytes': remote_manifest['package']['bytes'], 'private': True, 'reused': reused, 'latestTree': 'One independent package and manifest; old records remain available only through fixed historical versions', 'at': utc()}
        _, _, verification = self.verify(project, receipt)
        receipt['verification'] = verification
        index_path = self.root / 'indexes' / (project + '.json')
        index = read_json(index_path) if index_path.exists() else {'dataset': self.reference(project), 'versions': {}}
        index['versions'][str(version)] = [package.name, manifest_file.name]
        atomic_json(index_path, index)
        atomic_json(self.root / 'receipts' / project / (record + '.json'), receipt)
        atomic_json(intent_path, {'status': 'verified', 'receipt': receipt})
        shutil.rmtree(staging)
        return receipt

    def inventory(self):
        datasets, token, pages = [], None, 0
        while True:
            response = self.api.dataset_list_with_response(mine=True, page=None, page_size=200, page_token=token)
            datasets.extend(item for item in response.datasets if item.ref.split('/')[0] == self.owner)
            token = getattr(response, 'next_page_token', None); pages += 1
            if not token: break
            if pages >= 10: raise ValueError('Inventory exceeded ten pages')
        return {'provider': 'kaggle', 'checkedAt': utc(), 'measurement': 'Latest-version owned-private inventory; not an authoritative storage quota reading', 'privateLatestBytes': sum(item.total_bytes for item in datasets if item.is_private), 'documentedPrivateCapacityGB': 200, 'resourceCount': len(datasets), 'projects': [{'project': project, 'dataset': self.reference(project), 'present': any(item.ref == self.reference(project) for item in datasets), 'private': next((item.is_private for item in datasets if item.ref == self.reference(project)), None), 'latestBytes': next((item.total_bytes for item in datasets if item.ref == self.reference(project)), None)} for project in PROJECTS]}

def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__); parser.add_argument('--config', required=True)
    sub = parser.add_subparsers(dest='command', required=True)
    sub.add_parser('inventory')
    archive = sub.add_parser('archive'); archive.add_argument('--project', choices=PROJECTS, required=True); archive.add_argument('--source', required=True)
    for command in ('verify', 'restore'):
        part = sub.add_parser(command); part.add_argument('--project', choices=PROJECTS, required=True); part.add_argument('--receipt', required=True)
        if command == 'restore': part.add_argument('--destination', required=True)
    args = parser.parse_args(argv); client = None
    try:
        client = ArchiveClient(read_json(args.config))
        if args.command == 'inventory': result = client.inventory()
        elif args.command == 'archive': result = client.archive(args.project, args.source)
        else:
            manifest, package, result = client.verify(args.project, read_json(args.receipt))
            if args.command == 'restore': result.update(restore_package(manifest, package, args.destination, args.project, inspection_directory=client.root / 'tmp'))
        print(json.dumps(result, ensure_ascii=False)); return 0
    except Exception as error:
        message = str(error)
        if client: message = message.replace(client.secret, '[REDACTED]')
        message = re.sub(r'https?://\S+', '[URL REDACTED]', message)
        print(json.dumps({'ok': False, 'errorType': type(error).__name__, 'message': message}, ensure_ascii=False)); return 1

if __name__ == '__main__': raise SystemExit(main())

"""One bounded, authenticated generation plus immediate durable GLB export.

No purchase, alternate account, automatic generation retries, or production publishing.
All assets and logs are physically stored on D:. The daemon is task-local and exits.
"""
import argparse
import base64
import dataclasses
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import struct
import subprocess
import sys
import time
from datetime import datetime, timezone
from urllib.request import urlopen

ROOT = Path('D:/CodexStorage/workspaces/hostile-dragon-coin')
RUN = ROOT / 'working/resume-2026-10-11'
RUN.mkdir(parents=True, exist_ok=True)
os.environ['TEMP'] = os.environ['TMP'] = 'D:/CodexStorage/tmp/dragon-coin'
os.environ['HF_HOME'] = 'D:/CodexStorage/tmp/dragon-coin/hf'
os.environ['XDG_CACHE_HOME'] = 'D:/CodexStorage/tmp/dragon-coin/cache'
sys.path.insert(0, 'D:/CodexStorage/tools/dragon-python')
from gradio_client import Client, handle_file
from huggingface_hub import HfApi

TOKEN = (ROOT / 'hf-token.txt').read_text().strip()
API = HfApi(token=TOKEN)
INPUT = ROOT / 'working/trellis2/994f98db7bdf194fa4dabfbe6a3b1b1ae2e958ae31d7eb771473bd8e32d7d606/image.png'
PARAMS = dict(seed=38017, resolution='1536', ss_sampling_steps=12,
              shape_slat_sampling_steps=12, tex_slat_sampling_steps=12)
MINIMUM_START_QUOTA = 365  # observed generation ~122 quota seconds + xlarge export reserve 240
EXPORT_ADMISSION_QUOTA = 240


def now():
    return datetime.now(timezone.utc).isoformat()


def record(stage, **data):
    state = {'updated_at': now(), 'stage': stage, **data}
    tmp = RUN / 'status.tmp'
    tmp.write_text(json.dumps(state, ensure_ascii=False, default=str, indent=2), encoding='utf-8')
    tmp.replace(RUN / 'status.json')
    print(json.dumps(state, ensure_ascii=False, default=str), flush=True)


def quota():
    result = dataclasses.asdict(API.get_zero_gpu_quota())
    (RUN / 'quota.json').write_text(json.dumps(result, default=str, indent=2), encoding='utf-8')
    return result


def source_pin():
    info = API.space_info('microsoft/TRELLIS.2')
    sha = info.sha
    with urlopen(f'https://huggingface.co/spaces/microsoft/TRELLIS.2/raw/{sha}/app.py', timeout=45) as response:
        source = response.read()
    (RUN / 'provider-app.py').write_bytes(source)
    text = source.decode()
    if 'def extract_glb(' not in text or 'def image_to_3d(' not in text:
        raise RuntimeError('Provider API changed; manual review required')
    return sha


def check_glb(path):
    with path.open('rb') as stream:
        magic, version, length = struct.unpack('<4sII', stream.read(12))
        if magic != b'glTF' or version != 2 or length != path.stat().st_size:
            raise RuntimeError('Invalid or incomplete GLB')
        size, chunk_type = struct.unpack('<II', stream.read(8))
        if chunk_type != 0x4E4F534A:
            raise RuntimeError('GLB JSON chunk missing')
        doc = json.loads(stream.read(size))
    if not doc.get('meshes') or not doc.get('buffers'):
        raise RuntimeError('GLB contains no mesh/buffer')
    if any(b.get('uri') for b in doc.get('buffers', [])):
        raise RuntimeError('Export requires external buffer')
    if any(im.get('uri') and not im['uri'].startswith('data:') for im in doc.get('images', [])):
        raise RuntimeError('Export requires external image')
    return {'bytes': length, 'sha256': hashlib.sha256(path.read_bytes()).hexdigest(),
            'meshes': len(doc['meshes']), 'materials': len(doc.get('materials', [])),
            'images': len(doc.get('images', [])), 'extensions': doc.get('extensionsUsed', [])}


def wait_job(job, stage):
    deadline = time.monotonic() + 1800
    previous = None
    while not job.done():
        status = job.status()
        current = (str(status.code), status.rank)
        if current != previous:
            record(stage, code=str(status.code), rank=status.rank, eta=status.eta)
            previous = current
        if time.monotonic() > deadline:
            # Do not start another billed or GPU operation with an unknown result.
            job.cancel()
            raise TimeoutError(f'{stage}: outcome unknown; no automatic retry')
        time.sleep(10)
    return job.result()


def acquire_lock():
    path = RUN / 'process.lock'
    try:
        descriptor = os.open(path, os.O_CREAT | os.O_EXCL | os.O_WRONLY)
    except FileExistsError:
        raise RuntimeError('A resume process may already exist; review process.lock before restarting')
    with os.fdopen(descriptor, 'w') as output:
        output.write(str(os.getpid()))
    return path


def run(check_only=False):
    if not INPUT.is_file():
        raise RuntimeError('Previously verified preprocessed input is missing')
    if shutil.disk_usage('D:/').free < 2 * 1024 ** 3:
        raise RuntimeError('D: has insufficient reserve; C: fallback forbidden')
    sha = source_pin()
    q = quota()
    if check_only:
        record('preflight_ok' if q['remaining'] >= MINIMUM_START_QUOTA else 'two_call_budget_insufficient',
               provider_sha=sha, params=PARAMS, quota=q,
               minimum_reserve_seconds=MINIMUM_START_QUOTA,
               alternative='working/resume-combined.py',
               input_sha256=hashlib.sha256(INPUT.read_bytes()).hexdigest())
        return
    if (RUN / 'candidate.glb').exists():
        record('already_exported', asset=check_glb(RUN / 'candidate.glb'))
        return
    if q['base'] < MINIMUM_START_QUOTA:
        raise RuntimeError('Known 1536 two-call export trap: daily base cannot cover observed generation plus export reservation; use reviewed combined runner')
    lock = acquire_lock()
    try:
        # Both endpoints declare 120 seconds; xlarge admission reserves 240.
        # The old preprocessed image avoids another remote background-removal job.
        end = time.monotonic() + 3 * 3600
        while q['remaining'] < MINIMUM_START_QUOTA:
            reset = q['resets_at']
            if isinstance(reset, str):
                reset = datetime.fromisoformat(reset)
            record('waiting_for_daily_quota', quota=q, resume_after=str(reset), pid=os.getpid())
            if time.monotonic() > end:
                raise RuntimeError('Quota did not refresh within bounded three-hour window')
            # One quiet sleep to the known reset, then a live read; no busy polling.
            pause = max(20, min((reset - datetime.now(timezone.utc)).total_seconds() + 20, end-time.monotonic()))
            time.sleep(pause)
            q = quota()
        client = Client('https://microsoft-trellis-2.hf.space', token=TOKEN,
                        download_files=str(RUN / 'download'),
                        httpx_kwargs={'timeout': 240}, verbose=False, analytics_enabled=False)
        api_info = client.view_api(return_format='dict', print_info=False)
        endpoints = api_info.get('named_endpoints', {})
        if not {'/start_session', '/image_to_3d', '/extract_glb'} <= endpoints.keys():
            raise RuntimeError('Provider endpoints changed')
        (RUN / 'api.json').write_text(json.dumps(api_info, default=str, indent=2), encoding='utf-8')
        # Keep this client/session alive through generation and extraction.
        (RUN / 'session-private.json').write_text(json.dumps({'session_hash': client.session_hash,
            'note': 'Diagnostic only; this is not a durable latent checkpoint.'}), encoding='utf-8')
        client.predict(api_name='/start_session')
        before = quota()
        record('generation_submitted', params=PARAMS, quota_before=before)
        result = wait_job(client.submit(image=handle_file(str(INPUT)), **PARAMS, api_name='/image_to_3d'), 'generating')
        html = result if isinstance(result, str) else next(x for x in result if isinstance(x, str) and '<img' in x)
        (RUN / 'preview.html').write_text(html, encoding='utf-8')
        renders = RUN / 'server-renders'
        renders.mkdir(exist_ok=True)
        for name, blob in re.findall(r'id="(view-m\d-s\d)"[\s\S]*?src="data:image/jpeg;base64,([^"]+)"', html):
            (renders / f'{name}.jpg').write_bytes(base64.b64decode(blob))
        after_gen = quota()
        record('generated_exporting', quota_after_generation=after_gen, saved_renders=len(list(renders.glob('*.jpg'))))
        if after_gen['remaining'] < EXPORT_ADMISSION_QUOTA:
            raise RuntimeError('Insufficient export admission reserve; model not durably exported')
        result = wait_job(client.submit(decimation_target=500000, texture_size=4096, api_name='/extract_glb'), 'exporting')
        paths = []
        for entry in result if isinstance(result, (tuple, list)) else [result]:
            if isinstance(entry, str):
                paths.append(Path(entry))
            elif isinstance(entry, dict):
                candidate = entry.get('path') or entry.get('value')
                if isinstance(candidate, str):
                    paths.append(Path(candidate))
        exported = next((p for p in paths if p.suffix.lower() == '.glb' and p.is_file()), None)
        if not exported:
            raise RuntimeError('Export did not return a downloaded GLB')
        candidate = RUN / 'candidate.glb'
        shutil.copy2(exported, candidate)
        report = check_glb(candidate)
        after = quota()
        provenance = {'created_at': now(), 'provider': 'microsoft/TRELLIS.2', 'provider_sha': sha,
                      'input': str(INPUT), 'input_sha256': hashlib.sha256(INPUT.read_bytes()).hexdigest(),
                      'parameters': PARAMS, 'export': {'decimation_target': 500000, 'texture_size': 4096},
                      'asset': report, 'quota_before': before, 'quota_after': after,
                      'stage': 'editable_candidate_exported_not_artistically_accepted',
                      'known_risks': ['Single front input may duplicate the dragon on the reverse',
                                     'Eye expression and claws still require inspection and correction']}
        (RUN / 'provenance.json').write_text(json.dumps(provenance, default=str, indent=2), encoding='utf-8')
        record('editable_model_saved', asset=report, quota_after=after)
        # Inspect/import and render genuine views locally. Never publish an unreviewed candidate.
        with (RUN / 'blender.log').open('w', encoding='utf-8') as log:
            subprocess.run(['D:/CodexStorage/tools/blender-4.5.3-windows-x64/blender.exe', '-b',
                            '-t', '2', '--python', str(ROOT/'working/inspect-trellis.py'), '--', str(candidate)],
                           stdout=log, stderr=subprocess.STDOUT, timeout=1800, check=True,
                           creationflags=subprocess.CREATE_NO_WINDOW)
        record('ready_for_art_review', asset=report, review_folder=str(RUN/'review'))
    finally:
        lock.unlink(missing_ok=True)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--check-only', action='store_true')
    args = parser.parse_args()
    try:
        run(args.check_only)
    except Exception as exc:
        # Redact the credential even if an upstream library includes it in its error.
        record('stopped_needs_review', error=f'{type(exc).__name__}: {str(exc).replace(TOKEN, "[redacted]")[:1800]}')
        raise SystemExit(1)

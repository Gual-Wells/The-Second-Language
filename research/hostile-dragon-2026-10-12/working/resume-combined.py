"""One authenticated TRELLIS.2 generation + export, with no subscription or retries.

The community endpoint uses the same Microsoft weights. All task files live on D:.
This is a candidate acquisition, not an artistic acceptance or production release.
"""
import argparse
import dataclasses
from datetime import datetime, timezone
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import time
from urllib.request import urlopen

ROOT = Path('D:/CodexStorage/workspaces/hostile-dragon-coin')
RUN = ROOT / 'working/combined-next-reset'
RUN.mkdir(exist_ok=True)
for key in ('TEMP', 'TMP'):
    os.environ[key] = 'D:/CodexStorage/tmp/dragon-coin'
os.environ['HF_HOME'] = 'D:/CodexStorage/tmp/dragon-coin/hf'
os.environ['XDG_CACHE_HOME'] = 'D:/CodexStorage/tmp/dragon-coin/cache'
sys.dont_write_bytecode = True
sys.path.insert(0, 'D:/CodexStorage/tools/dragon-python')
from gradio_client import Client, handle_file
from huggingface_hub import HfApi
from resume_trellis_helpers import check_glb

TOKEN = (ROOT / 'hf-token.txt').read_text().strip()
API = HfApi(token=TOKEN)
SPACE = 'prithivMLmods/TRELLIS.2-Text-to-3D'
PIN = '1838678c08b59708c8f645350b4bbd748b0b60fb'
INPUT = ROOT / 'working/trellis2/994f98db7bdf194fa4dabfbe6a3b1b1ae2e958ae31d7eb771473bd8e32d7d606/image.png'
# One 120-second xlarge call reserves 240 quota seconds. No second GPU gate.
RESERVE = 240
PARAMS = dict(seed=38017, resolution='1536', decimation_target=500000,
              texture_size=4096, ss_guidance_strength=7.5,
              ss_guidance_rescale=0.7, ss_sampling_steps=12, ss_rescale_t=5.0,
              shape_guidance=7.5, shape_rescale=0.5, shape_steps=12,
              shape_rescale_t=3.0, tex_guidance=1.0, tex_rescale=0.0,
              tex_steps=12, tex_rescale_t=3.0)

def record(stage, **data):
    state = dict(updated_at=datetime.now(timezone.utc).isoformat(), stage=stage, **data)
    temp = RUN / 'status.tmp'
    temp.write_text(json.dumps(state, indent=2, default=str), encoding='utf-8')
    temp.replace(RUN / 'status.json')
    print(json.dumps(state, default=str), flush=True)

def quota():
    q = dataclasses.asdict(API.get_zero_gpu_quota())
    (RUN / 'quota.json').write_text(json.dumps(q, indent=2, default=str), encoding='utf-8')
    return q

def provider_check():
    info = API.space_info(SPACE)
    if info.sha != PIN:
        raise RuntimeError('Provider source changed; review required before generation')
    runtime = API.get_space_runtime(SPACE)
    if str(runtime.stage) != 'RUNNING':
        raise RuntimeError(f'Provider is not running: {runtime.stage}')
    with urlopen(f'https://huggingface.co/spaces/{SPACE}/raw/{PIN}/app.py', timeout=45) as response:
        source = response.read()
    (RUN / 'provider-app.py').write_bytes(source)
    if b'@spaces.GPU(size="xlarge", duration=120)\ndef generate_3d(' not in source:
        raise RuntimeError('Combined GPU reservation contract changed')
    if b"from_pretrained('microsoft/TRELLIS.2-4B')" not in source:
        raise RuntimeError('Expected Microsoft model weights are missing')

def run(check_only=False, wait_reset=False):
    provider_check()
    if not INPUT.is_file() or shutil.disk_usage('D:/').free < 2 * 1024**3:
        raise RuntimeError('Missing input or insufficient D: space; no C: fallback')
    if (RUN / 'candidate.glb').is_file():
        record('already_exported', asset=check_glb(RUN / 'candidate.glb'))
        return
    q = quota()
    if check_only:
        record('configured_waiting_for_quota' if q['remaining'] < RESERVE else 'preflight_ready',
               quota=q, provider=SPACE, provider_sha=PIN, params=PARAMS,
               required_quota_seconds=RESERVE, generation_submitted=False)
        return
    lock = RUN / 'process.lock'
    with os.fdopen(os.open(lock, os.O_CREAT | os.O_EXCL | os.O_WRONLY), 'w') as out:
        out.write(str(os.getpid()))
    try:
        if q['remaining'] < RESERVE:
            if not wait_reset or not q['resets_at']:
                raise RuntimeError('Insufficient live quota; no GPU operation submitted')
            reset = q['resets_at']
            if isinstance(reset, str):
                reset = datetime.fromisoformat(reset)
            pause = (reset - datetime.now(timezone.utc)).total_seconds() + 30
            if pause < 0 or pause > 22 * 3600:
                raise RuntimeError('Reset is outside bounded continuation window')
            record('waiting_for_known_reset', quota=q, resume_after=str(reset), pid=os.getpid())
            deadline = time.monotonic() + pause
            while time.monotonic() < deadline:
                if (RUN / 'STOP').exists():
                    record('cancelled_before_generation')
                    return
                time.sleep(min(30, deadline-time.monotonic()))
            provider_check()
            q = quota()
            if q['remaining'] < RESERVE:
                raise RuntimeError('Quota unavailable after one reset; no further waiting or retry')
        client = Client(SPACE, token=TOKEN, download_files=str(RUN/'download'),
                        httpx_kwargs={'timeout':240}, verbose=False, analytics_enabled=False)
        info = client.view_api(return_format='dict', print_info=False)
        endpoints = info.get('named_endpoints', {})
        names = {p['parameter_name'] for p in endpoints.get('/generate_3d', {}).get('parameters', [])}
        if names != {'image', *PARAMS}:
            raise RuntimeError('API parameter contract changed')
        (RUN/'api.json').write_text(json.dumps(info, indent=2), encoding='utf-8')
        client.predict(api_name='/start_session')
        q = quota()
        if q['remaining'] < RESERVE:
            raise RuntimeError('Quota changed before submission; GPU operation not submitted')
        record('combined_generation_export_submitted', quota_before=q, params=PARAMS)
        job = client.submit(image=handle_file(str(INPUT)), **PARAMS, api_name='/generate_3d')
        end = time.monotonic() + 1800
        last = None
        while not job.done():
            status = job.status()
            marker = (str(status.code), status.rank)
            if marker != last:
                record('generating_and_exporting', code=str(status.code), rank=status.rank)
                last = marker
            if time.monotonic() > end:
                job.cancel()
                raise TimeoutError('Outcome unknown; no automatic repeat')
            time.sleep(10)
        result = job.result()
        paths = []
        for item in result if isinstance(result, (list, tuple)) else [result]:
            value = item if isinstance(item, str) else item.get('path', '') if isinstance(item, dict) else ''
            if value:
                paths.append(Path(value))
        exported = next((p for p in paths if p.suffix.lower()=='.glb' and p.is_file()), None)
        if exported is None:
            raise RuntimeError('Provider did not return a downloaded GLB; no regeneration')
        candidate = RUN/'candidate.glb'
        shutil.copy2(exported, candidate)
        report = check_glb(candidate)
        provenance = dict(provider=SPACE, provider_sha=PIN, parameters=PARAMS,
                          input_sha256=hashlib.sha256(INPUT.read_bytes()).hexdigest(),
                          asset=report, quota_before=q, quota_after=quota(),
                          status='editable_candidate_not_artistically_accepted',
                          processing_notes=['Community code simplifies intermediate mesh to 1M faces',
                                            'Provider may fall back to remesh=False; actual fallback unknown',
                                            'Separate generation; not the source of previous preview images'])
        (RUN/'provenance.json').write_text(json.dumps(provenance, indent=2, default=str), encoding='utf-8')
        record('editable_model_saved', asset=report)
        with (RUN/'blender.log').open('w', encoding='utf-8') as log:
            subprocess.run(['D:/CodexStorage/tools/blender-4.5.3-windows-x64/blender.exe',
                            '-b','-t','2','--python',str(ROOT/'working/inspect-trellis.py'),
                            '--',str(candidate),str(RUN)], stdout=log, stderr=subprocess.STDOUT,
                           timeout=1800, check=True, creationflags=subprocess.CREATE_NO_WINDOW)
        record('ready_for_art_review', asset=report, review_folder=str(RUN/'review'))
    finally:
        lock.unlink(missing_ok=True)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--check-only', action='store_true')
    parser.add_argument('--wait-reset', action='store_true')
    args = parser.parse_args()
    try:
        run(args.check_only, args.wait_reset)
    except Exception as exc:
        record('stopped_needs_review', error=f'{type(exc).__name__}: {str(exc).replace(TOKEN,"[redacted]")[:1200]}')
        raise SystemExit(1)

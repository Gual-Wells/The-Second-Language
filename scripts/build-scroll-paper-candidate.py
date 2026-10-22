"""Prepare two Adobe performances for the interactive scroll, not a source library."""
import hashlib, json, os, subprocess, wave
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / '.cache/paper-source-research-2026-10-22/adobe/extracted/Foley'
OUT = ROOT / 'web/labs/scroll-foley-study/audio'
OUT.mkdir(parents=True, exist_ok=True)
FFMPEG = Path(os.environ.get('FFMPEG', 'D:/CodexStorage/workspaces/second-language-maintenance/.cache/tools/ffmpeg.exe'))
TARGET_SECONDS = 4.5
entries = [
    ('Foley Paper Unroll 01.wav', 'paper-unroll-v5.wav', 'unroll', '03fdbfb7e53829dfd09aef714afbaaee3af908670a0f5da64cb1360404ad4d13'),
    ('Foley Paper Roll Up Fast 01.wav', 'paper-rollup-v5.wav', 'rollup', '1e4d6fe46396cd6f313148b09b6404a597ff745fef44701e054e853cd9ee01a8'),
]
result = []
for original, name, action, expected in entries:
    source = SOURCE / original
    assert hashlib.sha256(source.read_bytes()).hexdigest() == expected
    with wave.open(str(source)) as w:
        assert (w.getnchannels(), w.getframerate(), w.getsampwidth()) == (2, 48000, 2)
        original_duration = w.getnframes() / w.getframerate()
    tempo = original_duration / TARGET_SECONDS
    filters = f'rubberband=tempo={tempo:.12f}:pitch=1:transients=smooth:detector=soft:channels=together'
    subprocess.run([str(FFMPEG), '-hide_banner', '-loglevel', 'error', '-y', '-i', str(source),
                    '-map_metadata', '-1', '-af', filters, '-c:a', 'pcm_s16le', '-ar', '48000', str(OUT / name)],
                   check=True, creationflags=getattr(subprocess, 'CREATE_NO_WINDOW', 0))
    with wave.open(str(OUT / name)) as w:
        samples = np.frombuffer(w.readframes(w.getnframes()), dtype='<i2').reshape(-1, 2).astype(np.float64)
    # Offline pitch-preserving stretch provides room for the complete paper motion.
    # No silence padding, copied loops, gain normalization or runtime pitch change.
    fade = min(480, len(samples) // 2)
    samples[:fade] *= np.linspace(0, 1, fade)[:, None]
    samples[-fade:] *= np.linspace(1, 0, fade)[:, None]
    with wave.open(str(OUT / name), 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(48000)
        w.writeframes(np.rint(samples).astype('<i2').tobytes())
    data = (OUT / name).read_bytes()
    result.append(dict(action=action, originalName=original, sourceSHA256=expected,
                       file='audio/' + name, sha256=hashlib.sha256(data).hexdigest(), bytes=len(data),
                       frames=len(samples), duration=len(samples)/48000,
                       originalDuration=original_duration, tempo=tempo, pitchScale=1, filter=filters,
                       rate=48000, channels=2, bitDepth=16,
                       changes='Full performance, offline Rubber Band pitch-preserving time stretch to approximately 4.5s; metadata stripped and 10ms edge fades. No EQ, gain normalization, compression, noise synthesis, reversal, looping, silent padding or runtime pitch change.'))
manifest = dict(schema='second-language.paper-recording-candidate.v2', status='pending-listening',
                source='Adobe Audition Download Sound Effects / Foley',
                sourcePage='https://www.adobe.com/products/audition/offers/AdobeAuditionDLCSFX.html',
                license='Adobe Content Files terms; embedded in this authored interactive scroll only, not an independent sound library or MIT asset.',
                materialLimit='Author identifies paper rolling, not actual animal parchment. Suitability remains subject to listening.',
                timing='Normal 5.6s automatic motion contains approximately 3.176s paper movement. Stretched takes cover this interval with headroom; actual movement controls gain, then stop fades the source. Finite takes do not cover arbitrarily long continuous manual dragging.',
                tool=str(FFMPEG),
                recordings=result)
(OUT.parent / 'paper-recordings.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2)+'\n', encoding='utf-8', newline='\n')
print(json.dumps(dict(files=len(result), bytes=sum(r['bytes'] for r in result))))

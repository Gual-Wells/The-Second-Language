"""Make small traceable recorded-material loops, not synthesized foley.

Inputs are retained unmodified. Trim, mono downmix, DC removal, soft transient
compression, restrained gain and an equal-power seam are the transformations. Sound character
still needs listening; energy statistics are not an aesthetic certificate.
"""
from pathlib import Path
import wave, hashlib, json, shutil
import numpy as np

root=Path(__file__).resolve().parents[1]
cache=root/'.cache/scroll-reader-correction-2026-10-22/audio'
assets=root/'web/labs/certification-reader/assets'
sources=assets/'audio-sources/material-recordings'
output=assets/'audio-foley'
sources.mkdir(parents=True,exist_ok=True)
sha=lambda data:hashlib.sha256(data).hexdigest()
files=[]
for name in ['unrolling-parchment.wav','altfuture-leather-stretched-hq-preview.mp3']:
    raw=(cache/name).read_bytes();dest=sources/name
    if dest.exists() and dest.read_bytes()!=raw:raise RuntimeError('Refusing changed original '+name)
    dest.write_bytes(raw);files.append(dict(file=dest.relative_to(root).as_posix(),bytes=len(raw),sha256=sha(raw)))

def build(name,source,start,end):
    with wave.open(str(cache/source),'rb') as f:
        rate=f.getframerate();channels=f.getnchannels();assert f.getsampwidth()==2
        pcm=np.frombuffer(f.readframes(f.getnframes()),dtype='<i2').astype(np.float64).reshape(-1,channels).mean(axis=1)/32768
    x=pcm[round(start*rate):round(end*rate)].copy();x-=x.mean()
    overlap=round(.12*rate);assert len(x)>overlap*4
    # At the wrap, continue the source tail into its head over 120ms.
    # This is a conventional splice of the same recording, not extra impacts.
    loop=x[:-overlap].copy();theta=np.linspace(0,np.pi/2,overlap,endpoint=True)
    loop[:overlap]=x[-overlap:]*np.cos(theta)+x[:overlap]*np.sin(theta)
    # Keep a close quiet movement audible without turning an isolated handling
    # knock into the loudness reference. No crackles or impacts are invented.
    threshold=float(np.quantile(np.abs(loop),.997))
    if threshold>0:loop=threshold*np.tanh(loop/threshold)
    rms=float(np.sqrt(np.mean(loop*loop)));peak=float(np.max(np.abs(loop)))
    gain=min(.11/max(rms,1e-8),.72/max(peak,1e-8));loop*=gain
    pcm16=np.rint(np.clip(loop,-1,1)*32767).astype('<i2');dest=output/name
    with wave.open(str(dest),'wb') as f:f.setnchannels(1);f.setsampwidth(2);f.setframerate(rate);f.writeframes(pcm16.tobytes())
    data=dest.read_bytes()
    return dict(file=dest.relative_to(root).as_posix(),source=source,sourceSHA256=sha((cache/source).read_bytes()),trimSeconds=[start,end],seamSeconds=.12,softTransientThreshold=threshold,channels=1,rate=rate,gain=gain,duration=len(loop)/rate,peak=float(np.max(np.abs(loop))),rms=float(np.sqrt(np.mean(loop*loop))),wrapJump=float(abs(loop[-1]-loop[0])),bytes=len(data),sha256=sha(data))

loops=[build('parchment-roll-loop.wav','unrolling-parchment.wav',.54,2.75),build('leather-flex-loop.wav','leather-decoded.wav',14.7,16.1)]
report={'schema':'second-language.recorded-material-derivatives.v1','sources':files,'loops':loops,'method':'Recorded sources only; mono downmix, source trim, DC removal, 120ms equal-power same-recording seam, soft tanh compression at the 99.7th amplitude percentile, RMS gain capped at .72 peak; 16-bit PCM. Runtime low-pass and restrained rate/gain follow actual motion.','listeningReview':'Not auditioned by this tool; author material descriptions and signal measurements do not prove listening quality.','musicAndMetal':'Existing music and a quiet Kenney metalClick recording unchanged; no book/cloth/placement/latch cues.'}
(sources/'derivatives.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8',newline='\n')
research=root/'research/scroll-reader-correction-2026-10-22';research.mkdir(exist_ok=True)
(research/'audio-derivatives.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(loops,indent=2))

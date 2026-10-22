"""Finite recorded gestures: no looping, compression, synthesis or reversal."""
from pathlib import Path
import hashlib, json, wave
import numpy as np

root=Path(__file__).resolve().parents[1]
base=root/'web/labs/certification-reader/assets'
src=base/'audio-sources/performance-recordings'
dest=base/'audio-foley'; dest.mkdir(exist_ok=True)
rate=48000
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def asset(p): return {'file':p.relative_to(root).as_posix(),'bytes':p.stat().st_size,'sha256':sha(p)}
def read(p):
    with wave.open(str(p)) as w:
        assert w.getframerate()==rate and w.getsampwidth()==2 and w.getnchannels()==1
        return np.frombuffer(w.readframes(w.getnframes()),dtype='<i2').astype(np.float64)/32768

# Fixed cuts are authoring choices. They do not claim the substitute material
# was an archaeological parchment, or that the second unroll was a real reroll.
cuts=[
 ('paper-open-v41','parchment',.46,3.50,.55,85,10500),
 ('paper-close-v41','parchment',13.10,16.40,.55,85,10500),
 ('leather-release-v41','leather',.20,2.38,2.0,110,8500),
 ('buckle-park-v41','buckle',.47,.79,.65,100,12000),
 ('buckle-seat-v41','buckle',3.69,4.07,.65,100,12000),
]
performances=[]
for name,source,start,end,gain,hp,lp in cuts:
    original=src/(source+'-decoded.wav'); x=read(original)[round(start*rate):round(end*rate)].copy()
    x-=np.mean(x)
    # Broad zero-phase 2-pole amplitude responses remove handling rumble and
    # ultrasonic/noisy extremes. No spectral denoiser, gate or compressor.
    padded=np.pad(x,(rate//2,rate//2)); frequency=np.fft.rfftfreq(len(padded),1/rate)
    high=1/np.sqrt(1+(hp/np.maximum(frequency,.001))**4)
    low=1/np.sqrt(1+(frequency/lp)**4)
    y=np.fft.irfft(np.fft.rfft(padded)*high*low,n=len(padded))[rate//2:rate//2+len(x)]*gain
    fade=round(.012*rate); y[:fade]*=np.sin(np.linspace(0,np.pi/2,fade))**2
    fade=round(.035*rate); y[-fade:]*=np.sin(np.linspace(np.pi/2,0,fade))**2
    assert np.max(np.abs(y))<.8, 'Unexpected peak: review the cut; do not compress it automatically'
    target=dest/(name+'.wav')
    with wave.open(str(target),'wb') as w:
        w.setparams((1,2,rate,len(y),'NONE','not compressed'));w.writeframes(np.round(y*32767).astype('<i2').tobytes())
    performances.append({**asset(target),'source':original.name,'sourceSHA256':sha(original),'startSeconds':start,'endSeconds':end,
        'duration':len(y)/rate,'linearGain':gain,'highpassHz':hp,'lowpassHz':lp,'fadeInMs':12,'fadeOutMs':35,
        'peak':float(abs(y).max()),'rms':float(np.sqrt(np.mean(y*y))),'loop':False,'reversed':False,'compression':False})
sources=[asset(p) for p in src.iterdir() if p.suffix in ('.wav','.mp3')]
report={'schema':'second-language.recorded-performances.v1','rate':rate,'sources':sources,'performances':performances,
 'processing':'Publicly licensed recordings; browser 48 kHz mono decode, fixed contiguous cuts, DC removal, broad frequency cleanup, static material-specific gain, short edge fades. No loops, synthesis, tanh compression, reversed audio or rate/pitch modulation.',
 'listeningReview':'New candidate for user audition. Source identity, waveform and motion checks do not certify perceived material quality.'}
(src/'derivatives.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8',newline='\n')
evidence=root/'research/scroll-craft-and-audio-2026-10-22'
(evidence/'audio-derivatives.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8',newline='\n')
manifest={'schema':'second-language.reader-material-audio.v2','currentSince':'2026-10-22','revision':'v41-finite-performances',
 'runtime':[{'path':'assets/'+p['file'].split('/assets/',1)[1], 'bytes':p['bytes'],'sha256':p['sha256']} for p in performances],
 'sources':'performance-recordings/CREDITS.md','derivatives':'performance-recordings/derivatives.json','authorSources':'performance-recordings/sources.json',
 'licenses':['CC0-1.0'],'legacyManifest':'v40-rejected-manifest.json','listeningReview':report['listeningReview']}
music=base/'audio-music/a-new-town.mp3';manifest['runtime'].append({'path':'assets/audio-music/a-new-town.mp3','bytes':music.stat().st_size,'sha256':sha(music)})
(base/'audio-sources/manifest.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps([{k:p[k] for k in ('file','duration','peak','rms')} for p in performances],indent=2))

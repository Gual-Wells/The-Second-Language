"""Quiet paper-roll audition from an existing original WAV, not the v40 loop.

No synthetic noise, normalisation gain, reversal, looping or time/pitch change.
The author identifies a scroll-unrolling effect, not a measured vellum specimen.
"""
from pathlib import Path
import hashlib,json,wave
import numpy as np

root=Path(__file__).resolve().parents[1]
source=root/'web/labs/certification-reader/assets/audio-sources/material-recordings/unrolling-parchment.wav'
assert hashlib.sha256(source.read_bytes()).hexdigest()=='0ecdba822baa623f478a0131c20eaf175e9494f8fb534d666427685813c9e54f'
with wave.open(str(source)) as w:
    rate=w.getframerate();channels=w.getnchannels()
    assert w.getsampwidth()==2
    x=np.frombuffer(w.readframes(w.getnframes()),dtype='<i2').reshape(-1,channels).mean(axis=1)/32768
start,end=.50,2.76
x=x[round(start*rate):round(end*rate)].copy();x-=x.mean()
# Broad rumble/upper-edge cleanup. This is NOT source separation and cannot
# prove that an undesired handling noise has been removed.
padding=rate//2;z=np.pad(x,(padding,padding));f=np.fft.rfftfreq(len(z),1/rate)
hp=140;lp=5500
curve=1/np.sqrt(1+(hp/np.maximum(f,.001))**4)/np.sqrt(1+(f/lp)**4)
x=np.fft.irfft(np.fft.rfft(z)*curve,n=len(z))[padding:padding+len(x)]
# Downward-only levelling of coarse bursts, not the old tanh/large-gain edit.
# No quiet passages are amplified; this does not invent a softer material.
window=round(.025*rate)
energy=np.sqrt(np.convolve(x*x,np.ones(window)/window,mode='same')+1e-12)
wanted=np.minimum(1,(.009/np.maximum(energy,.009))**.65)
gain=np.ones(len(x));a=1-np.exp(-1/(.025*rate));r=1-np.exp(-1/(.10*rate))
for i in range(1,len(x)):
    gain[i]=gain[i-1]+(wanted[i]-gain[i-1])*(a if wanted[i]<gain[i-1] else r)
x*=gain
fade=round(.085*rate);x[:fade]*=np.sin(np.linspace(0,np.pi/2,fade))**2
fade=round(.16*rate);x[-fade:]*=np.sin(np.linspace(np.pi/2,0,fade))**2
out=root/'web/labs/scroll-foley-study/audio/soft-roll-v2.wav'
with wave.open(str(out),'wb') as w:
    w.setparams((1,2,rate,len(x),'NONE','not compressed'));w.writeframes(np.round(x*32767).astype('<i2').tobytes())
manifest=dict(schema='second-language.soft-roll-audition.v1',status='audition-not-approved',
 source=dict(author='spookymodem',title='Spell Scroll / Unrolling Parchment',license='CC-BY-3.0',
    page='https://lpc.opengameart.org/content/spell-scroll',
    file=source.relative_to(root).as_posix(),sha256=hashlib.sha256(source.read_bytes()).hexdigest(),
    format='Original PCM WAV, 44100Hz stereo 16bit; author does not identify actual sheet material.'),
 derivative=dict(file='audio/'+out.name,sha256=hashlib.sha256(out.read_bytes()).hexdigest(),bytes=out.stat().st_size,
    sourceStartSeconds=start,sourceEndSeconds=end,duration=len(x)/rate,rate=rate,channels=1,
    highpassHz=hp,lowpassHz=lp,downwardOnlyThresholdRMS=.009,downwardExponent=.65,minimumGain=float(gain.min()),
    detectorMs=25,attackMs=25,releaseMs=100,fadeInMs=85,fadeOutMs=160,staticAmplification=1,
    peak=float(abs(x).max()),rms=float(np.sqrt(np.mean(x*x))),loop=False,reversed=False,playbackRate=1),
 runtime=dict(only='paper winding',otherActions='silent',nominalHeightMM=420,quietSpeedMMPerS=15,
    fullSpeedMMPerS=175,maximumGain=.13,velocitySmoothingMs=65,envelopeTimeConstantMs=45,
    audioClockHoldMs=95,audioClockReleaseMs=25,sourceExhaustion='Remain quiet until a new stroke; do not repeat short fragments.'),
 listening='Pending actual user listening; no claim of verified animal parchment or verified absence of recorded handling noise.')
(out.parent.parent/'soft-roll.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(manifest['derivative'],indent=2))

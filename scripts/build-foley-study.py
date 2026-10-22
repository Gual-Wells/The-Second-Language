"""Author an audition, not an automatically approved sound master.

The exact downloaded author previews are the inputs. All cuts remain native
speed, with no loops/reversal, noise synthesis, denoising or loudness matching.
"""
from pathlib import Path
import json, hashlib, wave
import numpy as np

root=Path(__file__).resolve().parents[1]
cache=root/'.cache/foley-community-sources-2026-10-22'
dest=root/'web/labs/scroll-foley-study/audio'
dest.mkdir(parents=True,exist_ok=True)
rate=48000

def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def read(id):
    with wave.open(str(cache/(str(id)+'-decoded.wav'))) as w:
        assert w.getframerate()==rate and w.getsampwidth()==2 and w.getnchannels()==1
        return np.frombuffer(w.readframes(w.getnframes()),dtype='<i2').astype(float)/32768

sources={id:read(id) for id in [580586,626503,204046]}
# Timing is an initial edit based on complete author recordings and the visual
# mechanism. These assignments have NOT been approved by an auditory reviewer.
cuts=[
 ('paperOpenA',580586,11.48,14.65,.65,80,12000,False),
 ('paperCloseA',580586,24.38,27.55,.65,80,12000,False),
 ('paperOpenB',204046,10.59,13.76,1.0,80,12000,False),
 ('paperCloseB',204046,17.89,21.06,1.0,80,12000,False),
 ('bendOpen',626503,13.05,13.95,3.0,100,10500,False),
 ('bendClose',626503,2.14,3.04,3.0,100,10500,False),
 ('holeOpen',626503,17.55,17.97,3.0,100,10500,False),
 ('holeClose',626503,18.00,18.42,3.0,100,10500,False),
 ('tailOpen',626503,10.52,11.17,2.5,100,10500,False),
 ('tailClose',626503,11.30,11.95,2.5,100,10500,False),
 ('slideOpen',626503,19.47,19.71,2.5,100,10500,False),
 ('slideClose',626503,20.00,20.24,2.5,100,10500,False),
 # Keep one isolated contact; the strongest 5ms window is brought near the
 # front so that a prong event is not followed by 0.1-0.3s of wrong silence.
 ('park',626503,8.96,9.20,.65,100,14000,True),
 ('seat',626503,9.65,9.92,.65,100,14000,True),
]
report=[]
for key,id,start,end,gain,hp,lp,impact in cuts:
    x=sources[id][round(start*rate):round(end*rate)].copy()
    x-=np.mean(x)
    padded=np.pad(x,(rate//2,rate//2));f=np.fft.rfftfreq(len(padded),1/rate)
    eq=(1/np.sqrt(1+(hp/np.maximum(f,.001))**4))*(1/np.sqrt(1+(f/lp)**4))
    x=np.fft.irfft(np.fft.rfft(padded)*eq,n=len(padded))[rate//2:rate//2+len(x)]*gain
    impact_anchor=None
    if impact:
        size=round(.005*rate)
        energy=np.convolve(x*x,np.ones(size)/size,mode='valid')
        peak=int(np.argmax(energy))
        trim=max(0,peak-round(.008*rate))
        x=x[trim:];start+=trim/rate;impact_anchor=(peak-trim)/rate
    fade=min(round((.002 if impact else .008)*rate),len(x)//4)
    x[:fade]*=np.sin(np.linspace(0,np.pi/2,fade))**2
    fade=min(round((.045 if impact else .035)*rate),len(x)//4)
    x[-fade:]*=np.sin(np.linspace(np.pi/2,0,fade))**2
    assert abs(x).max()<.9
    p=dest/(key+'.wav')
    with wave.open(str(p),'wb') as w:
        w.setparams((1,2,rate,len(x),'NONE','not compressed'))
        w.writeframes(np.round(x*32767).astype('<i2').tobytes())
    report.append(dict(key=key,file='audio/'+p.name,source=id,startSeconds=start,endSeconds=end,
        duration=len(x)/rate,linearGain=gain,highpassHz=hp,lowpassHz=lp,impactAnchorSeconds=impact_anchor,
        peak=float(abs(x).max()),rms=float(np.sqrt(np.mean(x*x))),bytes=p.stat().st_size,sha256=sha(p),
        loop=False,reversed=False,playbackRate=1))

manifest=dict(schema='second-language.foley-audition.v1',status='audition-not-approved',
    impactAnchorDefinition='Start of the strongest 5ms energy window in a selected belt contact candidate; signal anchor only, not an auditory or collision-force identification.',
    originalFormat='Public MP3 previews, not lossless masters; decoding to PCM does not recover discarded information.',
    processing='Fixed contiguous cuts, DC removal, broad high/low pass, static gains, short edge fades. Native pitch/speed.',
    closeCaution='The paper sources document unrolling/rustling. Close uses a different forward performance as a trial; it is not a verified recording of rerolling parchment.',
    materials=report,listeningReview='Pending user listening. No model or human auditory approval has been performed.')
(dest.parent/'cues.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps([dict(key=r['key'],duration=r['duration'],impact=r['impactAnchorSeconds'],rms=r['rms']) for r in report],indent=2))

// Offline symbol studies, not story summaries. Sources and licences in the gallery CREDITS.
import {spawnSync} from 'node:child_process';import {mkdir,writeFile,readFile} from 'node:fs/promises';import {createHash} from 'node:crypto';import path from 'node:path';
const source=process.env.GALLERY_SOUND_SOURCE||'.cache/sources/audio',nature=process.env.GALLERY_NATURE_SOURCE,out='web/labs/monthly-gallery/assets',ffmpeg=process.env.FFMPEG;
if(!ffmpeg||!nature)throw Error('Configure FFMPEG and GALLERY_NATURE_SOURCE');await mkdir(out,{recursive:true});const records=[];
function render(name,inputs,graph,seconds){const args=['-hide_banner','-loglevel','error','-y',...inputs.flatMap(f=>['-i',f]),'-filter_complex',graph+',loudnorm=I=-23:TP=-5:LRA=9,apad,atrim=duration='+seconds+'[out]','-map','[out]','-ar','44100','-ac','2','-codec:a','libmp3lame','-b:a','128k',path.join(out,name+'.mp3')];const r=spawnSync(ffmpeg,args,{encoding:'utf8',windowsHide:true});if(r.status!==0)throw Error(r.stderr);records.push({name,seconds,inputs:inputs.map(f=>path.basename(f)),processing:graph});}
const leaf=path.join(source,'leaves/rustle/rustle03.flac'),bubble=path.join(source,'bubbles.wav'),bell=path.join(source,'bell.wav'),wind=path.join(nature,'amb_wind_1.flac'),forest=path.join(nature,'amb_forest.flac');
// Leaf unfolding: close rustle expands in stereo; its object remains foliage throughout.
render('vegetation',[leaf],'[0:a]atrim=duration=3,asetpts=PTS-STARTPTS,highpass=f=160,lowpass=f=8500,aecho=.6:.3:120|310:.22|.13,afade=t=in:d=0.15,afade=t=out:st=2.5:d=0.5',4);
// Aquatic object: submerged air and a resonant low water envelope, no river/forest recap.
render('aquatic',[bubble],'[0:a]asetpts=PTS-STARTPTS,lowpass=f=1800,aecho=.7:.4:240|510:.3|.17,afade=t=in:d=0.1,afade=t=out:st=1:d=1',3);
// Ordinance's religious rite sense: a single real ceremonial chime and its chamber decay.
render('ordinance',[bell],'[0:a]asetpts=PTS-STARTPTS,lowpass=f=6000,aecho=.7:.5:170|490:.22|.13,afade=t=out:st=2:d=1',4);
render('ambient-garden',[forest,wind],'[0:a]atrim=duration=20,volume=.8,afade=t=in:d=2,afade=t=out:st=18:d=2[a];[1:a]atrim=duration=20,volume=.3,afade=t=in:d=2,afade=t=out:st=18:d=2[b];[a][b]amix=inputs=2:normalize=0',20);
render('ambient-ocean',[wind],'[0:a]atrim=duration=20,lowpass=f=420,highpass=f=40,aecho=.6:.4:300:.15,afade=t=in:d=2,afade=t=out:st=18:d=2',20);
const files=[...new Set(records.flatMap(r=>r.inputs))];await writeFile(out+'/sound-build.json',JSON.stringify({scope:'symbol studies; user sound-quality acceptance pending',records,paidCalls:0},null,2));console.log({files:records.length,paidCalls:0});


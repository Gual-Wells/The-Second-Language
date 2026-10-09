// Original v2 arrangements; source licenses and credits: web/labs/certification-v2/CREDITS.md.
// Local source archives are intentionally outside Git. No network, model or billing calls.
import {spawnSync} from 'node:child_process';
import {mkdir,readFile,writeFile,rename} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
const source=path.resolve(process.env.COIN_SOUND_SOURCE||'.cache/certification-v2/sources'),out=path.resolve('web/labs/certification-v2/assets');
const ffmpeg=process.env.FFMPEG||path.resolve('.cache/tools/ffmpeg.exe');await mkdir(out,{recursive:true});
const ambient=name=>path.join(source,'ambient/ambient_mountains_forest_river_waterfall_wind',name+'.flac');
const paper=name=>path.join(source,'casino/Audio',name+'.ogg');
const metal=n=>path.join(source,`impact/Audio/impactMetal_light_00${n}.ogg`);
const records=[];
function run(args){const r=spawnSync(ffmpeg,['-hide_banner','-loglevel','error','-y',...args],{windowsHide:true,encoding:'utf8'});if(r.status!==0)throw Error(r.stderr||'Audio build failed');}
async function mix(name,duration,layers){
 const inputs=layers.flatMap(x=>['-stream_loop',x.loop?'-1':'0','-i',x.file]),endFade=Math.min(.7,duration*.25);
 const normalizer=name.startsWith('theme-')?'loudnorm=I=-21:TP=-3:LRA=11,':'';
 const graph=layers.map((x,i)=>`[${i}:a]atrim=start=${x.start||0}:duration=${x.duration},asetpts=PTS-STARTPTS,${x.loop?'loudnorm=I=-24:TP=-8:LRA=11,':''}volume=${x.gain},afade=t=in:d=${x.fadeIn??.04},afade=t=out:st=${Math.max(0,x.duration-(x.fadeOut??.3))}:d=${x.fadeOut??.3},adelay=${Math.round((x.delay||0)*1000)}:all=1[a${i}]`).join(';')+';'+layers.map((_,i)=>`[a${i}]`).join('')+`amix=inputs=${layers.length}:normalize=0,${normalizer}alimiter=limit=0.85:level=false,apad,atrim=duration=${duration},afade=t=out:st=${duration-endFade}:d=${endFade}[out]`;
 run([...inputs,'-filter_complex',graph,'-map','[out]','-ar','44100','-ac','2','-codec:a','libmp3lame','-b:a','128k',path.join(out,name+'.mp3')]);
 if(!name.startsWith('theme-')){const report=spawnSync(ffmpeg,['-hide_banner','-i',path.join(out,name+'.mp3'),'-af','volumedetect','-f','null','NUL'],{windowsHide:true,encoding:'utf8'});if(report.status!==0)throw Error('Peak measurement failed');const peak=Number(report.stderr.match(/max_volume: ([-0-9.]+) dB/)[1]);run(['-i',path.join(out,name+'.mp3'),'-af',`volume=${-8-peak}dB`,'-codec:a','libmp3lame','-b:a','128k',path.join(out,name+'.normalized.mp3')]);await rename(path.join(out,name+'.normalized.mp3'),path.join(out,name+'.mp3'));}
 records.push({name,duration,layers:layers.map(x=>({...x,file:path.relative(source,x.file).replaceAll('\\','/')}))});
}
// Map: unfolding a map, surveying forest/river, then closing the paper. Three literal scene cues.
await mix('theme-map',12,[
 {file:paper('card-fan-1'),duration:.7,gain:1.25,delay:0},
 {file:ambient('amb_forest'),duration:10.3,gain:.60,delay:.8,fadeIn:1.8,fadeOut:1.2,loop:true},
 {file:ambient('amb_river'),duration:7.8,gain:.38,delay:2.5,fadeIn:2,fadeOut:1.6,loop:true},
 {file:paper('card-slide-1'),duration:.5,gain:.7,delay:4.1},
 {file:paper('card-fan-2'),duration:.7,gain:1,delay:10.5}
]);
// Ledger: pages, three separated marks, a river swelling beneath the record. No musical voice swap.
await mix('theme-ledger',12,[
 {file:paper('card-shuffle'),duration:1.4,gain:.95,delay:0},
 {file:ambient('amb_stream'),duration:10.7,gain:.50,delay:.8,fadeIn:1.5,fadeOut:1.2,loop:true},
 ...[2.2,4.7,7.2].map((delay,i)=>({file:metal(i),duration:.45,gain:.22,delay})),
 {file:paper('card-slide-3'),duration:.6,gain:.9,delay:5.3},
 {file:ambient('amb_river'),duration:5.1,gain:.40,delay:6.2,fadeIn:2,fadeOut:1.4,loop:true},
 {file:paper('card-fan-1'),duration:.7,gain:1,delay:10.7}
]);
// Wetland: sparse wind -> returning stream -> living forest, with water remaining at the end.
await mix('theme-wetland',14,[
 {file:ambient('amb_wind_1'),duration:4.2,gain:.36,delay:0,fadeIn:.8,fadeOut:1.6,loop:true},
 {file:path.join(source,'stream/stream-waterfall/stream2.ogg'),duration:7.2,gain:.55,delay:2.2,fadeIn:2,fadeOut:1.5,loop:true},
 {file:ambient('amb_river'),duration:8.1,gain:.58,delay:5.3,fadeIn:2.1,fadeOut:.7,loop:true},
 {file:ambient('amb_forest'),duration:7.4,gain:.70,delay:6,fadeIn:1.8,fadeOut:.8,loop:true}
]);
for(const [i,start]of [.17,3.55,7.28].entries())await mix('glass-'+(i+1),i===2?1.1:.8,[{file:path.join(source,'coin-glass.mp3'),start,duration:i===2?1.1:.8,gain:.85,fadeIn:.001,fadeOut:.15}]);
for(let i=0;i<3;i++)await mix('metal-'+(i+1),.7,[{file:metal(i),duration:.7,gain:.75,fadeIn:.001,fadeOut:.15}]);
const inputs=[...new Set(records.flatMap(x=>x.layers.map(y=>y.file)))];
const hashes=await Promise.all(inputs.map(async file=>({file,sha256:createHash('sha256').update(await readFile(path.join(source,file))).digest('hex')})));
await writeFile(path.join(out,'sound-build.json'),JSON.stringify({version:'theme-arrangements-v2',sampleRate:44100,channels:2,codec:'MP3 128kbps',natureLayerLoudness:'-24 LUFS / -8 dBTP',themeLoudness:'-21 LUFS / -3 dBTP',collisionPeakTargetDb:-8,records,sources:hashes},null,2)+'\n');
console.log(JSON.stringify({themes:3,collisions:6,paidCalls:0}));

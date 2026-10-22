// Promote the exact user-adopted audition; it never regenerates paid assets.
import {execFileSync} from 'node:child_process';
import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const pin='6b5f54fefcad90276cf9cd942e167c4e5c7a16a6';
const root=process.cwd(),production='web/labs/certification-reader',study='web/labs/scroll-foley-study';
const git=file=>execFileSync('git',['show',`${pin}:${file}`],{windowsHide:true,maxBuffer:8*1024*1024});
const hash=b=>createHash('sha256').update(b).digest('hex');
const json=async(file,value)=>writeFile(file,JSON.stringify(value,null,2)+'\n');
function replace(text,from,to){if(!text.includes(from))throw Error('Promotion source changed: '+from.slice(0,60));return text.replace(from,to);}
const keys=['bendOpen','bendClose','holeOpen','holeClose','tailOpen','tailClose','slideOpen','slideClose','park','seat'];
const dest=production+'/assets/audio-foley/v42';await mkdir(dest,{recursive:true});
const runtime=[];
for(const name of [...keys.map(k=>k+'.wav'),'paper-unroll-v5.wav','paper-rollup-v5.wav']){
 const bytes=git(study+'/audio/'+name);await writeFile(dest+'/'+name,bytes);
 runtime.push({path:'assets/audio-foley/v42/'+name,bytes:bytes.length,sha256:hash(bytes)});
}
const paper=JSON.parse(git(study+'/paper-recordings.json'));
paper.status='user-adopted';paper.adoptedAt='2026-10-23';paper.acceptedRevision=pin;
for(const item of paper.recordings)item.file=item.file.replace(/^audio\//,'');
await json(dest+'/paper-recordings.json',paper);
const cues=JSON.parse(git(study+'/cues.json'));
const keeper={schema:'second-language.keeper-recordings.v1',status:'user-adopted-with-paper-v5',adoptedAt:'2026-10-23',acceptedRevision:pin,
 reference:'466132c A/B keeper; unchanged WAV bytes, phase timing and gain',originalFormat:cues.originalFormat,processing:cues.processing,
 materials:cues.materials.filter(x=>keys.includes(x.key)).map(x=>({...x,file:x.file.replace(/^audio\//,'')}))};
if(keeper.materials.length!==10)throw Error('Missing adopted keeper take');
await json(dest+'/keeper-cues.json',keeper);
const authors=JSON.parse(git(study+'/sources.json'));authors.sources=authors.sources.filter(x=>x.id===626503);
await json(dest+'/keeper-sources.json',authors);
const music=await readFile(production+'/assets/audio-music/a-new-town.mp3');
runtime.push({path:'assets/audio-music/a-new-town.mp3',bytes:music.length,sha256:hash(music)});
await json(production+'/assets/audio-sources/manifest.json',{
 schema:'second-language.reader-material-audio.v3',currentSince:'2026-10-23',revision:'v42-approved-recorded-foley',adoptedAudition:pin,
 adoptedURL:'https://912b8b9f.the-second-language.pages.dev/labs/scroll-foley-study/',runtime,
 provenance:['../audio-foley/v42/paper-recordings.json','../audio-foley/v42/keeper-cues.json','../audio-foley/v42/keeper-sources.json'],
 licenses:['CC0-1.0','Adobe Content Files terms'],
 sourcePolicy:'Adobe originals/ZIP remain in private ignored D storage; only accompanying derived interactive tracks are distributed. Not MIT/CC0. Keeper and music retain CC0.',
 acceptance:'User approved normal automatic opening/closing and requested production integration on 2026-10-23. No unlimited continuous-drag or physical iPhone Safari guarantee.'});

// Separate lifecycle/music from material scheduling; rejected v41 motion/seek
// methods do not remain in the production inheritance chain.
let base=git(production+'/sound.js').toString();
base=replace(base,"import {materialMotion} from './material-motion.js?v=41';\n",'');
const filesStart=base.indexOf('const FILES ='),filesEnd=base.indexOf('const MUSIC_GAIN');
base=base.slice(0,filesStart)+"const FILES = Object.freeze({music:'audio-music/a-new-town.mp3'});\n"+base.slice(filesEnd);
base=replace(base,'export class SoundDirector','export class AudioDirector');
base=replace(base,"Object.keys(FILES).filter(key=>key!=='music').map(key=>this._buffer(key))","(this.foleyKeys||[]).map(key=>this._buffer(key))");
const oldStart=base.indexOf('  _play('),oldEnd=base.indexOf('  pause()');
if(oldStart<0||oldEnd<=oldStart)throw Error('Missing legacy method boundaries');
base=base.slice(0,oldStart)+base.slice(oldEnd);
base='// Shared trusted unlock, music, visibility and disposal only. Material cues live in keeper-sound.js / sound.js.\n'+base;
await writeFile(production+'/sound-base.js',base);

let buckle=git(study+'/keeper-reference.js').toString();
buckle=replace(buckle,"import {SoundDirector} from '../certification-reader/sound.js?v=41';","import {AudioDirector} from './sound-base.js?v=42';");
buckle=replace(buckle,"import {materialMotion} from '../certification-reader/material-motion.js?v=41';","import {materialMotion} from './material-motion.js?v=41';");
buckle=replace(buckle,'./audio/${key}.wav','./assets/audio-foley/v42/${key}.wav');
buckle=replace(buckle,"../certification-reader/assets/audio-music/a-new-town.mp3","./assets/audio-music/a-new-town.mp3");
buckle=replace(buckle,'export class ABKeeperSoundDirector extends SoundDirector','export class KeeperSoundDirector extends AudioDirector');
buckle=replace(buckle,'  super();','  super();this.foleyKeys=keys.slice();');
buckle=buckle.replace(/ canonical\(key\)\{[\s\S]*?\n \}\n/,'');
buckle=replace(buckle,'  key=this.canonical(key);\n','');
buckle=replace(buckle,' _buffer(key){return super._buffer(this.canonical(key));}\n','');
buckle=replace(buckle,"variant:'restored-ab-keeper',candidateOnly:true,foleyMethod:'User-requested A/B keeper reference restored independently; paper source disabled pending reselection'","variant:'recorded-keeper-v42',candidateOnly:false,foleyMethod:'Adopted phase-based recorded keeper and independent paper performance'");
buckle=replace(buckle,"listeningReview:'Restored A/B reference per user clarification; material quality still requires improvement, not final approval.'","listeningReview:'A/B keeper adopted together with paper v5 on 2026-10-23.'");
buckle=replace(buckle,'// Study adapter: retain the proven unlock/music/visibility lifetime, replace\n// only the Foley edit. No production import or product setting points here.','// Native recorded keeper phases. Shared by the product and its audition.');
await writeFile(production+'/keeper-sound.js',buckle);
let paperEngine=git(study+'/sound.js').toString();
paperEngine=replace(paperEngine,"import {ABKeeperSoundDirector} from './keeper-reference.js';","import {KeeperSoundDirector} from './keeper-sound.js?v=42';");
paperEngine=paperEngine.replaceAll("'./audio/paper-","'./assets/audio-foley/v42/paper-");
paperEngine=replace(paperEngine,'export class StudySoundDirector extends ABKeeperSoundDirector','export class SoundDirector extends KeeperSoundDirector');
paperEngine=replace(paperEngine,'  super();this.paperVoice','  super();this.foleyKeys.push(...Object.keys(paperFiles));this.paperVoice');
paperEngine=replace(paperEngine,"variant:'paper-recording-v5',paperState:'full-automatic-motion-tail-awaiting-listening'","variant:'recorded-foley-v42',candidateOnly:false,userApproved:true,paperState:'adopted-full-automatic-motion-tail'");
paperEngine=replace(paperEngine,"not human approved. Original A/B keeper restored unchanged.","user adopted for normal automatic opening/closing on 2026-10-23. Original A/B keeper unchanged.");
await writeFile(production+'/sound.js',paperEngine);
await writeFile(study+'/sound.js',"// The adopted audition and production share one canonical material engine.\nexport {SoundDirector as StudySoundDirector} from '../certification-reader/sound.js?v=42';\n");
await writeFile(study+'/keeper-reference.js',"// The adopted A/B keeper implementation is maintained in the product.\nexport {KeeperSoundDirector as ABKeeperSoundDirector} from '../certification-reader/keeper-sound.js?v=42';\n");
console.log(JSON.stringify({pin,runtimeFiles:runtime.length,bytes:runtime.reduce((n,f)=>n+f.bytes,0),production}));

import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';

// Author-made WAV excerpts, copied byte for byte; no DSP or animation cue edit.
const root=process.cwd();
const source=path.join(root,'.cache/foley-community-sources-2026-10-22/audioelk-originals');
const out=path.join(root,'web/labs/scroll-foley-study');
const sourcePage='https://audioelk.itch.io/foley-sessions-vol-1';
const manifest=JSON.parse(await readFile(path.join(source,'../audioelk-originals-manifest.json'),'utf8'));
const entries=[
 ['MXL900_BELT_HANDLING_01.wav','皮带原音 01','约 1.19 秒。作者单独切出的皮带操作声，动作归属与材质贴合尚未判定。'],
 ['MXL900_BELT_HANDLING_07.wav','皮带原音 07','约 1.74 秒。同一实体道具的另一段录音；本项目未清理、降音量或补合成层。'],
 ['MXL900_BELT_HANDLING_13.wav','皮带原音 13','约 6.62 秒。较长的皮带操作，可能含不适合当前动画的行为，保留原段供辨认。'],
 ['MXL900_BELT_IMPACT_07.wav','短碰触原音 07','约 0.19 秒。作者标记的皮带碰触声，尚不能据此当作卷轴扣针落框声。']
];
await mkdir(path.join(out,'sources/audioelk'),{recursive:true});
const recordings=[];
for(const [name,title,description] of entries){
 const info=manifest.files.find(item=>item.file===name),bytes=await readFile(path.join(source,name));
 const sha256=createHash('sha256').update(bytes).digest('hex');
 if(!info||sha256!==info.sha256)throw Error('Author source bytes differ: '+name);
 await copyFile(path.join(source,name),path.join(out,'sources/audioelk',name));
 recordings.push({title,description,file:'./sources/audioelk/'+name,author:'Audio Elk',
  sourcePage,license:'CC BY-SA 4.0',licenseURL:'https://creativecommons.org/licenses/by-sa/4.0/',
  format:'WAV · PCM 16-bit / 48 kHz / 单声道',duration:info.duration,sha256,bytes:bytes.length,
  archiveMember:info.archiveMember,changes:'None. Author-supplied SPLICED WAV member copied byte-for-byte. Not the unedited full-session RAW recording.',
  approved:false,integratedIntoAnimation:false});
}
const evidence=await readFile(path.join(root,'research/scroll-source-selection-2026-10-22/licensing-evidence.json'));
await writeFile(path.join(out,'sources/audioelk/licensing-evidence.json'),evidence);
await writeFile(path.join(out,'source-auditions.json'),JSON.stringify({
 schema:'second-language.source-auditions.v1',
 status:'raw-source-selection-not-an-animation-sound-release',
 note:'这批是作者导出的独立 WAV 原件。没有适合的纸卷新原音；纸声仍待重新制作。',
 recordings
},null,2)+'\n');
console.log(JSON.stringify({recordings:recordings.length,bytes:recordings.reduce((sum,item)=>sum+item.bytes,0),processing:'none'}));

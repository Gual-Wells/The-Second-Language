import { open, readFile, realpath, unlink } from 'node:fs/promises';
import path from 'node:path';
import { loadVixIndex, familyRecords } from './lib/vix-index.mjs';
import { validateVixDate } from './lib/vix-date.mjs';
import {readAuxiliaryIndex,markAuxiliaryIndex} from './lib/vix-auxiliary.mjs';
import {canonicalSourcePackage} from '../protocol/current-affairs.mjs';
import {createHash} from 'node:crypto';

const args = Object.fromEntries(process.argv.slice(2).map(item => item.replace(/^--/, '').split(/=(.*)/s).slice(0, 2)));
if (!args.vix || !args.selection) throw new Error('用法: node scripts/mark-vix.mjs --vix=<VIX目录> --selection=<selection.json>');
const vixDir = path.resolve(args.vix), selection = JSON.parse(await readFile(args.selection, 'utf8'));
if ([vixDir,await realpath(vixDir)].some(value=>/[\\/]\.cache[\\/]vix[\\/][a-f0-9]{40}$/i.test(value))) throw new Error(`不能在不可变VIX原输入快照中写标注。先运行 node scripts/prepare-vix-marking.mjs ${selection.studyDate}，再把 --vix 指向 work/runs/${selection.studyDate}/vix-marking；publish-vix 也使用同一工作副本。`);
const label = validateVixDate(selection);
const index = await loadVixIndex(vixDir);
const chosen = familyRecords(selection), unique = new Map();
for (const item of chosen) {
  const actual = index.byRank.get(item.globalRank);
  if (!actual || actual.entryId !== item.entryId || actual.text !== item.text) throw new Error(`VIX rank 与词条身份已变化: ${item.text}`);
  unique.set(item.globalRank, actual);
}
const marker=JSON.parse(await readFile(path.join(vixDir,'vix-marking-workspace.json'),'utf8'));
const selectionDigest=createHash('sha256').update(canonicalSourcePackage(selection)).digest('hex');
if(marker.protocol!=='second-language-vix-marking/1'||marker.studyDate!==selection.studyDate||marker.inputCommit!==selection.vixInputCommit||marker.selectionDigest!==selectionDigest)throw Error('VIX 标注副本不属于本次冻结选择');
let identityDigest=marker.indexIdentityDigest;
if(!identityDigest){const lock=JSON.parse(await readFile(path.join(path.dirname(path.resolve(args.selection)),'vix-source.json'),'utf8'));if(lock.commit!==selection.vixInputCommit)throw Error('VIX 旧标注副本缺少原输入身份');identityDigest=(await readAuxiliaryIndex(lock.localDirectory)).identityDigest;}
let lease;const lockFile=path.join(vixDir,'vix-marking.lock');
try{lease=await open(lockFile,'wx');await lease.writeFile(JSON.stringify({pid:process.pid}));await markAuxiliaryIndex(vixDir,{label,globalRanks:[...unique.keys()],identityDigest});}
finally{if(lease){await lease.close();await unlink(lockFile);}}
console.log(`已向 ${label} 写入 ${unique.size} 个本次建设的 VIX 词条；请检查差异并提交 VIX 日期及派生索引。`);

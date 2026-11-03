import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {readAuxiliaryIndex,VIX_ACCESS_POLICY} from './lib/vix-auxiliary.mjs';

export async function vixCandidates(directory){
  const {manifest,structure,records}=await readAuxiliaryIndex(directory);
  const candidates=records.filter(item=>item.markDates.length===0).map(item=>({entryId:item.entryId,globalRank:item.globalRank,text:item.text,ownerCollectionId:item.collectionId,sourceOrder:item.sourceOrder}));
  const counts=Object.fromEntries(structure.collections.map(c=>[c.id,0]));
  for(const item of candidates)counts[item.ownerCollectionId]++;
  const collections=structure.collections.map(({id,name,label})=>({id,name,label,candidateCount:counts[id]}));
  return {vixAccessPolicy:VIX_ACCESS_POLICY,vixSeedRevision:manifest.source?.seedRevision,scope:manifest.scope,
    collectionMeaning:'ownerCollectionId is unique navigation ownership within the permitted auxiliary index, not CEFR, mastery or learning value. Original multi-list memberships are unavailable in this scope; they are not reconstructed or inferred from the owner. No candidates are filtered by owner level.',
    originalMembershipsAvailable:false,collections,counts,candidates};
}
if(process.argv[1]&&pathToFileURL(path.resolve(process.argv[1])).href===import.meta.url){
const args = Object.fromEntries(process.argv.slice(2).map(item => item.replace(/^--/, '').split(/=(.*)/s).slice(0, 2)));
if (!args.vix || !args.out) throw new Error('用法: node scripts/vix-candidates.mjs --vix=<VIX目录> --out=<输出文件>');
const output=await vixCandidates(path.resolve(args.vix));
await mkdir(path.dirname(path.resolve(args.out)), { recursive: true });
await writeFile(args.out, JSON.stringify(output));
console.log(`可选未标注词 ${output.candidates.length} 条，已写入 ${args.out}；只使用允许的辅助索引。`);
}

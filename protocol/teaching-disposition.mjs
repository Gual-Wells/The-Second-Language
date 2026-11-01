// Shared deterministic material coverage checks; semantic review remains separate.
const norm=s=>s.normalize('NFKC').trim().toLowerCase().replace(/\s+/g,' ');
const text=(s,name)=>{if(typeof s!=='string'||!s.trim())throw Error(`缺少 ${name}`);return s;};
export function teachingScope(value) {
  if(!Array.isArray(value?.mainWords)||!value.mainWords.length)throw Error('材料范围须有 mainWords；冻结前可用相同形状的候选范围');
  const rows=value.mainWords.map(w=>({text:text(w.text,'主词'),family:(w.family||[]).filter(f=>f.included!==false).map(f=>typeof f==='string'?f:text(f.text,'词族文字')).sort((a,b)=>a.localeCompare(b,'en'))})).sort((a,b)=>a.text.localeCompare(b.text,'en'));
  if(new Set(rows.map(w=>norm(w.text))).size!==rows.length)throw Error('主词范围重复');
  return rows;
}
export function checkMaterialDisposition(word,packet,parsed){
  if(word.materialDigest!==packet.materialDigest)throw Error(`${word.text} 仍在使用旧材料稿`);
  const sourceIds=new Set(packet.entries.filter(e=>['collins','oxford'].includes(e.book)).map(e=>e.id));
  if(!Array.isArray(word.sourceCoverage))throw Error('缺少教材条目内容与例句去向');
  for(const s of word.sourceCoverage){if(!sourceIds.has(s.sourceId))throw Error('未知教材条目去向');text(s.disposition,'教材内容去向或明确排除原因');}
  for(const sourceId of sourceIds)if(!word.sourceCoverage.some(s=>s.sourceId===sourceId))throw Error('教材条目尚未交代内容去向：'+sourceId);
  const candidates=new Map(packet.exampleCandidates.map(e=>[e.id,e]));
  const dispositions=word.exampleCoverage||[];
  if(!Array.isArray(dispositions)||new Set(dispositions.map(e=>e.exampleId)).size!==dispositions.length)throw Error('原例句去向重复或无效');
  for(const e of dispositions){
    if(!candidates.has(e.exampleId)||!Array.isArray(e.uses))throw Error('原例句去向包含未知来源');
    text(e.disposition,'原例句去向、合并或排除的具体说明');
    if(e.uses.some(u=>!parsed.uses.has(u)||parsed.uses.get(u).wordId!==word.wordId))throw Error('原例句不能映射到其他词族或不存在的用法');
  }
  for(const exampleId of candidates.keys())if(!dispositions.some(e=>e.exampleId===exampleId))throw Error('原例句候选尚未交代去向：'+exampleId);
  // Free-text dispositions are NOT a semantic certificate. Author review still
  // checks the full source, actual final examples, labels and genuine sense use.
}

// Deterministic counting of reviewed, original-backed discourse. This validates
// witnesses and denominators; semantic authenticity remains an actual review.
import {parseTeachingHeading} from '../web/teaching-units.js';
export const AUTHENTICITY_POLICY='authentic-context-observed-v1';
export const AUTHENTICITY_THRESHOLDS=Object.freeze({useCoverage:80,contextShare:80});
const norm=value=>value.normalize('NFKC').replace(/\s+/g,' ').trim();
const nonempty=(value,label)=>{if(typeof value!=='string'||!value.trim())throw Error('真实语境缺少'+label);return value;};
const roles=new Set(['service-instruction','technical-discourse','reported-event','public-dialogue','narrative','primary-research','institutional-record']);
export function authenticityPolicy(selection={},inputLock={}){
  const values=[selection.authenticityPolicy,inputLock.authenticityPolicy];
  if(values.every(v=>v==null))return null;
  if(values.some(v=>v!==AUTHENTICITY_POLICY))throw Error('真实语境观测合同须在原输入与选择冻结前同时固定；旧合同不能静默补写');
  return AUTHENTICITY_POLICY;
}
export function authenticCoverage({parsed,words,originals,strictWitnesses=false}){
  const authors=new Map(words.flatMap(w=>(w.contexts||[]).map(c=>[c.id,c]))),headForms=new Map();
  for(const word of words)for(const m of word.partOne.matchAll(/^<!-- USE:([^ ]+) -->\r?\n## ([^\r\n]+)/gm))headForms.set(m[1],parseTeachingHeading(m[2])?.forms?.map(f=>f.word)||[]);
  const sourceTexts=new Map(originals.map(o=>[o.url,o.text])),covered=new Set(),real=[],unverified=[];
  for(const c of parsed.contexts){
    if(c.kind==='example')continue;
    const authored=authors.get(c.id),witnessed=new Set(),useIds=c.refs||c.uses;
    if(!Array.isArray(useIds)||!useIds.length)throw Error('真实语境缺少实际用法引用：'+c.id);
    for(const e of authored?.sourceEvidence||[]){
      const proof=e.authenticUse;if(!proof)continue;
      if(!roles.has(proof.discourse))throw Error('真实来源须有原语篇角色，词典/教学示例不计入：'+c.id);
      const original=sourceTexts.get(e.url),passage=nonempty(proof.passage,'实际原段');
      if(typeof original!=='string'||!norm(original).includes(norm(passage)))throw Error('真实语境见证不在固定原文中：'+c.id);
      nonempty(proof.communicativeAct,'原文正在完成的真实交际行为');
      if(!Array.isArray(proof.uses)||!proof.uses.length)throw Error('真实原段须逐义核实际词形和意义：'+c.id);
      for(const use of proof.uses){
        if(!useIds.includes(use.useId)||!headForms.get(use.useId)?.includes(use.headForm)||!norm(passage).toLowerCase().includes(norm(nonempty(use.surface,'原文实际词形')).toLowerCase()))throw Error('真实原段未绑定当前用法/词形：'+c.id);
        nonempty(use.senseMatch,'原词义与构式实际对应依据');witnessed.add(use.useId);
      }
    }
    if(!useIds.every(id=>witnessed.has(id))){unverified.push(c.id);if(strictWitnesses)throw Error('不能仅把kind改为真实材料；须核原文实际使用全部所选义：'+c.id);continue;}
    real.push(c.id);for(const useId of useIds)if(parsed.uses.has(useId))covered.add(useId);
  }
  const useCount=parsed.uses.size,contextCount=parsed.contexts.length;
  const declared=parsed.contexts.filter(c=>c.kind!=='example'),declaredUses=new Set(declared.flatMap(c=>c.refs||c.uses));
  const result={policy:AUTHENTICITY_POLICY,targetIsPublicationGate:false,useCount,authenticUseCount:covered.size,contextCount,authenticContextCount:real.length,declaredAuthenticContextCount:declared.length,declaredAuthenticUseCount:declaredUses.size,useCoveragePercent:useCount?100*covered.size/useCount:0,contextSharePercent:contextCount?100*real.length/contextCount:0,uncoveredUseIds:[...parsed.uses.keys()].filter(id=>!covered.has(id)),unverifiedContextIds:unverified};
  return {...result,meetsTarget:useCount>0&&contextCount>0&&covered.size*100>=useCount*AUTHENTICITY_THRESHOLDS.useCoverage&&real.length*100>=contextCount*AUTHENTICITY_THRESHOLDS.contextShare};
}
// Optional experiment assertion only. Publication consumes the report above and
// may proceed below 80%; it must not call this research-target assertion.
export function assertAuthenticCoverage(input){const result=authenticCoverage(input);if(!result.meetsTarget)throw Error(`真实语境研究样本未达到80%双口径：用法${result.authenticUseCount}/${result.useCount}，语境${result.authenticContextCount}/${result.contextCount}；保全部义项，定点补找，不改标签或堆例凑数。`);return result;}

// Transport and provenance checks only. Candidate comparison and sense judgement
// are performed by the author and independent semantic review.
import {validateAnnotatedContent} from '../../web/annotations.js';
import {CONTEXT_AUTHORING_POLICY, USAGE_CONTEXT_FORMAT} from '../../protocol/usage-context.mjs';
const ID = /^[A-Za-z][A-Za-z0-9_-]{0,31}$/;
const nonempty = (s, label) => { if (typeof s !== 'string' || !s.trim()) throw Error(`缺少${label}`); return s; };
const safeLine = (s, label) => { nonempty(s,label); if (/[\r\n]|-->|<!--/.test(s)) throw Error(`${label}须为一行普通文本`); return s; };
const jsonComment = value => JSON.stringify(value).replace(/</g,'\\u003c').replace(/>/g,'\\u003e');

function contextBlock(c) {
  if (!ID.test(c?.id || '') || !['abridgment','excerpt','example'].includes(c.kind) || !Array.isArray(c.uses) || !c.uses.length || c.uses.some(u=>!ID.test(u))) throw Error('语境身份、类型或用法无效');
  if (!Array.isArray(c.sourceUrls)) throw Error('语境须声明sourceUrls');
  if (!Array.isArray(c.paragraphs) || !c.paragraphs.length || c.paragraphs.some(p=>!Array.isArray(p)||!p.length)) throw Error('语境须有完整英文自然段');
  const speakers = {};
  const body = c.paragraphs.map(p=>p.map(s=>{
    if (!ID.test(s?.id || '') || !Array.isArray(s.uses) || s.uses.some(u=>!ID.test(u))) throw Error('语境句子身份或引用无效');
    const en = safeLine(s.text,'完整英文句子');
    if (/^(?:<!--|#|`)/.test(en)) throw Error('语境英文不能夹入结构或译文');
    if (s.translation != null) throw Error('新版不接受逐句翻译；请撰写整份语境translation');
    if (s.speaker) speakers[s.id] = safeLine(s.speaker,'说话者');
    return `<!-- SENTENCE:${s.id}${s.uses.length?' USE:'+s.uses.join(','):''} -->\n${en}`;
  }).join('\n')).join('\n\n');
  const translation = nonempty(c.translation,'整份语境译文').trim();
  if (/<!--|-->/m.test(translation)) throw Error('译文不能包含结构标记');
  const meta = {title:c.title || '',sourceUrls:c.sourceUrls,...(c.displayContext?{displayContext:c.displayContext}:{}),...(Object.keys(speakers).length?{speakers}:{})};
  return `<!-- CONTEXT:${c.id} USE:${c.uses.join(',')} KIND:${c.kind} -->\n<!-- CONTEXT_META:${jsonComment(meta)} -->\n${body}\n<!-- TRANSLATION:${c.id} -->\n${translation}\n<!-- END_CONTEXT:${c.id} -->`;
}

export function assembleUsageContextCollection(words,{expectedWordCount}={}) {
  if (!Array.isArray(words) || !words.length) throw Error('先完成逐词讲解与语境选择');
  const sorted = [...words].sort((a,b)=>a.text.localeCompare(b.text,'en'));
  const contexts = new Map(), choices = new Map();
  for (const w of sorted) {
    const match = [...nonempty(w.partOne,'完整逐词讲解').matchAll(/^<!-- WORD:([^ ]+) -->\r?\n# ([^\r\n]+)$/gm)];
    if (match.length!==1 || match[0][1]!==w.wordId || match[0][2]!==w.text || /<!-- (?:FORMAT|PART):/.test(w.partOne)) throw Error('词头身份与正文不一致');
    if (/<!-- (?:CONTEXT:|CONTEXT_REF:|CONTEXT_META:|SENTENCE:|TRANSLATION:|END_CONTEXT:)/.test(w.partOne)) throw Error('作者讲解只能含CONTEXT_SLOT；语境须来自有证据的contexts对象');
    if (w.partTwo != null) throw Error('新版作者稿不保留独立第二部分');
    if (!Array.isArray(w.contexts) || !Array.isArray(w.contextChoices)) throw Error('作者稿须含contexts与逐义contextChoices');
    for (const c of w.contexts) {
      if (contexts.has(c.id)) throw Error('语境定义重复；自然共享只引用已有对象');
      contexts.set(c.id,{value:c,block:contextBlock(c)});
    }
    for (const choice of w.contextChoices) {
      if (!ID.test(choice?.useId || '') || choices.has(choice.useId) || !Array.isArray(choice.contextIds) || choice.contextIds.length<1 || choice.contextIds.length>5 || new Set(choice.contextIds).size!==choice.contextIds.length) throw Error('逐义须选择1至5份不同语境');
      nonempty(choice.reason,'逐义实际取舍理由');
      if (choice.contextIds.length>1) {
        if (!Array.isArray(choice.contributions) || choice.contributions.length!==choice.contextIds.length || new Set(choice.contributions.map(x=>x.contextId)).size!==choice.contextIds.length) throw Error('保留多份语境须逐份说明独立增量');
        for (const contribution of choice.contributions) {
          if (!choice.contextIds.includes(contribution.contextId)) throw Error('语境增量记录未对应选中候选');
          nonempty(contribution.reason,'多份语境各自不可替代的学习增量');
        }
      }
      if (choice.candidates != null) {
        if (!Array.isArray(choice.candidates) || !choice.candidates.length) throw Error('候选记录如填写须为实际候选');
        for (const candidate of choice.candidates) { nonempty(candidate.id,'候选身份'); nonempty(candidate.decision,'实际候选取舍'); }
      }
      choices.set(choice.useId,{...choice,wordId:w.wordId});
    }
  }
  const emitted = new Set(), slots = new Set();
  const bodies = sorted.map(w=>w.partOne.replace(/^<!-- CONTEXT_SLOT:([^ ]+) -->\s*$/gm,(_,useId)=>{
    const choice = choices.get(useId);
    if (!choice || choice.wordId!==w.wordId) throw Error('语境插槽缺少本词条的实际选择');
    if(slots.has(useId))throw Error('同一用法不能重复设置语境插槽');
    slots.add(useId);
    return choice.contextIds.map(id=>{
      const c = contexts.get(id);
      if (!c || !c.value.uses.includes(useId)) throw Error('所选语境不存在或未声明此用法');
      if (emitted.has(id)) return `<!-- CONTEXT_REF:${id} USE:${useId} -->`;
      emitted.add(id); return c.block;
    }).join('\n\n');
  }));
  if (emitted.size!==contexts.size) throw Error('存在未选用或未就地放置的语境定义；不要装配候选废稿');
  const markdown = `<!-- FORMAT:${USAGE_CONTEXT_FORMAT} -->\n\n${bodies.map(x=>x.trim()).join('\n\n')}\n`;
  const parsed = validateAnnotatedContent(markdown,{expectedWordCount});
  for (const [id,u] of parsed.uses) {
    const choice = choices.get(id);
    if (!choice || choice.wordId!==u.wordId || JSON.stringify([...u.contextIds].sort())!==JSON.stringify([...choice.contextIds].sort())) throw Error(`用法${id}的实际语境与取舍记录不符`);
  }
  if (choices.size!==parsed.uses.size) throw Error('取舍记录含不存在的用法');
  for (const [id,{value:c}] of contexts) {
    if (!Array.isArray(c.sourceEvidence)) throw Error(`语境${id}须保存来源或回退证据`);
    if (c.kind==='example') nonempty(c.fallbackReason,'无法采用更好真实语境的具体原因');
    for (const url of c.sourceUrls) {
      const evidence = c.sourceEvidence.find(e=>e.url===url);
      if (!evidence) throw Error(`语境${id}缺少采用来源的相关原文证据`);
      for (const key of ['readRecord','locator','senseEvidence','changes','publicationBasis']) nonempty(evidence[key],`来源${key}`);
    }
  }
  return {markdown,parsed,contexts:parsed.contexts,contextSources:parsed.contexts.map(c=>({id:c.id,kind:c.kind,sourceUrls:c.sourceUrls})),authoringPolicy:CONTEXT_AUTHORING_POLICY};
}

// A version-bound record of actual review. It is not a semantic proof or a
// replacement for independent source reading and the existing teaching rules.
export const PUBLICATION_REVIEW_POLICY='publication-review-v1';
const sha=s=>typeof s==='string'&&/^[a-f0-9]{64}$/.test(s);
const nonempty=(s,max=8000)=>typeof s==='string'&&!!s.trim()&&s.length<=max;
function sameSet(a,b){return Array.isArray(a)&&a.length===b.length&&new Set(a).size===a.length&&a.every(x=>b.includes(x));}
const subset=(a,b,required=false)=>Array.isArray(a)&&(!required||a.length>0)&&new Set(a).size===a.length&&a.every(x=>b.includes(x));
// Worker uses this small shape/identity check. The signer must additionally run
// loadPublicationReview's complete old/new evidence and affected-USE comparison.
export function validatePublicationReviewBasis(basis,scope,expected){
 if(basis==null)return 'full-v1'; // Existing full records remain unchanged.
 if(!basis||typeof basis!=='object'||Array.isArray(basis))throw Error('出版审阅basis无效');
 if(basis.mode==='full-v1'){if(Object.keys(basis).some(k=>k!=='mode'))throw Error('full审阅basis不能夹带delta继承');return basis.mode;}
 if(basis.mode!=='teaching-delta-v1')throw Error('未知出版审阅basis模式');
 const allowed=['mode','chapterDigest','sourceDigest','evidenceDigest','selectionDigest','reviewDigest','reviewFormat','reviewRecords','deltaReviewDigest','reviewed'];
 if(Object.keys(basis).some(k=>!allowed.includes(k))||allowed.some(k=>!Object.hasOwn(basis,k)))throw Error('delta审阅basis字段不完整或含未知字段');
 for(const key of ['chapterDigest','sourceDigest','evidenceDigest','selectionDigest','reviewDigest','deltaReviewDigest'])if(!sha(basis[key]))throw Error('delta基线或实际审阅摘要无效');
 if(basis.chapterDigest===expected.chapterDigest||basis.selectionDigest!==expected.selectionDigest)throw Error('delta必须从不同正文的同一冻结selection继承');
 if(!['publication-review-v1','legacy-context-reselection-v1'].includes(basis.reviewFormat)||!Array.isArray(basis.reviewRecords))throw Error('delta原全量审阅格式无效');
 const files=new Set();for(const r of basis.reviewRecords){
  if(!r||Object.keys(r).some(k=>!['file','digest','role'].includes(k))||typeof r.file!=='string'||!/^[A-Za-z0-9][A-Za-z0-9._-]{0,140}\.json$/.test(r.file)||files.has(r.file)||!sha(r.digest)||!['use-review','root-corrections','rights-resolution'].includes(r.role))throw Error('delta旧审阅原件引用无效');files.add(r.file);
 }
 if(basis.reviewFormat==='legacy-context-reselection-v1'&&!basis.reviewRecords.some(r=>r.role==='use-review'))throw Error('delta历史全量审阅缺少实际逐义原件');
 const reviewed=basis.reviewed;if(!reviewed||Object.keys(reviewed).some(k=>!['wordIds','useIds','contextIds'].includes(k))||!subset(reviewed.wordIds,scope.wordIds,true)||!subset(reviewed.useIds,scope.useIds,true)||!subset(reviewed.contextIds,scope.contextIds))throw Error('delta本轮实际审阅范围缺项、重复或越界');
 return basis.mode;
}
export function publicationReviewScope(parsed){return {wordIds:parsed.words.map(w=>w.id),useIds:[...parsed.uses.keys()],contextIds:(parsed.contexts||[]).map(c=>c.id)};}
export function publicationReviewDraft({chapter,parsed,runId}){
 return {schemaVersion:1,policy:PUBLICATION_REVIEW_POLICY,state:'draft',runId,studyDate:chapter.date||chapter.sourcePackage.studyDate,chapterDigest:chapter.digest,sourceDigest:chapter.sourceDigest,evidenceDigest:chapter.sourcePackage.evidenceDigest,selectionDigest:chapter.sourcePackage.selectionDigest,scope:publicationReviewScope(parsed),reviewedAt:null,reviewer:{kind:'codex',model:'',effort:'',runReference:''},checks:{sourceCompleteness:'pending',useAndContext:'pending',sourceFidelity:'pending',translation:'pending',wholeReading:'pending'},issues:[],summary:''};
}
export function validatePublicationReview(value,{chapter,parsed,runId,evidence,checkRefs=true}={}){
 if(!value||value.schemaVersion!==1||value.policy!==PUBLICATION_REVIEW_POLICY||value.state!=='complete')throw Error('出版前语义审阅尚未完成');
 const expected={runId,studyDate:chapter.date||chapter.sourcePackage.studyDate,chapterDigest:chapter.digest,sourceDigest:chapter.sourceDigest,evidenceDigest:chapter.sourcePackage.evidenceDigest,selectionDigest:chapter.sourcePackage.selectionDigest};
 for(const [key,want] of Object.entries(expected))if(value[key]!==want||key.endsWith('Digest')&&!sha(value[key]))throw Error('出版审阅与固定'+key+'不一致；返修后须重审受影响范围');
 const scope=publicationReviewScope(parsed);for(const key of Object.keys(scope))if(!sameSet(value.scope?.[key],scope[key]))throw Error('出版审阅范围缺项、重复或跨版');
 validatePublicationReviewBasis(value.basis,scope,expected);
 if(!nonempty(value.reviewedAt,80)||!Number.isFinite(Date.parse(value.reviewedAt))||!/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(value.reviewedAt)||Date.parse(value.reviewedAt)>Date.now()+300000)throw Error('出版审阅时间无效');
 const reviewer=value.reviewer;if(!reviewer||!['codex','human'].includes(reviewer.kind)||!nonempty(reviewer.runReference,500)||reviewer.kind==='codex'&&(!nonempty(reviewer.model,100)||!['low','medium','high','xhigh','max','ultra'].includes(reviewer.effort)))throw Error('出版审阅执行身份无效');
 if(!value.checks||['sourceCompleteness','useAndContext','sourceFidelity','translation','wholeReading'].some(key=>value.checks[key]!=='complete')||!nonempty(value.summary)||!Array.isArray(value.issues))throw Error('出版审阅检查未完成');
 const entries=[...(evidence?.authoring||[]).flatMap(w=>w.material.entries),...(evidence?.originals||[]).map(o=>({id:'read:'+o.record.textDigest,text:o.text})),{id:'chapter:'+chapter.digest,text:chapter.markdown}];
 const seen=new Set();
 for(const issue of value.issues){
  if(!nonempty(issue?.id,100)||seen.has(issue.id)||!['resolved','retained-nonblocking'].includes(issue.state)||!['critical','major','minor','suggestion'].includes(issue.severity)||issue.state==='retained-nonblocking'&&['critical','major'].includes(issue.severity)||!nonempty(issue.disposition)||!Array.isArray(issue.targetIds)||!issue.targetIds.length||issue.targetIds.some(id=>![...scope.wordIds,...scope.useIds,...scope.contextIds].includes(id))||!Array.isArray(issue.refs)||!issue.refs.length)throw Error('出版审阅有未决、无依据或越界的问题');
  seen.add(issue.id);for(const ref of issue.refs)if(!nonempty(ref?.sourceId,300)||!nonempty(ref?.quote,5000)||checkRefs&&!entries.some(e=>e.id===ref.sourceId&&e.text.includes(ref.quote)))throw Error('出版审阅问题引文不在固定资料中');
 }
 return value;
}

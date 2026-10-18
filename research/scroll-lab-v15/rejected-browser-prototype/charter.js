import {OWNER_IDENTITY} from '../../owner-identity.js';
import {assertCharter as assertEvent,identityLines as formatIdentity} from '../chapter-scroll-v11/charter.js';
import {roman} from '../chapter-scroll-v10/charter.js';
import {getTemplate} from './templates.js';
export const EDITION='SL-MEMENTO-15';
const hash=async text=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text)))].map(n=>n.toString(16).padStart(2,'0')).join('');
export function assertCharter(r){
 assertEvent(r);const t=getTemplate(r.template),p=r.artPlan;
 if(r.sealVariant!=='oblong'||!p||p.schema!=='second-language.art-plan.v1'||p.source.chapterId!==r.chapterId||p.source.chapterDigest!==r.chapterDigest||p.source.chapterNumber!==r.chapterNumber||p.copy.chapterEnglishTitle!==r.displayTitle||p.resources.ornament.sha256!==t.ornamentDigest||r.artPlanDigest!==t.planDigest)throw Error('Chapter artwork and record do not match');
 return r;
}
export function charterCopy(r){
 assertCharter(r);const name=r.status==='issued'?r.attestation.recipientName:OWNER_IDENTITY.displayName,chapter=`Chapter ${roman(r.chapterNumber)}`,p=r.artPlan.copy;
 return {institution:'The Second Language',chapter,title:p.artTitle,titleLines:p.artTitleLines,chapterTitle:r.displayTitle,recipient:name,
  stanzas:p.stanzas,paragraphs:p.stanzas.map(lines=>lines.join('\n')),
  colophon:[`For ${name}, in remembrance of ${chapter}`,'and its trial successfully completed.'],
  sealLegends:['The Second Language','In remembrance'],note:r.status==='issued'?'':'Specimen — Not issued',issued:r.status==='issued'};
}
export function digestPayload(r){
 const c=charterCopy(r),a=r.attestation,t=getTemplate(r.template);
 return JSON.stringify(['second-language.memento.v3',r.status,r.chapterId,r.chapterNumber,r.chapterDigest,r.chapterTitle,r.displayTitle,OWNER_IDENTITY.id,c.recipient,
  a?.id??null,a?.attemptId??null,a?.assessmentVersion??null,a?.allCorrect??null,new Date(a?.passedAt??r.proof.sampleTime).toISOString(),
  EDITION,r.template,r.artPlanDigest,t.ornamentDigest,r.sealVariant,c.institution,c.chapter,c.title,c.chapterTitle,c.stanzas,c.colophon,c.sealLegends,c.note]);
}
export async function prepareCharter(r,planText){
 const artPlanDigest=await hash(planText),base={...r,artPlan:JSON.parse(planText),artPlanDigest};assertCharter(base);
 if(base.artPlan.copy.artTitleLines.join(' ')!==base.artPlan.copy.artTitle)throw Error('Artistic title line breaks do not match title');
 const canonicalPayload=digestPayload(base);return {...base,canonicalPayload,artifactDigest:await hash(canonicalPayload),recipient:charterCopy(base).recipient};
}
export function identityLines(r){assertCharter(r);return formatIdentity(r);}

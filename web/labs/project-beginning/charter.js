import {OWNER_IDENTITY} from '../../owner-identity.js';
import {getTemplate} from './templates.js';

export const EDITION='SL-PROJECT-BEGINNING-1';
export const CATEGORY='project-commemorative';
const hex=/^[0-9a-f]{64}$/;
const utcMilliseconds=/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
const digest=async text=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text)))].map(n=>n.toString(16).padStart(2,'0')).join('');

// Identity uses sorted UTF-8 JSON. The making instant is fixed, but publication
// is a later event and does not alter the content mark of this draft work.
export function canonicalJSON(value){
 if(value===null||typeof value==='string'||typeof value==='boolean')return JSON.stringify(value);
 if(typeof value==='number'){if(!Number.isFinite(value))throw Error('Non-finite content value');return JSON.stringify(value);}
 if(Array.isArray(value))return '['+value.map(canonicalJSON).join(',')+']';
 if(value&&typeof value==='object')return '{'+Object.keys(value).sort().map(key=>JSON.stringify(key)+':'+canonicalJSON(value[key])).join(',')+'}';
 throw Error('Unsupported content value');
}
export function assertCharter(r){
 if(!r||r.schema!=='second-language.project-commemorative.v1'||r.category!==CATEGORY||r.status!=='commemorative'||r.attestation!==null)throw Error('A project keepsake requires its own non-assessment identity');
 if(r.workId!=='SL-PROJECT-BEGINNING-20261021'||r.recipient!=='Gual Wells'||r.recipient!==OWNER_IDENTITY.displayName||r.ownerId!==OWNER_IDENTITY.id)throw Error('Project keepsake identity mismatch');
 for(const key of ['chapterId','chapterNumber','chapterDigest','chapterTitle','foundedAt','certifiedAt','passedAt'])if(Object.hasOwn(r,key))throw Error('A project keepsake is neither a chapter assessment nor a founding-date claim');
 if(r.projectFoundedAt!==null)throw Error('The project founding instant remains unknown');
 if(!utcMilliseconds.test(r.madeAt)||new Date(r.madeAt).toISOString()!==r.madeAt)throw Error('A fixed UTC making record is required');
 if(r.publishedAt!==null&&(!utcMilliseconds.test(r.publishedAt)||new Date(r.publishedAt).toISOString()!==r.publishedAt))throw Error('Invalid publication time');
 if(!r.source||!/^[0-9a-f]{40}$/.test(r.source.mainSHA)||!hex.test(r.source.artDirectionSHA256)||!r.source.userCommission?.basis)throw Error('Missing source or commissioning basis');
 const template=getTemplate(r.template);
 const p=r.artPlan;
 if(r.sealVariant!=='oblong'||!p||p.schema!=='second-language.project-art-plan.v1'||p.category!==CATEGORY||p.workId!==r.workId||p.source.mainSHA!==r.source.mainSHA||p.source.artDirectionSHA256!==r.source.artDirectionSHA256)throw Error('Project art plan and making record do not match');
 if(p.layout.width!==2048||p.layout.height!==2868||canonicalJSON(p.layout.nominalSizeMM)!=='[300,420]')throw Error('Unexpected project paper proportions');
 if(canonicalJSON(p.layout.paperFolds)!==canonicalJSON(template.paperFolds)||canonicalJSON(p.layout.microstructure)!==canonicalJSON(template.paperMicrostructure))throw Error('The recorded trial material profile and actual renderer template differ');
 if(p.copy.institution!=='The Second Language'||p.copy.artTitle!=='A Day in Another Tongue'||p.copy.rubric!=='A project remembrance'||p.copy.verse.length!==5||p.copy.colophon.length!==2||p.copy.sealLegends.join('|')!=='The Second Language|In remembrance'||p.copy.status!=='Private commemorative work')throw Error('The fixed commemorative inscription has changed');
 if(p.copy.translation.verse.length!==5||p.copy.translation.colophon.length!==2)throw Error('The complete translation is required');
 for(const resource of Object.values(p.resources))if(resource.sha256!==null&&!hex.test(resource.sha256))throw Error('Resource SHA-256 is malformed');
 return r;
}
export function charterCopy(r){
 assertCharter(r);const c=r.artPlan.copy;
 return {institution:c.institution,title:c.artTitle,titleLines:[c.artTitle],rubric:c.rubric,recipient:r.recipient,
  verse:c.verse,paragraphs:[c.verse.join('\n')],colophon:c.colophon,sealLegends:c.sealLegends,
  note:c.status,translation:c.translation,labels:c.labels,presentation:'private-commemorative-work',issued:false};
}
export function digestPayload(r){
 assertCharter(r);return canonicalJSON({schema:'second-language.project-content.v1',edition:EDITION,category:r.category,
  workId:r.workId,status:r.status,ownerId:r.ownerId,recipient:r.recipient,madeAt:r.madeAt,
  projectFoundedAt:null,attestation:r.attestation,source:r.source,template:r.template,sealVariant:r.sealVariant,artPlan:r.artPlan});
}
export async function prepareCharter(record,planText){
 const artPlan=typeof planText==='string'?JSON.parse(planText):planText,base={...record,artPlan};assertCharter(base);
 const canonicalPayload=digestPayload(base),contentDigest=await digest(canonicalPayload);
 return {...base,artPlanDigest:await digest(canonicalJSON(artPlan)),canonicalPayload,artifactDigest:contentDigest,contentDigest,
  proof:{kind:'making-record',madeAt:base.madeAt,projectFoundedAt:null,attestation:null}};
}
export function identityLines(r){
 assertCharter(r);if(!hex.test(r.contentDigest||''))throw Error('Prepare the content identity before typesetting');
 const parts=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Shanghai',day:'2-digit',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit',fractionalSecondDigits:3,hourCycle:'h23'}).formatToParts(new Date(r.madeAt)).map(({type,value})=>[type,value]));
 return [`${r.artPlan.copy.labels.contentMark.en} ${r.contentDigest.slice(0,16).toUpperCase().match(/.{4}/g).join(' ')}`,
  `${r.artPlan.copy.labels.made.en} ${parts.day} ${parts.month} ${parts.year}`,
  `${parts.hour}:${parts.minute}:${parts.second}.${parts.fractionalSecond} +08:00`];
}
export function exportRecord(r){
 assertCharter(r);return {schema:r.schema,category:r.category,workId:r.workId,status:r.status,recipient:r.recipient,
  madeAt:r.madeAt,publishedAt:r.publishedAt,projectFoundedAt:null,attestation:null,issued:false,
  source:r.source,template:r.template,sha256:r.contentDigest,contentDigest:r.contentDigest,artPlanDigest:r.artPlanDigest,
  canonicalization:'sorted-key UTF-8 JSON; publication time excluded',canonicalPayload:r.canonicalPayload,
  copy:r.artPlan.copy,resources:r.artPlan.resources};
}

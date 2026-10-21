import {OWNER_IDENTITY} from '../../owner-identity.js';
import {roman} from '../chapter-scroll-v10/charter.js';
export const EDITION='SL-CHARTER-11';
const paragraphs=name=>[
 `Be it known that ${name} has passed the prescribed examination for the chapter herein named, having answered every question correctly.`,
 `In recognition of this attainment, The Second Language grants this charter unto ${name}, to stand in its permanent record as a memorial of the achievement.`,
 'In witness whereof, this charter bears the mark of The Second Language.'
];
function validInstant(s){
 if(typeof s!=='string'||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}(Z|[+-]\d{2}:\d{2})$/.test(s))return false;
 const z=s.slice(23),hours=z==='Z'?0:Number(z.slice(1,3)),minutes=z==='Z'?0:Number(z.slice(4,6));
 if(hours>14||minutes>59||(hours===14&&minutes!==0))return false;
 const ms=Date.parse(s),offset=z==='Z'?0:(z[0]==='+'?1:-1)*(hours*60+minutes);
 return Number.isFinite(ms)&&new Date(ms+offset*60000).toISOString().slice(0,23)===s.slice(0,23);
}
export function assertCharter(r){
 if(!r||!['specimen','issued'].includes(r.status)||!r.chapterId||!Number.isSafeInteger(r.chapterNumber)||r.chapterNumber<1||!r.displayTitle?.trim()||!/^[a-f0-9]{64}$/.test(r.chapterDigest))throw Error('Invalid charter identity');
 if(r.status==='specimen'){
  if(r.attestation!==null||!validInstant(r.proof?.sampleTime))throw Error('Proof requires a separate sample timestamp and no attestation');
 }else{
  const a=r.attestation;
  if(r.proof||!a||!a.id||!a.attemptId||!a.assessmentVersion||a.allCorrect!==true||!validInstant(a.passedAt)||a.recipientId!==OWNER_IDENTITY.id||typeof a.recipientName!=='string'||!a.recipientName.trim()||a.recipientName.length>120)throw Error('Issued charter requires the immutable passing event and recipient snapshot');
 }
 return r;
}
export function charterCopy(r){
 assertCharter(r);const issued=r.status==='issued',name=issued?r.attestation.recipientName:OWNER_IDENTITY.displayName;
 return {institution:'The Second Language',heading:'Charter of Attainment',recipient:name,address:'Granted unto',chapter:`Chapter ${roman(r.chapterNumber)}`,title:r.displayTitle,
  paragraphs:paragraphs(name),recordLabel:'Record',sealLegends:['The','Second','Language','Attested'],note:issued?'':'Specimen — Not issued',issued,
  presentation:issued?'issued':'dated-design-proof',edition:EDITION};
}
// This restricted, versioned positional array is the canonical byte format.
// It avoids object-key-order ambiguity; it is NOT a general JCS implementation.
export function digestPayload(r){
 const c=charterCopy(r),a=r.attestation;
 return JSON.stringify(['second-language.charter.v1',r.status,r.chapterId,r.chapterNumber,r.chapterDigest,r.displayTitle,OWNER_IDENTITY.id,c.recipient,
  a?.id??null,a?.attemptId??null,a?.assessmentVersion??null,a?.allCorrect??null,
  new Date(a?.passedAt??r.proof.sampleTime).toISOString(),EDITION,r.template,c.institution,c.heading,c.address,c.chapter,c.recordLabel,c.paragraphs,c.sealLegends,c.note]);
}
export async function prepareCharter(r){
 assertCharter(r);const payload=digestPayload(r),bytes=new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(payload))),digest=[...bytes].map(n=>n.toString(16).padStart(2,'0')).join('');
 return {...r,artifactDigest:digest,canonicalPayload:payload,recipient:charterCopy(r).recipient};
}
export function identityLines(r){
 assertCharter(r);if(!/^[a-f0-9]{64}$/.test(r.artifactDigest))throw Error('Prepare the charter before rendering its digest');
 const d=new Date(r.attestation?.passedAt??r.proof.sampleTime),p=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Shanghai',year:'numeric',month:'long',day:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(d).map(x=>[x.type,x.value]));
 return [r.artifactDigest.slice(0,16).toUpperCase().match(/.{4}/g).join(' '),`${p.day} ${p.month} ${p.year}`,`${p.hour}:${p.minute}:${p.second}.${String(d.getUTCMilliseconds()).padStart(3,'0')}  +08:00`];
}

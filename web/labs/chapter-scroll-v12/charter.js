import {OWNER_IDENTITY} from '../../owner-identity.js';
import {assertCharter as assertEvent,identityLines as formatIdentity} from '../chapter-scroll-v11/charter.js';
import {roman} from '../chapter-scroll-v10/charter.js';
import {getTemplate} from './templates.js';
export const EDITION='SL-MEMENTO-12';
export function assertCharter(r){assertEvent(r);getTemplate(r.template);if(!['oblong','round'].includes(r.sealVariant))throw Error('Unknown impression variant');return r;}
export function charterCopy(r){
 assertCharter(r);const name=r.status==='issued'?r.attestation.recipientName:OWNER_IDENTITY.displayName,chapter=`Chapter ${roman(r.chapterNumber)}`;
 return {institution:'The Second Language',chapter,title:r.displayTitle,recipient:name,
  paragraphs:['Upon the map, a river lies in ink.','Beyond the ink, rain gathers, roots hold, and the water finds its course.'],
  colophon:`For ${name}, in remembrance of ${chapter} and its trial successfully completed.`,
  sealLegends:r.sealVariant==='round'?['The Second Language','SL','In remembrance']:['The Second Language','In remembrance'],
  note:r.status==='issued'?'':'Specimen — Not issued',presentation:r.status==='issued'?'issued':'dated-art-proof',issued:r.status==='issued'};
}
export function digestPayload(r){
 const c=charterCopy(r),a=r.attestation,t=getTemplate(r.template);
 return JSON.stringify(['second-language.memento.v2',r.status,r.chapterId,r.chapterNumber,r.chapterDigest,r.displayTitle,OWNER_IDENTITY.id,c.recipient,
  a?.id??null,a?.attemptId??null,a?.assessmentVersion??null,a?.allCorrect??null,new Date(a?.passedAt??r.proof.sampleTime).toISOString(),
  EDITION,r.template,t.ornamentDigest,r.sealVariant,c.institution,c.chapter,c.title,c.paragraphs,c.colophon,c.sealLegends,c.note]);
}
export async function prepareCharter(r){
 assertCharter(r);const payload=digestPayload(r),bytes=new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(payload))),digest=[...bytes].map(n=>n.toString(16).padStart(2,'0')).join('');
 return {...r,artifactDigest:digest,canonicalPayload:payload,recipient:charterCopy(r).recipient};
}
export function identityLines(r){assertCharter(r);return formatIdentity(r);}

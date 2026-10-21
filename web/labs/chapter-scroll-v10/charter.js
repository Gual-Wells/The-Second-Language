// Presentation contract only. The production certification authority is not
// enabled by this lab and a printed seal is not a cryptographic signature.
function validInstant(s){
 if(typeof s!=='string'||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}(Z|[+-]\d{2}:\d{2})$/.test(s))return false;
 const ms=Date.parse(s);if(!Number.isFinite(ms))return false;
 const z=s.slice(23),offset=z==='Z'?0:(z[0]==='+'?1:-1)*(Number(z.slice(1,3))*60+Number(z.slice(4,6)));
 return new Date(ms+offset*60000).toISOString().slice(0,23)===s.slice(0,23);
}
export function assertCharter(record){
 if(!record||!['specimen','issued'].includes(record.status))throw Error('Unknown charter state');
 if(!record.chapterId||!Number.isSafeInteger(record.chapterNumber)||record.chapterNumber<1||!record.displayTitle?.trim()||!/^[a-f0-9]{64}$/.test(record.chapterDigest))throw Error('Missing immutable chapter identity');
 if(record.status==='specimen'){
  if(record.attestation!==null)throw Error('Unissued specimen must not contain an attestation');return record;
 }
 const a=record.attestation;
 if(!a||a.allCorrect!==true||!a.attemptId||!a.assessmentVersion||!a.id||!/^[A-F0-9]{16}$/.test(a.publicCode)||!validInstant(a.passedAt))throw Error('Issued charter requires the recorded passing event');
 return record;
}
export function roman(value){const map=[[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];if(value>3999)return String(value);let out='';for(const [n,s]of map)while(value>=n){out+=s;value-=n;}return out;}
export function identityLines(record){
 assertCharter(record);if(record.status==='specimen')return ['UNISSUED SPECIMEN'];
 const a=record.attestation,d=new Date(a.passedAt),parts=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(d).map(x=>[x.type,x.value]));
 return [a.publicCode.match(/.{4}/g).join(' '),`${parts.year}-${parts.month}-${parts.day}  ${parts.hour}:${parts.minute}:${parts.second}.${String(d.getUTCMilliseconds()).padStart(3,'0')}  +08:00`];
}
// This lab presents the intended formal wording inside a conspicuously
// unissued specimen. It does not create an event, a name, a date or a code.
export function charterCopy(record){
 assertCharter(record);const issued=record.status==='issued';
 return {institution:'The Second Language',heading:'Certificate of Attainment',chapter:`Chapter ${roman(record.chapterNumber)}`,title:record.displayTitle,
  paragraphs:[
   'Be it known that the learner has duly passed the examination for the chapter herein named, having answered every question correctly.',
   'In recognition of this attainment, The Second Language hereby grants this certificate, to be preserved in its permanent record.',
   'In witness whereof, this certificate is issued under the seal of The Second Language.'
  ],
  identity:issued?identityLines(record):[],note:issued?'':'Specimen — Not issued',
  sealLegends:['The Second Language','Attestation'],issued,presentation:issued?'issued':'unissued-formal-proof'};
}

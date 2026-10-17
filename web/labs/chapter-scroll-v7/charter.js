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
 if(!record.themeParagraph?.trim()||record.themeParagraph.split(/\s+/).length>65)throw Error('Chapter remembrance needs editorial review');
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
export function charterCopy(record){
 assertCharter(record);const issued=record.status==='issued';
 return {institution:'The Second Language',heading:'Be it remembered',chapter:`Chapter ${roman(record.chapterNumber)}`,title:record.displayTitle,
  paragraphs:[record.themeParagraph,issued?'The learner answered every question correctly in the assessment preserved with this record. This first attestation concerns that assessment alone.':'This leaf presents the chapter’s attestation in specimen form. It awaits the first successful assessment and grants no certification.',
   'May understanding endure beyond this page and find use in speech and writing.'],
  witness:issued?'In witness of this record':'In the form of attestation',issuer:'The Second Language',identity:identityLines(record),note:issued?'The first attestation, kept in the record.':'A specimen, not an issued record.'};
}

// Read-only crosscheck of an ACTUAL producer directory against the service
// contract. Specimens remain unissued and no certification/database is created.
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {validateScrollPackage} from '../worker/src/scrolls.js';
const directory=path.resolve(process.argv[2]||''),sha=b=>createHash('sha256').update(b).digest('hex'),parse=async name=>JSON.parse(await readFile(path.join(directory,name),'utf8'));
if(!process.argv[2])throw Error('Supply an actual producer directory containing package.json');
const manifest=await parse('package.json'),job=await parse('job.json'),files=new Map();
for(const file of manifest.files){const target=path.resolve(directory,file.path);if(!target.startsWith(directory+path.sep))throw Error('Unsafe package path');const bytes=await readFile(target);if(sha(bytes)!==file.digest||bytes.length!==file.bytes)throw Error('Actual file differs from package: '+file.path);files.set(file.digest,bytes);}
for(const [name,digest] of [['candidate.json',manifest.candidateDigest],['review.json',manifest.reviewDigest]]){const bytes=await readFile(path.join(directory,name));if(sha(bytes)!==digest)throw Error('Actual '+name+' differs from package');files.set(digest,bytes);}
const specimen=manifest.certificationId===null,cert=specimen?{id:null,recipientId:manifest.recipientId,recipientName:manifest.viewer.record.recipient,chapterId:job.chapter.id,chapterDigest:job.chapter.digest,chapterNumber:job.chapter.number,passedAt:null}:job.certification;
await validateScrollPackage({async getContent(digest){return files.has(digest)?new Response(files.get(digest)):null;}},manifest,cert,null,{specimen});
console.log(JSON.stringify({ok:true,directory,scope:specimen?'unissued-specimen':'read-only-certified-package',databaseWritten:false,issued:false,contentSHA:manifest.contentSHA,candidateDigest:manifest.candidateDigest,reviewDigest:manifest.reviewDigest,files:manifest.files.length,archiveVolumes:manifest.files.filter(f=>f.role==='archive').length,maxArchiveBytes:Math.max(...manifest.files.filter(f=>f.role==='archive').map(f=>f.bytes)),producerMetadata:'declared execution evidence, not cryptographic model proof',artisticAcceptance:'independent review retained; user acceptance remains separate'},null,2));

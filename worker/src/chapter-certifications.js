import {chapterTestPolicy} from '../../protocol/chapter-test-contract.mjs';
import {OWNER_IDENTITY} from '../../web/owner-identity.js';
export const recipient=Object.freeze({id:OWNER_IDENTITY.id,name:OWNER_IDENTITY.displayName});
export const certificationView=r=>r?{id:r.id,recipientId:r.recipient_id,recipientName:r.recipient_name,chapterId:r.chapter_id,chapterDigest:r.chapter_digest,chapterNumber:r.chapter_number,chapterTitle:r.chapter_title,attemptId:r.attempt_id,assessmentVersion:r.assessment_version,paperDigest:r.paper_digest,resultDigest:r.result_digest,passedAt:new Date(r.passed_at).toISOString()}:null;
export async function certificationFor(db,chapterId){return certificationView(await db.prepare('SELECT * FROM chapter_certifications WHERE recipient_id=? AND chapter_id=?').bind(recipient.id,chapterId).first());}
// Add this statement to the SAME D1 batch that commits the final grade. It can
// only observe the winning immutable result and a fully resolved current paper.
export function firstPassStatement(db,row,paper,result,resultDigest,passedAt){
 if(row.certification_eligible!==1||row.is_validation!==0||row.policy!==chapterTestPolicy||paper.policy!==chapterTestPolicy||paper.items.length!==20||paper.items.filter(q=>q.type==='oral').length!==7||result.right!==20||result.total!==20||result.score!==100||!result.passed||result.details.length!==20||result.details.some(d=>d.ok!==true||d.oral&&d.oral.state!=='resolved'))return null;
 return db.prepare(`INSERT OR IGNORE INTO chapter_certifications(id,recipient_id,recipient_name,chapter_id,chapter_digest,chapter_number,chapter_title,attempt_id,assessment_version,paper_digest,result_digest,passed_at)
 SELECT ?,?,?,t.chapter_id,t.chapter_digest,r.number,r.title,t.id,t.policy,t.paper_digest,t.result_digest,?
 FROM chapter_tests t JOIN chapter_revisions r ON r.chapter_id=t.chapter_id AND r.digest=t.chapter_digest
 WHERE t.id=? AND t.status='submitted' AND t.result_digest=? AND t.certification_eligible=1 AND t.is_validation=0
 AND EXISTS(SELECT 1 FROM chapter_sources s WHERE s.digest=t.chapter_digest AND s.policy='current-affairs-v1')`)
 .bind(crypto.randomUUID(),recipient.id,recipient.name,passedAt,row.id,resultDigest);
}

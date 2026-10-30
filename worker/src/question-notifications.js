import {rawPayload,sendPushNotification} from '@mmmike/web-push/send';
const eligible=`EXISTS(SELECT 1 FROM auth_control c WHERE c.id=1 AND c.epoch=o.epoch)
 AND EXISTS(SELECT 1 FROM chapter_messages a JOIN chapter_messages q ON q.id=a.reply_to JOIN chapter_conversations t ON t.id=q.conversation_id
 WHERE q.id=o.message_id AND a.role='assistant' AND a.seq>t.seen_seq)`;
export function questionReplyStatement(db,messageId,now){
 return db.prepare(`INSERT OR IGNORE INTO question_push_outbox(message_id,subscription_id,epoch,created_at)
 SELECT j.id,s.id,c.epoch,? FROM chapter_question_jobs j JOIN chapter_messages q ON q.id=j.id
 JOIN chapter_conversations t ON t.id=q.conversation_id JOIN auth_control c ON c.id=1 CROSS JOIN push_subscriptions s
 WHERE j.id=? AND j.status='answered' AND j.updated_at=?
 AND EXISTS(SELECT 1 FROM chapter_messages a WHERE a.reply_to=q.id AND a.role='assistant' AND a.seq>t.seen_seq)`)
 .bind(now,messageId,now);
}
export async function sendQuestionReplies(env,{deliver}={}){
 if(!env.VAPID_PUBLIC_KEY||!env.VAPID_PRIVATE_KEY||!env.VAPID_SUBJECT)return {configured:false,sent:0};
 const db=env.DB,now=Date.now();
 await db.prepare(`DELETE FROM question_push_outbox AS o WHERE created_at<? OR NOT (${eligible})`).bind(now-30*86400000).run();
 const {results}=await db.prepare(`SELECT o.*,s.endpoint,s.p256dh,s.auth,t.chapter_id,t.chapter_digest
 FROM question_push_outbox o JOIN push_subscriptions s ON s.id=o.subscription_id
 JOIN chapter_messages q ON q.id=o.message_id JOIN chapter_conversations t ON t.id=q.conversation_id
 WHERE o.sent_at IS NULL AND o.attempts<4 AND (o.claim_at IS NULL OR o.claim_at<?) AND ${eligible}
 ORDER BY o.created_at LIMIT 12`).bind(now-120000).all();let sent=0;
 for(const row of results){
  const claim=await db.prepare(`UPDATE question_push_outbox AS o SET claim_at=?,attempts=attempts+1
   WHERE message_id=? AND subscription_id=? AND sent_at IS NULL AND attempts<4 AND (claim_at IS NULL OR claim_at<?) AND ${eligible}`)
   .bind(now,row.message_id,row.subscription_id,now-120000).run();if(!claim.meta.changes)continue;
  const payload={questionId:row.message_id,chapterId:row.chapter_id,digest:row.chapter_digest,
   title:'第二语言 · 答疑已回复',body:'打开章节答疑，查看完整回复。',tag:'second-language-question-'+row.message_id};
  try{
   const ok=deliver?await deliver(row,payload):await sendPushNotification({endpoint:row.endpoint,keys:{p256dh:row.p256dh,auth:row.auth}},rawPayload(JSON.stringify(payload)),
    {publicKey:env.VAPID_PUBLIC_KEY,privateKey:env.VAPID_PRIVATE_KEY,subject:env.VAPID_SUBJECT},{ttl:3600,urgency:'normal',timeoutMs:10000});
   if(ok){await db.prepare('UPDATE question_push_outbox SET sent_at=?,claim_at=NULL WHERE message_id=? AND subscription_id=?').bind(Date.now(),row.message_id,row.subscription_id).run();sent++;}
   else await db.batch([db.prepare('DELETE FROM question_push_outbox WHERE subscription_id=?').bind(row.subscription_id),db.prepare('DELETE FROM push_subscriptions WHERE id=?').bind(row.subscription_id)]);
  }catch{await db.prepare('UPDATE question_push_outbox SET claim_at=NULL WHERE message_id=? AND subscription_id=?').bind(row.message_id,row.subscription_id).run();}
 }
 return {configured:true,sent};
}

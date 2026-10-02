import { sessionFor } from './auth.js';

const json = (value, status = 200) => new Response(JSON.stringify(value), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
const safeId = value => typeof value === 'string' && /^[A-Za-z0-9._:-]{1,110}$/.test(value);
const textField = (value, max) => typeof value === 'string' && value.trim().length > 0 && value.length <= max;
const constantEqual = (a, b) => {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return diff === 0;
};
const now = () => Date.now();
const body = async request => {
  if (Number(request.headers.get('content-length') || 0) > 1000000) throw new Error('请求过大');
  const raw = await request.text();
  if (raw.length > 1000000) throw new Error('请求过大');
  return JSON.parse(raw);
};
const publicQuestion = row => ({ id: row.id, setId: row.set_id, position: row.position, kind: row.kind, part: row.part, prompt: row.prompt, guidance: row.guidance, links: JSON.parse(row.links || '[]'), revealed: Boolean(row.revealed_at), ...(row.revealed_at ? { referenceAnswer: row.reference_answer, referenceNotes: row.reference_notes } : {}) });

export async function practiceRoute(request, env, publisher) {
  const url = new URL(request.url), path = url.pathname;
  if (!env.PRACTICE_DB) return json({ error: '表达练习数据库尚未配置' }, 503);
  const db = env.PRACTICE_DB;
  const isPublisher = publisher(request, env);
  const session = await sessionFor(request, env);
  const bearer = request.headers.get('authorization')?.match(/^Bearer (.+)$/)?.[1];
  const isReader = Boolean(env.PRACTICE_READ_TOKEN && constantEqual(bearer, env.PRACTICE_READ_TOKEN));
  if (!session && !isPublisher && !isReader) return json({ error: '请先登录' }, 401);
  const sameOrigin = request.headers.get('origin') === env.APP_ORIGIN;

  if (path === '/api/practice' && request.method === 'GET') {
    const chapter = url.searchParams.get('chapter');
    if (chapter && !safeId(chapter)) return json({ error: '章节编号无效' }, 400);
    const { results: sets } = chapter
      ? await db.prepare(`SELECT s.id,s.title,s.introduction,s.created_at AS createdAt,r.focus_chapter_id AS focusChapterId
        FROM practice_sets s JOIN practice_requests r ON r.id=s.request_id JOIN practice_sources x ON x.set_id=s.id
        WHERE x.chapter_id=? ORDER BY s.created_at DESC`).bind(chapter).all()
      : await db.prepare(`SELECT s.id,s.title,s.introduction,s.created_at AS createdAt,r.focus_chapter_id AS focusChapterId
        FROM practice_sets s JOIN practice_requests r ON r.id=s.request_id ORDER BY s.created_at DESC LIMIT 100`).all();
    const active = await db.prepare(`SELECT id,focus_chapter_id AS focusChapterId,status,created_at AS createdAt FROM practice_requests
      WHERE status IN ('queued','building') ORDER BY created_at DESC LIMIT 1`).first();
    return json({ sets, active });
  }

  if (path === '/api/practice/index' && request.method === 'GET') {
    const chapter = url.searchParams.get('chapter') || null;
    const use = url.searchParams.get('use') || null;
    const kind = url.searchParams.get('kind') || null;
    const status = url.searchParams.get('status') || null;
    const term = (url.searchParams.get('q') || '').trim();
    if ((chapter && !safeId(chapter)) || (use && !/^U\d{3}(?:_\d{3})?$/.test(use)) ||
      (kind && !['speaking','writing'].includes(kind)) ||
      (status && !['unanswered','pending','reviewing','reviewed','failed'].includes(status)) || term.length > 100)
      return json({ error: '检索条件无效' }, 400);
    const { results } = await db.prepare(`SELECT q.id,q.set_id AS setId,q.kind,q.part,q.prompt,s.title AS setTitle,
      r.focus_chapter_id AS focusChapterId,
      (SELECT a.status FROM practice_attempts a WHERE a.question_id=q.id ORDER BY a.submitted_at DESC LIMIT 1) AS lastStatus
      FROM practice_questions q JOIN practice_sets s ON s.id=q.set_id JOIN practice_requests r ON r.id=s.request_id
      WHERE (? IS NULL OR q.kind=?)
      AND (? IS NULL OR EXISTS (SELECT 1 FROM practice_links l WHERE l.question_id=q.id AND l.chapter_id=?))
      AND (? IS NULL OR EXISTS (SELECT 1 FROM practice_links l WHERE l.question_id=q.id AND l.use_id=?))
      AND (?='' OR q.prompt LIKE ? OR s.title LIKE ?)
      ORDER BY s.created_at DESC,q.position LIMIT 300`)
      .bind(kind,kind,chapter,chapter,use,use,term,`%${term}%`,`%${term}%`).all();
    return json({ questions: status ? results.filter(item => status === 'unanswered' ? !item.lastStatus : item.lastStatus === status) : results });
  }

  if (path === '/api/practice/requests' && request.method === 'POST') {
    if (!session || !sameOrigin) return json({ error: '来源不允许' }, 403);
    const value = await body(request);
    if (value.focusChapterId != null && !safeId(value.focusChapterId)) return json({ error: '焦点章节无效' }, 400);
    if (value.note != null && (typeof value.note !== 'string' || value.note.length > 1000)) return json({ error: '练习需求过长' }, 400);
    const active = await db.prepare("SELECT id FROM practice_requests WHERE status IN ('queued','building') LIMIT 1").first();
    if (active) return json({ error: '已有表达练习正在建设', requestId: active.id }, 409);
    const { results } = await env.DB.prepare(`SELECT p.chapter_id AS id,p.study_date AS date,p.digest FROM published_chapters p ORDER BY p.study_date`).all();
    if (!results.length) return json({ error: '尚无正式章节' }, 409);
    const focus = value.focusChapterId ? results.find(item => item.id === value.focusChapterId) : results.at(-1);
    if (!focus) return json({ error: '焦点章节未发布' }, 404);
    const id = crypto.randomUUID(), stamp = now();
    await db.prepare(`INSERT INTO practice_requests(id,focus_chapter_id,focus_digest,source_json,note,status,created_at,updated_at)
      VALUES(?,?,?,?,?,'queued',?,?)`).bind(id, focus.id, focus.digest, JSON.stringify(results), (value.note || '').trim(), stamp, stamp).run();
    return json({ id, status: 'queued', focusChapterId: focus.id, sourceCount: results.length }, 201);
  }

  if (path === '/api/practice/publisher/next' && request.method === 'GET') {
    if (!isPublisher) return json({ error: '发布身份无效' }, 401);
    const row = await db.prepare(`SELECT * FROM practice_requests WHERE status='queued' OR (status='building' AND claim_at<?)
      ORDER BY created_at LIMIT 1`).bind(now() - 21600000).first();
    return json({ request: row ? { id: row.id, focusChapterId: row.focus_chapter_id, focusDigest: row.focus_digest, sources: JSON.parse(row.source_json), note: row.note, status: row.status } : null });
  }

  const sourceMatch = path.match(/^\/api\/practice\/publisher\/sources\/([A-Za-z0-9._:-]+)\/([0-9a-f]{64})$/);
  if (sourceMatch && request.method === 'GET') {
    if (!isPublisher) return json({ error: '发布身份无效' }, 401);
    const row = await env.DB.prepare('SELECT content_key FROM chapter_revisions WHERE chapter_id=? AND digest=?').bind(sourceMatch[1],sourceMatch[2]).first();
    if (!row) return json({ error: '固定版本章节不存在' }, 404);
    const markdown = await env.CHAPTERS.get(row.content_key);
    return markdown == null ? json({ error: '固定版本正文暂不可用' }, 503) : json({ id: sourceMatch[1], digest: sourceMatch[2], markdown });
  }

  if (path === '/api/practice/publisher/claim' && request.method === 'POST') {
    if (!isPublisher) return json({ error: '发布身份无效' }, 401);
    const value = await body(request);
    if (!safeId(value.id)) return json({ error: '申请编号无效' }, 400);
    const token = crypto.randomUUID(), stamp = now();
    const changed = await db.prepare(`UPDATE practice_requests SET status='building',claim_token=?,claim_at=?,updated_at=?
      WHERE id=? AND (status='queued' OR (status='building' AND claim_at<?))`)
      .bind(token, stamp, stamp, value.id, stamp - 21600000).run();
    if (!changed.meta.changes) return json({ error: '申请已被领取或不存在' }, 409);
    const row = await db.prepare('SELECT * FROM practice_requests WHERE id=?').bind(value.id).first();
    return json({ claimToken: token, request: { id: row.id, focusChapterId: row.focus_chapter_id, focusDigest: row.focus_digest, sources: JSON.parse(row.source_json), note: row.note } });
  }

  if (path === '/api/practice/publisher/fail' && request.method === 'POST') {
    if (!isPublisher) return json({ error: '发布身份无效' }, 401);
    const value = await body(request);
    if (!safeId(value.id) || !safeId(value.claimToken)) return json({ error: '申请参数无效' }, 400);
    const changed = await db.prepare(`UPDATE practice_requests SET status='failed',claim_token=NULL,claim_at=NULL,updated_at=?
      WHERE id=? AND status='building' AND claim_token=?`).bind(now(),value.id,value.claimToken).run();
    return changed.meta.changes ? json({ ok: true }) : json({ error: '领取版本无效' }, 409);
  }

  if (path === '/api/practice/publisher/sets' && request.method === 'POST') {
    if (!isPublisher) return json({ error: '发布身份无效' }, 401);
    const value = await body(request), set = value.set;
    if (!safeId(value.requestId) || !safeId(value.claimToken) || !set || !safeId(set.id) || !textField(set.title, 180) ||
      typeof set.introduction !== 'string' || set.introduction.length > 3000 || !Array.isArray(set.questions) ||
      set.questions.length < 2 || set.questions.length > 20) return json({ error: '练习册格式无效' }, 400);
    const requestRow = await db.prepare('SELECT * FROM practice_requests WHERE id=?').bind(value.requestId).first();
    if (requestRow?.status === 'published' && requestRow.set_id === set.id) return json({ ok: true, id: set.id, reused: true });
    if (!requestRow || requestRow.status !== 'building' || requestRow.claim_token !== value.claimToken) return json({ error: '领取版本无效' }, 409);
    const sources = JSON.parse(requestRow.source_json), sourceIds = new Set(sources.map(item => item.id));
    const questionIds = new Set(), rows = [], links = [];
    for (const [position, question] of set.questions.entries()) {
      if (!safeId(question.id) || questionIds.has(question.id) || !['speaking','writing'].includes(question.kind) ||
        !['speaking-1','speaking-2','speaking-3','writing-1','writing-2'].includes(question.part) ||
        !question.part.startsWith(question.kind) || !textField(question.prompt, 5000) ||
        !textField(question.referenceAnswer, 18000) || typeof question.guidance !== 'string' || question.guidance.length > 4000 ||
        typeof question.referenceNotes !== 'string' || question.referenceNotes.length > 6000 ||
        !Array.isArray(question.links) || !question.links.length || question.links.length > 100) return json({ error: `第 ${position + 1} 题无效` }, 400);
      questionIds.add(question.id);
      for (const link of question.links) {
        if (!sourceIds.has(link.chapterId) || (link.useId && !/^U\d{3}(?:_\d{3})?$/.test(link.useId)) ||
          (link.useId != null && typeof link.useId !== 'string')) return json({ error: '题目来源引用无效' }, 400);
        links.push({ questionId: question.id, chapterId: link.chapterId, useId: link.useId || '' });
      }
      rows.push({ ...question, position });
    }
    if (!rows.some(item => item.kind === 'speaking') || !rows.some(item => item.kind === 'writing')) return json({ error: '练习册须同时包含口语与写作' }, 400);
    const stamp = now();
    const statements = [db.prepare('INSERT INTO practice_sets(id,request_id,title,introduction,created_at) VALUES(?,?,?,?,?)').bind(set.id,value.requestId,set.title.trim(),set.introduction.trim(),stamp)];
    for (const source of sources) statements.push(db.prepare('INSERT INTO practice_sources(set_id,chapter_id,digest,is_focus) VALUES(?,?,?,?)').bind(set.id,source.id,source.digest,source.id===requestRow.focus_chapter_id ? 1 : 0));
    for (const item of rows) statements.push(db.prepare(`INSERT INTO practice_questions
      (id,set_id,position,kind,part,prompt,guidance,reference_answer,reference_notes,created_at)
      VALUES(?,?,?,?,?,?,?,?,?,?)`).bind(item.id,set.id,item.position,item.kind,item.part,item.prompt.trim(),item.guidance.trim(),item.referenceAnswer.trim(),item.referenceNotes.trim(),stamp));
    for (const link of links) statements.push(db.prepare('INSERT OR IGNORE INTO practice_links(question_id,chapter_id,use_id) VALUES(?,?,?)').bind(link.questionId,link.chapterId,link.useId));
    statements.push(db.prepare(`UPDATE practice_requests SET status='published',set_id=?,claim_token=NULL,claim_at=NULL,updated_at=?
      WHERE id=? AND claim_token=?`).bind(set.id,stamp,value.requestId,value.claimToken));
    await db.batch(statements);
    return json({ ok: true, id: set.id, questionCount: rows.length });
  }

  const setMatch = path.match(/^\/api\/practice\/sets\/([A-Za-z0-9._:-]+)$/);
  if (setMatch && request.method === 'GET') {
    const id = setMatch[1];
    const set = await db.prepare(`SELECT s.*,r.focus_chapter_id,r.source_json FROM practice_sets s JOIN practice_requests r ON r.id=s.request_id WHERE s.id=?`).bind(id).first();
    if (!set) return json({ error: '练习册不存在' }, 404);
    const { results: questions } = await db.prepare(`SELECT q.*,v.revealed_at,
      (SELECT json_group_array(json_object('chapterId',l.chapter_id,'useId',l.use_id)) FROM practice_links l WHERE l.question_id=q.id) AS links
      FROM practice_questions q LEFT JOIN practice_reveals v ON v.question_id=q.id WHERE q.set_id=? ORDER BY q.position`).bind(id).all();
    const { results: attempts } = await db.prepare(`SELECT a.id,a.question_id AS questionId,a.answer_text AS answerText,a.medium,
      a.reference_seen_before AS referenceSeenBefore,a.status,a.submitted_at AS submittedAt,a.review_json AS reviewJson,a.reviewed_at AS reviewedAt
      FROM practice_attempts a JOIN practice_questions q ON q.id=a.question_id WHERE q.set_id=? ORDER BY a.submitted_at DESC`).bind(id).all();
    return json({ id: set.id, title: set.title, introduction: set.introduction, focusChapterId: set.focus_chapter_id,
      sources: JSON.parse(set.source_json), questions: questions.map(publicQuestion),
      attempts: attempts.map(item => ({ ...item, review: item.reviewJson ? JSON.parse(item.reviewJson) : null, reviewJson: undefined })) });
  }

  const revealMatch = path.match(/^\/api\/practice\/questions\/([A-Za-z0-9._:-]+)\/reveal$/);
  if (revealMatch && request.method === 'POST') {
    if (!session || !sameOrigin) return json({ error: '来源不允许' }, 403);
    const id = revealMatch[1], question = await db.prepare('SELECT reference_answer,reference_notes FROM practice_questions WHERE id=?').bind(id).first();
    if (!question) return json({ error: '题目不存在' }, 404);
    const attempt = await db.prepare('SELECT 1 FROM practice_attempts WHERE question_id=? LIMIT 1').bind(id).first();
    await db.prepare('INSERT OR IGNORE INTO practice_reveals(question_id,revealed_at,before_attempt) VALUES(?,?,?)').bind(id,now(),attempt ? 0 : 1).run();
    return json({ referenceAnswer: question.reference_answer, referenceNotes: question.reference_notes });
  }

  const attemptMatch = path.match(/^\/api\/practice\/questions\/([A-Za-z0-9._:-]+)\/attempts$/);
  if (attemptMatch && request.method === 'POST') {
    if (!session || !sameOrigin) return json({ error: '来源不允许' }, 403);
    const value = await body(request), id = attemptMatch[1];
    const question = await db.prepare('SELECT kind FROM practice_questions WHERE id=?').bind(id).first();
    if (!question) return json({ error: '题目不存在' }, 404);
    if (!textField(value.answerText, 20000) || value.answerText.trim().length < 20) return json({ error: '请先完成至少 20 字符的答案' }, 400);
    if (question.kind === 'speaking' && value.medium !== 'speech-transcript') return json({ error: '口语目前只接受明确标为转写的文字练习' }, 400);
    if (question.kind === 'writing' && value.medium !== 'written') return json({ error: '写作媒介无效' }, 400);
    const reveal = await db.prepare('SELECT 1 FROM practice_reveals WHERE question_id=?').bind(id).first();
    const attemptId = crypto.randomUUID();
    await db.prepare(`INSERT INTO practice_attempts(id,question_id,answer_text,medium,reference_seen_before,status,submitted_at)
      VALUES(?,?,?,?,?,'pending',?)`).bind(attemptId,id,value.answerText.trim(),value.medium,reveal ? 1 : 0,now()).run();
    return json({ id: attemptId, status: 'pending' }, 201);
  }

  if (path === '/api/practice/publisher/review/claim' && request.method === 'POST') {
    if (!isPublisher) return json({ error: '发布身份无效' }, 401);
    const row = await db.prepare(`SELECT a.id FROM practice_attempts a WHERE a.status='pending' OR (a.status='reviewing' AND a.claim_at<?)
      ORDER BY a.submitted_at LIMIT 1`).bind(now()-7200000).first();
    if (!row) return json({ attempt: null });
    const token = crypto.randomUUID(), stamp = now();
    const changed = await db.prepare(`UPDATE practice_attempts SET status='reviewing',claim_token=?,claim_at=? WHERE id=?
      AND (status='pending' OR (status='reviewing' AND claim_at<?))`).bind(token,stamp,row.id,stamp-7200000).run();
    if (!changed.meta.changes) return json({ attempt: null });
    const attempt = await db.prepare(`SELECT a.id,a.answer_text,a.medium,a.reference_seen_before,a.submitted_at,
      q.id AS question_id,q.kind,q.part,q.prompt,q.guidance,q.reference_answer,q.reference_notes,
      s.id AS set_id,r.focus_chapter_id,r.source_json
      FROM practice_attempts a JOIN practice_questions q ON q.id=a.question_id JOIN practice_sets s ON s.id=q.set_id
      JOIN practice_requests r ON r.id=s.request_id WHERE a.id=?`).bind(row.id).first();
    return json({ claimToken: token, attempt: { id: attempt.id, answerText: attempt.answer_text, medium: attempt.medium,
      referenceSeenBefore: Boolean(attempt.reference_seen_before), submittedAt: attempt.submitted_at,
      question: { id: attempt.question_id, kind: attempt.kind, part: attempt.part, prompt: attempt.prompt, guidance: attempt.guidance,
        referenceAnswer: attempt.reference_answer, referenceNotes: attempt.reference_notes },
      setId: attempt.set_id, focusChapterId: attempt.focus_chapter_id, sources: JSON.parse(attempt.source_json) } });
  }

  if (path === '/api/practice/publisher/review/next' && request.method === 'GET') {
    if (!isPublisher) return json({ error: '发布身份无效' }, 401);
    const row = await db.prepare(`SELECT id FROM practice_attempts WHERE status='pending' OR (status='reviewing' AND claim_at<?)
      ORDER BY submitted_at LIMIT 1`).bind(now()-7200000).first();
    return json({ attemptId: row?.id || null });
  }

  if (path === '/api/practice/publisher/review/complete' && request.method === 'POST') {
    if (!isPublisher) return json({ error: '发布身份无效' }, 401);
    const value = await body(request);
    if (!safeId(value.attemptId) || !safeId(value.claimToken) || !value.review || typeof value.review !== 'object' ||
      !textField(value.review.summary, 3000) || !Array.isArray(value.review.strengths) || !Array.isArray(value.review.priorities) ||
      value.review.strengths.length > 8 || value.review.priorities.length > 5 ||
      [...value.review.strengths,...value.review.priorities].some(item => !textField(item,1500)) ||
      typeof value.review.nextStep !== 'string' || value.review.nextStep.length > 3000 ||
      JSON.stringify(value.review).length > 18000) return json({ error: '反馈结构无效' }, 400);
    const row = await db.prepare('SELECT status,claim_token FROM practice_attempts WHERE id=?').bind(value.attemptId).first();
    if (row?.status === 'reviewed') return json({ ok: true, attemptId: value.attemptId, reused: true });
    if (!row || row.status !== 'reviewing' || row.claim_token !== value.claimToken) return json({ error: '批改领取版本无效' }, 409);
    await db.prepare(`UPDATE practice_attempts SET status='reviewed',review_json=?,reviewed_at=?,claim_token=NULL,claim_at=NULL
      WHERE id=? AND claim_token=?`).bind(JSON.stringify(value.review),now(),value.attemptId,value.claimToken).run();
    return json({ ok: true, attemptId: value.attemptId });
  }

  return json({ error: '表达练习接口不存在' }, 404);
}

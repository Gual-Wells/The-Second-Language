import {speakingRoute,speakingView} from './speaking.js';
import { sessionFor } from './auth.js';
import {mediaRoute} from './practice-media.js';
import {validateListening,listeningView,listeningRoute} from './listening.js';
import {validateReading,readingView,readingRoute} from './reading.js';
import {pronunciationRoute} from './pronunciation.js';

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
const skillOrder = { listening: 0, reading: 1, writing: 2, speaking: 3 };
const body = async request => {
  if (Number(request.headers.get('content-length') || 0) > 1000000) throw new Error('请求过大');
  const raw = await request.text();
  if (raw.length > 1000000) throw new Error('请求过大');
  return JSON.parse(raw);
};
const publicQuestion = row => { const presentation=JSON.parse(row.presentation_json||'{}'),oral=presentation.questionAudioId&&row.part!=='speaking-2';return { id: row.id, setId: row.set_id, position: row.position, kind: row.kind, part: row.part, prompt: oral?'':row.prompt, guidance:oral?'':row.guidance,presentation, links: JSON.parse(row.links || '[]'), revealed: Boolean(row.revealed_at), ...(row.revealed_at ? { referenceAnswer: row.reference_answer, referenceNotes: row.reference_notes } : {}) }; };

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
  const context={isPublisher,isReader,session,sameOrigin};
  const pronunciation=await pronunciationRoute(request,env,context);if(pronunciation)return pronunciation;
  const speaking=await speakingRoute(request,env,context);if(speaking)return speaking;
  const media=await mediaRoute(request,env,context);if(media)return media;
  const listening=await listeningRoute(request,env,context);if(listening)return listening;
  const reading=await readingRoute(request,env,context);if(reading)return reading;

  if (path === '/api/practice' && request.method === 'GET') {
    const chapter = url.searchParams.get('chapter');
    if (chapter && !safeId(chapter)) return json({ error: '章节编号无效' }, 400);
    const { results: sets } = chapter
      ? await db.prepare(`SELECT s.id,s.title,s.introduction,s.profiles_json AS profilesJson,s.created_at AS createdAt,r.focus_chapter_id AS focusChapterId
        FROM practice_sets s JOIN practice_requests r ON r.id=s.request_id JOIN practice_sources x ON x.set_id=s.id
        WHERE x.chapter_id=? ORDER BY s.created_at DESC`).bind(chapter).all()
      : await db.prepare(`SELECT s.id,s.title,s.introduction,s.profiles_json AS profilesJson,s.created_at AS createdAt,r.focus_chapter_id AS focusChapterId
        FROM practice_sets s JOIN practice_requests r ON r.id=s.request_id ORDER BY s.created_at DESC LIMIT 100`).all();
    const active = await db.prepare(`SELECT id,focus_chapter_id AS focusChapterId,status,skills_json AS skillsJson,profiles_json AS profilesJson,created_at AS createdAt FROM practice_requests
      WHERE status IN ('queued','building') ORDER BY created_at DESC LIMIT 1`).first();
    return json({ sets:sets.map(({profilesJson,...item})=>({...item,profiles:JSON.parse(profilesJson)})), active:active?{...active,skills:JSON.parse(active.skillsJson),profiles:JSON.parse(active.profilesJson),skillsJson:undefined,profilesJson:undefined}:null });
  }

  if (path === '/api/practice/index' && request.method === 'GET') {
    const chapter = url.searchParams.get('chapter') || null;
    const use = url.searchParams.get('use') || null;
    const kind = url.searchParams.get('kind') || null;
    const status = url.searchParams.get('status') || null;
    const term = (url.searchParams.get('q') || '').trim();
    if ((chapter && !safeId(chapter)) || (use && !/^U\d{3}(?:_\d{3})?$/.test(use)) ||
      (kind && !['listening','reading','speaking','writing'].includes(kind)) ||
      (status && !['unanswered','pending','reviewing','reviewed','failed'].includes(status)) || term.length > 100)
      return json({ error: '检索条件无效' }, 400);
    const { results } = await db.prepare(`SELECT q.id,q.set_id AS setId,q.kind,q.part,
      CASE WHEN json_extract(q.presentation_json,'$.questionAudioId') IS NOT NULL AND q.part!='speaking-2' THEN '口头提问 · 打开后播放' ELSE q.prompt END AS prompt,s.title AS setTitle,
      r.focus_chapter_id AS focusChapterId,
      (SELECT status FROM (SELECT a.status,a.submitted_at FROM practice_attempts a WHERE a.question_id=q.id UNION ALL SELECT CASE WHEN a.status='reviewed' THEN 'reviewed' WHEN a.status='reviewing' THEN 'reviewing' ELSE 'pending' END AS status,a.submitted_at FROM speaking_attempts a WHERE a.question_id=q.id) ORDER BY submitted_at DESC LIMIT 1) AS lastStatus
      FROM practice_questions q JOIN practice_sets s ON s.id=q.set_id JOIN practice_requests r ON r.id=s.request_id
      WHERE (? IS NULL OR q.kind=?)
      AND (? IS NULL OR EXISTS (SELECT 1 FROM practice_links l WHERE l.question_id=q.id AND l.chapter_id=?))
      AND (? IS NULL OR EXISTS (SELECT 1 FROM practice_links l WHERE l.question_id=q.id AND l.use_id=?))
      AND (?='' OR q.prompt LIKE ? OR s.title LIKE ?)
      ORDER BY s.created_at DESC,q.position LIMIT 300`)
      .bind(kind,kind,chapter,chapter,use,use,term,`%${term}%`,`%${term}%`).all();
    const {results: lp}=await db.prepare(`SELECT json_extract(j.value,'$.id') AS id,p.links_json,p.set_id AS setId,'listening' AS kind,'listening-'||(p.position+1) AS part,json_extract(j.value,'$.prompt') AS prompt,s.title AS setTitle,r.focus_chapter_id AS focusChapterId,
      (SELECT a.status FROM listening_attempts a WHERE a.set_id=p.set_id ORDER BY submitted_at DESC LIMIT 1) AS lastStatus
      FROM listening_passages p JOIN json_each(p.questions_json) j JOIN practice_sets s ON s.id=p.set_id JOIN practice_requests r ON r.id=s.request_id WHERE (? IS NULL OR ?='listening') AND (? IS NULL OR EXISTS(SELECT 1 FROM practice_sources x WHERE x.set_id=p.set_id AND x.chapter_id=?)) AND (?='' OR json_extract(j.value,'$.prompt') LIKE ? OR s.title LIKE ?)`).bind(kind,kind,chapter,chapter,term,`%${term}%`,`%${term}%`).all();
    const {results:rp}=await db.prepare(`SELECT json_extract(j.value,'$.id') AS id,p.links_json,p.set_id AS setId,'reading' AS kind,'reading-'||(p.position+1) AS part,json_extract(j.value,'$.prompt') AS prompt,s.title AS setTitle,r.focus_chapter_id AS focusChapterId,(SELECT a.status FROM reading_attempts a WHERE a.set_id=p.set_id ORDER BY submitted_at DESC LIMIT 1) AS lastStatus FROM reading_passages p JOIN json_each(p.questions_json) j JOIN practice_sets s ON s.id=p.set_id JOIN practice_requests r ON r.id=s.request_id WHERE (? IS NULL OR ?='reading') AND (? IS NULL OR EXISTS(SELECT 1 FROM practice_sources x WHERE x.set_id=p.set_id AND x.chapter_id=?)) AND (?='' OR json_extract(j.value,'$.prompt') LIKE ? OR s.title LIKE ?)`).bind(kind,kind,chapter,chapter,term,`%${term}%`,`%${term}%`).all();
    let all=[...results,...lp,...rp];if(use)all=all.filter(x=>!['listening','reading'].includes(x.kind)||JSON.parse(x.links_json||'[]').some(l=>l.useId===use));
    all=all.map(({links_json,...item})=>item);all.sort((a,b)=>(skillOrder[a.kind]-skillOrder[b.kind])||a.part.localeCompare(b.part));return json({ questions: status ? all.filter(item => status === 'unanswered' ? !item.lastStatus : item.lastStatus === status) : all });
  }

  if (path === '/api/practice/requests' && request.method === 'POST') {
    if (!session || !sameOrigin) return json({ error: '来源不允许' }, 403);
    const value = await body(request);
    if (value.focusChapterId != null && !safeId(value.focusChapterId)) return json({ error: '焦点章节无效' }, 400);
    if (value.note != null && (typeof value.note !== 'string' || value.note.length > 1000)) return json({ error: '练习需求过长' }, 400);
    const skills=value.skills??['writing','speaking'];
    if(!Array.isArray(skills)||!skills.length||skills.some(x=>!['listening','reading','writing','speaking'].includes(x))||new Set(skills).size!==skills.length)return json({error:'请选择听力、阅读、写作、口语中的至少一项'},400);
    const selected=['listening','reading','writing','speaking'].filter(x=>skills.includes(x));
    const incoming=value.profiles||{};if(typeof incoming!=='object'||Array.isArray(incoming)||Object.entries(incoming).some(([k,v])=>!['listening','reading'].includes(k)||!selected.includes(k)||!['full','mini'].includes(v)))return json({error:'听力和阅读须分别选择完整或微缩题量'},400);
    const profiles=Object.fromEntries(selected.filter(x=>['listening','reading'].includes(x)).map(x=>[x,incoming[x]||'full']));
    const active = await db.prepare("SELECT id FROM practice_requests WHERE status IN ('queued','building') LIMIT 1").first();
    if (active) return json({ error: '已有表达练习正在建设', requestId: active.id }, 409);
    const { results } = await env.DB.prepare(`SELECT p.chapter_id AS id,p.study_date AS date,p.digest FROM published_chapters p ORDER BY p.study_date`).all();
    if (!results.length) return json({ error: '尚无正式章节' }, 409);
    const focus = value.focusChapterId ? results.find(item => item.id === value.focusChapterId) : results.at(-1);
    if (!focus) return json({ error: '焦点章节未发布' }, 404);
    const id = crypto.randomUUID(), stamp = now();
    await db.prepare(`INSERT INTO practice_requests(id,focus_chapter_id,focus_digest,source_json,note,status,created_at,updated_at,skills_json,profiles_json,protocol_version)
      VALUES(?,?,?,?,?,'queued',?,?,?,?,'ielts-v2')`).bind(id, focus.id, focus.digest, JSON.stringify(results), (value.note || '').trim(), stamp, stamp,JSON.stringify(selected),JSON.stringify(profiles)).run();
    return json({ id, status: 'queued', skills:selected,profiles,focusChapterId: focus.id, sourceCount: results.length }, 201);
  }

  if (path === '/api/practice/publisher/next' && request.method === 'GET') {
    if (!isPublisher) return json({ error: '发布身份无效' }, 401);
    const row = await db.prepare(`SELECT * FROM practice_requests WHERE status='queued' OR (status='building' AND claim_at<?)
      ORDER BY created_at LIMIT 1`).bind(now() - 21600000).first();
    return json({ request: row ? { id: row.id, skills:JSON.parse(row.skills_json),profiles:JSON.parse(row.profiles_json),protocolVersion:row.protocol_version,focusChapterId: row.focus_chapter_id, focusDigest: row.focus_digest, sources: JSON.parse(row.source_json), note: row.note, status: row.status } : null });
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
    return json({ claimToken: token, request: { id: row.id, skills:JSON.parse(row.skills_json),profiles:JSON.parse(row.profiles_json),protocolVersion:row.protocol_version,focusChapterId: row.focus_chapter_id, focusDigest: row.focus_digest, sources: JSON.parse(row.source_json), note: row.note } });
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
      set.questions.length > 40 || !['ielts-full-v1','ielts-v2'].includes(set.format)) return json({ error: '练习册须按完整雅思规格发布' }, 400);
    const requestRow = await db.prepare('SELECT * FROM practice_requests WHERE id=?').bind(value.requestId).first();
    if (requestRow?.status === 'published' && requestRow.set_id === set.id) return json({ ok: true, id: set.id, reused: true });
    if (!requestRow || requestRow.status !== 'building' || requestRow.claim_token !== value.claimToken) return json({ error: '领取版本无效' }, 409);
    const sources = JSON.parse(requestRow.source_json), sourceIds = new Set(sources.map(item => item.id));
    const skills=JSON.parse(requestRow.skills_json),profiles=JSON.parse(requestRow.profiles_json),strict=requestRow.protocol_version==='ielts-v2';
    if(strict&&set.format!=='ielts-v2')return json({error:'新申请须按完整或微缩规格 v2 发布'},400);
    if(Object.keys(set.profiles||{}).length!==Object.keys(profiles).length||Object.entries(profiles).some(([k,v])=>set.profiles?.[k]!==v))return json({error:'发布题量规格必须与申请完全一致'},400);
    if(set.questions.some(q=>!skills.includes(q.kind)))return json({error:'包含未申请的练习种类'},400);
    if(skills.includes('writing')&&(set.questions.filter(q=>q.part==='writing-1').length!==1||set.questions.filter(q=>q.part==='writing-2').length!==1))return json({error:'正式写作须 Task 1、Task 2 各一题'},400);
    if(skills.includes('speaking')&&['speaking-1','speaking-2','speaking-3'].some(p=>!set.questions.some(q=>q.part===p)))return json({error:'正式口语须完整三个 Part'},400);
    if(skills.includes('speaking')&&set.questions.filter(q=>q.part==='speaking-2').length!==1)return json({error:'口语 Part 2 须有一张主任务卡'},400);
    let passages=[];try{if(skills.includes('listening'))passages=validateListening(set.listening,[...sourceIds],profiles.listening||'full',strict);else if(set.listening?.length)throw Error('未申请听力');}catch(e){return json({error:e.message},400);}
    let readingPassages=[];try{if(skills.includes('reading'))readingPassages=validateReading(set.reading,[...sourceIds],profiles.reading||'full');else if(set.reading?.length)throw Error('未申请阅读');}catch(e){return json({error:e.message},400);}
    for(const p of passages){const media=await db.prepare("SELECT seconds FROM practice_media WHERE id=? AND set_id=? AND state='ready'").bind(p.audioId,set.id).first();if(!media||!media.seconds||p.script.at(-1).end>media.seconds+.1)return json({error:'听力须先上传并核对完整音频及时间区间'},400);}
    set.questions.sort((a,b)=>({writing:0,speaking:1}[a.kind]-{writing:0,speaking:1}[b.kind])||a.part.localeCompare(b.part));
    const questionIds = new Set(), rows = [], links = [];
    for (const [position, question] of set.questions.entries()) {
      if (!safeId(question.id) || questionIds.has(question.id) || !['speaking','writing'].includes(question.kind) ||
        !['speaking-1','speaking-2','speaking-3','writing-1','writing-2'].includes(question.part) ||
        !question.part.startsWith(question.kind) || !textField(question.prompt, 5000) ||
        !textField(question.referenceAnswer, 18000) || typeof question.guidance !== 'string' || question.guidance.length > 4000 ||
        typeof question.referenceNotes !== 'string' || question.referenceNotes.length > 6000 ||
        !Array.isArray(question.links) || !question.links.length || question.links.length > 100) return json({ error: `第 ${position + 1} 题无效` }, 400);
      questionIds.add(question.id);
      const presentation=question.presentation||{};
      if(Object.keys(presentation).some(k=>!['questionAudioId','visual'].includes(k)))return json({error:'呈现数据只能包含音频身份和可见图表，不得带入隐藏答案'},400);
      if(presentation.visual&&Object.keys(presentation.visual).some(k=>!['type','title','headers','rows','sourceNote'].includes(k)))return json({error:'图表包含未定义字段'},400);
      if(question.kind==='speaking'){
        const media=await db.prepare("SELECT 1 FROM practice_media WHERE id=? AND set_id=? AND state='ready'").bind(presentation.questionAudioId||'',set.id).first();if(!media)return json({error:'正式口语题须先准备考官音频；Part 2 题卡保持可见'},400);
      }
      if(question.part==='writing-1'&&(!presentation.visual||presentation.visual.type!=='table'||!textField(presentation.visual.title,300)||!Array.isArray(presentation.visual.headers)||presentation.visual.headers.length<2||!Array.isArray(presentation.visual.rows)||!presentation.visual.rows.length||presentation.visual.rows.length>30||presentation.visual.headers.some(x=>!textField(x,200))||presentation.visual.rows.some(r=>!Array.isArray(r)||r.length!==presentation.visual.headers.length||r.some(x=>typeof x!=='string'||x.length>200))||!textField(presentation.visual.sourceNote,1000)))return json({error:'Task 1 须提供可核实数据表及来源说明（原创假设数据需明确标明）'},400);
      for (const link of question.links) {
        if (!sourceIds.has(link.chapterId) || (link.useId && !/^U\d{3}(?:_\d{3})?$/.test(link.useId)) ||
          (link.useId != null && typeof link.useId !== 'string')) return json({ error: '题目来源引用无效' }, 400);
        links.push({ questionId: question.id, chapterId: link.chapterId, useId: link.useId || '' });
      }
      rows.push({ ...question, position });
    }
    if (skills.some(kind=>!['listening','reading'].includes(kind)&&!rows.some(item=>item.kind===kind)))return json({error:'缺少已申请练习'},400);
    const stamp = now();
    const statements = [db.prepare('INSERT INTO practice_sets(id,request_id,title,introduction,created_at,format,profiles_json) VALUES(?,?,?,?,?,?,?)').bind(set.id,value.requestId,set.title.trim(),set.introduction.trim(),stamp,set.format,JSON.stringify(profiles))];
    for (const source of sources) statements.push(db.prepare('INSERT INTO practice_sources(set_id,chapter_id,digest,is_focus) VALUES(?,?,?,?)').bind(set.id,source.id,source.digest,source.id===requestRow.focus_chapter_id ? 1 : 0));
    for (const item of rows) statements.push(db.prepare(`INSERT INTO practice_questions
      (id,set_id,position,kind,part,prompt,guidance,reference_answer,reference_notes,created_at,presentation_json)
      VALUES(?,?,?,?,?,?,?,?,?,?,?)`).bind(item.id,set.id,item.position,item.kind,item.part,item.prompt.trim(),item.guidance.trim(),item.referenceAnswer.trim(),item.referenceNotes.trim(),stamp,JSON.stringify(item.presentation||{})));
    for(const [position,p]of passages.entries())statements.push(db.prepare('INSERT INTO listening_passages(id,set_id,position,title,instructions,audio_id,script_json,questions_json,keys_json,links_json,visual_json) VALUES(?,?,?,?,?,?,?,?,?,?,?)').bind(p.id,set.id,position,p.title,p.instructions,p.audioId,JSON.stringify(p.script),JSON.stringify(p.questions),JSON.stringify(p.keys),JSON.stringify(p.links),JSON.stringify(p.visual||null)));
    for(const [position,p]of readingPassages.entries())statements.push(db.prepare('INSERT INTO reading_passages(id,set_id,position,title,instructions,paragraphs_json,questions_json,keys_json,links_json,visual_json) VALUES(?,?,?,?,?,?,?,?,?,?)').bind(p.id,set.id,position,p.title,p.instructions,JSON.stringify(p.paragraphs),JSON.stringify(p.questions),JSON.stringify(p.keys),JSON.stringify(p.links),JSON.stringify(p.visual||null)));
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
      format:set.format,profiles:JSON.parse(set.profiles_json),sources: JSON.parse(set.source_json), questions: questions.map(publicQuestion),listening:await listeningView(db,id),reading:await readingView(db,id),speakingAttempts:await speakingView(db,id),
      attempts: attempts.map(item => ({ ...item, review: item.reviewJson ? JSON.parse(item.reviewJson) : null, reviewJson: undefined })) });
  }

  const promptMatch=path.match(/^\/api\/practice\/questions\/([A-Za-z0-9._:-]+)\/prompt$/);
  if(promptMatch&&request.method==='POST'){
    if(!session||!sameOrigin)return json({error:'来源不允许'},403);
    const q=await db.prepare('SELECT prompt,guidance FROM practice_questions WHERE id=?').bind(promptMatch[1]).first();if(!q)return json({error:'题目不存在'},404);
    await db.prepare('INSERT OR IGNORE INTO practice_prompt_reveals(question_id,revealed_at) VALUES(?,?)').bind(promptMatch[1],now()).run();return json({prompt:q.prompt,guidance:q.guidance});
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
    if (!textField(value.answerText, 20000)) return json({ error: '请先填写答案' }, 400);
    if (question.kind === 'speaking' && value.medium !== 'speech-transcript') return json({ error: '口语目前只接受明确标为转写的文字练习' }, 400);
    if (question.kind === 'writing' && value.medium !== 'written') return json({ error: '写作媒介无效' }, 400);
    const reveal = await db.prepare('SELECT 1 FROM practice_reveals WHERE question_id=?').bind(id).first();
    const attemptId = crypto.randomUUID();
    const promptSeen=await db.prepare('SELECT 1 FROM practice_prompt_reveals WHERE question_id=?').bind(id).first();
    await db.prepare(`INSERT INTO practice_attempts(id,question_id,answer_text,medium,reference_seen_before,status,submitted_at,prompt_seen_before)
      VALUES(?,?,?,?,?,'pending',?,?)`).bind(attemptId,id,value.answerText.trim(),value.medium,reveal ? 1 : 0,now(),promptSeen?1:0).run();
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
    const attempt = await db.prepare(`SELECT a.id,a.answer_text,a.medium,a.reference_seen_before,a.prompt_seen_before,a.submitted_at,
      q.id AS question_id,q.kind,q.part,q.prompt,q.guidance,q.reference_answer,q.reference_notes,q.presentation_json,
      s.id AS set_id,r.focus_chapter_id,r.source_json
      FROM practice_attempts a JOIN practice_questions q ON q.id=a.question_id JOIN practice_sets s ON s.id=q.set_id
      JOIN practice_requests r ON r.id=s.request_id WHERE a.id=?`).bind(row.id).first();
    return json({ claimToken: token, attempt: { id: attempt.id, answerText: attempt.answer_text, medium: attempt.medium,
      promptSeenBefore:Boolean(attempt.prompt_seen_before),referenceSeenBefore: Boolean(attempt.reference_seen_before), submittedAt: attempt.submitted_at,
      question: { id: attempt.question_id, kind: attempt.kind, part: attempt.part, prompt: attempt.prompt, guidance: attempt.guidance,
        referenceAnswer: attempt.reference_answer, referenceNotes: attempt.reference_notes, presentation: JSON.parse(attempt.presentation_json || '{}') },
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

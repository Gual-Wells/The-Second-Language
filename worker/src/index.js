import {collectNext} from '../speaking/collector.mjs';
import {speakingEnvironment} from './private-assets.js';
import { rawPayload, sendPushNotification } from '@mmmike/web-push/send';
import { authRoute, sessionFor } from './auth.js';
import { validateAnnotatedContent } from '../../web/annotations.js';
import { practiceRoute } from './practice.js';
import {balanceRoute} from './balances.js';
import {questionsRoute} from './questions.js';
import {storageRoute,permanentBucket,chapterText} from './storage.js';
import {audioConfigRoute} from './audio-config.js';

const encoder = new TextEncoder();
const MAX_BODY = 5_000_000;
const TEMP_LIFETIME = 48 * 60 * 60 * 1000;
const json = (value, status = 200) => new Response(JSON.stringify(value), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
const sha256 = async text => [...new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(text)))].map(x => x.toString(16).padStart(2, '0')).join('');
const validDate = value => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};
const safeId = value => typeof value === 'string' && /^[A-Za-z0-9._:-]{1,110}$/.test(value);
const settingsView = row => ({ goal: row?.goal || '', updatedAt: row?.updated_at || '', temporaryRequested: Boolean(row?.temporary_requested), temporaryRequestText: row?.temporary_request_text || '', temporaryRequestId: row?.temporary_request_id || null, restRequested: Boolean(row?.rest_requested) });

function constantEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return diff === 0;
}

function publisher(request, env) {
  const token = request.headers.get('authorization')?.match(/^Bearer (.+)$/)?.[1];
  return Boolean(env.PUBLISH_TOKEN && constantEqual(token, env.PUBLISH_TOKEN));
}

function sameOrigin(request, env) { return request.headers.get('origin') === env.APP_ORIGIN; }

async function inputJson(request) {
  if (Number(request.headers.get('content-length') || 0) > MAX_BODY) throw new Error('请求过大');
  const text = await request.text();
  if (text.length > MAX_BODY) throw new Error('请求过大');
  return JSON.parse(text);
}

function countMainWords(markdown) {
  const m = markdown.match(/^<!-- PART:one -->\s*$/m);
  const n = markdown.match(/^<!-- PART:two -->\s*$/m);
  const k = markdown.match(/^<!-- PART:three -->\s*$/m);
  if (!m || !n || !k || m.index >= n.index || n.index >= k.index) return -1;
  return (markdown.slice(m.index + m[0].length, n.index).match(/^# [^#\n]+$/gm) || []).length;
}

function subscriptionValid(value) {
  try {
    if (!value?.keys) return false;
    const url = new URL(value.endpoint), host = url.hostname;
    const allowed = host === 'fcm.googleapis.com' || host.endsWith('.push.apple.com') || host.endsWith('.push.services.mozilla.com');
    return url.protocol === 'https:' && allowed && value.endpoint.length <= 1200 &&
      /^[A-Za-z0-9_-]{80,200}$/.test(value.keys.p256dh) && /^[A-Za-z0-9_-]{12,50}$/.test(value.keys.auth);
  } catch { return false; }
}

async function route(request, env) {
  const url = new URL(request.url), path = url.pathname;
  if (path === '/health') return json({ ok: true });
  if (path.startsWith('/auth/')) return authRoute(request, env, request.method === 'POST' ? await inputJson(request) : {});
  if(path.startsWith('/api/balances'))return balanceRoute(request,env,{isPublisher:publisher(request,env),session:await sessionFor(request,env),sameOrigin:sameOrigin(request,env)});
  if(path==='/api/questions'||path.startsWith('/api/questions/'))return questionsRoute(request,env,{isPublisher:publisher(request,env),session:await sessionFor(request,env),sameOrigin:sameOrigin(request,env)});
  if(path==='/api/storage'||path.startsWith('/api/storage/'))return storageRoute(request,env,{isPublisher:publisher(request,env),session:await sessionFor(request,env),sameOrigin:sameOrigin(request,env)});
  if(path==='/api/audio-config'||path.startsWith('/api/audio-config/'))return audioConfigRoute(request,env,{isPublisher:publisher(request,env),session:await sessionFor(request,env),sameOrigin:sameOrigin(request,env)});
  if (path === '/api/practice' || path.startsWith('/api/practice/')) return practiceRoute(request, env, publisher);

  if (path === '/api/session' && request.method === 'GET') return json({ authenticated: Boolean(await sessionFor(request, env)), demo: false });

  if (path === '/api/feedback-snapshot' && request.method === 'GET') {
    if (!publisher(request, env)) return json({ error: '发布身份无效' }, 401);
    const settings = await env.DB.prepare('SELECT * FROM study_settings WHERE id=1').first();
    const { results } = await env.DB.prepare(`SELECT p.chapter_id,p.completed,p.difficulty,p.note,p.updated_at,c.study_date
      FROM reading_progress p LEFT JOIN published_chapters c ON c.chapter_id=p.chapter_id
      ORDER BY p.updated_at DESC LIMIT 100`).all();
    return json({ ...settingsView(settings), recentProgress: results });
  }

  if (path === '/api/runs/claim' && request.method === 'POST') {
    if (!publisher(request, env)) return json({ error: '发布身份无效' }, 401);
    const value = await inputJson(request);
    if (!safeId(value.runId) || !validDate(value.date) || value.runId !== value.date) return json({ error: '运行日期无效' }, 400);
    const claim = await env.DB.prepare(`INSERT OR IGNORE INTO run_claims
      (run_id,study_date,rest_requested,rest_revision,temporary_request_id,temporary_request_text,claimed_at)
      SELECT ?,?,rest_requested,rest_revision,temporary_request_id,temporary_request_text,? FROM study_settings WHERE id=1`)
      .bind(value.runId, value.date, Date.now()).run();
    const row = await env.DB.prepare('SELECT * FROM run_claims WHERE run_id=?').bind(value.runId).first();
    if (!row) return json({ error: '该日期已被另一运行占用' }, 409);
    if (claim.meta.changes && row.rest_requested) await env.DB.prepare('UPDATE study_settings SET rest_requested=0 WHERE id=1 AND rest_revision=?').bind(row.rest_revision).run();
    return json({ runId: row.run_id, date: row.study_date, rest: Boolean(row.rest_requested), temporaryRequest: row.temporary_request_id ? { id: row.temporary_request_id, text: row.temporary_request_text } : null, claimedAt: row.claimed_at });
  }

  if (path.startsWith('/api/runs/') && request.method === 'GET') {
    if (!publisher(request, env)) return json({ error: '发布身份无效' }, 401);
    const runId = decodeURIComponent(path.slice('/api/runs/'.length));
    if (!safeId(runId)) return json({ error: '运行编号无效' }, 400);
    const row = await env.DB.prepare('SELECT * FROM daily_runs WHERE run_id=?').bind(runId).first();
    return row ? json(row) : json({ error: '运行不存在' }, 404);
  }
  if (path === '/api/runs' && request.method === 'PUT') {
    if (!publisher(request, env)) return json({ error: '发布身份无效' }, 401);
    const value = await inputJson(request);
    const phases = ['SELECTED','VIX_MARKED','BUILDING','READY','PUBLISHED'];
    if (!safeId(value.runId) || !validDate(value.date) || !phases.includes(value.phase)) return json({ error: '运行状态无效' }, 400);
    const prior = await env.DB.prepare('SELECT study_date,phase,selection_digest,vix_commit,chapter_digest FROM daily_runs WHERE run_id=?').bind(value.runId).first();
    if (prior && (prior.study_date !== value.date || phases.indexOf(value.phase) < phases.indexOf(prior.phase) ||
      (prior.selection_digest && value.selectionDigest && prior.selection_digest !== value.selectionDigest) ||
      (prior.vix_commit && value.vixCommit && prior.vix_commit !== value.vixCommit) ||
      (prior.chapter_digest && value.chapterDigest && prior.chapter_digest !== value.chapterDigest))) return json({ error: '运行状态与已有记录冲突' }, 409);
    await env.DB.prepare(`INSERT INTO daily_runs (run_id,study_date,phase,selection_digest,vix_commit,chapter_digest,updated_at)
      VALUES (?,?,?,?,?,?,?) ON CONFLICT(run_id) DO UPDATE SET phase=excluded.phase,
      selection_digest=COALESCE(excluded.selection_digest,daily_runs.selection_digest),
      vix_commit=COALESCE(excluded.vix_commit,daily_runs.vix_commit),
      chapter_digest=COALESCE(excluded.chapter_digest,daily_runs.chapter_digest),updated_at=excluded.updated_at`)
      .bind(value.runId, value.date, value.phase, value.selectionDigest || null, value.vixCommit || null, value.chapterDigest || null, Date.now()).run();
    return json({ ok: true });
  }

  if (path === '/api/publish/stage' && request.method === 'POST') {
    if (!publisher(request, env)) return json({ error: '发布身份无效' }, 401);
    const value = await inputJson(request);
    if (!safeId(value.runId) || !validDate(value.date) || value.id !== value.date || value.wordCount !== 40 ||
      typeof value.markdown !== 'string' || countMainWords(value.markdown) !== 40 ||
      typeof value.title !== 'string' || !value.title.trim() || value.title.length > 180 ||
      typeof value.subtitle !== 'string' || value.subtitle.length > 300 ||
      typeof value.number !== 'string' || value.number.length > 80 ||
      !/^[0-9a-f]{40}$/.test(value.vixCommit || '') || !/^[0-9a-f]{40}$/.test(value.protocolCommit || '')) return json({ error: '章节元数据或结构无效' }, 400);
    try { validateAnnotatedContent(value.markdown, { expectedWordCount: 40 }); }
    catch (error) { return json({ error: `章节编码与逐句译文无效：${error.message}` }, 400); }
    const runClaim = await env.DB.prepare('SELECT rest_requested FROM run_claims WHERE run_id=? AND study_date=?').bind(value.runId, value.date).first();
    if (!runClaim || runClaim.rest_requested) return json({ error: '本日未领取运行或已选择休息' }, 409);
    const digest = await sha256(value.markdown), key = `chapters/${value.date}/${digest}.md`;
    if(env.ONEDRIVE_ENABLED==='true')await permanentBucket(env).put(key,value.markdown,{httpMetadata:{contentType:'text/markdown; charset=utf-8'}});
    await env.CHAPTERS.put(key, value.markdown,env.ONEDRIVE_ENABLED==='true'?{expirationTtl:30*86400}:{});
    await env.DB.prepare(`INSERT OR IGNORE INTO chapter_revisions
      (digest,chapter_id,study_date,number,title,subtitle,word_count,content_key,run_id,vix_commit,protocol_commit,created_at)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`)
      .bind(digest, value.id, value.date, value.number, value.title, value.subtitle, 40, key, value.runId, value.vixCommit, value.protocolCommit, Date.now()).run();
    return json({ ok: true, digest, chapterId: value.id });
  }
  if (path === '/api/publish/commit' && request.method === 'POST') {
    if (!publisher(request, env)) return json({ error: '发布身份无效' }, 401);
    const value = await inputJson(request);
    if (!safeId(value.runId) || !/^[0-9a-f]{64}$/.test(value.digest || '')) return json({ error: '发布参数无效' }, 400);
    const revision = await env.DB.prepare('SELECT * FROM chapter_revisions WHERE digest=? AND run_id=?').bind(value.digest, value.runId).first();
    if (!revision) return json({ error: '暂存章节不存在' }, 404);
    const now = Date.now();
    await env.DB.batch([
      env.DB.prepare(`INSERT OR IGNORE INTO audio_requests(id,chapter_id,chapter_digest,parts,source,state,created_at)
        SELECT 'next-'||revision||'-'||?,?,?,parts,'next','pending',? FROM audio_next_config
        WHERE id=1 AND parts!='[]' AND NOT EXISTS(SELECT 1 FROM published_chapters WHERE chapter_id=?)`)
        .bind(revision.chapter_id,revision.chapter_id,revision.digest,now,revision.chapter_id),
      env.DB.prepare(`UPDATE audio_next_config SET parts='[]',revision=revision+1,updated_at=? WHERE id=1
        AND EXISTS(SELECT 1 FROM audio_requests WHERE id='next-'||audio_next_config.revision||'-'||? AND source='next')`)
        .bind(now,revision.chapter_id),
      env.DB.prepare(`INSERT INTO published_chapters (chapter_id,study_date,digest,published_at) VALUES (?,?,?,?)
        ON CONFLICT(chapter_id) DO UPDATE SET digest=excluded.digest,
        published_at=CASE WHEN published_chapters.digest=excluded.digest THEN published_chapters.published_at ELSE excluded.published_at END
        WHERE (SELECT rowid FROM chapter_revisions WHERE digest=excluded.digest)>=(SELECT rowid FROM chapter_revisions WHERE digest=published_chapters.digest)`)
        .bind(revision.chapter_id, revision.study_date, revision.digest, now),
      env.DB.prepare(`INSERT INTO daily_runs (run_id,study_date,phase,vix_commit,chapter_digest,updated_at)
        SELECT ?,?,'PUBLISHED',?,?,? WHERE EXISTS(SELECT 1 FROM published_chapters WHERE chapter_id=? AND digest=?)
        ON CONFLICT(run_id) DO UPDATE SET phase='PUBLISHED',vix_commit=excluded.vix_commit,chapter_digest=excluded.chapter_digest,updated_at=excluded.updated_at`)
        .bind(value.runId, revision.study_date, revision.vix_commit, revision.digest, now,revision.chapter_id,revision.digest),
      env.DB.prepare(`INSERT OR IGNORE INTO push_outbox (chapter_id,digest,subscription_id)
        SELECT ?,?,id FROM push_subscriptions WHERE EXISTS(SELECT 1 FROM published_chapters WHERE chapter_id=? AND digest=?)`).bind(revision.chapter_id, revision.digest,revision.chapter_id,revision.digest)
    ]);
    const current=await env.DB.prepare('SELECT digest FROM published_chapters WHERE chapter_id=?').bind(revision.chapter_id).first();
    if(current?.digest!==revision.digest)return json({error:'已有较新章节版本，旧发布请求不能覆盖当前版本'},409);
    return json({ ok: true, id: revision.chapter_id, digest: revision.digest });
  }

  if (path === '/api/temporary' && request.method === 'POST') {
    if (!publisher(request, env)) return json({ error: '发布身份无效' }, 401);
    const value = await inputJson(request);
    let wordCount = -1;
    if (typeof value.markdown === 'string') {
      try { wordCount = validateAnnotatedContent(value.markdown, { maxWordCount: value.kind === 'review' ? 40 : 200 }).words.length; }
      catch (error) { return json({ error: `临时页编码与逐句译文无效：${error.message}` }, 400); }
    }
    if (!safeId(value.id) || !['test', 'review'].includes(value.kind) ||
      typeof value.title !== 'string' || !value.title.trim() || value.title.length > 180 ||
      typeof value.subtitle !== 'string' || value.subtitle.length > 300 ||
      wordCount < 1 || wordCount > 200 || (value.kind === 'review' && wordCount > 40) ||
      (value.requestId != null && !safeId(value.requestId))) return json({ error: '临时页元数据或三部分结构无效' }, 400);
    const digest = await sha256(value.markdown), now = Date.now();
    const prior = await env.DB.prepare('SELECT digest,expires_at FROM temporary_pages WHERE id=?').bind(value.id).first();
    if (prior) {
      if (prior.digest !== digest || prior.expires_at <= now) return json({ error: '临时页编号已使用' }, 409);
      if (value.requestId) await env.DB.prepare(`UPDATE study_settings SET temporary_requested=0,temporary_request_text='',temporary_request_id=NULL
        WHERE id=1 AND temporary_request_id=?`).bind(value.requestId).run();
      return json({ ok: true, id: value.id, digest, expiresAt: prior.expires_at, reused: true });
    }
    const key = `temporary/${value.id}/${digest}.md`;
    await env.CHAPTERS.put(key, value.markdown);
    await env.DB.batch([
      env.DB.prepare(`INSERT INTO temporary_pages (id,kind,title,subtitle,word_count,digest,content_key,request_id,created_at,expires_at)
        VALUES (?,?,?,?,?,?,?,?,?,?)`).bind(value.id, value.kind, value.title.trim(), value.subtitle.trim(), wordCount, digest, key, value.requestId || null, now, now + TEMP_LIFETIME),
      env.DB.prepare(`INSERT OR IGNORE INTO temporary_push_outbox (page_id,subscription_id)
        SELECT ?,id FROM push_subscriptions`).bind(value.id)
    ]);
    if (value.requestId) await env.DB.prepare(`UPDATE study_settings SET temporary_requested=0,temporary_request_text='',temporary_request_id=NULL
      WHERE id=1 AND temporary_request_id=?`).bind(value.requestId).run();
    return json({ ok: true, id: value.id, digest, expiresAt: now + TEMP_LIFETIME });
  }
  if (path.startsWith('/api/temporary/') && request.method === 'DELETE') {
    if (!publisher(request, env)) return json({ error: '发布身份无效' }, 401);
    const id = decodeURIComponent(path.slice('/api/temporary/'.length));
    if (!safeId(id)) return json({ error: '临时页编号无效' }, 400);
    const page = await env.DB.prepare('SELECT content_key FROM temporary_pages WHERE id=?').bind(id).first();
    if (!page) return json({ ok: true, deleted: false });
    await env.CHAPTERS.delete(page.content_key);
    await env.DB.batch([
      env.DB.prepare('DELETE FROM temporary_push_outbox WHERE page_id=?').bind(id),
      env.DB.prepare('DELETE FROM temporary_pages WHERE id=?').bind(id)
    ]);
    return json({ ok: true, deleted: true, id });
  }

  const session = await sessionFor(request, env);
  if (!session && !publisher(request, env)) return json({ error: '请先登录' }, 401);
  if (path === '/api/chapters' && request.method === 'GET') {
    const { results } = await env.DB.prepare(`SELECT p.chapter_id AS id,p.study_date AS date,r.number,r.title,r.subtitle,r.word_count AS wordCount,p.digest
      FROM published_chapters p JOIN chapter_revisions r ON r.digest=p.digest
      ORDER BY p.study_date DESC`).all();
    return json({ chapters: results });
  }
  if (path.startsWith('/api/chapters/') && request.method === 'GET') {
    const id = decodeURIComponent(path.slice('/api/chapters/'.length));
    if (!safeId(id)) return json({ error: '章节编号无效' }, 400);
    const version = url.searchParams.get('digest');
    if (version && !/^[0-9a-f]{64}$/.test(version)) return json({ error: '章节版本无效' }, 400);
    const row = await env.DB.prepare(`SELECT p.chapter_id AS id,p.study_date AS date,r.number,r.title,r.subtitle,r.word_count AS wordCount,r.content_key,r.digest,
      CASE WHEN r.digest!=p.digest THEN 1 ELSE 0 END AS historical
      FROM published_chapters p JOIN chapter_revisions r ON r.chapter_id=p.chapter_id AND r.digest=COALESCE(?,p.digest) WHERE p.chapter_id=?`).bind(version,id).first();
    if (!row) return json({ error: '章节尚未发布' }, 404);
    const markdown = env.ONEDRIVE_ENABLED==='true'?await chapterText(env,row.content_key):await env.CHAPTERS.get(row.content_key);
    if (markdown === null) return json({ error: '章节正文暂不可用' }, 503);
    const { content_key, ...meta } = row;
    return json({ ...meta, markdown });
  }
  if (path === '/api/settings' && request.method === 'GET') {
    const row = await env.DB.prepare('SELECT * FROM study_settings WHERE id=1').first();
    return json(settingsView(row));
  }
  if (path === '/api/settings' && request.method === 'PUT') {
    if (!sameOrigin(request, env)) return json({ error: '来源不允许' }, 403);
    const value = await inputJson(request);
    const patch = [];
    const args = [];
    if (Object.hasOwn(value, 'goal')) {
      if (typeof value.goal !== 'string' || value.goal.length > 2000) return json({ error: '学习目标过长' }, 400);
      patch.push('goal=?', 'updated_at=?'); args.push(value.goal.trim(), new Date().toISOString());
    }
    if (Object.hasOwn(value, 'temporaryRequested') || Object.hasOwn(value, 'temporaryRequestText')) {
      if (typeof value.temporaryRequested !== 'boolean' || typeof value.temporaryRequestText !== 'string' || value.temporaryRequestText.length > 2000 ||
        (value.temporaryRequested && !value.temporaryRequestText.trim())) return json({ error: '请填写临时推送需求' }, 400);
      patch.push('temporary_requested=?', 'temporary_request_text=?', 'temporary_request_id=?');
      args.push(value.temporaryRequested ? 1 : 0, value.temporaryRequested ? value.temporaryRequestText.trim() : '', value.temporaryRequested ? crypto.randomUUID() : null);
    }
    if (Object.hasOwn(value, 'restRequested')) {
      if (typeof value.restRequested !== 'boolean') return json({ error: '休息设置无效' }, 400);
      patch.push('rest_requested=?', 'rest_revision=rest_revision+1'); args.push(value.restRequested ? 1 : 0);
    }
    if (!patch.length) return json({ error: '没有设置可保存' }, 400);
    await env.DB.prepare(`UPDATE study_settings SET ${patch.join(',')} WHERE id=1`).bind(...args).run();
    return json({ ok: true, ...settingsView(await env.DB.prepare('SELECT * FROM study_settings WHERE id=1').first()) });
  }
  if (path === '/api/temporary' && request.method === 'GET') {
    const { results } = await env.DB.prepare(`SELECT id,kind,title,subtitle,word_count AS wordCount,created_at AS createdAt,expires_at AS expiresAt
      FROM temporary_pages WHERE expires_at>? ORDER BY created_at DESC`).bind(Date.now()).all();
    return json({ pages: results });
  }
  if (path.startsWith('/api/temporary/') && request.method === 'GET') {
    const id = decodeURIComponent(path.slice('/api/temporary/'.length));
    if (!safeId(id)) return json({ error: '临时页编号无效' }, 400);
    const row = await env.DB.prepare(`SELECT id,kind,title,subtitle,word_count AS wordCount,digest,content_key,created_at AS createdAt,expires_at AS expiresAt
      FROM temporary_pages WHERE id=?`).bind(id).first();
    if (!row || row.expiresAt <= Date.now()) return json({ error: '临时页已过期' }, 410);
    const markdown = await env.CHAPTERS.get(row.content_key);
    if (markdown === null) return json({ error: '临时页正文暂不可用' }, 503);
    const { content_key, ...meta } = row;
    return json({ ...meta, markdown });
  }
  if (path.startsWith('/api/progress/')) {
    const id = decodeURIComponent(path.slice('/api/progress/'.length));
    if (!safeId(id)) return json({ error: '章节编号无效' }, 400);
    if (request.method === 'GET') return json((await env.DB.prepare('SELECT completed,difficulty,note,updated_at AS updatedAt FROM reading_progress WHERE chapter_id=?').bind(id).first()) || {});
    if (request.method === 'PUT') {
      if (!sameOrigin(request, env)) return json({ error: '来源不允许' }, 403);
      const value = await inputJson(request);
      if (typeof value.completed !== 'boolean' || ![null,'easy','right','hard'].includes(value.difficulty ?? null) || typeof value.note !== 'string' || value.note.length > 2000) return json({ error: '学习反馈无效' }, 400);
      const exists = await env.DB.prepare('SELECT 1 FROM published_chapters WHERE chapter_id=?').bind(id).first();
      if (!exists) return json({ error: '章节尚未发布' }, 404);
      const stamp = new Date().toISOString();
      await env.DB.prepare(`INSERT INTO reading_progress (chapter_id,completed,difficulty,note,updated_at) VALUES (?,?,?,?,?)
        ON CONFLICT(chapter_id) DO UPDATE SET completed=excluded.completed,difficulty=excluded.difficulty,note=excluded.note,updated_at=excluded.updated_at`)
        .bind(id, value.completed ? 1 : 0, value.difficulty ?? null, value.note.trim(), stamp).run();
      return json({ ok: true, updatedAt: stamp });
    }
  }
  if (path === '/api/push/public-key' && request.method === 'GET') return json({ publicKey: env.VAPID_PUBLIC_KEY || '' });
  if (path === '/api/push/register' && request.method === 'POST') {
    if (!sameOrigin(request, env)) return json({ error: '来源不允许' }, 403);
    const subscription = await inputJson(request);
    if (!subscriptionValid(subscription)) return json({ error: '推送订阅无效' }, 400);
    const id = await sha256(subscription.endpoint), now = Date.now();
    await env.DB.prepare(`INSERT INTO push_subscriptions (id,endpoint,p256dh,auth,created_at,updated_at) VALUES (?,?,?,?,?,?)
      ON CONFLICT(id) DO UPDATE SET endpoint=excluded.endpoint,p256dh=excluded.p256dh,auth=excluded.auth,updated_at=excluded.updated_at`)
      .bind(id, subscription.endpoint, subscription.keys.p256dh, subscription.keys.auth, now, now).run();
    return json({ ok: true });
  }
  if (path === '/api/push/unregister' && request.method === 'POST') {
    if (!sameOrigin(request, env)) return json({ error: '来源不允许' }, 403);
    const value = await inputJson(request);
    if (typeof value.endpoint !== 'string' || value.endpoint.length > 1200 || !value.endpoint.startsWith('https://')) return json({ error: '订阅地址无效' }, 400);
    const id = await sha256(value.endpoint);
    await env.DB.batch([
      env.DB.prepare('DELETE FROM push_outbox WHERE subscription_id=?').bind(id),
      env.DB.prepare('DELETE FROM temporary_push_outbox WHERE subscription_id=?').bind(id),
      env.DB.prepare('DELETE FROM balance_push_outbox WHERE subscription_id=?').bind(id),
      env.DB.prepare('DELETE FROM push_subscriptions WHERE id=?').bind(id)
    ]);
    return json({ ok: true });
  }
  return json({ error: '接口不存在' }, 404);
}

async function sendDue(env) {
  if (!env.VAPID_PUBLIC_KEY || !env.VAPID_PRIVATE_KEY || !env.VAPID_SUBJECT) return;
  const now = Date.now();
  const alerts=await env.DB.prepare(`SELECT o.*,s.endpoint,s.p256dh,s.auth FROM balance_push_outbox o JOIN push_subscriptions s ON s.id=o.subscription_id
    WHERE o.sent_at IS NULL AND o.attempts<4 AND (o.claim_at IS NULL OR o.claim_at<?) ORDER BY o.created_at LIMIT 10`).bind(now-120000).all();
  for(const row of alerts.results){
    const claimed=await env.DB.prepare('UPDATE balance_push_outbox SET claim_at=?,attempts=attempts+1 WHERE id=? AND sent_at IS NULL AND (claim_at IS NULL OR claim_at<?)').bind(now,row.id,now-120000).run();
    if(!claimed.meta.changes)continue;
    try{
      const sent=await sendPushNotification({endpoint:row.endpoint,keys:{p256dh:row.p256dh,auth:row.auth}},rawPayload(JSON.stringify({balances:true,title:'第二语言 · 额度提醒',body:row.body})),
        {publicKey:env.VAPID_PUBLIC_KEY,privateKey:env.VAPID_PRIVATE_KEY,subject:env.VAPID_SUBJECT},{ttl:3600,urgency:'normal',timeoutMs:10000});
      if(sent)await env.DB.prepare('UPDATE balance_push_outbox SET sent_at=?,claim_at=NULL WHERE id=?').bind(Date.now(),row.id).run();
      else await env.DB.prepare('DELETE FROM push_subscriptions WHERE id=?').bind(row.subscription_id).run();
    }catch{await env.DB.prepare('UPDATE balance_push_outbox SET claim_at=NULL WHERE id=?').bind(row.id).run();}
  }
  const { results } = await env.DB.prepare(`SELECT o.*,s.endpoint,s.p256dh,s.auth,r.title
    FROM push_outbox o JOIN published_chapters p ON p.chapter_id=o.chapter_id AND p.digest=o.digest
    JOIN push_subscriptions s ON s.id=o.subscription_id
    JOIN chapter_revisions r ON r.digest=o.digest
    WHERE o.sent_at IS NULL AND o.attempts<4 AND p.published_at<=? AND (o.claim_at IS NULL OR o.claim_at<?)
    ORDER BY r.study_date LIMIT 20`).bind(now - 120000, now - 120000).all();
  for (const row of results) {
    const claim = await env.DB.prepare(`UPDATE push_outbox SET claim_at=?,attempts=attempts+1
      WHERE chapter_id=? AND digest=? AND subscription_id=? AND sent_at IS NULL AND (claim_at IS NULL OR claim_at<?)`)
      .bind(now, row.chapter_id, row.digest, row.subscription_id, now - 120000).run();
    if (!claim.meta.changes) continue;
    try {
      const payload = rawPayload(JSON.stringify({ chapterId: row.chapter_id, title: '第二语言 · 今日章节', body: row.title }));
      const sent = await sendPushNotification({ endpoint: row.endpoint, keys: { p256dh: row.p256dh, auth: row.auth } }, payload,
        { publicKey: env.VAPID_PUBLIC_KEY, privateKey: env.VAPID_PRIVATE_KEY, subject: env.VAPID_SUBJECT }, { ttl: 3600, urgency: 'normal', timeoutMs: 10000 });
      if (!sent) await env.DB.prepare('DELETE FROM push_subscriptions WHERE id=?').bind(row.subscription_id).run();
      else await env.DB.prepare('UPDATE push_outbox SET sent_at=?,claim_at=NULL WHERE chapter_id=? AND digest=? AND subscription_id=?')
        .bind(Date.now(), row.chapter_id, row.digest, row.subscription_id).run();
    } catch (error) {
      console.error('Push delivery failed', { chapterId: row.chapter_id, status: error.statusCode || null });
      await env.DB.prepare('UPDATE push_outbox SET claim_at=NULL WHERE chapter_id=? AND digest=? AND subscription_id=?')
        .bind(row.chapter_id, row.digest, row.subscription_id).run();
    }
  }
  const temporary = await env.DB.prepare(`SELECT o.*,s.endpoint,s.p256dh,s.auth,p.title,p.kind,p.created_at,p.expires_at
    FROM temporary_push_outbox o JOIN temporary_pages p ON p.id=o.page_id
    JOIN push_subscriptions s ON s.id=o.subscription_id
    WHERE o.sent_at IS NULL AND o.attempts<4 AND p.created_at<=? AND p.expires_at>?
      AND (o.claim_at IS NULL OR o.claim_at<?)
    ORDER BY p.created_at LIMIT 20`).bind(now - 120000, now, now - 120000).all();
  for (const row of temporary.results) {
    const claim = await env.DB.prepare(`UPDATE temporary_push_outbox SET claim_at=?,attempts=attempts+1
      WHERE page_id=? AND subscription_id=? AND sent_at IS NULL AND (claim_at IS NULL OR claim_at<?)`)
      .bind(now, row.page_id, row.subscription_id, now - 120000).run();
    if (!claim.meta.changes) continue;
    try {
      const payload = rawPayload(JSON.stringify({ temporaryId: row.page_id, title: `第二语言 · ${row.kind === 'review' ? '复习页' : '测试页'}`, body: row.title }));
      const sent = await sendPushNotification({ endpoint: row.endpoint, keys: { p256dh: row.p256dh, auth: row.auth } }, payload,
        { publicKey: env.VAPID_PUBLIC_KEY, privateKey: env.VAPID_PRIVATE_KEY, subject: env.VAPID_SUBJECT }, { ttl: Math.min(3600, Math.max(0, Math.floor((row.expires_at - now) / 1000))), urgency: 'normal', timeoutMs: 10000 });
      if (!sent) await env.DB.prepare('DELETE FROM push_subscriptions WHERE id=?').bind(row.subscription_id).run();
      else await env.DB.prepare('UPDATE temporary_push_outbox SET sent_at=?,claim_at=NULL WHERE page_id=? AND subscription_id=?')
        .bind(Date.now(), row.page_id, row.subscription_id).run();
    } catch (error) {
      console.error('Temporary push delivery failed', { pageId: row.page_id, status: error.statusCode || null });
      await env.DB.prepare('UPDATE temporary_push_outbox SET claim_at=NULL WHERE page_id=? AND subscription_id=?')
        .bind(row.page_id, row.subscription_id).run();
    }
  }
}

async function removeExpiredTemporary(env) {
  const { results } = await env.DB.prepare('SELECT id,content_key FROM temporary_pages WHERE expires_at<=? LIMIT 100').bind(Date.now()).all();
  for (const row of results) {
    await env.CHAPTERS.delete(row.content_key);
    await env.DB.batch([
      env.DB.prepare('DELETE FROM temporary_push_outbox WHERE page_id=?').bind(row.id),
      env.DB.prepare('DELETE FROM temporary_pages WHERE id=?').bind(row.id)
    ]);
  }
}

export default {
  async fetch(request, env) {
    try { return await route(request, env); }
    catch (error) { console.error('Worker error', error); return json({ error: '服务暂不可用' }, 500); }
  },
  async scheduled(_event, env, context) { context.waitUntil(Promise.all([sendDue(env), removeExpiredTemporary(env),collectNext(speakingEnvironment(env)).catch(error=>console.error('Speaking collection',String(error.message)))])); }
};

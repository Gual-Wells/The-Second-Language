#!/usr/bin/env node
// Offline registry inspection only. No network, scheduler, VIX writes or production integration.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pool = JSON.parse(fs.readFileSync(path.join(root, 'resources/current-affairs/sources.json'), 'utf8'));
const discovery = JSON.parse(fs.readFileSync(path.join(root, 'resources/current-affairs/discovery-catalogues.json'), 'utf8'));
const allowed = {
  verification: ['opened', 'search-confirmed', 'blocked'],
  access: ['open', 'mixed', 'subscription', 'unknown'],
  role: ['editorial-reporting', 'primary-announcement', 'research-reporting', 'statistical-release', 'service-notice', 'technical-release', 'advocacy-publication']
};
const urlKey = value => { const u = new URL(value); u.hash = ''; u.hostname = u.hostname.replace(/^www\./, ''); return u.href.replace(/\/$/, ''); };
function validate() {
  const errors = [];
  if (pool.schemaVersion !== 1 || !['not-connected','on-demand'].includes(pool.runtimeIntegration)) errors.push('Unexpected registry schema or integration state');
  if (discovery.schemaVersion !== 1 || discovery.runtimeIntegration !== 'not-connected') errors.push('Unexpected discovery catalogue schema or integration state');
  const ids = new Set(), entries = new Set();
  if (!Array.isArray(pool.sources) || !pool.sources.length) throw new Error('Missing sources');
  for (const s of pool.sources) {
    for (const field of ['id', 'name', 'home', 'entryUrl', 'sourceType', 'language', 'role', 'access', 'evidenceUrl', 'verification', 'notes', 'checkedOn']) {
      if (typeof s[field] !== 'string' || !s[field].trim()) errors.push(`${s.id}: missing ${field}`);
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s.id)) errors.push(`${s.id}: invalid id`);
    if (ids.has(s.id)) errors.push(`${s.id}: duplicate id`);
    ids.add(s.id);
    for (const field of ['home', 'entryUrl', 'evidenceUrl']) {
      try { if (!['https:', 'http:'].includes(new URL(s[field]).protocol)) throw new Error(); }
      catch { errors.push(`${s.id}: invalid ${field}`); }
    }
    try { const key = urlKey(s.entryUrl); if (entries.has(key)) errors.push(`${s.id}: duplicate publishing entry`); entries.add(key); } catch { /* reported above */ }
    for (const field of ['regions', 'topics']) {
      if (!Array.isArray(s[field]) || !s[field].length || s[field].some(v => typeof v !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v)) || new Set(s[field]).size !== s[field].length) errors.push(`${s.id}: invalid ${field}`);
    }
    for (const [field, values] of Object.entries(allowed)) if (!values.includes(s[field])) errors.push(`${s.id}: invalid ${field}`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s.checkedOn)) errors.push(`${s.id}: invalid checkedOn`);
    if (!Array.isArray(s.observations) || !s.observations.length) errors.push(`${s.id}: missing observations`);
    for (const o of s.observations ?? []) {
      for (const field of ['role', 'access', 'verification']) if (!allowed[field].includes(o[field])) errors.push(`${s.id}: invalid observation ${field}`);
      if (!o.batch || !o.sourceType) errors.push(`${s.id}: incomplete observation origin`);
      for (const field of ['entryUrl', 'evidenceUrl']) { try { if (!['https:', 'http:'].includes(new URL(o[field]).protocol)) throw new Error(); } catch { errors.push(`${s.id}: invalid observation ${field}`); } }
    }
  }
  for (const c of discovery.catalogues ?? []) {
    for (const field of ['id', 'name', 'entryUrl', 'documentationUrl', 'verification', 'documentedScale', 'use', 'limitations']) if (!c[field]) errors.push(`discovery ${c.id}: missing ${field}`);
    for (const field of ['entryUrl', 'documentationUrl']) { try { new URL(c[field]); } catch { errors.push(`discovery ${c.id}: invalid ${field}`); } }
  }
  if (errors.length) throw new Error(errors.join('\n'));
}
const count = key => Object.fromEntries([...new Set(pool.sources.map(s => s[key]))].sort().map(v => [v, pool.sources.filter(s => s[key] === v).length]));
const summary = () => ({ checkedOn: pool.checkedOn, runtimeIntegration: pool.runtimeIntegration, sources: pool.sources.length, observations: pool.sources.reduce((n, s) => n + s.observations.length, 0), verification: count('verification'), access: count('access'), sourceType: count('sourceType'), role: count('role'), discoveryCatalogues: discovery.catalogues.length });
const escape = text => String(text).replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
function catalogue() {
  const lines = ['# 实事来源目录', '', `核验批次：${pool.checkedOn}。共 ${pool.sources.length} 个去重来源；由 sources.json 生成。`, '', 'opened 仅表示打开入口页面；页面壳、全文、付费及技术限制见每条 notes。blocked/search-confirmed 保留为待复核候选。地区是检索提示，不是独立性或报道覆盖审计。', '', '完整访问记录和角色见 [sources.json](sources.json)；使用边界见 [README](README.md)。', ''];
  for (const type of Object.keys(count('sourceType'))) {
    lines.push(`## ${type}`, '', '| 来源／官方发布入口 | 地区提示 | 主题提示 | 角色 | 访问／观测 |', '|---|---|---|---|---|');
    for (const s of pool.sources.filter(s => s.sourceType === type)) lines.push(`| [${escape(s.name)}](${s.entryUrl}) · \`${s.id}\` | ${s.regions.join(', ')} | ${s.topics.join(', ')} | ${s.role} | ${s.access} / ${s.verification} |`);
    lines.push('');
  }
  return lines.join('\n').trimEnd() + '\n';
}
try {
  validate();
  const [command = 'stats', ...args] = process.argv.slice(2);
  if (command === 'check') console.log(`OK: ${pool.sources.length} sources; ${discovery.catalogues.length} external discovery catalogues; unique IDs/entries and registry fields valid. Offline check only.`);
  else if (command === 'stats') console.log(JSON.stringify(summary(), null, 2));
  else if (command === 'catalogue') {
    if (args.length && !(args.length === 1 && args[0] === '--write')) throw new Error('catalogue accepts only --write');
    if (args[0] === '--write') { fs.writeFileSync(path.join(root, 'resources/current-affairs/CATALOGUE.md'), catalogue()); console.log('Updated resources/current-affairs/CATALOGUE.md'); }
    else process.stdout.write(catalogue());
  } else if (command === 'find') {
    let rows = pool.sources, json = false, limit = Infinity;
    const fieldMap = { topic: 'topics', region: 'regions', type: 'sourceType', role: 'role', verification: 'verification', access: 'access', text: null };
    for (let i = 0; i < args.length; i++) {
      if (args[i] === '--json') { json = true; continue; }
      const name = args[i].replace(/^--/, '');
      if (name === 'limit') { const value = args[++i]; if (!value || !/^[1-9]\d*$/.test(value)) throw new Error('--limit requires a positive integer'); limit = Number(value); continue; }
      if (!args[i].startsWith('--') || !(name in fieldMap)) throw new Error(`Unknown filter: ${args[i]}`);
      const value = args[++i];
      if (!value || value.startsWith('--')) throw new Error(`Missing --${name} value`);
      const query = value.toLowerCase();
      const field = fieldMap[name];
      if (field && allowed[field] && !allowed[field].includes(query)) throw new Error(`Invalid --${name}: ${value}`);
      rows = rows.filter(s => field ? (Array.isArray(s[field]) ? s[field].includes(query) : s[field] === query) : [s.id, s.name, s.notes, ...s.topics, ...s.regions].join(' ').toLowerCase().includes(query));
    }
    const selected = rows.slice(0, limit);
    if (json) console.log(JSON.stringify({ total: rows.length, returned: selected.length, sources: selected }, null, 2));
    else { console.log(`${rows.length} match(es); showing ${selected.length}. No rank or recommendation implied.`); for (const s of selected) console.log(`${s.id} | ${s.name} | ${s.access}/${s.verification}\n  ${s.entryUrl}`); }
  } else throw new Error('Use check | stats | find [--topic/--region/--type/--role/--verification/--access/--text value] [--limit n] [--json] | catalogue [--write]');
} catch (error) { console.error(error.message); process.exitCode = 1; }

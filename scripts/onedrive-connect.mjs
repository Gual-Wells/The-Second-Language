import { readFile, writeFile, unlink } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID, createHash } from 'node:crypto';
import {
  cache, scope, savePrivate, readPrivate, identityRequest, identityError,
  accessToken, graphRequest, downloadItem,
} from './lib/onedrive-local.mjs';

const [command, argument] = process.argv.slice(2);
const digest = bytes => createHash('sha256').update(bytes).digest('hex');

async function begin(clientId) {
  if (!/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(clientId || '')) throw new Error('请提供应用程序客户端 ID。');
  const value = await identityRequest('devicecode', { client_id: clientId, scope });
  if (value.error) throw identityError(value);
  if (!value.device_code || !value.user_code || !value.verification_uri) throw new Error('微软授权响应不完整。');
  await savePrivate('onedrive-device.dpapi', {
    clientId, scope, deviceCode: value.device_code,
    expiresAt: Date.now() + Number(value.expires_in) * 1000, interval: Number(value.interval) || 5,
  });
  console.log(JSON.stringify({
    verificationUri: value.verification_uri, userCode: value.user_code,
    expiresIn: value.expires_in, permissions: '仅第二语言应用目录读写、离线续期',
  }));
}

async function finish() {
  const pending = await readPrivate('onedrive-device.dpapi');
  let interval = pending.interval;
  while (Date.now() < pending.expiresAt) {
    const value = await identityRequest('token', {
      client_id: pending.clientId, device_code: pending.deviceCode,
      grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
    });
    if (!value.error) {
      if (!value.access_token || !value.refresh_token) throw new Error('微软未提供可持续授权凭据。');
      await savePrivate('onedrive-credentials.dpapi', {
        clientId: pending.clientId, scope: pending.scope,
        accessToken: value.access_token, refreshToken: value.refresh_token,
        expiresAt: Date.now() + Number(value.expires_in) * 1000,
      });
      await unlink(path.join(cache, 'onedrive-device.dpapi'));
      console.log('授权已保存到本机 Windows 加密凭据文件。');
      return;
    }
    if (value.error === 'slow_down') interval += 5;
    else if (value.error !== 'authorization_pending') throw identityError(value);
    await new Promise(resolve => setTimeout(resolve, interval * 1000));
  }
  throw new Error('设备授权已过期，请重新发起。');
}

function probeWav() {
  const samples = 1600, rate = 16000;
  const buffer = Buffer.alloc(44 + samples * 2);
  buffer.write('RIFF', 0); buffer.writeUInt32LE(buffer.length - 8, 4); buffer.write('WAVEfmt ', 8);
  buffer.writeUInt32LE(16, 16); buffer.writeUInt16LE(1, 20); buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(rate, 24); buffer.writeUInt32LE(rate * 2, 28);
  buffer.writeUInt16LE(2, 32); buffer.writeUInt16LE(16, 34); buffer.write('data', 36);
  buffer.writeUInt32LE(samples * 2, 40);
  return buffer;
}

async function verify() {
  const report = { checkedAt: new Date().toISOString(), steps: {}, productionMigration: false };
  const record = async (name, task) => {
    try { report.steps[name] = { ok: true, ...await task() }; }
    catch (error) { report.steps[name] = { ok: false, error: error.message }; }
  };
  let appRoot;
  await record('appFolder', async () => {
    appRoot = await (await graphRequest('/me/drive/special/approot')).json();
    return { id: appRoot.id, name: appRoot.name };
  });
  await record('quota', async () => {
    const drive = await (await graphRequest('/me/drive?$select=id,driveType,quota')).json();
    return { driveType: drive.driveType, quota: drive.quota };
  });
  await record('refresh', async () => { await accessToken(true); return {}; });
  if (appRoot) {
    const runId = randomUUID();
    for (const [kind, bytes, mediaType] of [
      ['text', Buffer.from('The Second Language — OneDrive connection check.\n', 'utf8'), 'text/plain; charset=utf-8'],
      ['audio', argument ? await readFile(path.resolve(argument)) : probeWav(), argument ? 'application/octet-stream' : 'audio/wav'],
    ]) {
      await record(kind, async () => {
        const extension = kind === 'text' ? '.txt' : argument ? path.extname(argument) || '.bin' : '.wav';
        const filename = `connection-check-${runId}-${kind}${extension}`;
        const item = await (await graphRequest(`/me/drive/items/${encodeURIComponent(appRoot.id)}:/${encodeURIComponent(filename)}:/content`, {
          method: 'PUT', headers: { 'Content-Type': mediaType }, body: bytes,
        })).json();
        const full = Buffer.from(await (await downloadItem(item.id)).arrayBuffer());
        if (digest(full) !== digest(bytes)) throw new Error('文件往返摘要不一致。');
        const requestedEnd = Math.min(bytes.length, 64) - 1;
        const ranged = await downloadItem(item.id, `bytes=0-${requestedEnd}`);
        const partial = Buffer.from(await ranged.arrayBuffer());
        const rangeOk = ranged.status === 206 && partial.equals(bytes.subarray(0, requestedEnd + 1));
        return {
          itemId: item.id, name: filename, bytes: bytes.length, sha256: digest(bytes),
          fullDownload: true, rangeRead: rangeOk, rangeStatus: ranged.status,
          audioProbeOnly: kind === 'audio' && !argument,
        };
      });
    }
  }
  await writeFile(path.join(cache, 'onedrive-verification.json'), JSON.stringify(report, null, 2), { mode: 0o600 });
  console.log(JSON.stringify(report, null, 2));
  if (Object.values(report.steps).some(step => !step.ok)) process.exitCode = 1;
}

try {
  if (command === 'begin') await begin(argument);
  else if (command === 'finish') await finish();
  else if (command === 'verify') await verify();
  else throw new Error('用法: node scripts/onedrive-connect.mjs begin 客户端ID | finish | verify [已有音频文件]');
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}

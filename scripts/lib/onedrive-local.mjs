import { spawn } from 'node:child_process';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const cache = path.join(root, '.cache');
export const authority = 'https://login.microsoftonline.com/consumers/oauth2/v2.0';
export const scope = 'https://graph.microsoft.com/Files.ReadWrite.AppFolder offline_access';

// Secrets travel on stdin, never through command arguments or environment variables.
export function windowsProtect(value, decrypt = false) {
  if (process.platform !== 'win32') throw new Error('此验证工具使用 Windows 当前用户凭据保护。');
  const operation = decrypt ? 'Unprotect' : 'Protect';
  const script = `
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Security
$payload = [Console]::In.ReadToEnd()
$bytes = [Convert]::FromBase64String($payload)
$result = [Security.Cryptography.ProtectedData]::${operation}($bytes, $null, [Security.Cryptography.DataProtectionScope]::CurrentUser)
[Console]::Out.Write([Convert]::ToBase64String($result))
`;
  return new Promise((resolve, reject) => {
    const child = spawn('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', script], {
      windowsHide: true, stdio: ['pipe', 'pipe', 'pipe'],
    });
    let output = '';
    child.stdout.on('data', chunk => { output += chunk; });
    child.stderr.resume();
    child.on('error', () => reject(new Error('无法启动 Windows 凭据保护。')));
    child.on('close', code => code === 0
      ? resolve(Buffer.from(output.trim(), 'base64'))
      : reject(new Error('Windows 凭据保护失败；请使用原 Windows 用户运行。')));
    child.stdin.on('error', () => {});
    child.stdin.end(Buffer.from(value).toString('base64'));
  });
}

export async function savePrivate(name, value) {
  await mkdir(cache, { recursive: true });
  const filename = path.join(cache, name);
  const temporary = `${filename}.${randomUUID()}.tmp`;
  const encrypted = await windowsProtect(Buffer.from(JSON.stringify(value), 'utf8'));
  await writeFile(temporary, encrypted, { mode: 0o600 });
  await rename(temporary, filename);
}

export async function readPrivate(name) {
  return JSON.parse((await windowsProtect(await readFile(path.join(cache, name)), true)).toString('utf8'));
}

export async function identityRequest(endpoint, fields) {
  const response = await fetch(`${authority}/${endpoint}`, {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(fields), signal: AbortSignal.timeout(30_000), redirect: 'error',
  });
  const value = await response.json();
  if (!response.ok && !value.error) throw new Error(`微软授权接口 HTTP ${response.status}`);
  return value;
}

export function identityError(value) {
  const detail = String(value.error_description || '').match(/AADSTS\d+/)?.[0];
  return new Error(`微软授权未完成：${value.error || 'unknown'}${detail ? ` (${detail})` : ''}`);
}

export async function accessToken(forceRefresh = false) {
  const current = await readPrivate('onedrive-credentials.dpapi');
  if (!forceRefresh && current.expiresAt > Date.now() + 120_000) return current.accessToken;
  const value = await identityRequest('token', {
    client_id: current.clientId, grant_type: 'refresh_token', refresh_token: current.refreshToken,
    scope: current.scope || scope,
  });
  if (value.error) throw identityError(value);
  if (!value.access_token) throw new Error('微软未返回访问凭据。');
  await savePrivate('onedrive-credentials.dpapi', {
    ...current, accessToken: value.access_token, refreshToken: value.refresh_token || current.refreshToken,
    expiresAt: Date.now() + Number(value.expires_in) * 1000,
  });
  return value.access_token;
}

export async function graphRequest(resource, options = {}) {
  if (!resource.startsWith('/') || resource.startsWith('//')) throw new Error('Graph 路径无效。');
  const headers = new Headers(options.headers);
  headers.set('Authorization', `Bearer ${await accessToken()}`);
  const response = await fetch(`https://graph.microsoft.com/v1.0${resource}`, {
    ...options, headers, redirect: 'manual', signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok && response.status !== 302 && response.status !== 303) {
    const value = await response.json().catch(() => ({}));
    throw new Error(`Graph HTTP ${response.status}: ${value.error?.code || 'request_failed'}`);
  }
  return response;
}

export async function downloadItem(itemId, range = null) {
  const headers = range ? { Range: range } : {};
  const response = await graphRequest(`/me/drive/items/${encodeURIComponent(itemId)}/content`, { headers });
  if (response.ok) return response;
  const location = response.headers.get('location');
  if (!location || new URL(location).protocol !== 'https:') throw new Error('下载重定向无效。');
  // A preauthorized download URL must not receive the Graph bearer token.
  const downloaded = await fetch(location, { headers, signal: AbortSignal.timeout(30_000) });
  if (!downloaded.ok) throw new Error(`文件下载 HTTP ${downloaded.status}`);
  return downloaded;
}

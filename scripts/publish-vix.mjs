import { spawnSync } from 'node:child_process';
import {publishVix} from './lib/vix-publication.mjs';

const args = Object.fromEntries(process.argv.slice(2).map(item => item.replace(/^--/, '').split(/=(.*)/s).slice(0, 2)));
if (!args.vix || !args.selection) throw new Error('用法: node scripts/publish-vix.mjs --vix=<VIX目录> --selection=<selection.json>');
function gitCredentialToken() {
  const result = spawnSync('git', ['credential', 'fill'], { input: 'protocol=https\nhost=github.com\n\n', encoding: 'utf8', timeout: 10000, windowsHide:true });
  if (result.status !== 0) return null;
  return result.stdout.split(/\r?\n/).find(line => line.startsWith('password='))?.slice('password='.length) || null;
}
const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || gitCredentialToken();
if (!token) throw new Error('缺少 GITHUB_TOKEN、GH_TOKEN 或 GitHub Git 凭据');
const headers = { accept: 'application/vnd.github+json', authorization: `Bearer ${token}`, 'content-type': 'application/json', 'x-github-api-version': '2022-11-28' };
async function api(url, method = 'GET', body) {
  const response = await fetch(url, { method, headers, body: body == null ? undefined : JSON.stringify(body), signal:AbortSignal.timeout(30_000) });
  const result = await response.json();
  if (!response.ok) throw new Error(`GitHub ${method} ${url}: ${response.status} ${result.message || ''}`);
  return result;
}
console.log(JSON.stringify(await publishVix({vixDir:args.vix,selectionFile:args.selection,api})));

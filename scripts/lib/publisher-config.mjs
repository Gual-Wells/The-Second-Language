import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

export async function publisherConfig() {
  const base = process.env.SECOND_LANGUAGE_API_URL || 'https://the-second-language.pages.dev/';
  let token = process.env.SECOND_LANGUAGE_PUBLISH_TOKEN;
  if (!token) {
    const filename = process.env.SECOND_LANGUAGE_CREDENTIAL_FILE
      ? path.resolve(process.env.SECOND_LANGUAGE_CREDENTIAL_FILE)
      : path.join(projectRoot, '.cache/deployment-secrets.json');
    try { token = JSON.parse(await readFile(filename, 'utf8')).PUBLISH_TOKEN; }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
  if (!token) throw new Error('缺少 SECOND_LANGUAGE_PUBLISH_TOKEN 或本机忽略的 .cache/deployment-secrets.json');
  return { base, token };
}

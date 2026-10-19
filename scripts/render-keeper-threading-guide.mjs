import { chromium } from 'file:///D:/CodexStorage/workspaces/second-language-maintenance/.cache/browser-tools/package/index.mjs';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const name = process.argv[2] ?? 'threading-right-front-left-back';
if (!['threading-right-front-left-back', 'mechanism-v2'].includes(name)) throw new Error('Unknown guide');
const temp = path.join(root, '.cache', 'keeper-guide-browser');
await mkdir(temp, { recursive: true });
process.env.TEMP = process.env.TMP = process.env.TMPDIR = temp;
const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
try {
  const page = await browser.newPage({ viewport: { width: 1320, height: name === 'mechanism-v2' ? 1040 : 760 }, deviceScaleFactor: 1 });
  const folder = path.join(root, 'research', 'scroll-keeper-reference-2026-10-19');
  await page.goto(pathToFileURL(path.join(folder, name + '.svg')).href);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(folder, name + '.png') });
} finally { await browser.close(); }

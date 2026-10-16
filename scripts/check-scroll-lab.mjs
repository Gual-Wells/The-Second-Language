import {mkdir,writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createServer} from './serve-scroll-lab.mjs';
const {chromium} = process.env.BROWSER_TOOLS_MODULE
  ? await import(pathToFileURL(process.env.BROWSER_TOOLS_MODULE))
  : await import('playwright').catch(() => import('../.cache/browser-tools/package/index.mjs'));
const out = path.resolve('.cache/scroll-lab/check'); await mkdir(out,{recursive:true});
const server = createServer(); await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({headless:true, executablePath:process.env.BROWSER_EXECUTABLE || 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  args:['--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader','--no-first-run']});
const context = await browser.newContext({viewport:{width:402,height:874},deviceScaleFactor:2,isMobile:true,hasTouch:true,serviceWorkers:'block'});
const page = await context.newPage(), errors = [], requests = [], checks = [];
page.on('pageerror',error => errors.push(error.message));
page.on('request',request => requests.push({url:request.url(),method:request.method()}));
const check = (name,condition) => { assert.ok(condition,name); checks.push(name); };
try {
  await page.goto(base + '/labs/chapter-scroll/');
  await page.waitForFunction(() => window.scrollSpecimen?.snapshot().ready, {timeout:60000});
  const original = await page.evaluate(() => scrollSpecimen.snapshot());
  check('first chapter is an unissued specimen', original.chapterId === '2026-10-02' && original.issued === false);
  check('authored medieval font loaded', await page.evaluate(() => document.fonts.check('58px Aboensis')));
  check('fits iPhone viewport', await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth && document.documentElement.scrollHeight <= innerHeight));
  await page.screenshot({path:path.join(out,'01-closed-iphone.png'),scale:'css'});
  await page.locator('#toggle').click();
  await page.waitForFunction(() => scrollSpecimen.snapshot().progress > .05);
  check('opening actually changes the mesh over time', (await page.evaluate(() => scrollSpecimen.snapshot())).animating);
  await page.waitForFunction(() => !scrollSpecimen.snapshot().animating);
  check('opening ends at the complete page', (await page.evaluate(() => scrollSpecimen.snapshot())).progress === 1);
  await page.screenshot({path:path.join(out,'03-open-iphone.png'),scale:'css'});
  await page.evaluate(() => scrollSpecimen.setProgress(.5));
  await page.screenshot({path:path.join(out,'02-half-open-iphone.png'),scale:'css'});
  check('front-facing camera retained at mid-motion', JSON.stringify((await page.evaluate(() => scrollSpecimen.snapshot())).camera) === JSON.stringify(original.camera));
  await page.evaluate(() => scrollSpecimen.setProgress(1));
  const idling = await page.evaluate(() => scrollSpecimen.snapshot().renderCount);
  await page.waitForTimeout(350);
  check('idle does not run a continuous rendering loop', (await page.evaluate(() => scrollSpecimen.snapshot())).renderCount === idling);
  await page.locator('#transcription').click();
  check('real readable English remains available', (await page.locator('#transcriptContent').textContent()).includes('The Line on the Map'));
  await page.screenshot({path:path.join(out,'04-transcript-iphone.png'),scale:'css'});
  await page.locator('#transcriptDialog button').click();
  await page.locator('#objectOnly').click();
  check('isolated asset view hides the app controls', await page.locator('.app-header').isHidden());
  await page.screenshot({path:path.join(out,'05-object-only-iphone.png'),scale:'css'});
  const png = await page.evaluate(() => scrollSpecimen.exportObject());
  await writeFile(path.join(out,'scroll-object-transparent.png'),Buffer.from(png.split(',')[1],'base64'));
  const documentPng = await page.evaluate(() => scrollSpecimen.exportDocument());
  await writeFile(path.join(out,'scroll-document.png'),Buffer.from(documentPng.split(',')[1],'base64'));
  await page.locator('#leaveObject').click();
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.locator('#replay').click();
  check('reduced motion skips animation', !(await page.evaluate(() => scrollSpecimen.snapshot())).animating);
  const reducedPage = await context.newPage(); await reducedPage.emulateMedia({reducedMotion:'reduce'});
  await reducedPage.goto(base + '/labs/chapter-scroll/');
  await reducedPage.waitForFunction(() => window.scrollSpecimen?.snapshot().ready);
  check('reduced motion starts at the readable final page', (await reducedPage.evaluate(() => scrollSpecimen.snapshot())).progress === 1);
  await reducedPage.close();
  await page.evaluate(() => document.getElementById('scrollCanvas').dispatchEvent(new Event('webglcontextlost',{cancelable:true})));
  check('context loss retains a static page and transcript', await page.locator('#fallback').isVisible() && await page.locator('#toggle').isDisabled());
  check('no external calls or backend writes', requests.every(request => request.url.startsWith(base) && request.method === 'GET'));
  check('no unhandled JavaScript errors', errors.length === 0);
  await writeFile(path.join(out,'results.json'),JSON.stringify({checks,errors,requests,snapshot:original,
    environment:'Chromium 402x874 mobile emulation with software WebGL; not a physical iPhone or Safari',paidCalls:0},null,2));
  console.log(JSON.stringify({checks,errors,output:out},null,2));
} catch (error) {
  await page.screenshot({path:path.join(out,'failure.png'),scale:'css'}).catch(()=>{});
  await writeFile(path.join(out,'failure.json'),JSON.stringify({error:error.message,errors},null,2)); throw error;
} finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }

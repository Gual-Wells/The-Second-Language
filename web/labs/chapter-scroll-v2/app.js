import {ScrollObject} from './scroll-object.js';
import {getTemplate} from './templates.js';
import {createDocument, loadImage, populateTranscript} from './document.js';

const $ = id => document.getElementById(id);
const canvas = $('scrollCanvas'), stage = $('stage');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let object, record, textures;
let progress = 0, animation = null, frame = 0, ready = false, lost = false;
let drag = null;
let lastTick=0,lastPaint=0,lastPaperProgress=0;
const dialogsOpen=()=>Boolean(document.querySelector('dialog[open]'));
const keepMoving=()=>Boolean(object?.options.mist && !reduced.matches && !dialogsOpen());
function startLoop() {
  if(!animation && !keepMoving()) { cancelAnimationFrame(frame);frame=0;lastTick=0;return; }
  if(!frame && !lost && !document.hidden) frame=requestAnimationFrame(tick);
}

function message(text) { $('status').textContent = text; }
function updateControls() {
  $('toggle').textContent = progress >= .5 ? '收起' : '展开';
  $('toggle').setAttribute('aria-label', progress >= .5 ? '收起卷轴' : '展开卷轴');
  $('unfoldHint').hidden = progress > .025 || Boolean(animation);
}

function deform(value) {
  progress = Math.max(0, Math.min(1, value));
  object.setProgress(progress);
  updateControls();
}

function render() {
  if (!object || lost || document.hidden) return;
  object.update(0,0);
  object.render();
}

function resize() {
  if (!object || lost) return;
  const {width, height} = stage.getBoundingClientRect();
  if (!width || !height) return;
  object.resize(width,height); render();
}

const ease = t => t * t * (3 - 2 * t);
function tick(now) {
  frame = 0;
  if (document.hidden || lost) { lastTick=0;return; }
  lastTick=now;
  if(animation || now-lastPaint>=1000/24) {
    const previous=lastPaperProgress;
    if(animation) {
      const t = Math.min(1, (now - animation.start) / animation.duration);
      deform(animation.from + (animation.to - animation.from) * ease(t));
      if(t===1) { animation=null;updateControls();message('设计试样 · 尚未颁发'); }
    }
    const paintDt=Math.min(.12,(now-lastPaint)/1000);
    object.update(paintDt,paintDt ? (object.paperProgress-previous)/paintDt : 0);
    lastPaperProgress=object.paperProgress;
    object.render();lastPaint=now;
  }
  if(animation || keepMoving()) frame=requestAnimationFrame(tick);
  else lastTick=0;
}

function animate(to, {immediate = false} = {}) {
  if (!ready || lost) return;
  cancelAnimationFrame(frame); frame = 0;
  if (immediate || reduced.matches) { animation = null; deform(to); render(); message('设计试样 · 尚未颁发'); startLoop(); return; }
  animation = {from:progress, to, start:performance.now(), duration:Math.max(250, Math.abs(to - progress) * 4800)};
  updateControls(); message(to ? '正在展开…' : '正在收起…');
  startLoop();
}

function toggle() { animate(animation ? (animation.to ? 0 : 1) : (progress >= .5 ? 0 : 1)); }

async function setup() {
  const response = await fetch('chapter-sample.json',{signal:AbortSignal.timeout(20000)});
  if (!response.ok) throw new Error('章节资料暂时不可用。');
  record = await response.json();
  populateTranscript($('transcriptContent'), record);
  populateTranscript($('fallbackDocument'), record);
  const template = getTemplate(record.template);
  const font = new FontFace(template.fontFamily, `url(${template.fontUrl})`);
  document.fonts.add(await font.load());
  await document.fonts.load(`58px ${template.fontFamily}`);
  const [paperImage,wood,normal,rough,mist] = await Promise.all([
    loadImage(template.parchmentUrl),loadImage('assets/wood-Diffuse.jpg'),loadImage('assets/wood-nor_gl.jpg'),
    loadImage('assets/wood-Rough.jpg'),loadImage('assets/jangafx-cloud.png')]);
  textures = createDocument(record, paperImage, template);
  object = new ScrollObject(canvas,textures,template,{wood,normal,rough,mist});
  ready = true;
  deform(reduced.matches ? 1 : 0);
  $('loading').hidden = true;
  for (const id of ['toggle', 'replay', 'objectOnly']) $(id).disabled = false;
  new ResizeObserver(resize).observe(stage); resize();
  startLoop();

  // Small, read-only integration surface for visual checks and future host composition.
  window.scrollSpecimen = Object.freeze({
    open:() => animate(1), close:() => animate(0),
    setProgress:value => animate(value, {immediate:true}),
    setOptions:options=>{ object.setOptions(options);render();startLoop(); },
    snapshot:() => ({...object.snapshot(),ready,animating:Boolean(animation),chapterId:record.chapterId,issued:false,layout:textures.layout}),
    exportDocument:() => textures.front.toDataURL('image/png'),
    exportObject:() => object.exportObject()
  });
}

$('toggle').addEventListener('click', toggle);
$('unfoldHint').addEventListener('click', toggle);
$('replay').addEventListener('click', () => { animate(0, {immediate:true}); animate(1); });
$('transcription').addEventListener('click', () => { $('transcriptDialog').showModal(); $('transcription').setAttribute('aria-expanded','true'); });
$('transcriptDialog').addEventListener('close', () => { $('transcription').setAttribute('aria-expanded','false');startLoop(); });
$('transcriptDialog').addEventListener('click', event => { if (event.target === $('transcriptDialog')) $('transcriptDialog').close(); });
function objectOnly(value) { document.body.classList.toggle('scroll-object-only', value); $('leaveObject').hidden = !value; requestAnimationFrame(resize); }
$('objectOnly').addEventListener('click', () => objectOnly(true));
$('leaveObject').addEventListener('click', () => objectOnly(false));
$('appearance').addEventListener('click',()=>$('appearanceDialog').showModal());
$('appearanceDialog').addEventListener('close',startLoop);
for(const name of ['mist','shaft','band']) $('option-'+name).addEventListener('change',event=>{
  if(!object)return;
  const paper=object.paperProgress;
  object.setOptions({[name]:event.target.checked});
  if(name==='band') deform(object.options.band ? (paper ? .17+.83*paper : 0) : paper);
  render();startLoop();
});
document.addEventListener('keydown', event => { if (event.key === 'Escape') objectOnly(false); });
canvas.addEventListener('pointerdown', event => {
  if (!ready || lost || (event.pointerType === 'mouse' && event.button !== 0)) return;
  cancelAnimationFrame(frame); frame = 0; animation = null;startLoop();
  drag = {id:event.pointerId, y:event.clientY, progress, moved:false};
  canvas.setPointerCapture(event.pointerId);
});
canvas.addEventListener('pointermove', event => {
  if (!drag || drag.id !== event.pointerId) return;
  const delta = event.clientY - drag.y;
  if (Math.abs(delta) > 9) drag.moved = true;
  if (!drag.moved) return;
  deform(drag.progress + delta / (stage.clientHeight * .66)); render();
});
canvas.addEventListener('pointerup', event => {
  if (!drag || drag.id !== event.pointerId) return;
  const moved = drag.moved; drag = null;
  if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
  if (moved) animate(progress >= .5 ? 1 : 0); else toggle();
});
canvas.addEventListener('pointercancel', () => { drag = null; updateControls(); message('设计试样 · 尚未颁发'); });
canvas.addEventListener('lostpointercapture', () => { drag = null; });
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { if (animation) animation.remaining = Math.max(0, animation.duration - (performance.now() - animation.start)); cancelAnimationFrame(frame); frame = 0;lastTick=0;lastPaint=0; drag = null; }
  else if (animation && !lost) { animation.from = progress; animation.start = performance.now(); animation.duration = Math.max(1,animation.remaining ?? animation.duration); frame = requestAnimationFrame(tick); }
  else { render();startLoop(); }
});
reduced.addEventListener('change', () => { if (reduced.matches && animation) animate(animation.to, {immediate:true});else startLoop(); });
canvas.addEventListener('webglcontextlost', event => {
  event.preventDefault(); lost = true; animation = null; cancelAnimationFrame(frame);
  $('fallback').hidden = false; $('unfoldHint').hidden = true;
  for (const id of ['toggle', 'replay', 'objectOnly']) $(id).disabled = true;
  message('显示暂时中断，已保留静态卷页。');
});
canvas.addEventListener('webglcontextrestored', () => { lost = false; $('fallback').hidden = true;
  for (const id of ['toggle','replay','objectOnly']) $(id).disabled = false; resize();startLoop(); updateControls(); message('设计试样 · 尚未颁发'); });
setup().catch(error => {
  console.error(error); $('loading').hidden = true; canvas.hidden = true; $('fallback').hidden = false;
  $('unfoldHint').hidden = true; message('立体卷轴暂不可用，可查看静态卷页与释读。');
});

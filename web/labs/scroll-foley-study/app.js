import {ScrollViewer} from '../certification-reader/reader.bundle.js';
import {StudySoundDirector} from './sound.js';

const $ = id => document.getElementById(id);
const phaseNames = Object.freeze({
  closed: '闭卷静止', 'unload-hole': '卸除孔位张力', 'release-hole': '扣针退出孔位',
  'withdraw-tail': '抽出皮带尾', 'park-pin': '扣针回落', 'slide-clear': '皮扣滑离',
  depart: '皮扣离开', paper: '纸张展开／收起', open: '展卷静止'
});
let sound = null, viewer = null, soundEpoch = 0;
let soundReady = false, viewerReady = false, disposed = false, latestPose = null;
let audioMessage = '默认仅卷展声，轻触“启用试听”开启声音。', viewerMessage = '正在准备原版卷轴…';
let viewerFailure = false, audioFailure = false, statusTimer = 0;

function controls() {
  $('openScroll').disabled = !viewerReady || !soundReady;
  $('closeScroll').disabled = !viewerReady || !soundReady;
  $('unlockSound').textContent = soundReady ? '试听已启用' : '启用试听';
  $('soundStatus').textContent = audioMessage;
  $('retry').hidden = !viewerFailure && !audioFailure;
  $('loading').hidden = viewerReady;
  $('viewerStatus').textContent = viewerMessage;
}

function phaseLabel(state) {
  if (!state) return '等待载入';
  if (state.paperProgress > 0 && state.paperProgress < 1) return state.direction < 0 ? '纸张收卷' : '纸张展开';
  if (state.progress >= .9999) return '展卷静止';
  if (state.progress <= .0001) return '闭卷静止';
  const raw = state.keeper?.phase || state.phase || '未标记';
  return `${phaseNames[raw] || raw} · ${raw}`;
}

function onProgress(state) {
  const pose = {...state, mode: viewer?.drag ? 'drag' : 'automatic'};
  latestPose = pose;
  $('phase').textContent = phaseLabel(state);
  $('progress').textContent = `${Math.round(state.progress * 100)}%`;
  // A late load must not replay movements made before sound was ready.
  if (soundReady) sound?.motion(pose);
}

function seedCurrentPose(candidate) {
  if (latestPose) candidate.motion({...latestPose, velocity: 0, direction: 0, active: false});
}

function describeAudio(candidate) {
  const state = candidate.snapshot();
  if (Object.keys(state.failures || {}).length) {
    audioFailure = true;
    audioMessage = '声音未能准备，请重试；本次不作为有效试听。';
    return false;
  }
  audioFailure = false;
  audioMessage = `轻卷展声候选已准备${$('withMusic').checked ? ' · 与音乐合听' : ' · 仅卷展声'}。`;
  return true;
}

function configureSound() {
  soundEpoch++;
  soundReady = false;
  sound?.dispose();
  sound = new StudySoundDirector();
  sound.setMusicEnabled($('withMusic').checked);
  sound.setActive(true);
  seedCurrentPose(sound);
  return {candidate: sound, epoch: soundEpoch};
}

async function enableSound(candidate = sound, epoch = soundEpoch) {
  if (disposed || !candidate || candidate !== sound) return false;
  // This call runs in the original trusted pointer/click handler, before await.
  const unlocking = candidate.unlock();
  audioMessage = '正在准备轻卷展声…';
  controls();
  try {
    const unlocked = await unlocking;
    if (!unlocked) {
      if (disposed || epoch !== soundEpoch || candidate !== sound || document.hidden) return false;
      throw Error('声音尚未就绪，请轻触“启用试听”重试。');
    }
    await candidate.prepare();
    if (disposed || epoch !== soundEpoch || candidate !== sound || document.hidden || candidate.snapshot().paused) return false;
    const state = candidate.snapshot();
    if (!state.unlocked || state.contextState !== 'running') throw Error('请轻触“启用试听”恢复声音。');
    seedCurrentPose(candidate);
    soundReady = describeAudio(candidate);
    controls();
    return soundReady;
  } catch (error) {
    if (disposed || epoch !== soundEpoch || candidate !== sound) return false;
    soundReady = false;
    audioFailure = true;
    audioMessage = error.message || '声音未准备完成，请重试。';
    controls();
    return false;
  }
}

function resize() {
  const rect = $('stage').getBoundingClientRect();
  viewer?.resize(rect.width, rect.height);
}

async function prepareViewer() {
  if (disposed) return;
  viewer?.dispose();
  // A disposed WebGL viewer releases its contexts; retry receives fresh canvases.
  for (const id of ['scroll', 'mist']) {
    const previous = $(id);
    previous.replaceWith(previous.cloneNode(false));
  }
  latestPose = null;
  viewerReady = false;
  viewerFailure = false;
  viewerMessage = '正在准备原版卷轴…';
  const current = new ScrollViewer($('scroll'), $('mist'), {
    onProgress,
    onStatus(message, meta) {
      if (disposed || current !== viewer) return;
      viewerMessage = message;
      viewerReady = meta.ready && meta.status !== 'context-lost';
      viewerFailure = ['failed', 'context-lost'].includes(meta.status);
      if (viewerFailure) {
        sound?.pause();
        soundReady = false;
      }
      controls();
    }
  });
  viewer = current;
  controls();
  resize();
  $('scroll').addEventListener('pointerdown', () => {
    if (!soundReady || sound.snapshot().contextState !== 'running') void enableSound();
  });
  $('scroll').addEventListener('keydown', event => {
    if (![' ', 'Enter'].includes(event.key)) return;
    event.preventDefault();
    void move(viewer.animation ? 1 - viewer.animation.to : viewer.progress >= .5 ? 0 : 1);
  });
  try {
    await current.prepare({work: 'beginning', initialProgress: 0});
    if (disposed || viewer !== current) return;
    viewerReady = true;
    current.bindPointerInput();
    seedCurrentPose(sound);
    controls();
  } catch (error) {
    if (disposed || viewer !== current) return;
    viewerReady = false;
    viewerFailure = true;
    viewerMessage = `卷轴准备失败：${error.message || '请重试'}`;
    controls();
  }
}

async function move(to) {
  const candidate = sound, epoch = soundEpoch;
  const enabled = enableSound(candidate, epoch);
  if (!await enabled || disposed || epoch !== soundEpoch || !viewerReady) return;
  await viewer.animate(to);
}

$('unlockSound').addEventListener('click', () => void enableSound());
$('openScroll').addEventListener('click', () => void move(1));
$('closeScroll').addEventListener('click', () => void move(0));
$('withMusic').addEventListener('change', () => {
  sound.setMusicEnabled($('withMusic').checked);
  void enableSound();
});
$('retry').addEventListener('click', () => {
  const {candidate, epoch} = configureSound();
  void enableSound(candidate, epoch);
  if (viewerFailure) void prepareViewer();
});

const observer = new ResizeObserver(resize);
observer.observe($('stage'));
document.addEventListener('visibilitychange', () => {
  if (disposed) return;
  if (document.hidden) {
    soundEpoch++;
    viewer?.pause();
    sound?.pause();
    soundReady = false;
  } else {
    viewer?.resume();
    sound?.resume();
    audioMessage = '返回试听页。若声音未恢复，请轻触“启用试听”。';
  }
  controls();
});
window.addEventListener('pagehide', event => {
  // Preserve the rendering for a possible bfcache return while stopping all audio.
  soundEpoch++;
  soundReady = false;
  viewer?.pause();
  sound?.setActive(false);
  if (!event.persisted) dispose();
});
window.addEventListener('pageshow', event => {
  if (!event.persisted || disposed) return;
  viewer?.resume();
  sound?.setActive(true);
  audioMessage = '轻触“启用试听”继续，之前的动作不会补播。';
  controls();
});
function dispose() {
  if (disposed) return;
  disposed = true;
  soundEpoch++;
  clearInterval(statusTimer);
  observer.disconnect();
  sound?.dispose();
  viewer?.dispose();
}
configureSound();
sound.prepare().catch(() => {});
void prepareViewer();
statusTimer = setInterval(() => {
  if (disposed || !soundReady) return;
  const state = sound.snapshot();
  if (Object.keys(state.failures || {}).length) {
    soundReady = false;
    describeAudio(sound);
    controls();
  }
}, 750);
window.scrollFoleyStudy = {
  snapshot: () => ({candidate: 'soft-v2', soundReady, viewerReady, withMusic: $('withMusic').checked, pose: latestPose, sound: sound?.snapshot(), viewer: viewer?.snapshot(), candidateOnly: true}),
  dispose
};

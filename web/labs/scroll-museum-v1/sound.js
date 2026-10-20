// Sample-only sound world. Recorded CC0 assets and provenance: AUDIO_CREDITS.md.
// One lazy AudioContext is shared by director instances; no sound starts on import.
const ASSET = path => new URL(`./assets/${path}`, import.meta.url).href;
const FILES = Object.freeze({
  museum: 'audio-music/ancient-mysteries.mp3',
  inspect: 'audio-music/a-new-town.mp3',
  leather1: 'audio-foley/beltHandle1.wav',
  leather2: 'audio-foley/beltHandle2.wav',
  tail1: 'audio-foley/handleSmallLeather.wav',
  tail2: 'audio-foley/handleSmallLeather2.wav',
  cloth: 'audio-foley/clothBelt.wav',
  pin: 'audio-foley/metalClick.wav',
  latch: 'audio-foley/metalLatch.wav',
  open: 'audio-foley/bookOpen.wav',
  close: 'audio-foley/bookClose.wav',
  paper1: 'audio-foley/bookFlip1.wav',
  paper2: 'audio-foley/bookFlip2.wav',
  paper3: 'audio-foley/bookFlip3.wav',
  place1: 'audio-foley/bookPlace1.wav',
  place2: 'audio-foley/bookPlace2.wav',
  leatherDrop: 'audio-foley/dropLeather.wav'
});
const MUSIC = new Set(['museum', 'inspect']);
// Technical level matching from decoded RMS/peak measurements, not an art verdict.
const TRIM = Object.freeze({tail1: 2.2, tail2: 3, open: 1.7, paper2: 1.8,
  place1: 0.35, place2: 0.35, close: 0.45, latch: 0.55, leatherDrop: 0.4});
let sharedContext;
let contextUsers = 0;
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const clock = () => performance.now() / 1000;
const hidden = () => typeof document !== 'undefined' && document.hidden;

function getContext() {
  if (!sharedContext || sharedContext.state === 'closed') {
    const Context = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!Context) throw Error('此浏览器暂不支持藏馆声音');
    sharedContext = new Context({latencyHint: 'interactive'});
  }
  return sharedContext;
}

function ramp(param, value, seconds, context) {
  const time = context.currentTime;
  if (typeof param.cancelAndHoldAtTime === 'function') param.cancelAndHoldAtTime(time);
  else { param.cancelScheduledValues(time); param.setValueAtTime(param.value, time); }
  param.linearRampToValueAtTime(value, time + seconds);
}

export class SoundDirector {
  constructor() {
    this.enabled = true;
    this.musicEnabled = false;
    this.foleyEnabled = false;
    this.scene = 'museum';
    this.paused = false;
    this.disposed = false;
    this.unlocked = false;
    this.context = null;
    this.buffers = new Map();
    this.loads = new Map();
    this.bytes = new Map();
    this.failures = new Map();
    this.positions = new Map();
    this.musicVoices = new Set();
    this.foleyVoices = new Set();
    this.currentMusic = null;
    this.musicTicket = 0;
    this.lastMotion = null;
    this.lastCue = new Map();
    this.paperTravel = 0;
    this.paperVariant = 0;
    this.eventsPlayed = 0;
    this.lastEvent = null;
    this.prepared = false;
    this._visibility = () => { if (hidden()) this.pause(); };
    this._pagehide = () => this.pause();
    globalThis.document?.addEventListener('visibilitychange', this._visibility);
    globalThis.addEventListener?.('pagehide', this._pagehide);
  }

  // Fetching is not playback. No AudioContext is made by preparing the sample.
  async prepare() {
    if (this.disposed) return false;
    if (!this.preparePromise) {
      this.preparePromise = Promise.allSettled(Object.keys(FILES).map(key => this._fetch(key)))
        .then(() => { this.prepared = true; return !this.disposed; });
    }
    return this.preparePromise;
  }

  _nodes() {
    if (this.context) return;
    this.context = getContext();
    contextUsers++;
    const ctx = this.context;
    this.master = ctx.createGain();
    this.master.gain.value = this.enabled && !this.paused ? 0.7 : 0;
    this.musicBus = ctx.createGain();
    this.foleyBus = ctx.createGain();
    this.musicBus.gain.value = 1;
    this.foleyBus.gain.value = 1;
    const limiter = ctx.createDynamicsCompressor();
    limiter.threshold.value = -10;
    limiter.knee.value = 12;
    limiter.ratio.value = 3;
    limiter.attack.value = 0.005;
    limiter.release.value = 0.16;
    this.musicBus.connect(this.master);
    this.foleyBus.connect(this.master);
    this.master.connect(limiter);
    limiter.connect(ctx.destination);
    this.limiter = limiter;
    this._statechange = () => {
      if (ctx.state !== 'running') this._stopFoley();
    };
    ctx.addEventListener('statechange', this._statechange);
  }

  // Call directly from a click/tap, before awaiting network or model preparation.
  async unlock() {
    if (this.disposed || hidden() || (!this.musicEnabled && !this.foleyEnabled)) return false;
    this._nodes();
    const resuming = this.context.resume();
    await resuming;
    if (this.disposed) return false;
    if (this.context.state !== 'running') throw Error('声音被系统暂停，请轻触声音按钮重试');
    this.unlocked = true;
    // Warm the small action clips; a distant music download never blocks taking a roll.
    this.prepare().catch(() => {});
    if (this.foleyEnabled) await Promise.allSettled(Object.keys(FILES).filter(key => !MUSIC.has(key)).map(key => this._buffer(key)));
    if (this.disposed || this.paused || hidden()) return false;
    ramp(this.master.gain, this.enabled ? 0.7 : 0, 0.06, this.context);
    this._syncMusic();
    return true;
  }

  setEnabled(value) {
    this.enabled = Boolean(value);
    if (!this.enabled) { this._stopMusic(); this._stopFoley(); }
    if (this.context) ramp(this.master.gain, this._canPlay() ? 0.7 : 0, 0.08, this.context);
    if (this.enabled) this._syncMusic();
  }

  setMusicEnabled(value) {
    this.musicEnabled = Boolean(value);
    if (this.musicEnabled) this._syncMusic();
    else this._stopMusic();
  }

  setFoleyEnabled(value) {
    this.foleyEnabled = Boolean(value);
    if (!this.foleyEnabled) this._stopFoley();
    // Enabling midway never replays old contact points.
    this.paperTravel = 0;
  }

  setScene(scene) {
    if (!MUSIC.has(scene)) return;
    if (this.scene !== scene) {
      this.scene = scene;
      this.lastMotion = null;
      this.paperTravel = 0;
      this._stopFoley();
    }
    this._syncMusic();
  }

  _canPlay() {
    return !this.disposed && !this.paused && this.enabled && this.unlocked &&
      !hidden() && this.context?.state === 'running';
  }

  async _fetch(key) {
    if (this.bytes.has(key)) return this.bytes.get(key);
    const pending = this.loads.get(`fetch:${key}`);
    if (pending) return pending;
    const task = fetch(ASSET(FILES[key]), {credentials: 'same-origin'})
      .then(response => {
        if (!response.ok) throw Error(`声音资源未取得：${key} (${response.status})`);
        return response.arrayBuffer();
      }).then(bytes => {
        if (!this.disposed) { this.bytes.set(key, bytes); this.failures.delete(key); }
        return bytes;
      }).catch(error => { this.failures.set(key, error.message); throw error; });
    this.loads.set(`fetch:${key}`, task);
    try { return await task; }
    finally { this.loads.delete(`fetch:${key}`); }
  }

  async _buffer(key) {
    if (this.buffers.has(key)) return this.buffers.get(key);
    const pending = this.loads.get(`decode:${key}`);
    if (pending) return pending;
    const task = this._fetch(key).then(bytes => this.context.decodeAudioData(bytes.slice(0)))
      .then(buffer => {
        if (!this.disposed) { this.buffers.set(key, buffer); this.failures.delete(key); }
        return buffer;
      }).catch(error => { this.failures.set(key, error.message); throw error; });
    this.loads.set(`decode:${key}`, task);
    try { return await task; }
    finally { this.loads.delete(`decode:${key}`); }
  }

  _remember(voice) {
    if (!voice || !this.context) return;
    const duration = voice.source.buffer.duration;
    this.positions.set(voice.key, (voice.offset + this.context.currentTime - voice.startedAt) % duration);
  }

  _stopVoice(voice, fade = 0.1) {
    if (!voice || voice.stopping) return;
    voice.stopping = true;
    if (this.context?.state === 'running' && fade > 0) {
      ramp(voice.gain.gain, 0, fade, this.context);
      try { voice.source.stop(this.context.currentTime + fade + 0.015); } catch {}
    } else { try { voice.source.stop(); } catch {} }
  }

  _stopMusic() {
    this.musicTicket++;
    this._remember(this.currentMusic);
    this.currentMusic = null;
    for (const voice of this.musicVoices) this._stopVoice(voice);
  }

  _syncMusic() {
    if (!this._canPlay() || !this.musicEnabled) return;
    const key = this.scene;
    if (this.currentMusic?.key === key && !this.currentMusic.stopping) return;
    const ticket = ++this.musicTicket;
    this._buffer(key).then(buffer => {
      if (ticket !== this.musicTicket || !this._canPlay() || !this.musicEnabled || this.scene !== key) return;
      const ctx = this.context;
      this._remember(this.currentMusic);
      // Short overlap avoids a hard cut between independent complete recordings.
      for (const voice of this.musicVoices) this._stopVoice(voice, 1.1);
      const source = ctx.createBufferSource(), gain = ctx.createGain();
      source.buffer = buffer;
      source.loop = true;
      gain.gain.value = 0;
      source.connect(gain); gain.connect(this.musicBus);
      const offset = (this.positions.get(key) || 0) % buffer.duration;
      const voice = {key, source, gain, offset, startedAt: ctx.currentTime, stopping: false};
      this.currentMusic = voice;
      this.musicVoices.add(voice);
      source.onended = () => { source.disconnect(); gain.disconnect(); this.musicVoices.delete(voice); };
      source.start(0, offset);
      gain.gain.linearRampToValueAtTime(key === 'museum' ? 0.105 : 0.19, ctx.currentTime + 1.8);
    }).catch(() => {}); // Silent viewing remains available; snapshot exposes the failure.
  }

  _stopFoley() {
    for (const voice of this.foleyVoices) this._stopVoice(voice, 0.025);
    this.lastMotion = null;
    this.paperTravel = 0;
  }

  _play(key, {gain = 0.35, group = key, cooldown = 0.18, rate = 1} = {}) {
    if (!this._canPlay() || !this.foleyEnabled) return;
    const at = clock();
    if (at - (this.lastCue.get(group) ?? -Infinity) < cooldown) return;
    this.lastCue.set(group, at);
    const requestedScene = this.scene;
    this._buffer(key).then(buffer => {
      // A slow download/decode never makes a physical action sound seconds late.
      if (!this._canPlay() || !this.foleyEnabled || this.scene !== requestedScene || clock() - at > 0.35) return;
      if (this.foleyVoices.size >= 4) this._stopVoice(this.foleyVoices.values().next().value, 0.025);
      const ctx = this.context, source = ctx.createBufferSource(), node = ctx.createGain();
      source.buffer = buffer;
      source.playbackRate.value = clamp(rate, 0.95, 1.05);
      node.gain.value = 0;
      node.gain.setValueAtTime(0, ctx.currentTime);
      node.gain.linearRampToValueAtTime(gain * (TRIM[key] || 1), ctx.currentTime + 0.008);
      source.connect(node); node.connect(this.foleyBus);
      const voice = {key, source, gain: node, stopping: false};
      this.foleyVoices.add(voice);
      source.onended = () => { source.disconnect(); node.disconnect(); this.foleyVoices.delete(voice); };
      source.start();
      this.eventsPlayed++;
      this.lastEvent = group;
    }).catch(() => {});
  }

  cue(name) {
    if (name === 'pickup') this._play('tail1', {gain: 0.48, group: 'pickup', cooldown: 0.6});
    else if (name === 'placed') this._play('place2', {gain: 0.38, group: 'placed', cooldown: 0.6});
    else if (name === 'newarrival') this._play('place1', {gain: 0.34, group: 'arrival', cooldown: 2});
  }

  motion({progress = 0, velocity = 0, active = false, direction = 0} = {}) {
    const p = clamp(Number(progress) || 0, 0, 1), now = clock(), previous = this.lastMotion;
    this.lastMotion = {p, time: now};
    if (!this._canPlay() || !this.foleyEnabled || this.scene !== 'inspect') return;
    if (!previous || !active) { this.paperTravel = 0; return; }
    const delta = p - previous.p;
    if (Math.abs(delta) < 0.00001) return;
    // Instant seeks / reduced-motion state changes are not physical contact sweeps.
    if (Math.abs(delta) > 0.18 && now - previous.time < 0.12) { this.paperTravel = 0; return; }
    const sign = Math.sign(delta) || Math.sign(direction);
    const speed = Math.abs(Number(velocity)) || Math.abs(delta) / Math.max(0.016, now - previous.time);
    const crosses = threshold => sign > 0 ? previous.p < threshold && p >= threshold : previous.p > threshold && p <= threshold;
    const events = sign > 0 ? [
      [0.025, 'leather1', 'unload', 0.35],
      [0.075, 'pin', 'pin-contact', 0.27],
      [0.16, 'tail2', 'tail-slide', 0.38],
      [0.32, 'cloth', 'keeper-clear', 0.27],
      [0.415, 'open', 'paper-start', 0.27],
      [0.985, 'place1', 'paper-settle', 0.16]
    ] : [
      [0.97, 'paper3', 'paper-start', 0.23],
      [0.405, 'close', 'paper-settle', 0.27],
      [0.31, 'cloth', 'keeper-clear', 0.27],
      [0.16, 'tail1', 'tail-slide', 0.38],
      [0.065, 'latch', 'pin-contact', 0.26],
      [0.008, 'leather2', 'unload', 0.3]
    ];
    for (const [point, key, group, gain] of events) {
      if (crosses(point)) this._play(key, {group, gain, cooldown: 0.65});
    }
    if (p > 0.45 && p < 0.96 && speed > 0.015) {
      this.paperTravel += Math.abs(delta);
      if (this.paperTravel > 0.115) {
        this.paperTravel = 0;
        const key = `paper${1 + this.paperVariant++ % 3}`;
        this._play(key, {gain: clamp(0.075 + speed * 0.16, 0.09, 0.24), group: 'paper-travel', cooldown: 0.28});
      }
    } else this.paperTravel = 0;
  }

  pause() {
    if (this.disposed) return;
    this.paused = true;
    this._stopMusic();
    this._stopFoley();
    if (this.context) ramp(this.master.gain, 0, 0.04, this.context);
  }

  resume() {
    if (this.disposed || hidden()) return;
    this.paused = false;
    this.lastMotion = null;
    if (!this.context || !this.unlocked) return;
    // A system interruption may reject resume: no timer retries or unlock hacks.
    this.context.resume().then(() => {
      if (!this._canPlay()) return;
      ramp(this.master.gain, 0.7, 0.1, this.context);
      this._syncMusic();
    }).catch(() => {});
  }

  snapshot() {
    return {
      enabled: this.enabled, musicEnabled: this.musicEnabled, foleyEnabled: this.foleyEnabled,
      scene: this.scene, paused: this.paused, unlocked: this.unlocked, prepared: this.prepared,
      contextState: this.context?.state || 'not-created', decoded: [...this.buffers.keys()],
      downloaded: this.bytes.size, musicTrack: this.currentMusic?.key || null,
      musicVoices: this.musicVoices.size, foleyVoices: this.foleyVoices.size,
      eventsPlayed: this.eventsPlayed, lastEvent: this.lastEvent,
      failures: Object.fromEntries(this.failures), disposed: this.disposed,
      listeningReview: 'not-auditioned', issued: false
    };
  }

  dispose() {
    if (this.disposed) return;
    this.pause();
    this.disposed = true;
    globalThis.document?.removeEventListener('visibilitychange', this._visibility);
    globalThis.removeEventListener?.('pagehide', this._pagehide);
    if (this.context) {
      this.context.removeEventListener('statechange', this._statechange);
      for (const voice of [...this.musicVoices, ...this.foleyVoices]) {
        try { voice.source.stop(); } catch {}
        voice.source.disconnect(); voice.gain.disconnect();
      }
      this.musicVoices.clear(); this.foleyVoices.clear();
      this.master.disconnect(); this.musicBus.disconnect(); this.foleyBus.disconnect(); this.limiter.disconnect();
      contextUsers = Math.max(0, contextUsers - 1);
      if (!contextUsers) { this.context.close().catch(() => {}); sharedContext = null; }
    }
    this.bytes.clear(); this.buffers.clear(); this.loads.clear();
  }
}

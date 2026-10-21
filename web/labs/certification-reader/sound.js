// Recorded CC0 music and foley; sources, licenses and hashes: AUDIO_CREDITS.md.
// User preferences, host activity and a temporary lifecycle pause are independent.
const ASSET = path => new URL(`./assets/${path}`, import.meta.url).href;
const FILES = Object.freeze({
  music: 'audio-music/a-new-town.mp3',
  leather1: 'audio-foley/beltHandle1.wav', leather2: 'audio-foley/beltHandle2.wav',
  tail1: 'audio-foley/handleSmallLeather.wav', tail2: 'audio-foley/handleSmallLeather2.wav',
  cloth: 'audio-foley/clothBelt.wav', pin: 'audio-foley/metalClick.wav', latch: 'audio-foley/metalLatch.wav',
  open: 'audio-foley/bookOpen.wav', close: 'audio-foley/bookClose.wav',
  paper1: 'audio-foley/bookFlip1.wav', paper2: 'audio-foley/bookFlip2.wav', paper3: 'audio-foley/bookFlip3.wav',
  settle: 'audio-foley/bookPlace1.wav'
});
const TRIM = Object.freeze({tail1: 2.2, tail2: 3, open: 1.7, paper2: 1.8, settle: .35, close: .45, latch: .55});
const MUSIC_GAIN = .35, END_REST_MS = 1800;
const clamp = (n, min = 0, max = 1) => Math.max(min, Math.min(max, n));
const clock = () => performance.now();
const hidden = () => typeof document !== 'undefined' && document.hidden;
let sharedContext, contextUsers = 0;

function context() {
  if (!sharedContext || sharedContext.state === 'closed') {
    const Context = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!Context) throw Error('此浏览器暂不支持卷轴声音');
    sharedContext = new Context({latencyHint: 'interactive'});
  }
  return sharedContext;
}
function ramp(parameter, value, seconds, ctx) {
  const at = ctx.currentTime;
  if (typeof parameter.cancelAndHoldAtTime === 'function') parameter.cancelAndHoldAtTime(at);
  else { parameter.cancelScheduledValues(at); parameter.setValueAtTime(parameter.value, at); }
  parameter.linearRampToValueAtTime(value, at + seconds);
}

export class SoundDirector {
  constructor() {
    this.musicEnabled = false; this.foleyEnabled = false;
    this.musicVolume = .35; this.foleyVolume = .65;
    this.active = false; this.paused = false; this.disposed = false; this.unlocked = false;
    this.context = null; this.bytes = new Map(); this.buffers = new Map(); this.loads = new Map(); this.failures = new Map();
    this.musicVoice = null; this.musicVoices = new Set(); this.foleyVoices = new Set();
    this.position = 0; this.musicTicket = 0; this.foleyTicket = 0; this.epoch = 0;
    this.restRemainingMs = 0; this.restTimer = 0; this.restStartedAt = 0;
    this.lastMotion = null; this.lastCue = new Map(); this.paperTravel = 0; this.paperVariant = 0;
    this.eventsPlayed = 0; this.lastEvent = null; this.completedPlays = 0;
    this._visibility = () => { if (hidden()) this.pause(); else if (this.active) this.resume(); };
    this._pagehide = () => this.pause();
    globalThis.document?.addEventListener('visibilitychange', this._visibility);
    globalThis.addEventListener?.('pagehide', this._pagehide);
  }

  _nodes() {
    if (this.context || this.disposed) return;
    this.context = context(); contextUsers++;
    const ctx = this.context;
    this.master = ctx.createGain(); this.master.gain.value = .7;
    this.musicBus = ctx.createGain(); this.musicBus.gain.value = MUSIC_GAIN * this.musicVolume;
    this.foleyBus = ctx.createGain(); this.foleyBus.gain.value = this.foleyVolume;
    this.limiter = ctx.createDynamicsCompressor();
    Object.assign(this.limiter.threshold, {value: -10});
    this.limiter.knee.value = 12; this.limiter.ratio.value = 3;
    this.limiter.attack.value = .005; this.limiter.release.value = .16;
    this.musicBus.connect(this.master); this.foleyBus.connect(this.master);
    this.master.connect(this.limiter); this.limiter.connect(ctx.destination);
    this._statechange = () => { if (ctx.state !== 'running') this._stopFoley(); };
    ctx.addEventListener('statechange', this._statechange);
  }

  _canPlay() {
    return !this.disposed && this.active && !this.paused && !hidden() && this.unlocked && this.context?.state === 'running';
  }

  setActive(value) {
    if (this.disposed) return;
    const next = Boolean(value);
    if (next === this.active) return;
    this.active = next; this.epoch++; this.lastMotion = null; this.paperTravel = 0;
    if (!next) { this._stopMusic(); this._stopFoley(); }
    else if (!hidden()) { this.paused = false; this.resume(); }
  }

  setMusicEnabled(value) {
    if (this.disposed) return;
    this.musicEnabled = Boolean(value);
    if (this.musicEnabled) this._syncMusic(); else this._stopMusic();
  }

  setFoleyEnabled(value) {
    if (this.disposed) return;
    this.foleyEnabled = Boolean(value); this.lastMotion = null; this.paperTravel = 0;
    if (!this.foleyEnabled) this._stopFoley();
  }

  setMusicVolume(value) {
    const number = Number(value); if (this.disposed || !Number.isFinite(number)) return;
    this.musicVolume = clamp(number);
    if (this.context) ramp(this.musicBus.gain, MUSIC_GAIN * this.musicVolume, .04, this.context);
  }

  setFoleyVolume(value) {
    const number = Number(value); if (this.disposed || !Number.isFinite(number)) return;
    this.foleyVolume = clamp(number);
    if (this.context) ramp(this.foleyBus.gain, this.foleyVolume, .04, this.context);
  }

  // Only selected, enabled resources are prepared. No context or playback here.
  async prepare() {
    if (this.disposed || !this.active) return false;
    const keys = Object.keys(FILES).filter(key => key === 'music' ? this.musicEnabled : this.foleyEnabled);
    await Promise.allSettled(keys.map(key => this._fetch(key)));
    return !this.disposed;
  }

  // Invoke synchronously within a trusted tap, before awaiting other work.
  // The viewer must not wait for this promise to open or respond to gestures.
  async unlock() {
    if (this.disposed || !this.active || hidden() || (!this.musicEnabled && !this.foleyEnabled)) return false;
    const epoch = this.epoch;
    this._nodes();
    await this.context.resume();
    if (this.disposed || epoch !== this.epoch || !this.active || hidden()) return false;
    if (this.context.state !== 'running') throw Error('声音被系统暂停，请轻触声音按钮重试');
    this.unlocked = true;
    this.prepare().catch(() => {});
    if (this.foleyEnabled) await Promise.allSettled(Object.keys(FILES).filter(key => key !== 'music').map(key => this._buffer(key)));
    if (this.disposed || epoch !== this.epoch || !this._canPlay()) return false;
    this._syncMusic();
    return true;
  }

  async _fetch(key) {
    if (this.bytes.has(key)) return this.bytes.get(key);
    const pending = this.loads.get(`fetch:${key}`); if (pending) return pending;
    const task = fetch(ASSET(FILES[key]), {credentials: 'same-origin'}).then(response => {
      if (!response.ok) throw Error(`声音资源未取得：${key} (${response.status})`);
      return response.arrayBuffer();
    }).then(bytes => {
      if (!this.disposed) { this.bytes.set(key, bytes); this.failures.delete(key); }
      return bytes;
    }).catch(error => { if (!this.disposed) this.failures.set(key, error.message); throw error; });
    this.loads.set(`fetch:${key}`, task);
    try { return await task; } finally { this.loads.delete(`fetch:${key}`); }
  }

  async _buffer(key) {
    if (this.buffers.has(key)) return this.buffers.get(key);
    const pending = this.loads.get(`decode:${key}`); if (pending) return pending;
    const task = this._fetch(key).then(bytes => {
      if (this.disposed || this.context?.state === 'closed') throw Error('卷轴声音已关闭');
      return this.context.decodeAudioData(bytes.slice(0));
    }).then(buffer => {
      if (!this.disposed) { this.buffers.set(key, buffer); this.failures.delete(key); }
      return buffer;
    }).catch(error => { if (!this.disposed) this.failures.set(key, error.message); throw error; });
    this.loads.set(`decode:${key}`, task);
    try { return await task; } finally { this.loads.delete(`decode:${key}`); }
  }

  _position() {
    const voice = this.musicVoice;
    return voice && !voice.stopping ? Math.min(voice.source.buffer.duration, voice.offset + this.context.currentTime - voice.startedAt) : this.position;
  }

  _stopVoice(voice, fade = .04) {
    if (!voice || voice.stopping) return;
    voice.stopping = true;
    if (this.context?.state === 'running' && fade > 0) {
      ramp(voice.gain.gain, 0, fade, this.context);
      try { voice.source.stop(this.context.currentTime + fade + .01); } catch {}
    } else { try { voice.source.stop(); } catch {} }
  }

  _pauseRest() {
    if (!this.restTimer) return;
    this.restRemainingMs = Math.max(0, this.restRemainingMs - (clock() - this.restStartedAt));
    clearTimeout(this.restTimer); this.restTimer = 0; this.restStartedAt = 0;
  }

  _stopMusic() {
    this.musicTicket++;
    if (this.musicVoice) this.position = this._position();
    this.musicVoice = null; this._pauseRest();
    for (const voice of this.musicVoices) this._stopVoice(voice, .08);
  }

  _armRest() {
    if (this.restTimer || !this._canPlay() || !this.musicEnabled) return;
    this.restStartedAt = clock();
    this.restTimer = setTimeout(() => {
      this.restTimer = 0; this.restStartedAt = 0; this.restRemainingMs = 0;
      if (this._canPlay() && this.musicEnabled) this._syncMusic();
    }, this.restRemainingMs);
  }

  _syncMusic() {
    if (!this._canPlay() || !this.musicEnabled || this.musicVoice) return;
    if (this.restRemainingMs > 0) { this._armRest(); return; }
    const ticket = ++this.musicTicket, epoch = this.epoch;
    this._buffer('music').then(buffer => {
      if (ticket !== this.musicTicket || epoch !== this.epoch || !this._canPlay() || !this.musicEnabled || this.musicVoice) return;
      const ctx = this.context, source = ctx.createBufferSource(), gain = ctx.createGain();
      source.buffer = buffer; source.loop = false;
      gain.gain.value = 0; source.connect(gain); gain.connect(this.musicBus);
      const offset = clamp(this.position, 0, Math.max(0, buffer.duration - .001));
      const voice = {source, gain, offset, startedAt: ctx.currentTime, stopping: false};
      this.musicVoice = voice; this.musicVoices.add(voice);
      source.onended = () => {
        source.disconnect(); gain.disconnect(); this.musicVoices.delete(voice);
        if (this.disposed || voice.stopping || this.musicVoice !== voice) return;
        this.musicVoice = null; this.position = 0; this.completedPlays++;
        // Preserve the recording's cadence and tail; this is not a seamless loop.
        this.restRemainingMs = END_REST_MS; this._armRest();
      };
      source.start(0, offset); gain.gain.linearRampToValueAtTime(1, ctx.currentTime + .65);
    }).catch(() => {});
  }

  _stopFoley() {
    this.foleyTicket++;
    for (const voice of this.foleyVoices) this._stopVoice(voice, .025);
    this.lastMotion = null; this.paperTravel = 0;
  }

  _play(key, {gain = .3, group = key, cooldown = 180} = {}) {
    if (!this._canPlay() || !this.foleyEnabled) return;
    const at = clock(), epoch = this.epoch, ticket = this.foleyTicket;
    if (at - (this.lastCue.get(group) ?? -Infinity) < cooldown) return;
    this.lastCue.set(group, at);
    this._buffer(key).then(buffer => {
      if (!this._canPlay() || !this.foleyEnabled || this.epoch !== epoch || this.foleyTicket !== ticket || clock() - at > 350) return;
      const active = [...this.foleyVoices].filter(voice => !voice.stopping);
      if (active.length >= 4) this._stopVoice(active[0], .025);
      const ctx = this.context, source = ctx.createBufferSource(), node = ctx.createGain();
      source.buffer = buffer; node.gain.value = 0;
      node.gain.linearRampToValueAtTime(gain * (TRIM[key] || 1), ctx.currentTime + .008);
      source.connect(node); node.connect(this.foleyBus);
      const voice = {source, gain: node, stopping: false}; this.foleyVoices.add(voice);
      source.onended = () => { source.disconnect(); node.disconnect(); this.foleyVoices.delete(voice); };
      source.start(); this.eventsPlayed++; this.lastEvent = group;
    }).catch(() => {});
  }

  motion({progress = 0, velocity = 0, active = false, direction = 0} = {}) {
    const p = clamp(Number(progress) || 0), now = clock(), previous = this.lastMotion;
    this.lastMotion = {p, at: now};
    if (!this._canPlay() || !this.foleyEnabled) return;
    if (!previous || !active) { this.paperTravel = 0; return; }
    const delta = p - previous.p; if (Math.abs(delta) < .00001) return;
    if (Math.abs(delta) > .18 && now - previous.at < 120) { this.paperTravel = 0; return; }
    const sign = Math.sign(delta) || Math.sign(direction);
    const speed = Math.abs(Number(velocity)) || Math.abs(delta) / Math.max(.016, (now - previous.at) / 1000);
    const crosses = point => sign > 0 ? previous.p < point && p >= point : previous.p > point && p <= point;
    const contacts = sign > 0 ? [
      [.025, 'leather1', 'unload', .35], [.075, 'pin', 'pin-contact', .27],
      [.16, 'tail2', 'tail-slide', .38], [.32, 'cloth', 'keeper-clear', .27],
      [.415, 'open', 'paper-start', .27], [.985, 'settle', 'paper-settle', .16]
    ] : [
      [.97, 'paper3', 'paper-start', .23], [.405, 'close', 'paper-settle', .27],
      [.31, 'cloth', 'keeper-clear', .27], [.16, 'tail1', 'tail-slide', .38],
      [.065, 'latch', 'pin-contact', .26], [.008, 'leather2', 'unload', .3]
    ];
    for (const [point, key, group, gain] of contacts) if (crosses(point)) this._play(key, {group, gain, cooldown: 650});
    if (p > .45 && p < .96 && speed > .015) {
      this.paperTravel += Math.abs(delta);
      if (this.paperTravel > .115) {
        this.paperTravel = 0;
        this._play(`paper${1 + this.paperVariant++ % 3}`, {gain: clamp(.075 + speed * .16, .09, .24), group: 'paper-travel', cooldown: 280});
      }
    } else this.paperTravel = 0;
  }

  pause() {
    if (this.disposed) return;
    this.paused = true; this.epoch++; this._stopMusic(); this._stopFoley();
  }

  resume() {
    if (this.disposed || !this.active || hidden()) return;
    this.paused = false; this.lastMotion = null;
    if (!this.context || !this.unlocked || (!this.musicEnabled && !this.foleyEnabled)) return;
    const epoch = this.epoch;
    this.context.resume().then(() => {
      if (!this.disposed && this.epoch === epoch && this._canPlay()) this._syncMusic();
    }).catch(() => {});
  }

  snapshot() {
    return {
      active: this.active, paused: this.paused, disposed: this.disposed, unlocked: this.unlocked,
      musicEnabled: this.musicEnabled, foleyEnabled: this.foleyEnabled,
      musicVolume: this.musicVolume, foleyVolume: this.foleyVolume,
      contextState: this.context?.state || 'not-created',
      musicTrack: this.musicVoice ? 'a-new-town' : null,
      musicPosition: this._position(), musicDuration: this.buffers.get('music')?.duration || null,
      musicState: this.musicVoice ? 'playing' : this.restRemainingMs > 0 ? 'rest' : 'paused',
      restRemainingMs: this.restTimer ? Math.max(0, this.restRemainingMs - (clock() - this.restStartedAt)) : this.restRemainingMs,
      completedPlays: this.completedPlays, musicVoices: this.musicVoices.size, foleyVoices: this.foleyVoices.size,
      downloaded: this.bytes.size, decoded: [...this.buffers.keys()], failures: Object.fromEntries(this.failures),
      eventsPlayed: this.eventsPlayed, lastEvent: this.lastEvent,
      listeningReview: 'not-auditioned', seamlessLoop: false, issued: false
    };
  }

  dispose() {
    if (this.disposed) return;
    this.setActive(false); this.pause(); this.disposed = true;
    clearTimeout(this.restTimer); this.restTimer = 0;
    globalThis.document?.removeEventListener('visibilitychange', this._visibility);
    globalThis.removeEventListener?.('pagehide', this._pagehide);
    if (this.context) {
      this.context.removeEventListener('statechange', this._statechange);
      for (const voice of [...this.musicVoices, ...this.foleyVoices]) {
        try { voice.source.stop(); } catch {} voice.source.disconnect(); voice.gain.disconnect();
      }
      this.musicVoices.clear(); this.foleyVoices.clear();
      this.musicBus.disconnect(); this.foleyBus.disconnect(); this.master.disconnect(); this.limiter.disconnect();
      contextUsers = Math.max(0, contextUsers - 1);
      if (!contextUsers) { this.context.close().catch(() => {}); sharedContext = null; }
    }
    this.bytes.clear(); this.buffers.clear(); this.loads.clear();
  }
}

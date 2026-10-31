// BGMと効果音。音源ファイルがなくても鳴るように、Web Audio APIで生成する
// BGM_FILES（data.js）にファイルが指定されていれば、そちらを優先する
const Sound = (() => {
  let ctx = null;
  let master, bgmBus, sfxBus, filter;
  let muted = false;
  let mood = null;
  let barTimer = null;
  let pulseTimer = null;
  let fileAudio = null;

  try {
    muted = localStorage.getItem('quiparle.muted') === '1';
  } catch (e) { /* 保存できない環境では毎回ON */ }

  const midi = (m) => 440 * Math.pow(2, (m - 69) / 12);

  // 雰囲気ごとの和音（MIDIノート番号）と音色
  const MOODS = {
    intro: { bar: 7, wave: 'sine', cutoff: 1400, chords: [[48, 55, 64, 71], [45, 52, 60, 67]], bell: 0.25 },
    office: { bar: 4, wave: 'triangle', cutoff: 1800, chords: [[48, 55, 64, 71], [45, 52, 60, 67], [41, 48, 57, 64], [43, 50, 59, 62]], bell: 0.55 },
    day: { bar: 4, wave: 'triangle', cutoff: 2000, chords: [[50, 57, 66, 73], [47, 54, 62, 69], [43, 50, 59, 66], [45, 52, 61, 64]], bell: 0.6 },
    night: { bar: 6, wave: 'sine', cutoff: 1100, chords: [[45, 52, 59, 64], [41, 48, 55, 64], [43, 50, 57, 62], [40, 47, 55, 62]], bell: 0.35 },
    turn: { bar: 6, wave: 'sine', cutoff: 900, chords: [[45, 52, 58, 63], [44, 51, 58, 62]], bell: 0.15 },
    tense: { bar: 3, wave: 'sawtooth', cutoff: 520, chords: [[36, 37, 48, 55], [36, 38, 49, 55]], bell: 0, pulse: true },
    calm: { bar: 4, wave: 'triangle', cutoff: 2200, chords: [[41, 48, 57, 64], [40, 48, 55, 64], [38, 45, 53, 60], [46, 53, 57, 62]], bell: 0.7 },
    cold: { bar: 8, wave: 'sine', cutoff: 800, chords: [[36, 43, 62], [35, 42, 62]], bell: 0.15 },
  };

  function init() {
    if (ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 0.9;
    master.connect(ctx.destination);
    filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1500;
    bgmBus = ctx.createGain();
    bgmBus.gain.value = 0.16;
    filter.connect(bgmBus);
    bgmBus.connect(master);
    sfxBus = ctx.createGain();
    sfxBus.gain.value = 0.3;
    sfxBus.connect(master);
  }

  function tone(freq, dur, { type = 'sine', vol = 0.3, attack = 0.01, when = 0, out = sfxBus } = {}) {
    if (!ctx) return;
    const t = ctx.currentTime + when;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vol, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g);
    g.connect(out);
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  function noise(dur, vol, freq = 1200) {
    if (!ctx) return;
    const len = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = ctx.createBufferSource();
    const bp = ctx.createBiquadFilter();
    const g = ctx.createGain();
    bp.type = 'bandpass';
    bp.frequency.value = freq;
    g.gain.value = vol;
    src.buffer = buf;
    src.connect(bp);
    bp.connect(g);
    g.connect(sfxBus);
    src.start();
  }

  const SFX = {
    type: () => tone(1700 + Math.random() * 300, 0.03, { type: 'square', vol: 0.018 }),
    register: () => { tone(880, 0.16, { vol: 0.16 }); tone(1320, 0.28, { vol: 0.13, when: 0.08 }); },
    process: () => tone(2300 + Math.random() * 500, 0.05, { vol: 0.045 }),
    clue: () => { tone(523, 0.7, { type: 'triangle', vol: 0.2 }); tone(784, 0.9, { type: 'triangle', vol: 0.15, when: 0.12 }); },
    choice: () => tone(660, 0.14, { vol: 0.1 }),
    select: () => tone(440, 0.12, { type: 'triangle', vol: 0.15 }),
    turn: () => noise(0.18, 0.08, 800),
    glitch: () => { noise(0.3, 0.25, 2500); tone(110, 0.25, { type: 'sawtooth', vol: 0.08 }); },
    popup: () => tone(3000 + Math.random() * 900, 0.04, { vol: 0.03 }),
    card: () => { tone(392, 0.45, { vol: 0.1 }); tone(587, 0.55, { vol: 0.08, when: 0.06 }); },
    locked: () => tone(150, 0.3, { type: 'square', vol: 0.07 }),
    boot: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.4, { vol: 0.1, when: i * 0.09 })),
  };

  function sfx(name) {
    if (!ctx || muted || !SFX[name]) return;
    SFX[name]();
  }

  // ---- BGM ----
  function stopBgm() {
    clearInterval(barTimer);
    clearInterval(pulseTimer);
    barTimer = pulseTimer = null;
    if (fileAudio) {
      fileAudio.pause();
      fileAudio = null;
    }
  }

  function playBar(m, index) {
    const chord = m.chords[index % m.chords.length];
    const t = ctx.currentTime;
    chord.forEach((n) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = m.wave;
      o.frequency.value = midi(n);
      o.detune.value = Math.random() * 8 - 4;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.12, t + m.bar * 0.35);
      g.gain.linearRampToValueAtTime(0.0001, t + m.bar * 1.15);
      o.connect(g);
      g.connect(filter);
      o.start(t);
      o.stop(t + m.bar * 1.2);
    });
    // ときどき高い鈴の音を足す
    for (let i = 0; i < 3; i++) {
      if (Math.random() < m.bell) {
        const n = chord[Math.floor(Math.random() * chord.length)] + 24;
        tone(midi(n), 1.6, { vol: 0.05, attack: 0.02, when: Math.random() * m.bar, out: bgmBus });
      }
    }
  }

  function bgm(name) {
    if (name === mood) return;
    mood = name;
    stopBgm();
    if (!ctx || !name) return;
    if (BGM_FILES[name]) {
      fileAudio = new Audio(BGM_FILES[name]);
      fileAudio.loop = true;
      fileAudio.volume = muted ? 0 : 0.5;
      fileAudio.play().catch(() => {});
      return;
    }
    const m = MOODS[name];
    if (!m) return;
    filter.frequency.setTargetAtTime(m.cutoff, ctx.currentTime, 0.5);
    let i = 0;
    playBar(m, i++);
    barTimer = setInterval(() => playBar(m, i++), m.bar * 1000);
    if (m.pulse) pulseTimer = setInterval(() => tone(55, 0.25, { type: 'sine', vol: 0.18, out: bgmBus }), 750);
  }

  function setMuted(on) {
    muted = on;
    try {
      localStorage.setItem('quiparle.muted', on ? '1' : '0');
    } catch (e) { /* 無視 */ }
    if (master) master.gain.setTargetAtTime(on ? 0 : 0.9, ctx.currentTime, 0.05);
    if (fileAudio) fileAudio.volume = on ? 0 : 0.5;
  }

  return {
    init: () => {
      init();
      if (ctx && ctx.state === 'suspended') ctx.resume();
    },
    sfx, bgm, setMuted,
    get muted() { return muted; },
  };
})();

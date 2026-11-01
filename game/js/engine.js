// ゲームエンジン：状態・描画・入力
const G = (() => {
  const $ = (sel) => document.querySelector(sel);
  const el = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  };

  const params = new URLSearchParams(location.search);
  const DEBUG = params.has('debug');

  const S = {
    lang: 'ja',
    phase: 0,
    gauge: 0,          // 情報ゲージ（表示は会話が終わるまで99%で止める）
    human: 0,          // 自分の選択肢を選んだ回数（エンディング後の「自分の言葉」の割合に使う）
    resist: 0,         // PHASE 3でMUSEに逆らった回数（最終選択の条件）
    choices: 0,        // 選択の総数
    clues: new Set(),  // 手帳の伏線 1〜3
    registered: new Set(),
    convDone: new Set(),
    room: null,
    dir: 0,
    bare: false,       // true なら部屋のオブジェクトを出さない（エンディング用）
    mode: 'story',     // story / explore
    busy: false,
    aiOn: false,
    talking: null,
    bio: null,
    log: [],
    lockWarned: false,
    card: null,
    // MUSEが裏で組み立てているもの
    synth: {
      personas: { head: 0, veteran: 0, junior: 0, admin: 0 },
      stages: new Set(),
      dropped: new Set(),
      insights: 0,
      merged: false,
      proc: [],
    },
  };

  // ---------- 文字列 ----------
  const fill = (s, vars) => (vars ? s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m)) : s);
  const L = (o) => (o && typeof o === 'object' ? (o[S.lang] ?? o.ja) : o);
  const t = (key, vars) => {
    const e = SCRIPT[key];
    return e ? fill(e[S.lang] || e.ja, vars) : `[${key}]`;
  };
  const u = (key, vars) => {
    const e = UI_STRINGS[key] || STR[key];
    return e ? fill(L(e), vars) : key;
  };
  // vars の中の多言語オブジェクトを、表示する言語の文字列にする
  const localVars = (vars) => vars && Object.fromEntries(Object.entries(vars).map(([k, v]) => [k, L(v)]));

  // ---------- セリフ ----------
  let line = null;     // { key, vars, sp, mono, shown }
  let typer = null;
  let advance = null;  // クリックで進める処理

  const SP_CLASS = { me: 'me', 'me-ai': 'me-ai', ai: 'ai', sys: 'sys', narr: 'narr', obj: 'narr', note: 'narr' };
  // 大きく、ゆっくり表示するセリフ
  const BIG_LINES = new Set(['E-BAD-09']);

  function speakerName(sp) {
    if (sp === 'me' || sp === 'me-ai') return u('name.me');
    if (sp === 'ai') return 'MUSE';
    return CHARS[sp] ? CHARS[sp].name : '';
  }

  function say(key, vars) {
    return new Promise((resolve) => {
      const e = SCRIPT[key] || { sp: 'sys' };
      if (LINE_FACES[key]) face(...LINE_FACES[key]);
      line = { key, vars, sp: e.sp, mono: !!e.mono, shown: 0 };
      if (e.sp === 'ai') pushLog(key, vars);
      clearInterval(typer);
      typer = setInterval(() => {
        line.shown += 1;
        if (line.shown % 3 === 0) Sound.sfx('type');
        if (line.shown >= t(key, vars).length) stopTyping();
        renderLine();
      }, BIG_LINES.has(key) ? 90 : 22);
      renderLine();
      advance = () => {
        if (typer) {
          stopTyping();
          line.shown = Infinity;
          renderLine();
          return;
        }
        advance = null;
        resolve();
      };
    });
  }

  async function seq(keys) {
    for (const k of keys) await say(k);
  }

  function stopTyping() {
    clearInterval(typer);
    typer = null;
  }

  function clearLine() {
    stopTyping();
    line = null;
    advance = null;
    renderLine();
  }

  function renderLine() {
    const box = $('#textbox');
    if (!line) {
      box.hidden = true;
      return;
    }
    box.hidden = false;
    const cls = ['sp-' + (SP_CLASS[line.sp] || 'npc')];
    if (line.mono) cls.push('mono');
    if (BIG_LINES.has(line.key)) cls.push('big');
    if (S.phase === 3 && line.sp === 'me' && !$('#game').classList.contains('calm')) cls.push('blend');
    box.className = cls.join(' ');
    $('#speaker').textContent = speakerName(line.sp);
    $('#text').textContent = t(line.key, line.vars).slice(0, line.shown);
    $('#next').hidden = !!typer;
  }

  // ---------- MUSEパネル ----------
  let bioTimer = null;

  function pushLog(key, vars) {
    S.log.push({ key, vars });
    if (S.log.length > 3) S.log.shift();
    renderPanel();
  }

  // 裏の処理：情報が流れ込むたびに、ペルソナやジャーニーマップを更新する
  function feed(f) {
    if (!f) return;
    const y = S.synth;
    const lines = [];
    if (f.persona && y.personas[f.persona] < 5) {
      y.personas[f.persona] += 1;
      lines.push(['persona', { x: STR.personas[f.persona] }]);
    }
    if (f.stage) {
      y.stages.add(f.stage);
      lines.push(['journey', { x: STR.stages[f.stage] }]);
    }
    if (f.insight) {
      y.insights += 1;
      lines.push(['insight', { n: y.insights }]);
    }
    if (f.low != null) lines.push(['low', { n: f.low }]);
    if (f.memo) lines.push(['memo']);
    if (f.drop) lines.push(['drop', { x: f.drop }]);
    queueProc(lines);
  }

  let procQueue = [];
  let procTimer = null;

  function queueProc(lines) {
    procQueue.push(...lines);
    if (procTimer) return;
    procTimer = setInterval(() => {
      const next = procQueue.shift();
      if (!next) {
        clearInterval(procTimer);
        procTimer = null;
        renderPanel();
        return;
      }
      S.synth.proc.push([next[0], next[1], Date.now()]);
      if (S.synth.proc.length > 4) S.synth.proc.shift();
      Sound.sfx('process');
      renderPanel();
    }, 420);
  }

  function seedSynth() {
    Object.keys(S.synth.personas).forEach((k) => (S.synth.personas[k] = 1));
    S.synth.stages.add('handover');
    queueProc([['seed']]);
    renderPanel();
  }

  // PHASE 3：評価指標に合わせて、人の多様さと数字にならないものを切り捨てる
  function optimize() {
    procQueue = [];
    S.synth.merged = true;
    S.synth.dropped.add('break');
    queueProc([['metric'], ['merge'], ['drop', { x: STR.stages.break }]]);
    renderPanel();
  }

  function restoreSynth() {
    procQueue = [];
    S.synth.merged = false;
    S.synth.dropped.clear();
    queueProc([['restore']]);
    renderPanel();
  }

  function renderPanel() {
    const panel = $('#ai-panel');
    panel.hidden = !S.aiOn;
    if (!S.aiOn) return;
    $('#ai-title').textContent = `MUSE — ${L(STR.role[S.phase])}`;

    const bio = $('#bio');
    bio.innerHTML = '';
    if (S.bio) {
      bio.append(el('div', 'bio-name', CHARS[S.talking].name));
      [
        ['ui.temp', `${S.bio.temp.toFixed(1)}℃`],
        ['ui.pulse', `${S.bio.pulse} bpm`],
        ['ui.emotion', L(S.bio.emo)],
      ].forEach(([k, v]) => {
        const row = el('div', 'bio-row');
        row.append(el('span', 'k', u(k)), el('span', 'v', v));
        bio.append(row);
      });
    }

    renderSynth();

    const log = $('#ai-log');
    log.innerHTML = '';
    S.log.forEach(({ key, vars }) => log.append(el('div', 'log-row', '› ' + t(key, vars))));
  }

  function renderSynth() {
    const y = S.synth;
    const box = $('#synth');
    box.innerHTML = '';
    const head = el('div', 'synth-title' + (procTimer ? ' busy' : ''), '⟳ ' + u('ui.synth'));
    box.append(head);

    const personas = el('div', 'personas');
    const rows = y.merged ? [['merged', 5]] : Object.entries(y.personas);
    rows.forEach(([k, lv]) => {
      const row = el('div', 'p-row' + (y.merged ? ' merged' : ''));
      row.append(el('span', 'p-name', L(STR.personas[k])));
      const dots = el('span', 'p-dots');
      for (let i = 0; i < 5; i++) dots.append(el('i', i < lv ? 'on' : ''));
      row.append(dots);
      personas.append(row);
    });
    box.append(personas);

    const journey = el('div', 'journey');
    Object.keys(STR.stages).forEach((k) => {
      const cls = ['stage'];
      if (y.stages.has(k)) cls.push('on');
      if (y.dropped.has(k)) cls.push('dropped');
      journey.append(el('span', cls.join(' '), L(STR.stages[k])));
    });
    box.append(journey);

    box.append(el('div', 'insights', `${u('ui.insights')}: ${y.insights}`));

    const proc = el('div', 'proc');
    y.proc.forEach(([k, vars, at]) => {
      const cls = ['proc-row'];
      if (k === 'low' || k === 'drop' || k === 'merge') cls.push('cut');
      if (Date.now() - at < 400) cls.push('new');
      proc.append(el('div', cls.join(' '), fill(L(STR.proc[k]), localVars(vars))));
    });
    box.append(proc);
  }

  function aiOn(on) {
    S.aiOn = on;
    renderAll();
  }

  // ---------- 人物 ----------
  const faces = {}; // 人物ごとの今の表情（なければ normal）

  function imageOf(who) {
    const set = CHAR_IMAGES[who];
    return set ? set[faces[who]] || set.normal : null;
  }

  // 表情を変える。会話中の人物ならその場で差し替える
  function face(who, expr) {
    faces[who] = expr;
    const img = $('#char .figure-img');
    if (S.talking === who && img) img.src = imageOf(who);
  }

  // 立ち絵の画像があればそれを、なければ仮の図形を出す
  function figure(who) {
    const src = imageOf(who);
    if (src) {
      const img = el('img', 'figure-img');
      img.src = src;
      img.alt = CHARS[who] ? CHARS[who].name : '';
      img.draggable = false;
      return img;
    }
    const f = el('div', 'figure');
    f.style.setProperty('--c', (CHARS[who] || CHARS.staff).color);
    f.append(el('div', 'head'), el('div', 'body'));
    return f;
  }

  function talk(who, bio, opts = {}) {
    S.talking = who;
    S.bio = bio ? { ...bio } : null;
    $('#scene').classList.add('talking');
    const c = $('#char');
    c.innerHTML = '';
    c.className = (opts.video ? 'video ' : '') + (CHAR_IMAGES[who] ? 'has-img' : '');
    c.append(figure(who), el('div', 'char-name', CHARS[who].name));
    c.hidden = false;
    clearInterval(bioTimer);
    if (bio) {
      bioTimer = setInterval(() => {
        S.bio.pulse = Math.round(bio.pulse + (Math.random() * 6 - 3));
        renderPanel();
      }, 1400);
    }
    renderPanel();
  }

  function endTalk() {
    S.talking = null;
    S.bio = null;
    clearInterval(bioTimer);
    $('#char').hidden = true;
    $('#scene').classList.remove('talking');
    clearLine();
    renderPanel();
  }

  // ---------- イラスト ----------
  function card(id) {
    S.card = id;
    if (id) Sound.sfx('card');
    renderCard();
  }

  function renderCard() {
    const box = $('#card');
    if (!S.card) {
      box.hidden = true;
      box.innerHTML = '';
      return;
    }
    const c = CARDS[S.card](L);
    box.hidden = false;
    box.className = c.dark ? 'dark' : '';
    box.innerHTML = '';
    box.append(el('div', 'card-title', c.title));
    const body = el('div', 'card-body');
    if (CARD_IMAGES[S.card]) {
      const img = el('img');
      img.src = CARD_IMAGES[S.card];
      img.alt = c.title;
      body.append(img);
    } else {
      body.innerHTML = c.html;
    }
    box.append(body);
  }

  // ---------- 部屋と探索 ----------
  let exploreResolve = null;

  function enterRoom(id, dir = 0, opts = {}) {
    S.room = ROOMS[id];
    S.dir = dir;
    S.bare = !!opts.bare;
    renderRoom();
  }

  function renderRoom() {
    const hs = $('#hotspots');
    hs.innerHTML = '';
    const explore = S.mode === 'explore';
    $('#nav').hidden = !(S.room && explore && !S.busy && S.room.dirs.length > 1);
    if (!S.room) return;

    const d = S.room.dirs[S.dir];
    const img = d.img ? `url("${d.img}")` : '';
    $('#bg').style.background = d.img ? `${img} center / cover no-repeat` : S.room.color;
    $('#backdrop').style.backgroundImage = img;
    $('#view').classList.toggle('has-img', !!d.img);
    $('#bg-label').textContent = d.img ? '' : `${L(S.room.name)} — ${L(STR.dirs)[S.dir]}`;
    $('#bg-note').textContent = d.img ? '' : `[${d.bg}]`;
    $('#dir-label').textContent = L(STR.dirs)[S.dir];
    if (S.bare) return;

    d.spots.forEach((sp) => {
      const node = el('div', `spot ${sp.type}`);
      const [x, y, w, h] = sp.rect;
      const isPerson = sp.type === 'person' || sp.type === 'staff';
      // 立ち絵の画像がある人物は、高さだけ決めて幅は画像に合わせる
      const auto = isPerson && CHAR_IMAGES[sp.who];
      Object.assign(node.style, { left: x + '%', top: y + '%', width: auto ? 'auto' : w + '%', height: h + '%' });
      if (auto) node.classList.add('has-img');

      node.append(isPerson ? figure(sp.who) : el('div', 'art', L(sp.label)));
      if (isPerson) node.append(el('div', 'name', sp.type === 'person' ? CHARS[sp.who].name : L(sp.label)));

      const done = sp.type === 'person' ? S.convDone.has(sp.conv) : S.registered.has(sp.obj);
      // MUSEがハイライトするのは「登録できる物・人」と「キーパーソン」だけ。分析に使わない物には何も付かない
      if (S.aiOn && ['data', 'staff', 'person'].includes(sp.type)) {
        node.classList.add('ai-mark');
        const label = done ? '✓ ' + u(sp.type === 'person' ? 'done.talk' : 'done.reg') : sp.type === 'person' ? 'KEY' : 'MUSE';
        node.append(el('div', 'tag', label));
      }
      if (done) node.classList.add('done');

      if (explore && !S.busy) node.addEventListener('click', () => onSpot(sp));
      else node.classList.add('inactive');
      hs.append(node);
    });
  }

  function turn(step) {
    if (S.mode !== 'explore' || S.busy || !S.room) return;
    S.dir = (S.dir + step + S.room.dirs.length) % S.room.dirs.length;
    Sound.sfx('turn');
    renderRoom();
  }

  async function onSpot(sp) {
    if (S.busy || S.mode !== 'explore') return;
    S.busy = true;
    Sound.sfx('select');
    renderRoom();
    try {
      if (sp.type === 'person') {
        if (!S.convDone.has(sp.conv)) {
          await CONV[sp.conv]();
          S.convDone.add(sp.conv);
          endTalk();
        }
      } else if (sp.type === 'notebook') {
        await openNotebook();
      } else {
        const first = !S.registered.has(sp.obj);
        if (sp.card) card(sp.card);
        await say(sp.obj + ':desc');
        if (first) {
          await say(sp.obj + ':ai');
          S.registered.add(sp.obj);
          Sound.sfx('register');
          feed(sp.feed);
          if (sp.gain) gain(sp.gain);
          if (SCRIPT[sp.obj + ':me']) await say(sp.obj + ':me');
          if (sp.clue) addClue(sp.clue);
        }
        card(null);
      }
      clearLine();
      await checkPhaseEnd();
    } finally {
      S.busy = false;
      renderRoom();
    }
  }

  function phaseConvsDone() {
    const ph = PHASES[S.phase];
    return !ph || ph.convs.every((c) => S.convDone.has(c));
  }

  function phaseDataSpots() {
    const ph = PHASES[S.phase];
    if (!ph) return [];
    return ROOMS[ph.room].dirs.flatMap((d) => d.spots).filter((s) => s.type === 'data' || s.type === 'staff').map((s) => s.obj);
  }

  async function checkPhaseEnd() {
    if (!phaseConvsDone()) {
      if (S.gauge >= 99 && !S.lockWarned) {
        S.lockWarned = true;
        await say('P1-GAUGE-LOCK');
        clearLine();
      }
      return;
    }
    if (S.gauge < 100 && phaseDataSpots().every((o) => S.registered.has(o))) {
      await say('GAUGE-FILL');
      clearLine();
      S.gauge = 100;
      renderHud();
    }
    if (S.gauge >= 100 && exploreResolve) {
      S.mode = 'story';
      const resolve = exploreResolve;
      exploreResolve = null;
      resolve();
    }
  }

  function explore() {
    return new Promise((resolve) => {
      exploreResolve = resolve;
      S.mode = 'explore';
      S.lockWarned = false;
      clearLine();
      renderAll();
    });
  }

  function gain(n) {
    S.gauge += n;
    renderHud();
  }

  function addClue(n) {
    if (S.clues.has(n)) return;
    S.clues.add(n);
    Sound.sfx('clue');
    const btn = $('#btn-notebook');
    btn.classList.remove('flash');
    void btn.offsetWidth;
    btn.classList.add('flash');
    renderHud();
  }

  // ---------- 選択肢 ----------
  let choiceCtx = null;

  function choice(cfg) {
    return new Promise((resolve) => {
      choiceCtx = { cfg, resolve, msg: null, start: performance.now(), holding: false };
      Sound.sfx('choice');
      renderChoices();
      if (!cfg.timer) return;
      const ctx = choiceCtx;
      const tick = () => {
        if (choiceCtx !== ctx) return;
        const left = 1 - (performance.now() - ctx.start) / (cfg.timer * 1000);
        const bar = $('#choice-timer');
        if (bar) bar.style.width = Math.max(0, left) * 100 + '%';
        if (left <= 0 && !ctx.holding) {
          pushLog('SYS-AUTO');
          finishChoice('ai');
          return;
        }
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }

  function finishChoice(r) {
    const ctx = choiceCtx;
    choiceCtx = null;
    Sound.sfx('select');
    renderChoices();
    ctx.resolve(r);
  }

  function showChoiceMsg(msg) {
    choiceCtx.msg = msg;
    Sound.sfx('locked');
    renderChoices();
  }

  function renderChoices() {
    const box = $('#choices');
    if (!choiceCtx) {
      box.hidden = true;
      box.innerHTML = '';
      return;
    }
    const { cfg } = choiceCtx;
    box.hidden = false;
    box.innerHTML = '';

    if (cfg.timer) {
      const bar = el('div', 'timer');
      const fillBar = el('div');
      fillBar.id = 'choice-timer';
      bar.append(fillBar);
      box.append(bar);
    }

    const ai = el('button', 'choice ai' + (S.phase >= 3 ? ' emph' : ''));
    ai.append(el('span', 'tag', u('ui.choice_ai')), el('span', 'label', t(cfg.ai)));
    ai.onclick = () => finishChoice('ai');

    const self = el('button', 'choice self ' + cfg.selfState);
    self.append(el('span', 'tag', u('ui.choice_self')), el('span', 'label', t(cfg.self)), el('span', 'fill'));
    wireSelf(self, cfg);

    box.append(ai, self);
    if (choiceCtx.msg) box.append(el('div', 'choice-msg', choiceCtx.msg.map(([k, v]) => t(k, v)).join('\n')));
  }

  function wireSelf(btn, cfg) {
    const st = cfg.selfState;
    if (st === 'normal') {
      btn.onclick = () => finishChoice('self');
      return;
    }
    if (st === 'locked') {
      btn.onclick = () =>
        showChoiceMsg([['P3-FINAL-LOCKED-01'], ['P3-FINAL-LOCKED-02', { n: S.resist, threshold: THRESHOLD }]]);
      return;
    }
    // struck：長押しで押し切れる（need を指定したときだけ、その伏線が必要）
    const can = !cfg.need || cfg.need.some((c) => S.clues.has(c));
    if (!can) {
      btn.onclick = () => showChoiceMsg([['SYS-HOLD-LOCKED:ai']]);
      return;
    }
    btn.classList.add('holdable');
    btn.append(el('span', 'hold-hint', t('SYS-HOLD')));
    const fillEl = btn.querySelector('.fill');
    let raf = null;
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = null;
      if (choiceCtx) choiceCtx.holding = false;
      fillEl.style.width = '0';
    };
    btn.onpointerdown = (e) => {
      e.preventDefault();
      const start = performance.now();
      choiceCtx.holding = true;
      const step = () => {
        const p = (performance.now() - start) / HOLD_MS;
        fillEl.style.width = Math.min(1, p) * 100 + '%';
        if (p >= 1) {
          raf = null;
          pushLog('SYS-HOLD-DONE:ai');
          finishChoice('self');
        } else {
          raf = requestAnimationFrame(step);
        }
      };
      raf = requestAnimationFrame(step);
    };
    btn.onpointerup = stop;
    btn.onpointerleave = stop;
  }

  // 会話中の選択。PHASE 3だけ、タイマーと取り消し線が付く
  async function ask(cfg) {
    const c = {
      selfState: S.phase === 3 ? 'struck' : 'normal',
      timer: S.phase === 3 ? 5 : 0,
      ...cfg,
    };
    if (c.hint) await say(c.hint);
    const r = await choice(c);
    S.choices += 1;
    if (r === 'self') {
      S.human += 1;
      if (S.phase === 3) S.resist += 1;
      gain(3);
    } else {
      gain(10);
    }
    await say(r === 'self' ? c.self : c.ai);
    if (S.talking && CHARS[S.talking].persona) feed({ persona: CHARS[S.talking].persona });
    return r;
  }

  function finalChoice() {
    return choice({
      ai: 'P3-FINAL-CHOICE-AI',
      self: 'P3-FINAL-CHOICE-SELF',
      selfState: S.resist >= THRESHOLD ? 'normal' : 'locked',
      timer: 0,
    });
  }

  // ---------- オーバーレイ ----------
  let overlayRender = null;

  function showOverlay(kind, render) {
    const ov = $('#overlay');
    ov.className = kind;
    ov.hidden = false;
    overlayRender = () => {
      ov.innerHTML = '';
      render(ov);
    };
    overlayRender();
  }

  function closeOverlay() {
    overlayRender = null;
    const ov = $('#overlay');
    ov.hidden = true;
    ov.innerHTML = '';
  }

  function title() {
    return new Promise((resolve) =>
      showOverlay('title', (ov) => {
        // 背景：ぼかした病院、走査線、MUSEの「目」
        ov.append(el('div', 't-bg'), el('div', 't-eye'), el('div', 't-scan'));
        // 四隅のHUD（監視されている感じ）
        const hud = el('div', 't-hud');
        [
          ['tl', 'MUSE OS v4.2 — DESIGN AGENT'],
          ['tr', '2030.10.31  06:58  —  HÔPITAL SAINT-AUBIN'],
          ['bl', 'SUBJECT: DESIGNER #0417\nVOICE MATCH: 98.4%'],
          ['br', '● LISTENING'],
        ].forEach(([pos, text]) => hud.append(el('div', 't-hud-' + pos, text)));
        ov.append(hud);

        const box = el('div', 'title-card');
        box.append(el('div', 't-year', '— 2030 —'));
        const h1 = el('h1', 't-title', u('title'));
        h1.dataset.text = u('title');
        box.append(h1);
        // ほかの言語のタイトルも小さく並べる（翻訳されていく言葉）
        box.append(el('div', 't-alt', Object.keys(LANG_NAMES).filter((k) => k !== S.lang).map((k) => STR.title[k]).join('   /   ')));
        const wave = el('div', 't-wave');
        for (let i = 0; i < 56; i++) {
          const b = el('i');
          b.style.animationDelay = `${(i * 0.07) % 1.3}s`;
          b.style.height = `${6 + Math.abs(Math.sin(i * 1.7)) * 26}px`;
          wave.append(b);
        }
        box.append(wave, el('p', 'sub', u('subtitle')));
        const langs = el('div', 'title-langs');
        Object.entries(LANG_NAMES).forEach(([code, name]) => {
          const b = el('button', 'btn' + (S.lang === code ? ' on' : ''), name);
          b.onclick = () => setLang(code);
          langs.append(b);
        });
        const go = el('button', 'btn primary', u('start'));
        go.onclick = () => {
          Sound.init();
          goFullscreenLandscape();
          closeOverlay();
          resolve();
        };
        box.append(langs, go);
        ov.append(box);
      })
    );
  }

  function consent(key) {
    return new Promise((resolve) =>
      showOverlay('dim', (ov) => {
        const m = el('div', 'modal consent');
        const text = t(key).replace(/[［[][^］\]]*[］\]]\s*$/, '').trim();
        m.append(el('div', 'consent-icon', '⚠'), el('p', '', text));
        const b = el('button', 'btn primary', u('confirm'));
        b.onclick = () => {
          closeOverlay();
          resolve();
        };
        m.append(b);
        ov.append(m);
      })
    );
  }

  function openNotebook() {
    return new Promise((resolve) =>
      showOverlay('dim', (ov) => {
        const m = el('div', 'modal notebook');
        m.append(el('h2', '', u('ui.notebook')), el('p', 'note-lead', t('NOTE-00')));
        if (S.clues.size) {
          const list = el('ul', 'notes');
          [1, 2, 3].filter((n) => S.clues.has(n)).forEach((n) => list.append(el('li', '', t(`NOTE-0${n}`))));
          m.append(list);
        } else {
          m.append(el('p', 'empty', u('notebook.empty')));
        }
        const close = el('button', 'btn', u('close'));
        close.onclick = () => {
          closeOverlay();
          resolve();
        };
        m.append(close);
        ov.append(m);
      })
    );
  }

  function endScreen(titleKey, descKey) {
    clearLine();
    card(null);
    const p = S.choices ? Math.round((S.human / S.choices) * 100) : 0;
    showOverlay('end', (ov) => {
      const box = el('div', 'end-card');
      box.append(el('h1', '', t(titleKey)));
      if (descKey) box.append(el('p', 'end-desc', t(descKey)));
      box.append(el('p', 'stat', t('END-STAT', { p })), el('p', 'end-hint', t('END-HINT')));
      const again = el('button', 'btn primary', u('restart'));
      again.onclick = () => location.reload();
      box.append(again);
      ov.append(box);
    });
  }

  function cinematic(on) {
    $('#game').classList.toggle('cinematic', on);
  }

  // ---------- PHASE 3：MUSEパネルの暴走 ----------
  // 画面には何も出さず、右のパネルの中だけで処理が止まらなくなっていく
  let runTimer = null;
  let glitchTimer = null;
  const stream = [];

  function startRunaway() {
    stopRunaway();
    $('#game').classList.add('runaway');
    runTimer = setInterval(() => {
      stream.push({ i: Math.floor(Math.random() * STR.popups.length), code: Math.random().toString(16).slice(2, 6).toUpperCase() });
      if (stream.length > 12) stream.shift();
      if (S.bio) S.bio.pulse = Math.round(60 + Math.random() * 60);
      Sound.sfx('popup');
      renderStream();
    }, 280);
    glitchTimer = setInterval(() => {
      const panel = $('#ai-panel');
      panel.classList.add('glitch');
      // 視界全体のノイズはたまにだけ（平均で20秒に1回くらい）
      const wide = Math.random() < 0.18;
      if (wide) $('#view').classList.add('jitter');
      if (wide) Sound.sfx('glitch');
      setTimeout(() => {
        panel.classList.remove('glitch');
        $('#view').classList.remove('jitter');
      }, wide ? 260 + Math.random() * 220 : 160 + Math.random() * 160);
    }, 3600);
  }

  function stopRunaway() {
    clearInterval(runTimer);
    clearInterval(glitchTimer);
    runTimer = glitchTimer = null;
    stream.length = 0;
    $('#game').classList.remove('runaway');
    $('#ai-panel').classList.remove('glitch');
    $('#view').classList.remove('jitter');
    renderStream();
  }

  function renderStream() {
    const box = $('#stream');
    box.hidden = !runTimer;
    box.innerHTML = '';
    stream.forEach(({ i, code }, n) => box.append(el('div', 'stream-row' + (n === stream.length - 1 ? ' new' : ''), `0x${code} ${L(STR.popups[i])}`)));
  }

  // ---------- 全体 ----------
  function setPhase(n) {
    S.phase = n;
    S.gauge = 0;
    S.lockWarned = false;
    $('#game').dataset.phase = n;
    renderAll();
  }

  function setCalm(on) {
    $('#game').classList.toggle('calm', on);
    renderAll();
  }

  function setLang(code) {
    S.lang = code;
    document.documentElement.lang = code;
    renderAll();
  }

  function renderHud() {
    $('#phase-label').textContent = S.phase === 0 ? u('prologue') : `PHASE ${S.phase}`;
    $('#gauge').hidden = S.phase === 0;
    const shown = Math.min(S.gauge, phaseConvsDone() ? 100 : 99);
    $('#gauge-label').textContent = u('ui.gauge');
    $('#gauge-fill').style.width = shown + '%';
    $('#gauge-val').textContent = shown + '%';
    const nb = $('#btn-notebook');
    nb.hidden = S.phase === 0;
    nb.textContent = `${u('ui.notebook')} (${S.clues.size})`;
    const snd = $('#btn-sound');
    snd.textContent = `${Sound.muted ? '🔇' : '♪'} ${u('ui.sound')}`;
    document.querySelectorAll('#langs button').forEach((b) => b.classList.toggle('on', b.dataset.lang === S.lang));
    if (DEBUG) {
      const dbg = $('#debug');
      dbg.hidden = false;
      dbg.textContent =
        `phase ${S.phase}  gauge ${S.gauge}\n` +
        `human ${S.human}/${S.choices}  resist ${S.resist}/3 (need ${THRESHOLD})\n` +
        `clues [${[...S.clues].join(',')}]  registered ${S.registered.size}`;
    }
  }

  // 「グラス越しの視界」：背景の絵全体を見せる範囲
  // MUSEパネル（半透明）が右端に少し重なるように置く。パネルが広がるほど、視界は小さくなる
  const VIEW_RATIO = 1376 / 768;
  const PANEL_OVERLAP = 60;
  const VIEW_MAX_H = 560;
  function layoutView() {
    const panelW = S.aiOn ? parseFloat(getComputedStyle($('#game')).getPropertyValue('--panel-w')) + 32 - PANEL_OVERLAP : 16;
    const right = 1280 - Math.max(16, panelW);
    const w = Math.min(right - 16, VIEW_MAX_H * VIEW_RATIO);
    const h = w / VIEW_RATIO;
    Object.assign($('#view').style, {
      left: (S.aiOn ? right - w : (1280 - w) / 2) + 'px',
      top: '52px',
      width: w + 'px',
      height: h + 'px',
    });
  }

  function renderAll() {
    layoutView();
    renderHud();
    renderRoom();
    renderPanel();
    renderLine();
    renderChoices();
    renderCard();
    if (overlayRender) overlayRender();
    renderStream();
  }

  // 画面サイズに合わせて 1280×720 の画面を拡大・縮小する（スマホのアドレスバーの分も考慮）
  function fit() {
    const vv = window.visualViewport;
    const w = vv ? vv.width : window.innerWidth;
    const h = vv ? vv.height : window.innerHeight;
    const s = Math.min(w / 1280, h / 720);
    $('#game').style.transform = `translate(-50%, -50%) scale(${s})`;
  }

  // スマホでは、はじめるときに全画面＋横向き固定を試す（対応していない端末では何もしない）
  function goFullscreenLandscape() {
    if (!window.matchMedia('(pointer: coarse)').matches) return;
    const root = document.documentElement;
    const req = root.requestFullscreen || root.webkitRequestFullscreen;
    if (!req) return;
    Promise.resolve(req.call(root))
      .then(() => screen.orientation && screen.orientation.lock && screen.orientation.lock('landscape'))
      .catch(() => {});
  }

  function init() {
    fit();
    window.addEventListener('resize', fit);
    if (window.visualViewport) window.visualViewport.addEventListener('resize', fit);
    // 長押し（取り消し線の選択肢を押し切る操作）でメニューが出ないようにする
    $('#game').addEventListener('contextmenu', (e) => e.preventDefault());

    $('#game').addEventListener('click', (e) => {
      if (!advance || e.target.closest('button, .spot, .modal, #hud')) return;
      advance();
    });
    window.addEventListener('keydown', (e) => {
      if ((e.key === ' ' || e.key === 'Enter') && advance && !overlayRender) {
        e.preventDefault();
        advance();
      }
      if (e.key === 'ArrowLeft') turn(-1);
      if (e.key === 'ArrowRight') turn(1);
    });
    document.querySelectorAll('#langs button').forEach((b) => (b.onclick = () => setLang(b.dataset.lang)));
    $('#arrow-left').onclick = () => turn(-1);
    $('#arrow-right').onclick = () => turn(1);
    $('#btn-notebook').onclick = () => {
      if (!overlayRender) openNotebook();
    };
    $('#btn-sound').onclick = () => {
      Sound.init();
      Sound.setMuted(!Sound.muted);
      renderHud();
    };
    renderAll();
  }

  // デバッグ用：?phase=3&clues=1,2&human=4&choices=7 で途中から始める
  function debugPreset() {
    (params.get('clues') || '').split(',').filter(Boolean).forEach((c) => S.clues.add(Number(c)));
    S.human = Number(params.get('human') || 0);
    S.choices = Number(params.get('choices') || S.human);
    seedSynth();
  }

  return {
    S, param: (k) => params.get(k), init, debugPreset,
    say, seq, clearLine, ask, finalChoice, card,
    talk, endTalk, face, enterRoom, explore, setPhase, aiOn, addClue, feed,
    seedSynth, optimize, restoreSynth,
    title, consent, cinematic, endScreen, startRunaway, stopRunaway, setCalm,
  };
})();

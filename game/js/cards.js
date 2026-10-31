// 大事な場面で出すイラスト（仮のSVG/HTML）
// 画像に差し替える場合は CARD_IMAGES に id: 'assets/cards/xxx.png' を書く
const CARD_IMAGES = {};

const CARDS = {
  device: (L) => ({
    title: L({ ja: 'MUSE — デザインAIエージェント', fr: 'MUSE — agent IA de design', en: 'MUSE — design AI agent' }),
    // 事務所の背景（BG-P0）から、机の上のグラスとイヤピースを切り出したクローズアップ
    html: `
      <div class="zoom-shot" style="background-image:url('assets/BG-P0.jpeg')"></div>
      <p class="zoom-desc">${L({
        ja: '<b>MUSE</b>：デザイン専用のAIエージェント。グラスが相手の視線や表情、周囲の様子を読み取り、イヤピースからデザイナーに語りかける。調査、ペルソナ、ジャーニーマップ、プロトタイプまでを裏で組み上げる。',
        fr: "<b>MUSE</b> : un agent IA dédié au design. Les lunettes lisent le regard, les expressions et l'environnement ; l'oreillette parle au designer. Recherche, personas, parcours et prototypes sont construits en arrière-plan.",
        en: '<b>MUSE</b>: a design AI agent. The glasses read gaze, faces and surroundings; the earpiece speaks to the designer. Research, personas, journey maps and prototypes are built in the background.',
      })}</p>`,
  }),

  research: (L) => ({
    title: L({ ja: 'MUSEの事前リサーチ（所要時間：3分）', fr: 'Recherche préalable de MUSE (durée : 3 min)', en: "MUSE's desk research (time taken: 3 min)" }),
    dark: true,
    html: `
      <div class="r-stats">
        <div><b>32</b>${L({ ja: '論文', fr: 'articles', en: 'papers' })}</div>
        <div><b>14</b>${L({ ja: '病院の事例', fr: 'cas hospitaliers', en: 'hospital cases' })}</div>
        <div><b>6</b>${L({ ja: '公開データ', fr: 'jeux de données', en: 'public datasets' })}</div>
      </div>
      <div class="r-label">${L({ ja: '仮ペルソナ', fr: 'Personas provisoires', en: 'Provisional personas' })}</div>
      <div class="r-personas">
        ${['head', 'veteran', 'junior', 'admin'].map((k) => `<div><i></i>${L(STR.personas[k])}</div>`).join('')}
      </div>
      <div class="r-label">${L({ ja: '申し送りのジャーニーマップ（下書き）', fr: 'Parcours de transmission (ébauche)', en: 'Handover journey map (draft)' })}</div>
      <div class="r-journey">
        ${Object.keys(STR.stages).map((k) => `<span>${L(STR.stages[k])}</span>`).join('<em>→</em>')}
      </div>`,
  }),

  relais: (L) => ({
    title: L({ ja: 'プロトタイプ1「Relais」— 部署横断チャット', fr: 'Prototype 1 « Relais » — messagerie inter-services', en: 'Prototype 1 "Relais" — cross-department chat' }),
    html: `
      <div class="phone">
        <div class="phone-head"># ${L({ ja: '全体連絡', fr: 'annonces', en: 'announcements' })}</div>
        <div class="msg"><b>${L(STR.personas.admin)}</b>${L({ ja: '申し送りは端末入力を徹底してください。', fr: 'Merci de saisir toutes les transmissions sur le terminal.', en: 'Please enter all handovers on the terminal.' })}</div>
        <div class="msg"><b>${L(STR.personas.admin)}</b>${L({ ja: '今月の研修のお知らせです。', fr: 'Rappel : formation obligatoire ce mois-ci.', en: 'Reminder: mandatory training this month.' })}</div>
        <div class="msg"><b>${L(STR.personas.admin)}</b>${L({ ja: '既読をつけてください。', fr: 'Merci de confirmer la lecture.', en: 'Please mark as read.' })}</div>
        <div class="msg me">${L({ ja: '了解です', fr: 'Ok', en: 'Ok' })}</div>
      </div>`,
  }),

  voix: (L) => ({
    title: L({ ja: 'プロトタイプ2「Voix」— 声で残す申し送り', fr: 'Prototype 2 « Voix » — transmissions à la voix', en: 'Prototype 2 "Voix" — voice handovers' }),
    html: `
      <div class="phone">
        <div class="phone-head">Voix — ${L(STR.stages.handover)}</div>
        <div class="voice"><b>Camille · 0:28</b><svg viewBox="0 0 160 24">${wave(22)}</svg>
          <p>${L({ ja: '「302号室、夜中に一度発熱。解熱剤投与済み。朝もう一度確認お願いします」', fr: '« Chambre 302 : fièvre cette nuit, antipyrétique donné. À revérifier ce matin. »', en: '"Room 302: fever overnight, antipyretic given. Please recheck this morning."' })}</p></div>
        <div class="voice"><b>Josiane · 0:09</b><svg viewBox="0 0 160 24">${wave(9)}</svg>
          <p>${L({ ja: '「新人ちゃんへ。焦らなくていいからね」', fr: '« Pour les nouveaux : pas de panique. »', en: '"To the new ones: no need to rush."' })}</p></div>
      </div>
      <div class="card-note">${L({ ja: '主人公のアイデア × MUSEの文字起こし', fr: 'Idée humaine × transcription par MUSE', en: 'Human idea × transcription by MUSE' })}</div>`,
  }),

  mediateur: (L) => ({
    title: L({ ja: '最終案「Médiateur」— AIが言葉を仲介する', fr: 'Proposition finale « Médiateur » — l\'IA reformule les échanges', en: 'Final proposal "Médiateur" — the AI mediates every word' }),
    dark: true,
    html: `
      <div class="med">
        <div class="bubble harsh">${L({ ja: '何回言ったらわかるの？　昨日も記録抜けてたでしょ！', fr: 'Combien de fois faut-il le dire ? Encore un oubli de saisie hier !', en: 'How many times do I have to say it? You missed the records again yesterday!' })}</div>
        <div class="med-arrow">→ MUSE →</div>
        <div class="bubble soft">${L({ ja: '昨日の記録に一部抜けがあったようです。確認をお願いできますか？', fr: "Il semble qu'une partie de la saisie d'hier manque. Pourriez-vous vérifier ?", en: "It looks like part of yesterday's records is missing. Could you check?" })}</div>
      </div>
      <div class="card-note">${L({ ja: '衝突の予測件数：0', fr: 'Conflits prévus : 0', en: 'Projected conflicts: 0' })}</div>`,
  }),

  mug: (L) => ({
    title: L({ ja: '流しの横のマグカップ', fr: "Les tasses près de l'évier", en: 'The mugs by the sink' }),
    html: `
      <svg viewBox="0 0 520 240" class="card-svg">
        <rect x="20" y="200" width="480" height="10" rx="5" fill="#cbd5e1"/>
        ${[70, 190, 310].map((x, i) => `
          <rect x="${x}" y="110" width="80" height="90" rx="12" fill="${['#f4a261', '#e9c46a', '#8ecae6'][i]}"/>
          <path d="M${x + 80} 130 q28 0 28 25 q0 25 -28 25" fill="none" stroke="${['#f4a261', '#e9c46a', '#8ecae6'][i]}" stroke-width="9"/>`).join('')}
        <path d="M100 95 q-10 -18 0 -34 M120 95 q-10 -18 0 -34" stroke="#94a3b8" stroke-width="3" fill="none"/>
        <g transform="rotate(-6 435 95)">
          <rect x="360" y="50" width="150" height="90" fill="#fde047"/>
          ${stickyText(L({ ja: '新人用', fr: 'Pour les nouveaux', en: 'For the new ones' }))}
        </g>
      </svg>`,
  }),

  door: (L) => ({
    title: L({ ja: '閉鎖された休憩室', fr: 'La salle de pause fermée', en: 'The closed break room' }),
    dark: true,
    html: `
      <svg viewBox="0 0 520 260" class="card-svg">
        <rect x="160" y="10" width="200" height="250" fill="#475569"/>
        <rect x="185" y="35" width="150" height="110" fill="#cbd5e1" opacity=".55"/>
        <path d="M200 125 q0 -30 30 -30 h60 q30 0 30 30 v15 h-120 z" fill="#334155" opacity=".55"/>
        <rect x="210" y="160" width="100" height="34" fill="#f8fafc"/>
        <text x="260" y="182" font-size="12" text-anchor="middle" fill="#b91c1c">${L({ ja: '関係者以外立入禁止', fr: 'Réservé au personnel', en: 'Staff only' })}</text>
        <circle cx="335" cy="200" r="7" fill="#e2e8f0"/>
      </svg>`,
  }),

  proposal: (L) => ({
    title: L({ ja: '提案：話すための時間', fr: 'Proposition : du temps pour se parler', en: 'Proposal: time to talk' }),
    html: `
      <div class="tl">
        <div class="tl-labels">
          <span>${L({ ja: '日勤', fr: 'Jour', en: 'Day shift' })}</span>
          <span>${L({ ja: '夜勤', fr: 'Nuit', en: 'Night shift' })}</span>
        </div>
        <div class="tl-area">
          <div class="tl-bar day"></div>
          <div class="tl-bar night"></div>
          <div class="tl-overlap"></div>
          <div class="tl-overlap-label">${L({ ja: '対面の申し送り 5分', fr: 'Transmission en face à face : 5 min', en: 'Face-to-face handover: 5 min' })}</div>
        </div>
      </div>
      <div class="legend">
        <div><i class="auto"></i>${L({ ja: '自動化：MUSEがシフトを組み直す', fr: 'Automatisé : MUSE réorganise les plannings', en: 'Automated: MUSE reworks the rota' })}</div>
        <div><i class="aug"></i>${L({ ja: '拡張：Voixで申し送りを声で残す', fr: 'Augmenté : Voix garde les transmissions à la voix', en: 'Augmented: Voix keeps handovers by voice' })}</div>
        <div><i class="human"></i>${L({ ja: '人間：顔を合わせて話す・休憩室を開ける', fr: 'Humain : se parler en face, rouvrir la salle de pause', en: 'Human: talk face to face, reopen the break room' })}</div>
      </div>`,
  }),
};

// 付箋の文字。長い言語では小さくして2行に分ける
function stickyText(s) {
  const attrs = 'text-anchor="middle" fill="#3f3f46" font-family="Klee One, sans-serif"';
  if (s.length <= 6) return `<text x="435" y="102" font-size="20" ${attrs}>${s}</text>`;
  const words = s.split(' ');
  const half = Math.ceil(words.length / 2);
  return `<text x="435" y="90" font-size="16" ${attrs}>${words.slice(0, half).join(' ')}</text>
          <text x="435" y="114" font-size="16" ${attrs}>${words.slice(half).join(' ')}</text>`;
}

// 音声メモの波形（決まった形になるように疑似乱数で作る）
function wave(seed) {
  let x = seed;
  const rnd = () => ((x = (x * 9301 + 49297) % 233280) / 233280);
  return Array.from({ length: 32 }, (_, i) => {
    const h = 4 + rnd() * 16;
    return `<rect x="${i * 5}" y="${12 - h / 2}" width="3" height="${h}" rx="1.5" fill="#38bdf8"/>`;
  }).join('');
}

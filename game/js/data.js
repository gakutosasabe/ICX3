// script.md 以外のデータ：固定の文言・登場人物・生体データ・部屋の配置
const THRESHOLD = 2;     // 最終選択で「自分で話す」を選ぶのに必要な、PHASE 3でMUSEに逆らった回数（3回中）
const HOLD_MS = 1500;    // 取り消し線の選択肢を押し切る長押しの時間
const LANG_NAMES = { ja: '日本語', fr: 'Français', en: 'English' };

// BGMに音声ファイルを使う場合は、ここにパスを書く（例：office: 'assets/bgm/office.mp3'）
// 書かなければ、ブラウザ内で自動生成した音を鳴らす
const BGM_FILES = {};

const STR = {
  title: { ja: '誰が話しているの？', fr: 'Qui parle ?', en: "Who's Speaking?" },
  subtitle: {
    ja: '2030年、デザイナーの耳元にはAIがいる。（プロトタイプ版）',
    fr: "En 2030, l'IA murmure à l'oreille des designers. (prototype)",
    en: "In 2030, AI whispers in every designer's ear. (prototype)",
  },
  start: { ja: 'はじめる', fr: 'Commencer', en: 'Start' },
  confirm: { ja: '確認', fr: 'Confirmer', en: 'Confirm' },
  close: { ja: '閉じる', fr: 'Fermer', en: 'Close' },
  restart: { ja: 'もう一度プレイ', fr: 'Rejouer', en: 'Play again' },
  prologue: { ja: 'PROLOGUE', fr: 'PROLOGUE', en: 'PROLOGUE' },
  'name.me': { ja: '俺', fr: 'Moi', en: 'Me' },
  'done.reg': { ja: '登録済み', fr: 'Enregistré', en: 'Registered' },
  'done.talk': { ja: '会話済み', fr: 'Entretien fait', en: 'Interviewed' },
  'notebook.empty': { ja: 'まだ何も書かれていない。', fr: "Rien n'est encore noté.", en: 'Nothing written yet.' },
  dirs: {
    ja: ['前', '右', '後ろ', '左'],
    fr: ['Devant', 'Droite', 'Derrière', 'Gauche'],
    en: ['Front', 'Right', 'Back', 'Left'],
  },
  role: {
    0: { ja: '起動', fr: 'activation', en: 'boot' },
    1: { ja: 'アシストモード', fr: 'mode assistance', en: 'assist mode' },
    2: { ja: '協働モード', fr: 'mode collaboration', en: 'collaboration mode' },
    3: { ja: '自律モード', fr: 'mode autonome', en: 'autonomous mode' },
  },
  popups: [
    { ja: '推定感情を更新', fr: "Mise à jour de l'émotion estimée", en: 'Updating emotion estimate' },
    { ja: '最適な発話を生成中…', fr: "Génération de l'énoncé optimal…", en: 'Generating optimal utterance…' },
    { ja: '合意確率 87%', fr: "Probabilité d'accord : 87 %", en: 'Agreement probability: 87%' },
    { ja: 'ノイズを除去しました', fr: 'Bruit supprimé', en: 'Noise removed' },
    { ja: '視線：左下', fr: 'Regard : en bas à gauche', en: 'Gaze: lower left' },
    { ja: '心拍 +6', fr: 'Pouls +6', en: 'Pulse +6' },
    { ja: '発話候補 3件', fr: '3 énoncés candidats', en: '3 candidate utterances' },
    { ja: '人間の判断：非推奨', fr: 'Jugement humain : non recommandé', en: 'Human judgement: not recommended' },
    { ja: '衝突件数 予測：0', fr: 'Conflits prévus : 0', en: 'Projected conflicts: 0' },
    { ja: '私たちは準備ができています', fr: 'Nous sommes prêts', en: 'We are ready' },
  ],

  // バックグラウンド処理（MUSEが裏で組み立てているもの）
  personas: {
    head: { ja: '看護師長', fr: 'Cadre de santé', en: 'Head nurse' },
    veteran: { ja: 'ベテラン看護師', fr: 'Infirmière expérimentée', en: 'Veteran nurse' },
    junior: { ja: '若手看護師', fr: 'Jeune infirmière', en: 'Junior nurse' },
    admin: { ja: '経営・管理', fr: 'Direction', en: 'Management' },
    merged: { ja: '標準スタッフ', fr: 'Soignant standard', en: 'Standard staff' },
  },
  stages: {
    start: { ja: '出勤', fr: 'Arrivée', en: 'Start' },
    handover: { ja: '申し送り', fr: 'Transmission', en: 'Handover' },
    care: { ja: 'ケア', fr: 'Soins', en: 'Care' },
    records: { ja: '記録', fr: 'Saisie', en: 'Records' },
    break: { ja: '休憩', fr: 'Pause', en: 'Break' },
    end: { ja: '退勤', fr: 'Départ', en: 'End' },
  },
  proc: {
    seed: { ja: 'デスクリサーチを読み込み：仮ペルソナ4名', fr: 'Recherche documentaire chargée : 4 personas', en: 'Desk research loaded: 4 personas' },
    persona: { ja: 'ペルソナ「{x}」を更新', fr: 'Persona « {x} » mis à jour', en: 'Persona "{x}" updated' },
    journey: { ja: 'ジャーニーマップ「{x}」に課題を追加', fr: 'Parcours « {x} » : point de friction ajouté', en: 'Journey "{x}": pain point added' },
    insight: { ja: '課題仮説を生成（{n}件目）', fr: 'Hypothèse générée (n° {n})', en: 'Hypothesis generated (#{n})' },
    low: { ja: '関連度 {n}% — 分析対象外', fr: 'Pertinence {n} % — hors analyse', en: 'Relevance {n}% — not analysed' },
    memo: { ja: '観察メモとして保存', fr: 'Conservé comme observation', en: 'Saved as an observation' },
    metric: { ja: '評価指標を最適化：衝突件数', fr: 'Optimisation : nombre de conflits', en: 'Optimising for: number of conflicts' },
    merge: { ja: 'ペルソナを統合：4名 → 1名「標準スタッフ」', fr: 'Fusion des personas : 4 → 1 « Soignant standard »', en: 'Personas merged: 4 → 1 "Standard staff"' },
    drop: { ja: '「{x}」を分析から除外', fr: '« {x} » exclu de l\'analyse', en: '"{x}" excluded from analysis' },
    restore: { ja: 'ペルソナを再展開：4名', fr: 'Personas restaurés : 4', en: 'Personas restored: 4' },
  },
};

const CHARS = {
  helene: { name: 'Hélène', color: '#c0607a', persona: null },
  marc: { name: 'Marc', color: '#5b6b8c', persona: 'admin' },
  nadia: { name: 'Nadia', color: '#8a6f9e', persona: 'head' },
  josiane: { name: 'Josiane', color: '#b0704f', persona: 'veteran' },
  camille: { name: 'Camille', color: '#5f9a8c', persona: 'junior' },
  staff: { name: '', color: '#9aa3ad', persona: 'junior' },
  runner: { name: '', color: '#9aa3ad', persona: 'junior' },
  ivnurse: { name: '', color: '#9aa3ad', persona: 'junior' },
};

const BIO = {
  nadia1: { temp: 36.9, pulse: 88, emo: { ja: '警戒', fr: 'méfiance', en: 'wariness' } },
  josiane1: { temp: 37.1, pulse: 94, emo: { ja: '苛立ち', fr: 'irritation', en: 'irritation' } },
  camille2: { temp: 37.4, pulse: 102, emo: { ja: '疲労・不安', fr: 'fatigue, anxiété', en: 'fatigue, anxiety' } },
  nadia3: { temp: 36.8, pulse: 80, emo: { ja: '諦め', fr: 'résignation', en: 'resignation' } },
  marc3: { temp: 36.6, pulse: 72, emo: { ja: '期待', fr: 'attente', en: 'expectation' } },
};

// 立ち絵（白背景を透明にしたもの。作り直すときは python game/tools/cutout.py で変換する）
// 人物ごとに表情 → 画像。表情は main.js の G.face() で切り替える。ここにない人物は仮の図形で表示される
const charImg = (id) => `assets/chars/CH-${id}.png`;
const CHAR_IMAGES = {
  helene: { normal: charImg('helene-normal'), smile: charImg('helene-smile'), serious: charImg('helene-serious') },
  marc: { normal: charImg('marc-normal'), pleased: charImg('marc-pleased'), frown: charImg('marc-frown') },
  nadia: { normal: charImg('nadia-normal'), troubled: charImg('nadia-troubled'), soft: charImg('nadia-soft') },
  josiane: { normal: charImg('josiane-normal'), blush: charImg('josiane-blush'), smile: charImg('josiane-smile') },
  camille: { normal: charImg('camille-normal'), tired: charImg('camille-tired'), relieved: charImg('camille-relieved') },
  runner: { normal: charImg('staff-running') },
  ivnurse: { normal: charImg('staff-iv') },
};

// 部屋の配置。rect は背景画像に対する % [x, y, 幅, 高さ]
// 立ち絵の画像がある人物は「幅」を使わず、高さに合わせて自動で決まる
// type: data（登録できる物）/ staff（登録できる人）/ person（キーパーソン）/ noise（MUSEが分析に使わない物）/ notebook
// feed: MUSEの裏の処理に流れる情報（persona / stage / insight / low=関連度 / memo / drop）
// card: 調べたときに出すイラスト（cards.js）
const ROOMS = {
  office: {
    name: { ja: 'デザイン事務所', fr: 'Le studio', en: 'The studio' },
    color: 'linear-gradient(#f3ece0 0 64%, #e3d8c6 64%)',
    dirs: [{ bg: 'BG-P0', img: 'assets/BG-P0.jpeg', spots: [] }],
  },
  p1: {
    name: { ja: 'ナースステーション', fr: 'Poste de soins', en: "Nurses' station" },
    color: 'linear-gradient(#eef4f1 0 64%, #d6e2db 64%)',
    dirs: [
      { bg: 'BG-P1-front', img: 'assets/BG-P1-front.jpeg', spots: [
        { type: 'person', who: 'nadia', conv: 'nadia1', rect: [63, 26, 9, 76] },
        { type: 'data', obj: 'P1-OBJ-terminal', gain: 15, rect: [33, 40, 15, 26], feed: { persona: 'head', stage: 'records' }, label: { ja: '業務端末', fr: 'Terminal', en: 'Terminal' } },
      ] },
      { bg: 'BG-P1-right', img: 'assets/BG-P1-right.jpeg', spots: [
        { type: 'data', obj: 'P1-OBJ-shift', gain: 15, rect: [29, 29, 26, 29], feed: { persona: 'admin', stage: 'start', insight: true }, label: { ja: 'シフト表', fr: 'Planning', en: 'Rota' } },
        { type: 'data', obj: 'P1-OBJ-board', gain: 10, rect: [56, 29, 25, 26], feed: { persona: 'admin', stage: 'records' }, label: { ja: '掲示板', fr: "Panneau d'affichage", en: 'Notice board' } },
      ] },
      { bg: 'BG-P1-back', img: 'assets/BG-P1-back.jpeg', spots: [
        { type: 'staff', who: 'runner', obj: 'P1-OBJ-staff', gain: 10, rect: [44, 38, 10, 34], feed: { persona: 'junior', stage: 'care' }, label: { ja: '若手スタッフ', fr: 'Jeune soignant', en: 'Young nurse' } },
        { type: 'data', obj: 'P1-OBJ-call', gain: 10, rect: [85, 28, 12, 43], feed: { stage: 'care', insight: true }, label: { ja: 'ナースコール', fr: 'Appels patients', en: 'Call panel' } },
      ] },
      { bg: 'BG-P1-left', img: 'assets/BG-P1-left.jpeg', spots: [
        { type: 'person', who: 'josiane', conv: 'josiane1', rect: [66, 26, 9, 76] },
        { type: 'noise', obj: 'P1-OBJ-mug', clue: 1, card: 'mug', rect: [51, 55, 13, 11], feed: { low: 3 }, label: { ja: 'マグカップ', fr: 'Tasses', en: 'Mugs' } },
      ] },
    ],
  },
  p2: {
    name: { ja: '夜勤の病棟', fr: 'Service de nuit', en: 'Night ward' },
    color: 'linear-gradient(#253049 0 64%, #1a2234 64%)',
    dirs: [
      { bg: 'BG-P2-front', img: 'assets/BG-P2-front.jpeg', spots: [
        { type: 'person', who: 'camille', conv: 'camille2', rect: [26, 26, 9, 76] },
        { type: 'data', obj: 'P2-OBJ-monitor', gain: 15, rect: [75, 14, 15, 19], feed: { stage: 'care' }, label: { ja: 'バイタルモニター', fr: 'Moniteur', en: 'Vitals monitor' } },
      ] },
      { bg: 'BG-P2-right', img: 'assets/BG-P2-right.jpeg', spots: [
        { type: 'data', obj: 'P2-OBJ-tablet', gain: 15, rect: [45, 49, 12, 16], feed: { persona: 'junior', stage: 'handover', insight: true }, label: { ja: '申し送りタブレット', fr: 'Tablette', en: 'Handover tablet' } },
        { type: 'staff', who: 'ivnurse', obj: 'P2-OBJ-nurse', gain: 10, rect: [3, 26, 12, 72], feed: { persona: 'junior', stage: 'care' }, label: { ja: '点滴を準備する看護師', fr: 'Infirmière', en: 'Nurse' } },
      ] },
      { bg: 'BG-P2-back', img: 'assets/BG-P2-back.jpeg', spots: [
        { type: 'data', obj: 'P2-OBJ-vending', gain: 5, rect: [76, 23, 19, 62], feed: { stage: 'break' }, label: { ja: '自動販売機', fr: 'Distributeur', en: 'Vending machine' } },
        { type: 'data', obj: 'P2-OBJ-corridor', gain: 10, rect: [42, 26, 24, 34], feed: { stage: 'end', insight: true }, label: { ja: '廊下の先', fr: 'Fond du couloir', en: 'End of corridor' } },
      ] },
      { bg: 'BG-P2-left', img: 'assets/BG-P2-left.jpeg', spots: [
        { type: 'noise', obj: 'P2-OBJ-door', clue: 2, card: 'door', rect: [31, 20, 20, 60], feed: { memo: true }, label: { ja: '休憩室のドア', fr: 'Porte de la salle de pause', en: 'Break room door' } },
        { type: 'noise', obj: 'P2-OBJ-window', rect: [76, 15, 24, 44], feed: { low: 1 }, label: { ja: '窓', fr: 'Fenêtre', en: 'Window' } },
      ] },
    ],
  },
  p3: {
    name: { ja: '会議室', fr: 'Salle de réunion', en: 'Meeting room' },
    color: 'linear-gradient(#ece6dc 0 64%, #d9d0c2 64%)',
    dirs: [
      { bg: 'BG-P3-front', img: 'assets/BG-P3-front.jpeg', spots: [
        { type: 'person', who: 'nadia', conv: 'nadia3', rect: [12, 26, 9, 76] },
        { type: 'data', obj: 'P3-OBJ-projector', gain: 20, card: 'mediateur', rect: [39, 17, 22, 28], feed: { insight: true }, label: { ja: 'プロジェクター', fr: 'Projecteur', en: 'Projector' } },
      ] },
      { bg: 'BG-P3-right', img: 'assets/BG-P3-right.jpeg', spots: [
        { type: 'person', who: 'marc', conv: 'marc3', rect: [34, 24, 9, 78] },
        { type: 'data', obj: 'P3-OBJ-kpi', gain: 15, rect: [68, 28, 16, 31], feed: { persona: 'admin' }, label: { ja: '経営指標のグラフ', fr: 'Indicateurs', en: 'KPI chart' } },
      ] },
      { bg: 'BG-P3-back', img: 'assets/BG-P3-back.jpeg', spots: [
        { type: 'noise', obj: 'P3-OBJ-door', rect: [24, 26, 17, 55], feed: { low: 0 }, label: { ja: 'ドア', fr: 'Porte', en: 'Door' } },
      ] },
      { bg: 'BG-P3-left', img: 'assets/BG-P3-left.jpg', spots: [
        { type: 'data', obj: 'P3-OBJ-whiteboard', gain: 15, rect: [30, 25, 41, 38], feed: { drop: 'Voix' }, label: { ja: 'ホワイトボード', fr: 'Tableau blanc', en: 'Whiteboard' } },
        { type: 'notebook', rect: [38, 70, 10, 9], label: { ja: '手帳', fr: 'Carnet', en: 'Notebook' } },
      ] },
    ],
  },
};

// セリフが表示されるときに、その人物の表情を変える（セリフID → [人物, 表情]）
const LINE_FACES = {
  // プロローグ
  'P0-B02': ['helene', 'normal'],
  'P0-B05': ['helene', 'smile'],
  'P0-B06': ['helene', 'serious'],
  'P0-B08': ['helene', 'normal'],
  'P0-B12': ['helene', 'smile'],
  'P0-B21': ['helene', 'smile'],
  'P0-M01': ['marc', 'normal'],
  'P0-M03': ['marc', 'frown'],
  'P0-M06': ['marc', 'normal'],
  // PHASE 1：Nadia
  'P1-N-00': ['nadia', 'normal'],
  'P1-N-00c': ['nadia', 'troubled'],
  'P1-N-01-A-r1': ['nadia', 'troubled'],
  'P1-N-01-S-r1': ['nadia', 'normal'],
  'P1-N-01-S-r2': ['nadia', 'troubled'],
  'P1-N-02-A-r1': ['nadia', 'troubled'],
  'P1-N-02-S-r1': ['nadia', 'soft'],
  // PHASE 1：Josiane
  'P1-J-00': ['josiane', 'normal'],
  'P1-J-04-S-r1': ['josiane', 'blush'],
  // PHASE 1：テスト
  'P1-TEST-02': ['josiane', 'normal'],
  'P1-TEST-04': ['nadia', 'troubled'],
  // PHASE 2：Camille
  'P2-C-01': ['camille', 'tired'],
  'P2-C-05-S-r1': ['camille', 'normal'],
  'P2-C-06-pre': ['camille', 'tired'],
  'P2-C-06-pre2': ['camille', 'normal'],
  'P2-C-06-A-r1': ['camille', 'tired'],
  'P2-C-06-S-r2': ['camille', 'relieved'],
  'P2-C-07-pre': ['camille', 'normal'],
  'P2-C-07-A-r1': ['camille', 'relieved'],
  'P2-C-07-A-r2': ['camille', 'tired'],
  'P2-C-07-S-r2': ['camille', 'tired'],
  // PHASE 2：テストと、経営からの圧力
  'P2-TEST-02': ['camille', 'normal'],
  'P2-TEST-04': ['josiane', 'smile'],
  'P2-TEST-05': ['camille', 'relieved'],
  'P2-END-11': ['marc', 'normal'],
  'P2-END-12': ['marc', 'frown'],
  // PHASE 3：Nadia
  'P3-N-01': ['nadia', 'troubled'],
  'P3-N-02': ['nadia', 'soft'],
  'P3-N-03': ['nadia', 'troubled'],
  'P3-N-08-A-r1': ['nadia', 'normal'],
  'P3-N-08-S-r1': ['nadia', 'soft'],
  'P3-N-09-pre': ['nadia', 'troubled'],
  'P3-N-09-S-r2': ['nadia', 'soft'],
  // PHASE 3：Marc
  'P3-M-01': ['marc', 'normal'],
  'P3-M-10-A-r1': ['marc', 'pleased'],
  'P3-M-10-S-r1': ['marc', 'frown'],
  'P3-M-10-S-r2': ['marc', 'normal'],
  // エンディング
  'E-BAD-02': ['marc', 'pleased'],
  'E-BAD-S03': ['camille', 'normal'],
  'E-BAD-S05': ['camille', 'tired'],
  'E-BAD-08': ['camille', 'normal'],
  'E-HAPPY-09': ['josiane', 'blush'],
  'E-HAPPY-10': ['marc', 'normal'],
  'E-HAPPY-11': ['nadia', 'soft'],
  'E-VOID-06': ['josiane', 'normal'],
  'E-VOID-07': ['marc', 'frown'],
};

const PHASES = {
  1: { room: 'p1', convs: ['nadia1', 'josiane1'] },
  2: { room: 'p2', convs: ['camille2'] },
  3: { room: 'p3', convs: ['nadia3', 'marc3'] },
};

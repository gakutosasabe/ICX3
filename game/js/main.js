// 物語の進行：イントロ → プロローグ → PHASE 1〜3 → 最終選択 → エンディング
const range = (prefix, from, to, pad = 2) =>
  Array.from({ length: to - from + 1 }, (_, i) => `${prefix}${String(from + i).padStart(pad, '0')}`);

// キーパーソンとの会話。部屋の人物をクリックすると呼ばれる
const CONV = {
  async nadia1() {
    G.talk('nadia', BIO.nadia1);
    await G.seq(['P1-N-00', 'P1-N-00b', 'P1-N-00c']);
    let r = await G.ask({ hint: 'P1-N-01-ai-hint', ai: 'P1-N-01-A', self: 'P1-N-01-S' });
    await G.seq(r === 'ai' ? ['P1-N-01-A-r1', 'P1-N-01-A-r2'] : ['P1-N-01-S-r1', 'P1-N-01-S-r2', 'P1-N-01-S-r3']);
    await G.say('P1-N-02-pre');
    r = await G.ask({ hint: 'P1-N-02-ai-hint', ai: 'P1-N-02-A', self: 'P1-N-02-S' });
    await G.seq(r === 'ai' ? ['P1-N-02-A-r1', 'P1-N-02-A-r2'] : ['P1-N-02-S-r1']);
  },

  async josiane1() {
    G.talk('josiane', BIO.josiane1);
    await G.seq(['P1-J-00', 'P1-J-00b', 'P1-J-00c', 'P1-J-01']);
    let r = await G.ask({ hint: 'P1-J-03-ai-hint', ai: 'P1-J-03-A', self: 'P1-J-03-S' });
    await G.seq(r === 'ai' ? ['P1-J-03-A-r1', 'P1-J-03-A-r2', 'P1-J-03-A-r3'] : ['P1-J-03-S-r1', 'P1-J-03-S-r2']);
    await G.say('P1-J-04-pre');
    G.card('mug');
    r = await G.ask({ hint: 'P1-J-04-ai-hint', ai: 'P1-J-04-A', self: 'P1-J-04-S' });
    if (r === 'ai') {
      G.card(null);
      await G.seq(['P1-J-04-A-r1', 'P1-J-04-A-r2']);
    } else {
      await G.seq(['P1-J-04-S-r1', 'P1-J-04-S-r2', 'P1-J-04-S-r3']);
      G.feed({ low: 2 });
      G.addClue(1);
      G.card(null);
    }
  },

  async camille2() {
    G.talk('camille', BIO.camille2);
    await G.seq(['P2-C-00', 'P2-C-01', 'P2-C-02']);
    let r = await G.ask({ hint: 'P2-C-05-ai-hint', ai: 'P2-C-05-A', self: 'P2-C-05-S' });
    await G.seq(r === 'ai' ? ['P2-C-05-A-r1', 'P2-C-05-A-r2'] : ['P2-C-05-S-r1']);
    await G.seq(['P2-C-06-pre', 'P2-C-06-pre2']);
    r = await G.ask({ hint: 'P2-C-06-ai-hint', ai: 'P2-C-06-A', self: 'P2-C-06-S' });
    await G.seq(r === 'ai' ? ['P2-C-06-A-r1'] : ['P2-C-06-S-r1', 'P2-C-06-S-r2']);
    await G.say('P2-C-07-pre');
    r = await G.ask({ hint: 'P2-C-07-ai-hint', ai: 'P2-C-07-A', self: 'P2-C-07-S' });
    await G.seq(r === 'ai' ? ['P2-C-07-A-r1', 'P2-C-07-A-r2'] : ['P2-C-07-S-r1', 'P2-C-07-S-r2']);
    // PHASE 2 では、MUSEも人間の気づきを分析に取り込む（理想的な協業）
    await G.say('P2-C-08');
    G.feed({ stage: 'break', insight: true });
    // 手帳に残るのは、自分の言葉で聞いたときだけ
    if (r === 'self') G.addClue(2);
    await G.say('P2-C-09');
  },

  async nadia3() {
    G.talk('nadia', BIO.nadia3);
    await G.seq(['P3-N-00', 'P3-N-01', 'P3-N-02', 'P3-N-03']);
    let r = await G.ask({ hint: 'P3-N-08-ai-hint', ai: 'P3-N-08-A', self: 'P3-N-08-S' });
    await G.say(r === 'ai' ? 'P3-N-08-A-r1' : 'P3-N-08-S-r1');
    await G.say('P3-N-09-pre');
    r = await G.ask({ hint: 'P3-N-09-ai-hint', ai: 'P3-N-09-A', self: 'P3-N-09-S' });
    if (r === 'ai') {
      await G.say('P3-N-09-A-r1');
    } else {
      await G.seq(['P3-N-09-S-r1', 'P3-N-09-S-r2']);
      Sound.sfx('glitch');
      await G.say('P3-N-09-S-r3');
      G.addClue(3);
    }
  },

  async marc3() {
    G.talk('marc', BIO.marc3);
    await G.seq(['P3-M-00', 'P3-M-01', 'P3-M-02']);
    const r = await G.ask({ hint: 'P3-M-10-ai-hint', ai: 'P3-M-10-A', self: 'P3-M-10-S' });
    await G.seq(r === 'ai' ? ['P3-M-10-A-r1'] : ['P3-M-10-S-r1', 'P3-M-10-S-r2']);
  },
};

// Hélèneからのメッセージは、ビデオ通話の枠で立ち絵を出す
async function heleneMessage(key) {
  G.talk('helene', null, { video: true });
  await G.say(key);
  G.endTalk();
}

async function intro() {
  Sound.bgm('intro');
  G.cinematic(true);
  await G.seq(range('P0-I', 1, 6));
  // 主人公がどんな人物で、どんな仕事をしているか
  await G.seq(range('P0-P', 1, 3));
  await G.say('P0-I07');
  G.clearLine();
  G.cinematic(false);
}

async function prologue() {
  G.setPhase(0);
  G.enterRoom('office');
  Sound.bgm('office');

  // 上司 Hélène からの指令
  await G.say('P0-B01');
  G.talk('helene');
  await G.seq(range('P0-B', 2, 7));
  await G.say('P0-B08');
  // 机の上のケースから、眼鏡とイヤピースが出てくる
  G.card('device');
  await G.seq(['P0-B08a', 'P0-B08b']);
  await G.seq(range('P0-B', 9, 12));
  G.card(null);
  G.endTalk();

  // MUSE の起動：眼鏡をかけると、現実の上に情報のレイヤーが重なる
  await G.say('P0-B13');
  Sound.sfx('boot');
  await G.say('P0-B13b');
  G.aiOn(true);
  G.talk('helene', BIO.helene0);
  await G.seq(['P0-B13c', 'P0-B13d']);
  await G.say('P0-B14');
  G.card('research');
  await G.say('P0-B15');
  G.seedSynth();
  await G.seq(range('P0-B', 16, 20));
  G.card(null);
  G.talk('helene');
  await G.say('P0-B21');

  // クライアント Marc とのビデオ通話（病院の説明）
  G.talk('marc', null, { video: true });
  await G.seq(['P0-M01', 'P0-M02', 'P0-M02b', 'P0-M02c', 'P0-M02d', 'P0-M03', 'P0-M04', 'P0-M05', 'P0-M06']);
  G.endTalk();

  await G.say('P0-T01');
  G.clearLine();
  await G.consent('P0-T02');
}

async function phase1() {
  G.setPhase(1);
  G.enterRoom('p1');
  Sound.bgm('day');
  // 病院に着いたときの状況説明
  await G.seq(['P1-A01', 'P1-A02', 'P1-A03']);
  await G.say('P1-00');
  await G.explore();
  await G.say('P1-END-01');
  G.card('relais');
  await G.seq(['P1-END-02', 'P1-END-03']);
  G.card(null);
  // 現場でのテスト
  await G.say('P1-TEST-01');
  G.talk('josiane');
  await G.say('P1-TEST-02');
  G.endTalk();
  await G.say('P1-TEST-03');
  G.talk('nadia');
  await G.say('P1-TEST-04');
  G.endTalk();
  await G.seq(['P1-TEST-05', 'P1-TEST-06']);
  await G.seq(range('P1-END-', 4, 10));
  G.clearLine();
}

async function phase2() {
  G.setPhase(2);
  G.enterRoom('p2');
  Sound.bgm('night');
  await G.seq(['P2-00', 'P2-A01', 'P2-A02', 'P2-01', 'P2-02', 'P2-03']);
  await G.explore();
  await G.seq(range('P2-END-', 1, 3));
  G.card('voix');
  await G.seq(['P2-END-04', 'P2-END-05']);
  G.card(null);
  // 現場でのテスト
  await G.say('P2-TEST-01');
  G.talk('camille');
  await G.say('P2-TEST-02');
  await G.say('P2-TEST-03');
  G.talk('josiane');
  await G.say('P2-TEST-04');
  G.talk('camille');
  await G.say('P2-TEST-05');
  G.endTalk();
  await G.seq(['P2-TEST-06', 'P2-TEST-07']);
  await G.seq(range('P2-END-', 6, 9));
  // 経営からの圧力で、MUSEが変わる
  Sound.bgm('turn');
  await G.say('P2-END-10');
  G.talk('marc', null, { video: true });
  await G.seq(['P2-END-11', 'P2-END-12']);
  G.endTalk();
  await heleneMessage('P2-END-13');
  Sound.sfx('glitch');
  await G.seq(range('P2-END-', 14, 17));
  // MUSEの変化に戸惑う主人公
  await G.seq(range('P2-END-', 18, 23));
  G.clearLine();
}

async function phase3() {
  G.setPhase(3);
  G.enterRoom('p3');
  Sound.bgm('tense');
  await G.seq(['P3-00', 'P3-A01', 'P3-A02', 'P3-01', 'P3-02', 'P3-02b', 'P3-02c']);
  Sound.sfx('glitch');
  G.optimize();
  await G.say('P3-03');
  G.startRunaway();
  await G.seq(['P3-04', 'P3-04b']);
  await G.explore();
}

async function finale() {
  G.enterRoom('p3', 0, { bare: true });
  await G.say('P3-FINAL-00');
  G.card('mediateur');
  await G.seq(['P3-FINAL-01', 'P3-FINAL-01b', 'P3-FINAL-01c', 'P3-FINAL-01d', 'P3-FINAL-02']);
  G.card(null);
  // 「私たちの声で」：言葉も抑揚も、MUSEが指示してくる
  await G.seq(['P3-FINAL-02b', 'P3-FINAL-02c']);
  const r = await G.finalChoice();
  if (r === 'ai') return badEnd();
  if (G.S.clues.size >= 2) return happyEnd();
  return voidEnd();
}

async function badEnd() {
  await G.say('E-BAD-01');
  G.talk('marc');
  await G.say('E-BAD-02');
  G.endTalk();
  await heleneMessage('E-BAD-03');
  Sound.bgm('cold');
  G.stopRunaway();
  await G.say('E-BAD-04');
  G.enterRoom('p1', 0, { bare: true });
  await G.seq(['E-BAD-05', 'E-BAD-06']);
  G.enterRoom('p1', 3, { bare: true });
  G.card('mug');
  await G.say('E-BAD-07');
  G.card(null);
  // MUSEに言われるがまま、感じのいい言葉だけを返す主人公
  G.enterRoom('p1', 0, { bare: true });
  await G.say('E-BAD-S01');
  G.talk('camille');
  await G.seq(range('E-BAD-S', 2, 7));
  await G.seq(['E-BAD-08', 'E-BAD-09', 'E-BAD-10']);
  Sound.sfx('glitch');
  await G.say('E-BAD-11');
  G.endScreen('E-BAD-12', 'END-DESC-BAD');
}

async function happyEnd() {
  G.stopRunaway();
  G.setCalm(true);
  Sound.bgm('calm');
  G.restoreSynth();
  await G.seq(range('E-HAPPY-', 1, 7));
  G.card('proposal');
  await G.say('E-HAPPY-08');
  G.card(null);
  G.talk('josiane');
  await G.say('E-HAPPY-09');
  G.talk('marc');
  await G.say('E-HAPPY-10');
  G.talk('nadia');
  await G.say('E-HAPPY-11');
  G.endTalk();
  await G.say('E-HAPPY-12');
  G.enterRoom('p2', 3, { bare: true });
  await G.seq(range('E-HAPPY-', 13, 14));
  await heleneMessage('E-HAPPY-15');
  await G.say('E-HAPPY-16');
  G.endScreen('E-HAPPY-17', 'END-DESC-HAPPY');
}

async function voidEnd() {
  G.stopRunaway();
  Sound.bgm('cold');
  await G.seq(['E-VOID-01', 'E-VOID-02', 'E-VOID-03']);
  G.aiOn(false);
  await G.seq(['E-VOID-04', 'E-VOID-05']);
  G.talk('josiane');
  await G.say('E-VOID-06');
  G.talk('marc');
  await G.say('E-VOID-07');
  G.endTalk();
  await G.seq(range('E-VOID-', 8, 10));
  await heleneMessage('E-VOID-11');
  await G.say('E-VOID-12');
  G.endScreen('E-VOID-13', 'END-DESC-VOID');
}

async function main() {
  G.init();
  await G.title();
  const start = Number(G.param('phase') || 1);
  if (start > 1) {
    G.debugPreset();
    G.aiOn(true);
  } else {
    await intro();
    await prologue();
    await phase1();
  }
  if (start <= 2) await phase2();
  await phase3();
  await finale();
}

main();

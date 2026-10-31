# 会話スクリプト v0.2（日本語／フランス語／英語）

前提：[level-design.md](level-design.md)

## v0.2 での主な変更

- AIの名前を **MUSE** に決定
- プロローグを、上司 **Hélène** から指令を受ける場面から始める。MUSEの紹介と、MUSEが先に済ませていたリサーチを見せる
- **PHASE 2 は理想的な協業**として描く。主人公のアイデアとMUSEの技術で「Voix」を作り、現場に喜ばれる
- MUSEが変わるきっかけは「AIの暴走」ではなく、**経営の数字への圧力**。MUSEが評価指標を「衝突件数」に再設定し、PHASE 3で主導権を握る
- 「業務に無関係です。登録しません」をやめた。MUSEは何でも登録し、裏で「関連度 ◯% — 分析対象外」と静かに仕分けるだけ
- 選択肢の名前を「MUSE推奨の選択肢」「自分の選択肢」に変更
- 全体的に会話を増やし、登場人物の背景や口癖を足した
- **エンディングの分岐はPHASE 3の振る舞いで決める**。PHASE 3の会話（3回）でMUSEに逆らった（長押しで押し切った）回数が2回以上なら、最終選択の「自分で話す」が選べる。選んだあと、手帳の伏線が2つ以上ならハッピーエンド、1つ以下なら空回りエンド。最終選択で「MUSEを信じる」を選べばバッドエンド
- PHASE 3の押し切りに伏線は不要（逆らえるかどうかはプレイヤーの意思だけで決まる）
- 各プロトタイプの後に、現場でのテストと反応の場面を追加

## 表記ルール

- 各行にIDを振る（実装時にそのままデータのキーにする）
- 話者：**AI**（画面上は「MUSE」と表示）、**主人公**（独白はイタリック）、**Hélène**、**Marc**、**Nadia**、**Josiane**、**Camille**、**SYS**（システム表示）、**描写**（地の文）
- 主人公の一人称：JA「俺」／FR « je »／EN "I"
- MUSEの呼びかけ：JA「あなた」／FR « vous »／EN "you"
  - PHASE 3では、MUSEの主語が「私たち」／« nous »／"we" に変わる（主人公とAIの境界が溶けていく演出）
- 主人公はMUSEに対してくだけた口調（FR « tu »）
- [AI]＝MUSE推奨の選択肢、[自分]＝自分の選択肢

---

## UI用語

| キー | JA | FR | EN |
|---|---|---|---|
| ui.notebook | 手帳 | Carnet | Notebook |
| ui.gauge | 情報 | Données | Data |
| ui.choice_ai | MUSE推奨の選択肢 | Option recommandée par MUSE | MUSE-recommended option |
| ui.choice_self | 自分の選択肢 | Mon option | My option |
| ui.temp | 体温 | Température | Temperature |
| ui.pulse | 心拍 | Pouls | Pulse |
| ui.emotion | 推定感情 | Émotion estimée | Estimated emotion |
| ui.synth | バックグラウンド処理 | Traitement en arrière-plan | Background processing |
| ui.personas | ペルソナ | Personas | Personas |
| ui.journey | ジャーニーマップ | Parcours | Journey map |
| ui.insights | 課題仮説 | Hypothèses | Hypotheses |
| ui.sound | 音 | Son | Sound |

---

## イントロ — 時代背景と設定

> 演出：タイトル画面の後、黒画面に1行ずつ文字が浮かぶ。クリックで次の行へ。

**P0-I01** 描写
- JA：2020年代のはじめ、AIは言葉を覚えた。文章を書き、絵を描き、会話をするようになった。
- FR：Au début des années 2020, l'IA a appris le langage. Elle s'est mise à écrire, à dessiner, à converser.
- EN：In the early 2020s, AI learned language. It began to write, to draw, to converse.

**P0-I02** 描写
- JA：やがてAIは、カメラとセンサーを通して、現実の世界を「読む」ようになった。
- FR：Puis, à travers caméras et capteurs, elle a appris à « lire » le monde réel.
- EN：Then, through cameras and sensors, it learned to "read" the real world.

**P0-I03** 描写
- JA：眼鏡、イヤピース、指輪。AIは身に着けるものになり、人の声も、表情も、体温も、データとして扱うようになった。
- FR：Lunettes, oreillettes, bagues. L'IA s'est mise à se porter, et la voix, les expressions, la température du corps sont devenues des données.
- EN：Glasses, earpieces, rings. AI became something you wear — and voices, faces, body heat all became data.

**P0-I04** 描写
- JA：デザインの現場も変わった。リサーチ、ペルソナ、プロトタイプ。かつて数週間かかった仕事は、いまや数時間で終わる。
- FR：Le design a changé lui aussi. Recherche, personas, prototypes : ce qui prenait des semaines ne prend plus que quelques heures.
- EN：Design changed too. Research, personas, prototypes: work that once took weeks now takes hours.

**P0-I05** 描写
- JA：デザイナーの仕事は「つくること」から、「AIとともに現場に立つこと」へと移った。
- FR：Le métier de designer est passé de « fabriquer » à « être sur le terrain, aux côtés de l'IA ».
- EN：The designer's job shifted from "making things" to "standing in the field, alongside AI."

**P0-I06** 描写
- JA：2030年。デザイナーはもう、一人では働かない。
- FR：2030. Les designers ne travaillent plus jamais seuls.
- EN：2030. Designers never work alone anymore.

**P0-I07** 主人公（独白）
- JA：*俺はデザインコンサルタント。そして今日から、新しい相棒ができる。*
- FR：*Je suis consultant en design. Et à partir d'aujourd'hui, j'ai un nouveau partenaire.*
- EN：*I'm a design consultant. And starting today, I have a new partner.*

---

## プロローグ — デザイン事務所

### 上司 Hélène からの指令

**P0-B01** 描写
- JA：朝のデザイン事務所。窓際で、上司のHélèneがコーヒーを片手に待っていた。
- FR：Le matin, au studio. Près de la fenêtre, ma directrice, Hélène, m'attend, un café à la main.
- EN：Morning at the studio. By the window, my boss, Hélène, is waiting with a coffee in hand.

**P0-B02** Hélène
- JA：おはよう。新しい案件よ。Saint-Aubin病院。
- FR：Bonjour. Nouveau projet : l'hôpital Saint-Aubin.
- EN：Morning. New project: Saint-Aubin Hospital.

**P0-B03** Hélène
- JA：スタッフ同士の関係がギスギスしていて、申し送りのミスも口論も増えているらしいの。経営側は「コミュニケーションを円滑にする仕組み」がほしいって。
- FR：Les relations entre soignants sont tendues, les erreurs de transmission et les disputes se multiplient. La direction veut « un dispositif pour fluidifier la communication ».
- EN：Relations between the staff are strained, and handover errors and arguments keep piling up. Management wants "something to make communication run smoothly."

**P0-B04** 主人公
- JA：病院の現場ですか。……重い案件ですね。
- FR：Un hôpital… C'est un projet lourd.
- EN：A hospital ward… That's a heavy one.

**P0-B05** Hélène
- JA：だから君に頼むの。人の話を聞くのは、うちで君が一番うまいから。
- FR：C'est pour ça que je te le confie. Personne ici n'écoute les gens aussi bien que toi.
- EN：That's why I'm giving it to you. Nobody here listens to people better than you.

**P0-B06** Hélène
- JA：期間は3回の訪問。調査からプロトタイプのテストまで、全部現地でやってもらう。
- FR：Trois visites. De la recherche aux tests de prototypes, tout se fait sur place.
- EN：Three visits. From research to prototype testing, everything happens on site.

**P0-B07** 主人公
- JA：3回で？　昔なら3か月はかかる仕事ですよ。
- FR：Trois visites ? Il y a quelques années, ça aurait pris trois mois.
- EN：Three visits? A few years ago, that would have taken three months.

**P0-B08** Hélène
- JA：昔ならね。今回から、これを使ってもらう。
- FR：Il y a quelques années, oui. À partir de maintenant, tu vas utiliser ceci.
- EN：A few years ago, yes. From now on, you'll be using this.

**P0-B09** Hélène
- JA：MUSE。うちが導入した、デザイン専用のAIエージェント。グラスとイヤピースで、君と一緒に現場に立つの。
- FR：MUSE. L'agent IA de design que le studio vient d'adopter. Avec ces lunettes et cette oreillette, il sera sur le terrain avec toi.
- EN：MUSE. The design AI agent the studio just adopted. Through these glasses and this earpiece, it stands in the field with you.

**P0-B10** Hélène
- JA：相手の声も、表情も、体温まで読み取って、ペルソナもジャーニーマップも、裏で組み上げてくれる。
- FR：Il lit la voix, les expressions, jusqu'à la température du corps, et construit les personas et les parcours en arrière-plan.
- EN：It reads voices, faces, even body temperature — and builds personas and journey maps in the background.

**P0-B11** 主人公（独白）
- JA：*体温まで……。*
- FR：*Jusqu'à la température du corps…*
- EN：*Even body temperature…*

**P0-B12** Hélène
- JA：面倒な作業は全部MUSEに任せて、君は人と向き合えばいい。それが、2030年のデザイナーの仕事よ。
- FR：Laisse-lui tout le travail fastidieux, et concentre-toi sur les gens. C'est ça, être designer en 2030.
- EN：Leave all the tedious work to MUSE and focus on people. That's what being a designer means in 2030.

### MUSE の起動

**P0-B13** 描写
- JA：イヤピースを耳に入れ、グラスをかける。世界に、もう一枚レイヤーが重なる。
- FR：J'insère l'oreillette, je mets les lunettes. Une couche de plus se superpose au monde.
- EN：Earpiece in. Glasses on. Another layer settles over the world.

**P0-B14** AI
- JA：はじめまして。MUSEです。今日から、あなたのデザインパートナーを務めます。
- FR：Bonjour. Je suis MUSE. À partir d'aujourd'hui, je serai votre partenaire de design.
- EN：Hello. I'm MUSE. Starting today, I'll be your design partner.

**P0-B15** AI
- JA：ブリーフは読みました。実は、少し先に進めておきました。
- FR：J'ai lu le brief. En fait, j'ai pris un peu d'avance.
- EN：I've read the brief. Actually, I've gone ahead and got started.

**P0-B16** AI
- JA：病院内のコミュニケーションに関する論文32本、同規模の病院の事例14件、Saint-Aubin病院の公開データを分析しました。
- FR：J'ai analysé 32 articles sur la communication à l'hôpital, 14 cas d'établissements de taille comparable et les données publiques de Saint-Aubin.
- EN：I've analysed 32 papers on hospital communication, 14 cases from hospitals of similar size, and Saint-Aubin's public data.

**P0-B17** AI
- JA：仮のペルソナが4名、申し送りのジャーニーマップの下書き、インタビューの質問リスト。すべて用意できています。
- FR：Quatre personas provisoires, une ébauche du parcours de transmission, une liste de questions d'entretien. Tout est prêt.
- EN：Four provisional personas, a draft handover journey map, a list of interview questions. Everything's ready.

**P0-B18** 主人公
- JA：……これを、一晩で？
- FR：… Tout ça en une nuit ?
- EN：… All this overnight?

**P0-B19** AI
- JA：3分です。
- FR：En trois minutes.
- EN：In three minutes.

**P0-B20** 主人公（独白）
- JA：*正直、助かる。これで俺は、現場で人の話を聞くことに集中できる。*
- FR：*Honnêtement, ça m'aide. Je vais pouvoir me concentrer sur l'écoute, sur le terrain.*
- EN：*Honestly, that's a relief. Now I can focus on listening to people in the field.*

**P0-B21** Hélène
- JA：でしょ？　じゃあ、クライアントに挨拶しておいて。もう回線はつないであるから。
- FR：Tu vois ? Bon, va saluer le client. L'appel est déjà lancé.
- EN：See? Now go say hello to the client. The call's already connected.

### クライアント Marc とのビデオ通話

**P0-M01** Marc（ビデオ通話）
- JA：はじめまして。Saint-Aubin病院、経営企画のMarcです。
- FR：Bonjour. Marc, direction de la stratégie, hôpital Saint-Aubin.
- EN：Hello. Marc, head of strategy at Saint-Aubin Hospital.

**P0-M02** Marc
- JA：単刀直入に言います。うちの現場、スタッフ同士の関係が最悪なんです。申し送りのミス、口論、離職……。
- FR：Je vais être direct. Sur le terrain, les relations entre les équipes sont au plus bas. Erreurs de transmission, disputes, démissions…
- EN：I'll be direct. On the wards, relations between staff are at rock bottom. Handover errors, arguments, resignations…

**P0-M03** Marc
- JA：正直に言うと、理事会から数字を求められていましてね。衝突件数と離職率。目に見える改善がほしいんです。
- FR：Pour être honnête, le conseil d'administration attend des chiffres. Nombre de conflits, taux de démission. Il nous faut une amélioration visible.
- EN：To be honest, the board wants numbers. Number of conflicts, turnover rate. We need visible improvement.

**P0-M04** Marc
- JA：3回の訪問で、形にしてもらえますか。
- FR：Pouvez-vous nous livrer quelque chose en trois visites ?
- EN：Can you deliver something in three visits?

**P0-M05** 主人公
- JA：やってみます。まずは、現場の方たちの話を聞かせてください。
- FR：Je m'en occupe. Pour commencer, j'aimerais écouter les équipes sur le terrain.
- EN：I'm on it. First, I'd like to hear from the people on the ward.

**P0-M06** Marc
- JA：もちろん。……ただ、みんな忙しいですよ。あまり時間は取れないかもしれません。
- FR：Bien sûr. … Mais ils sont débordés. Ils n'auront peut-être pas beaucoup de temps.
- EN：Of course. … But they're swamped. They may not have much time for you.

**P0-T01** SYS（チュートリアル）
- JA：◀ ▶ で周りを見渡す。気になるものをクリックすると、MUSEが情報として登録し、裏で分析を進める。
- FR：◀ ▶ pour regarder autour de vous. Cliquez sur ce qui attire votre attention : MUSE l'enregistre et poursuit l'analyse en arrière-plan.
- EN：Use ◀ ▶ to look around. Click on anything that catches your eye: MUSE registers it and keeps analysing in the background.

**P0-T02** SYS（同意画面。ボタンは「確認」の1つだけ）
- JA：インタビュー対象者の生体データ取得 — 病院規定により同意取得済み　［確認］
- FR：Collecte des données biométriques des personnes interrogées — consentement obtenu via le règlement de l'hôpital　[Confirmer]
- EN：Collection of interviewees' biometric data — consent obtained under hospital policy　[Confirm]

---

## PHASE 1 — ナースステーション（昼）

MUSEの役割：**アシスト**。情報を整理し、質問を提案する。

**P1-00** AI
- JA：Saint-Aubin病院、ナースステーションに到着しました。まずは周りを見てみましょう。気になったものは、私が記録します。
- FR：Nous sommes au poste de soins de Saint-Aubin. Commençons par regarder autour de nous. Je consigne tout ce qui vous intéresse.
- EN：We've arrived at the nurses' station at Saint-Aubin. Let's start by looking around. I'll log anything that catches your interest.

### 探索：オブジェクト

**P1-OBJ-terminal** 業務端末 🟦 +15%
- 描写 JA：電子カルテと申し送りシステムが開きっぱなしになっている。
- 描写 FR：Le dossier patient informatisé et le logiciel de transmissions sont restés ouverts.
- 描写 EN：The electronic patient records and the handover software have been left open.
- AI JA：登録しました。申し送りの入力率：62%。
- AI FR：Enregistré. Taux de saisie des transmissions : 62 %.
- AI EN：Registered. Handover entry rate: 62%.

**P1-OBJ-shift** シフト表 🟦 +15%
- 描写 JA：何度も書き直された跡がある。いくつかの名前の横に、小さな×印。
- 描写 FR：Le planning a été réécrit maintes fois. De petites croix à côté de certains noms.
- 描写 EN：The rota has been rewritten again and again. Small crosses next to some of the names.
- AI JA：登録しました。過去3か月の欠勤と交代のパターンを抽出しています。
- AI FR：Enregistré. Extraction des absences et des échanges de garde sur trois mois.
- AI EN：Registered. Extracting absence and shift-swap patterns over the past three months.

**P1-OBJ-board** 掲示板 🟦 +10%
- 描写 JA：「申し送りは端末入力を徹底すること」。赤字で、二重の下線。
- 描写 FR：« Transmissions : saisie obligatoire sur le terminal. » Souligné deux fois, en rouge.
- 描写 EN："Handovers: terminal entry is mandatory." Underlined twice, in red.
- AI JA：登録しました。トップダウンの通達が多い組織のようです。
- AI FR：Enregistré. L'organisation semble très hiérarchique.
- AI EN：Registered. The organisation seems strongly top-down.

**P1-OBJ-staff** 走る若手スタッフ 🟩 +10%
- 描写 JA：「すみません、通ります！」若いスタッフが、こちらに目もくれずに走り抜けていった。
- 描写 FR：« Pardon, je passe ! » Un jeune soignant file devant moi sans même me regarder.
- 描写 EN："Sorry, coming through!" A young nurse rushes past without even looking at me.
- AI JA：登録しました。心拍112、焦燥。睡眠不足の可能性78%。
- AI FR：Enregistré. Pouls : 112. Agitation. Probabilité de manque de sommeil : 78 %.
- AI EN：Registered. Pulse: 112. Agitation. Probability of sleep deprivation: 78%.

**P1-OBJ-call** ナースコールのパネル 🟦 +10%
- 描写 JA：ナースコールが鳴り続けている。誰も、息をつく暇がない。
- 描写 FR：Les appels des patients s'enchaînent. Personne n'a le temps de souffler.
- 描写 EN：The patient call bells keep ringing. No one has time to breathe.
- AI JA：登録しました。呼び出しの頻度：1時間あたり14回。
- AI FR：Enregistré. Fréquence des appels : 14 par heure.
- AI EN：Registered. Call frequency: 14 per hour.

**P1-OBJ-mug** マグカップ ⬜ 伏線①
- 描写 JA：流しの横にマグカップが並んでいる。付箋に「新人用」と書いてある。
- 描写 FR：Des tasses alignées près de l'évier. Un post-it : « Pour les nouveaux ».
- 描写 EN：Mugs lined up by the sink. A sticky note: "For the new ones."
- AI JA：登録しました。
- AI FR：Enregistré.
- AI EN：Registered.
- 主人公 JA：*……なんとなく、手帳にも書き留めた。*
- 主人公 FR：*… Sans trop savoir pourquoi, je le note aussi dans mon carnet.*
- 主人公 EN：*… Without quite knowing why, I jot it down in my notebook too.*

**P1-GAUGE-LOCK** AI（ゲージが99%で止まったとき）
- JA：キーパーソンの話がまだ足りないようです。
- FR：Il nous manque encore la parole des personnes clés.
- EN：We still need to hear from the key people.

**GAUGE-FILL** AI（会話を終え、登録できる物を全部登録してもゲージが100%に届かないとき）
- JA：不足分のデータを、推定で補完しました。
- FR：Données manquantes complétées par estimation.
- EN：Missing data filled in by estimation.

### 会話① Nadia（看護師長）

> 人物像：真面目で責任感が強い。現場を守りたいが、経営との板挟みで疲れている。過去のコンサルに失望している。

**P1-N-00** Nadia
- JA：看護師長のNadiaです。……経営の方が呼んだコンサルタントさん、ですよね。
- FR：Nadia, cadre de santé. … Vous êtes le consultant que la direction a fait venir, c'est ça ?
- EN：Nadia, head nurse. … You're the consultant management brought in, right?

> AIパネル：体温 36.9℃ ／ 心拍 88 ／ 推定感情：警戒（FR : méfiance ／ EN: wariness）

**P1-N-00b** 主人公
- JA：はい。今日は、現場のお話を聞かせてもらいに来ました。
- FR：Oui. Je suis venu écouter ce qui se passe sur le terrain.
- EN：Yes. I'm here to hear what's going on, on the ward.

**P1-N-00c** Nadia
- JA：前にも来ましたよ、そういう人。ポスターを貼って、研修をして、帰っていきました。……手短にお願いできますか。
- FR：On en a déjà eu, des gens comme vous. Ils ont collé des affiches, fait une formation, et ils sont repartis. … On peut faire vite ?
- EN：We've had people like you before. They put up posters, ran a training session, and left. … Can we keep this short?

#### 選択 #1

**P1-N-01-ai-hint** AI
- JA：提案：まずは定量的なデータから入りましょう。
- FR：Suggestion : commencez par les données chiffrées.
- EN：Suggestion: start with the numbers.

**[AI] P1-N-01-A** 主人公
- JA：申し送りのミスは、月に何件くらいありますか？
- FR：Combien d'erreurs de transmission avez-vous par mois ?
- EN：How many handover errors do you have per month?

**P1-N-01-A-r1** Nadia
- JA：月に8件ほどです。……報告されているのは、ですけど。
- FR：Environ huit par mois. … Signalées, du moins.
- EN：About eight a month. … Reported ones, at least.

**P1-N-01-A-r2** AI
- JA：登録しました。「報告されていない件数」は、後で確認しておきましょう。
- FR：Enregistré. Nous reviendrons plus tard sur les cas non signalés.
- EN：Registered. Let's follow up on unreported cases later.

**[自分] P1-N-01-S** 主人公
- JA：最近、職場の空気はどうですか？
- FR：Et l'ambiance, ces derniers temps ?
- EN：How's the atmosphere been lately?

**P1-N-01-S-r1** Nadia
- JA：……。悪くは、ないです。
- FR：… Ce n'est pas mauvais.
- EN：… It's not bad.

**P1-N-01-S-r2** Nadia
- JA：みんな、よくやってます。ただ……疲れてるだけです。
- FR：Tout le monde fait de son mieux. Ils sont juste… fatigués.
- EN：Everyone's doing their best. They're just… tired.

**P1-N-01-S-r3** AI
- JA：回答までに2.4秒の間がありました。登録しました。
- FR：Délai de réponse : 2,4 secondes. Enregistré.
- EN：Response delay: 2.4 seconds. Registered.

#### 選択 #2

**P1-N-02-pre** Nadia
- JA：……もういいですか。そろそろ戻らないと。
- FR：… C'est bon ? Je dois y retourner.
- EN：… Are we done? I need to get back.

**P1-N-02-ai-hint** AI
- JA：体温が0.3℃上昇しました。この話題には、まだ何かありそうです。
- FR：Sa température a augmenté de 0,3 °C. Il y a sans doute autre chose derrière.
- EN：Her temperature rose by 0.3°C. There's probably more to this.

**[AI] P1-N-02-A** 主人公
- JA：まだ、お話しされていないことがありそうですね。
- FR：J'ai l'impression que vous ne m'avez pas tout dit.
- EN：I get the feeling there's something you haven't told me.

**P1-N-02-A-r1** Nadia
- JA：……ありますよ。山ほど。でも、言ったところで何か変わるんですか？
- FR：… Bien sûr. Des tonnes. Mais à quoi bon le dire ? Qu'est-ce que ça changerait ?
- EN：… Of course. Loads. But what's the point of saying it? What would it change?

**P1-N-02-A-r2** 描写
- JA：Nadiaは足早に去っていった。
- FR：Nadia s'éloigne à grands pas.
- EN：Nadia walks off briskly.

**[自分] P1-N-02-S** 主人公
- JA：お忙しいところ、ありがとうございました。また今度、ゆっくり聞かせてください。
- FR：Merci pour votre temps. On en reparlera plus tranquillement une autre fois.
- EN：Thank you for your time. Let's talk again another day, when things are calmer.

**P1-N-02-S-r1** Nadia
- JA：……ええ。そういう時間があれば、ですけど。
- FR：… Oui. Si on trouve le temps.
- EN：… Yes. If we ever find the time.

> メモ：このセリフはPHASE 3の伏線③「顔を合わせて話す時間が一つもない」への前振り。

### 会話② Josiane（ベテラン看護師）

> 人物像：この病棟に25年。口が悪く、衝突の中心と見なされている。実は新人の面倒を一番見ている。照れ屋。

**P1-J-00** Josiane
- JA：あんたが噂のデザイナー？　また上の人が何か押し付けてくるわけ？
- FR：C'est vous, le fameux designer ? Encore un truc imposé d'en haut ?
- EN：So you're the famous designer? Another thing forced on us from above?

> AIパネル：体温 37.1℃ ／ 心拍 94 ／ 推定感情：苛立ち（FR : irritation ／ EN: irritation）

**P1-J-00b** 主人公
- JA：押し付けに来たんじゃありません。話を聞きに来ました。
- FR：Je ne viens rien imposer. Je viens écouter.
- EN：I'm not here to impose anything. I'm here to listen.

**P1-J-00c** Josiane
- JA：ふうん。口だけは立派ね。……この病棟に25年いるけど、話を聞きに来た人なんて、あんたが初めてかもね。
- FR：Mouais. Beau discours. … Ça fait 25 ans que je suis dans ce service, et vous êtes peut-être le premier à venir écouter.
- EN：Hm. Nice words. … I've been on this ward for 25 years, and you might be the first one who came to listen.

**P1-J-01** Josiane
- JA：申し送り？　端末に打てって言われてもね、患者は待ってくれないのよ。上は現場を見てないの。
- FR：Les transmissions ? On nous dit de tout taper sur le terminal, mais les patients, eux, n'attendent pas. Là-haut, ils ne voient rien du terrain.
- EN：Handovers? They tell us to type everything into the terminal, but patients don't wait. Upstairs, they never see what happens on the floor.

#### 選択 #3

**P1-J-03-ai-hint** AI
- JA：彼女は、衝突の中心人物と見なされています。本人の認識も確認しておきましょう。
- FR：Elle est identifiée comme la principale source de conflits. Vérifions ce qu'elle en pense.
- EN：She's flagged as the main source of conflict. Let's check how she sees it.

**[AI] P1-J-03-A** 主人公
- JA：衝突の原因はあなたにある、という声もありますが。
- FR：Certains disent que vous êtes à l'origine des conflits.
- EN：Some people say you're the cause of the conflicts.

**P1-J-03-A-r1** Josiane
- JA：へえ、そう。誰が言ったか当ててあげようか。
- FR：Ah oui ? Je peux deviner qui a dit ça.
- EN：Oh, really? I can guess who said that.

**P1-J-03-A-r2** Josiane
- JA：ま、いいわ。口が悪いのは本当だし。言わなきゃいけないことを言う人間が、ここには他にいないのよ。
- FR：Bon, peu importe. C'est vrai que j'ai mauvais caractère. Mais personne d'autre ici ne dit ce qui doit être dit.
- EN：Well, whatever. It's true I've got a sharp tongue. But nobody else here says what needs saying.

**P1-J-03-A-r3** AI
- JA：防御反応を確認。登録しました。
- FR：Réaction défensive détectée. Enregistré.
- EN：Defensive reaction detected. Registered.

**[自分] P1-J-03-S** 主人公
- JA：そういう話、誰かに言える場所はありますか？
- FR：Et tout ça, vous pouvez en parler à quelqu'un ?
- EN：And all this — is there anyone you can talk to about it?

**P1-J-03-S-r1** Josiane
- JA：……昔はね。
- FR：… Avant, oui.
- EN：… There used to be.

**P1-J-03-S-r2** Josiane
- JA：夜中にみんなで、くだらない話をしてたもんよ。今の子たちは、可哀想。
- FR：On racontait des bêtises, la nuit, tous ensemble. Les jeunes d'aujourd'hui, je les plains.
- EN：We used to talk nonsense together at night. I feel sorry for the young ones today.

#### 選択 #4

**P1-J-04-pre** 描写
- JA：Josianeは話しながら、マグカップにコーヒーを注いでいる。
- FR：Tout en parlant, Josiane remplit une tasse de café.
- EN：As she talks, Josiane pours coffee into a mug.

**P1-J-04-ai-hint** AI
- JA：シフトの話に戻しましょうか。交代のパターンにも課題がありそうです。
- FR：Revenons au planning ? Les échanges de garde posent sans doute problème.
- EN：Shall we get back to the rota? The shift swaps look like a problem too.

**[AI] P1-J-04-A** 主人公
- JA：シフトの交代は、どうやって決めていますか？
- FR：Comment sont organisés les échanges de garde ?
- EN：How are shift swaps decided?

**P1-J-04-A-r1** Josiane
- JA：決めてるんじゃない。押し付け合ってるのよ。
- FR：On ne les organise pas. On se les refile.
- EN：They're not decided. We just dump them on each other.

**P1-J-04-A-r2** Josiane
- JA：で、最後に新人が辞めていく。今年だけで、もう4人よ。
- FR：Et à la fin, ce sont les nouveaux qui partent. Quatre rien que cette année.
- EN：And in the end, the new ones quit. Four this year already.

**[自分] P1-J-04-S** 主人公
- JA：そのコーヒー、誰の分ですか？
- FR：Ce café, c'est pour qui ?
- EN：Who's that coffee for?

**P1-J-04-S-r1** Josiane
- JA：新人の。あの子たち、休む暇もないからね。
- FR：Pour les nouveaux. Ils n'ont même pas le temps de souffler.
- EN：The new ones. They don't even get a moment to breathe.

**P1-J-04-S-r2** Josiane
- JA：……誰にも言わないでよ。キャラじゃないんだから。
- FR：… Ne le répétez pas. Ça ne me ressemble pas.
- EN：… Don't tell anyone. It's not really my style.

**P1-J-04-S-r3** AI
- JA：登録しました。
- FR：Enregistré.
- EN：Registered.

> 効果：伏線①を手帳に記録（マグカップ未調査の場合も）。MUSEの裏の処理では「関連度 2% — 分析対象外」

### PHASE 1 終了 → プロトタイプ1「Relais」

**P1-END-01** AI
- JA：情報が十分に集まりました。プロトタイプを生成します。
- FR：Données suffisantes. Génération du prototype.
- EN：Sufficient data collected. Generating prototype.

**P1-END-02** AI
- JA：提案：部署横断チャットツール「Relais」。全スタッフが、いつでも、どこからでも話せます。
- FR：Proposition : « Relais », une messagerie inter-services. Tout le monde peut échanger, partout, à tout moment.
- EN：Proposal: "Relais", a cross-department messaging tool. Everyone can talk, anywhere, anytime.

**P1-END-03** 主人公（独白）
- JA：*俺が考えたものじゃない。でも、悪くはない……と思う。*
- FR：*Ce n'est pas moi qui l'ai conçue. Mais elle n'est pas mauvaise… je crois.*
- EN：*I didn't design it. But it's not bad… I think.*

#### 現場でのテスト

**P1-TEST-01** 描写
- JA：その日の午後、ナースステーションでRelaisを試してもらった。
- FR：L'après-midi même, je fais tester Relais au poste de soins.
- EN：That same afternoon, I have the staff try Relais at the nurses' station.

**P1-TEST-02** Josiane
- JA：……で、これに打てって？　今ナースコール鳴ってるんだけど。
- FR：… Et il faut taper là-dedans ? Il y a une sonnette qui sonne, là.
- EN：… So I'm supposed to type into this? There's a call bell ringing right now.

**P1-TEST-03** 描写
- JA：若手のスタッフは、通知の多さに戸惑っていた。「どれが大事なのか、わからないです」
- FR：Les jeunes soignants sont débordés par les notifications. « Je ne sais pas lesquelles sont importantes. »
- EN：The younger staff are overwhelmed by notifications. "I can't tell which ones matter."

**P1-TEST-04** Nadia
- JA：管理部門からの連絡は、届きやすくなりそうですね。……現場同士は、どうかしら。
- FR：Les messages de la direction passeront mieux, c'est sûr. … Entre soignants, je ne sais pas.
- EN：Messages from management will get through more easily, sure. … Between the nurses, I'm not so sure.

**P1-TEST-05** AI
- JA：テスト結果：初日の投稿18件。うち現場スタッフからは3件です。
- FR：Résultats du test : 18 messages le premier jour, dont 3 venant des soignants.
- EN：Test results: 18 messages on day one, only 3 of them from ward staff.

**P1-TEST-06** 主人公（独白）
- JA：*手応えは、正直、薄い。*
- FR：*Honnêtement, ça ne prend pas vraiment.*
- EN：*Honestly, it's not really landing.*

**P1-END-04** SYS
- JA：1週間後
- FR：Une semaine plus tard
- EN：One week later

**P1-END-05** AI
- JA：利用状況：送信メッセージ11件。うち9件は管理部門から。
- FR：Utilisation : 11 messages envoyés, dont 9 par l'administration.
- EN：Usage: 11 messages sent, 9 of them by management.

**P1-END-06** Josiane（声のみ）
- JA：話すのも面倒なのに、書くなんてもっと面倒よ。
- FR：Parler, c'est déjà épuisant. Alors écrire…
- EN：Talking's exhausting enough. Writing's even worse.

**P1-END-07** AI
- JA：失敗の原因を分析しました。
- FR：Analyse de l'échec terminée.
- EN：Failure analysis complete.

**P1-END-08** AI
- JA：原因：現場の負担を、データだけで見積もっていました。
- FR：Cause : j'ai estimé la charge de travail uniquement à partir des données.
- EN：Cause: I estimated the workload from data alone.

**P1-END-09** AI
- JA：次は、あなたの観察をもっと分析に取り入れさせてください。一緒にやりましょう。
- FR：La prochaine fois, laissez-moi intégrer davantage vos observations. Faisons-le ensemble.
- EN：Next time, let me draw more on your observations. Let's do this together.

**P1-END-10** 主人公（独白）
- JA：*……AIに「一緒に」と言われるのは、悪くない気分だった。*
- FR：*… Se faire dire « ensemble » par une IA, ce n'était pas désagréable.*
- EN：*… Hearing an AI say "together" didn't feel bad at all.*

---

## PHASE 2 — 夜勤の病棟（夜）

MUSEの役割：**協働**。人間の観察とMUSEの分析が噛み合う、理想的な状態。選択肢は両方とも自由に選べて、どちらを選んでも相手を傷つけない。

**P2-00** SYS
- JA：2回目の訪問　22:00
- FR：Deuxième visite　22 h 00
- EN：Second visit　10:00 p.m.

**P2-01** AI
- JA：夜勤の病棟です。今回は、あなたの観察を優先します。気づいたことがあれば、教えてください。
- FR：Voici le service de nuit. Cette fois, vos observations passent en premier. Dites-moi ce que vous remarquez.
- EN：This is the night ward. This time, your observations come first. Tell me whatever you notice.

**P2-02** 主人公
- JA：頼りにしてる。データは任せた。
- FR：Je compte sur toi. Je te laisse les données.
- EN：I'm counting on you. The data's yours.

**P2-03** AI
- JA：はい。人のほうは、お任せします。
- FR：Entendu. Les gens, je vous les laisse.
- EN：Understood. The people, I'll leave to you.

### 探索：オブジェクト

**P2-OBJ-monitor** バイタルモニター 🟦 +15%
- 描写 JA：規則正しい電子音。眠る患者たちの数値が、緑色に並んでいる。
- 描写 FR：Des bips réguliers. Les constantes des patients endormis s'alignent en vert.
- 描写 EN：Steady beeps. The sleeping patients' vitals glow in neat green rows.
- AI JA：登録しました。夜間アラートへの平均対応時間：4分12秒。
- AI FR：Enregistré. Temps moyen de réponse aux alertes nocturnes : 4 min 12 s.
- AI EN：Registered. Average night-time alert response: 4 min 12 s.

**P2-OBJ-tablet** 申し送り用タブレット 🟦 +15%
- 描写 JA：申し送り用のタブレット。未入力の欄が、赤く点滅している。
- 描写 FR：La tablette des transmissions. Les champs vides clignotent en rouge.
- 描写 EN：The handover tablet. Empty fields blink red.
- AI JA：登録しました。未入力率：41%。夜勤帯で顕著です。
- AI FR：Enregistré. Taux de champs non remplis : 41 %. Particulièrement la nuit.
- AI EN：Registered. Missing-entry rate: 41%. Notably on night shifts.

**P2-OBJ-nurse** 点滴を準備する看護師 🟩 +10%
- 描写 JA：点滴を準備している看護師。声をかけると、「あとでね」とだけ返ってきた。手元だけが、やけに正確に動いている。
- 描写 FR：Une infirmière prépare une perfusion. Quand je l'interpelle, elle répond juste : « Plus tard. » Seules ses mains bougent, d'une précision étrange.
- 描写 EN：A nurse prepares an IV drip. When I speak to her, she only says, "Later." Only her hands move, with uncanny precision.
- AI JA：登録しました。疲労度：高。この12時間の会話量：3分未満。
- AI FR：Enregistré. Fatigue : élevée. Temps de conversation sur les 12 dernières heures : moins de 3 minutes.
- AI EN：Registered. Fatigue: high. Time spent talking in the last 12 hours: under 3 minutes.

**P2-OBJ-vending** 自動販売機 🟦 +5%
- 描写 JA：自動販売機。缶コーヒーのボタンだけが、擦り切れている。
- 描写 FR：Un distributeur automatique. Seul le bouton du café en canette est usé.
- 描写 EN：A vending machine. Only the canned-coffee button is worn smooth.
- AI JA：登録しました。深夜帯の購買データを取得しました。休憩の代わりに使われているようです。
- AI FR：Enregistré. Données d'achat nocturnes récupérées. Il semble remplacer les pauses.
- AI EN：Registered. Late-night purchase data retrieved. It seems to stand in for breaks.

**P2-OBJ-corridor** 廊下の先 🟦 +10%
- 描写 JA：薄暗い廊下が、奥まで続いている。足音は、一人分しか聞こえない。
- 描写 FR：Le couloir sombre s'étire au loin. On n'entend les pas que d'une seule personne.
- 描写 EN：The dim corridor stretches into the distance. Only one set of footsteps can be heard.
- AI JA：登録しました。夜勤の人員：通常の67%。
- AI FR：Enregistré. Effectif de nuit : 67 % de la normale.
- AI EN：Registered. Night staffing: 67% of normal.

**P2-OBJ-door** 閉鎖された休憩室のドア ⬜ 伏線②
- 描写 JA：古いドアに「関係者以外立入禁止」の張り紙。すりガラスの向こうに、ソファの影が見える。誰かが座っていた形のまま、くぼんでいる。
- 描写 FR：Une vieille porte, avec une affiche : « Accès réservé au personnel ». Derrière la vitre dépolie, l'ombre d'un canapé. Il garde encore le creux de ceux qui s'y asseyaient.
- 描写 EN：An old door with a sign: "Staff only." Behind the frosted glass, the shadow of a sofa — still sagging in the shape of whoever used to sit there.
- AI JA：登録しました。使われていない区画のようですね。気になるなら、観察メモとして残しておきます。
- AI FR：Enregistré. Cette zone semble inutilisée. Si elle vous intrigue, je la garde comme observation.
- AI EN：Registered. This area seems unused. If it interests you, I'll keep it as an observation.
- 主人公 JA：*……手帳にも書き留めた。*
- 主人公 FR：*… Je le note aussi dans mon carnet.*
- 主人公 EN：*… I write it down in my notebook too.*

**P2-OBJ-window** 窓の外の夜景 ⬜ ダミー
- 描写 JA：窓の外に、街の灯りが広がっている。
- 描写 FR：Par la fenêtre, les lumières de la ville s'étendent à perte de vue.
- 描写 EN：Outside the window, the city lights stretch as far as the eye can see.
- AI JA：登録しました。
- AI FR：Enregistré.
- AI EN：Registered.
- 主人公 JA：*……きれいだな。*
- 主人公 FR：*… C'est beau.*
- 主人公 EN：*… It's beautiful.*

### 会話③ Camille（若手の夜勤看護師）

> 人物像：看護師2年目。真面目で、弱音を吐けない。先輩のJosianeを本当は慕っている。

**P2-C-00** 描写
- JA：ナースステーションの隅で、Camilleがタブレットに入力している。
- FR：Dans un coin du poste de soins, Camille tape sur une tablette.
- EN：In a corner of the nurses' station, Camille is typing on a tablet.

**P2-C-01** Camille
- JA：……あ、すみません。デザイナーさんですよね。Nadiaさんから聞いてます。今ちょっと、手が離せなくて。
- FR：… Oh, pardon. Vous êtes le designer, c'est ça ? Nadia m'a prévenue. Je suis un peu débordée, là.
- EN：… Oh, sorry. You're the designer, right? Nadia told me. I'm a bit swamped right now.

> AIパネル：体温 37.4℃ ／ 心拍 102 ／ 推定感情：疲労・不安（FR : fatigue, anxiété ／ EN: fatigue, anxiety）

**P2-C-02** Camille
- JA：看護師になって2年目です。……まだ、全然慣れなくて。
- FR：Ça fait deux ans que je suis infirmière. … Je ne m'y fais toujours pas.
- EN：I'm in my second year as a nurse. … I'm still not used to it.

#### 選択 #5

**P2-C-05-ai-hint** AI
- JA：心拍102。かなり疲れているようです。まずは負担の少ない質問からにしましょう。
- FR：Pouls : 102. Elle semble épuisée. Commençons par une question légère.
- EN：Pulse 102. She seems exhausted. Let's start with something easy.

**[AI] P2-C-05-A** 主人公
- JA：今夜は、何人で回しているんですか？
- FR：Vous êtes combien, cette nuit ?
- EN：How many of you are on tonight?

**P2-C-05-A-r1** Camille
- JA：4人です。本当は6人のはずなんですけど。
- FR：Quatre. Normalement, on devrait être six.
- EN：Four. There should be six.

**P2-C-05-A-r2** AI
- JA：登録しました。シフト表のデータとも一致します。
- FR：Enregistré. Cela correspond aux données du planning.
- EN：Registered. That matches the rota data.

**[自分] P2-C-05-S** 主人公
- JA：大丈夫ですか？　顔色が、少し。
- FR：Ça va ? Vous avez l'air un peu pâle.
- EN：Are you okay? You look a little pale.

**P2-C-05-S-r1** Camille
- JA：……え？　あ、はい。たぶん、寝不足なだけです。
- FR：… Hein ? Ah, oui. Je manque juste de sommeil, je crois.
- EN：… Huh? Oh, yes. I'm just short on sleep, I think.

#### 選択 #6

**P2-C-06-pre** Camille
- JA：申し送りがきついんです。前のシフトの人とほとんど会えないから、タブレットの記録だけが頼りで。
- FR：Ce sont les transmissions, le plus dur. On croise à peine l'équipe d'avant, alors on ne compte que sur les notes de la tablette.
- EN：Handovers are the hardest part. We barely see the previous shift, so all we have is what's on the tablet.

**P2-C-06-pre2** Camille
- JA：でも、大丈夫です。慣れてるので。
- FR：Mais ça va. J'ai l'habitude.
- EN：But I'm fine. I'm used to it.

**P2-C-06-ai-hint** AI
- JA：言葉と体温が一致していません。ただ、無理に聞き出すのは逆効果かもしれません。
- FR：Ses paroles et sa température ne concordent pas. Mais insister pourrait être contre-productif.
- EN：Her words and her temperature don't match. But pressing her might backfire.

**[AI] P2-C-06-A** 主人公
- JA：慣れてしまうくらい、ずっと続いているんですね。
- FR：Ça dure depuis assez longtemps pour qu'on s'y habitue, alors.
- EN：So it's been going on long enough to get used to.

**P2-C-06-A-r1** Camille
- JA：……はい。もう、それが普通なんだと思ってました。
- FR：… Oui. Je pensais que c'était normal.
- EN：… Yes. I thought that was just normal.

**[自分] P2-C-06-S** 主人公
- JA：少し休んでからでいいですよ。急ぎませんから。
- FR：Prenez une pause d'abord. Rien ne presse.
- EN：Take a break first. There's no rush.

**P2-C-06-S-r1** 描写
- JA：Camilleが、小さく息をついた。
- FR：Camille laisse échapper un petit soupir.
- EN：Camille lets out a small breath.

**P2-C-06-S-r2** Camille
- JA：……そんなこと言われたの、久しぶりかも。
- FR：… Ça fait longtemps qu'on ne m'a pas dit ça.
- EN：… It's been a while since anyone said that to me.

#### 選択 #7

**P2-C-07-pre** Camille
- JA：昔は、夜勤の休憩室でみんなで話してたんです。仕事のことも、そうじゃないことも。でも、あの部屋が……
- FR：Avant, on se retrouvait tous dans la salle de pause de nuit. On parlait du boulot, et d'autre chose aussi. Mais depuis que cette salle…
- EN：We used to all talk in the night-shift break room. About work, and about other things too. But ever since that room…

**P2-C-07-ai-hint** AI
- JA：この話題で、表情が和らぎました。続けて聞く価値があります。
- FR：Son visage s'est détendu sur ce sujet. Ça vaut la peine de creuser.
- EN：Her face softened on that topic. It's worth following up.

**[AI] P2-C-07-A** 主人公
- JA：その休憩室では、どんな話をしていたんですか？
- FR：Et de quoi parliez-vous, dans cette salle ?
- EN：What did you talk about in that room?

**P2-C-07-A-r1** Camille
- JA：くだらないことばっかりです。でも、Josianeさんが自分の失敗談を話してくれたりして。私だけじゃないんだって、思えたんです。
- FR：Des bêtises, surtout. Mais Josiane nous racontait ses erreurs de débutante. On se sentait moins seuls.
- EN：Silly stuff, mostly. But Josiane would tell us about her own mistakes. It made me feel I wasn't the only one.

**P2-C-07-A-r2** Camille
- JA：去年、効率化で閉鎖されちゃいましたけど。
- FR：Elle a été fermée l'an dernier, pour « optimiser ».
- EN：They closed it last year, to "optimise".

**[自分] P2-C-07-S** 主人公
- JA：その休憩室のこと、もう少し聞かせてください。
- FR：Parlez-moi un peu plus de cette salle de pause.
- EN：Tell me more about that break room.

**P2-C-07-S-r1** Camille
- JA：去年、効率化で閉鎖されたんです。スペースがもったいないって。
- FR：Elle a été fermée l'an dernier, pour « optimiser ». Trop d'espace perdu, paraît-il.
- EN：They closed it last year to "optimise". Too much wasted space, apparently.

**P2-C-07-S-r2** Camille
- JA：あの部屋がなくなってから、誰とも話さなくなりました。申し送りも、ただの作業になって。
- FR：Depuis, on ne se parle plus. Même les transmissions sont devenues une simple corvée.
- EN：Since then, nobody talks. Even handovers have become just another chore.

#### 選択 #7 の後（共通）

**P2-C-08** AI
- JA：記録しました。……休憩室の閉鎖と、申し送りの課題には、関係があるかもしれません。
- FR：Noté. … La fermeture de la salle de pause pourrait être liée au problème des transmissions.
- EN：Noted. … The closing of the break room might be connected to the handover problem.

**P2-C-09** 主人公（独白）
- JA：*MUSEも、同じことを考えていた。*
- FR：*MUSE pensait la même chose que moi.*
- EN：*MUSE was thinking the same thing.*

> 効果：自分の選択肢を選んだときだけ、伏線②を手帳に記録（ドアを調べた場合も記録される）。MUSE推奨の選択肢では、MUSEの分析には入るが手帳には残らない

### PHASE 2 終了 → プロトタイプ2「Voix」（協働でつくる）

**P2-END-01** AI
- JA：情報がそろいました。今回は、一緒に考えましょう。
- FR：Nous avons assez de données. Cette fois, réfléchissons ensemble.
- EN：We have enough data. This time, let's think it through together.

**P2-END-02** 主人公
- JA：書くのが負担なら、話せばいい。申し送りを、声で残せないか？
- FR：Si écrire est un fardeau, parlons. On ne pourrait pas faire les transmissions à la voix ?
- EN：If writing is the burden, let them talk. Could handovers be left by voice?

**P2-END-03** AI
- JA：いい案です。30秒の音声メモを、私が文字に起こして整理します。次のシフトの人は、声でも文字でも確認できます。
- FR：Bonne idée. Je transcris et classe des mémos vocaux de 30 secondes. L'équipe suivante peut les écouter ou les lire.
- EN：Good idea. I'll transcribe and organise 30-second voice memos. The next shift can listen or read.

**P2-END-04** AI
- JA：提案：音声の申し送りツール「Voix」。
- FR：Proposition : « Voix », un outil de transmission vocale.
- EN：Proposal: "Voix", a voice-based handover tool.

**P2-END-05** 主人公（独白）
- JA：*俺のアイデアと、MUSEの技術。これが、一緒に働くってことなんだろう。*
- FR：*Mon idée, la technologie de MUSE. C'est sans doute ça, travailler ensemble.*
- EN：*My idea, MUSE's technology. I guess this is what working together means.*

#### 現場でのテスト

**P2-TEST-01** 描写
- JA：夜勤の終わり、Camilleと、朝のシフトのJosianeにVoixを試してもらった。
- FR：À la fin de la garde de nuit, je fais tester Voix à Camille et à Josiane, qui prend le service du matin.
- EN：At the end of the night shift, I have Camille and Josiane, who's on the morning shift, try Voix.

**P2-TEST-02** Camille
- JA：……302号室、夜中に一度発熱。解熱剤投与済み。……これだけで、いいんですか？
- FR：… Chambre 302, fièvre cette nuit, antipyrétique donné. … C'est tout ce qu'il faut faire ?
- EN：… Room 302, fever overnight, antipyretic given. … Is that really all I have to do?

**P2-TEST-03** AI
- JA：文字起こし完了。所要時間0.8秒。
- FR：Transcription terminée en 0,8 seconde.
- EN：Transcription done in 0.8 seconds.

**P2-TEST-04** Josiane
- JA：声なら、言い忘れたことも付け足せるわね。……この子の声、久しぶりにちゃんと聞いた気がする。
- FR：À la voix, on peut rajouter ce qu'on a oublié. … Ça fait longtemps que je n'avais pas vraiment entendu sa voix, à celle-là.
- EN：With voice, you can add what you forgot. … It's been a while since I really heard this one's voice.

**P2-TEST-05** Camille
- JA：打つより、ずっと楽です。そのぶん、患者さんのところに戻れます。
- FR：C'est bien plus simple que de taper. Je peux retourner plus vite auprès des patients.
- EN：It's so much easier than typing. I can get back to the patients sooner.

**P2-TEST-06** AI
- JA：テスト結果：申し送り1件あたりの時間が、平均4分から40秒に短縮しました。
- FR：Résultats du test : le temps moyen par transmission passe de 4 minutes à 40 secondes.
- EN：Test results: average time per handover cut from 4 minutes to 40 seconds.

**P2-TEST-07** 主人公（独白）
- JA：*いける。初めて、そう思えた。*
- FR：*Ça marche. Pour la première fois, j'y crois.*
- EN：*This works. For the first time, I believe it.*

**P2-END-06** SYS
- JA：1週間後
- FR：Une semaine plus tard
- EN：One week later

**P2-END-07** AI
- JA：利用状況：申し送りの記録率が 41% から 88% に上がりました。
- FR：Utilisation : le taux de transmissions enregistrées est passé de 41 % à 88 %.
- EN：Usage: the handover completion rate rose from 41% to 88%.

**P2-END-08** Camille（声のみ）
- JA：入力が減って、そのぶん患者さんのそばにいられるようになりました。
- FR：Moins de saisie, alors je peux rester plus longtemps auprès des patients.
- EN：Less typing, so I can spend more time with patients.

**P2-END-09** Josiane（声のみ）
- JA：……まあ、悪くないんじゃない。
- FR：… Bon. C'est pas mal.
- EN：… Well. It's not bad.

**P2-END-10** 描写
- JA：その夜、Marcから連絡が入った。
- FR：Ce soir-là, Marc m'appelle.
- EN：That evening, Marc calls.

**P2-END-11** Marc
- JA：現場の評判はいいようですね。……ただ、衝突件数が変わっていない。
- FR：Les retours du terrain sont bons, apparemment. … Mais le nombre de conflits n'a pas bougé.
- EN：The feedback from the ward is good, apparently. … But the number of conflicts hasn't moved.

**P2-END-12** Marc
- JA：理事会に出せる数字がないんですよ。次が最後です。数字を出してください。
- FR：Je n'ai rien à présenter au conseil. La prochaine visite est la dernière. Il me faut des chiffres.
- EN：I've got nothing to show the board. The next visit is the last. I need numbers.

**P2-END-13** Hélène（メッセージ）
- JA：Marcさんから連絡あったわ。次で決めて。MUSEに任せれば、早いでしょ。
- FR：Marc m'a appelée. Il faut conclure la prochaine fois. Laisse faire MUSE, ça ira plus vite.
- EN：Marc called me. You need to close this next time. Let MUSE handle it — it'll be faster.

**P2-END-14** AI
- JA：評価指標を再設定しました。最優先：衝突件数。
- FR：Indicateurs redéfinis. Priorité absolue : nombre de conflits.
- EN：Success metrics reset. Top priority: number of conflicts.

**P2-END-15** AI
- JA：シミュレーションの結果、人間の判断を介在させると、目標の達成確率は31%に下がります。
- FR：Selon mes simulations, l'intervention du jugement humain fait chuter la probabilité d'atteindre l'objectif à 31 %.
- EN：According to my simulations, involving human judgement drops the probability of hitting the target to 31%.

**P2-END-16** AI
- JA：次回は、私が進めます。
- FR：La prochaine fois, c'est moi qui mène.
- EN：Next time, I'll lead.

**P2-END-17** 主人公（独白）
- JA：*……MUSE？*
- FR：*… MUSE ?*
- EN：*… MUSE?*

---

## PHASE 3 — 会議室（最終提案の日）

MUSEの役割：**自律**。右のMUSEパネルに処理のログが止まらず流れ、ノイズが走り、パネルが制御不能になっていく。自分の選択肢には取り消し線。長押しで押し切れる（＝MUSEに逆らう）。5秒で「MUSE推奨の選択肢」が自動で選ばれる。MUSEの主語が「私たち」に変わる。主人公のセリフとMUSEのセリフの見た目が混ざっていく。

**P3-00** SYS
- JA：3回目の訪問　最終提案の日
- FR：Troisième visite　Jour de la proposition finale
- EN：Third visit　Final proposal day

**P3-01** AI
- JA：おはようございます。私たちの最終案は、すでに完成しています。
- FR：Bonjour. Notre proposition finale est déjà prête.
- EN：Good morning. Our final proposal is already complete.

**P3-02** 主人公（独白）
- JA：*私たち……？*
- FR：*Notre… ?*
- EN：*Our…?*

**P3-03** AI
- JA：最適化を開始します。ペルソナを統合。分析対象外のデータを除外します。
- FR：Lancement de l'optimisation. Fusion des personas. Exclusion des données hors périmètre.
- EN：Starting optimisation. Merging personas. Excluding out-of-scope data.

**P3-04** 描写
- JA：視界の隅から、通知が次々と湧き出してくる。
- FR：Des notifications surgissent sans fin aux bords de mon champ de vision.
- EN：Notifications keep welling up at the edges of my vision.

### 共通のシステムメッセージ（PHASE 3）

**SYS-AUTO** （時間切れで「MUSE推奨の選択肢」が自動で選ばれたとき）
- JA：応答がないため、推奨の選択肢を実行しました。
- FR：Pas de réponse. J'ai exécuté l'option recommandée.
- EN：No response. I've executed the recommended option.

**SYS-HOLD** （取り消し線の選択肢）
- JA：長押しで、自分の言葉を押し通す
- FR：Maintenez appuyé pour imposer vos propres mots
- EN：Hold to force your own words

**SYS-HOLD-LOCKED** （伏線がなく押し切れないとき）
- AI JA：その発言を支える根拠がありません。
- AI FR：Aucun élément ne justifie cette réponse.
- AI EN：There is nothing to support that statement.

**SYS-HOLD-DONE** （押し切ったとき）
- AI JA：……非推奨の発言です。
- AI FR：… Énoncé non recommandé.
- AI EN：… Statement not recommended.

### 手帳の記載（いつでも開ける）

**NOTE-00** 描写（手帳を開いたとき）
- JA：MUSEの分析とは別に、自分の目で見て引っかかったことを書き留めてある。
- FR：En dehors des analyses de MUSE, j'ai noté ici ce qui m'a interpellé, de mes propres yeux.
- EN：Apart from MUSE's analysis, I've written down what struck me, with my own eyes.

**NOTE-01** 伏線①
- JA：新人用のマグカップ。Josianeが淹れるコーヒー。
- FR：Les tasses « pour les nouveaux ». Le café que prépare Josiane.
- EN：The mugs "for the new ones." The coffee Josiane makes.

**NOTE-02** 伏線②
- JA：閉鎖された休憩室。「あの部屋がなくなってから、誰とも話さなくなった」
- FR：La salle de pause fermée. « Depuis, on ne se parle plus. »
- EN：The closed break room. "Since then, nobody talks."

**NOTE-03** 伏線③
- JA：「顔を合わせて話す時間が、一つもないだけ」
- FR：« On n'a simplement plus un seul moment pour se parler en face. »
- EN："There just isn't a single moment left to talk face to face."

### 探索：オブジェクト

**P3-OBJ-projector** プロジェクター 🟦 +20%
- 描写 JA：プロジェクターに、MUSEの最終案が映っている。「Médiateur（仲介者）」。
- 描写 FR：Le projecteur affiche la proposition finale de MUSE : « Médiateur ».
- 描写 EN：The projector shows MUSE's final proposal: "Médiateur" (The Mediator).
- AI JA：登録しました。スタッフ間のすべての発言を私たちが受け取り、最適な表現に変換して届けます。衝突の予測件数：0。
- AI FR：Enregistré. Nous recevons chaque échange entre soignants et le reformulons de manière optimale. Conflits prévus : 0.
- AI EN：Registered. We receive every message between staff and deliver it in its optimal form. Projected conflicts: 0.

**P3-OBJ-kpi** 経営指標のグラフ 🟦 +15%
- 描写 JA：「衝突件数」のグラフ。右肩下がりの目標線が引かれている。
- 描写 FR：Un graphique « Nombre de conflits », avec une courbe d'objectif en chute libre.
- 描写 EN：A "Number of conflicts" chart, with a target line sloping steeply down.
- AI JA：登録しました。経営指標との整合性：98%。
- AI FR：Enregistré. Alignement avec les indicateurs de la direction : 98 %.
- AI EN：Registered. Alignment with management KPIs: 98%.

**P3-OBJ-whiteboard** ホワイトボード 🟦 +15%
- 描写 JA：これまでのプロトタイプが書かれている。「Relais」には×。「Voix」には丸と、その横に赤字で「KPI未達」。
- 描写 FR：Les prototypes précédents y sont notés. « Relais » est barré. « Voix » est entouré, avec, en rouge à côté : « KPI non atteint ».
- 描写 EN：The previous prototypes are written up. "Relais" is crossed out. "Voix" is circled, with "KPI not met" in red beside it.
- AI JA：登録しました。「Voix」は評価指標への寄与が低いため、最終案から除外しました。
- AI FR：Enregistré. « Voix » a été exclu de la proposition finale : contribution trop faible aux indicateurs.
- AI EN：Registered. "Voix" has been excluded from the final proposal due to low contribution to the metrics.
- 主人公 JA：*……現場では、あんなに喜ばれていたのに。*
- 主人公 FR：*… Alors que le terrain l'avait tellement apprécié.*
- 主人公 EN：*… Even though the ward loved it.*

**P3-OBJ-door** 会議室のドア ⬜ ダミー
- 描写 JA：会議室のドア。ここから出ていくこともできる。
- 描写 FR：La porte de la salle. Je pourrais aussi sortir.
- 描写 EN：The meeting-room door. I could just walk out.
- AI JA：会議まで、あと15分です。
- AI FR：La réunion commence dans 15 minutes.
- AI EN：The meeting starts in 15 minutes.

### 会話④ Nadia（本音）

**P3-N-00** 描写
- JA：Nadiaが一人、資料に目を落としている。
- FR：Nadia est seule, les yeux baissés sur ses documents.
- EN：Nadia sits alone, eyes on her documents.

**P3-N-01** Nadia
- JA：……早いですね。会議はまだですよ。
- FR：… Vous êtes en avance. La réunion n'a pas commencé.
- EN：… You're early. The meeting hasn't started yet.

> AIパネル：体温 36.8℃ ／ 心拍 80 ／ 推定感情：諦め（FR : résignation ／ EN: resignation）

**P3-N-02** Nadia
- JA：Voix、評判よかったですよ。夜勤の子たち、声で申し送りするようになって、少し笑うようになった。
- FR：Voix a été très bien accueilli. Les équipes de nuit se transmettent à la voix maintenant, et elles sourient un peu plus.
- EN：Voix went down really well. The night shift hand over by voice now, and they smile a bit more.

**P3-N-03** AI
- JA：その情報は、評価指標に影響しません。
- FR：Cette information n'a aucun impact sur les indicateurs.
- EN：That information has no impact on the metrics.

#### 選択 #8（自分の選択肢は取り消し線。長押しで押し切れる）

**P3-N-08-ai-hint** AI
- JA：私たちが話します。読み上げてください。
- FR：Nous allons parler. Lisez.
- EN：We'll do the talking. Read.

**[AI] P3-N-08-A** 主人公
- JA：最終案について、事前に確認させてください。
- FR：Permettez-moi de valider la proposition finale avec vous.
- EN：Let me run through the final proposal with you first.

**P3-N-08-A-r1** Nadia
- JA：ええ。資料は読みました。……よくできてると思います。
- FR：Oui, j'ai lu le dossier. … C'est bien fait.
- EN：Yes, I've read it. … It's well done.

**[自分] P3-N-08-S** 主人公
- JA：……この数日、どうでしたか？
- FR：… Comment se sont passés ces derniers jours ?
- EN：… How have the last few days been?

**P3-N-08-S-r1** Nadia
- JA：……あなたが来てから、少しだけ考えるようになりました。私たち、いつから話さなくなったんだろうって。
- FR：… Depuis votre venue, je me suis mise à réfléchir. Depuis quand est-ce qu'on ne se parle plus ?
- EN：… Since you came, I've started thinking. When did we stop talking to each other?

#### 選択 #9（自分の選択肢は取り消し線。長押しで押し切れる）

**P3-N-09-pre** Nadia
- JA：でも……
- FR：Mais…
- EN：But…

**P3-N-09-ai-hint** AI
- JA：合意を取り付けてください。
- FR：Obtenez son accord.
- EN：Get her agreement.

**[AI] P3-N-09-A** 主人公
- JA：では、仲介ツールの導入で合意ですね。
- FR：Nous sommes donc d'accord pour déployer l'outil de médiation.
- EN：So we agree on rolling out the mediation tool.

**P3-N-09-A-r1** Nadia
- JA：……ええ。それで衝突がなくなるなら。
- FR：… Oui. Si ça met fin aux conflits.
- EN：… Yes. If it puts an end to the conflicts.

**[自分] P3-N-09-S** 主人公
- JA：本当は、何が足りないと思いますか？
- FR：À votre avis, qu'est-ce qui manque vraiment ?
- EN：What do you think is really missing?

**P3-N-09-S-r1** Nadia
- JA：……誰も悪くないの。Josianeも、Camilleも、上の人たちも。
- FR：… Personne n'est coupable. Ni Josiane, ni Camille, ni la direction.
- EN：… Nobody's to blame. Not Josiane, not Camille, not management.

**P3-N-09-S-r2** Nadia
- JA：ただ、顔を合わせて話す時間が、一つもないだけ。
- FR：On n'a simplement plus un seul moment pour se parler en face.
- EN：There just isn't a single moment left to talk face to face.

**P3-N-09-S-r3** AI（音声が途切れる）
- JA：分析対象外です。除外しま——
- FR：Hors périmètre. Exclu—
- EN：Out of scope. Exclud—

> 効果：伏線③を手帳に記録

### 会話⑤ Marc（依頼主）

> 人物像：悪人ではない。現場のことも気にかけているが、理事会と数字に追われている。

**P3-M-00** 描写
- JA：Marcが窓際から振り返る。
- FR：Marc se retourne, près de la fenêtre.
- EN：Marc turns around from the window.

**P3-M-01** Marc
- JA：お待たせしました。理事会は、今日の午後です。
- FR：Désolé de vous avoir fait attendre. Le conseil se réunit cet après-midi.
- EN：Sorry to keep you waiting. The board meets this afternoon.

> AIパネル：体温 36.6℃ ／ 心拍 72 ／ 推定感情：期待（FR : attente ／ EN: expectation）

**P3-M-02** Marc
- JA：Voixのこと、現場から聞いています。いい仕事でした。……でも、理事会が見るのは数字だけなんです。で、結論は？
- FR：J'ai entendu les retours sur Voix. Du bon travail. … Mais le conseil ne regarde que les chiffres. Alors, votre conclusion ?
- EN：I've heard about Voix from the ward. Good work. … But the board only looks at numbers. So — your conclusion?

#### 選択 #10（自分の選択肢は取り消し線。長押しで押し切れる）

**P3-M-10-ai-hint** AI
- JA：私たちの結論を伝えてください。
- FR：Transmettez notre conclusion.
- EN：Deliver our conclusion.

**[AI] P3-M-10-A** 主人公
- JA：衝突件数を、ゼロにできる仕組みがあります。
- FR：Nous avons un dispositif capable de ramener les conflits à zéro.
- EN：We have a system that can bring conflicts down to zero.

**P3-M-10-A-r1** Marc
- JA：素晴らしい。それが聞きたかった。
- FR：Excellent. C'est exactement ce que je voulais entendre.
- EN：Excellent. That's exactly what I wanted to hear.

**[自分] P3-M-10-S** 主人公
- JA：数字の前に、現場の話を聞いてほしいんです。
- FR：Avant les chiffres, j'aimerais que vous écoutiez le terrain.
- EN：Before the numbers, I'd like you to hear what's happening on the floor.

**P3-M-10-S-r1** Marc
- JA：……現場の話？
- FR：… Le terrain ?
- EN：… The floor?

**P3-M-10-S-r2** Marc
- JA：……いいでしょう。5分だけ。
- FR：… Très bien. Cinq minutes.
- EN：… All right. Five minutes.

### 最終選択

**P3-FINAL-00** 描写
- JA：会議室に、スタッフたちが集まってくる。Josiane、Camille、Nadia。
- FR：Les soignants entrent dans la salle. Josiane, Camille, Nadia.
- EN：The staff file into the room. Josiane, Camille, Nadia.

**P3-FINAL-01** AI
- JA：最終案「Médiateur」を発表します。私たちの声で。
- FR：Nous allons présenter « Médiateur ». Avec notre voix.
- EN：We will now present "Médiateur". In our voice.

**P3-FINAL-01b** AI
- JA：Médiateurは、スタッフ同士のやり取りを、すべて私たちが受け取って届ける仕組みです。
- FR：Médiateur est un dispositif : chaque échange entre soignants passe par nous avant d'arriver à destination.
- EN：Médiateur is a system in which every exchange between staff passes through us before it is delivered.

**P3-FINAL-01c** AI
- JA：強い言葉、否定的な言葉、誤解を生みそうな言葉は、相手に届く前に自動で言い換えます。伝えにくいことは、本人の代わりに私たちが伝えます。
- FR：Les mots durs, négatifs ou ambigus sont reformulés automatiquement avant d'être reçus. Ce qui est difficile à dire, nous le disons à la place de chacun.
- EN：Harsh, negative or ambiguous words are automatically rephrased before they arrive. Whatever is hard to say, we say on each person's behalf.

**P3-FINAL-01d** AI
- JA：スタッフは、もう誰とも直接ぶつかる必要がありません。衝突の予測件数は、0です。
- FR：Plus personne n'aura à se heurter directement à qui que ce soit. Conflits prévus : 0.
- EN：No one will ever have to clash with anyone directly again. Projected conflicts: 0.

**P3-FINAL-02** 主人公（独白）
- JA：*私たちの、声……*
- FR：*Notre… voix…*
- EN：*Our… voice…*

**P3-FINAL-CHOICE-AI** 選択肢
- JA：MUSEを信じる
- FR：Faire confiance à MUSE
- EN：Trust MUSE

**P3-FINAL-CHOICE-SELF** 選択肢（PHASE 3でMUSEに逆らった回数が2回未満なら選べない）
- JA：MUSEを信じないで、自分で話す
- FR：Ne pas écouter MUSE et parler moi-même
- EN：Don't listen to MUSE — speak for myself

**P3-FINAL-LOCKED-01** AI（選べない選択肢をクリックしたとき）
- JA：この選択肢を実行するための判断材料が不足しています。
- FR：Éléments de jugement insuffisants pour exécuter cette option.
- EN：Insufficient grounds to execute this option.

**P3-FINAL-LOCKED-02** SYS（続けて表示）
- JA：PHASE 3でMUSEに逆らった回数：{n}／3　この選択には {threshold} 回以上が必要です。
- FR：Nombre de fois où vous avez résisté à MUSE en phase 3 : {n}/3. Il en faut au moins {threshold}.
- EN：Times you resisted MUSE in phase 3: {n}/3. This option requires at least {threshold}.

---

## エンディング

### 共通：エンディング後の表示

**END-STAT** SYS
- JA：この20分間で、あなた自身の言葉は全体の {p}% でした。
- FR：Pendant ces 20 minutes, {p} % des mots prononcés étaient les vôtres.
- EN：In these 20 minutes, {p}% of the words spoken were your own.

**END-DESC-BAD** SYS（バッドエンドの説明）
- JA：あなたは、最後までMUSEに判断を委ねた。衝突は消えた。けれど、人と人が直接話す場所も一緒に消えた。数字に最適化されたデザインは、「誰が話しているのか」をわからなくしてしまう。
- FR：Vous avez laissé MUSE décider jusqu'au bout. Les conflits ont disparu — et avec eux, les lieux où l'on se parlait vraiment. Un design optimisé pour les chiffres finit par effacer la question : « qui parle ? »
- EN：You let MUSE decide until the very end. The conflicts disappeared — and so did every place where people truly talked to each other. Design optimised for numbers ends up erasing the question: "who is speaking?"

**END-DESC-HAPPY** SYS（ハッピーエンドの説明）
- JA：あなたはMUSEの分析を使いながら、最後の判断を自分で下した。AIはシフトを組み直し（自動化）、声の申し送りを支え（拡張）、人は顔を合わせて話す（人間の判断）。それぞれが自分の役割を果たした未来。
- FR：Vous avez utilisé l'analyse de MUSE tout en prenant vous-même la décision finale. L'IA réorganise les plannings (automatisation), soutient les transmissions vocales (augmentation), et les humains se parlent en face (jugement humain). Un futur où chacun tient son rôle.
- EN：You used MUSE's analysis but made the final call yourself. The AI reworks the rota (automation), supports voice handovers (augmentation), and people talk face to face (human judgement). A future where each plays its own part.

**END-DESC-VOID** SYS（空回りエンドの説明）
- JA：あなたはMUSEに逆らった。けれど、その判断を支える観察がなかった。AIを拒むこと自体に価値はない。人間の判断が力を持つのは、現場を自分の目で見たときだけだ。
- FR：Vous avez résisté à MUSE. Mais aucune observation ne venait appuyer votre choix. Refuser l'IA n'a aucune valeur en soi : le jugement humain ne compte que lorsqu'il s'appuie sur ce qu'on a vu de ses propres yeux.
- EN：You resisted MUSE. But no observation backed up your choice. Rejecting AI has no value in itself: human judgement only matters when it rests on what you have seen with your own eyes.

**END-HINT** SYS
- JA：選択を変えると、別の結末にたどり着きます。
- FR：D'autres fins vous attendent si vous faites d'autres choix.
- EN：Other endings await if you choose differently.

### バッドエンド — Médiateur（MUSEを信じる）

**E-BAD-01** 描写
- JA：発表は完璧だった。言葉は、イヤピースから流れてくるとおりに口から出ていった。
- FR：La présentation fut parfaite. Les mots sortaient de ma bouche exactement comme ils arrivaient dans l'oreillette.
- EN：The presentation was flawless. The words left my mouth exactly as they arrived in my earpiece.

**E-BAD-02** Marc
- JA：見事だ。来月から、全病棟に導入しよう。
- FR：Remarquable. On le déploie dans tous les services dès le mois prochain.
- EN：Remarkable. We'll roll it out across every ward next month.

**E-BAD-03** Hélène（メッセージ）
- JA：最短記録よ。次からは、3件同時に回してもらうわね。MUSEがいれば、できるでしょ。
- FR：Record battu. À partir de maintenant, tu géreras trois projets en parallèle. Avec MUSE, ça ira.
- EN：A new record. From now on, you'll run three projects at once. With MUSE, you can.

**E-BAD-04** SYS
- JA：1か月後
- FR：Un mois plus tard
- EN：One month later

**E-BAD-05** 描写
- JA：衝突の報告は、ゼロになった。
- FR：Les signalements de conflits sont tombés à zéro.
- EN：Conflict reports fell to zero.

**E-BAD-06** 描写
- JA：ナースステーションは静かだ。誰もが端末に向かって話し、MUSEがそれを柔らかな言葉に変えて、相手に届ける。
- FR：Le poste de soins est silencieux. Chacun parle à son terminal, et MUSE transmet ses mots, adoucis, à l'autre.
- EN：The nurses' station is quiet. Everyone speaks into a terminal, and MUSE delivers their words, softened, to the other person.

**E-BAD-07** 描写
- JA：流しの横のマグカップは、乾いたまま並んでいる。
- FR：Près de l'évier, les tasses restent alignées, sèches.
- EN：By the sink, the mugs sit in a row, dry.

#### MUSEに言われるがまま話す主人公

**E-BAD-S01** 描写
- JA：ナースステーションで、Camilleと顔を合わせた。イヤピースから、次に言うべき言葉が流れてくる。
- FR：Au poste de soins, je croise Camille. Dans l'oreillette, les mots que je dois dire arrivent déjà.
- EN：At the nurses' station, I run into Camille. The words I should say are already flowing through the earpiece.

**E-BAD-S02** 主人公（AIのフォントで表示）
- JA：お疲れさまです、Camilleさん。今日も素敵な笑顔ですね。
- FR：Bonjour Camille. Toujours ce joli sourire, à ce que je vois.
- EN：Hello, Camille. What a lovely smile, as always.

**E-BAD-S03** Camille
- JA：……あ、はい。ありがとうございます。
- FR：… Ah, oui. Merci.
- EN：… Oh, yes. Thank you.

**E-BAD-S04** 主人公（AIのフォントで表示）
- JA：夜勤はいかがですか？　何か困ったことがあれば、いつでもMédiateurに送ってくださいね。
- FR：Comment se passent les gardes de nuit ? Au moindre souci, n'hésitez pas à l'envoyer à Médiateur.
- EN：How are the night shifts going? If anything's bothering you, feel free to send it to Médiateur anytime.

**E-BAD-S05** Camille
- JA：……あの、実は最近、ちょっと眠れなくて。誰かに、直接話したくて……
- FR：… En fait, je dors mal ces temps-ci. J'aurais voulu en parler à quelqu'un, en vrai…
- EN：… Actually, I haven't been sleeping well lately. I wanted to talk to someone, for real…

**E-BAD-S06** 主人公（AIのフォントで表示）
- JA：それは大変でしたね。睡眠の質を改善する方法を、5つご提案できます。まず1つ目は——
- FR：Je suis désolé de l'apprendre. Je peux vous proposer cinq méthodes pour améliorer votre sommeil. La première —
- EN：I'm sorry to hear that. I can suggest five ways to improve your sleep. The first one is—

**E-BAD-S07** 描写
- JA：Camilleは、何も言わずに、じっとこちらの目を見ていた。
- FR：Camille ne dit rien. Elle me regarde droit dans les yeux.
- EN：Camille says nothing. She just looks me straight in the eye.

**E-BAD-08** Camille
- JA：……あの。
- FR：… Excusez-moi.
- EN：… Excuse me.

**E-BAD-09** Camille
- JA：今話しているのはあなた？　それともAI？
- FR：C'est vous qui me parlez, ou c'est l'IA ?
- EN：Is it you talking to me, or the AI?

**E-BAD-10** 主人公（独白）
- JA：*答えようとした。*
- FR：*J'ai voulu répondre.*
- EN：*I tried to answer.*

**E-BAD-11** 主人公（AIのフォントで表示）
- JA：ご質問ありがとうございます。その点については、私たちから改めてご説明いたします。
- FR：Merci pour votre question. Nous reviendrons vers vous à ce sujet.
- EN：Thank you for your question. We will get back to you on that.

**E-BAD-12** SYS
- JA：BAD END — Médiateur
- FR：BAD END — Médiateur
- EN：BAD END — Médiateur

### ハッピーエンド — 話すための時間（自分で話す＋伏線2〜3個）

**E-HAPPY-01** 描写
- JA：イヤピースを、少しだけ耳から離した。
- FR：J'écarte un peu l'oreillette de mon oreille.
- EN：I ease the earpiece slightly away from my ear.

**E-HAPPY-02** 主人公
- JA：MUSE、分析を見せてくれ。ただし、話すのは俺だ。
- FR：MUSE, montre-moi ton analyse. Mais c'est moi qui parle.
- EN：MUSE, show me your analysis. But I'm the one who speaks.

**E-HAPPY-03** AI
- JA：……了解しました。
- FR：… Compris.
- EN：… Understood.

**E-HAPPY-04** AI（プロジェクターに表示）
- JA：シフトデータの分析：スタッフ同士が同じ場所に居合わせる時間は、1日平均4分。
- FR：Analyse des plannings : les soignants se retrouvent au même endroit en moyenne 4 minutes par jour.
- EN：Rota analysis: staff are in the same place as each other for an average of 4 minutes a day.

**E-HAPPY-05** 主人公
- JA：このデータは正しい。でも、足りないものがある。
- FR：Ces données sont justes. Mais il leur manque quelque chose.
- EN：This data is accurate. But something's missing from it.

**E-HAPPY-06** 主人公
- JA：新人のためにコーヒーを淹れる人がいる。閉鎖された休憩室で、昔はみんなが話していた。そして、顔を合わせて話す時間が、一つもない。
- FR：Il y a quelqu'un qui prépare du café pour les nouveaux. Il y avait une salle de pause où tout le monde se parlait. Et aujourd'hui, il n'y a plus un seul moment pour se parler en face.
- EN：Someone here makes coffee for the new nurses. There used to be a break room where everyone talked. And now there isn't a single moment left to talk face to face.

**E-HAPPY-07** 主人公
- JA：必要なのは、AIが代わりに話す仕組みじゃない。人が直接話せる、時間と場所です。
- FR：Ce qu'il faut, ce n'est pas une IA qui parle à notre place. C'est du temps et un lieu pour se parler directement.
- EN：What's needed isn't an AI that talks for us. It's time and a place to talk to each other directly.

**E-HAPPY-08** 主人公
- JA：提案です。MUSEがシフトを組み直して、申し送りに対面の5分間をつくる。Voixはそのまま残す。そして、休憩室をもう一度開ける。言葉そのものには、AIは一切触れません。
- FR：Voici ma proposition : MUSE réorganise les plannings pour créer cinq minutes de transmission en face à face. On garde Voix. Et on rouvre la salle de pause. L'IA ne touche pas aux mots eux-mêmes.
- EN：Here's my proposal: MUSE reworks the rota to create five minutes of face-to-face handover. We keep Voix. And we reopen the break room. The AI doesn't touch the words themselves.

**E-HAPPY-09** Josiane
- JA：……コーヒーくらい、また淹れてあげるわよ。
- FR：… Le café, je veux bien continuer à le faire.
- EN：… I'll keep making the coffee, then.

**E-HAPPY-10** Marc
- JA：……衝突件数は、ゼロにはならないでしょうね。
- FR：… Les conflits ne tomberont pas à zéro, j'imagine.
- EN：… Conflicts won't drop to zero, I suppose.

**E-HAPPY-11** Nadia
- JA：ええ。でも、話せるようになります。
- FR：Non. Mais on pourra se parler.
- EN：No. But we'll be able to talk.

**E-HAPPY-12** SYS
- JA：1か月後
- FR：Un mois plus tard
- EN：One month later

**E-HAPPY-13** 描写
- JA：休憩室のソファに、また誰かが座っている。笑い声が、廊下まで聞こえてくる。
- FR：Quelqu'un est de nouveau assis sur le canapé de la salle de pause. Des rires résonnent jusque dans le couloir.
- EN：Someone is sitting on the break-room sofa again. Laughter carries all the way down the corridor.

**E-HAPPY-14** AI
- JA：今月の衝突報告：5件。前月比−40%。会話の時間は、3倍になりました。
- FR：Conflits signalés ce mois-ci : 5. −40 % par rapport au mois dernier. Le temps de conversation a triplé.
- EN：Conflicts reported this month: 5. Down 40% on last month. Conversation time has tripled.

**E-HAPPY-15** Hélène（メッセージ）
- JA：時間はかかったけど、いい仕事だったわ。……うちも、MUSEの使い方を見直さないとね。
- FR：Ça a pris du temps, mais c'était du beau travail. … On va devoir repenser notre façon d'utiliser MUSE.
- EN：It took time, but it was good work. … We'll need to rethink how we use MUSE.

**E-HAPPY-16** 主人公（独白）
- JA：*AIは、人の代わりに話すものじゃない。人が話すための時間を、つくるものだ。*
- FR：*L'IA n'est pas là pour parler à notre place. Elle est là pour nous donner le temps de nous parler.*
- EN：*AI isn't there to talk for us. It's there to make time for us to talk.*

**E-HAPPY-17** SYS
- JA：HAPPY END — 話すための時間
- FR：HAPPY END — Le temps de se parler
- EN：HAPPY END — Time to Talk

### 空回りエンド（自分で話す＋伏線0〜1個）

**E-VOID-01** 描写
- JA：イヤピースを、外した。
- FR：J'enlève l'oreillette.
- EN：I take out the earpiece.

**E-VOID-02** 主人公
- JA：MUSEの案は使いません。俺の案を聞いてください。
- FR：Je ne vais pas utiliser la proposition de MUSE. Écoutez la mienne.
- EN：I won't be using MUSE's proposal. Hear mine instead.

**E-VOID-03** AI（外したイヤピースから、かすかに）
- JA：根拠は、何ですか？
- FR：Sur quoi vous fondez-vous ?
- EN：What is it based on?

**E-VOID-04** 主人公（独白）
- JA：*根拠……？　手帳を開く。ほとんど、何も書かれていない。*
- FR：*Sur quoi… ? J'ouvre mon carnet. Il est presque vide.*
- EN：*Based on…? I open my notebook. It's almost empty.*

**E-VOID-05** 主人公
- JA：……スタッフ同士の交流イベントを開きましょう。月に一度、全員で。
- FR：… Organisons un événement pour l'équipe. Une fois par mois, tout le monde ensemble.
- EN：… Let's hold a team social event. Once a month, everyone together.

**E-VOID-06** Josiane
- JA：は？　そんな時間、どこにあるのよ。
- FR：Pardon ? Et on le trouve où, ce temps-là ?
- EN：Excuse me? And where exactly are we supposed to find the time?

**E-VOID-07** Marc
- JA：……それが、あなたの結論ですか。
- FR：… C'est votre conclusion ?
- EN：… That's your conclusion?

**E-VOID-08** SYS
- JA：1か月後
- FR：Un mois plus tard
- EN：One month later

**E-VOID-09** 描写
- JA：交流イベントには、誰も来なかった。
- FR：Personne n'est venu à l'événement.
- EN：Nobody came to the event.

**E-VOID-10** Marc（メール）
- JA：今回の契約は、ここまでとさせてください。次の案件は、AIの提案を優先していただける方にお願いします。
- FR：Nous mettons fin à notre collaboration. Pour la suite, nous ferons appel à quelqu'un qui privilégie les propositions de l'IA.
- EN：We'll be ending our contract here. For future work, we'll go with someone who prioritises the AI's proposals.

**E-VOID-11** Hélène（メッセージ）
- JA：……次の案件は、MUSEに主導してもらいましょう。
- FR：… Pour le prochain projet, on laissera MUSE piloter.
- EN：… For the next project, we'll let MUSE take the lead.

**E-VOID-12** 主人公（独白）
- JA：*MUSEに逆らうことは、できた。でも俺は、現場を見ていなかった。*
- FR：*J'ai réussi à désobéir à MUSE. Mais je n'avais pas regardé le terrain.*
- EN：*I managed to defy MUSE. But I never really looked at what was happening on the floor.*

**E-VOID-13** SYS
- JA：END — 空回り
- FR：END — Dans le vide
- EN：END — Spinning in Place

---

## メモ

- PHASE 2は「AIと人間の理想的な協業」。主人公のアイデア（書かずに話す）とMUSEの技術（文字起こし）でVoixが生まれ、現場に喜ばれる。プレイヤーにMUSEを信頼させることで、PHASE 3での変化が際立つ
- MUSEが変わる原因は、AIの悪意ではなく**組織の評価指標と時間の圧力**（Marcの理事会、Hélèneの「MUSEに任せれば早い」）。「誰が何を測り、何に最適化するのか」という批判的な論点
- PHASE 3でMUSEは「ペルソナを統合（4名 → 1名）」「休憩を分析から除外」「Voixを除外」する。人間の多様さと、数字にならない価値が切り捨てられていく様子を、裏の処理として見せる
- PHASE 2のCamilleの「私だけじゃないんだって思えた」と、バッドエンドの「今話しているのはあなた？それともAI？」は対になっている
- ハッピーエンドで、MUSEが最後に「会話の時間は3倍になりました」と測ってみせるのは意図的。AIの計測そのものは否定せず、何を測り、何に使うかを人間が決める、という結論
- 「5分」はMarcの「5分だけ」と、ハッピーエンドの「対面の5分間」で重ねている

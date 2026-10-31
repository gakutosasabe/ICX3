# 素材リスト v0.1

方針：**人物はいらすとや**、**背景とオブジェクトは生成AI**、**AIパネルとHUDはコードで描く**

---

## 1. 背景（生成AI）

### 共通ルール

- **オブジェクトは背景に描き込む**。クリックできる範囲は、コード側で透明な当たり判定を重ねて作る
- **構図**：画面の右側 約30% はAIパネルで隠れるので、重要なオブジェクトは**左〜中央**に置く。下側 約25% もテキストゾーンで隠れる
- **人物は描かない**（いらすとやの人物を上に重ねるため）。中央〜左に、人物を立たせる余白を残す
- **画風**：いらすとやと馴染むように、フラットで柔らかい色、細い輪郭線、影は少なめ
- **サイズ**：16:9（例：1920×1080）

### 共通スタイルプロンプト（全背景の末尾に付ける）

```
flat vector illustration, warm and clearly saturated colors, solid flat color fills,
medium contrast, crisp dark-gray outlines, simple cel shading with soft shadows,
simple shapes, Japanese free-illustration style similar to Irasutoya,
empty room with no people, 16:9, eye-level first-person view,
no haze, no glow, no bloom, no white fog, no overexposure, no washed-out colors,
any visible text must be short, correctly spelled English words only
```

文字を入れたい背景では、個別プロンプトに入れる単語を具体的に書く（例：`a sign that says "STAFF ONLY"`、`a sticky note that says "FOR NEWBIES"`）。

> v0.1 では `soft pastel colors` `minimal shading` `visually quiet` の組み合わせで画像全体が白っぽくなったため、色とコントラストをはっきりさせる指定に変更した。右側と下側を空ける指定は外した（ゲーム側でAIパネルとテキスト欄が上に重なるため、背景は普通に描いてよい）

> **そのままコピペできる全プロンプトは [bg-prompts.md](bg-prompts.md) にある。** 以下は仕組みの説明。

### 作り方：「前」を作ってから、それを参照して残りの3方向を作る

1. 各部屋の**「前」**を、個別プロンプト＋共通スタイルプロンプトで生成する
2. 気に入った「前」ができたら、その画像の**壁・床・天井の色**を見て、下の「部屋の固定要素」を書き換える
3. **「右」「後ろ」「左」**は、「前」の画像を添付して、下の**方向別テンプレート**で生成する
4. 方向ごとに、テンプレートの `{DIRECTION}` `{ROOM}` `{ANCHORS}` `{VIEW}` を埋める。末尾には共通スタイルプロンプトを付ける

### 方向別テンプレート（「右」「後ろ」「左」用）

```
Use the attached image as the reference for this room.
Show the SAME {ROOM} from the same eye level, {DIRECTION}.
Keep exactly the same art style, line thickness, color palette and lighting.
Keep the same room: {ANCHORS}.
This is a different wall of the room: do not repeat the objects of the reference view.
In this view: {VIEW}
Empty room, no people, 16:9.
```

`{DIRECTION}` に入れる言葉：

| 方向 | {DIRECTION} |
|---|---|
| 右 | `after turning 90 degrees to the right` |
| 後ろ | `after turning around 180 degrees (looking back)` |
| 左 | `after turning 90 degrees to the left` |

---

### ナースステーション（PHASE 1・昼）

- `{ROOM}`：`hospital nurses' station`
- `{ANCHORS}`（部屋の固定要素。「前」の画像に合わせて調整）：`mint green and cream walls, a pale yellow accent wall, light beige floor, white ceiling with square ceiling lights, mint green furniture with a blue stripe, daytime light`

| ID | 方向 | 描き込むもの | プロンプト |
|---|---|---|---|
| BG-P1-front | 前 | カウンター、業務端末 | ✅ 作成済み（`hospital nurses' station counter, a computer terminal showing patient records on the counter, daytime`） |
| BG-P1-right | 右 | シフト表のホワイトボード、掲示板 | `{VIEW}` = `a large whiteboard shift schedule on the wall, covered in handwritten names and small red crosses, and next to it a cork notice board with a paper that says "HANDOVER: USE TERMINAL" underlined twice in red.` |
| BG-P1-back | 後ろ | ナースコールのパネル、廊下 | `{VIEW}` = `the hospital corridor seen from inside the nurses' station, patient room doors with numbers "301" and "302", and a nurse call panel on the wall with several red lights on.` |
| BG-P1-left | 左 | 給湯スペース、マグカップ | `{VIEW}` = `a small pantry corner with a sink and a coffee maker, three colorful mugs lined up next to the sink, and a yellow sticky note on the wall above them that says "FOR NEWBIES".` |

### 夜勤の病棟（PHASE 2・夜）

- `{ROOM}`：`hospital ward at night`
- `{ANCHORS}`（「前」を作ったら、その画像に合わせて書き換える）：`dark navy blue walls, dim teal floor, only a few warm ceiling lights on, quiet night atmosphere`

| ID | 方向 | 描き込むもの | プロンプト |
|---|---|---|---|
| BG-P2-front | 前 | ナースステーションの一角、バイタルモニター | 単独で生成：`hospital ward at night, dim lighting with a few warm ceiling lights, a corner of the night nurses' station, a vital signs monitor on the wall glowing green, dark navy walls` |
| BG-P2-right | 右 | 申し送り用タブレット、点滴台 | `{VIEW}` = `a small desk with a tablet whose screen shows empty fields blinking red, and an IV drip stand with a bag next to the desk.` |
| BG-P2-back | 後ろ | 自動販売機、暗い廊下の先 | `{VIEW}` = `a long dim corridor stretching into the distance, and a brightly lit vending machine against the wall with one worn button.` |
| BG-P2-left | 左 | 閉鎖された休憩室のドア、窓の夜景 | `{VIEW}` = `an old closed door with a frosted glass window and a faded sign that says "STAFF ONLY", the soft shadow of a sofa visible behind the glass, and next to it a window showing city lights at night.` |

### 会議室（PHASE 3）

- `{ROOM}`：`hospital meeting room`
- `{ANCHORS}`（「前」を作ったら、その画像に合わせて書き換える）：`warm beige walls, gray carpet floor, white ceiling with long panel lights, a long light-wood table, morning daylight`

| ID | 方向 | 描き込むもの | プロンプト |
|---|---|---|---|
| BG-P3-front | 前 | プロジェクターのスクリーン、長机 | 単独で生成：`hospital meeting room, a long light-wood table with chairs, a projector screen on the wall showing a simple blank slide, warm beige walls, gray carpet, morning daylight` |
| BG-P3-right | 右 | 窓、経営指標のグラフ | `{VIEW}` = `a large window with daylight, and on the wall beside it a printed chart titled "CONFLICTS" with a steep downward target line.` |
| BG-P3-back | 後ろ | ドア | `{VIEW}` = `the plain entrance door of the meeting room, with a small sign that says "MEETING ROOM".` |
| BG-P3-left | 左 | ホワイトボード、机の上の手帳 | `{VIEW}` = `a whiteboard with two product sketches: one labeled "RELAIS" crossed out with a big X, one labeled "VOIX" circled with "KPI" written in red; a small brown notebook lying on the table in front of it.` |

### デザイン事務所（プロローグ）

| ID | 方向 | 描き込むもの | プロンプト |
|---|---|---|---|
| BG-P0 | 1方向のみ | 窓際、デスク、デバイス | 単独で生成：`small bright design studio, a desk by a large window, a monitor, smart glasses and a wireless earpiece placed on the desk, plants and sticky notes on the wall, morning light` |

### 記入例（BG-P1-right を作るとき、Geminiに貼る全文）

「前」の画像を添付して、次を貼る。

```
Use the attached image as the reference for this room.
Show the SAME hospital nurses' station from the same eye level, after turning 90 degrees to the right.
Keep exactly the same art style, line thickness, color palette and lighting.
Keep the same room: mint green and cream walls, a pale yellow accent wall, light beige floor, white ceiling with square ceiling lights, mint green furniture with a blue stripe, daytime light.
This is a different wall of the room: do not repeat the objects of the reference view.
In this view: a large whiteboard shift schedule on the wall, covered in handwritten names and small red crosses, and next to it a cork notice board with a paper that says "HANDOVER: USE TERMINAL" underlined twice in red.
Empty room, no people, 16:9.

flat vector illustration, warm and clearly saturated colors, solid flat color fills,
medium contrast, crisp dark-gray outlines, simple cel shading with soft shadows,
simple shapes, Japanese free-illustration style similar to Irasutoya,
empty room with no people, 16:9, eye-level first-person view,
no haze, no glow, no bloom, no white fog, no overexposure, no washed-out colors,
any visible text must be short, correctly spelled English words only
```

### 生成AIで背景を作るときのコツ

- **同じ部屋の4方向の一貫性**：家具の位置まで完全に合わせる必要はない。プレイヤーは4枚を並べて見比べないので、壁・床・光・画風がそろっていれば同じ部屋に見える
  - 「前」の画像を毎回添付する
  - 「部屋の固定要素（ANCHORS）」を毎回同じ文で書く
  - 「前」と同じ物が出てきたら、「do not repeat the objects of the reference view」を強調して作り直す
- **背景の文字は英語**：張り紙や付箋、部屋番号などは英語で描かせる。1〜3語の短い単語にすると崩れにくい（例：`STAFF ONLY`、`FOR NEWBIES`、`HANDOVER`）。崩れた場合は、ペイントソフトで直すか、作り直す
- **大事な文字はゲーム側で出す**：物語上の意味がある文字（「新人用」の付箋、プロジェクターの「Médiateur」など）は、調べたときに出るイラストとセリフで3言語に切り替わるので、背景の文字は英語のままで問題ない
- **使ったツール・プロンプト・日付を記録しておく**（補足資料用）

---

## 2. 人物（いらすとや）

| キャラクター | 探す絵のイメージ | 表情差分 |
|---|---|---|
| Marc（経営側） | スーツの中年男性、ビジネスマン | 通常／満足／眉をひそめる |
| Nadia（看護師長） | 落ち着いた中年女性の看護師 | 通常／困り顔 |
| Josiane（ベテラン看護師） | 年配の女性看護師、腕組み | 通常／怒り／照れ（コーヒーの場面） |
| Camille（若手の夜勤看護師） | 若い女性の看護師、疲れた様子 | 通常／疲れ／ほっとする |
| モブ：走る看護師 | 走っている看護師 | 1枚 |
| モブ：点滴を準備する看護師 | 点滴の準備をしている看護師 | 1枚 |

### いらすとやを使うときの注意

- 表情差分のセットが同じキャラクターでそろわない場合は、**1人1枚**にして、感情はAIパネルの「推定感情」と、汗マークなどの小さなエフェクトで見せる
  - 「表情は絵ではなく、AIが数値で読み取っている」という見せ方は、むしろテーマに合っている
- 利用規約：個人・非商用（学校の課題）なら基本的に自由に使える。商用利用は1つの制作物につき20点までなどの制限がある。**使う前に最新の規約を確認**
- 背景との絵柄の差：背景をいらすとや風のフラットな画風で生成すれば馴染む

---

## 3. コードで描くもの（素材不要）

- AIパネル（体温・心拍・推定感情、登録ログ）
- 情報ゲージ
- 選択肢のボタン（AIの選択／自分の選択、グレーアウト、取り消し線、長押しのゲージ）
- AI暴走時のポップアップ
- 手帳の画面
- テキストウィンドウ
- 物語上の意味がある文字（イラストとセリフで3言語に切り替える）

---

## 4. 補足資料に書くこと（生成AIの使用について）

AIへの依存を批判的に描く作品なので、制作でAIを使った箇所は明記する。

- どこにAIを使ったか：背景とオブジェクトの画像
- なぜAIを使ったか：例）限られた時間で12枚の背景を作るため。その分の時間を、シナリオ・リサーチ・システム設計に使った
- どこには使わなかったか：例）シナリオの構想、システムの設計、最終的な判断
- 作品のテーマとの関係：制作のプロセス自体が「自動化／拡張／人間の判断」の実践例になっている

※ シナリオや翻訳でClaudeを使った部分も、同じように書いておくと一貫性が出る

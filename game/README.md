# 誰が話しているの？（プロトタイプ）

## 遊び方

`index.html` をブラウザで開くだけで動きます（サーバー不要）。

- クリック／Space／Enter：セリフを進める
- ◀ ▶（または ← →キー）：部屋を見回す
- 右上：日本語／FR／EN の切り替え、手帳

## セリフを直すとき

セリフの元データは、リポジトリ直下の [script.md](../script.md) です。直したら、次のコマンドで `js/script-data.js` を作り直します。

```
node game/tools/build-script.js
```

`js/script-data.js` は自動生成されるファイルなので、直接は編集しません。

## ファイル構成

| ファイル | 中身 |
|---|---|
| `js/data.js` | 部屋の配置（当たり判定の位置、ゲージの量）、人物、生体データ、固定の文言、しきい値 |
| `js/engine.js` | 画面の描画、選択肢・長押し・タイマー、探索、ゲージ、手帳、MUSEのバックグラウンド処理 |
| `js/cards.js` | 大事な場面で出すイラスト（デバイス、事前リサーチ、プロトタイプ3種、マグカップ、休憩室のドア、最後の提案） |
| `js/audio.js` | BGMと効果音（ブラウザ内で生成） |
| `js/main.js` | 物語の流れ、キーパーソンとの会話、エンディングの分岐 |
| `css/style.css` | 見た目 |

## テスト用のURLパラメータ

- `?debug`：画面上部に内部の数値（ゲージ、人間ポイント、伏線）を表示する
- `?debug&phase=3&human=6&choices=7&clues=1,2`：PHASE 3から、指定した状態で始める

## 素材の差し替え

- **背景**：`game/assets/BG-*.jpeg`。`data.js` の各部屋の `img` で指定している。当たり判定の `rect` は背景画像に対する %
- **人物**：白背景の立ち絵を `game/assets/` に置き、次のコマンドで背景を透明にする。結果は `game/assets/chars/` に出るので、`data.js` の `CHAR_IMAGES` に追加する。画像のない人物は仮の図形で表示される

```
python game/tools/cutout.py game/assets/CH-josiane-normal.png
```

- **イラスト**：`cards.js` の `CARD_IMAGES` に `mug: 'assets/cards/mug.png'` のように書くと、仮のSVGの代わりに画像が出る
- **BGM**：`data.js` の `BGM_FILES` に `office: 'assets/bgm/office.mp3'` のように書くと、生成した音の代わりにその曲が流れる。場面の名前は `intro` `office` `day` `night` `turn` `tense` `calm` `cold`

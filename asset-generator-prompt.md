# Google AI Studio 用：素材生成ツールを作らせるプロンプト

使い方：Google AI Studio の **Build**（アプリを作る機能）を開き、下のコードブロックを丸ごと貼る。

できあがるツールでやること：

1. 「スタイル参照」に、作った背景画像を2〜3枚アップロードする（例：BG-P1-front、BG-P2-front、BG-P3-front）
2. 人物は、まず各キャラクターの「通常」を生成して、気に入ったものを採用する → そのあと表情違いを生成する
3. 採用した画像を、IDをファイル名にしたPNGでまとめてダウンロードする
4. 「生成ログ」を書き出して、補足資料（AIの使用箇所）に使う

---

```
Build a single-page web app called "QUI PARLE ? — Asset Studio".
It is a tool for generating 2D game assets (characters and concept illustrations) with the Gemini image generation API, for a narrative point-and-click game about a designer in 2030 who works with an AI agent called MUSE inside a hospital.
The UI language must be Japanese.

## Model
- Use the Gemini API image generation model available in AI Studio (for example "gemini-2.5-flash-image"; if a newer image model is available, use it). Put the model name in a settings field so it can be changed.
- Every request must be able to include reference images as inline image parts together with the text prompt.

## Core features

1. Style reference
   - A panel where I can upload 1–3 background images from the game.
   - These images are attached to EVERY generation request as style references, with this instruction prepended:
     "Match the art style of the attached reference images exactly: same line thickness, same flat color fills, same cel shading, same color saturation. Do NOT copy the rooms or objects in them."

2. Asset list
   - Preload the asset list below (editable as JSON in a settings tab, and I can add/remove rows).
   - Each asset has: id, category (character / item), label (Japanese), prompt, aspect ratio, transparent (true/false), baseOf (optional: the id of the base image this asset must stay consistent with).
   - Show the list grouped by category, with a status badge: not generated / generated / approved.

3. Generation
   - "Generate" button per asset, and "Generate all not-yet-approved" button for batch generation.
   - Generate 2 candidates per click and show them side by side. I click one to approve it.
   - For assets with "baseOf": the approved image of the base asset is attached as an extra reference with this instruction:
     "This is the SAME character as in the attached base image: same face, same hairstyle, same body shape, same clothes and colors, same outline style. Change ONLY what is described below."
     If the base is not approved yet, disable the button and show "先に〇〇を採用してください".
   - Run requests in a queue (max 2 at a time). If the API returns a quota / rate-limit error, stop the queue and show a clear Japanese message ("無料枠の上限に達しました。時間をおいて再開してください") instead of failing silently.
   - "Edit" button on an approved image: I type an extra instruction (e.g. "make the hair shorter") and it regenerates using the current image as the base.

4. Transparent background (for characters)
   - For assets with transparent = true, append to the prompt: "Plain solid pure green background (#00FF00), no shadow on the background, no floor, the whole body fully visible with margin around it."
   - After generation, remove the green background in the browser with a canvas chroma key: tolerance slider, edge softening, and green-spill removal on the outline.
   - Preview the result on a checkerboard AND on top of one of the uploaded style reference backgrounds, so I can check how the character looks in the game scene.

5. Export
   - Download a single approved image as PNG named "{id}.png".
   - "Download all approved" as a ZIP (use JSZip), with folders "characters/" and "items/".
   - "Export generation log" as JSON and CSV: for every approved image, the id, prompt actually sent, model name, number of reference images, and date-time. (I need this log to document where AI was used in my school project.)

6. Persistence
   - Save uploaded references, generated candidates, approvals and the asset list in IndexedDB so nothing is lost when I reload the page.
   - A "reset" button with a confirmation dialog.

## Shared style text
Append this to every character prompt:
"Simple cute Japanese free clip-art style (similar to Irasutoya), flat colors, crisp dark-gray outlines, simple cel shading, round friendly face with simple dot eyes, full body standing pose, front view, no text."

Append this to every item prompt:
"Flat vector illustration, warm clearly saturated colors, solid flat color fills, crisp dark-gray outlines, simple cel shading, no haze, no glow, any visible text must be short correctly spelled English words only."

## Preloaded asset list

### Characters (aspect ratio 3:4, transparent = true)

| id | label | baseOf | prompt |
|---|---|---|---|
| CH-helene-normal | Hélène 通常 | – | Hélène, director of a design studio, a stylish woman in her 50s, short silver bob haircut, round glasses, navy blazer over a white shirt, holding a coffee cup, calm confident expression. |
| CH-helene-smile | Hélène 笑顔 | CH-helene-normal | Same character, warm satisfied smile. |
| CH-helene-serious | Hélène 真剣 | CH-helene-normal | Same character, serious businesslike expression, one hand on her hip. |
| CH-marc-normal | Marc 通常 | – | Marc, head of strategy of a hospital, a man in his 40s, neat short brown hair, gray suit with a blue tie, holding a tablet, polite but tired expression. |
| CH-marc-pleased | Marc 満足 | CH-marc-normal | Same character, pleased smile, nodding. |
| CH-marc-frown | Marc 眉をひそめる | CH-marc-normal | Same character, frowning, doubtful look. |
| CH-nadia-normal | Nadia 通常 | – | Nadia, head nurse, a woman in her 40s, dark hair tied back in a low bun, navy blue nurse scrubs with a name badge, serious and slightly tired eyes, arms by her sides. |
| CH-nadia-troubled | Nadia 困り顔 | CH-nadia-normal | Same character, troubled expression, eyes looking down, hand on her arm. |
| CH-nadia-soft | Nadia 柔らかい表情 | CH-nadia-normal | Same character, small gentle relieved smile. |
| CH-josiane-normal | Josiane 通常 | – | Josiane, veteran nurse with 25 years of experience, a sturdy woman in her late 50s, curly gray hair, light green nurse scrubs with a beige cardigan, arms crossed, grumpy expression. |
| CH-josiane-blush | Josiane 照れ | CH-josiane-normal | Same character, holding a coffee mug, embarrassed, slight blush, looking away. |
| CH-josiane-smile | Josiane 笑顔 | CH-josiane-normal | Same character, big honest laugh. |
| CH-camille-normal | Camille 通常 | – | Camille, a young nurse in her early 20s, short brown ponytail, light blue nurse scrubs, holding a tablet against her chest, tired eyes, polite nervous smile. |
| CH-camille-tired | Camille 疲れ | CH-camille-normal | Same character, exhausted, shoulders down, dark circles under the eyes. |
| CH-camille-relieved | Camille ほっとする | CH-camille-normal | Same character, relieved soft smile, hand on her chest. |
| CH-staff-running | 若手スタッフ（走る） | – | A young male nurse in light blue scrubs running in a hurry, side view, holding a clipboard. |
| CH-staff-iv | 点滴を準備する看護師 | – | A female nurse in light blue scrubs preparing an IV drip bag with both hands, focused and tired, three-quarter view. |

### Items (aspect ratio 4:3, transparent = false)

| id | label | baseOf | prompt |
|---|---|---|---|
| IT-muse-device | MUSE の外観 | – | Product illustration of "MUSE", a wearable design AI agent: a pair of sleek smart glasses with a tiny light-blue light on the frame, a small wireless earpiece, and a thin ring with a light-blue sensor dot, arranged neatly on a plain light-gray surface, soft studio light, small label "MUSE". |
| IT-relais | ソリューション1 Relais | – | Concept illustration of "RELAIS", a cross-department chat app for hospital staff: a smartphone and a tablet showing a group chat with many notification badges, most messages coming from the "ADMIN" account, a nurse in the background looking at it with a confused face. Title text "RELAIS". |
| IT-voix | ソリューション2 Voix | – | Concept illustration of "VOIX", a voice handover app: a night-shift nurse speaking a short voice memo into a smartphone, a sound waveform on the screen and the speech turning into neat text lines, the next-shift nurse listening with a smile. Title text "VOIX". |
| IT-mediateur | ソリューション3 Médiateur | – | Concept illustration of "MEDIATEUR", an AI that mediates every message between staff: on the left a red angry speech bubble with jagged edges, in the middle a glowing light-blue AI icon labeled "MUSE" filtering it, on the right the same message turned into a soft round light-blue speech bubble; two nurses on each side not looking at each other. Slightly cold, unsettling mood. Title text "MEDIATEUR". |

## UI layout
- Left: style reference panel and the asset list.
- Center: candidates of the selected asset, large preview, approve / regenerate / edit buttons, and the exact prompt that will be sent (editable before generating).
- Right: transparency preview (checkerboard / on background) and export buttons.
- Show the API key status clearly; never print the key in the UI or the log.
```

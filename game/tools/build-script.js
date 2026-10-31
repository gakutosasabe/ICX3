// script.md を解析して js/script-data.js を生成する
// 使い方：node game/tools/build-script.js
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', '..', 'script.md');
const OUT = path.join(__dirname, '..', 'js', 'script-data.js');

// 「- 描写 JA：」のような補助キー → データのサブキー
const SUB = { '描写': 'desc', 'AI': 'ai', '主人公': 'me' };
const SUB_SPEAKER = { desc: 'narr', ai: 'ai', me: 'me' };

function speakerOf(raw) {
  const s = raw.trim();
  if (!s || s.startsWith('（') || s.startsWith('(')) return 'sys';
  const base = s.replace(/[（(].*$/, '').trim();
  const note = (s.match(/[（(](.*)[）)]/) || [])[1] || '';
  if (base === '主人公') return note.includes('AIのフォント') ? 'me-ai' : 'me';
  if (base === '描写') return 'narr';
  if (base === 'AI') return 'ai';
  if (base === 'SYS' || base.startsWith('選択肢')) return 'sys';
  if (base.startsWith('伏線')) return 'note';
  // 人物名（Hélène → helene のようにアクセントを落としてキーにする）
  if (/^\p{Lu}\p{Ll}+$/u.test(base)) return base.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
  return 'obj';
}

const lines = fs.readFileSync(SRC, 'utf8').split(/\r?\n/);
const data = {};
const ui = {};
let cur = null;

for (const line of lines) {
  const row = line.match(/^\|\s*(ui\.\w+)\s*\|\s*(.*?)\s*\|\s*(.*?)\s*\|\s*(.*?)\s*\|\s*$/);
  if (row) {
    ui[row[1]] = { ja: row[2], fr: row[3], en: row[4] };
    continue;
  }

  const head = line.match(/^\*\*(.+?)\*\*\s*(.*)$/);
  if (head) {
    const id = (head[1].match(/([A-Z][A-Za-z0-9]*(?:-[A-Za-z0-9]+)+)\s*$/) || [])[1];
    cur = id ? { id, sp: speakerOf(head[2]) } : null;
    continue;
  }

  if (line.startsWith('#') || line.startsWith('---')) {
    cur = null;
    continue;
  }

  const text = line.match(/^- (?:(描写|AI|主人公) )?(JA|FR|EN)：(.*)$/);
  if (!text || !cur) continue;

  const sub = text[1] ? SUB[text[1]] : null;
  const key = sub ? `${cur.id}:${sub}` : cur.id;
  const lang = text[2].toLowerCase();
  let body = text[3].trim();
  const mono = /^\*.*\*$/.test(body);
  if (mono) body = body.slice(1, -1);

  data[key] = data[key] || { sp: sub ? SUB_SPEAKER[sub] : cur.sp };
  data[key][lang] = body;
  if (mono) data[key].mono = true;
}

const out = `// 自動生成ファイル：直接編集しないこと。script.md を直して node game/tools/build-script.js を実行する
window.SCRIPT = ${JSON.stringify(data, null, 1)};
window.UI_STRINGS = ${JSON.stringify(ui, null, 1)};
`;
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, out);
console.log(`${Object.keys(data).length} lines, ${Object.keys(ui).length} ui strings → ${path.relative(process.cwd(), OUT)}`);

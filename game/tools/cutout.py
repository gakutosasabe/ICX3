# 人物画像の白い背景を透明にする
# 使い方：python game/tools/cutout.py game/assets/chars/*.jpeg
# 出力：game/assets/chars/ に同じ名前のPNG（透明背景）
# 画像の外周からつながっている白だけを消すので、服や靴の白は残る
import sys
from collections import deque
from pathlib import Path

from PIL import Image, ImageFilter

WHITE = 232  # この値以上のRGBを「背景の白」とみなす

# 外周とつながっていない背景（腕と体のすき間など）。元画像での座標を1点指定すると、そこから続く白を消す
# 白いシャツなどは背景と同じ明るさなので、自動では区別できない。消したいすき間だけをここに書く
HOLES = {
    'CH-helene-normal': [(774, 378)],
    'CH-helene-smile': [(774, 378)],
    'CH-helene-serious': [(786, 382)],
    'CH-josiane-smile': [(602, 376), (805, 376)],
    'CH-staff-iv': [(558, 300)],
}


def is_bg(px):
    r, g, b = px[:3]
    return r >= WHITE and g >= WHITE and b >= WHITE


def cutout(src: Path, dst: Path):
    img = Image.open(src).convert('RGBA')
    w, h = img.size
    px = img.load()
    seen = bytearray(w * h)
    q = deque()
    for x in range(w):
        q.append((x, 0))
        q.append((x, h - 1))
    for y in range(h):
        q.append((0, y))
        q.append((w - 1, y))
    q.extend(HOLES.get(src.stem, []))

    mask = Image.new('L', (w, h), 255)
    m = mask.load()
    while q:
        x, y = q.popleft()
        i = y * w + x
        if seen[i]:
            continue
        seen[i] = 1
        if not is_bg(px[x, y]):
            continue
        m[x, y] = 0
        if x > 0: q.append((x - 1, y))
        if x < w - 1: q.append((x + 1, y))
        if y > 0: q.append((x, y - 1))
        if y < h - 1: q.append((x, y + 1))

    # 輪郭を少しだけなじませる
    mask = mask.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.8))
    img.putalpha(mask)
    # 余白を切り詰める
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
    dst.parent.mkdir(parents=True, exist_ok=True)
    img.save(dst)
    print(f'{src.name} -> {dst} {img.size}')


if __name__ == '__main__':
    for arg in sys.argv[1:]:
        src = Path(arg)
        # chars フォルダの中の画像は同じ場所に、それ以外は chars フォルダに PNG で出す
        out_dir = src.parent if src.parent.name == 'chars' else src.parent / 'chars'
        cutout(src, out_dir / (src.stem + '.png'))

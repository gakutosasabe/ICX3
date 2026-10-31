# 人物画像の白い背景を透明にする
# 使い方：python game/tools/cutout.py game/assets/CH-nadia-normal.png ...
# 出力：game/assets/chars/ に同じ名前のPNG
# 画像の外周からつながっている白だけを消すので、服や靴の白は残る
import sys
from collections import deque
from pathlib import Path

from PIL import Image, ImageFilter

WHITE = 232  # この値以上のRGBを「背景の白」とみなす


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
        cutout(src, src.parent / 'chars' / (src.stem + '.png'))

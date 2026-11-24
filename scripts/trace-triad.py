"""
Trace the three teardrop shapes from reference/hero/triad-reference.jpg into SVG
path data (scripts/triad-paths.json), so the hero triad matches the approved
reference outline exactly. Pure numpy + Pillow (no OpenCV).

Method per colour: mask -> fill holes (the white disc) -> keep the largest blob ->
trace the outer boundary (Moore neighbourhood) -> resample evenly -> smooth ->
Catmull-Rom to cubic Beziers. Coordinates are scaled to the 540x504 hero canvas.
"""
import json
import sys
from collections import deque

import numpy as np
from PIL import Image, ImageFilter

SRC = 'reference/hero/triad-reference.jpg'
OUT = 'scripts/triad-paths.json'
W, H = 540, 504

im = Image.open(SRC).convert('RGB').filter(ImageFilter.GaussianBlur(1.2))
a = np.asarray(im).astype(int)
R, G, B = a[..., 0], a[..., 1], a[..., 2]
HH, WW = R.shape

masks = {
    'top': (R > 190) & (G > 100) & (G < 200) & (B < 110),       # orange
    'left': (B > 100) & (R < 90) & (B - R > 70),                # blue
    'right': (R > 160) & (G < 110) & (B > 70) & (R - G > 90),   # pink
}


def largest_blob(m):
    lab = np.zeros(m.shape, int)
    best, best_n, cur = 0, 0, 0
    for y, x in zip(*np.nonzero(m)):
        if lab[y, x]:
            continue
        cur += 1
        q = deque([(y, x)])
        lab[y, x] = cur
        n = 0
        while q:
            cy, cx = q.popleft()
            n += 1
            for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                ny, nx = cy + dy, cx + dx
                if 0 <= ny < HH and 0 <= nx < WW and m[ny, nx] and not lab[ny, nx]:
                    lab[ny, nx] = cur
                    q.append((ny, nx))
        if n > best_n:
            best, best_n = cur, n
    return lab == best


def fill_holes(m):
    """Fill enclosed background (the white disc inside each drop)."""
    outside = np.zeros(m.shape, bool)
    q = deque()
    for y in range(HH):
        for x in (0, WW - 1):
            if not m[y, x] and not outside[y, x]:
                outside[y, x] = True
                q.append((y, x))
    for x in range(WW):
        for y in (0, HH - 1):
            if not m[y, x] and not outside[y, x]:
                outside[y, x] = True
                q.append((y, x))
    while q:
        cy, cx = q.popleft()
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            ny, nx = cy + dy, cx + dx
            if 0 <= ny < HH and 0 <= nx < WW and not m[ny, nx] and not outside[ny, nx]:
                outside[ny, nx] = True
                q.append((ny, nx))
    return ~outside


def trace(m):
    """Moore-neighbour boundary trace; returns (x, y) points clockwise."""
    ys, xs = np.nonzero(m)
    i = np.lexsort((xs, ys))[0]
    start = (int(ys[i]), int(xs[i]))
    dirs = [(-1, 0), (-1, 1), (0, 1), (1, 1), (1, 0), (1, -1), (0, -1), (-1, -1)]
    pts = [start]
    cur, back = start, 6  # came from the west
    for _ in range(200000):
        found = False
        for k in range(8):
            d = (back + 1 + k) % 8
            ny, nx = cur[0] + dirs[d][0], cur[1] + dirs[d][1]
            if 0 <= ny < HH and 0 <= nx < WW and m[ny, nx]:
                back = (d + 4) % 8
                cur = (ny, nx)
                found = True
                break
        if not found or cur == start:
            break
        pts.append(cur)
    return np.array([(x, y) for y, x in pts], float)


def resample(p, n):
    seg = np.sqrt(((np.roll(p, -1, 0) - p) ** 2).sum(1))
    t = np.concatenate([[0], np.cumsum(seg)])
    total = t[-1]
    pc = np.vstack([p, p[:1]])
    s = np.linspace(0, total, n, endpoint=False)
    return np.stack([np.interp(s, t, pc[:, 0]), np.interp(s, t, pc[:, 1])], 1)


def smooth(p, k=3, passes=2):
    for _ in range(passes):
        acc = np.zeros_like(p)
        for o in range(-k, k + 1):
            acc += np.roll(p, o, 0)
        p = acc / (2 * k + 1)
    return p


def to_path(p):
    n = len(p)
    f = lambda v: f'{v:.1f}'
    d = [f'M{f(p[0][0])} {f(p[0][1])}']
    for i in range(n):
        p0, p1, p2, p3 = p[i - 1], p[i], p[(i + 1) % n], p[(i + 2) % n]
        c1 = p1 + (p2 - p0) / 6
        c2 = p2 - (p3 - p1) / 6
        d.append(f'C{f(c1[0])} {f(c1[1])} {f(c2[0])} {f(c2[1])} {f(p2[0])} {f(p2[1])}')
    return ' '.join(d) + 'Z'


out = {'viewBox': [W, H], 'paths': {}, 'discs': {}}
# Fit the reference's content box (x 53..452, y 54..426) onto the hero canvas,
# keeping the aspect ratio and centring it.
x0, x1, y0, y1 = 53, 452, 54, 426
scale = min((W - 8) / (x1 - x0), (H - 8) / (y1 - y0))
ox = (W - (x1 - x0) * scale) / 2 - x0 * scale
oy = (H - (y1 - y0) * scale) / 2 - y0 * scale
for name, m in masks.items():
    blob = largest_blob(fill_holes(largest_blob(m)))
    p = smooth(resample(trace(blob), 140), k=2, passes=2)
    p = p * scale + np.array([ox, oy])
    out['paths'][name] = to_path(p)
    print(name, 'points', len(p), file=sys.stderr)

# White discs measured from the reference (centre, radius), mapped to the canvas.
for name, (cx, cy, r) in {
    'top': (252.7, 149.7, 66.8),
    'left': (148.1, 330.9, 67.3),
    'right': (357.1, 330.8, 67.7),
}.items():
    out['discs'][name] = [round(cx * scale + ox, 2), round(cy * scale + oy, 2), round(r * scale, 2)]

out['transform'] = {'scale': scale, 'ox': ox, 'oy': oy}
json.dump(out, open(OUT, 'w'), indent=1)
print('wrote', OUT, json.dumps(out['discs']), file=sys.stderr)

"""Render the site's pencil cursor.

Drawn flat and horizontal, then rotated: gradients, rounded caps and the
white keyline are all trivial on an axis-aligned shape and miserable to
compute inside a rotated polygon.
"""
from PIL import Image, ImageDraw, ImageFilter

# --- flat geometry -----------------------------------------------------
W, H = 1760, 620
CY = H // 2
HB = 118                      # barrel half-height

X_GRAPHITE = 132              # tip .. exposed lead
X_SHOULDER = 366              # lead .. full barrel width (the sharpened cone)
X_BARREL   = 1360
X_FERRULE  = 1500
X_ERASER   = 1660

def grad(stops):
    """A full-canvas vertical gradient spanning the barrel's height."""
    g = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(g)
    y0, y1 = CY - HB, CY + HB
    for y in range(y0 - 60, y1 + 61):
        t = (y - y0) / (y1 - y0)
        t = min(1.0, max(0.0, t))
        for i in range(len(stops) - 1):
            p0, c0 = stops[i]
            p1, c1 = stops[i + 1]
            if p0 <= t <= p1:
                f = 0 if p1 == p0 else (t - p0) / (p1 - p0)
                col = tuple(round(c0[j] + (c1[j] - c0[j]) * f) for j in range(3))
                d.line([(0, y), (W, y)], fill=col + (255,))
                break
    return g

def hexval(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))

def stops(*pairs):
    return [(p, hexval(c)) for p, c in pairs]

BARREL = grad(stops(
    (0.00, "#8f3400"), (0.07, "#c14a02"), (0.20, "#ff7a2b"),
    (0.30, "#ffc9a3"), (0.38, "#ff8438"), (0.55, "#ff5e00"),
    (0.78, "#e04f00"), (0.92, "#a63c00"), (1.00, "#7d2d00"),
))
WOOD = grad(stops(
    (0.00, "#8a6438"), (0.10, "#c79a63"), (0.26, "#f0d5ad"),
    (0.36, "#fff0d8"), (0.48, "#e9c894"), (0.70, "#cda36a"),
    (1.00, "#96703f"),
))
LEAD = grad(stops(
    (0.00, "#0d1220"), (0.24, "#3a4459"), (0.34, "#7b879b"),
    (0.46, "#2c3547"), (1.00, "#0a0e18"),
))
FERRULE = grad(stops(
    (0.00, "#5e6675"), (0.12, "#98a1b0"), (0.26, "#f2f5f9"),
    (0.36, "#c9d0da"), (0.52, "#8d96a4"), (0.74, "#aeb6c2"),
    (1.00, "#5a626f"),
))
ERASER = grad(stops(
    (0.00, "#b8455a"), (0.14, "#e8697c"), (0.28, "#ffb7c0"),
    (0.40, "#f5808e"), (0.62, "#e45f70"), (1.00, "#a63c4e"),
))

def mask(draw_fn):
    m = Image.new("L", (W, H), 0)
    draw_fn(ImageDraw.Draw(m))
    return m

# The sharpened cone, split into bare lead and the wood around it.
cone = mask(lambda d: d.polygon(
    [(0, CY), (X_SHOULDER, CY - HB), (X_SHOULDER, CY + HB)], fill=255))
lead = mask(lambda d: d.polygon(
    [(0, CY), (X_GRAPHITE, CY - 44), (X_GRAPHITE, CY + 44)], fill=255))
wood = Image.composite(Image.new("L", (W, H), 0), cone, lead)
barrel = mask(lambda d: d.rectangle([X_SHOULDER, CY - HB, X_BARREL, CY + HB], fill=255))
ferrule = mask(lambda d: d.rectangle([X_BARREL, CY - HB, X_FERRULE, CY + HB], fill=255))
eraser = mask(lambda d: d.rounded_rectangle(
    [X_FERRULE - 40, CY - HB, X_ERASER, CY + HB], radius=HB - 8, fill=255))

flat = Image.new("RGBA", (W, H), (0, 0, 0, 0))
for src, m in ((ERASER, eraser), (FERRULE, ferrule), (BARREL, barrel),
               (WOOD, wood), (LEAD, lead)):
    flat.paste(src, (0, 0), m)

dr = ImageDraw.Draw(flat, "RGBA")
# Hex facets: two crisp seams are what separate a hexagonal pencil from a tube.
for y, col in ((CY - HB * 0.36, (255, 255, 255, 46)), (CY + HB * 0.30, (120, 40, 0, 60))):
    dr.rectangle([X_SHOULDER, y, X_BARREL, y + 5], fill=col)
# Ferrule crimps.
for x in (X_BARREL + 34, X_BARREL + 74):
    dr.rectangle([x, CY - HB, x + 13, CY + HB], fill=(70, 78, 90, 95))
# Seams either side of the metal, and where paint meets bare wood.
dr.rectangle([X_BARREL - 6, CY - HB, X_BARREL + 2, CY + HB], fill=(90, 32, 0, 110))
dr.rectangle([X_SHOULDER - 6, CY - HB, X_SHOULDER + 2, CY + HB], fill=(120, 80, 40, 90))
# A wet highlight down the lead.
dr.polygon([(14, CY - 4), (X_GRAPHITE - 20, CY - 26), (X_GRAPHITE - 20, CY - 12), (14, CY + 2)],
           fill=(190, 200, 215, 90))

def build(size, press=False):
    ss = 8
    box = size * ss
    art = flat.copy()
    if press:
        # Hover: the lead lights up. A trailing mark would read better still,
        # but the hotspot pins the point 3px from the canvas edge, so anything
        # behind the tip is clipped away — the nib is the one place a state
        # change survives at 32px.
        d = ImageDraw.Draw(art, "RGBA")
        # Radii are in flat units, where one finished pixel is worth about
        # fifty: sized by eye on this canvas the nib downsampled to a speck.
        # Sat on the very point, the nib overhung the canvas edge and
        # downsampled to a clipped wedge; nudged up the lead it stays whole.
        for r, col in ((146, (255, 255, 255, 235)), (112, (255, 94, 0, 255)), (46, (255, 214, 184, 255))):
            d.ellipse([74 - r, CY - r, 74 + r, CY + r], fill=col)

    # White keyline, so the cursor survives both the navy hero video and a
    # white section. Dilating the alpha is the only way to trace a silhouette
    # this irregular.
    a = art.split()[3]
    ring = a.filter(ImageFilter.MaxFilter(27)).filter(ImageFilter.GaussianBlur(2))
    key = Image.new("RGBA", (W, H), (255, 255, 255, 0))
    key.putalpha(ring.point(lambda v: min(255, int(v * 1.25))))

    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    shadow.putalpha(ring.filter(ImageFilter.GaussianBlur(20)).point(lambda v: int(v * 0.42)))

    plate = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    plate.alpha_composite(shadow, (14, 20))
    plate.alpha_composite(key)
    plate.alpha_composite(art)

    # A marker at the graphite point, rotated with everything else, is how the
    # hotspot survives the transform.
    mark = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(mark).ellipse([-3, CY - 3, 3, CY + 3], fill=(255, 0, 255, 255))

    # A steeper pencil on hover: the shape changes, not just its colour, so
    # the state is legible at 32px and for anyone who cannot rely on hue.
    ang = 46 if press else 38
    rot = plate.rotate(ang, resample=Image.BICUBIC, expand=True)
    rmark = mark.rotate(ang, resample=Image.BICUBIC, expand=True)

    bb = rot.split()[3].point(lambda v: 255 if v > 6 else 0).getbbox()
    rot = rot.crop(bb)
    mb = rmark.split()[3].getbbox()
    tip = ((mb[0] + mb[2]) / 2 - bb[0], (mb[1] + mb[3]) / 2 - bb[1])

    # Fit the art to the box, then anchor the point at 3/32, 29/32 — the
    # hotspot. Anywhere else and the click lands a pencil away from the mark.
    target = box * 29 / 32
    sc = target / max(rot.width, rot.height)
    rot = rot.resize((max(1, round(rot.width * sc)), max(1, round(rot.height * sc))), Image.LANCZOS)

    out = Image.new("RGBA", (box, box), (0, 0, 0, 0))
    out.alpha_composite(rot, (round(box * 3 / 32 - tip[0] * sc), round(box * 29 / 32 - tip[1] * sc)))
    return out.resize((size, size), Image.LANCZOS)

for name, press in (("pencil", False), ("pencil-press", True)):
    for size, suffix in ((32, ""), (64, "@2x"), (96, "@3x")):
        build(size, press).save(f"public/cursors/{name}{suffix}.png")
print("done")

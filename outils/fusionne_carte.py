# fusionne les hachures de côte (avec l'encre usée), la carte et les frontières
# en une seule image déjà tournée : public/images/carte.webp.
# à lancer depuis la racine du dépôt : python3 outils/fusionne_carte.py
#
# bruit-usure.png : le bruit du masque d'encre usée de style.css (feTurbulence),
# rendu par le navigateur pour avoir exactement le même. il est en sRGB, on le repasse en linéaire.
import numpy as np
from PIL import Image, ImageDraw

# les frontières des régions, en % de la carte NON tournée (même repère que #regions)
FRONTIERES = [
    "42.7,112.5 42.7,100.9 44.4,92.4 48.3,83.6 52.3,75.5 54.3,67.1 55.1,59.6",
    "55.1,59.6 60,57.8 66.6,53.8 77.1,51.1 117.8,51.1",
    "55.1,59.6 39.6,55.1 40.4,40",
    "40.4,40 25.2,40 -0.5,38.2 -13.6,38.2",
    "40.4,40 40.8,34.6 39,29 42.2,24.5 52.1,12.8 53.4,6.5 53.4,-11.5",
]
K = 2  # résolution x2 pour garder la netteté au zoom
# écran de référence 1600x900 : carte à 1080px css de large pour 1303px d'image
css = 1303 / 1080 * K           # px image par px css
carte = Image.open('public/images/map.png').convert('RGBA')
cotes = Image.open('outils/cotes.png').convert('LA')
W, H = cotes.size[0] * K, cotes.size[1] * K          # repère non tourné (portrait)
carte = carte.resize((carte.size[0] * K, carte.size[1] * K), Image.LANCZOS)
cotes = cotes.resize((W, H), Image.LANCZOS)

# masque d'usure : tuile de 260px css, l'élément #cotes fait 1.26876 x largeur de boîte
g = np.asarray(Image.open('outils/bruit-usure.png'), dtype=np.float64) / 255
lin = np.where(g <= 0.04045, g / 12.92, ((g + 0.055) / 1.055) ** 2.4)   # retour en linéaire
tuile_px = round(260 * W / (1.26876 * 1080 * 893 / 1303))
tuile = Image.fromarray((lin * 255).astype(np.uint8)).resize((tuile_px, tuile_px), Image.BICUBIC)
masque = Image.new('L', (W, H))
for x in range(0, W, tuile_px):
    for y in range(0, H, tuile_px):
        masque.paste(tuile, (x, y))
L, A = cotes.split()
A = Image.fromarray((np.asarray(A, np.float64) * np.asarray(masque, np.float64) / 255).astype(np.uint8))
fond = Image.merge('RGBA', (L, L, L, A))

m = 120 * K
fond.alpha_composite(carte, (m, m))

# frontières : pointillés de 2px css (7 plein, 6 vide), coupés à la côte comme le masque CSS
lignes = FRONTIERES
cw, ch = carte.size
trait = Image.new('L', (cw, ch))
d = ImageDraw.Draw(trait)
ep, plein, vide = 2 * css, 7 * css, 6 * css
for pts in lignes:
    p = [(float(a) / 100 * cw, float(b) / 100 * ch) for a, b in (q.split(',') for q in pts.split())]
    # tiret k : de k*P à k*P + plein sur la longueur cumulée de la ligne
    P = plein + vide
    s0 = 0.0
    for (x1, y1), (x2, y2) in zip(p, p[1:]):
        n = float(np.hypot(x2 - x1, y2 - y1))
        if n == 0:
            continue
        for k in range(int(s0 // P), int((s0 + n) // P) + 1):
            a = max(k * P, s0) - s0
            b = min(k * P + plein, s0 + n) - s0
            if b <= a:
                continue
            A = (x1 + (x2 - x1) * a / n, y1 + (y2 - y1) * a / n)
            B = (x1 + (x2 - x1) * b / n, y1 + (y2 - y1) * b / n)
            d.line([A, B], fill=255, width=round(ep))
            r = ep / 2
            for cx, cy in (A, B):   # bouts ronds
                d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=255)
        s0 += n
coupe = np.asarray(trait, np.float64) * np.asarray(carte.split()[3], np.float64) / 255
encre = Image.new('RGBA', (cw, ch), (0x3b, 0x2e, 0x1e, 0))
encre.putalpha(Image.fromarray(coupe.astype(np.uint8)))
fond.alpha_composite(encre, (m, m))

# CSS tourne de 90° dans le sens horaire
fond.rotate(-90, expand=True).save('public/images/carte.webp', quality=90)
print(len(lignes), 'frontières', fond.size)

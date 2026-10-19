// lignes de rhumb des portulans : les 16 directions de la rose des vents partent
// du centre de l'écran, caché sous la carte, et trois traits vont aux cartouches
const rhumbs = document.getElementById('rhumbs');

function traceRhumbs() {
    const ecran = tailleEcran();
    const cx = ecran.w / 2;
    const cy = ecran.h / 2;
    const loin = Math.hypot(cx, cy);
    let traits = '';

    for (let i = 0; i < 16; i++) {
        const angle = i * Math.PI / 8;
        // les 8 vents principaux plus marqués que les demi-vents
        const opacite = i % 2 === 0 ? 0.45 : 0.25;
        traits += ligne(cx, cy, cx + Math.cos(angle) * loin, cy + Math.sin(angle) * loin, opacite);
    }
    document.querySelectorAll('.cartouche').forEach(c => {
        const r = c.getBoundingClientRect();
        // le centre du cartouche reste son centre une fois tourné
        const centre = versSite(r.left + r.width / 2, r.top + r.height / 2);
        traits += ligne(cx, cy, centre.x, centre.y, 0.7);
    });
    rhumbs.innerHTML = traits;
}

function ligne(x1, y1, x2, y2, opacite) {
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#000" stroke-width="1.5" opacity="${opacite}"/>`;
}

traceRhumbs();
window.addEventListener('resize', traceRhumbs);

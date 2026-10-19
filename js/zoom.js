// zoom maison sur la carte : molette, Ctrl +/-/0, pincer et glisser au doigt ou à la souris.
// le zoom du navigateur ne change rien à l'affichage (tailles en --u, voir style.css) :
// c'est ici qu'on zoome, et seulement la carte.
// la vue est un translate + scale posé sur #container : carte, régions, lieux et bateaux suivent.

const monde = document.getElementById('monde');
const carte = document.getElementById('container');
const vue = { z: 1, x: 0, y: 0 };
const zoomMax = 4;

function borne(v, min, max) {
    return Math.min(max, Math.max(min, v));
}

function appliqueVue() {
    // la carte ne part pas au large : elle peut glisser d'autant qu'elle a grossi.
    // #carte est tourné de 90° : à l'écran, la largeur de la carte est la hauteur de la boîte
    const w = carte.offsetWidth;
    const h = carte.offsetHeight;
    const mx = (vue.z - 1) * h / 2;
    const my = (vue.z - 1) * w / 2;
    // décalage du centre de la carte par rapport à sa place sans zoom
    const dx = vue.x + (vue.z - 1) * w / 2;
    const dy = vue.y + (vue.z - 1) * h / 2;
    vue.x += borne(dx, -mx, mx) - dx;
    vue.y += borne(dy, -my, my) - dy;
    carte.style.transform = `translate(${vue.x}px, ${vue.y}px) scale(${vue.z})`;
    monde.classList.toggle('zoome', vue.z > 1);
}

// zoome en gardant immobile le point p (repère du site, voir versSite)
function zoomAutour(z, p) {
    z = borne(z, 1, zoomMax);
    const ox = p.x - carte.offsetLeft;
    const oy = p.y - carte.offsetTop;
    vue.x = ox - (ox - vue.x) * z / vue.z;
    vue.y = oy - (oy - vue.y) * z / vue.z;
    vue.z = z;
    appliqueVue();
}

function centreEcran() {
    const ecran = tailleEcran();
    return { x: ecran.w / 2, y: ecran.h / 2 };
}

// molette et pincer du trackpad (que le navigateur envoie comme Ctrl + molette)
window.addEventListener('wheel', (e) => {
    // sur le panneau la molette fait défiler le texte
    if (e.target.closest('#panneau, #loupe'))
        return;
    e.preventDefault();
    // deltaMode 1 : en lignes et pas en pixels (souris sous Firefox)
    const pas = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
    zoomAutour(vue.z * Math.exp(-pas * 0.002), versSite(e.clientX, e.clientY));
}, { passive: false });

document.addEventListener('keydown', (e) => {
    if (!e.ctrlKey && !e.metaKey)
        return;
    // e.code (la touche physique) en plus de e.key : en AZERTY, Ctrl 0 donne e.key "à"
    if (e.key === '+' || e.key === '=' || e.code === 'NumpadAdd')
        zoomAutour(vue.z * 1.25, centreEcran());
    else if (e.key === '-' || e.code === 'NumpadSubtract')
        zoomAutour(vue.z / 1.25, centreEcran());
    else if (e.key === '0' || e.code === 'Digit0' || e.code === 'Numpad0')
        zoomAutour(1, centreEcran());
    else
        return;
    e.preventDefault();
});

// glisser et pincer : un doigt (ou la souris) déplace, deux doigts zooment autour de leur milieu
const doigts = new Map();
let depart = null;   // milieu des doigts au début du geste
let avant = null;    // milieu et écart des doigts au dernier événement
let glisse = false;  // le geste a bougé : ce n'est plus un clic

function geste() {
    const ps = [...doigts.values()];
    const c = {
        x: ps.reduce((s, p) => s + p.x, 0) / ps.length,
        y: ps.reduce((s, p) => s + p.y, 0) / ps.length,
    };
    const ecart = ps.length > 1 ? Math.hypot(ps[0].x - ps[1].x, ps[0].y - ps[1].y) : 0;
    return { c, ecart };
}

monde.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0)
        return;
    if (doigts.size === 0)
        glisse = false;
    doigts.set(e.pointerId, versSite(e.clientX, e.clientY));
    avant = geste();
    depart = avant.c;
});

monde.addEventListener('pointermove', (e) => {
    if (!doigts.has(e.pointerId))
        return;
    doigts.set(e.pointerId, versSite(e.clientX, e.clientY));
    const g = geste();

    if (!glisse) {
        // quelques pixels de tremblement restent un clic sur un lieu
        if (doigts.size < 2 && Math.hypot(g.c.x - depart.x, g.c.y - depart.y) < 6)
            return;
        glisse = true;
    }
    // capturé seulement maintenant : capturer dès l'appui volerait le clic aux lieux
    monde.setPointerCapture(e.pointerId);

    if (doigts.size > 1 && avant.ecart > 0)
        zoomAutour(vue.z * g.ecart / avant.ecart, g.c);
    vue.x += g.c.x - avant.c.x;
    vue.y += g.c.y - avant.c.y;
    appliqueVue();
    avant = g;
});

function leveDoigt(e) {
    doigts.delete(e.pointerId);
    if (doigts.size > 0)
        avant = geste();
}

monde.addEventListener('pointerup', leveDoigt);
monde.addEventListener('pointercancel', leveDoigt);

// après un glissé, le clic qui suit n'ouvre pas de lieu et ne ferme pas le panneau
monde.addEventListener('click', (e) => {
    if (glisse)
        e.stopPropagation();
}, true);

// Safari iOS ignore user-scalable=no : on lui refuse le pincer de page à la main
document.addEventListener('gesturestart', (e) => e.preventDefault());

window.addEventListener('resize', appliqueVue);

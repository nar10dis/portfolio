// zoom maison sur la carte : Ctrl + molette (et pincer du trackpad), Ctrl +/-/0,
// molette pour se déplacer, glisser à la souris, pincer et glisser au doigt.
// le zoom du navigateur ne change rien à l'affichage (tailles en --u, voir style.css).
//
// seul #vue (l'image de la carte et les régions) est agrandi. les lieux et les bateaux sont
// seulement déplacés, et grossissent moins (--echelle) : c'est ce qui rend le zoom fluide.
// la vue est posée en variables CSS sur #container, que .point et #vue lisent.

const monde = document.getElementById('monde');
const boite = document.getElementById('container');
const vue = { z: 1, x: 0, y: 0 };
const zoomMax = 4;

// tailles lues une fois par redimensionnement : les relire à chaque événement
// forcerait le navigateur à recalculer la mise en page en plein geste
let mesures;

function mesure() {
    const t = boite.offsetHeight;   // --taille-carte
    mesures = {
        gauche: boite.offsetLeft,
        haut: boite.offsetTop,
        w: boite.offsetWidth,
        h: t,
        // l'image de la carte, centrée sur la boîte (voir #carte dans style.css)
        carteW: t * 1543 / 1303,
        carteH: t * 1133 / 1303,
    };
}

function borne(v, min, max) {
    return Math.min(max, Math.max(min, v));
}

// la carte ne part pas au large : son centre peut s'écarter d'autant qu'elle a grossi
function borneVue() {
    const m = mesures;
    const mx = (vue.z - 1) * m.carteW / 2;
    const my = (vue.z - 1) * m.carteH / 2;
    const dx = vue.x + (vue.z - 1) * m.w / 2;
    const dy = vue.y + (vue.z - 1) * m.h / 2;
    vue.x += borne(dx, -mx, mx) - dx;
    vue.y += borne(dy, -my, my) - dy;
}

// une seule écriture par image, même si la molette envoie 100 événements par seconde
let prevu = false;

function planifie() {
    borneVue();
    if (prevu)
        return;
    prevu = true;
    requestAnimationFrame(() => {
        prevu = false;
        boite.style.setProperty('--z', vue.z);
        boite.style.setProperty('--tx', vue.x + 'px');
        boite.style.setProperty('--ty', vue.y + 'px');
        // carte x4 : lieux x1.5
        boite.style.setProperty('--echelle', Math.pow(vue.z, 0.3));
        monde.classList.toggle('zoome', vue.z > 1);
    });
}

// zoome en gardant immobile le point p (repère du site, voir versSite)
function zoomAutour(z, p) {
    z = borne(z, 1, zoomMax);
    const ox = p.x - mesures.gauche;
    const oy = p.y - mesures.haut;
    vue.x = ox - (ox - vue.x) * z / vue.z;
    vue.y = oy - (oy - vue.y) * z / vue.z;
    vue.z = z;
    planifie();
}

function centreEcran() {
    const ecran = tailleEcran();
    return { x: ecran.w / 2, y: ecran.h / 2 };
}

// Ctrl + molette zoome (le pincer du trackpad arrive aussi comme ça), la molette seule déplace :
// sur trackpad, faire défiler à deux doigts ne doit pas zoomer dans tous les sens
window.addEventListener('wheel', (e) => {
    // sur le panneau la molette fait défiler le texte
    if (e.target.closest('#panneau, #loupe'))
        return;
    e.preventDefault();
    // deltaMode 1 : en lignes et pas en pixels (souris sous Firefox)
    const pas = e.deltaMode === 1 ? 16 : 1;
    if (e.ctrlKey) {
        zoomAutour(vue.z * Math.exp(-e.deltaY * pas * 0.002), versSite(e.clientX, e.clientY));
    }
    else {
        vue.x -= e.deltaX * pas;
        vue.y -= e.deltaY * pas;
        planifie();
    }
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
        // capturé seulement maintenant : capturer dès l'appui volerait le clic aux lieux
        doigts.forEach((_, id) => monde.setPointerCapture(id));
    }

    if (doigts.size > 1 && avant.ecart > 0)
        zoomAutour(vue.z * g.ecart / avant.ecart, g.c);
    vue.x += g.c.x - avant.c.x;
    vue.y += g.c.y - avant.c.y;
    planifie();
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

// sinon le navigateur lance son glisser-déposer d'image et interrompt le geste
monde.addEventListener('dragstart', (e) => e.preventDefault());

// Safari iOS ignore user-scalable=no : on lui refuse le pincer de page à la main
document.addEventListener('gesturestart', (e) => e.preventDefault());

window.addEventListener('resize', () => {
    mesure();
    planifie();
});

mesure();

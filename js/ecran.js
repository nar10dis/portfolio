// sur téléphone tenu droit, le CSS couche tout le site d'un quart de tour (voir style.css).
// le navigateur, lui, ne le sait pas : window.innerWidth, getBoundingClientRect et les doigts
// restent dans le repère de l'écran physique. ces fonctions repassent dans le repère du site.

// même condition que la media query de style.css
const couche = window.matchMedia('(orientation: portrait) and (pointer: coarse)');

function estCouche() {
    return couche.matches;
}

// taille de l'écran tel qu'on le lit : body fait toujours cette taille (100 --vw x 100 --vh)
function tailleEcran() {
    return { w: document.body.clientWidth, h: document.body.clientHeight };
}

// point de l'écran physique (clientX/Y, getBoundingClientRect) vers le repère du site.
// le site est tourné de 90° puis décalé de la largeur de l'écran : on fait l'inverse
function versSite(x, y) {
    if (!estCouche())
        return { x, y };
    return { x: y, y: window.innerWidth - x };
}

// couché, le doigt qui monte dans le texte va vers la droite de l'écran physique :
// le navigateur ferait défiler dans le mauvais sens, donc on fait défiler nous-mêmes
function defilementCouche(el) {
    let dernierX = null;

    el.addEventListener('touchstart', (e) => {
        dernierX = estCouche() ? e.touches[0].clientX : null;
    }, { passive: true });

    el.addEventListener('touchmove', (e) => {
        if (dernierX === null)
            return;
        const x = e.touches[0].clientX;
        el.scrollTop += x - dernierX;
        dernierX = x;
        e.preventDefault();
    }, { passive: false });
}

// des bateaux partent d'un bord de l'écran, vont mouiller au large d'une côte,
// puis repartent par où ils sont venus. ils sont dans #points, dans le repère de la carte.

// mouillage en % du calque #points (même repère que les POI), decalage en secondes pour qu'ils ne partent pas ensemble
const bateaux = [
    { icon: "public/symboles/myer-141.png", bord: "gauche", mouillageX: -20, mouillageY: 50, decalage: 0 },
    { icon: "public/symboles/myer-84.png",  bord: "droite", mouillageX: 127, mouillageY: 45, decalage: 9 },
    { icon: "public/symboles/myer-141.png", bord: "bas",    mouillageX: 57,  mouillageY: 78, decalage: 17 },
];
const vitesse = 30;        // px par seconde
const pauseCote = 4;       // secondes au mouillage
const pauseLarge = 6;      // secondes hors de l'écran

bateaux.forEach(b => {
    b.img = document.createElement('img');
    b.img.classList.add('bateau');
    b.img.src = b.icon;
    b.img.alt = '';
    conteneur.appendChild(b.img);
});

// point de départ juste hors de l'écran, en px du calque #points.
// #container est centré dans #monde, qui fait la taille de l'écran : ses offsets donnent où sont les bords,
// puis on défait le zoom (js/zoom.js) pour les avoir dans le repère de la carte
function departBateau(b, lw, lh) {
    const c = document.getElementById('container');
    const marge = b.img.offsetWidth;
    const ecran = tailleEcran();
    const gauche = (-c.offsetLeft - vue.x) / vue.z;
    const droite = (ecran.w - c.offsetLeft - vue.x) / vue.z;
    const bas = (ecran.h - c.offsetTop - vue.y) / vue.z;
    if (b.bord === "gauche")
        return { x: gauche - marge, y: (b.mouillageY / 100 + 0.08) * lh };
    if (b.bord === "droite")
        return { x: droite + marge, y: (b.mouillageY / 100 - 0.08) * lh };
    return { x: (b.mouillageX / 100 - 0.15) * lw, y: bas + marge };
}

function positionBateau(b, temps) {
    const lw = conteneur.offsetWidth;
    const lh = conteneur.offsetHeight;
    const depart = departBateau(b, lw, lh);
    const arriveeX = b.mouillageX / 100 * lw;
    const arriveeY = b.mouillageY / 100 * lh;

    const dist = Math.hypot(arriveeX - depart.x, arriveeY - depart.y);
    const duree = dist / vitesse;
    const cycle = 2 * duree + pauseCote + pauseLarge;
    let t = (temps + b.decalage) % cycle;

    let ax = depart.x, ay = depart.y, bx = arriveeX, by = arriveeY;
    if (t < duree) {
        t = t / duree;
    }
    else if (t < duree + pauseCote) {
        t = 1;
    }
    else if (t < 2 * duree + pauseCote) {
        t = (t - duree - pauseCote) / duree;
        ax = arriveeX; ay = arriveeY; bx = depart.x; by = depart.y;
    }
    else {
        t = 1;
        ax = arriveeX; ay = arriveeY; bx = depart.x; by = depart.y;
    }

    // ralentit au départ et à l'arrivée
    const e = (1 - Math.cos(Math.PI * t)) / 2;
    // écart à la ligne droite : une grande courbe, plus une petite houle.
    // la normale s'inverse au retour, donc l'aller et le retour ne prennent pas le même chemin
    const nx = -(by - ay) / dist;
    const ny = (bx - ax) / dist;
    const ecart = Math.sin(Math.PI * e) * dist * 0.18 + Math.sin(Math.PI * 6 * e) * 6;

    return {
        x: ax + (bx - ax) * e + nx * ecart,
        y: ay + (by - ay) * e + ny * ecart,
        // le dessin regarde à droite : on le retourne quand le trajet va vers la gauche
        sens: bx >= ax ? 1 : -1,
    };
}

function animeBateaux(ms) {
    const temps = ms / 1000;
    bateaux.forEach(b => {
        const p = positionBateau(b, temps);
        const roulis = Math.sin(temps * 1.3 + b.decalage) * 3;
        b.img.style.left = p.x + 'px';
        b.img.style.top = p.y + 'px';
        b.img.style.transform = `translate(-50%, -50%) rotate(${roulis}deg) scaleX(${p.sens})`;
    });
    requestAnimationFrame(animeBateaux);
}

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    bateaux.forEach(b => {
        b.img.style.left = b.mouillageX + '%';
        b.img.style.top = b.mouillageY + '%';
    });
}
else {
    requestAnimationFrame(animeBateaux);
}

// l'intro, à la molette : un bateau descend vers le sud en croisant trois cartouches,
// l'île monte du bas de l'écran, la vue dézoome jusqu'à la carte, puis l'habillage se trace.
// le site ne défile pas (body à la taille de l'écran) : la molette fait avancer un temps t,
// et tout ce qui est à l'écran est calculé à partir de t. on peut donc aussi remonter.

(() => {
    const intro = document.getElementById('intro');

    // sans GSAP (CDN injoignable), pas d'intro : la carte doit rester accessible
    if (!window.gsap) {
        intro.remove();
        document.body.classList.remove('intro');
        return;
    }

    // ---------- réglages ----------
    // t est en « étapes » : PX_PAR_ETAPE de molette font avancer t de 1
    const PX_PAR_ETAPE = 400;
    const ACCOSTE = 6.6;        // le bateau arrive devant la côte
    const DEZOOM = 2;           // puis la vue dézoome
    const TRACE_ETAPES = 4.5;   // puis l'habillage se trace
    const FIN_VOYAGE = ACCOSTE + DEZOOM;
    const FIN = FIN_VOYAGE + TRACE_ETAPES;

    const ZOOM = 3;             // la caméra est serrée sur le bateau pendant toute la traversée
    const VITESSE = 0.3;        // la mer défile de 0.3 hauteur d'écran par étape
    const BATEAU_Y = 0.36;      // hauteur du bateau à l'écran

    const monde = document.getElementById('monde');
    const fond = document.getElementById('fond');
    const bateau = document.getElementById('intro-bateau');
    const indication = document.getElementById('intro-scroll');
    const rhumbs = document.getElementById('rhumbs');
    const habillage = ['#rhumbs', '#entete', '#pied', '#tableau', '#contact'];
    const cartouchesIntro = [
        { el: document.getElementById('intro-1'), t: 2.3 },
        { el: document.getElementById('intro-2'), t: 3.5 },
        { el: document.getElementById('intro-3'), t: 4.7 },
    ];
    const cartouchesCarte = () => [...document.querySelectorAll('.cartouche:not(#intro .cartouche)')];

    const { clamp } = gsap.utils;
    const lisse = (x) => x * x * (3 - 2 * x);

    // ---------- état ----------
    const lecture = { t: 0 };   // où en est l'affichage (rejoint cible en douceur)
    let cible = 0;              // où la molette veut aller
    let posee = false;          // la carte est posée : on ne remonte plus dans le voyage
    let fini = false;
    let trace = null;           // la timeline du tracé, construite quand la carte est posée

    // ---------- le trajet du bateau ----------
    // presque droit, avec de petites corrections de cap tirées au hasard à chaque visite,
    // reliées par une courbe douce (Catmull-Rom). en largeurs d'écran, avant le zoom
    // Catmull-Rom lit deux caps de part et d'autre : il en faut jusqu'au-delà de l'accostage
    const caps = [{ t: -1, x: 0 }, { t: 0, x: 0 }];
    while (caps[caps.length - 2].t < ACCOSTE + 1) {
        const dernier = caps[caps.length - 1];
        caps.push({
            t: dernier.t + gsap.utils.random(1.0, 1.8),
            x: clamp(-0.04, 0.04, dernier.x + gsap.utils.random(-0.035, 0.035)),
        });
    }

    function ecartX(t) {
        let i = 1;
        while (i < caps.length - 3 && caps[i + 1].t < t)
            i++;
        const [a, b, c, d] = caps.slice(i - 1, i + 3);
        const u = clamp(0, 1, (t - b.t) / (c.t - b.t));
        const x = 0.5 * (2 * b.x + (c.x - a.x) * u + (2 * a.x - 5 * b.x + 4 * c.x - d.x) * u * u
                         + (3 * b.x - a.x - 3 * c.x + d.x) * u * u * u);
        // redevient droit avant d'accoster
        return x * (1 - lisse(clamp(0, 1, (t - (ACCOSTE - 1.4)) / 1.4)));
    }

    // ---------- le voyage : tout l'écran pour un t donné ----------
    // la carte est agrandie d'un bloc (transform sur #monde), sans passer par js/zoom.js :
    // rien à remettre en page à chaque image, et posée dans la même image que le bateau
    function rendu(t) {
        const { w: W, h: H } = tailleEcran();
        const v = VITESSE * H;
        const by = BATEAU_Y * H;
        // centre de la carte à l'accostage : sa côte nord juste sous le bateau
        // (la côte est à 0.39 de la hauteur de l'image, qui garde la marge des hachures)
        const eyAccoste = by + mesures.carteH * ZOOM * 0.39 + 0.05 * H - H / 2;

        // pendant le dézoom, ce qui était à l'écran à l'accostage rapetisse avec la carte
        const dezoom = lisse(clamp(0, 1, (t - ACCOSTE) / DEZOOM));
        const z = ZOOM + (1 - ZOOM) * dezoom;
        const ey = eyAccoste * (1 - dezoom);
        const tMer = Math.min(t, ACCOSTE);
        const suitCarte = (x, y) => [W / 2 + (x - W / 2) * z / ZOOM, H / 2 + ey + (y - H / 2 - eyAccoste) * z / ZOOM];
        const opacite = 1 - clamp(0, 1, (dezoom - 0.6) * 3);

        // le bateau : la caméra le suit, il penche un peu dans les virages
        const pente = (ecartX(tMer + 0.01) - ecartX(tMer - 0.01)) / 0.02 * W * ZOOM;
        const [bx, byz] = suitCarte(W / 2 + ecartX(tMer) * W * ZOOM, by);
        gsap.set(bateau, {
            left: bx, top: byz, scale: z, opacity: opacite,
            rotation: -Math.atan2(pente, v) * 180 / Math.PI * 0.3 * (1 - dezoom),
        });

        // les cartouches sont posés sur la mer : ils remontent quand le bateau descend
        cartouchesIntro.forEach(c => {
            gsap.set(c.el, { y: suitCarte(W / 2, by + (c.t - tMer) * v)[1], opacity: opacite });
        });

        fond.style.transformOrigin = `${W / 2}px ${by}px`;
        fond.style.transform = `scale(${z})`;

        // l'île monte au rythme de la mer, puis dézoome en revenant au centre
        const yCarte = t < ACCOSTE ? eyAccoste + (ACCOSTE - t) * v : ey;
        monde.style.transform = `translate(0px, ${yCarte}px) scale(${z})`;

        indication.style.opacity = 1 - clamp(0, 1, t / 0.4);
    }

    // ---------- la carte est posée : on range le voyage, on prépare le tracé ----------
    function pose() {
        posee = true;
        intro.remove();
        fond.style.transform = '';
        fond.style.transformOrigin = '';
        monde.style.transform = '';
        // l'habillage et les lieux restent cachés jusqu'au tracé. presque à 0 plutôt qu'à 0, et
        // sur des calques à part (.pose) : déjà dessinés, les faire apparaître ne coûte rien
        gsap.set(habillage, { opacity: 0.001 });
        gsap.set('#points .point, #points .bateau', { opacity: 0.001 });
        document.body.classList.add('pose');
        document.body.classList.remove('intro');
        monde.style.opacity = '';
        trace = construitTrace();
        attend();
    }

    // ---------- le tracé de l'habillage ----------
    // les lignes des rhumbs s'allongent depuis le centre, chaque cartouche de la carte apparaît
    // quand sa ligne l'atteint, et les lieux arrivent par niveau.
    // les durées sont relatives : la molette parcourt toute la timeline en TRACE_ETAPES
    const DUREE_LIGNES = 3;

    function construitTrace() {
        const { w, h } = tailleEcran();
        const cx = w / 2, cy = h / 2;
        const vitesse = Math.hypot(cx, cy) / DUREE_LIGNES;
        const lignes = [...rhumbs.querySelectorAll('line')];
        const cartouches = cartouchesCarte();   // même ordre que leurs lignes (js/rhumbs.js), après les 16 de la rose
        const tableau = document.getElementById('tableau');
        const arrivee = (distance) => Math.max(0, distance / vitesse - 0.12);
        const centre = (el) => {
            const r = el.getBoundingClientRect();
            return versSite(r.left + r.width / 2, r.top + r.height / 2);
        };

        const tl = gsap.timeline({ paused: true });

        gsap.set(habillage, { opacity: 1 });
        gsap.set([...cartouches, tableau], { opacity: 0 });

        ['.niveau-1', '.niveau-2', '.niveau-3, #points .bateau'].forEach((niveau, i) => {
            tl.to(`#points ${niveau}`, { opacity: 1, duration: 1.4, ease: 'power1.out', stagger: 0.08 }, i * 1.2);
        });

        lignes.forEach((ligne, i) => {
            const longueur = Math.hypot(ligne.x2.baseVal.value - ligne.x1.baseVal.value,
                                        ligne.y2.baseVal.value - ligne.y1.baseVal.value);
            gsap.set(ligne, { strokeDasharray: longueur, strokeDashoffset: longueur });
            const versCartouche = cartouches[i - 16];
            if (!versCartouche) {
                // la rose : toutes ensemble, à peine décalées
                tl.to(ligne, { strokeDashoffset: 0, duration: longueur / vitesse, ease: 'power1.out' },
                    gsap.utils.random(0, 0.12));
                return;
            }
            tl.to(ligne, { strokeDashoffset: 0, duration: longueur / vitesse, ease: 'none' }, 0);
            const c = centre(versCartouche);
            tl.to(versCartouche, { opacity: 1, duration: 0.3 }, arrivee(Math.hypot(c.x - cx, c.y - cy)));
        });

        // le tableau n'a pas de ligne : il apparaît quand la ligne vers la gauche le touche
        const r = tableau.getBoundingClientRect();
        tl.to(tableau, { opacity: 1, duration: 0.3 }, arrivee(cx - versSite(r.right, r.top + r.height / 2).x));

        // un petit temps tout tracé avant la fin
        tl.set({}, {}, Math.max(tl.duration(), DUREE_LIGNES) + 0.4);
        return tl;
    }

    // ---------- tout est tracé : la molette rend la main à la carte ----------
    function termine() {
        fini = true;
        window.removeEventListener('wheel', molette, { capture: true });
        window.removeEventListener('keydown', clavier, true);
        clearTimeout(attenteRelance);
        clearTimeout(attenteFin);
        relance.remove();
        gsap.killTweensOf(lecture);
        trace.progress(1).kill();
        document.body.classList.remove('pose');
        gsap.set(rhumbs.querySelectorAll('line'), { clearProps: 'strokeDasharray,strokeDashoffset' });
        gsap.set([...cartouchesCarte(), ...habillage, '#points .point', '#points .bateau'], { clearProps: 'opacity' });
    }

    // ---------- t → écran ----------
    function joue(t) {
        if (fini)
            return;
        if (!posee) {
            rendu(Math.min(t, FIN_VOYAGE));
            // la toute fin du dézoom ne se voit pas : on n'attend pas de l'atteindre
            if (t >= FIN_VOYAGE - 0.03)
                pose();
        }
        if (posee) {
            trace.progress(clamp(0, 1, (t - FIN_VOYAGE) / TRACE_ETAPES));
            if (t >= FIN - 0.03)
                termine();
        }
    }

    function va(t, duree, ease) {
        gsap.to(lecture, { t, duration: duree, ease, overwrite: true, onUpdate: () => joue(lecture.t) });
    }

    function avance(etapes) {
        attend();
        cible = clamp(posee ? FIN_VOYAGE : 0, FIN, cible + etapes);
        va(cible, 0.9, 'power3.out');
    }

    // ---------- si on s'arrête de scroller ----------
    // « scroll down » revient en bas de l'écran, et pendant le tracé, il se finit tout seul
    const relance = document.createElement('p');
    relance.id = 'intro-relance';
    relance.className = 'scroll-down';
    relance.innerHTML = '<span>scroll down<br>↓</span>';
    document.body.appendChild(relance);
    let attenteRelance, attenteFin;

    function attend() {
        clearTimeout(attenteRelance);
        clearTimeout(attenteFin);
        relance.classList.remove('visible');
        attenteRelance = setTimeout(() => {
            if (lecture.t > 0.4)   // avant, celui du début est encore là
                relance.classList.add('visible');
        }, 1500);
        if (posee) {
            attenteFin = setTimeout(() => {
                relance.classList.remove('visible');
                cible = FIN;
                va(FIN, Math.max(1, (FIN - lecture.t) * 0.8), 'power1.inOut');
            }, 4000);
        }
    }

    // ---------- molette et clavier ----------
    // la molette est prise sur window en phase de capture : avant tout le reste, où que soit
    // la souris, et elle ne va pas jusqu'à js/zoom.js, qui déplacerait la carte cachée
    function molette(e) {
        e.preventDefault();
        e.stopPropagation();
        // deltaMode 1 : en lignes et pas en pixels (souris sous Firefox)
        avance(e.deltaY * (e.deltaMode === 1 ? 16 : 1) / PX_PAR_ETAPE);
    }

    function clavier(e) {
        e.stopPropagation();   // pas de Ctrl +/- de js/zoom.js pendant l'intro
        if (e.ctrlKey || e.metaKey)
            e.preventDefault();
        else if (['ArrowDown', 'PageDown', ' '].includes(e.key))
            avance(0.8);
        else if (['ArrowUp', 'PageUp'].includes(e.key))
            avance(-0.8);
        else
            return;
        e.preventDefault();
    }

    window.addEventListener('wheel', molette, { capture: true, passive: false });
    window.addEventListener('keydown', clavier, true);
    window.addEventListener('resize', () => {
        if (!posee)
            rendu(lecture.t);
    });

    rendu(0);
    monde.style.opacity = 1;
})();

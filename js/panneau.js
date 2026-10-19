// le panneau qui s'ouvre au clic sur un POI : titre, image ou galerie, texte, compétences
const panneau = document.getElementById('panneau');

function ouvrePanneau(point) {
    document.getElementById('panneau-titre').textContent = point.name;
    document.getElementById('panneau-description').textContent = point.description;
    document.getElementById('panneau-date').textContent = point.date;

    const container = document.getElementById('panneau-image-container');
    // vide le conteneur, ce qui stoppe aussi l'ancienne bande
    container.innerHTML = '';
    // pas d'image : pas de grand bloc vide en haut du panneau
    container.style.display = (point.images || point.image) ? '' : 'none';

    if (point.images) {
        afficheBande(container, point.images);
    }
    else if (point.image) {
        const img = document.createElement('img');
        img.src = point.image;
        container.appendChild(img);
    }

    fetch(point.text)
        .then(res => res.text())
        .then(contenu => {
            // une ligne qui n'est qu'une URL devient un lien, affiché avec le nom du repo
            const texteEl = document.getElementById('panneau-texte');
            texteEl.innerHTML = '';
            contenu.split('\n').forEach((ligne, i) => {
                if (i > 0)
                    texteEl.append('\n');
                if (ligne.startsWith('https://')) {
                    const a = document.createElement('a');
                    a.href = ligne;
                    a.target = '_blank';
                    a.textContent = ligne.split('/').pop();
                    texteEl.appendChild(a);
                }
                else
                    texteEl.append(ligne);
            });
        });

    panneau.style.display = 'flex';
    const skillsEl = document.getElementById('panneau-skills');
    skillsEl.innerHTML = '';
    point.skills.forEach(skill => {
        const li = document.createElement('li');
        li.textContent = skill;
        skillsEl.appendChild(li);
    });
}

// bande d'images qui défile en boucle.
// la liste est mise deux fois à la suite : l'animation CSS translate de -50%,
// donc quand la première copie est sortie la seconde est exactement à sa place.
function afficheBande(container, images) {
    const bande = document.createElement('div');
    bande.classList.add('bande');

    const toutes = images.concat(images);
    let restantes = toutes.length;

    toutes.forEach(src => {
        const img = document.createElement('img');
        // miniature pour la bande, l'original sert à la loupe
        img.src = src.replace('dessins/', 'dessins/mini/');
        img.addEventListener('click', () => ouvreLoupe(src));
        // on attend que toutes les images aient leur largeur avant de lancer
        img.addEventListener('load', imageArrivee);
        img.addEventListener('error', imageArrivee);
        bande.appendChild(img);
    });

    function imageArrivee() {
        restantes--;
        if (restantes > 0)
            return;
        // vitesse constante en px/s quelle que soit la largeur totale
        const duree = (bande.scrollWidth / 2) / 60;
        bande.style.animationDuration = duree + 's';
        // départ à un endroit au hasard de la boucle
        bande.style.animationDelay = -(Math.random() * duree) + 's';
        bande.classList.add('defile');
    }

    container.appendChild(bande);
}

const loupe = document.getElementById('loupe');

function ouvreLoupe(src) {
    loupe.querySelector('img').src = src;
    loupe.style.display = 'flex';
}

function fermeLoupe() {
    loupe.style.display = 'none';
    loupe.querySelector('img').src = '';
}

loupe.addEventListener('click', (e) => {
    // sinon le clic remonte au document et ferme aussi le panneau
    e.stopPropagation();
    fermeLoupe();
});

function fermePanneau() {
    panneau.style.display = 'none';
    document.getElementById('panneau-image-container').innerHTML = '';
}

document.getElementById('fermer').addEventListener('click', fermePanneau);

defilementCouche(document.getElementById('panneau-corps'));

// échap ferme d'abord la loupe si elle est ouverte, sinon le panneau
document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape')
        return;
    if (loupe.style.display === 'flex') {
        fermeLoupe();
    }
    else if (panneau.style.display === 'flex') {
        fermePanneau();
    }
});

// ferme le panneau si on clique en dehors
document.addEventListener('click', (e) => {
    if (panneau.style.display === 'flex' && !panneau.contains(e.target)) {
        fermePanneau();
    }
});

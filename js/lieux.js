// pose un symbole par POI sur la carte, avec son nom écrit dessous

const conteneur = document.getElementById('points');

points.forEach(point => {
    const div = document.createElement('div');
    div.classList.add('point', 'niveau-' + point.niveau);
    div.style.left = point.x + '%';
    div.style.top = point.y + '%';

    const img = document.createElement('img');
    img.src = point.icon;
    div.appendChild(img);

    const nom = document.createElement('span');
    nom.classList.add('toponyme');
    nom.textContent = point.name;
    div.appendChild(nom);

    div.addEventListener('click', (e) => {
        e.stopPropagation();
        ouvrePanneau(point);
    });

    conteneur.appendChild(div);
});

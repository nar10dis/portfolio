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

    // clic — ouvre le panneau
    div.addEventListener('click', (e) => {
        e.stopPropagation();
        ouvrePanneau(point);
    });

    conteneur.appendChild(div);
});

// coords relatives au container pour placer les points : clic sur la carte, résultat dans la console
document.addEventListener('click', (e) => {
    const rect = conteneur.getBoundingClientRect();
    const x = Math.round((e.clientX - rect.left) / rect.width * 100);
    const y = Math.round((e.clientY - rect.top) / rect.height * 100);
    console.log(`x: ${x}, y: ${y}`);
});

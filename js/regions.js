// le tableau à gauche affiche le nom de la région survolée, sinon le titre de la carte
const tableauTexte = document.getElementById('tableau-texte');
const titreCarte = tableauTexte.textContent;

document.querySelectorAll('.region').forEach(region => {
    region.addEventListener('mouseenter', () => {
        tableauTexte.textContent = region.dataset.nom;
    });
    region.addEventListener('mouseleave', (e) => {
        // les lieux sont au-dessus des régions : passer sur un lieu fait "sortir" de la région,
        // mais on y est toujours, donc on garde son nom
        if (e.relatedTarget && e.relatedTarget.closest('.point'))
            return;
        tableauTexte.textContent = titreCarte;
    });
});

// en quittant un lieu : si on ne retombe pas sur une région, on remet le titre
document.querySelectorAll('.point').forEach(point => {
    point.addEventListener('mouseleave', (e) => {
        if (e.relatedTarget && e.relatedTarget.closest('.region'))
            return;
        tableauTexte.textContent = titreCarte;
    });
});

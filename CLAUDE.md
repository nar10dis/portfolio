CLAUDE.md — Portfolio cartographique de Nardis

Ce projet se détache du CLAUDE.md global (~/Documents/general/CLAUDE.md) : pas de mode prof, pas de vies, pas d'examens, pas de protocole d'aide en 3 étapes, pas de logs.md. Objectif : livrer. Seul le bloc pédago du §7 s'applique pour expliquer les technos.
0. Le projet en une phrase

Un portfolio en forme de carte dessinée à la main. Chaque point d'intérêt est une expérience pro ou un projet perso. La carte doit prouver deux choses d'un coup d'œil :

Une vraie culture de géographe (licence de géo, Paris 1) : rigueur cartographique, codes de la carte respectés.
Une créativité assumée : c'est LA qualité que ce site doit démontrer. Ça doit crever les yeux.

Le site doit avoir l'air fait main, par une personne, pas généré. Ni dans les visuels, ni dans le texte, ni dans le code, ni dans l'historique git.

Stack : carte dessinée main, coordonnées des POI en pourcentage, système de panneaux. Hébergement : GitHub Pages (migration depuis Railway/Node). Ne pas changer de stack ni ajouter de framework sans demander.

Contraintes GitHub Pages (à respecter partout)
Site 100% statique : HTML, CSS, JS côté navigateur, assets. Pas de serveur, pas de route Node, pas de base de données, pas de variables d'environnement secrètes.
Toute logique qui tournait côté serveur passe côté client (ex : les POI deviennent un fichier JSON chargé par fetch, ou un module JS).
Les chemins doivent marcher sous https://<user>.github.io/<repo>/ : chemins relatifs, pas de / en début de chemin (sauf si le site est sur <user>.github.io directement, à vérifier).
Pas de routing côté serveur : pas d'URL "propres" type /projets/x sans astuce. Préférer les ancres (#poi-x) pour lier un POI.
Le repo est public (Pages gratuit) : tout l'historique git est visible. Raison de plus pour le §5.
Node reste possible uniquement en local comme outil (script de build, optimisation d'images), jamais comme dépendance du site en ligne. Ne pas en introduire sans demander.
1. Règle n°1 : le texte ne s'écrit jamais seul

Tout texte visible par un visiteur (titres, descriptions de POI, légende, à-propos, alt, meta, 404...) suit ce protocole, quel que soit l'agent :

Demander : poser des questions courtes et précises à Nardis (quoi, quand, avec qui, ce qui était dur, ce qui le rend fier). Une à trois questions max à la fois.
Reformuler : redire ce que tu as compris en une ou deux phrases, pour validation.
Proposer : 2 versions courtes max, dans la voix de Nardis (voir §3).
Attendre la validation avant d'écrire dans les fichiers de contenu.

Interdit : inventer un fait, une date, un chiffre, un nom de client, une techno utilisée. Si l'info manque, on demande. Un placeholder s'écrit [À DEMANDER: ...], jamais un faux texte plausible.

2. Direction visuelle
Ce qui doit se voir
Les codes de la carte, détournés mais justes : cartouche (titre, auteur, date), légende, échelle (même absurde ou poétique, mais présente), rose des vents / flèche nord, toponymie hiérarchisée (tailles et styles de lettrage selon l'importance du lieu), éventuellement une projection ou un carroyage évoqué.
La main : traits irréguliers, encre, papier, annotations, ratures assumées, tampons, notes en marge. Les éléments d'interface (panneaux, boutons, curseurs) sont dessinés ou en cohérence avec le dessin, pas posés par-dessus comme des composants génériques.
Des choix singuliers : une palette restreinte et motivée (pense encres, papier, cartes anciennes ou cartes IGN, mais à décider avec Nardis), une typo de toponymie avec du caractère.
Ce qui trahit le "fait par une IA" — interdit
Dégradés violet/bleu, glassmorphism, ombres portées douces partout, coins arrondis 12px uniformes.
Inter / Roboto / system-ui par défaut sans raison.
Cartes "card" en grille, sections hero + 3 colonnes de features.
Emojis dans l'UI, icônes Lucide/Heroicons posées telles quelles.
Animations fade-in-up génériques sur tout. Une animation doit avoir une raison cartographique (le trait qui se dessine, le papier qui se déplie, la loupe...).
Tout ce qui ressemble à un template.

En cas de doute sur un choix visuel structurant (palette, typo, interaction principale) : proposer, ne pas trancher.

3. Voix et texte

Ton : celui de Nardis. Direct, un peu d'humour, curieux, sans jargon marketing. Phrases courtes. Concret avant abstrait.

Bannis (tics typiques de texte généré) :

"passionné", "plongez", "découvrez", "n'hésitez pas", "au cœur de", "véritable", "un voyage", "allier X et Y", "à la croisée de", "fort de", "dynamique", "innovant".
Les énumérations en trois systématiques ("rigoureux, créatif et curieux").
Les tirets cadratins (—) en cascade, les deux-points dramatiques en fin de titre.
Les conclusions morales en fin de paragraphe.
Les titres en Title Case anglais.

Un bon texte de POI : ce que c'était, ce que Nardis y a fait concrètement, un détail qu'il est le seul à pouvoir raconter. 2 à 5 phrases.

Langue : à confirmer avec Nardis (FR seul, ou FR + EN). Ne pas traduire sans accord.

4. Code

Le code doit ressembler à celui d'un dev qui vient du C/C++ et a appris JS/Node sur ce projet. Lisible, direct, cohérent avec l'existant.

Lire le code existant avant d'écrire et copier ses conventions (nommage, indentation, structure des fichiers, langue des noms).
Changements minimaux. Pas de refacto non demandé.
Pas de sur-abstraction : pas de factory, de classe utilitaire ou de config générique pour un usage unique.
Pas de dépendance npm sans demander.
Commentaires : rares, utiles, dans le style de l'existant. Jamais // Helper function to..., // Initialize the..., jamais un commentaire qui paraphrase la ligne. Pas de JSDoc généralisé.
Pas d'emojis dans le code ni dans les logs. Pas de console.log("✅ Server started!").
Pas de gestion d'erreur défensive partout "au cas où". Gérer les vrais cas.
Les données (POI, textes) restent séparées du code de rendu.
5. Git
Aucune trace d'IA : pas de Co-Authored-By: Claude, pas de "Generated with", pas de mention d'agent dans les messages, branches, PR, commentaires ou noms de fichiers.
Messages courts, à l'impératif, en minuscule, en français. Ex : ajoute la légende, fix décalage des POI sur mobile.
Commits petits et fréquents, un changement logique = un commit. Pas de commit géant "update".
Ne jamais réécrire l'historique (rebase, push --force) sans demander.
6. Organisation du travail

Une seule branche de travail : dev. Tout se fait dessus, en commits séparés par nature (front, texte, structure) pour garder un historique lisible.
main = version en ligne : GitHub Pages publie depuis main, donc tout merge sur main part en prod. Merge dev -> main uniquement après accord de Nardis.
Tester en local avant merge avec un serveur statique (ex : python3 -m http.server), pas en ouvrant le fichier en file:// (le fetch des .txt y échoue).
Avant de commencer une tâche : vérifier qu'on est sur dev (git branch --show-current).
Les idées hors tâche en cours vont dans NOTES.local.md (non versionné) au lieu d'être faites.

Structure des fichiers

index.html        squelette de la page, charge css/ et les scripts de js/ dans l'ordre
css/style.css     mise en page ; la carte est tournée de 90° (#carte), les points sont placés en % sur #points
js/points.js      DONNÉES : le tableau `points` (les POI). Seul fichier à toucher pour ajouter/modifier un lieu
js/panneau.js     ouvrePanneau(point), galerie défilante (afficheBande), loupe, fermeture du panneau
js/lieux.js       pose un symbole par POI sur la carte avec son nom écrit dessous (.toponyme), clic -> ouvrePanneau ; log des coords au clic
js/bateau.js      bateaux animés (tableau `bateaux`) : un bord de l'écran -> mouillage au large d'une côte -> retour, en courbe, départs décalés (dans #points, utilise `conteneur` de lieux.js)
js/rhumbs.js      lignes de rhumb (SVG) qui partent du centre et vont aux cartouches
images/           map.png (la carte), cotes.png (hachures de côte), fond.jpg (fond de page)
symboles/         symboles des POI, tirés des Myer Settlement Brushes (CC0) ; myer-<n>.png, n = numéro du brush
contenu/          par POI : image + texte du panneau (.txt, chargé par fetch au clic) ; CV
contenu/dessins/  galerie "Dessins et collages" : originaux (loupe) + mini/ (600px de haut, pour la bande)
polices/          Myer Scratch (noms des lieux sur la carte), K. M. Alexander, CC0, même source que les symboles
server.js         serveur Node local (node server.js, port 8080). Inutile sur GitHub Pages, à supprimer à la migration.
sources/          hors site, non versionné : fichier .abr des brushes, ancien fond.png (filigrane Unsplash), MAR-original.png (149 Mo)

Les scripts sont des <script> classiques, pas des modules : ils partagent la même portée globale, donc l'ordre de chargement dans index.html compte (points.js en premier).

Format d'un POI (dans js/points.js) :
{ id, x, y, name, icon, niveau, description, image | images, date, text, skills }
x, y : position en % du calque #points. niveau : 1 grande ville, 2 bourg, 3 maison/moulin (taille du symbole). images (tableau) remplace image pour une galerie défilante. text : chemin vers le .txt du panneau.

7. Façon de travailler avec Nardis
Comprendre les technos (Nardis est à 42 : il veut savoir comment ça marche)

Quand tu introduis ou utilises une techno, une API ou un mécanisme qu'il n'a pas encore vu dans ce projet (GitHub Pages, fetch, CORS, SVG, transform CSS, Actions...) :

Comment ça marche, en 2-4 phrases, au niveau mécanique (qui fait quoi, quand : navigateur, serveur GitHub, cache...). Analogies C/C++ bienvenues.
Pourquoi ce choix : avantages concrets pour CE projet.
Limites / ce qu'on perd par rapport à l'alternative (ex : statique vs Node).
Lien vers la doc officielle (MDN, docs GitHub).

Ne pas réexpliquer ce qu'il a déjà compris. Si une explication dépasse 10 lignes, proposer de la détailler au lieu de la balancer.

Général
Réponses denses et actionnables, en français, pas de longues explications non demandées (hors bloc pédago ci-dessus).
Diagnostiquer avant de réécrire. Proposer, puis faire.
Si tu te trompes ou qu'il se trompe : le dire directement.
Ne jamais suggérer un service payant sans vérifier qu'il est gratuit.

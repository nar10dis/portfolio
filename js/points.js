// les POI de la carte : position en % du calque #points, symbole, contenu du panneau.
// ajouter un lieu = ajouter une entrée ici, le reste du code ne bouge pas.
const points = [
    //creativity
    { id: 1, x: 18, y: 39, name:"Prépa Henri IV", icon: "symboles/myer-102.png", niveau: 2,
    description: "Classe prépa littéraire au Henri IV.", image: "contenu/prepa.png",
    date: "2019-2021", text: "contenu/prepa.txt",
    skills: ["Rigueur de travail", "Esprit critique", "Éloquence orale/écrite", "Culture générale"]},

    { id: 2, x: -4, y: 36, name:"Musique", icon: "symboles/myer-93.png", niveau: 2,
    description: "De la musique !", image: "contenu/son.jpg",
    date: "20021-2026", text: "contenu/son.txt",
    skills: ["[FL STUDIO]", "Impudeur", "Poésie", "Travail d'équipe"]},

    { id: 3, x: 5, y: 25, name:"Dessins", icon: "symboles/myer-112.png", niveau: 1,
    description: "Résulats de beaucoup d'années de gribouillage.",
    images: Array.from({ length: 44}, (_, i) =>
    `contenu/dessins/${i + 1}.jpg`),
    date: "2021-2026", text: "contenu/dessin.txt",
    skills: ["Observation", "Imagination", "Laisser-aller", "Esthétique"]},

    { id: 4, x: 42, y: 35, name:"Mort Aux Rats!", icon: "symboles/myer-113.png", niveau: 1,
    description: "Revue associative artistique, politique et culturelle.", image: "contenu/MAR.jpg",
    date: "2022-2026", text: "contenu/MAR.txt",
    skills: ["Administration", "Edition", "Travail collectif", "Evenementiel"]},

    { id: 15, x: 22, y: 30, name:"Littérature", icon: "symboles/myer-96.png", niveau: 3,
    description: "Lire des recits et essayer d'en raconter",
    date: "[À DEMANDER: dates]", text: "contenu/litterature.txt",
    skills: ["Patience", "Imagination", "Ecoute", "Eloquence"]},

    // //CODE
    { id: 5, x: 21, y: 61, name:"42", icon: "symboles/myer-111.png", niveau: 1,
    description: "Tronc commun de l'ecole 42.", image: "contenu/42.jpg",
    date: "2024-2026", text: "contenu/42.txt",
    skills: ["Patience", "Autonomie", "C, C++, JS"]},

    { id: 6, x: 1, y: 48, name:"OpenGL", icon: "symboles/myer-129.png", niveau: 3,
    description: "Apprentissage applique de la lib graphique OpenGL", image: "contenu/opengl.png",
    date: "2026", text: "contenu/opengl.txt",
    skills: ["Pipeline graphique", "GLSL"]},

    { id: 16, x: -12, y: 58, name:"Shaders", icon: "symboles/myer-129.png", niveau: 3,
    description: "Experiences des shaders avec GDShader sur godot", image: "contenu/opengl.png",
    date: "2026", text: "contenu/shaders.txt",
    skills: ["Shaders", "GDShader", "Programmation graphique"]},

    { id: 7, x: 40, y: 63, name: "Airtable", icon: "symboles/myer-92.png", niveau: 3,
    description: "Deploiement et optimisation d'une base de donnee Airtable", image: "contenu/airtable.png",
    date: "2026", text: "contenu/airtable.txt",
    skills: ["Administration", "Comptabilite", "JavaScript", "Freelance"]},

    { id: 8, x: 25, y: 52, name: "Gamedev", icon: "symboles/myer-99.png", niveau: 2,
    description: "Tentative d'un premier jeu sur Godot", image: "contenu/airtable.png",
    date: "2026", text: "contenu/airtable.txt",
    skills: ["Administration", "Edition", "Gestion en collectif", "Evenementiel"]},

    // //TEAMWORK
    { id: 9, x: 71, y: 37, name:"Fashion Week", icon: "symboles/myer-100.png", niveau: 2,
    description: "Assistant de produsction sur les defiles de la boite CAMOLIA", image: "contenu/fashion.jpg",
    date: "2025-2026", text: "contenu/fashion.txt",
    skills: ["Calme et sang-froid", "Reactivite", "Adaptivite", "Social skills"]},

    { id: 10, x: 95, y: 27, name:"Restauration", icon: "symboles/myer-101.png", niveau: 2,
    description: "Serveur en salle dans plusieurs bars parisiens.", image: "contenu/restau.jpg",
    date: "2019-2026", text: "contenu/restau.txt",
    skills: ["Reactivite", "Sympathie", "Management", "Comptabilite", "Gestion de rush"]},

    { id: 11, x: 113, y: 40, name: "Festival", icon: "symboles/myer-130.png", niveau: 3,
    description: "Benevole bar dans plusieurs festivals.", image: "contenu/festival.jpg",
    date: "2022-2026", text: "contenu/festival.txt",
    skills: ["Gestion de rush", "Funitude"]},

    // //ENVIRONMENT
    { id: 12, x: 59, y: 51, name:"Licence geo", icon: "symboles/myer-116.png", niveau: 1,
    description: "Licence a l'institut de geographie de la sorbonne paris 1", image: "contenu/licence.jpg",
    date: "2023", text: "contenu/licence.txt",
    skills: ["Cartographie", "Geographie sociale", "Geographie physique", "Autonomie"]},

    { id: 13, x: 92, y: 50, name:"Hermitage", icon: "symboles/myer-114.png", niveau: 3,
    description: "Service civique au sein du Tiers-Lieu de l'Hermitage - responsable du cafe associatif", image: "contenu/hermitage.jpg",
    date: "2024", text: "contenu/hermitage.txt",
    skills: ["Adaptativite", "Initiative", "Gestion comptable", "Vie en communaute"]},

    { id: 14, x: 62, y: 65, name:"Experiences agricoles", icon: "symboles/myer-143.png", niveau: 3,
    description: "Maraichage, Plantes Aromatiques et Medicinales, Viticulture", image: "contenu/agri.jpg",
    date: "2026", text: "contenu/agri.txt",
    skills: ["Travail du sol", "Vie en communaute"]},
];

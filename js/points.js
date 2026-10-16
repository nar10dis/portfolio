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
    date: "", text: "contenu/son.txt",
    skills: ["FL Studio", "Impudeur", "Poésie", "Travail d'équipe"]},

    { id: 3, x: 5, y: 25, name:"Dessins", icon: "symboles/myer-112.png", niveau: 1,
    description: "Résultats de beaucoup d'années de gribouillage.",
    images: Array.from({ length: 44}, (_, i) =>
    `contenu/dessins/${i + 1}.jpg`),
    date: "", text: "contenu/dessin.txt",
    skills: ["Observation", "Imagination", "Laisser-aller", "Esthétique"]},

    { id: 4, x: 42, y: 35, name:"Mort aux Rats !", icon: "symboles/myer-113.png", niveau: 1,
    description: "Revue associative artistique, politique et culturelle.", image: "contenu/MAR.jpg",
    date: "2021-2026", text: "contenu/MAR.txt",
    skills: ["Administration", "Édition", "Travail collectif", "Événementiel"]},

    // //CODE
    { id: 5, x: 21, y: 61, name:"42", icon: "symboles/myer-111.png", niveau: 1,
    description: "Tronc commun de l'école 42.", image: "contenu/42.jpg",
    date: "2024-2026", text: "contenu/42.txt",
    skills: ["Patience", "Autonomie", "C, C++, JS"]},

    { id: 6, x: 1, y: 48, name:"Programmation graphique", icon: "symboles/myer-129.png", niveau: 2,
    description: "OpenGL et shaders sur Godot.", image: "contenu/graphique.gif",
    date: "", text: "contenu/graphique.txt",
    skills: ["Pipeline graphique", "GLSL", "GDShader"]},

    { id: 7, x: 40, y: 63, name: "Airtable", icon: "symboles/myer-92.png", niveau: 3,
    description: "Déploiement et optimisation d'une base de données Airtable.", image: "contenu/airtable.png",
    date: "2026", text: "contenu/airtable.txt",
    skills: ["Administration", "Comptabilité", "JavaScript", "Freelance"]},

    { id: 8, x: 25, y: 52, name: "Gamedev", icon: "symboles/myer-99.png", niveau: 2,
    description: "Godot, cub3D et un Tock en TypeScript.", image: "contenu/airtable.png",
    date: "", text: "contenu/gamedev.txt",
    skills: ["Godot", "TypeScript", "Pixel art", "Collage"]},

    // //TEAMWORK
    { id: 9, x: 113, y: 40, name:"Fashion Week", icon: "symboles/myer-100.png", niveau: 2,
    description: "Stage manager sur les défilés de Kamolia.", image: "contenu/fashion.jpg",
    date: "2025-2026", text: "contenu/fashion.txt",
    skills: ["Calme et sang-froid", "Réactivité", "Adaptabilité", "Social skills"]},

    { id: 10, x: 95, y: 27, name:"Restauration", icon: "symboles/myer-101.png", niveau: 2,
    description: "Serveur en salle dans plusieurs bars parisiens.", image: "contenu/restau.jpg",
    date: "2019-2026", text: "contenu/restau.txt",
    skills: ["Réactivité", "Sympathie", "Management", "Comptabilité", "Gestion de rush"]},

    // //ENVIRONMENT
    { id: 12, x: 59, y: 51, name:"Licence géo", icon: "symboles/myer-116.png", niveau: 1,
    description: "Licence à l'Institut de géographie de la Sorbonne, Paris 1.", image: "contenu/licence.jpg",
    date: "2023", text: "contenu/licence.txt",
    skills: ["Cartographie", "Géographie sociale", "Géographie physique", "Autonomie"]},

    { id: 13, x: 92, y: 50, name:"Hermitage", icon: "symboles/myer-114.png", niveau: 3,
    description: "Service civique au tiers-lieu de l'Hermitage, responsable du café associatif.", image: "contenu/hermitage.jpg",
    date: "2024", text: "contenu/hermitage.txt",
    skills: ["Adaptabilité", "Initiative", "Gestion comptable", "Vie en communauté"]},

    { id: 14, x: 62, y: 65, name:"Expériences agricoles", icon: "symboles/myer-143.png", niveau: 3,
    description: "Maraîchage, plantes aromatiques et médicinales, viticulture.", image: "contenu/agri.jpg",
    date: "", text: "contenu/agri.txt",
    skills: ["Travail du sol", "Vie en communauté"]},
];

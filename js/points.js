// les POI de la carte : position en % du calque #points, symbole, contenu du panneau.
// ajouter un lieu = ajouter une entrée ici, le reste du code ne bouge pas.
const points = [
    // créativité
    { id: 1, x: 18, y: 39, name:"Prépa Henri IV", icon: "public/symboles/myer-102.png", niveau: 2,
    description: "Classe prépa littéraire au Henri IV.", image: "public/contenu/prepa.png",
    date: "2019-2021", text: "public/contenu/prepa.txt",
    skills: ["Rigueur de travail", "Esprit critique", "Éloquence orale/écrite", "Culture générale"]},

    { id: 2, x: -4, y: 36, name:"Musique", icon: "public/symboles/myer-93.png", niveau: 2,
    description: "De la musique !", image: "public/contenu/son.jpg",
    date: "", text: "public/contenu/son.txt",
    skills: ["FL Studio", "Impudeur", "Poésie", "Travail d'équipe"]},

    { id: 3, x: 5, y: 25, name:"Dessins", icon: "public/symboles/myer-112.png", niveau: 1,
    description: "Résultats de beaucoup d'années de gribouillage.",
    images: Array.from({ length: 44}, (_, i) =>
    `public/contenu/dessins/${i + 1}.jpg`),
    date: "", text: "public/contenu/dessin.txt",
    skills: ["Observation", "Imagination", "Laisser-aller", "Esthétique"]},

    { id: 4, x: 42, y: 35, name:"Mort aux Rats !", icon: "public/symboles/myer-113.png", niveau: 1,
    description: "Revue associative artistique, politique et culturelle.", image: "public/contenu/MAR.jpg",
    date: "2021-2026", text: "public/contenu/MAR.txt",
    skills: ["Administration", "Édition", "Travail collectif", "Événementiel"]},

    // code
    { id: 5, x: 21, y: 61, name:"42", icon: "public/symboles/myer-111.png", niveau: 1,
    description: "Tronc commun de l'école 42.", image: "public/contenu/42.jpg",
    date: "2024-2026", text: "public/contenu/42.txt",
    skills: ["Patience", "Autonomie", "C, C++, JS"]},

    { id: 6, x: 1, y: 48, name:"Programmation graphique", icon: "public/symboles/myer-129.png", niveau: 2,
    description: "OpenGL et shaders sur Godot.", image: "public/contenu/graphique.gif",
    date: "", text: "public/contenu/graphique.txt",
    skills: ["Pipeline graphique", "GLSL", "GDShader"]},

    { id: 7, x: 40, y: 63, name: "Airtable", icon: "public/symboles/myer-92.png", niveau: 3,
    description: "Déploiement et optimisation d'une base de données Airtable.", image: "public/contenu/airtable.png",
    date: "2026", text: "public/contenu/airtable.txt",
    skills: ["Administration", "Comptabilité", "JavaScript", "Freelance"]},

    { id: 8, x: 25, y: 52, name: "Gamedev", icon: "public/symboles/myer-99.png", niveau: 2,
    description: "Godot, cub3D et un Tock en TypeScript.", image: "public/contenu/airtable.png",
    date: "", text: "public/contenu/gamedev.txt",
    skills: ["Godot", "TypeScript", "Pixel art", "Collage"]},

    // team work
    { id: 9, x: 113, y: 40, name:"Fashion Week", icon: "public/symboles/myer-100.png", niveau: 2,
    description: "Stage manager sur les défilés de Kamolia.", image: "public/contenu/fashion.jpg",
    date: "2025-2026", text: "public/contenu/fashion.txt",
    skills: ["Calme et sang-froid", "Réactivité", "Adaptabilité", "Social skills"]},

    { id: 10, x: 95, y: 27, name:"Restauration", icon: "public/symboles/myer-101.png", niveau: 2,
    description: "Serveur en salle dans plusieurs restaurants parisiens.", image: "public/contenu/restau.jpg",
    date: "2019-2026", text: "public/contenu/restau.txt",
    skills: ["Réactivité", "Sympathie", "Management", "Comptabilité", "Gestion de rush"]},

    // environnement
    { id: 12, x: 59, y: 51, name:"Licence géo", icon: "public/symboles/myer-116.png", niveau: 1,
    description: "Licence à l'Institut de géographie de la Sorbonne, Paris 1.", image: "public/contenu/licence.jpg",
    date: "2023", text: "public/contenu/licence.txt",
    skills: ["Cartographie", "Géographie sociale", "Géographie physique", "Autonomie"]},

    { id: 13, x: 92, y: 50, name:"Hermitage", icon: "public/symboles/myer-114.png", niveau: 3,
    description: "Service civique au tiers-lieu de l'Hermitage, responsable du café associatif.", image: "public/contenu/hermitage.jpg",
    date: "2024", text: "public/contenu/hermitage.txt",
    skills: ["Adaptabilité", "Initiative", "Gestion comptable", "Vie en communauté"]},

    { id: 14, x: 62, y: 65, name:"Expériences agricoles", icon: "public/symboles/myer-143.png", niveau: 3,
    description: "Maraîchage, plantes aromatiques et médicinales, viticulture.", image: "public/contenu/agri.jpg",
    date: "", text: "public/contenu/agri.txt",
    skills: ["Travail du sol", "Vie en communauté"]},
];

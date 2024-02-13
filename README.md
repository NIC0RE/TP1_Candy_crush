# Candy Crush - Court rapport

## Introduction
Le projet que j'ai réalisé dans le cadre du TP1 s'apparente à une implémentation du jeu "Candy Crush": Un jeu dans lequel l'objectif est d'aligner des cookies de même type (croissants, cupcakes, macarons..etc) afin de les combiner, et de les faire disparaître de la grille. Selon le nombre de cookies alignés, le joueur reçoit un certain nombre de points. Pour remporter la partie, le joueur doit atteindre un score assez élevé. 

Dans ce court doument, vous trouverez un bref résumé du travail effectué, la liste des fonctionnalités implémentées, et quelques éventuelles précisions.

Certaines fonctionnalités citées ci dessous ont peut-être déjà été implémentée avant mes propres modifictions, mais elles n'en restent pas moins des fonctionnalité clés du jeu, je ne pouvais pas les omettre.

## Fonctionnalités Implémentées

### Grille de Cookies
- Création d'une grille de cookies représentée par un tableau, segmenté en lignes et colonnes.
- Création d'images avec le DOM
- Génération des cookies pour remplir le tableau.
- Arrière-plan, theme.

### Sélection et Échange de Cookies
- Le joueur peut échanger la position de deux cookies adjacents.
- Les cookies peuvent être sélectionnés par un clic, puis échangés avec un cookie adjacent par un second clic, sur ce dernier.
- La selection met en valeur le cookie choisi par une aura dorée.
- Les cookies peuvent être échangé par un système de drag and drop.
- Si le joueur tente d'échanger deux cookies non adjacents, rien ne se passe, mais le premeir cookie est déselectionné. 

### Détection des Alignements
- Le jeu détecte les alignements de trois cookies (voire plus) et cela à la verticale ou à l'horizontale.
- Le jeu détecte également les "doubles alignements" c'est à dire lorsque le déplacement d'un même cookie crée un alignement à la fois vertical et horizontal. 
- Une fois les alignements repérés, les cookies alignés sont supprimés de la grille (plus d'image, plus de type).
- Pour qu'un alignement déjà présent sur la grille (lorsque le jeu est lancé) soit detecté, il est nécessaire de déplacer un cookie sur la ligne ou la colonne de cet alignement. En bref, au lancement du jeu, les cookies déjà alignés ne sont pas supprimé directement, mais en quelques déplacements, tout sera réglé. C'est un choix, je préférais faire comme cela (vérifier les alignement par ligne et par colonne une fois en jeu et pas avant)

### Fonctionnalités externes
- Pour chaque alignement réalisé, le score du joueur augmente, et cela exponentiellement: 3pt pour 3 cookies alignés, 7 (3+4) pour 4 cookies alignés, 12 (3+4+5) pour 5 cookies...etc. On arrive plus facilement à de gros score, c'est plus satisfaisant...
- Un timer a été créé, il se lance dès que la page s'affiche.
- Un bouton pause est présent à côté du timer. Il permet de stopper momentanément le cours du temps (plutot cool non ?); Au cas où on ait quelque chose d'autre à fair ependant quelques secondes/minutes. On peut cliquer à nouveau pour relancer le timer. On ne peut pas remttre le timer à 0.
- Le nombre de coups effectué est pris en compte et augmente dès que le joueur réalise une action (click ou drag and drop).
- Implémentation d'une condition de victoire (basée sur le score), ainsi que d'une condition de défaite (basée sur le nombre de coups).
- Système de palier: à partir de certain totaux de score (10, 50, 100...) le palier du joueur est incrémenté pour donner un aperçus rapide de son niveau au joueur.

### Chute des Cookies
- Après chaque alignements, les cookies toujours présent en dessous ne bougent pas, mais les cookies présent au dessu sont censé tomber de haut en bas pour remplir tout espaces libre. Cette fonctionnalité n'a pas été réalisée jusqu'au bout, et n'est donc pas complètement fonctionnelle.

## Difficultés

### Chute des Cookies
- Je sais: c'était tout l'interêt du TP...mais l'implémentation de la chute des cookies après un alignement s'est avéré plus complexe que ce que je pensait. J'ai réalisé différents morceau de codes (fonctions) pour y parvenir, mais rien n'a réellement abouti. Ma dernière tentative fait effectivement disparaître les images des cookies qui tombent, pour certains, et fait même tomber d'autres directement, mais il n'y a pas vraiment de logique derrière tout ces changements: ce nest pas le résultat que j'anticipais. 

#### Pistes explorées:
- Vérification des alignements et chute des cookies dans deux fonctions distinctes: d'abord après un alignement vertical, puis avec un alignement horizontal
- Vérification et chute des cookies en parcourant la grille entière, en partant du bas de chaque colonnes, pour chaque lignes, et en remontant petit à petit.
- Utilisation de boucles récursives, conditions imbriqués.
- Manipulation de la structure html: bien que possiblement plus simple, cela me semblait être une méthode étrange et peu judicieuse puisque l'interêt de la grille sous forme de tableau était évidemment de le parcourir. 

#### Leçons Tirées :
- Cette difficulté m'a permis de mieux comprendre la complexité de la gestion des mouvements et des interactions dans un jeu de type puzzle.
J'ai appris l'importance de la planification et de la conception préalable pour aborder efficacement des problèmes algorithmiques complexes.
Malgré les défis rencontrés, cette expérience m'a permis de développer mes compétences en résolution de problèmes et de mieux appréhender les défis techniques dans le développement de jeux interactifs.

### Débogage
- J'ai eu beaucoup de problèmes pour débogger tout ce qui concerne la chute des cookies, même si au final, cela n'a pas porté ses fruits...
- Etonnamment, j'ai dû longtemps réaliser des tests et régler des soucis lors de la mise en place du bouton de pause. 

### Intégration HTML/CSS
- L'intégration de la plupart des fonctionnalités HTML/CSS relève de la manipulation du DOM.
- Principalement pour la partie Fonctionnalités externes: il est important de mettre à jour ou de manipuler les données css et html depuis les fichiers javascript.

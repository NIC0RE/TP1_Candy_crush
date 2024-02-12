import Cookie from "./cookie.js";
import { create2DArray } from "./utils.js";

/* Classe principale du jeu, c'est une grille de cookies. Le jeu se joue comme
Candy Crush Saga etc... c'est un match-3 game... */
export default class Grille {
  
  tabcookieselected = [];
  score = 0;
  timer = 0;
  play = 0;
  timerInterval;
  
  
  
  constructor(l, c) {
    this.c = c;
    this.l = l;

    

    this.tabcookies = this.remplirTableauDeCookies(6)
  }

  timer_up() { //Update pour l'html
    this.timer++;
    document.getElementById("timer").innerText = this.timer; //change le texte de l'élément avec l'id "timer"
}

  timer_start() { //Lance le timer
      this.timerInterval = setInterval(() => this.timer_up(), 1000); 
  }

  timer_stop() { //Stop le timer
      clearInterval(this.timerInterval);
  }

  /**
   * parcours la liste des divs de la grille et affiche les images des cookies
   * correspondant à chaque case. Au passage, à chaque image on va ajouter des
   * écouteurs de click et de drag'n'drop pour pouvoir interagir avec elles
   * et implémenter la logique du jeu.
   */
  showCookies() {
    let caseDivs = document.querySelectorAll("#grille div");

    caseDivs.forEach((div, index) => {
      let ligne = Math.floor(index / this.l);
      let colonne = index % this.c; 

       console.log("On remplit le div index=" + index + " l=" + ligne + " col=" + colonne);

      // on récupère le cookie correspondant à cette case
      let cookie = this.tabcookies[ligne][colonne];
      let img = cookie.htmlImage;

      img.onclick = (event) => {
        console.log("On a cliqué sur la ligne " + ligne + " et la colonne " + colonne);
        console.log("Le cookie cliqué est de type " + cookie.type);
        // highlight + changer classe CSS
        if (cookie.selected){
          cookie.deselectionnee();
          this.tabcookieselected.push(cookie);
        }
        else{
          cookie.selectionnee()
          this.tabcookieselected.push(cookie);
          if(this.tabcookieselected.length === 2){
            Cookie.swapCookies(this.tabcookieselected[0], this.tabcookieselected[1]);
            this.tabcookieselected = [];
            this.TestAlignementsGlobal(ligne, colonne);
            this.play += 1;
            document.getElementById("play").innerText = this.play;
            // this.TomberCookiesV()

            //----------- Condition de défaite ---------------//
            if(this.play >= 50){
              this.timer_stop();
              alert("Vous avez perdu !");
            }
          }
        }
        if(this.tabcookieselected[0] == this.tabcookieselected[1]){
        //   this.tabcookieselected[0].deselectionnee();
        //   this.tabcookieselected[1].deselectionnee();
          this.tabcookieselected = [];
        }
      }

      //----------- Drag and drop ---------------//
      img.ondragstart = (event) => {
        let cookieDragguee = cookie 
        cookieDragguee.selectionnee();
        this.tabcookieselected = [];
        this.tabcookieselected.push(cookieDragguee);
      }

      img.ondragenter = (event) => {
        const i = event.target;
        i.classList.add("imgDragStart");
      }

      img.ondragleave = (event) => {
        const i = event.target;
        i.classList.remove("imgDragStart");
      }

      img.ondrop = (event) => {
        let cookieDragguee = cookie
        cookieDragguee.selectionnee();
        this.tabcookieselected.push(cookieDragguee);

        
        Cookie.swapCookies(this.tabcookieselected[0], this.tabcookieselected[1]);
        

        
        this.tabcookieselected = [];
        cookieDragguee.htmlImage.classList.remove("imgDragStart");
        cookieDragguee.deselectionnee();
        this.TestAlignementsGlobal(ligne, colonne);
        this.play += 1;
        document.getElementById("play").innerText = this.play;
        //----------- Condition de défaite ---------------//
        if(this.play >= 50){
          this.timer_stop();
          alert("Vous avez perdu !");
        }
      }
      
      img.ondragover = (event) => {
        return false;
      }

      // on affiche l'image dans le div pour la faire apparaitre à l'écran.
      div.appendChild(img);
    });
  }
  
  /**
   * Initialisation du niveau de départ. Le paramètre est le nombre de cookies différents
   * dans la grille. 4 types (4 couleurs) = facile de trouver des possibilités de faire
   * des groupes de 3. 5 = niveau moyen, 6 = niveau difficile
   *
   * Améliorations : 1) s'assurer que dans la grille générée il n'y a pas déjà de groupes
   * de trois. 2) S'assurer qu'il y a au moins 1 possibilité de faire un groupe de 3 sinon
   * on a perdu d'entrée. 3) réfléchir à des stratégies pour générer des niveaux plus ou moins
   * difficiles.
   *
   * On verra plus tard pour les améliorations...
   */
  remplirTableauDeCookies(nbDeCookiesDifferents) {
    // A FAIRE
    let tab = create2DArray(9);

    // remplir
    for(let l = 0; l < this.l; l++) {
      for(let c =0; c < this.c; c++) {

        const type = Math.floor(Math.random()*nbDeCookiesDifferents);
        //console.log(type)
        tab[l][c] = new Cookie(type, l, c);
      }
    }

    return tab;
  }

// Fonction pour tester les alignements horizontaux à partir d'une position donnée
TestAlignementL(ligne, colonne) {
  let tabLigne = this.tabcookies[ligne];
  let cookie_a_suppr = [];

  for (let c = 0; c < this.c - 2; c++) {
    let cookie1 = tabLigne[c];
    let cookie2 = tabLigne[c + 1];
    let cookie3 = tabLigne[c + 2];

    if ((cookie1.type === cookie2.type) && (cookie2.type === cookie3.type)) {
      cookie_a_suppr.push(cookie1);
      cookie_a_suppr.push(cookie2);
      cookie_a_suppr.push(cookie3);
      
      let index = c + 3;
      while (index < this.c && tabLigne[index].type === cookie1.type) {
        cookie_a_suppr.push(tabLigne[index]);
        index++;
      }
    }
  }
  return cookie_a_suppr;
}

// Fonction pour tester les alignements verticaux à partir d'une position donnée
TestAlignementC(ligne, colonne) {
  let tabColonne = [];
  for (let i = 0; i < this.l; i++) {
    tabColonne.push(this.tabcookies[i][colonne]);
  }

  let cookie_a_suppr = [];

  for (let l = 0; l < this.l - 2; l++) {
    let cookie1 = tabColonne[l];
    let cookie2 = tabColonne[l + 1];
    let cookie3 = tabColonne[l + 2];

    if ((cookie1.type === cookie2.type) && (cookie2.type === cookie3.type)) {
      cookie_a_suppr.push(cookie1);
      cookie_a_suppr.push(cookie2);
      cookie_a_suppr.push(cookie3);
      
      let index = l + 3;
      while (index < this.l && tabColonne[index].type === cookie1.type) {
        cookie_a_suppr.push(tabColonne[index]);
        index++;
      }
    }
  }
  // this.TomberCookiesV()
  return cookie_a_suppr;
}

// Fonction pour tester les alignements à partir d'une position donnée
TestAlignementsGlobal(ligne, colonne) {
  // Test des alignements horizontaux
  let cookie_a_suppr_L = this.TestAlignementL(ligne, colonne);
  // Test des alignements verticaux
  let cookie_a_suppr_C = this.TestAlignementC(ligne, colonne);
  
  // Fusion des deux ensembles de cookies alignés
  let alignementsGlobal = cookie_a_suppr_L.concat(cookie_a_suppr_C);
  
  // Suppression des cookies alignés
  this.supprimerCookiesAlignes(alignementsGlobal);
}

supprimerCookiesAlignes(cookies) {
  if (cookies.length > 0) {
    cookies.forEach(cookie => {
      cookie.CookieSupprimee();
    });
    this.score += cookies.length;
    document.getElementById("score").innerText = this.score;
    //----------- Condition de victoire ---------------//
    if (this.score >= 1000) {
      this.timer_stop();
      alert("Vous avez gagné !");
    }
    //----------- Augmentation du palier en fonction des points possédés ---------------//
    else if(this.score >10 && this.score <= 50){
      document.getElementById("tier").innerText = 1;
    }
    else if(this.score >50 && this.score <= 100){
      document.getElementById("tier").innerText = 2;
    }
    else if(this.score >100 && this.score <= 200){
      document.getElementById("tier").innerText = 3;
    }
    else if(this.score >200 && this.score <= 500){
      document.getElementById("tier").innerText = 4;
    }
    else if(this.score > 500){
      document.getElementById("tier").innerText = 5;
    }
  }
}

//----------- Fonction tomber cookies finale ------------//
// IL s'agit de la dernière version de tomber cookie, la plus optimisée, même si elle n'est clairement pas fonctionnelle//
// Vous pouvez la tester en décommentant (à la ligne ~75 et/ou ~217) // 
//vous verrez qu'il y a un début de chute, et de changement d'image mais pas au bons endroits ! Je ne la maîtrise pas encore...// 

// TomberCookiesV() {
//   // Parcourir chaque colonne de la grille
//   for (let colonne = 0; colonne < this.c; colonne++) {
//     for (let ligne = this.l - 1; ligne >= 0; ligne--) {
//       // Vérifier si la case est vide
//       if (this.tabcookies[ligne][colonne].type==null) {
//         let cookieIndex = ligne - 1; // Indice du cookie au-dessus

//         // Trouver le cookie au-dessus
//         while(cookieIndex >= 0 && this.tabcookies[cookieIndex][colonne].type == null) {
//           cookieIndex--;
//         }

//         // S'il y a un cookie au-dessus, le faire tomber
//         if (cookieIndex >= 0) {
//           // Échanger le type et l'image du cookie avec ceux de la case vide
//           this.tabcookies[ligne][colonne].type = this.tabcookies[cookieIndex][colonne].type;
//           this.tabcookies[ligne][colonne].htmlImage.src = this.tabcookies[cookieIndex][colonne].htmlImage.src;
          
//           // Vider la case du cookie au-dessus
//           this.tabcookies[cookieIndex][colonne].type = null;
//           this.tabcookies[cookieIndex][colonne].htmlImage.src = "";
//         }
//       }
//     }
//   }
// }


//------------- Et voici mes nombreuses tentatives pour essayer de faire tomber les cookies --------------------//
// J'ai essayé de nombreuses approches, elles peuvent paraître inabouties (c'est le cas en vérité) mais il y a de l'idée //

// TomberCookiesV1() {
//   //Faire tomber les cookies après un combo vertical
//   //On se place dans la colonne du combo qui vient d'être fait
//   //On parcourt la colonne de bas en haut
//   //Si on trouve un cookie vide, on regarde si il y a un cookie au dessus
//   //Si oui, on le fait tomber
//   //On recommence jusqu'à ce qu'il n'y ait plus de cookie vide
//   for (let x = 0; x < this.c; x++) {
//     for (let y = this.l - 1; y >= 0; y--) {
//       if (this.tabcookies[y][x].type == null) {
//         let y2 = y;
//         while (y2 >= 0) {
//           if (this.tabcookies[y2][x].type != null) {
//             this.tabcookies[y][x].type = this.tabcookies[y2][x].type;
//             this.tabcookies[y2][x].type = -1;
//             this.tabcookies[y][x].htmlImage = this.tabcookies[y2][x].htmlImage;
//             this.tabcookies[y2][x].CookieSupprimee();
//             this.tabcookies[y][x].selectionnee();
//             this.tabcookies[y2][x].deselectionnee();
//             break;
//           }
//           y2--;
//         }
//       }
//     }
//   } 
// }

// TomberCookiesV2() {
//   // Faire tomber les cookies après un combo vertical
//   // On parcourt chaque colonne de la grille
//   for (let x = 0; x < this.c; x++) {
//     let emptyCellIndex = this.l - 1; // Indice de la première cellule vide dans la colonne
//     // Parcours de la colonne de bas en haut
//     for (let y = this.l - 1; y >= 0; y--) {
//       // Si la cellule actuelle est vide
//       if (this.tabcookies[y][x].type == null) {
//         // Chercher la première cellule non vide au-dessus
//         let y2 = y - 1;
//         while (y2 >= 0 && this.tabcookies[y2][x].type == null) {
//           y2--;
//         }
//         // Si une cellule non vide est trouvée au-dessus
//         if (y2 >= 0) {
//           // Déplacer le cookie vers le bas
//           this.tabcookies[y][x].type = this.tabcookies[y2][x].type;
//           this.tabcookies[y2][x].type = null; // Mettre à null pour indiquer une case vide
//           // Mettre à jour l'image HTML du cookie déplacé
//           this.tabcookies[y][x].htmlImage.src = Cookie.urlsImagesNormales[this.tabcookies[y][x].type]; // Utilisation de l'URL de l'image normale
//           // Mettre à jour les états sélectionnés/désélectionnés si nécessaire
//           this.tabcookies[y][x].selectionnee();
//           this.tabcookies[y2][x].deselectionnee();
//           // Mettre à jour l'indice de la prochaine cellule vide dans la colonne
//           emptyCellIndex = y;
//         }
//       }
//     }
//   }
// }



// TomberCookiesV3(C) {
//   let colTerminated = false;

//   while (!colTerminated) {
//     colTerminated = true; // Initialisation à true ici

//     for (let cookieligne = 0; cookieligne < this.l - 2; cookieligne++) {
//       let cookie1 = this.tabcookies[cookieligne][C];
//       let cookie2 = this.tabcookies[cookieligne + 1][C];
//       let cookie3 = this.tabcookies[cookieligne + 2][C];
//       let img1 = cookie1.htmlImage;
//       let img2 = cookie2.htmlImage;
//       let img3 = cookie3.htmlImage;

//       // Vérifie si la case actuelle est vide
//       if (cookie1.type == null) {
//         // Vérifie si la case au-dessus est vide
//         if (cookie2.type == null) {
//           // Vérifie si la case au-dessus de la case au-dessus est vide
//           if (cookie3.type != null) {
//             // Fait tomber le cookie3
//             cookie1.type = cookie3.type;
//             cookie3.type = null;
//             // Mise à jour visuelle pour le cookie1 et cookie3
//             this.updateCookieImage(cookie1, cookieligne, C);
//             this.updateCookieImage(cookie3, cookieligne + 2, C);
//             colTerminated = false; // Un cookie a été déplacé, donc la colonne n'est pas terminée
//           }
//         } else {
//           // Fait tomber le cookie2
//           cookie1.type = cookie2.type;
//           cookie2.type = null;
//           // Mise à jour visuelle pour le cookie1 et cookie2
//           this.updateCookieImage(cookie1, cookieligne, C);
//           this.updateCookieImage(cookie2, cookieligne + 1, C);
//           colTerminated = false; // Un cookie a été déplacé, donc la colonne n'est pas terminée
//         }
//       }
//     }
//   }
// }

}
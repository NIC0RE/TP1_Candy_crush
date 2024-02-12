import Grille from "./grille.js";

// 1 On définisse une sorte de "programme principal"
// le point d'entrée du code qui sera appelée dès que la
// page ET SES RESSOURCES est chargée

window.onload = init;

let grille;

function init() {
  console.log("Page et ressources prêtes à l'emploi");
  // appelée quand la page et ses ressources sont prêtes.
  // On dit aussi que le DOM est ready (en fait un peu plus...)

  grille = new Grille(9, 9);
  grille.showCookies();
  grille.timer_start();
  console.log("Lancement du timer...")
  const pauseLink = document.getElementById("pause");
  pauseLink.addEventListener("click", () => togglePause());
}

//----------- Mise en pause du timer ---------------//
function pauseGame() {
  grille.timer_stop();
  const pauseLink = document.getElementById("pause");
  pauseLink.innerText = "▶"; 
  pauseLink.removeEventListener("click", pauseGame); 
  pauseLink.addEventListener("click", resumeGame); 
}

//----------- Reprise du timer ---------------//
function resumeGame() {
  grille.timer_start();
  const pauseLink = document.getElementById("pause");
  pauseLink.innerText = "||"; 
  pauseLink.removeEventListener("click", resumeGame); 
  pauseLink.addEventListener("click", pauseGame); 
}

//----------- Fonction pour mettre en pause ou reprendre le timer ---------------//
function togglePause() {
  if (grille.timerInterval) {
    pauseGame();
  } else {
    resumeGame();
  }
}





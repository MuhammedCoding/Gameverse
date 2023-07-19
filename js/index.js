import {displayData, loadGames, openSideNav, toggleMenu,} from "./utilities.js";

//global vars
const rowElement = document.getElementById("row");
const url = "https://free-to-play-games-database.p.rapidapi.com/api/games";
//events
toggleMenu.addEventListener("click", openSideNav);

async function onStart() {
  const gamesData = await loadGames(url);
  const gamesObject = {
    gamesData: gamesData,
    start: 0,
    end: 12,
    row: rowElement,
  };
  displayData(gamesObject, false);
}

onStart();

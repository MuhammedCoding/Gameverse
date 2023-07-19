import {
  getCategoryGames,
  getPlatformGames,
  getUserData,
  loader,
  loadGames,
  openSideNav,
  toggleMenu,
} from "./utilities.js";
//global vars
const searchParam = location.search;
const params = new URLSearchParams(searchParam);
const id = params.get("id");
const url = `https://free-to-play-games-database.p.rapidapi.com/api/game?id=${id}`;
const logoutBtn = document.getElementById("logout-btn");

//onstart function

// function display data coming from api
function displayData(gameData) {
  createGameElement(gameData);
  loader.classList.add("d-none");
}

// dom creation functions
function createGameElement(game) {
  const imgGame = document.getElementById("game-image");
  const gameLink = document.querySelector(".game-link a");
  const gameName = document.querySelector(".name");
  const gameDesc = document.querySelector(".description");
  const genre = document.querySelector(".genre");
  const platform = document.querySelector(".platform");
  const publisher = document.querySelector(".publisher");
  const developer = document.querySelector(".dev");
  const date = document.querySelector(".date");
  const carouselInner = document.querySelector(".carousel-inner");

  imgGame.src = game.thumbnail;
  imgGame.alt = game.title;
  gameLink.href = game.game_url;
  gameName.innerHTML = game.title;
  gameDesc.textContent = game.description;
  publisher.textContent = game.publisher;
  developer.textContent = game.developer;
  date.textContent = game.release_date;
  genre.textContent = game.genre;
  platform.textContent = game.platform;

  for (let i = 0; i < game.screenshots.length; i++) {
    const carouselItem = createCarouselItem(game, i);
    carouselInner.appendChild(carouselItem);
  }
}

function createCarouselItem(game, index) {
  const carouselItem = document.createElement("div");
  carouselItem.className = "carousel-item rounded-3 overflow-hidden";
  if (index === 0) carouselItem.classList.add("active");
  const carouselImage = document.createElement("img");
  carouselImage.src = game.screenshots[index].image;
  carouselImage.className = "d-block w-100";
  carouselImage.alt = game.title;
  carouselItem.appendChild(carouselImage);
  return carouselItem;
}

logoutBtn.addEventListener("click", () =>
  localStorage.removeItem("activeUser"),
);
document.querySelectorAll(".categories-menu a").forEach(function (a) {
  a.addEventListener("click", function (e) {
    const category = e.target.dataset.category;
    getCategoryGames(category);
  });
});
document.querySelectorAll(".platform-menu a").forEach(function (a) {
  a.addEventListener("click", function (e) {
    const platform = e.target.dataset.platform;
    getPlatformGames(platform);
  });
});
toggleMenu.addEventListener("click", openSideNav);

//onStart fn
async function onStart() {
  loader.classList.remove("d-none");
  getUserData();
  const gameData = await loadGames(url, false);
  displayData(gameData);
}

onStart();

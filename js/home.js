"use strict";

import {
  displayData,
  getCategoryGames,
  getGameDetails,
  getPlatformGames,
  getUserData,
  loader,
  loadGames,
  openSideNav,
  toggleMenu,
} from "./utilities.js";

//global vars
const popover = document.querySelector(".search-popover");
const searchInput = document.querySelector(".search-area input");
const logoutBtn = document.getElementById("logout-btn");
//game kinds objects
const popular = {
  url: "https://free-to-play-games-database.p.rapidapi.com/api/games?sort-by=popularity",
  row: document.querySelector(".most-popular .row"),
  btn: document.querySelector(".most-popular button"),
  start: 0,
  end: 12,
  gamesData: null,
};
const relevant = {
  url: "https://free-to-play-games-database.p.rapidapi.com/api/games?sort-by=relevance",
  row: document.querySelector(".relevant .row"),
  btn: document.querySelector(".relevant button"),
  start: 0,
  end: 12,
  gamesData: null,
};
const recommended = {
  url: "https://free-to-play-games-database.p.rapidapi.com/api/games",
  row: document.querySelector(".recommended .row"),
  btn: document.querySelector(".recommended button"),
  start: 0,
  end: 12,
  gamesData: null,
};
//it's different from the others because it's viewed in a simple carousel no need for much info
const recentlyAdded = {
  url: "https://free-to-play-games-database.p.rapidapi.com/api/games?sort-by=release-date",
  gamesNum: 6,
  gamesData: null,
};

// function display data coming from api
function displayCarouselData({ gamesData, gamesNum }) {
  for (let i = 0; i < gamesNum; i++) createCarouselElem(gamesData[i], i);
  loader.classList.add("d-none");
}

function displaySearchData(gamesData) {
  popover.innerHTML = "";
  for (let i = 0; i < gamesData.length; i++) createSearchElem(gamesData[i]);
}

//dom functions creations
function createCarouselElem(game, index) {
  const carouselInner = document.querySelector(".carousel-inner");

  const carouselItem = document.createElement("div");
  carouselItem.classList.add("carousel-item");
  if (index === 0) carouselItem.classList.add("active");

  const image = document.createElement("img");
  image.classList.add("d-block", "w-100");
  image.src = game.thumbnail;
  image.alt = game.title;
  image.loading = "lazy";

  const carouselCaption = document.createElement("div");
  carouselCaption.classList.add(
    "carousel-caption",
    "d-none",
    "d-md-block",
    "p-0",
    "text-start",
    "bottom-0",
    "text-dark",
  );

  carouselItem.appendChild(image);
  carouselInner.appendChild(carouselItem);

  carouselItem.addEventListener("click", () => {
    getGameDetails(game.id);
  });
}

function createSearchElem(game) {
  // create the outer div element
  const searchItemDiv = document.createElement("div");
  searchItemDiv.classList.add(
    "search-item",
    "d-flex",
    "justify-content-start",
    "align-items-center",
    "mt-3",
    "rounded-4",
  );

  // create the game image div
  const gameImageDiv = document.createElement("div");
  gameImageDiv.classList.add(
    "game-image",
    "rounded-4",
    "overflow-hidden",
    "w-25",
    "h-25",
    "me-3",
  );

  // create the image element and set its source
  const imageElement = document.createElement("img");
  imageElement.src = game.thumbnail;
  gameImageDiv.appendChild(imageElement);
  imageElement.loading = "lazy";

  // create the h5 element for the game name
  const gameNameElement = document.createElement("h5");
  gameNameElement.textContent = game.title;

  // add the game image and game name elements to the outer div
  searchItemDiv.appendChild(gameImageDiv);
  searchItemDiv.appendChild(gameNameElement);

  const popover = document.querySelector(".search-popover");

  // add the outer div to the document
  popover.appendChild(searchItemDiv);

  //event
  searchItemDiv.addEventListener("click", function () {
    getGameDetails(game.id);
    console.log("clicked");
  });
}

//functions associated with events
function btnShowMoreHandler(sectionObj) {
  sectionObj.start = sectionObj.end;
  sectionObj.end += 12;
  displayData(sectionObj);
}

function clickDocWithPopover(event) {
  if (!popover.contains(event.target)) {
    popover.classList.add("d-none");
  }
}

//events
popular.btn.addEventListener("click", () => btnShowMoreHandler(popular));
relevant.btn.addEventListener("click", () => btnShowMoreHandler(relevant));
searchInput.addEventListener("keyup", loadSearchGames);
toggleMenu.addEventListener("click", openSideNav);
logoutBtn.addEventListener("click", () =>
  localStorage.removeItem("activeUser"),
);

document.addEventListener("click", (event) => {
  clickDocWithPopover(event);
});
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

async function loadSearchGames() {
  const searchVal = searchInput.value.toLowerCase();
  const games = await loadGames(
    "https://free-to-play-games-database.p.rapidapi.com/api/games",
    false,
  );
  const matchedGames = games.filter((game) =>
    game.title.toLowerCase().includes(searchVal),
  );
  if (matchedGames.length > 0 && searchVal !== "") {
    popover.classList.remove("d-none");
    displaySearchData(matchedGames);
  } else {
    popover.classList.add("d-none");
  }
}

//onStart fn
async function onStart() {
  getUserData();
  popular.gamesData = await loadGames(popular.url);
  relevant.gamesData = await loadGames(popular.url);
  recommended.gamesData = await loadGames(recommended.url);
  recentlyAdded.gamesData = await loadGames(recentlyAdded.url);
  displayData(popular);
  displayData(relevant);
  displayData(recommended);
  displayCarouselData(recentlyAdded);
}

onStart();

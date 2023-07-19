import {
  createGameCardElement,
  getCategoryGames,
  getUserData,
  loadGames,
  loadGamesFromUrl,
  openSideNav,
  setActiveItem,
  toggleMenu,
} from "./utilities.js";

//global vars
const logoutBtn = document.getElementById("logout-btn");
const platformMenu = document.querySelectorAll(".platform-menu a");
const loader = document.querySelector(".loading");
const platformName = document.querySelector(".platform-name");
const urlConfig = {
  searchParam: location.search,
  params: new URLSearchParams(location.search),
  value: new URLSearchParams(location.search).get("platform"),
  menu: platformMenu,
  menuName: platformName,
  property: "platform",
};
let url = `https://free-to-play-games-database.p.rapidapi.com/api/games?platform=${urlConfig.value}`;

// function display data coming from api
function displayData(gamesData) {
  const parentElem = document.querySelector(".games .row");
  parentElem.innerHTML = "";
  for (let i = 0; i < gamesData.length; i++)
    createGameCardElement(gamesData[i], parentElem);
  loader.classList.add("d-none");
}

//functions related to events
//further reading required
async function handlePlatformClick(e) {
  e.preventDefault();
  urlConfig.value = e.target.dataset.platform;
  const newUrl = new URL(window.location.href);
  newUrl.searchParams.set("platform", urlConfig.value);
  history.pushState({}, "", newUrl);
  const apiUrl = `https://free-to-play-games-database.p.rapidapi.com/api/games?platform=${urlConfig.value}`;
  const data = await loadGames(apiUrl);
  setActiveItem(urlConfig);
  displayData(data);
}

function handleCategoryClick(e) {
  const category = e.target.dataset.category;
  getCategoryGames(category);
}

//events
document.querySelectorAll(".categories-menu a").forEach((a) => {
  a.addEventListener("click", handleCategoryClick);
});

platformMenu.forEach((a) => {
  a.addEventListener("click", handlePlatformClick);
});

window.addEventListener("popstate", () => {
  loadGamesFromUrl(urlConfig, url);
});
toggleMenu.addEventListener("click", openSideNav);
logoutBtn.addEventListener("click", () =>
  localStorage.removeItem("activeUser"),
);

async function onStart() {
  getUserData();
  const gamesData = await loadGames(url);
  displayData(gamesData);
  setActiveItem(urlConfig);
}

onStart()
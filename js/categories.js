import {
  createGameCardElement,
  getPlatformGames,
  getUserData,
  loadGames,
  loadGamesFromUrl,
  openSideNav,
  setActiveItem,
  toggleMenu,
} from "./utilities.js";

//global vars
const categoriesMenu = document.querySelectorAll(".categories-menu a");
const loader = document.querySelector(".loading");
const catName = document.querySelector(".category-name");
const logoutBtn = document.getElementById("logout-btn");
const urlConfig = {
  searchParam: location.search,
  params: new URLSearchParams(location.search),
  value: new URLSearchParams(location.search).get("category"),
  menu: categoriesMenu,
  menuName: catName,
  property: "category",
};
let url = `https://free-to-play-games-database.p.rapidapi.com/api/games?category=${urlConfig.value}`;

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
async function handleCategoryClick(e) {
  e.preventDefault();
  urlConfig.value = e.target.dataset.category;
  const newUrl = new URL(window.location.href);
  newUrl.searchParams.set("category", urlConfig.value);
  history.pushState({}, "", newUrl);
  const apiUrl = `https://free-to-play-games-database.p.rapidapi.com/api/games?category=${urlConfig.value}`;
  const data = await loadGames(apiUrl);
  setActiveItem(urlConfig);
  displayData(data);
}

function handlePlatformClick(e) {
  const platform = e.target.dataset.platform;
  getPlatformGames(platform);
}

//events
document.querySelectorAll(".platform-menu a").forEach((a) => {
  a.addEventListener("click", handlePlatformClick);
});

categoriesMenu.forEach((a) => {
  a.addEventListener("click", handleCategoryClick);
});

window.addEventListener("popstate", async () => {
  const gamesData = await loadGamesFromUrl(urlConfig, url);
  displayData(gamesData);
});

toggleMenu.addEventListener("click", openSideNav);

logoutBtn.addEventListener("click", () =>
  localStorage.removeItem("activeUser"),
);

//onstart function
async function onStart() {
  getUserData();
  const gamesData = await loadGames(url);
  displayData(gamesData);
  setActiveItem(urlConfig);
}

onStart();

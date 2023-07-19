import { getUsers } from "./validation.js";

export const loader = document.querySelector(".loading");
export const toggleMenu = document.querySelector(".toggle-menu");
export const menuContainer = document.querySelector(".navbar-container");

export function openSideNav() {
  toggleMenu.classList.toggle("open");
  menuContainer.classList.toggle("open-menu-container");
}

// dom creation functions
export function createGameCardElement(game, parentElem, isAuthorized = true) {
  // Create a new div element with the class "col-md-4"
  const newColDiv = document.createElement("div");
  newColDiv.className = "col col-md-6 col-lg-4";

  // Create a new card element
  const newCard = document.createElement("div");
  newCard.className = "card text-white";

  const newImage = document.createElement("img");
  newImage.className = "card-img-top";
  newImage.src = game.thumbnail;
  newImage.alt = game.title;
  newImage.loading = "lazy";

  const newCardBody = document.createElement("div");
  newCardBody.className = "card-body";

  const newGameName = document.createElement("h2");
  newGameName.className = "game-name h4";
  newGameName.textContent = game.title;

  const newGameDesc = document.createElement("div");
  newGameDesc.className =
    "game-description d-flex align-items-start justify-content-between";

  const newCardText = document.createElement("p");
  newCardText.className = "card-text pe-2 overflow-hidden";
  newCardText.textContent = game.short_description;

  const newBadge = document.createElement("span");
  newBadge.className = "badge text-bg-semi-light px-3 py-2";
  newBadge.textContent = game.genre;

  newGameDesc.appendChild(newCardText);
  newGameDesc.appendChild(newBadge);
  newCardBody.appendChild(newGameName);
  newCardBody.appendChild(newGameDesc);
  newCard.appendChild(newImage);
  newCard.appendChild(newCardBody);

  newColDiv.appendChild(newCard);
  parentElem.appendChild(newColDiv);

  //event
  newCard.addEventListener("click", function () {
    if (isAuthorized) getGameDetails(game.id);
    else {
      showErrorModal();
    }
  });
}

// api function
export async function loadGames(url, isloaderReq = true) {
  if (isloaderReq) loader.classList.remove("d-none");
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "63025334acmsh2ee60f3746a44a7p1b027cjsn24fce81a5fa5",
      "X-RapidAPI-Host": "free-to-play-games-database.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    return await response.json();
  } catch (error) {
    console.error(error);
  }
}

export function getGameDetails(id) {
  location.href = `./details.html?id=${id}`;
}

export function displayData(
  { gamesData, start, end, row },
  isAuthorized = true,
) {
  for (let i = start; i < end; i++)
    createGameCardElement(gamesData[i], row, isAuthorized);
  loader.classList.add("d-none");
}

export function setActiveItem(urlConfig) {
  urlConfig.menu.forEach(function (menuItem) {
    if (urlConfig.value === menuItem.dataset[urlConfig.property]) {
      menuItem.classList.add("active");
      urlConfig.menuName.innerText = menuItem.innerText;
    } else {
      menuItem.classList.remove("active");
    }
  });
}

// for pressing back button from the browser (load data without refresh)
export async function loadGamesFromUrl(urlConfig, url) {
  urlConfig.searchParam = location.search;
  urlConfig.params = new URLSearchParams(urlConfig.searchParam);
  urlConfig.value = urlConfig.params.get(urlConfig.property);
  setActiveItem(urlConfig);
  return await loadGames(url);
}

//functions associated with routing
export function getCategoryGames(category) {
  location.href = `./categories.html?category=${category}`;
}

export function getPlatformGames(platform) {
  location.href = `./platform.html?platform=${platform}`;
}

export function getActiveUser() {
  const users = getUsers();
  const token = localStorage.getItem("activeUser").replace(/"/g, ""); // Remove quotation marks from token
  return users.find((user) => user.token === token);
}

export function getActiveUserIndex() {
  const users = getUsers();
  const token = localStorage.getItem("activeUser").replace(/"/g, ""); // Remove quotation marks from token
  return users.findIndex((user) => user.token === token);
}

export function getUserData() {
  const activeUser = getActiveUser();
  document.querySelector(".profile-img img").src = activeUser.img;
  document.getElementById("user-name").textContent = activeUser.fName;
}

function showErrorModal() {
  const modal = document.getElementById("error-modal");
  modal.classList.add("show-modal");
  setTimeout(() => {
    modal.classList.remove("show-modal");
  }, 7000);
}

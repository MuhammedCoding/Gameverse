import {getUsers} from "./validation.js";
import {openSideNav, toggleMenu} from "./utilities.js";

// variables
const email = document.getElementById("email");
const password = document.getElementById("password");
const passwordError = document.getElementById("password-error");
const form = document.querySelector("form");
const passIcon = document.querySelector(".password-icon");
let emailIndex = -1;
let usersArrayList = getUsers() === null ? [] : getUsers();

//events
form.addEventListener("submit", function (e) {
  password.classList.remove("is-invalid");
  email.classList.remove("is-invalid");
  e.preventDefault();
  if (checkUserValidation()) {
    localStorage.setItem(
      "activeUser",
      JSON.stringify(usersArrayList[emailIndex].token),
    );
    location.href = "./home.html";
  }
});

passIcon.addEventListener("click", function () {
  if (passIcon.classList.contains("fa-eye")) {
    password.type = "text";
    passIcon.classList.replace("fa-eye", "fa-eye-slash");
  } else {
    password.type = "password";
    passIcon.classList.replace("fa-eye-slash", "fa-eye");
  }
});

toggleMenu.addEventListener("click", openSideNav);

//functions
function checkUserValidation() {
  return emailValidation() && passwordValidation();
}

function passwordValidation() {
  if (password.value === usersArrayList[emailIndex]?.password) {
    return true;
  } else {
    if (emailValidation()) {
      password.classList.remove("is-valid");
      password.classList.add("is-invalid");
      passwordError.innerHTML = "Please Enter the correct password";
      return false;
    }
    return false;
  }
}

function emailValidation() {
  const emails = usersArrayList.map((user) => user.email);

  if (emails.includes(email.value)) {
    emailIndex = emails.indexOf(email.value);
    return true;
  }

  email.classList.remove("is-valid");
  email.classList.add("is-invalid");

  return false;
}


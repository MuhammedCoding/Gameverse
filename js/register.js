"use strict";

import {checkValidation, generateUniqueToken, getUsers, regex,} from "./validation.js";
import {openSideNav, toggleMenu} from "./utilities.js";
// variables
const inputs = Array.from(document.querySelectorAll("input"));
const form = document.querySelector("form");
const passIcon = document.querySelector(".password .password-icon");
const confirmPassIcon = document.querySelector(
  ".confirm-password .password-icon",
);
let usersArrayList = getUsers() === null ? [] : getUsers();

//array destructuring
const [firstName, lastName, email, age, password, confirmPassword] = inputs;

//events on inputs
firstName.addEventListener("blur", function () {
  checkValidation(firstName, regex.name);
});

lastName.addEventListener("blur", function () {
  checkValidation(lastName, regex.name);
});
password.addEventListener("blur", function () {
  checkValidation(password, regex.password);
});
age.addEventListener("blur", function () {
  checkValidation(age, regex.age);
});
email.addEventListener("blur", function () {
  checkValidation(email, regex.email);
});

confirmPassword.addEventListener("blur", checkConfirmPass);

passIcon.addEventListener("click", function () {
  passIconClickHandler(password, passIcon);
});
confirmPassIcon.addEventListener("click", function () {
  passIconClickHandler(confirmPassword, confirmPassIcon);
});

//events on form submission
form.addEventListener("submit", function (e) {
  e.preventDefault();

  if (
    checkValidation(firstName, regex.name) &&
    checkValidation(email, regex.email) &&
    checkValidation(lastName, regex.name) &&
    checkValidation(password, regex.password) &&
    checkValidation(age, regex.age) &&
    checkConfirmPass()
  ) {
    setNewUser();
  }
});

//utility functions
function setNewUser() {
  const newUser = {
    fName: firstName.value,
    lName: lastName.value,
    email: email.value,
    password: password.value,
    age: age.value,
    img: "assets/images/User.png",
    token: generateUniqueToken(usersArrayList),
  };

  if (usersArrayList.map((user) => user.email).includes(newUser.email)) {
    const msg = document.getElementById("msg");
    msg.innerHTML = "Sorry this email is already registered";
    return;
  }

  usersArrayList.push(newUser);
  setLocalStorage();
  location.href = "./index.html";
}

function setLocalStorage() {
  localStorage.setItem("users", JSON.stringify(usersArrayList));
}

function checkConfirmPass() {
  if (password.value === confirmPassword.value) {
    confirmPassword.classList.remove("is-invalid");
    confirmPassword.classList.add("is-valid");
    return true;
  }
  confirmPassword.classList.remove("is-valid");
  confirmPassword.classList.add("is-invalid");
  return false;
}

function passIconClickHandler(input, icon) {
  if (icon.classList.contains("fa-eye")) {
    input.type = "text";
    icon.classList.replace("fa-eye", "fa-eye-slash");
  } else {
    input.type = "password";
    icon.classList.replace("fa-eye-slash", "fa-eye");
  }
}

toggleMenu.addEventListener("click", openSideNav);

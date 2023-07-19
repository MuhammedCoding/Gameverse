"use strict";
import { checkValidation, getUsers, regex } from "./validation.js";
import {
  getActiveUser,
  getActiveUserIndex,
  getUserData,
  openSideNav,
  toggleMenu,
} from "./utilities.js";

let activeUser = getActiveUser();
let users = getUsers();

const currentPassInput = document.getElementById("currentPass");
const newPassInput = document.getElementById("newPass");
const confirmPasswordInput = document.getElementById("confirmPassword");
const imgInput = document.getElementById("imgInput");
const reader = new FileReader();
const logoutBtn = document.getElementById("logout-btn");
const emailInput = document.getElementById("email");
const form = document.querySelector("form");

let profileImage = document.querySelector(".profile-img-preview img");
let { fName: firstName, lName: lastName, img, password, email } = activeUser;

function setFormDetails() {
  const firstNameInput = document.getElementById("firstName");
  const lastNameInput = document.getElementById("lastName");
  firstNameInput.value = firstName;
  lastNameInput.value = lastName;
  emailInput.value = email;
  profileImage.src = img;
}

(async function () {
  setFormDetails();
})();

//events

imgInput.addEventListener("change", imageInputHandler);
emailInput.addEventListener("blur", () => {
  if (emailInput.value !== email) checkValidation(emailInput, regex.email);
});
//password event listener
currentPassInput.addEventListener("blur", checkCurrentPassword);
newPassInput.addEventListener("blur", checkNewPass);
confirmPasswordInput.addEventListener("blur", checkConfirmPass);
form.addEventListener("submit", handleFormSubmit);
toggleMenu.addEventListener("click", openSideNav);
logoutBtn.addEventListener("click", () =>
  localStorage.removeItem("activeUser"),
);

//functions related to events
function imageInputHandler() {
  const file = this.files[0];

  if (file) {
    reader.readAsDataURL(file);
  }

  reader.addEventListener("load", function () {
    profileImage.src = reader.result;
  });
}

function checkCurrentPassword() {
  const submitBtn = document.getElementById("submitBtn");

  if (currentPassInput.value !== password) {
    currentPassInput.classList.add("is-invalid");
    currentPassInput.classList.remove("is-valid");
    emailInput.setAttribute("readonly", "");
    newPassInput.setAttribute("readonly", "");
    confirmPasswordInput.setAttribute("readonly", "");
    submitBtn.setAttribute("disabled", "");
  } else {
    currentPassInput.classList.remove("is-invalid");
    currentPassInput.classList.add("is-valid");
    emailInput.removeAttribute("readonly");
    newPassInput.removeAttribute("readonly");
    submitBtn.removeAttribute("disabled");
  }
}

function checkConfirmPass() {
  if (!confirmPasswordInput.hasAttribute("readonly")) {
    if (confirmPasswordInput.value !== newPassInput.value) {
      confirmPasswordInput.classList.add("is-invalid");
      confirmPasswordInput.classList.remove("is-valid");
    } else {
      confirmPasswordInput.classList.remove("is-invalid");
      confirmPasswordInput.classList.add("is-valid");
    }
  }
}

function checkNewPass() {
  if (newPassInput.value !== "") {
    if (checkValidation(newPassInput, regex.password))
      confirmPasswordInput.removeAttribute("readonly");
  }
}

function showSuccessModal() {
  const modal = document.querySelector(".success-modal");
  modal.classList.add("show-modal");
  setTimeout(() => {
    modal.classList.remove("show-modal");
  }, 3000);
}

function handleFormSubmit(e) {
  e.preventDefault();

  const tempUser = { ...activeUser };
  //Get the form data
  const formData = {
    email: emailInput.value,
    currentPass: currentPassInput.value,
    newPass: newPassInput.value,
    confirmPassword: confirmPasswordInput.value,
  };

  let updated = false;

  if (formData.email !== email) {
    tempUser.email = formData.email;
    updated = true;
  }
  if (
    formData.newPass !== "" &&
    formData.newPass === formData.confirmPassword
  ) {
    if (formData.currentPass === password) {
      tempUser.password = formData.newPass;
      updated = true;
    }
  }
  if (reader.result !== img && reader.result !== null) {
    tempUser.img = reader.result;
    updated = true;
  }
  // save the updated data to local storage
  if (updated) {
    const index = getActiveUserIndex();
    users[index] = { ...tempUser };
    localStorage.setItem("users", JSON.stringify(users));
    showSuccessModal();
    getUserData();
  }
}

function onStart() {
  getUserData();
}

onStart();

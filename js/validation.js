"use strict";

export function getUsers() {
  return JSON.parse(localStorage.getItem("users"));
}

//regex
export const regex = {
  name: /^[a-zA-Z0-9\s@,=%$#&_\u0600-\u06FF]{2,20}$/,
  email: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
  age: /^([1-7][2-9]|[2-7][0-9]|80)$/,
  password: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
};

export function checkValidation(input, regex) {
  if (regex.test(input.value)) {
    input.classList.add("is-valid");
    input.classList.remove("is-invalid");
    return true;
  }
  input.classList.remove("is-valid");
  input.classList.add("is-invalid");
  return false;
}

function generateToken(length = 32) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";

  for (let i = 0; i < length; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return token;
}

export function generateUniqueToken(users, length = 32) {
  let token = generateToken(length);
  while (isTokenTaken(users, token)) {
    token = generateToken(length);
  }
  return String(token);
}

function isTokenTaken(users, token) {
  return users.some((user) => user.token === token);
}

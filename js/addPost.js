"use strict";
console.log("addPost.js file was loaded");

const baseUrl = "http://localhost:5000";

// title, image, author, tags, date, body

const els = {
  form: document.forms[0],
  title: document.getElementById("title"),
  image: document.getElementById("image"),
  author: document.getElementById("author"),
  tags: document.getElementById("tags"),
  date: document.getElementById("date"),
  body: document.getElementById("body"),
  errorList: document.getElementById("errorList"),
  alert: document.getElementById("alert"),
};
console.log("els ===", els);

els.form.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("pateikta");
  const newPostFromInputs = {
    title: els.title.value,
    image: els.image.value,
    author: els.author.value,
    tags: els.tags.value.split(",").map((str) => str.trim()),
    date: els.date.value,
    body: els.body.value,
  };
  console.log("newPostFromInputs ===", newPostFromInputs);
  sendNewPostFetch(newPostFromInputs);
});

function sendNewPostFetch(newPostObj) {
  fetch(`${baseUrl}/posts`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(newPostObj),
  })
    .then((resp) => {
      console.log("sekme");
      return resp.json();
    })
    .then((ats) => {
      console.log("ats ===", ats);
      // kai sekme tai naviguojam i home page
      if (ats.is) {
        window.location.href = "index.html";
        return;
      }
      if (Array.isArray(ats.error) && ats.error.length > 0) {
        console.log("klaida");
        console.log("ats.error===", ats.error);
        setErrors(ats.error);
      }
    })
    // nesekmes atveju console kad klaida
    // atvaizduojame visas klaidas
    .catch((error) => console.warn(error));
}

function setErrors(errorsArr) {
  // issivalyti klaidu konteineri
  els.errorList.innerHTML = "";
  // arvaizduoja klaida
  // sukti cikla per klaidas
  errorsArr.forEach((errObj) => {
    // kurti li
    const liEl = document.createElement("li");
    liEl.textContent = errObj.message;
    els.errorList.append(liEl);
  });
  els.alert.classList.remove("d-none");
}

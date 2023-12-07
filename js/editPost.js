"use strict";
console.log("editPost.js file was loaded");

const baseUrl = "http://localhost:5000";
let currentPostId = "5703187329379835";

const els = {
  form: document.forms[0],
  image: document.getElementById("image"),
  title: document.getElementById("title"),
  body: document.getElementById("body"),
  author: document.getElementById("author"),
  tags: document.getElementById("tags"),
  date: document.getElementById("date"),
  errorList: document.getElementById("errorList"),
  alert: document.getElementById("alert"),
};
console.log("els ===", els);

flow();
async function flow() {
  // eiga
  getSetCurrentPostId();

  // getSinglePost parsiustu posta ir grazintu
  const currentPostObj = await getSinglePost(
    `${baseUrl}/posts/${currentPostId}`
  );
  console.log("currentPostObj ===", currentPostObj);
  // supildom formos inputus
  fillFormFields(currentPostObj);
}

function getSinglePost(url) {
  return fetch(url)
    .then((resp) => resp.json())
    .then((postObj) => {
      // console.log('postObj ===', postObj);
      // callback(postObj);
      return postObj;
    })
    .catch((error) => {
      console.warn("ivyko klaida:", error);
    });
}

function getSetCurrentPostId() {
  // gauti id is Url parametru
  const urlParamsObj = new URLSearchParams(window.location.search);
  // console.log('urlParamsObj.get(town) ===', urlParamsObj.get('town'));
  currentPostId = urlParamsObj.get("postId");
  console.log("currentPostId ===", currentPostId);

  if (currentPostId === null) {
    console.warn("Nera post id");
  }
}

function fillFormFields(postObj) {
  // postObj === currentPostObj
  // paimti info ir postObj ir sudeti i formos laukus

  els.image.value = postObj.image;
  els.title.value = postObj.title;
  els.body.value = postObj.body;
  els.author.value = postObj.author;
  els.tags.value = postObj.tags.join(", ");
  els.date.value = postObj.date;
}

// formai uzdeti pateikimo pasiklausyma
els.form.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("pateikta");
  const updatedPostFieldsObj = {
    image: els.image.value,
    title: els.title.value,
    body: els.body.value,
    author: els.author.value,
    tags: els.tags.value.split(",").map((str) => str.trim()),
    date: els.date.value,
  };
  console.log("updatedPostFieldsObj ===", updatedPostFieldsObj);
  sendUpdatePostFetch(updatedPostFieldsObj);
});

function sendUpdatePostFetch(updatesObj) {
  fetch(`${baseUrl}/posts/${currentPostId}`, {
    method: "PUT",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(updatesObj),
  })
    .then((resp) => resp.json())
    .then((updateResult) => {
      console.log("updateResult ===", updateResult);
      // sugryzti i single post kai sekme (turim id atsakyme)
      if (updateResult.id) {
        window.location.href = `/single-post.html?postId=${currentPostId}&postUpdate=true`;
        return;
      }
      // pranesti apie klaidas kai nesekme
      // jei gavom ne tuscia klaidu masyva
      if (Array.isArray(updateResult.error) && updateResult.error.length > 0) {
        // klaida
        console.log("klaida");
        // nesekmes atveju console log klaidu masyva is back end
        console.log("updateResult.error ===", updateResult.error);
        // atvaizduojam visas klaida klaudu sarase virs formos
        setErrrors(updateResult.error);
      }
    })
    .catch((error) => {
      console.warn("sendUpdatePostFetch ivyko klaida:", error);
    });
}

function setErrrors(errorArr) {
  // isssivalyti klaidu konteineri
  els.errorList.innerHTML = "";
  // atvaizduoja kaidas
  // 1. sukti cikla per klaida
  errorArr.forEach((errObj) => {
    // 2. kurti li
    const liEl = document.createElement("li");
    liEl.textContent = errObj.message;
    // 3. patalpinti li
    els.errorList.append(liEl);
  });
  els.alert.classList.remove("d-none");
}

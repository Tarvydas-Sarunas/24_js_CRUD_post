"use strict";
console.log("single.js file was loaded");

const baseUrl = "http://localhost:5000";
let currentPostId = "5703187329379835";

const els = {
  title: document.getElementById("title"),
  image: document.getElementById("image"),
  author: document.getElementById("author"),
  date: document.getElementById("date"),
  tags: document.getElementById("tags"),
  body: document.getElementById("body"),
  editThisPost: document.getElementById("editThisPost"),
};
console.log("els ===", els);

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

// su funkcija parsiusti ir iskonsolinti konretu posta kurio id yra currentPostId

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

async function flow() {
  getSetCurrentPostId();
  const postsArr = await getSinglePost(
    `${baseUrl}/posts/${currentPostId}`,
    fillHtmlPage
  );
  fillHtmlPage(postsArr);
  setEditLinkUrl();
}

function fillHtmlPage(currentPostObj) {
  // supildyti html reikmes is postObj
  els.title.textContent = currentPostObj.title;
  els.date.textContent = currentPostObj.date;
  els.body.textContent = currentPostObj.body;
  els.author.textContent = currentPostObj.author;

  tagsToHTML(currentPostObj.tags);
  if (currentPostObj.image === "") {
    els.image.classList.add("d-none");
    return;
  } else {
    els.image.src = currentPostObj.image;
    els.image.alt = currentPostObj.title;
  }
}

function tagsToHTML(tagsArr) {
  //
  // isivalyti kontaineri
  els.tags.innerHTML = "";
  tagsArr.forEach((postTag) => {
    const liEl = document.createElement("li");
    liEl.className = "badge rounded-pill text-bg-success fs-5";
    liEl.textContent = postTag;
    els.tags.append(liEl);
  });
}
function setEditLinkUrl() {
  els.editThisPost.href = `edit-post.html?postId=${currentPostId}`;
}

"use strict";
console.log("main.js file was loaded");

const els = {
  postListEl: document.getElementById("postList"),
};
console.log(els);
const baseUrl = "http://localhost:5000";

const postsUrl = `${baseUrl}/posts`;

// sukurti funkcija kuri parsiunia ir iskonsolina visus postus
init();
async function init() {
  let mainPostsArr = await getAllPosts();
  console.log("mainPostsArr ===", mainPostsArr);
  makePostsHtml(mainPostsArr);
}

async function getAllPosts() {
  try {
    const resp = await fetch(postsUrl);
    const posts = await resp.json();
    console.log("posts ===", posts);
    return posts;
  } catch (error) {
    console.warn(error);
  }
}

function makePostsHtml(arr) {
  arr.forEach((postObj) => {
    // sukuriame viena html elementa
    const singlePostEl = createSinglePosteEl(postObj);
    // deti i sarasa
    els.postListEl.append(singlePostEl);
  });
}

function createSinglePosteEl(singlePosteObj) {
  const liEl = document.createElement("li");
  const innerDiv = `
  <div class="card">
          <div class="card-body">
            <h5 class="card-title">${singlePosteObj.title}</h5>
            <h6 class="card-subtitle mb-2 text-body-secondary"> ${
              singlePosteObj.author
            } </h6>
            <p class="card-text">${singlePosteObj.body.slice(0, 75)}... </p>
            <a href="single-post.html" class="card-link btn btn-primary">Read more</a>

          </div>
        </div>
  `;
  liEl.innerHTML = innerDiv;
  return liEl;
}

// sugeneruoti postus htmle

// async function generateHTML() {
//   let postsUrl = await getAllPosts();

//   postsUrl.forEach((obj) => {
//     const newLi = document.createElement("li");
//     postListEl.append(newLi);
//     const cardDiv = document.createElement("div");
//     const cardBodyDiv = document.createElement("div");
//     newLi.append(cardDiv);
//     cardDiv.append(cardBodyDiv);
//     const h5El = document.createElement("h5");
//     h5El.textContent = obj.title;
//     const h6El = document.createElement("h6");
//     h6El.textContent = obj.author;
//     const pEl = document.createElement("p");
//     pEl.textContent = obj.body;
//     const aEl = document.createElement("a");
//     aEl.textContent = "Read More";
//     cardBodyDiv.append(h5El, h6El, pEl, aEl);
//   });
// }
// generateHTML();

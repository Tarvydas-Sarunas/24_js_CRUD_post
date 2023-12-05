"use strict";
console.log("main.js file was loaded");

const ulEl = document.getElementById("postList");

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
getAllPosts();
// sugeneruoti postus htmle
async function generateHTML() {
  let postsUrl = await getAllPosts();

  postsUrl.forEach((obj) => {
    const newLi = document.createElement("li");
    ulEl.append(newLi);
    const cardDiv = document.createElement("div");
    const cardBodyDiv = document.createElement("div");
    newLi.append(cardDiv);
    cardDiv.append(cardBodyDiv);
    const h5El = document.createElement("h5");
    h5El.textContent = obj.title;
    const h6El = document.createElement("h6");
    h6El.textContent = obj.author;
    const pEl = document.createElement("p");
    pEl.textContent = obj.body;
    const aEl = document.createElement("a");
    aEl.textContent = "Read More";
    cardBodyDiv.append(h5El, h6El, pEl, aEl);
  });
}
generateHTML();

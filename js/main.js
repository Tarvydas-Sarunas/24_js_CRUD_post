"use strict";
console.log("main.js file was loaded");

const els = {
  postListEl: document.getElementById("postList"),
};
console.log(els);
const baseUrl = "http://localhost:5000";

const postsUrl = `${baseUrl}/posts`;
// const deletePostsUrl = `${baseUrl}/posts`;

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
  // isvalyti konteineri pries generuojant
  els.postListEl.innerHTML = "";
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
    <div class="card-header"> Id: ${singlePosteObj.id} 
    </div>
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
  // sukurkime mygtuka delete
  const deleteBtnEl = document.createElement("button");
  deleteBtnEl.textContent = "Delete";
  deleteBtnEl.classList.add("btn", "btn-outline-danger");
  deleteBtnEl.addEventListener("click", () =>
    sendDeleteFetch(singlePosteObj.id)
  );
  const cartBody = liEl.querySelector(".card-body");
  cartBody.append(deleteBtnEl);
  return liEl;
}

function sendDeleteFetch(idToDelete) {
  console.log("deleting post", idToDelete);
  // istrinimo mechanizmas daryti fetch su delete mechanizmu
  fetch(`${postsUrl}/${idToDelete} `, {
    method: "DELETE",
  })
    .then((resp) => {
      // istrinti pavyko
      if (resp.status === 200) {
        console.log("strinti pavyko");
        // atnaujiname sarasa
        init();
      } else {
        // istrinti nepavyko
        console.log("strinti nepavyko");
      }

      return resp.json();
    })
    .then((rez) => {
      console.log("rez ===", rez);
    })
    .catch((error) => {
      console.log("error ===", error);
    });
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

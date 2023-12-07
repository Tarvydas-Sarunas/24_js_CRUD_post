"use strict";
console.log("main.js file was loaded");

const baseUrl = "http://localhost:5000";
const postsUrl = `${baseUrl}/posts`;

// sukurti funkcija kuri parsiunia ir iskonsolina visus postus
const els = {
  postListEl: document.getElementById("postList"),
};
console.log("els ===", els);

init();
async function init() {
  let mainPostsArr = await getAllPosts();
  console.log("mainPostsArr ===", mainPostsArr);
  // console.log(JSON.stringify(mainPostsArr[0]));
  makePostsHtml(mainPostsArr);
}

function getAllPosts() {
  return fetch(postsUrl)
    .then((resp) => resp.json())
    .then((postsArr) => {
      // console.log('postsArr ===', postsArr);
      return postsArr;
    })
    .catch((error) => {
      console.warn("ivyko klaida:", error);
    });
}

// sugeneruoti postus htmle
function makePostsHtml(arr) {
  // isvalyti konteineri pries generuojant
  els.postListEl.innerHTML = "";
  arr.forEach((postObj) => {
    // sukuriam viena post html el
    const siglePostEl = createSinglePostEl(postObj);
    // console.log('siglePostEl ===', siglePostEl);
    // deti i sarasa
    els.postListEl.append(siglePostEl);
  });
}

function createSinglePostEl(singlePostObj) {
  const liEl = document.createElement("li");
  const innerDiv = `
    <div class="card">
      <div class="card-header">
        id: ${singlePostObj.id}
      </div>
      <div class="card-body">
        <h5 class="card-title">${singlePostObj.title}</h5>
        <h6 class="card-subtitle mb-2 text-body-secondary">${
          singlePostObj.author
        }</h6>
        <p class="card-text">${singlePostObj.body.slice(0, 75)}...</p>
        <a href="single-poste.html?postId=${
          singlePostObj.id
        }" class="btn btn-primary card-link">Read more</a>
      </div>
    </div>
  `;
  liEl.innerHTML = innerDiv;
  // sukurti mygtuka delete
  const deleteBtnEl = document.createElement("button");
  deleteBtnEl.classList.add("btn", "btn-outline-danger");
  deleteBtnEl.textContent = "Delete";

  deleteBtnEl.addEventListener("click", () =>
    sendDeleteFetch(singlePostObj.id)
  );
  liEl.querySelector(".card-body").append(deleteBtnEl);

  return liEl;
}

function sendDeleteFetch(idToDelete) {
  console.log("deleting post", idToDelete);
  // fetch su metodu delete
  fetch(`${postsUrl}/${idToDelete}`, {
    method: "DELETE",
  })
    .then((resp) => {
      console.log("resp ===", resp);
      if (resp.status === 200) {
        // istrinti pavyko
        console.log("// istrinti pavyko");
        // atnaujinam sarasa
        init();
      } else {
        // istrinti nepavyko
        console.log("// istrinti nepavyko");
      }
    })
    .catch((error) => {
      console.warn("ivyko klaida deleting:", error);
    });
}

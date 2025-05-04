function getUserData() {
  let form = document.querySelector("form");
  let submit = document.querySelector("#submit");
  let userCard = document.querySelector(".user-card");
  let btn = document.querySelector("button");
  let body = document.body;
  let isDarkMode = true;
  let input = document.querySelector("input");

  btn.addEventListener("click", function () {
    if (isDarkMode) {
      body.style.backgroundColor = "white";
      body.style.color = "black";
      btn.style.backgroundColor = "white";
      btn.style.color = "black";
      isDarkMode = false;
      input.style.border = "1px solid black";
    } else {
      body.style.backgroundColor = "black";
      body.style.color = "white";
      btn.style.backgroundColor = "black";
      btn.style.color = "white";
      input.style.border = "1px solid white";
      isDarkMode = true;
    }
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var username = input.value.trim();
    if (!username) return;
    console.log(username);
    userCard.innerHTML = `loadig...`;
    userCard.style.fontSize = "1.5rem";

    fetch(`https://api.github.com/users/${username}`)
      .then(function (response) {
        if (response.ok) userCard.style.opacity = 1;
        if (!response.ok) {
          userCard.innerHTML = `User not found`;
          userCard.style.fontSize = "1.5rem";
          return;
        }
        return response.json();
      })
      .then(function (data) {
        fetch(
          `https://api.github.com/users/${username}/repos?sort=updated&per_page=5`
        )
          .then(repos => repos.json())
          .then(reposData => {
            let count = 0;
            let reposLink = reposData
              .map(repo => {
                count++;
                return `${count}. <a href="${repo.html_url}" target="_blank">${repo.name}</a> <br>`;
              })
              .join("");
            console.log(reposLink);
            userCard.innerHTML = `
               <h3>${data.login || data.name}</h3>
               <p><strong>Name:</strong> ${data.name || "N/A"}</p>
               <p><strong>Bio:</strong> ${data.bio || "N/A"}</p>
               <p><strong>location:</strong> ${data.location || "Unknown"}</p>
               <p><strong>Public Repos:</strong> ${data.public_repos}</p>
               <p><strong>Followers:</strong> ${
                 data.followers
               } <strong>|</strong> <strong>Following:</strong> ${
              data.following
            }</p>
               <img
                 src="${data.avatar_url}"
                 alt=""
               />

               <div class="repos">
                 <h4>Top 5 Recent Repositories:</h4>
                 ${reposLink || "No public repositories found."}
               </div>`;
          });
      });
  });
}
getUserData();


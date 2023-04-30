//Variables

const rootElem = document.getElementById("root");
// Div for showing episodes
const showEpisodseRow = document.querySelector(".row");
// Search input
const searchUser = document.querySelector("#searchUser");
// Show the number of episodes based on search
const searchNumResult = document.querySelector(".epi-num");
// Select input
const selectEpisodes = document.querySelector("#select-episodes");
// Get an array of objects including all epiodes from episodes.js
const allEpisodes = getAllEpisodes();

//EventListeners

// display episodes on load
document.addEventListener("DOMContentLoaded", setup);
// Search episodes
searchUser.addEventListener("keyup", searchMovie);
// Search specific episodes based on select
selectEpisodes.addEventListener("change", selectMovie);

//Functions

// get all episodes
function setup() {
  // call the makeForEpisode function to built card for each of episodes
  makePageForEpisodes(allEpisodes);
}

//make card for each episode
function makePageForEpisodes(episodeList) {
  let output = "";
  episodeList.forEach((episode) => {
    output += `
      <div class="col">
        <div class="card h-100 px-0 mx-1">
        <img src="${episode.image.medium}" class="card-img-top mx-0" alt="...">
        <div class="card-body mb-4">
        <h5 >${episode.name} - S${episode.season
      .toString()
      .padStart(2, "0")}E${episode.season.toString().padStart(2, "0")}</h5>
          <p >${episode.summary}</p>
        </div>
        <a href="${
          episode.url
        }" class="btn btn-primary" style="position:absolute; bottom:10px; left:20px; right:20px;">See More</a>
      </div>
      </div>
    `;
    showEpisodseRow.innerHTML = output;
  });

  // Create option for each episodes in select after loading page
  allEpisodes.forEach((episode) => {
    const option = document.createElement("option");
    option.value = `S${episode.season
      .toString()
      .padStart(2, "0")}E${episode.number.toString().padStart(2, "0")}`;
    option.textContent = `S${episode.season
      .toString()
      .padStart(2, "0")}E${episode.number.toString().padStart(2, "0")} - ${
      episode.name
    }`;
    selectEpisodes.appendChild(option);
  });
}

// Show episodes based on live search
function searchMovie(e) {
  const selectedMovie = [];
  // Get the value of input
  let serchContent = e.target.value;
  if (serchContent == "") {
    setup();
    searchNumResult.textContent = "";
  } else {
    // Create case-insensitive RegExp
    let searchContentInsensitive = new RegExp(serchContent, "i");
    allEpisodes.forEach((episode) => {
      if (
        episode.name.match(searchContentInsensitive) !== null ||
        episode.summary.match(searchContentInsensitive) !== null
      ) {
        selectedMovie.push(episode);
      }
    });
    makePageForEpisodes(selectedMovie);
    searchNumResult.textContent = ` ${selectedMovie.length}/${allEpisodes.length} `;
  }
}

// select a specific episode
function selectMovie(e) {
  if (e.target.value == "allEpisodes") {
    searchUser.value = "";
    searchUser.disabled = false;
    setup();
  } else {
    searchUser.value = "";
    searchUser.disabled = true
    const season = e.target.value.slice(1, 3);
    const number = e.target.value.slice(4, 6);
    const selectedMovie = allEpisodes.filter(
      (episode) => episode.season == season && episode.number == number
    );
    makePageForEpisodes(selectedMovie);
  }
}

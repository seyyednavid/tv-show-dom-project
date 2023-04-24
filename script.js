//variables

const rootElem = document.getElementById("root"),
  showEpisodseRow = document.querySelector(".row"),
  // Search input
  searchUser = document.querySelector("#searchUser"),
  // Show the number of episodes based on search
  searchNumResult = document.querySelector(".epi-num"),
  // Get an array of objects including all epiodes from episodes.js
  allEpisodes = getAllEpisodes();

//eventListeners
eventlisteners();
function eventlisteners() {
  // display episodes on load
  document.addEventListener("DOMContentLoaded", setup);
  // Search episodes
  searchUser.addEventListener("keyup", searchMovie);
}

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
        <h5 >${episode.name} - S${
      episode.season < 10 ? "0" + episode.season : episode.season
    }E${episode.number < 10 ? "0" + episode.number : episode.number}</h5>
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
}

// show episodes based on live search
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

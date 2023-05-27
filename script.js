//Variables

const rootElem = document.getElementById("root");
// Div for showing episodes
const showEpisodseRow = document.querySelector(".row");
// Search input
const searchUser = document.querySelector("#searchUser");
// Show the number of episodes based on search
const searchNumResult = document.querySelector(".epi-num");
// Select shows
const selectShows = document.querySelector("#select-shows");
// Select Episodes
const selectEpisodes = document.querySelector("#select-episodes");
// get all shows
const allShows = getAllShows();
let allEpisodes;

//EventListeners
// display episodes on load
document.addEventListener("DOMContentLoaded", setup);
// Search specific Show based on select
selectShows.addEventListener("change", selectShow);
// Search specific episode based on select
selectEpisodes.addEventListener("change", selectEpisode);
// Search episodes
searchUser.addEventListener("keyup", searchMovie);

//Functions
// Get all shows
async function setup() {
  makePageForShows(allShows);
}

// Make card for all shows
function makePageForShows(allShows) {
  allShows.sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  );
  let output = "";
  allShows.forEach((show) => {
    output += `
      <div class="col" style="height: 550px">
        <div class="card h-100 px-0 mx-1">
          <img src="${
            show.image !== null ? show.image.medium : ""
          }" style="height: 250px" class="card-img-top mx-0" alt="...">
          <div class="card-body mb-4">
          <h5 class="text-primary">${show.name}</h5>
          <span class="badge text-bg-dark">Rated: ${show.rating.average}</span>
          <span class="badge text-bg-dark">Genres: ${show.genres}</span>
          <span class="badge text-bg-dark">Status: ${show.status}</span>
          <span class="badge text-bg-dark">Runtime: ${show.runtime}</span>
          <p>${
            show.summary.split(" ").length >= 25
              ? show.summary.split(" ").slice(0, 25).join(" ").concat("...")
              : show.summary.split(" ").slice(0, 25).join(" ")
          }</p>
          </div>
        </div>
      </div>
    `;
    showEpisodseRow.innerHTML = output;
  });

  // Create option for each show in select after loading page
  allShows.forEach((show) => {
    const option = document.createElement("option");
    option.value = show.name;
    option.textContent = show.name;
    selectShows.appendChild(option);
  });
}

// Search specific Shows based on select
async function selectShow(event) {
  if (event.target.value == "allSerials") {
    setup();
    //Remove options from episodes's select
    const options = selectEpisodes.getElementsByTagName("option");
    for (let i = options.length - 1; i > 0; i--) {
      selectEpisodes.removeChild(options[i]);
    }
    searchUser.value = "";
    searchUser.disabled = true;
  } else {
    searchUser.value = "";
    searchUser.disabled = false;
    //Remove options from episodes's select
    const options = selectEpisodes.getElementsByTagName("option");
    for (let i = options.length - 1; i > 0; i--) {
      selectEpisodes.removeChild(options[i]);
    }
    // Find selected movie
    const specificShow = allShows.find(
      (show) => show.name === event.target.value
    );
    // Determine show's id
    const specificShowID = specificShow.id;
    // Get all show's episodes
    allEpisodes = await getAllAvailableEpisodes(specificShowID);
    // make card for each episode
    makePageForEpisodes(allEpisodes);
  }
}

//Get all episodes via fetch
async function getAllAvailableEpisodes(showId) {
  // await response of the fetch call
  const response = await fetch(
    `https://api.tvmaze.com/shows/${showId}/episodes`
  );
  // only proceed once its resolved
  const data = await response.json();
  // only proceed once second promise is resolved
  return data;
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
      <p>${
        episode.summary.split(" ").length >= 25
          ? episode.summary.split(" ").slice(0, 25).join(" ").concat("...")
          : episode.summary.split(" ").slice(0, 25).join(" ")
      }</p>
        </div>
        <a href="${
          episode.url
        }" class="btn btn-primary" style="position:absolute; bottom:10px; left:20px; right:20px;" target="_blank">See More</a>
      </div>
      </div>
    `;
    showEpisodseRow.innerHTML = output;
  });

  // Create option for each episodes in select after loading page
  episodeList.forEach((episode) => {
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

// select a specific episode
function selectEpisode(event) {
  if (event.target.value == "allEpisodes") {
    searchUser.value = "";
    searchUser.disabled = false;
    //Remove options from episodes's select
    const options = selectEpisodes.getElementsByTagName("option");
    for (let i = options.length - 1; i > 0; i--) {
      selectEpisodes.removeChild(options[i]);
    }
    makePageForEpisodes(allEpisodes);
  } else {
    searchUser.value = "";
    searchUser.disabled = true;
    const season = event.target.value.slice(1, 3);
    const number = event.target.value.slice(4, 6);
    const selectedMovie = allEpisodes.filter(
      (episode) => episode.season == season && episode.number == number
    );
    makePageForEpisodes(selectedMovie);
  }
}

// Show episodes based on live search
function searchMovie(e) {
  const selectedMovie = [];
  // Get the value of input
  let serchContent = e.target.value;
  if (serchContent == "") {
    makePageForEpisodes(allEpisodes);
    searchNumResult.textContent = "";
  } else {
    // Create case-insensitive RegExp
    let searchContentInsensitive = new RegExp(serchContent, "i");
    allEpisodes.forEach((episode) => {
      if (
        episode.name.match(searchContentInsensitive) !== null ||
        episode.summary.slice(0, 25).match(searchContentInsensitive) !== null
      ) {
        selectedMovie.push(episode);
      }
    });
    makePageForEpisodes(selectedMovie);
    searchNumResult.textContent = ` ${selectedMovie.length}/${allEpisodes.length} `;
  }
}

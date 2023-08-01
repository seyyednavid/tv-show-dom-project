//Variables
// Div for showing episodes or movies
const showEpisodesRow = document.querySelector(".row");
const searchEpisodes = document.querySelector("#searchEpisodes");
// Show the number of episodes based on search
const searchNumResult = document.querySelector(".epi-num");
// Select related to shows
const selectShows = document.querySelector("#select-shows");
// Select related to episodes
const selectEpisodes = document.querySelector("#select-episodes");
let sortedShows;
let allEpisodes;

//EventListeners
// display episodes on load
document.addEventListener("DOMContentLoaded", setup);
// Search specific Show based on select
selectShows.addEventListener("change", selectShow);
// Search specific episode based on select
selectEpisodes.addEventListener("change", selectEpisode);
// Search episodes
searchEpisodes.addEventListener("keyup", searchMovie);

//Functions
// Get all shows
async function setup() {
  //get all shows with fetch
  const allShows = await getAllAvailableShows();
  // Sort the shows array and store the sorted version
  sortedShows = sortShowsByName(allShows);
  // Make card for all shows and create options for select
  makeCardForShows(sortedShows);
}

//Get all shows via fetch
async function getAllAvailableShows() {
  // await response of the fetch call
  const response = await fetch("https://api.tvmaze.com/shows");
  // only proceed once its resolved
  const data = await response.json();
  // only proceed once second promise is resolved
  return data;
}

// Sort shows by name
function sortShowsByName(allShows) {
  return allShows.sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  );
}

// Make card for all shows
function makeCardForShows(allShows) {
  searchEpisodes.disabled = true;
  let output = "";
  allShows.forEach((show) => {
    output += `
      <div class="col" style="height: 550px; width:280px">
        <div class="card h-100 px-0">
          <img src="${
            show.image !== null ? show.image.medium : ""
          }" style="height: 250px" class="card-img-top mx-0" alt="...">
          <div class="card-body mb-4">
          <h5 class="text-primary">${show.name}</h5>
          <span class="badge text-bg-dark">Rated: ${show.rating.average}</span>
          <span class="badge text-bg-dark">Genres: ${show.genres}</span>
          <span class="badge text-bg-dark">Status: ${show.status}</span>
          <span class="badge text-bg-dark">Runtime: ${show.runtime}</span>
          <p>${show.summary}</p>
          </div>
        </div>
      </div>
    `;
  });
  showEpisodesRow.innerHTML = output;

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
  searchEpisodes.value = "";
  if (event.target.value == "allSerials") {
    makeCardForShows(sortedShows);
    //Remove options from episodes's select
    const options = selectEpisodes.getElementsByTagName("option");
    for (let i = options.length - 1; i > 0; i--) {
      selectEpisodes.removeChild(options[i]);
    }
    searchEpisodes.disabled = true;
  } else {
    searchEpisodes.disabled = false;
    //Remove options from episodes's select
    const options = selectEpisodes.getElementsByTagName("option");
    for (let i = options.length - 1; i > 0; i--) {
      selectEpisodes.removeChild(options[i]);
    }
    // Find selected movie
    const specificShow = sortedShows.find(
      (show) => show.name === event.target.value
    );
    // Determine show's id
    const specificShowID = specificShow.id;
    // Get all show's episodes
    allEpisodes = await getAllAvailableEpisodes(specificShowID);
    // make card for each episode
    makeCardForEpisodes(allEpisodes);
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
function makeCardForEpisodes(episodeList) {
  let output = "";
  episodeList.forEach((episode) => {
    const paddedEpisodeSeason = episode.season.toString().padStart(2, "0");
    const paddedEpisodeNumber = episode.number.toString().padStart(2, "0");
    const episodeIdentifier = `S${paddedEpisodeSeason}E${paddedEpisodeNumber}`;
    output += `
      <div class="col" style="height: 420px; width:280px">
        <div class="card h-100 px-0 mx-1">
        <img src="${episode.image.medium}" class="card-img-top mx-0" alt="...">
        <div class="card-body mb-4">
        <h5 >${episode.name} - ${episodeIdentifier}</h5>
      <p>${episode.summary}</p>
        </div>
        <a href="${episode.url}" class="btn btn-primary" style="position:absolute; bottom:10px; left:20px; right:20px;" target="_blank">See More</a>
      </div>
      </div>
    `;
  });
  showEpisodesRow.innerHTML = output;

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
  searchEpisodes.value = "";
  if (event.target.value == "allEpisodes") {
    searchEpisodes.disabled = false;
    //Remove options from episodes's select
    const options = selectEpisodes.getElementsByTagName("option");
    for (let i = options.length - 1; i > 0; i--) {
      selectEpisodes.removeChild(options[i]);
    }
    makeCardForEpisodes(allEpisodes);
  } else {
    searchEpisodes.disabled = true;
    const season = event.target.value.slice(1, 3);
    const number = event.target.value.slice(4, 6);
    const selectedMovie = allEpisodes.filter(
      (episode) => episode.season == season && episode.number == number
    );
    makeCardForEpisodes(selectedMovie);
  }
}

// Show episodes based on live search
function searchMovie(e) {
  const selectedMovie = [];
  // Get the value of input
  let searchContent = e.target.value;
  if (searchContent == "") {
    makeCardForEpisodes(allEpisodes);
    searchNumResult.textContent = "";
  } else {
    // Create case-insensitive RegExp
    let searchContentInsensitive = new RegExp(searchContent, "i");
    allEpisodes.filter((episode) => {
      if (
        episode.name.match(searchContentInsensitive) !== null ||
        episode.summary.match(searchContentInsensitive) !== null
      ) {
        return selectedMovie.push(episode);
      }
    });
    makeCardForEpisodes(selectedMovie);
    searchNumResult.textContent = ` ${selectedMovie.length}/${allEpisodes.length} `;
  }
}

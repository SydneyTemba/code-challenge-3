// Your code here

const endpointURL = "http://localhost:3000/films";

// When the DOM is loadede
document.addEventListener("DOMContentLoaded", () => {
  // Get the film list and remove the placeholder item
  const filmList = document.getElementById("films");
  filmList.firstChild.remove();
  
  // Fetch films from the endpoint
  fetchFilms(endpointURL);
});

// Function to fetch films from the endpoint
function fetchFilms(endpointURL) {
  fetch(endpointURL)
    .then((response) => response.json())
    .then((movies) => {
      // Iterate through movies and display them
      movies.forEach((movie) => {
        showMovie(movie);
      });
      // Add click event listener to movie list items
      addClickEvent();
    });
}

// Function to display movie titles in the list
function showMovie(movie) {
  const filmList = document.getElementById("films");
  const listItem = document.createElement("li");
  listItem.style.cursor = "pointer";
  listItem.textContent = movie.title.toUpperCase();
  filmList.appendChild(listItem);
}

// Function to handle click events on movie list items
function addClickEvent() {
  const listItems = document.querySelectorAll("#films li");

  listItems.forEach((listItem, index) => {
    listItem.addEventListener("click", () => {
      fetchMovieData(index + 1); // Index + 1 to match movie ID
    });
  });
}

// Function to fetch and display individual movie details
async function fetchMovieData(index) {
  try {
    const response = await fetch(`${endpointURL}/${index}`);
    const movie = await response.json();
    setUpMovieDetails(movie);
  } catch (error) {
    console.error("Error fetching movie data:", error);
  }
}

// Function to set up movie details on the UI
function setUpMovieDetails(movie) {
  const preview = document.getElementById("poster");
  preview.src = movie.poster;

  const movieTitle = document.getElementById("title");
  movieTitle.textContent = movie.title;

  const movieTime = document.getElementById("runtime");
  movieTime.textContent = `${movie.runtime} minutes`;

  const movieDescription = document.getElementById("film-info");
  movieDescription.textContent = movie.description;

  const showTime = document.getElementById("showtime");
  showTime.textContent = movie.showtime;

  const tickets = document.getElementById("ticket-num");
  tickets.textContent = movie.capacity - movie.tickets_sold;
}

// Function to handle ticket purchase
const btn = document.getElementById("buy-ticket");
btn.addEventListener("click", function (e) {
  let remTickets = parseInt(
    document.getElementById("ticket-num").textContent,
    10
  );
  e.preventDefault();
  if (remTickets > 0) {
    document.getElementById("ticket-num").textContent = remTickets - 1;
  } else if (remTickets === 0) {
    btn.textContent = "Sold Out";
  }
});

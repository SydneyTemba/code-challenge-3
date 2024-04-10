// Your code here
// Wait for the DOM content to be fully loaded before executing the script
document.addEventListener("DOMContentLoaded", () => {

  // Base URL for API requests
  const baseURL = "http://localhost:3000";

  // Function to fetch movie details by ID from the server
  const fetchMovieDetails = async (id) => {
      try {
          const response = await fetch(`${baseURL}/films/${id}`);
          return await response.json();
      } catch (error) {
          console.error("Error fetching movie details:", error);
      }
  };

  // Function to update movie details on the webpage
  const updateMovieDetails = (movie) => {
      // Extracting movie details from the response object
      const { poster, title, runtime, description, showtime, capacity, tickets_sold } = movie;
      
      // Updating HTML elements with movie details
      document.getElementById("poster").src = poster;
      document.getElementById("title").textContent = title;
      document.getElementById("runtime").textContent = `${runtime} minutes`;
      document.getElementById("film-info").textContent = description;
      document.getElementById("showtime").textContent = showtime;
      document.getElementById("ticket-num").textContent = `${capacity - tickets_sold}`;
      document.getElementById("buy-ticket").disabled = capacity - tickets_sold === 0;
  };

  // Function to handle buying a ticket for a movie
  const handleBuyTicket = async (movie) => {
      // Incrementing the number of tickets sold
      const updatedTicketsSold = movie.tickets_sold + 1;
      
      try {
          // Sending a PATCH request to update tickets_sold for the movie
          await fetch(`${baseURL}/films/${movie.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ tickets_sold: updatedTicketsSold }),
          });

          // Sending a POST request to create a new ticket for the movie
          await fetch(`${baseURL}/tickets`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ film_id: movie.id, number_of_tickets: 1 }),
          });

          // Updating movie object with the new tickets sold count
          movie.tickets_sold = updatedTicketsSold;
          
          // Updating movie details on the webpage
          updateMovieDetails(movie);
      } catch (error) {
          console.error("Error buying ticket:", error);
      }
  };

  // Function to render the list of movies on the webpage
  const renderMovieList = async () => {
      try {
          // Fetching the list of movies from the server
          const response = await fetch(`${baseURL}/films`);
          const movies = await response.json();
          
          // Getting the element to display the list of movies
          const filmsList = document.getElementById("films");
          filmsList.innerHTML = "";

          // Iterating through each movie and creating list items for them
          movies.forEach((movie) => {
              const movieItem = document.createElement("li");
              movieItem.textContent = movie.title;
              movieItem.classList.add("film", "item");
              
              // Adding event listener to fetch and update details when a movie is clicked
              movieItem.addEventListener("click", async () => {
                  const selectedMovie = await fetchMovieDetails(movie.id);
                  updateMovieDetails(selectedMovie);
              });
              filmsList.appendChild(movieItem);
          });
          
          // Displaying details of the first movie by default
          updateMovieDetails(movies[0]);
      } catch (error) {
          console.error("Error fetching movies:", error);
      }
  };

  // Event listener for buying a ticket
  document.getElementById("buy-ticket").addEventListener("click", () => handleBuyTicket());

  // Rendering the list of movies when the DOM is loaded
  renderMovieList();
});

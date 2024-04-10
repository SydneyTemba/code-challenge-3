// Your code here
document.addEventListener("DOMContentLoaded", () => {
    const baseURL = "http://localhost:3000";
  
    const fetchMovieDetails = async (id) => {
      try {
        const response = await fetch(`${baseURL}/films/${id}`);
        return await response.json();
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };
  
    const updateMovieDetails = (movie) => {
      const { poster, title, runtime, description, showtime, capacity, tickets_sold } = movie;
      document.getElementById("poster").src = poster;
      document.getElementById("title").textContent = title;
      document.getElementById("runtime").textContent = `${runtime} minutes`;
      document.getElementById("film-info").textContent = description;
      document.getElementById("showtime").textContent = showtime;
      document.getElementById("ticket-num").textContent = `${capacity - tickets_sold}`;
      document.getElementById("buy-ticket").disabled = capacity - tickets_sold === 0;
    };
  
    const handleBuyTicket = async (movie) => {
      const updatedTicketsSold = movie.tickets_sold + 1;
      try {
        await fetch(`${baseURL}/films/${movie.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tickets_sold: updatedTicketsSold }),
        });
        await fetch(`${baseURL}/tickets`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ film_id: movie.id, number_of_tickets: 1 }),
        });
        movie.tickets_sold = updatedTicketsSold;
        updateMovieDetails(movie);
      } catch (error) {
        console.error("Error buying ticket:", error);
      }
    };
  
    const renderMovieList = async () => {
      try {
        const response = await fetch(`${baseURL}/films`);
        const movies = await response.json();
        const filmsList = document.getElementById("films");
        filmsList.innerHTML = "";
        movies.forEach((movie) => {
          const movieItem = document.createElement("li");
          movieItem.textContent = movie.title;
          movieItem.classList.add("film", "item");
          movieItem.addEventListener("click", async () => {
            const selectedMovie = await fetchMovieDetails(movie.id);
            updateMovieDetails(selectedMovie);
          });
          filmsList.appendChild(movieItem);
        });
        updateMovieDetails(movies[0]); // Display details of the first movie
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };
  
    document.getElementById("buy-ticket").addEventListener("click", () => handleBuyTicket());
    renderMovieList();
  });
  
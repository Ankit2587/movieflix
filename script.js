const API_KEY = "82384c7261b058cdf43124163cac5a56";

const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

const moviesContainer = document.getElementById("moviesContainer");
const searchInput = document.getElementById("searchInput");
const genreFilter = document.getElementById("genreFilter");
const yearFilter = document.getElementById("yearFilter");
const sortFilter = document.getElementById("sortFilter");
const clearBtn = document.getElementById("clearBtn");

let genres = [];

async function fetchGenres() {
    const res = await fetch(
        `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`
    );

    const data = await res.json();

    genres = data.genres;

    genres.forEach((genre) => {
        const option = document.createElement("option");
        option.value = genre.id;
        option.textContent = genre.name;
        genreFilter.appendChild(option);
    });
}

function populateYears() {

    const currentYear = new Date().getFullYear();

    for (let year = currentYear; year >= 1980; year--) {

        const option = document.createElement("option");
        option.value = year;
        option.textContent = year;

        yearFilter.appendChild(option);
    }
}

async function fetchTrendingMovies() {

    showLoader();

    const res = await fetch(
        `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`
    );

    const data = await res.json();

    displayMovies(data.results);

    hideLoader();
}

function displayMovies(movies) {

    moviesContainer.innerHTML = "";

    if (!movies.length) {

        moviesContainer.innerHTML =
            "<h2>No movies found.</h2>";

        return;
    }

    movies.forEach(movie => {

        const card = document.createElement("div");

        card.classList.add("movie-card");

        card.innerHTML = `
            <img src="${IMG_URL + movie.poster_path}" alt="">
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>

                <div class="movie-meta">
                    <span>${movie.release_date || "N/A"}</span>
                    <span class="rating">
                        ⭐ ${movie.vote_average.toFixed(1)}
                    </span>
                </div>
            </div>
        `;

        moviesContainer.appendChild(card);
    });
}

async function searchMovies() {

    const query = searchInput.value.trim();

    if (!query) {
        fetchTrendingMovies();
        return;
    }

    showLoader();

    const res = await fetch(
        `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`
    );

    const data = await res.json();

    displayMovies(data.results);

    hideLoader();
}

async function applyFilters() {

    let url =
        `${BASE_URL}/discover/movie?api_key=${API_KEY}`;

    if (genreFilter.value) {
        url += `&with_genres=${genreFilter.value}`;
    }

    if (yearFilter.value) {
        url += `&primary_release_year=${yearFilter.value}`;
    }

    if (sortFilter.value) {
        url += `&sort_by=${sortFilter.value}`;
    }

    showLoader();

    const res = await fetch(url);

    const data = await res.json();

    displayMovies(data.results);

    hideLoader();
}

function showLoader() {
    document.getElementById("loader").style.display = "block";
}

function hideLoader() {
    document.getElementById("loader").style.display = "none";
}

searchInput.addEventListener("keyup", searchMovies);

genreFilter.addEventListener("change", applyFilters);

yearFilter.addEventListener("change", applyFilters);

sortFilter.addEventListener("change", applyFilters);

clearBtn.addEventListener("click", () => {

    searchInput.value = "";
    genreFilter.value = "";
    yearFilter.value = "";
    sortFilter.value = "popularity.desc";

    fetchTrendingMovies();
});

fetchGenres();
populateYears();
fetchTrendingMovies();
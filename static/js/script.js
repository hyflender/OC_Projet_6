document.addEventListener('DOMContentLoaded', function () {
    fetchBestMovie();
    fetchTopRatedMovies();
    fetchCategoryMovies('category-1', 'Family');
    fetchCategoryMovies('category-2', 'Comedy');
    populateCategorySelect();
});

function fetchBestMovie() {
    fetch('http://localhost:8000/api/v1/titles/?sort_by=-imdb_score')
        .then(response => response.json())
        .then(data => {
            const bestMovie = data.results[0];
            return fetch(`http://localhost:8000/api/v1/titles/${bestMovie.id}`);
        })
        .then(response => response.json())
        .then(movieDetails => {
            const bestMovieSection = document.getElementById('best-movie');
            bestMovieSection.querySelector('.img-fluid').src = movieDetails.image_url;
            bestMovieSection.querySelector('.card-title').textContent = movieDetails.title;
            bestMovieSection.querySelector('.card-text').textContent = movieDetails.description;
            bestMovieSection.querySelector('.btn-danger').addEventListener('click', () => showDetails(movieDetails.id));
        })
        .catch(error => console.error('Error fetching best movie:', error));
}

function fetchTopRatedMovies() {

    fetch(`http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&page_size=7`)
        .then(response => response.json())
        .then(data => {
            const topSixMovies = data.results.slice(1, 7);
            const topRatedSection = document.getElementById('top-rated-movies').querySelector('.row');
            topRatedSection.innerHTML = topSixMovies.map(movie => createMovieCard(movie)).join('');
        })
        .catch(error => console.error('Error fetching top-rated movies:', error));
}

function fetchCategoryMovies(sectionID, genre) {
    fetch(`http://localhost:8000/api/v1/titles/?genre=${genre}&sort_by=-imdb_score&page_size=7`)
        .then(response => response.json())
        .then(data => {
            const categorySection = document.getElementById(sectionID).querySelector('.row');
            categorySection.innerHTML = data.results.map(movie => createMovieCard(movie)).join('');
        })
        .catch(error => console.error('Error fetching category movies:', error));
}

function populateCategorySelect() {
   
        const select = document.getElementById('category-select');
        console.log(select);
        select.addEventListener('change', function() {
            fetchCategoryMovies('category-3', this.value);
        });
}

function createMovieCard(movie) {
                return `
        <div class="col-md-3">
            <div class="card">
                <img src="${movie.image_url}" class="card-img" alt="Affiche du film">
                <div class="card-img-overlay">
                    <h5 class="card-title text-white">${movie.title}</h5>
                    <button class="btn btn-primary" onclick="showDetails(${movie.id})">Détails</button>
                </div>
            </div>
        </div>`;
            }

function showDetails(movieId) {
                fetch(`http://localhost:8000/api/v1/titles/${movieId}`)
                    .then(response => response.json())
                    .then(data => {
                        const modal = document.getElementById('modal');
                        modal.querySelector('.modal-title').textContent = data.title;
                        modal.querySelector('.modal-body').innerHTML = `
                <div class="row">
                <div class="col-md-8">
                    <h5>${data.title}</h5>
                    <p>${data.year} - ${data.genres}</p>
                    <p>${data.duration} minutes - ${data.country}</p>
                </div>
                    <div class="col-md-4">
                        <img src="${data.image_url}" class="img-fluid mb-3" alt="Affiche du film">
                    </div>
                    <div class="col-md-8">
                        <p><strong>Genres:</strong> ${data.genres.join(', ')}</p>
                <p><strong>Date de sortie:</strong> ${data.release_date}</p>
                <p><strong>Classification:</strong> ${data.rating}</p>
                <p><strong>Score IMDB:</strong> ${data.imdb_score}</p>
                <p><strong>Réalisateur:</strong> ${data.director}</p>
                <p><strong>Acteurs:</strong> ${data.actors.join(', ')}</p>
                <p><strong>Durée:</strong> ${data.duration}</p>
                <p><strong>Pays d'origine:</strong> ${data.country}</p>
                <p><strong>Recettes:</strong> ${data.box_office}</p>
                <p>${data.summary}</p>
            `;
                        modal.style.display = 'flex';
                    })
                    .catch(error => console.error('Error fetching movie details:', error));
            }

function closeModal() {
                document.getElementById('modal').style.display = 'none';
            }
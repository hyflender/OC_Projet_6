document.addEventListener('DOMContentLoaded', function() {
    fetchBestMovie();
});

function fetchBestMovie() {
    fetch('http://localhost:8000/api/v1/titles/?sort_by=-imdb_score')
        .then(response => response.json())
        .then(data => {
            const bestMovie = data.results[0];
            console.log(bestMovie);
            return fetch(`http://localhost:8000/api/v1/titles/${bestMovie.id}`);
        })
        .then(response => response.json())
        .then(movieDetails => {
            const bestMovieSection = document.getElementById('best-movie');
            bestMovieSection.querySelector('.img-fluid').src = movieDetails.image_url;
            bestMovieSection.querySelector('.card-title').textContent = movieDetails.title;
            bestMovieSection.querySelector('.card-text').textContent = movieDetails.description;
        })
        .catch(error => console.error('Error fetching best movie:', error));
}


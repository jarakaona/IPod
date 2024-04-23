const apiKey = "9d4b089ce729c84a1029047eaa41cec8";
let searchInput, artistInfo, topTracks;

document.addEventListener("DOMContentLoaded", function() {
    searchInput = document.getElementById("searchInput");
    artistInfo = document.getElementById("artistInfo");
    topTracks = document.getElementById("topTracks");

 
    if (searchInput) {
        searchInput.addEventListener("input", function() {
            const query = searchInput.value.trim();
            if (query.length > 0) {
                searchArtists(query);
            } else {
                clearArtistInfo();
            }
        });
    }

    if (topTracks) {
        topTracks.addEventListener("click", function(event) {
            if (event.target.classList.contains("addToFavorites")) {
                const artistName = event.target.dataset.artist;
                const songName = event.target.dataset.song;
                addToFavorites(artistName, songName);
                event.target.style.backgroundColor = "#9b59b6";
            }
        });
    }

    loadFavorites();
});

function searchArtists(query) {
    fetch(`http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${query}&api_key=${apiKey}&format=json`)
        .then(response => response.json())
        .then(data => {
            const artist = data.results.artistmatches.artist[0];
            if (artist) {
                getArtistInfo(artist.name);
                getTopTracks(artist.name);
            } else {
                clearArtistInfo();
            }
        })
        .catch(error => console.log("Error fetching artists", error));
}

function getArtistInfo(artistName) {
    fetch(`http://ws.audioscrobbler.com/2.0/?method=artist.getInfo&artist=${artistName}&api_key=${apiKey}&format=json`)
        .then(response => response.json())
        .then(data => {
            const artist = data.artist;
            artistInfo.innerHTML = `<h2>${artist.name}</h2><p>${artist.bio.summary}</p>`;
        })
        .catch(error => console.log("Error fetching artist info", error));
}
function getArtistInfo(artistName) {
    fetch(`http://ws.audioscrobbler.com/2.0/?method=artist.getInfo&artist=${artistName}&api_key=${apiKey}&format=json`)
        .then(response => response.json())
        .then(data => {
            const artist = data.artist;
            const artistImage = Array.isArray(artist.image) && artist.image.length > 0 ? artist.image[artist.image.length - 1]['#text'] : null;
            const artistBio = artist.bio.summary;
            artistInfo.innerHTML = `<h2>${artist.name}</h2><img src="${artistImage}" alt="${artist.name}"><p>${artistBio}</p>`;
        })
        .catch(error => console.log("Error fetching artist info", error));
}

function getTopTracks(artistName) {
    fetch(`http://ws.audioscrobbler.com/2.0/?method=artist.getTopTracks&artist=${artistName}&api_key=${apiKey}&format=json`)
        .then(response => response.json())
        .then(data => {
            const tracks = data.toptracks.track;
            if (tracks.length > 0) {
                const tracksHtml = tracks.slice(0, 5).map(track => `
                    <li style="color: #fff;">
                        ${track.name}
                        <button class="addToFavorites" data-artist="${artistName}" data-song="${track.name}">&hearts;</button>
                    </li>`
                ).join("");
                topTracks.innerHTML = `<ul>${tracksHtml}</ul>`;
            } else {
                topTracks.innerHTML = "No se encontraron canciones populares para este artista.";
            }
        })
        .catch(error => console.log("Error fetching top tracks", error));
}

function addToFavorites(artistName, songName) {
    const favoriteSong = {
        artist: artistName,
        song: songName
    };
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const isAlreadyFavorite = favorites.some(song => song.artist === artistName && song.song === songName);
    if (isAlreadyFavorite) {
        alert("Esta canción ya está en tus favoritas.");
    } else {
        favorites.push(favoriteSong);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        loadFavorites();
    }
}

function loadFavorites() {
    const favoritesList = document.getElementById("favoriteSongs");
    favoritesList.innerHTML = "";
    const favoritesData = JSON.parse(localStorage.getItem("favorites")) || [];
    displayFavorites(favoritesData);
    function loadFavorites() {
        const favoritesList = document.getElementById("favoriteSongs");
        favoritesList.innerHTML = "";
        const favoritesData = JSON.parse(localStorage.getItem("favorites")) || [];
        displayFavorites(favoritesData);
    
        
        const addToFavoritesButtons = document.querySelectorAll(".addToFavorites");
    
        
        addToFavoritesButtons.forEach(button => {
            const artistName = button.dataset.artist;
            const songName = button.dataset.song;
            const isFavorite = favoritesData.some(song => song.artist === artistName && song.song === songName);
            if (isFavorite) {
                button.style.backgroundColor = "#9b59b6";
            }
        });
    }
    
}

function displayFavorites(favorites) {
    const favoritesList = document.getElementById("favoriteSongs");
    favorites.forEach(song => {
        const listItem = createFavoriteListItem(song);
        favoritesList.appendChild(listItem);
    });
}

function createFavoriteListItem(song) {
    const listItem = document.createElement("li");
    listItem.textContent = `${song.song} - ${song.artist}`;
    const deleteButton = createDeleteButton(song);
    listItem.appendChild(deleteButton);
    listItem.classList.add("favorite-song");
    return listItem;
}

function createDeleteButton(song) {
    const button = document.createElement("button");
    button.textContent = "✖";
    button.addEventListener("click", () => {
        removeFavoriteSong(song);
        loadFavorites();
    });
    return button;
}

function removeFavoriteSong(song) {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const updatedFavorites = favorites.filter(f => !isSameSong(f, song));
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
}

function isSameSong(song1, song2) {
    return song1.artist === song2.artist && song1.song === song2.song;
}
const YoutubeApiKey = "AIzaSyD-vp0Dzuie8Fs1lyIIkbSzb-vvFZhCqys";


function playYouTubeVideo(videoId) {
  
    const playerContainer = document.getElementById("player");
    
    
    playerContainer.innerHTML = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
}


document.addEventListener("click", function(event) {
    if (event.target.classList.contains("playYouTube")) {
        const videoId = event.target.dataset.youtubeId;
        playYouTubeVideo(videoId);
    }
});


function createPlayButton(song) {
    const button = document.createElement("button");
    button.textContent = "▶";
    button.classList.add("playYouTube");
    button.dataset.youtubeId = getYouTubeVideoId(song.artist, song.song);
    return button;
}
async function getYouTubeVideoId(artist, song) {
    const query = `${artist} ${song} official video`;
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(query)}&key=${YoutubeApiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('No se pudo obtener el ID del video de YouTube');
        }
        const data = await response.json();
        if (data.items.length > 0) {
            return data.items[0].id.videoId; 
            throw new Error('No se encontraron resultados de videos de YouTube');
        }
    } catch (error) {
        console.error('Error al obtener el ID del video de YouTube:', error.message);
        
        return null;

    }
}
function displayFavorites(favorites) {
    const favoritesList = document.getElementById("favoriteSongs");
    favoritesList.innerHTML = "";
    favorites.forEach(song => {
        const listItem = createFavoriteListItem(song);
        const playButton = createPlayButton(song); 
        listItem.appendChild(playButton); 
        favoritesList.appendChild(listItem);
    });
}


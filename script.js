const apiKey = "9d4b089ce729c84a1029047eaa41cec8";
let searchInput, artistInfo, topTracks;

document.addEventListener("DOMContentLoaded", function() {
    searchInput = document.getElementById("searchInput");
    artistInfo = document.getElementById("artistInfo");
    topTracks = document.getElementById("topTracks");

    // Verificar si los elementos existen antes de agregar event listeners
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
    
        // Obtener todos los botones de añadir a favoritos en la lista de top tracks
        const addToFavoritesButtons = document.querySelectorAll(".addToFavorites");
    
        // Recorrer cada botón y verificar si la canción correspondiente ya está en favoritos
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

// Función para reproducir el video de YouTube
function playYouTubeVideo(videoId) {
    // Elemento donde se mostrará el reproductor de YouTube
    const playerContainer = document.getElementById("player");
    
    // Insertar el reproductor de YouTube
    playerContainer.innerHTML = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
}

// Evento para reproducir el video de YouTube al hacer clic en el botón correspondiente
document.addEventListener("click", function(event) {
    if (event.target.classList.contains("playYouTube")) {
        const videoId = event.target.dataset.youtubeId;
        playYouTubeVideo(videoId);
    }
});

// Función para crear el botón de reproducción de YouTube para una canción favorita
function createPlayButton(song) {
    const button = document.createElement("button");
    button.textContent = "▶";
    button.classList.add("playYouTube");
    button.dataset.youtubeId = getYouTubeVideoId(song.artist, song.song);
    return button;
}

// Función para obtener el ID del video de YouTube para una canción
// Función para obtener el ID del video de YouTube para una canción
async function getYouTubeVideoId(artist, song) {
    const query = `${artist} ${song} official video`; // Concatenamos el artista y la canción para formar la consulta de búsqueda
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(query)}&key=${YoutubeApiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('No se pudo obtener el ID del video de YouTube');
        }
        const data = await response.json();
        if (data.items.length > 0) {
            return data.items[0].id.videoId; // Retornamos el ID del primer video encontrado
        } else {
            throw new Error('No se encontraron resultados de videos de YouTube');
        }
    } catch (error) {
        console.error('Error al obtener el ID del video de YouTube:', error.message);
        // En caso de error, puedes manejarlo de acuerdo a tus necesidades, por ejemplo, retornando un valor predeterminado o mostrando un mensaje al usuario
        return null;

    }
}
function displayFavorites(favorites) {
    const favoritesList = document.getElementById("favoriteSongs");
    favoritesList.innerHTML = "";
    favorites.forEach(song => {
        const listItem = createFavoriteListItem(song);
        const playButton = createPlayButton(song); // Aquí agregamos el botón de reproducción de YouTube
        listItem.appendChild(playButton); // Agregamos el botón al elemento de la lista de favoritos
        favoritesList.appendChild(listItem);
    });
}






// document.getElementById('search-form').addEventListener('submit', function(event) {
//     event.preventDefault(); // Evitar que el formulario se envíe automáticamente
//     console.log("Formulario enviado"); // Verificar si se está activando el evento de envío del formulario
//     const searchTerm = document.getElementById('search-input').value;
//     if (searchTerm.trim() !== '') {
//         fetchArtistInfo(searchTerm); // Llama a la función fetchArtistInfo con el término de búsqueda
//     } else {
//         alert('Por favor, ingresa el nombre de un artista para buscar.'); // Mostrar un mensaje si el campo de búsqueda está vacío
//     }
// });


// function fetchArtistInfo(artist) {
//     console.log("Búsqueda realizada para el artista:", artist); // Verificar si la función fetchArtistInfo se está llamando correctamente
//     const artistInfoContainer = document.getElementById('artist-info');
//     artistInfoContainer.innerHTML = ''; // Limpiar contenido anterior

//     const artistNameElement = document.createElement('h2');
//     artistNameElement.textContent = artist;
//     artistInfoContainer.appendChild(artistNameElement);

//     // Solicitud para obtener la información del artista
//     fetch(`https://ws.audioscrobbler.com/2.0/?method=artist.getInfo&artist=${artist}&api_key=9d4b089ce729c84a1029047eaa41cec8&format=json`)
//         .then(response => response.json())
//         .then(data => {
//             // Aquí puedes procesar los datos recibidos y mostrar la información del artista en la página
//             if (data.artist) {
//                 const artistInfo = data.artist;
//                 const artistBio = artistInfo.bio ? artistInfo.bio.summary : 'No hay información de biografía disponible para este artista.';

//                 const artistBioElement = document.createElement('p');
//                 artistBioElement.textContent = artistBio;
//                 artistInfoContainer.appendChild(artistBioElement);

//                 // Aquí puedes mostrar otras informaciones relevantes del artista, como sus canciones principales, álbumes, etc.
//             } else {
//                 // Manejar el caso en el que no se encuentre información del artista
//                 const errorElement = document.createElement('p');
//                 errorElement.textContent = 'No se encontró información para el artista especificado.';
//                 artistInfoContainer.appendChild(errorElement);
//             }
//         })
//         .catch(error => {
//             console.error('Error fetching artist info:', error);
//         });

//     // Solicitud para obtener los álbumes principales del artista
//     fetch(`https://ws.audioscrobbler.com/2.0/?method=artist.getTopAlbums&artist=${artist}&api_key=9d4b089ce729c84a1029047eaa41cec8&format=json`)
//         .then(response => response.json())
//         .then(data => {
//             // Tu código para procesar y mostrar los álbumes principales del artista aquí...
//         })
//         .catch(error => {
//             console.error('Error fetching top albums:', error);
//         });

//     // Solicitud para obtener las canciones principales del artista
//     fetch(`https://ws.audioscrobbler.com/2.0/?method=artist.getTopTracks&artist=${artist}&api_key=9d4b089ce729c84a1029047eaa41cec8&format=json`)
//         .then(response => response.json())
//         .then(data => {
//             // Tu código para procesar y mostrar las canciones principales del artista aquí...
//         })
//         .catch(error => {
//             console.error('Error fetching top tracks:', error);
//         });
// }

// function addToFavorites(trackName) {
//     // Obtener la lista de canciones favoritas del almacenamiento local
//     let favorites = localStorage.getItem('favorites');
//     if (!favorites) {
//         favorites = []; // Si no hay canciones favoritas, inicializar como un array vacío
//     } else {
//         favorites = JSON.parse(favorites); // Convertir la cadena JSON a un array
//     }

//     // Agregar la canción a la lista de favoritos si no está ya incluida
//     if (!favorites.includes(trackName)) {
//         favorites.push(trackName);
//         localStorage.setItem('favorites', JSON.stringify(favorites)); // Guardar la lista actualizada en el almacenamiento local
//         console.log('Canción agregada a favoritos:', trackName);
//     } else {
//         console.log('La canción ya está en la lista de favoritos.');
//     }
// }

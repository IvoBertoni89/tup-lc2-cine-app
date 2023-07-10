document.addEventListener('DOMContentLoaded', mostrarPeliculasFavoritas);

async function mostrarPeliculasFavoritas() {
  const contenedorPeliculasFavoritas = document.getElementById('contenedorPeliculasFavoritas');
  const favoritos = localStorage.getItem('FAVORITOS');

  
  if (!favoritos) {
    contenedorPeliculasFavoritas.innerHTML = `
      <div id="Warning_cartel">No tienes películas seleccionadas como favoritas.</div>
    `;
    return;
  }


  const favoritosArray = favoritos.split(',');

  try {
    let peliculasFavoritasHTML = '';
    for (let i = 0; i < favoritosArray.length; i++) {
      const peliculaId = favoritosArray[i];
      try {
        const pelicula = await obtenerDetallePelicula(peliculaId);
        const peliculaHTML = generarHTMLPelicula(pelicula);

        peliculasFavoritasHTML += '<div class="contenedorPeliculas">';
        peliculasFavoritasHTML += peliculaHTML;
        peliculasFavoritasHTML += '</div>';
      } catch (error) {
        console.log(error);
      }
    }
    contenedorPeliculasFavoritas.innerHTML = peliculasFavoritasHTML;
  } catch (error) {
    contenedorPeliculasFavoritas.innerText = 'Hubo un error al cargar las películas favoritas.';
    console.log(error);
  }
}

async function obtenerDetallePelicula(peliculaId) {
  const url = `https://api.themoviedb.org/3/movie/${peliculaId}?api_key=987174eff71006f71276ecb352a7837b&language=es-ES`;

  try {
    const response = await fetch(url);
    if (response.ok) {
      const pelicula = await response.json();
      return pelicula;
    } else {
      throw new Error('La solicitud a la API falló con un código de estado ' + response.status);
    }
  } catch (error) {
    throw new Error('Error en la conexión al obtener el detalle de la película: ' + error.message);
  }
}

function generarHTMLPelicula(pelicula) {
  let videoHTML = '';

  if (pelicula.videos && pelicula.videos.results.length > 0) {
    const videoKey = pelicula.videos.results[0].key;
    const videoUrl = `https://www.youtube.com/embed/${videoKey}`;
    videoHTML = `
      <div class="video-container">
        <iframe src="${videoUrl}" title="Trailer de la película" allowfullscreen></iframe>
      </div>
    `;
  }

  return `
    <div class="contenedorPeliculas">
      <img src="https://image.tmdb.org/t/p/w500/${pelicula.poster_path}" alt="Poster de la película">
      <h3>${pelicula.title}</h3>
      <p><b>Código:</b> ${pelicula.id}</p>
      <p><b>Título Original:</b> ${pelicula.original_title}</p>
      <p><b>Idioma Original:</b> ${pelicula.original_language}</p>
      <p><b>Resumen:</b> ${pelicula.overview}</p>
      <button id="Fav-Button-${pelicula.id}" class="Fav-Button">Quitar de Favoritos</button>
      ${videoHTML}
    </div>
  `;
}

document.addEventListener('click', (event) => {
  if (event.target.classList.contains('Fav-Button')) {
    const peliculaId = event.target.id.split('-')[2];
    quitarPeliculaFavorita(peliculaId);
  }
});

function quitarPeliculaFavorita(peliculaId) {
  let favoritos = localStorage.getItem('FAVORITOS');
  if (favoritos) {
    const favoritosArray = favoritos.split(',');
    const index = favoritosArray.indexOf(peliculaId);
    if (index > -1) {
      favoritosArray.splice(index, 1);
      favoritos = favoritosArray.join(',');
      localStorage.setItem('FAVORITOS', favoritos);
      mostrarPeliculasFavoritas();
    }
  }
}
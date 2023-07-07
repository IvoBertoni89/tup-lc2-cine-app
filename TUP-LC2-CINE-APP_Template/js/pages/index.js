let pagina = 1;
const btnAnterior = document.getElementById('btnAnterior');
const btnSiguiente = document.getElementById('btnSiguiente');
const secPeliculas = document.getElementById('sec_peliculas');
const mensajeError = document.getElementById('Error');
const mensajeExito = document.getElementById('Success');
const mensajeWarning = document.getElementById('Warning');
const form = document.getElementById('Form1');
const codigoInput = document.getElementById('code');
const agregarButton = document.getElementById('agregar');

btnSiguiente.addEventListener('click', () => {
  if (pagina < 1000) {
    pagina += 1;
    CargarPelis();
  }
});

btnAnterior.addEventListener('click', () => {
  if (pagina > 1) {
    pagina -= 1;
    CargarPelis();
  }
});

const CargarPelis = async () => {
  try {
    const llamada = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=987174eff71006f71276ecb352a7837b&language=es-ES&page=${pagina}`);

    if (llamada.ok) {
      const datos = await llamada.json();

      console.log(datos);

      let peliculas = '';
      datos.results.forEach(pelicula => {
        peliculas += `
          <div class="contenedorPeliculas">
            <img src="https://image.tmdb.org/t/p/w500/${pelicula.poster_path}">
            <h3>${pelicula.title}</h3>
            <p><b>Código: ${pelicula.id}</b></p>
            <p><b>Título Original: ${pelicula.original_title}</b></p>
            <p><b>Idioma Original: ${pelicula.original_language}</b></p>
            <p><b>Año: ${pelicula.release_date}</b></p>
            <button id="Fav-Button-${pelicula.id}" class="Fav-Button">Agregar a Favoritos.</button>
          </div>
        `;
      });

      secPeliculas.innerHTML = peliculas;
      secPeliculas.style.display = 'grid'; // Mostrar los carteles de películas después de cargarlas correctamente

    } else if (llamada.status === 401) {
      mostrarMensajeError('ERROR DE AUTENTICACIÓN');
    } else if (llamada.status === 404) {
      mostrarMensajeError('ERROR 404 - No encontrado');
    } else {
      mostrarMensajeError('ERROR DESCONOCIDO');
    }
  } catch (error) {
    console.log(error);
    mostrarMensajeError('Error en la conexión');
  }
}

secPeliculas.addEventListener('click', (event) => {
  if (event.target.classList.contains('Fav-Button')) {
    const peliculaId = event.target.id.split('-')[2];

    if (esCodigoNumerico(peliculaId)) {
      if (esPeliculaEnFavoritos(peliculaId)) {
        mostrarMensajeWarning('La película ingresada ya se encuentra almacenada.');
      } else {
        const url = `https://api.themoviedb.org/3/movie/${peliculaId}?api_key=987174eff71006f71276ecb352a7837b&language=es-ES`;
        fetch(url)
          .then((response) => {
            if (response.ok) {
              localStorage.setItem('FAVORITOS', `${localStorage.getItem('FAVORITOS') || ''},${peliculaId}`);
              mostrarMensajeExito('Película agregada con éxito.');
            } else {
              mostrarMensajeError('Error: La película seleccionada no se encuentra en la API o se produjo un error al consultar.');
            }
          })
          .catch((error) => {
            console.log(error);
            mostrarMensajeError('Error en la conexión');
          });
      }
    } else {
      mostrarMensajeError('Error: El código de película ingresado no es válido.');
    }
  }
});

form.addEventListener('submit', (event) => {
  event.preventDefault(); // Evitar que el formulario se envíe automáticamente

  const codigo = codigoInput.value.trim();
  if (esCodigoNumerico(codigo)) {
    if (esPeliculaEnFavoritos(codigo)) {
      mostrarMensajeWarning('La película ingresada ya se encuentra almacenada.');
    } else {
      const url = `https://api.themoviedb.org/3/movie/${codigo}?api_key=987174eff71006f71276ecb352a7837b&language=es-ES`;
      fetch(url)
        .then((response) => {
          if (response.ok) {
            localStorage.setItem('FAVORITOS', `${localStorage.getItem('FAVORITOS') || ''},${codigo}`);
            mostrarMensajeExito('Película agregada con éxito.');
          } else {
            mostrarMensajeError('Error: La película seleccionada no se encuentra en la API o se produjo un error al consultar.');
          }
        })
        .catch((error) => {
          console.log(error);
          mostrarMensajeError('Error en la conexión');
        });
    }
  } else {
    mostrarMensajeError('Error: El código de película ingresado no es válido.');
  }

  // Limpiar el campo de código después de agregar la película o mostrar el mensaje de error
  codigoInput.value = '';
});

function esCodigoNumerico(codigo) {
  return !isNaN(codigo);
}

function esPeliculaEnFavoritos(codigo) {
  const favoritos = localStorage.getItem('FAVORITOS');
  if (favoritos) {
    const codigos = favoritos.split(',');
    return codigos.includes(codigo);
  }
  return false;
}

function mostrarMensajeError(mensaje) {
  mensajeError.innerText = mensaje;
  mensajeError.style.display = 'block';
  mensajeExito.style.display = 'none';
  mensajeWarning.style.display = 'none';

  setTimeout(() => {
    mensajeError.style.display = 'none';
  }, 5000);
}

function mostrarMensajeExito(mensaje) {
  mensajeExito.innerText = mensaje;
  mensajeExito.style.display = 'block';
  mensajeError.style.display = 'none';
  mensajeWarning.style.display = 'none';

  setTimeout(() => {
    mensajeExito.style.display = 'none';
  }, 5000);
}

function mostrarMensajeWarning(mensaje) {
  mensajeWarning.innerText = mensaje;
  mensajeWarning.style.display = 'block';
  mensajeError.style.display = 'none';
  mensajeExito.style.display = 'none';

  setTimeout(() => {
    mensajeWarning.style.display = 'none';
  }, 5000);
}

mensajeError.style.display = 'none';
mensajeExito.style.display = 'none';
mensajeWarning.style.display = 'none';

CargarPelis();

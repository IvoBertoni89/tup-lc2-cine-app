let pagina = 1;
const btnAnterior = document.getElementById('btnAnterior');
const btnSiguiente = document.getElementById('btnSiguiente');

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

      let peliculas = '';
      datos.results.forEach(pelicula => {
        peliculas += `
          <div class="contenedorPeliculas">
            <img src="https://image.tmdb.org/t/p/w500/${pelicula.poster_path}">
            <h3 class="titulo">${pelicula.title}</h3>
          </div>
        `;
      });

      document.getElementById('sec_peliculas').innerHTML = peliculas;

    } else if (llamada.status === 401) {
      console.log("ERROR DE AUTENTICACIÓN");
    } else if (llamada.status === 404) {
      console.log("ERROR 404 - No encontrado");
    } else {
      console.log("ERROR DESCONOCIDO");
    }
  } catch (error) {
    console.log(error);
  }
}

CargarPelis();

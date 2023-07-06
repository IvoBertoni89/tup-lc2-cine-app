const CargarPelis = async() => {
    const llamada = await fetch("https://api.themoviedb.org/3/movie/now_playing?api_key=987174eff71006f71276ecb352a7837b");
    console.log(llamada);
}

CargarPelis ();








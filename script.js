const d = document,
  $shows = d.getElementById("shows"),
  $template = d.getElementById("show-template").content,
  $fragment = d.createDocumentFragment();

d.addEventListener("keypress", async (e) => {
  if (e.target.matches("#search")) {
    if (e.key === "Enter") {
      try {
        $shows.innerHTML = `<img src="/img/loader.svg" class="loader" alt="loader">`;

        let valorIngresado = e.target.value.toLowerCase(),
          apiUrl = `https://api.tvmaze.com/search/shows?q=${valorIngresado}`,
          res = await fetch(apiUrl),
          json = await res.json();

        console.log(json);

        json.forEach((movie) => {
          $template.querySelector("img").src = movie.show.image
            ? movie.show.image.medium
            : "http://static.tvmaze.com/images/no-img/no-img-portrait-text.png";
          $template.querySelector("h3").innerText =
            movie.show.name.toUpperCase();
          $template.querySelector("a").href = movie.show.url;
          $template.querySelector("a").target = "_blank";
          $template.querySelector("p").innerHTML =
            movie.show.genres.length === 0
              ? "No hay géneros registrados."
              : `Géneros: ${movie.show.genres.toString()}`;

          let $clone = d.importNode($template, true);
          $fragment.appendChild($clone);
        });
        $shows.innerHTML = "";
        $shows.appendChild($fragment);

        if (!res.ok) throw { status: res.status, statusText: res.statusText };
        if (json.length === 0) {
          $shows.innerHTML = `<h2> No existen resultados de shows para el criterio de busqueda: <mark> ${valorIngresado}</mark> </h2>`;
        }
      } catch (err) {
        console.log(err);
        let message = err.statusText || "Ocurrió un Error";
        $shows.innerHTML = `<p> Error ${err.status}: ${message}</p>`;
      }
    }
  }
});

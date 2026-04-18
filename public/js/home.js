fetch("/api/places")
  .then((res) => res.json())
  .then((places) => {
    const container = document.getElementById("placesContainer");

    places.forEach((place) => {
      const card = `
        <article>
          <a href="place.html?id=${place.slug}">
            <img src="${place.image}" width="400">
            <p><strong>${place.name}</strong></p>
          </a>
        </article>
      `;

      container.innerHTML += card;
    });
  });

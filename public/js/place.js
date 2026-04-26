// place.js

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

fetch(`/api/places/${id}`)
  .then((res) => res.json())
  .then((data) => {
    document.getElementById("title").innerText = data.name;
    document.getElementById("image").src = data.image;
    document.getElementById("description").innerText = data.description;

    const subplacesDiv = document.getElementById("subplaces");

    if (data.subplaces && data.subplaces.length > 0) {
      data.subplaces.forEach((place) => {
        subplacesDiv.innerHTML += `
          <div class="sub-card">
            <img src="${place.image}" alt="${place.name}">
            <h3>${place.name}</h3>
            <p>${place.description}</p>
          </div>
        `;
      });
    } else {
      subplacesDiv.innerHTML = "<p>No subplaces added yet.</p>";
    }
  });

// get id from URL
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

// fetch data from backend
fetch(`/api/places/${id}`)
  .then((res) => res.json())
  .then((data) => {
    document.getElementById("title").innerText = data.name;
    document.getElementById("image").src = data.image;
    document.getElementById("description").innerText = data.description;
  });

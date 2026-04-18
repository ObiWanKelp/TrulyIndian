const form = document.getElementById("placeForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const slug = document.getElementById("slug").value;
  const image = document.getElementById("image").value;
  const description = document.getElementById("description").value;

  const res = await fetch("/api/places", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, slug, image, description }),
  });

  const data = await res.json();
  alert(data.message);
});

// public/js/place.js

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const selectedRatings = {};

/* =========================
   LOAD PLACE
========================= */
fetch(`/api/places/${id}`)
  .then((res) => res.json())
  .then((data) => {
    document.getElementById("title").innerText = data.name;
    document.getElementById("image").src = data.image;
    document.getElementById("description").innerText = data.description;

    const subplacesDiv = document.getElementById("subplaces");
    subplacesDiv.innerHTML = "";

    if (data.subplaces && data.subplaces.length > 0) {
      data.subplaces
        .filter((place) => place.status === "approved")
        .forEach((place) => {
          subplacesDiv.innerHTML += `
<div class="sub-card">
  <img src="${place.image}" alt="${place.name}">
  <h3>${place.name}</h3>
  <p>${place.description}</p>

  <div class="rating-box">
    <div class="stars" id="stars-${place._id}">
      <span onclick="setStars('${place._id}',1)">★</span>
      <span onclick="setStars('${place._id}',2)">★</span>
      <span onclick="setStars('${place._id}',3)">★</span>
      <span onclick="setStars('${place._id}',4)">★</span>
      <span onclick="setStars('${place._id}',5)">★</span>
    </div>

    <button
      class="rate-btn"
      onclick="submitRating('${data._id}','${place._id}')"
    >
      Review
    </button>

    <div class="avg-rating">
      ⭐ ${place.avgRating ? place.avgRating.toFixed(1) : "0.0"}
      (${place.totalRatings || 0} reviews)
    </div>
  </div>
</div>
          `;
        });
    } else {
      subplacesDiv.innerHTML = "<p>No subplaces added yet.</p>";
    }
  });

/* =========================
   STAR SELECT
========================= */
function setStars(subId, count) {
  selectedRatings[subId] = count;

  const stars = document.querySelectorAll(`#stars-${subId} span`);

  stars.forEach((star, index) => {
    if (index < count) {
      star.classList.add("active");
    } else {
      star.classList.remove("active");
    }
  });
}

/* =========================
   SUBMIT RATING
========================= */
async function submitRating(placeId, subId) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    alert("Please login first");
    window.location.href = "/login.html";
    return;
  }

  const stars = selectedRatings[subId];

  if (!stars) {
    alert("Select stars first ⭐");
    return;
  }

  try {
    const res = await fetch(`/api/places/rate/${placeId}/${subId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userEmail: user.email,
        stars,
      }),
    });

    const data = await res.json();

    alert(data.message);

    location.reload();
  } catch (err) {
    alert("Server error ❌");
  }
}

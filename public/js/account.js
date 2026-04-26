// public/js/account.js

var currentUser = JSON.parse(localStorage.getItem("user"));

if (!currentUser) {
  window.location.href = "/login.html";
}

/* =========================
   LOAD USER INFO
========================= */
fetch(`/api/auth/me?email=${currentUser.email}`)
  .then((res) => res.json())
  .then((data) => {
    document.getElementById("email").innerText = data.email;
    document.getElementById("name").value = data.name || "";
  });

/* =========================
   UPDATE PROFILE
========================= */
function updateUser() {
  fetch("/api/auth/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: currentUser.email,
      name: document.getElementById("name").value,
      password: document.getElementById("password").value,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      alert(data.message);
    });
}

/* =========================
   LOAD MY POSTS
========================= */
function loadMyPosts() {
  const container = document.getElementById("myPosts");
  container.innerHTML = "<p>Loading...</p>";

  Promise.allSettled([
    fetch("/api/places").then((res) => res.json()),
    fetch("/api/places/pending").then((res) => res.json()),
    fetch("/api/places/pending-subplaces").then((res) => res.json()),
  ]).then((results) => {
    const approvedPlaces =
      results[0].status === "fulfilled" ? results[0].value : [];

    const pendingPlaces =
      results[1].status === "fulfilled" ? results[1].value : [];

    const pendingSubplaces =
      results[2].status === "fulfilled" ? results[2].value : [];

    container.innerHTML = "";

    const allPlaces = [...approvedPlaces, ...pendingPlaces];

    allPlaces.forEach((place) => {
      /* MAIN PLACE */
      if (place.createdBy === currentUser.email) {
        const status =
          place.status === "pending" ? "⏳ Pending" : "✅ Approved";

        container.innerHTML += `
          <div class="post-card">
            <h3>${place.name}</h3>
            <p>${place.description || ""}</p>
            <p><strong>Status:</strong> ${status}</p>

            <button onclick="deletePlace('${place._id}')">
              Delete Place
            </button>
          </div>
        `;
      }

      /* SUBPLACES */
      if (place.subplaces) {
        place.subplaces.forEach((sub) => {
          if (sub.createdBy === currentUser.email) {
            const subStatus =
              sub.status === "pending" ? "⏳ Pending" : "✅ Approved";

            container.innerHTML += `
              <div class="post-card">
                <h3>${sub.name}</h3>
                <p>${sub.description || ""}</p>
                <p><strong>City:</strong> ${place.name}</p>
                <p><strong>Status:</strong> ${subStatus}</p>

                <button onclick="deleteSubplace('${place._id}','${sub._id}')">
                  Delete Subplace
                </button>
              </div>
            `;
          }
        });
      }
    });

    if (container.innerHTML === "") {
      container.innerHTML = "<p>No posts yet.</p>";
    }
  });
}

/* =========================
   DELETE PLACE
========================= */
function deletePlace(id) {
  if (!confirm("Delete this place?")) return;

  fetch(`/api/places/delete/${id}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((data) => {
      alert(data.message);
      loadMyPosts();
    });
}

/* =========================
   DELETE SUBPLACE
========================= */
function deleteSubplace(placeId, subId) {
  if (!confirm("Delete this subplace?")) return;

  fetch(`/api/places/delete-subplace/${placeId}/${subId}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((data) => {
      alert(data.message);
      loadMyPosts();
    });
}

/* INITIAL */
loadMyPosts();

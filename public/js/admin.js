const form = document.getElementById("placeForm");

// LOAD DATA
loadPending();
loadApproved();

// ===== FORM SUBMIT =====
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const slug = document.getElementById("slug").value;
  const image = document.getElementById("image").value;
  const description = document.getElementById("description").value;
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !user.email) {
    alert("Login expired. Please login again.");
    window.location.href = "/login.html";
    return;
  }

  const res = await fetch("/api/places", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      slug,
      image,
      description,
      createdBy: user.email, // 🔥 THIS WAS MISSING
    }),
  });
  try {
    const res = await fetch("/api/places", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, slug, image, description }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Error ❌");
      return;
    }

    alert(data.message || "Added ✅");
    form.reset();

    loadPending(); // refresh without reload
    loadApproved();
  } catch (err) {
    console.error(err);
    alert("Server error ❌");
  }
});

// ===== LOAD PENDING =====
function loadPending() {
  fetch("/api/places/pending")
    .then((res) => res.json())
    .then((places) => {
      const container = document.getElementById("pendingList");
      container.innerHTML = "";

      places.forEach((p) => {
        container.innerHTML += `
          <div class="admin-card">
            <img src="${p.image}">
            <div class="admin-card-content">
              <h3>${p.name}</h3>
              <p>${p.description}</p>

              <div class="admin-actions">
                <button class="approve" onclick="approve('${p._id}')">Approve</button>
                <button class="reject" onclick="reject('${p._id}')">Reject</button>
              </div>
            </div>
          </div>
        `;
      });
    });
}

// ===== LOAD APPROVED =====
function loadApproved() {
  fetch("/api/places")
    .then((res) => res.json())
    .then((places) => {
      const container = document.getElementById("approvedList");
      container.innerHTML = "";

      places.forEach((p) => {
        container.innerHTML += `
          <div class="admin-card">
            <img src="${p.image}">
            <div class="admin-card-content">
              <h3>${p.name}</h3>
              <p>${p.description}</p>

              <div class="admin-actions">
                <button class="delete" onclick="deletePlace('${p._id}')">Delete</button>
              </div>
            </div>
          </div>
        `;
      });
    });
}

// ===== ACTIONS =====
function approve(id) {
  fetch(`/api/places/approve/${id}`, { method: "POST" }).then(() => {
    loadPending();
    loadApproved();
  });
}

function reject(id) {
  fetch(`/api/places/reject/${id}`, { method: "DELETE" }).then(() =>
    loadPending(),
  );
}

function deletePlace(id) {
  if (!confirm("Delete this place?")) return;

  fetch(`/api/places/delete/${id}`, { method: "DELETE" }).then(() =>
    loadApproved(),
  );
}

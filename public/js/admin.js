// public/js/admin.js

const form = document.getElementById("placeForm");
const subplaceForm = document.getElementById("subplaceForm");

/* =========================
   INITIAL LOAD
========================= */
loadPending();
loadApproved();

/* =========================
   ADD MAIN PLACE
========================= */
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !user.email) {
    alert("Login expired. Please login again.");
    window.location.href = "/login.html";
    return;
  }

  const body = {
    name: document.getElementById("name").value,
    slug: document.getElementById("slug").value,
    image: document.getElementById("image").value,
    description: document.getElementById("description").value,
    createdBy: user.email,
  };

  try {
    const res = await fetch("/api/places", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    alert(data.message);

    form.reset();

    loadPending();
    loadApproved();
  } catch (err) {
    alert("Server error ❌");
  }
});

/* =========================
   ADD SUBPLACE
========================= */
subplaceForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = JSON.parse(localStorage.getItem("user"));

  const body = {
    parentSlug: document.getElementById("parentSlug").value,
    name: document.getElementById("subName").value,
    image: document.getElementById("subImage").value,
    description: document.getElementById("subDescription").value,
    createdBy: user.email,
  };

  try {
    const res = await fetch("/api/places/subplace", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    alert(data.message);

    subplaceForm.reset();

    loadPending();
  } catch (err) {
    alert("Server error ❌");
  }
});

/* =========================
   LOAD PENDING
========================= */
async function loadPending() {
  const container = document.getElementById("pendingList");
  container.innerHTML = "";

  /* MAIN PENDING */
  const res1 = await fetch("/api/places/pending");
  const places = await res1.json();

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

  /* SUBPLACE PENDING */
  const res2 = await fetch("/api/places/pending-subplaces");
  const subplaces = await res2.json();

  subplaces.forEach((p) => {
    container.innerHTML += `
      <div class="admin-card">
        <img src="${p.image}">
        <div class="admin-card-content">
          <h3>${p.name}</h3>
          <p>${p.description}</p>
          <p><strong>City:</strong> ${p.parentName}</p>

          <div class="admin-actions">
            <button class="approve"
              onclick="approveSubplace('${p.parentId}','${p._id}')">
              Approve
            </button>

            <button class="reject"
              onclick="rejectSubplace('${p.parentId}','${p._id}')">
              Reject
            </button>
          </div>
        </div>
      </div>
    `;
  });
}

/* =========================
   LOAD APPROVED
========================= */
async function loadApproved() {
  const res = await fetch("/api/places");
  const places = await res.json();

  const container = document.getElementById("approvedList");
  container.innerHTML = "";

  places.forEach((p) => {
    let subplacesHtml = "";

    if (p.subplaces && p.subplaces.length > 0) {
      p.subplaces
        .filter((sub) => sub.status === "approved")
        .forEach((sub) => {
          subplacesHtml += `
            <div class="subplace-box">
              <p>📍 ${sub.name}</p>

              <button
                class="delete"
                onclick="deleteSubplace('${p._id}','${sub._id}')"
              >
                Remove Subplace
              </button>
            </div>
          `;
        });
    }

    container.innerHTML += `
      <div class="admin-card">
        <img src="${p.image}" alt="${p.name}">

        <div class="admin-card-content">
          <h3>${p.name}</h3>
          <p>${p.description}</p>

          ${subplacesHtml}

          <div class="admin-actions">
            <button
              class="delete"
              onclick="deletePlace('${p._id}')"
            >
              Delete City
            </button>
          </div>
        </div>
      </div>
    `;
  });

  if (container.innerHTML === "") {
    container.innerHTML = "<p>No approved places yet.</p>";
  }
}

/* =========================
   ACTIONS MAIN PLACE
========================= */
function approve(id) {
  fetch(`/api/places/approve/${id}`, {
    method: "POST",
  }).then(() => {
    loadPending();
    loadApproved();
  });
}

function reject(id) {
  fetch(`/api/places/reject/${id}`, {
    method: "DELETE",
  }).then(() => {
    loadPending();
  });
}

function deletePlace(id) {
  if (!confirm("Delete this place?")) return;

  fetch(`/api/places/delete/${id}`, {
    method: "DELETE",
  }).then(() => {
    loadApproved();
  });
}

/* =========================
   ACTIONS SUBPLACE
========================= */
function approveSubplace(placeId, subId) {
  fetch(`/api/places/approve-subplace/${placeId}/${subId}`, {
    method: "POST",
  }).then(() => {
    loadPending();

    loadApproved();
  });
}

function rejectSubplace(placeId, subId) {
  fetch(`/api/places/reject-subplace/${placeId}/${subId}`, {
    method: "DELETE",
  }).then(() => {
    loadPending();
  });
}

function deleteSubplace(placeId, subId) {
  if (!confirm("Remove this subplace?")) return;

  fetch(`/api/places/delete-subplace/${placeId}/${subId}`, {
    method: "DELETE",
  }).then(() => {
    loadApproved();
  });
}

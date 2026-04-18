const user = JSON.parse(localStorage.getItem("user"));

// show user info
fetch(`/api/auth/me?email=${user.email}`)
  .then((res) => res.json())
  .then((data) => {
    document.getElementById("email").innerText = data.email;
    document.getElementById("name").value = data.name;
  });

// update
function updateUser() {
  fetch("/api/auth/update", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: user.email,
      name: document.getElementById("name").value,
      password: document.getElementById("password").value,
    }),
  })
    .then((res) => res.json())
    .then((data) => alert(data.message));
}

// delete
function deleteUser() {
  fetch(`/api/auth/delete?email=${user.email}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((data) => {
      alert(data.message);
      localStorage.removeItem("user");
      window.location.href = "/login.html";
    });
}

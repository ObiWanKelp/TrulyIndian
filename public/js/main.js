// LOGIN
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    // ❌ if login failed
    if (!res.ok) {
      alert(data.message); // "Invalid credentials"
      return; // STOP here
    }

    // ✅ only runs if login success
    localStorage.setItem("user", JSON.stringify(data));
    alert(data.message);

    // redirect
    if (data.role === "admin") {
      window.location.href = "/admin.html";
    } else {
      window.location.href = "/index.html";
    }
  });
}

// REGISTER
const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    alert(data.message);

    // ✅ redirect after register
    window.location.href = "/login.html";
  });
}

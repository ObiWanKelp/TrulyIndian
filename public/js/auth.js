// check if user exists
const user = JSON.parse(localStorage.getItem("user"));

// get current page
const path = window.location.pathname;

// pages that DON'T need login
const publicPages = ["/login.html", "/register.html"];

// if not logged in and trying to access protected page
if (!user && !publicPages.includes(path)) {
  window.location.href = "/login.html";
}

function logout() {
  localStorage.removeItem("user");
  window.location.href = "/login.html";
}

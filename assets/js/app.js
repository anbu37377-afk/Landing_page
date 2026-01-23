// ✅ LocalStorage Authentication System (HTML/CSS/JS only)

/* ---------- Helpers ---------- */
function getUsers() {
  return JSON.parse(localStorage.getItem("saas_users") || "[]");
}

function setUsers(users) {
  localStorage.setItem("saas_users", JSON.stringify(users));
}

function setSession(user) {
  localStorage.setItem("saas_session", JSON.stringify(user));
}

function getSession() {
  return JSON.parse(localStorage.getItem("saas_session") || "null");
}

/* ✅ Smart path resolver (Fix GitHub Pages + folder issue) */
function goTo(path) {
  // Works for GitHub pages + local host
  const base = window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, "/");
  window.location.href = new URL(path, base).href;
}

/* ---------- Auth ---------- */
function logout() {
  localStorage.removeItem("saas_session");

  // ✅ redirect properly (dashboard or normal pages)
  const isInsideDashboard = window.location.pathname.includes("/dashboard/");
  if (isInsideDashboard) {
    window.location.href = "../auth/login.html";
  } else {
    window.location.href = "auth/login.html";
  }
}

function requireAuth() {
  const session = getSession();
  if (!session) {
    window.location.href = "../auth/login.html"; // only dashboard uses this
    return null;
  }
  return session;
}

/* ---------- Navbar Auth Buttons ---------- */
function updateNavbarAuth() {
  const session = getSession();
  const el = document.getElementById("navAuthArea");
  if (!el) return;

  // ✅ Correct dashboard link path
  const dashboardLink = window.location.pathname.includes("/dashboard/")
    ? "./dashboard.html"
    : "dashboard/dashboard.html";

  if (session) {
    el.innerHTML = `
      <a class="btn btn-ghost" href="${dashboardLink}">Dashboard</a>
      <button class="btn btn-accent" onclick="logout()">Logout</button>
      <button class="btn btn-theme" onclick="toggleTheme()">🌓</button>
    `;
  } else {
    el.innerHTML = `
      <a class="btn btn-ghost" href="auth/login.html">Login</a>
      <a class="btn btn-primary" href="auth/signup.html">Sign Up</a>
      <button class="btn btn-theme" onclick="toggleTheme()">🌓</button>
    `;
  }
}

/* ---------- Active Nav Highlight ---------- */
function setActiveNav() {
  const links = document.querySelectorAll(".nav-links a");
  if (!links.length) return;

  const current = window.location.pathname.split("/").pop() || "index.html";

  links.forEach(link => {
    const href = link.getAttribute("href");
    if (!href) return;

    // ✅ compare only file name
    const file = href.split("/").pop();

    if (file === current) {
      link.classList.add("active");
    }

    // ✅ Home special case
    if ((current === "" || current === "index.html") && file === "index.html") {
      link.classList.add("active");
    }
  });
}

/* ---------- Theme Toggle ---------- */
function toggleTheme() {
  const isLight = document.body.classList.toggle("light");
  localStorage.setItem("theme", isLight ? "light" : "dark");
}

function applyTheme() {
  const saved = localStorage.getItem("theme");
  if (saved === "light") document.body.classList.add("light");
}

/* ---------- Signup ---------- */
function handleSignup(e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value.trim();

  const users = getUsers();

  if (users.some(u => u.email === email)) {
    alert("Email already exists. Please login.");
    window.location.href = "./login.html";
    return;
  }

  const newUser = { id: Date.now(), name, email, password };
  users.push(newUser);
  setUsers(users);

  setSession({ id: newUser.id, name: newUser.name, email: newUser.email });
  alert("Signup successful ✅");

  window.location.href = "../dashboard/dashboard.html";
}

/* ---------- Login ---------- */
function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value.trim();

  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    alert("Invalid email or password ❌");
    return;
  }

  setSession({ id: user.id, name: user.name, email: user.email });
  window.location.href = "../dashboard/dashboard.html";
}

/* ---------- Demo Social Login ---------- */
function googleLoginDemo() {
  alert("Google Login Demo ✅ (To make it real, integrate Firebase/Auth0 OAuth)");
  setSession({ id: Date.now(), name: "Google User", email: "googleuser@gmail.com" });
  window.location.href = "../dashboard/dashboard.html";
}

function facebookLoginDemo() {
  alert("Facebook Login Demo ✅ (To make it real, integrate Firebase/Auth0 OAuth)");
  setSession({ id: Date.now(), name: "Facebook User", email: "fbuser@facebook.com" });
  window.location.href = "../dashboard/dashboard.html";
}

/* ---------- FAQ Toggle ---------- */
function initFAQ() {
  const items = document.querySelectorAll(".faq-item");
  if (!items.length) return;

  items.forEach(item => {
    item.addEventListener("click", () => {
      item.classList.toggle("active");
    });
  });
}

/* ---------- Dashboard Sidebar Toggle ---------- */
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  if (sidebar) sidebar.classList.toggle("open");
}

/* ✅ Run on every page */
document.addEventListener("DOMContentLoaded", () => {
  applyTheme();
  setActiveNav();
});

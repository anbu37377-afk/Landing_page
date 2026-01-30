
// ✅ LocalStorage Authentication System (HTML/CSS/JS only)

/* =========================================================
   Helpers
========================================================= */
function getUsers() {
  return JSON.parse(localStorage.getItem("saas_users") || "[]");
}

function setUsers(users) {
  localStorage.setItem("saas_users", JSON.stringify(users));
}

/**
 * ✅ Session storage choice:
 * - remember = true  -> localStorage (persistent)
 * - remember = false -> sessionStorage (until browser close)
 */
function setSession(user, remember = true) {
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem("saas_session", JSON.stringify(user));
}

function getSession() {
  // ✅ read from localStorage first, then sessionStorage
  return (
    JSON.parse(localStorage.getItem("saas_session") || "null") ||
    JSON.parse(sessionStorage.getItem("saas_session") || "null")
  );
}

function clearSession() {
  localStorage.removeItem("saas_session");
  sessionStorage.removeItem("saas_session");
}

/**
 * ✅ Get correct base path regardless of:
 * - root pages (index.html, blog.html)
 * - auth pages (/auth/)
 * - dashboard pages (/dashboard/)
 */
function getRootPrefix() {
  const path = window.location.pathname;

  if (path.includes("/auth/")) return "../";
  if (path.includes("/dashboard/")) return "../";
  return "";
}

/**
 * ✅ Redirect helper
 */
function goTo(pagePath) {
  window.location.href = pagePath;
}

/* =========================================================
   Auth Functions
========================================================= */
function logout() {
  clearSession();

  // redirect to Home 1 page instead of login page
  const prefix = getRootPrefix();
  goTo(prefix + "index.html");
}

function requireAuth() {
  const session = getSession();
  if (!session) {
    const prefix = getRootPrefix();
    goTo(prefix + "auth/login.html");
    return null;
  }
  return session;
}

/* =========================================================
   Navbar Auth Buttons + Theme Button
========================================================= */
function updateNavbarAuth() {
  const session = getSession();
  const el = document.getElementById("navAuthArea");
  if (!el) return;

  const prefix = getRootPrefix();

  if (session) {
    el.innerHTML = `
      <a class="btn btn-ghost" href="${prefix}dashboard/dashboard.html">Dashboard</a>
      <button class="btn btn-accent" onclick="logout()">Logout</button>
      <button class="btn btn-theme" onclick="toggleTheme()" title="Toggle Theme" aria-label="Toggle Theme">&#9680;</button>
    `;
  } else {
    el.innerHTML = `
      <a class="btn btn-ghost" href="${prefix}auth/login.html">Login</a>
      <a class="btn btn-primary" href="${prefix}auth/signup.html">Sign Up</a>
      <button class="btn btn-theme" onclick="toggleTheme()" title="Toggle Theme" aria-label="Toggle Theme">&#9680;</button>
    `;
  }
}

/* =========================================================
   Active Nav Highlight
========================================================= */
function setActiveNav() {
  const links = document.querySelectorAll(".nav-links a");
  if (!links.length) return;

  const current = window.location.pathname.split("/").pop() || "index.html";

  links.forEach(link => {
    const href = link.getAttribute("href");
    if (!href) return;

    const file = href.split("/").pop();
    if (file === current) link.classList.add("active");

    // Home special case
    if ((current === "" || current === "index.html") && file === "index.html") {
      link.classList.add("active");
    }
  });
}

/* =========================================================
   Theme Toggle
========================================================= */
function toggleTheme() {
  const isLight = document.body.classList.toggle("light");
  localStorage.setItem("theme", isLight ? "light" : "dark");
}

function applyTheme() {
  const saved = localStorage.getItem("theme");
  if (saved === "light") document.body.classList.add("light");
}

/* =========================================================
   Signup
========================================================= */
function handleSignup(e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value.trim();
  const terms = document.getElementById("termsCheck");

  if (terms && !terms.checked) {
    alert("Please accept the Terms of Service and Privacy Policy.");
    return;
  }

  const users = getUsers();

  if (users.some(u => u.email === email)) {
    alert("Email already exists. Please login.");
    goTo("./login.html");
    return;
  }

  const newUser = { id: Date.now(), name, email, password };
  users.push(newUser);
  setUsers(users);

  // ✅ by default signup should persist login
  setSession({ id: newUser.id, name: newUser.name, email: newUser.email }, true);

  alert("Signup successful ✅");
  goTo("../dashboard/dashboard.html");
}

/* =========================================================
   Login
========================================================= */
function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value.trim();

  const remember = document.getElementById("rememberMe")
    ? document.getElementById("rememberMe").checked
    : true;

  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    alert("Invalid email or password ❌");
    return;
  }

  setSession({ id: user.id, name: user.name, email: user.email }, remember);
  goTo("../dashboard/dashboard.html");
}

/* =========================================================
   Demo Social Login
========================================================= */
function googleLoginDemo() {
  alert("Google Login Demo (connect real OAuth later).");
}

function facebookLoginDemo() {
  alert("Facebook Login Demo (connect real OAuth later).");
}

/* =========================================================
   FAQ Toggle
========================================================= */
function initFAQ() {
  const items = document.querySelectorAll(".faq-item");
  if (!items.length) return;

  items.forEach(item => {
    const question = item.querySelector(".faq-q");
    const icon = question.querySelector("span:last-child");
    
    question.addEventListener("click", (e) => {
      e.stopPropagation();
      
      // Close other items
      items.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove("active");
          const otherIcon = otherItem.querySelector(".faq-q span:last-child");
          if (otherIcon) otherIcon.textContent = "+";
        }
      });
      
      // Toggle current item
      item.classList.toggle("active");
      if (icon) {
        icon.textContent = item.classList.contains("active") ? "−" : "+";
      }
    });
  });
}

/* =========================================================
   Dashboard Sidebar Toggle
========================================================= */
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  if (sidebar) sidebar.classList.toggle("open");
}

/* =========================================================
   Run on every page
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  applyTheme();
  setActiveNav();
});


/* ✅ Mobile nav toggle */
function toggleMobileNav() {
  const nav = document.getElementById("mobileNav");
  const auth = document.getElementById("navAuthArea");
  const toggle = document.querySelector(".nav-toggle");
  if (nav) nav.classList.toggle("open");
  if (auth) auth.classList.toggle("open");
  if (toggle) {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", (!expanded).toString());
  }
}

/* ✅ New mobile nav toggle for main-header */
function initMobileMenu() {
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  
  if (mobileToggle && navMenu) {
    // Remove any existing listeners to prevent duplicates
    mobileToggle.removeEventListener('click', handleMobileToggle);
    // Add the click handler
    mobileToggle.addEventListener('click', handleMobileToggle);
  }
}

function handleMobileToggle() {
  const navMenu = document.getElementById('navMenu');
  if (navMenu) {
    navMenu.classList.toggle('active');
    const expanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', (!expanded).toString());
  }
}

// Initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', initMobileMenu);

// Also initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMobileMenu);
} else {
  initMobileMenu();
}

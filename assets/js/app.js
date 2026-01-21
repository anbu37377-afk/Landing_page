// LocalStorage Authentication System (HTML/CSS/JS only)

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
  
  function logout() {
    localStorage.removeItem("saas_session");
    window.location.href = "../auth/login.html";
  }
  
  function requireAuth() {
    const session = getSession();
    if (!session) window.location.href = "../auth/login.html";
    return session;
  }
  
  function updateNavbarAuth() {
    const session = getSession();
    const el = document.getElementById("navAuthArea");
    if (!el) return;
  
    if (session) {
      el.innerHTML = `
        <a class="btn btn-ghost" href="dashboard/dashboard.html">Dashboard</a>
        <button class="btn btn-accent" onclick="logout()">Logout</button>
      `;
    } else {
      el.innerHTML = `
        <a class="btn btn-ghost" href="auth/login.html">Login</a>
        <a class="btn btn-primary" href="auth/signup.html">Sign Up</a>
      `;
    }
  }
  
  // Signup
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
  
  // Login
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
  

  // Demo Social Login (Frontend only)
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

  // FAQ Toggle (Service Details Page)
function initFAQ() {
    const items = document.querySelectorAll(".faq-item");
    if (!items.length) return;
  
    items.forEach(item => {
      item.addEventListener("click", () => {
        item.classList.toggle("active");
      });
    });
  }
  
  
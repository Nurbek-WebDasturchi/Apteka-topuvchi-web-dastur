// ── API HELPER ─────────────────────────────────────────────────
const API = "https://apteka-topuvchi-web-dastur.onrender.com/api";

function getToken() {
  return localStorage.getItem("token");
}
function getUser() {
  return JSON.parse(localStorage.getItem("user") || "null");
}

async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (token) headers["Authorization"] = "Bearer " + token;
  const res = await fetch(API + path, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Serverda xatolik");
  return data;
}

// Auth helpers
function saveAuth(token, user) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/pages/login.html";
}

// Render nav based on auth state
function renderNav() {
  const user = getUser();
  const el = document.getElementById("navAuth");
  if (!el) return;
  if (user) {
    el.innerHTML = `
      <span id="userDisplay">👤 ${user.name}</span>
      ${user.role === "admin" ? '<a href="/pages/admin/dashboard.html" class="nav-link">⚙️ Admin</a>' : ""}
      <a href="./pages/login.html" class="nav-link">Profil</a>
      <button onclick="logout()" class="nav-link btn-accent" style="border:none;cursor:pointer;">Chiqish</button>
    `;
  } else {
    el.innerHTML = `
      <a href="./pages/login.html"    class="nav-link">Kirish</a>
      <a href="./pages/register.html" class="nav-link btn-accent">Register</a>
    `;
  }
}

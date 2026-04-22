import "./styles.css";
import { router } from "./router.js";
import { state } from "./state.js";
import { authPage } from "./pages/auth.js";
import { homePage } from "./pages/home.js";
import { explorePage } from "./pages/explore.js";
import { notificationsPage } from "./pages/notifications.js";
import { messagesPage } from "./pages/messages.js";
import { profilePage } from "./pages/profile.js";

// ── Register routes ──────────────────────────────────────────────────────────
router.on("#auth",          authPage);
router.on("#home",          homePage);
router.on("#explore",       explorePage);
router.on("#notifications", notificationsPage);
router.on("#messages",      messagesPage);
router.on("#profile",       profilePage);

// ── Bottom nav visibility & active tab ──────────────────────────────────────
const bottomNav = document.getElementById("bottomNav");

const TAB_MAP = {
  "#home":          "tab-home",
  "#explore":       "tab-explore",
  "#notifications": "tab-notifications",
  "#messages":      "tab-messages",
  "#profile":       "tab-profile",
};

const updateNav = () => {
  const hash = window.location.hash || "#home";
  const isAuth = hash === "#auth";

  if (isAuth || !state.isLoggedIn()) {
    bottomNav.classList.add("hidden");
  } else {
    bottomNav.classList.remove("hidden");
  }

  bottomNav.querySelectorAll(".nav-tab").forEach(t => t.classList.remove("active"));
  const activeId = TAB_MAP[hash];
  if (activeId) document.getElementById(activeId)?.classList.add("active");
};

window.addEventListener("hashchange", updateNav);

// ── Logout (globally accessible) ────────────────────────────────────────────
window.__logout = () => {
  state.clearAuth();
  bottomNav.classList.add("hidden");
  router.navigate("#auth");
};

// ── Boot ─────────────────────────────────────────────────────────────────────
// Start the router first (registers hashchange listener), then set initial hash.
// Each page handler already redirects to #auth if the user is not logged in.
updateNav();
router.start();

// If landing on root with no hash, redirect to appropriate page
if (!window.location.hash) {
  router.navigate(state.isLoggedIn() ? "#home" : "#auth");
}

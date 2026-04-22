// pages/auth.js — Dark-themed login / register page
import { api } from "../api.js";
import { state } from "../state.js";
import { router } from "../router.js";

export const authPage = {
  render() {
    if (state.isLoggedIn()) { router.navigate("#home"); return; }

    const app = document.getElementById("app");
    app.innerHTML = `
      <div class="auth-page">
        <div class="auth-logo">PB</div>
        <div style="text-align:center">
          <div class="auth-title">Happening now</div>
          <div class="auth-sub">Join Pulseboard today.</div>
        </div>

        <div class="auth-box">
          <!-- Tab switcher -->
          <div class="auth-tabs">
            <button class="auth-tab active" id="tabCreate">Create account</button>
            <button class="auth-tab" id="tabSignin">Sign in</button>
          </div>

          <!-- Register panel -->
          <div id="panelCreate" class="auth-panel">
            <form id="registerForm">
              <div style="display:grid;gap:12px">
                <input class="auth-input" name="username"       placeholder="Username"        required autocomplete="username" />
                <input class="auth-input" name="email"    type="email"     placeholder="Email"           required autocomplete="email" />
                <input class="auth-input" name="password" type="password"  placeholder="Password"        required autocomplete="new-password" />
                <input class="auth-input" name="profilePicUrl"             placeholder="Profile pic URL (optional)" />
                <button class="auth-btn-primary" type="submit">Create account</button>
              </div>
            </form>
            <p id="registerError" class="auth-error hidden" style="margin-top:10px"></p>
          </div>

          <!-- Login panel -->
          <div id="panelSignin" class="auth-panel hidden">
            <form id="loginForm">
              <div style="display:grid;gap:12px">
                <input class="auth-input" name="email"    type="email"    placeholder="Email"    required autocomplete="email" />
                <input class="auth-input" name="password" type="password" placeholder="Password" required autocomplete="current-password" />
                <button class="auth-btn-primary" type="submit">Sign in</button>
              </div>
            </form>
            <p id="loginError" class="auth-error hidden" style="margin-top:10px"></p>
          </div>

          <div class="auth-switch">
            Already have an account? <a href="#auth" id="switchLink">Sign in</a>
          </div>
        </div>
      </div>
    `;

    const tabCreate = document.getElementById("tabCreate");
    const tabSignin = document.getElementById("tabSignin");
    const panelCreate = document.getElementById("panelCreate");
    const panelSignin = document.getElementById("panelSignin");
    const switchLink  = document.getElementById("switchLink");

    const showRegister = () => {
      tabCreate.classList.add("active"); tabSignin.classList.remove("active");
      panelCreate.classList.remove("hidden"); panelSignin.classList.add("hidden");
      switchLink.textContent = "Sign in"; switchLink.onclick = showLogin;
    };
    const showLogin = (e) => {
      e?.preventDefault();
      tabSignin.classList.add("active"); tabCreate.classList.remove("active");
      panelSignin.classList.remove("hidden"); panelCreate.classList.add("hidden");
      switchLink.textContent = "Create account"; switchLink.onclick = (ev) => { ev.preventDefault(); showRegister(); };
    };

    tabCreate.addEventListener("click", showRegister);
    tabSignin.addEventListener("click", showLogin);

    document.getElementById("registerForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const errEl = document.getElementById("registerError");
      errEl.classList.add("hidden");
      try {
        const payload = Object.fromEntries(new FormData(e.target).entries());
        const result  = await api.register(payload);
        state.setAuth(result.token, result.user);
        document.getElementById("bottomNav")?.classList.remove("hidden");
        router.navigate("#home");
      } catch (err) {
        errEl.textContent = err.message;
        errEl.classList.remove("hidden");
      }
    });

    document.getElementById("loginForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const errEl = document.getElementById("loginError");
      errEl.classList.add("hidden");
      try {
        const payload = Object.fromEntries(new FormData(e.target).entries());
        const result  = await api.login(payload);
        state.setAuth(result.token, result.user);
        document.getElementById("bottomNav")?.classList.remove("hidden");
        router.navigate("#home");
      } catch (err) {
        errEl.textContent = err.message;
        errEl.classList.remove("hidden");
      }
    });
  }
};

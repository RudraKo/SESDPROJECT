/**
 * Auth state singleton — shared across all pages.
 */
export const state = {
  get token() { return localStorage.getItem("token") || ""; },
  get user() { return JSON.parse(localStorage.getItem("user") || "null"); },

  setAuth(token, user) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  },

  clearAuth() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  isLoggedIn() { return !!this.token; }
};

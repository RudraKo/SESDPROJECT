/**
 * Lightweight hash-based router.
 * Routes map a hash fragment (e.g. "#feed") to a { render } function.
 */
const routes = {};
let currentRoute = null;

export const router = {
  /**
   * Register a route.
   * @param {string} hash  – e.g. "#feed"
   * @param {{ render: () => void, cleanup?: () => void }} handler
   */
  on(hash, handler) {
    routes[hash] = handler;
  },

  navigate(hash) {
    window.location.hash = hash;
  },

  start() {
    const resolve = () => {
      if (currentRoute?.cleanup) currentRoute.cleanup();
      const hash = window.location.hash || "#home";
      const handler = routes[hash] ?? routes["#404"] ?? routes["#home"];
      currentRoute = handler;
      handler?.render();
    };

    window.addEventListener("hashchange", resolve);
    resolve();
  }
};

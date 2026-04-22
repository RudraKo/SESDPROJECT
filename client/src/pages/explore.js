// pages/explore.js — Trending/Explore page (matches Stitch prototype)
import { icons } from "../icons.js";

const trends = [
  { cat: "Technology · Trending", name: "Quantum Supremacy",      count: "42.5K posts" },
  { cat: "Politics · Trending",   name: "Global Trade Summit",     count: "128K posts"  },
  { cat: "Entertainment · Trending", name: "Pulseboard Awards",   count: "12.1K posts" },
  { cat: "Science · Trending",    name: "Webb Telescope Discovery",count: "89.4K posts" },
  { cat: "Tech · Trending",       name: "#Web3Infrastructure",    count: "31.2K posts" },
];

const articles = [
  {
    source: "TechCrunch · 2h ago",
    title:  "New neural engine architectures are redefining mobile gaming performance in 2024",
    img:    null,
  },
  {
    source: "The Verge · 4h ago",
    title:  "How decentralized compute is reshaping the cloud industry",
    img:    null,
  },
  {
    source: "Wired · 6h ago",
    title:  "Pulseboard's growth signals a shift in how Gen Z shares content",
    img:    null,
  },
];

export const explorePage = {
  render() {
    const app = document.getElementById("app");
    app.innerHTML = `
      <div class="page-header">
        <div class="page-header-title">Explore</div>
        <button class="settings-btn" style="margin-left:auto">${icons.settings}</button>
      </div>

      <!-- Search bar -->
      <div class="search-bar">
        ${icons.search}
        <input type="text" placeholder="Search Pulseboard" />
      </div>

      <!-- Trending hero -->
      <div class="trending-hero" style="margin-top:8px;">
        <div class="live-badge">LIVE</div>
        <div class="trending-hero-title">The Future of Decentralized Compute</div>
        <div class="trending-hero-sub">Trending with #Web3Infrastructure</div>
      </div>

      <div class="divider"></div>

      <!-- Trends -->
      <div class="section-title">Trends for you</div>
      ${trends.map(t => `
        <div class="trend-item">
          <div>
            <div class="trend-category">${t.cat}</div>
            <div class="trend-name">${t.name}</div>
            <div class="trend-count">${t.count}</div>
          </div>
          <button class="trend-more">${icons.more}</button>
        </div>
      `).join("")}
      <a class="show-more">Show more</a>

      <div class="divider"></div>

      <!-- Popular -->
      <div class="section-title">Popular right now</div>
      ${articles.map((a, i) => `
        <div class="article-item fade-in" style="animation-delay:${i*60}ms">
          <div class="article-body">
            <div class="article-source">${a.source}</div>
            <div class="article-title">${a.title}</div>
          </div>
          <div class="article-thumb" style="background: linear-gradient(135deg,#1a237e,#283593)"></div>
        </div>
      `).join("")}

      <div style="height:20px"></div>
    `;
  }
};

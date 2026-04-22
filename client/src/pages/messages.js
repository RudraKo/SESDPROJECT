// pages/messages.js — DM Inbox page
import { state } from "../state.js";
import { router } from "../router.js";
import { icons } from "../icons.js";

const mockConvos = [
  { name: "Alex Rivera",   handle: "@arivera",   letter: "A", color: "#1D9BF0", time: "2m",    preview: "Did you see the final report for the...", unread: true,  online: true  },
  { name: "Jordan Smith",  handle: "@jsmith_ux", letter: "J", color: "#00BA7C", time: "1h",    preview: "I'll send over the updated Figma links...", unread: false, online: false },
  { name: "Design Team ⚡",handle: "",           letter: "D", color: "#9B59B6", time: "3h",    preview: "Sarah: The bento grid layout is exact...", unread: false, online: false },
  { name: "Casey Lee",     handle: "@clee",      letter: "C", color: "#F91880", time: "Oct 24", preview: "Let's grab coffee and talk about the n...", unread: false, online: false },
  { name: "Marcus Chen",   handle: "@mchen",     letter: "M", color: "#FF6B35", time: "Oct 23", preview: "The direct message implementation I...", unread: false, online: false },
  { name: "Elena V.",      handle: "@elena_v",   letter: "E", color: "#F39C12", time: "Oct 22", preview: "I've approved the latest PR for the da...", unread: false, online: false },
];

export const messagesPage = {
  render() {
    if (!state.isLoggedIn()) { router.navigate("#auth"); return; }

    const app = document.getElementById("app");

    const listHtml = mockConvos.map((c, i) => `
      <div class="msg-item ${c.unread ? "msg-unread" : ""} fade-in" style="animation-delay:${i*40}ms">
        <div class="msg-avatar" style="background:${c.color}">
          ${c.letter}
          ${c.online ? '<span class="online-dot"></span>' : ""}
        </div>
        <div class="msg-body">
          <div class="msg-header">
            <span class="msg-name">${c.name}</span>
            ${c.handle ? `<span class="msg-handle">${c.handle}</span>` : ""}
            <span class="msg-time">${c.time}</span>
          </div>
          <div class="msg-preview">${c.preview}</div>
        </div>
        ${c.unread ? '<div class="unread-dot"></div>' : ""}
      </div>
    `).join("");

    app.innerHTML = `
      <div class="page-header">
        <div>
          <div class="page-header-title">Messages</div>
        </div>
        <button class="settings-btn" style="margin-left:auto">${icons.settings}</button>
      </div>

      <div class="search-bar" style="margin-top:10px">
        ${icons.search}
        <input type="text" placeholder="Search people and groups" />
      </div>

      <div style="height:8px"></div>
      ${listHtml}
      <div style="height:20px"></div>

      <!-- FAB -->
      <button class="fab" aria-label="New message">${icons.mail}</button>
    `;
  }
};

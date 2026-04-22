// pages/notifications.js — Notifications page
import { state } from "../state.js";
import { router } from "../router.js";
import { icons } from "../icons.js";

const mockNotifs = [
  {
    type: "follow",
    avatars: [{ letter: "S", color: "#1D9BF0" }],
    text: "<strong>Sarah Jenkins</strong> followed you",
    time: "2m",
  },
  {
    type: "like",
    avatars: [{ letter: "A", color: "#F91880" }, { letter: "D", color: "#9B59B6" }],
    text: "<strong>Alex Rivera</strong> and <strong>David Chen</strong> liked your post",
    preview: "Just launched the new UI kit for Pulseboard! 🚀 Really focused on that...",
    time: "18m",
  },
  {
    type: "mention",
    avatarImg: null,
    avatars: [{ letter: "M", color: "#00BA7C" }],
    name: "Marcus Thorne",
    handle: "@mthorne",
    textFull: `Replying to <span style="color:var(--blue)">@pulse_designer</span><br>The new typography system is incredibly sharp. The use of Inter with those specific tracking values makes everything feel so intentional. Great work on the dark mode tokens!`,
    stats: { replies: 12, reposts: 4, likes: 82, views: "1.2K" },
    time: "2h",
  },
  {
    type: "repost",
    avatars: [{ letter: "E", color: "#FF6B35" }],
    text: "<strong>Elena Vance</strong> reposted your post",
    preview: "Architecture of a design system: Fro...",
    time: "5h",
  },
  {
    type: "follow",
    avatars: [{ letter: "J", color: "#1D9BF0" }],
    text: "<strong>Jordan Smith</strong> followed you",
    time: "1d",
  },
  {
    type: "like",
    avatars: [{ letter: "C", color: "#F91880" }],
    text: "<strong>Casey Lee</strong> liked your post",
    preview: "Dark mode is not just aesthetic — it's about reducing cognitive load...",
    time: "2d",
  },
];

const typeIcon = (type) => {
  if (type === "follow")  return `<span class="notif-icon follow">${icons.follow}</span>`;
  if (type === "like")    return `<span class="notif-icon like">${icons.heart}</span>`;
  if (type === "repost")  return `<span class="notif-icon repost">${icons.repostFill}</span>`;
  if (type === "mention") return `<span class="notif-icon mention">${icons.bell}</span>`;
  return "";
};

const avatarsHtml = (list) => list.map(a =>
  `<div class="notif-avatar" style="background:${a.color}">${a.letter}</div>`
).join("");

export const notificationsPage = {
  render() {
    if (!state.isLoggedIn()) { router.navigate("#auth"); return; }

    const app = document.getElementById("app");

    const itemsHtml = mockNotifs.map((n, i) => {
      if (n.textFull) {
        // Full tweet-style mention
        return `
          <div class="notif-item fade-in" style="animation-delay:${i*40}ms">
            ${typeIcon(n.type)}
            <div style="flex:1">
              <div class="notif-avatars" style="margin-bottom:8px">
                ${avatarsHtml(n.avatars)}
              </div>
              <div style="font-weight:700;font-size:0.92rem">${n.name} <span style="color:var(--text-sub);font-weight:400">${n.handle} · ${n.time}</span></div>
              <div class="notif-text" style="margin-top:4px">${n.textFull}</div>
              <div class="post-actions" style="margin-top:10px">
                <button class="action-btn comment">${icons.comment}<span>${n.stats.replies}</span></button>
                <button class="action-btn repost">${icons.repost}<span>${n.stats.reposts}</span></button>
                <button class="action-btn like">${icons.like}<span>${n.stats.likes}</span></button>
                <button class="action-btn views">${icons.views}<span>${n.stats.views}</span></button>
              </div>
            </div>
          </div>
        `;
      }
      return `
        <div class="notif-item fade-in" style="animation-delay:${i*40}ms">
          ${typeIcon(n.type)}
          <div style="flex:1">
            <div class="notif-avatars">${avatarsHtml(n.avatars)}</div>
            <div class="notif-text" style="margin-top:8px">${n.text}
              <span style="color:var(--text-sub);font-size:0.82rem;margin-left:6px">${n.time}</span>
            </div>
            ${n.preview ? `<div class="notif-preview">${n.preview}</div>` : ""}
          </div>
        </div>
      `;
    }).join("");

    app.innerHTML = `
      <div class="page-header">
        <div class="page-header-title">Notifications</div>
        <button class="settings-btn" style="margin-left:auto">${icons.settings}</button>
      </div>
      <div class="page-tabs">
        <div class="page-tab active">All</div>
        <div class="page-tab">Verified</div>
        <div class="page-tab">Mentions</div>
      </div>
      ${itemsHtml}
      <div style="height:20px"></div>
    `;

    // Tab switching (visual only)
    app.querySelectorAll(".page-tab").forEach(tab => {
      tab.addEventListener("click", () => {
        app.querySelectorAll(".page-tab").forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
      });
    });
  }
};

// pages/profile.js — Rich profile page matching the Stitch prototype
import { api } from "../api.js";
import { state } from "../state.js";
import { router } from "../router.js";
import { icons } from "../icons.js";

const avatarColors = ["#1D9BF0","#F91880","#00BA7C","#FF6B35","#9B59B6","#F39C12"];
const colorFor = (str = "") => avatarColors[str.charCodeAt(0) % avatarColors.length];
const initials = (u = "") => u.slice(0, 1).toUpperCase() || "?";
const timeAgo = (iso) => {
  const diff = (Date.now() - new Date(iso)) / 1000;
  if (diff < 60)    return `${Math.floor(diff)}s`;
  if (diff < 3600)  return `${Math.floor(diff/60)}m`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h`;
  return new Date(iso).toLocaleDateString("en-US", { month:"short", day:"numeric" });
};

export const profilePage = {
  render() {
    if (!state.isLoggedIn()) { router.navigate("#auth"); return; }

    const app = document.getElementById("app");
    const me = state.user;
    const bgColor = colorFor(me?.username);

    // Initial skeleton
    app.innerHTML = `
      <div class="page-header">
        <button class="back-btn" id="profBack">${icons.back}</button>
        <div>
          <div class="page-header-title">${me?.username || "Profile"}</div>
          <div class="page-header-sub" id="profPostCount">Loading…</div>
        </div>
        <button class="settings-btn" style="margin-left:auto">${icons.settings}</button>
      </div>

      <!-- Banner -->
      <div class="profile-banner" style="background:linear-gradient(135deg,${bgColor}33 0%,${bgColor}66 100%)"></div>

      <!-- Top row: avatar + edit -->
      <div class="profile-top">
        <div class="profile-avatar" style="background:${bgColor}">
          ${me?.profilePicUrl ? `<img src="${me.profilePicUrl}" />` : initials(me?.username)}
        </div>
        <button class="edit-profile-btn">Edit profile</button>
      </div>

      <!-- Info -->
      <div class="profile-info">
        <div class="profile-name">${me?.username || "—"}</div>
        <div class="profile-handle">@${me?.username || "—"}</div>
        <div class="profile-bio">Building the future of social media. 🚀 Pulseboard Core Team.</div>
        <div class="profile-meta">
          <span>${icons.location} San Francisco, CA</span>
          <span>${icons.calendar} Joined ${me ? new Date().toLocaleDateString("en-US",{month:"long",year:"numeric"}) : "—"}</span>
        </div>
        <div class="profile-stats" id="profStats">
          <div><strong id="followingCount">—</strong> <span>Following</span></div>
          <div><strong id="followersCount">—</strong> <span>Followers</span></div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="page-tabs">
        <div class="page-tab active" data-tab="posts">Posts</div>
        <div class="page-tab" data-tab="replies">Replies</div>
        <div class="page-tab" data-tab="media">Media</div>
        <div class="page-tab" data-tab="likes">Likes</div>
      </div>

      <!-- Posts list -->
      <div id="profileFeed"><div class="spinner"></div></div>

      <!-- Follow tool -->
      <div style="padding:16px;border-bottom:1px solid var(--border)">
        <div style="font-size:0.9rem;font-weight:700;margin-bottom:8px;color:var(--text-sub)">Follow / Unfollow a user</div>
        <div style="display:flex;gap:8px">
          <input class="auth-input" id="followInput" placeholder="User ID" style="flex:1;padding:10px 14px;font-size:0.9rem" />
          <button id="btnFollow" class="follow-btn">Follow</button>
          <button id="btnUnfollow" class="edit-profile-btn">Unfollow</button>
        </div>
        <p id="followMsg" class="hidden" style="font-size:0.82rem;margin-top:8px;color:var(--blue)"></p>
      </div>

      <div style="height:20px"></div>
    `;

    document.getElementById("profBack").addEventListener("click", () => history.back());

    // Load profile stats
    api.getProfile(me.id).then(p => {
      const fc = document.getElementById("followingCount");
      const flc = document.getElementById("followersCount");
      const pc  = document.getElementById("profPostCount");
      if (fc)  fc.textContent  = p.following  ?? p._count?.following ?? "—";
      if (flc) flc.textContent = p.followers  ?? p._count?.followers ?? "—";
      if (pc)  pc.textContent  = `${p._count?.posts ?? "?"} posts`;
    }).catch(() => {});

    // Load feed for posts tab
    const profileFeed = document.getElementById("profileFeed");
    api.getFeed(state.token).then(posts => {
      const mine = posts.filter(p => p.user?.id === me.id || p.user?.username === me.username);
      if (!mine.length) {
        profileFeed.innerHTML = `<div class="empty-state"><h3>No posts yet</h3><p>When you post, they'll show up here.</p></div>`;
        return;
      }
      profileFeed.innerHTML = "";
      mine.forEach((post, i) => {
        const card = document.createElement("div");
        card.className = "post-card fade-in";
        card.style.animationDelay = `${i*40}ms`;
        card.innerHTML = `
          <div class="post-avatar" style="background:${bgColor}">
            ${me.profilePicUrl ? `<img src="${me.profilePicUrl}"/>` : initials(me.username)}
          </div>
          <div class="post-body">
            <div class="post-meta">
              <span class="post-name">${me.username}</span>
              <span class="post-handle">@${me.username}</span>
              <span class="post-dot">·</span>
              <span class="post-time">${timeAgo(post.createdAt)}</span>
            </div>
            ${post.caption ? `<p class="post-text">${post.caption}</p>` : ""}
            ${post.imageUrl ? `<div class="post-image"><img src="${post.imageUrl}" loading="lazy"/></div>` : ""}
            <div class="post-actions">
              <button class="action-btn comment">${icons.comment}<span>${post.commentsCount}</span></button>
              <button class="action-btn repost">${icons.repost}<span>0</span></button>
              <button class="action-btn like ${post.likedByMe?"liked":""}">${post.likedByMe?icons.likeFill:icons.like}<span>${post.likesCount}</span></button>
              <button class="action-btn views">${icons.views}<span>—</span></button>
            </div>
          </div>
        `;
        profileFeed.appendChild(card);
      });
    }).catch(() => {
      profileFeed.innerHTML = `<div class="empty-state"><p>Could not load posts.</p></div>`;
    });

    // Tab switching
    app.querySelectorAll(".page-tab").forEach(tab => {
      tab.addEventListener("click", () => {
        app.querySelectorAll(".page-tab").forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
      });
    });

    // Follow / Unfollow
    const followMsg = document.getElementById("followMsg");
    const showMsg = (msg, ok = true) => {
      followMsg.textContent = msg;
      followMsg.style.color = ok ? "var(--blue)" : "var(--red)";
      followMsg.classList.remove("hidden");
      setTimeout(() => followMsg.classList.add("hidden"), 3000);
    };

    document.getElementById("btnFollow").addEventListener("click", async () => {
      const id = document.getElementById("followInput").value.trim();
      if (!id) return;
      try { await api.followUser(state.token, id); showMsg(`✓ Followed user ${id}`); }
      catch(e) { showMsg(e.message, false); }
    });

    document.getElementById("btnUnfollow").addEventListener("click", async () => {
      const id = document.getElementById("followInput").value.trim();
      if (!id) return;
      try { await api.unfollowUser(state.token, id); showMsg(`✓ Unfollowed user ${id}`); }
      catch(e) { showMsg(e.message, false); }
    });
  }
};

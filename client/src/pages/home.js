// pages/home.js — Twitter-style timeline feed
import { api } from "../api.js";
import { state } from "../state.js";
import { router } from "../router.js";
import { icons } from "../icons.js";

const avatarColors = ["#1D9BF0","#F91880","#00BA7C","#FF6B35","#9B59B6","#F39C12"];
const colorFor = (str = "") => avatarColors[str.charCodeAt(0) % avatarColors.length];

const initials = (username = "") => username.slice(0, 1).toUpperCase() || "?";

const timeAgo = (iso) => {
  const diff = (Date.now() - new Date(iso)) / 1000;
  if (diff < 60)   return `${Math.floor(diff)}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400)return `${Math.floor(diff / 3600)}h`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const fakeViews = (id = "") => {
  const n = (id.charCodeAt(0) + id.charCodeAt(1) || 0) * 137 + 420;
  return n > 1000 ? `${(n/1000).toFixed(1)}K` : n;
};

function renderPostCard(post, idx) {
  const u = post.user;
  const color = colorFor(u.username);
  const card = document.createElement("div");
  card.className = "post-card fade-in";
  card.style.animationDelay = `${idx * 40}ms`;
  card.dataset.postId = post.id;

  card.innerHTML = `
    <div class="post-avatar" style="background:${color}">
      ${u.profilePicUrl
        ? `<img src="${u.profilePicUrl}" alt="${u.username}" />`
        : initials(u.username)
      }
    </div>
    <div class="post-body">
      <div class="post-meta">
        <span class="post-name">${u.username}</span>
        <span class="post-handle">@${u.username}</span>
        <span class="post-dot">·</span>
        <span class="post-time">${timeAgo(post.createdAt)}</span>
        <button class="post-more" data-more="${post.id}">${icons.more}</button>
      </div>
      ${post.caption ? `<p class="post-text">${post.caption}</p>` : ""}
      ${post.imageUrl ? `<div class="post-image"><img src="${post.imageUrl}" alt="post image" loading="lazy"/></div>` : ""}
      <div class="post-actions">
        <button class="action-btn comment" data-comment-open="${post.id}" aria-label="Comment">
          ${icons.comment}<span>${post.commentsCount}</span>
        </button>
        <button class="action-btn repost" aria-label="Repost">
          ${icons.repost}<span>0</span>
        </button>
        <button class="action-btn like ${post.likedByMe ? "liked" : ""}" data-like="${post.id}" aria-label="Like">
          ${post.likedByMe ? icons.likeFill : icons.like}<span class="like-count">${post.likesCount}</span>
        </button>
        <button class="action-btn views" aria-label="Views">
          ${icons.views}<span>${fakeViews(post.id)}</span>
        </button>
      </div>
      <!-- Inline comment box (hidden by default) -->
      <div class="comment-box hidden" id="cbox-${post.id}">
        <div style="display:flex;gap:8px;margin-top:10px;">
          <input class="compose-input" placeholder="Post your reply…" id="cinput-${post.id}" />
          <button class="auth-btn-primary" style="width:auto;padding:8px 14px;font-size:0.85rem;" data-send-comment="${post.id}">Reply</button>
        </div>
      </div>
    </div>
  `;
  return card;
}

// ── Compose modal ─────────────────────────────────────────────────────────────
function showCompose(onPublish) {
  const overlay = document.createElement("div");
  overlay.className = "compose-overlay";
  overlay.innerHTML = `
    <div class="compose-modal">
      <div class="compose-header">
        <button id="closeCompose" style="font-size:1.3rem;color:var(--text)">✕</button>
        <button id="submitPost" class="auth-btn-primary" style="width:auto;padding:8px 18px;font-size:0.9rem;">Post</button>
      </div>
      <div class="compose-body">
        <div class="post-avatar" id="composeAvatar" style="background:${colorFor(state.user?.username)}">
          ${state.user?.profilePicUrl
            ? `<img src="${state.user.profilePicUrl}" />`
            : initials(state.user?.username)
          }
        </div>
        <div style="flex:1">
          <textarea class="compose-textarea" id="composeCaption" placeholder="What's happening?!"></textarea>
          <input class="compose-input" id="composeImageUrl" placeholder="Image URL (optional)" />
        </div>
      </div>
      <div class="compose-footer">
        <span style="color:var(--blue);font-size:0.9rem;">${icons.image.replace('><','style="width:20px;height:20px;fill:var(--blue)"><')}</span>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.querySelector("#closeCompose").addEventListener("click", () => overlay.remove());
  overlay.querySelector("#submitPost").addEventListener("click", async () => {
    const caption  = overlay.querySelector("#composeCaption").value.trim();
    const imageUrl = overlay.querySelector("#composeImageUrl").value.trim();
    if (!imageUrl) { alert("Image URL required"); return; }
    try {
      await api.createPost(state.token, { caption, imageUrl });
      overlay.remove();
      onPublish();
    } catch(e) { alert(e.message); }
  });
  overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.remove(); });
}

export const homePage = {
  render() {
    if (!state.isLoggedIn()) { router.navigate("#auth"); return; }

    const app = document.getElementById("app");
    app.innerHTML = `
      <div class="page-header">
        <div class="header-avatar">
          ${state.user?.profilePicUrl
            ? `<img src="${state.user.profilePicUrl}" />`
            : initials(state.user?.username)
          }
        </div>
        <div>
          <div class="page-header-title">Home</div>
        </div>
        <button class="settings-btn" style="margin-left:auto" id="homeSettingsBtn">${icons.settings}</button>
      </div>

      <div id="feedList">
        <div class="spinner"></div>
      </div>

      <!-- FAB -->
      <button class="fab" id="fabCompose" aria-label="New post">${icons.pen}</button>
    `;

    const feedList = document.getElementById("feedList");
    let posts = [];

    const renderFeed = async () => {
      feedList.innerHTML = `<div class="spinner"></div>`;
      try {
        posts = await api.getFeed(state.token);
        feedList.innerHTML = "";
        if (!posts.length) {
          feedList.innerHTML = `<div class="empty-state"><h3>Welcome to Pulseboard</h3><p>Follow people to see their posts here, or create your first post.</p></div>`;
          return;
        }
        posts.forEach((post, i) => feedList.appendChild(renderPostCard(post, i)));
      } catch (e) {
        feedList.innerHTML = `<div class="empty-state"><p style="color:var(--red)">${e.message}</p></div>`;
      }
    };

    // FAB → compose
    document.getElementById("fabCompose").addEventListener("click", () => {
      showCompose(renderFeed);
    });

    // Feed delegate events
    feedList.addEventListener("click", async (e) => {
      const t = e.target.closest("button") || e.target;
      if (!t) return;

      const likeId      = t.dataset.like;
      const commentOpen = t.dataset.commentOpen;
      const sendId      = t.dataset.sendComment;

      if (likeId) {
        const btn   = t.closest ? t : feedList.querySelector(`[data-like="${likeId}"]`);
        const liked = btn.classList.contains("liked");
        const countEl = btn.querySelector(".like-count");
        try {
          if (liked) {
            await api.unlikePost(state.token, likeId);
            btn.classList.remove("liked");
            btn.innerHTML = `${icons.like}<span class="like-count">${Math.max(0, parseInt(countEl?.textContent||0)-1)}</span>`;
          } else {
            await api.likePost(state.token, likeId);
            btn.classList.add("liked");
            btn.innerHTML = `${icons.likeFill}<span class="like-count" style="color:var(--red)">${parseInt(countEl?.textContent||0)+1}</span>`;
          }
        } catch(err) { console.error(err); }
        return;
      }

      if (commentOpen) {
        const box = document.getElementById(`cbox-${commentOpen}`);
        box?.classList.toggle("hidden");
        return;
      }

      if (sendId) {
        const input = document.getElementById(`cinput-${sendId}`);
        const content = input?.value?.trim();
        if (!content) return;
        try {
          await api.addComment(state.token, sendId, { content });
          input.value = "";
          const btn = feedList.querySelector(`[data-comment-open="${sendId}"]`);
          if (btn) {
            const span = btn.querySelector("span");
            if (span) span.textContent = parseInt(span.textContent||0) + 1;
          }
        } catch(err) { alert(err.message); }
      }
    });

    renderFeed();
  }
};

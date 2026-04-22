// pages/feed.js — Main social feed page
import { api } from "../api.js";
import { state } from "../state.js";
import { router } from "../router.js";

export const feedPage = {
  render() {
    if (!state.isLoggedIn()) {
      router.navigate("#auth");
      return;
    }

    const app = document.getElementById("app");
    app.innerHTML = `
      <div class="feed-page">
        <!-- Composer -->
        <div class="panel composer">
          <div class="composer-header">
            <div>
              <h2 class="panel-title">Share a new post</h2>
              <p class="text-sm text-ink/70">Drop a visual, add a caption, press publish.</p>
            </div>
            <span id="feedStatus" class="text-xs font-mono text-ink/60">Awaiting refresh</span>
          </div>
          <form id="postForm" class="panel-stack mt-4">
            <input class="input" name="imageUrl" placeholder="Image URL" required />
            <textarea class="input min-h-[80px] resize-none" name="caption" placeholder="Caption…"></textarea>
            <button class="btn-primary" type="submit">Publish →</button>
          </form>
        </div>

        <!-- Feed -->
        <div id="feed" class="feed-grid"></div>
      </div>
    `;

    const feed = document.getElementById("feed");
    const feedStatus = document.getElementById("feedStatus");

    const renderFeed = (posts) => {
      feed.innerHTML = "";
      if (!posts.length) {
        feed.innerHTML = `<div class="glass-panel p-6 text-sm text-center text-ink/60">
          No posts yet. Create one or <a href="#profile" class="underline text-lagoon">follow someone</a>.
        </div>`;
        return;
      }

      posts.forEach((post, index) => {
        const card = document.createElement("div");
        card.className = "glass-panel p-6 feed-card";
        card.style.animationDelay = `${index * 80}ms`;
        card.innerHTML = `
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm font-mono text-ink/60">@${post.user.username}</div>
              <h3 class="text-lg font-semibold">${post.caption || "Untitled"}</h3>
            </div>
            <span class="text-xs font-mono text-ink/60">${new Date(post.createdAt).toLocaleString()}</span>
          </div>
          <div class="mt-4">
            <img src="${post.imageUrl}" alt="post" class="rounded-2xl w-full max-h-[420px] object-cover" />
          </div>
          <div class="mt-4 flex flex-wrap gap-3 items-center text-sm">
            <button class="btn-secondary" data-like="${post.id}">${post.likedByMe ? "Unlike" : "Like"}</button>
            <span class="font-mono text-ink/70">${post.likesCount} likes</span>
            <span class="font-mono text-ink/70">${post.commentsCount} comments</span>
          </div>
          <div class="mt-4 grid gap-2">
            <input class="input" data-comment-input="${post.id}" placeholder="Write a comment…" />
            <div class="flex gap-2">
              <button class="btn-primary flex-1" data-comment="${post.id}">Send comment</button>
              <button class="btn-secondary flex-1" data-comments="${post.id}">Load comments</button>
            </div>
            <div class="text-xs font-mono text-ink/60" data-comment-list="${post.id}"></div>
          </div>
        `;
        feed.appendChild(card);
      });
    };

    const refreshFeed = async () => {
      feedStatus.textContent = "Loading…";
      try {
        const posts = await api.getFeed(state.token);
        renderFeed(posts);
        feedStatus.textContent = `Loaded ${posts.length} post${posts.length !== 1 ? "s" : ""}`;
      } catch (err) {
        feedStatus.textContent = err.message;
      }
    };

    // Post form
    document.getElementById("postForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      try {
        const payload = Object.fromEntries(new FormData(e.target).entries());
        await api.createPost(state.token, payload);
        e.target.reset();
        refreshFeed();
      } catch (err) {
        alert(err.message);
      }
    });

    // Feed delegate (like / comment)
    feed.addEventListener("click", async (e) => {
      const t = e.target;
      if (!(t instanceof HTMLElement)) return;

      const likeId = t.getAttribute("data-like");
      const commentId = t.getAttribute("data-comment");
      const listId = t.getAttribute("data-comments");

      try {
        if (likeId) {
          const action = t.textContent === "Like" ? api.likePost : api.unlikePost;
          await action(state.token, likeId);
          refreshFeed();
        } else if (commentId) {
          const input = feed.querySelector(`[data-comment-input="${commentId}"]`);
          const content = input?.value?.trim();
          if (!content) { alert("Comment required"); return; }
          await api.addComment(state.token, commentId, { content });
          input.value = "";
          refreshFeed();
        } else if (listId) {
          const list = feed.querySelector(`[data-comment-list="${listId}"]`);
          const comments = await api.listComments(listId);
          list.textContent = comments.map(c => `@${c.user.username}: ${c.content}`).join("\n");
        }
      } catch (err) {
        alert(err.message);
      }
    });

    refreshFeed();
  }
};

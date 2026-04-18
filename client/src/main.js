import "./styles.css";
import { api } from "./api";

const state = {
  token: localStorage.getItem("token") || "",
  user: JSON.parse(localStorage.getItem("user") || "null")
};

const authStatus = document.getElementById("authStatus");
const btnLogout = document.getElementById("btnLogout");
const btnRefresh = document.getElementById("btnRefresh");
const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");
const postForm = document.getElementById("postForm");
const feed = document.getElementById("feed");
const feedStatus = document.getElementById("feedStatus");
const followUserId = document.getElementById("followUserId");
const btnFollow = document.getElementById("btnFollow");
const btnUnfollow = document.getElementById("btnUnfollow");
const profileUserId = document.getElementById("profileUserId");
const btnProfile = document.getElementById("btnProfile");
const profileOutput = document.getElementById("profileOutput");

const setAuth = (payload) => {
  state.token = payload?.token || "";
  state.user = payload?.user || null;
  localStorage.setItem("token", state.token);
  localStorage.setItem("user", JSON.stringify(state.user));
  renderAuth();
};

const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  state.token = "";
  state.user = null;
  renderAuth();
};

const renderAuth = () => {
  if (state.user) {
    authStatus.textContent = `Signed in as ${state.user.username} (id: ${state.user.id})`;
  } else {
    authStatus.textContent = "Not signed in";
  }
};

const renderFeed = (posts) => {
  feed.innerHTML = "";
  if (!posts.length) {
    feed.innerHTML = "<div class=\"glass-panel p-6 text-sm\">No posts yet. Create one or follow someone.</div>";
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
        <input class="input" data-comment-input="${post.id}" placeholder="Write a comment" />
        <button class="btn-primary" data-comment="${post.id}">Send comment</button>
        <button class="btn-secondary" data-comments="${post.id}">Load comments</button>
        <div class="text-xs font-mono text-ink/60" data-comment-list="${post.id}"></div>
      </div>
    `;

    feed.appendChild(card);
  });
};

const refreshFeed = async () => {
  if (!state.token) {
    feedStatus.textContent = "Login required";
    return;
  }

  feedStatus.textContent = "Loading...";
  try {
    const posts = await api.getFeed(state.token);
    renderFeed(posts);
    feedStatus.textContent = `Loaded ${posts.length} posts`;
  } catch (error) {
    feedStatus.textContent = error.message;
  }
};

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(registerForm);
  try {
    const payload = Object.fromEntries(formData.entries());
    const result = await api.register(payload);
    setAuth(result);
  } catch (error) {
    alert(error.message);
  }
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(loginForm);
  try {
    const payload = Object.fromEntries(formData.entries());
    const result = await api.login(payload);
    setAuth(result);
  } catch (error) {
    alert(error.message);
  }
});

postForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!state.token) {
    alert("Login required");
    return;
  }

  const formData = new FormData(postForm);
  try {
    const payload = Object.fromEntries(formData.entries());
    await api.createPost(state.token, payload);
    postForm.reset();
    refreshFeed();
  } catch (error) {
    alert(error.message);
  }
});

btnLogout.addEventListener("click", () => {
  clearAuth();
});

btnRefresh.addEventListener("click", refreshFeed);

btnFollow.addEventListener("click", async () => {
  if (!state.token) {
    alert("Login required");
    return;
  }

  try {
    await api.followUser(state.token, followUserId.value.trim());
    alert("Followed");
  } catch (error) {
    alert(error.message);
  }
});

btnUnfollow.addEventListener("click", async () => {
  if (!state.token) {
    alert("Login required");
    return;
  }

  try {
    await api.unfollowUser(state.token, followUserId.value.trim());
    alert("Unfollowed");
  } catch (error) {
    alert(error.message);
  }
});

btnProfile.addEventListener("click", async () => {
  try {
    const profile = await api.getProfile(profileUserId.value.trim());
    profileOutput.textContent = JSON.stringify(profile, null, 2);
  } catch (error) {
    profileOutput.textContent = error.message;
  }
});

feed.addEventListener("click", async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const likeId = target.getAttribute("data-like");
  const commentId = target.getAttribute("data-comment");
  const listId = target.getAttribute("data-comments");

  try {
    if (likeId) {
      if (!state.token) {
        alert("Login required");
        return;
      }
      const action = target.textContent === "Like" ? api.likePost : api.unlikePost;
      await action(state.token, likeId);
      refreshFeed();
      return;
    }

    if (commentId) {
      if (!state.token) {
        alert("Login required");
        return;
      }
      const input = document.querySelector(`[data-comment-input="${commentId}"]`);
      const content = input?.value?.trim();
      if (!content) {
        alert("Comment required");
        return;
      }
      await api.addComment(state.token, commentId, { content });
      input.value = "";
      refreshFeed();
      return;
    }

    if (listId) {
      const list = document.querySelector(`[data-comment-list="${listId}"]`);
      const comments = await api.listComments(listId);
      list.textContent = comments.map((comment) => `@${comment.user.username}: ${comment.content}`).join("\n");
    }
  } catch (error) {
    alert(error.message);
  }
});

renderAuth();

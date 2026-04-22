const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

const request = async (path, options = {}) => {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {})
    },
    ...options
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data.message || "Request failed";
    throw new Error(message);
  }
  return data;
};

export const api = {
  register(payload) {
    return request("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },
  login(payload) {
    return request("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },
  getFeed(token) {
    return request("/feed", { token });
  },
  createPost(token, payload) {
    return request("/posts", {
      method: "POST",
      token,
      body: JSON.stringify(payload)
    });
  },
  likePost(token, postId) {
    return request(`/posts/${postId}/like`, { method: "POST", token });
  },
  unlikePost(token, postId) {
    return request(`/posts/${postId}/like`, { method: "DELETE", token });
  },
  addComment(token, postId, payload) {
    return request(`/posts/${postId}/comments`, {
      method: "POST",
      token,
      body: JSON.stringify(payload)
    });
  },
  listComments(postId) {
    return request(`/posts/${postId}/comments`);
  },
  followUser(token, userId) {
    return request(`/users/${userId}/follow`, { method: "POST", token });
  },
  unfollowUser(token, userId) {
    return request(`/users/${userId}/follow`, { method: "DELETE", token });
  },
  getProfile(userId) {
    return request(`/users/${userId}`);
  }
};

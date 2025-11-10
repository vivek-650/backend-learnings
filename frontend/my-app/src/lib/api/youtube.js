// YouTube Clone API Service Layer
// Centralized API communication with backend

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

class APIError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

/**
 * Make an API request with automatic error handling
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    ...options,
    credentials: "include", // Include cookies for authentication
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new APIError(
        data.message || "Request failed",
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError("Network error", 0, { message: error.message });
  }
}

// ==================== USER AUTHENTICATION ====================

/**
 * Register a new user with avatar and cover image
 */
export async function registerUser(userData) {
  const formData = new FormData();

  formData.append("fullname", userData.fullname);
  formData.append("username", userData.username);
  formData.append("email", userData.email);
  formData.append("password", userData.password);

  if (userData.avatar) {
    formData.append("avatar", userData.avatar);
  }

  if (userData.coverImage) {
    formData.append("coverImage", userData.coverImage);
  }

  return apiRequest("/users/register", {
    method: "POST",
    body: formData,
  });
}

/**
 * Login user with username/email and password
 */
export async function loginUser(credentials) {
  return apiRequest("/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
}

/**
 * Logout current user
 */
export async function logoutUser() {
  return apiRequest("/users/logout", {
    method: "POST",
  });
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken() {
  return apiRequest("/users/refresh-token", {
    method: "POST",
  });
}

// ==================== USER PROFILE ====================

/**
 * Get current user profile
 */
export async function getCurrentUser() {
  return apiRequest("/users/me", {
    method: "GET",
  });
}

/**
 * Update user profile (fullname, email)
 */
export async function updateUserProfile(updates) {
  return apiRequest("/users/update-profile", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });
}

/**
 * Change user password
 */
export async function changePassword(passwordData) {
  return apiRequest("/users/change-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(passwordData),
  });
}

/**
 * Update user avatar
 */
export async function updateAvatar(avatarFile) {
  const formData = new FormData();
  formData.append("avatar", avatarFile);

  return apiRequest("/users/avatar", {
    method: "PATCH",
    body: formData,
  });
}

/**
 * Update user cover image
 */
export async function updateCoverImage(coverImageFile) {
  const formData = new FormData();
  formData.append("coverImage", coverImageFile);

  return apiRequest("/users/coverImage", {
    method: "PATCH",
    body: formData,
  });
}

// ==================== CHANNEL ====================

/**
 * Get channel profile by username
 */
export async function getChannelProfile(username) {
  return apiRequest(`/users/channel/${username}`, {
    method: "GET",
  });
}

// ==================== WATCH HISTORY ====================

/**
 * Get user watch history
 */
export async function getWatchHistory() {
  return apiRequest("/users/history", {
    method: "GET",
  });
}

// ==================== VIDEO OPERATIONS ====================
// Note: These will be added when video routes are implemented

/**
 * Get all videos (home feed)
 */
export async function getAllVideos(query = {}) {
  const params = new URLSearchParams(query);
  return apiRequest(`/videos?${params}`, {
    method: "GET",
  });
}

/**
 * Get video by ID
 */
export async function getVideoById(videoId) {
  return apiRequest(`/videos/${videoId}`, {
    method: "GET",
  });
}

/**
 * Upload a new video
 */
export async function uploadVideo(videoData) {
  const formData = new FormData();

  formData.append("title", videoData.title);
  formData.append("description", videoData.description);
  formData.append("videoFile", videoData.videoFile);
  formData.append("thumbnail", videoData.thumbnail);

  if (videoData.isPublished !== undefined) {
    formData.append("isPublished", videoData.isPublished);
  }

  return apiRequest("/videos", {
    method: "POST",
    body: formData,
  });
}

/**
 * Update video details
 */
export async function updateVideo(videoId, updates) {
  return apiRequest(`/videos/${videoId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });
}

/**
 * Delete video
 */
export async function deleteVideo(videoId) {
  return apiRequest(`/videos/${videoId}`, {
    method: "DELETE",
  });
}

/**
 * Toggle video publish status
 */
export async function togglePublishStatus(videoId) {
  return apiRequest(`/videos/toggle/publish/${videoId}`, {
    method: "PATCH",
  });
}

// ==================== COMMENT OPERATIONS ====================

/**
 * Get comments for a video
 */
export async function getVideoComments(videoId, { page = 1, limit = 10 } = {}) {
  const params = new URLSearchParams({ page, limit });
  return apiRequest(`/comments/${videoId}?${params}`, {
    method: "GET",
  });
}

/**
 * Add a comment to a video
 */
export async function addComment(videoId, content) {
  return apiRequest(`/comments/${videoId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });
}

/**
 * Update a comment
 */
export async function updateComment(commentId, content) {
  return apiRequest(`/comments/c/${commentId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });
}

/**
 * Delete a comment
 */
export async function deleteComment(commentId) {
  return apiRequest(`/comments/c/${commentId}`, {
    method: "DELETE",
  });
}

// ==================== LIKE OPERATIONS ====================

/**
 * Toggle like on a video
 */
export async function toggleVideoLike(videoId) {
  return apiRequest(`/likes/toggle/v/${videoId}`, {
    method: "POST",
  });
}

/**
 * Toggle like on a comment
 */
export async function toggleCommentLike(commentId) {
  return apiRequest(`/likes/toggle/c/${commentId}`, {
    method: "POST",
  });
}

/**
 * Toggle like on a tweet
 */
export async function toggleTweetLike(tweetId) {
  return apiRequest(`/likes/toggle/t/${tweetId}`, {
    method: "POST",
  });
}

/**
 * Get all liked videos
 */
export async function getLikedVideos() {
  return apiRequest("/likes/videos", {
    method: "GET",
  });
}

// ==================== PLAYLIST OPERATIONS ====================

/**
 * Create a new playlist
 */
export async function createPlaylist(name, description = "") {
  return apiRequest("/playlists", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, description }),
  });
}

/**
 * Get user playlists
 */
export async function getUserPlaylists(userId) {
  return apiRequest(`/playlists/user/${userId}`, {
    method: "GET",
  });
}

/**
 * Get playlist by ID
 */
export async function getPlaylistById(playlistId) {
  return apiRequest(`/playlists/${playlistId}`, {
    method: "GET",
  });
}

/**
 * Update playlist
 */
export async function updatePlaylist(playlistId, updates) {
  return apiRequest(`/playlists/${playlistId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });
}

/**
 * Delete playlist
 */
export async function deletePlaylist(playlistId) {
  return apiRequest(`/playlists/${playlistId}`, {
    method: "DELETE",
  });
}

/**
 * Add video to playlist
 */
export async function addVideoToPlaylist(playlistId, videoId) {
  return apiRequest(`/playlists/add/${videoId}/${playlistId}`, {
    method: "PATCH",
  });
}

/**
 * Remove video from playlist
 */
export async function removeVideoFromPlaylist(playlistId, videoId) {
  return apiRequest(`/playlists/remove/${videoId}/${playlistId}`, {
    method: "PATCH",
  });
}

// ==================== TWEET OPERATIONS ====================

/**
 * Create a tweet
 */
export async function createTweet(content) {
  return apiRequest("/tweets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });
}

/**
 * Get user tweets
 */
export async function getUserTweets(userId) {
  return apiRequest(`/tweets/user/${userId}`, {
    method: "GET",
  });
}

/**
 * Update a tweet
 */
export async function updateTweet(tweetId, content) {
  return apiRequest(`/tweets/${tweetId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });
}

/**
 * Delete a tweet
 */
export async function deleteTweet(tweetId) {
  return apiRequest(`/tweets/${tweetId}`, {
    method: "DELETE",
  });
}

// ==================== DASHBOARD OPERATIONS ====================

/**
 * Get channel statistics
 */
export async function getChannelStats() {
  return apiRequest("/dashboard/stats", {
    method: "GET",
  });
}

/**
 * Get all channel videos
 */
export async function getChannelVideos() {
  return apiRequest("/dashboard/videos", {
    method: "GET",
  });
}

// ==================== SUBSCRIPTION OPERATIONS ====================

/**
 * Toggle subscription to a channel
 */
export async function toggleSubscription(channelId) {
  return apiRequest(`/subscriptions/c/${channelId}`, {
    method: "POST",
  });
}

/**
 * Get channel subscribers
 */
export async function getChannelSubscribers(channelId) {
  return apiRequest(`/subscriptions/c/${channelId}`, {
    method: "GET",
  });
}

/**
 * Get subscribed channels
 */
export async function getSubscribedChannels(subscriberId) {
  return apiRequest(`/subscriptions/u/${subscriberId}`, {
    method: "GET",
  });
}

// ==================== SEARCH ====================

/**
 * Search videos
 */
export async function searchVideos(query) {
  const params = new URLSearchParams({ q: query });
  return apiRequest(`/search?${params}`, {
    method: "GET",
  });
}

export { APIError };

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
export async function updateAvatar(formData) {
  return apiRequest("/users/avatar", {
    method: "PATCH",
    body: formData,
  });
}

/**
 * Update user cover image
 */
export async function updateCoverImage(formData) {
  return apiRequest("/users/cover-image", {
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
export async function uploadVideo(formData) {
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

// ==================== SUBSCRIPTION OPERATIONS ====================

/**
 * Subscribe to a channel
 */
export async function subscribeToChannel(channelId) {
  return apiRequest(`/subscriptions/c/${channelId}`, {
    method: "POST",
  });
}

/**
 * Unsubscribe from a channel
 */
export async function unsubscribeFromChannel(channelId) {
  return apiRequest(`/subscriptions/c/${channelId}`, {
    method: "DELETE",
  });
}

/**
 * Get user subscriptions
 */
export async function getUserSubscriptions() {
  return apiRequest("/subscriptions", {
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

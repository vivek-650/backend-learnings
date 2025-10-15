// API utility functions for backend communication
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

/**
 * Register a new user with avatar and cover image
 */
export async function registerUser(userData) {
  const formData = new FormData();

  // Append text fields
  formData.append("fullname", userData.fullname);
  formData.append("username", userData.username);
  formData.append("email", userData.email);
  formData.append("password", userData.password);

  // Append files
  if (userData.avatar) {
    formData.append("avatar", userData.avatar);
  }

  if (userData.coverImage) {
    formData.append("coverImage", userData.coverImage);
  }

  return apiRequest("/users/register", {
    method: "POST",
    body: formData,
    // Don't set Content-Type - browser will set with boundary
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
 * Get current user profile
 */
export async function getCurrentUser() {
  return apiRequest("/users/me", {
    method: "GET",
  });
}

/**
 * Update user profile
 */
export async function updateUserProfile(updates) {
  return apiRequest("/users/profile", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });
}

export { APIError };

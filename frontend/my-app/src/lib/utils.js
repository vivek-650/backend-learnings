// YouTube-style utility functions

/**
 * Format view count (e.g., 1234 -> 1.2K, 1234567 -> 1.2M)
 */
export function formatViews(views) {
  if (views === undefined || views === null) return "0 views";

  const num = Number(views);

  if (num < 1000) {
    return `${num} view${num !== 1 ? "s" : ""}`;
  }

  if (num < 1000000) {
    return `${(num / 1000).toFixed(1)}K views`;
  }

  if (num < 1000000000) {
    return `${(num / 1000000).toFixed(1)}M views`;
  }

  return `${(num / 1000000000).toFixed(1)}B views`;
}

/**
 * Format subscriber count (e.g., 1234 -> 1.23K, 1234567 -> 1.23M)
 */
export function formatSubscribers(count) {
  if (count === undefined || count === null) return "0 subscribers";

  const num = Number(count);

  if (num < 1000) {
    return `${num} subscriber${num !== 1 ? "s" : ""}`;
  }

  if (num < 1000000) {
    return `${(num / 1000).toFixed(2)}K subscribers`;
  }

  if (num < 1000000000) {
    return `${(num / 1000000).toFixed(2)}M subscribers`;
  }

  return `${(num / 1000000000).toFixed(2)}B subscribers`;
}

/**
 * Format time ago (e.g., "2 hours ago", "3 days ago")
 */
export function formatTimeAgo(date) {
  if (!date) return "";

  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks !== 1 ? "s" : ""} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths !== 1 ? "s" : ""} ago`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} year${diffInYears !== 1 ? "s" : ""} ago`;
}

/**
 * Format video duration (seconds to MM:SS or HH:MM:SS)
 */
export function formatDuration(seconds) {
  if (!seconds || seconds < 0) return "0:00";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(
      secs
    ).padStart(2, "0")}`;
  }

  return `${minutes}:${String(secs).padStart(2, "0")}`;
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text, maxLength) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

/**
 * Get initials from name
 */
export function getInitials(name) {
  if (!name) return "";

  const parts = name.trim().split(" ");
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/**
 * Generate a random color for avatar placeholder
 */
export function getAvatarColor(str) {
  if (!str) return "#3B82F6"; // Default blue

  const colors = [
    "#EF4444", // red
    "#F59E0B", // amber
    "#10B981", // green
    "#3B82F6", // blue
    "#6366F1", // indigo
    "#8B5CF6", // violet
    "#EC4899", // pink
    "#F97316", // orange
  ];

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}

/**
 * Validate video file
 */
export function isValidVideoFile(file) {
  if (!file) return false;

  const validTypes = ["video/mp4", "video/webm", "video/ogg"];
  const maxSize = 500 * 1024 * 1024; // 500MB

  return validTypes.includes(file.type) && file.size <= maxSize;
}

/**
 * Validate image file
 */
export function isValidImageFile(file) {
  if (!file) return false;

  const validTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  const maxSize = 5 * 1024 * 1024; // 5MB

  return validTypes.includes(file.type) && file.size <= maxSize;
}

/**
 * Format file size
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

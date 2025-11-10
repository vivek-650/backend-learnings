"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import YouTubeLayout from "@/components/layout/YouTubeLayout";
import { useAuth } from "@/context/AuthContext";
import { getAllVideos, deleteVideo, updateVideo } from "@/lib/api/youtube";
import { formatViews, formatTimeAgo, formatDuration } from "@/lib/utils";

export default function StudioPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (user) {
      fetchUserVideos();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchUserVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      // TODO: Implement video routes in backend
      // For now, show empty state since /videos endpoint doesn't exist yet
      // const data = await getAllVideos({ uploadedBy: user._id });
      // setVideos(data.videos || []);
      setVideos([]);
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch videos:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (videoId) => {
    if (
      !confirm(
        "Are you sure you want to delete this video? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setDeletingId(videoId);
      await deleteVideo(videoId);
      setVideos(videos.filter((v) => v._id !== videoId));
    } catch (err) {
      alert("Failed to delete video: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleTogglePublish = async (video) => {
    try {
      await updateVideo(video._id, { isPublished: !video.isPublished });
      setVideos(
        videos.map((v) =>
          v._id === video._id ? { ...v, isPublished: !v.isPublished } : v
        )
      );
    } catch (err) {
      alert("Failed to update video: " + err.message);
    }
  };

  if (!user) {
    return (
      <YouTubeLayout>
        <div className="max-w-4xl mx-auto px-6 py-12 text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            Sign in to access Studio
          </h2>
          <p className="text-gray-500 mb-6">Manage your content and channel</p>
          <a
            href="/login"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
          >
            Sign In
          </a>
        </div>
      </YouTubeLayout>
    );
  }

  return (
    <YouTubeLayout>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Channel Content</h1>
            <p className="text-gray-600">Manage your videos and analytics</p>
          </div>
          <button
            onClick={() => router.push("/upload")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Upload Video
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border rounded-lg p-4">
            <div className="text-gray-600 text-sm mb-1">Total Videos</div>
            <div className="text-2xl font-bold">{videos.length}</div>
          </div>
          <div className="bg-white border rounded-lg p-4">
            <div className="text-gray-600 text-sm mb-1">Total Views</div>
            <div className="text-2xl font-bold">
              {formatViews(videos.reduce((sum, v) => sum + (v.views || 0), 0))}
            </div>
          </div>
          <div className="bg-white border rounded-lg p-4">
            <div className="text-gray-600 text-sm mb-1">Published</div>
            <div className="text-2xl font-bold">
              {videos.filter((v) => v.isPublished).length}
            </div>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-white border rounded-lg p-4"
              >
                <div className="flex gap-4">
                  <div className="w-40 h-24 bg-gray-200 rounded"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-lg">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Failed to load videos: {error}</span>
            </div>
            <button
              onClick={fetchUserVideos}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Videos list */}
        {!loading && !error && (
          <>
            {videos.length > 0 ? (
              <div className="bg-white border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Video
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Visibility
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Views
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Duration
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {videos.map((video) => (
                        <tr key={video._id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="relative w-32 h-18 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                                {video.thumbnail && (
                                  <Image
                                    src={video.thumbnail}
                                    alt={video.title}
                                    fill
                                    className="object-cover"
                                  />
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className="font-medium text-sm line-clamp-2">
                                  {video.title}
                                </h3>
                                {video.description && (
                                  <p className="text-xs text-gray-500 line-clamp-1">
                                    {video.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                video.isPublished
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {video.isPublished ? "Public" : "Unlisted"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {formatTimeAgo(video.createdAt)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {formatViews(video.views || 0)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {video.duration
                              ? formatDuration(video.duration)
                              : "N/A"}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleTogglePublish(video)}
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                                title={
                                  video.isPublished ? "Unpublish" : "Publish"
                                }
                              >
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  {video.isPublished ? (
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                    />
                                  ) : (
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    />
                                  )}
                                </svg>
                              </button>
                              <button
                                onClick={() =>
                                  router.push(`/watch?v=${video._id}`)
                                }
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                                title="View video"
                              >
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDelete(video._id)}
                                disabled={deletingId === video._id}
                                className="p-2 text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
                                title="Delete video"
                              >
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-white border rounded-lg">
                <svg
                  className="w-24 h-24 mx-auto text-gray-300 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No videos uploaded yet
                </h3>
                <p className="text-gray-500 mb-6">
                  Start creating content for your channel
                </p>
                <button
                  onClick={() => router.push("/upload")}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Upload Your First Video
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </YouTubeLayout>
  );
}

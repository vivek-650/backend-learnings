"use client";

import { useState, useEffect } from "react";
import YouTubeLayout from "@/components/layout/YouTubeLayout";
import VideoCard from "@/components/video/VideoCard";
import { getWatchHistory } from "@/lib/api/youtube";
import { useAuth } from "@/context/AuthContext";

export default function HistoryPage() {
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchHistory();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getWatchHistory();
      setVideos(data.watchHistory || []);
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch history:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <YouTubeLayout>
        <div className="max-w-4xl mx-auto px-6 py-12 text-center">
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
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            Keep track of what you watch
          </h2>
          <p className="text-gray-500 mb-6">
            Watch history not viewable when signed out
          </p>
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
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Watch History</h1>
          {videos.length > 0 && (
            <button
              onClick={() => {
                if (confirm("Clear all watch history?")) {
                  // TODO: Implement clear history API
                  setVideos([]);
                }
              }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear all watch history
            </button>
          )}
        </div>

        {/* Loading state */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-video bg-gray-200 rounded-xl mb-3"></div>
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-gray-200"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
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
              <span>Failed to load history: {error}</span>
            </div>
            <button
              onClick={fetchHistory}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Videos grid */}
        {!loading && !error && (
          <>
            {videos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {videos.map((video) => (
                  <VideoCard key={video._id} video={video} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No watch history
                </h3>
                <p className="text-gray-500">
                  Videos you watch will show up here
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </YouTubeLayout>
  );
}

"use client";

import { useState, useEffect } from "react";
import YouTubeLayout from "@/components/layout/YouTubeLayout";
import VideoCard from "@/components/video/VideoCard";
import { getAllVideos } from "@/lib/api/youtube";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllVideos({
        limit: 24,
        sortBy: "createdAt",
        sortType: "desc",
      });
      setVideos(data.data?.videos || []);
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch videos:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <YouTubeLayout>
      <div className="p-6">
        {/* Filter chips */}
        <div className="mb-6 flex gap-3 overflow-x-auto pb-2">
          {[
            "All",
            "Music",
            "Gaming",
            "Live",
            "News",
            "Sports",
            "Learning",
            "Fashion",
            "Podcasts",
          ].map((filter) => (
            <button
              key={filter}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                filter === "All"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-900"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Loading state */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(12)].map((_, i) => (
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
              <span>Failed to load videos: {error}</span>
            </div>
            <button
              onClick={fetchVideos}
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
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No videos yet
                </h3>
                <p className="text-gray-500">
                  Check back later for new content
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </YouTubeLayout>
  );
}

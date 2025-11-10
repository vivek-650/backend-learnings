"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getLikedVideos } from "@/lib/api/youtube";
import VideoCard from "@/components/video/VideoCard";

export default function LikedVideosPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLikedVideos();
  }, []);

  const loadLikedVideos = async () => {
    try {
      setLoading(true);
      const response = await getLikedVideos();
      setVideos(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error loading liked videos:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading liked videos...</div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Liked Videos</h1>
        <p className="text-gray-600 mt-2">
          {videos.length} video{videos.length !== 1 ? "s" : ""}
        </p>
      </div>

      {videos.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">
            You haven&apos;t liked any videos yet
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Explore Videos
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {videos.map((item) => (
            <VideoCard key={item._id} video={item.video} />
          ))}
        </div>
      )}
    </div>
  );
}

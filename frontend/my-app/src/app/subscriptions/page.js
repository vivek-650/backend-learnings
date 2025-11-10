"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getSubscribedChannels, getAllVideos } from "@/lib/api/youtube";
import VideoCard from "@/components/video/VideoCard";

export default function SubscriptionsPage() {
  const [channels, setChannels] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Get user ID from localStorage or auth context
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user._id) {
      setUserId(user._id);
      loadSubscriptions(user._id);
    }
  }, []);

  const loadSubscriptions = async (userId) => {
    try {
      setLoading(true);

      // Get subscribed channels
      const channelsResponse = await getSubscribedChannels(userId);
      setChannels(channelsResponse.data.channels || []);

      // Get videos from subscribed channels
      // You can filter by userId in the backend or fetch all and filter here
      const videosResponse = await getAllVideos({
        sortBy: "createdAt",
        sortType: "desc",
        limit: 20,
      });

      // Filter videos from subscribed channels
      const subscribedChannelIds =
        channelsResponse.data.channels?.map((ch) => ch.channel._id) || [];

      const filteredVideos =
        videosResponse.data.videos?.filter((video) =>
          subscribedChannelIds.includes(video.owner?._id)
        ) || [];

      setVideos(filteredVideos);
      setLoading(false);
    } catch (error) {
      console.error("Error loading subscriptions:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading subscriptions...</div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6">
      {/* Subscribed Channels */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Your Subscriptions</h2>

        {channels.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600 mb-4">
              You haven&apos;t subscribed to any channels yet
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Discover Channels
            </Link>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {channels.map((sub) => (
              <Link
                key={sub._id}
                href={`/channel/${sub.channel.username}`}
                className="flex flex-col items-center min-w-[120px] group"
              >
                <Image
                  src={sub.channel.avatar || "/default-avatar.png"}
                  alt={sub.channel.fullname}
                  width={96}
                  height={96}
                  className="w-24 h-24 rounded-full mb-2 group-hover:ring-4 ring-blue-500"
                />
                <span className="text-sm font-medium text-center">
                  {sub.channel.fullname}
                </span>
                <span className="text-xs text-gray-600">
                  @{sub.channel.username}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Latest Videos from Subscriptions */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Latest Videos</h2>

        {videos.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600">
              No videos from your subscriptions yet
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

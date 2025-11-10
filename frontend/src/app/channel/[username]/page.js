"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import YouTubeLayout from "@/components/layout/YouTubeLayout";
import VideoCard from "@/components/video/VideoCard";
import {
  getChannelProfile,
  subscribeToChannel,
  unsubscribeFromChannel,
} from "@/lib/api/youtube";
import { formatSubscribers, getInitials, getAvatarColor } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

export default function ChannelPage() {
  const params = useParams();
  const username = params?.username;
  const { user } = useAuth();

  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("videos");
  const [isSubscribing, setIsSubscribing] = useState(false);

  useEffect(() => {
    if (username) {
      fetchChannelData();
    }
  }, [username]);

  const fetchChannelData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getChannelProfile(username);
      setChannel(data);
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch channel:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!user) {
      // Redirect to login
      window.location.href = "/login";
      return;
    }

    try {
      setIsSubscribing(true);
      if (channel?.isSubscribed) {
        await unsubscribeFromChannel(channel._id);
        setChannel((prev) => ({
          ...prev,
          isSubscribed: false,
          subscribersCount: prev.subscribersCount - 1,
        }));
      } else {
        await subscribeToChannel(channel._id);
        setChannel((prev) => ({
          ...prev,
          isSubscribed: true,
          subscribersCount: prev.subscribersCount + 1,
        }));
      }
    } catch (err) {
      console.error("Subscribe error:", err);
    } finally {
      setIsSubscribing(false);
    }
  };

  if (loading) {
    return (
      <YouTubeLayout>
        <div className="animate-pulse">
          <div className="h-48 bg-gray-200"></div>
          <div className="px-6 py-4">
            <div className="flex items-start gap-6">
              <div className="w-32 h-32 rounded-full bg-gray-200"></div>
              <div className="flex-1">
                <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-48"></div>
              </div>
            </div>
          </div>
        </div>
      </YouTubeLayout>
    );
  }

  if (error || !channel) {
    return (
      <YouTubeLayout>
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">
            {error || "Channel not found"}
          </div>
          <button
            onClick={fetchChannelData}
            className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </YouTubeLayout>
    );
  }

  const isOwnChannel = user?.username === channel.username;

  return (
    <YouTubeLayout>
      <div>
        {/* Cover Image */}
        <div className="relative h-48 bg-gradient-to-r from-blue-400 to-purple-500">
          {channel.coverImage && (
            <Image
              src={channel.coverImage}
              alt="Channel cover"
              fill
              className="object-cover"
            />
          )}
        </div>

        {/* Channel Info */}
        <div className="px-6 py-4 border-b">
          <div className="flex items-start gap-6 mb-4">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {channel.avatar ? (
                <Image
                  src={channel.avatar}
                  alt={channel.fullname}
                  width={128}
                  height={128}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white -mt-16"
                />
              ) : (
                <div
                  className="w-32 h-32 rounded-full flex items-center justify-center text-white text-4xl font-bold border-4 border-white -mt-16"
                  style={{ backgroundColor: getAvatarColor(channel.username) }}
                >
                  {getInitials(channel.fullname)}
                </div>
              )}
            </div>

            {/* Channel details */}
            <div className="flex-1 pt-4">
              <h1 className="text-2xl font-bold mb-1">{channel.fullname}</h1>
              <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
                <span>@{channel.username}</span>
                <span>•</span>
                <span>{formatSubscribers(channel.subscribersCount || 0)}</span>
                <span>•</span>
                <span>{channel.videosCount || 0} videos</span>
              </div>
              {channel.description && (
                <p className="text-sm text-gray-700 line-clamp-2 max-w-2xl">
                  {channel.description}
                </p>
              )}
            </div>

            {/* Subscribe button */}
            {!isOwnChannel && (
              <button
                onClick={handleSubscribe}
                disabled={isSubscribing}
                className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                  channel.isSubscribed
                    ? "bg-gray-100 hover:bg-gray-200 text-gray-900"
                    : "bg-red-600 hover:bg-red-700 text-white"
                }`}
              >
                {isSubscribing
                  ? "Loading..."
                  : channel.isSubscribed
                  ? "Subscribed"
                  : "Subscribe"}
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-8 border-b -mb-4">
            {["Videos", "Shorts", "Playlists", "About"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`pb-3 border-b-2 transition-colors ${
                  activeTab === tab.toLowerCase()
                    ? "border-gray-900 font-semibold"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-6 py-6">
          {activeTab === "videos" && (
            <>
              {channel.videos && channel.videos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {channel.videos.map((video) => (
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
                    This channel has not uploaded any videos
                  </p>
                </div>
              )}
            </>
          )}

          {activeTab === "about" && (
            <div className="max-w-3xl">
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {channel.description || "No description provided"}
                </p>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Channel Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Username:</span>
                      <span className="font-medium">@{channel.username}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{channel.email}</span>
                    </div>
                    {channel.createdAt && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">Joined:</span>
                        <span className="font-medium">
                          {new Date(channel.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {(activeTab === "shorts" || activeTab === "playlists") && (
            <div className="text-center py-12">
              <p className="text-gray-500">Coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </YouTubeLayout>
  );
}

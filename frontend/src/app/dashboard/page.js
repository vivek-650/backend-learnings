"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import YouTubeLayout from "@/components/layout/YouTubeLayout";
import { useAuth } from "@/context/AuthContext";
import { getChannelStats, getChannelVideos } from "@/lib/api/youtube";
import { formatViews, formatTimeAgo } from "@/lib/utils";

function DashboardContent() {
  const router = useRouter();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentVideos, setRecentVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboard();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [statsResponse, videosResponse] = await Promise.all([
        getChannelStats(),
        getChannelVideos(),
      ]);

      setStats(statsResponse.data);
      setRecentVideos(videosResponse.data?.slice(0, 5) || []);
      setLoading(false);
    } catch (error) {
      console.error("Error loading dashboard:", error);
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <YouTubeLayout>
        <div className="max-w-4xl mx-auto px-6 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">
            Sign in to view your dashboard
          </h1>
          <p className="text-gray-600 mb-6">
            You need to be signed in to access your channel dashboard
          </p>
          <Link
            href="/login"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700"
          >
            Sign In
          </Link>
        </div>
      </YouTubeLayout>
    );
  }

  if (loading) {
    return (
      <YouTubeLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl">Loading dashboard...</div>
        </div>
      </YouTubeLayout>
    );
  }

  return (
    <YouTubeLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-1">Channel Dashboard</h1>
                <p className="text-gray-600">
                  Track your channel performance and manage content
                </p>
              </div>
              <Link
                href="/upload"
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700"
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
                Create
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-start justify-between mb-2">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold mb-1">
                {formatViews(stats?.totalViews || 0)}
              </p>
              <p className="text-sm text-gray-600">Total Views</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-start justify-between mb-2">
                <div className="p-2 bg-red-50 rounded-lg">
                  <svg
                    className="w-6 h-6 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold mb-1">
                {formatViews(stats?.totalSubscribers || 0)}
              </p>
              <p className="text-sm text-gray-600">Subscribers</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-start justify-between mb-2">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <svg
                    className="w-6 h-6 text-purple-600"
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
                </div>
              </div>
              <p className="text-3xl font-bold mb-1">
                {stats?.totalVideos || 0}
              </p>
              <p className="text-sm text-gray-600">Total Videos</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-start justify-between mb-2">
                <div className="p-2 bg-green-50 rounded-lg">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold mb-1">
                {formatViews(stats?.totalLikes || 0)}
              </p>
              <p className="text-sm text-gray-600">Total Likes</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Latest Videos</h2>
                  <Link
                    href="/studio"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View All
                  </Link>
                </div>
              </div>

              {recentVideos.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-gray-400"
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
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No videos yet</h3>
                  <p className="text-gray-600 mb-4">
                    Upload your first video to start growing your channel
                  </p>
                  <Link
                    href="/upload"
                    className="inline-block px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                  >
                    Upload Video
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {recentVideos.map((video) => (
                    <div
                      key={video._id}
                      className="p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex gap-4">
                        <Link
                          href={`/watch/${video._id}`}
                          className="flex-shrink-0"
                        >
                          <div className="relative w-40 h-24 bg-gray-200 rounded-lg overflow-hidden">
                            {video.thumbnail ? (
                              <Image
                                src={video.thumbnail}
                                alt={video.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <svg
                                  className="w-8 h-8 text-gray-400"
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
                                </svg>
                              </div>
                            )}
                          </div>
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link href={`/watch/${video._id}`}>
                            <h3 className="font-semibold mb-1 line-clamp-2 hover:text-blue-600">
                              {video.title}
                            </h3>
                          </Link>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                              {formatViews(video.views || 0)}
                            </span>
                            <span className="flex items-center gap-1">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                                />
                              </svg>
                              {formatViews(video.likesCount || 0)}
                            </span>
                            <span>{formatTimeAgo(video.createdAt)}</span>
                          </div>
                          <div className="mt-2">
                            {video.isPublished ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Published
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                Draft
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold mb-4">Channel Info</h2>
                <div className="flex items-center gap-3 mb-4">
                  <Image
                    src={user.avatar || "/default-avatar.png"}
                    alt={user.fullname}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{user.fullname}</p>
                    <p className="text-sm text-gray-600">@{user.username}</p>
                  </div>
                </div>
                <Link
                  href={`/channel/${user.username}`}
                  className="block w-full text-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
                >
                  View Channel
                </Link>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <Link
                    href="/upload"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Upload Video</p>
                      <p className="text-xs text-gray-600">
                        Share your content
                      </p>
                    </div>
                  </Link>

                  <Link
                    href="/studio"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <svg
                        className="w-5 h-5 text-purple-600"
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
                    </div>
                    <div>
                      <p className="font-medium">Manage Videos</p>
                      <p className="text-xs text-gray-600">Edit your content</p>
                    </div>
                  </Link>

                  <Link
                    href="/playlists"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="p-2 bg-green-50 rounded-lg">
                      <svg
                        className="w-5 h-5 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Playlists</p>
                      <p className="text-xs text-gray-600">Organize content</p>
                    </div>
                  </Link>

                  <Link
                    href="/settings"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="p-2 bg-gray-50 rounded-lg">
                      <svg
                        className="w-5 h-5 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Settings</p>
                      <p className="text-xs text-gray-600">Channel settings</p>
                    </div>
                  </Link>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg shadow-sm border border-blue-100 p-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white rounded-lg">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Grow Your Channel</h3>
                    <p className="text-sm text-gray-700">
                      Upload consistently, engage with your audience, and
                      optimize your video titles and descriptions for better
                      reach.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </YouTubeLayout>
  );
}

export default function DashboardPage() {
  return <DashboardContent />;
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  getVideoById,
  toggleVideoLike,
  toggleSubscription,
  getVideoComments,
  addComment,
} from "@/lib/api/youtube";
import { formatViews, formatTimeAgo } from "@/lib/utils";

export default function WatchPage() {
  const params = useParams();
  const videoId = params.videoId;

  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [commentPage, setCommentPage] = useState(1);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const loadVideo = useCallback(async () => {
    try {
      const response = await getVideoById(videoId);
      setVideo(response.data);
      setIsLiked(response.data.isLiked || false);
      setLoading(false);
    } catch (error) {
      console.error("Error loading video:", error);
      setLoading(false);
    }
  }, [videoId]);

  const loadComments = useCallback(
    async (page = 1) => {
      try {
        const response = await getVideoComments(videoId, { page, limit: 20 });
        if (page === 1) {
          setComments(response.data.comments);
        } else {
          setComments([...comments, ...response.data.comments]);
        }
        setHasMoreComments(response.data.page < response.data.totalPages);
        setCommentPage(page);
      } catch (error) {
        console.error("Error loading comments:", error);
      }
    },
    [videoId, comments]
  );

  useEffect(() => {
    if (videoId) {
      loadVideo();
      loadComments();
    }
  }, [videoId, loadVideo, loadComments]);

  const handleLike = async () => {
    try {
      const response = await toggleVideoLike(videoId);
      setIsLiked(response.data.isLiked);
      // Refresh video to get updated likes count
      loadVideo();
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleSubscribe = async () => {
    if (!video?.owner?._id) return;
    try {
      const response = await toggleSubscription(video.owner._id);
      setIsSubscribed(response.data.isSubscribed);
      // Refresh video to get updated subscriber count
      loadVideo();
    } catch (error) {
      console.error("Error toggling subscription:", error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await addComment(videoId, newComment);
      setNewComment("");
      loadComments(1); // Reload comments
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Video not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Video Player */}
          <div className="bg-black aspect-video rounded-lg mb-4">
            <video
              src={video.videoFile}
              controls
              className="w-full h-full rounded-lg"
              poster={video.thumbnail}
            />
          </div>

          {/* Video Info */}
          <div className="mb-4">
            <h1 className="text-2xl font-bold mb-2">{video.title}</h1>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <span className="text-gray-600">
                  {formatViews(video.views)} views
                </span>
                <span className="text-gray-600">
                  {formatTimeAgo(video.createdAt)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Like Button */}
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                    isLiked
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  <span>{isLiked ? "👍" : "👍🏻"}</span>
                  <span>{video.likesCount || 0}</span>
                </button>
              </div>
            </div>

            {/* Channel Info */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Image
                  src={video.owner?.avatar || "/default-avatar.png"}
                  alt={video.owner?.fullname}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="font-semibold">{video.owner?.fullname}</h3>
                  <p className="text-sm text-gray-600">
                    @{video.owner?.username}
                  </p>
                </div>
              </div>

              <button
                onClick={handleSubscribe}
                className={`px-6 py-2 rounded-full font-semibold ${
                  isSubscribed
                    ? "bg-gray-200 hover:bg-gray-300"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
              >
                {isSubscribed ? "Subscribed" : "Subscribe"}
              </button>
            </div>

            {/* Description */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="whitespace-pre-wrap">{video.description}</p>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">
              {comments.length} Comments
            </h2>

            {/* Add Comment */}
            <form onSubmit={handleAddComment} className="mb-6">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Comment
                </button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment._id} className="flex gap-3">
                  <Image
                    src={comment.owner?.avatar || "/default-avatar.png"}
                    alt={comment.owner?.fullname}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">
                        {comment.owner?.fullname}
                      </span>
                      <span className="text-sm text-gray-600">
                        {formatTimeAgo(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-800">{comment.content}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <button className="text-sm text-gray-600 hover:text-blue-600">
                        👍 {comment.likesCount || 0}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Comments */}
            {hasMoreComments && (
              <button
                onClick={() => loadComments(commentPage + 1)}
                className="w-full mt-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                Load More Comments
              </button>
            )}
          </div>
        </div>

        {/* Sidebar - Recommended Videos */}
        <div className="lg:col-span-1">
          <h3 className="font-semibold mb-4">Recommended</h3>
          {/* TODO: Add recommended videos */}
          <div className="text-gray-500 text-sm">
            Recommended videos will appear here
          </div>
        </div>
      </div>
    </div>
  );
}

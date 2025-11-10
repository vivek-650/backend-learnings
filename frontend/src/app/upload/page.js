"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import YouTubeLayout from "@/components/layout/YouTubeLayout";
import { useAuth } from "@/context/AuthContext";
import { uploadVideo } from "@/lib/api/youtube";
import {
  isValidVideoFile,
  isValidImageFile,
  formatFileSize,
} from "@/lib/utils";

export default function UploadPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");

  // Form data
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    isPublished: true,
  });

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = isValidVideoFile(file);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setVideoFile(file);
    setError("");
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = isValidImageFile(file);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setThumbnailFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setThumbnailPreview(reader.result);
    reader.readAsDataURL(file);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!videoFile) {
      setError("Please select a video file");
      return;
    }

    if (!thumbnailFile) {
      setError("Please select a thumbnail");
      return;
    }

    if (!formData.title.trim()) {
      setError("Please enter a title");
      return;
    }

    try {
      setUploading(true);
      setError("");
      setUploadProgress(0);

      const uploadData = new FormData();
      uploadData.append("videoFile", videoFile);
      uploadData.append("thumbnail", thumbnailFile);
      uploadData.append("title", formData.title);
      uploadData.append("description", formData.description);
      uploadData.append("isPublished", formData.isPublished);

      // Simulate progress (in real app, you'd track actual upload progress)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      const result = await uploadVideo(uploadData);

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Redirect to the uploaded video or channel
      setTimeout(() => {
        router.push(`/channel/${user.username}`);
      }, 1000);
    } catch (err) {
      setError(err.message || "Failed to upload video");
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  if (!user) {
    return (
      <YouTubeLayout>
        <div className="max-w-4xl mx-auto px-6 py-12 text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            Sign in to upload videos
          </h2>
          <p className="text-gray-500 mb-6">
            You need to be signed in to upload content
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
      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-8">Upload Video</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-lg">
            {error}
          </div>
        )}

        {uploading && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-800">
                Uploading...
              </span>
              <span className="text-sm font-medium text-blue-800">
                {uploadProgress}%
              </span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Video File */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Video File *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                disabled={uploading}
                className="hidden"
                id="video-upload"
              />
              <label htmlFor="video-upload" className="cursor-pointer">
                {videoFile ? (
                  <div>
                    <svg
                      className="w-12 h-12 mx-auto text-blue-600 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <p className="text-sm font-medium">{videoFile.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(videoFile.size)}
                    </p>
                  </div>
                ) : (
                  <div>
                    <svg
                      className="w-12 h-12 mx-auto text-gray-400 mb-2"
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
                    <p className="text-sm font-medium mb-1">
                      Click to select video
                    </p>
                    <p className="text-xs text-gray-500">
                      MP4, WebM, or AVI (Max 500MB)
                    </p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Thumbnail */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Thumbnail *
            </label>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  disabled={uploading}
                  className="hidden"
                  id="thumbnail-upload"
                />
                <label
                  htmlFor="thumbnail-upload"
                  className="block w-40 h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 overflow-hidden"
                >
                  {thumbnailPreview ? (
                    <Image
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      width={160}
                      height={96}
                      className="w-full h-full object-cover"
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
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                </label>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">
                  Upload a custom thumbnail for your video
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  JPG or PNG (Max 5MB)
                </p>
              </div>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              disabled={uploading}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add a title that describes your video"
              maxLength={100}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.title.length}/100
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              disabled={uploading}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tell viewers about your video"
              rows={5}
              maxLength={5000}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.description.length}/5000
            </p>
          </div>

          {/* Visibility */}
          <div>
            <label className="block text-sm font-medium mb-2">Visibility</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={formData.isPublished}
                  onChange={() =>
                    setFormData({ ...formData, isPublished: true })
                  }
                  disabled={uploading}
                  className="mr-2"
                />
                <span className="text-sm">Public</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={!formData.isPublished}
                  onChange={() =>
                    setFormData({ ...formData, isPublished: false })
                  }
                  disabled={uploading}
                  className="mr-2"
                />
                <span className="text-sm">Unlisted</span>
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={uploading || !videoFile || !thumbnailFile}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? "Uploading..." : "Upload Video"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              disabled={uploading}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </YouTubeLayout>
  );
}

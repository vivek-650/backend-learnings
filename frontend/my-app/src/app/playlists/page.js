"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  getUserPlaylists,
  createPlaylist,
  deletePlaylist,
} from "@/lib/api/youtube";

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [newPlaylistDescription, setNewPlaylistDescription] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user._id) {
      setUserId(user._id);
      loadPlaylists(user._id);
    }
  }, []);

  const loadPlaylists = async (userId) => {
    try {
      setLoading(true);
      const response = await getUserPlaylists(userId);
      setPlaylists(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error loading playlists:", error);
      setLoading(false);
    }
  };

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;

    try {
      await createPlaylist(newPlaylistName, newPlaylistDescription);
      setNewPlaylistName("");
      setNewPlaylistDescription("");
      setShowCreateModal(false);
      if (userId) loadPlaylists(userId);
    } catch (error) {
      console.error("Error creating playlist:", error);
    }
  };

  const handleDeletePlaylist = async (playlistId) => {
    if (!confirm("Are you sure you want to delete this playlist?")) return;

    try {
      await deletePlaylist(playlistId);
      if (userId) loadPlaylists(userId);
    } catch (error) {
      console.error("Error deleting playlist:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading playlists...</div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Your Playlists</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Create Playlist
        </button>
      </div>

      {playlists.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">
            You haven&apos;t created any playlists yet
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Your First Playlist
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {playlists.map((playlist) => (
            <div
              key={playlist._id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <Link href={`/playlist/${playlist._id}`}>
                <div className="relative aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                  {playlist.firstVideoThumbnail ? (
                    <Image
                      src={playlist.firstVideoThumbnail}
                      alt={playlist.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-gray-400 text-4xl">📝</span>
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white px-2 py-1 rounded text-sm">
                    {playlist.videoCount} videos
                  </div>
                </div>
              </Link>
              <div className="p-4">
                <Link href={`/playlist/${playlist._id}`}>
                  <h3 className="font-semibold mb-1 hover:text-blue-600">
                    {playlist.name}
                  </h3>
                </Link>
                {playlist.description && (
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {playlist.description}
                  </p>
                )}
                <button
                  onClick={() => handleDeletePlaylist(playlist._id)}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Playlist Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">Create Playlist</h2>
            <form onSubmit={handleCreatePlaylist}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Playlist name"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={newPlaylistDescription}
                  onChange={(e) => setNewPlaylistDescription(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Playlist description"
                  rows="3"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

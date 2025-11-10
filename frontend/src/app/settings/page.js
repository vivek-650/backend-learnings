"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import YouTubeLayout from "@/components/layout/YouTubeLayout";
import { useAuth } from "@/context/AuthContext";
import {
  updateUserProfile,
  changePassword,
  updateAvatar,
  updateCoverImage,
} from "@/lib/api/youtube";
import {
  getInitials,
  getAvatarColor,
  isValidImageFile,
  formatFileSize,
} from "@/lib/utils";

export default function SettingsPage() {
  const router = useRouter();
  const { user, checkAuth } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Profile form
  const [profileData, setProfileData] = useState({
    fullname: "",
    email: "",
    username: "",
  });

  // Password form
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Image uploads
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  useEffect(() => {
    if (user) {
      setProfileData({
        fullname: user.fullname || "",
        email: user.email || "",
        username: user.username || "",
      });
    }
  }, [user]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateUserProfile(profileData);
      await checkAuth();
      showMessage("success", "Profile updated successfully!");
    } catch (err) {
      showMessage("error", err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showMessage("error", "New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showMessage("error", "Password must be at least 6 characters");
      return;
    }

    try {
      setSaving(true);
      await changePassword({
        oldPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      showMessage("success", "Password changed successfully!");
    } catch (err) {
      showMessage("error", err.message || "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = isValidImageFile(file);
    if (!validation.valid) {
      showMessage("error", validation.error);
      return;
    }

    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = isValidImageFile(file);
    if (!validation.valid) {
      showMessage("error", validation.error);
      return;
    }

    setCoverFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setCoverPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;

    try {
      setSaving(true);
      const formData = new FormData();
      formData.append("avatar", avatarFile);
      await updateAvatar(formData);
      await checkAuth();
      setAvatarFile(null);
      setAvatarPreview(null);
      showMessage("success", "Avatar updated successfully!");
    } catch (err) {
      showMessage("error", err.message || "Failed to update avatar");
    } finally {
      setSaving(false);
    }
  };

  const handleCoverUpload = async () => {
    if (!coverFile) return;

    try {
      setSaving(true);
      const formData = new FormData();
      formData.append("coverImage", coverFile);
      await updateCoverImage(formData);
      await checkAuth();
      setCoverFile(null);
      setCoverPreview(null);
      showMessage("success", "Cover image updated successfully!");
    } catch (err) {
      showMessage("error", err.message || "Failed to update cover image");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <YouTubeLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">Please log in to access settings</p>
        </div>
      </YouTubeLayout>
    );
  }

  return (
    <YouTubeLayout>
      <div className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        {/* Message */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-6 border-b mb-8">
          {["Profile", "Password", "Images"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`pb-3 border-b-2 transition-colors ${
                activeTab === tab.toLowerCase()
                  ? "border-blue-600 text-blue-600 font-semibold"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <form onSubmit={handleProfileUpdate} className="max-w-2xl space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={profileData.fullname}
                onChange={(e) =>
                  setProfileData({ ...profileData, fullname: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <input
                type="text"
                value={profileData.username}
                onChange={(e) =>
                  setProfileData({ ...profileData, username: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) =>
                  setProfileData({ ...profileData, email: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        )}

        {/* Password Tab */}
        {activeTab === "password" && (
          <form onSubmit={handlePasswordChange} className="max-w-2xl space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                New Password
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Changing..." : "Change Password"}
            </button>
          </form>
        )}

        {/* Images Tab */}
        {activeTab === "images" && (
          <div className="max-w-2xl space-y-8">
            {/* Avatar */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Profile Picture</h3>
              <div className="flex items-center gap-6">
                <div className="relative">
                  {avatarPreview ? (
                    <Image
                      src={avatarPreview}
                      alt="Avatar preview"
                      width={128}
                      height={128}
                      className="w-32 h-32 rounded-full object-cover"
                    />
                  ) : user.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={user.fullname}
                      width={128}
                      height={128}
                      className="w-32 h-32 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-32 h-32 rounded-full flex items-center justify-center text-white text-3xl font-bold"
                      style={{ backgroundColor: getAvatarColor(user.username) }}
                    >
                      {getInitials(user.fullname)}
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="mb-2"
                  />
                  {avatarFile && (
                    <button
                      onClick={handleAvatarUpload}
                      disabled={saving}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {saving ? "Uploading..." : "Upload Avatar"}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Cover Image */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Cover Image</h3>
              <div className="space-y-4">
                <div className="relative h-48 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg overflow-hidden">
                  {coverPreview ? (
                    <Image
                      src={coverPreview}
                      alt="Cover preview"
                      fill
                      className="object-cover"
                    />
                  ) : user.coverImage ? (
                    <Image
                      src={user.coverImage}
                      alt="Cover"
                      fill
                      className="object-cover"
                    />
                  ) : null}
                </div>

                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverChange}
                    className="mb-2"
                  />
                  {coverFile && (
                    <button
                      onClick={handleCoverUpload}
                      disabled={saving}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {saving ? "Uploading..." : "Upload Cover"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </YouTubeLayout>
  );
}

import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Get total subscribers
  const totalSubscribers = await Subscription.countDocuments({
    channel: userId,
  });

  // Get total videos and total views
  const videoStats = await Video.aggregate([
    {
      $match: {
        uploadedBy: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $group: {
        _id: null,
        totalVideos: { $sum: 1 },
        totalViews: { $sum: "$views" },
      },
    },
  ]);

  // Get total likes on all videos
  const videos = await Video.find({ uploadedBy: userId }).select("_id");
  const videoIds = videos.map((video) => video._id);

  const totalLikes = await Like.countDocuments({
    video: { $in: videoIds },
  });

  const stats = {
    totalSubscribers,
    totalVideos: videoStats[0]?.totalVideos || 0,
    totalViews: videoStats[0]?.totalViews || 0,
    totalLikes,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, stats, "Channel stats fetched successfully"));
});

const getChannelVideos = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const videos = await Video.aggregate([
    {
      $match: {
        uploadedBy: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "likes",
      },
    },
    {
      $addFields: {
        likesCount: {
          $size: "$likes",
        },
      },
    },
    {
      $project: {
        likes: 0,
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Channel videos fetched successfully"));
});

export { getChannelStats, getChannelVideos };

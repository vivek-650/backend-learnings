import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  // Check if user is trying to subscribe to themselves
  if (channelId === req.user._id.toString()) {
    throw new ApiError(400, "You cannot subscribe to your own channel");
  }

  // Check if subscription already exists
  const existingSubscription = await Subscription.findOne({
    subscriber: req.user._id,
    channel: channelId,
  });

  if (existingSubscription) {
    // Unsubscribe
    await Subscription.findByIdAndDelete(existingSubscription._id);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { isSubscribed: false },
          "Unsubscribed successfully"
        )
      );
  } else {
    // Subscribe
    const subscription = await Subscription.create({
      subscriber: req.user._id,
      channel: channelId,
    });

    return res
      .status(201)
      .json(
        new ApiResponse(201, { isSubscribed: true }, "Subscribed successfully")
      );
  }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  const subscribers = await Subscription.aggregate([
    {
      $match: {
        channel: new mongoose.Types.ObjectId(channelId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "subscriber",
        foreignField: "_id",
        as: "subscriber",
        pipeline: [
          {
            $project: {
              fullname: 1,
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        subscriber: {
          $first: "$subscriber",
        },
      },
    },
    {
      $project: {
        subscriber: 1,
        createdAt: 1,
      },
    },
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        subscribers,
        subscriberCount: subscribers.length,
      },
      "Subscribers fetched successfully"
    )
  );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  if (!isValidObjectId(subscriberId)) {
    throw new ApiError(400, "Invalid subscriber ID");
  }

  const channels = await Subscription.aggregate([
    {
      $match: {
        subscriber: new mongoose.Types.ObjectId(subscriberId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "channel",
        foreignField: "_id",
        as: "channel",
        pipeline: [
          {
            $project: {
              fullname: 1,
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        channel: {
          $first: "$channel",
        },
      },
    },
    {
      $project: {
        channel: 1,
        createdAt: 1,
      },
    },
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        channels,
        channelCount: channels.length,
      },
      "Subscribed channels fetched successfully"
    )
  );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };

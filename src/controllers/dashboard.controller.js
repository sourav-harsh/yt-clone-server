import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
  const channelStats = await Video.aggregate([
    {
      $match: {
        owner: req.user?._id,
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "owner",
        foreignField: "channel",
        as: "subscriber",
      },
    },
    {
      $group: {
        _id: req.user?._id,
        totalVideos: { $sum: 1 },
        totalViews: { $sum: "$views" },
        totalLikes: { $sum: "$likes" },
        totalDislikes: { $sum: "$dislikes" },
        subscriberList: { $first: "$subscriber" },
      },
    },
    {
      $project: {
        _id: 1,
        totalVideos: 1,
        totalViews: 1,
        totalLikes: 1,
        totalDislikes: 1,
        totalSubscribers: { $size: "$subscriberList" },
      },
    },
  ]);
  if (!channelStats) {
    throw new ApiError(404, "Channel stats not found");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, channelStats, "Channel stats fetched successfully")
    );
});

const getChannelVideos = asyncHandler(async (req, res) => {
  const videos = await Video.aggregate([
    {
      $match: {
        owner: req.user?._id,
      },
    },
  ]);
  if (!videos) {
    throw new ApiError(404, "Videos not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

export { getChannelStats, getChannelVideos };

import { Subscription } from "../models/subscription.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const subscription = await Subscription.findOne({
    subscriber: req.user._id,
    channel: channelId,
  });

  if (subscription) {
    await subscription.deleteOne();
    return res
      .status(200)
      .json(
        new ApiResponse(200, subscription, "Subscription toggled successfully")
      );
  }

  const newSubscription = await Subscription.create({
    subscriber: req.user._id,
    channel: channelId,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, newSubscription, "Subscription toggled successfully")
    );
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const subscriber = await Subscription.aggregate([
    {
      $match: {
        channel: new mongoose.Types.ObjectId(channelId)
      }
    }
  ])

  return res
    .status(200)
    .json(new ApiResponse(
      200,
      subscriber,
      "User channels subscribers fetched successfully"
    ))
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
  const channel = await Subscription.aggregate([
    {
      $match: {
        subscriber: new mongoose.Types.ObjectId(subscriberId)
      }
    }
  ])

  return res
    .status(200)
    .json(new ApiResponse(
      200,
      channel,
      "Subscribed channels fetched successfully"
    ))
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };

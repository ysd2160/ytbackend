import mongoose from "mongoose";
import { Tweet } from "../Models/tweetModel.js";

export const createtweet = async (req, res) => {
    try {
        const { content } = req.body;
        if (!content) {
            return res.status(400).json({
                message: "content required",
                success: false
            })
        }
        const newtweet = await Tweet.create({
            content,
            owner: req.user._id
        })
        return res.status(200).json({
            message: "tweet created successfully",
            data: newtweet,
            success: true
        })
    } catch (error) {
        console.log(error);

    }
}
export const getUserTweet = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log(userId);

        if (!userId) {
            return res.status(400).json({
                message: "userId not found",
                success: false
            })
        }
        const tweets = await Tweet.find({ owner: userId }).populate("owner", "username avatar")
        console.log(tweets);

        if (!tweets) {
            return res.status(400).json({
                message: "tweet not find",
                success: false
            })
        }
        return res.status(200).json({
            message: "tweet find sucessfully",
            tweets,
            success: true
        })
    } catch (error) {
        console.log(error);

    }
}
export const getTweet = async (req, res) => {
  try {
    const { tweetId } = req.params;
    const tweet = await Tweet.findById(tweetId).populate("owner", "fullName username avatar");
    if (!tweet) return res.status(404).json({ message: "Tweet not found", success: false });

    res.status(200).json({ data: tweet, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const updateTweet = async (req, res) => {
    try {
        const { tweetId } = req.params;
        const { Content } = req.body;
        console.log(req.body);

        if (!tweetId) {
            return res.status(400).json({
                message: "tweetId not found",
                success: false
            })
        }
        if (!Content) {
            return res.status(400).json({
                message: "content required",
                success: false
            })
        }
        const newTweet = await Tweet.findByIdAndUpdate(
            tweetId,
            {
                content: Content,
            },
            {
                new: true,
            }
        )


        return res.status(200).json({
            message: "tweet update sucessfully",
            data: newTweet,
            success: true
        })
    } catch (error) {
        console.log(error);

    }
}
export const deleteTweet = async (req, res) => {
  try {
    const { tweetId } = req.params;

    if (!tweetId || !mongoose.Types.ObjectId.isValid(tweetId)) {
      return res.status(400).json({
        message: "Invalid tweet ID",
        success: false,
      });
    }

    const tweet = await Tweet.findByIdAndDelete(tweetId);

    if (!tweet) {
      return res.status(404).json({
        message: "Tweet not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Tweet deleted successfully",
      data: tweet,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
      error: error.message,
    });
  }
};
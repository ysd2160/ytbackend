import mongoose from "mongoose"
import { Subscription } from "../Models/subscriptionModel.js"
import { Video } from "../Models/videoModel.js"
import { Like } from "../Models/likeModel.js"

export const getChannelVideos = async (req, res) => {
    try {
        const { channelId } = req.params
        const videos = await Video.find({ owner: channelId })
            .populate("owner", "username avatar")
            .sort({ createdAt: -1 })
        if (!videos) {
            return res.status(400).json({
                message: "video not found ",
                success: false,
            })
        }
        return res.status(200).json({
            message: "video found ",
            data: videos,
            totalLike: videos.length,
            success: true,
        })
    } catch (error) {
        console.log(error);

    }
}
export const getChannelstats = async (req, res) => {
    try {
        const { channelId } = req.params;
        const totalVideos = await Video.find({ owner: channelId })
        if (!totalVideos) {
            return res.status(400).json({
                message: "video not  found ",
                success: false,
            })
        }
        const totalSubscribers = await Subscription.countDocuments({ channel: channelId })
        if (!totalSubscribers) {
            return res.status(400).json({
                message: "subscribers not  found ",
                success: false,
            })
        }
        const viewsAggregation = await Video.aggregate([
            {
                $match: {
                    owner: new mongoose.Types.ObjectId(channelId)
                }
            }, {
                $group: {
                    _id: null,
                    totalViews: { $sum: "$views" }
                }
            }
        ])

        const totalviews = await viewsAggregation[0]?.totalViews || 0;
        console.log(totalviews);
        
        if (viewsAggregation.length===0) {
            return res.status(400).json({
                message: "views not  found ",
                success: false,
            })
        }
        const channelVideos = await Video.find({ owner: channelId }, "_id")
        const videoIds = channelVideos.map(item => item._id)
        const totalLikes = await Like.countDocuments({ video: { $in: videoIds } })
        if (!totalLikes) {
            return res.status(400).json({
                message: "likes not  found ",
                success: false,
            })
        }
        return res.status(200).json({
            message: "channel stats fetched successfully",
            totalVideos,
            totalSubscribers,
            totalviews,
            totalLikes,
            success: true,
        })
    } catch (error) {
        console.log(error);

    }
}
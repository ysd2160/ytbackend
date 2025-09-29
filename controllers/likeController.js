import { Comment } from "../Models/commentModel.js";
import { Like } from "../Models/likeModel.js";
import { Tweet } from "../Models/tweetModel.js";
import { Video } from "../Models/videoModel.js";

export const toggleLikeVideo = async (req, res) => {
    try {
        const { videoId } = req.params;
        const video = await Video.findById(videoId)
        if (!video) {
            return res.status(400).json({
                message: "video not found",
                success: false
            })
        }
        const isLike = await Like.findOne({
            likedBy: req.user._id,
            video: video._id
        })
        if (isLike) {
            const unlike = await Like.findByIdAndDelete(isLike._id)
            return res.status(200).json({
                message: "unlike video",
                data: unlike,
                success: true,
            })
        } else {
            const like = await Like.create({
                video: videoId,
                likedBy: req.user._id
            })
            return res.status(200).json({
                message: "like successfully",
                data: like,
                success: true
            })
        }
    } catch (error) {
        console.log(error);

    }
}
export const toggletweetLike = async (req, res) => {
    try {
        const { tweetId } = req.params;
        const tweet = await Tweet.findById(tweetId)
        if (!tweet) {
            return res.status(400).json({
                message: "tweet not found",
                success: false
            })
        }
        const isLike = await Like.findOne({
            likedBy: req.user._id,
            tweet: tweet._id
        })
        if (isLike) {
            const unlike = await Like.findByIdAndDelete(isLike._id)
            return res.status(200).json({
                message: "unlike tweet",
                data: unlike,
                success: true,
            })
        } else {
            const like = await Like.create({
                tweet: tweetId,
                likedBy: req.user._id
            })
            return res.status(200).json({
                message: "like successfully",
                data: like,
                success: true
            })
        }
    } catch (error) {
        console.log(error);

    }
}
export const toggleCommentLike = async (req, res) => {
    try {
        const { commentId } = req.params;
        const comment = await Comment.findById(commentId)
        if (!comment) {
            return res.status(400).json({
                message: "comment not found",
                success: false
            })
        }
        const isLike = await Like.findOne({
            likedBy: req.user._id,
            comment: comment._id
        })
        if (isLike) {
            const unlike = await Like.findByIdAndDelete(isLike._id)
            return res.status(200).json({
                message: "unlike comment",
                data: unlike,
                success: true,
            })
        } else {
            const like = await Like.create({
                comment: commentId,
                likedBy: req.user._id
            })
            return res.status(200).json({
                message: "like successfully",
                data: like,
                success: true
            })
        }
    } catch (error) {
        console.log(error);

    }
}
export const getLikedVideos = async (req, res) => {
    try {
        const { videoId } = req.params;
        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(400).json({
                message: "video not found",
                success: false
            })
        }
        const likedVideos = await Like.find({ video: videoId }).populate("likedBy", "username avatar")
        if (!likedVideos) {
            return res.status(400).json({
                message: " liked video not found",
                success: false
            })
        }
        return res.status(200).json({
       message:"liked video found ",
       data:likedVideos,
       totalLike:likedVideos.length,
       success:true,
   })
    } catch (error) {
console.log(error);

    }
}
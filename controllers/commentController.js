import { Comment } from "../Models/commentModel.js";
import { Video } from "../Models/videoModel.js";

export const addComment = async (req, res) => {
    try {
        const { videoId } = req.params;
        const { content } = req.body;
        if (!content) {
            return res.status(400).json({
                message: "content required",
                success: false,
            })
        }
        const video = await Video.findById(videoId)
        if (!video) {
            return res.status(400).json({
                message: "video not found",
                success: false,
            })
        }
        const newComment = await Comment.create({
            content,
            video: video._id,
            owner: req.user._id
        })
        return res.status(200).json({
            message: "Comment added successfully",
            data: newComment,
            success: true,
        })
    } catch (error) {
        console.log(error);

    }
}
export const getVideoComment = async (req, res) => {
    try {
        const { videoId } = req.params;
        const video = await Video.findById(videoId)
        if (!video) {
            return res.status(400).json({
                message: "video not valid",
                success: false,
            })
        }
        const comments = await Comment.find({ video: videoId }).populate("owner", "username avatar fullname")
        if (!comments) {
            return res.status(400).json({
                message: "comments not found",
                success: false,
            })
        }
        return res.status(200).json({
            message: "comment fetched successfully",
            data: comments,
            totalComment: comments.length,
            success: true,
        })
    } catch (error) {
        console.log(error);

    }
}
export const updateComment = async (req, res) => {
    try {
        const { newContent } = req.body;
        const { commentId } = req.params;
        if (!newContent) {
            return res.status(400).json({
                message: "content required",
                success: false,
            })
        }
        const updatedComment = await Comment.findByIdAndUpdate(
            commentId,
            {
                content: newContent
            },
            {
                new: true
            }
        )
        console.log(updatedComment);
        
        if (!updateComment) {
            return res.status(400).json({
                message: "no comment found",
                success: false,
            })
        }

        return res.status(200).json({
            message: "comment updated successfully",
            data: updatedComment,
            success: true,
        })
    } catch (error) {
        console.log(error);

    }
}
export const deleteComment = async (req, res) => {
    try {

        const { commentId } = req.params;


        const deletedComment = await Comment.findByIdAndDelete(commentId)
        if (!deletedComment) {
            return res.status(400).json({
                message: "comment not found",
                success: false,
            })
        }
        return res.status(200).json({
            message: "comment deleted successfully",
            data: deletedComment,
            success: true,
        })
    } catch (error) {
        console.log(error);

    }
}
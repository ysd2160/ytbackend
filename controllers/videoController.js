import { User } from "../Models/userModel.js";
import { Video } from "../Models/videoModel.js";
import { CloudinaryImageUpload } from "../utils/Cloudinary.js";
export const getAllVideos = async (req, res) => {
    try {
        const videos = await Video.find().populate("owner", "username avatar fullName")
        if (!videos) {
            return res.status(400).json({
                message: "Videos not found",
                success: false,

            })
        }
        return res.status(200).json({
            message: "fetched videos sucessfully",
             videos,
            success: false,

        })
    } catch (error) {
        console.log(error);

    }
}
export const publishVideo = async (req, res) => {
    try {
        const { title, description } = req.body;
        if (!title || !description) {
            return res.status(400).json({
                message: "title description required",
                success: false,

            })
        }
        console.log(req.files.thumbnail[0].path);
        const thumbnailLocalPath = req.files?.thumbnail[0]?.path;
        const videoLocalPath = req.files?.videoFile[0]?.path;
        
        if (!videoLocalPath || !thumbnailLocalPath) {
            return res.status(400).json({
                message: "video and thumbnail required",
                success: false,

            })
        }
        const thumbnail = await CloudinaryImageUpload(thumbnailLocalPath)
        const videoFile = await CloudinaryImageUpload(videoLocalPath)
        if (!videoFile.url || !thumbnail.url) {
            return res.status(400).json({
                message: "cloudinary video and thumbnail not found not found",
                success: false,

            })
        }
        const video = await Video.create({
            title,
            description,
            videoFile: videoFile.url,
            thumbnail: thumbnail.url,
            duration: videoFile?.duration,
            isPublished: true,
            views: 0,
            owner: req.user._id,

        })
        return res.status(200).json({
            message: " video created successfully ",
            data: video,
            success: true
        })
    } catch (error) {
        console.log(error);

    }
}
export const getVideoById = async (req, res) => {
    try {
        const { videoId } = req.params;
        const userId = req.user._id;
        console.log(userId);
        
        if (!videoId) {
            return res.status(400).json({
                message: "video not found",
                success: false,

            })
        }
        const video = await Video.findById(videoId).populate("owner", "username fullName avatar")
          await User.findByIdAndUpdate(
     userId,
  { $addToSet: { watchHistory:videoId  } }, // watchedAt auto-added
  { new: true }
    );
        return res.status(200).json({
             video,
            message: "video found",
            success: true,

        })
    } catch (error) {
        console.log(error);

    }
}
// controllers/videoController.js
export const incrementViews = async (req, res) => {
  try {
    const { id } = req.params;

    // Increment views by 1
    const video = await Video.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } }, // $inc adds 1 to the current views
      { new: true } // returns the updated document
    );

    if (!video) {
      return res.status(404).json({ message: "Video not found", success: false });
    }

    return res.status(200).json({ message: "View added", data: video.views, success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const updateVideo = async (req, res) => {
    try {

        const { title, description } = req.body;
        const { videoId } = req.params;

        if (!title || !description) {
            return res.status(400).json({
                message: "fields are required",
                success: false,

            })
        }
        const thumbnailLocalPath = req.file?.path
        if (!thumbnailLocalPath) {
            return res.status(400).json({
                message: " thumbnailpath not found",
                success: false,
            })
        }
        const thumbnail = await CloudinaryImageUpload(thumbnailLocalPath)
        if (!thumbnail?.url) {
            return res.status(400).json({
                message: "cloudinary thumbnail not found",
                success: false,

            })
        }
        const updateVideo = await Video.findByIdAndUpdate(
            videoId,
            { title, description, thumbnail: thumbnail.url },
            { new: true }
        )
        if (!updateVideo) {
            return res.status(400).json({
                message: "viideo not updated",
                success: false,

            })

        }
        return res.status(200).json({
            data: updateVideo,
            message: "video updated successfully",
            success: true,

        })
    }
    catch (error) {
        console.log(error);

    }
}
export const deleteVideo = async(req,res)=>{
    try {
        const {videoId}=req.params
        if(!videoId){
            return res.status(400).json({
                message: "video not found",
                success: false,
            })
        }
        const deleteVideo = await Video.findByIdAndDelete(
            videoId,
        )
        if(!deleteVideo){
            return res.status(400).json({
                message: "video not delete",
                success: false,

            })
        }
        return res.status(200).json({
            data:deleteVideo,
                message: "photo delete successfully",
                success: false,

            })
    } catch (error) {
        console.log(error);
        
    }
}
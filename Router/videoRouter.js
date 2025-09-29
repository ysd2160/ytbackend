import { Router } from "express";
import { authuser } from "../middlewares/authentication.js";
import { deleteVideo, getAllVideos, getVideoById, incrementViews, publishVideo, updateVideo } from "../controllers/videoController.js";
import { upload } from "../middlewares/Multer.js";
import { Video } from "../Models/videoModel.js";

const router = Router()
router.use(authuser)
router.get("/search", authuser, async (req, res) => {
  try {
    const query = req.query.q; // ?q=searchText
    if (!query) {
      return res.status(400).json({ message: "Query missing", success: false });
    }

    const videos = await Video.find({
      title: { $regex: query, $options: "i" }, // case-insensitive search
    })
      .populate("owner", "username avatar") // ✅ populate owner with username & avatar
      .sort({ createdAt: -1 }); // optional: newest first

    return res.status(200).json({
      success: true,
      data: videos,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router
    .route("/")
    .get(getAllVideos)
    .post(upload.fields([
        {
            name: 'videoFile',
            maxCount: 1,
        },
        {
            name: 'thumbnail',
            maxCount: 1,
        }
    ]),publishVideo)
    
router.post("/:id/views", incrementViews);
router
.route("/:videoId")
.get(getVideoById)
.delete(deleteVideo)

.patch(upload.single('thumbnail'),updateVideo)





export default router
import { Router } from "express";
import { authuser } from "../middlewares/authentication.js";
import { getLikedVideos, toggleCommentLike, toggleLikeVideo, toggletweetLike } from "../controllers/likeController.js";
const router = Router()
router.use(authuser)
router.route("/v/:videoId").post(toggleLikeVideo).get(getLikedVideos)
router.route("/t/:tweetId").post(toggletweetLike)
router.route("/c/:commentId").post(toggleCommentLike)

export default router
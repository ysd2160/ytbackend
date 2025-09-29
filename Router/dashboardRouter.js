import { Router } from "express";
import { authuser } from "../middlewares/authentication.js";
import { getChannelstats, getChannelVideos } from "../controllers/dashBoardcontroller.js";
const router = Router()
router.use(authuser)
router.route("/:channelId/stats").get(getChannelstats)
router.route("/:channelId/videos").get(getChannelVideos)
export default router
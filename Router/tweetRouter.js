import { Router } from "express";
import { authuser } from "../middlewares/authentication.js";
import { createtweet, deleteTweet, getTweet, getUserTweet, updateTweet } from "../controllers/tweetcontroller.js";
const router = Router()
router.use(authuser)
router.route("/").post(createtweet)
router
.route("/user/:userId")
.get(getUserTweet)
router.route("/:tweetId")
.get(getTweet)
.patch(updateTweet)
.delete(deleteTweet)

export default router
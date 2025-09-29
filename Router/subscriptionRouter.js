import { Router } from "express";
import { authuser } from "../middlewares/authentication.js";
import { subscribedToCount, subscriberCount, toggleChannelSubscription } from "../controllers/subscriptionController.js";
const router = Router()
router.use(authuser)
router
.route("/c/:channelId")
.post(toggleChannelSubscription)
.get(subscriberCount)
router.route("/u/:subscribeId").get(subscribedToCount)
export default router
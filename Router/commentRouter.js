import { Router } from "express";
import { authuser } from "../middlewares/authentication.js";
import { addComment, deleteComment, getVideoComment, updateComment } from "../controllers/commentController.js  ";
const router = Router()
router.use(authuser)
router.route("/:videoId")
.post(addComment)
.get(getVideoComment)
router.route("/c/:commentId")
.patch(updateComment)
.delete(deleteComment)
export default router
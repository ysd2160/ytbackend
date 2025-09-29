import { Router } from "express";
import { ChangePaswword, currentuser, getUserProfile, getWatchHistory, LoginUser, LogoutUser, refreshToken, Register, updateAvatar, updateCoverImage, updateUserInfo } from "../controllers/userController.js";
import { upload } from "../middlewares/Multer.js";
import { authuser } from "../middlewares/authentication.js";
const router = Router()
router.route("/register").post(upload.fields([
    {
        name:'avatar',
        maxCount:1,
    },
    {
        name:'coverImage',
        maxCount:1,
    }
]),Register)
router.route("/login").post(LoginUser)
router.route("/logout").post(authuser,LogoutUser)
router.route("/refresh-token").post(refreshToken)
router.route("/password-change").post(authuser,ChangePaswword)
router.route("/current-user").get(authuser,currentuser)
router.route("/edit-info").patch(authuser,updateUserInfo)
router.route("/edit-avatar").patch(authuser,upload.single('avatar'),updateAvatar)
router.route("/edit-coverimage").patch(authuser,upload.single('coverImage'),updateCoverImage)
router.route("/watchhistory").get(authuser,getWatchHistory)
router.route("/c/:username").get(authuser,getUserProfile)

export default router
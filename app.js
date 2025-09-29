import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"
export const app = express()

app.use(cors({
  origin: ["http://localhost:5173", "https://ytfrontend-one.vercel.app"],
  credentials: true
}));

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use(cookieParser())

//router import
import userRouter from "./Router/userRouter.js"
import videoRouter from "./Router/videoRouter.js"
import subscriptionRouter from "./Router/subscriptionRouter.js"
import tweetRouter from "./Router/tweetRouter.js"
import commentRouter from "./Router/commentRouter.js"
import likeRouter from "./Router/likeRouter.js"
import dashboardRouter from "./Router/dashboardRouter.js"

//routes
app.use("/api/v1/user", userRouter)
app.use("/api/v1/video", videoRouter)
app.use("/api/v1/subscription", subscriptionRouter)
app.use("/api/v1/tweet", tweetRouter)
app.use("/api/v1/comment", commentRouter)
app.use("/api/v1/like", likeRouter)
app.use("/api/v1/dashboard", dashboardRouter)
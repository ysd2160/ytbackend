import { upload } from "../middlewares/Multer.js";
import { User } from "../Models/userModel.js";
import { CloudinaryImageUpload } from "../utils/Cloudinary.js";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import mongoose from "mongoose";
dotenv.config()
const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        if (!user) {
            console.log('invalid user');
        }
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }
    } catch (error) {
        console.log(error);

    }

}
export const Register = async (req, res) => {

    try {
        const { username, email, password, fullName } = req.body;
        if (username === "" && email === "" && password === "" && fullName === "") {
            return res.status(400).json({
                message: 'All field Required',
                success: false
            })
        }
        const existingUser = await User.findOne({ $or: [{ username }, { email }] })
        if (existingUser) {
            return res.status(400).json({
                message: 'user Already exists',
                success: false
            })
        }

        const avatarLocalPath = req.files?.avatar[0]?.path
        const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

        if (!avatarLocalPath) {
            res.status(400).json({
                message: 'Avatar image required',
                success: false
            })
        }


        const avatar = await CloudinaryImageUpload(avatarLocalPath)
        let coverImage = null;
        if (coverImageLocalPath) {
            coverImage = await CloudinaryImageUpload(coverImageLocalPath);
        }


        if (!avatar) {
            return res.status(400).json({
                message: 'Avatar not defined',
                success: false
            })
        }
        const user = await User.create({
            username,
            email,
            password,
            fullName,
            avatar: avatar.url,
            coverImage: coverImage?.url || ""
        })

        const createdUser = await User.findById(user._id).select(
            "-password -refreshToken"
        )
        if (!createdUser) {
            return res.status(400).json({
                message: 'Something went wrong',
                success: false
            })
        }

        return res.status(200).json({
            message: "user created Sucessfully",
            success: true,
            data: createdUser,
        })
    } catch (error) {
        console.log(error);

    }
}
export const LoginUser = async (req, res) => {
    try {
        // console.log(req.body)
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(404).json({
                message: "all field required",
                success: false,
            })
        }
        const user = await User.findOne({ $or: [{ email }, { username }] })
        if (!user) {
            return res.status(404).json({
                message: "user not find",
                success: false,
            })
        }
        const isPasswordValidate = await user.isPasswordCorect(password)
        if (!isPasswordValidate) {
            return res.status(404).json({
                message: "Password Incorrect",
                success: false,
            })
        }
        const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id)
        const LoggedInUser = await User.findById(user._id).select('-password -refreshToken')
        const options = {
            httpOnly: true,
            secure: true,
        }
        return res.status(200)
            .cookie('Accesstoken', accessToken, options)
            .cookie('Refreshtoken', refreshToken, options)
            .json({
                mesage: "Login Sucessfully",
                user: LoggedInUser, token: accessToken, refreshToken,
                success: true
            })
    } catch (error) {
        console.log(error);

    }
}

export const LogoutUser = async (req, res) => {
    try {
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $unset: {
                    refreshToken: 1
                }
            },
            {
                new: true,
            }
        )
        const options = {
            httpOnly: true,
            secure: true,
        }
        return res.status(200).clearCookie('Accesstoken', options)
            .clearCookie('Refreshtoken', options).json({
                message: "Logout Successfully",
                success: true,
            })

    } catch (error) {
        console.log(error);

    }
}

export const refreshToken = async (req, res) => {
    try {
        console.log(req.body);
        
        const incomingRefreshToken = req.cookies?.Refreshtoken || req.body?.Refreshtoken
        if (!incomingRefreshToken) {
            return res.status(401).json({
                message: "invalid refresh token",
                success: false
            })
        }
        const decodeToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
        const user = await User.findById(decodeToken._id)
        if (!user) {
            return res.status(401).json({
                message: "user not find",
                success: false
            })
        }
        if (incomingRefreshToken !== user.refreshToken) {
            return res.status(401).json({
                message: "invalid refresh token",
                success: false
            })
        }
        const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id)
        const options = {
            httpOnly: true,
            secure: true,
        }
        return res.status(200)
            .cookie('Accesstoken', accessToken, options)
            .cookie('Refreshtoken', refreshToken, options)
            .json({
                mesage: "refresh token Sucessfully",
                data: user, accessToken, refreshToken,
                success: true
            })
    } catch (error) {
        console.log(error);

    }
}
export const ChangePaswword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body
        if (!oldPassword || !newPassword) {
            return res.status(401).json({
                message: "all fileds required",
                success: false
            })
        }
        const user = await User.findById(req.user?._id)
        const isPaswordCheck = user.isPasswordCorect(oldPassword)
        if (!isPaswordCheck) {
            return res.status(401).json({
                message: "invalid password",
                success: false
            })
        }
        user.password = newPassword;
        await user.save({ validateBeforeSave: false })
        return res.status(200).json({
            message: "password update Sucessfully",
            success: true
        })
    } catch (error) {
        console.log(error);

    }
}

export const currentuser = async (req, res) => {
    try {
        return res.status(200).json({
            data: req.user,
            message: "fetch sucessfully current user",
            success: true
        })
    } catch (error) {
        console.log(error);

    }
}

export const updateUserInfo = async (req, res) => {
    try {
        const { email, fullName } = req.body;
        if (!email || !fullName) {
            return res.status(401).json({
                message: "all fileds required",
                success: false
            })
        }
        const user = await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set: {
                    email,
                    fullName
                }
            },
            { new: true }
        ).select("-password")

        return res.status(200).json({
            message: "profile updated sucessfully",
            data: user,
            success: true
        })
    } catch (error) {
        console.log(error);

    }
}
export const updateAvatar = async (req, res) => {
    try {
        const avatarLocalPath = req.file?.path;
        if (!avatarLocalPath) {
            return res.status(401).json({
                message: "image not found",
                success: false
            })
        }
        const avatar = await CloudinaryImageUpload(avatarLocalPath)
        if (!avatar.url) {
            return res.status(401).json({
                message: "avatar image not found",
                success: false
            })
        }
        const user = await User.findByIdAndUpdate(
            req.user?._id,
            {
                avatar: avatar.url,
            },
            {
                new: true
            }
        ).select("-password")
        return res.status(200).json({
            message: "profile updated sucessfully",
            data: user,
            success: true
        })
    } catch (error) {
        console.log(error);

    }
}
export const updateCoverImage = async (req, res) => {
    try {
        const coverImageLocalPath = req.file?.path;
        if (!coverImageLocalPath) {
            return res.status(401).json({
                message: "image not found",
                success: false
            })
        }
        const coverImage = await CloudinaryImageUpload(coverImageLocalPath)
        if (!coverImage.url) {
            return res.status(401).json({
                message: "avatar image not found",
                success: false
            })
        }
        const user = await User.findByIdAndUpdate(
            req.user?._id,
            {
                coverImage: coverImage.url,
            },
            {
                new: true
            }
        ).select("-password")
        return res.status(200).json({
            message: "profile updated sucessfully",
            data: user,
            success: true
        })
    } catch (error) {
        console.log(error);

    }
}
export const getUserProfile = async (req, res) => {
    try {
        const { username } = req.params;
        if (!username.trim()) {
            return res.status(400).json({
                message: "username not find",
                success: false
            })
        }
        const channel = await User.aggregate([
            {
                $match: { username: username?.toLowerCase() }
            },
            {
                $lookup: {
                    from: "subscriptions",
                    localField: "_id",
                    foreignField: "channel",
                    as: "subscribers",
                }
            },
            {
                $lookup: {
                    from: "subscriptions",
                    localField: "_id",
                    foreignField: "subscribers",
                    as: "subscribedTo",
                }
            },
            {
                $lookup: {
                    from: "videos",
                    localField: "_id",
                    foreignField: "owner", // assuming `owner` field stores user._id in videos
                    as: "videos",
                },
            },
            {
                $addFields: {
                    subscriberCount: {
                        $size: "$subscribers"
                    },
                    subscribedToCount: {
                        $size: "$subscribedTo"
                    },
                    isSubscribed: {
                        $cond: {
                            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                            then: true,
                            else: false,
                        }
                    },
                },
            },
            {
                $project: {
                    fullName: 1,
                    email: 1,
                    username: 1,
                    avatar: 1,
                    coverImage: 1,
                    subscriberCount: 1,
                    subscribedToCount: 1,
                    isSubscribed: 1,
                    videos:1,

                }
            }
        ])
        console.log(channel);

        if (!channel.length) {
            return res.status(400).json({
                message: "channel not find",
                success: false
            })
        }
        return res.status(200).json({
            message: "channel fetched successfully",
            data: channel[0],
            success: true
        })
    } catch (error) {
        console.log(error);

    }
}
// export const getWatchHistory = async (req, res) => {
//     try {
//         const user = await User.aggregate([
//             {
//                 $match: {
//                     _id: new mongoose.Types.ObjectId(req.user._id),
//                 },
//             },
//             {
//                 $lookup: {
//                     from: "videos",
//                     localField: "watchHistory",
//                     foreignField: "_id",
//                     as: "watchHistory",
//                     pipeline: [
//                         {
//                             $lookup: {
//                                 from: "users",
//                                 localField: "owner",
//                                 foreignField: "_id",
//                                 as: "owner",
//                                 pipeline: [
//                                     { $project: { fullName: 1, avatar: 1, username: 1 } }
//                                 ]
//                             }
//                         },
//                         {
//                             $addFields: {
//                                 owner: { $first: "$owner" }
//                             }
//                         }
//                     ]
//                 }
//             }
//         ]);

//         if (!user || user.length === 0) {
//             return res.status(400).json({
//                 message: "user not found",
//                 success: false,
//             });
//         }

//         return res.status(200).json({
//             message: "watch history fetched successfully",
//             data: user,
//             success: true,
//         });

//     } catch (error) {
//         console.log(error);

//     }
// }

// controllers/userController.js
export const getWatchHistory = async (req, res) => {
  try {
    const userId = req.user._id; // from JWT auth middleware

    // Find user and populate video details
    const user = await User.findById(userId)
      .populate({
        path: "watchHistory",
        populate: {
          path: "owner", // also populate video owner details
          select: "username fullName avatar",
        },
      });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    return res.status(200).json({
      watchHistory: user.watchHistory,
      message: "Watch history fetched successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching watch history",
      success: false,
    });
  }
};

import jwt from 'jsonwebtoken'
import { User } from '../Models/userModel.js'

export const authuser=async(req,res,next)=>{
    try {
        const token = req.cookies?.Accesstoken || req.header("Authorization")?.replace("Bearer ", "")
        if(!token){
            return res.status(401).json({
                message:"token not find",
                success:false,
            }) 
        }
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        if(!user){
 return res.status(401).json({
                message:"user not find ",
                success:false,
            }) 
        }
        req.user = user;
        next()
    } catch (error) {
     console.log(error);
        
    }
}
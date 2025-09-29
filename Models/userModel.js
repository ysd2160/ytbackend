
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import jwt from 'jsonwebtoken'
import  dotenv  from "dotenv";
dotenv.config()
const userSchema = mongoose.Schema({
    username:{
        type:String,
        required:true,
         unique: true,
        lowercase: true,
        trim: true, 
        index: true
    },
    email:{
         type:String,
        required:true,
         unique: true,
        lowercase: true,
        trim: true, 
        index: true
    },
    password:{
         type:String,
        required:true
    },
    fullName:{
         type:String,
        required:true,
        trim: true, 
        index: true
    },
    avatar:{
        required:true,
        type:String,
    },
    coverImage:{
        type:String
    },
    watchHistory:[
        {type:mongoose.Schema.Types.ObjectId,
            ref:'Video',
        }
    ],
    refreshToken:{
        type:String
    }
},{
    timestamps:true,
})
userSchema.pre("save",async function(next){
    if(!this.isModified("password"))return next()
         this.password = await bcrypt.hash(this.password,10)
})

userSchema.methods.isPasswordCorect = async function(password){
return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = async function(){
    return jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username,
        fullName:this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
)
}
userSchema.methods.generateRefreshToken = async function(){
    return jwt.sign({
        _id:this._id,
       
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
)}
export const User = mongoose.model("User",userSchema)
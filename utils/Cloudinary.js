import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'
import dotenv from "dotenv";
dotenv.config()


cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,

})

export const CloudinaryImageUpload = async(imagepath)=>{
    try {

        if(!imagepath) {
            console.log('hello');
            
        };
        console.log(imagepath);
        
       const response =await cloudinary.uploader.upload(imagepath,{
            resource_type:'auto'
        })
        // fs.unlinkSync(imagepath)
        console.log('helo',response.url);
        fs.unlinkSync(imagepath)
        return response
    } catch (error) {
          fs.unlinkSync(imagepath)
        return null
    }
}
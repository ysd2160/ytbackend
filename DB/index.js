import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
const ConnectDb=async ()=>{
    try {
        const response = await mongoose.connect(`${process.env.MONGOURI}/${DB_NAME}`)
        console.log(response.connection.host);
        
    } catch (error) {
        console.log("mongodb error :",error);
        
    }
}
export default ConnectDb
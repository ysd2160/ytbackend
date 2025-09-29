import { app } from "./app.js";
import dotenv from "dotenv";
import ConnectDb from "./DB/index.js";
dotenv.config()

app.get("/",(req,res)=>{
    res.send('hello')
})

ConnectDb().then(()=>
app.listen(process.env.PORT,()=>{
    console.log(`app live on ${process.env.PORT}`);
    
})).catch((error)=>{
    console.log("mongodb error ↓:",error);
    
})

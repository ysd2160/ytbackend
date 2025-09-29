import { Subscription } from "../Models/subscriptionModel.js";

export const toggleChannelSubscription=async(req,res)=>{
    try {
        const {channelId} = req.params;
        if(!channelId){
            return res.status(400).json({
                message:'channel not found',
                success:false,
            })
        }
        const existSubscriber = await Subscription.findOne(
            { 
                subscriber:req.user._id,
                channel:channelId
            }
        )
        if(!existSubscriber){
            const newSubscriber = await Subscription.create({
                 subscriber:req.user._id,
                channel:channelId
            })
            return res.status(200).json({
                message:'subscribe sucessfully',
                data:newSubscriber,
                success:true
            })
        }else{
            await Subscription.findByIdAndDelete(existSubscriber._id)
            return res.status(200).json({
                message:'Unsubscribe Sucessfully',
                data:null,
                success:true
            })
        }
    } catch (error) {
        console.log(error);
        
    }
}
export const subscriberCount = async(req,res)=>{
    try {
        const {channelId}=req.params;
         if(!channelId){
            return res.status(400).json({
                message:'channel not found',
                success:false,
            })
        }
        const subscribers = await Subscription.countDocuments({channel:channelId})
         
            return res.status(200).json({
                message:'the number of subscriber',
                data:subscribers,
                success:true,
            })
        
    } catch (error) {
        console.log(error);
        
    }
}
export const subscribedToCount=async(req,res)=>{
    try {
         const {subscribeId}=req.params;
         if(!subscribeId){
            return res.status(400).json({
                message:'subscriber not found',
                success:false,
            })
        }
        const subscriberToCount = await Subscription.countDocuments({subscriber:subscribeId})
         
            return res.status(200).json({
                message:'subscribed countchannel',
                data:subscriberToCount,
                success:true,
            })
    } catch (error) {
        
    }
}
import mongoose from "mongoose";
import { DeliveryPartner } from "./user.js";



const branchSchema = new mongoose.Schema({
    name:{ type: String, required:true},
    livelocation:{
        latitude:{type:Number},
        longitude:{type:Number},

    },
    address: {type:String},
    DeliveryPartner:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"DeliveryPartner",
        },
    ],
});

const Branch = mongoose.model("Branch", branchSchema);
export default Branch;
// location update krne ke liye jb lucknow se delhi chle gye to wha ke branch dikhe 

import { Customer, DeliveryPartner } from "../../models/index.js";

export const updateUser  = async (req, reply)=>{
    try{
        const {userId} = req.user;
        const updateData = req.body;


        let user = await Customer.findById(userId) || await DeliveryPartner.findById(userId);

        if (!user){
            return reply.status(404).send({message:"User Not Found"});
        }

        let UserModel;
        if (user.role==="Customer"){
            UserModel=Customer;
        } else if(user.role="DeliveryPartner"){
            UserModel=DeliveryPartner;
        } else { 
            return reply.status(400).send({message:"Invalid User Role"});

        }


        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {$set: updateData},
            {new: true, runvalidators:true}
        );

        if (!updatedUser){
            return reply.status(404).send({message:"User Not Found"});
        }

        return reply.send({
            message:"User Updated Successfully",
            user:updateUser,
        });
    } catch(error){
        return reply.status(500).send({message:"Failed To Update User", error});
    }
};
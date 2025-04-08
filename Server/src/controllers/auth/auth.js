import { Customer, DeliveryPartner } from "../../models/user.js";

import jwt  from "jsonwebtoken";
//two diffrent are generate to login if accesstoken has lost then with help of refreh token can generate access token 
//inhi token se api call k payenge 

const generateTokens=(user)=>{
    const accessToken = jwt.sign({userId:user._id,role:user.role},  // isse sign ho rha hi or encode 
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: "1d" }
    );

    const refreshToken = jwt.sign({userId:user._id,role:user.role},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: "7d" }
    );
    return { accessToken, refreshToken};
};

export const loginCustomer = async(req, reply)=>{
    try{
        const { phone } = req.body
        let customer = await Customer.findOne({phone});

        if(!customer){
            customer = new Customer({
                phone,
                role:"Customer",
                isActivated:true,
            });
            await customer.save();
        }
        const {accessToken, refreshToken}= generateTokens(customer);

        return reply.send({
            message: customer ? "Login Successful": "Customer created and logged in ",
            accessToken,
            refreshToken,
            customer,
        })
    }catch(error){
        return reply.status(500).send({message:"An error occured", error})


        }
};

export const loginDeliveryPartner = async(req, reply)=>{
    try{
        const { email, password} = req.body
        let deliveryPartner = await DeliveryPartner.findOne({email});

        if(!deliveryPartner){
            return reply.status(500).send({message:"Delivery Partner Not Found"});
        }

        const isMatch = password ===deliveryPartner.password

        if (!isMatch){
            return reply.status(500).send({message:"Invalid Credentials"});
        }
        const {accessToken, refreshToken}= generateTokens(deliveryPartner);

        return reply.send({
            message:"Login Successful",
            accessToken,
            refreshToken,
            deliveryPartner,
        })
    }catch(error){
        return reply.status(500).send({message:"An error occured", error});


        }
};

export const refreshToken = async(req, reply)=>{
    const {refreshToken}= req.body;

    if(!refreshToken){
        return reply.status(401).send({message:"Refresh Token Required"});

    }

    try{
        //validation process
        //refresh token ko decode krte hi
        const decoded = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET)
        let user;

        if(decoded.role==='Customer'){
            user = await Customer.findById(decoded.userId);

        }else if (decoded.role === "Delivery Partner"){
            user = await DeliveryPartner.findById(decoded.userId);
        }else{
            return refreshToken.status(403).send({message:"Invalid Role"});
        }

        if(!user){
            return reply.status(403).send({message:"Invalid Refresh Token"});
        }

        const { accessToken, refreshToken:newRefreshToken } = generateTokens(user);
        return reply.send({
            message:"Token Refreshed",
            accessToken,
            refreshToken:newRefreshToken,
        })

    }catch(error){
        return reply.status(403).send({message:"Invalid Refreh Token"});
    }
}
//if your data is updated then for fetching your profie

export const fetchUser = async(req, reply)=>{
    try{
        const {userId, role} = req.user;
        let user;

        if(role==='Customer'){
            user = await Customer.findById(userId);

        }else if (role === "Delivery Partner"){
            user = await DeliveryPartner.findById(userId);
        }else{
            return refreshToken.status(403).send({message:"Invalid Role"});
        }

        if(!user){
            return reply.status(403).send({message:"Invalid Refresh Token"});
        }

        return reply.send({message:"User Fetched Successfully",user});

    }catch(error){
        return reply.status(500).send({message:"An error Ocurred", error});
    }
}

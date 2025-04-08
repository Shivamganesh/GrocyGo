import mongoose from "mongoose";

// base user schema

const userSchema = new mongoose.Schema({
    name:{ type: String},
    role:{
        type:String,
        enum : ["Customer", "Admin", "DeliveryPartner"],
        required:true
    },
    isActivated: {type: Boolean, default: false},
});

// customer schema

const customerSchema = new mongoose.Schema({
    ...userSchema.obj,
    phone: {type:Number, required:true, unique:true},
    role:{type: String, enum: ["Customer"], default: "Customer"},
    livelocation:{
        latitude:{type:Number},
        longitude:{type:Number},

    },
    address: {type:String},

});

const DeliveryPartnerSchema = new mongoose.Schema({
    ...userSchema.obj,
    email:{type:String, required:true, unique:true
    },
    password:{type:String, required:true},
    phone: {type:Number, required:true, unique:true},
    role:{type: String, enum: ["Delivery Partner"], default: "Delivery Partner"},
    livelocation:{
        latitude:{type:Number},
        longitude:{type:Number},

    },
    address: {type:String},
    branch:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch",
    },

});

//Admin schema

const adminSchema = new mongoose.Schema({
    ...userSchema.obj,
    email:{type:String, required:true, unique:true
    },
    password:{type:String, required:true},

    role:{type: String, enum: ["Admin"], default: "Admin"},
  

});



export const Customer = mongoose.model("Customer", customerSchema);

export const DeliveryPartner = mongoose.model("DeliveryPartner", DeliveryPartnerSchema );

export const admin= mongoose.model("Admin", adminSchema);

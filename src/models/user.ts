import mongoose, { Schema, Model } from "mongoose";
import bcrypt from "bcrypt"

const accounttypes = ["Student" , "Professional" , "Organization"];

const userSchema = new Schema ({
    username : {type : String , unique : true , required : true},
    email : {type : String , required : true , unique : true},
    accountType : { type : String , enum : accounttypes , required : true},
    password : {type : String , required : true},
})

userSchema.pre("save" , async function(next) {
       if(this.isModified("password"))
       {
           this.password = await bcrypt.hash(this.password , 8);
       }

       next();
})

export const userModel = mongoose.model("user" , userSchema);

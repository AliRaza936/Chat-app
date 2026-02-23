import mongoose, { Schema,type Document } from "mongoose";

export interface IUser extends Document{

    name:string,
    email:string,
    avatar:string,
    providerId:string,
    createdAt:Date,
    updatedAt:Date
}
const userSchema = new mongoose.Schema<IUser>({

    providerId:{
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true, 
    },
    avatar:{
        type:String,
        default:"",
    }
},{timestamps:true})

export const User = mongoose.model<IUser>("User",userSchema)
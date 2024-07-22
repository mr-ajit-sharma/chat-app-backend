import mongoose, { Schema } from "mongoose";
const userSchema=new mongoose.Schema({
    fullname:{
        type:String,
        required:true
    },username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    profilephoto:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        enum:['male','female'],
        required:true,
    }
},{timestamps:true})
const User=mongoose.model("User",userSchema)
export default User
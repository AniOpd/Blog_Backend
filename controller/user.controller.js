import User from "../model/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const secret = process.env.SECRET;
import nodemailer from "nodemailer";
import crypto from "crypto";

export const register = async (req,res)=>{
    try{
        const {name,email,password}=req.body;
        const existingUser=await User.findOne({email});
        if(!existingUser){
            const hashedPass=await bcrypt.hash(password,10);
            const newUser = new User({
                name,
                email,
                password:hashedPass
            });
            await newUser.save();
            const token = jwt.sign({email:newUser.email,id:newUser._id},secret,{expiresIn:"90d"});
            res.cookie("token",token).status(201).json({message:"User registered successfully",token,user:newUser._id,name:newUser.name,email:newUser.email});
        }else{
            res.status(400).json({message:"User already exists"});
        }
    }
    catch(error){
        console.error(`Error: ${error.message}`);
        res.status(500).json({message:"Server Error"});
    }
}

export const login = async (req,res)=>{
    try{
        const {email,password}=req.body;
        const existingUser=await User.findOne({email});
        if(!existingUser){
            res.status(404).json({message:"Credentials not valid"});
        }else{
            const isPasswordCorrect=await bcrypt.compare(password,existingUser.password);
            if(!isPasswordCorrect){
                res.status(400).json({message:"Credentials not valid"});
            }else{
                const token = jwt.sign({email:existingUser.email,id:existingUser._id},secret,{expiresIn:"90d"});
                res.cookie("token",token).status(200).json({token,message:"User logged in successfully",user:existingUser._id});
            }
        }
    }
    catch(error){
        console.error(`Error: ${error.message}`);
        res.status(500).json({message:"Server Error"});
    }
}

export const logout = async (req,res)=>{
    try{
        res.clearCookie("token").status(200).json({message:"User logged out successfully"});
    }
    catch(error){
        console.error(`Error: ${error.message}`);
        res.status(500).json({message:"Server Error"});
        return;
    }
}

export const forgetPassword = async (req,res)=>{
    try{
        const {email}=req.body;
        const existingUser=await User.findOne({email});
        if(!existingUser){
            res.status(404).json({message:"User not found"});
        }
       let otp = crypto.randomInt(100000,999999).toString();
       const hashedOtp=await bcrypt.hash(otp,10);
         existingUser.otp=hashedOtp;
            existingUser.otpTime=Date.now()+600000;
            await existingUser.save();
        const transporter = nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:process.env.EMAIL,
                pass:process.env.PASSWORD
            }
        })
        const mailOptions = {
            from:process.env.EMAIL,
            to:email,
            subject:"Password Reset",
            text:`Your OTP is ${otp}`
        }
        transporter.sendMail(mailOptions,(error,info)=>{
            if(error){
                console.log(error);
            }else{
                console.log(`Email sent: ${info.response}`);
                console.log(existingUser);
                res.status(200).json({message:"Email sent successfully"});
                return;
            }
        })
    }catch(error){
        console.error(`Error: ${error.message}`);
        res.status(500).json({message:"Server Error"});
    }
}

export const resetPassword = async (req,res)=>{
    try{
        const {otp,password,email}=req.body;
        const existingUser=await User.findOne({email});
        if(!existingUser){
            res.status(404).json({message:"User not found"});
        }else{        
        if(existingUser.otpTime<Date.now()){
            res.status(400).json({message:"OTP expired"});
        }else{
            const isOtpCorrect=await bcrypt.compare(otp,existingUser.otp);
            if(!isOtpCorrect){
                res.status(400).json({message:"Invalid OTP"});
            }else{
                const hashedPass=await bcrypt.hash(password,10);
                existingUser.password=hashedPass;
                existingUser.otp=null;
                existingUser.otpTime=null;
                await existingUser.save();
                console.log(existingUser);
                res.status(200).json({message:"Password reset successfully"});
            }
        }
    }
    }catch(error){
        console.error(`Error: ${error.message}`);
        res.status(500).json({message:"Server Error"});
    }
}

export const deleteUser = async (req,res)=>{
    try{
        const {email}=req.body;
        const existingUser=await User.findOne({email});
        if(!existingUser){
            res.status(404).json({message:"User not found"});
        }
        await User.findOneAndDelete({email})
        res.status(200).json({message:"User deleted successfully"});
    }
    catch(error){
        console.error(`Error: ${error.message}`);
        res.status(500).json({message:"Server Error"});
    }
}
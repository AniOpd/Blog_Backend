import blog from "../model/blog.model.js";
import User from "../model/user.model.js";
import express from "express";
import {Transform} from 'stream';


export const createBlog = async (req,res)=>{
    try{
        const {title,content,image,userId}=req.body;
        const user= await User.findById(userId);
        const author=user.name;
        const newBlog = new blog({
            title,
            content,
            image,
            userId,
            author
        });
        await newBlog.save();
        res.status(201).json({message:"Blog created successfully"});
    }catch(error){
        console.error(`Error: ${error.message}`);
        res.status(500).json({message:"Server Error"});
    }
}

export const getBlogs = async (req,res)=>{
    try{
        const transformData = new Transform({objectMode:true});
        transformData.iswritten=false;
        transformData._transform = function(chunk,encoding,callback){
            if(!this.iswritten){
                this.iswritten=true;
                callback(null,"["+JSON.stringify(chunk));
            }else{
                callback(null,","+JSON.stringify(chunk));
            }
        }
        transformData._flush = function(callback){
            callback(null,"]");
        }
        const blogs= blog.find().cursor().pipe(transformData);
        blogs.pipe(res);

    }catch(error){
        console.error(`Error: ${error.message}`);
        res.status(500).json({message:"Server Error"});
    }
}

export const getBlog = async (req,res)=>{
    try{
        const transformData = new Transform({objectMode:true});
        transformData.iswritten=false;
        transformData._transform = function(chunk,encoding,callback){
            callback(null,JSON.stringify(chunk));
        }
        const {id}=req.body;
        const blogData= blog.findById(id).cursor().pipe(transformData);
        blogData.pipe(res);
    }catch(error){
        console.error(`Error: ${error.message}`);
        res.status(500).json({message:"Server Error"});
    }
}

export const updateBlog = async (req,res)=>{
    try{
        const {id}=req.body;
        const {title,content,image}=req.body;
        await blog.findByIdAndUpdate(id,{title,content,image},{new:true});
        res.status(200).json({message:"Blog updated successfully"});
    }
    catch(error){
        console.error(`Error: ${error.message}`);
        res.status(500).json({message:"Server Error"});
    }
}

export const deleteBlog = async (req,res)=>{
    try{
        const {id}=req.body;
        await blog.findByIdAndDelete(id);
        res.status(200).json({message:"Blog deleted successfully"});
    }catch(error){
        console.error(`Error: ${error.message}`);
        res.status(500).json({message:"Server Error"});
    }
}

export const likeBlog = async (req,res)=>{
    try{
        const {id}=req.body;
        const {userId}=req.body;
        const blogData=await blog.findById(id);
        const updatedBlog = await blog.findByIdAndUpdate(id,{likes:blogData.likes+1},{new:true});
        const user=await User.findById(userId);
        user.likedBlogs.push(id);
        await user.save();
        res.status(200).json(updatedBlog);
    }
    catch(error){
        console.error(`Error: ${error.message}`);
        res.status(500).json({message:"Server Error"});
    }
}

export const removeLike = async (req,res)=>{
    try{
        const {id}=req.body;
        const {userId}=req.body;
        const blogData=await blog.findById(id);
        const updatedBlog = await blog.findByIdAndUpdate(id,{likes:blogData.likes-1},{new:true});
        const user=await User.findById(userId);
        user.likedBlogs=user.likedBlogs.filter(blog=>blog!=id);
        await user.save();
        res.status(200).json(updatedBlog);
    }
    catch(error){
        console.error(`Error: ${error.message}`);
        res.status(500).json({message:"Server Error"});
    }
}

export const addComment = async (req,res)=>{
    try{
        const {id}=req.body;
        const {userId,comment}=req.body;
        const blogData=await blog.findById(id);
        blogData.comments.push({userId,comment});
        await blogData.save();
    }catch(error){
        console.error(`Error: ${error.message}`);
        res.status(500).json({message:"Server Error"});
    }
}

export const removeComment = async (req,res)=>{
    try{
        const {id}=req.body;
        const {commentId}=req.body;
        const blogData=await blog.findById(id);
        blogData.comments=blogData.comments.filter(comment=>comment._id!=commentId);
        await blogData.save();
        res.status(200).json({message:"Comment removed successfully"});
    }catch(error){
        console.error(`Error: ${error.message}`);
        res.status(500).json({message:"Server Error"});
    }
}
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const secret = process.env.SECRET;
import cookieParser from "cookie-parser";


export const userAuth = async (req,res,next)=>{
    try{
        const token=req.cookies.token;
        if(!token){
            return res.status(401).json({message:"Unauthorized"});
        }
        const verified = jwt.verify(token,secret);
        if(!verified){
            return res.status(401).json({message:"Unauthorized"});
        }
        else{
            req.userId=verified.id;
            next();
        }
    }catch(error){
        console.error(`Error: ${error.message}`);
        res.status(500).json({message:"Server Error"});
    }
}
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const secret = process.env.SECRET;


export const userAuth = async (req,res,next)=>{
    try{
        console.log("inside userAuth");
        const {token} = req.body;
        console.log(token);
        if(!token){
            return res.status(401).json({message:"Unauthorized"});
        }
        const verified = jwt.verify(token,secret);
        if(!verified){
            return res.status(401).json({message:"Unauthorized"});
        }
        else{
            console.log(verified);
            next();
        }
    }catch(error){
        console.error(`Error: ${error.message}`);
        res.status(500).json({message:"Server Error"});
    }
}
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const Url=process.env.DB_URI;

const connectDB = async ()=>{
    try{
        const conn=await mongoose.connect(Url)
        .then(()=>console.log('Database connected'))
        .catch((err)=>console.log(err));
    }
    catch(error){
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

connectDB();

export default connectDB;
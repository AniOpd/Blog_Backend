import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './db/db.js';
import userRoutes from './routes/user.routes.js';
import bcrypt from 'bcrypt';
import blogRoutes from './routes/blog.routes.js';
import { userAuth } from './middlwares/userAuth.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';



const app = express();
const port = process.env.PORT || 5000;

app.use(cors(
    {
        origin: '*',
    }
));
app.use(cookieParser());
app.use(express.json());
app.use('/user',userRoutes);
app.use('/blog',userAuth,blogRoutes);

app.get('/',(req,res)=>{
    res.send('API is running....')
})

app.listen(port,(req,res)=>{
    console.log(`Server is running on port ${port}`)
})



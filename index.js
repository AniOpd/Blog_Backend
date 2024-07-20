import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './db/db.js';
import userRoutes from './routes/user.routes.js';
import blogRoutes from './routes/blog.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import getBloggRoutes from './routes/getBlog.routes.js';
import {userAuth} from './middlwares/userAuth.js';



const app = express();
const port = process.env.PORT || 5000;

app.use(cors(
    {
        origin: '*',
        methods: ['GET','POST','PUT','DELETE'],
        credentials: true,
    }
));
app.use(cookieParser());
app.use(express.json());
app.use('/user',userRoutes);
app.use('/blog',userAuth,blogRoutes);
app.use('/blogs',getBloggRoutes);

app.get('/',(req,res)=>{
    res.send('API is running....')
})

app.listen(port,(req,res)=>{
    console.log(`Server is running on port ${port}`)
})



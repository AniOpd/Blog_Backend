import express from 'express';
const router = express.Router();
import {getBlog,getBlogs} from '../controller/blog.controller.js';

router.get('/getblogs',getBlogs);
router.post('/getblog',getBlog);

export default router;

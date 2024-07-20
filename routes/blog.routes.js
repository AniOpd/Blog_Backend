import express from 'express';
const router = express.Router();
import { createBlog,deleteBlog,updateBlog,removeComment,removeLike,addComment,likeBlog } from '../controller/blog.controller.js';

router.post('/createblog',createBlog);
router.put('/updateblog',updateBlog);
router.post('/deleteblog',deleteBlog);
router.put('/addcomment',addComment);
router.put('/likeblog',likeBlog);
router.put('/removelike',removeLike);
router.put('/removecomment',removeComment);

export default router;
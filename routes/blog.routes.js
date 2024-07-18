import express from 'express';
const router = express.Router();
import { createBlog,getBlog,getBlogs,deleteBlog,updateBlog,removeComment,removeLike,addComment,likeBlog } from '../controller/blog.controller.js';

router.post('/createblog/:userId',createBlog);
router.get('/getblogs',getBlogs);
router.get('/getblog/:id',getBlog);
router.put('/updateblog/:id',updateBlog);
router.delete('/deleteblog/:id',deleteBlog);
router.put('/addcomment/:id',addComment);
router.put('/likeblog/:id',likeBlog);
router.put('/removelike/:id',removeLike);
router.put('/removecomment/:id',removeComment);

export default router;
import express from 'express';
const router = express.Router();
import { register,login,forgetPassword,resetPassword,logout,deleteUser } from '../controller/user.controller.js';

router.post('/register',register);
router.post('/login',login);
router.post('/forgetpassword',forgetPassword);
router.post('/resetpassword',resetPassword);
router.get('/logout',logout);
router.delete('/deleteuser',deleteUser);


export default router;
import { Router } from "express";
import { getMe , postDeleteUser, postLogin, postSignup, postUpdateName, postUpdatePassword } from "../controllers/auth.controllers.js";
import requireAuth from "../middlewares/requireAuth.js";
const router = Router();

router.post('/signup', postSignup);
router.post('/login', postLogin);
router.get('/me', requireAuth , getMe );
router.patch('/updatename',requireAuth ,postUpdateName);
router.patch('/updatepassword',requireAuth ,postUpdatePassword);
router.delete('/deleteuser',requireAuth , postDeleteUser);

export default router;
import express from "express";
const router = express.Router();
import {
    login,
    signup,
    refresh,
    me,
    forgotPassword,
} from "../controllers/user";
import { auth } from "../middleware/authentication";

// router.post("/sendOtp", sendotp);
router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh", auth, refresh);
router.post("/me", auth, me);
// router.post("/changeEmail", auth, changeEmail);
// router.post("/deleteAcc", auth, deleteAcc);
router.post("/forgotPassword", forgotPassword);
// router.post("/generateOTP", auth, generateOTP);
// router.post("/otpForgotPwd", otpForgotPwd);
// router.post("/createAdmin", auth, createAdmin);

export default router;

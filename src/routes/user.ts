import express from "express";
const router = express.Router();
import { login, signup, refresh } from "../controllers/user";

// const {
//     sendotp,
//     signup,
//     login,
//     changeEmail,
//     changePassword,
//     deleteAcc,
//     forgotPassword,
//     generateOTP,
//     otpForgotPwd,
//     createAdmin,
// } = require("../controllers/Auth");

const { auth } = require("../middleware/authentication");

// router.post("/sendOtp", sendotp);
router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh", auth, refresh);
// router.post("/changeEmail", auth, changeEmail);
// router.post("/changePwd", auth, changePassword);
// router.post("/deleteAcc", auth, deleteAcc);
// router.post("/forgotPassword", forgotPassword);
// router.post("/generateOTP", auth, generateOTP);
// router.post("/otpForgotPwd", otpForgotPwd);
// router.post("/createAdmin", auth, createAdmin);

export default router;

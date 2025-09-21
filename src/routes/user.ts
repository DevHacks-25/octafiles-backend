import express from "express";
const router = express.Router();
import {
    login,
    signup,
    refresh,
    me,
    forgotPassword,
    sendOTP,
    forgotPasswordOTP,
    completeServiceProvidersForm,
} from "../controllers/user";
import { auth } from "../middleware/authentication";

router.post("/sendotp", sendOTP);
router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh", auth, refresh);
router.post("/me", auth, me);
// router.post("/changeEmail", auth, changeEmail);
// router.post("/deleteAcc", auth, deleteAcc);
router.post("/forgotPassword", forgotPassword);
router.post("/forgotPasswordOTP", forgotPasswordOTP);
// router.post("/generateOTP", auth, generateOTP);
// router.post("/createAdmin", auth, createAdmin);
router.post(
    "/completeServiceProvidersForm",
    auth,
    completeServiceProvidersForm
);

export default router;

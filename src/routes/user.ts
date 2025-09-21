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
router.get("/me", auth, me);
router.post("/forgotPassword", forgotPassword);
router.post("/forgotPasswordOTP", forgotPasswordOTP);
router.post(
    "/completeServiceProvidersForm",
    auth,
    completeServiceProvidersForm
);

export default router;

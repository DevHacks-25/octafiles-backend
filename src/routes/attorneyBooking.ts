import { Router } from "express";
import { auth } from "../middleware/authentication";
import { createBooking } from "../controllers/attorneyBooking";

const router = Router();

router.post("/create", auth, createBooking);

export default router;

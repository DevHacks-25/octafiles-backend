import { Router } from "express";
import { getAllChats, getAllMessages } from "../controllers/chat";
import { auth } from "../middleware/authentication";

const router = Router();

router.post("/getAllMessages", auth, getAllMessages);
router.post("/getAllChats", auth, getAllChats);

export default router;

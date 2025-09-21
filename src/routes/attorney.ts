import express from "express";
import { getAllAttorneys } from "../controllers/attorney";
import { auth } from "../middleware/authentication";

const router = express.Router();

router.post("/getall", auth, getAllAttorneys);

export default router;

import express from "express";
import { getAllAttorneys, getAttorneyDetails } from "../controllers/attorney";
import { auth } from "../middleware/authentication";

const router = express.Router();

router.post("/getall", auth, getAllAttorneys);
router.post("/getdetails", auth, getAttorneyDetails);
export default router;

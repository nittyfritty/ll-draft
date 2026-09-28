import { validate } from "../middleware/validate.js";
import Router, { type Request, type Response } from "express";
import Coaches from "../models/Coaches.js"
// import { body } from "express-validator";

const router = Router();

router.get("/", validate, async (req: Request, res: Response) => {
    try {
        const Coach = await Coaches.find();
        res.status(200).json(Coach);
    } catch (error) {
        res.status(400).json({ message: "Error fetching coaches" });
    }
});

router.get("/:id", validate, async (req: Request, res: Response) => {
    try {
        const Coach = await Coaches.findById(req.params.id);
        if (!Coach) {
            return res.status(404).json({ message: "Coach not found" });
        }
        res.status(200).json(Coach);
    } catch (error) {
        res.status(400).json({ message: "Error fetching coach" });
    }
});

export default router;
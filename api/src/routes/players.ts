import { validate } from "../middleware/validate.js";
import { preprocess } from "../middleware/preprocess.js";
import Router, { type Request, type Response } from "express";
import Players from "../models/Players.js"
import { body } from "express-validator";
import { populatePlayerAges } from "../utils/helpers.js";

const router = Router();

router.get("/", validate, async (req: Request, res: Response) => {
    try {
        const Player = await Players.find();
        res.status(200).json(Player);
    } catch (error) {
        res.status(400).json({ message: "Error fetching players" });
    }
});

router.get("/:id", validate, async (req: Request, res: Response) => {
    try {
        const Player = await Players.findById(req.params.id);
        if (!Player) {
            return res.status(404).json({ message: "Player not found" });
        }
        res.status(200).json(Player);
    } catch (error) {
        res.status(400).json({ message: "Error fetching player" });
    }
});

router.post("/", validate([
    body("name").notEmpty().withMessage("Name is required"),
    body("birthDate").isISO8601().toDate().withMessage("Valid birth date is required"),
    body("parentNameOne").notEmpty().withMessage("At least one parent name is required"),
    body("parentEmailOne").isEmail().withMessage("Valid parent email is required"),
    body("parentPhoneOne").notEmpty().withMessage("At least one parent phone number is required"),
    body("coachId").optional({ values: "null" }).isMongoId().withMessage("Coach ID must be a valid ID"),
    body("division").notEmpty().withMessage("Division is required")
]), preprocess(populatePlayerAges), async (req: Request, res: Response) => {
    try {
        const newPlayer = new Players(req.body);
        await newPlayer.save();
        res.status(201).json(newPlayer);
    } catch (error) {
        res.status(400).json({ message: "Error creating player" });
    }
});

router.put("/:id", validate([
    body("name").optional().notEmpty().withMessage("Name cannot be empty"),
    body("birthDate").optional().isISO8601().toDate().withMessage("Valid birth date is required"),
    body("parentNameOne").optional().notEmpty().withMessage("Parent name cannot be empty"),
    body("parentEmailOne").optional().isEmail().withMessage("Valid parent email is required"),
    body("parentPhoneOne").optional().notEmpty().withMessage("Parent phone number cannot be empty"),
    body("coachId").optional({ values: "null" }).isMongoId().withMessage("Coach ID must be a valid ID"),
    body("division").optional().notEmpty().withMessage("Division cannot be empty")
]), preprocess(populatePlayerAges), async (req: Request, res: Response) => {
    try {
        const updatedPlayer = await Players.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPlayer) {
            return res.status(404).json({ message: "Player not found" });
        }
        res.status(200).json(updatedPlayer);
    } catch (error) {
        res.status(400).json({ message: "Error updating player" });
    }
});

router.delete("/:id", validate, async (req: Request, res: Response) => {
    try {
        const deletedPlayer = await Players.findByIdAndDelete(req.params.id);
        if (!deletedPlayer) {
            return res.status(404).json({ message: "Player not found" });
        }
        res.status(200).json({ message: "Player deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: "Error deleting player" });
    }
});

export default router;
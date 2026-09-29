import { validate } from "../middleware/validate.js";
import Router, { type Request, type Response } from "express";
import Coaches from "../models/Coaches.js";
import Players from "../models/Players.js";
// import { body } from "express-validator";

const router = Router();

router.get("/", validate([]), async (req: Request, res: Response) => {
    try {
        const coaches = await Coaches.aggregate([
            {
                $lookup: {
                    from: Players.collection.name,
                    localField: "_id",
                    foreignField: "coachId",
                    as: "assignedPlayers",
                },
            },
            {
                $addFields: {
                    playerCount: { $size: "$assignedPlayers" },
                },
            },
            { $project: { assignedPlayers: 0 } },
        ]);
        res.status(200).json(coaches);
    } catch (error) {
        res.status(400).json({ message: "Error fetching coaches" });
    }
});

router.get("/:id", validate([]), async (req: Request, res: Response) => {
    try {
        const coach = await Coaches.findById(req.params.id);
        if (!coach) {
            return res.status(404).json({ message: "Coach not found" });
        }
        const playerCountResult = await Players.aggregate([
            { $match: { coachId: coach._id } },
            { $count: "count" },
        ]);
        const playerCount = playerCountResult[0]?.count ?? 0;
        res.status(200).json({ ...coach.toObject(), playerCount });
    } catch (error) {
        res.status(400).json({ message: "Error fetching coach" });
    }
});

router.get("/players", validate([]), async (req: Request, res: Response) => {
    try {
        const players = await Players.find({}, "name evaluationScore coachId division leagueAge actualAge").lean();
        res.status(200).json(players);
    } catch (error) {
        res.status(400).json({ message: "Error fetching players" });
    }
});

export default router;
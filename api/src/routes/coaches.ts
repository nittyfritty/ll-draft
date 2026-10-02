import { validate } from "../middleware/validate.js";
import Router, { type Request, type Response } from "express";
import Coaches, { type ICoach } from "../models/Coaches.js";
import Players from "../models/Players.js";
import type { QueryFilter } from "mongoose";
import { query } from "express-validator";

const router = Router();

router.get("/", validate([
    query(["name", "division"]).optional()
]), async (req: Request, res: Response) => {
    const { name, division } = req.query;
    const filter: QueryFilter<ICoach> = {};
    if (name) {
        const nameRegex = new RegExp(name as string, "i");
        filter.$or = [
            { name: nameRegex },
        ];
    }
    if (division) {
        filter.division = division as string;
    }
    const coaches = await Coaches.aggregate([
        { $match: filter },
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
});

router.get("/:id", validate([]), async (req: Request, res: Response) => {
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
});

router.get("/players", validate([]), async (req: Request, res: Response) => {
    const players = await Players.find({}, "name evaluationScore coachId division leagueAge actualAge").lean();
    res.status(200).json(players);
});

export default router;
// api health check route
import { Router } from "express";
import mongoose from "mongoose";
import { type Request, type Response } from "express";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  const dbState = mongoose.connection.readyState;
  const connected = dbState === 1;

  // Log the database connection state for debugging purposes
  console.log(`Database connection state: ${dbState}`);
  res.status(connected ? 200 : 500).json({
    status: connected ? "ok" : "error",
    dbState: dbState ?? "unknown",
  });
});

export default router;
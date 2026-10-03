import cors from "cors";
import express from "express";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import playersRouter from "./routes/players.js";
import coachesRouter from "./routes/coaches.js";
import healthRouter from "./routes/health.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/players", playersRouter);
app.use("/api/coaches", coachesRouter);
app.use("/api/health", healthRouter);
app.use(errorHandler);
app.use(notFoundHandler);

export default app;
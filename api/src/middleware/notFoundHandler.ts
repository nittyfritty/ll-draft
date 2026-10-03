import { type Request, type Response } from "express";

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ message: "Resource not found" });
}
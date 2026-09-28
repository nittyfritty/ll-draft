import { type Request, type Response, type NextFunction } from "express";

export function notFoundHandler(req: Request, res: Response, next: NextFunction) {
  res.status(404).json({ message: "Resource not found" });
}
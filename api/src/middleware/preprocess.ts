import type { RequestHandler } from "express";

export type BodyTransformer = (body: Record<string, unknown>) => void;

export function preprocess(...transformers: BodyTransformer[]): RequestHandler {
    return (req, res, next) => {
        if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
            next();
            return;
        }

        const body = req.body as Record<string, unknown>;
        for (const transform of transformers) {
            transform(body);
        }

        next();
    };
}
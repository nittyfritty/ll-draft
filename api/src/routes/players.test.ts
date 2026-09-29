import assert from "node:assert/strict";
import type { AddressInfo } from "node:net";
import { test } from "node:test";
import express from "express";
import Players from "../models/Players.js";
import playersRouter from "./players.js";

test("assigns a coach to a player", async (t) => {
  const playerId = "507f1f77bcf86cd799439011";
  const coachId = "507f191e810c19729de860ea";
  const updatedPlayer = { _id: playerId, coachId };

  const updateMock = t.mock.method(
    Players,
    "findByIdAndUpdate",
    (id: unknown, update: unknown, options: unknown) => {
    assert.equal(String(id), playerId);
    assert.deepEqual(update, { coachId });
    assert.deepEqual(options, { new: true });
    return updatedPlayer as unknown as ReturnType<typeof Players.findByIdAndUpdate>;
  });

  const app = express();
  app.use(express.json());
  app.use(playersRouter);
  const server = app.listen(0);

  try {
    await new Promise<void>((resolve, reject) => {
      server.once("error", reject);
      server.once("listening", resolve);
    });

    const address = server.address() as AddressInfo;
    const response = await fetch(`http://127.0.0.1:${address.port}/${playerId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ coachId }),
    });

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), updatedPlayer);
    assert.equal(updateMock.mock.callCount(), 1);
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});
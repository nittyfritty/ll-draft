import assert from "node:assert/strict";
import { mock, test } from "node:test";
import { calculateLeagueAge } from "./helpers.js";

test("league age differs for August 31 and September 1 birthdays", () => {
  mock.timers.enable({
    apis: ["Date"],
    now: new Date("2026-09-28T12:00:00.000Z"),
  });

  try {
    const august31Birthday = "2015-08-31";
    const september1Birthday = "2015-09-01";

    assert.equal(calculateLeagueAge(august31Birthday), 11);
    assert.equal(calculateLeagueAge(september1Birthday), 10);
  } finally {
    mock.timers.reset();
  }
});
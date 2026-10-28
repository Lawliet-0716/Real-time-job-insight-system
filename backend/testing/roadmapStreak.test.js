import assert from "node:assert/strict";
import test from "node:test";
import { getRoadmapStreak } from "../utils/roadmapStreak.js";

test("counts consecutive active days through today", () => {
  assert.equal(
    getRoadmapStreak(
      ["2026-10-26", "2026-10-27", "2026-10-28"],
      new Date("2026-10-28T12:00:00.000Z"),
    ),
    3,
  );
});

test("keeps yesterday's streak active until the user completes something today", () => {
  assert.equal(
    getRoadmapStreak(
      ["2026-10-26", "2026-10-27"],
      new Date("2026-10-28T12:00:00.000Z"),
    ),
    2,
  );
});

test("resets a streak after a missed day", () => {
  assert.equal(
    getRoadmapStreak(
      ["2026-10-25", "2026-10-26"],
      new Date("2026-10-28T12:00:00.000Z"),
    ),
    0,
  );
});

import assert from "node:assert/strict";
import test from "node:test";
import {
  getCompletedWeekLearnedSkills,
  getSkillsToLearn,
} from "../utils/learningSkills.js";

test("filters learned skills without case sensitivity", () => {
  assert.deepEqual(
    getSkillsToLearn(
      ["TypeScript", "React", "Node.js"],
      ["typescript", " React "],
    ),
    ["Node.js"],
  );
});

test("keeps all missing skills when none have been learned", () => {
  assert.deepEqual(getSkillsToLearn(["TypeScript", "React"]), [
    "TypeScript",
    "React",
  ]);
});

test("marks skills learned only after every task in their week is complete", () => {
  const roadmap = [
    {
      week: "Week 1",
      tasks: ["Learn TypeScript syntax", "Build a TypeScript app"],
    },
  ];

  assert.deepEqual(
    getCompletedWeekLearnedSkills(
      ["TypeScript"],
      [],
      roadmap,
      [{ completedTasks: [true, false] }],
    ),
    [],
  );
  assert.deepEqual(
    getCompletedWeekLearnedSkills(
      ["TypeScript"],
      [],
      roadmap,
      [{ completedTasks: [true, true] }],
    ),
    ["TypeScript"],
  );
});

test("keeps learned status while a completed roadmap week remains complete", () => {
  const roadmap = [{ week: "Week 1", tasks: ["Learn TypeScript syntax"] }];
  const originalTasks = structuredClone(roadmap);

  assert.deepEqual(
    getCompletedWeekLearnedSkills(
      ["TypeScript"],
      ["TypeScript"],
      roadmap,
      [{ completedTasks: [true] }],
    ),
    ["TypeScript"],
  );
  assert.deepEqual(roadmap, originalTasks);
});

test("restores a skill to learning when a week is no longer fully complete", () => {
  assert.deepEqual(
    getCompletedWeekLearnedSkills(
      ["TypeScript"],
      ["TypeScript"],
      [{ week: "Week 1", tasks: ["Learn TypeScript syntax"] }],
      [{ completedTasks: [false] }],
    ),
    [],
  );
});

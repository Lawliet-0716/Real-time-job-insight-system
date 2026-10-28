import assert from "node:assert/strict";
import test from "node:test";
import { getJobSkills } from "../lib/jobSkills.js";

test("uses skills and technologies from a job", () => {
  assert.deepEqual(
    getJobSkills({
      skills: ["Java", " Spring Boot "],
      technologies: ["Spring Boot", "MongoDB"],
    }),
    ["Java", "Spring Boot", "MongoDB"],
  );
});

test("falls back to required skills in previously stored source data", () => {
  assert.deepEqual(
    getJobSkills({
      skills: [],
      raw: { job_required_skills: ["Python", " AWS ", "Python"] },
    }),
    ["Python", "AWS"],
  );
});

test("handles delimited and missing skills", () => {
  assert.deepEqual(
    getJobSkills({
      raw: { job_required_skills: "Go; Kubernetes | AWS" },
    }),
    ["Go", "Kubernetes", "AWS"],
  );
  assert.deepEqual(getJobSkills(null), []);
});

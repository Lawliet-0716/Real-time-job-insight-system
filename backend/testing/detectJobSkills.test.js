import assert from "node:assert/strict";
import test from "node:test";
import { detectJobSkills } from "../utils/detectJobSkills.js";

test("detects technical skills from a job title and description", () => {
  assert.deepEqual(
    detectJobSkills(
      "Senior React Developer",
      "Build services with Node.js, TypeScript, PostgreSQL, Docker, and AWS.",
    ),
    ["React", "Node.js", "TypeScript", "PostgreSQL", "Docker", "AWS"],
  );
});

test("matches punctuation-heavy skill names without matching substrings", () => {
  assert.deepEqual(
    detectJobSkills(
      "C++ Engineer",
      "Experience with C#, .NET, CI/CD, and RESTful APIs. JavaScript is useful.",
    ),
    ["C++", "C#", ".NET", "CI/CD", "REST API", "JavaScript"],
  );
});

test("returns no skills when no known technical skills are mentioned", () => {
  assert.deepEqual(
    detectJobSkills("People Manager", "Excellent communication and leadership."),
    [],
  );
});

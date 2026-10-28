import assert from "node:assert/strict";
import test from "node:test";
import mapJSearchJob from "../mappers/jsearch.mapper.js";

test("maps a JSearch job into the application job shape", () => {
  const rawJob = {
    job_id: "job-123",
    job_title: "Backend Developer",
    employer_name: "Example Corp",
    employer_logo: "https://example.com/logo.png",
    job_city: "Bengaluru",
    job_state: "Karnataka",
    job_country: "India",
    job_location: "Bengaluru, India",
    job_latitude: 12.97,
    job_longitude: 77.59,
    job_min_salary: 100000,
    job_max_salary: 150000,
    job_salary_currency: "INR",
    job_salary_period: "YEAR",
    job_salary_string: "₹100,000 - ₹150,000",
    job_apply_link: "https://example.com/apply",
    job_posted_at_datetime_utc: "2025-01-15T10:00:00Z",
    job_is_remote: true,
    job_required_skills: [" Node.js ", "MongoDB", "Node.js", "", null],
  };

  const mappedJob = mapJSearchJob(rawJob);

  assert.equal(mappedJob.source, "JSEARCH");
  assert.equal(mappedJob.externalJobId, "job-123");
  assert.equal(mappedJob.title, "Backend Developer");
  assert.equal(mappedJob.company, "Example Corp");
  assert.deepEqual(mappedJob.location, {
    city: "Bengaluru",
    state: "Karnataka",
    country: "India",
    fullLocation: "Bengaluru, India",
    latitude: 12.97,
    longitude: 77.59,
  });
  assert.deepEqual(mappedJob.salary, {
    min: 100000,
    max: 150000,
    currency: "INR",
    period: "YEAR",
    text: "₹100,000 - ₹150,000",
  });
  assert.equal(mappedJob.postedDate.toISOString(), "2025-01-15T10:00:00.000Z");
  assert.equal(mappedJob.isRemote, true);
  assert.deepEqual(mappedJob.skills, ["Node.js", "MongoDB"]);
  assert.strictEqual(mappedJob.raw, rawJob);
});

test("maps delimited required skills and ignores non-string values", () => {
  const mappedJob = mapJSearchJob({
    job_required_skills: "Java; Spring Boot | AWS, Java",
  });

  assert.deepEqual(mappedJob.skills, ["Java", "Spring Boot", "AWS"]);
});

test("supplies safe defaults for optional JSearch fields", () => {
  const mappedJob = mapJSearchJob({ job_id: "job-minimal" });

  assert.equal(mappedJob.companyLogo, "");
  assert.equal(mappedJob.description, "");
  assert.equal(mappedJob.location.city, "");
  assert.equal(mappedJob.location.latitude, null);
  assert.equal(mappedJob.salary.text, "Not Specified");
  assert.equal(mappedJob.postedDate, null);
  assert.equal(mappedJob.isRemote, false);
  assert.deepEqual(mappedJob.skills, []);
  assert.deepEqual(mappedJob.technologies, []);
});

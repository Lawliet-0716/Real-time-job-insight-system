import cron from "node-cron";
import { fetchJSearchJobs } from "./jobProvider.service.js";

export async function synchronizeScheduledJobs() {
  console.log("⏰ Starting job synchronization...");

  try {
    const queries = [
      "Software Engineer",
      "Backend Developer",
      "Frontend Developer",
      "Full Stack Developer",
      "Data Analyst",
    ];

    for (const query of queries) {
      console.log(`Fetching jobs for: ${query}`);
      await fetchJSearchJobs(query, 1, 1, { datePosted: "today" });
    }

    console.log("✅ Job synchronization completed.");
  } catch (error) {
    console.error("❌ Job synchronization failed:", error.message);
  }
}

export function startJobScheduler() {
  // Runs daily at midnight IST after the initial startup synchronization.
  cron.schedule("0 0 * * *", synchronizeScheduledJobs, {
    scheduled: true,
    timezone: "Asia/Kolkata",
  });

  console.log("⏰ Job scheduler started. Daily run: midnight IST.");

  // Render services can restart or sleep between cron executions, so sync once
  // immediately after a successful server start as well.
  void synchronizeScheduledJobs();
}

import cron from "node-cron";
import { fetchJSearchJobs } from "./jobProvider.service.js";

export function startJobScheduler() {
  // Runs once every 24 hours at midnight IST and fetches today's listings.
  cron.schedule(
    "0 0 * * *",

    async () => {
      console.log("⏰ Starting scheduled job synchronization...");

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

        console.log("✅ Scheduled job synchronization completed.");
      } catch (error) {
        console.error(
          "❌ Scheduled job synchronization failed:",
          error.message,
        );
      }
    },

    {
      scheduled: true,
      timezone: "Asia/Kolkata",
    },
  );

  console.log(
    "⏰ Job scheduler started. Scheduled every 24 hours for today's listings (midnight IST).",
  );
}

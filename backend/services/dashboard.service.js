import Resume from "../models/Resume.js";
import Job from "../models/Job.js";

export async function getDashboardOverviewService(userId) {
  // ==========================
  // User's Latest Resume
  // ==========================

  const resume = await Resume.findOne({
    user: userId,
  }).sort({
    createdAt: -1,
  });

  // ==========================
  // Dashboard Statistics
  // ==========================

  const since24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const sinceSevenDays = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000);

  const [
    totalJobs,
    jobs24h,
    remoteJobs,
    extractedTrendingSkills,
    latestJob,
    dailyJobCounts,
  ] = await Promise.all([
    Job.countDocuments(),

    Job.countDocuments({ createdAt: { $gte: since24Hours } }),

    Job.countDocuments({
      isRemote: true,
    }),

    Job.aggregate([
      {
        $project: {
          jobSkills: {
            $setUnion: [
              { $ifNull: ["$skills", []] },
              { $ifNull: ["$technologies", []] },
            ],
          },
        },
      },
      { $unwind: "$jobSkills" },
      {
        $project: {
          skill: { $trim: { input: "$jobSkills" } },
        },
      },
      { $match: { skill: { $ne: "" } } },
      {
        $group: {
          _id: { $toLower: "$skill" },
          skill: { $first: "$skill" },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1, skill: 1 } },
      { $limit: 10 },
      {
        $project: {
          _id: 0,
          skill: 1,
          count: 1,
        },
      },
    ]),

    Job.findOne().sort({ updatedAt: -1 }).select("updatedAt").lean(),

    Job.aggregate([
      { $match: { createdAt: { $gte: sinceSevenDays } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $project: { _id: 0, date: "$_id", count: 1 } },
      { $sort: { date: 1 } },
    ]),
  ]);

  const dailyCountMap = new Map(
    dailyJobCounts.map((day) => [day.date, day.count]),
  );
  const dailyTrend = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(sinceSevenDays);
    date.setDate(sinceSevenDays.getDate() + index);
    const dateKey = date.toISOString().slice(0, 10);
    return { date: dateKey, count: dailyCountMap.get(dateKey) || 0 };
  });

  const trendingSkills = extractedTrendingSkills.map((skill) => ({
    ...skill,
    percentage:
      totalJobs > 0 ? Number(((skill.count / totalJobs) * 100).toFixed(2)) : 0,
  }));

  // ==========================
  // Latest Jobs
  // ==========================

  const recentJobs = await Job.find()
    .sort({
      postedDate: -1,
      createdAt: -1,
    })
    .limit(10)
    .select(
      "title company location employmentType salary applyLink postedDate source isRemote",
    );

  // ==========================
  // Dashboard Response
  // ==========================

  return {
    stats: {
      totalJobs,

      jobs24h,

      remoteJobs,

      totalTrendingSkills: trendingSkills.length,

      resumeScore: resume?.resumeScore || 0,

      matchPercentage: resume?.matchPercentage || 0,
    },

    // ==========================
    // Resume Data
    // ==========================

    resume: resume
      ? {
          id: resume._id,

          fileName: resume.fileName,

          targetRole: resume.targetRole,

          atsScore: resume.atsScore,

          resumeScore: resume.resumeScore,

          matchPercentage: resume.matchPercentage,

          extractedSkills: resume.extractedSkills,

          matchingSkills: resume.matchingSkills,

          missingSkills: resume.missingSkills,

          recommendations: resume.recommendations,

          roadmap: resume.roadmap,
        }
      : null,

    // ==========================
    // Trending Skills
    // ==========================

    trendingSkills,

    skillsLastUpdated: latestJob?.updatedAt || null,

    dailyTrend,

    // ==========================
    // Latest Jobs
    // ==========================

    recentJobs,
  };
}

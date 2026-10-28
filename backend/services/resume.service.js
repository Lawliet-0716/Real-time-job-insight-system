import Resume from "../models/Resume.js";
import User from "../models/User.js";
import { getRoadmapStreak } from "../utils/roadmapStreak.js";

import { extractTextFromPDF } from "../utils/pdfExtractor.js";

import { extractResumeSkills } from "./ai/resumeSkillExtractor.js";

import { detectTargetRole } from "./ai/roleDetector.service.js";

import { generateRecommendations } from "./ai/recommendation.service.js";

import { generateRoadmap } from "./ai/roadmap.service.js";

import { compareSkills } from "./compareSkills.service.js";
import {
  getCompletedWeekLearnedSkills,
  getSkillsToLearn,
} from "../utils/learningSkills.js";

const MIN_ROADMAP_DURATION = 30;

function normalizeRoadmapDuration(value, fallback = MIN_ROADMAP_DURATION) {
  const duration = Number(value);
  return Number.isFinite(duration) && duration >= MIN_ROADMAP_DURATION
    ? Math.round(duration)
    : fallback;
}

// ==========================
// Upload Resume Service
// ==========================

export async function uploadResumeService(userId, file, roadmapDuration) {
  if (!file) {
    throw new Error("Resume file is required.");
  }

  // ==========================
  // Step 1: Extract Text from PDF
  // ==========================

  const extractedText = await extractTextFromPDF(file.path);

  const normalizedRoadmapDuration = normalizeRoadmapDuration(roadmapDuration);

  // ==========================
  // Step 2: Extract Resume Skills
  // ==========================

  const extractedSkills = await extractResumeSkills(extractedText);

  if (!extractedSkills || extractedSkills.length === 0) {
    throw new Error(
      "Could not extract skills from the resume. Please try uploading the resume again.",
    );
  }

  // ==========================
  // Step 3: Detect Target Role
  // ==========================

  const targetRole = await detectTargetRole(extractedText);

  if (!targetRole || !targetRole.trim()) {
    throw new Error("Could not detect the target job role from the resume.");
  }

  // ==========================
  // Step 4: Compare Resume Skills
  // ==========================

  const analysis = await compareSkills(
    extractedSkills,
    targetRole,
    extractedText,
  );

  // ==========================
  // Step 5: Generate Recommendations
  // ==========================

  const recommendations = await generateRecommendations({
    targetRole,

    extractedSkills,

    missingSkills: analysis.missingSkills,

    atsScore: analysis.atsScore,
  });

  // ==========================
  // Step 6: Generate Learning Roadmap
  // ==========================

  const roadmap = await generateRoadmap({
    targetRole,

    extractedSkills,

    missingSkills: analysis.missingSkills,

    atsScore: analysis.atsScore,

    durationDays: normalizedRoadmapDuration,
  });

  // ==========================
  // Step 7: Save Resume
  // ==========================

  const resume = await Resume.create({
    user: userId,

    fileName: file.originalname,

    fileUrl: file.path,

    extractedText,

    extractedSkills,

    targetRole,

    matchingSkills: analysis.matchingSkills,

    missingSkills: analysis.missingSkills,

    skillGaps: analysis.skillGaps,

    matchPercentage: analysis.matchPercentage,

    weightedMatchPercentage: analysis.weightedMatchPercentage,

    atsScore: analysis.atsScore,

    resumeScore: analysis.atsScore,

    recommendations,

    roadmap,

    roadmapProgress: roadmap.map((week) => ({
      completedTasks: week.tasks.map(() => false),
    })),

    roadmapDuration: normalizedRoadmapDuration,
  });

  return resume;
}

// ==========================
// Get My Resume Service
// ==========================

export async function getMyResumeService(userId) {
  const resume = await Resume.findOne({
    user: userId,
  }).sort({ createdAt: -1 });

  if (!resume) return null;

  const user = await User.findById(userId).select("roadmapActivityDates");
  const roadmapActivityDates = user?.roadmapActivityDates || [];

  return {
    ...resume.toObject(),
    skillsToLearn: getSkillsToLearn(
      resume.missingSkills,
      resume.learnedSkills,
    ),
    roadmapActivityDates,
    roadmapStreak: getRoadmapStreak(roadmapActivityDates),
  };
}

export async function updateRoadmapTaskService(
  userId,
  weekIndex,
  taskIndex,
  completed,
) {
  if (
    !Number.isInteger(weekIndex) ||
    !Number.isInteger(taskIndex) ||
    typeof completed !== "boolean"
  ) {
    const error = new Error("Roadmap task update is invalid.");
    error.statusCode = 400;
    throw error;
  }

  const resume = await Resume.findOne({ user: userId }).sort({
    createdAt: -1,
  });

  if (!resume) {
    const error = new Error("Resume not found.");
    error.statusCode = 404;
    throw error;
  }

  const week = resume.roadmap[weekIndex];
  if (!week || taskIndex < 0 || taskIndex >= week.tasks.length) {
    const error = new Error("Roadmap task not found.");
    error.statusCode = 404;
    throw error;
  }

  resume.roadmapProgress = resume.roadmap.map((roadmapWeek, index) => {
    const completedTasks =
      resume.roadmapProgress?.[index]?.completedTasks || [];
    return {
      completedTasks: roadmapWeek.tasks.map(
        (_, taskPosition) => Boolean(completedTasks[taskPosition]),
      ),
    };
  });
  resume.roadmapProgress[weekIndex].completedTasks[taskIndex] = completed;
  resume.learnedSkills = getCompletedWeekLearnedSkills(
    resume.missingSkills,
    resume.learnedSkills || [],
    resume.roadmap,
    resume.roadmapProgress,
  );
  await resume.save();

  const user = await User.findById(userId);
  if (!user) {
    const error = new Error("User not found.");
    error.statusCode = 404;
    throw error;
  }

  if (completed) {
    const today = new Date().toISOString().slice(0, 10);
    if (!user.roadmapActivityDates.includes(today)) {
      user.roadmapActivityDates.push(today);
      await user.save();
    }
  }

  const roadmapActivityDates = user.roadmapActivityDates;
  return {
    ...resume.toObject(),
    skillsToLearn: getSkillsToLearn(
      resume.missingSkills,
      resume.learnedSkills,
    ),
    roadmapActivityDates,
    roadmapStreak: getRoadmapStreak(roadmapActivityDates),
  };
}

// ==========================
// Analyze My Resume Service
// ==========================

export async function analyzeMyResumeService(userId, roadmapDuration) {
  // ==========================
  // Get User Resume
  // ==========================

  const resume = await Resume.findOne({
    user: userId,
  }).sort({ createdAt: -1 });

  if (!resume) {
    throw new Error("Resume not found.");
  }

  const normalizedRoadmapDuration = normalizeRoadmapDuration(
    roadmapDuration,
    resume.roadmapDuration || MIN_ROADMAP_DURATION,
  );

  // ==========================
  // Recalculate Skill Analysis
  // ==========================

  const analysis = await compareSkills(
    resume.extractedSkills,
    resume.targetRole,
    resume.extractedText,
  );

  // ==========================
  // Update Matching Skills
  // ==========================

  resume.matchingSkills = analysis.matchingSkills;

  // ==========================
  // Update Missing Skills
  // ==========================

  resume.missingSkills = analysis.missingSkills;
  resume.learnedSkills = (resume.learnedSkills || []).filter((learnedSkill) =>
    analysis.missingSkills.some(
      (missingSkill) =>
        missingSkill.trim().toLowerCase() === learnedSkill.trim().toLowerCase(),
    ),
  );

  // ==========================
  // Update Skill Gaps
  // ==========================

  resume.skillGaps = analysis.skillGaps;

  // ==========================
  // Update Match Percentage
  // ==========================

  resume.matchPercentage = analysis.matchPercentage;

  resume.weightedMatchPercentage = analysis.weightedMatchPercentage;

  // ==========================
  // Update ATS Score
  // ==========================

  resume.atsScore = analysis.atsScore;

  resume.resumeScore = analysis.atsScore;

  resume.roadmapDuration = normalizedRoadmapDuration;

  // ==========================
  // Regenerate Recommendations
  // ==========================

  resume.recommendations = await generateRecommendations({
    targetRole: resume.targetRole,

    extractedSkills: resume.extractedSkills,

    missingSkills: analysis.missingSkills,

    atsScore: analysis.atsScore,

    durationDays: normalizedRoadmapDuration,
  });

  // ==========================
  // Regenerate Learning Roadmap
  // ==========================

  resume.roadmap = await generateRoadmap({
    targetRole: resume.targetRole,

    extractedSkills: resume.extractedSkills,

    missingSkills: getSkillsToLearn(
      analysis.missingSkills,
      resume.learnedSkills,
    ),

    atsScore: analysis.atsScore,

    durationDays: normalizedRoadmapDuration,
  });

  resume.roadmapProgress = resume.roadmap.map((week) => ({
    completedTasks: week.tasks.map(() => false),
  }));

  // ==========================
  // Save Updated Resume Analysis
  // ==========================

  await resume.save();

  return resume;
}

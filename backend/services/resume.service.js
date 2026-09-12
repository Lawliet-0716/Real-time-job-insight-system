import Resume from "../models/Resume.js";

import { extractTextFromPDF } from "../utils/pdfExtractor.js";

import { extractResumeSkills } from "./ai/resumeSkillExtractor.js";

import { detectTargetRole } from "./ai/roleDetector.service.js";

import { generateRecommendations } from "./ai/recommendation.service.js";

import { generateRoadmap } from "./ai/roadmap.service.js";

import { compareSkills } from "./compareSkills.service.js";

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

  const analysis = await compareSkills(extractedSkills, targetRole);

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

    roadmapDuration: normalizedRoadmapDuration,
  });

  return resume;
}

// ==========================
// Get My Resume Service
// ==========================

export async function getMyResumeService(userId) {
  return await Resume.findOne({
    user: userId,
  }).sort({ createdAt: -1 });
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
  });

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
  );

  // ==========================
  // Update Matching Skills
  // ==========================

  resume.matchingSkills = analysis.matchingSkills;

  // ==========================
  // Update Missing Skills
  // ==========================

  resume.missingSkills = analysis.missingSkills;

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

    missingSkills: analysis.missingSkills,

    atsScore: analysis.atsScore,

    durationDays: normalizedRoadmapDuration,
  });

  // ==========================
  // Save Updated Resume Analysis
  // ==========================

  await resume.save();

  return resume;
}

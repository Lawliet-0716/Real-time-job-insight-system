import {
  uploadResumeService,
  getMyResumeService,
  analyzeMyResumeService,
  updateRoadmapTaskService,
} from "../services/resume.service.js";

export async function uploadResume(req, res) {
  try {
    const resume = await uploadResumeService(
      req.user.id,
      req.file,
      req.body?.roadmapDuration,
    );

    res.status(201).json({
      success: true,
      message: "Resume uploaded successfully.",
      data: resume,
    });
  } catch (error) {
    console.error(error);

    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getMyResume(req, res) {
  try {
    const resume = await getMyResumeService(req.user.id);

    res.json({
      success: true,
      data: resume,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function analyzeMyResume(req, res) {
  try {
    const resume = await analyzeMyResumeService(
      req.user.id,
      req.body?.roadmapDuration,
    );

    res.json({
      success: true,
      message: "Resume analyzed successfully.",
      data: resume,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function updateRoadmapTask(req, res) {
  try {
    const { weekIndex, taskIndex, completed } = req.body || {};
    const resume = await updateRoadmapTaskService(
      req.user.id,
      weekIndex,
      taskIndex,
      completed,
    );

    res.json({
      success: true,
      data: resume,
    });
  } catch (error) {
    if (error.statusCode === 500 || !error.statusCode) {
      console.error(error);
    }

    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
}

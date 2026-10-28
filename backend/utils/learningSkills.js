export function getSkillsToLearn(missingSkills = [], learnedSkills = []) {
  const learned = new Set(
    learnedSkills.map((skill) => skill.trim().toLowerCase()),
  );

  return missingSkills.filter((skill) =>
    !learned.has(skill.trim().toLowerCase()),
  );
}

function normalizeTaskText(value) {
  return value.toLowerCase().replace(/[^a-z0-9+#]+/g, " ").trim();
}

function taskMentionsSkill(task, skill) {
  const normalizedTask = ` ${normalizeTaskText(task)} `;
  const normalizedSkill = normalizeTaskText(skill);
  return (
    normalizedSkill.length > 0 &&
    normalizedTask.includes(` ${normalizedSkill} `)
  );
}

export function getCompletedWeekLearnedSkills(
  missingSkills = [],
  learnedSkills = [],
  roadmap = [],
  roadmapProgress = [],
) {
  const skillsInRoadmap = new Set();
  for (const skill of missingSkills) {
    if (
      roadmap.some((week) =>
        week.tasks.some((task) => taskMentionsSkill(task, skill)),
      )
    ) {
      skillsInRoadmap.add(skill.toLowerCase());
    }
  }
  const learned = new Set(
    learnedSkills
      .filter((skill) => !skillsInRoadmap.has(skill.toLowerCase()))
      .map((skill) => skill.toLowerCase()),
  );

  roadmap.forEach((week, weekIndex) => {
    const tasks = week.tasks || [];
    const completedTasks = roadmapProgress[weekIndex]?.completedTasks || [];
    if (
      tasks.length === 0 ||
      !tasks.every((_, taskIndex) => Boolean(completedTasks[taskIndex]))
    ) {
      return;
    }

    missingSkills.forEach((skill) => {
      if (tasks.some((task) => taskMentionsSkill(task, skill))) {
        learned.add(skill.toLowerCase());
      }
    });
  });

  return missingSkills.filter((skill) => learned.has(skill.toLowerCase()));
}

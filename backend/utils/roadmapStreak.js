export function getRoadmapStreak(activityDates, today = new Date()) {
  const activeDates = new Set(activityDates || []);
  const todayDate = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()),
  );
  const todayKey = todayDate.toISOString().slice(0, 10);
  const yesterday = new Date(todayDate);
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  const startDate = activeDates.has(todayKey) ? todayDate : yesterday;

  if (!activeDates.has(startDate.toISOString().slice(0, 10))) {
    return 0;
  }

  let streak = 0;
  while (activeDates.has(startDate.toISOString().slice(0, 10))) {
    streak += 1;
    startDate.setUTCDate(startDate.getUTCDate() - 1);
  }

  return streak;
}

import { AppAchievementsCounters } from "../models";

export function updateProgressCache(appId: number, counters: AppAchievementsCounters) {
  if (!appAchievementProgressCache.m_achievementProgress?.mapCache?.has(appId)) {
    return;
  }

  const progress = appAchievementProgressCache.m_achievementProgress?.mapCache?.get(appId);

  if (progress) {
    const total = progress.total - counters.iAchieved - counters.iUnachieved;
    const unlocked = progress.unlocked - counters.iAchieved;

    appAchievementProgressCache.m_achievementProgress.mapCache.set(`f${appId}`, {
      ...progress,
      all_unlocked: total === unlocked,
      percentage: (unlocked / total) * 100,
      total,
      unlocked,
    });
  }
}

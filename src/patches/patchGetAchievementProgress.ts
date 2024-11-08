import { afterPatch } from "@decky/ui";

export default function patchGetAchievementProgress() {
  return afterPatch(
    appAchievementProgressCache.__proto__,
    "GetAchievementProgress",
    ([appId]: Array<number>, ret: number) => {
      if (appAchievementProgressCache.m_achievementProgress?.mapCache?.has(`f${appId}`)) {
        const progress = appAchievementProgressCache.m_achievementProgress.mapCache.get(`f${appId}`);

        if (progress) {
          return progress.percentage;
        }
      }

      return ret;
    },
  );
}

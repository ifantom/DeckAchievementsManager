import { AchievementsCacheData, EMPTY_ACHIEVEMENTS_COUNTERS, SteamAppAchievement } from "../models";
import { Achievements } from "../modules/achievements";
import { updateProgressCache } from "./updateProgressCache";

export function updateAchievementsCache(appId: number, ignored: Set<SteamAppAchievement["strID"]>) {
  if (!Achievements.m_mapMyAchievements.has(appId)) {
    return;
  }

  const allAchievements: AchievementsCacheData | undefined = Achievements.m_mapMyAchievements.get(appId)?.data;

  if (!allAchievements) {
    return;
  }
  const counters = {...EMPTY_ACHIEVEMENTS_COUNTERS};
  const filteredAchievements: AchievementsCacheData = {
    achieved: { ...allAchievements.achieved },
    unachieved: { ...allAchievements.unachieved, ...allAchievements.hidden },
    hidden: {},
  };
  const ignoredAchievements: AchievementsCacheData = { achieved: {}, hidden: {}, unachieved: {} };

  ignored.forEach((id): boolean | void => {
    if (filteredAchievements.achieved[id]) {
      counters.iAchieved++;
      ignoredAchievements.achieved[id] = filteredAchievements.achieved[id];
      return delete filteredAchievements.achieved[id];
    }

    if (filteredAchievements.unachieved[id]) {
      counters.iUnachieved++;
      ignoredAchievements.unachieved[id] = filteredAchievements.unachieved[id];
      return delete filteredAchievements.unachieved[id];
    }
  });

  Achievements.m_mapMyAchievements.set(`f${appId}`, { data: filteredAchievements });
  Achievements.m_mapMyAchievements.set(`i${appId}`, { data: ignoredAchievements });

  updateProgressCache(appId, counters);
}

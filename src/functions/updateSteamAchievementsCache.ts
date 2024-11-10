import { SteamAchievementsCacheData, AppAchievementsCounters, SteamAchievement } from "../models";
import { Achievements } from "../modules/achievements";

export function updateSteamAchievementsCache(
  appId: number,
  ignored: Set<SteamAchievement["strID"]>,
): AppAchievementsCounters | undefined {
  if (!Achievements.m_mapMyAchievements.has(appId)) return;

  const allAchievements: SteamAchievementsCacheData | undefined = Achievements.m_mapMyAchievements.get(appId)?.data;
  if (!allAchievements) return;

  const filteredAchievements: SteamAchievementsCacheData = {
    achieved: { ...allAchievements.achieved },
    unachieved: { ...allAchievements.unachieved, ...allAchievements.hidden },
    hidden: {},
  };
  const ignoredAchievements: SteamAchievementsCacheData = { achieved: {}, hidden: {}, unachieved: {} };

  ignored.forEach((id): boolean | void => {
    if (filteredAchievements.achieved[id]) {
      ignoredAchievements.achieved[id] = filteredAchievements.achieved[id];
      return delete filteredAchievements.achieved[id];
    }

    if (filteredAchievements.unachieved[id]) {
      ignoredAchievements.unachieved[id] = filteredAchievements.unachieved[id];
      return delete filteredAchievements.unachieved[id];
    }
  });

  Achievements.m_mapMyAchievements.set(`f${appId}`, { data: filteredAchievements });
  Achievements.m_mapMyAchievements.set(`i${appId}`, { data: ignoredAchievements });

  return {
    achieved: Object.keys(filteredAchievements.achieved).length,
    total: Object.keys(filteredAchievements.achieved).length + Object.keys(filteredAchievements.unachieved).length,
  };
}

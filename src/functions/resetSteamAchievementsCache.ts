import { Achievements } from "../modules/achievements";

export function resetSteamAchievementsCache(): void {
  Achievements.m_mapMyAchievements.forEach((_, key) => {
    if (/([fi])\d/.exec(`${key}`)) {
      Achievements.m_mapMyAchievements.delete(key);
      Achievements.m_mapMyAchievements.delete(key);
    }
  });
}
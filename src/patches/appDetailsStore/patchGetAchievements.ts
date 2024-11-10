import { afterPatch } from "@decky/ui";
import { SteamAppAchievements } from "../../models";
import { Achievements } from "../../modules/achievements";

export default function patchGetAchievements() {
  return afterPatch(appDetailsStore.__proto__, "GetAchievements", ([appId]: number[], result: SteamAppAchievements) => {
    if (Achievements.m_mapMyAchievements.has(`f${appId}`)) {
      const data = Achievements.m_mapMyAchievements.get(`f${appId}`)?.data;

      if (data) {
        const achieved = Object.values(data.achieved);
        const unachieved = Object.values(data.unachieved);

        return {
          nAchieved: achieved.length,
          nTotal: achieved.length + unachieved.length,
          vecAchievedHidden: [],
          vecHighlight: achieved.sort((a, b) => a.flAchieved - b.flAchieved).slice(0, 12),
          vecUnachieved: unachieved
            .filter((achievement) => !achievement.bHidden)
            .sort((a, b) => b.flAchieved - a.flAchieved)
            .slice(0, 12),
        };
      }
    }

    return result;
  });
}
